/**
 * App.jsx — Root component with the full split-screen layout.
 *
 * Layout:
 *   Left  (40%) — Resume input form panel
 *   Right (60%) — Live resume preview panel
 */

import { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import LoadingSpinner from "./components/LoadingSpinner";
import { generateResume } from "./api/resumeApi";

// ── Mock resume for initial preview on load ──────────────────────────────────
const MOCK_RESUME = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 234-5678",
  careerSummary:
    "Results-driven Full-Stack Developer with 4+ years of experience building scalable web applications. Passionate about clean code, user-centered design, and leveraging AI to solve complex problems.",
  skills: "React, Node.js, TypeScript, Python, PostgreSQL, AWS, Docker, Git, REST APIs, GraphQL",
  education:
    "B.Sc. Computer Science — Stanford University (2018–2022)\nGPA: 3.8/4.0 | Dean's List 2020–2022",
  workExperience:
    "Senior Frontend Developer — TechCorp Inc. (2022–Present)\n• Built React dashboard serving 100k+ users\n• Reduced bundle size by 42%\n\nJunior Developer — StartupXYZ (2021–2022)\n• Developed REST APIs with Node.js & Express",
  projects:
    "AI Chat Assistant — React + OpenAI API (github.com/alex/ai-chat)\n• Used by 5,000+ users monthly\n\nPortfolio Builder SaaS — Next.js + Stripe\n• Processed $50k in payments",
  certifications:
    "AWS Certified Developer (2023)\nGoogle Cloud Associate (2022)",
};

function App() {
  const [resumeData, setResumeData] = useState(MOCK_RESUME);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");
  const [generated, setGenerated]   = useState(false); // True after first AI call

  // ── Handle form submit ──────────────────────────────────────────────────────
  const handleFormSubmit = async (formData) => {
    setError("");
    setIsLoading(true);
    setGenerated(false);

    try {
      const aiText = await generateResume(formData);
      // Update preview with AI output fallback to raw text
      setResumeData({ ...formData, aiText });
      setGenerated(true);
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Generation failed. Please try again.";
      setError(msg);
      // Still update preview with the user's raw data
      setResumeData(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans">
      {isLoading && <LoadingSpinner />}

      {/* ── Top Navbar ── */}
      <nav className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/30">
              R
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Resume<span className="text-violet-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              ✦ Powered by GPT-4
            </span>
          </div>
        </div>
      </nav>

      {/* ── Split-Screen Body ── */}
      <div className="flex h-[calc(100vh-65px)] max-w-screen-2xl mx-auto">

        {/* ── LEFT PANEL: Form (40%) ─────────────────────────────────── */}
        <aside className="w-[42%] min-w-[340px] border-r border-white/5 overflow-y-auto scrollbar-thin bg-slate-900/40">
          <div className="p-6">
            {/* Panel header */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">
                Build Your Resume
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Fill in your details — AI will do the rest.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-300 rounded-xl px-4 py-3 text-sm animate-fade-in">
                <span className="mt-0.5 text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <ResumeForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        </aside>

        {/* ── RIGHT PANEL: Preview (60%) ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-slate-800/20 p-8">
          <ResumePreview data={resumeData} generated={generated} />
        </main>
      </div>
    </div>
  );
}

export default App;
