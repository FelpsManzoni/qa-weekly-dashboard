/* @ds-bundle: {"format":4,"namespace":"SiDiDesignSystem_a5e0ec","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Table","sourcePath":"components/core/Table.jsx"},{"name":"Header","sourcePath":"ui_kits/qa_dashboard/Header.jsx"},{"name":"IssueHistory","sourcePath":"ui_kits/qa_dashboard/IssueHistory.jsx"},{"name":"NotesSection","sourcePath":"ui_kits/qa_dashboard/NotesSection.jsx"},{"name":"ProgressBar","sourcePath":"ui_kits/qa_dashboard/ProgressBar.jsx"},{"name":"ProjectForm","sourcePath":"ui_kits/qa_dashboard/ProjectForm.jsx"},{"name":"ProjectStatus","sourcePath":"ui_kits/qa_dashboard/ProjectStatus.jsx"},{"name":"StatCard","sourcePath":"ui_kits/qa_dashboard/StatCard.jsx"},{"name":"TestCaseDistribution","sourcePath":"ui_kits/qa_dashboard/TestCaseDistribution.jsx"},{"name":"VersionTable","sourcePath":"ui_kits/qa_dashboard/VersionTable.jsx"},{"name":"WeekPicker","sourcePath":"ui_kits/qa_dashboard/WeekPicker.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"f6f79b54701c","components/core/Button.jsx":"f0691dfc35c9","components/core/Card.jsx":"38b1a48f7fc4","components/core/Input.jsx":"9f19a16cb3df","components/core/Table.jsx":"245ffe06a1a7","data/sampleData.js":"4bae9ffce980","ui_kits/qa_dashboard/Header.jsx":"480d09cfa6f5","ui_kits/qa_dashboard/IssueHistory.jsx":"a90663b2e466","ui_kits/qa_dashboard/NotesSection.jsx":"8688c43d3fe8","ui_kits/qa_dashboard/ProgressBar.jsx":"8059302023c9","ui_kits/qa_dashboard/ProjectForm.jsx":"2e7f0f012c7f","ui_kits/qa_dashboard/ProjectStatus.jsx":"e50ab081c448","ui_kits/qa_dashboard/StatCard.jsx":"720206f4460f","ui_kits/qa_dashboard/TestCaseDistribution.jsx":"db35f399f100","ui_kits/qa_dashboard/VersionTable.jsx":"0c72fef0644f","ui_kits/qa_dashboard/WeekPicker.jsx":"96c335abd954"},"inlinedExternals":[],"unexposedExports":[{"name":"getAllProjects","sourcePath":"data/sampleData.js"},{"name":"getProjectById","sourcePath":"data/sampleData.js"},{"name":"getWeeklyReportForProject","sourcePath":"data/sampleData.js"},{"name":"projectsData","sourcePath":"data/sampleData.js"},{"name":"weeklyReportsData","sourcePath":"data/sampleData.js"}]} */

(() => {

const __ds_ns = (window.SiDiDesignSystem_a5e0ec = window.SiDiDesignSystem_a5e0ec || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  label,
  variant = 'default',
  size = 'md'
}) {
  const variantStyles = {
    default: {
      background: 'var(--purple-100)',
      color: 'var(--purple-900)'
    },
    success: {
      background: 'var(--status-pass-bg)',
      color: 'var(--status-pass)'
    },
    danger: {
      background: 'var(--status-fail-bg)',
      color: 'var(--status-fail)'
    },
    warning: {
      background: 'var(--status-warning-bg)',
      color: 'var(--status-warning)'
    },
    info: {
      background: 'var(--purple-50)',
      color: 'var(--text-primary)'
    }
  };
  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: 'var(--text-xs)',
      borderRadius: 'var(--radius-sm)'
    },
    md: {
      padding: '6px 10px',
      fontSize: 'var(--text-xs)',
      borderRadius: 'var(--radius-sm)'
    },
    lg: {
      padding: '8px 12px',
      fontSize: 'var(--text-sm)',
      borderRadius: 'var(--radius-md)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      ...variantStyles[variant],
      ...sizeStyles[size]
    }
  }, label);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const sizeStyles = {
  sm: {
    padding: '6px 12px',
    fontSize: 'var(--text-sm)',
    borderRadius: 'var(--radius-sm)'
  },
  md: {
    padding: '9px 16px',
    fontSize: 'var(--text-base)',
    borderRadius: 'var(--radius-sm)'
  },
  lg: {
    padding: '12px 20px',
    fontSize: 'var(--text-md)',
    borderRadius: 'var(--radius-md)'
  }
};
const variantStyles = {
  primary: {
    background: 'var(--brand-primary)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--brand-primary)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--status-fail)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--status-fail)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  type = 'button'
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
    ...variantStyles[variant]
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
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: base
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'md',
  elevation = 'md'
}) {
  const paddingStyles = {
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  const elevationStyles = {
    none: '0',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: paddingStyles[padding],
      boxShadow: elevationStyles[elevation]
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  size = 'md'
}) {
  const sizeStyles = {
    sm: {
      padding: '6px 10px',
      fontSize: 'var(--text-sm)'
    },
    md: {
      padding: '9px 12px',
      fontSize: 'var(--text-base)'
    },
    lg: {
      padding: '12px 14px',
      fontSize: 'var(--text-md)'
    }
  };
  return /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    disabled: disabled,
    style: {
      fontFamily: 'var(--font-body)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
      border: `1px solid ${error ? 'var(--status-fail)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-sm)',
      transition: 'border-color var(--duration-fast) var(--ease-standard)',
      outline: 'none',
      ...sizeStyles[size]
    },
    onFocus: e => {
      if (!error) e.target.style.borderColor = 'var(--brand-primary)';
    },
    onBlur: e => {
      e.target.style.borderColor = error ? 'var(--status-fail)' : 'var(--border-default)';
    }
  });
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Table.jsx
try { (() => {
function Table({
  columns,
  rows,
  striped = true
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, columns.map((col, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  }, col)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: striped && i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, row.map((cell, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: 'var(--space-3) var(--space-4)'
    }
  }, cell))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Table.jsx", error: String((e && e.message) || e) }); }

// data/sampleData.js
try { (() => {
// Sample data structure for the dashboard
// In production, this would come from a backend API or database

const projectsData = [{
  id: 1,
  name: 'HANA NB-IOT',
  code: 'Hana',
  description: 'IoT solution for HANA systems',
  createdDate: '2024-01-15',
  owner: 'Team A'
}, {
  id: 2,
  name: 'Samsung BIXBY',
  code: 'BXB',
  description: 'Voice assistant integration',
  createdDate: '2024-02-10',
  owner: 'Team B'
}, {
  id: 3,
  name: 'Bixby Design Tool',
  code: 'BDT',
  description: 'Design tool for voice interactions',
  createdDate: '2024-01-20',
  owner: 'Team C'
}, {
  id: 4,
  name: 'COMPAL - AI-REPORT',
  code: 'AI Rep',
  description: 'AI-powered reporting system',
  createdDate: '2024-03-05',
  owner: 'Team D'
}, {
  id: 5,
  name: 'Global Transitions Cloud',
  code: 'GTC',
  description: 'Cloud transition services',
  createdDate: '2024-02-28',
  owner: 'Team E'
}, {
  id: 6,
  name: 'COMPAL - VLA/NIST',
  code: 'VLA',
  description: 'Compliance and validation platform',
  createdDate: '2024-03-12',
  owner: 'Team F'
}];
const weeklyReportsData = {
  1: {
    // Project ID: Hana
    weeks: [{
      weekNumber: 27,
      startDate: '2026-07-02',
      endDate: '2026-07-08',
      fixedIssues: 2,
      reportedIssues: 1,
      versions: [{
        version: '1.2.4',
        date: '2026-07-05',
        status: 'Stable',
        criticalIssues: 0,
        changelog: 'Bug fixes'
      }],
      testCaseDistribution: {
        automated: 45,
        pendingAutomation: 8,
        notAutomated: 12
      },
      notes: [{
        id: 'note1',
        title: 'Performance improvements',
        priority: 0
      }]
    }, {
      weekNumber: 26,
      startDate: '2026-06-25',
      endDate: '2026-07-01',
      fixedIssues: 1,
      reportedIssues: 2,
      versions: [],
      testCaseDistribution: {
        automated: 42,
        pendingAutomation: 10,
        notAutomated: 15
      },
      notes: []
    }]
  },
  2: {
    // Project ID: BXB
    weeks: [{
      weekNumber: 27,
      startDate: '2026-07-02',
      endDate: '2026-07-08',
      fixedIssues: 5,
      reportedIssues: 10,
      versions: [{
        version: '2.1.0',
        date: '2026-07-04',
        status: 'Beta',
        criticalIssues: 2,
        changelog: 'Voice recognition updates'
      }],
      testCaseDistribution: {
        automated: 38,
        pendingAutomation: 15,
        notAutomated: 22
      },
      notes: [{
        id: 'note1',
        title: 'BXB W27 - 001',
        priority: 0
      }, {
        id: 'note2',
        title: 'Notes 01 27',
        priority: 1
      }, {
        id: 'note3',
        title: 'Review voice model',
        priority: 2
      }]
    }]
  },
  3: {
    // Project ID: BDT
    weeks: [{
      weekNumber: 27,
      startDate: '2026-07-02',
      endDate: '2026-07-08',
      fixedIssues: 0,
      reportedIssues: 3,
      versions: [],
      testCaseDistribution: {
        automated: 52,
        pendingAutomation: 6,
        notAutomated: 8
      },
      notes: []
    }]
  }
};
const getProjectById = id => projectsData.find(p => p.id === id);
const getWeeklyReportForProject = projectId => weeklyReportsData[projectId] || {
  weeks: []
};
const getAllProjects = () => projectsData;
Object.assign(__ds_scope, { projectsData, weeklyReportsData, getProjectById, getWeeklyReportForProject, getAllProjects });
})(); } catch (e) { __ds_ns.__errors.push({ path: "data/sampleData.js", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/Header.jsx
try { (() => {
function Header({
  title,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 4px 0',
      fontSize: 'var(--text-3xl)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/IssueHistory.jsx
try { (() => {
function IssueHistory({
  fixedIssues,
  reportedIssues
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-4) 0',
      fontSize: 'var(--text-md)',
      fontWeight: 600
    }
  }, "Issue History"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 'var(--space-2)'
    }
  }, "Fixed Issues"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#22c55e'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 700,
      color: '#22c55e'
    }
  }, fixedIssues))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 'var(--space-2)'
    }
  }, "Reported Issues"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#ef4444'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 700,
      color: '#ef4444'
    }
  }, reportedIssues)))));
}
Object.assign(__ds_scope, { IssueHistory });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/IssueHistory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/NotesSection.jsx
try { (() => {
function NotesSection({
  notes
}) {
  if (!notes || notes.length === 0) {
    return null;
  }
  const priorityColors = {
    0: {
      bg: '#fee2e2',
      fg: '#dc2626',
      label: 'Critical'
    },
    1: {
      bg: '#fef08a',
      fg: '#ca8a04',
      label: 'High'
    },
    2: {
      bg: '#dcfce7',
      fg: '#16a34a',
      label: 'Medium'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-4) 0',
      fontSize: 'var(--text-md)',
      fontWeight: 600
    }
  }, "Notes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, notes.map((note, i) => {
    const colors = priorityColors[note.priority] || priorityColors[2];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: 'var(--space-3) var(--space-4)',
        borderLeft: `4px solid ${colors.fg}`,
        background: colors.bg,
        borderRadius: 'var(--radius-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: colors.fg,
        marginBottom: '4px'
      }
    }, note.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: colors.fg,
        opacity: 0.7
      }
    }, "Priority: ", colors.label));
  })));
}
Object.assign(__ds_scope, { NotesSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/NotesSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value,
  max = 100,
  color = 'var(--green-500)'
}) {
  const percentage = value / max * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-full)',
      height: '8px',
      overflow: 'hidden',
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: color,
      height: '100%',
      width: `${percentage}%`,
      transition: 'width var(--duration-normal) var(--ease-standard)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/ProjectForm.jsx
try { (() => {
function ProjectForm({
  onSubmit,
  initialData = null
}) {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    code: '',
    description: '',
    owner: ''
  });
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "Project Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "e.g., Samsung BIXBY",
    value: formData.name,
    onChange: e => handleChange('name', e.target.value),
    required: true,
    style: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-body)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "Project Code"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "e.g., BXB",
    value: formData.code,
    onChange: e => handleChange('code', e.target.value),
    required: true,
    style: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-body)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Project description...",
    value: formData.description,
    onChange: e => handleChange('description', e.target.value),
    style: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-body)',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "Project Owner"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "e.g., Team A",
    value: formData.owner,
    onChange: e => handleChange('owner', e.target.value),
    required: true,
    style: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-body)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      padding: 'var(--space-3) var(--space-6)',
      background: 'var(--brand-primary)',
      color: 'var(--text-inverse)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      fontWeight: 600,
      fontSize: 'var(--text-base)',
      cursor: 'pointer',
      transition: 'opacity var(--duration-fast) var(--ease-standard)'
    },
    onMouseEnter: e => e.target.style.opacity = '0.9',
    onMouseLeave: e => e.target.style.opacity = '1'
  }, initialData ? 'Update Project' : 'Create Project'));
}
Object.assign(__ds_scope, { ProjectForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/ProjectForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/ProjectStatus.jsx
try { (() => {
function ProjectStatus({
  name,
  status,
  passRate,
  trend
}) {
  const statusColors = {
    pass: {
      bg: 'var(--status-pass-bg)',
      fg: 'var(--status-pass)',
      label: 'Pass'
    },
    fail: {
      bg: 'var(--status-fail-bg)',
      fg: 'var(--status-fail)',
      label: 'Fail'
    },
    warning: {
      bg: 'var(--status-warning-bg)',
      fg: 'var(--status-warning)',
      label: 'Warning'
    },
    running: {
      bg: 'var(--status-running-bg)',
      fg: 'var(--status-running)',
      label: 'Running'
    }
  };
  const colors = statusColors[status];
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? 'var(--status-pass)' : trend === 'down' ? 'var(--status-fail)' : 'var(--text-secondary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px 0',
      fontSize: 'var(--text-md)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: colors.bg,
      color: colors.fg,
      padding: '4px 8px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-xs)',
      fontWeight: 600
    }
  }, colors.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, passRate, "% pass rate"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '18px',
      color: trendColor,
      fontWeight: 700
    }
  }, trendIcon));
}
Object.assign(__ds_scope, { ProjectStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/ProjectStatus.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/StatCard.jsx
try { (() => {
function StatCard({
  icon,
  label,
  value,
  status = 'default'
}) {
  const statusColors = {
    default: 'var(--text-primary)',
    success: 'var(--status-pass)',
    warning: 'var(--status-warning)',
    danger: 'var(--status-fail)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '28px',
      color: statusColors[status]
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: statusColors[status]
    }
  }, value)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/StatCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/TestCaseDistribution.jsx
try { (() => {
function TestCaseDistribution({
  data
}) {
  const total = data.automated + data.pendingAutomation + data.notAutomated;
  const automatedPercent = data.automated / total * 100;
  const pendingPercent = data.pendingAutomation / total * 100;
  const notAutomatedPercent = data.notAutomated / total * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-4) 0',
      fontSize: 'var(--text-md)',
      fontWeight: 600
    }
  }, "Test Case Distribution"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "150",
    height: "150",
    viewBox: "0 0 100 100",
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "none",
    stroke: "#a3e635",
    strokeWidth: "30",
    strokeDasharray: `${automatedPercent * 2.827} 282.7`
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "none",
    stroke: "#fbbf24",
    strokeWidth: "30",
    strokeDasharray: `${pendingPercent * 2.827} 282.7`,
    strokeDashoffset: -automatedPercent * 2.827
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "none",
    stroke: "#f87171",
    strokeWidth: "30",
    strokeDasharray: `${notAutomatedPercent * 2.827} 282.7`,
    strokeDashoffset: -(automatedPercent + pendingPercent) * 2.827
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#a3e635'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)'
    }
  }, "Automated: ", /*#__PURE__*/React.createElement("strong", null, data.automated))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#fbbf24'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)'
    }
  }, "Pending: ", /*#__PURE__*/React.createElement("strong", null, data.pendingAutomation))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#f87171'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)'
    }
  }, "Not Automated: ", /*#__PURE__*/React.createElement("strong", null, data.notAutomated))))));
}
Object.assign(__ds_scope, { TestCaseDistribution });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/TestCaseDistribution.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/VersionTable.jsx
try { (() => {
function VersionTable({
  versions
}) {
  if (!versions || versions.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: '0 0 var(--space-4) 0',
        fontSize: 'var(--text-md)',
        fontWeight: 600
      }
    }, "Versions"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--text-tertiary)',
        fontSize: 'var(--text-sm)'
      }
    }, "No versions available for this week"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      fontWeight: 600
    }
  }, "Versions")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.5px'
    }
  }, "Version"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.5px'
    }
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.5px'
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.5px'
    }
  }, "Critical Issues"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      textAlign: 'left',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.5px'
    }
  }, "Changelog"))), /*#__PURE__*/React.createElement("tbody", null, versions.map((v, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i < versions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
      background: i % 2 === 1 ? 'var(--surface-sunken)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--space-3) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, v.version)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--space-3) var(--space-4)'
    }
  }, v.date), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--space-3) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: v.status === 'Stable' ? '#dcfce7' : '#fef3c7',
      color: v.status === 'Stable' ? '#16a34a' : '#d97706',
      padding: '4px 8px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-xs)',
      fontWeight: 600
    }
  }, v.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--space-3) var(--space-4)'
    }
  }, v.criticalIssues), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--space-3) var(--space-4)',
      color: 'var(--text-secondary)'
    }
  }, v.changelog))))));
}
Object.assign(__ds_scope, { VersionTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/VersionTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qa_dashboard/WeekPicker.jsx
try { (() => {
function WeekPicker({
  weeks,
  selectedWeek,
  onSelectWeek
}) {
  const sortedWeeks = [...weeks].sort((a, b) => b.weekNumber - a.weekNumber);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      overflowX: 'auto',
      paddingBottom: 'var(--space-3)',
      marginBottom: 'var(--space-6)'
    }
  }, sortedWeeks.map(week => /*#__PURE__*/React.createElement("button", {
    key: week.weekNumber,
    onClick: () => onSelectWeek(week.weekNumber),
    style: {
      padding: 'var(--space-2) var(--space-4)',
      background: selectedWeek === week.weekNumber ? 'var(--brand-primary)' : 'var(--surface-sunken)',
      color: selectedWeek === week.weekNumber ? 'var(--text-inverse)' : 'var(--text-primary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      fontWeight: 600,
      fontSize: 'var(--text-sm)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Week ", week.weekNumber), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      opacity: 0.8
    }
  }, week.startDate, " - ", week.endDate))));
}
Object.assign(__ds_scope, { WeekPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qa_dashboard/WeekPicker.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.IssueHistory = __ds_scope.IssueHistory;

__ds_ns.NotesSection = __ds_scope.NotesSection;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ProjectForm = __ds_scope.ProjectForm;

__ds_ns.ProjectStatus = __ds_scope.ProjectStatus;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.TestCaseDistribution = __ds_scope.TestCaseDistribution;

__ds_ns.VersionTable = __ds_scope.VersionTable;

__ds_ns.WeekPicker = __ds_scope.WeekPicker;

})();
