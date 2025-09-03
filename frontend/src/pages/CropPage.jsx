// import { useState } from "react";
// import axios from "axios";

// const CropPage = () => {
//   const [formData, setFormData] = useState({
//     nitrogen: "",
//     phosphorous: "",
//     pottasium: "",
//     ph: "",
//     rainfall: "",
//   });

//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setPrediction("");

//     try {
//       // Call your backend API
//       const response = await axios.post("http://localhost:5000/crop", formData);
//       setPrediction(response.data.recommendation);
//     } catch (err) {
//       console.error(err);
//       setPrediction("⚠️ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#f5f7fa", minHeight: "100vh", padding: "2rem" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2.5rem", color: "#4a6bff" }}>
//         Crop Recommendation
//       </h1>

//       <div style={{
//         maxWidth: "700px",
//         margin: "0 auto",
//         padding: "2rem",
//         background: "#fff",
//         borderRadius: "15px",
//         boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)"
//       }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//             <input type="number" name="nitrogen" placeholder="Nitrogen" value={formData.nitrogen} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" name="phosphorous" placeholder="Phosphorous" value={formData.phosphorous} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" name="pottasium" placeholder="Pottasium" value={formData.pottasium} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" step="0.01" name="ph" placeholder="pH level" value={formData.ph} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" step="0.01" name="rainfall" placeholder="Rainfall (mm)" value={formData.rainfall} onChange={handleChange} style={{ flex: "1 1 100%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//           </div>

//           <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
//             <button type="submit" style={{ padding: "0.7rem 2rem", fontSize: "1.1rem", fontWeight: "bold", borderRadius: "20px", backgroundColor: "#4a6bff", color: "white", border: "none", cursor: "pointer" }}>
//               {loading ? "Loading..." : "Predict"}
//             </button>
//           </div>
//         </form>

//         {prediction && (
//           <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "15px", backgroundColor: "#e0f7ea", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#27ae60" }}>
//             Recommended Crop: {prediction} 🌾
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CropPage;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const CropPage = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     nitrogen: "",
//     phosphorous: "",
//     pottasium: "",
//     ph: "",
//     rainfall: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post("http://localhost:5000/crop", formData);
//       const prediction = response.data.recommendation;

//       // Navigate to CropResult and pass data
//       navigate("/crop-result", { state: { prediction, formData } });
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#f5f7fa", minHeight: "100vh", padding: "2rem" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2.5rem", color: "text-green-600" }}>
//         Crop Recommendation
//       </h1>

//       <div style={{
//         maxWidth: "700px",
//         margin: "0 auto",
//         padding: "2rem",
//         background: "#fff",
//         borderRadius: "15px",
//         boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)"
//       }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//             <input type="number" name="nitrogen" placeholder="Nitrogen" value={formData.nitrogen} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" name="phosphorous" placeholder="Phosphorous" value={formData.phosphorous} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" name="pottasium" placeholder="Pottasium" value={formData.pottasium} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" step="0.01" name="ph" placeholder="pH level" value={formData.ph} onChange={handleChange} style={{ flex: "1 1 45%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//             <input type="number" step="0.01" name="rainfall" placeholder="Rainfall (mm)" value={formData.rainfall} onChange={handleChange} style={{ flex: "1 1 100%", padding: "0.5rem", fontWeight: "bold", borderRadius: "10px", border: "1px solid #ccc" }} required />
//           </div>

//           <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
//             <button type="submit" style={{ padding: "0.7rem 2rem", fontSize: "1.1rem", fontWeight: "bold", borderRadius: "20px", backgroundColor: "#4a6bff", color: "white", border: "none", cursor: "pointer" }}>
//               {loading ? "Loading..." : "Predict"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CropPage;






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // ✅ for smooth animations

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
    setLoading(true);

    try {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const response = await axios.post(`${BACKEND_URL}/crop`, formData);
  const prediction = response.data.recommendation;
  navigate("/crop-result", { state: { prediction, formData } });
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
            { name: "nitrogen", placeholder: "Nitrogen (N)" },
            { name: "phosphorous", placeholder: "Phosphorous (P)" },
            { name: "pottasium", placeholder: "Potassium (K)" },
            { name: "ph", placeholder: "pH Level", step: "0.01" },
          ].map((input) => (
            <input
              key={input.name}
              type="number"
              step={input.step || "1"}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          ))}
        </div>

        {/* Rainfall */}
        <input
          type="number"
          step="0.01"
          name="rainfall"
          placeholder="Rainfall (mm)"
          value={formData.rainfall}
          onChange={handleChange}
          required
          className="mt-4 p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200"
        >
          {loading ? "🌿 Analyzing..." : "🚀 Predict"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CropPage;
