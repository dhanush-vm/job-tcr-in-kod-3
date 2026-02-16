import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ResumeHome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 text-center max-w-3xl px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-gray-600 text-sm font-medium mb-6">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Powered by AI</span>
                </div>

                <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                    Build a Resume That <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                        Gets Read.
                    </span>
                </h1>

                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Create professional, ats-ready resumes in minutes. Clean design, smart formatting, and premium typography.
                </p>

                <button
                    onClick={() => navigate('/resume/builder')}
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold text-lg transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                >
                    Start Building
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">10k+</h3>
                        <p className="text-sm text-gray-500 mt-1">Resumes Built</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">95%</h3>
                        <p className="text-sm text-gray-500 mt-1">Success Rate</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">Free</h3>
                        <p className="text-sm text-gray-500 mt-1">Forever</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
