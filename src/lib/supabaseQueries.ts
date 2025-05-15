import { supabase } from './supabase'
import { TaskStatus, TaskPriority, ContentType } from './data'

// Adicionando definição de interface para Lead
interface Lead {
  id: string;
  nome: string;
  empresa: string;
  fonte: string;
  status: string;
  temperatura: string;
  dataEntrada: string;
}

export async function fetchDashboardStats() {
  try {
    // Fetch leads data for dashboard
    const leadsData = await fetchLeadsStats();
    
    // Fetch total tasks
    const { data: totalTasks, error: totalError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
    
    // Fetch completed tasks
    const { data: completedTasks, error: completedError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('status', 'done')
    
    // Fetch in progress tasks
    const { data: inProgressTasks, error: inProgressError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .in('status', ['doing', 'review'])
    
    // Fetch active clients
    const { data: activeClients, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('active', true)
    
    // Fetch tasks by type
    const { data: tasksByType, error: typeError } = await supabase
      .rpc('get_tasks_by_type')
    
    // Fetch recent activity
    const { data: recentActivity, error: activityError } = await supabase
      .from('activity')
      .select(`
        *,
        users (name),
        tasks (title)
      `)
      .order('timestamp', { ascending: false })
      .limit(4)
    
    // Fetch top performers
    const { data: topPerformers, error: performersError } = await supabase
      .from('users')
      .select(`
        name,
        tasks:tasks_count,
        completion:completion_rate
      `)
      .order('tasks_count', { ascending: false })
      .limit(3)

    if (totalError || completedError || inProgressError || clientsError || typeError || activityError || performersError) {
      throw new Error('Error fetching dashboard data')
    }

    const completionRate = completedTasks && totalTasks 
      ? Math.round((completedTasks.length / totalTasks.length) * 100) 
      : 0

    // If we have real data from Supabase, use it, otherwise use local data
    const dashboardData = {
      // Leads data from our real application
      ...leadsData,
      
      // Other stats that may come from Supabase if connected
      totalTasks: totalTasks?.length || 0,
      completedTasks: completedTasks?.length || 0,
      inProgressTasks: inProgressTasks?.length || 0,
      clientsActive: activeClients?.length || 0,
      completionRate,
      tasksByType: tasksByType?.map(type => ({
        type: type.content_type,
        count: parseInt(type.count),
        color: getContentTypeColor(type.content_type)
      })) || [],
      recentActivity: recentActivity?.map(activity => ({
        action: activity.action,
        task: activity.tasks?.title || activity.task,
        user: activity.users?.name || '',
        timestamp: new Date(activity.timestamp)
      })) || [],
      topPerformers: topPerformers?.map(performer => ({
        name: performer.name,
        tasks: performer.tasks || 0,
        completion: Math.round(performer.completion || 0)
      })) || []
    }

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Fetch real lead stats from our application
export async function fetchLeadsStats() {
  try {
    // Get leads from localStorage since we're not using a real database yet
    const leadsJson = localStorage.getItem('leads');
    const leads = leadsJson ? JSON.parse(leadsJson) as Lead[] : [];
    
    // If leads are not found in localStorage, try to use the current state from Leads component
    if (!leads || leads.length === 0) {
      // Fallback to default lead data
      return {
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        leadsConversionRate: 0,
        leadsByStatus: [],
        leadsBySource: [],
        leadsByTemperature: [],
        leadsTrend: 5,
        qualifiedLeadsTrend: 8,
        convertedLeadsTrend: 3
      };
    }
    
    // Calculate lead statistics
    const totalLeads = leads.length;
    const newLeads = leads.filter((lead: Lead) => lead.status === 'Novo').length;
    const qualifiedLeads = leads.filter((lead: Lead) => 
      lead.status === 'Em Qualificação' || lead.status === 'Qualificado').length;
    const convertedLeads = leads.filter((lead: Lead) => lead.status === 'Ganhou').length;
    const leadsConversionRate = totalLeads > 0 
      ? Math.round((convertedLeads / totalLeads) * 100) 
      : 0;
    
    // Group leads by status
    const leadsByStatus = [
      { name: 'Novo', value: leads.filter((lead: Lead) => lead.status === 'Novo').length },
      { name: 'Em Qualificação', value: leads.filter((lead: Lead) => lead.status === 'Em Qualificação').length },
      { name: 'Qualificado', value: leads.filter((lead: Lead) => lead.status === 'Qualificado').length },
      { name: 'Em Proposta', value: leads.filter((lead: Lead) => lead.status === 'Em Proposta').length },
      { name: 'Ganhou', value: leads.filter((lead: Lead) => lead.status === 'Ganhou').length },
      { name: 'Perdeu', value: leads.filter((lead: Lead) => lead.status === 'Perdeu').length }
    ];
    
    // Group leads by source (fonte)
    const sources = [...new Set(leads.map((lead: Lead) => lead.fonte))].filter(Boolean);
    const leadsBySource = sources.map((source: string) => ({
      name: source,
      value: leads.filter((lead: Lead) => lead.fonte === source).length
    }));
    
    // Group leads by temperature
    const leadsByTemperature = [
      { name: 'Frio', value: leads.filter((lead: Lead) => lead.temperatura === 'Frio').length },
      { name: 'Morno', value: leads.filter((lead: Lead) => lead.temperatura === 'Morno').length },
      { name: 'Quente', value: leads.filter((lead: Lead) => lead.temperatura === 'Quente').length }
    ];
    
    // Hardcoded trends (would ideally be calculated from historical data)
    // In a real application this would be calculated by comparing current metrics with previous periods
    const leadsTrend = 5; // % increase from last week
    const qualifiedLeadsTrend = 8; // % increase from last week
    const convertedLeadsTrend = 3; // % increase from last week
    
    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      leadsConversionRate,
      leadsByStatus,
      leadsBySource,
      leadsByTemperature,
      leadsTrend,
      qualifiedLeadsTrend,
      convertedLeadsTrend
    };
  } catch (error) {
    console.error('Error fetching leads stats:', error);
    return {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0,
      leadsConversionRate: 0,
      leadsByStatus: [],
      leadsBySource: [],
      leadsByTemperature: [],
      leadsTrend: 0,
      qualifiedLeadsTrend: 0,
      convertedLeadsTrend: 0
    };
  }
}

function getContentTypeColor(type: ContentType): string {
  const colors = {
    post: '#4CAF50',
    story: '#2196F3',
    video: '#9C27B0',
    ad: '#FF9800',
    reels: '#E91E63',
    blog: '#673AB7',
    link: '#00BCD4'
  }
  return colors[type] || '#9E9E9E'
}

export async function fetchWeeklyPerformance() {
  try {
    // Get leads from localStorage
    const leadsJson = localStorage.getItem('leads');
    const leads = leadsJson ? JSON.parse(leadsJson) as Lead[] : [];
    
    // If no leads data, return sample data
    if (!leads || leads.length === 0) {
      // Sample weekly performance data
      return [
        { day: 'Mon', tasks: 10, completed: 4, inProgress: 3, clients: 2 },
        { day: 'Tue', tasks: 12, completed: 6, inProgress: 4, clients: 3 },
        { day: 'Wed', tasks: 15, completed: 7, inProgress: 5, clients: 3 },
        { day: 'Thu', tasks: 11, completed: 5, inProgress: 4, clients: 2 },
        { day: 'Fri', tasks: 14, completed: 8, inProgress: 3, clients: 4 },
        { day: 'Sat', tasks: 8, completed: 3, inProgress: 2, clients: 1 },
        { day: 'Sun', tasks: 6, completed: 2, inProgress: 1, clients: 1 },
      ];
    }
    
    // Generate weekly data based on lead entry dates
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Set to start of week (Sunday)
    
    // Create array with one entry per day of the week
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      // Count leads entered on this day of the week
      const dateString = date.toISOString().split('T')[0];
      const dayLeads = leads.filter((lead: Lead) => lead.dataEntrada === dateString);
      const convertedLeads = dayLeads.filter((lead: Lead) => lead.status === 'Ganhou');
      const inProgressLeads = dayLeads.filter((lead: Lead) => 
        lead.status === 'Em Qualificação' || lead.status === 'Qualificado' || lead.status === 'Em Proposta'
      );
      
      // Count unique companies for this day
      const uniqueCompanies = new Set(dayLeads.map((lead: Lead) => lead.empresa)).size;
      
      return {
        day: days[date.getDay()],
        tasks: dayLeads.length,
        completed: convertedLeads.length,
        inProgress: inProgressLeads.length,
        clients: uniqueCompanies
      };
    });
    
    return weeklyData;
  } catch (error) {
    console.error('Error generating weekly performance data:', error);
    
    // Return sample data if there's an error
    return [
      { day: 'Mon', tasks: 10, completed: 4, inProgress: 3, clients: 2 },
      { day: 'Tue', tasks: 12, completed: 6, inProgress: 4, clients: 3 },
      { day: 'Wed', tasks: 15, completed: 7, inProgress: 5, clients: 3 },
      { day: 'Thu', tasks: 11, completed: 5, inProgress: 4, clients: 2 },
      { day: 'Fri', tasks: 14, completed: 8, inProgress: 3, clients: 4 },
      { day: 'Sat', tasks: 8, completed: 3, inProgress: 2, clients: 1 },
      { day: 'Sun', tasks: 6, completed: 2, inProgress: 1, clients: 1 },
    ];
  }
}

/**
 * Busca a lista de clientes
 */
export async function fetchClients() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample clients data
  return [
    {
      id: 1,
      name: 'Acme Corporation',
      company: 'Technology',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      projectsCount: 8,
      status: 'active',
      tasksCompleted: 24,
      tasksPending: 4,
      primaryColor: '#4CAF50',
      secondaryColor: '#81C784',
      tags: ['tech', 'software', 'ai']
    },
    {
      id: 2,
      name: 'Globex Industries',
      company: 'Manufacturing',
      email: 'info@globex.com',
      phone: '+1 (555) 234-5678',
      projectsCount: 5,
      status: 'active',
      tasksCompleted: 17,
      tasksPending: 2,
      primaryColor: '#2196F3',
      secondaryColor: '#64B5F6',
      tags: ['manufacturing', 'industry']
    },
    {
      id: 3,
      name: 'Soylent Corp',
      company: 'Food & Beverage',
      email: 'contact@soylent.com',
      phone: '+1 (555) 345-6789',
      projectsCount: 3,
      status: 'pending',
      tasksCompleted: 11,
      tasksPending: 5,
      primaryColor: '#FF9800',
      secondaryColor: '#FFB74D',
      tags: ['food', 'beverage']
    },
    {
      id: 4,
      name: 'Initech LLC',
      company: 'Software',
      email: 'support@initech.com',
      phone: '+1 (555) 456-7890',
      projectsCount: 7,
      status: 'active',
      tasksCompleted: 19,
      tasksPending: 3,
      primaryColor: '#9C27B0',
      secondaryColor: '#BA68C8',
      tags: ['software', 'tech']
    },
    {
      id: 5,
      name: 'Umbrella Corp',
      company: 'Pharmaceuticals',
      email: 'info@umbrella.com',
      phone: '+1 (555) 567-8901',
      projectsCount: 4,
      status: 'inactive',
      tasksCompleted: 9,
      tasksPending: 0,
      primaryColor: '#F44336',
      secondaryColor: '#E57373',
      tags: ['pharma', 'healthcare']
    },
    {
      id: 6,
      name: 'Stark Industries',
      company: 'Defense',
      email: 'contact@stark.com',
      phone: '+1 (555) 678-9012',
      projectsCount: 12,
      status: 'active',
      tasksCompleted: 35,
      tasksPending: 7,
      primaryColor: '#E91E63',
      secondaryColor: '#F06292',
      tags: ['defense', 'tech', 'innovation']
    }
  ];
} 