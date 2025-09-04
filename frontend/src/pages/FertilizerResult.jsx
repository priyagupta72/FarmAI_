// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import { FaLeaf, FaSeedling, FaFlask, FaCheckCircle } from "react-icons/fa";

// const FertilizerResult = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formData, recommendation } = location.state || {};

//   if (!formData || !recommendation) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//         <p className="text-red-600 font-semibold text-lg">⚠️ No data found.</p>
//         <button
//           onClick={() => navigate("/fertilizer")}
//           className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   // Clean stars / dashes
//   const cleanRecommendation = recommendation
//     .replace(/[*-]+/g, "")
//     .split("\n")
//     .map((line) => line.trim())
//     .filter((line) => line.length > 0);

//   const handleDownload = () => {
//     const doc = new jsPDF("p", "pt", "a4");
//     let y = 40;
//     doc.setFontSize(18);
//     doc.text("Fertilizer Recommendation Report", 40, y);
//     y += 30;

//     doc.setFontSize(14);
//     doc.text("Input Summary:", 40, y);
//     y += 20;
//     Object.entries(formData).forEach(([key, value]) => {
//       doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 50, y);
//       y += 20;
//     });

//     y += 10;
//     doc.text("Recommendation:", 40, y);
//     y += 20;
//     cleanRecommendation.forEach((item) => {
//       doc.text(`- ${item}`, 50, y);
//       y += 20;
//     });

//     doc.save("Fertilizer_Recommendation.pdf");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
//       <h1 className="text-4xl font-bold mb-8 text-green-700 text-center">
//         Fertilizer Recommendation
//       </h1>

//       {/* Compact Input Summary Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-8">
//         <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
//           <FaLeaf className="text-green-600 text-3xl mb-2" />
//           <span className="text-gray-700 font-semibold">Nitrogen</span>
//           <span className="text-gray-900 text-lg">{formData.nitrogen}</span>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
//           <FaSeedling className="text-green-600 text-3xl mb-2" />
//           <span className="text-gray-700 font-semibold">Phosphorous</span>
//           <span className="text-gray-900 text-lg">{formData.phosphorous}</span>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
//           <FaLeaf className="text-green-600 text-3xl mb-2" />
//           <span className="text-gray-700 font-semibold">Potassium</span>
//           <span className="text-gray-900 text-lg">{formData.pottasium}</span>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
//           <FaFlask className="text-green-600 text-3xl mb-2" />
//           <span className="text-gray-700 font-semibold">Crop</span>
//           <span className="text-gray-900 text-lg">{formData.cropname}</span>
//         </div>
//       </div>

//       {/* Recommendation Card */}
//       <div className="bg-green-50 rounded-2xl shadow-lg p-6 w-full max-w-4xl">
//         <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
//           <FaCheckCircle /> Recommendation
//         </h2>
//         <ul className="list-disc pl-6 text-gray-800 space-y-2">
//           {cleanRecommendation.map((item, idx) => (
//             <li key={idx}>{item}</li>
//           ))}
//         </ul>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-6 mt-10">
//         <button
//           onClick={() => navigate("/fertilizer")}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
//         >
//           Predict Another
//         </button>
//         <button
//           onClick={handleDownload}
//           className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FertilizerResult;






// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import { FaLeaf, FaSeedling, FaFlask, FaCheckCircle } from "react-icons/fa";

// const FertilizerResult = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formData, recommendation } = location.state || {};

//   if (!formData || !recommendation) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//         <p className="text-red-600 font-semibold text-lg">⚠️ No data found.</p>
//         <button
//           onClick={() => navigate("/fertilizer")}
//           className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const cleanRecommendation = recommendation
//     .replace(/[*-]+/g, "")
//     .split("\n")
//     .map((line) => line.trim())
//     .filter((line) => line.length > 0);

//   const handleDownload = () => {
//     const doc = new jsPDF("p", "pt", "a4");
//     let y = 40;
//     doc.setFontSize(18);
//     doc.text("Fertilizer Recommendation Report", 40, y);
//     y += 30;

//     doc.setFontSize(14);
//     doc.text("Input Summary:", 40, y);
//     y += 20;
//     Object.entries(formData).forEach(([key, value]) => {
//       doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 50, y);
//       y += 20;
//     });

//     y += 10;
//     doc.text("Recommendation:", 40, y);
//     y += 20;
//     cleanRecommendation.forEach((item) => {
//       doc.text(`- ${item}`, 50, y);
//       y += 20;
//     });

//     doc.save("Fertilizer_Recommendation.pdf");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
//       <h1 className="text-4xl font-bold mb-10 text-green-700 text-center">
//         Fertilizer Recommendation
//       </h1>

//       {/* Two-column layout */}
//       <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
//         {/* Left: Input Summary */}
//         <div className="flex-1 grid grid-cols-2 gap-6">
//           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
//             <FaLeaf className="text-green-600 text-3xl mb-2" />
//             <span className="text-gray-700 font-semibold">Nitrogen</span>
//             <span className="text-gray-900 text-lg">{formData.nitrogen}</span>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
//             <FaSeedling className="text-green-600 text-3xl mb-2" />
//             <span className="text-gray-700 font-semibold">Phosphorous</span>
//             <span className="text-gray-900 text-lg">{formData.phosphorous}</span>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
//             <FaLeaf className="text-green-600 text-3xl mb-2" />
//             <span className="text-gray-700 font-semibold">Potassium</span>
//             <span className="text-gray-900 text-lg">{formData.pottasium}</span>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
//             <FaFlask className="text-green-600 text-3xl mb-2" />
//             <span className="text-gray-700 font-semibold">Crop</span>
//             <span className="text-gray-900 text-lg">{formData.cropname}</span>
//           </div>
//         </div>

//         {/* Right: Recommendation */}
//         <div className="flex-1 bg-green-50 rounded-2xl shadow-lg p-6 hover:scale-105 transition">
//           <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
//             <FaCheckCircle /> Recommendation
//           </h2>
//           <ul className="list-disc pl-6 text-gray-800 space-y-2">
//             {cleanRecommendation.map((item, idx) => (
//               <li key={idx}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-6 mt-10">
//         <button
//           onClick={() => navigate("/fertilizer")}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
//         >
//           Predict Another
//         </button>
//         <button
//           onClick={handleDownload}
//           className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FertilizerResult;






import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaLeaf, FaSeedling, FaFlask, FaCheckCircle, FaRedo, FaFilePdf } from "react-icons/fa";
import { useEffect, useState } from "react";

const FertilizerResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({ formData: null, recommendation: "" });

  useEffect(() => {
    // Priority: location.state > localStorage
    if (location.state?.formData && location.state?.recommendation) {
      setData(location.state);
    } else {
      const saved = localStorage.getItem("fertilizerData");
      if (saved) setData(JSON.parse(saved));
    }
  }, [location.state]);

  const { formData, recommendation } = data;

  if (!formData || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-600 font-semibold text-lg">⚠️ No data found.</p>
        <button
          onClick={() => navigate("/fertilizer")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaRedo /> Go Back
        </button>
      </div>
    );
  }

  // ===== Parse AI response =====
  const parseRecommendation = (text) => {
    const data = { name: "", dosage: "", instructions: "" };
    const lines = text.includes("\n") ? text.split("\n") : text.split(". ");
    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.includes("fertilizer:")) data.name = line.split(":")[1]?.trim() || line.trim();
      else if (lower.includes("dosage:")) data.dosage = line.split(":")[1]?.trim() || line.trim();
      else if (lower.includes("instructions:")) data.instructions = line.split(":")[1]?.trim() || line.trim();
    });
    return data;
  };

  const parsed = parseRecommendation(recommendation);

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    let y = 40;

    doc.setFontSize(18);
    doc.text("Fertilizer Recommendation Report", 40, y);
    y += 30;

    doc.setFontSize(14);
    doc.text("Input Summary:", 40, y);
    y += 20;
    Object.entries(formData).forEach(([key, value]) => {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 50, y);
      y += 20;
    });

    y += 10;
    doc.text("Recommendation:", 40, y);
    y += 20;
    if (parsed.name) { doc.text(`Fertilizer: ${parsed.name}`, 50, y); y += 20; }
    if (parsed.dosage) { doc.text(`Dosage: ${parsed.dosage}`, 50, y); y += 20; }
    if (parsed.instructions) { doc.text(`Instructions: ${parsed.instructions}`, 50, y); }

    doc.save("Fertilizer_Recommendation.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-green-700 text-center">
        Fertilizer Recommendation
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Input Summary */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition">
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
            <FaFlask className="text-green-600 text-3xl mb-2" />
            <span className="text-gray-700 font-semibold">Crop</span>
            <span className="text-gray-900 text-lg">{formData.cropname}</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex-1 bg-green-50 rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
            <FaCheckCircle /> Recommendation
          </h2>
          {parsed.name && <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col"><span className="font-semibold">Fertilizer</span><span>{parsed.name}</span></div>}
          {parsed.dosage && <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col"><span className="font-semibold">Dosage</span><span>{parsed.dosage}</span></div>}
          {parsed.instructions && <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col"><span className="font-semibold">Instructions</span><span>{parsed.instructions}</span></div>}
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        <button
          onClick={() => navigate("/fertilizer")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition flex items-center gap-2"
        >
          <FaRedo /> Predict Another
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

export default FertilizerResult;
