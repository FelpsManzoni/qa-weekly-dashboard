import React from 'react';

export function ProjectStatus({ name, status, passRate, trend }) {
  const statusColors = {
    pass: { bg: 'var(--status-pass-bg)', fg: 'var(--status-pass)', label: 'Pass' },
    fail: { bg: 'var(--status-fail-bg)', fg: 'var(--status-fail)', label: 'Fail' },
    warning: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning)', label: 'Warning' },
    running: { bg: 'var(--status-running-bg)', fg: 'var(--status-running)', label: 'Running' },
  };

  const colors = statusColors[status];
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? 'var(--status-pass)' : trend === 'down' ? 'var(--status-fail)' : 'var(--text-secondary)';

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {name}
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span style={{
            background: colors.bg,
            color: colors.fg,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
          }}>
            {colors.label}
          </span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {passRate}% pass rate
          </span>
        </div>
      </div>
      <div style={{ fontSize: '18px', color: trendColor, fontWeight: 700 }}>
        {trendIcon}
      </div>
    </div>
  );
}
