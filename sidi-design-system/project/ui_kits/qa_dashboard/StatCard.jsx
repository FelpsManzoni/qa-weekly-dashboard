import React from 'react';

export function StatCard({ icon, label, value, status = 'default' }) {
  const statusColors = {
    default: 'var(--text-primary)',
    success: 'var(--status-pass)',
    warning: 'var(--status-warning)',
    danger: 'var(--status-fail)',
  };

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start',
    }}>
      <div style={{ fontSize: '28px', color: statusColors[status] }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: statusColors[status] }}>
          {value}
        </div>
      </div>
    </div>
  );
}
