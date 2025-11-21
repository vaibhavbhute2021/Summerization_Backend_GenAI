import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://vaibhavbhute2021.github.io", // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST API: Summarize content into bullet points
app.post("/summarize", async (req, res) => {
  try {
    let { content } = req.body;
    //console.log(req.body);
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content must be a valid string." });
    }

    // 🔹 Sanitize content
    content = content
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You summarize text into clear, short bullet points." },
        { role: "user", content: `Summarize the following text into bullet points:\n\n${content}` }
      ]
    });

    const summary = response.choices[0].message.content;

    return res.json({ summary });

  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to summarize content." });
  }
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});