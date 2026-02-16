import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DashboardCard } from '../components/ui/DashboardCard';
import { ArrowRight, CheckCircle2, Clock, Calendar } from 'lucide-react';

const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const OverallReadiness = ({ score }: { score: number }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-48 w-48">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
                    {/* Background Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="15"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="15"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{score}</span>
                    <span className="text-sm text-gray-500">/100</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">Readiness Score</p>
        </div>
    );
};

export default function Dashboard() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Readiness */}
                <DashboardCard title="Overall Readiness">
                    <OverallReadiness score={72} />
                </DashboardCard>

                {/* Skill Breakdown */}
                <DashboardCard title="Skill Breakdown">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="hsl(245, 58%, 51%)"
                                    strokeWidth={2}
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Continue Practice */}
                <DashboardCard title="Continue Practice">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">Dynamic Programming</span>
                                <span className="text-xs text-gray-500">3/10</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[30%] rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Master the basics of DP with top 10 standard problems.
                        </p>
                        <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                            Continue
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </DashboardCard>

                {/* Weekly Goals */}
                <DashboardCard title="Weekly Goals">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Problems Solved</span>
                                <span className="text-sm font-bold text-gray-900">12/20</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[60%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${[0, 1, 3, 4].includes(i) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DashboardCard>

                {/* Upcoming Assessments */}
                <DashboardCard title="Upcoming Assessments" action={<button className="text-sm text-primary hover:underline">View all</button>}>
                    <div className="space-y-4">
                        {[
                            { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", type: "Test" },
                            { title: "System Design Review", time: "Wed, 2:00 PM", type: "Review" },
                            { title: "HR Interview Prep", time: "Friday, 11:00 AM", type: "Interview" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="mt-1">
                                    {item.type === 'Test' && <div className="h-8 w-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"><CheckCircle2 size={16} /></div>}
                                    {item.type === 'Review' && <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><Clock size={16} /></div>}
                                    {item.type === 'Interview' && <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Calendar size={16} /></div>}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

            </div>
        </div>
    );
}
