
import { http, HttpResponse } from 'msw';

// Mock data based on openapi.yaml schemas
const mockJsonResume = {
  basics: {
    name: 'Mocked John Doe',
    label: 'Software Engineer',
    email: 'john.doe@example.com',
    summary: 'A passionate software engineer with experience in building web applications.',
  },
  work: [
    {
      name: 'Acme Corp',
      position: 'Senior Developer',
      summary: 'Led the development of the new flagship product.',
    },
  ],
};

const mockAtsScore = {
  overallScore: 88,
  keywordCoverage: {
    found: ['React', 'TypeScript', 'Node.js'],
    missing: ['GraphQL', 'Next.js'],
  },
};

const mockNormalizedSkills = {
  normalized: [
    {
      original: 'JS',
      standard: 'JavaScript',
      escoUri: 'http://data.europa.eu/esco/skill/b9e1406c-1e69-4f5d-b1f9-4e5d28b2d53b',
    },
  ],
};

const mockGithubData = {
    user: {
        name: "Mock User",
        avatarUrl: "https://github.com/images/error/octocat_happy.gif",
        bio: "A mock user bio"
    },
    repos: [
        {
            name: "mock-repo-1",
            url: "https://github.com/mockuser/mock-repo-1",
            description: "A mock repository",
            stars: 42,
            language: "TypeScript"
        }
    ]
}

export const handlers = [
  // 1. Mock for POST /import
  http.post('/api/import', () => {
    return HttpResponse.json(mockJsonResume);
  }),

  // 2. Mock for POST /export/pdf
  http.post('/api/export/pdf', async () => {
    const pdfBlob = new Blob([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34])], { type: 'application/pdf' });
    return new HttpResponse(pdfBlob, {
        headers: {
            'Content-Type': 'application/pdf',
        }
    });
  }),

  // 3. Mock for POST /ats/score
  http.post('/api/ats/score', () => {
    return HttpResponse.json(mockAtsScore);
  }),

  // 4. Mock for POST /skills/normalize
  http.post('/api/skills/normalize', () => {
    return HttpResponse.json(mockNormalizedSkills);
  }),

  // 5. Mock for GET /search
  http.get('/api/search', () => {
    return HttpResponse.json({
      results: [
        { resume: mockJsonResume, score: 0.9 },
      ],
    });
  }),

  // 6. Mock for POST /vc/issue
  http.post('/api/vc/issue', () => {
    return HttpResponse.json({
      vcJwt: 'mock.jwt.token',
    });
  }),

    // 7. Mock for POST /portfolio/github/sync
  http.post('/api/portfolio/github/sync', () => {
    return HttpResponse.json(mockGithubData);
  }),
];
