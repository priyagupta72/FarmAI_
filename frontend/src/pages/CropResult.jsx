// import { useLocation, useNavigate } from "react-router-dom";

// const CropResult = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { prediction, formData } = location.state || {};

//   if (!prediction || !formData) {
//     return (
//       <div className="result-container">
//         <p>⚠️ No data found.</p>
//         <button onClick={() => navigate("/crop")}>Go to Crop Page</button>
//       </div>
//     );
//   }

//   // Split prediction into lines for structured display
//   const lines = prediction.split("\n").filter(line => line.trim() !== "");
//   const cropSuggestions = [];
//   const otherDetails = [];

//   let inCropsSection = true;
//   lines.forEach(line => {
//     if (line.toLowerCase().includes("important considerations") ||
//         line.toLowerCase().includes("nutrient management") ||
//         line.toLowerCase().includes("water management")) {
//       inCropsSection = false;
//     }

//     if (inCropsSection) cropSuggestions.push(line);
//     else otherDetails.push(line);
//   });

//   return (
//     <div className="result-page">
//       <div className="result-card">
//         <h1 className="result-title">Crop Recommendation Report</h1>

//         {/* Soil / Input Section */}
//         <div className="section">
//           <h2>Soil & Input Summary</h2>
//           <ul>
//             <li><strong>Nitrogen:</strong> {formData.nitrogen}</li>
//             <li><strong>Phosphorous:</strong> {formData.phosphorous}</li>
//             <li><strong>Pottasium:</strong> {formData.pottasium}</li>
//             <li><strong>pH Level:</strong> {formData.ph}</li>
//             <li><strong>Rainfall:</strong> {formData.rainfall} mm</li>
//           </ul>
//         </div>

//         {/* Recommended Crops */}
//         <div className="section recommended">
//           <h2>Recommended Crops</h2>
//           <ul>
//             {cropSuggestions.map((line, index) => (
//               <li key={index}>{line}</li>
//             ))}
//           </ul>
//         </div>

//         {/* Important Considerations */}
//         <div className="section">
//           <h2>Important Considerations</h2>
//           {otherDetails.map((line, index) => (
//             <p key={index}>{line}</p>
//           ))}
//         </div>

//         {/* Action Button */}
//         <div className="button-container">
//           <button onClick={() => navigate("/crop")}>Predict Another Crop</button>
//         </div>
//       </div>

//       {/* CSS Styling */}
//       <style>{`
//         .result-page {
//           font-family: 'Poppins', sans-serif;
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           background: #f0f4f8;
//           padding: 2rem;
//         }
//         .result-card {
//           background: #fff;
//           border-radius: 15px;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           padding: 2rem;
//           max-width: 800px;
//           width: 100%;
//         }
//         .result-title {
//           text-align: center;
//           color: #4a6bff;
//           font-size: 2rem;
//           margin-bottom: 2rem;
//         }
//         .section {
//           margin-bottom: 2rem;
//           padding: 1rem 1.5rem;
//           border-left: 5px solid #4a6bff;
//           background: #f9faff;
//           border-radius: 10px;
//         }
//         .section h2 {
//           margin-bottom: 0.8rem;
//           color: #333;
//           font-size: 1.4rem;
//         }
//         .section ul {
//           list-style-type: disc;
//           padding-left: 1.5rem;
//           color: #555;
//         }
//         .section p {
//           color: #555;
//           line-height: 1.5;
//         }
//         .recommended {
//           border-left-color: #27ae60;
//           background: #e8f8f5;
//         }
//         .button-container {
//           text-align: center;
//         }
//         .button-container button {
//           background: #4a6bff;
//           color: white;
//           padding: 0.7rem 2rem;
//           border-radius: 20px;
//           border: none;
//           font-weight: bold;
//           cursor: pointer;
//           transition: background 0.3s ease;
//         }
//         .button-container button:hover {
//           background: #3753d1;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CropResult;







import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaLeaf, FaTint, FaSeedling, FaWater } from "react-icons/fa";

const CropResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction, formData } = location.state || {};

  if (!prediction || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-600 font-semibold text-lg">⚠️ No data found.</p>
        <button
          onClick={() => navigate("/crop")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Clean prediction to remove unwanted stars
  const cleanPrediction = prediction
    .replace(/[*-]+/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    let y = 40;
    doc.setFontSize(18);
    doc.text("Crop Recommendation Report", 40, y);
    y += 30;

    doc.setFontSize(14);
    doc.text("Soil & Input Summary:", 40, y);
    y += 20;
    Object.entries(formData).forEach(([key, value]) => {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 50, y);
      y += 20;
    });

    y += 10;
    doc.text("Recommended Crops:", 40, y);
    y += 20;
    cleanPrediction.forEach((item) => {
      doc.text(`- ${item}`, 50, y);
      y += 20;
    });

    doc.save("Crop_Recommendation.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-green-700 text-center">
        Crop Recommendation
      </h1>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Left: Input Summary */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col items-center hover:scale-105 transition">
            <FaLeaf className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Nitrogen</span>
            <span className="text-gray-900 text-lg">{formData.nitrogen}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
            <FaSeedling className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Phosphorous</span>
            <span className="text-gray-900 text-lg">{formData.phosphorous}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
            <FaLeaf className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Potassium</span>
            <span className="text-gray-900 text-lg">{formData.pottasium}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
            <FaWater className="text-blue-500 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Rainfall (mm)</span>
            <span className="text-gray-900 text-lg">{formData.rainfall}</span>
          </div>
        </div>

        {/* Right: Recommended Crops */}
        <div className="flex-1 bg-green-50 rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">
            Recommended Crops
          </h2>
          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            {cleanPrediction.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={() => navigate("/crop")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
        >
          Predict Another Crop
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CropResult;
