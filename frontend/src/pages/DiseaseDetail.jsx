import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaLeaf, FaArrowLeft, FaSeedling, FaExclamationTriangle, FaMedkit } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const FRONTEND_IMAGE_MAP = {
  "early blight":       "https://www.gardeningknowhow.com/wp-content/uploads/2019/04/early-blight-1.jpg",
  "powdery mildew":     "https://www.gardeningknowhow.com/wp-content/uploads/2020/11/powdery-mildew.jpg",
  "rust":               "https://media.istockphoto.com/id/483451251/photo/fungal-attack.jpg?s=612x612&w=0&k=20&c=PM0Lld99Io4DU6sRqemkytZUkuSF5effOJ8fhIAXwVo=",
  "late blight":        "https://cropaia.com/wp-content/uploads/Potato-blight-phytophthora-infestans.jpg",
  "downy mildew":       "https://www.koppert.in/content/_processed_/c/6/csm_Plasmopara_viticola_1_a86cfd454e.jpeg",
  "fusarium wilt":      "https://www.planetnatural.com/wp-content/uploads/2012/12/fusarium-wilt.jpg",
  "bacterial leaf spot":"https://cdn.mos.cms.futurecdn.net/mETEisEmPi2Hs4tCHiNs4M.jpg",
};

const DiseaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisease = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/diseases/${id}`);
        setDisease(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load disease details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDisease();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 font-medium">{error || "Disease not found."}</p>
        <button
          onClick={() => navigate("/diseases")}
          className="flex items-center gap-2 text-green-700 font-semibold hover:underline"
        >
          <FaArrowLeft /> Back to Encyclopedia
        </button>
      </div>
    );
  }

  const imageUrl =
    FRONTEND_IMAGE_MAP[disease.name.toLowerCase().trim()] ||
    disease.imageUrl ||
    `https://placehold.co/1200x500/e8f5e9/2e7d32?text=${encodeURIComponent(disease.name)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={disease.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/1200x500/e8f5e9/2e7d32?text=${encodeURIComponent(disease.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/diseases")}
          className="absolute top-5 left-5 flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Disease name on hero */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg"
          >
            {disease.name}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Affected Crops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-green-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaSeedling className="text-green-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Affected Crops</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(disease.affectedCrops || ["Various crops"]).map((crop, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
              >
                {crop}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-green-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaLeaf className="text-blue-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Description</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{disease.description}</p>
        </motion.div>

        {/* Symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-red-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="text-red-500 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Symptoms</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{disease.symptoms}</p>
        </motion.div>

        {/* Treatment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-green-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FaMedkit className="text-emerald-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Treatment</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">{disease.treatment}</p>
        </motion.div>

        {/* Back button bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-2"
        >
          <button
            onClick={() => navigate("/diseases")}
            className="flex items-center gap-2 text-green-700 font-semibold hover:underline text-sm"
          >
            <FaArrowLeft /> Back to Encyclopedia
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default DiseaseDetail;