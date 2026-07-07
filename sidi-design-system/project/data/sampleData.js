// Sample data structure for the dashboard
// In production, this would come from a backend API or database

export const projectsData = [
  {
    id: 1,
    name: 'HANA NB-IOT',
    code: 'Hana',
    description: 'IoT solution for HANA systems',
    createdDate: '2024-01-15',
    owner: 'Team A'
  },
  {
    id: 2,
    name: 'Samsung BIXBY',
    code: 'BXB',
    description: 'Voice assistant integration',
    createdDate: '2024-02-10',
    owner: 'Team B'
  },
  {
    id: 3,
    name: 'Bixby Design Tool',
    code: 'BDT',
    description: 'Design tool for voice interactions',
    createdDate: '2024-01-20',
    owner: 'Team C'
  },
  {
    id: 4,
    name: 'COMPAL - AI-REPORT',
    code: 'AI Rep',
    description: 'AI-powered reporting system',
    createdDate: '2024-03-05',
    owner: 'Team D'
  },
  {
    id: 5,
    name: 'Global Transitions Cloud',
    code: 'GTC',
    description: 'Cloud transition services',
    createdDate: '2024-02-28',
    owner: 'Team E'
  },
  {
    id: 6,
    name: 'COMPAL - VLA/NIST',
    code: 'VLA',
    description: 'Compliance and validation platform',
    createdDate: '2024-03-12',
    owner: 'Team F'
  }
];

export const weeklyReportsData = {
  1: { // Project ID: Hana
    weeks: [
      {
        weekNumber: 27,
        startDate: '2026-07-02',
        endDate: '2026-07-08',
        fixedIssues: 2,
        reportedIssues: 1,
        versions: [
          { version: '1.2.4', date: '2026-07-05', status: 'Stable', criticalIssues: 0, changelog: 'Bug fixes' }
        ],
        testCaseDistribution: {
          automated: 45,
          pendingAutomation: 8,
          notAutomated: 12
        },
        notes: [
          { id: 'note1', title: 'Performance improvements', priority: 0 }
        ]
      },
      {
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
      }
    ]
  },
  2: { // Project ID: BXB
    weeks: [
      {
        weekNumber: 27,
        startDate: '2026-07-02',
        endDate: '2026-07-08',
        fixedIssues: 5,
        reportedIssues: 10,
        versions: [
          { version: '2.1.0', date: '2026-07-04', status: 'Beta', criticalIssues: 2, changelog: 'Voice recognition updates' }
        ],
        testCaseDistribution: {
          automated: 38,
          pendingAutomation: 15,
          notAutomated: 22
        },
        notes: [
          { id: 'note1', title: 'BXB W27 - 001', priority: 0 },
          { id: 'note2', title: 'Notes 01 27', priority: 1 },
          { id: 'note3', title: 'Review voice model', priority: 2 }
        ]
      }
    ]
  },
  3: { // Project ID: BDT
    weeks: [
      {
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
      }
    ]
  }
};

export const getProjectById = (id) => projectsData.find(p => p.id === id);
export const getWeeklyReportForProject = (projectId) => weeklyReportsData[projectId] || { weeks: [] };
export const getAllProjects = () => projectsData;
