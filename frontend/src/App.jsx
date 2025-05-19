import { useState } from 'react'
import './App.css'
import axios from 'axios';
import GeneratedReport from '../components/report';

function App() {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  //const fileInputRef = useRef();

  const reportOptions = [
    { value: "summary", label: "Executive Summary" },
    { value: "insights", label: "Key Insights" },
    { value: "recommendation", label: "Recommendation" },
  ];


  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("report_type", reportType);
    formData.append("instructions", prompt);


    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:8000/generate", formData, {
          headers: {"Content-Type": "multipart/form-data"}
        },
      );

      if (res.status !== 200) {
      throw new Error("Server error");
    }

    setResponse(res.data.response || res.data.error);


    } catch (error) {
      setResponse("Something went wrong.");
      console.error(error);
    } 
    setLoading(false);
    setPrompt("");
    setFile(null);
    setReportType("")
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = null; // visually reset file input
    // }

  };

  const handleDownload = () => {
    alert("Downloading PDF...");
  };

  const handleCopy = () => {
    alert("Copied to clipboard!");
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-center text-xl font-bold pb-2">DATASCRIBE</h2>

        <h3 className="text-center text-lg font-semibold text-gray-700">
          Upload Data to <span className="italic">Generate AI-Powered Report</span>
        </h3>

         <form onSubmit={handleGenerate} className="space-y-4">
        {/* File Upload */}
        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            accept=".csv, .txt, .docx"
            //ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-4 py-2 rounded-md text-sm"
          />
          <span className="text-xs text-gray-500">(CSV, TXT, DOCX)</span>
        </div>

        {/* Dropdown */}
        <div className="flex justify-center">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
          >
            <option value="">Select Report Type</option>
            {reportOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          </select>
        </div>


        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your business report prompt..."
        />

        {/* Generate Report */}
        <div className="text-center">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"} 
          </button>
        </div>
        </form>
        {response && (
          <div>
            <div className="border-b border-gray-300"></div>

            {/* Preview */}
            <div className="mt-6">
              <h4 className="text-center text-lg font-semibold text-gray-700 mb-4">
                AI-Generate Report Preview
              </h4>

              {response && (
                <div className="space-y-4 text-gray-700 text-sm">
                {/* <p><strong>Report Title:</strong></p> */}

                <div>
                  <GeneratedReport responseData={response} />
                  
                </div>

                {/* <div>
                  <strong>Insights:</strong>
                  <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                    sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  </p>
                </div>

                <div>
                  <strong>Conclusion:</strong>
                  <p>
                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                    sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
                  </p>
                </div> */}
              </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleDownload} disabled >
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleCopy} disabled>
                <i className="fas fa-copy"></i> Copy to Clipboard
              </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App
