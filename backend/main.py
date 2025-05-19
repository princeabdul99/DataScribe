from io import BytesIO
from fastapi.responses import JSONResponse
import uvicorn
import os, requests
import boto3
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from docx import Document
from datetime import datetime
import csv



load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


app = FastAPI() 

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --- AWS S3 setup ----------
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)
BUCKET = os.getenv("AWS_BUCKET_NAME")

# --- File Upload Helpers
def upload_to_s3(file: UploadFile, folder: str = "uploads") -> str:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    key = f"{folder}/{timestamp}_{file.filename}"
    s3.upload_fileobj(file.file, BUCKET, key)
    return key

def save_text_to_s3(content: str, report_type: str, folder: str = "reports") -> str:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    key = f"{folder}/{report_type}_{timestamp}.txt"
    s3.put_object(Bucket=BUCKET, Key=key, Body=content.encode("utf-8"))
    return key


# --- File Parsing Logic ----------
def extract_text(file: UploadFile) -> str:
    try:
        file.file.seek(0)
        # txt file upload
        if file.filename.endswith(".txt"):
            return file.file.read().decode("utf-8")
        #docx file upload
        elif file.filename.endswith(".docx"):
            doc = Document(file.file)
            return "\n".join(p.text for p in doc.paragraphs)
        #csv file upload
        elif file.filename.endswith(".csv"):
            lines = file.file.read().decode("utf-8").splitlines()
            return "\n".join(lines)
        
        else:
            return "Unsupported file type."  
    except Exception as e:
        return f"Error reading file: {str(e)}"


    


# --------- MAIN ROUTE  -------------
@app.post("/generate")
async def generate_text(
    file: UploadFile = File(...),
    report_type: str = Form(...),
    instructions: str = Form("")
    ):

    # Read file content once
    file_bytes = await file.read()
    file_stream = BytesIO(file_bytes)


    # Upload original file to s3
    file.file = BytesIO(file_bytes) # Reset Uploaded File for s3
    uploaded_file_key = upload_to_s3(file)

    # Use a fresh BytesIO stream for text extraction
    file.file = BytesIO(file_bytes)
    file_content = extract_text(file)
    
    if file_content == "Unsupported file type.":
        return JSONResponse(status_code=400, content={"error": "Unsupported file type."})

    prompt = (
        f"You are a business analyst AI. The user uploaded the following data file. "
        f"Generate a '{report_type.replace('_', ' ')}' based on it.\n\n"
        f"User Instructions: {instructions}\n\n"
        f"Data Content:\n{file_content[:2000]}"
    )


    headers = {
         "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
         "model":"mistralai/mistral-7b-instruct",
           "messages" : [
                {"role": "system", "content": "You are a helpful report assistant."},
                {"role": "user", "content": prompt}
           ]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )
        data = response.json()

        response_text = data["choices"][0]["message"]["content"]

        # Save prompt and response to s3
        result_key = save_text_to_s3(
            content=f"Prompt:\n{prompt}\n\nResponse:\n{response_text}",
            report_type=report_type
        )

        return {
            "response": response_text,
            "report_saved_to": result_key,
        }
    except Exception as e:
        return {"error": str(e)}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)