import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, AlertTriangle, Copy, ExternalLink, ImagePlus } from 'lucide-react';
import { DashboardCard } from '../../components/ui/DashboardCard';

interface RBStepPageProps {
    stepNumber: number;
}

const STEP_TITLES = [
    "Problem Statement",
    "Market Analysis",
    "System Architecture",
    "High Level Design",
    "Low Level Design",
    "Build Phase",
    "Testing Strategy",
    "Shipping & Deployment"
];

const STEP_PATHS = [
    "/rb/01-problem",
    "/rb/02-market",
    "/rb/03-architecture",
    "/rb/04-hld",
    "/rb/05-lld",
    "/rb/06-build",
    "/rb/07-test",
    "/rb/08-ship"
];

export default function RBStepPage({ stepNumber }: RBStepPageProps) {
    const navigate = useNavigate();
    const [artifact, setArtifact] = useState('');
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

    // Derived state
    const stepIndex = stepNumber - 1;
    const title = STEP_TITLES[stepIndex];
    const storageKey = `rb_step_${stepNumber}_artifact`;
    const isLastStep = stepNumber === 8;

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setArtifact(stored);
            setStatus('success');
        }
    }, [storageKey]);

    const handleSave = (newStatus: 'success' | 'error', text?: string) => {
        setStatus(newStatus);
        if (newStatus === 'success') {
            const content = text || artifact || 'Completed';
            localStorage.setItem(storageKey, content);
            setArtifact(content);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(artifact);
    };

    const handleNext = () => {
        if (isLastStep) {
            navigate('/rb/proof');
        } else {
            navigate(STEP_PATHS[stepIndex + 1]);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Workspace - 70% */}
            <div className="w-[70%] p-8 overflow-y-auto border-r border-gray-200">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Project 3</span>
                        <span>•</span>
                        <span>Step {stepNumber} of 8</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>

                <div className="prose max-w-none">
                    <DashboardCard className="min-h-[400px] flex items-center justify-center bg-gray-50 border-dashed">
                        <div className="text-center text-gray-400">
                            <p className="text-lg">Workspace for {title}</p>
                            <p className="text-sm">(Content implementation pending)</p>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Build Panel - 30% */}
            <div className="w-[30%] bg-white flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Build Assistant</h3>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {/* Copy to Lovable Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Copy This Into Lovable
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 p-3 text-sm border rounded-lg resize-none font-mono bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="// Paste your prompt or code here..."
                                value={artifact}
                                onChange={(e) => setArtifact(e.target.value)}
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 bg-white rounded-md border shadow-sm"
                                title="Copy to clipboard"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <a
                            href="https://lovable.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <ExternalLink size={18} />
                            <span>Build in Lovable</span>
                        </a>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSave('success')}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${status === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'border-gray-200 hover:bg-green-50 hover:text-green-700'
                                    }`}
                            >
                                <CheckCircle2 size={18} />
                                <span>It Worked</span>
                            </button>
                            <button
                                onClick={() => handleSave('error')}
                                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${status === 'error'
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'border-gray-200 hover:bg-red-50 hover:text-red-700'
                                    }`}
                            >
                                <AlertTriangle size={18} />
                                <span>Error</span>
                            </button>
                        </div>

                        <button className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <ImagePlus size={18} />
                            <span>Add Screenshot</span>
                        </button>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleNext}
                        disabled={status !== 'success'}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${status === 'success'
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <span>{isLastStep ? 'Finalize Project' : 'Next Step'}</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
