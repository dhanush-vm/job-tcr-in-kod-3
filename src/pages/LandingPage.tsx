
import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-primary text-3xl">●</span> PrepMaster
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        New Batch Starting Soon
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Ace Your <span className="text-primary">Placement</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                        Practice coding problems, take mock interviews, and track your progress to land your dream job at top product companies.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-8 py-4 bg-gray-100 text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                            View Curriculum
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive tools designed to prepare you for every stage of the placement process.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Code2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Practice Problems</h3>
                            <p className="text-gray-600">Access a curated list of DSA problems sorted by difficulty and company tags to sharpen your coding skills.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Video size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Mock Interviews</h3>
                            <p className="text-gray-600">Schedule peer-to-peer mock interviews or practice with our AI interviewer to boost your confidence.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                            <p className="text-gray-600">Visual analytics to monitor your consistency, strengths, and areas for improvement over time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Optional extra polish */}
            <section className="py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                            <div className="text-gray-600">Students Placed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-gray-600">Companies Hiring</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                            <div className="text-gray-600">Coding Problems</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-gray-600">Mentor Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-primary text-2xl">●</span>
                        <span className="text-white font-bold text-xl">PrepMaster</span>
                    </div>
                    <p>© 2024 PrepMaster Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
