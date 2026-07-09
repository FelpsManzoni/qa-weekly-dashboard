import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { Project } from '../../types';
import './ProjectNav.css';

type ProjectNavProps = {
  projects: Project[];
  selectedProjectId: string | null;
  onSelect: (projectId: string) => void;
};

export function ProjectNav({ projects, selectedProjectId, onSelect }: ProjectNavProps) {
  const { t } = usePreferences();

  return (
    <section className="project-nav">
      <div className="section-heading">{t(copy.projects)}</div>
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
            </button>
          );
        })}
      </div>
    </section>
  );
}
