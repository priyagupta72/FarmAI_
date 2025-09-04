
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaLeaf, FaSeedling, FaTint, FaWater, FaFilePdf, FaRedo } from "react-icons/fa";

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
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaRedo /> Go Back
        </button>
      </div>
    );
  }

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

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Input Summary */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col items-center hover:scale-105 transition">
            <FaLeaf className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Nitrogen</span>
            <span className="text-gray-900 text-lg">{formData.nitrogen}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col items-center hover:scale-105 transition">
            <FaSeedling className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Phosphorous</span>
            <span className="text-gray-900 text-lg">{formData.phosphorous}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col items-center hover:scale-105 transition">
            <FaLeaf className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Potassium</span>
            <span className="text-gray-900 text-lg">{formData.pottasium}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col items-center hover:scale-105 transition">
            <FaWater className="text-blue-500 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Rainfall (mm)</span>
            <span className="text-gray-900 text-lg">{formData.rainfall}</span>
          </div>
        </div>

        {/* Recommended Crops */}
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
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition flex items-center gap-2"
        >
          <FaRedo /> Predict Another Crop
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition flex items-center gap-2"
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default CropResult;
