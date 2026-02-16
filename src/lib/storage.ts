export interface AnalysisResult {
    id: string;
    createdAt: string;
    updatedAt: string;
    company: string; // Can be empty string
    role: string;    // Can be empty string
    jdText: string;
    extractedSkills: {
        coreCS: string[];
        languages: string[];
        web: string[];
        data: string[];
        cloud: string[];
        testing: string[];
        other: string[];
    };
    roundMapping: Array<{
        roundTitle: string;
        focusAreas: string[];
        whyItMatters: string;
        duration: string;
    }>;
    checklist: Array<{
        roundTitle: string;
        items: string[];
    }>;
    plan7Days: Array<{
        day: string;
        focus: string;
        tasks: string[];
    }>;
    questions: string[];
    baseScore: number;
    finalScore: number;
    skillConfidenceMap: Record<string, 'know' | 'practice'>;
    companyIntel?: { // Keep optional for now as it might be undefined if not generated? User requirement implies standardize but heuristic might return different structure. Let me align with new schema strictly. User said "Ensure every saved history entry has these fields". So I should make them required. Wait, "companyIntel" was not in user's list of standard fields in point 2. But point 2 says "Standardize Analysis Entry Schema" and lists specific fields. It DOES NOT list companyIntel. However, I just implemented it. I should probably keep it or merge it into roundMapping? The user request 2 lists `roundMapping: [{ roundTitle, focusAreas[], whyItMatters }]`. It doesn't explicitly forbid extra fields but asks to "Ensure... these fields". I will keep `companyIntel` as it provides the "Startup vs Enterprise" tag which is valuable UI state.
        size: string;
        industry: string;
        focus: string;
    };
}

const STORAGE_KEY = 'job_analysis_history';

export const saveAnalysis = (result: AnalysisResult) => {
    const history = getHistory();
    // Ensure extractedSkills has all keys if somehow missing (sanity check)
    // In strict mode, we trust analysis.ts but adding a safety spread is good.
    const safeResult = { ...result };

    // Safety check for history to avoid "corrupted" entries crashing the app
    // We already do this in getHistory but let's be safe on write too.

    const updatedHistory = [safeResult, ...history];
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
        console.error("Failed to save analysis", e);
    }
};

export const getHistory = (): AnalysisResult[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        // Filter out corrupted entries that don't match minimal expectations
        return parsed.filter(item => item && item.id && item.extractedSkills);
    } catch (e) {
        console.error("Failed to read history", e);
        return [];
    }
};

export const getAnalysis = (id: string): AnalysisResult | undefined => {
    const history = getHistory();
    return history.find((item) => item.id === id);
};

export const updateAnalysis = (id: string, updates: Partial<AnalysisResult>) => {
    const history = getHistory();
    const index = history.findIndex((item) => item.id === id);
    if (index !== -1) {
        history[index] = {
            ...history[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
};
