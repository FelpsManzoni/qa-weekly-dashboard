import React from 'react';

export function TestCaseDistribution({ data }) {
  const total = data.automated + data.pendingAutomation + data.notAutomated;
  const automatedPercent = (data.automated / total) * 100;
  const pendingPercent = (data.pendingAutomation / total) * 100;
  const notAutomatedPercent = (data.notAutomated / total) * 100;

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
    }}>
      <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-md)', fontWeight: 600 }}>
        Test Case Distribution
      </h3>
      <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
        {/* Pie Chart */}
        <svg width="150" height="150" viewBox="0 0 100 100" style={{ flex: '0 0 auto' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#a3e635" strokeWidth="30" strokeDasharray={`${automatedPercent * 2.827} 282.7`} />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#fbbf24" strokeWidth="30" strokeDasharray={`${pendingPercent * 2.827} 282.7`} strokeDashoffset={-automatedPercent * 2.827} />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f87171" strokeWidth="30" strokeDasharray={`${notAutomatedPercent * 2.827} 282.7`} strokeDashoffset={-(automatedPercent + pendingPercent) * 2.827} />
        </svg>
        
        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a3e635' }}></div>
            <span style={{ fontSize: 'var(--text-sm)' }}>Automated: <strong>{data.automated}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }}></div>
            <span style={{ fontSize: 'var(--text-sm)' }}>Pending: <strong>{data.pendingAutomation}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f87171' }}></div>
            <span style={{ fontSize: 'var(--text-sm)' }}>Not Automated: <strong>{data.notAutomated}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
