import { Resume } from '@resume-platform/schema';

// A simple keyword extraction function (can be improved with NLP libraries)
const extractKeywords = (text: string): string[] => {
  return text.toLowerCase().match(/\b(\w+)\b/g) || [];
};

export async function scoreResume(resume: Resume, jobDescription: string) {
  const resumeText = JSON.stringify(resume);
  const jdKeywords = new Set(extractKeywords(jobDescription));
  const resumeKeywords = new Set(extractKeywords(resumeText));

  const found = [...jdKeywords].filter(k => resumeKeywords.has(k));
  const missing = [...jdKeywords].filter(k => !resumeKeywords.has(k));

  const overallScore = Math.round((found.length / jdKeywords.size) * 100);

  return {
    overallScore: isNaN(overallScore) ? 0 : overallScore,
    keywordCoverage: { found, missing },
    formatOk: true, // Placeholder
  };
}