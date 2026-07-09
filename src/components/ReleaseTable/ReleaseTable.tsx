import { EmptyState } from '../EmptyState/EmptyState';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { ReleaseVersion } from '../../types';
import './ReleaseTable.css';

type ReleaseTableProps = {
  releases: ReleaseVersion[];
};

export function ReleaseTable({ releases }: ReleaseTableProps) {
  const { t } = usePreferences();

  if (!releases.length) {
    return <EmptyState title={t(copy.releases)} body={t(copy.emptyRelease)} />;
  }

  return (
    <section className="release-table">
      <div className="section-heading">{t(copy.releases)}</div>
      <table>
        <thead>
          <tr>
            <th>VERSION</th>
            <th>DATE2</th>
            <th>STATUS</th>
            <th>CRITICAL ISSUES</th>
            <th>CHANGELOG</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>{release.version}</td>
              <td>{release.date}</td>
              <td>{release.status}</td>
              <td>{release.critical_issues ?? '-'}</td>
              <td>{release.changelog ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
