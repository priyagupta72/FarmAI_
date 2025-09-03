import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Scan, ClipboardCheck } from "lucide-react";

const LearnMorePopup = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 p-8 rounded-2xl shadow-xl relative border border-gray-100"
        >
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              How Our AI Crop Doctor Works
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Our advanced AI analyzes crop images with 95% accuracy to detect diseases and provide actionable solutions.
            </p>

            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-green-50 p-6 rounded-xl"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full text-green-600">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Image</h3>
                <p className="text-gray-600 text-sm">
                  Simply upload a clear photo of your affected crop leaves or fruits.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-green-50 p-6 rounded-xl"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full text-green-600">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Our deep learning model scans and identifies potential diseases within seconds.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-green-50 p-6 rounded-xl"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full text-green-600">
                  <ClipboardCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Report</h3>
                <p className="text-gray-600 text-sm">
                  Receive detailed diagnosis with treatment recommendations and prevention tips.
                </p>
              </motion.div>
            </div>

           
            <div className="mt-10">
              <motion.a
                href="/upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Upload className="w-5 h-5 mr-2" />
                Try It Now - Upload Your Image
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LearnMorePopup;