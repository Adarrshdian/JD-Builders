// backend/server.js (CommonJS, Node 18+, fetch + LLaMA via Groq)

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '.env') });

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

// ------------ LLaMA CALLER (ARRAY-BASED) - MULTI-VARIANT ------------
async function enhanceWithLlamaFromArray(paramsArray, tone = 'professional') {
  const formattedContent = paramsArray
    .map(p => `${p.key}: ${p.value}`)
    .join("\n");

  const toneInstructions = {
    professional: 'Use formal, corporate language. Professional and polished.',
    friendly: 'Use warm, conversational language. Approachable and engaging.',
    concise: 'Use brief, direct language. Clear and to the point.',
    enthusiastic: 'Use energetic, exciting language. Dynamic and passionate.'
  };

  const toneGuide = toneInstructions[tone] || toneInstructions.professional;

  // Generate 3 variants in one call
  const systemPrompt = `
You are an HR content assistant. Generate 3 different versions of job posting content:

1. SHORT LINKEDIN POST (150-200 words)
- Brief and engaging
- Suitable for LinkedIn feed
- 8-12 lines maximum
- ${toneGuide}

2. LONG LINKEDIN POST (300-400 words)
- Detailed and comprehensive
- Include company culture, benefits, growth opportunities
- 20-25 lines
- ${toneGuide}

3. ATS-FRIENDLY JOB DESCRIPTION (250-350 words)
- Structured format: Overview, Responsibilities, Requirements, Benefits
- Keyword-optimized
- Clear sections with bullet points
- Professional tone (regardless of selected tone)

Format your response EXACTLY like this:

=== SHORT POST ===
[Short post content here]

=== LONG POST ===
[Long post content here]

=== ATS DESCRIPTION ===
[ATS description content here]

Rules for all variants:
- Keep meaning accurate
- Improve clarity and grammar
- No emojis
- Professional formatting
  `;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: formattedContent }
    ],
    temperature: 0.7
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

// ------------ PROMPT MODE (TEXT ONLY) - MULTI-VARIANT ------------
async function enhanceWithLlamaFromText(text, tone = 'professional') {
  const toneInstructions = {
    professional: 'Use formal, corporate language. Professional and polished.',
    friendly: 'Use warm, conversational language. Approachable and engaging.',
    concise: 'Use brief, direct language. Clear and to the point.',
    enthusiastic: 'Use energetic, exciting language. Dynamic and passionate.'
  };

  const toneGuide = toneInstructions[tone] || toneInstructions.professional;

  const systemPrompt = `
You are an HR assistant. Generate 3 different versions of job posting content:

1. SHORT LINKEDIN POST (150-200 words)
- Brief and engaging
- Suitable for LinkedIn feed
- 8-12 lines maximum
- ${toneGuide}

2. LONG LINKEDIN POST (300-400 words)
- Detailed and comprehensive
- Include company culture, benefits, growth opportunities
- 20-25 lines
- ${toneGuide}

3. ATS-FRIENDLY JOB DESCRIPTION (250-350 words)
- Structured format: Overview, Responsibilities, Requirements, Benefits
- Keyword-optimized
- Clear sections with bullet points
- Professional tone (regardless of selected tone)

Format your response EXACTLY like this:

=== SHORT POST ===
[Short post content here]

=== LONG POST ===
[Long post content here]

=== ATS DESCRIPTION ===
[ATS description content here]

Rules for all variants:
- Improve grammar and clarity
- Keep original meaning
- No emojis
- Professional formatting
  `;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: text }
    ],
    temperature: 0.7
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

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// ---------- PROMPT MODE ----------
app.post("/enhance", async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text input is required." });
    }

    const enhanced = await enhanceWithLlamaFromText(text, tone);
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
      tone,
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

    const enhanced = await enhanceWithLlamaFromArray(params, tone);
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
