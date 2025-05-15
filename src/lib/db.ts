import { Task, TaskStatus, TaskPriority, ContentType } from './data';
import { initialClients } from './data';

// Interface para o banco de dados
interface Database {
  tasks: Task[];
  events: CalendarEvent[];
  clients: Client[];
}

// Interface para eventos do calendário
export interface CalendarEvent {
  id: number;
  title: string;
  clientId: number;
  date: Date;
  time: string;
  status: 'scheduled' | 'draft' | 'pending';
  contentType: ContentType;
  image?: string;
  description?: string;
}

// Client interface
export interface Client {
  id: number;
  name: string;
  logo: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  postsPerWeek: number;
  tags: string[];
}

// Initialize empty database if it doesn't exist
const initializeDB = () => {
  const existingDB = localStorage.getItem('db');
  if (!existingDB) {
    const initialDB: Database = {
      tasks: [],
      events: [],
      clients: initialClients // Initialize with initial clients
    };
    localStorage.setItem('db', JSON.stringify(initialDB));
  }
};

// Obtém o banco de dados
const getDB = (): Database => {
  initializeDB();
  return JSON.parse(localStorage.getItem('vibrant_verse_db') || '{"tasks": [], "events": [], "clients": []}');
};

// Salva o banco de dados
const saveDB = (db: Database): void => {
  localStorage.setItem('vibrant_verse_db', JSON.stringify(db));
};

// Operações do banco de dados
export const db = {
  // Operações de tarefas
  getTasks: (): Task[] => {
    const db = getDB();
    return db.tasks;
  },

  // Adiciona uma nova tarefa
  addTask: (task: Omit<Task, 'id'>): Task => {
    const db = getDB();
    const newTask = {
      ...task,
      id: Math.max(0, ...db.tasks.map(t => t.id)) + 1,
      comments: []
    };
    db.tasks.push(newTask);
    saveDB(db);
    return newTask;
  },

  // Atualiza uma tarefa existente
  updateTask: (taskId: number, updates: Partial<Task>): Task | null => {
    const db = getDB();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const updatedTask = {
      ...db.tasks[taskIndex],
      ...updates
    };
    db.tasks[taskIndex] = updatedTask;
    saveDB(db);
    return updatedTask;
  },

  // Remove uma tarefa
  deleteTask: (taskId: number): boolean => {
    const db = getDB();
    const initialLength = db.tasks.length;
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    saveDB(db);
    return db.tasks.length < initialLength;
  },

  // Atualiza o status de uma tarefa
  updateTaskStatus: (taskId: number, newStatus: TaskStatus): Task | null => {
    return db.updateTask(taskId, { status: newStatus });
  },

  // Operações de eventos do calendário
  getEvents: (): CalendarEvent[] => {
    const db = getDB();
    return db.events;
  },

  addEvent: (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const db = getDB();
    const newEvent = {
      ...event,
      id: Math.max(0, ...db.events.map(e => e.id)) + 1
    };
    db.events.push(newEvent);
    saveDB(db);
    return newEvent;
  },

  updateEvent: (eventId: number, updates: Partial<CalendarEvent>): CalendarEvent | null => {
    const db = getDB();
    const eventIndex = db.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return null;

    const updatedEvent = {
      ...db.events[eventIndex],
      ...updates
    };
    db.events[eventIndex] = updatedEvent;
    saveDB(db);
    return updatedEvent;
  },

  deleteEvent: (eventId: number): boolean => {
    const db = getDB();
    const initialLength = db.events.length;
    db.events = db.events.filter(e => e.id !== eventId);
    saveDB(db);
    return db.events.length < initialLength;
  },

  // Client operations
  getClients: (): Client[] => {
    const db = getDB();
    return db.clients;
  },

  addClient: (clientData: Omit<Client, 'id'>): Client => {
    const db = getDB();
    const newClient: Client = {
      ...clientData,
      id: db.clients.length > 0 ? Math.max(...db.clients.map(c => c.id)) + 1 : 1
    };
    db.clients.push(newClient);
    saveDB(db);
    return newClient;
  },

  updateClient: (clientData: Client): Client => {
    const db = getDB();
    const index = db.clients.findIndex(c => c.id === clientData.id);
    if (index === -1) throw new Error('Client not found');
    db.clients[index] = clientData;
    saveDB(db);
    return clientData;
  },

  deleteClient: (clientId: number): void => {
    const db = getDB();
    db.clients = db.clients.filter(c => c.id !== clientId);
    saveDB(db);
  }
}; 