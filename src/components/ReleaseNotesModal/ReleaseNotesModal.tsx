import { Modal } from '../Modal/Modal';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';

type ReleaseNotesModalProps = {
  version: string;
  notes: string;
  testsPass: number;
  testsFail: number;
  testsNotTested: number;
  onClose: () => void;
};

function formatPassRate(testsPass: number, testsFail: number, testsNotTested: number): string {
  const total = testsPass + testsFail + testsNotTested;
  if (total === 0) {
    return '-';
  }
  return `${Math.round((testsPass / total) * 100)}%`;
}

export function ReleaseNotesModal({
  version,
  notes,
  testsPass,
  testsFail,
  testsNotTested,
  onClose
}: ReleaseNotesModalProps) {
  const { t } = usePreferences();

  return (
    <Modal title={`${version} - ${t(copy.releaseNotes)}`} onClose={onClose}>
      <section className="release-notes-modal__section" aria-labelledby="release-test-report-title">
        <h3 id="release-test-report-title" className="release-notes-modal__heading">
          {t(copy.testCaseReport)}
        </h3>
        <dl className="release-notes-modal__report">
          <div>
            <dt>{t(copy.testsPass)}</dt>
            <dd>{testsPass}</dd>
          </div>
          <div>
            <dt>{t(copy.testsFail)}</dt>
            <dd>{testsFail}</dd>
          </div>
          <div>
            <dt>{t(copy.testsNotTested)}</dt>
            <dd>{testsNotTested}</dd>
          </div>
          <div>
            <dt>{t(copy.passRate)}</dt>
            <dd>{formatPassRate(testsPass, testsFail, testsNotTested)}</dd>
          </div>
        </dl>
      </section>
      <section className="release-notes-modal__section" aria-labelledby="release-notes-title">
        <h3 id="release-notes-title" className="release-notes-modal__heading">
          {t(copy.releaseNotes)}
        </h3>
        {notes ? (
          <p className="release-notes-modal__text">{notes}</p>
        ) : (
          <p className="release-notes-modal__empty">{t(copy.emptyGeneric)}</p>
        )}
      </section>
    </Modal>
  );
}
