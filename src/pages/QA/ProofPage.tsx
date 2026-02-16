import { useState, useEffect } from 'react';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { Input } from '../../components/ui/Input';
import { CheckCircle, Copy, Trophy, AlertCircle, ShieldCheck } from 'lucide-react';
import Confetti from 'react-confetti';

const STEPS = [
    "Job Analysis Engine",
    "History Persistence",
    "Company Intel Layer",
    "Round Mapping Logic",
    "Data Hardening",
    "QA Checklist",
    "Shipment Lock",
    "Final Proof"
];

const STORAGE_KEY = 'prp_final_submission';
const QA_KEY = 'prp_test_checklist';

export default function ProofPage() {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [isShipped, setIsShipped] = useState(false);
    const [qaPassed, setQaPassed] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        // Load links
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setLinks(JSON.parse(stored));

        // Check QA status
        const qaStored = localStorage.getItem(QA_KEY);
        if (qaStored) {
            try {
                const checked = JSON.parse(qaStored);
                // Assuming 10 items required
                if (Object.values(checked).filter(Boolean).length >= 10) setQaPassed(true);
            } catch (e) { }
        }

        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Check Shipped Condition
        // 1. All links present & valid (simple length check + regex for http)
        // 2. QA Passed
        const isValidUrl = (s: string) => s.startsWith('http');
        const allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);

        const shipped = allLinksValid && qaPassed;
        setIsShipped(shipped);

        // Update global status for AppShell/Sidebar if needed (optional, but good for persistence)
        if (shipped) {
            localStorage.setItem('prp_project_status', 'Shipped');
        } else {
            localStorage.setItem('prp_project_status', 'In Progress');
        }

    }, [links, qaPassed]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLinks = { ...links, [e.target.name]: e.target.value };
        setLinks(newLinks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
    };

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();
        navigator.clipboard.writeText(text);
        alert("Submission copied to clipboard!");
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
            {isShipped && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Final Proof & Submission</h1>
                    <p className="text-gray-600">Verify your build and generate the final submission artifact.</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase flex items-center gap-2 ${isShipped ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"
                    }`}>
                    {isShipped ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    Status: {isShipped ? "Shipped" : "In Progress"}
                </div>
            </div>

            {/* Step Overview */}
            <DashboardCard title="Build Journey">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
                    {STEPS.map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <CheckCircle size={16} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider text-center max-w-[80px] leading-tight">
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </DashboardCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DashboardCard title="Artifact Inputs">
                    <p className="text-sm text-gray-500 mb-6">Enter the required links to mark the project as complete.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lovable Project Link <span className="text-red-500">*</span></label>
                            <Input
                                name="lovable"
                                placeholder="https://lovable.dev/..."
                                value={links.lovable}
                                onChange={handleChange as any}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository <span className="text-red-500">*</span></label>
                            <Input
                                name="github"
                                placeholder="https://github.com/..."
                                value={links.github}
                                onChange={handleChange as any}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Live Deployment <span className="text-red-500">*</span></label>
                            <Input
                                name="deployed"
                                placeholder="https://vercel.app/..."
                                value={links.deployed}
                                onChange={handleChange as any}
                            />
                        </div>
                    </div>
                </DashboardCard>

                <div className="space-y-6">
                    <DashboardCard title="Final Export">
                        <div className="bg-slate-900 rounded-lg p-6 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto">
                            <p className="text-slate-500 border-b border-slate-700 pb-2 mb-2">PREVIEW</p>
                            <div className="opacity-75">
                                <p>Placement Readiness Platform — Final Submission</p>
                                <br />
                                <p>Lovable Project: {links.lovable || "..."}</p>
                                <p>GitHub Repository: {links.github || "..."}</p>
                                <p>Live Deployment: {links.deployed || "..."}</p>
                            </div>
                        </div>
                        <button
                            onClick={copyFinalSubmission}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-all"
                        >
                            <Copy size={18} /> Copy Final Submission
                        </button>
                    </DashboardCard>

                    {isShipped && (
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-8 text-white text-center shadow-xl transform transition-all hover:scale-[1.02]">
                            <Trophy className="mx-auto mb-4 text-yellow-300" size={48} />
                            <h2 className="text-2xl font-bold mb-4">You built a real product.</h2>
                            <p className="text-indigo-100 text-lg leading-relaxed italic">
                                "Not a tutorial. Not a clone.<br />
                                A structured tool that solves a real problem.<br />
                                This is your proof of work."
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <span className="text-sm font-medium text-white/60">STATUS: SHIPPED 🚀</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
