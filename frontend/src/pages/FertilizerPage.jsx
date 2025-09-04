
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion"; // ✅ for animations

// const FertilizerPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     nitrogen: "",
//     phosphorous: "",
//     pottasium: "",
//     cropname: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//   const BACKEND_URL = "https://farmai-backend.onrender.com"; 
//   const response = await axios.post(`${BACKEND_URL}/api/fertilizer`, formData);

//   const recommendation = response.data.recommendation;
//   navigate("/fertilizer-result", { state: { recommendation, formData } });
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
//       <motion.form
//         onSubmit={handleSubmit}
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-green-100"
//       >
//         {/* Heading */}
//         <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-center text-green-700 break-words">
//           Fertilizer Recommendation
//         </h1>

//         {/* Inputs */}
//         <div className="space-y-4">
//           {[
//             { name: "nitrogen", placeholder: "Nitrogen (N)", type: "number" },
//             { name: "phosphorous", placeholder: "Phosphorous (P)", type: "number" },
//             { name: "pottasium", placeholder: "Potassium (K)", type: "number" },
//             { name: "cropname", placeholder: "Crop Name", type: "text" },
//           ].map((input) => (
//             <input
//               key={input.name}
//               type={input.type}
//               name={input.name}
//               placeholder={input.placeholder}
//               value={formData[input.name]}
//               onChange={handleChange}
//               required
//               className="p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
//             />
//           ))}
//         </div>

//         {/* Button */}
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="submit"
//           className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200"
//         >
//           {loading ? "🌿 Analyzing..." : "⚡Recommend"}
//         </motion.button>
//       </motion.form>
//     </div>
//   );
// };

// export default FertilizerPage;







import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaLeaf, FaSeedling, FaFlask, FaCheckCircle } from "react-icons/fa";

const FertilizerResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, recommendation } = location.state || {};

  if (!formData || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-600 font-semibold text-lg">⚠️ No data found.</p>
        <button
          onClick={() => navigate("/fertilizer")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ===== Clean parser for AI recommendation =====
  const parseRecommendation = (text) => {
    const data = { name: "", dosage: "", instructions: "" };

    // Remove asterisks and extra whitespace
    const cleanText = text.replace(/\*/g, "").trim();

    // Split by new line and process
    const lines = cleanText.split("\n").map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
      const [key, ...rest] = line.split(":");
      if (!key || !rest) return;
      const value = rest.join(":").trim();

      const lowerKey = key.toLowerCase();
      if (lowerKey.includes("fertilizer")) data.name = value;
      else if (lowerKey.includes("dosage")) data.dosage = value;
      else if (lowerKey.includes("instructions")) data.instructions = value;
    });

    return data;
  };

  const parsed = parseRecommendation(recommendation);

  // ===== PDF Download =====
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
        {/* Left: Input Summary */}
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

        {/* Right: Recommendation */}
        <div className="flex-1 bg-green-50 rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
            <FaCheckCircle /> Recommendation
          </h2>
          {parsed.name && (
            <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col">
              <span className="font-semibold">Fertilizer</span>
              <span>{parsed.name}</span>
            </div>
          )}
          {parsed.dosage && (
            <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col">
              <span className="font-semibold">Dosage</span>
              <span>{parsed.dosage}</span>
            </div>
          )}
          {parsed.instructions && (
            <div className="mb-3 p-4 bg-white rounded-lg shadow flex flex-col">
              <span className="font-semibold">Instructions</span>
              <span>{parsed.instructions}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        <button
          onClick={() => navigate("/fertilizer")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
        >
          Predict Another
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

export default FertilizerResult;
