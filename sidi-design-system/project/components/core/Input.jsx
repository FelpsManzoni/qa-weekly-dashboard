import React from 'react';

export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  size = 'md',
}) {
  const sizeStyles = {
    sm: { padding: '6px 10px', fontSize: 'var(--text-sm)' },
    md: { padding: '9px 12px', fontSize: 'var(--text-base)' },
    lg: { padding: '12px 14px', fontSize: 'var(--text-md)' },
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-body)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
        border: `1px solid ${error ? 'var(--status-fail)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-sm)',
        transition: 'border-color var(--duration-fast) var(--ease-standard)',
        outline: 'none',
        ...sizeStyles[size],
      }}
      onFocus={(e) => {
        if (!error) e.target.style.borderColor = 'var(--brand-primary)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? 'var(--status-fail)' : 'var(--border-default)';
      }}
    />
  );
}
