const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Multer setup to store uploaded image in memory
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to convert buffer to Generative Part format
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

// Waste Analysis API Route
app.post("/api/analyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image file." });
        }

        const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

        const prompt = `Analyze this waste image. Identify its category (e.g., Plastic, Paper, Glass, Organic, Metal, Electronic, etc.), confidence percentage (e.g., 95%), and a brief disposal suggestion. 
        You must return the response strictly in valid JSON format with these exact keys:
        {
          "category": "...",
          "confidence": "...",
          "suggestion": "..."
        }`;

        // Updated to gemini-3.8-flash model as requested by API
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [prompt, imagePart],
        });

        let textResponse = response.text.trim();
        
        if (textResponse.startsWith("```json")) {
            textResponse = textResponse.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (textResponse.startsWith("```")) {
            textResponse = textResponse.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const jsonResult = JSON.parse(textResponse);
        res.json(jsonResult);

    } catch (error) {
        console.error("Error analyzing waste:", error);
        res.status(500).json({ error: "Failed to analyze image with AI." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});