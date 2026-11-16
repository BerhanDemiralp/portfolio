import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import ProjectDetail from "@/components/ProjectDetail";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: `${project?.name ?? "Project"} · Berhan Demiralp` };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return (
    <div className="project-page" data-project-theme={slug}>
    <main className="standalone">
      <a className="back" href="/#projects">
        ← Back to projects
      </a>
      <ProjectDetail project={projects[index]} index={index} />
    </main>
    </div>
  );
}
