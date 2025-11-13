"use client"

import React, { useState } from 'react';
import { FileText, Download, Sparkles, Copy, Check } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export default function ResumeBuilder() {
  const [step, setStep] = useState('form');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    location: '',
    portfolio: '',
    profile: '',
    workExperience: [{ title: '', period: '', responsibilities: '' }],
    education: [{ degree: '', institution: '', period: '', remark: '' }],
    skills: { frontend: '', backend: '', other: '' },
    languages: '',
    strengths: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field) => {
    const templates = {
      workExperience: { title: '', period: '', responsibilities: '' },
      education: { degree: '', institution: '', period: '', remark: '' }
    };
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generateResume = () => {
    setStep('preview');
  };

  const copyToClipboard = async () => {
    let content = `${formData.fullName.toUpperCase()}\n`;
    content += `${formData.jobTitle}\n`;
    content += `📞 ${formData.phone} | 📧 ${formData.email}\n`;
    content += `🌍 ${formData.location}\n`;
    if (formData.portfolio) content += `🔗 Portfolio: ${formData.portfolio}\n`;
    content += `\nPROFILE\n${formData.profile}\n`;
    
    content += `\nWORK EXPERIENCE\n`;
    formData.workExperience.forEach(exp => {
      if (exp.title) {
        content += `${exp.title} (${exp.period})\n`;
        content += `${exp.responsibilities}\n\n`;
      }
    });
    
    content += `EDUCATION\n`;
    formData.education.forEach(edu => {
      if (edu.degree) {
        content += `${edu.degree} — ${edu.institution} (${edu.period})`;
        if (edu.remark) content += ` [Remark: ${edu.remark}]`;
        content += `\n`;
      }
    });
    
    content += `\nTECHNICAL SKILLS\n`;
    if (formData.skills.frontend) content += `Frontend: ${formData.skills.frontend}\n`;
    if (formData.skills.backend) content += `Backend: ${formData.skills.backend}\n`;
    if (formData.skills.other) content += `Other: ${formData.skills.other}\n`;
    
    if (formData.languages) {
      content += `\nLANGUAGES\n${formData.languages}\n`;
    }
    
    if (formData.strengths) {
      content += `\nSTRENGTHS\n${formData.strengths}\n`;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadDocx = async () => {
    const children = [];

    // Header - Name
    children.push(
      new Paragraph({
        text: formData.fullName.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { after: 100 }
      })
    );

    // Job Title
    children.push(
      new Paragraph({
        text: formData.jobTitle,
        spacing: { after: 100 }
      })
    );

    // Contact Info
    children.push(
      new Paragraph({
        children: [
          new TextRun(`📞 ${formData.phone} | 📧 ${formData.email}`)
        ],
        spacing: { after: 100 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun(`🌍 ${formData.location}`)
        ],
        spacing: { after: 100 }
      })
    );

    if (formData.portfolio) {
      children.push(
        new Paragraph({
          children: [
            new TextRun(`🔗 Portfolio: ${formData.portfolio}`)
          ],
          spacing: { after: 200 }
        })
      );
    }

    // Profile Section
    children.push(
      new Paragraph({
        text: 'PROFILE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    children.push(
      new Paragraph({
        text: formData.profile,
        spacing: { after: 200 }
      })
    );

    // Work Experience
    children.push(
      new Paragraph({
        text: 'WORK EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    formData.workExperience.forEach(exp => {
      if (exp.title) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.title, bold: true }),
              new TextRun(` (${exp.period})`)
            ],
            spacing: { after: 100 }
          })
        );

        const responsibilities = exp.responsibilities.split('\n').filter(r => r.trim());
        responsibilities.forEach(resp => {
          children.push(
            new Paragraph({
              text: resp,
              spacing: { after: 50 }
            })
          );
        });

        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 100 }
          })
        );
      }
    });

    // Education
    children.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    formData.education.forEach(edu => {
      if (edu.degree) {
        let eduText = `${edu.degree} — ${edu.institution} (${edu.period})`;
        if (edu.remark) eduText += ` [Remark: ${edu.remark}]`;
        
        children.push(
          new Paragraph({
            text: eduText,
            spacing: { after: 100 }
          })
        );
      }
    });

    // Technical Skills
    children.push(
      new Paragraph({
        text: 'TECHNICAL SKILLS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    if (formData.skills.frontend) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Frontend: ', bold: true }),
            new TextRun(formData.skills.frontend)
          ],
          spacing: { after: 50 }
        })
      );
    }

    if (formData.skills.backend) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Backend: ', bold: true }),
            new TextRun(formData.skills.backend)
          ],
          spacing: { after: 50 }
        })
      );
    }

    if (formData.skills.other) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Other: ', bold: true }),
            new TextRun(formData.skills.other)
          ],
          spacing: { after: 100 }
        })
      );
    }

    // Languages
    if (formData.languages) {
      children.push(
        new Paragraph({
          text: 'LANGUAGES',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      const languages = formData.languages.split('\n').filter(l => l.trim());
      languages.forEach(lang => {
        children.push(
          new Paragraph({
            text: lang,
            spacing: { after: 50 }
          })
        );
      });
    }

    // Strengths
    if (formData.strengths) {
      children.push(
        new Paragraph({
          text: 'STRENGTHS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      const strengths = formData.strengths.split('\n').filter(s => s.trim());
      strengths.forEach(strength => {
        children.push(
          new Paragraph({
            text: strength,
            spacing: { after: 50 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.fullName.replace(/\s+/g, '_')}_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{formData.fullName.toUpperCase()}</h1>
              <p className="text-lg text-gray-700 mb-3">{formData.jobTitle}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 {formData.phone} | 📧 {formData.email}</p>
                <p>🌍 {formData.location}</p>
                {formData.portfolio && <p>🔗 Portfolio: {formData.portfolio}</p>}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">PROFILE</h2>
              <p className="text-gray-700 whitespace-pre-line">{formData.profile}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">WORK EXPERIENCE</h2>
              {formData.workExperience.map((exp, idx) => (
                exp.title && (
                  <div key={idx} className="mb-4">
                    <p className="font-semibold text-gray-900">{exp.title} ({exp.period})</p>
                    <p className="text-gray-700 whitespace-pre-line mt-1">{exp.responsibilities}</p>
                  </div>
                )
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">EDUCATION</h2>
              {formData.education.map((edu, idx) => (
                edu.degree && (
                  <p key={idx} className="text-gray-700 mb-2">
                    {edu.degree} — {edu.institution} ({edu.period})
                    {edu.remark && <span className="text-gray-600"> [Remark: {edu.remark}]</span>}
                  </p>
                )
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">TECHNICAL SKILLS</h2>
              {formData.skills.frontend && <p className="text-gray-700"><strong>Frontend:</strong> {formData.skills.frontend}</p>}
              {formData.skills.backend && <p className="text-gray-700"><strong>Backend:</strong> {formData.skills.backend}</p>}
              {formData.skills.other && <p className="text-gray-700"><strong>Other:</strong> {formData.skills.other}</p>}
            </div>

            {formData.languages && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">LANGUAGES</h2>
                <p className="text-gray-700 whitespace-pre-line">{formData.languages}</p>
              </div>
            )}

            {formData.strengths && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">STRENGTHS</h2>
                <p className="text-gray-700 whitespace-pre-line">{formData.strengths}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Edit Resume
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={downloadDocx}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download .docx
            </button>
          </div>
          
          <footer className="mt-8 text-center text-sm text-gray-600">
            Built by <a href="https://aq-portfolio-rose.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-semibold">Primyst (Abdulqudus)</a>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
            <Sparkles size={20} />
            <span className="font-semibold">AI Resume Builder</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Resume in Seconds</h1>
          <p className="text-gray-600">Clean, professional, ATS-friendly. No fancy designs, just results.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={24} />
                Basic Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Job Title (e.g., Full-Stack Developer)"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Portfolio URL (optional)"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Profile */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Profile Summary</h3>
              <textarea
                placeholder="A brief overview of your experience and what makes you great..."
                value={formData.profile}
                onChange={(e) => handleInputChange('profile', e.target.value)}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Work Experience */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Work Experience</h3>
              {formData.workExperience.map((exp, idx) => (
                <div key={idx} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Job Title & Company"
                    value={exp.title}
                    onChange={(e) => handleArrayChange('workExperience', idx, 'title', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g., 2024 – Present)"
                    value={exp.period}
                    onChange={(e) => handleArrayChange('workExperience', idx, 'period', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Responsibilities (use bullet points with - )"
                    value={exp.responsibilities}
                    onChange={(e) => handleArrayChange('workExperience', idx, 'responsibilities', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {idx > 0 && (
                    <button
                      onClick={() => removeArrayItem('workExperience', idx)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('workExperience')}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
              >
                + Add Another Position
              </button>
            </div>

            {/* Education */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Education</h3>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Period"
                      value={edu.period}
                      onChange={(e) => handleArrayChange('education', idx, 'period', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Remark (optional)"
                      value={edu.remark}
                      onChange={(e) => handleArrayChange('education', idx, 'remark', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  {idx > 0 && (
                    <button
                      onClick={() => removeArrayItem('education', idx)}
                      className="text-red-600 text-sm hover:text-red-800 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('education')}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
              >
                + Add Another Education
              </button>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Technical Skills</h3>
              <input
                type="text"
                placeholder="Frontend (e.g., React.js, Next.js, TypeScript)"
                value={formData.skills.frontend}
                onChange={(e) => handleInputChange('skills', { ...formData.skills, frontend: e.target.value })}
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Backend (e.g., Node.js, Express, PostgreSQL)"
                value={formData.skills.backend}
                onChange={(e) => handleInputChange('skills', { ...formData.skills, backend: e.target.value })}
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Other Skills (optional)"
                value={formData.skills.other}
                onChange={(e) => handleInputChange('skills', { ...formData.skills, other: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Languages (Optional)</h3>
              <textarea
                placeholder="e.g., English — Fluent&#10;Yoruba — Native"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Strengths */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Strengths (Optional)</h3>
              <textarea
                placeholder="e.g., Strong problem-solving skills&#10;Team player with leadership experience"
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={generateResume}
              className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Sparkles size={24} />
              Generate Resume
            </button>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-600">
          Built by <a href="https://aq-portfolio-rose.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-semibold">Primyst (Abdulqudus)</a>
        </footer>
      </div>
    </div>
  );
  }
