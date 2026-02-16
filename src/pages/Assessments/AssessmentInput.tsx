import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJobDescription } from '../../lib/analysis';
import { saveAnalysis } from '../../lib/storage';
import { Input } from '../../components/ui/Input';
import { Loader2 } from 'lucide-react';

export default function AssessmentInput() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        jdText: ''
    });
    const [warning, setWarning] = useState('');

    const handleAnalyze = async () => {
        if (formData.jdText.trim().length === 0) return;

        setLoading(true);
        // Simulate brief processing delay for better UX
        setTimeout(() => {
            const result = analyzeJobDescription(formData.jdText, formData.company, formData.role);
            saveAnalysis(result);
            setLoading(false);
            navigate(`/assessments/${result.id}`);
        }, 800);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'jdText') {
            if (value.trim().length > 0 && value.trim().length < 200) {
                setWarning("This JD is too short to analyze deeply. Paste full JD for better output.");
            } else {
                setWarning("");
            }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Job Analysis</h1>
            <p className="text-gray-600 mb-8">Paste a job description to generate a tailored prep plan.</p>

            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                        <Input
                            name="company"
                            placeholder="e.g. Google"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role (Optional)</label>
                        <Input
                            name="role"
                            placeholder="e.g. Frontend Engineer"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="jdText"
                        className={`w-full h-64 p-4 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all ${warning ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'}`}
                        placeholder="Paste the full job description here..."
                        value={formData.jdText}
                        onChange={handleChange}
                    />
                    {warning && <p className="mt-2 text-sm text-orange-600 flex items-center gap-2">⚠️ {warning}</p>}
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!formData.jdText.trim() || loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Generate Analysis Plan"}
                </button>
            </div>
        </div>
    );
}
