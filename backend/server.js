// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import path from "path";
// import fs from "fs";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Routes
// import postRoutes from "./routes/postRoutes.js";
// import diseaseRoutes from "./routes/diseaseRoutes.js";
// import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";


// // Load env
// const envPath = path.resolve(process.cwd(), ".env"); // backend/.env
// dotenv.config({ path: envPath });
// console.log("Using .env at:", envPath);

// // MongoDB
// import mongoose from "mongoose";
// mongoose.connect(process.env.MONGO_URI, {})
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB error:", err));

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ===== Middleware =====
// app.use(cors());
// app.use(bodyParser.json());

// // Serve static files (CSS, JS, images)
// app.use(express.static(path.join(process.cwd(), "public"))); // put your static files in backend/public

// // Helmet + CSP
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "https://fonts.googleapis.com"],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         scriptSrc: ["'self'"],
//       },
//     },
//   })
// );

// // API routes
// app.use("/api/diseases", diseaseSearchRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/get-disease-info", diseaseRoutes);

// // Google Generative AI
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   console.error("❌ GEMINI_API_KEY missing!");
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // ===== Routes =====

// // Chatbot
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: "❌ No message provided!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are a plant expert chatbot. Short, clear answers max 20 words.",
//     });

//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: message }] }],
//     });

//     let reply = "";
//     for await (const chunk of result.stream) {
//       reply += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ reply: reply.trim() || "Sorry, couldn't process." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ reply: "Error processing request!" });
//   }
// });

// // Fertilizer
// app.post("/fertilizer", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, cropname } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !cropname) 
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest fertilizer based on N, P, K.",
//     });

//     const prompt = `Fertilizer for ${cropname} with N=${nitrogen}, P=${phosphorous}, K=${pottasium}`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // Crop
// app.post("/crop", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !ph || !rainfall) 
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall.",
//     });

//     const prompt = `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Start server =====
// app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));








// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import path from "path";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import mongoose from "mongoose";

// // ===== Routes =====
// import postRoutes from "./routes/postRoutes.js";
// import diseaseRoutes from "./routes/diseaseRoutes.js";
// import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";
// import authRoutes from "./routes/userRoutes.js";

// // ===== Load env =====
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// console.log("Using .env at:", path.resolve(process.cwd(), ".env"));

// // ===== MongoDB =====
// mongoose
//   .connect(process.env.MONGO_URI, {
//     // ⚠️ these options are deprecated, so you can remove them safely
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ===== Express App =====
// const app = express();
// const PORT = process.env.PORT || 5000;

// // ===== Middleware =====
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static(path.join(process.cwd(), "public")));

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "https://fonts.googleapis.com"],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         scriptSrc: ["'self'"],
//       },
//     },
//   })
// );

// // ===== API Routes (Standardized) =====
// app.use("/api", authRoutes);              // ✅ login, register
// app.use("/api/diseases", diseaseSearchRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/disease-info", diseaseRoutes);

// // ===== Google Generative AI =====
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   console.error("❌ GEMINI_API_KEY missing!");
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // ===== Chatbot Endpoint =====
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: "❌ No message provided!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are a plant expert chatbot. Short, clear answers max 20 words.",
//     });

//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: message }] }],
//     });

//     let reply = "";
//     for await (const chunk of result.stream) {
//       reply += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ reply: reply.trim() || "Sorry, couldn't process." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ reply: "Error processing request!" });
//   }
// });

// // ===== Fertilizer Recommendation =====
// app.post("/api/fertilizer", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, cropname } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !cropname)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest fertilizer based on N, P, K.",
//     });

//     const prompt = `Fertilizer for ${cropname} with N=${nitrogen}, P=${phosphorous}, K=${pottasium}`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Crop Recommendation =====
// app.post("/api/crop", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !ph || !rainfall)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall.",
//     });

//     const prompt = `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Start Server =====
// app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));




















// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import path from "path";
// import mongoose from "mongoose";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // ===== Routes =====
// import postRoutes from "./routes/postRoutes.js";
// import diseaseRoutes from "./routes/diseaseRoutes.js";
// import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";
// import authRoutes from "./routes/userRoutes.js";

// // ===== Load env =====
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// console.log("Using .env at:", path.resolve(process.cwd(), ".env"));

// // ===== MongoDB =====
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ===== Express App =====
// const app = express();
// const PORT = process.env.PORT || 5000;

// // ===== Middleware =====
// // CORS: allow only your frontend
// app.use(cors({
//   origin: "https://farmai-2-m5gc.onrender.com", // frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(bodyParser.json());
// app.use(express.static(path.join(process.cwd(), "public")));

// // Helmet: secure headers
// app.use(helmet({
//   contentSecurityPolicy: false // disable CSP temporarily for production scripts
// }));

// // ===== API Routes =====
// app.use("/api", authRoutes);              // login, register
// app.use("/api/diseases", diseaseSearchRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/disease-info", diseaseRoutes);

// // ===== Google Generative AI =====
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   console.error("❌ GEMINI_API_KEY missing!");
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // ===== Chatbot Endpoint =====
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: "❌ No message provided!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are a plant expert chatbot. Short, clear answers max 20 words.",
//     });

//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: message }] }],
//     });

//     let reply = "";
//     for await (const chunk of result.stream) {
//       reply += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ reply: reply.trim() || "Sorry, couldn't process." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ reply: "Error processing request!" });
//   }
// });

// // ===== Fertilizer Recommendation =====
// app.post("/api/fertilizer", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, cropname } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !cropname)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest fertilizer based on N, P, K.",
//     });

//     const prompt = `Fertilizer for ${cropname} with N=${nitrogen}, P=${phosphorous}, K=${pottasium}`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Crop Recommendation =====
// app.post("/api/crop", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !ph || !rainfall)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall.",
//     });

//     const prompt = `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Start Server =====
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));












// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import path from "path";
// import mongoose from "mongoose";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // ===== Routes =====
// import postRoutes from "./routes/postRoutes.js";
// import diseaseRoutes from "./routes/diseaseRoutes.js";
// import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";
// import authRoutes from "./routes/userRoutes.js";

// // ===== Load .env =====
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// console.log("🌱 Using .env from:", path.resolve(process.cwd(), ".env"));

// // ===== MongoDB Connection =====
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   });

// // ===== Initialize Express =====
// const app = express();
// const PORT = process.env.PORT || 5000;

// // ===== Middleware =====
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "*", // Default: allow all (only for testing)
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(bodyParser.json());
// app.use(express.static(path.join(process.cwd(), "public")));

// app.use(helmet({
//   contentSecurityPolicy: false
// }));

// // ===== API Routes =====
// app.use("/api", authRoutes);
// app.use("/api/diseases", diseaseSearchRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/disease-info", diseaseRoutes);

// // ===== Google Gemini Setup =====
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   console.error("❌ GEMINI_API_KEY is missing!");
//   process.exit(1);
// }
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // ===== Chatbot Endpoint =====
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: "❌ No message provided!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are a plant expert chatbot. Short, clear answers max 20 words."
//     });

//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: message }] }]
//     });

//     let reply = "";
//     for await (const chunk of result.stream) {
//       reply += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ reply: reply.trim() || "Sorry, couldn't process." });
//   } catch (err) {
//     console.error("❌ Chatbot error:", err);
//     res.status(500).json({ reply: "Error processing request!" });
//   }
// });

// // ===== Fertilizer Recommendation Endpoint =====
// app.post("/api/fertilizer", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, cropname } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !cropname)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest fertilizer based on N, P, K."
//     });

//     const prompt = `Fertilizer for ${cropname} with N=${nitrogen}, P=${phosphorous}, K=${pottasium}`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }]
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error("❌ Fertilizer API error:", err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Crop Recommendation Endpoint =====
// app.post("/api/crop", async (req, res) => {
//   try {
//     const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;
//     if (!nitrogen || !phosphorous || !pottasium || !ph || !rainfall)
//       return res.status(400).json({ recommendation: "❌ Missing fields!" });

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       systemInstruction: "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall."
//     });

//     const prompt = `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`;
//     const result = await model.generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }]
//     });

//     let recommendation = "";
//     for await (const chunk of result.stream) {
//       recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     }

//     res.json({ recommendation: recommendation.trim() || "No recommendation." });
//   } catch (err) {
//     console.error("❌ Crop API error:", err);
//     res.status(500).json({ recommendation: "⚠️ Something went wrong." });
//   }
// });

// // ===== Start Server =====
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });






import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ===== Routes =====
import postRoutes from "./routes/postRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";
import authRoutes from "./routes/userRoutes.js";

// ===== Load .env =====
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log("🌱 Using .env from:", path.resolve(process.cwd(), ".env"));

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ===== Initialize Express =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Default: allow all (only for testing)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use(helmet({
  contentSecurityPolicy: false
}));

// ===== API Routes =====
app.use("/api", authRoutes);
app.use("/api/diseases", diseaseSearchRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/disease-info", diseaseRoutes);

// ===== Google Gemini Setup =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ===== Chatbot Endpoint =====
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "❌ No message provided!" });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a plant expert chatbot. Short, clear answers max 20 words."
    });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: message }] }]
    });

    let reply = "";
    for await (const chunk of result.stream) {
      reply += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    res.json({ reply: reply.trim() || "Sorry, couldn't process." });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    res.status(500).json({ reply: "Error processing request!" });
  }
});

// ===== Fertilizer Recommendation Endpoint =====
app.post("/api/fertilizer", async (req, res) => {
  try {
    const { nitrogen, phosphorous, pottasium, cropname } = req.body;
    if (!nitrogen || !phosphorous || !pottasium || !cropname)
      return res.status(400).json({ recommendation: "Missing fields!" });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an agronomist. Suggest fertilizer based on N, P, K."
    });

    const prompt = `Fertilizer for ${cropname} with N=${nitrogen}, P=${phosphorous}, K=${pottasium}`;
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let recommendation = "";
    for await (const chunk of result.stream) {
      recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    res.json({ recommendation: recommendation.trim() || "No recommendation." });
  } catch (err) {
    console.error("Fertilizer API error:", err);
    res.status(500).json({ recommendation: "Something went wrong." });
  }
});

app.post("/api/crop", async (req, res) => {
  try {
    const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;

    // ===== Backend Validation =====
    if (
      nitrogen === undefined || phosphorous === undefined ||
      pottasium === undefined || ph === undefined ||
      rainfall === undefined
    ) {
      return res.status(400).json({ recommendation: "Missing fields!" });
    }

    if (nitrogen < 0 || nitrogen > 100) return res.status(400).json({ recommendation: "Invalid Nitrogen value!" });
    if (phosphorous < 0 || phosphorous > 100) return res.status(400).json({ recommendation: "Invalid Phosphorous value!" });
    if (pottasium < 0 || pottasium > 100) return res.status(400).json({ recommendation: "Invalid Potassium value!" });
    if (ph < 0 || ph > 7) return res.status(400).json({ recommendation: "Invalid pH value!" });
    if (rainfall < 0 || rainfall > 5000) return res.status(400).json({ recommendation: "Invalid Rainfall value!" });

    // Proceed with AI model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall."
    });

    const prompt = `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`;
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let recommendation = "";
    for await (const chunk of result.stream) {
      recommendation += chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    res.json({ recommendation: recommendation.trim() || "No recommendation." });
  } catch (err) {
    console.error("Crop API error:", err);
    res.status(500).json({ recommendation: "Something went wrong." });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve React build folder
app.use(express.static(path.join(process.cwd(), "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
});
