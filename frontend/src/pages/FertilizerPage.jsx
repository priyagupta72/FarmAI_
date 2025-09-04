
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

  const BACKEND_URL = "https://farmai-h4bm.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nitrogen, phosphorous, pottasium, cropname } = formData;

    // ===== Frontend Validation =====
    if (!nitrogen || !phosphorous || !pottasium || !cropname.trim()) {
      alert("⚠️ Please fill all fields");
      return;
    }

    if (
      nitrogen < 0 || nitrogen > 100 ||
      phosphorous < 0 || phosphorous > 100 ||
      pottasium < 0 || pottasium > 100
    ) {
      alert("⚠️ N, P, K values must be between 0 and 100");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nitrogen: Number(nitrogen),
        phosphorous: Number(phosphorous),
        pottasium: Number(pottasium),
        cropname: cropname.trim(),
      };

      const res = await fetch(`${BACKEND_URL}/api/fertilizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.recommendation) {
        alert("⚠️ No recommendation returned from server");
        setLoading(false);
        return;
      }

      // Save in localStorage as fallback
      localStorage.setItem(
        "fertilizerData",
        JSON.stringify({ formData: payload, recommendation: data.recommendation })
      );

      // Navigate to result page
      navigate("/fertilizer-result", {
        state: { formData: payload, recommendation: data.recommendation },
      });
    } catch (error) {
      console.error(error);
      alert("⚠️ Error fetching recommendation. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Fertilizer Prediction</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
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

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 md:col-span-2 w-full py-3 rounded-2xl font-semibold text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } transition`}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
    </div>
  );
};

export default FertilizerPage;
