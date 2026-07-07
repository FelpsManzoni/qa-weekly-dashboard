import React from 'react';

export function WeekPicker({ weeks, selectedWeek, onSelectWeek }) {
  const sortedWeeks = [...weeks].sort((a, b) => b.weekNumber - a.weekNumber);
  
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-3)',
      overflowX: 'auto',
      paddingBottom: 'var(--space-3)',
      marginBottom: 'var(--space-6)',
    }}>
      {sortedWeeks.map((week) => (
        <button
          key={week.weekNumber}
          onClick={() => onSelectWeek(week.weekNumber)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: selectedWeek === week.weekNumber ? 'var(--brand-primary)' : 'var(--surface-sunken)',
            color: selectedWeek === week.weekNumber ? 'var(--text-inverse)' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--duration-fast) var(--ease-standard)',
          }}
        >
          <div>Week {week.weekNumber}</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
            {week.startDate} - {week.endDate}
          </div>
        </button>
      ))}
    </div>
  );
}
