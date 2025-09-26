import { Resume } from '@resume-platform/schema';
import { getLLMSuggestions } from './llm-provider';

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

export async function suggestImprovements(data: { resume: Resume, section: string, context?: string }) {
  const { resume, section, context } = data;

  // Construct a more detailed prompt for the LLM
  const prompt = `
    Analyze the following resume section and provide specific, actionable suggestions for improvement.
    The response MUST be a JSON array of objects, where each object has a "suggestion" and an "example" field.
    - "suggestion": A concise recommendation for what to change.
    - "example": A concrete example of the improved text.

    Resume: ${JSON.stringify(resume, null, 2)}
    Section to improve: "${section}"
    Additional Context: ${context || 'N/A'}

    Provide 3-5 high-quality suggestions.
  `;

  try {
    const rawSuggestions = await getLLMSuggestions(prompt);
    // Attempt to parse the JSON response from the LLM
    const suggestions = JSON.parse(rawSuggestions);
    return { suggestions };
  } catch (error) {
    console.error('Failed to parse LLM suggestions:', error);
    // Fallback in case the LLM response is not valid JSON
    return { suggestions: [{ suggestion: "Could not retrieve AI suggestions.", example: "Please try again." }] };
  }
}