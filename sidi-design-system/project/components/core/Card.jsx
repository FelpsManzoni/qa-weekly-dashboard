import React from 'react';

export function Card({ children, padding = 'md', elevation = 'md' }) {
  const paddingStyles = {
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)',
  };

  const elevationStyles = {
    none: '0',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  };

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: paddingStyles[padding],
        boxShadow: elevationStyles[elevation],
      }}
    >
      {children}
    </div>
  );
}
