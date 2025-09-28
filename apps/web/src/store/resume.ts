import { create } from "zustand";
import {
  Resume,
  Basics,
  Work,
  Project,
  Education,
  Skill,
} from "@resume-platform/schema";

// Helper function to create an empty resume structure
const createInitialResume = (): Resume => ({
  basics: {
    name: "Untitled Resume",
    label: "Software Engineer",
    image: "",
    email: "your-email@example.com",
    phone: "(123) 456-7890",
    url: "your-portfolio.com",
    summary: "A brief summary about yourself.",
    location: {
      address: "123 Main St",
      postalCode: "12345",
      city: "San Francisco",
      countryCode: "US",
      region: "CA",
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

// Types for the ATS feature, adapted from Resume-Matcher
export interface PersonalInfo {
    name: string;
    title?: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
}

export interface ExperienceEntry {
    id: number;
    title: string;
    company: string;
    location?: string;
    years?: string;
    description: string[];
}

export interface EducationEntry {
    id: number;
    institution: string;
    degree: string;
    years?: string;
    description?: string;
}

export interface ResumePreview {
    personalInfo: PersonalInfo;
    summary?: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
}

export interface Data {
    request_id: string;
    resume_id: string;
    job_id: string;
    original_score: number;
    new_score: number;
    resume_preview: ResumePreview;
    details?: string;
    commentary?: string;
    improvements?: {
        suggestion: string;
        lineNumber?: string | number;
    }[];
}

export interface ImprovedResult {
    data: Data;
}

interface ResumeStoreState {
  resumes: Resume[];
  activeIndex: number;
  improvedResult: ImprovedResult | null;
  // Actions
  addResume: () => void;
  addExistingResume: (resume: Resume) => void;
  removeResume: (index: number) => void;
  switchResume: (index: number) => void;
  updateBasics: (basics: Partial<Basics>) => void;
  addWork: () => void;
  updateWork: (index: number, work: Partial<Work>) => void;
  removeWork: (index: number) => void;
  addEducation: () => void;
  updateEducation: (index: number, education: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  addSkill: () => void;
  updateSkill: (index: number, skill: Partial<Skill>) => void;
  removeSkill: (index: number) => void;
  addProject: () => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  removeProject: (index: number) => void;
  setImprovedResult: (result: ImprovedResult | null) => void;
}

const getInitialState = (): { resumes: Resume[]; activeIndex: number; improvedResult: ImprovedResult | null } => {
  try {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("resume-store");
      if (item) {
        const parsed = JSON.parse(item);
        if (
          parsed.resumes &&
          Array.isArray(parsed.resumes) &&
          typeof parsed.activeIndex === "number"
        ) {
          // Return persisted state and default for new state
          return { ...parsed, improvedResult: null };
        }
      }
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
  }
  // Return default state if nothing in localStorage or if running on server
  return { resumes: [createInitialResume()], activeIndex: 0, improvedResult: null };
};

export const useResumeStore = create<ResumeStoreState>((set) => ({
  ...getInitialState(),

  addResume: () =>
    set((state) => {
      const newResumes = [...state.resumes, createInitialResume()];
      return {
        resumes: newResumes,
        activeIndex: newResumes.length - 1,
      };
    }),

  addExistingResume: (resume) =>
    set((state) => {
      const newResumes = [...state.resumes, resume];
      return {
        resumes: newResumes,
        activeIndex: newResumes.length - 1,
      };
    }),

  removeResume: (index) =>
    set((state) => {
      if (state.resumes.length <= 1) return {}; // Don't remove the last resume
      const newResumes = state.resumes.filter((_, i) => i !== index);
      return {
        resumes: newResumes,
        activeIndex: Math.max(
          0,
          state.activeIndex >= index
            ? state.activeIndex - 1
            : state.activeIndex
        ),
      };
    }),

  switchResume: (index) => set({ activeIndex: index }),

  updateBasics: (basicsUpdate) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      newResumes[state.activeIndex] = {
        ...activeResume,
        basics: { ...activeResume.basics, ...basicsUpdate },
      };
      return { resumes: newResumes };
    }),

  addWork: () =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const newWork = [
        ...activeResume.work,
        {
          name: "",
          position: "",
          url: "",
          startDate: "",
          endDate: "",
          summary: "",
          highlights: [],
        },
      ];
      newResumes[state.activeIndex] = { ...activeResume, work: newWork };
      return { resumes: newResumes };
    }),

  updateWork: (index, workUpdate) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const work = [...activeResume.work];
      work[index] = { ...work[index], ...workUpdate };
      newResumes[state.activeIndex] = { ...activeResume, work };
      return { resumes: newResumes };
    }),

  removeWork: (index) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const work = activeResume.work.filter((_, i) => i !== index);
      newResumes[state.activeIndex] = { ...activeResume, work };
      return { resumes: newResumes };
    }),

  addEducation: () =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const newEducation = [
        ...activeResume.education,
        {
          institution: "",
          area: "",
          studyType: "",
          startDate: "",
          endDate: "",
          gpa: "",
          courses: [],
        },
      ];
      newResumes[state.activeIndex] = {
        ...activeResume,
        education: newEducation,
      };
      return { resumes: newResumes };
    }),

  updateEducation: (index, educationUpdate) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const education = [...activeResume.education];
      education[index] = { ...education[index], ...educationUpdate };
      newResumes[state.activeIndex] = { ...activeResume, education };
      return { resumes: newResumes };
    }),

  removeEducation: (index) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const education = activeResume.education.filter((_, i) => i !== index);
      newResumes[state.activeIndex] = { ...activeResume, education };
      return { resumes: newResumes };
    }),

  addSkill: () =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const newSkills = [
        ...activeResume.skills,
        { name: "", level: "", keywords: [] },
      ];
      newResumes[state.activeIndex] = { ...activeResume, skills: newSkills };
      return { resumes: newResumes };
    }),

  updateSkill: (index, skillUpdate) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const skills = [...activeResume.skills];
      skills[index] = { ...skills[index], ...skillUpdate };
      newResumes[state.activeIndex] = { ...activeResume, skills };
      return { resumes: newResumes };
    }),

  removeSkill: (index) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const skills = activeResume.skills.filter((_, i) => i !== index);
      newResumes[state.activeIndex] = { ...activeResume, skills };
      return { resumes: newResumes };
    }),

  addProject: () =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const newProjects = [
        ...activeResume.projects,
        { name: "", description: "", url: "", keywords: [], highlights: [] },
      ];
      newResumes[state.activeIndex] = {
        ...activeResume,
        projects: newProjects,
      };
      return { resumes: newResumes };
    }),

  updateProject: (index, projectUpdate) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const projects = [...activeResume.projects];
      projects[index] = { ...projects[index], ...projectUpdate };
      newResumes[state.activeIndex] = { ...activeResume, projects };
      return { resumes: newResumes };
    }),

  removeProject: (index) =>
    set((state) => {
      const newResumes = [...state.resumes];
      const activeResume = newResumes[state.activeIndex];
      const projects = activeResume.projects.filter((_, i) => i !== index);
      newResumes[state.activeIndex] = { ...activeResume, projects };
      return { resumes: newResumes };
    }),

  setImprovedResult: (result) => set({ improvedResult: result }),
}));

// Subscribe to store changes and persist to localStorage
if (typeof window !== "undefined") {
  useResumeStore.subscribe((state) => {
    const stateToPersist = {
      resumes: state.resumes,
      activeIndex: state.activeIndex,
    };
    window.localStorage.setItem("resume-store", JSON.stringify(stateToPersist));
  });
}