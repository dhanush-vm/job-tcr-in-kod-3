import { cn } from "../../lib/utils";

interface DashboardCardProps {
    title?: string;
    subtitle?: string;
    className?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export function DashboardCard({ title, subtitle, className, children, action }: DashboardCardProps) {
    return (
        <div className={cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
