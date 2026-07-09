import { Modal } from '../Modal/Modal';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';

type ReleaseNotesModalProps = {
  version: string;
  notes: string;
  onClose: () => void;
};

export function ReleaseNotesModal({ version, notes, onClose }: ReleaseNotesModalProps) {
  const { t } = usePreferences();

  return (
    <Modal title={`${version} — ${t(copy.releaseNotes)}`} onClose={onClose}>
      {notes ? <p className="release-notes-modal__text">{notes}</p> : <p className="release-notes-modal__empty">{t(copy.emptyGeneric)}</p>}
    </Modal>
  );
}
