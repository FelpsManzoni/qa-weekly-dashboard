import React from 'react';

export function Header({ title, subtitle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-5)' }}>
      <h1 style={{ margin: '0 0 4px 0', fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h1>
      {subtitle && <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  );
}
