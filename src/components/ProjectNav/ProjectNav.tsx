import { bilingualText, copy } from '../../utils/copy';
import type { Project } from '../../types';
import './ProjectNav.css';

type ProjectNavProps = {
  projects: Project[];
  selectedProjectId: string | null;
  onSelect: (projectId: string) => void;
};

export function ProjectNav({ projects, selectedProjectId, onSelect }: ProjectNavProps) {
  return (
    <aside className="project-nav">
      <div className="section-heading">{bilingualText(copy.projects)}</div>
      <div className="project-nav__list">
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;

          return (
            <button
              key={project.id}
              className={`project-nav__item ${isSelected ? 'project-nav__item--selected' : ''}`}
              onClick={() => onSelect(project.id)}
              type="button"
            >
              <span className="project-nav__code">{project.code}</span>
              <span className="project-nav__body">
                <strong>{project.name}</strong>
                <small>{project.description ?? project.name}</small>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
