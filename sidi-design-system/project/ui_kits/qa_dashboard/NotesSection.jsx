import React from 'react';

export function NotesSection({ notes }) {
  if (!notes || notes.length === 0) {
    return null;
  }

  const priorityColors = {
    0: { bg: '#fee2e2', fg: '#dc2626', label: 'Critical' },
    1: { bg: '#fef08a', fg: '#ca8a04', label: 'High' },
    2: { bg: '#dcfce7', fg: '#16a34a', label: 'Medium' },
  };

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
    }}>
      <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>
        Notes
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {notes.map((note, i) => {
          const colors = priorityColors[note.priority] || priorityColors[2];
          return (
            <div key={i} style={{
              padding: 'var(--space-3) var(--space-4)',
              borderLeft: `4px solid ${colors.fg}`,
              background: colors.bg,
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontWeight: 600, color: colors.fg, marginBottom: '4px' }}>
                {note.title}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: colors.fg, opacity: 0.7 }}>
                Priority: {colors.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
