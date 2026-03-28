import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import logger from './logs/logger.js'
import predictRoutes from "./routes/predictRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import diseaseSearchRoutes from "./routes/diseaseSearch_routes.js";
import authRoutes from "./routes/userRoutes.js";

// ===== Load .env =====
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ===== Validate Required Env Vars =====
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

if (!process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY) {
  logger.error("At least one AI API key (GROQ_API_KEY or OPENROUTER_API_KEY) is required.");
  process.exit(1);
}

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error("MongoDB connection failed", { error: err.message });
    process.exit(1);
  });

// ===== Initialize Express =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== Security Middleware =====
app.use(helmet({ contentSecurityPolicy: false }));

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(process.cwd(), "public")));

// ===== Rate Limiters =====
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

// ===== Auth Rate Limiting =====
app.use("/api/register", authLimiter);
app.use("/api/login", authLimiter);

// ===== API Routes =====
app.use("/api", authRoutes);
app.use("/api/diseases", diseaseSearchRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/disease-info", diseaseRoutes);
app.use("/api/upload", predictRoutes);

// ===== AI Clients =====
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ===== AI Helper: Groq → OpenRouter =====
export const getAIResponse = async (systemInstruction, prompt) => {

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
      logger.info("AI response from Groq");
      return completion.choices[0].message.content.trim();
    } catch (err) {
      logger.warn("Groq failed: " + err.message);
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
          model: "meta-llama/llama-3.3-70b-instruct:free", // free model
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user",   content: prompt },
          ],
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        logger.info("AI response from OpenRouter (fallback)");
        return data.choices[0].message.content.trim();
      }
      throw new Error("Empty response from OpenRouter");
    } catch (err) {
      logger.error("OpenRouter failed: " + err.message);
      throw new Error("All AI providers failed.");
    }
  }

  throw new Error("No AI provider configured.");
};

// ===== Chatbot Endpoint =====
app.post("/api/chat", aiLimiter, async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ reply: "Message is required." });
  }
  try {
    const reply = await getAIResponse(
      "You are a plant expert chatbot. Short, clear answers max 20 words.",
      message.trim().slice(0, 500)
    );
    return res.json({ reply: reply || "Sorry, couldn't process your request." });
  } catch (err) {
    logger.error("Chatbot endpoint error", { error: err.message, stack: err.stack });
    return res.status(500).json({ reply: "Error processing request." });
  }
});

// ===== Fertilizer Recommendation Endpoint =====
app.post("/api/fertilizer", aiLimiter, async (req, res) => {
  const { nitrogen, phosphorous, pottasium, cropname } = req.body;
  if (nitrogen === undefined || phosphorous === undefined ||
      pottasium === undefined || !cropname || !cropname.trim()) {
    return res.status(400).json({ recommendation: "All fields are required." });
  }
  if (nitrogen < 0 || nitrogen > 100)
    return res.status(400).json({ recommendation: "Nitrogen must be between 0 and 100." });
  if (phosphorous < 0 || phosphorous > 100)
    return res.status(400).json({ recommendation: "Phosphorous must be between 0 and 100." });
  if (pottasium < 0 || pottasium > 100)
    return res.status(400).json({ recommendation: "Potassium must be between 0 and 100." });

  try {
    const recommendation = await getAIResponse(
      `You are an expert agronomist.
      For the given crop and NPK values:
      1. Provide Fertilizer/Product name.
      2. Provide Dosage per acre/hectare in plain text.
      3. Provide Instructions in plain text ONLY, concise and actionable.
         - Include when to apply and how to apply.
         - Do NOT add any *, -, bullets, or markdown symbols.
         - Do NOT repeat the word "Instructions" inside the content.
      Output MUST exactly match:
      Fertilizer: [name]
      Dosage: [dosage]
      Instructions: [instructions]`,
      `Crop: ${cropname.trim()}, N=${nitrogen}, P=${phosphorous}, K=${pottasium}`
    );
    return res.json({ recommendation: recommendation || "No recommendation available." });
  } catch (err) {
    logger.error("Fertilizer endpoint error", { error: err.message, stack: err.stack });
    return res.status(500).json({ recommendation: "Something went wrong. Please try again." });
  }
});

// ===== Crop Recommendation Endpoint =====
app.post("/api/crop", aiLimiter, async (req, res) => {
  const { nitrogen, phosphorous, pottasium, ph, rainfall } = req.body;
  if (nitrogen === undefined || phosphorous === undefined ||
      pottasium === undefined || ph === undefined || rainfall === undefined) {
    return res.status(400).json({ recommendation: "All fields are required." });
  }
  if (nitrogen < 0 || nitrogen > 100)
    return res.status(400).json({ recommendation: "Nitrogen must be between 0 and 100." });
  if (phosphorous < 0 || phosphorous > 100)
    return res.status(400).json({ recommendation: "Phosphorous must be between 0 and 100." });
  if (pottasium < 0 || pottasium > 100)
    return res.status(400).json({ recommendation: "Potassium must be between 0 and 100." });
  if (ph < 0 || ph > 14)
    return res.status(400).json({ recommendation: "pH must be between 0 and 14." });
  if (rainfall < 0 || rainfall > 5000)
    return res.status(400).json({ recommendation: "Rainfall must be between 0 and 5000 mm." });

  try {
    const recommendation = await getAIResponse(
      "You are an agronomist. Suggest best crop based on N, P, K, pH, rainfall.",
      `Best crop for N=${nitrogen}, P=${phosphorous}, K=${pottasium}, pH=${ph}, rainfall=${rainfall}mm`
    );
    return res.json({ recommendation: recommendation || "No recommendation available." });
  } catch (err) {
    logger.error("Crop endpoint error", { error: err.message, stack: err.stack });
    return res.status(500).json({ recommendation: "Something went wrong. Please try again." });
  }
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({ success: false, message: "An unexpected error occurred." });
});

// ===== Serve React Build =====
app.use(express.static(path.join(process.cwd(), "frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));