import type { BilingualText, MaintenanceMode } from '../types';

export const copy = {
  brandName: {
    en: 'Quality Report Hub',
    pt: 'Quality Report Hub'
  },
  themeLight: {
    en: 'Light mode',
    pt: 'Modo claro'
  },
  themeDark: {
    en: 'Dark mode',
    pt: 'Modo escuro'
  },
  title: {
    en: 'Weekly report',
    pt: 'Relatorio semanal'
  },
  subtitle: {
    en: 'Quality status by week and module',
    pt: 'Status de qualidade por semana e modulo'
  },
  weeks: {
    en: 'Weeks',
    pt: 'Semanas'
  },
  projects: {
    en: 'Projects',
    pt: 'Projetos'
  },
  projectsPageTitle: {
    en: 'Projects management page',
    pt: 'Página de gerenciamento de projetos'
  },
  projectsPageSubtitle: {
    en: 'Manage the company projects, add new or delete old ones',
    pt: 'Gerencie os projetos da companhia, adicione novos ou delete projetos antigos'
  },
  projectData: {
    en: 'Project Data',
    pt: 'Dados do Projeto'
  },
  projectDataPageTitle: {
    en: 'Project Data Page',
    pt: 'Dados do Projeto'
  },
  projectDataCapture: {
    en: 'Capture weekly delivery, test coverage and release information.',
    pt: 'Registre entrega semanal, cobertura de testes e informacoes de release.'
  },
  issueHistorySubtitle: {
    en: 'Issues reported and resolved during this week.',
    pt: 'Issues reportadas e resolvidas durante esta semana.'
  },
  testCaseDistributionSubtitle: {
    en: 'Current test inventory by automation status.',
    pt: 'Inventario atual de testes por status de automacao.'
  },
  releaseSummarySubtitle: {
    en: 'Required fields are marked with an asterisk.',
    pt: 'Campos obrigatorios sao marcados com asterisco.'
  },
  priorityNotesSubtitle: {
    en: 'Capture only items that need attention in the weekly report.',
    pt: 'Registre somente itens que precisam de atencao no relatorio semanal.'
  },
  requiredField: {
    en: 'Required field',
    pt: 'Campo obrigatorio'
  },
  leadQa: {
    en: 'Lead QA',
    pt: 'QA Lider'
  },
  notAssigned: {
    en: 'Not assigned',
    pt: 'Nao atribuido'
  },
  client: {
    en: 'Client',
    pt: 'Cliente'
  },
  mainTechScope: {
    en: 'Main Technology Scope',
    pt: 'Escopo Principal de Tecnologia'
  },
  releaseNotes: {
    en: 'Release notes',
    pt: 'Notas do release'
  },
  notesAction: {
    en: 'Notes',
    pt: 'Notas'
  },
  testCaseReport: {
    en: 'Test case report',
    pt: 'Relatorio de casos de teste'
  },
  passRate: {
    en: 'Pass rate',
    pt: 'Taxa de aprovacao'
  },
  issuesFound: {
    en: 'Issues found',
    pt: 'Issues encontradas'
  },
  issueCountA: {
    en: 'Category A',
    pt: 'Categoria A'
  },
  issueCountB: {
    en: 'Category B',
    pt: 'Categoria B'
  },
  issueCountC: {
    en: 'Category C',
    pt: 'Categoria C'
  },
  addProject: {
    en: 'Add new',
    pt: 'Adicionar'
  },
  selectProject: {
    en: 'Select project',
    pt: 'Selecionar projeto'
  },
  selectWeek: {
    en: 'Select week',
    pt: 'Selecionar semana'
  },
  calendar: {
    en: 'Calendar',
    pt: 'Calendario'
  },
  noWeeks: {
    en: 'No weeks with data for this project yet.',
    pt: 'Ainda nao ha semanas com dados para este projeto.'
  },
  noActiveWeeks: {
    en: 'No active weeks are available yet.',
    pt: 'Ainda nao ha semanas ativas disponiveis.'
  },
  languageLabel: {
    en: 'Language',
    pt: 'Idioma'
  },
  issueHistory: {
    en: 'Issue history',
    pt: 'Historico de issues'
  },
  last5Weeks: {
    en: 'Last 5 weeks',
    pt: 'Ultimas 5 semanas'
  },
  last10Weeks: {
    en: 'Last 10 weeks',
    pt: 'Ultimas 10 semanas'
  },
  testCaseDistribution: {
    en: 'Test case distribution',
    pt: 'Distribuicao de casos de teste'
  },
  releases: {
    en: 'Release summary',
    pt: 'Resumo do release'
  },
  notes: {
    en: 'Priority notes',
    pt: 'Notas por prioridade'
  },
  emptyGeneric: {
    en: 'No data available right now.',
    pt: 'Nao ha dados disponiveis no momento.'
  },
  emptyRelease: {
    en: 'No release data available right now.',
    pt: 'Nao foi possivel localizar dados para mostrar no momento'
  },
  loading: {
    en: 'Loading...',
    pt: 'Carregando...'
  },
  refresh: {
    en: 'Refresh data',
    pt: 'Atualizar dados'
  },
  save: {
    en: 'Save',
    pt: 'Salvar'
  },
  cancel: {
    en: 'Cancel',
    pt: 'Cancelar'
  },
  owner: {
    en: 'Edited by',
    pt: 'Editado por'
  },
  lockActive: {
    en: 'Record locked for editing',
    pt: 'Registro bloqueado para edicao'
  },
  lockExpires: {
    en: 'Lock expires after 15 minutes of inactivity',
    pt: 'Bloqueio expira apos 15 minutos de inatividade'
  },
  signIn: {
    en: 'Sign in',
    pt: 'Entrar'
  },
  signUp: {
    en: 'Create account',
    pt: 'Criar conta'
  },
  username: {
    en: 'Username',
    pt: 'Usuario'
  },
  email: {
    en: 'Email',
    pt: 'Email'
  },
  password: {
    en: 'Password',
    pt: 'Senha'
  },
  displayName: {
    en: 'Display name',
    pt: 'Nome de exibicao'
  },
  logout: {
    en: 'Sign out',
    pt: 'Sair'
  },
  haveAccount: {
    en: 'Already have an account? Sign in',
    pt: 'Ja tem uma conta? Entrar'
  },
  needAccount: {
    en: "Don't have an account? Create one",
    pt: 'Nao tem conta? Crie uma'
  },
  authSubtitle: {
    en: 'Sign in to access the QA dashboard',
    pt: 'Entre para acessar o painel de QA'
  },
  fixedIssues: {
    en: 'Fixed issues',
    pt: 'Issues corrigidas'
  },
  reportedIssues: {
    en: 'Reported issues',
    pt: 'Issues reportadas'
  },
  automated: {
    en: 'Automated',
    pt: 'Automatizado'
  },
  pendingAutomation: {
    en: 'Pending Automation',
    pt: 'Pendente de automacao'
  },
  notAutomated: {
    en: 'Not Automated',
    pt: 'Nao automatizado'
  },
  maintenance: {
    en: 'Maintenance',
    pt: 'Manutencao'
  },
  editRelease: {
    en: 'Edit release',
    pt: 'Editar release'
  },
  editNote: {
    en: 'Edit note',
    pt: 'Editar nota'
  },
  newRecord: {
    en: '+ New',
    pt: '+ Novo'
  },
  addRelease: {
    en: 'Add release',
    pt: 'Adicionar release'
  },
  addNote: {
    en: 'Add note',
    pt: 'Adicionar nota'
  },
  copyPreviousWeek: {
    en: 'Copy previous week',
    pt: 'Copiar semana anterior'
  },
  discardChanges: {
    en: 'Discard changes',
    pt: 'Descartar alteracoes'
  },
  saveProjectData: {
    en: 'Save project data',
    pt: 'Salvar dados do projeto'
  },
  unsavedChanges: {
    en: 'Unsaved changes',
    pt: 'Alteracoes nao salvas'
  },
  noPreviousWeekData: {
    en: 'No data found in the previous week.',
    pt: 'Nenhum dado encontrado na semana anterior.'
  },
  copiedPreviousWeek: {
    en: 'Previous week data copied. Review and save to apply it to this week.',
    pt: 'Dados da semana anterior copiados. Revise e salve para aplicar nesta semana.'
  },
  netChange: {
    en: 'Net change',
    pt: 'Saldo'
  },
  netChangeHelp: {
    en: 'Calculated automatically from reported minus fixed issues.',
    pt: 'Calculado automaticamente por issues reportadas menos corrigidas.'
  },
  automationCoverage: {
    en: 'Automation coverage',
    pt: 'Cobertura de automacao'
  },
  automatedSuffix: {
    en: 'automated',
    pt: 'automatizado'
  },
  weekNumber: {
    en: 'Week number',
    pt: 'Numero da semana'
  },
  startDate: {
    en: 'Start date',
    pt: 'Data inicial'
  },
  endDate: {
    en: 'End date',
    pt: 'Data final'
  },
  active: {
    en: 'Active',
    pt: 'Ativa'
  },
  code: {
    en: 'Code',
    pt: 'Codigo'
  },
  name: {
    en: 'Name',
    pt: 'Nome'
  },
  order: {
    en: 'Order',
    pt: 'Ordem'
  },
  description: {
    en: 'Description',
    pt: 'Descricao'
  },
  reported: {
    en: 'Reported',
    pt: 'Reportadas'
  },
  fixed: {
    en: 'Fixed',
    pt: 'Corrigidas'
  },
  formAutomated: {
    en: 'Automated',
    pt: 'Automatizados'
  },
  formPending: {
    en: 'Pending',
    pt: 'Pendentes'
  },
  formNotAutomated: {
    en: 'Not automated',
    pt: 'Nao automatizados'
  },
  version: {
    en: 'Version',
    pt: 'Versao'
  },
  date: {
    en: 'Date',
    pt: 'Data'
  },
  releasedDate: {
    en: 'Released date',
    pt: 'Data de release'
  },
  verifiedDate: {
    en: 'Verified date',
    pt: 'Data de verificacao'
  },
  status: {
    en: 'Status',
    pt: 'Status'
  },
  testsPass: {
    en: 'Tests pass',
    pt: 'Testes aprovados'
  },
  testsFail: {
    en: 'Tests fail',
    pt: 'Testes falhos'
  },
  testsNotTested: {
    en: 'Tests not tested',
    pt: 'Testes nao executados'
  },
  criticalIssues: {
    en: 'Critical issues',
    pt: 'Issues criticas'
  },
  changelog: {
    en: 'Changelog',
    pt: 'Changelog'
  },
  priority: {
    en: 'Priority',
    pt: 'Prioridade'
  },
  author: {
    en: 'Author',
    pt: 'Autor'
  },
  delete: {
    en: 'Delete',
    pt: 'Excluir'
  },
  deleteRelease: {
    en: 'Delete release',
    pt: 'Excluir release'
  },
  deleteNote: {
    en: 'Delete note',
    pt: 'Excluir nota'
  },
  note: {
    en: 'Note',
    pt: 'Nota'
  },
  priority0: {
    en: 'P0 · Critical',
    pt: 'P0 · Critica'
  },
  priority1: {
    en: 'P1 · High',
    pt: 'P1 · Alta'
  },
  priority2: {
    en: 'P2 · Medium',
    pt: 'P2 · Media'
  },
  priority3: {
    en: 'P3 · Low',
    pt: 'P3 · Baixa'
  }
} satisfies Record<string, BilingualText>;

export const maintenanceTitles: Record<MaintenanceMode, BilingualText> = {
  weeks: { en: 'Manage weeks', pt: 'Gerenciar semanas' },
  projects: { en: 'Manage projects', pt: 'Gerenciar projetos' },
  issues: { en: 'Manage issue metrics', pt: 'Gerenciar metricas de issues' },
  'test-cases': { en: 'Manage test coverage', pt: 'Gerenciar cobertura de testes' },
  releases: { en: 'Manage releases', pt: 'Gerenciar releases' },
  notes: { en: 'Manage notes', pt: 'Gerenciar notas' }
};
