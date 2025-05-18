import uvicorn
import requests
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv



load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


app = FastAPI() 

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class PromptRequest(BaseModel):
    prompt: str


@app.post("/generate")
async def generate_text(request: PromptRequest):

    headers = {
         "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
         "model":"mistralai/mistral-7b-instruct",
           "messages" : [
                {"role": "system", "content": "You are a helpful report assistant."},
                {"role": "user", "content": request.prompt}
           ]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )
        data = response.json()
        return {
            "response": data["choices"][0]["message"]["content"]
        }
    except Exception as e:
        return {"error": str(e)}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)