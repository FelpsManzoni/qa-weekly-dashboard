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

export function bilingualText(text: BilingualText): string {
  return `${text.en} / ${text.pt}`;
}
