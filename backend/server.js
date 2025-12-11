// backend/server.js (CommonJS, uses fetch + LLaMA via Groq)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // loads backend/.env
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// ------------ LLaMA (Groq) setup ------------
const apiKey = process.env.LLAMA_API_KEY;

if (!apiKey) {
  console.error("❌ LLAMA_API_KEY is missing in .env file");
  process.exit(1);
}

// Groq's OpenAI-compatible chat completions endpoint
const LLAMA_URL = "https://api.groq.com/openai/v1/chat/completions";

// Call LLaMA using Node's built-in fetch (Node 18+)
async function enhanceWithLlama(text) {
  const systemPrompt = `
You are an assistant for HR. Rewrite this job opening text as a clear,
professional LinkedIn job post. Keep the same meaning, improve grammar,
add structure and make it attractive but still professional.
  `;

  const body = {
    model: "llama-3.3-70b-versatile", // or another LLaMA model name from Groq
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    temperature: 0.7,
  };

  const res = await fetch(LLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`LLaMA HTTP error ${res.status}: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse LLaMA JSON: ${raw}`);
  }

  // Expected OpenAI-style structure: choices[0].message.content
  if (
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message ||
    !data.choices[0].message.content
  ) {
    throw new Error(
      "Unexpected LLaMA response format: " + JSON.stringify(data)
    );
  }

  return data.choices[0].message.content;
}

// ------------ Routes ------------

// Optional health check
app.get("/", (_req, res) => {
  res.send("backend is running");
});

// Main enhance endpoint your frontend calls
app.post("/enhance", async (req, res) => {
  try {
    console.log(req.body);
    const { text } = req.body;
    console.log(text);
    console.log(typeof text);

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text input is required." });
    }

    const enhanced = await enhanceWithLlama(text);
    res.json({ enhanced });
  } catch (error) {
    console.error("❌ Error in /enhance endpoint:", error);
    res.status(500).json({
      error:
        "Failed to enhance content due to an internal server error. " +
        (error.message || ""),
    });
  }
});

// ------------ Start server ------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:" + PORT);
});
