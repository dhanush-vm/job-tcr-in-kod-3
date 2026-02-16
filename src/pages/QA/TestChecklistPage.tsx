import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { CheckCircle2, Circle, AlertTriangle, RotateCcw } from 'lucide-react';

const TEST_ITEMS = [
    { id: 'validation_jd_required', label: 'JD required validation works', hint: 'Try creating analysis with empty JD' },
    { id: 'validation_short_jd', label: 'Short JD warning shows for <200 chars', hint: 'Paste a short text and check for warning' },
    { id: 'skills_grouped', label: 'Skills extraction groups correctly', hint: 'Verify analysis output has categorized skills' },
    { id: 'round_mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare "Google" vs "Startup" analysis' },
    { id: 'score_deterministic', label: 'Score calculation is deterministic', hint: 'Same JD should yield same base score' },
    { id: 'score_live_update', label: 'Skill toggles update score live', hint: 'Toggle skills on result page and watch score' },
    { id: 'persistence', label: 'Changes persist after refresh', hint: 'Refresh page after toggling skills' },
    { id: 'history_load', label: 'History saves and loads correctly', hint: 'Check "Assessments" list' },
    { id: 'export_buttons', label: 'Export buttons copy the correct content', hint: 'Click copy/download and verify text' },
    { id: 'no_console_errors', label: 'No console errors on core pages', hint: 'Open DevTools and browse' },
];

export default function TestChecklistPage() {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const stored = localStorage.getItem('prp_test_checklist');
        if (stored) {
            try {
                setCheckedItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load checklist", e);
            }
        }
    }, []);

    const toggleItem = (id: string) => {
        const newState = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newState);
        localStorage.setItem('prp_test_checklist', JSON.stringify(newState));
    };

    const resetChecklist = () => {
        if (window.confirm("Are you sure you want to reset all progress?")) {
            setCheckedItems({});
            localStorage.removeItem('prp_test_checklist');
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const allPassed = passedCount === TEST_ITEMS.length;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">QA Checklist</h1>
                <button
                    onClick={resetChecklist}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    <RotateCcw size={16} /> Reset
                </button>
            </div>

            <DashboardCard
                className={allPassed ? "bg-green-50 border-green-200" : "bg-white"}
            >
                <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold ${allPassed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                        {passedCount}/10
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {allPassed ? "All Tests Passed!" : "Testing in Progress"}
                        </h2>
                        {allPassed ? (
                            <p className="text-green-700">Ready to Ship. Go to <span className="font-semibold underline cursor-pointer" onClick={() => navigate('/prp/08-ship')}>/prp/08-ship</span>.</p>
                        ) : (
                            <p className="text-orange-700 flex items-center gap-2">
                                <AlertTriangle size={16} /> Fix issues before shipping.
                            </p>
                        )}
                    </div>
                </div>
            </DashboardCard>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {TEST_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors border-b last:border-0 cursor-pointer ${checkedItems[item.id] ? 'bg-green-50/30' : ''}`}
                        onClick={() => toggleItem(item.id)}
                    >
                        <div className={`mt-1 flex-shrink-0 transition-all ${checkedItems[item.id] ? 'text-green-600 transform scale-110' : 'text-gray-300'}`}>
                            {checkedItems[item.id] ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-medium ${checkedItems[item.id] ? 'text-gray-900' : 'text-gray-700'}`}>
                                {item.label}
                            </h3>
                            {item.hint && (
                                <p className="text-sm text-gray-500 mt-0.5">{item.hint}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
