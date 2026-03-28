import Groq from "groq-sdk";
import logger from "../logs/logger.js";

// ===== AI Clients =====
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ===== AI Helper: Groq → OpenRouter =====
const getAIResponse = async (systemInstruction, prompt) => {

  // ── 1. Try Groq (primary, free) ──
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user",   content: prompt },
        ],
        max_tokens: 1024,
      });
      logger.info("Disease: AI response from Groq");
      return completion.choices[0].message.content.trim();
    } catch (err) {
      logger.warn("Disease: Groq failed: " + err.message);
    }
  }

  // ── 2. Fallback to OpenRouter (free models) ──
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user",   content: prompt },
          ],
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        logger.info("Disease: AI response from OpenRouter (fallback)");
        return data.choices[0].message.content.trim();
      }
      throw new Error("Empty response from OpenRouter");
    } catch (err) {
      logger.error("Disease: OpenRouter failed: " + err.message);
      throw new Error("All AI providers failed.");
    }
  }

  throw new Error("No AI provider configured.");
};

// ===== Controller =====
export const getDiseaseInfo = async (req, res) => {
  const { disease } = req.body;
  if (!disease || typeof disease !== "string" || !disease.trim()) {
    return res.status(400).json({ error: "Disease name is required." });
  }
  try {
    const responseText = await getAIResponse(
      "You are a plant disease expert. Give clear, structured, concise information.",
      `Summarize the plant disease "${disease.trim()}" in a simple and clear way:
      1. Description (brief and easy to understand)
      2. Symptoms (short and to the point)
      3. Treatment (quick and effective solution).`
    );

    const info = {
      description: "Not available",
      symptoms: "Not available",
      treatment: "Not available",
    };

    const descriptionMatch = responseText.match(/Description:(.+?)(Symptoms:|Treatment:|$)/is);
    const symptomsMatch    = responseText.match(/Symptoms:(.+?)(Treatment:|$)/is);
    const treatmentMatch   = responseText.match(/Treatment:(.+)$/is);

    if (descriptionMatch) info.description = descriptionMatch[1].trim();
    if (symptomsMatch)    info.symptoms    = symptomsMatch[1].trim();
    if (treatmentMatch)   info.treatment   = treatmentMatch[1].trim();

    if (
      info.description === "Not available" &&
      info.symptoms    === "Not available" &&
      info.treatment   === "Not available"
    ) {
      info.description = responseText.trim();
    }

    return res.json(info);
  } catch (err) {
    logger.error("Disease info endpoint error", { error: err.message, stack: err.stack });
    return res.status(500).json({ error: "Failed to fetch disease information. Please try again." });
  }
};