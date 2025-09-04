
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







import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FertilizerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    pottasium: "",
    cropname: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { nitrogen, phosphorous, pottasium, cropname } = formData;
    if (!nitrogen || !phosphorous || !pottasium || !cropname) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const res = await fetch("/api/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.recommendation) {
        alert("No recommendation returned from server");
        setLoading(false);
        return;
      }

      // Save in localStorage for direct access fallback
      localStorage.setItem(
        "fertilizerData",
        JSON.stringify({ formData, recommendation: data.recommendation })
      );

      // Navigate to result page with state
      navigate("/fertilizer-result", {
        state: { formData, recommendation: data.recommendation },
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching recommendation");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Fertilizer Prediction
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <input
          type="number"
          name="nitrogen"
          placeholder="Nitrogen (N)"
          value={formData.nitrogen}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="phosphorous"
          placeholder="Phosphorous (P)"
          value={formData.phosphorous}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="pottasium"
          placeholder="Potassium (K)"
          value={formData.pottasium}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="cropname"
          placeholder="Crop Name"
          value={formData.cropname}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-8 w-40 py-2 rounded-2xl font-semibold text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        } transition`}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>
    </div>
  );
};

export default FertilizerPage;
