import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSeedling, FaLeaf, FaRocket } from "react-icons/fa";

// ─── Validation ───────────────────────────────────────────────────────────────

const fieldValidators = {
  nitrogen:    (v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  phosphorous: (v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  pottasium:   (v) => v === "" ? "Required." : v < 0 || v > 100 ? "Must be 0–100." : "",
  cropname:    (v) => !v || !v.trim() ? "Required." : "",
};

const INITIAL_FORM   = { nitrogen: "", phosphorous: "", pottasium: "", cropname: "" };
const INITIAL_ERRORS = { nitrogen: "", phosphorous: "", pottasium: "", cropname: "" };

// ─── Component ────────────────────────────────────────────────────────────────

const FertilizerPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData]       = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched]         = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const val = name === "cropname" ? value : value === "" ? "" : Number(value);
      setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](val) }));
    }
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const val = name === "cropname" ? value : value === "" ? "" : Number(value);
    setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Mark all touched and validate
    const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const allErrors = Object.keys(fieldValidators).reduce((acc, k) => {
      const val = k === "cropname" ? formData[k] : formData[k] === "" ? "" : Number(formData[k]);
      return { ...acc, [k]: fieldValidators[k](val) };
    }, {});
    setFieldErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const payload = {
        nitrogen:    Number(formData.nitrogen),
        phosphorous: Number(formData.phosphorous),
        pottasium:   Number(formData.pottasium),
        cropname:    formData.cropname.trim(),
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fertilizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.recommendation) {
        setServerError(data.recommendation || "No recommendation returned. Please try again.");
        return;
      }

      navigate("/fertilizer-result", {
        state: { formData: payload, recommendation: data.recommendation },
      });
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const numberInputs = [
    { name: "nitrogen",    placeholder: "Nitrogen (N)",    icon: <FaLeaf />,     iconColor: "text-green-500" },
    { name: "phosphorous", placeholder: "Phosphorous (P)", icon: <FaSeedling />, iconColor: "text-green-500" },
    { name: "pottasium",   placeholder: "Potassium (K)",   icon: <FaLeaf />,     iconColor: "text-green-500" },
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
        <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-center text-green-700">
          Fertilizer Recommendation
        </h1>

        {/* NPK Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {numberInputs.map((input) => (
            <div key={input.name}>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${input.iconColor}`}>
                  {input.icon}
                </span>
                <input
                  type="number"
                  step="1"
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldErrors[input.name]}
                  className={`pl-10 p-3 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 transition ${
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

        {/* Crop Name (full width) */}
        <div className="mt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
              <FaSeedling />
            </span>
            <input
              type="text"
              name="cropname"
              placeholder="Crop Name (e.g. Wheat, Rice)"
              value={formData.cropname}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!fieldErrors.cropname}
              className={`pl-10 p-3 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 transition ${
                fieldErrors.cropname
                  ? "border-red-400 focus:ring-red-300"
                  : touched.cropname && !fieldErrors.cropname && formData.cropname !== ""
                  ? "border-green-400 focus:ring-green-300"
                  : "focus:ring-green-400"
              }`}
            />
          </div>
          {fieldErrors.cropname && (
            <p className="text-red-500 text-xs mt-1 ml-1" role="alert">
              {fieldErrors.cropname}
            </p>
          )}
        </div>

        {/* Server Error */}
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

export default FertilizerPage;