import { Outlet, Link, useLocation } from 'react-router-dom';
import { FileText, Award, CheckCircle } from 'lucide-react';

export default function ResumeLayout() {
    const location = useLocation();

    const NavItem = ({ to, label, icon: Icon }: { to: string, label: string, icon: any }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
            >
                <Icon size={16} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                        AI
                    </div>
                    <span className="font-bold text-lg tracking-tight">Resume Builder</span>
                </div>

                <nav className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200">
                    <NavItem to="/resume/builder" label="Builder" icon={FileText} />
                    <NavItem to="/resume/preview" label="Preview" icon={Award} />
                    <NavItem to="/resume/proof" label="Proof" icon={CheckCircle} />
                </nav>

                <div>
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        Exit to Dashboard
                    </Link>
                </div>
            </header>

            <main className="pt-16 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
