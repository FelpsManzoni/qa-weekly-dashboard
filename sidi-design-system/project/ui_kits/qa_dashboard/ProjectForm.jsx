import React from 'react';

export function ProjectForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    code: '',
    description: '',
    owner: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          Project Name
        </label>
        <input
          type="text"
          placeholder="e.g., Samsung BIXBY"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          Project Code
        </label>
        <input
          type="text"
          placeholder="e.g., BXB"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          required
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          Description
        </label>
        <textarea
          placeholder="Project description..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            minHeight: '120px',
            resize: 'vertical',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          Project Owner
        </label>
        <input
          type="text"
          placeholder="e.g., Team A"
          value={formData.owner}
          onChange={(e) => handleChange('owner', e.target.value)}
          required
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: 'var(--space-3) var(--space-6)',
          background: 'var(--brand-primary)',
          color: 'var(--text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          fontSize: 'var(--text-base)',
          cursor: 'pointer',
          transition: 'opacity var(--duration-fast) var(--ease-standard)',
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        {initialData ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
}
