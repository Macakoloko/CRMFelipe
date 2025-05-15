import { 
  Users, 
  UserPlus, 
  FileText, 
  Camera, 
  Video, 
  Megaphone, 
  Tag,
  Link2
} from 'lucide-react';

// Task interface
export interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  status: TaskStatus;
  priority: TaskPriority;
  contentType: ContentType;
  dueDate: Date;
  assignedTo: string;
  comments: Array<{ user: string; message: string; timestamp: Date }>;
  tagIds: number[];
}

// Initial client data
export const initialClients = [
  {
    id: 1,
    name: 'Eco Solutions',
    logo: '/placeholder.svg',
    industry: 'Sustentabilidade',
    primaryColor: '#4CAF50',
    secondaryColor: '#81C784',
    postsPerWeek: 3,
    tags: ['Verde', 'Ecológico', 'Inovação']
  },
  {
    id: 2,
    name: 'Tech Innovate',
    logo: '/placeholder.svg',
    industry: 'Tecnologia',
    primaryColor: '#2196F3',
    secondaryColor: '#64B5F6',
    postsPerWeek: 5,
    tags: ['Tech', 'Digital', 'Futuro']
  },
  {
    id: 3,
    name: 'Beauty Spot',
    logo: '/placeholder.svg',
    industry: 'Beleza',
    primaryColor: '#E91E63',
    secondaryColor: '#F48FB1',
    postsPerWeek: 4,
    tags: ['Beleza', 'Cuidados', 'Estilo']
  },
  {
    id: 4,
    name: 'Fit Life',
    logo: '/placeholder.svg',
    industry: 'Fitness',
    primaryColor: '#FF9800',
    secondaryColor: '#FFB74D',
    postsPerWeek: 6,
    tags: ['Fitness', 'Saúde', 'Bem-estar']
  }
];

// Task status
export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';

// Task priority
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Content types
export type ContentType = 'post' | 'story' | 'reels' | 'ad' | 'video' | 'blog' | 'link';

// Tags
export const tags = [
  { id: 1, name: 'Urgente', color: '#FF5252' },
  { id: 2, name: 'Revisão', color: '#FFAB40' },
  { id: 3, name: 'Aprovado', color: '#66BB6A' },
  { id: 4, name: 'Em espera', color: '#42A5F5' },
  { id: 5, name: 'Feedback', color: '#BA68C8' },
  { id: 6, name: 'Equipe Design', color: '#EC407A' },
  { id: 7, name: 'Equipe Social', color: '#7E57C2' },
  { id: 8, name: 'Equipe Conteúdo', color: '#26A69A' },
  { id: 9, name: 'Equipe Mídia', color: '#FF7043' }
];

// Tasks
export const tasks = [
  {
    id: 1,
    title: 'Postagem sobre sustentabilidade',
    description: 'Criar post sobre práticas sustentáveis para empresas',
    clientId: 1,
    status: 'doing' as TaskStatus,
    priority: 'medium' as TaskPriority,
    contentType: 'post' as ContentType,
    dueDate: new Date(Date.now() + 86400000 * 2),
    assignedTo: 'Ana Silva',
    comments: [
      { user: 'Carlos', message: 'Podemos focar em economia de água?', timestamp: new Date() },
      { user: 'Ana', message: 'Boa ideia, vou incluir isso!', timestamp: new Date() }
    ],
    tagIds: [4, 5]
  },
  {
    id: 2,
    title: 'Vídeo explicativo sobre app',
    description: 'Produzir vídeo curto explicando as funcionalidades do novo aplicativo',
    clientId: 2,
    status: 'todo' as TaskStatus,
    priority: 'high' as TaskPriority,
    contentType: 'video' as ContentType,
    dueDate: new Date(Date.now() + 86400000 * 4),
    assignedTo: 'Pedro Santos',
    comments: [],
    tagIds: [1]
  },
  {
    id: 3,
    title: 'Carrossel de produtos novos',
    description: 'Criar carrossel com os novos produtos da linha verão',
    clientId: 3,
    status: 'review' as TaskStatus,
    priority: 'medium' as TaskPriority,
    contentType: 'post' as ContentType,
    dueDate: new Date(Date.now() + 86400000 * 1),
    assignedTo: 'Mariana Oliveira',
    comments: [
      { user: 'Cliente', message: 'Adorei! Pode incluir mais o protetor solar?', timestamp: new Date() }
    ],
    tagIds: [2]
  },
  {
    id: 4,
    title: 'Campanha de desconto de verão',
    description: 'Criar artes para campanha de desconto da temporada',
    clientId: 4,
    status: 'done' as TaskStatus,
    priority: 'urgent' as TaskPriority,
    contentType: 'ad' as ContentType,
    dueDate: new Date(Date.now() - 86400000 * 1),
    assignedTo: 'Bruno Costa',
    comments: [
      { user: 'Gerente', message: 'Aprovado! Vamos veicular amanhã.', timestamp: new Date() }
    ],
    tagIds: [3]
  },
  {
    id: 5,
    title: 'Story sobre treinamento funcional',
    description: 'Criar stories explicando os benefícios do treinamento funcional',
    clientId: 4,
    status: 'todo' as TaskStatus,
    priority: 'low' as TaskPriority,
    contentType: 'story' as ContentType,
    dueDate: new Date(Date.now() + 86400000 * 5),
    assignedTo: 'Camila Rocha',
    comments: [],
    tagIds: []
  },
  {
    id: 6,
    title: 'Blog post sobre tendências tech',
    description: 'Escrever artigo sobre as tendências de tecnologia para 2024',
    clientId: 2,
    status: 'doing' as TaskStatus,
    priority: 'medium' as TaskPriority,
    contentType: 'blog' as ContentType,
    dueDate: new Date(Date.now() + 86400000 * 3),
    assignedTo: 'Rafael Mendes',
    comments: [
      { user: 'Editor', message: 'Podemos incluir IA como tópico principal?', timestamp: new Date() }
    ],
    tagIds: [5]
  },
];

// Dashboard stats
export const dashboardStats = {
  totalTasks: 24,
  completedTasks: 15,
  inProgressTasks: 6,
  pendingTasks: 3,
  tasksThisWeek: 8,
  completionRate: 62.5,
  clientsActive: 4,
  topPerformers: [
    { name: 'Ana Silva', tasks: 7, completion: 95 },
    { name: 'Pedro Santos', tasks: 5, completion: 90 },
    { name: 'Mariana Oliveira', tasks: 6, completion: 85 }
  ],
  tasksByType: [
    { type: 'post', Icon: FileText, count: 12, color: '#4CAF50' },
    { type: 'story', Icon: Camera, count: 5, color: '#2196F3' },
    { type: 'video', Icon: Video, count: 3, color: '#9C27B0' },
    { type: 'ad', Icon: Megaphone, count: 4, color: '#FF9800' }
  ],
  recentActivity: [
    { action: 'task_completed', task: 'Campanha de desconto de verão', user: 'Bruno Costa', timestamp: new Date(Date.now() - 3600000 * 2) },
    { action: 'comment_added', task: 'Postagem sobre sustentabilidade', user: 'Ana Silva', timestamp: new Date(Date.now() - 3600000 * 5) },
    { action: 'task_created', task: 'Blog post sobre tendências tech', user: 'Rafael Mendes', timestamp: new Date(Date.now() - 3600000 * 8) },
    { action: 'client_added', task: 'Beauty Spot', user: 'Coordenador', timestamp: new Date(Date.now() - 3600000 * 24) }
  ]
};

// Calendar events
export const calendarEvents = [
  {
    id: 1,
    title: 'Post Eco Solutions',
    clientId: 1,
    date: new Date(Date.now() + 86400000 * 1),
    time: '10:00',
    status: 'scheduled',
    contentType: 'post' as ContentType,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Story Tech Innovate',
    clientId: 2,
    date: new Date(Date.now() + 86400000 * 1),
    time: '15:00',
    status: 'draft',
    contentType: 'story' as ContentType,
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Reels Beauty Spot',
    clientId: 3,
    date: new Date(Date.now() + 86400000 * 2),
    time: '12:30',
    status: 'scheduled',
    contentType: 'reels' as ContentType,
    image: '/placeholder.svg'
  },
  {
    id: 4,
    title: 'Post Fit Life',
    clientId: 4,
    date: new Date(Date.now() + 86400000 * 3),
    time: '09:00',
    status: 'pending',
    contentType: 'post' as ContentType,
    image: '/placeholder.svg'
  },
];

// Performance metrics by week
export const weeklyPerformance = [
  { week: 'Semana 1', tasks: 12, completed: 10 },
  { week: 'Semana 2', tasks: 15, completed: 13 },
  { week: 'Semana 3', tasks: 10, completed: 8 },
  { week: 'Semana 4', tasks: 18, completed: 15 }
];

// Adding users array for chat functionality
export const users = [
  { 
    id: 1, 
    name: "Carlos Mendes", 
    email: "carlos@example.com",
    avatar: "https://ui.shadcn.com/avatars/04.png",
    role: "Designer"
  },
  { 
    id: 2, 
    name: "João Silva", 
    email: "joao@example.com",
    avatar: "https://ui.shadcn.com/avatars/01.png",
    role: "Developer"
  },
  { 
    id: 3, 
    name: "Ana Oliveira", 
    email: "ana@example.com",
    avatar: "https://ui.shadcn.com/avatars/03.png",
    role: "Marketing"
  },
  { 
    id: 4, 
    name: "Mariana Costa", 
    email: "mariana@example.com",
    avatar: "https://ui.shadcn.com/avatars/02.png",
    role: "Content Manager"
  }
];

export const getClientById = (id: number) => {
  return initialClients.find(client => client.id === id);
};

export const getTasksByClient = (clientId: number) => {
  return tasks.filter(task => task.clientId === clientId);
};

export const getTagById = (id: number) => {
  return tags.find(tag => tag.id === id);
};

export const getTasksByStatus = (status: TaskStatus) => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByPriority = (priority: TaskPriority) => {
  return tasks.filter(task => task.priority === priority);
};

export const getEventsByDate = (date: Date) => {
  return calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-500/20 text-blue-200';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-200';
    case 'high':
      return 'bg-orange-500/20 text-orange-200';
    case 'urgent':
      return 'bg-red-500/20 text-red-200';
    default:
      return 'bg-gray-500/20 text-gray-200';
  }
};

export const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'post':
      return FileText;
    case 'story':
      return Camera;
    case 'reels':
    case 'video':
      return Video;
    case 'ad':
      return Megaphone;
    case 'link':
      return Link2;
    default:
      return Tag;
  }
};

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'bg-muted text-muted-foreground';
    case 'doing':
      return 'bg-blue-500/20 text-blue-200';
    case 'review':
      return 'bg-yellow-500/20 text-yellow-200';
    case 'done':
      return 'bg-green-500/20 text-green-200';
    default:
      return 'bg-gray-500/20 text-gray-200';
  }
};
