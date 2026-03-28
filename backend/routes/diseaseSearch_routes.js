import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ===== Groq Client =====
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ===== Image Map =====
const diseaseImageMap = {
  "early blight":      "https://www.gardeningknowhow.com/wp-content/uploads/2019/04/early-blight-1.jpg",
  "powdery mildew":    "https://www.gardeningknowhow.com/wp-content/uploads/2020/11/powdery-mildew.jpg",
  "rust":              "https://media.istockphoto.com/id/483451251/photo/fungal-attack.jpg?s=612x612&w=0&k=20&c=PM0Lld99Io4DU6sRqemkytZUkuSF5effOJ8fhIAXwVo=",
  "late blight":       "https://cropaia.com/wp-content/uploads/Potato-blight-phytophthora-infestans.jpg",
  "downy mildew":      "https://www.koppert.in/content/_processed_/c/6/csm_Plasmopara_viticola_1_a86cfd454e.jpeg",
  "fusarium wilt":     "https://www.planetnatural.com/wp-content/uploads/2012/12/fusarium-wilt.jpg",
  "bacterial leaf spot":"https://cdn.mos.cms.futurecdn.net/mETEisEmPi2Hs4tCHiNs4M.jpg",
  "anthracnose":    "https://upload.wikimedia.org/wikipedia/commons/8/8b/Anthracnose_on_leaves.jpg",
"root rot":       "https://extension.umn.edu/sites/extension.umn.edu/files/root-rot-soybean.jpg",
"mosaic virus":   "https://www.apsnet.org/edcenter/disandpath/viral/pdlessons/PublishingImages/TMV01sm.jpg",
"black sigatoka": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Mycosphaerella_fijiensis.jpg",
"rice blast":     "https://upload.wikimedia.org/wikipedia/commons/4/4b/Rice_blast_lesions.jpg",
};

const getImage = (name) => {
  const key = name.toLowerCase().trim();
  return (
    diseaseImageMap[key] ||
    `https://placehold.co/600x400/e8f5e9/2e7d32?text=${encodeURIComponent(name)}`
  );
};

// ===== Hardcoded base diseases (always available, no API needed) =====
const BASE_DISEASES = [
  {
    id: 1,
    name: "Early Blight",
    affectedCrops: ["Tomato", "Potato", "Peppers", "Eggplants"],
    description: "A fungal disease caused by Alternaria solani, thriving in warm, humid conditions. Can cause up to 79% yield loss in tomatoes.",
    symptoms: "Dark brown spots with concentric rings ('bullseye') on older leaves, yellow halo around spots, premature defoliation, sunken lesions on fruit and tubers.",
    treatment: "Rotate crops for 2-3 years, remove infected debris, apply chlorothalonil or mancozeb fungicides every 7-10 days, use resistant varieties like Mountain Magic.",
  },
  {
    id: 2,
    name: "Powdery Mildew",
    affectedCrops: ["Wheat", "Barley", "Grapes", "Cucumbers", "Squash"],
    description: "Fungal disease caused by Erysiphales species, thriving in warm dry conditions. Spreads through airborne spores and reduces crop quality.",
    symptoms: "White to grayish powdery spots on upper leaf surfaces, starts on older leaves, spreads to younger ones, yellowing and premature leaf drop.",
    treatment: "Improve air circulation with proper spacing, apply sulfur-based fungicides or neem oil every 7-14 days, use resistant varieties.",
  },
  {
    id: 3,
    name: "Rust",
    affectedCrops: ["Wheat", "Corn", "Soybean", "Coffee", "Beans"],
    description: "Fungal disease caused by Pucciniales species, spreads through windborne spores. Can cause up to 50% yield loss in severe cases.",
    symptoms: "Small rust-colored orange pustules on leaf undersides, yellowing, premature leaf drop, reduced grain size and quality.",
    treatment: "Plant early to avoid peak infection, use rust-resistant varieties, apply triazole or strobilurin fungicides every 10-14 days.",
  },
  {
    id: 4,
    name: "Late Blight",
    affectedCrops: ["Potato", "Tomato"],
    description: "Devastating disease caused by Phytophthora infestans. Caused the Irish Potato Famine. Can cause complete crop loss within days.",
    symptoms: "Large water-soaked dark spots on leaves with white fuzzy growth underneath, brown lesions on stems, rotting tubers, greasy spots on tomato fruit.",
    treatment: "Use certified disease-free seed potatoes, avoid overhead irrigation, apply chlorothalonil or copper fungicides preventatively.",
  },
  {
    id: 5,
    name: "Downy Mildew",
    affectedCrops: ["Grapes", "Lettuce", "Spinach", "Cucumbers", "Onions"],
    description: "Disease caused by oomycetes like Plasmopara viticola, thrives in cool, wet conditions. Spreads rapidly through water splash and wind.",
    symptoms: "Yellow or pale green patches on upper leaf surface, grayish-purple downy growth on underside, leaves curl and drop prematurely.",
    treatment: "Improve drainage, avoid overhead watering, apply copper-based or systemic fungicides, use resistant varieties.",
  },
  {
    id: 6,
    name: "Fusarium Wilt",
    affectedCrops: ["Tomato", "Banana", "Cotton", "Watermelon", "Pepper"],
    description: "Soilborne fungal disease caused by Fusarium oxysporum. Persists in soil for many years and spreads through infected seeds or tools.",
    symptoms: "Yellowing of lower leaves, brown discoloration of vascular tissue when stem is cut, wilting despite adequate water, plant death.",
    treatment: "Plant resistant varieties, rotate crops, solarize soil, apply biological control agents like Trichoderma, avoid over-irrigation.",
  },
  {
    id: 7,
    name: "Bacterial Leaf Spot",
    affectedCrops: ["Pepper", "Tomato", "Lettuce", "Spinach", "Peach"],
    description: "Bacterial disease caused by Xanthomonas species, spread by rain splash and infected seeds. Thrives in warm, wet conditions.",
    symptoms: "Small water-soaked spots on leaves that turn brown with yellow halos, spots may fall out leaving ragged holes, defoliation in severe cases.",
    treatment: "Use disease-free seeds, apply copper-based bactericides, avoid overhead irrigation, remove and destroy infected plant material.",
  },
  {
    id: 8,
    name: "Anthracnose",
    affectedCrops: ["Mango", "Avocado", "Beans", "Strawberry", "Pepper"],
    description: "Fungal disease caused by Colletotrichum species, common in warm humid climates. Causes post-harvest losses in fruits.",
    symptoms: "Dark sunken lesions on fruits and leaves, salmon-colored spore masses in humid conditions, leaf blight, twig dieback.",
    treatment: "Apply mancozeb or copper fungicides, harvest fruit before full ripening, proper post-harvest handling and storage.",
  },
  {
    id: 9,
    name: "Root Rot",
    affectedCrops: ["Soybean", "Corn", "Cotton", "Avocado", "Citrus"],
    description: "Complex disease caused by Phytophthora, Pythium, or Fusarium species. Favored by waterlogged soils and poor drainage.",
    symptoms: "Yellowing and wilting of plants, brown to black rotted roots, stunted growth, plant collapse in severe cases.",
    treatment: "Improve soil drainage, avoid overwatering, apply fungicide drenches, use resistant rootstocks for tree crops.",
  },
  {
    id: 10,
    name: "Mosaic Virus",
    affectedCrops: ["Tobacco", "Tomato", "Cucumber", "Bean", "Pepper"],
    description: "Viral disease caused by various mosaic viruses (TMV, CMV, etc.), transmitted by aphids or contact. No cure once infected.",
    symptoms: "Mottled yellow-green mosaic pattern on leaves, leaf curling, distortion, stunted growth, reduced fruit quality.",
    treatment: "Control aphid vectors with insecticides, remove infected plants immediately, use virus-free seeds, sanitize tools.",
  },
  {
    id: 11,
    name: "Black Sigatoka",
    affectedCrops: ["Banana", "Plantain"],
    description: "Serious fungal disease of banana caused by Mycosphaerella fijiensis. One of the most destructive banana diseases worldwide.",
    symptoms: "Small yellowish streaks on leaves expanding to dark brown or black streaks, premature leaf death, reduced fruit yield up to 50%.",
    treatment: "Apply systemic fungicides (triazoles, strobilurins) on a regular schedule, remove infected leaves, use resistant varieties.",
  },
  {
    id: 12,
    name: "Rice Blast",
    affectedCrops: ["Rice"],
    description: "Most devastating rice disease caused by Magnaporthe oryzae. Can cause complete crop failure under severe conditions.",
    symptoms: "Diamond-shaped lesions with gray centers and brown borders on leaves, collar rot at base of panicle, node blast causing lodging.",
    treatment: "Use resistant varieties, apply tricyclazole or isoprothiolane fungicides, avoid excess nitrogen, maintain proper water levels.",
  },
];

// ===== Query Cache =====
const queryCache = new Map();

// ===== Fetch from Groq AI =====
const fetchFromGroq = async (query = "") => {
  if (!groq) return [];

  const cacheKey = query.toLowerCase().trim();
  if (queryCache.has(cacheKey)) return queryCache.get(cacheKey);

  try {
    const prompt = `List 8 crop/plant diseases ${query ? `related to "${query}"` : "that are common in agriculture"}.
For each disease respond in this EXACT format (no markdown, no extra text):

DISEASE: [name]
CROPS: [crop1, crop2, crop3]
DESCRIPTION: [1-2 sentence description]
SYMPTOMS: [key symptoms in 1-2 sentences]
TREATMENT: [key treatments in 1-2 sentences]
---

Repeat for all 8 diseases. Only use the format above.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a plant pathology expert. Always respond in the exact format requested. No markdown, no extra commentary." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content.trim();
    const diseases = parseGroqResponse(text);

    if (diseases.length > 0) {
      queryCache.set(cacheKey, diseases);
    }

    return diseases;
  } catch (err) {
    console.error("Groq fetch error:", err.message);
    return [];
  }
};

// ===== Parse Groq Response =====
const parseGroqResponse = (text) => {
  const blocks = text.split("---").filter((b) => b.trim());
  const diseases = [];

  blocks.forEach((block, index) => {
    try {
      const get = (key) => {
        const match = block.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z]+:|$)`, "s"));
        return match ? match[1].trim() : "";
      };

      const name = get("DISEASE");
      if (!name) return;

      const cropsRaw = get("CROPS");
      const affectedCrops = cropsRaw
        ? cropsRaw.split(",").map((c) => c.trim()).filter(Boolean)
        : ["Various crops"];

      diseases.push({
        id: 1000 + index,
        name,
        affectedCrops,
        description: get("DESCRIPTION") || "A plant disease affecting crop yield and quality.",
        symptoms: get("SYMPTOMS") || "Visible damage to leaves, stems, or fruit.",
        treatment: get("TREATMENT") || "Apply appropriate fungicides and practice crop rotation.",
        imageUrl: getImage(name),
      });
    } catch (e) {
      console.error("Parse error for block:", e.message);
    }
  });

  return diseases;
};

// ===== GET /api/diseases — All diseases =====
router.get("/", async (req, res) => {
  try {
    // Return base diseases immediately + try to enrich with AI
    const aiDiseases = await fetchFromGroq("");

    // Merge: base first, then AI ones that aren't duplicates
    const baseNames = new Set(BASE_DISEASES.map((d) => d.name.toLowerCase()));
    const unique = aiDiseases.filter((d) => !baseNames.has(d.name.toLowerCase()));

    const all = [
      ...BASE_DISEASES.map((d) => ({ ...d, imageUrl: getImage(d.name) })),
      ...unique,
    ];

    res.status(200).json(all);
  } catch (err) {
    // Fallback to base diseases if AI fails
    res.status(200).json(
      BASE_DISEASES.map((d) => ({ ...d, imageUrl: getImage(d.name) }))
    );
  }
});

// ===== GET /api/diseases/search?query= =====
router.get("/search", async (req, res) => {
  const query = req.query.query?.toLowerCase().trim() || "";

  if (!query) {
    return res.status(400).json({ message: "Provide a search term." });
  }

  try {
    // Search in base diseases first
    const baseMatches = BASE_DISEASES.filter((d) => {
      const fields = [
        d.name, d.description, d.symptoms, d.treatment,
        ...(d.affectedCrops || []),
      ].join(" ").toLowerCase();
      return fields.includes(query);
    }).map((d) => ({ ...d, imageUrl: getImage(d.name) }));

    // Also fetch AI diseases for the query
    const aiDiseases = await fetchFromGroq(query);
    const baseNames = new Set(baseMatches.map((d) => d.name.toLowerCase()));
    const aiMatches = aiDiseases.filter((d) => !baseNames.has(d.name.toLowerCase()));

    const results = [...baseMatches, ...aiMatches];

    if (results.length === 0) {
      return res.status(404).json({ message: "No diseases found for this search." });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== GET /api/diseases/:id =====
// ===== GET /api/diseases/:id =====
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // First check base diseases
  const baseDisease = BASE_DISEASES.find((d) => d.id === id);
  if (baseDisease) {
    return res.status(200).json({ ...baseDisease, imageUrl: getImage(baseDisease.name) });
  }

  // If not found in base, check AI-generated cache (id >= 1000)
  const cached = queryCache.get("") || [];
  const aiDisease = cached.find((d) => d.id === id);
  if (aiDisease) {
    return res.status(200).json(aiDisease);
  }

  // Try fetching from Groq cache for any query
  for (const [, diseases] of queryCache) {
    const found = diseases.find((d) => d.id === id);
    if (found) return res.status(200).json(found);
  }

  return res.status(404).json({ message: "Disease not found." });
});

export default router;