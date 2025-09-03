import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config(); 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY in diseaseController.js:", GEMINI_API_KEY || "undefined");


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getDiseaseInfo = async (req, res) => {
  const { disease } = req.body;


  if (!GEMINI_API_KEY) {
    
    return res.status(500).json({ error: "API key is not configured" });
  }

  if (!disease || typeof disease !== "string" || disease.trim() === "") {
    console.error("Invalid or missing disease name in request:", req.body);
    return res.status(400).json({ error: "Disease name is required and must be a non-empty string" });
  }

  try {
    const MODEL_NAME = "gemini-1.5-flash";
    console.log(`Using model: ${MODEL_NAME}`);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Summarize the plant disease "${disease}" in a simple and clear way:  
    1. Description (brief and easy to understand)  
    2. Symptoms (short and to the point)  
    3. Treatment (quick and effective solution).`;

   
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
   

   
    const info = {
      description: "Not available",
      symptoms: "Not available",
      treatment: "Not available",
    };

    try {
      const descriptionMatch = responseText.match(/Description:(.+?)(Symptoms:|Treatment:|$)/is);
      const symptomsMatch = responseText.match(/Symptoms:(.+?)(Treatment:|$)/is);
      const treatmentMatch = responseText.match(/Treatment:(.+)$/is);

      if (descriptionMatch) info.description = descriptionMatch[1].trim();
      if (symptomsMatch) info.symptoms = symptomsMatch[1].trim();
      if (treatmentMatch) info.treatment = treatmentMatch[1].trim();

      console.log("Parsed response:", info);
    } catch (parseError) {
      console.warn("Failed to parse Gemini response, using raw text as fallback:", parseError.message);
      info.description = responseText.trim();
    }

    res.json(info);
  } catch (error) {
    console.error("Gemini API error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch disease information", details: error.message });
  }
};