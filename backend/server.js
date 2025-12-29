// backend/server.js (CommonJS, Node 18+, fetch + LLaMA via Groq)

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ------------ LLaMA (Groq) setup ------------
const apiKey = process.env.LLAMA_API_KEY;

if (!apiKey) {
  console.error("❌ LLAMA_API_KEY is missing in .env file");
  process.exit(1);
}

// Groq OpenAI-compatible endpoint
const LLAMA_URL = "https://api.groq.com/openai/v1/chat/completions";

// ------------ LLaMA CALLER (ARRAY-BASED) ------------
async function enhanceWithLlamaFromArray(paramsArray) {
  const formattedContent = paramsArray
    .map(p => `${p.key}: ${p.value}`)
    .join("\n");

  const systemPrompt = `
You are an HR content assistant.
Convert the following job details into a clean, professional LinkedIn job post.

Rules:
- Keep meaning accurate
- Improve clarity and grammar
- Professional tone
- Structured but concise
- Suitable for a square LinkedIn post
- At most 20-23 lines
- No emojis
  `;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: formattedContent }
    ],
    temperature: 0.6
  };

  const res = await fetch(LLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`LLaMA HTTP error ${res.status}: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Failed to parse LLaMA JSON: ${raw}`);
  }

  if (!data?.choices?.[0]?.message?.content) {
    throw new Error("Unexpected LLaMA response format");
  }

  return data.choices[0].message.content;
}

// ------------ PROMPT MODE (TEXT ONLY) ------------
async function enhanceWithLlamaFromText(text) {
  const systemPrompt = `
You are an HR assistant.
Rewrite the following content into a professional LinkedIn job post.

Rules:
- Improve grammar and clarity
- Keep original meaning
- Professional tone
- Optimized for LinkedIn feed
- Short and structured
-atmost of 20-23 lines
  `;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: text }
    ],
    temperature: 0.6
  };

  const res = await fetch(LLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`LLaMA HTTP error ${res.status}: ${raw}`);
  }

  const data = JSON.parse(raw);
  return data.choices[0].message.content;
}

// ------------ ROUTES ------------

// Health check
app.get("/", (_req, res) => {
  res.send("✅ backend is running");
});

// ---------- PROMPT MODE ----------
app.post("/enhance", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text input is required." });
    }

    const enhanced = await enhanceWithLlamaFromText(text);
    res.json({ enhanced });

  } catch (error) {
    console.error("❌ Error in /enhance:", error);
    res.status(500).json({
      error: "Failed to enhance content. " + (error.message || "")
    });
  }
});

// ---------- FORM MODE ----------
app.post("/formenhance", async (req, res) => {
  try {
    const {
      companyName,
      role,
      skills,
      eligibility,
      extraFields = {}
    } = req.body;

    const params = [];

    if (companyName) params.push({ key: "Company", value: companyName });
    if (role) params.push({ key: "Role", value: role });
    if (skills) params.push({ key: "Skills", value: skills });
    if (eligibility) params.push({ key: "Eligibility", value: eligibility });

    Object.entries(extraFields).forEach(([key, value]) => {
      params.push({ key, value });
    });

    if (params.length === 0) {
      return res.status(400).json({
        error: "At least one form field is required."
      });
    }

    const enhanced = await enhanceWithLlamaFromArray(params);
    res.json({ enhanced });

  } catch (error) {
    console.error("❌ Error in /formenhance:", error);
    res.status(500).json({
      error: "Failed to enhance form content. " + (error.message || "")
    });
  }
});

// ------------ START SERVER ------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:" + PORT);
});
