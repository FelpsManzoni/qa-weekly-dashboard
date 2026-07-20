import React from 'react';

export function ProgressBar({ value, max = 100, color = 'var(--green-500)' }) {
  const percentage = (value / max) * 100;
  return (
    <div style={{
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-full)',
      height: '8px',
      overflow: 'hidden',
      marginTop: '8px',
    }}>
      <div style={{
        background: color,
        height: '100%',
        width: `${percentage}%`,
        transition: 'width var(--duration-normal) var(--ease-standard)',
      }} />
    </div>
  );
}
