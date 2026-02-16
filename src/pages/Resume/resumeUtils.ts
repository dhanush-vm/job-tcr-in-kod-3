
import { ResumeData } from './ResumePaper';

export const ACTION_VERBS = [
    'Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated',
    'Managed', 'Launched', 'Engineered', 'Architected', 'Spearheaded', 'Directed', 'Orchestrated',
    'Achieved', 'Delivered', 'Expanded', 'Generated', 'Identified', 'Increased', 'Initiated', 'Maximised',
    'Mentored', 'Pioneered', 'Reduced', 'Resolved', 'Saved', 'Streamlined', 'Supervised', 'Transformed'
];

export interface ScoreResult {
    score: number;
    level: 'Needs Work' | 'Getting There' | 'Strong Resume';
    color: string;
    improvements: string[];
}

export const calculateScore = (data: ResumeData): ScoreResult => {
    let score = 0;
    const improvements: string[] = [];

    // 1. Name (+10)
    if (data.fullName && data.fullName.trim().length > 0) {
        score += 10;
    } else {
        improvements.push("Add your full name (+10)");
    }

    // 2. Email (+10)
    if (data.email && data.email.trim().length > 0) {
        score += 10;
    } else {
        improvements.push("Add a professional email (+10)");
    }

    // 3. Summary Length (+10)
    if (data.summary && data.summary.length > 50) {
        score += 10;
    } else {
        improvements.push("Expand summary to > 50 chars (+10)");
    }

    // 4. Action Verbs in Summary (+10)
    const summaryLower = data.summary?.toLowerCase() || '';
    const hasActionVerb = ACTION_VERBS.some(verb => summaryLower.includes(verb.toLowerCase()));
    if (hasActionVerb) {
        score += 10;
    } else {
        improvements.push("Use action verbs in summary (+10)");
    }

    // 5. Experience (+15)
    // Rule: At least 1 entry AND it must have a description (bullets implied by content presence)
    if (data.experience && data.experience.length > 0 && data.experience[0].description.trim().length > 0) {
        score += 15;
    } else {
        improvements.push("Add experience with details (+15)");
    }

    // 6. Education (+10)
    if (data.education && data.education.length > 0) {
        score += 10;
    } else {
        improvements.push("Add education details (+10)");
    }

    // 7. Skills (+10)
    const totalSkills = (data.skills.technical?.length || 0) +
        (data.skills.soft?.length || 0) +
        (data.skills.tools?.length || 0);
    if (totalSkills >= 5) {
        score += 10;
    } else {
        improvements.push("Add at least 5 skills (+10)");
    }

    // 8. Projects (+10)
    if (data.projects && data.projects.length >= 1) {
        score += 10;
    } else {
        improvements.push("Add at least 1 project (+10)");
    }

    // 9. Phone (+5)
    if (data.phone && data.phone.trim().length > 0) {
        score += 5;
    } else {
        improvements.push("Add phone number (+5)");
    }

    // 10. Links (LinkedIn & GitHub) (+5 each)
    if (data.linkedinUrl && data.linkedinUrl.trim().length > 0) {
        score += 5;
    } else {
        improvements.push("Add LinkedIn profile (+5)");
    }

    if (data.githubUrl && data.githubUrl.trim().length > 0) {
        score += 5;
    } else {
        improvements.push("Add GitHub profile (+5)");
    }

    // Cap at 100 logic (though math above sums to exactly 100)
    score = Math.min(score, 100);

    // Determine Level & Color
    let level: ScoreResult['level'] = 'Needs Work';
    let color = '#ef4444'; // Red-500

    if (score > 70) {
        level = 'Strong Resume';
        color = '#22c55e'; // Green-500
    } else if (score > 40) {
        level = 'Getting There';
        color = '#f59e0b'; // Amber-500
    }

    return { score, level, color, improvements };
};
