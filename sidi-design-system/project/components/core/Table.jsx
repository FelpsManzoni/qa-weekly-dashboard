import React from 'react';

export function Table({ columns, rows, striped = true }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
      }}
    >
      <thead>
        <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
          {columns.map((col, i) => (
            <th
              key={i}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                textAlign: 'left',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{
              background: striped && i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {row.map((cell, j) => (
              <td key={j} style={{ padding: 'var(--space-3) var(--space-4)' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
