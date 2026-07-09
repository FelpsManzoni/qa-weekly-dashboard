import type { BilingualText, MaintenanceMode } from '../types';

export const copy = {
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
    en: 'Projects / modules',
    pt: 'Projetos / modulos'
  },
  issueHistory: {
    en: 'Issue history',
    pt: 'Historico de issues'
  },
  testCaseDistribution: {
    en: 'Test case distribution',
    pt: 'Distribuicao de casos de teste'
  },
  releases: {
    en: 'Release / version table',
    pt: 'Tabela de release / versao'
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
  status: {
    en: 'Status',
    pt: 'Status'
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
  note: {
    en: 'Note',
    pt: 'Nota'
  },
  priority0: {
    en: 'Priority 0',
    pt: 'Prioridade 0'
  },
  priority1: {
    en: 'Priority 1',
    pt: 'Prioridade 1'
  },
  priority2: {
    en: 'Priority 2',
    pt: 'Prioridade 2'
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
