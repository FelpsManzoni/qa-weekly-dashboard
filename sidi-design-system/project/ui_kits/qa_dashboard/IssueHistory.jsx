import React from 'react';

export function IssueHistory({ fixedIssues, reportedIssues }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
    }}>
      <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>
        Issue History
      </h3>
      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-2)' }}>
            Fixed Issues
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
            <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#22c55e' }}>{fixedIssues}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-2)' }}>
            Reported Issues
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
            <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#ef4444' }}>{reportedIssues}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
