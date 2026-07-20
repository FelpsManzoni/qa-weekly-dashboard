import { Modal } from '../Modal/Modal';
import { ProjectForm } from '../forms';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
};

export function ProjectModal({ project, onClose, onSaved }: ProjectModalProps) {
  const { t } = usePreferences();
  const projects = useProjects();
  const nextOrder = projects.data.reduce((max, p) => Math.max(max, p.display_order), 0) + 1;

  return (
    <Modal title={project ? t(copy.projects) : t(copy.addProject)} onClose={onClose}>
      <ProjectForm
        selected={project}
        nextOrder={nextOrder}
        onClose={onClose}
        onSaved={() => {
          onSaved();
          onClose();
        }}
      />
    </Modal>
  );
}
