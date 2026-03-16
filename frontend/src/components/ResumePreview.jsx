/**
 * ResumePreview.jsx
 *
 * Right-side preview panel (60% width).
 * Shows a professional, printer-ready resume card
 * built from the current form data / AI output.
 *
 * Also provides the "Download PDF" button.
 */

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Mail, Phone, MapPin, Download,
  Briefcase, GraduationCap, Lightbulb,
  FolderGit2, Award, FileText,
  Eye,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Parse a multi-line text block into an array of lines/bullets
const parseLines = (text = "") =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

// Parse comma-separated skills into an array
const parseSkills = (text = "") =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ── Sub-components ────────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-violet-600 flex-shrink-0" />
      <h3 className="text-xs font-bold text-violet-700 uppercase tracking-widest">
        {title}
      </h3>
      <div className="flex-1 h-px bg-violet-200" />
    </div>
    {children}
  </div>
);

const Bullet = ({ text }) => {
  const clean = text.replace(/^[-•*]\s*/, "");
  if (!clean) return null;
  const isBullet = /^[-•*]/.test(text);
  if (isBullet) {
    return (
      <p className="text-xs text-slate-600 flex gap-2 leading-relaxed mb-0.5">
        <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
        <span>{clean}</span>
      </p>
    );
  }
  // Bold if it looks like a heading (no leading spaces, no bullet)
  return (
    <p className="text-sm font-semibold text-slate-800 mt-2 first:mt-0 leading-snug">
      {text}
    </p>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ResumePreview = ({ data, generated }) => {
  const cardRef = useRef(null);

  const {
    name, email, phone,
    careerSummary, skills,
    education, workExperience,
    projects, certifications,
    aiText,
  } = data || {};

  // ── PDF Download ────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    const el = cardRef.current;
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, w, h);
      pdf.save(`${name || "resume"}.pdf`);
    } catch {
      alert("PDF generation failed. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ── Preview Toolbar ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-300">Resume Preview</span>
          {generated && (
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full ml-1">
              ✦ AI Enhanced
            </span>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-semibold text-white
                     bg-gradient-to-r from-emerald-600 to-teal-600
                     hover:from-emerald-500 hover:to-teal-500
                     px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20
                     transition-all duration-150 active:scale-95"
        >
          <Download size={13} /> Download PDF
        </button>
      </div>

      {/* ── Resume Card ── */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 px-8 py-8">
          <h1
            className="text-3xl font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name || "Your Name"}
          </h1>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 mt-3">
            {email && (
              <span className="flex items-center gap-1.5 text-violet-200 text-xs">
                <Mail size={12} /> {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1.5 text-violet-200 text-xs">
                <Phone size={12} /> {phone}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* If AI generated full text, render that instead */}
          {aiText ? (
            <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
              {aiText}
            </pre>
          ) : (
            <>
              {/* ── Career Summary ── */}
              {careerSummary && (
                <Section icon={FileText} title="Professional Summary">
                  <p className="text-xs text-slate-600 leading-relaxed">{careerSummary}</p>
                </Section>
              )}

              {/* ── Two-column body ── */}
              <div className="flex gap-6">

                {/* Main column */}
                <div className="flex-1">
                  {/* Work Experience */}
                  {workExperience && (
                    <Section icon={Briefcase} title="Work Experience">
                      {parseLines(workExperience).map((line, i) => (
                        <Bullet key={i} text={line} />
                      ))}
                    </Section>
                  )}

                  {/* Projects */}
                  {projects && (
                    <Section icon={FolderGit2} title="Projects">
                      {parseLines(projects).map((line, i) => (
                        <Bullet key={i} text={line} />
                      ))}
                    </Section>
                  )}
                </div>

                {/* Sidebar column */}
                <div className="w-48 flex-shrink-0">
                  {/* Skills */}
                  {skills && (
                    <Section icon={Lightbulb} title="Skills">
                      <div className="flex flex-wrap gap-1">
                        {parseSkills(skills).map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Education */}
                  {education && (
                    <Section icon={GraduationCap} title="Education">
                      {parseLines(education).map((line, i) => (
                        <p key={i} className={`text-xs leading-relaxed ${
                          i === 0 ? "font-semibold text-slate-800" : "text-slate-600"
                        }`}>
                          {line}
                        </p>
                      ))}
                    </Section>
                  )}

                  {/* Certifications */}
                  {certifications && (
                    <Section icon={Award} title="Certifications">
                      {parseLines(certifications).map((line, i) => (
                        <p key={i} className="text-xs text-slate-600 leading-relaxed mb-1">
                          🏅 {line.replace(/^[-•*]\s*/, "")}
                        </p>
                      ))}
                    </Section>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tip */}
      <p className="text-center text-xs text-slate-600 mt-4">
        Click <strong className="text-slate-400">Generate Resume with AI</strong> on the left to enhance this preview with GPT-4.
      </p>
    </div>
  );
};

export default ResumePreview;
