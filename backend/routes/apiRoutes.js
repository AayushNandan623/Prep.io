import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  generateQuestions,
  getFeedback,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/generate-questions", upload.single("resume"), generateQuestions);
router.post("/get-feedback", getFeedback);

export default router;
