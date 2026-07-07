import { EmptyState } from '../EmptyState/EmptyState';
import { bilingualText, copy } from '../../utils/copy';
import type { ReleaseVersion } from '../../types';
import './ReleaseTable.css';

type ReleaseTableProps = {
  releases: ReleaseVersion[];
};

export function ReleaseTable({ releases }: ReleaseTableProps) {
  if (!releases.length) {
    return <EmptyState title={bilingualText(copy.releases)} body={copy.emptyRelease.pt} />;
  }

  return (
    <section className="release-table">
      <div className="section-heading">{bilingualText(copy.releases)}</div>
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
