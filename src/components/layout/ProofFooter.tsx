import { useState } from "react";
import { Square, SquareCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

interface ProofItem {
    id: string;
    label: string;
    checked: boolean;
}

export function ProofFooter() {
    const [items, setItems] = useState<ProofItem[]>([
        { id: "ui", label: "UI Built", checked: false },
        { id: "logic", label: "Logic Working", checked: false },
        { id: "test", label: "Test Passed", checked: false },
        { id: "deploy", label: "Deployed", checked: false },
    ]);

    const toggleItem = (id: string) => {
        setItems(items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const allChecked = items.every((item) => item.checked);

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-top">
            <div className="mx-auto flex max-w-screen-xl items-center justify-between">
                <div className="flex items-center gap-8">
                    <span className="font-serif font-bold text-foreground">Proof of Work</span>
                    <div className="flex gap-6">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                    "flex items-center gap-2 text-sm transition-colors",
                                    item.checked
                                        ? "font-medium text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.checked ? (
                                    <SquareCheck className="h-4 w-4" />
                                ) : (
                                    <Square className="h-4 w-4" />
                                )}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Button disabled={!allChecked} variant={allChecked ? "default" : "secondary"}>
                    {allChecked ? "Confirm & Proceed" : "Complete Checklist"}
                </Button>
            </div>
        </div>
    );
}
