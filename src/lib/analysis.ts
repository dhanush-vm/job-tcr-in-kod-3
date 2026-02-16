// SKILL_CATEGORIES remains same but we need to map them to strict keys
const SKILL_KEYWORDS = {
    coreCS: ["DSA", "Data Structures", "Algorithms", "OOP", "DBMS", "Database Management", "OS", "Operating Systems", "Networks", "Computer Networks"],
    languages: ["Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Golang", "Rust", "Swift", "Kotlin"],
    web: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "HTML", "CSS", "Tailwind", "Redux"],
    data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Data Modeling"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Git", "Jenkins"],
    testing: ["Selenium", "Cypress", "Playwright", "JUnit", "Jest", "PyTest"],
    other: ["Communication", "Problem solving", "Basic coding", "Projects"] // Default/Fallback
};

const INTERVIEW_QUESTIONS = {
    "React": ["Explain Virtual DOM and how it works.", "What are React Hooks? Explain useEffect.", "State management: Context API vs Redux."],
    "Java": ["Explain final, finally, and finalize.", "What is the difference between JDK, JRE, and JVM?", "Explain multithreading in Java."],
    "Python": ["Explain decorators in Python.", "List vs Tuple vs Set.", "How is memory managed in Python?"],
    "SQL": ["Explain ACID properties.", "Difference between INNER JOIN and LEFT JOIN.", "What is Indexing and how does it help?"],
    "DSA": ["Explain Time and Space Complexity.", "How would you detect a cycle in a linked list?", "Explain QuickSort algorithm."],
    "General": ["Tell me about yourself.", "Why do you want to join this company?", "Describe a challenging project you worked on."]
};

import type { AnalysisResult } from './storage';

export const analyzeJobDescription = (jdText: string, company: string, role: string): AnalysisResult => {
    const lowerJD = jdText.toLowerCase();

    // 1. Strict Skill Extraction
    const extractedSkills: AnalysisResult['extractedSkills'] = {
        coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
    };

    let totalSkillsFound = 0;

    (Object.keys(SKILL_KEYWORDS) as Array<keyof typeof SKILL_KEYWORDS>).forEach(key => {
        if (key === 'other') return; // Skip defaults for extraction

        const found = SKILL_KEYWORDS[key].filter(keyword => lowerJD.includes(keyword.toLowerCase()));
        if (found.length > 0) {
            extractedSkills[key] = found;
            totalSkillsFound += found.length;
        }
    });

    // 2. Fallback Logic
    if (totalSkillsFound === 0) {
        extractedSkills.other = ["Communication", "Problem Solving", "Basic Coding", "Projects"];
    }

    // 3. Calculate Scores
    // Base Score: computed only once on analysis
    let score = 35; // Semantic Base
    if (totalSkillsFound > 0) {
        const categoriesPresent = Object.values(extractedSkills).filter(arr => arr.length > 0).length;
        score += Math.min(categoriesPresent * 10, 40); // Max 40 for breadth
        if (totalSkillsFound > 5) score += 10; // Depth bonus
    } else {
        score = 20; // Low score if no technical skills found
    }

    if (company.trim().length > 0) score += 5;
    if (role.trim().length > 0) score += 5;
    if (jdText.trim().length > 500) score += 5; // Length bonus

    score = Math.min(score, 100);

    const baseScore = score;
    const finalScore = score; // Initially same
    const skillConfidenceMap: Record<string, 'know' | 'practice'> = {};

    // Initialize confidence map (default to practice)
    Object.values(extractedSkills).flat().forEach(skill => {
        skillConfidenceMap[skill] = 'practice';
    });


    // 4. Company Intel & Round Mapping
    const companyIntel = analyzeCompany(company);
    const roundMapping = generateRoundMap(companyIntel.size, extractedSkills);


    // 5. Generate Plan 7 Days (Strict Schema)
    const plan7Days = [
        { day: "Day 1", focus: "Fundamentals", tasks: ["Review Core CS concepts (OS, DBMS)", "Brush up on Language syntax"] },
        { day: "Day 2", focus: "Data Structures", tasks: ["Practice Arrays & Strings", "Solve 3 easy LeetCode problems"] },
        { day: "Day 3", focus: "Algorithms", tasks: ["Study Sorting & Searching", "understand Time Complexity"] },
        { day: "Day 4", focus: "Web/Projects", tasks: ["Review Resume Projects", "Prepare Project Architecture diagrams"] },
        { day: "Day 5", focus: "System Design", tasks: ["Learn HLD basics (Load Balancers, Caching)", "Design a simple URL shortener"] },
        { day: "Day 6", focus: "Mock Interviews", tasks: ["Practice Behavioral answers (STAR method)", "Do a Peer Mock Interview"] },
        { day: "Day 7", focus: "Final Revision", tasks: ["Review Cheatsheets", "Relax & Sleep well"] }
    ];

    // Dynamic Plan Adjustments
    if (extractedSkills.web.length > 0) {
        plan7Days[3].tasks.push("Deep dive into React Hooks & Lifecycle");
    }
    if (extractedSkills.data.length > 0) {
        plan7Days[0].tasks.push("Practice SQL Joins & Normalization");
    }


    // 6. Generate Questions
    let questions: string[] = [...INTERVIEW_QUESTIONS["General"]];
    const FlatSkills = Object.values(extractedSkills).flat();

    FlatSkills.forEach(skill => {
        if (skill.includes("React") || skill.includes("Next")) questions.push(...(INTERVIEW_QUESTIONS["React"] || []));
        if (skill.includes("Java")) questions.push(...(INTERVIEW_QUESTIONS["Java"] || []));
        if (skill.includes("Python")) questions.push(...(INTERVIEW_QUESTIONS["Python"] || []));
        if (skill.includes("SQL") || skill.includes("Data")) questions.push(...(INTERVIEW_QUESTIONS["SQL"] || []));
        if (skill.includes("DSA") || skill.includes("Algorithm")) questions.push(...(INTERVIEW_QUESTIONS["DSA"] || []));
    });
    questions = [...new Set(questions)].slice(0, 10);

    // 7. Generate Checklist (Strict Schema)
    const checklist = [
        { roundTitle: "Preparation", items: ["Update Resume", "Clean up GitHub"] },
        { roundTitle: "Technical", items: ["Solve 50 Leetcode problems", "Build 1 full-stack project"] },
        { roundTitle: "Behavioral", items: ["Prepare 'Tell me about yourself'", "Research Company Values"] }
    ];


    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        plan7Days,
        checklist,
        questions,
        baseScore,
        finalScore,
        skillConfidenceMap,
        companyIntel,
        roundMapping
    };
};

// --- Helper Functions ---

const ENTERPRISE_COMPANIES = [
    "google", "microsoft", "amazon", "meta", "facebook", "apple", "netflix",
    "tcs", "infosys", "wipro", "hcl", "accenture", "capgemini", "cognizant",
    "ibm", "oracle", "cisco", "adobe", "salesforce", "sap", "vmware", "intel",
    "nvidia", "amd", "qualcomm", "samsung", "deloitte", "kpmg", "pwc", "ey",
    "jpmorgan", "goldman sachs", "morgan stanley", "wells fargo", "citi",
    "flipkart", "paytm", "ola", "zomato", "swiggy"
];

function analyzeCompany(companyName: string) {
    const lowerName = companyName.toLowerCase();
    let size = "Startup / Mid-Size";
    let industry = "Technology";
    let focus = "Practical Problem Solving & Stack Depth";

    // Heuristic: Check against known list
    const isEnterprise = ENTERPRISE_COMPANIES.some(known => lowerName.includes(known));

    if (isEnterprise) {
        size = "Enterprise";
        focus = "Data Structures, Algorithms & Core CS";
    }

    // Simple Industry Guessing
    if (lowerName.includes("bank") || lowerName.includes("financial") || lowerName.includes("pay") || lowerName.includes("capital")) {
        industry = "FinTech / Banking";
    } else if (lowerName.includes("health") || lowerName.includes("pharma") || lowerName.includes("medical")) {
        industry = "HealthTech";
    } else if (lowerName.includes("educ") || lowerName.includes("learning") || lowerName.includes("school")) {
        industry = "EdTech";
    } else if (lowerName.includes("consulting") || lowerName.includes("solut")) {
        industry = "IT Services & Consulting";
    }

    return { size, industry, focus };
}

function generateRoundMap(size: string, skills: AnalysisResult['extractedSkills']) {
    const rounds = [];

    // Round 1
    if (size === "Enterprise") {
        rounds.push({
            roundTitle: "Round 1: Online Assessment",
            description: "Expect 2-3 DSA questions (Medium/Hard) + Aptitude. Speed is key.",
            duration: "90 min",
            focusAreas: ["DSA", "Aptitude"],
            whyItMatters: "Filters out 80% of candidates. Speed and accuracy are critical."
        });
    } else {
        rounds.push({
            roundTitle: "Round 1: Screening / Take-home",
            description: "Likely a practical coding task (e.g., build a small API or UI component) or a call with the founder.",
            duration: "60 min / 2 days",
            focusAreas: ["Practical Coding", "Communication"],
            whyItMatters: "Proves you can actually build things, not just invert binary trees."
        });
    }

    // Round 2
    if (size === "Enterprise") {
        rounds.push({
            roundTitle: "Round 2: Technical Interview I",
            description: "Pure Focus on Problem Solving. You will be asked to code on a whiteboard/Google Doc. DSA is mandatory.",
            duration: "45-60 min",
            focusAreas: ["DSA", "Problem Solving"],
            whyItMatters: "Tests your raw problem-solving ability and communication of thought process."
        });
    } else {
        const hasWeb = skills.web.length > 0;
        rounds.push({
            roundTitle: "Round 2: Technical Deep Dive",
            description: hasWeb
                ? "Discussion on your stack (React/Node), previous projects, and live coding of a feature."
                : "Deep dive into your resume projects and stack-specific questions.",
            duration: "60 min",
            focusAreas: hasWeb ? ["React/Node", "System Design"] : ["Projects", "Core Skills"],
            whyItMatters: "Validates your depth of knowledge in the specific technologies they use."
        });
    }

    // Round 3
    if (size === "Enterprise") {
        rounds.push({
            roundTitle: "Round 3: Technical Interview II / System Design",
            description: "For freshers: Advanced DSA or Core CS (OS/DBMS). For experienced: HLD/LLD System Design.",
            duration: "60 min",
            focusAreas: ["System Design", "Core CS"],
            whyItMatters: "Assesses architectural thinking and scalability knowledge."
        });
        rounds.push({
            roundTitle: "Round 4: Managerial / HR",
            description: "Behavioral questions, culture fit, and checking your interest in the role.",
            duration: "30 min",
            focusAreas: ["Culture Fit", "Soft Skills"],
            whyItMatters: "Ensures you are a good team player and long-term fit."
        });
    } else {
        rounds.push({
            roundTitle: "Round 3: Culture Fit & Founder Round",
            description: "Discussion on your values, why you want to join a startup, and salary negotiation.",
            duration: "45 min",
            focusAreas: ["Values", "Negotiation"],
            whyItMatters: "Startup founders need to know you are aligned with their mission."
        });
    }

    return rounds;
}
