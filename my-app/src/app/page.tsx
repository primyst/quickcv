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
  skills: [{ category: "", items: "" }],
  certifications: "",
  languages: "",
  achievements: "",
};

const EXAMPLE = {
  fullName: "Sarah M. Carter",
  jobTitle: "Senior Marketing Manager",
  phone: "+1 (555) 782-3491",
  email: "sarah.carter@email.com",
  location: "Austin, TX",
  portfolio: "linkedin.com/in/sarahcarter",
  profile:
    "Strategic Marketing Manager with 8+ years of experience driving brand growth and cross-channel campaigns. Proven ability to increase lead generation by 60% and build high-performing teams. Passionate about turning data insights into compelling narratives that move audiences.",
  workExperience: [
    {
      title: "Senior Marketing Manager",
      company: "Elevate Digital Inc.",
      period: "Jan 2020 – Present",
      responsibilities:
        "Spearheaded a full brand refresh that increased website traffic by 75% year-over-year\nManaged a $2M annual marketing budget across 5 channels with a 3.2x average ROI\nLed a team of 6 specialists including content, SEO, and paid media\nDeveloped quarterly OKRs that aligned marketing output with company revenue targets",
    },
    {
      title: "Marketing Coordinator",
      company: "BrightPath Agency",
      period: "Mar 2016 – Dec 2019",
      responsibilities:
        "Coordinated 20+ product launch campaigns for clients across healthcare and fintech\nCreated and maintained editorial calendars, improving content publish consistency by 40%\nAnalysed campaign performance using Google Analytics and HubSpot, reporting weekly to stakeholders",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      institution: "University of Texas at Austin",
      field: "Communications & Marketing",
      period: "2012 – 2016",
      gpa: "3.7 / 4.0",
    },
  ],
  skills: [
    { category: "Marketing & Strategy", items: "Brand Strategy, Campaign Planning, Go-to-Market, Product Launches" },
    { category: "Analytics & Tools", items: "Google Analytics, HubSpot, Salesforce, Tableau, SEMrush" },
    { category: "Leadership", items: "Team Management, Stakeholder Communication, Budget Planning, Agile" },
    { category: "Content & Creative", items: "Copywriting, Content Strategy, Social Media, Email Marketing" },
  ],
  certifications:
    "Google Analytics 4 Certification (2023)\nHubSpot Inbound Marketing Certification (2022)\nFacebook Ads Manager Certification (2023)",
  languages: "English – Native\nSpanish – Conversational",
  achievements:
    'Increased qualified lead volume by 60% in 12 months at Elevate Digital\nNamed "Top 30 Marketing Leaders Under 35" – Austin Business Journal, 2022\nEmployee of the Year – Elevate Digital Inc., 2021',
};

/* ─── HELPERS ─── */
function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

/* ─── COMPONENT ─── */
export default function ResumeBuilder() {
  const [step, setStep] = useState("form");
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
        : field === "education"
        ? { degree: "", institution: "", field: "", period: "", gpa: "" }
        : { category: "", items: "" };
    setFormData((p) => ({ ...p, [field]: [...p[field], tmpl] }));
  };

  const rmArr = (field, idx) =>
    setFormData((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== idx),
    }));

  /* ── clipboard ── */
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
    if (d.skills.some((s) => s.category || s.items)) {
      t += "\n\nSKILLS";
      d.skills.forEach((s) => {
        if (s.category && s.items) t += `\n${s.category}: ${s.items}`;
        else if (s.items) t += `\n${s.items}`;
      });
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
    setTimeout(() => window.print(), 250);
  };

  /* ── shared styles ── */
  const inp =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition placeholder-gray-400";
  const ta = inp + " resize-none";

  /* ═══════════════════════════════════════ PREVIEW ═══════════════════════════════════════ */
  if (step === "preview") {
    const d = formData;

    const Section = ({ title, children }) => (
      <div className="mt-5">
        <div style={{ borderBottom: "1.5px solid #000" }}>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.8px",
              fontFamily: "Arial, sans-serif",
              color: "#000",
              display: "block",
              paddingBottom: "2px",
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ marginTop: "5px" }}>{children}</div>
      </div>
    );

    // auto-size the label column so all skill categories line up
    const skillLabelWidth = d.skills.reduce((max, s) => {
      const len = (s.category || "").length;
      return len > max ? len : max;
    }, 0);
    const labelPx = Math.max(52, Math.min(skillLabelWidth * 6.2 + 16, 145));

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

        {/* nav */}
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
              fontFamily: "Georgia, serif",
            }}
          >
            {/* header */}
            <div
              className="text-center"
              style={{ borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "4px" }}
            >
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontFamily: "Georgia, serif",
                  color: "#000",
                }}
              >
                {d.fullName || "YOUR NAME"}
              </h1>
              <p
                style={{
                  fontSize: "11px",
                  color: "#000",
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {d.jobTitle || "Professional Title"}
              </p>
              <p
                style={{
                  fontSize: "9.5px",
                  color: "#000",
                  fontFamily: "Arial, sans-serif",
                  marginTop: "6px",
                }}
              >
                {[d.phone, d.email, d.location, d.portfolio].filter(Boolean).join("  •  ")}
              </p>
            </div>

            {/* summary */}
            {d.profile && (
              <Section title="Professional Summary">
                <p
                  style={{
                    fontSize: "9.5px",
                    lineHeight: "1.55",
                    color: "#000",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "justify",
                  }}
                >
                  {d.profile}
                </p>
              </Section>
            )}

            {/* experience */}
            {d.workExperience.some((e) => e.title) && (
              <Section title="Professional Experience">
                {d.workExperience.map((e, i) =>
                  e.title ? (
                    <div key={i} style={{ marginTop: i > 0 ? "10px" : "0" }}>
                      <div className="flex justify-between items-baseline">
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            fontFamily: "Arial, sans-serif",
                            color: "#000",
                          }}
                        >
                          {e.title}
                        </span>
                        <span
                          style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}
                        >
                          {e.period}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 600,
                          color: "#000",
                          fontFamily: "Arial, sans-serif",
                          marginTop: "1px",
                        }}
                      >
                        {e.company}
                      </p>
                      <ul style={{ marginTop: "3px", paddingLeft: "14px" }}>
                        {e.responsibilities
                          .split("\n")
                          .filter(Boolean)
                          .map((r, ri) => (
                            <li
                              key={ri}
                              style={{
                                fontSize: "9px",
                                lineHeight: "1.5",
                                color: "#000",
                                fontFamily: "Arial, sans-serif",
                                listStyleType: "disc",
                                marginTop: ri > 0 ? "1px" : "0",
                              }}
                            >
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
                    <div key={i} style={{ marginTop: i > 0 ? "8px" : "0" }}>
                      <div className="flex justify-between items-baseline">
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            fontFamily: "Arial, sans-serif",
                            color: "#000",
                          }}
                        >
                          {e.degree}
                          {e.field ? ` in ${e.field}` : ""}
                        </span>
                        <span
                          style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}
                        >
                          {e.period}
                        </span>
                      </div>
                      <div className="flex justify-between" style={{ marginTop: "1px" }}>
                        <span
                          style={{
                            fontSize: "9.5px",
                            color: "#000",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          {e.institution}
                        </span>
                        {e.gpa && (
                          <span
                            style={{ fontSize: "9px", color: "#000", fontFamily: "Arial, sans-serif" }}
                          >
                            GPA: {e.gpa}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </Section>
            )}

            {/* skills — fully generic, user-defined categories */}
            {d.skills.some((s) => s.items) && (
              <Section title="Skills">
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "9.5px", color: "#000" }}>
                  {d.skills.map((s, i) =>
                    s.items ? (
                      <div
                        key={i}
                        className="flex"
                        style={{ marginBottom: i < d.skills.length - 1 ? "2px" : "0" }}
                      >
                        {s.category && (
                          <span style={{ fontWeight: 700, flexShrink: 0, width: `${labelPx}px` }}>
                            {s.category}
                          </span>
                        )}
                        <span>{s.items}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </Section>
            )}

            {/* certs + languages side by side */}
            {(d.certifications || d.languages) && (
              <div className="flex gap-8" style={{ marginTop: "20px" }}>
                {d.certifications && (
                  <div style={{ flex: 1 }}>
                    <div style={{ borderBottom: "1.5px solid #000" }}>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1.8px",
                          fontFamily: "Arial, sans-serif",
                          color: "#000",
                          display: "block",
                          paddingBottom: "2px",
                        }}
                      >
                        Certifications
                      </span>
                    </div>
                    <ul style={{ marginTop: "5px", paddingLeft: "14px" }}>
                      {d.certifications
                        .split("\n")
                        .filter(Boolean)
                        .map((c, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "9px",
                              lineHeight: "1.55",
                              color: "#000",
                              fontFamily: "Arial, sans-serif",
                              listStyleType: "disc",
                            }}
                          >
                            {c}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {d.languages && (
                  <div style={{ flex: 1 }}>
                    <div style={{ borderBottom: "1.5px solid #000" }}>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1.8px",
                          fontFamily: "Arial, sans-serif",
                          color: "#000",
                          display: "block",
                          paddingBottom: "2px",
                        }}
                      >
                        Languages
                      </span>
                    </div>
                    <ul style={{ marginTop: "5px", paddingLeft: "14px" }}>
                      {d.languages
                        .split("\n")
                        .filter(Boolean)
                        .map((l, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "9px",
                              lineHeight: "1.55",
                              color: "#000",
                              fontFamily: "Arial, sans-serif",
                              listStyleType: "disc",
                            }}
                          >
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
                  {d.achievements
                    .split("\n")
                    .filter(Boolean)
                    .map((a, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "9px",
                          lineHeight: "1.55",
                          color: "#000",
                          fontFamily: "Arial, sans-serif",
                          listStyleType: "disc",
                        }}
                      >
                        {a}
                      </li>
                    ))}
                </ul>
              </Section>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="no-print text-center py-4">
          <span className="text-xs text-gray-400">Created with Primyst Resume Builder</span>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════ FORM ═══════════════════════════════════════ */
  const d = formData;

  const Card = ({ step: n, title, children, onAdd, addLabel }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h2 className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
          <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {n}
          </span>
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-100 transition"
          >
            <Plus size={11} /> {addLabel || "Add"}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const Item = ({ canRemove, onRemove, children }) => (
    <div className="relative group border border-gray-200 rounded-md bg-gray-50 p-4">
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2.5 right-2.5 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
        >
          <X size={15} />
        </button>
      )}
      {children}
    </div>
  );

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      {/* nav */}
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
              onClick={() => {
                if (window.confirm("Clear all fields?")) setFormData(deepClone(BLANK));
              }}
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

      {/* form */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 space-y-5">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Build Your Resume</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Fill in the sections below. Hit <em>Preview</em> to see your polished, print-ready result.
          </p>
          <div className="flex justify-center gap-3 mt-3 sm:hidden">
            <button
              onClick={() => setFormData(deepClone(EXAMPLE))}
              className="text-xs text-gray-600 underline"
            >
              Load Example
            </button>
            <button
              onClick={() => {
                if (window.confirm("Clear all?")) setFormData(deepClone(BLANK));
              }}
              className="text-xs text-gray-500 underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 1 – Personal */}
        <Card step={1} title="Personal Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
              <input
                className={inp}
                placeholder="Jane Doe"
                value={d.fullName}
                onChange={(e) => set("fullName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Job Title</label>
              <input
                className={inp}
                placeholder="Marketing Manager"
                value={d.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input
                className={inp}
                type="email"
                placeholder="jane@example.com"
                value={d.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
              <input
                className={inp}
                placeholder="+1 234 567 890"
                value={d.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
              <input
                className={inp}
                placeholder="City, Country"
                value={d.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                LinkedIn / Portfolio
              </label>
              <input
                className={inp}
                placeholder="linkedin.com/in/janedoe"
                value={d.portfolio}
                onChange={(e) => set("portfolio", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Professional Summary <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              className={ta}
              rows={3}
              placeholder="2–3 sentences on your experience, strengths, and career goals."
              value={d.profile}
              onChange={(e) => set("profile", e.target.value)}
            />
          </div>
        </Card>

        {/* 2 – Experience */}
        <Card
          step={2}
          title="Professional Experience"
          onAdd={() => addArr("workExperience")}
          addLabel="Add Role"
        >
          <div className="space-y-3">
            {d.workExperience.map((e, i) => (
              <Item
                key={i}
                canRemove={d.workExperience.length > 1}
                onRemove={() => rmArr("workExperience", i)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                  <input
                    className={inp}
                    placeholder="Job Title"
                    value={e.title}
                    onChange={(ev) => setArr("workExperience", i, "title", ev.target.value)}
                  />
                  <input
                    className={inp}
                    placeholder="Company / Organisation"
                    value={e.company}
                    onChange={(ev) => setArr("workExperience", i, "company", ev.target.value)}
                  />
                </div>
                <input
                  className={`${inp} mb-2.5`}
                  placeholder="Period (e.g. Mar 2020 – Present)"
                  value={e.period}
                  onChange={(ev) => setArr("workExperience", i, "period", ev.target.value)}
                />
                <textarea
                  className={ta}
                  rows={3}
                  placeholder={
                    "One key point per line\n– Managed a team of …\n– Increased revenue by …"
                  }
                  value={e.responsibilities}
                  onChange={(ev) =>
                    setArr("workExperience", i, "responsibilities", ev.target.value)
                  }
                />
              </Item>
            ))}
          </div>
        </Card>

        {/* 3 – Education */}
        <Card
          step={3}
          title="Education"
          onAdd={() => addArr("education")}
          addLabel="Add Entry"
        >
          <div className="space-y-3">
            {d.education.map((e, i) => (
              <Item
                key={i}
                canRemove={d.education.length > 1}
                onRemove={() => rmArr("education", i)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                  <input
                    className={inp}
                    placeholder="Degree (e.g. Bachelor of Science)"
                    value={e.degree}
                    onChange={(ev) => setArr("education", i, "degree", ev.target.value)}
                  />
                  <input
                    className={inp}
                    placeholder="Field of Study"
                    value={e.field}
                    onChange={(ev) => setArr("education", i, "field", ev.target.value)}
                  />
                </div>
                <input
                  className={`${inp} mb-2.5`}
                  placeholder="Institution"
                  value={e.institution}
                  onChange={(ev) => setArr("education", i, "institution", ev.target.value)}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    className={inp}
                    placeholder="Period (e.g. 2014 – 2018)"
                    value={e.period}
                    onChange={(ev) => setArr("education", i, "period", ev.target.value)}
                  />
                  <input
                    className={inp}
                    placeholder="GPA (optional)"
                    value={e.gpa}
                    onChange={(ev) => setArr("education", i, "gpa", ev.target.value)}
                  />
                </div>
              </Item>
            ))}
          </div>
        </Card>

        {/* 4 – Skills (user-defined categories) */}
        <Card
          step={4}
          title="Skills"
          onAdd={() => addArr("skills")}
          addLabel="Add Category"
        >
          <p className="text-xs text-gray-400 mb-3">
            Create your own skill categories. Name them anything that fits your field — e.g.
            "Leadership", "Data Analysis", "Design Tools", "Sales", "Project Management".
          </p>
          <div className="space-y-3">
            {d.skills.map((s, i) => (
              <Item
                key={i}
                canRemove={d.skills.length > 1}
                onRemove={() => rmArr("skills", i)}
              >
                <div className="flex gap-2.5">
                  <div style={{ width: "140px", flexShrink: 0 }}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Category
                    </label>
                    <input
                      className={inp}
                      placeholder="e.g. Leadership"
                      value={s.category}
                      onChange={(ev) => setArr("skills", i, "category", ev.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Skills
                    </label>
                    <input
                      className={inp}
                      placeholder="Skill A, Skill B, Skill C …"
                      value={s.items}
                      onChange={(ev) => setArr("skills", i, "items", ev.target.value)}
                    />
                  </div>
                </div>
              </Item>
            ))}
          </div>
        </Card>

        {/* 5 – Extras */}
        <Card step={5} title="Certifications, Languages & Achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Certifications <span className="font-normal text-gray-400">(one per line)</span>
              </label>
              <textarea
                className={ta}
                rows={3}
                placeholder={
                  "Google Analytics Cert (2023)\nProject Management Professional"
                }
                value={d.certifications}
                onChange={(e) => set("certifications", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Languages <span className="font-normal text-gray-400">(one per line)</span>
              </label>
              <textarea
                className={ta}
                rows={3}
                placeholder={"English – Native\nFrench – Conversational"}
                value={d.languages}
                onChange={(e) => set("languages", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Key Achievements{" "}
              <span className="font-normal text-gray-400">(optional, one per line)</span>
            </label>
            <textarea
              className={ta}
              rows={2}
              placeholder={"Employee of the Year 2022\nIncreased sales by 45% in Q3"}
              value={d.achievements}
              onChange={(e) => set("achievements", e.target.value)}
            />
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
