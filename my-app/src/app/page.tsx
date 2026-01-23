"use client"

import React, { useState } from 'react';
import { FileText, Download, Sparkles, Copy, Check, Phone, Mail, MapPin, Globe } from 'lucide-react';
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
    workExperience: [{ title: '', company: '', period: '', responsibilities: '' }],
    education: [{ degree: '', institution: '', field: '', period: '', gpa: '' }],
    skills: { frontend: '', backend: '', other: '' },
    certifications: '',
    languages: '',
    achievements: ''
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
      workExperience: { title: '', company: '', period: '', responsibilities: '' },
      education: { degree: '', institution: '', field: '', period: '', gpa: '' }
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
    content += `${formData.jobTitle}\n\n`;
    content += `CONTACT INFORMATION\n`;
    content += `Phone: ${formData.phone}\n`;
    content += `Email: ${formData.email}\n`;
    content += `Location: ${formData.location}\n`;
    if (formData.portfolio) content += `Portfolio: ${formData.portfolio}\n`;
    
    if (formData.profile) {
      content += `\nPROFESSIONAL SUMMARY\n${formData.profile}\n`;
    }
    
    if (formData.workExperience.some(exp => exp.title)) {
      content += `\nPROFESSIONAL EXPERIENCE\n`;
      formData.workExperience.forEach(exp => {
        if (exp.title) {
          content += `${exp.title}\n`;
          if (exp.company) content += `${exp.company}\n`;
          content += `${exp.period}\n`;
          content += `${exp.responsibilities}\n\n`;
        }
      });
    }
    
    if (formData.education.some(edu => edu.degree)) {
      content += `EDUCATION\n`;
      formData.education.forEach(edu => {
        if (edu.degree) {
          content += `${edu.degree}`;
          if (edu.field) content += ` in ${edu.field}`;
          content += `\n${edu.institution}\n`;
          content += `${edu.period}`;
          if (edu.gpa) content += ` | GPA: ${edu.gpa}`;
          content += `\n\n`;
        }
      });
    }
    
    if (formData.skills.frontend || formData.skills.backend || formData.skills.other) {
      content += `TECHNICAL SKILLS\n`;
      if (formData.skills.frontend) content += `Frontend: ${formData.skills.frontend}\n`;
      if (formData.skills.backend) content += `Backend: ${formData.skills.backend}\n`;
      if (formData.skills.other) content += `Other: ${formData.skills.other}\n`;
    }
    
    if (formData.certifications) {
      content += `\nCERTIFICATIONS\n${formData.certifications}\n`;
    }
    
    if (formData.languages) {
      content += `\nLANGUAGES\n${formData.languages}\n`;
    }
    
    if (formData.achievements) {
      content += `\nKEY ACHIEVEMENTS\n${formData.achievements}\n`;
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
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );

    // Job Title
    children.push(
      new Paragraph({
        text: formData.jobTitle,
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 }
      })
    );

    // Contact Info
    const contactInfo = [];
    if (formData.phone) contactInfo.push(`Phone: ${formData.phone}`);
    if (formData.email) contactInfo.push(`Email: ${formData.email}`);
    if (formData.location) contactInfo.push(`Location: ${formData.location}`);
    if (formData.portfolio) contactInfo.push(`Portfolio: ${formData.portfolio}`);

    if (contactInfo.length > 0) {
      children.push(
        new Paragraph({
          text: contactInfo.join(' | '),
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      );
    }

    // Professional Summary
    if (formData.profile) {
      children.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
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
    }

    // Professional Experience
    if (formData.workExperience.some(exp => exp.title)) {
      children.push(
        new Paragraph({
          text: 'PROFESSIONAL EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      formData.workExperience.forEach(exp => {
        if (exp.title) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true })
              ],
              spacing: { after: 50 }
            })
          );

          if (exp.company) {
            children.push(
              new Paragraph({
                text: exp.company,
                spacing: { after: 50 }
              })
            );
          }

          if (exp.period) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: exp.period, italics: true })
                ],
                spacing: { after: 100 }
              })
            );
          }

          const responsibilities = exp.responsibilities.split('\n').filter(r => r.trim());
          responsibilities.forEach(resp => {
            children.push(
              new Paragraph({
                text: resp.trim(),
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
    }

    // Education
    if (formData.education.some(edu => edu.degree)) {
      children.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      formData.education.forEach(edu => {
        if (edu.degree) {
          let degreeText = edu.degree;
          if (edu.field) degreeText += ` in ${edu.field}`;
          
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: degreeText, bold: true })
              ],
              spacing: { after: 50 }
            })
          );

          if (edu.institution) {
            children.push(
              new Paragraph({
                text: edu.institution,
                spacing: { after: 50 }
              })
            );
          }

          let eduDetails = edu.period || '';
          if (edu.gpa) eduDetails += ` | GPA: ${edu.gpa}`;
          
          if (eduDetails) {
            children.push(
              new Paragraph({
                text: eduDetails,
                spacing: { after: 100 }
              })
            );
          }
        }
      });
    }

    // Technical Skills
    if (formData.skills.frontend || formData.skills.backend || formData.skills.other) {
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
    }

    // Certifications
    if (formData.certifications) {
      children.push(
        new Paragraph({
          text: 'CERTIFICATIONS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      const certs = formData.certifications.split('\n').filter(c => c.trim());
      certs.forEach(cert => {
        children.push(
          new Paragraph({
            text: cert.trim(),
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
            text: lang.trim(),
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

    // Key Achievements
    if (formData.achievements) {
      children.push(
        new Paragraph({
          text: 'KEY ACHIEVEMENTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      const achievements = formData.achievements.split('\n').filter(a => a.trim());
      achievements.forEach(achievement => {
        children.push(
          new Paragraph({
            text: achievement.trim(),
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10 mb-6">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-slate-200 pb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2">
                {formData.fullName.toUpperCase()}
              </h1>
              <p className="text-lg sm:text-xl text-black font-semibold mb-4">
                {formData.jobTitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-black">
                {formData.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={16} />
                    {formData.phone}
                  </span>
                )}
                {formData.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={16} />
                    {formData.email}
                  </span>
                )}
                {formData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {formData.location}
                  </span>
                )}
                {formData.portfolio && (
                  <span className="flex items-center gap-1">
                    <Globe size={16} />
                    <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                      Portfolio
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {formData.profile && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-3 uppercase tracking-wide">Professional Summary</h2>
                <p className="text-black leading-relaxed">{formData.profile}</p>
              </div>
            )}

            {/* Professional Experience */}
            {formData.workExperience.some(exp => exp.title) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Professional Experience</h2>
                <div className="space-y-6">
                  {formData.workExperience.map((exp, idx) => (
                    exp.title && (
                      <div key={idx} className="border-l-4 border-black pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-black">{exp.title}</h3>
                          <span className="text-sm text-black font-semibold">{exp.period}</span>
                        </div>
                        {exp.company && (
                          <p className="text-black font-semibold mb-2">{exp.company}</p>
                        )}
                        <p className="text-black whitespace-pre-line text-sm leading-relaxed">
                          {exp.responsibilities}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {formData.education.some(edu => edu.degree) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Education</h2>
                <div className="space-y-4">
                  {formData.education.map((edu, idx) => (
                    edu.degree && (
                      <div key={idx} className="border-l-4 border-black pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-black">
                            {edu.degree}
                            {edu.field && ` in ${edu.field}`}
                          </h3>
                          <span className="text-sm text-black font-semibold">{edu.period}</span>
                        </div>
                        <p className="text-black font-semibold mb-1">{edu.institution}</p>
                        {edu.gpa && (
                          <p className="text-sm text-black">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {(formData.skills.frontend || formData.skills.backend || formData.skills.other) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Technical Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.skills.frontend && (
                    <div>
                      <p className="font-semibold text-black mb-1">Frontend</p>
                      <p className="text-black text-sm">{formData.skills.frontend}</p>
                    </div>
                  )}
                  {formData.skills.backend && (
                    <div>
                      <p className="font-semibold text-black mb-1">Backend</p>
                      <p className="text-black text-sm">{formData.skills.backend}</p>
                    </div>
                  )}
                  {formData.skills.other && (
                    <div className="sm:col-span-2">
                      <p className="font-semibold text-black mb-1">Other Skills</p>
                      <p className="text-black text-sm">{formData.skills.other}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {formData.certifications && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Certifications</h2>
                <p className="text-black whitespace-pre-line text-sm">{formData.certifications}</p>
              </div>
            )}

            {/* Languages */}
            {formData.languages && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Languages</h2>
                <p className="text-black whitespace-pre-line text-sm">{formData.languages}</p>
              </div>
            )}

            {/* Key Achievements */}
            {formData.achievements && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Key Achievements</h2>
                <p className="text-black whitespace-pre-line text-sm">{formData.achievements}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setStep('form')}
              className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-sm sm:text-base"
            >
              Edit Resume
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={downloadDocx}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              <Download size={18} />
              Download .docx
            </button>
          </div>

   
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 text-sm sm:text-base font-semibold">
            <Sparkles size={18} />
            Professional Resume Builder
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Build Your Professional Resume
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Create a polished, ATS-optimized resume in minutes. Clean design, professional formatting, ready for any opportunity.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="Professional Title (e.g., Senior Full-Stack Developer) *"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <input
                  type="text"
                  placeholder="City, Country *"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <input
                  type="url"
                  placeholder="Portfolio URL (optional)"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </section>

            {/* Professional Summary */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Professional Summary (Optional)</h3>
              <textarea
                placeholder="Write a compelling summary of your professional background, key achievements, and career objectives. (2-3 sentences)"
                value={formData.profile}
                onChange={(e) => handleInputChange('profile', e.target.value)}
                rows="5"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </section>

            {/* Professional Experience */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Professional Experience *</h3>
              <div className="space-y-4">
                {formData.workExperience.map((exp, idx) => (
                  <div key={idx} className="p-4 sm:p-5 border-2 border-slate-200 rounded-lg hover:border-blue-300 transition">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Job Title *"
                        value={exp.title}
                        onChange={(e) => handleArrayChange('workExperience', idx, 'title', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('workExperience', idx, 'company', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Period (e.g., Jan 2023 - Present) *"
                      value={exp.period}
                      onChange={(e) => handleArrayChange('workExperience', idx, 'period', e.target.value)}
                      className="w-full px-4 py-2 mb-4 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <textarea
                      placeholder="Key responsibilities and achievements (use bullet points with -)"
                      value={exp.responsibilities}
                      onChange={(e) => handleArrayChange('workExperience', idx, 'responsibilities', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 mb-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                    {idx > 0 && (
                      <button
                        onClick={() => removeArrayItem('workExperience', idx)}
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold transition"
                      >
                        Remove Position
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addArrayItem('workExperience')}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base font-semibold border border-blue-300 rounded-lg hover:bg-blue-50 transition"
              >
                + Add Another Position
              </button>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Education *</h3>
              <div className="space-y-4">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 sm:p-5 border-2 border-slate-200 rounded-lg hover:border-green-300 transition">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Degree (e.g., Bachelor of Science) *"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => handleArrayChange('education', idx, 'field', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Institution Name *"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)}
                      className="w-full px-4 py-2 mb-4 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Graduation Period (e.g., 2020 - 2024) *"
                        value={edu.period}
                        onChange={(e) => handleArrayChange('education', idx, 'period', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <input
                        type="text"
                        placeholder="GPA (optional)"
                        value={edu.gpa}
                        onChange={(e) => handleArrayChange('education', idx, 'gpa', e.target.value)}
                        className="px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    {idx > 0 && (
                      <button
                        onClick={() => removeArrayItem('education', idx)}
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold transition mt-3"
                      >
                        Remove Education
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addArrayItem('education')}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base font-semibold border border-blue-300 rounded-lg hover:bg-blue-50 transition"
              >
                + Add Another Education
              </button>
            </section>

            {/* Technical Skills */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Technical Skills *</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Frontend (e.g., React, Next.js, TypeScript, Tailwind CSS)"
                  value={formData.skills.frontend}
                  onChange={(e) => handleInputChange('skills', { ...formData.skills, frontend: e.target.value })}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="Backend (e.g., Node.js, Python, PostgreSQL, MongoDB)"
                  value={formData.skills.backend}
                  onChange={(e) => handleInputChange('skills', { ...formData.skills, backend: e.target.value })}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="Other Skills (e.g., Git, Docker, AWS, REST APIs)"
                  value={formData.skills.other}
                  onChange={(e) => handleInputChange('skills', { ...formData.skills, other: e.target.value })}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Certifications (Optional)</h3>
              <textarea
                placeholder="List your professional certifications (one per line)&#10;e.g., AWS Certified Solutions Architect&#10;Google Cloud Professional Data Engineer"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </section>

            {/* Languages */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Languages (Optional)</h3>
              <textarea
                placeholder="List your language proficiencies (one per line)&#10;e.g., English - Fluent&#10;Spanish - Intermediate"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </section>

            {/* Key Achievements */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Key Achievements (Optional)</h3>
              <textarea
                placeholder="Highlight your major professional achievements (one per line)&#10;e.g., Led a team of 5 developers to deliver a 40% performance improvement&#10;Reduced deployment time by 60% through CI/CD automation"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </section>

            {/* Generate Button */}
            <button
              onClick={generateResume}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles size={20} />
              Generate Professional Resume
            </button>
          </div>
        </div>

        <footer className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-slate-600">
          Built by <a href="https://nostresscv.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">Primyst (Abdulqudus)</a>
        </footer>
      </div>
    </div>
  );
}
