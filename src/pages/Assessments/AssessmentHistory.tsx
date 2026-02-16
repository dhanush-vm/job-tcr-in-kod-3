import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, type AnalysisResult } from '../../lib/storage';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { Plus, Search, Briefcase, Calendar } from 'lucide-react';

export default function AssessmentHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Assessments History</h1>
                    <p className="text-gray-600">Review past analyses and track your preparation progress.</p>
                </div>
                <button
                    onClick={() => navigate('/assessments/new')}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Analysis
                </button>
            </div>

            {history.length === 0 ? (
                <DashboardCard className="text-center py-16">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Paste a job description to get a detailed breakdown of skills, a study plan, and interview questions.
                    </p>
                    <button
                        onClick={() => navigate('/assessments/new')}
                        className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                        Start First Analysis
                    </button>
                </DashboardCard>
            ) : (
                <div className="grid gap-6">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/assessments/${item.id}`)}
                            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{item.role}</h3>
                                        <p className="text-gray-600">{item.company}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${item.finalScore >= 70 ? 'bg-green-100 text-green-700' :
                                        item.finalScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        Score: {item.finalScore}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
