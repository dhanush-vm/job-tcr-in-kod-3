import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Rocket, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';

export default function ShipPage() {
    const navigate = useNavigate();
    const [passed, setPassed] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const stored = localStorage.getItem('prp_test_checklist');
        if (stored) {
            try {
                const checkedItems = JSON.parse(stored);
                // Hardcoded expectation of 10 items
                const count = Object.values(checkedItems).filter(Boolean).length;
                if (count >= 10) {
                    setPassed(true);
                }
            } catch (e) {
                console.error("Failed to check lock status", e);
            }
        }

        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!passed) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Lock size={48} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Locked</h1>
                        <p className="text-gray-600">
                            You must verify all 10 QA checklist items before you can ship this release.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/prp/07-test')}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg w-full"
                    >
                        Go to QA Checklist
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-8 relative overflow-hidden">
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />

            <div className="max-w-lg w-full text-center space-y-8 relative z-10">
                <div className="mx-auto h-32 w-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <Rocket size={64} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Ready for Takeoff! 🚀
                    </h1>
                    <p className="text-xl text-gray-600">
                        All checks passed. The Placement Readiness Platform is hardened and ready to ship.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm flex items-center gap-4 text-left">
                    <CheckCircle className="text-green-500 shrink-0" size={32} />
                    <div>
                        <h3 className="font-bold text-gray-900">Verification Complete</h3>
                        <p className="text-sm text-gray-500">10/10 Tests Passed • Zero Critical Issues</p>
                    </div>
                </div>

                <button
                    disabled
                    className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-xl shadow-xl shadow-green-200 opacity-90 cursor-default"
                >
                    Build verified & ready to deploy
                </button>
            </div>
        </div>
    );
}
