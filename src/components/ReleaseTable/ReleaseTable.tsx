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
      <table>
        <thead>
          <tr>
            <th>{t(copy.date)}</th>
            <th>{t(copy.version)}</th>
            <th>{t(copy.status)}</th>
            <th>{t(copy.issuesFound)}</th>
            <th>{t(copy.releaseNotes)}</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>{formatDateBr(release.date)}</td>
              <td>{release.version}</td>
              <td>
                <span className={`release-table__status ${STATUS_CLASS[release.status]}`}>{release.status}</span>
              </td>
              <td>
                <span className="release-table__issues">A:{release.issue_count_a} · B:{release.issue_count_b} · C:{release.issue_count_c}</span>
              </td>
              <td>
                <button type="button" className="release-table__notes-button" onClick={() => setOpenId(release.id)}>
                  {t(copy.releaseNotes)}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openRelease ? (
        <ReleaseNotesModal
          version={openRelease.version}
          notes={openRelease.release_notes ?? ''}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}
