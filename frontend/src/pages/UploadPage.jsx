import React, { useState } from "react";
import { FaExclamationTriangle, FaSearch, FaLeaf } from "react-icons/fa";

// Card component
const Card = ({ title, points, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    red: "bg-red-50 border-red-200 text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`p-6 rounded-2xl shadow-md mb-6 border ${colorClasses[color]}`}>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <ul className="list-disc pl-5 space-y-1">
        {points.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

// Parse AI text into bullet points
const parseBullets = (text) =>
  text
    .split(/\r?\n|•|-/)
    .map((line) => line.trim())
    .filter(Boolean);

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // Parse bullets dynamically
      const problemBullets = parseBullets(data.problem || "");
      const solutionBullets = parseBullets(data.solutions || "");

      // Split problemBullets into observations & possible issues
      const mid = Math.ceil(problemBullets.length / 2);

      setAnalysis({
        leafAnalysis: problemBullets.slice(0, mid),
        possibleIssues: problemBullets.slice(mid),
        recommendedActions: solutionBullets,
        furtherInvestigation: data.furtherInvestigation || [],
        note: data.note || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🌿 Farm Health Scanner</h1>

      <div className="mb-4 w-full max-w-md">
  <label
    htmlFor="file-upload"
    className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 transition"
  >
    <FaLeaf className="mr-2 text-green-600" />
    {selectedFile ? selectedFile.name : "Choose an image"}
  </label>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
</div>


      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mb-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? "Scanning..." : "Scan Field"}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {analysis && (
        <div className="w-full max-w-4xl">
          {/* Leaf Analysis */}
          {analysis.leafAnalysis.length > 0 && (
            <Card title="Leaf Analysis" points={analysis.leafAnalysis} color="blue" />
          )}

          {/* Possible Issues */}
          {analysis.possibleIssues.length > 0 && (
            <Card title="Possible Issues" points={analysis.possibleIssues} color="red" />
          )}

          {/* Further Investigation */}
          {analysis.furtherInvestigation.length > 0 && (
            <Card title="Further Investigation" points={analysis.furtherInvestigation} color="blue" />
          )}

          {/* Recommended Actions */}
          {analysis.recommendedActions.length > 0 && (
            <Card title="Recommended Actions" points={analysis.recommendedActions} color="green" />
          )}

          {/* Note */}
          {analysis.note && <p className="text-sm text-gray-500 mt-4">{analysis.note}</p>}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
