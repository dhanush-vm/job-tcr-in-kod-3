import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysis, updateAnalysis, type AnalysisResult } from '../../lib/storage';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { ArrowLeft, Check, Copy, Download, ThumbsUp, AlertTriangle, ArrowRight, Building2, Users, Target, Clock, MapPin } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AssessmentResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState<AnalysisResult | null>(null);

    // Local state for interactivity
    const [skillConfidence, setSkillConfidence] = useState<Record<string, 'know' | 'practice'>>({});
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        if (id) {
            const data = getAnalysis(id);
            if (data) {
                setResult(data);
                // Initialize local state
                const initialConfidence = data.skillConfidenceMap || {};

                // Fallback for first load if map is empty but skills exist
                if (Object.keys(initialConfidence).length === 0 && data.extractedSkills) {
                    Object.values(data.extractedSkills).flat().forEach(skill => {
                        initialConfidence[skill] = 'practice';
                    });
                }

                setSkillConfidence(initialConfidence);
                setCurrentScore(data.finalScore || data.baseScore);
            }
        }
    }, [id]);

    // Handle Score Updates
    useEffect(() => {
        if (!result || !id) return;

        const base = result.baseScore;

        let modifier = 0;
        Object.values(skillConfidence).forEach(status => {
            if (status === 'know') modifier += 2;
            if (status === 'practice') modifier -= 2;
        });

        let newScore = base + modifier;
        newScore = Math.max(0, Math.min(100, newScore)); // Bounds 0-100

        if (newScore !== currentScore) {
            setCurrentScore(newScore);
            // Auto-save
            updateAnalysis(id, {
                finalScore: newScore,
                skillConfidenceMap: skillConfidence
            });
        }
    }, [skillConfidence, result, id]);

    const toggleSkill = (skill: string) => {
        setSkillConfidence(prev => ({
            ...prev,
            [skill]: prev[skill] === 'know' ? 'practice' : 'know'
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const downloadTxt = () => {
        if (!result) return;

        let intelSection = "";
        if (result.companyIntel) {
            intelSection = `
COMPANY INTEL
Size: ${result.companyIntel.size}
Industry: ${result.companyIntel.industry}
Hiring Focus: ${result.companyIntel.focus}
`;
        }

        const content = `
JOB ANALYSIS REPORT
Company: ${result.company}
Role: ${result.role}
Date: ${new Date(result.createdAt).toLocaleString()}
Readiness Score: ${currentScore}/100
${intelSection}
KEY SKILLS
${Object.entries(result.extractedSkills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('\n')}

7-DAY PREPARATION PLAN
${result.plan7Days.map(d => `${d.day} (${d.focus}):\n${d.tasks.map(t => `  - ${t}`).join('\n')}`).join('\n')}

INTERVIEW ROUNDS
${result.roundMapping ? result.roundMapping.map(r => `${r.roundTitle} (${r.duration}): ${r.whyItMatters}`).join('\n') : "N/A"}

CHECKLIST
${result.checklist.map(c => `${c.roundTitle}:\n${c.items.map(i => `  - ${i}`).join('\n')}`).join('\n')}

INTERVIEW QUESTIONS
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
      `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analysis_${result.company}_${result.role}.txt`;
        a.click();
    };

    const weakSkills = Object.keys(skillConfidence).filter(s => skillConfidence[s] === 'practice').slice(0, 3);

    if (!result) return <div className="p-8 text-center">Loading result...</div>;

    const scoreData = [
        { name: 'Score', value: currentScore },
        { name: 'Remaining', value: 100 - currentScore }
    ];

    const COLORS = ['hsl(245, 58%, 51%)', '#e5e7eb'];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <button onClick={() => navigate('/assessments')} className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" /> Back to History
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{result.role || "Job Role"}</h1>
                    <p className="text-xl text-gray-600">{result.company || "Target Company"}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={downloadTxt} className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Download size={16} /> Download
                    </button>
                </div>
            </div>

            {/* Company Intel Card */}
            {result.companyIntel && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="flex-1">
                            <h3 className="text-white/60 text-sm font-medium mb-1 uppercase tracking-wider">Company Profile</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 className="text-primary-foreground" size={24} />
                                <span className="text-2xl font-bold">{result.company || "Company"}</span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                                    <Users size={16} /> {result.companyIntel.size}
                                </div>
                                <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                                    <MapPin size={16} /> {result.companyIntel.industry}
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-8">
                            <h4 className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Hiring Focus</h4>
                            <div className="flex items-start gap-3">
                                <Target className="text-green-400 shrink-0 mt-1" size={20} />
                                <p className="text-lg leading-snug">{result.companyIntel.focus}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Live Score */}
                <DashboardCard title="Live Readiness Score" className="md:col-span-1">
                    <div className="h-64 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={scoreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {scoreData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-gray-900 transition-all duration-300">{currentScore}</span>
                            <span className="text-sm text-gray-500">/100</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Adjusts live as you mark skills.</p>
                    </div>
                </DashboardCard>

                {/* Skill Self-Assessment */}
                <DashboardCard title="Skill Self-Assessment" className="md:col-span-2">
                    <div className="space-y-4">
                        {Object.keys(result.extractedSkills).length === 0 ? (
                            <p className="text-gray-500 italic">No specific technical keywords detected.</p>
                        ) : (
                            Object.entries(result.extractedSkills).map(([category, skills]) => (
                                skills.length > 0 && <div key={category}>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-3 py-1 text-sm rounded-full font-medium border flex items-center gap-2 transition-all ${skillConfidence[skill] === 'know'
                                                    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                                                    }`}
                                            >
                                                {skillConfidence[skill] === 'know' ? <Check size={12} /> : <AlertTriangle size={12} />}
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div> I know this (+2)</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded-full"></div> Need practice (-2)</div>
                    </div>
                </DashboardCard>
            </div>

            {/* Round Mapping Timeline */}
            {result.roundMapping && (
                <DashboardCard title="Expected Interview Rounds" action={<Clock size={20} className="text-blue-500" />}>
                    <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 my-4">
                        {result.roundMapping.map((round, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{round.roundTitle}</h4>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2 inline-block">{round.duration}</span>
                                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl italic mb-2">{round.whyItMatters}</p>
                                <div className="flex flex-wrap gap-2">
                                    {round.focusAreas.map((area, j) => (
                                        <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{area}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            )}

            {/* Action Next Box */}
            {weakSkills.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* ... (Kept same) */}
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center shrink-0">
                            <ThumbsUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Recommended Next Action</h3>
                            <p className="text-gray-600">
                                Focus on <span className="font-semibold text-primary">{weakSkills.join(', ')}</span>.
                                Start Day 1 of your plan now.
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
                        Start Learning <ArrowRight size={16} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 7-Day Plan (New Schema) */}
                <DashboardCard
                    title="7-Day Preparation Plan"
                    action={
                        <button onClick={() => copyToClipboard(JSON.stringify(result.plan7Days, null, 2))} className="text-gray-400 hover:text-primary transition-colors" title="Copy Plan">
                            <Copy size={18} />
                        </button>
                    }
                >
                    <div className="space-y-4">
                        {result.plan7Days.map((day, i) => (
                            <div key={i} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{day.focus}</h4>
                                        <span className="text-xs text-gray-500">{day.day}</span>
                                    </div>
                                </div>
                                <ul className="ml-11 list-disc list-outside text-gray-600 text-sm space-y-1">
                                    {day.tasks.map((task, j) => (
                                        <li key={j}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                <div className="flex flex-col gap-6">
                    {/* Checklist (New Schema) */}
                    <DashboardCard
                        title="Round-wise Checklist"
                        action={
                            <button onClick={() => copyToClipboard(JSON.stringify(result.checklist, null, 2))} className="text-gray-400 hover:text-primary transition-colors" title="Copy Checklist">
                                <Copy size={18} />
                            </button>
                        }
                    >
                        <div className="space-y-4">
                            {result.checklist.map((section, i) => (
                                <div key={i}>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">{section.roundTitle}</h4>
                                    <ul className="space-y-2">
                                        {section.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className="mt-1 h-4 w-4 rounded border border-gray-300 flex items-center justify-center shrink-0">
                                                    <div className="h-2 w-2 rounded bg-transparent group-hover:bg-primary"></div>
                                                </div>
                                                <span className="text-sm text-gray-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    <DashboardCard
                        title="Likely Interview Questions"
                        action={
                            <button onClick={() => copyToClipboard(result.questions.join('\n'))} className="text-gray-400 hover:text-primary transition-colors" title="Copy Questions">
                                <Copy size={18} />
                            </button>
                        }
                    >
                        <div className="space-y-3">
                            {result.questions.map((q, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 text-sm font-medium">
                                    <span className="text-gray-400 mr-2">{i + 1}.</span> {q}
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
}
