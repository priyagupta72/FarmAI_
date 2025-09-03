import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as tmImage from "@teachablemachine/image";
import { FaUpload, FaSearch, FaInfoCircle, FaLeaf } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { fetchDiseaseInfoFromAPI } from "../api/diseaseInfo";

const modelURL = "/assets/my_model/model.json";
const metadataURL = "/assets/my_model/metadata.json";

function UploadDetection() {
 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  let model;

  async function loadModel() {
    model = await tmImage.load(modelURL, metadataURL);
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setError("Only image files (JPG, PNG) are allowed.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setResult(null);
  };

  const handlePrediction = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError(null);

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      await loadModel();
      setTimeout(async () => {
        const prediction = await model.predict(img);
        const bestMatch = prediction.reduce((max, item) =>
          item.probability > max.probability ? item : max
        );
        setResult({
          disease: bestMatch.className,
          confidence: (bestMatch.probability * 100).toFixed(2) + "%",
          remedies: "Suggested remedies will be based on the detected disease.",
        });
        setLoading(false);
      }, 2000);
    };
  };

  const fetchDiseaseInfo = async () => {
    if (!result) return;
    try {
      setLoading(true);
      const data = await fetchDiseaseInfoFromAPI(result.disease);
      setDiseaseInfo(data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching disease info:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
       
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full p-3 mb-4">
            <FaLeaf className="text-xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            AI-Powered Crop Health Scanner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image to detect plant diseases and get treatment recommendations
          </p>
        </div>

      
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
          
            <label className="group cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                error ? 'border-red-300 bg-red-50' : 'border-green-300 hover:border-green-400 hover:bg-green-50'
              }`}>
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-4 bg-green-100 rounded-full text-green-600 group-hover:bg-green-200 transition">
                    <FaUpload className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      {preview ? "Image ready for analysis" : "Click to upload plant image"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {preview ? file.name : "JPEG, PNG (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </label>

           
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start"
              >
                <FiX className="flex-shrink-0 mt-0.5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

           
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex flex-col items-center"
              >
                <div className="relative w-full max-w-md">
                  <img 
                    src={preview} 
                    alt="Plant preview" 
                    className="w-full h-auto rounded-lg shadow-md border border-gray-200"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrediction}
                  disabled={loading}
                  className={`mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  <FaSearch className="mr-2" />
                  {loading ? 'Analyzing...' : 'Detect Disease'}
                </motion.button>
              </motion.div>
            )}
          </div>

          
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border-t border-gray-200 p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaLeaf className="text-green-500 mr-2" />
                Detection Results
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="font-medium text-gray-700">Disease Identified</span>
                  <span className="font-semibold text-gray-900">{result.disease}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="font-medium text-gray-700">Confidence Level</span>
                  <span className="font-bold text-green-600">
                    {result.confidence}
                  </span>
                </div>

               
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchDiseaseInfo}
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  <FaInfoCircle className="mr-2" />
                  {loading ? 'Loading Details...' : 'View Detailed Information'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

     
      <AnimatePresence>
        {showPopup && diseaseInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <FaLeaf className="text-green-500 mr-2" />
                      {result.disease}
                    </h2>
                    <div className="mt-1 flex items-center">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Confidence: {result.confidence}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{diseaseInfo.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Symptoms</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {diseaseInfo.symptoms.split(';').map((symptom, i) => (
                        <li key={i}>{symptom.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Options</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {diseaseInfo.treatment.split(';').map((treatment, i) => (
                          <li key={i} className="flex items-start">
                            <span className="flex-shrink-0 bg-green-100 text-green-800 rounded-full p-1 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="text-gray-700">{treatment.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UploadDetection;