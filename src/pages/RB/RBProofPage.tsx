import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Copy, ExternalLink, Github, Globe } from 'lucide-react';
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

export default function RBProofPage() {
    const [stepStatus, setStepStatus] = useState<Record<number, boolean>>({});
    const [lovableLink, setLovableLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const statuses: Record<number, boolean> = {};
        STEPS.forEach(step => {
            statuses[step.id] = !!localStorage.getItem(`rb_step_${step.id}_artifact`);
        });
        setStepStatus(statuses);
    }, []);

    const allStepsCompleted = Object.values(stepStatus).filter(Boolean).length === 8;
    const allLinksProvided = lovableLink && githubLink && deployLink;
    const isReadyToShip = allStepsCompleted && allLinksProvided;

    const handleCopy = () => {
        const submission = `
Project 3: AI Resume Builder - Final Submission
-----------------------------------------------
Status: ${isReadyToShip ? 'COMPLETED' : 'IN PROGRESS'}

Links:
- Lovable Project: ${lovableLink}
- GitHub Repo: ${githubLink}
- Deployed App: ${deployLink}

Steps Completed: ${Object.values(stepStatus).filter(Boolean).length}/8
`.trim();

        navigator.clipboard.writeText(submission);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        if (isReadyToShip) {
            localStorage.setItem('rb_project_status', 'Shipped');
            // Force update header
            window.dispatchEvent(new Event('storage'));
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Final Proof & Submission</h1>
                <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${localStorage.getItem('rb_project_status') === 'Shipped'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                    {localStorage.getItem('rb_project_status') === 'Shipped' ? 'SHIPPED' : 'IN PROGRESS'}
                </div>
            </div>

            <DashboardCard className={isReadyToShip ? "bg-green-50 border-green-200" : "bg-white"}>
                <div className="flex items-center gap-6">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold ${allStepsCompleted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                        {Object.values(stepStatus).filter(Boolean).length}/8
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {allStepsCompleted ? "Build Track Completed!" : "Build Track In Progress"}
                        </h2>
                        <p className="text-gray-600">
                            {allStepsCompleted
                                ? "Great job! Fill in the submission links below to finalize the project."
                                : "Complete all 8 steps to unlock final submission."}
                        </p>
                    </div>
                </div>
            </DashboardCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Steps Status */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Step Completion Status</h3>
                    </div>
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className="p-4 flex items-center gap-3 border-b last:border-0 hover:bg-gray-50 transition-colors"
                        >
                            {stepStatus[step.id] ? (
                                <CheckCircle2 className="text-green-600" size={20} />
                            ) : (
                                <Circle className="text-gray-300" size={20} />
                            )}
                            <span className={stepStatus[step.id] ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                {step.id}. {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Submission Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Submission Links</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <ExternalLink size={16} /> Lovable Project Link
                            </label>
                            <input
                                type="url"
                                placeholder="https://lovable.dev/..."
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={lovableLink}
                                onChange={(e) => setLovableLink(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Github size={16} /> GitHub Repository Link
                            </label>
                            <input
                                type="url"
                                placeholder="https://github.com/..."
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Globe size={16} /> Deployed App URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={deployLink}
                                onChange={(e) => setDeployLink(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        disabled={!isReadyToShip}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${isReadyToShip
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                        <span>{copied ? 'Copied!' : 'Copy Final Submission'}</span>
                    </button>
                    {!isReadyToShip && (
                        <p className="text-sm text-center text-orange-600 flex items-center justify-center gap-2">
                            <AlertTriangle size={16} />
                            Complete all steps and fields to submit
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
