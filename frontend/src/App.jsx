import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [reportType, setReportType] = useState("");
  const [fileName, setFileName] = useState("");


  const handleGenerate = () => {
    alert("Generating AI Report...");
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

        {/* File Upload */}
        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            accept=".csv, .txt, .docx"
            onChange={(e) => setFileName(e.target.files[0]?.name || "")}
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
            <option value="Executive Summary">Executive Summary</option>
            <option value="Key Insights">Key Insights</option>
            <option value="Recommendations">Recommendations</option>
          </select>
        </div>

        {/* Generate Report */}
        <div className="text-center">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md" onClick={handleGenerate} >
            Generate Report
          </button>
        </div>

        <div className="border-b border-gray-300"></div>

        {/* Preview */}
        <div className="mt-6">
          <h4 className="text-center text-lg font-semibold text-gray-700 mb-4">
            AI-Generate Report Preview
          </h4>

          <div className="space-y-4 text-gray-700 text-sm">
            <p><strong>Report Title:</strong></p>

            <div>
              <strong>Summary:</strong>
              <p>
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
              </p>
            </div>

            <div>
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleDownload}>
            <i className="fas fa-file-pdf"></i> Download PDF
          </button>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleCopy}>
            <i className="fas fa-copy"></i> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
