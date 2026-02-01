"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Printer,
  Plus,
  X,
  Trash2,
} from "lucide-react";

/* ─── INITIAL / EXAMPLE DATA ─── */
const BLANK = {
  fullName: "",
  jobTitle: "",
  phone: "",
  email: "",
  location: "",
  portfolio: "",
  profile: "",
  workExperience: [{ title: "", company: "", period: "", responsibilities: "" }],
  education: [{ degree: "", institution: "", field: "", period: "", gpa: "" }],
  skills: { frontend: "", backend: "", other: "" },
  certifications: "",
  languages: "",
  achievements: "",
};

const EXAMPLE = {
  fullName: "Alex J. Mercer",
  jobTitle: "Senior Full-Stack Developer",
  phone: "+1 (555) 123-4567",
  email: "alex.mercer@example.com",
  location: "San Francisco, CA",
  portfolio: "alexmercer.dev",
  profile:
    "Results-oriented Full-Stack Developer with 6+ years of experience building scalable web applications. Proficient in the MERN stack and cloud architecture with a proven track record of improving performance by 40% and leading cross-functional teams to successful product launches.",
  workExperience: [
    {
      title: "Senior Software Engineer",
      company: "TechFlow Solutions",
      period: "Mar 2021 – Present",
      responsibilities:
        "Led a team of 5 developers in redesigning the core legacy architecture, reducing server costs by 30%\nImplemented CI/CD pipelines using GitHub Actions, cutting deployment time from 2 hours to 12 minutes\nDeveloped a real-time collaboration feature using WebSockets and Redis, serving 10k+ concurrent users",
    },
    {
      title: "Software Developer",
      company: "Innovate Corp",
      period: "Jun 2018 – Feb 2021",
      responsibilities:
        "Built responsive frontend interfaces using React and Tailwind CSS for 3 major product launches\nOptimized PostgreSQL database queries, improving data retrieval speeds by 25%\nCollaborated with UX designers to implement WCAG 2.1 accessible UI components",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      institution: "University of Technology",
      field: "Computer Science",
      period: "2014 – 2018",
      gpa: "3.8 / 4.0",
    },
  ],
  skills: {
    frontend: "React, Next.js, TypeScript, Tailwind CSS, Redux, GraphQL",
    backend: "Node.js, Express, PostgreSQL, MongoDB, Docker, AWS (EC2, S3, Lambda)",
    other: "Git, Agile / Scrum, Jest, CI/CD, System Design",
  },
  certifications:
    "AWS Certified Solutions Architect – Associate (2023)\nMeta Front-End Developer Professional Certificate (2022)",
  languages: "English – Native\nSpanish – Professional Working Proficiency",
  achievements:
    "Hackathon Winner 2019 – Best FinTech Solution (200+ teams)\nEmployee of the Year 2022 – TechFlow Solutions",
};

/* ─── HELPERS ─── */
function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

/* ─── COMPONENT ─── */
export default function ResumeBuilder() {
  const [step, setStep] = useState("form"); // "form" | "preview"
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState(deepClone(BLANK));

  /* ── mutations ── */
  const set = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const setArr = (field, idx, key, value) =>
    setFormData((p) => ({
      ...p,
      [field]: p[field].map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      ),
    }));

  const addArr = (field) => {
    const tmpl =
      field === "workExperience"
        ? { title: "", company: "", period: "", responsibilities: "" }
        : { degree: "", institution: "", field: "", period: "", gpa: "" };
    setFormData((p) => ({ ...p, [field]: [...p[field], tmpl] }));
  };

  const rmArr = (field, idx) =>
    setFormData((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== idx),
    }));

  const setSkill = (key, val) =>
    setFormData((p) => ({ ...p, skills: { ...p.skills, [key]: val } }));

  /* ── actions ── */
  const copyText = async () => {
    const d = formData;
    let t = `${d.fullName.toUpperCase()}\n${d.jobTitle}\n`;
    t += `${d.email} | ${d.phone} | ${d.location}`;
    if (d.portfolio) t += ` | ${d.portfolio}`;
    if (d.profile) t += `\n\nPROFESSIONAL SUMMARY\n${d.profile}`;
    if (d.workExperience.some((e) => e.title)) {
      t += "\n\nPROFESSIONAL EXPERIENCE";
      d.workExperience.forEach((e) => {
        if (e.title)
          t += `\n\n${e.title} | ${e.company} | ${e.period}\n${e.responsibilities}`;
      });
    }
    if (d.education.some((e) => e.degree)) {
      t += "\n\nEDUCATION";
      d.education.forEach((e) => {
        if (e.degree) {
          t += `\n\n${e.degree}${e.field ? " in " + e.field : ""}\n${e.institution} | ${e.period}`;
          if (e.gpa) t += ` | GPA: ${e.gpa}`;
        }
      });
    }
    const sk = d.skills;
    if (sk.frontend || sk.backend || sk.other) {
      t += "\n\nTECHNICAL SKILLS";
      if (sk.frontend) t += `\nFrontend: ${sk.frontend}`;
      if (sk.backend) t += `\nBackend: ${sk.backend}`;
      if (sk.other) t += `\nOther: ${sk.other}`;
    }
    if (d.certifications) t += `\n\nCERTIFICATIONS\n${d.certifications}`;
    if (d.languages) t += `\n\nLANGUAGES\n${d.languages}`;
    if (d.achievements) t += `\n\nACHIEVEMENTS\n${d.achievements}`;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const doPrint = () => {
    setStep("preview");
    setTimeout(() => window.print(), 200);
  };

  /* ── shared input styles ── */
  const inp =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition placeholder-gray-400";
  const ta = inp + " resize-none";

  /* ═══════════════════════════════════════ PREVIEW ═══════════════════════════════════════ */
  if (step === "preview") {
    const d = formData;
    const Section = ({ title, children }) => (
      <div className="mt-5">
        <div className="flex items-center border-b border-black" style={{ borderWidth: "1.5px" }}>
          <span className="text-xs font-bold uppercase tracking-widest pb-0.5">{title}</span>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    );

    return (
      <>
        <style>{`
          @media print {
            @page { margin: 18mm; size: A4; }
            body * { visibility: hidden; }
            #sheet, #sheet * { visibility: visible; }
            #sheet {
              position: fixed; top: 0; left: 0;
              width: 100%; height: 100%;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print { display: none !important; }
          }
        `}</style>

        {/* nav bar */}
        <div className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-black p-1.5 rounded-lg">
                <FileText size={18} className="text-white" />
              </div>
              <span className="font-bold text-sm">Primyst</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep("form")}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                ← Edit
              </button>
              <button
                onClick={copyText}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center gap-1.5"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={doPrint}
                className="px-4 py-1.5 text-sm font-bold text-white bg-black rounded-md hover:bg-gray-800 transition flex items-center gap-1.5"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        {/* A4 sheet */}
        <div className="no-print min-h-screen bg-gray-100 py-8 flex justify-center px-4">
          <div
            id="sheet"
            className="bg-white shadow-xl"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "18mm 20mm",
              color: "#000",
              fontFamily: "'Georgia', serif",
            }}
          >
            {/* header */}
            <div className="text-center" style={{ borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "4px" }}>
              <h1 className="font-bold uppercase tracking-widest" style={{ fontSize: "22px", letterSpacing: "3px", fontFamily: "Georgia, serif" }}>
                {d.fullName || "YOUR NAME"}
              </h1>
              <p className="mt-1" style={{ fontSize: "11px", color: "#000", fontFamily: "Arial, sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                {d.jobTitle || "Professional Title"}
              </p>
              <p className="mt-2" style={{ fontSize: "9.5px", color: "#000", fontFamily: "Arial, sans-serif" }}>
                {[d.phone, d.email, d.location, d.portfolio].filter(Boolean).join("  •  ")}
              </p>
            </div>

            {/* summary */}
            {d.profile && (
              <Section title="Professional Summary">
                <p style={{ fontSize: "9.5px", lineHeight: "1.55", color: "#000", fontFamily: "Arial, sans-serif", textAlign: "justify" }}>
                  {d.profile}
                </p>
              </Section>
            )}

            {/* experience */}
            {d.workExperience.some((e) => e.title) && (
              <Section title="Professional Experience">
                {d.workExperience.map((e, i) =>
                  e.title ? (
                    <div key={i} className={i > 0 ? "mt-3" : ""}>
                      <div className="flex justify-between items-baseline">
                        <span style={{ fontSize: "10.5px", fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#000" }}>{e.title}</span>
                        <span style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}>{e.period}</span>
                      </div>
                      <p style={{ fontSize: "9.5px", color: "#000", fontFamily: "Arial, sans-serif", marginTop: "1px" }}>
                        <span style={{ fontWeight: 600 }}>{e.company}</span>
                      </p>
                      <ul style={{ marginTop: "3px", paddingLeft: "14px" }}>
                        {e.responsibilities
                          .split("\n")
                          .filter(Boolean)
                          .map((r, ri) => (
                            <li key={ri} style={{ fontSize: "9px", lineHeight: "1.5", color: "#000", fontFamily: "Arial, sans-serif", listStyleType: "disc", marginTop: ri > 0 ? "1px" : "0" }}>
                              {r.replace(/^[-•]\s*/, "")}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : null
                )}
              </Section>
            )}

            {/* education */}
            {d.education.some((e) => e.degree) && (
              <Section title="Education">
                {d.education.map((e, i) =>
                  e.degree ? (
                    <div key={i} className={i > 0 ? "mt-2.5" : ""}>
                      <div className="flex justify-between items-baseline">
                        <span style={{ fontSize: "10.5px", fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#000" }}>
                          {e.degree}{e.field ? ` in ${e.field}` : ""}
                        </span>
                        <span style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}>{e.period}</span>
                      </div>
                      <div className="flex justify-between" style={{ marginTop: "1px" }}>
                        <span style={{ fontSize: "9.5px", color: "#000", fontFamily: "Arial, sans-serif" }}>{e.institution}</span>
                        {e.gpa && <span style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}>GPA: {e.gpa}</span>}
                      </div>
                    </div>
                  ) : null
                )}
              </Section>
            )}

            {/* skills */}
            {(d.skills.frontend || d.skills.backend || d.skills.other) && (
              <Section title="Technical Skills">
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "9.5px", color: "#000" }}>
                  {d.skills.frontend && (
                    <div className="flex" style={{ marginBottom: "2px" }}>
                      <span style={{ fontWeight: 700, width: "68px", flexShrink: 0 }}>Frontend</span>
                      <span>{d.skills.frontend}</span>
                    </div>
                  )}
                  {d.skills.backend && (
                    <div className="flex" style={{ marginBottom: "2px" }}>
                      <span style={{ fontWeight: 700, width: "68px", flexShrink: 0 }}>Backend</span>
                      <span>{d.skills.backend}</span>
                    </div>
                  )}
                  {d.skills.other && (
                    <div className="flex">
                      <span style={{ fontWeight: 700, width: "68px", flexShrink: 0 }}>Other</span>
                      <span>{d.skills.other}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* two-col: certs + languages */}
            {(d.certifications || d.languages) && (
              <div className="flex gap-8 mt-5">
                {d.certifications && (
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center" style={{ borderBottom: "1.5px solid #000" }}>
                      <span className="text-xs font-bold uppercase tracking-widest pb-0.5">Certifications</span>
                    </div>
                    <ul style={{ marginTop: "6px", paddingLeft: "14px" }}>
                      {d.certifications.split("\n").filter(Boolean).map((c, i) => (
                        <li key={i} style={{ fontSize: "9px", lineHeight: "1.55", color: "#000", fontFamily: "Arial, sans-serif", listStyleType: "disc" }}>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {d.languages && (
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center" style={{ borderBottom: "1.5px solid #000" }}>
                      <span className="text-xs font-bold uppercase tracking-widest pb-0.5">Languages</span>
                    </div>
                    <ul style={{ marginTop: "6px", paddingLeft: "14px" }}>
                      {d.languages.split("\n").filter(Boolean).map((l, i) => (
                        <li key={i} style={{ fontSize: "9px", lineHeight: "1.55", color: "#000", fontFamily: "Arial, sans-serif", listStyleType: "disc" }}>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* achievements */}
            {d.achievements && (
              <Section title="Key Achievements">
                <ul style={{ paddingLeft: "14px" }}>
                  {d.achievements.split("\n").filter(Boolean).map((a, i) => (
                    <li key={i} style={{ fontSize: "9px", lineHeight: "1.55", color: "#000", fontFamily: "Arial, sans-serif", listStyleType: "disc" }}>
                      {a}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>

        {/* footer ref */}
        <div className="no-print text-center py-4">
          <span className="text-xs text-gray-400">Created with Primyst Resume Builder</span>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════ FORM ═══════════════════════════════════════ */
  const d = formData;

  /* section card wrapper */
  const Card = ({ step: n, title, children, onAdd, addLabel }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h2 className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
          <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">{n}</span>
          {title}
        </h2>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-100 transition">
            <Plus size={11} /> {addLabel || "Add"}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  /* repeatable item shell */
  const Item = ({ idx, canRemove, onRemove, children }) => (
    <div className="relative group border border-gray-200 rounded-md bg-gray-50 p-4">
      {canRemove && (
        <button onClick={onRemove} className="absolute top-2.5 right-2.5 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
          <X size={15} />
        </button>
      )}
      {children}
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* nav bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-lg">
              <FileText size={18} className="text-white" />
            </div>
            <span className="font-bold text-sm">Primyst</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFormData(deepClone(EXAMPLE))}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <Sparkles size={12} /> Example
            </button>
            <button
              onClick={() => { if (window.confirm("Clear all fields?")) setFormData(deepClone(BLANK)); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <Trash2 size={12} /> Clear
            </button>
            <button
              onClick={() => setStep("preview")}
              className="px-4 py-1.5 text-sm font-bold text-white bg-black rounded-md hover:bg-gray-800 transition"
            >
              Preview →
            </button>
          </div>
        </div>
      </div>

      {/* form body */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 space-y-5">

        {/* hero */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Build Your Resume</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Fill in the sections below. Hit <em>Preview</em> to see your polished, print-ready result.
          </p>
          {/* mobile quick actions */}
          <div className="flex justify-center gap-3 mt-3 sm:hidden">
            <button onClick={() => setFormData(deepClone(EXAMPLE))} className="text-xs text-gray-600 underline">Load Example</button>
            <button onClick={() => { if (window.confirm("Clear all?")) setFormData(deepClone(BLANK)); }} className="text-xs text-gray-500 underline">Clear</button>
          </div>
        </div>

        {/* 1 – Personal Details */}
        <Card step={1} title="Personal Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
              <input className={inp} placeholder="John Doe" value={d.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Job Title</label>
              <input className={inp} placeholder="Software Engineer" value={d.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input className={inp} type="email" placeholder="john@example.com" value={d.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
              <input className={inp} placeholder="+1 234 567 890" value={d.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
              <input className={inp} placeholder="City, Country" value={d.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Portfolio / LinkedIn</label>
              <input className={inp} placeholder="linkedin.com/in/johndoe" value={d.portfolio} onChange={(e) => set("portfolio", e.target.value)} />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Professional Summary <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea className={ta} rows={3} placeholder="2–3 sentences summarising your experience, strengths, and goals." value={d.profile} onChange={(e) => set("profile", e.target.value)} />
          </div>
        </Card>

        {/* 2 – Experience */}
        <Card step={2} title="Professional Experience" onAdd={() => addArr("workExperience")} addLabel="Add Role">
          <div className="space-y-3">
            {d.workExperience.map((e, i) => (
              <Item key={i} idx={i} canRemove={d.workExperience.length > 1} onRemove={() => rmArr("workExperience", i)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                  <input className={inp} placeholder="Job Title" value={e.title} onChange={(ev) => setArr("workExperience", i, "title", ev.target.value)} />
                  <input className={inp} placeholder="Company" value={e.company} onChange={(ev) => setArr("workExperience", i, "company", ev.target.value)} />
                </div>
                <input className={`${inp} mb-2.5`} placeholder="Period  (e.g. Mar 2021 – Present)" value={e.period} onChange={(ev) => setArr("workExperience", i, "period", ev.target.value)} />
                <textarea className={ta} rows={3} placeholder={"One responsibility per line\n– Led the backend migration …\n– Reduced load time by 40 %"} value={e.responsibilities} onChange={(ev) => setArr("workExperience", i, "responsibilities", ev.target.value)} />
              </Item>
            ))}
          </div>
        </Card>

        {/* 3 – Education */}
        <Card step={3} title="Education" onAdd={() => addArr("education")} addLabel="Add Entry">
          <div className="space-y-3">
            {d.education.map((e, i) => (
              <Item key={i} idx={i} canRemove={d.education.length > 1} onRemove={() => rmArr("education", i)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                  <input className={inp} placeholder="Degree (e.g. B.S. Computer Science)" value={e.degree} onChange={(ev) => setArr("education", i, "degree", ev.target.value)} />
                  <input className={inp} placeholder="Field of Study" value={e.field} onChange={(ev) => setArr("education", i, "field", ev.target.value)} />
                </div>
                <input className={`${inp} mb-2.5`} placeholder="Institution" value={e.institution} onChange={(ev) => setArr("education", i, "institution", ev.target.value)} />
                <div className="grid grid-cols-2 gap-2.5">
                  <input className={inp} placeholder="Period (e.g. 2014 – 2018)" value={e.period} onChange={(ev) => setArr("education", i, "period", ev.target.value)} />
                  <input className={inp} placeholder="GPA (optional)" value={e.gpa} onChange={(ev) => setArr("education", i, "gpa", ev.target.value)} />
                </div>
              </Item>
            ))}
          </div>
        </Card>

        {/* 4 – Skills & Extras */}
        <Card step={4} title="Skills & Extras">
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Frontend</label>
              <input className={inp} placeholder="React, Next.js, TypeScript …" value={d.skills.frontend} onChange={(e) => setSkill("frontend", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Backend</label>
              <input className={inp} placeholder="Node.js, PostgreSQL, Docker …" value={d.skills.backend} onChange={(e) => setSkill("backend", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Other</label>
              <input className={inp} placeholder="Git, AWS, Agile …" value={d.skills.other} onChange={(e) => setSkill("other", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Certifications <span className="font-normal text-gray-400">(one per line)</span></label>
              <textarea className={ta} rows={3} placeholder={"AWS Solutions Architect (2023)\nGoogle Cloud Professional"} value={d.certifications} onChange={(e) => set("certifications", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Languages <span className="font-normal text-gray-400">(one per line)</span></label>
              <textarea className={ta} rows={3} placeholder={"English – Native\nSpanish – Conversational"} value={d.languages} onChange={(e) => set("languages", e.target.value)} />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Key Achievements <span className="font-normal text-gray-400">(optional, one per line)</span></label>
            <textarea className={ta} rows={2} placeholder={"Hackathon Winner 2019\nEmployee of the Year 2022"} value={d.achievements} onChange={(e) => set("achievements", e.target.value)} />
          </div>
        </Card>
      </div>

      {/* footer */}
      <footer className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-slate-600">
          Built by <a href="https://primyst.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">Primyst (Abdulqudus)</a>
        </footer>
    </>
  );
      }
