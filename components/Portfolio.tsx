"use client";
import React, { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { ProjectArt } from "./ProjectDetail";
import ResidentRobot, { markRobotProjectVisit } from "./ResidentRobot";
import IstanbulScene from "./IstanbulScene";

const skillGroups = [
  {
    title: "AI Engineering",
    skills: [
      "Python", "NumPy", "pandas", "Feature Engineering", "Matplotlib", "Seaborn",
      "scikit-learn", "PyTorch", "Computer Vision", "LLMs", "RAG", "LangChain", "Streamlit",
    ],
  },
  {
    title: "Software Engineering",
    skills: [
      "C# / .NET", "REST APIs", "API Integration", "Excel Automation",
      "SQL", "PostgreSQL", "Redis", "Docker", "Git", "GitHub",
      "Jira", "Agile / Scrum", "Spec-Driven Development",
    ],
  },
  {
    title: "Soft Skills",
    skills: ["Research", "Problem Solving", "Team Collaboration", "Technical Communication", "Project Coordination", "Time Management"],
  },
];

export default function Portfolio() {
  const [target, setTarget] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);
  const runningToCard = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function clearHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setTarget(null);
  }
  function toggleRobot() {
    const next = !enabled;
    clearHover();
    setEnabled(next);
    try {
      sessionStorage.setItem("pixel-lab-robot-enabled", String(next));
    } catch {}
  }
  useEffect(() => {
    try {
      setEnabled(sessionStorage.getItem("pixel-lab-robot-enabled") !== "false");
    } catch {}
  }, []);
  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);
  return (
    <>
      <a className="skip" href="#projects">
        Skip to projects
      </a>
      <header>
        <a className="brand" href="#">
          Berhan Demiralp<span className="brand-dot">■</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ISTANBUL, TÜRKİYE</p>
            <h1 id="agent-name" data-robot-stop="hero-name">
              Berhan
              <br />
              Demiralp
            </h1>
            <p className="role">AI / ML Engineer</p>
            <p className="intro">
              I’m interested in turning data and research into practical applications.
              Experience with RAG systems, computer vision and model evaluation, shaped through projects and internships.
            </p>
            <div className="actions">
              <a id="agent-explore" className="button primary" href="#projects">
                Explore AI projects <span>↓</span>
              </a>
              <a
                className="button"
                href="/Berhan-Demiralp-CV.pdf"
                data-robot-stop="cv"
                target="_blank"
                rel="noreferrer"
              >
                View CV ↗
              </a>
            </div>
          </div>
          <div className="hero-world">
            <IstanbulScene />
            <button type="button" className="button agent-sleep" onClick={toggleRobot}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3v8m-4.5-5a7.5 7.5 0 1 0 9 0" />
              </svg>
              {enabled ? "Put agent to sleep" : "Wake agent"}
            </button>
          </div>
        </section>
        <section id="projects">
          <div className="section-heading" data-robot-stop="projects-heading">
            <h2>Featured Works</h2>
            <span>IDEAS → IMPLEMENTATIONS</span>
          </div>
          <div className="project-grid">
            {[2, 0, 1, 3, 4, 8, 6, 7, 5].map((index) => {
              const project = projects[index];
              return (
              <React.Fragment key={project.slug}>
              {index === 3 && <div className="other-projects-heading"><h3>Software Engineering Projects</h3></div>}
              <a
                data-project
                id={`card-${index}`}
                key={project.slug}
                className={`project-card ${target === `card-${index}` ? "investigating" : ""}`}
                href={`/projects/${project.slug}`}
                onClick={(event) => {
                  if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey &&
                      !event.shiftKey && !event.altKey) {
                    markRobotProjectVisit();
                  }
                }}
                data-project-theme={project.slug}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse" || !matchMedia("(min-width: 641px) and (pointer: fine)").matches) return;
                  clearHover();
                  const cardId = `card-${index}`;
                  if (runningToCard.current) {
                    setTarget(cardId);
                    return;
                  }
                  hoverTimer.current = setTimeout(() => {
                    hoverTimer.current = null;
                    setTarget(cardId);
                  }, 3000);
                }}
                onMouseLeave={clearHover}
                onFocus={() => setTarget(`card-${index}`)}
                onBlur={clearHover}
              >
                <ProjectArt index={index} />
                <div className="card-body">
                  <span className="eyebrow">{project.category}</span>
                  <h3>
                    {project.name}
                    <span>↗</span>
                  </h3>
                  <p className="card-description">{project.description}</p>
                  <div className="card-tags">{project.tags.join(" / ")}</div>
                </div>
              </a>
              </React.Fragment>
            ); })}
          </div>
        </section>
        <section id="experience">
          <div className="section-heading" data-robot-stop="experience">
            <h2 id="agent-experience">Experience</h2>
            <span data-robot-stop="learning">LEARNING BY BUILDING</span>
          </div>
          <div className="experience-list" data-robot-stop="experience-end">
            {[
              [
                "Odeabank",
                "Software Engineer Intern",
                "AUG — SEP 2025",
                "Developed a feature-flag service with C#, .NET Minimal APIs and SQL-backed persistence. Used Redis caching to reduce feature retrieval time from 42 ms to 6 ms in the reported measurement.",
              ],
              [
                "Refabric",
                "Artificial Intelligence Intern",
                "JUL — AUG 2025",
                "Built a RAG pipeline processing 1,000 fashion images for semantic style search. Integrated Gemini/OpenAI APIs, LangChain, Chroma, Apify and Excel automation for data collection and retrieval workflows.",
              ],
              [
                "Huawei",
                "Artificial Intelligence Intern",
                "JUN — JUL 2024",
                "Created a six-class satellite image segmentation pipeline using PyTorch and OpenCV. Analyzed datasets and investigated data quality and image–mask loading issues.",
              ],
            ].map(([company, role, date, description]) => (
              <article key={company} data-robot-stop={company.toLowerCase()}>
                <span className="experience-date">{date}</span>
                <div>
                  <h3>{company}</h3>
                  <p className="job-role">{role}</p>
                  <ul className="experience-points">{description.split(". ").map((point) => <li key={point}>{point.replace(/\.$/, "") + "."}</li>)}</ul>
                </div>
                <span className="experience-mark" aria-hidden="true">·</span>
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="about">
          <div data-robot-stop="about">
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <h2>
              Curious by nature.
              <br />
              Engineer by training.
            </h2>
          </div>
          <div className="about-copy">
            <p>
              I’ve had the chance to work across different areas of software development.
              Working on machine learning made me curious about how AI works, and using AI
              tools in my own projects showed me how much I enjoy turning ideas into
              something people can use. I’m always excited to start something new and put
              in the time to make it work well.
            </p>
          </div>
          <section className="about-skills" aria-labelledby="skills-title">
            <h2 id="skills-title">Skills</h2>
            <div className="skills-grid" data-robot-stop="skills">
              {skillGroups.map(({ title, skills }) => (
                <div className="skill-group" key={title}>
                  <h3>{title}</h3>
                  <ul className="tags">
                    {skills.map((skill) => <li key={skill}><span>{skill}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </section>
        <section id="contact" className="contact" data-robot-stop="contact-end">
          <p className="eyebrow">LET’S CONNECT</p>
          <h2>Have something in mind?</h2>
          <a className="email" data-robot-stop="mail" href="mailto:demiralpberhan@gmail.com">
            demiralpberhan@gmail.com ↗
          </a>
          <div className="socials">
            <a
              href="https://github.com/BerhanDemiralp"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/berhandemiralp/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
        </section>
        <footer>
          <span>© {new Date().getFullYear()} Berhan Demiralp</span>
          <a href="#">Back to top ↑</a>
        </footer>
      </main>
      <ResidentRobot
        target={target}
        enabled={enabled}
        onToggle={toggleRobot}
        runningToCard={runningToCard}
      />
    </>
  );
}
