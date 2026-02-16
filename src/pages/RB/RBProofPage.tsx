import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Copy, ExternalLink, Github, Globe, CheckSquare, Square } from 'lucide-react';
import { DashboardCard } from '../../components/ui/DashboardCard';

const STEPS = [
    { id: 1, label: 'Problem Statement', path: '/rb/01-problem' },
    { id: 2, label: 'Market Analysis', path: '/rb/02-market' },
    { id: 3, label: 'System Architecture', path: '/rb/03-architecture' },
    { id: 4, label: 'High Level Design', path: '/rb/04-hld' },
    { id: 5, label: 'Low Level Design', path: '/rb/05-lld' },
    { id: 6, label: 'Build Phase', path: '/rb/06-build' },
    { id: 7, label: 'Testing Strategy', path: '/rb/07-test' },
    { id: 8, label: 'Shipping & Deployment', path: '/rb/08-ship' },
];

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

export default function RBProofPage() {
    const [stepStatus, setStepStatus] = useState<Record<number, boolean>>({});
    const [checklist, setChecklist] = useState<Record<number, boolean>>({});

    // Form Inputs
    const [lovableLink, setLovableLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');

    const [copied, setCopied] = useState(false);

    // Initial Load
    useEffect(() => {
        // Load Steps
        const statuses: Record<number, boolean> = {};
        STEPS.forEach(step => {
            statuses[step.id] = !!localStorage.getItem(`rb_step_${step.id}_artifact`);
        });
        setStepStatus(statuses);

        // Load Checklist
        const savedChecklist = localStorage.getItem('rb_qa_checklist');
        if (savedChecklist) {
            setChecklist(JSON.parse(savedChecklist));
        }

        // Load Links
        const savedSubmission = localStorage.getItem('rb_final_submission');
        if (savedSubmission) {
            const parsed = JSON.parse(savedSubmission);
            setLovableLink(parsed.lovableLink || '');
            setGithubLink(parsed.githubLink || '');
            setDeployLink(parsed.deployLink || '');
        }
    }, []);

    // Save Checklist on Change
    useEffect(() => {
        localStorage.setItem('rb_qa_checklist', JSON.stringify(checklist));
    }, [checklist]);

    // Save Links on Change
    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify({
            lovableLink, githubLink, deployLink
        }));
    }, [lovableLink, githubLink, deployLink]);

    const handleChecklistToggle = (index: number) => {
        setChecklist(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Validation
    const allStepsCompleted = Object.values(stepStatus).filter(Boolean).length === 8;
    const allChecklistPassed = CHECKLIST_ITEMS.every((_, i) => checklist[i]);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const allLinksValid = isValidUrl(lovableLink) && isValidUrl(githubLink) && isValidUrl(deployLink);
    const isReadyToShip = allStepsCompleted && allLinksValid && allChecklistPassed;

    const handleCopy = () => {
        const submission = `
AI Resume Builder — Final Submission

Lovable Project: ${lovableLink}
GitHub Repository: ${githubLink}
Live Deployment: ${deployLink}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
`.trim();

        navigator.clipboard.writeText(submission);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        if (isReadyToShip) {
            localStorage.setItem('rb_project_status', 'Shipped');
            window.dispatchEvent(new Event('storage'));
        }
    };

    const isShipped = localStorage.getItem('rb_project_status') === 'Shipped';

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Final Proof & Submission</h1>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${isShipped
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                    {isShipped ? 'SHIPPED' : 'IN PROGRESS'}
                </div>
            </div>

            {/* Shipped Banner */}
            {isShipped && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-8 text-center animate-in fade-in duration-700">
                    <div className="mx-auto bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4">
                        <CheckCircle2 className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Project 3 Shipped Successfully.</h2>
                    <p className="text-green-700">All systems operational. Ready for deployment.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Status & Checklist */}
                <div className="space-y-8">
                    {/* Step Status */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">1. Build Tracks</h3>
                            <span className="text-sm text-gray-500">{Object.values(stepStatus).filter(Boolean).length}/8</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {STEPS.map((step) => (
                                <div key={step.id} className="p-3 px-4 flex items-center gap-3 border-b last:border-0 hover:bg-gray-50">
                                    {stepStatus[step.id] ? <CheckCircle2 className="text-green-600" size={18} /> : <Circle className="text-gray-300" size={18} />}
                                    <span className={`text-sm ${stepStatus[step.id] ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QA Checklist */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">2. QA Checklist</h3>
                            <span className={`text-sm font-medium ${allChecklistPassed ? 'text-green-600' : 'text-orange-600'}`}>
                                {CHECKLIST_ITEMS.filter((_, i) => checklist[i]).length}/10
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {CHECKLIST_ITEMS.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleChecklistToggle(index)}
                                    className="w-full text-left p-3 px-4 flex items-start gap-3 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className={`mt-0.5 transition-colors ${checklist[index] ? 'text-green-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                        {checklist[index] ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </div>
                                    <span className={`text-sm ${checklist[index] ? 'text-gray-900' : 'text-gray-600'}`}>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Artifacts & Submission */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                                <Globe size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-900">3. Deployment Artifacts</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lovable Project URL</label>
                                <input
                                    type="url"
                                    placeholder="https://lovable.dev/..."
                                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${lovableLink && !isValidUrl(lovableLink) ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                    value={lovableLink}
                                    onChange={(e) => setLovableLink(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">GitHub Repository</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/..."
                                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${githubLink && !isValidUrl(githubLink) ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                    value={githubLink}
                                    onChange={(e) => setGithubLink(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Deployment</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${deployLink && !isValidUrl(deployLink) ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                    value={deployLink}
                                    onChange={(e) => setDeployLink(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-gray-400" /> 4. Final Verification
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Build Steps (8/8)</span>
                                {allStepsCompleted ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-gray-300" />}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">QA Checklist (10/10)</span>
                                {allChecklistPassed ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-gray-300" />}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Valid Artifact Links</span>
                                {allLinksValid ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-gray-300" />}
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            disabled={!isReadyToShip}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${isReadyToShip
                                ? 'bg-black text-white hover:bg-gray-800 shadow-md transform hover:-translate-y-0.5'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            <span>{copied ? 'Copied to Clipboard' : 'Copy Final Submission'}</span>
                        </button>

                        {!isReadyToShip && (
                            <p className="text-xs text-center text-gray-500 mt-3">
                                Complete all requirements to unlock submission
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
