import React from 'react';

export function Badge({ label, variant = 'default', size = 'md' }) {
  const variantStyles = {
    default: { background: 'var(--purple-100)', color: 'var(--purple-900)' },
    success: { background: 'var(--status-pass-bg)', color: 'var(--status-pass)' },
    danger: { background: 'var(--status-fail-bg)', color: 'var(--status-fail)' },
    warning: { background: 'var(--status-warning-bg)', color: 'var(--status-warning)' },
    info: { background: 'var(--purple-50)', color: 'var(--text-primary)' },
  };

  const sizeStyles = {
    sm: { padding: '4px 8px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)' },
    md: { padding: '6px 10px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)' },
    lg: { padding: '8px 12px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {label}
    </span>
  );
}
