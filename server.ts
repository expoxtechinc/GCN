import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Initialization
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Local Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are GCN-AI, the advanced intelligence of the Global Connectivity Network. You help users with social connectivity, translation, and content creation. Be futuristic, helpful, and professional.",
        }
      });
      const result = await model;
      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Content Moderation Endpoint
  app.post("/api/ai/moderate", async (req, res) => {
    try {
      const { content } = req.body;
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following content for toxicity, hate speech, or inappropriate material in a social media context. Return a JSON object with 'isSafe' (boolean) and 'reason' (string).\n\nContent: ${content}`,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json(JSON.parse(response.text));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GCN Server running on http://localhost:${PORT}`);
  });
}

startServer();
