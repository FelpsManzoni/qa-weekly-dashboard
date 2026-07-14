import { useMemo, useState } from 'react';
import { ProjectModal } from './ProjectModal';
import { useProjects } from '../../hooks/useProjects';
import { usePreferences } from '../../hooks/usePreferences';
import { copy } from '../../utils/copy';
import { EmptyState } from '../EmptyState/EmptyState';
import type { Project } from '../../types';
import './ProjectsPage.css';

export function ProjectsPage() {
  const { t } = usePreferences();
  const projects = useProjects();
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);

  const list = useMemo(() => projects.data, [projects.data]);
  const openProject = (project: Project) => {
    setAdding(false);
    setEditing(project);
  };
  const openAdd = () => {
    setEditing(null);
    setAdding(true);
  };
  const close = () => {
    setEditing(null);
    setAdding(false);
  };

  return (
    <section className="projects-page">
      <div className="projects-page__header">
        <h2 className="section-heading">{t(copy.projects)}</h2>
        <button type="button" className="projects-page__add-button" onClick={openAdd}>
          {t(copy.addProject)}
        </button>
      </div>

      {projects.isLoading ? (
        <p className="projects-page__hint">{t(copy.loading)}</p>
      ) : !list.length ? (
        <EmptyState title={t(copy.projects)} body={t(copy.emptyGeneric)} />
      ) : (
        <ul className="projects-page__list">
          {list.map((project) => (
            <li key={project.id}>
              <button type="button" className="projects-page__item" onClick={() => openProject(project)}>
                <span className="projects-page__code">{project.code}</span>
                <span className="projects-page__body">
                  <strong>{project.name}</strong>
                  {project.client ? <small>{project.client}</small> : null}
                  {project.main_technology_scope ? <small>{project.main_technology_scope}</small> : null}
                </span>
                <span aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {(adding || editing) ? (
        <ProjectModal project={editing} onClose={close} onSaved={() => void projects.refresh()} />
      ) : null}
    </section>
  );
}
