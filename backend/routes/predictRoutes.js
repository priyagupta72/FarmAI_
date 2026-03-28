import express from "express";
import fs from "fs";
import upload from "../middleware/upload.js";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import logger from "../logs/logger.js";

const router = express.Router();

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ===== Text-only AI: Groq → OpenRouter =====
const summarizeAI = async (text) => {
  const prompt = `Summarize the following plant problem analysis into concise bullet points.
Only include important observations, possible issues, and recommended solutions.
Each bullet should be 1-2 lines.
Text: ${text}`;

  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      });
      logger.info("Summarize: Groq");
      return completion.choices[0].message.content.trim();
    } catch (err) {
      logger.warn("Summarize: Groq failed — " + err.message);
    }
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
        }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        logger.info("Summarize: OpenRouter");
        return data.choices[0].message.content.trim();
      }
    } catch (err) {
      logger.warn("Summarize: OpenRouter failed — " + err.message);
    }
  }

  return text;
};

// ===== Vision AI: OpenRouter (free vision models) =====
const analyzeImage = async (base64Image, mimeType, prompt) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in .env");
  }

  // Try multiple free vision models on OpenRouter in order
  const visionModels = [
  "openrouter/free",                              
  "meta-llama/llama-4-maverick:free",            
  "google/gemma-3-27b-it:free",                  
  "mistralai/mistral-small-3.1-24b-instruct:free", 
  "moonshotai/kimi-vl-a3b-thinking:free",        
  "qwen/qwen2.5-vl-3b-instruct:free",           
];

  for (const model of visionModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64Image}` },
              },
            ],
          }],
          max_tokens: 1024,
        }),
      });

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        logger.info(`Vision: using OpenRouter model — ${model}`);
        return data.choices[0].message.content.trim();
      }

      logger.warn(`Vision: ${model} failed — ${JSON.stringify(data?.error || "empty response")}`);
    } catch (err) {
      logger.warn(`Vision: ${model} error — ${err.message}`);
    }
  }

  throw new Error("All vision models failed on OpenRouter.");
};

// ===== Main Predict Route =====
router.post("/", upload.single("image"), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    filePath = req.file.path;
    const base64Image = fs.readFileSync(filePath).toString("base64");
    const mimeType = req.file.mimetype;

    // Step 1: Analyze image
    const problemRaw = await analyzeImage(
      base64Image,
      mimeType,
      "Analyze this image of a farm field or plant. Describe any visible damage, disease, pest infestation, or nutrient deficiency. Be specific and detailed."
    );

    // Step 2: Generate solutions
    const solutionRaw = await summarizeAI(
      `Based on this plant problem: "${problemRaw}", suggest specific remedies, fertilizers, pesticides, and prevention tips.`
    );

    // Step 3: Summarize problem
    const problem = await summarizeAI(problemRaw);

    res.json({
      problem:   problem.replace(/\*/g, "").trim(),
      solutions: solutionRaw.replace(/\*/g, "").trim(),
    });

  } catch (err) {
    logger.error("Predict Route Error: " + err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

export default router;