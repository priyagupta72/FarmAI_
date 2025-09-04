
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
import axios from "axios";
import { motion } from "framer-motion";
import { FaLeaf, FaSeedling, FaFlask } from "react-icons/fa";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { nitrogen, phosphorous, pottasium, cropname } = formData;

    // ===== Frontend validation =====
    if (
      nitrogen === "" ||
      phosphorous === "" ||
      pottasium === "" ||
      cropname.trim() === "" ||
      nitrogen < 0 ||
      nitrogen > 100 ||
      phosphorous < 0 ||
      phosphorous > 100 ||
      pottasium < 0 ||
      pottasium > 100
    ) {
      alert("Please enter valid values: N, P, K (0-100) and crop name.");
      setLoading(false);
      return;
    }

    try {
      const BACKEND_URL = "https://farmai-h4bm.onrender.com";
      const payload = {
        nitrogen: Number(nitrogen),
        phosphorous: Number(phosphorous),
        pottasium: Number(pottasium),
        cropname: cropname.trim(),
      };

      const response = await axios.post(`${BACKEND_URL}/api/fertilizer`, payload);
      const recommendation = response.data.recommendation;

      navigate("/fertilizer-result", { state: { recommendation, formData: payload } });
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-green-100"
      >
        <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-center text-green-700 break-words">
          Fertilizer Recommendation
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "nitrogen", placeholder: "Nitrogen (N)", icon: <FaLeaf /> },
            { name: "phosphorous", placeholder: "Phosphorous (P)", icon: <FaSeedling /> },
            { name: "pottasium", placeholder: "Potassium (K)", icon: <FaLeaf /> },
            { name: "cropname", placeholder: "Crop Name", icon: <FaFlask />, type: "text" },
          ].map((input) => (
            <div key={input.name} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                {input.icon}
              </span>
              <input
                type={input.type || "number"}
                step="0.01"
                name={input.name}
                placeholder={input.placeholder}
                value={formData[input.name]}
                onChange={handleChange}
                required
                className="pl-10 p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? "Analyzing..." : "Predict"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default FertilizerPage;
