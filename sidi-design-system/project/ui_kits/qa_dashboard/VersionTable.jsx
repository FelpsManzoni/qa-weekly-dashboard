import React from 'react';

export function VersionTable({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
      }}>
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>
          Versions
        </h3>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          No versions available for this week
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600 }}>Versions</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', letterSpacing: '0.5px' }}>Version</th>
            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', letterSpacing: '0.5px' }}>Date</th>
            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', letterSpacing: '0.5px' }}>Status</th>
            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', letterSpacing: '0.5px' }}>Critical Issues</th>
            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', letterSpacing: '0.5px' }}>Changelog</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v, i) => (
            <tr key={i} style={{ borderBottom: i < versions.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent' }}>
              <td style={{ padding: 'var(--space-3) var(--space-4)' }}><strong>{v.version}</strong></td>
              <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{v.date}</td>
              <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                <span style={{
                  background: v.status === 'Stable' ? '#dcfce7' : '#fef3c7',
                  color: v.status === 'Stable' ? '#16a34a' : '#d97706',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                }}>
                  {v.status}
                </span>
              </td>
              <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{v.criticalIssues}</td>
              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-secondary)' }}>{v.changelog}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
