import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


const diseaseImageMap = {
  "early blight": "https://www.gardeningknowhow.com/wp-content/uploads/2019/04/early-blight-1.jpg",
  "powdery mildew": "https://www.gardeningknowhow.com/wp-content/uploads/2020/11/powdery-mildew.jpg",
  "rust": "https://www.apsnet.org/edcenter/disandpath/fungalbasidio/pdlessons/PublishingImages/rust1.jpg",
  "late blight": "https://www.gardeningknowhow.com/wp-content/uploads/2019/04/late-blight.jpg",
  "downy mildew": "https://www.gardeningknowhow.com/wp-content/uploads/2020/11/downy-mildew.jpg",
  "fusarium wilt": "https://www.planetnatural.com/wp-content/uploads/2012/12/fusarium-wilt.jpg",
  "bacterial leaf spot": "https://www.gardeningknowhow.com/wp-content/uploads/2020/11/bacterial-leaf-spot.jpg",
};


let cropDiseasesCache = [
  {
    id: 1,
    name: "Early Blight",
    affectedCrops: [
      "Tomato",
      "Potato",
      "Peppers",
      "Eggplants",
      "Black Nightshade",
      "Hairy Nightshade",
    ],
    description:
      "Early Blight is a fungal disease caused primarily by *Alternaria solani*, with *Alternaria tomatophila* and *Alternaria alternata* also contributing in some cases. It affects plants in the Solanaceae family, thriving in warm, humid conditions (optimal temperatures of 75°F to 86°F and relative humidity above 90%). The fungus overwinters in infected plant debris, soil, potato tubers, and tomato seeds, making it a persistent issue in affected areas. It can lead to significant yield losses (up to 79% in tomatoes and 20-30% in potatoes in the U.S.) by causing defoliation, reducing photosynthesis, and affecting tuber and fruit quality.",
    symptoms:
      "Leaves: Small, dark brown to black spots with concentric rings (often called 'bullseye' or 'target spots') appear, primarily on older, lower leaves. Spots may enlarge to 1/4 to 1/2 inch in diameter, surrounded by a yellow halo, leading to leaf yellowing, wilting, and premature defoliation. Stems: Dark, gaunt spots with less defined contours compared to leaf spots. Fruit (Tomatoes): Dark, sunken, leathery spots, often at the stem attachment, with concentric rings; infected fruit may drop prematurely, with losses of 30-50% of immature fruit possible. Tubers (Potatoes): Dark, sunken, cork-like lesions with raised margins; underlying flesh becomes dry, leathery, and brown, potentially enlarging during storage and causing tuber shriveling.",
    treatment:
      "Cultural Practices: Rotate crops with non-solanaceous plants for at least 2-3 years to reduce inoculum. Remove and destroy infected plant debris, control solanaceous weeds (e.g., black nightshade), and avoid overhead irrigation to keep foliage dry. Use proper spacing and staking to improve air circulation. Resistant Varieties: Plant tolerant tomato varieties like 'Mountain Magic', 'Mountain Fresh Plus F1', 'Bush Celebrity Hybrid', 'Big Beef', or 'Plum Regal'. For potatoes, varieties like 'Defender' show some resistance. Chemical Control: Apply fungicides such as chlorothalonil, mancozeb, or azoxystrobin at 7-10 day intervals, starting at the first sign of disease or preventatively in high-risk areas. Use copper-based fungicides for organic production. Monitoring: Scout fields regularly, especially after warm, wet weather, to catch early symptoms and prevent spread.",
    imageUrl: diseaseImageMap["early blight"],
  },
  {
    id: 2,
    name: "Powdery Mildew",
    affectedCrops: ["Wheat", "Barley", "Grapes", "Cucumbers", "Squash"],
    description:
      "Powdery Mildew is a fungal disease caused by various species of the Erysiphales order, such as *Erysiphe graminis* in cereals and *Podosphaera xanthii* in cucurbits. It thrives in warm, dry conditions but can also spread in humid environments. The fungus spreads through airborne spores and can overwinter in plant debris or on alternate hosts, leading to early spring infections. It reduces crop quality and yield by impairing photosynthesis and causing premature leaf drop.",
    symptoms:
      "Leaves: White to grayish powdery spots on the upper surface, starting on older leaves and spreading to younger ones. Spots may coalesce, covering entire leaves, leading to yellowing, browning, and premature leaf drop. Stems: Powdery coating on stems, reducing plant vigor. Fruit (Grapes, Cucurbits): White powdery growth on fruit surfaces, causing deformities, reduced quality, and premature fruit drop.",
    treatment:
      "Cultural Practices: Ensure proper plant spacing to improve air circulation and reduce humidity around foliage. Avoid excessive nitrogen fertilization, which promotes lush growth susceptible to infection. Prune plants to increase sunlight penetration. Resistant Varieties: Use resistant varieties like 'Chardonnay' for grapes or 'PMR 45' for cucumbers. Chemical Control: Apply sulfur-based fungicides, neem oil, or potassium bicarbonate at the first sign of disease, repeating every 7-14 days. Use systemic fungicides like myclobutanil in severe cases. Monitoring: Regularly inspect plants during warm, dry weather to catch early symptoms.",
    imageUrl: diseaseImageMap["powdery mildew"],
  },
  {
    id: 3,
    name: "Rust",
    affectedCrops: ["Wheat", "Corn", "Soybean", "Coffee", "Beans"],
    description:
      "Rust is a fungal disease caused by various species of the Pucciniales order, such as *Puccinia triticina* in wheat and *Phakopsora pachyrhizi* in soybeans. It thrives in warm, moist conditions (optimal temperatures of 65°F to 85°F) and spreads through windborne spores. The fungus can overwinter on alternate hosts or crop residues, leading to early infections. Rust reduces yield by impairing photosynthesis, causing up to 50% yield loss in severe cases.",
    symptoms:
      "Leaves: Small, rust-colored or orange pustules (uredinia) on the underside of leaves, often in clusters, leading to reduced photosynthesis. Yellowing and premature leaf drop occur in severe infections. Stems: Orange pustules on stems, weakening plant structure. Grain (Wheat, Corn): Reduced grain size and quality due to impaired nutrient transport.",
    treatment:
      "Cultural Practices: Plant early to avoid peak infection periods, and remove crop residues to reduce overwintering spores. Use crop rotation with non-host plants like legumes. Resistant Varieties: Use rust-resistant varieties like 'Everest' for wheat or 'Pioneer 95Y40' for soybeans. Chemical Control: Apply fungicides like triazoles (e.g., tebuconazole) or strobilurins (e.g., azoxystrobin) at the first sign of disease, repeating every 10-14 days. Monitoring: Scout fields during warm, wet weather, especially after rainfall, to detect early symptoms.",
    imageUrl: diseaseImageMap["rust"],
  },
  {
    id: 4,
    name: "Late Blight",
    affectedCrops: ["Potato", "Tomato"],
    description:
      "Late Blight is a devastating disease caused by the oomycete *Phytophthora infestans*. It thrives in cool, wet conditions (optimal temperatures of 60°F to 70°F) and spreads rapidly through waterborne spores. The pathogen can overwinter in infected tubers or plant debris, leading to explosive outbreaks, as seen in the Irish Potato Famine of the 1840s. It can cause complete crop loss within days if not managed.",
    symptoms:
      "Leaves: Large, water-soaked, dark green to black spots on leaves, often with a white, fuzzy growth on the underside in humid conditions. Spots expand rapidly, causing leaf death. Stems: Dark brown to black lesions, leading to stem collapse. Tubers (Potatoes): Brown to purplish lesions on the skin, with underlying flesh turning reddish-brown and rotting. Fruit (Tomatoes): Irregular, greasy, grayish-green spots that turn brown, often with a white moldy growth.",
    treatment:
      "Cultural Practices: Use certified disease-free seed potatoes and destroy volunteer plants. Avoid overhead irrigation and ensure proper drainage to reduce moisture. Remove and destroy infected plant debris. Resistant Varieties: Use resistant varieties like 'Kennebec' for potatoes or 'Defiant' for tomatoes. Chemical Control: Apply protectant fungicides like chlorothalonil or copper-based products preventatively, and use systemic fungicides like mefenoxam in high-risk areas. Monitoring: Monitor weather forecasts for cool, wet conditions and scout fields daily during high-risk periods.",
    imageUrl: diseaseImageMap["late blight"],
  },
];
let queryCache = new Map(); 


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error(" Gemini API Key is missing in .env file!");
  process.exit(1);
}


const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;


async function fetchCropDiseasesFromGemini(query = "") {
  
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
      cropDiseasesCache = diseases;
      queryCache.set(query, diseases);
    }

    return diseases;
  } catch (error) {
    console.error(" Error fetching from Gemini API:", error.message);
    return cropDiseasesCache;
  }
}


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
        
          currentDisease.affectedCrops = currentDisease.affectedCrops.length
            ? currentDisease.affectedCrops
            : ["Various crops"];
          currentDisease.description = currentDisease.description || "A common plant disease caused by fungal, bacterial, or viral pathogens, affecting crop health and yield.";
          currentDisease.symptoms = currentDisease.symptoms || "General symptoms include leaf spots, wilting, yellowing, or stunted growth.";
          currentDisease.treatment = currentDisease.treatment || "Use resistant varieties, apply appropriate pesticides, and practice crop rotation.";
          // Assign a specific image URL based on the disease name, or fall back to placeholder
          const diseaseKey = currentDisease.name.toLowerCase();
          currentDisease.imageUrl = "https://placehold.co/300x200";
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