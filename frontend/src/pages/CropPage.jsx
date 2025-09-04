
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSeedling, FaTint, FaLeaf, FaWater, FaRocket } from "react-icons/fa";

const CropPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    pottasium: "",
    ph: "",
    rainfall: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== FRONTEND VALIDATION =====
    const { nitrogen, phosphorous, pottasium, ph, rainfall } = formData;
    if (
      nitrogen < 0 || nitrogen > 100 ||
      phosphorous < 0 || phosphorous > 100 ||
      pottasium < 0 || pottasium > 100
    ) {
      alert("⚠️ N, P, K values must be between 0 and 100");
      return;
    }
    if (ph < 0 || ph > 7) {
      alert("⚠️ pH value must be between 0 and 7");
      return;
    }
    if (rainfall < 0 || rainfall > 5000) {
      alert("⚠️ Rainfall must be between 0 and 5000 mm");
      return;
    }

    setLoading(true);

    try {
      const BACKEND_URL = "https://farmai-h4bm.onrender.com"; 
      const payload = {
        nitrogen: Number(nitrogen),
        phosphorous: Number(phosphorous),
        pottasium: Number(pottasium),
        ph: Number(ph),
        rainfall: Number(rainfall),
      };

      const response = await axios.post(`${BACKEND_URL}/api/crop`, payload);
      const prediction = response.data.recommendation;
      navigate("/crop-result", { state: { prediction, formData: payload } });
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
          Crop Recommendation
        </h1>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "nitrogen", placeholder: "Nitrogen (N)", icon: <FaLeaf /> },
            { name: "phosphorous", placeholder: "Phosphorous (P)", icon: <FaSeedling /> },
            { name: "pottasium", placeholder: "Potassium (K)", icon: <FaLeaf /> },
            { name: "ph", placeholder: "pH Level", step: "0.01", icon: <FaTint /> },
          ].map((input) => (
            <div key={input.name} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">{input.icon}</span>
              <input
                type="number"
                step={input.step || "1"}
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

        {/* Rainfall */}
        <div className="relative mt-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
            <FaWater />
          </span>
          <input
            type="number"
            step="0.01"
            name="rainfall"
            placeholder="Rainfall (mm)"
            value={formData.rainfall}
            onChange={handleChange}
            required
            className="pl-10 p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? "Analyzing..." : <>Predict <FaRocket /></>}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CropPage;
