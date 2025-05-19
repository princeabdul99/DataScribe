import React from "react";



const GeneratedReport = ({ responseData }) => {
  // Example prop: responseData = JSON object with `response` and `report_saved_to`

  const formattedText = responseData
    .split('\n\n') // split into paragraphs
    .map((para, idx) => {
      // If it's a bullet list section, split and render as list
      if (para.includes('\n- ')) {
        const [heading, ...items] = para.split('\n');
        return (
          <div key={idx} className="mb-4">
            <strong>{heading}</strong>
            <ul className="list-disc list-inside ml-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          </div>
        );
      }

      return <p key={idx} className="mb-3">{para.trim()}</p>;
    });

  return (
    <div className="p-4 bg-white rounded shadow text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Generated Report</h2>
      {formattedText}
      {/* <p className="mt-4 text-sm text-gray-500">
        Report saved to: <code>{responseData.report_saved_to}</code>
      </p> */}
    </div>
  );
};

export default GeneratedReport;