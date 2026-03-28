import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaUpload, FaMicroscope, FaFlask, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineImageSearch } from "react-icons/md";

// ─── Parse bullets ────────────────────────────────────────────────────────────
const parseBullets = (text) =>
  text
    .split(/\r?\n|•|-|\.(?=\s+[A-Z])/)
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter((l) => l.length > 8);

// ─── Section Card ─────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, points, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative overflow-hidden rounded-2xl border bg-white shadow-sm"
    style={{ borderColor: accent + "33" }}
  >
    {/* top accent bar */}
    <div className="h-1 w-full" style={{ background: accent }} />

    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg" style={{ background: accent + "18" }}>
          <Icon style={{ color: accent }} className="text-lg" />
        </div>
        <h3 className="font-bold text-gray-800 text-base tracking-wide">{title}</h3>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: accent + "18", color: accent }}>
          {points.length} findings
        </span>
      </div>

      <ul className="space-y-2">
        {points.map((p, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.05 }}
            className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed"
          >
            <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {p}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const UploadPage = () => {
  const [selectedFile, setSelectedFile]   = useState(null);
  const [preview, setPreview]             = useState(null);
  const [analysis, setAnalysis]           = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [dragOver, setDragOver]           = useState(false);
  const inputRef                          = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);
    setError("");
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) { setError("Please select an image first."); return; }
    setLoading(true);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const problemBullets  = parseBullets(data.problem   || "");
      const solutionBullets = parseBullets(data.solutions || "");
      const mid = Math.ceil(problemBullets.length / 2);

      setAnalysis({
        observations:  problemBullets.slice(0, mid),
        issues:        problemBullets.slice(mid),
        actions:       solutionBullets,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-2xl shadow-lg mb-4">
            <FaLeaf className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Farm Health Scanner</h1>
          <p className="text-gray-500 mt-1 text-sm">Upload a plant or field image for instant AI diagnosis</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
            ${dragOver ? "border-green-500 bg-green-50 scale-[1.01]" : "border-green-200 bg-white hover:border-green-400 hover:bg-green-50"}`}
          style={{ minHeight: preview ? "auto" : "180px" }}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-2xl" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-2xl">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  <MdOutlineImageSearch className="text-xl" /> Click to change image
                </p>
              </div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs font-medium text-gray-700 shadow">
                {selectedFile?.name}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="p-4 bg-green-100 rounded-full">
                <FaUpload className="text-green-600 text-2xl" />
              </div>
              <p className="text-gray-600 font-medium">Drop your image here or <span className="text-green-600 underline">browse</span></p>
              <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP — max 10MB</p>
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"
            >
              <FaExclamationCircle /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading || !selectedFile}
          className="mt-5 w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide shadow-md transition-all
            bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Analyzing your plant...
            </>
          ) : (
            <><FaMicroscope /> Scan Field</>
          )}
        </motion.button>

        {/* Loading shimmer cards */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="h-1 bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 space-y-4"
            >
              {/* Success banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 font-medium"
              >
                <FaCheckCircle className="text-green-500" />
                Analysis complete — {(analysis.observations.length + analysis.issues.length + analysis.actions.length)} findings detected
              </motion.div>

              {analysis.observations.length > 0 && (
                <Section
                  icon={FaMicroscope}
                  title="Observations"
                  points={analysis.observations}
                  accent="#2563eb"
                  delay={0.1}
                />
              )}

              {analysis.issues.length > 0 && (
                <Section
                  icon={FaExclamationCircle}
                  title="Possible Issues"
                  points={analysis.issues}
                  accent="#dc2626"
                  delay={0.2}
                />
              )}

              {analysis.actions.length > 0 && (
                <Section
                  icon={FaShieldAlt}
                  title="Recommended Actions"
                  points={analysis.actions}
                  accent="#16a34a"
                  delay={0.3}
                />
              )}

              {/* Scan again button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setAnalysis(null); setSelectedFile(null); setPreview(null); }}
                className="w-full mt-2 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <FaLeaf /> Scan Another Plant
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UploadPage;