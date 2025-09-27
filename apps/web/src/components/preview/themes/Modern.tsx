"use client";

import { Resume } from "@resume-platform/schema";

export const ModernTheme = ({ resume }: { resume: Resume }) => {
  return (
    <div className="bg-gray-900 text-white p-8 A4">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-400">
          {resume.basics.name}
        </h1>
        <p className="text-xl mt-2 text-gray-300">{resume.basics.label}</p>
        <div className="flex justify-center space-x-6 mt-4 text-cyan-400 text-sm">
          <a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a>
          <span>/</span>
          <a href={`tel:${resume.basics.phone}`}>{resume.basics.phone}</a>
          <span>/</span>
          <a href={resume.basics.url} target="_blank" rel="noopener noreferrer">
            {resume.basics.url}
          </a>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Summary
            </h2>
            <p className="text-gray-300 text-sm">{resume.basics.summary}</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Work Experience
            </h2>
            {resume.work.map((job, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{job.name}</h3>
                  <p className="text-xs text-gray-400">
                    {job.startDate} - {job.endDate || "Present"}
                  </p>
                </div>
                <p className="text-md font-medium text-cyan-300">{job.position}</p>
                <p className="mt-1 text-sm text-gray-400">{job.summary}</p>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-400">
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Projects
            </h2>
            {resume.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{project.description}</p>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-400">
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        <div className="col-span-1">
          <section className="mb-6">
            <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Education
            </h2>
            {resume.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-md font-semibold">{edu.institution}</h3>
                <p className="text-sm text-gray-400">{edu.studyType}</p>
                <p className="text-xs text-gray-500">{edu.area}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span key={index} className="bg-cyan-900/50 text-cyan-300 rounded-md px-2 py-1 text-xs">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};