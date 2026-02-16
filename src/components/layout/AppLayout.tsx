import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { ProofFooter } from "./ProofFooter";

interface AppLayoutProps {
    children: ReactNode;
    step?: number;
    totalSteps?: number;
    status?: "Not Started" | "In Progress" | "Shipped";
}

export function AppLayout({
    children,
    step = 1,
    totalSteps = 5,
    status = "Not Started",
}: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <TopBar currentStep={step} totalSteps={totalSteps} status={status} />

            {/* 
        Main content area needs padding bottom to account for fixed footer.
        Footer is roughly 80px high, so pb-24 (96px) is safe.
      */}
            <main className="flex-1 pb-24">
                {children}
            </main>

            <ProofFooter />
        </div>
    );
}
