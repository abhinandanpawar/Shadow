"use client";

import { Resume } from "@resume-platform/schema";

export const ClassicTheme = ({ resume }: { resume: Resume }) => {
  return (
    <div className="bg-white text-black p-8 A4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{resume.basics.name}</h1>
        <p className="text-lg">{resume.basics.label}</p>
        <div className="flex justify-center space-x-4 mt-2 text-sm">
          <a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a>
          <span>|</span>
          <a href={`tel:${resume.basics.phone}`}>{resume.basics.phone}</a>
          <span>|</span>
          <a href={resume.basics.url} target="_blank" rel="noopener noreferrer">
            {resume.basics.url}
          </a>
        </div>
        <p className="text-sm mt-2 text-justify">{resume.basics.summary}</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">
          Work Experience
        </h2>
        {resume.work.map((job, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{job.name}</h3>
              <p className="text-xs text-gray-600">
                {job.startDate} - {job.endDate || "Present"}
              </p>
            </div>
            <p className="text-md font-medium">{job.position}</p>
            <p className="mt-1 text-sm">{job.summary}</p>
            <ul className="list-disc list-inside mt-1 text-sm">
              {job.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">
          Education
        </h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.institution}</h3>
              <p className="text-xs text-gray-600">
                {edu.startDate} - {edu.endDate || "Present"}
              </p>
            </div>
            <p className="text-md font-medium">
              {edu.studyType}, {edu.area}
            </p>
            {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold">
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">
          Projects
        </h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600"
              >
                {project.url}
              </a>
            )}
            <p className="mt-1 text-sm">{project.description}</p>
            <ul className="list-disc list-inside mt-1 text-sm">
              {project.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};