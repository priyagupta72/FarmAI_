
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // ✅ for animations

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

    try {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 
  const response = await axios.post(`${BACKEND_URL}/fertilizer`, formData);
  const recommendation = response.data.recommendation;
  navigate("/fertilizer-result", { state: { recommendation, formData } });
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
        {/* Heading */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-center text-green-700 break-words">
          Fertilizer Recommendation
        </h1>

        {/* Inputs */}
        <div className="space-y-4">
          {[
            { name: "nitrogen", placeholder: "Nitrogen (N)", type: "number" },
            { name: "phosphorous", placeholder: "Phosphorous (P)", type: "number" },
            { name: "pottasium", placeholder: "Potassium (K)", type: "number" },
            { name: "cropname", placeholder: "Crop Name", type: "text" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200"
        >
          {loading ? "🌿 Analyzing..." : "⚡Recommend"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default FertilizerPage;
