import { Github, Linkedin, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

// --- Types ---
export type TemplateType = 'classic' | 'modern' | 'minimal';

export interface Skills {
    technical: string[];
    soft: string[];
    tools: string[];
}

export interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: Array<{
        id: string;
        role: string;
        company: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        school: string;
        year: string;
    }>;
    projects: Array<{
        id: string;
        name: string;
        description: string;
        link: string; // Deprecated
        liveUrl: string;
        githubUrl: string;
        techStack: string[];
    }>;
    skills: Skills;
    githubUrl: string;
    linkedinUrl: string;
    selectedTemplate: TemplateType;
    themeColor: string; // New field
}

interface ResumePaperProps {
    data: ResumeData;
}

export default function ResumePaper({ data }: ResumePaperProps) {
    const { themeColor = '#2a9d8f' } = data; // Default to Teal if missing

    // --- Modern Layout Render ---
    if (data.selectedTemplate === 'modern') {
        return (
            <div id="resume-paper" className="w-full h-full bg-white grid grid-cols-[32%_68%] min-h-[297mm]">

                {/* Left Sidebar */}
                <div style={{ backgroundColor: themeColor }} className="text-white p-8 space-y-8 flex flex-col h-full print:bg-print-color">
                    {/* Name (Large, Sidebar) */}
                    <div>
                        <h1 className="text-4xl font-bold leading-tight mb-2 tracking-tight">
                            {data.fullName || 'Your Name'}
                        </h1>
                        <p className="text-white/80 font-medium text-lg">
                            {data.experience[0]?.role || 'Professional Role'}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 text-sm text-white/90">
                        {data.location && (
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="shrink-0 opacity-70" />
                                <span>{data.location}</span>
                            </div>
                        )}
                        {data.email && (
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="shrink-0 opacity-70" />
                                <span>{data.email}</span>
                            </div>
                        )}
                        {data.phone && (
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="shrink-0 opacity-70" />
                                <span>{data.phone}</span>
                            </div>
                        )}
                        {(data.githubUrl || data.linkedinUrl) && (
                            <div className="pt-2 space-y-3 border-t border-white/20 mt-2">
                                {data.githubUrl && (
                                    <a href={data.githubUrl} className="flex items-center gap-3 hover:underline">
                                        <Github size={16} className="shrink-0 opacity-70" />
                                        <span className="truncate">{data.githubUrl.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                {data.linkedinUrl && (
                                    <a href={data.linkedinUrl} className="flex items-center gap-3 hover:underline">
                                        <Linkedin size={16} className="shrink-0 opacity-70" />
                                        <span className="truncate">{data.linkedinUrl.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Education (Moved to sidebar for Modern) */}
                    {data.education.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2">Education</h2>
                            {data.education.map((edu) => (
                                <div key={edu.id} className="text-sm">
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="text-white/80">{edu.school}</div>
                                    <div className="text-white/60 text-xs mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills (Sidebar format) */}
                    {(data.skills.technical?.length > 0 || data.skills.soft?.length > 0 || data.skills.tools?.length > 0) && (
                        <div className="space-y-6">
                            {/* Tech */}
                            {data.skills.technical?.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Technical</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.skills.technical.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white/90">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Tools */}
                            {data.skills.tools?.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Tools</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.skills.tools.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white/90">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Soft */}
                            {data.skills.soft?.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Soft Skills</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.skills.soft.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white/90">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content (Right) */}
                <div className="p-10 pl-12 space-y-8 text-gray-800">
                    {/* Summary */}
                    {data.summary && (
                        <div className="space-y-3">
                            <h2 style={{ color: themeColor }} className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-100 pb-2">Profile</h2>
                            <p className="leading-relaxed text-sm text-gray-600">
                                {data.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div className="space-y-6">
                            <h2 style={{ color: themeColor }} className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-100 pb-2">Experience</h2>
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="space-y-2 avoid-break">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                                        <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{exp.duration}</span>
                                    </div>
                                    <div className="text-base font-semibold text-gray-700">{exp.company}</div>
                                    {exp.description && (
                                        <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-gray-600 leading-relaxed mt-2">
                                            {exp.description.split('\n').map((line, i) => line.trim() && (
                                                <li key={i}>{line.trim().replace(/^•\s*/, '')}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {data.projects.length > 0 && (
                        <div className="space-y-6">
                            <h2 style={{ color: themeColor }} className="text-xl font-bold uppercase tracking-widest border-b-2 border-gray-100 pb-2">Projects</h2>
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="space-y-2 avoid-break">
                                    <div className="flex justify-between items-baseline">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                                            <div className="flex gap-2">
                                                {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: themeColor }} className="text-xs font-bold uppercase flex items-center gap-1 hover:underline"><ExternalLink size={10} /> Live</a>}
                                                {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1 hover:text-black hover:underline"><Github size={10} /> Code</a>}
                                            </div>
                                        </div>
                                    </div>

                                    {proj.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 text-xs text-gray-500 font-mono">
                                            {proj.techStack.map(t => <span key={t} className="bg-gray-100 px-1.5 py-0.5 rounded">{t}</span>)}
                                        </div>
                                    )}

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Print Shim for Modern */}
                <style>{`
                    @media print {
                        .print\\:bg-print-color {
                            background-color: ${themeColor} !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}</style>
            </div>
        );
    } // End Modern

    // --- Classic & Minimal Logic ---
    const isMinimal = data.selectedTemplate === 'minimal';

    // Dynamic Styles for Classic/Minimal
    const containerClass = isMinimal
        ? "font-mono text-sm text-gray-800"
        : "font-serif text-gray-800";

    const headerClass = isMinimal
        ? "mb-12 text-left"
        : "text-center mb-8 border-b-2 pb-8";

    const borderStyle = isMinimal ? {} : { borderColor: themeColor };

    // Title style
    const sectionTitleStyle = {
        color: isMinimal ? '#9ca3af' : themeColor, // Minimal uses gray, Classic uses theme
        borderBottom: isMinimal ? 'none' : '1px solid #f3f4f6',
        paddingBottom: isMinimal ? '0' : '0.25rem',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em'
    };

    return (
        <div id="resume-paper" className={`w-full h-full bg-white p-[15mm] ${containerClass}`}>

            {/* Header */}
            <div className={headerClass} style={!isMinimal ? borderStyle : {}}>
                <h1 className={`text-4xl font-medium tracking-tight mb-3 ${isMinimal ? '' : 'font-serif'}`} style={{ color: themeColor }}>
                    {data.fullName || 'Your Name'}
                </h1>
                <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${isMinimal ? 'flex-col gap-1 items-start' : 'justify-center items-center'}`}>
                    {data.location && <span>{data.location}</span>}
                    {/* Separators only for Classic */}
                    {!isMinimal && data.location && data.email && <span className="text-gray-300">•</span>}

                    {data.email && <span>{data.email}</span>}
                    {!isMinimal && data.email && data.phone && <span className="text-gray-300">•</span>}

                    {data.phone && <span>{data.phone}</span>}

                    {(data.githubUrl || data.linkedinUrl) && (
                        <div className={`flex gap-4 ${isMinimal ? 'mt-2' : ''}`}>
                            {data.githubUrl && <a href={data.githubUrl} target="_blank" rel="noreferrer" className="hover:text-black hover:underline flex items-center gap-1"><Github size={12} /> {data.githubUrl.replace(/^https?:\/\//, '')}</a>}
                            {!isMinimal && data.githubUrl && data.linkedinUrl && <span className="text-gray-300">•</span>}
                            {data.linkedinUrl && <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-black hover:underline flex items-center gap-1"><Linkedin size={12} /> {data.linkedinUrl.replace(/^https?:\/\//, '')}</a>}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
                {/* Summary */}
                {data.summary && (
                    <div className="space-y-2">
                        <h2 style={sectionTitleStyle}>Summary</h2>
                        <p className="leading-relaxed whitespace-pre-wrap">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div className="space-y-5">
                        <h2 style={sectionTitleStyle}>Experience</h2>
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="space-y-1 avoid-break">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-lg" style={{ color: isMinimal ? '#1f2937' : '#000' }}>{exp.role}</h3>
                                    <span className="text-gray-500 italic text-xs">{exp.duration}</span>
                                </div>
                                <div className="font-medium text-gray-700">{exp.company}</div>
                                {exp.description && (
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600 mt-2">
                                        {exp.description.split('\n').map((line, i) => line.trim() && (
                                            <li key={i}>{line.trim().replace(/^•\s*/, '')}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                    <div className="space-y-4">
                        <h2 style={sectionTitleStyle}>Projects</h2>
                        {data.projects.map((proj) => (
                            <div key={proj.id} className="space-y-1 avoid-break">
                                <div className="flex justify-between items-baseline">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold">{proj.name}</h3>
                                        <div className="flex gap-2">
                                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: themeColor }} className="text-xs hover:underline flex items-center gap-0.5">Live ↗</a>}
                                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-black hover:underline flex items-center gap-0.5">Code ↗</a>}
                                        </div>
                                    </div>
                                </div>

                                {proj.techStack && proj.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {proj.techStack.map((tech, i) => (
                                            <span key={i} className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-gray-600 leading-relaxed">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <div className="space-y-3">
                        <h2 style={sectionTitleStyle}>Education</h2>
                        {data.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-baseline avoid-break">
                                <div>
                                    <h3 className="font-bold">{edu.degree}</h3>
                                    <div className="text-sm text-gray-600">{edu.school}</div>
                                </div>
                                <span className="text-gray-500 italic text-xs">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {(data.skills.technical?.length > 0 || data.skills.soft?.length > 0 || data.skills.tools?.length > 0) && (
                    <div className="space-y-3 avoid-break">
                        <h2 style={sectionTitleStyle}>Skills</h2>
                        <div className="space-y-2 text-sm">
                            {/* Render Helper */}
                            {[
                                { l: 'Technical', d: data.skills.technical },
                                { l: 'Tools', d: data.skills.tools },
                                { l: 'Soft Skills', d: data.skills.soft }
                            ].map(cat => cat.d?.length > 0 && (
                                <div key={cat.l} className="flex gap-2">
                                    <span className="font-bold text-gray-400 uppercase text-xs w-24 shrink-0">{cat.l}:</span>
                                    <span className="text-gray-700">{cat.d.join(' • ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { -webkit-print-color-adjust: exact; }
                    .avoid-break { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}
