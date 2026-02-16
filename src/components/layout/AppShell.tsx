
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    FileCheck,
    Library,
    User,
    LogOut,
    GraduationCap
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
};

export default function AppShell() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                    <div className="bg-primary text-white p-2 rounded-lg">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">PrepMaster</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/practice" icon={Code2} label="Practice" />
                    <SidebarItem to="/assessments" icon={FileCheck} label="Assessments" />
                    <SidebarItem to="/resources" icon={Library} label="Resources" />
                    <SidebarItem to="/prp/07-test" icon={FileCheck} label="QA Checklist" />
                    <SidebarItem to="/prp/proof" icon={FileCheck} label="Final Proof" />
                    <SidebarItem to="/profile" icon={User} label="Profile" />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {location.pathname.startsWith('/rb/') ? 'AI Resume Builder' : 'Placement Prep'}
                        </h2>
                        {/* Dynamic Status Badge */}
                        {location.pathname.startsWith('/rb/') ? (
                            <div className={`text-xs px-2 py-0.5 rounded border ${localStorage.getItem('rb_project_status') === 'Shipped'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                {localStorage.getItem('rb_project_status') === 'Shipped' ? 'SHIPPED' : 'IN PROGRESS'}
                            </div>
                        ) : (
                            <div className={`text-xs px-2 py-0.5 rounded border ${localStorage.getItem('prp_project_status') === 'Shipped'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}>
                                {localStorage.getItem('prp_project_status') === 'Shipped' ? 'SHIPPED' : 'IN PROGRESS'}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                            JD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
