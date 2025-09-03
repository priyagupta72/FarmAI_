import express from "express";
import { getDiseaseInfo } from "../controllers/diseaseController.js";

const router = express.Router();

router.post("/", getDiseaseInfo);

export default router;