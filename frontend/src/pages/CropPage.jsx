import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSeedling, FaTint, FaLeaf, FaWater, FaRocket } from "react-icons/fa";

// ─── Validation ───────────────────────────────────────────────────────────────

const fieldValidators = {
  nitrogen:   (v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  phosphorous:(v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  pottasium:  (v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  ph:         (v) => v === "" ? "Required." : v < 0 || v > 14  ? "Must be 0–14."  : "",
  rainfall:   (v) => v === "" ? "Required." : v < 0 || v > 5000? "Must be 0–5000 mm." : "",
};

const INITIAL_FORM   = { nitrogen: "", phosphorous: "", pottasium: "", ph: "", rainfall: "" };
const INITIAL_ERRORS = { nitrogen: "", phosphorous: "", pottasium: "", ph: "", rainfall: "" };

// ─── Component ────────────────────────────────────────────────────────────────

const CropPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData]     = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched]       = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](value === "" ? "" : Number(value)) }));
    }
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](value === "" ? "" : Number(value)) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields
    const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const allErrors = Object.keys(fieldValidators).reduce(
      (acc, k) => ({ ...acc, [k]: fieldValidators[k](formData[k] === "" ? "" : Number(formData[k])) }),
      {}
    );
    setFieldErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const payload = {
        nitrogen:    Number(formData.nitrogen),
        phosphorous: Number(formData.phosphorous),
        pottasium:   Number(formData.pottasium),
        ph:          Number(formData.ph),
        rainfall:    Number(formData.rainfall),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/crop`,
        payload
      );

      navigate("/crop-result", { state: { prediction: response.data.recommendation, formData: payload } });
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { name: "nitrogen",    placeholder: "Nitrogen (N)",    icon: <FaLeaf />,    step: "1",    iconColor: "text-green-500" },
    { name: "phosphorous", placeholder: "Phosphorous (P)", icon: <FaSeedling />,step: "1",    iconColor: "text-green-500" },
    { name: "pottasium",   placeholder: "Potassium (K)",   icon: <FaLeaf />,    step: "1",    iconColor: "text-green-500" },
    { name: "ph",          placeholder: "pH Level",        icon: <FaTint />,    step: "0.01", iconColor: "text-green-500" },
    { name: "rainfall",    placeholder: "Rainfall (mm)",   icon: <FaWater />,   step: "0.01", iconColor: "text-blue-500",  full: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-green-100"
      >
        <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-center text-green-700 break-words">
          Crop Recommendation
        </h1>

        {/* Grid inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputs.filter((i) => !i.full).map((input) => (
            <div key={input.name}>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${input.iconColor}`}>
                  {input.icon}
                </span>
                <input
                  type="number"
                  step={input.step}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldErrors[input.name]}
                  className={`pl-10 p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 transition ${
                    fieldErrors[input.name]
                      ? "border-red-400 focus:ring-red-300"
                      : touched[input.name] && !fieldErrors[input.name] && formData[input.name] !== ""
                      ? "border-green-400 focus:ring-green-300"
                      : "focus:ring-green-400"
                  }`}
                />
              </div>
              {fieldErrors[input.name] && (
                <p className="text-red-500 text-xs mt-1 ml-1" role="alert">
                  {fieldErrors[input.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Rainfall (full width) */}
        {inputs.filter((i) => i.full).map((input) => (
          <div key={input.name} className="mt-4">
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${input.iconColor}`}>
                {input.icon}
              </span>
              <input
                type="number"
                step={input.step}
                name={input.name}
                placeholder={input.placeholder}
                value={formData[input.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!fieldErrors[input.name]}
                className={`pl-10 p-3 border rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 transition ${
                  fieldErrors[input.name]
                    ? "border-red-400 focus:ring-red-300"
                    : touched[input.name] && !fieldErrors[input.name] && formData[input.name] !== ""
                    ? "border-green-400 focus:ring-green-300"
                    : "focus:ring-green-400"
                }`}
              />
            </div>
            {fieldErrors[input.name] && (
              <p className="text-red-500 text-xs mt-1 ml-1" role="alert">
                {fieldErrors[input.name]}
              </p>
            )}
          </div>
        ))}

        {/* Server error */}
        {serverError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3" role="alert">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : <><span>Predict</span><FaRocket /></>}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default CropPage;