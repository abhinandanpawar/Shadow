import { create } from 'zustand';
import {
  Resume,
  resumeSchema,
  Basics,
  Work,
  Project,
} from '@resume-platform/schema';

// Helper function to create an empty resume structure that conforms to the Zod schema
const createInitialState = (): Resume => ({
  basics: {
    name: '',
    label: '',
    image: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: '',
    },
    profiles: [],
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  certificates: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: [],
});

interface ResumeState {
  resume: Resume;
  updateBasics: (basics: Partial<Basics>) => void;
  addWork: () => void;
  updateWork: (index: number, work: Partial<Work>) => void;
  removeWork: (index: number) => void;
  addProject: () => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  removeProject: (index: number) => void;
  // TODO: Add actions for other sections (education, skills, etc.)
}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: createInitialState(),

  updateBasics: (basicsUpdate) =>
    set((state) => ({
      resume: {
        ...state.resume,
        basics: { ...state.resume.basics, ...basicsUpdate },
      },
    })),

  addWork: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        work: [
          ...state.resume.work,
          { name: '', position: '', url: '', startDate: '', endDate: '', summary: '', highlights: [] },
        ],
      },
    })),

  updateWork: (index, workUpdate) =>
    set((state) => {
      const work = [...state.resume.work];
      work[index] = { ...work[index], ...workUpdate };
      return { resume: { ...state.resume, work } };
    }),

  removeWork: (index) =>
    set((state) => ({
      resume: {
        ...state.resume,
        work: state.resume.work.filter((_, i) => i !== index),
      },
    })),

  addProject: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: [
          ...state.resume.projects,
          { name: '', description: '', url: '', keywords: [], highlights: [] },
        ],
      },
    })),

  updateProject: (index, projectUpdate) =>
    set((state) => {
      const projects = [...state.resume.projects];
      projects[index] = { ...projects[index], ...projectUpdate };
      return { resume: { ...state.resume, projects } };
    }),

  removeProject: (index) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((_, i) => i !== index),
      },
    })),
}));