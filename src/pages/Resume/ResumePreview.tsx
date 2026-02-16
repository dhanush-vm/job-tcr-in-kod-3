import { useState, useEffect } from 'react';
import { Copy, AlertTriangle, Check, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumePaper, { type ResumeData } from './ResumePaper';

export default function ResumePreview() {
    const [data, setData] = useState<ResumeData | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
    const [showWarnings, setShowWarnings] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('resumeBuilderData');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migration: Check if skills is a string (legacy)
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

    const validateResume = () => {
        if (!data) return [];
        const warnings = [];
        if (!data.fullName.trim()) warnings.push("Full Name is missing.");
        if (data.experience.length === 0 && data.projects.length === 0) warnings.push("Add at least one Experience or Project.");
        return warnings;
    };

    const handlePrint = () => {
        const warnings = validateResume();
        if (warnings.length > 0) {
            setValidationWarnings(warnings);
            setShowWarnings(true);
            setTimeout(() => window.print(), 500);
        } else {
            window.print();
        }
    };

    const handleCopyText = () => {
        if (!data) return;

        const warnings = validateResume();
        if (warnings.length > 0) {
            setValidationWarnings(warnings);
            setShowWarnings(true);
        }

        const lines = [
            data.fullName,
            `${data.location} | ${data.email} | ${data.phone}`,
            data.githubUrl,
            data.linkedinUrl,
            '',
            'SUMMARY',
            data.summary,
            '',
            'EXPERIENCE',
            ...data.experience.map(exp => `${exp.role} at ${exp.company} (${exp.duration})\n${exp.description}`),
            '',
            'PROJECTS',
            ...data.projects.map(proj => `${proj.name} - ${proj.liveUrl || proj.link}\n${proj.description}\nTech Stack: ${proj.techStack?.join(', ')}`),
            '',
            'EDUCATION',
            ...data.education.map(edu => `${edu.degree}, ${edu.school} (${edu.year})`),
            '',
            'SKILLS',
            `Technical: ${data.skills.technical?.join(', ') || ''}`,
            `Soft: ${data.skills.soft?.join(', ') || ''}`,
            `Tools: ${data.skills.tools?.join(', ') || ''}`
        ].filter(Boolean).join('\n');

        navigator.clipboard.writeText(lines).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    if (!data) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">

            {/* Toolbar - Hidden when printing */}
            <div className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 print:hidden">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/resume/builder" className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2">
                            ← Back to Builder
                        </Link>
                        <div className="h-4 w-[1px] bg-gray-300"></div>
                        <h1 className="text-lg font-bold text-gray-900">Resume Preview</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyText}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {copySuccess ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            {copySuccess ? "Copied!" : "Copy Text"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Printer size={16} />
                            Print / Save PDF
                        </button>
                    </div>
                </div>

                {/* Validation Warning Toast */}
                {showWarnings && (
                    <div className="bg-amber-50 border-t border-amber-200 px-6 py-3">
                        <div className="max-w-5xl mx-auto flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Your resume might be incomplete:</h4>
                                <ul className="list-disc list-inside text-sm text-amber-700 mt-1">
                                    {validationWarnings.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                            <button onClick={() => setShowWarnings(false)} className="ml-auto text-amber-500 hover:text-amber-800">&times;</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Resume Content */}
            <div className="p-10 print:p-0">
                <div className="bg-white shadow-2xl print:shadow-none print:w-full">
                    <ResumePaper data={data} />
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
