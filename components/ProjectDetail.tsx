"use client";
import { useState } from "react";
import ProjectCaseStudy from "./ProjectCaseStudy";
import type { Project } from "@/lib/projects";
import { projects } from "@/lib/projects";
import ProjectCover from "./ProjectCover";
export function ProjectArt({index,className=""}:{index:number;className?:string}) {
  return <ProjectCover slug={projects[index]?.slug ?? ""} className={className} />;
}
export default function ProjectDetail({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [message, setMessage] = useState("");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/projects/${project.slug}`,
      );
      setMessage("Link copied");
    } catch {
      setMessage("Copy the address from your browser.");
    }
  }
  return (
    <article className="project-detail">
      <div className="detail-body">
        <span className="eyebrow">{project.category}</span>
        <h2 id="project-title">{project.name}</h2>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ProjectCaseStudy project={project} />
        <div className="actions">
          <a
            className="button primary"
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub ↗
          </a>
          <button className="button" onClick={copyLink}>
            Copy link
          </button>
        </div>
        <span role="status">{message}</span>
      </div>
    </article>
  );
}
