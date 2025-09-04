import express from "express";
import upload from "../middleware/upload.js"; // your existing multer middleware
import fetch from "node-fetch";

const router = express.Router();

// POST /api/predict-disease
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Convert uploaded image to base64
    const fs = await import("fs");
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const ROB_OFLOW_API_KEY = process.env.ROB_OFLOW_API_KEY;
    const ROB_OFLOW_MODEL_ID = process.env.ROB_OFLOW_MODEL_ID;

    const response = await fetch(
      `https://detect.roboflow.com/${ROB_OFLOW_MODEL_ID}?api_key=${ROB_OFLOW_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({ base64: base64Image }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();

    res.json({ predictions: data.predictions });
  } catch (err) {
    console.error("Roboflow API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
