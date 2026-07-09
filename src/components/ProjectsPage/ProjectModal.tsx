import { Modal } from '../Modal/Modal';
import { ProjectForm } from '../forms';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { Project } from '../../types';

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
};

export function ProjectModal({ project, onClose, onSaved }: ProjectModalProps) {
  const { t } = usePreferences();

  return (
    <Modal title={project ? t(copy.projects) : t(copy.addProject)} onClose={onClose}>
      <ProjectForm
        selected={project}
        onSaved={() => {
          onSaved();
          onClose();
        }}
      />
    </Modal>
  );
}
