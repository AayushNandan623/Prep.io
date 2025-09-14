import { GoogleGenAI } from "@google/genai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import mammoth from "mammoth";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const parseResume = async (file) => {
  const { buffer, mimetype } = file;
  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimetype === "text/plain") {
    return buffer.toString("utf8");
  } else {
    throw new Error(
      "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
    );
  }
};

export const generateQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded." });
    }
    const resumeText = await parseResume(req.file);
    const questionType = req.body.questionType || "General";
    const questionCount = req.body.questionCount ? req.body.questionCount : 5;
    const prompt = `
          You are an expert technical recruiter and interviewer.
          Based on the following resume text and the category "${questionType}", generate exactly "${questionCount}" insightful interview questions.
          Your response MUST be a clean, valid JSON array of strings, and nothing else.
          Do not include any introductory text, markdown formatting (like \`\`\`json), or any other text outside of the JSON array.
          Resume Text:
          ---
          ${resumeText}
          ---
        `;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const jsonResponseText = result.text;
    const questions = JSON.parse(jsonResponseText);
    res.json({ questions });
  } catch (error) {
    console.error("Error in generateQuestions:", error);
    if (error.message?.includes("Unsupported file type")) {
      return res.status(400).json({ error: error.message });
    }

    if (error.status >= 500) {
      console.log(error);
      return res.status(error.status).json({
        error: `The AI service is currently unavailable. Please try again later. (Status: ${error.status})`,
      });
    }

    if (error.status >= 400) {
      return res.status(error.status).json({
        error: `There was an issue with the AI service request. Please check your configuration. (Status: ${error.status})`,
      });
    }

    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required." });
    }
    const prompt = `
      You are an expert interview coach. You are given an interview question and the user's answer to it.
      Your task is to provide constructive feedback on the answer.
      Structure your feedback in two parts, using these exact headings in markdown:
      1. A heading named "What went well".
      2. A heading named "Areas for improvement".
      
      Be encouraging but also provide specific, actionable advice. Use bullet points within each section.
      Start your response directly with the first heading. Do not add any other introductory text.

      Question:
      ---
      ${question}
      ---
      User's Answer:
      ---
      ${answer}
      ---
    `;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const feedback = result.text;
    res.json({ feedback });
  } catch (error) {
    if (error.status >= 500) {
      return res.status(error.status).json({
        error: `The AI service is currently unavailable. Please try again later. (Status: ${error.status})`,
      });
    }
    if (error.status >= 400) {
      return res.status(error.status).json({
        error: `There was an issue with the AI service request. Please check your configuration. (Status: ${error.status})`,
      });
    }
    res.status(500).json({
      error: "An internal server error occurred while getting feedback.",
    });
  }
};
