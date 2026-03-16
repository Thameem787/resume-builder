/**
 * ResumeForm.jsx
 *
 * Split-screen left panel — collects all resume fields.
 * Each logical group is wrapped in a card with a lucide icon header.
 * Runs client-side validation before calling onSubmit.
 */

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FolderGit2,
  Award,
  FileText,
  Sparkles,
  RotateCcw,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const INITIAL = {
  name: "", email: "", phone: "",
  careerSummary: "", skills: "",
  education: "", workExperience: "",
  projects: "", certifications: "",
};

// Shared section card wrapper
const SectionCard = ({ icon: Icon, title, color = "violet", children }) => {
  const colorMap = {
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    blue:   "text-blue-400   bg-blue-500/10   border-blue-500/20",
    emerald:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber:  "text-amber-400  bg-amber-500/10  border-amber-500/20",
    pink:   "text-pink-400   bg-pink-500/10   border-pink-500/20",
    cyan:   "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
  };
  const cls = colorMap[color] || colorMap.violet;

  return (
    <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-5 shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className={`w-8 h-8 rounded-lg border flex items-center justify-center ${cls}`}>
          <Icon size={15} />
        </span>
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Shared input style
const inputCls = (err) =>
  `w-full bg-slate-900/70 border ${
    err ? "border-red-500/60" : "border-slate-700/60"
  } rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600
   focus:outline-none focus:ring-2 ${
     err ? "focus:ring-red-500/30" : "focus:ring-violet-500/30"
   } focus:border-violet-500/50 transition-all duration-150`;

const textareaCls = (err) => inputCls(err) + " resize-none leading-relaxed";

// ── Component ─────────────────────────────────────────────────────────────────
const ResumeForm = ({ onSubmit, isLoading }) => {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = "Full name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                e.email     = "Enter a valid email";
    if (!form.skills.trim())    e.skills    = "Add at least one skill";
    if (!form.education.trim()) e.education = "Education is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const handleReset = () => { setForm(INITIAL); setErrors({}); };

  // Error helper
  const Err = ({ field }) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
        <span>⚠</span> {errors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* ── Personal Info ── */}
      <SectionCard icon={User} title="Personal Information" color="violet">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                name="name" type="text"
                placeholder="e.g. Jane Doe"
                value={form.name} onChange={handleChange}
                className={inputCls(errors.name) + " pl-9"}
              />
            </div>
            <Err field="name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email *</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  name="email" type="email"
                  placeholder="jane@example.com"
                  value={form.email} onChange={handleChange}
                  className={inputCls(errors.email) + " pl-9"}
                />
              </div>
              <Err field="email" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Phone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  name="phone" type="tel"
                  placeholder="+1 555-0000"
                  value={form.phone} onChange={handleChange}
                  className={inputCls(false) + " pl-9"}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Career Summary ── */}
      <SectionCard icon={FileText} title="Career Summary" color="blue">
        <label className="text-xs text-slate-400 mb-1 block">Brief Professional Summary</label>
        <textarea
          name="careerSummary" rows={3}
          placeholder="e.g. Results-driven engineer with 3+ years building scalable apps…"
          value={form.careerSummary} onChange={handleChange}
          className={textareaCls(false)}
        />
      </SectionCard>

      {/* ── Skills ── */}
      <SectionCard icon={Lightbulb} title="Skills *" color="amber">
        <label className="text-xs text-slate-400 mb-1 block">
          Technical &amp; Soft Skills <span className="text-slate-600">(comma-separated)</span>
        </label>
        <textarea
          name="skills" rows={2}
          placeholder="e.g. React, Node.js, Python, SQL, Leadership, Communication"
          value={form.skills} onChange={handleChange}
          className={textareaCls(errors.skills)}
        />
        <Err field="skills" />
      </SectionCard>

      {/* ── Education ── */}
      <SectionCard icon={GraduationCap} title="Education *" color="emerald">
        <label className="text-xs text-slate-400 mb-1 block">Degrees &amp; Institutions</label>
        <textarea
          name="education" rows={3}
          placeholder={"e.g.\nB.Sc. Computer Science — MIT (2020–2024)\nGPA: 3.9/4.0"}
          value={form.education} onChange={handleChange}
          className={textareaCls(errors.education)}
        />
        <Err field="education" />
      </SectionCard>

      {/* ── Work Experience ── */}
      <SectionCard icon={Briefcase} title="Work Experience" color="cyan">
        <label className="text-xs text-slate-400 mb-1 block">Roles, Companies &amp; Achievements</label>
        <textarea
          name="workExperience" rows={4}
          placeholder={"e.g.\nSoftware Engineer — Google (2022–Present)\n• Built APIs serving 1M+ users\n• Improved latency by 35%"}
          value={form.workExperience} onChange={handleChange}
          className={textareaCls(false)}
        />
      </SectionCard>

      {/* ── Projects ── */}
      <SectionCard icon={FolderGit2} title="Projects" color="pink">
        <label className="text-xs text-slate-400 mb-1 block">Notable Projects</label>
        <textarea
          name="projects" rows={3}
          placeholder={"e.g.\nAI Chatbot — React + OpenAI\n• 5,000 monthly active users"}
          value={form.projects} onChange={handleChange}
          className={textareaCls(false)}
        />
      </SectionCard>

      {/* ── Certifications ── */}
      <SectionCard icon={Award} title="Certifications" color="violet">
        <label className="text-xs text-slate-400 mb-1 block">Licenses &amp; Certifications</label>
        <textarea
          name="certifications" rows={2}
          placeholder="e.g. AWS Certified Developer (2023), PMP (2022)"
          value={form.certifications} onChange={handleChange}
          className={textareaCls(false)}
        />
      </SectionCard>

      {/* ── Action Buttons ── */}
      <div className="flex gap-3 pt-1 pb-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-400
                     bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl
                     transition-all duration-150 disabled:opacity-40"
        >
          <RotateCcw size={14} /> Clear
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold
                     text-white bg-gradient-to-r from-violet-600 to-purple-600
                     hover:from-violet-500 hover:to-purple-500
                     rounded-xl shadow-lg shadow-violet-500/25
                     transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
        >
          <Sparkles size={15} />
          {isLoading ? "Generating…" : "Generate Resume with AI"}
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;
