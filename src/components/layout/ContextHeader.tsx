interface ContextHeaderProps {
    title: string;
    description: string;
}

export function ContextHeader({ title, description }: ContextHeaderProps) {
    return (
        <div className="w-full border-b bg-background py-12 text-center">
            <div className="mx-auto max-w-2xl px-4">
                <h1 className="mb-3 font-serif text-4xl font-bold text-foreground">
                    {title}
                </h1>
                <p className="text-lg text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
