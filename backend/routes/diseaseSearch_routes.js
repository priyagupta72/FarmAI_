import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


const diseaseImageMap = {
  "early blight": "https://vegpath.plantpath.wisc.edu/wp-content/uploads/sites/210/2023/11/potato-early-blight-leaves.jpg.",
  "powdery mildew": "https://www.amgrow.com.au/wp-content/uploads/sites/4/2016/08/AdobeStock_86328428-800x600.jpeg",
  "rust": "https://media.istockphoto.com/id/483451251/photo/fungal-attack.jpg?s=612x612&w=0&k=20&c=PM0Lld99Io4DU6sRqemkytZUkuSF5effOJ8fhIAXwVo=",
  "late blight": "https://cropaia.com/wp-content/uploads/Potato-blight-phytophthora-infestans.jpg",
  "downy mildew": "https://www.koppert.in/content/_processed_/c/6/csm_Plasmopara_viticola_1_a86cfd454e.jpeg",
  "fusarium wilt": "https://www.planetnatural.com/wp-content/uploads/2012/12/fusarium-wilt.jpg",
  "bacterial leaf spot": "https://cdn.mos.cms.futurecdn.net/mETEisEmPi2Hs4tCHiNs4M.jpg",
};


let cropDiseasesCache = [
    {
      id: 1,
      name: "Early Blight",
      affectedCrops: ["Tomato", "Potato", "Peppers", "Eggplants"],
      description: "Fungal disease caused by *Alternaria solani*, thriving in warm, humid conditions.",
      symptoms: "Dark spots with concentric rings on leaves, stems, and fruits, leading to defoliation.",
      treatment: "Crop rotation, resistant varieties, fungicides (chlorothalonil, mancozeb).",
      imageUrl: diseaseImageMap["early blight"],
    },
    {
      id: 2,
      name: "Powdery Mildew",
      affectedCrops: ["Wheat", "Grapes", "Cucumbers"],
      description: "Fungal disease caused by *Erysiphales*, spreading through airborne spores.",
      symptoms: "White powdery spots on leaves, stems, and fruit, causing leaf drop.",
      treatment: "Proper spacing, sulfur-based fungicides, resistant varieties.",
      imageUrl: diseaseImageMap["powdery mildew"],
    },
    {
      id: 3,
      name: "Rust",
      affectedCrops: ["Wheat", "Corn", "Soybeans"],
      description: "Fungal disease caused by *Pucciniales*, reducing photosynthesis.",
      symptoms: "Rust-colored pustules on leaves, leading to premature leaf drop.",
      treatment: "Crop rotation, resistant varieties, fungicides (triazoles, strobilurins).",
      imageUrl: diseaseImageMap["rust"],
    },
    {
      id: 4,
      name: "Late Blight",
      affectedCrops: ["Potato", "Tomato"],
      description: "Caused by *Phytophthora infestans*, spreads in cool, wet conditions.",
      symptoms: "Water-soaked, dark lesions with white moldy growth on leaves, stems, and fruit.",
      treatment: "Disease-free seeds, resistant varieties, fungicides (chlorothalonil, mefenoxam).",
      imageUrl: diseaseImageMap["late blight"],
    },
  ];
  
let queryCache = new Map(); // Cache for Gemini API queries

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Gemini API Key is missing in .env file!");
  process.exit(1);
}

// ✅ Correct Gemini API URL
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ✅ Function to fetch crop and plant disease data from Gemini API
async function fetchCropDiseasesFromGemini(query = "") {
  // Check if the query is already cached
  if (queryCache.has(query)) {
    return queryCache.get(query);
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `Provide a comprehensive list of crop and plant diseases ${
                  query ? `related to "${query}"` : ""
                }. Include as many diseases as possible. For each disease, include: name, affected crops (as a comma-separated list), description, symptoms, treatment, and an image URL if available. Format the response as a list with each disease starting with **Disease Name**, followed by Affected Crops:, Description:, Symptoms:, Treatment:, and Image URL:.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const geminiData =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!geminiData) {
      throw new Error("No valid response from Gemini API.");
    }

    const diseases = parseGeminiResponse(geminiData);
    if (diseases.length > 0) {
      cropDiseasesCache = diseases; // Update cache
      queryCache.set(query, diseases); // Cache the query result
    }

    return diseases;
  } catch (error) {
    console.error("❌ Error fetching from Gemini API:", error.message);
    // Fallback to the preloaded disease data if Gemini API fails
    return cropDiseasesCache;
  }
}

// ✅ Function to parse Gemini API response (Improved to Avoid N/A and Assign Images)
function parseGeminiResponse(responseText) {
  if (!responseText) return [];

  const lines = responseText.split("\n").filter((line) => line.trim() !== "");
  let diseases = [];
  let currentDisease = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    try {
      if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        if (currentDisease.name) {
          // Fill in missing fields with default data before adding to diseases
          currentDisease.affectedCrops = currentDisease.affectedCrops.length
            ? currentDisease.affectedCrops
            : ["Various crops"];
          currentDisease.description = currentDisease.description || "A common plant disease caused by fungal, bacterial, or viral pathogens, affecting crop health and yield.";
          currentDisease.symptoms = currentDisease.symptoms || "General symptoms include leaf spots, wilting, yellowing, or stunted growth.";
          currentDisease.treatment = currentDisease.treatment || "Use resistant varieties, apply appropriate pesticides, and practice crop rotation.";
          // Assign a specific image URL based on the disease name, or fall back to placeholder
          const diseaseKey = currentDisease.name.toLowerCase();
          currentDisease.imageUrl = diseaseImageMap[diseaseKey] || "https://placehold.co/300x200";
          diseases.push(currentDisease);
        }
        currentDisease = { name: trimmedLine.replace(/\*\*/g, "").trim(), affectedCrops: [] };
      } else if (trimmedLine.startsWith("Affected Crops:")) {
        currentDisease.affectedCrops = trimmedLine
          .split(":")[1]
          ?.trim()
          .split(",")
          .map((crop) => crop.trim()) || [];
      } else if (trimmedLine.startsWith("Description:")) {
        currentDisease.description = trimmedLine.split(":")[1]?.trim();
      } else if (trimmedLine.startsWith("Symptoms:")) {
        currentDisease.symptoms = trimmedLine.split(":")[1]?.trim();
      } else if (trimmedLine.startsWith("Treatment:")) {
        currentDisease.treatment = trimmedLine.split(":")[1]?.trim();
      } else if (trimmedLine.startsWith("Image URL:")) {
        currentDisease.imageUrl = trimmedLine.split(":")[1]?.trim();
      }
    } catch (error) {
      console.error("Error parsing line:", trimmedLine, error.message);
    }
  }

  // Add the last disease if it exists
  if (currentDisease.name) {
    currentDisease.affectedCrops = currentDisease.affectedCrops.length
      ? currentDisease.affectedCrops
      : ["Various crops"];
    currentDisease.description = currentDisease.description || "A common plant disease caused by fungal, bacterial, or viral pathogens, affecting crop health and yield.";
    currentDisease.symptoms = currentDisease.symptoms || "General symptoms include leaf spots, wilting, yellowing, or stunted growth.";
    currentDisease.treatment = currentDisease.treatment || "Use resistant varieties, apply appropriate pesticides, and practice crop rotation.";
    const diseaseKey = currentDisease.name.toLowerCase();
    currentDisease.imageUrl = diseaseImageMap[diseaseKey] || "https://placehold.co/300x200";
    diseases.push(currentDisease);
  }

  return diseases.map((d, index) => ({ id: index + 1, ...d }));
}

// ✅ Default Route to Fetch All Diseases
router.get("/", async (req, res) => {
  try {
    const diseases =
      cropDiseasesCache.length > 0
        ? cropDiseasesCache
        : await fetchCropDiseasesFromGemini();
    res.status(200).json(diseases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔍 **Search Diseases - Search Across All Fields**
router.get("/search", async (req, res) => {
  const query = req.query.query ? req.query.query.toLowerCase() : "";

  if (!query) {
    return res
      .status(400)
      .json({ message: "Provide a search term to find diseases." });
  }

  try {
    const diseases = await fetchCropDiseasesFromGemini(query);

    // Search across all fields
    const matchingDiseases = diseases.filter((disease) => {
      const searchFields = [
        disease.name?.toLowerCase() || "",
        disease.affectedCrops?.join(", ").toLowerCase() || "",
        disease.description?.toLowerCase() || "",
        disease.symptoms?.toLowerCase() || "",
        disease.treatment?.toLowerCase() || "",
      ];
      return searchFields.some((field) => field.includes(query));
    });

    if (matchingDiseases.length === 0) {
      return res
        .status(404)
        .json({ message: "No disease information available for this search." });
    }

    // Ensure each matching disease has a specific image URL
    const updatedMatchingDiseases = matchingDiseases.map((disease) => {
      const diseaseKey = disease.name.toLowerCase();
      const imageUrl = diseaseImageMap[diseaseKey] || "https://placehold.co/300x200";
      return { ...disease, imageUrl };
    });

    res.status(200).json(updatedMatchingDiseases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 **Get Full Disease Info**
router.get("/:id", (req, res) => {
  const diseaseId = parseInt(req.params.id);
  const disease = cropDiseasesCache.find((d) => d.id === diseaseId);

  if (!disease) {
    return res.status(404).json({ message: "Disease not found." });
  }

  res.status(200).json(disease);
});

// ❌ **Delete Disease from Cache**
router.delete("/:id", (req, res) => {
  const diseaseId = parseInt(req.params.id);
  const index = cropDiseasesCache.findIndex((d) => d.id === diseaseId);

  if (index === -1) {
    return res.status(404).json({ message: "Disease not found." });
  }

  cropDiseasesCache.splice(index, 1);
  // Update query cache to reflect the deletion
  queryCache.forEach((diseases, key) => {
    queryCache.set(
      key,
      diseases.filter((d) => d.id !== diseaseId)
    );
  });
  res.status(200).json({ message: "Disease deleted successfully." });
});

export default router;