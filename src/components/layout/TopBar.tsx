import { BadgeCheck, Circle, CircleDashed } from "lucide-react";
import { cn } from "../../lib/utils";

interface TopBarProps {
    currentStep: number;
    totalSteps: number;
    status: "Not Started" | "In Progress" | "Shipped";
}

export function TopBar({ currentStep, totalSteps, status }: TopBarProps) {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b bg-background px-8">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-primary" /> {/* Placeholder Logo */}
                <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                    KodNest Premium
                </span>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span>Step {currentStep}</span>
                <div className="flex gap-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 w-8 rounded-full transition-colors",
                                i + 1 <= currentStep ? "bg-primary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
                <span>{totalSteps}</span>
            </div>

            <div
                className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                    status === "Shipped"
                        ? "border-success/20 bg-success/10 text-success"
                        : status === "In Progress"
                            ? "border-warning/20 bg-warning/10 text-warning"
                            : "border-muted bg-muted/50 text-muted-foreground"
                )}
            >
                {status === "Shipped" ? (
                    <BadgeCheck className="h-3.5 w-3.5" />
                ) : status === "In Progress" ? (
                    <CircleDashed className="h-3.5 w-3.5 animate-spin-slow" />
                ) : (
                    <Circle className="h-3.5 w-3.5" />
                )}
                {status}
            </div>
        </header>
    );
}
