/**
 * server.js — AI Resume Builder Backend
 *
 * Express server that exposes a single POST endpoint:
 *   POST /generate-resume
 *
 * The route receives resume details from the frontend,
 * sends them to OpenAI's Chat API, and returns a
 * professionally formatted resume as plain text.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// ── Load environment variables ────────────────────────────────────────────────
dotenv.config();

// ── Validate required env variables at startup ───────────────────────────────
if (!process.env.OPENAI_API_KEY) {
  console.error("❌  OPENAI_API_KEY is missing. Add it to your .env file.");
  process.exit(1);
}

// ── Initialise OpenAI client ─────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Restrict in production
    methods: ["POST", "GET"],
  })
);
app.use(express.json({ limit: "2mb" })); // Parse JSON request bodies

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI Resume Builder API is running 🚀" });
});

// ── POST /generate-resume ─────────────────────────────────────────────────────
/**
 * Expects a JSON body with the following fields:
 *   name, email, phone, careerSummary,
 *   skills, education, workExperience, projects, certifications
 */
app.post("/generate-resume", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      careerSummary,
      skills,
      education,
      workExperience,
      projects,
      certifications,
    } = req.body;

    // ── Input validation ────────────────────────────────────────────────────
    const missing = [];
    if (!name?.trim()) missing.push("name");
    if (!email?.trim()) missing.push("email");
    if (!skills?.trim()) missing.push("skills");
    if (!education?.trim()) missing.push("education");

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // ── Build prompt ────────────────────────────────────────────────────────
    const prompt = `
You are an expert resume writer. Using the details below, generate a polished, 
ATS-friendly professional resume. Format it clearly with section headings in
ALL CAPS followed by a divider line (e.g. "WORK EXPERIENCE\n──────────────────").
Keep bullet points concise and start each with a strong action verb.
Do NOT add information that is not provided. Keep the tone professional.

──────────────────── CANDIDATE DETAILS ────────────────────

Name            : ${name}
Email           : ${email}
Phone           : ${phone || "Not provided"}
Career Summary  : ${careerSummary || "Not provided"}

SKILLS
${skills}

EDUCATION
${education}

WORK EXPERIENCE
${workExperience || "Not provided"}

PROJECTS
${projects || "Not provided"}

CERTIFICATIONS
${certifications || "Not provided"}

────────────────────────────────────────────────────────────

Now generate the full professional resume:
`;

    // ── Call OpenAI API ─────────────────────────────────────────────────────
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective; change to "gpt-4o" for higher quality
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer who creates clean, ATS-optimised resumes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const resumeText = completion.choices[0].message.content;

    // ── Send response ────────────────────────────────────────────────────────
    return res.status(200).json({ resume: resumeText });
  } catch (error) {
    console.error("OpenAI API error:", error?.message || error);

    // Surface a meaningful error to the client
    if (error?.status === 401) {
      return res.status(500).json({ error: "Invalid OpenAI API key." });
    }
    if (error?.status === 429) {
      return res
        .status(429)
        .json({ error: "OpenAI rate limit reached. Please try again later." });
    }

    return res
      .status(500)
      .json({ error: "Failed to generate resume. Please try again." });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless deployment
module.exports = app;
