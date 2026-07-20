import React from 'react';

const sizeStyles = {
  sm: { padding: '6px 12px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '9px 16px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-sm)' },
  lg: { padding: '12px 20px', fontSize: 'var(--text-md)', borderRadius: 'var(--radius-md)' },
};

const variantStyles = {
  primary: {
    background: 'var(--brand-primary)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--brand-primary)',
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--status-fail)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--status-fail)',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  if (!disabled && hover) {
    if (variant === 'primary') base.background = 'var(--brand-primary-hover)';
    if (variant === 'secondary') base.background = 'var(--surface-sunken)';
    if (variant === 'ghost') base.background = 'var(--surface-sunken)';
    if (variant === 'danger') base.background = '#b02330';
  }
  if (!disabled && active) {
    base.transform = 'scale(0.97)';
    if (variant === 'primary') base.background = 'var(--brand-primary-active)';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={base}
    >
      {icon}
      {children}
    </button>
  );
}
