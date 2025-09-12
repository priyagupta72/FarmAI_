import express from "express";
import fs from "fs";
import upload from "../middleware/upload.js";
import fetch from "node-fetch";

const router = express.Router();

// Helper function to summarize AI text
const summarizeAI = async (text) => {
  const prompt = `
Summarize the following plant problem analysis into concise bullet points.
Only include important observations, possible issues, and recommended solutions.
Each bullet should be 1-2 lines.
Text: ${text}
  `;

  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// Main Predict route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;

    // Gemini Vision Call
    const prompt = "Analyze this image of a farm field or plant. Describe any visible damage, disease, pest infestation, or nutrient deficiency.";
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Image } },
          ],
        },
      ],
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Image analysis failed");
    const data = await response.json();
    const problemRaw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Gemini Text Call for solutions
    const solutionPrompt = `Based on the following plant/field problem: "${problemRaw}", suggest specific remedies, fertilizers, pesticides, and prevention tips.`;
    const solutionPayload = { contents: [{ role: "user", parts: [{ text: solutionPrompt }] }] };

    const solutionRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solutionPayload),
    });

    if (!solutionRes.ok) throw new Error("Solution generation failed");
    const solutionData = await solutionRes.json();
    const solutionRaw = solutionData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Summarize both problem and solution
    const problem = await summarizeAI(problemRaw);
    const solutions = await summarizeAI(solutionRaw);

    res.json({
      problem: problem.replace(/\*/g, "").trim(),
      solutions: solutions.replace(/\*/g, "").trim(),
    });
  } catch (err) {
    console.error("Predict Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;



