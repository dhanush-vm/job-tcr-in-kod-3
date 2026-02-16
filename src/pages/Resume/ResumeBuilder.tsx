import { useState, useEffect } from 'react';
import { Plus, Wand2, Briefcase, GraduationCap, User, FileText, Trash2, Award, Zap, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, X, Loader2, Check, Download, Github } from 'lucide-react';
import ResumePaper, { type ResumeData, type Skills, type TemplateType } from './ResumePaper';

// --- Types ---
// Re-defining these for local state updates, matching ResumeData structure
interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
}

interface Education {
    id: string;
    degree: string;
    school: string;
    year: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    link: string;
    liveUrl: string;
    githubUrl: string;
    techStack: string[];
}

const INITIAL_DATA: ResumeData = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    githubUrl: '',
    linkedinUrl: '',
    selectedTemplate: 'classic',
    themeColor: '#2a9d8f'
};

const THEME_COLORS = [
    { name: 'Teal', value: '#2a9d8f' },
    { name: 'Navy', value: '#264653' },
    { name: 'Burgundy', value: '#8f2a4f' },
    { name: 'Forest', value: '#2a7d4f' },
    { name: 'Charcoal', value: '#404040' }
];

const TEMPLATES: { id: TemplateType, label: string }[] = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal', label: 'Minimal' }
];

const ACTION_VERBS = [
    'Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated',
    'Managed', 'Launched', 'Engineered', 'Architected', 'Spearheaded', 'Directed', 'Orchestrated'
];

// --- Helper Functions ---
const checkBulletPoint = (text: string) => {
    const suggestions: string[] = [];
    if (!text.trim()) return suggestions;

    const firstWord = text.trim().split(' ')[0];
    const startsWithVerb = ACTION_VERBS.some(verb => firstWord.toLowerCase() === verb.toLowerCase());
    if (!startsWithVerb) {
        suggestions.push("Start with a strong action verb (e.g., Built, Led).");
    }

    const hasMetrics = /[\d%$\+]/.test(text); // Checks for digits, %, $, +
    if (!hasMetrics) {
        suggestions.push("Add measurable impact (numbers, %, $).");
    }

    return suggestions;
};

const calculateScore = (data: ResumeData) => {
    let score = 0;
    const improvements: string[] = [];

    // Projects >= 2
    if (data.projects.length >= 2) {
        score += 10;
    } else {
        improvements.push("Add another project (aim for 2+).");
    }

    // Numbers in bullets
    const hasNumbers = data.experience.some(exp => /[\d%$\+]/.test(exp.description)) ||
        data.projects.some(proj => /[\d%$\+]/.test(proj.description));
    if (hasNumbers) {
        score += 15;
    } else {
        improvements.push("Add metrics to experience/projects.");
    }

    // Summary Length (40-120 words)
    const summaryWordCount = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (summaryWordCount >= 40) {
        score += 15;
    } else {
        improvements.push("Expand your summary (40+ words).");
    }

    // Skills >= 8 (Total across categories)
    const totalSkills = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
    // Legacy String support for score calculation if needed during migration not needed as we migrate on load
    if (totalSkills >= 8) {
        score += 10;
    } else {
        improvements.push("Add more skills (aim for 8+).");
    }

    // Experience >= 1
    if (data.experience.length >= 1) {
        score += 10;
    } else {
        improvements.push("Add an internship or work experience.");
    }

    // Links
    if (data.githubUrl || data.linkedinUrl) score += 10;

    // Education complete
    const educationComplete = data.education.length > 0 && data.education.every(edu => edu.degree && edu.school && edu.year);
    if (educationComplete) score += 10;

    return { score: Math.min(score, 100), improvements: improvements.slice(0, 3) };
};

export default function ResumeBuilder() {
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);
    const [scoreResult, setScoreResult] = useState({ score: 0, improvements: [] as string[] });
    const [expandedProject, setExpandedProject] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState<{ [key in keyof Skills]: string }>({ technical: '', soft: '', tools: '' });
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
    const [downloadToast, setDownloadToast] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('resumeBuilderData');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migrations
                if (typeof parsed.skills === 'string') {
                    const legacySkills = parsed.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
                    parsed.skills = {
                        technical: legacySkills,
                        soft: [],
                        tools: []
                    };
                }

                if (!parsed.selectedTemplate) parsed.selectedTemplate = 'classic';
                if (!parsed.themeColor) parsed.themeColor = '#2a9d8f';

                // Ensure new project fields exist
                parsed.projects = parsed.projects.map((p: any) => ({
                    ...p,
                    techStack: p.techStack || [],
                    liveUrl: p.liveUrl || '',
                    githubUrl: p.githubUrl || ''
                }));

                setData(parsed);
            } catch (e) {
                console.error("Failed to load resume data", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        setScoreResult(calculateScore(data));
    }, [data]);

    const handleInputChange = (field: keyof ResumeData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // --- Skills Logic ---
    const addSkill = (category: keyof Skills, skill: string) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        if (data.skills[category].includes(trimmed)) return;

        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], trimmed]
            }
        }));
        setSkillInput(prev => ({ ...prev, [category]: '' }));
    };

    const removeSkill = (category: keyof Skills, skillToRemove: string) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skillToRemove)
            }
        }));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent, category: keyof Skills) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(category, skillInput[category]);
        }
    };

    const suggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            setData(prev => {
                const newSkills = { ...prev.skills };
                const suggestions = {
                    technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
                    soft: ["Team Leadership", "Problem Solving"],
                    tools: ["Git", "Docker", "AWS"]
                };

                // Add if not present
                (Object.keys(suggestions) as Array<keyof Skills>).forEach(cat => {
                    suggestions[cat].forEach(s => {
                        if (!newSkills[cat].includes(s)) newSkills[cat].push(s);
                    });
                });

                return { ...prev, skills: newSkills };
            });
            setIsSuggestingSkills(false);
        }, 1000);
    };

    // --- Projects Logic ---
    const addProject = () => {
        const newId = crypto.randomUUID();
        setData(prev => ({
            ...prev,
            projects: [...prev.projects, { id: newId, name: 'New Project', description: '', link: '', liveUrl: '', githubUrl: '', techStack: [] }]
        }));
        setExpandedProject(newId);
    };

    const updateProject = (id: string, field: keyof Project, value: any) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeProject = (id: string) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.filter(item => item.id !== id)
        }));
    };

    const addProjectTech = (id: string, tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(item => {
                if (item.id === id && !item.techStack.includes(trimmed)) {
                    return { ...item, techStack: [...item.techStack, trimmed] };
                }
                return item;
            })
        }));
    };

    const removeProjectTech = (id: string, tagToRemove: string) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(item => {
                if (item.id === id) {
                    return { ...item, techStack: item.techStack.filter(t => t !== tagToRemove) };
                }
                return item;
            })
        }));
    };

    // --- Standard List Logic ---
    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: crypto.randomUUID(), role: '', company: '', duration: '', description: '' }]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeExperience = (id: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.filter(item => item.id !== id)
        }));
    };

    const addEducation = () => {
        setData(prev => ({
            ...prev,
            education: [...prev.education, { id: crypto.randomUUID(), degree: '', school: '', year: '' }]
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeEducation = (id: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.filter(item => item.id !== id)
        }));
    };

    const loadSampleData = () => {
        setData({
            fullName: 'Alex Morgan',
            email: 'alex.morgan@example.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            summary: 'Results-driven software engineer with 5+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Reduced server costs by 30% through optimization.',
            experience: [
                { id: '1', role: 'Senior Developer', company: 'TechNova', duration: '2021 - Present', description: 'Led a team of 6 developers to launch a new fintech product. Improved API response times by 40%.' },
                { id: '2', role: 'Web Developer', company: 'Creative Solutions', duration: '2019 - 2021', description: 'Developed responsive websites for 20+ clients using modern CSS frameworks.' }
            ],
            education: [
                { id: '1', degree: 'B.S. Computer Science', school: 'MIT', year: '2019' }
            ],
            projects: [
                { id: '1', name: 'E-commerce Platform', description: 'Built a full-stack e-commerce site handling 10k+ daily users.', link: '', liveUrl: 'https://demo.com', githubUrl: 'https://github.com', techStack: ['React', 'Node.js', 'MongoDB'] },
                { id: '2', name: 'Task Manager App', description: 'Created a productivity tool with real-time collaboration features.', link: '', liveUrl: '', githubUrl: 'https://github.com', techStack: ['Vue.js', 'Firebase'] }
            ],
            skills: {
                technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
                soft: ['Team Leadership', 'Communication'],
                tools: ['Git', 'Docker', 'AWS']
            },
            githubUrl: 'github.com/alexmorgan',
            linkedinUrl: 'linkedin.com/in/alexmorgan',
            selectedTemplate: 'modern',
            themeColor: '#2a9d8f'
        });
    };

    const handleDownload = () => {
        setDownloadToast(true);
        setTimeout(() => setDownloadToast(false), 4000);
        // Mock download action for UI feedback
        setTimeout(() => window.print(), 500);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 relative">

            {/* Download Toast */}
            {downloadToast && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={20} className="text-green-400" />
                    <span className="font-medium">PDF export ready! Check your downloads.</span>
                </div>
            )}

            {/* Left Column: Form - 50% */}
            <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white shadow-xl z-20">
                <div className="p-8 max-w-2xl mx-auto space-y-10 pb-20">

                    {/* Header & Score */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Resume Details</h2>
                            <button
                                onClick={loadSampleData}
                                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg transition-colors"
                            >
                                <Wand2 size={14} />
                                Sample Data
                            </button>
                        </div>

                        {/* Score Card */}
                        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ATS Readiness Score</h3>
                                    <div className="text-4xl font-bold">{scoreResult.score}/100</div>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <Award size={24} className="text-amber-400" />
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreResult.score >= 80 ? 'bg-green-500' :
                                        scoreResult.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${scoreResult.score}%` }}
                                />
                            </div>

                            {/* Top Improvements */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top 3 Improvements</h4>
                                {scoreResult.improvements.length > 0 ? (
                                    <div className="space-y-2">
                                        {scoreResult.improvements.map((improvement, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                                <Zap size={14} className="mt-0.5 text-amber-400 shrink-0" />
                                                <span>{improvement}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-green-400">
                                        <CheckCircle2 size={14} />
                                        <span>Excellent! No major improvements needed.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg pb-2 border-b border-gray-100">
                            <User size={20} className="text-gray-400" />
                            <h3>Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['fullName', 'email', 'phone', 'location'].map((field) => (
                                <div key={field} className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {field.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <input
                                        type={field === 'email' ? 'email' : 'text'}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        value={(data as any)[field]}
                                        onChange={(e) => handleInputChange(field as keyof ResumeData, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg pb-2 border-b border-gray-100">
                            <FileText size={20} className="text-gray-400" />
                            <h3>Professional Summary</h3>
                        </div>
                        <textarea
                            rows={4}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            value={data.summary}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                        />
                        <p className="text-xs text-gray-400 text-right">{data.summary.trim().split(/\s+/).filter(w => w.length > 0).length} words</p>
                    </section>

                    {/* Skills (Enhanced) */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <Zap size={20} className="text-gray-400" />
                                <h3>Skills</h3>
                            </div>
                            <button
                                onClick={suggestSkills}
                                disabled={isSuggestingSkills}
                                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                            >
                                {isSuggestingSkills ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                Suggest Skills
                            </button>
                        </div>

                        <div className="space-y-5">
                            {(['technical', 'soft', 'tools'] as const).map((category) => (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {category.charAt(0).toUpperCase() + category.slice(1)} Skills
                                        </label>
                                        <span className="text-xs text-gray-400">{data.skills[category].length} added</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
                                        {data.skills[category].map((skill, idx) => (
                                            <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-700 shadow-sm animate-in fade-in zoom-in duration-200">
                                                {skill}
                                                <button onClick={() => removeSkill(category, skill)} className="hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                        <input
                                            placeholder="Type & Enter..."
                                            className="bg-transparent border-none outline-none text-sm min-w-[100px] flex-1"
                                            value={skillInput[category]}
                                            onChange={(e) => setSkillInput(prev => ({ ...prev, [category]: e.target.value }))}
                                            onKeyDown={(e) => handleSkillKeyDown(e, category)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <Briefcase size={20} className="text-gray-400" />
                                <h3>Experience</h3>
                            </div>
                            <button
                                onClick={addExperience}
                                className="text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors uppercase tracking-wide flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Pattern
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button
                                        onClick={() => removeExperience(exp.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <input
                                            placeholder="Job Title"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                            value={exp.role}
                                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                        />
                                        <input
                                            placeholder="Company"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        />
                                        <input
                                            placeholder="Duration"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none col-span-2"
                                            value={exp.duration}
                                            onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <textarea
                                            placeholder="Description (Key achievements...)"
                                            className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none resize-none"
                                            rows={4}
                                            value={exp.description}
                                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        />
                                        {/* Bullet Guidance Warnings */}
                                        {exp.description && checkBulletPoint(exp.description).map((warning, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                                                <AlertCircle size={12} />
                                                <span>{warning}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {data.experience.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                                    No experience added.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Projects (Enhanced) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <Award size={20} className="text-gray-400" />
                                <h3>Projects</h3>
                            </div>
                            <button onClick={addProject} className="text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors uppercase tracking-wide flex items-center gap-1">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                    {/* Header / Collapse Trigger */}
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                                    >
                                        <span className="font-semibold text-gray-800">{proj.name || 'Untitled Project'}</span>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            {expandedProject === proj.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {/* Collapsible Content */}
                                    {expandedProject === proj.id && (
                                        <div className="p-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Project Title</label>
                                                    <input
                                                        className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                                        value={proj.name}
                                                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Live URL</label>
                                                    <input
                                                        className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                                        value={proj.liveUrl}
                                                        onChange={(e) => updateProject(proj.id, 'liveUrl', e.target.value)}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-400 uppercase">GitHub URL</label>
                                                    <input
                                                        className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                                        value={proj.githubUrl}
                                                        onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Tech Stack Tags */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Tech Stack</label>
                                                <div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-200 rounded focus-within:ring-2 focus-within:ring-black">
                                                    {proj.techStack?.map((tag, idx) => (
                                                        <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                                                            {tag}
                                                            <button onClick={() => removeProjectTech(proj.id, tag)} className="hover:text-red-500"><X size={10} /></button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        placeholder="Add Tech..."
                                                        className="bg-transparent border-none outline-none text-xs min-w-[60px] flex-1"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addProjectTech(proj.id, e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                                    <span className="text-xs text-gray-400">{proj.description.length}/200</span>
                                                </div>
                                                <textarea
                                                    className="w-full p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none resize-none"
                                                    rows={3}
                                                    maxLength={200}
                                                    value={proj.description}
                                                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                                />
                                                {/* Bullet Guidance Warnings */}
                                                {proj.description && checkBulletPoint(proj.description).map((warning, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                                                        <AlertCircle size={12} />
                                                        <span>{warning}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => removeProject(proj.id)}
                                                className="w-full py-2 text-red-500 hover:bg-red-50 text-xs font-bold uppercase rounded transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={14} /> Remove Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                <GraduationCap size={20} className="text-gray-400" />
                                <h3>Education</h3>
                            </div>
                            <button onClick={addEducation} className="text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors uppercase tracking-wide flex items-center gap-1">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button
                                        onClick={() => removeEducation(edu.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Degree"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        />
                                        <input
                                            placeholder="School"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                        />
                                        <input
                                            placeholder="Year"
                                            className="p-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-black focus:outline-none col-span-2"
                                            value={edu.year}
                                            onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Links */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg pb-2 border-b border-gray-100">
                            <Github size={20} className="text-gray-400" />
                            <h3>Links</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Github size={12} /> GitHub</label>
                                <input
                                    type="url"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    value={data.githubUrl}
                                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><User size={12} /> LinkedIn</label>
                                <input
                                    type="url"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    value={data.linkedinUrl}
                                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            {/* Right Column: Preview - 50% */}
            <div className="w-1/2 bg-gray-100 p-8 overflow-y-auto flex flex-col items-center">

                {/* Customization Toolbar */}
                <div className="w-full max-w-[210mm] mb-6 space-y-4 sticky top-0 z-30 pt-4">

                    {/* Template Picker */}
                    <div className="flex gap-4 justify-center">
                        {TEMPLATES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleInputChange('selectedTemplate', t.id)}
                                className={`group relative w-28 h-20 rounded-lg border-2 transition-all overflow-hidden flex flex-col items-center justify-center gap-1 ${data.selectedTemplate === t.id
                                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600'
                                    : 'border-white bg-white hover:border-gray-300 shadow-sm'
                                    }`}
                            >
                                <div className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{t.label}</div>
                                {/* Mini Preview Skeleton */}
                                <div className="w-16 h-10 border border-gray-100 rounded-sm bg-white p-1 gap-1 flex">
                                    {t.id === 'modern' ? (
                                        <>
                                            <div className="w-[30%] h-full bg-gray-200 rounded-[1px]"></div>
                                            <div className="w-[70%] space-y-1">
                                                <div className="w-full h-1 bg-gray-200 rounded-[1px]"></div>
                                                <div className="w-3/4 h-1 bg-gray-200 rounded-[1px]"></div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={`w-full h-full flex flex-col items-center ${t.id === 'minimal' ? 'justify-start pt-1' : 'justify-center'}`}>
                                            <div className="w-3/4 h-1 bg-gray-200 rounded-[1px] mb-1"></div>
                                            <div className="w-full h-0.5 bg-gray-100 rounded-[1px]"></div>
                                            <div className="w-full h-0.5 bg-gray-100 rounded-[1px] mt-0.5"></div>
                                        </div>
                                    )}
                                </div>
                                {data.selectedTemplate === t.id && (
                                    <div className="absolute top-1 right-1">
                                        <div className="bg-blue-600 text-white rounded-full p-0.5"><Check size={8} /></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Color Picker */}
                    <div className="flex gap-3 justify-center bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm border border-white/50 w-fit mx-auto">
                        {THEME_COLORS.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => handleInputChange('themeColor', c.value)}
                                className={`w-6 h-6 rounded-full transition-all ${data.themeColor === c.value
                                    ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                                    : 'hover:scale-110 hover:shadow-md'
                                    }`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Resume Paper */}
                <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm transform scale-95 origin-top transition-all duration-500 ease-out relative group">
                    <ResumePaper data={data} />

                    {/* Floating Download Button (Preview Only) */}
                    <button
                        onClick={handleDownload}
                        className="absolute bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-105 print:hidden"
                    >
                        <Download size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
