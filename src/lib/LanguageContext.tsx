import React, { createContext, useContext, useState, useEffect } from 'react';

// Available languages
export type LanguageType = 'en-GB' | 'pt-BR';

// Translations object type
export type TranslationsType = {
  [key: string]: {
    [key in LanguageType]: string;
  };
};

// Default translations
export const translations: TranslationsType = {
  // Navigation and sidebar
  dashboard: {
    'en-GB': 'Dashboard',
    'pt-BR': 'Painel',
  },
  tasks: {
    'en-GB': 'Tasks',
    'pt-BR': 'Tarefas',
  },
  projects: {
    'en-GB': 'Projects',
    'pt-BR': 'Projetos',
  },
  calendar: {
    'en-GB': 'Calendar',
    'pt-BR': 'Calendário',
  },
  clients: {
    'en-GB': 'Clients',
    'pt-BR': 'Clientes',
  },
  chat: {
    'en-GB': 'Chat',
    'pt-BR': 'Chat',
  },
  prospecting: {
    'en-GB': 'Prospecting',
    'pt-BR': 'Prospecção',
  },
  leads: {
    'en-GB': 'Leads',
    'pt-BR': 'Leads',
  },
  settings: {
    'en-GB': 'Settings',
    'pt-BR': 'Configurações',
  },
  logout: {
    'en-GB': 'Logout',
    'pt-BR': 'Sair',
  },
  turboMode: {
    'en-GB': 'Turbo Mode',
    'pt-BR': 'Modo Turbo',
  },
  turboModeActive: {
    'en-GB': 'Turbo Mode Active',
    'pt-BR': 'Modo Turbo Ativado',
  },
  // Settings page
  appearance: {
    'en-GB': 'Appearance',
    'pt-BR': 'Aparência',
  },
  account: {
    'en-GB': 'Account',
    'pt-BR': 'Conta',
  },
  notifications: {
    'en-GB': 'Notifications',
    'pt-BR': 'Notificações',
  },
  colorTheme: {
    'en-GB': 'Color Theme',
    'pt-BR': 'Tema de Cores',
  },
  chooseTheme: {
    'en-GB': 'Choose a predefined theme or customize the app colors',
    'pt-BR': 'Escolha um tema predefinido ou personalize as cores do aplicativo',
  },
  predefinedThemes: {
    'en-GB': 'Predefined Themes',
    'pt-BR': 'Temas Predefinidos',
  },
  customizeColors: {
    'en-GB': 'Customize Colors',
    'pt-BR': 'Personalizar Cores',
  },
  resetToCurrentTheme: {
    'en-GB': 'Reset to current theme',
    'pt-BR': 'Redefinir para o tema atual',
  },
  primaryColor: {
    'en-GB': 'Primary Color',
    'pt-BR': 'Cor Primária',
  },
  secondaryColor: {
    'en-GB': 'Secondary Color',
    'pt-BR': 'Cor Secundária',
  },
  background: {
    'en-GB': 'Background',
    'pt-BR': 'Fundo',
  },
  cards: {
    'en-GB': 'Cards',
    'pt-BR': 'Cartões',
  },
  clickToCustomize: {
    'en-GB': 'Click on the colored rectangles to customize individual colors.',
    'pt-BR': 'Clique nos retângulos coloridos para personalizar as cores individuais.',
  },
  logo: {
    'en-GB': 'Logo',
    'pt-BR': 'Logo',
  },
  chooseIdentity: {
    'en-GB': 'Choose how your visual identity will be displayed in your app',
    'pt-BR': 'Escolha como a identidade visual será exibida no seu aplicativo',
  },
  useTextInsteadOfLogo: {
    'en-GB': 'Use text instead of logo',
    'pt-BR': 'Usar texto no lugar da logo',
  },
  textModeActive: {
    'en-GB': 'Text mode active',
    'pt-BR': 'Modo texto ativado',
  },
  imageModeActive: {
    'en-GB': 'Image mode active',
    'pt-BR': 'Modo imagem ativado',
  },
  logoText: {
    'en-GB': 'Logo Text',
    'pt-BR': 'Texto da Logo',
  },
  typeCompanyName: {
    'en-GB': 'Type your company name',
    'pt-BR': 'Digite o nome da sua empresa',
  },
  save: {
    'en-GB': 'Save',
    'pt-BR': 'Salvar',
  },
  // Language section
  language: {
    'en-GB': 'Language',
    'pt-BR': 'Idioma',
  },
  chooseLanguage: {
    'en-GB': 'Choose your preferred language',
    'pt-BR': 'Escolha seu idioma preferido',
  },
  britishEnglish: {
    'en-GB': 'British English',
    'pt-BR': 'Inglês Britânico',
  },
  brazilianPortuguese: {
    'en-GB': 'Brazilian Portuguese',
    'pt-BR': 'Português do Brasil',
  },
  // Account settings
  accountInfo: {
    'en-GB': 'Account Information',
    'pt-BR': 'Informações da Conta',
  },
  manageProfile: {
    'en-GB': 'Manage your profile information and preferences',
    'pt-BR': 'Gerencie suas informações de perfil e preferências',
  },
  futureUpdate: {
    'en-GB': 'This feature will be implemented in a future update.',
    'pt-BR': 'Esta funcionalidade será implementada em uma atualização futura.',
  },
  // Notification settings
  configureNotifications: {
    'en-GB': 'Configure how you receive notifications',
    'pt-BR': 'Configure como você recebe notificações',
  },
  // Logo preview and upload
  preview: {
    'en-GB': 'Preview',
    'pt-BR': 'Pré-visualização',
  },
  customUpload: {
    'en-GB': 'To upload a custom logo, please contact the administrator.',
    'pt-BR': 'Para fazer upload de uma logo personalizada, consulte o administrador.',
  },
  // Login and Register
  email: {
    'en-GB': 'Email',
    'pt-BR': 'Email',
  },
  password: {
    'en-GB': 'Password',
    'pt-BR': 'Senha',
  },
  login: {
    'en-GB': 'Login',
    'pt-BR': 'Entrar',
  },
  register: {
    'en-GB': 'Register',
    'pt-BR': 'Registrar',
  },
  registration: {
    'en-GB': 'Registration',
    'pt-BR': 'Cadastro',
  },
  loggingIn: {
    'en-GB': 'Logging in...',
    'pt-BR': 'Entrando...',
  },
  registering: {
    'en-GB': 'Registering...',
    'pt-BR': 'Cadastrando...',
  },
  forgotPassword: {
    'en-GB': 'Forgot password?',
    'pt-BR': 'Esqueceu a senha?',
  },
  dontHaveAccount: {
    'en-GB': "Don't have an account?",
    'pt-BR': 'Não tem uma conta?',
  },
  alreadyHaveAccount: {
    'en-GB': 'Already have an account?',
    'pt-BR': 'Já tem uma conta?',
  },
  personName: {
    'en-GB': 'Name',
    'pt-BR': 'Nome',
  },
  confirmPassword: {
    'en-GB': 'Confirm Password',
    'pt-BR': 'Confirmar Senha',
  },
  teamId: {
    'en-GB': 'Team ID',
    'pt-BR': 'ID do Time',
  },
  verify: {
    'en-GB': 'Verify',
    'pt-BR': 'Verificar',
  },
  verifying: {
    'en-GB': 'Verifying...',
    'pt-BR': 'Verificando...',
  },
  createNewTeam: {
    'en-GB': 'Create new team',
    'pt-BR': 'Criar novo time',
  },
  teamVerified: {
    'en-GB': 'Team verified',
    'pt-BR': 'Time verificado',
  },
  teamVerifiedMessage: {
    'en-GB': 'The team ID is valid.',
    'pt-BR': 'O ID do time é válido.',
  },
  teamNotFound: {
    'en-GB': 'Team not found',
    'pt-BR': 'Time não encontrado',
  },
  teamNotFoundMessage: {
    'en-GB': 'Check the team ID or create a new one.',
    'pt-BR': 'Verifique o ID do time ou crie um novo.',
  },
  teamVerificationError: {
    'en-GB': 'Team verification error',
    'pt-BR': 'Erro ao verificar time',
  },
  teamVerificationErrorMessage: {
    'en-GB': 'Could not verify the team ID.',
    'pt-BR': 'Não foi possível verificar o ID do time.',
  },
  teamNotVerified: {
    'en-GB': 'Team not verified',
    'pt-BR': 'Time não verificado',
  },
  teamNotVerifiedMessage: {
    'en-GB': 'Please verify the team ID before continuing.',
    'pt-BR': 'Por favor, verifique o ID do time antes de continuar.',
  },
  errorCreatingAccount: {
    'en-GB': 'Error creating account',
    'pt-BR': 'Erro ao criar conta',
  },
  errorCreatingAccountMessage: {
    'en-GB': 'Check your information and try again.',
    'pt-BR': 'Verifique os dados e tente novamente.',
  },
  loginError: {
    'en-GB': 'Login error',
    'pt-BR': 'Erro ao fazer login',
  },
  loginErrorMessage: {
    'en-GB': 'Check your credentials and try again.',
    'pt-BR': 'Verifique suas credenciais e tente novamente.',
  },
  // Common buttons and actions
  cancel: {
    'en-GB': 'Cancel',
    'pt-BR': 'Cancelar',
  },
  confirm: {
    'en-GB': 'Confirm',
    'pt-BR': 'Confirmar',
  },
  delete: {
    'en-GB': 'Delete',
    'pt-BR': 'Excluir',
  },
  edit: {
    'en-GB': 'Edit',
    'pt-BR': 'Editar',
  },
  add: {
    'en-GB': 'Add',
    'pt-BR': 'Adicionar',
  },
  search: {
    'en-GB': 'Search',
    'pt-BR': 'Buscar',
  },
  filter: {
    'en-GB': 'Filter',
    'pt-BR': 'Filtrar',
  },
  sort: {
    'en-GB': 'Sort',
    'pt-BR': 'Ordenar',
  },
  // Task modal
  newTask: {
    'en-GB': 'New Task',
    'pt-BR': 'Nova Tarefa',
  },
  editTask: {
    'en-GB': 'Edit Task',
    'pt-BR': 'Editar Tarefa',
  },
  title: {
    'en-GB': 'Title',
    'pt-BR': 'Título',
  },
  enterTaskTitle: {
    'en-GB': 'Enter task title',
    'pt-BR': 'Digite o título da tarefa',
  },
  enterTaskDescription: {
    'en-GB': 'Enter task description',
    'pt-BR': 'Digite a descrição da tarefa',
  },
  client: {
    'en-GB': 'Client',
    'pt-BR': 'Cliente',
  },
  selectClient: {
    'en-GB': 'Select client',
    'pt-BR': 'Selecione o cliente',
  },
  status: {
    'en-GB': 'Status',
    'pt-BR': 'Status',
  },
  selectStatus: {
    'en-GB': 'Select status',
    'pt-BR': 'Selecione o status',
  },
  todo: {
    'en-GB': 'To do',
    'pt-BR': 'A fazer',
  },
  doing: {
    'en-GB': 'In progress',
    'pt-BR': 'Em andamento',
  },
  review: {
    'en-GB': 'In review',
    'pt-BR': 'Em revisão',
  },
  done: {
    'en-GB': 'Done',
    'pt-BR': 'Concluído',
  },
  priority: {
    'en-GB': 'Priority',
    'pt-BR': 'Prioridade',
  },
  selectPriority: {
    'en-GB': 'Select priority',
    'pt-BR': 'Selecione a prioridade',
  },
  low: {
    'en-GB': 'Low',
    'pt-BR': 'Baixa',
  },
  medium: {
    'en-GB': 'Medium',
    'pt-BR': 'Média',
  },
  high: {
    'en-GB': 'High',
    'pt-BR': 'Alta',
  },
  urgent: {
    'en-GB': 'Urgent',
    'pt-BR': 'Urgente',
  },
  contentType: {
    'en-GB': 'Content Type',
    'pt-BR': 'Tipo de Conteúdo',
  },
  selectType: {
    'en-GB': 'Select type',
    'pt-BR': 'Selecione o tipo',
  },
  post: {
    'en-GB': 'Post',
    'pt-BR': 'Post',
  },
  story: {
    'en-GB': 'Story',
    'pt-BR': 'Story',
  },
  reels: {
    'en-GB': 'Reels',
    'pt-BR': 'Reels',
  },
  ad: {
    'en-GB': 'Ad',
    'pt-BR': 'Anúncio',
  },
  video: {
    'en-GB': 'Video',
    'pt-BR': 'Vídeo',
  },
  blog: {
    'en-GB': 'Blog',
    'pt-BR': 'Blog',
  },
  link: {
    'en-GB': 'Link',
    'pt-BR': 'Link',
  },
  dueDate: {
    'en-GB': 'Due Date',
    'pt-BR': 'Data de Entrega',
  },
  assignedTo: {
    'en-GB': 'Assigned To',
    'pt-BR': 'Responsável',
  },
  responsibleName: {
    'en-GB': 'Responsible name',
    'pt-BR': 'Nome do responsável',
  },
  team: {
    'en-GB': 'Team',
    'pt-BR': 'Equipe',
  },
  selectTeam: {
    'en-GB': 'Select team',
    'pt-BR': 'Selecione a equipe',
  },
  designTeam: {
    'en-GB': 'Design Team',
    'pt-BR': 'Equipe Design',
  },
  socialTeam: {
    'en-GB': 'Social Team',
    'pt-BR': 'Equipe Social',
  },
  contentTeam: {
    'en-GB': 'Content Team',
    'pt-BR': 'Equipe Conteúdo',
  },
  mediaTeam: {
    'en-GB': 'Media Team',
    'pt-BR': 'Equipe Mídia',
  },
  create: {
    'en-GB': 'Create',
    'pt-BR': 'Criar',
  },
  // Dashboard page
  dashboardOverview: {
    'en-GB': 'Performance overview and recent activities',
    'pt-BR': 'Visão geral de performance e atividades',
  },
  searchPlaceholder: {
    'en-GB': 'Search...',
    'pt-BR': 'Pesquisar...',
  },
  recentActivities: {
    'en-GB': 'Recent activities',
    'pt-BR': 'Atividades recentes',
  },
  completedStatus: {
    'en-GB': 'Completed',
    'pt-BR': 'Concluído',
  },
  commentText: {
    'en-GB': 'Comment',
    'pt-BR': 'Comentário',
  },
  newClientLabel: {
    'en-GB': 'New Client',
    'pt-BR': 'Novo Cliente',
  },
  finished: {
    'en-GB': 'finished',
    'pt-BR': 'finalizou',
  },
  created: {
    'en-GB': 'created',
    'pt-BR': 'criou',
  },
  commented: {
    'en-GB': 'commented on',
    'pt-BR': 'comentou em',
  },
  addedClient: {
    'en-GB': 'added client',
    'pt-BR': 'adicionou cliente',
  },
  metrics: {
    'en-GB': 'Performance Metrics',
    'pt-BR': 'Métricas de Desempenho',
  },
  tasksCompleted: {
    'en-GB': 'Tasks Completed',
    'pt-BR': 'Tarefas Concluídas',
  },
  hoursWorked: {
    'en-GB': 'Hours Worked',
    'pt-BR': 'Horas Trabalhadas',
  },
  clientSatisfaction: {
    'en-GB': 'Client Satisfaction',
    'pt-BR': 'Satisfação do Cliente',
  },
  projectProgress: {
    'en-GB': 'Project Progress',
    'pt-BR': 'Progresso do Projeto',
  },
  loadingData: {
    'en-GB': 'Loading data...',
    'pt-BR': 'Carregando dados...',
  },
  failedToLoad: {
    'en-GB': 'Failed to load dashboard data',
    'pt-BR': 'Falha ao carregar dados do painel',
  },
  
  // Tasks page
  allTasks: {
    'en-GB': 'All Tasks',
    'pt-BR': 'Todas as Tarefas',
  },
  filterBy: {
    'en-GB': 'Filter by',
    'pt-BR': 'Filtrar por',
  },
  sortBy: {
    'en-GB': 'Sort by',
    'pt-BR': 'Ordenar por',
  },
  deadlineAsc: {
    'en-GB': 'Deadline (earliest first)',
    'pt-BR': 'Prazo (mais próximos primeiro)',
  },
  deadlineDesc: {
    'en-GB': 'Deadline (latest first)',
    'pt-BR': 'Prazo (mais distantes primeiro)',
  },
  priorityAsc: {
    'en-GB': 'Priority (low to high)',
    'pt-BR': 'Prioridade (baixa para alta)',
  },
  priorityDesc: {
    'en-GB': 'Priority (high to low)',
    'pt-BR': 'Prioridade (alta para baixa)',
  },
  statusAsc: {
    'en-GB': 'Status (to-do first)',
    'pt-BR': 'Status (a fazer primeiro)',
  },
  statusDesc: {
    'en-GB': 'Status (completed first)',
    'pt-BR': 'Status (concluídas primeiro)',
  },
  addTask: {
    'en-GB': 'Add Task',
    'pt-BR': 'Adicionar Tarefa',
  },
  selectAll: {
    'en-GB': 'Select All',
    'pt-BR': 'Selecionar Todas',
  },
  
  // Calendar page
  weekView: {
    'en-GB': 'Week View',
    'pt-BR': 'Visão Semanal',
  },
  monthView: {
    'en-GB': 'Month View',
    'pt-BR': 'Visão Mensal',
  },
  today: {
    'en-GB': 'Today',
    'pt-BR': 'Hoje',
  },
  addEvent: {
    'en-GB': 'Add Event',
    'pt-BR': 'Adicionar Evento',
  },
  
  // Clients page
  allClients: {
    'en-GB': 'All Clients',
    'pt-BR': 'Todos os Clientes',
  },
  activeSince: {
    'en-GB': 'Active since',
    'pt-BR': 'Ativo desde',
  },
  totalProjects: {
    'en-GB': 'Total Projects',
    'pt-BR': 'Total de Projetos',
  },
  activeProjects: {
    'en-GB': 'Active Projects',
    'pt-BR': 'Projetos Ativos',
  },
  contactInfo: {
    'en-GB': 'Contact Info',
    'pt-BR': 'Informações de Contato',
  },
  phone: {
    'en-GB': 'Phone',
    'pt-BR': 'Telefone',
  },
  website: {
    'en-GB': 'Website',
    'pt-BR': 'Site',
  },
  addClient: {
    'en-GB': 'Add Client',
    'pt-BR': 'Adicionar Cliente',
  },
  clientName: {
    'en-GB': 'Name',
    'pt-BR': 'Nome',
  },
  
  // Projects page
  allProjects: {
    'en-GB': 'All Projects',
    'pt-BR': 'Todos os Projetos',
  },
  active: {
    'en-GB': 'Active',
    'pt-BR': 'Ativo',
  },
  pending: {
    'en-GB': 'Pending',
    'pt-BR': 'Pendente',
  },
  completedProject: {
    'en-GB': 'Completed',
    'pt-BR': 'Concluído',
  },
  cancelled: {
    'en-GB': 'Cancelled',
    'pt-BR': 'Cancelado',
  },
  progress: {
    'en-GB': 'Progress',
    'pt-BR': 'Progresso',
  },
  addProject: {
    'en-GB': 'Add Project',
    'pt-BR': 'Adicionar Projeto',
  },
  
  // Prospecting page
  prospectingOverview: {
    'en-GB': 'Prospecting Overview',
    'pt-BR': 'Visão Geral de Prospecção',
  },
  leadsGenerated: {
    'en-GB': 'Leads Generated',
    'pt-BR': 'Leads Gerados',
  },
  conversionRate: {
    'en-GB': 'Conversion Rate',
    'pt-BR': 'Taxa de Conversão',
  },
  outreachCampaigns: {
    'en-GB': 'Outreach Campaigns',
    'pt-BR': 'Campanhas de Alcance',
  },
  coldCalls: {
    'en-GB': 'Cold Calls',
    'pt-BR': 'Ligações Frias',
  },
  contactForms: {
    'en-GB': 'Contact Forms',
    'pt-BR': 'Formulários de Contato',
  },
  documents: {
    'en-GB': 'Documents',
    'pt-BR': 'Documentos',
  },
  roiCalculator: {
    'en-GB': 'ROI Calculator',
    'pt-BR': 'Calculadora de ROI',
  },
  prospectingTemplates: {
    'en-GB': 'Prospecting Templates',
    'pt-BR': 'Modelos de Prospecção',
  },
  
  // Leads page
  leadsOverview: {
    'en-GB': 'Leads Overview',
    'pt-BR': 'Visão Geral de Leads',
  },
  qualified: {
    'en-GB': 'Qualified',
    'pt-BR': 'Qualificado',
  },
  unqualified: {
    'en-GB': 'Unqualified',
    'pt-BR': 'Não Qualificado',
  },
  inProgressStatus: {
    'en-GB': 'In Progress',
    'pt-BR': 'Em Progresso',
  },
  leadSource: {
    'en-GB': 'Lead Source',
    'pt-BR': 'Origem do Lead',
  },
  potentialValue: {
    'en-GB': 'Potential Value',
    'pt-BR': 'Valor Potencial',
  },
  lastContact: {
    'en-GB': 'Last Contact',
    'pt-BR': 'Último Contato',
  },
  
  // Chat page
  chatWithTeam: {
    'en-GB': 'Chat with Team',
    'pt-BR': 'Chat com Equipe',
  },
  recentChats: {
    'en-GB': 'Recent Chats',
    'pt-BR': 'Conversas Recentes',
  },
  typeMessage: {
    'en-GB': 'Type a message...',
    'pt-BR': 'Digite uma mensagem...',
  },
  send: {
    'en-GB': 'Send',
    'pt-BR': 'Enviar',
  },
  onlineNow: {
    'en-GB': 'Online now',
    'pt-BR': 'Online agora',
  },
  offline: {
    'en-GB': 'Offline',
    'pt-BR': 'Offline',
  },
  newMessage: {
    'en-GB': 'New message',
    'pt-BR': 'Nova mensagem',
  },
  // Dashboard
  performanceOverview: {
    'en-GB': 'Performance Overview',
    'pt-BR': 'Visão Geral de Performance',
  },
  currentPerformanceStats: {
    'en-GB': 'Current performance statistics',
    'pt-BR': 'Estatísticas de performance atual',
  },
  tasksTotal: {
    'en-GB': 'Total Tasks',
    'pt-BR': 'Total de Tarefas',
  },
  completedTasks: {
    'en-GB': 'Completed Tasks',
    'pt-BR': 'Tarefas Concluídas',
  },
  inProgressTasks: {
    'en-GB': 'In Progress Tasks',
    'pt-BR': 'Tarefas em Andamento',
  },
  pendingTasks: {
    'en-GB': 'Pending Tasks',
    'pt-BR': 'Tarefas Pendentes',
  },
  clientsTotal: {
    'en-GB': 'Total Clients',
    'pt-BR': 'Total de Clientes',
  },
  fromLastWeek: {
    'en-GB': 'from last week',
    'pt-BR': 'da semana passada',
  },
  weeklyProgress: {
    'en-GB': 'Weekly Progress',
    'pt-BR': 'Progresso Semanal',
  },
  clientsActivity: {
    'en-GB': 'Clients Activity',
    'pt-BR': 'Atividade dos Clientes',
  },
  tasksByStatus: {
    'en-GB': 'Tasks by Status',
    'pt-BR': 'Tarefas por Status',
  },
  completionRate: {
    'en-GB': 'Completion Rate',
    'pt-BR': 'Taxa de Conclusão',
  },
  total: {
    'en-GB': 'Total',
    'pt-BR': 'Total',
  },
  noDataAvailable: {
    'en-GB': 'No data available',
    'pt-BR': 'Nenhum dado disponível',
  },

  // Clients
  manageYourClients: {
    'en-GB': 'Manage your clients and their settings',
    'pt-BR': 'Gerencie seus clientes e suas configurações',
  },
  newClient: {
    'en-GB': 'New Client',
    'pt-BR': 'Novo Cliente',
  },
  gridView: {
    'en-GB': 'Grid View',
    'pt-BR': 'Visualização em Grade',
  },
  listView: {
    'en-GB': 'List View',
    'pt-BR': 'Visualização em Lista',
  },
  clientsFound: {
    'en-GB': 'clients found',
    'pt-BR': 'clientes encontrados',
  },
  inactive: {
    'en-GB': 'Inactive',
    'pt-BR': 'Inativo',
  },
  editClient: {
    'en-GB': 'Edit Client',
    'pt-BR': 'Editar Cliente',
  },
  company: {
    'en-GB': 'Company',
    'pt-BR': 'Empresa',
  },
  postsPerWeek: {
    'en-GB': 'Posts per Week',
    'pt-BR': 'Posts por Semana',
  },
  tags: {
    'en-GB': 'Tags',
    'pt-BR': 'Tags',
  },
  addTag: {
    'en-GB': 'Add tag',
    'pt-BR': 'Adicionar tag',
  },
  // Tasks form/modal
  taskName: {
    'en-GB': 'Task name',
    'pt-BR': 'Nome da tarefa',
  },
  taskDescription: {
    'en-GB': 'Description',
    'pt-BR': 'Descrição',
  },
  taskStatus: {
    'en-GB': 'Status',
    'pt-BR': 'Status',
  },
};

// Interface for the context
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>(() => {
    const savedLanguage = localStorage.getItem('app-language');
    return (savedLanguage as LanguageType) || 'pt-BR';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 