import { useState } from 'react';
import { EmptyState } from '../EmptyState/EmptyState';
import { ReleaseNotesModal } from '../ReleaseNotesModal/ReleaseNotesModal';
import { copy } from '../../utils/copy';
import { formatDateBr } from '../../utils/dates';
import { usePreferences } from '../../hooks/usePreferences';
import type { ReleaseStatus, ReleaseVersion } from '../../types';
import './ReleaseTable.css';

const STATUS_CLASS: Record<ReleaseStatus, string> = {
  Approved: 'release-table__status--approved',
  Failed: 'release-table__status--failed',
  'Conditionally Approved': 'release-table__status--conditional',
  Blocked: 'release-table__status--blocked'
};

type ReleaseTableProps = {
  releases: ReleaseVersion[];
};

export function ReleaseTable({ releases }: ReleaseTableProps) {
  const { t } = usePreferences();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!releases.length) {
    return <EmptyState title={t(copy.releases)} body={t(copy.emptyRelease)} />;
  }

  const openRelease = releases.find((release) => release.id === openId) ?? null;

  return (
    <section className="release-table">
      <div className="section-heading">{t(copy.releases)}</div>
      <div className="release-table__list">
        {releases.map((release) => (
          <article className="release-table__card" key={release.id}>
            <div className="release-table__card-header">
              <div>
                <div className="release-table__version">{release.version}</div>
                <div className="release-table__date">{t(copy.releasedDate)}: {formatDateBr(release.released_date)}</div>
              </div>
              <span className={`release-table__status ${STATUS_CLASS[release.status]}`}>{release.status}</span>
            </div>

            <div className="release-table__footer">
              <div className="release-table__footer-left">
                <div className="release-table__verified">
                  {t(copy.verifiedDate)}: {release.verified_date ? formatDateBr(release.verified_date) : '-'}
                </div>
                <div className="release-table__metrics" aria-label={t(copy.testCaseReport)}>
                  <span className="release-table__metric">{t(copy.testsPass)} <strong>{release.tests_pass}</strong></span>
                  <span className="release-table__metric">{t(copy.testsFail)} <strong>{release.tests_fail}</strong></span>
                  <span className="release-table__metric">{t(copy.testsNotTested)} <strong>{release.tests_not_tested}</strong></span>
                </div>
                <div className="release-table__issues" aria-label={t(copy.issuesFound)}>
                  <span className={`release-table__issue ${release.issue_count_a > 0 ? 'release-table__issue--active' : ''}`}>A:{release.issue_count_a}</span>
                  <span className={`release-table__issue ${release.issue_count_b > 0 ? 'release-table__issue--active' : ''}`}>B:{release.issue_count_b}</span>
                  <span className={`release-table__issue ${release.issue_count_c > 0 ? 'release-table__issue--active' : ''}`}>C:{release.issue_count_c}</span>
                </div>
              </div>
              <button type="button" className="release-table__notes-button" onClick={() => setOpenId(release.id)}>
                {t(copy.notesAction)}
              </button>
            </div>
          </article>
        ))}
      </div>
      {openRelease ? (
        <ReleaseNotesModal
          version={openRelease.version}
          notes={openRelease.release_notes ?? ''}
          testsPass={openRelease.tests_pass}
          testsFail={openRelease.tests_fail}
          testsNotTested={openRelease.tests_not_tested}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}
