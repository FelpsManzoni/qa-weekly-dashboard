import { useState } from 'react';
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
  const [revealedProjectId, setRevealedProjectId] = useState<string | null>(null);

  return (
    <section className="project-nav">
      <div className="section-heading">{t(copy.projects)}</div>
      <div className="project-nav__list">
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const isExpanded = isSelected || revealedProjectId === project.id;

          return (
            <button
              key={project.id}
              className={`project-nav__item ${isSelected ? 'project-nav__item--selected' : ''}`}
              onClick={() => onSelect(project.id)}
              onMouseEnter={() => setRevealedProjectId(project.id)}
              onMouseLeave={() => setRevealedProjectId((current) => (current === project.id ? null : current))}
              onFocus={() => setRevealedProjectId(project.id)}
              onBlur={() => setRevealedProjectId((current) => (current === project.id ? null : current))}
              type="button"
            >
              <span className="project-nav__code">{project.code}</span>
              {isExpanded ? (
                <span className="project-nav__name">
                  {project.name}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
