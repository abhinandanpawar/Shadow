import axios from 'axios';

const ESCO_API_URL = process.env.ESCO_API_URL || 'https://ec.europa.eu/esco/api';
const cache = new Map<string, any>();

interface NormalizedSkill {
  original: string;
  standard: string | null;
  escoUri: string | null;
}

export async function normalizeSkills(skills: string[]): Promise<NormalizedSkill[]> {
  const promises = skills.map(async (skill) => {
    if (cache.has(skill)) {
      return cache.get(skill);
    }

    try {
      const response = await axios.get(`${ESCO_API_URL}/search`, {
        params: {
          language: 'en',
          type: 'skill',
          text: skill,
        },
      });

      const results = response.data?._embedded?.results;
      if (results && results.length > 0) {
        const topResult = results[0];
        const normalized = {
          original: skill,
          standard: topResult.title,
          escoUri: topResult.uri,
        };
        cache.set(skill, normalized);
        return normalized;
      }
    } catch (error) {
      console.error(`Failed to normalize skill: ${skill}`, error);
    }

    const failedResult = { original: skill, standard: null, escoUri: null };
    cache.set(skill, failedResult);
    return failedResult;
  });

  return Promise.all(promises);
}