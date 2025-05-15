import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
  AreaChart, Area, PieChart, Pie, Cell, TooltipProps
} from 'recharts';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  clientsActive: number;
  completionRate: number;
  
  // Tendências em porcentagem
  tasksTrend?: number;
  completedTrend?: number;
  inProgressTrend?: number;
  clientsTrend?: number;

  // Dados reais de leads
  totalLeads?: number;
  newLeads?: number;
  qualifiedLeads?: number;
  convertedLeads?: number;
  leadsConversionRate?: number;
  leadsByStatus?: Array<{name: string; value: number}>;
  leadsBySource?: Array<{name: string; value: number}>;
  leadsByTemperature?: Array<{name: string; value: number}>;
  leadsTrend?: number;
  qualifiedLeadsTrend?: number;
  convertedLeadsTrend?: number;
}

interface WeeklyData {
  day: string;
  tasks: number;
  completed: number;
  inProgress: number;
  clients: number;
}

interface PerformanceMetricsProps {
  stats: DashboardStats;
  weeklyData: WeeklyData[];
}

export default function PerformanceMetrics({ stats, weeklyData }: PerformanceMetricsProps) {
  const { t } = useLanguage();
  
  if (!stats || !weeklyData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {t('noDataAvailable')}
      </div>
    );
  }

  // Define colors for status chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF5252'];

  // Calculate percentage for radial progress (prefer leads conversion if available)
  const completionPercentage = stats.leadsConversionRate || stats.completionRate || 0;
  const radius = 40;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;
  
  // Summary cards data - using real leads data if available
  const summaryCards = [
    { 
      title: t('totalLeads') || 'Total de Leads', 
      value: stats.totalLeads || 0,
      trend: stats.leadsTrend || 0,
      trendLabel: `${stats.leadsTrend || 0}% ${t('fromLastWeek')}`,
      chartData: weeklyData.map((d) => ({ value: d.tasks })),
      color: 'rgba(124, 58, 237, 0.8)' // purple
    },
    { 
      title: t('convertedLeads') || 'Leads Convertidos', 
      value: stats.convertedLeads || 0,
      trend: stats.convertedLeadsTrend || 0,
      trendLabel: `${stats.convertedLeadsTrend || 0}% ${t('fromLastWeek')}`,
      chartData: weeklyData.map((d) => ({ value: d.completed })),
      color: 'rgba(16, 185, 129, 0.8)' // green
    },
    { 
      title: t('qualifiedLeads') || 'Leads Qualificados', 
      value: stats.qualifiedLeads || 0,
      trend: stats.qualifiedLeadsTrend || 0,
      trendLabel: `${stats.qualifiedLeadsTrend || 0}% ${t('fromLastWeek')}`,
      chartData: weeklyData.map((d) => ({ value: d.inProgress })),
      color: 'rgba(245, 158, 11, 0.8)' // amber
    },
    { 
      title: t('clientsTotal'), 
      value: stats.clientsActive,
      trend: stats.clientsTrend || 0,
      trendLabel: `${stats.clientsTrend || 0}% ${t('fromLastWeek')}`,
      chartData: weeklyData.map((d) => ({ value: d.clients })),
      color: 'rgba(59, 130, 246, 0.8)' // blue
    }
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass text-xs px-3 py-2 rounded-md">
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="glass-dark p-6 rounded-xl col-span-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">{t('performanceOverview')}</h3>
            <p className="text-muted-foreground mt-1">{t('currentPerformanceStats')}</p>
          </div>
          
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                className="stroke-muted"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                className="stroke-primary"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold">{completionPercentage}%</span>
                <span className="block text-xs text-muted-foreground">
                  {stats.leadsConversionRate ? t('leadsConversionRate') || 'Taxa de Conversão' : t('completionRate')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <div key={index} className="glass p-4 rounded-lg">
              <div className="flex flex-col h-full">
                <div className="mb-2">
                  <h4 className="text-muted-foreground text-sm font-medium">{card.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{card.value}</p>
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${card.trend >= 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                      {card.trend >= 0 ? '↑' : '↓'} {card.trendLabel}
                    </div>
                  </div>
                </div>
                
                <div className="h-16 mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={card.chartData}>
                      <defs>
                        <linearGradient id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={card.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={card.color} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={card.color} 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#colorGradient${index})`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-dark p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">{t('weeklyProgress') || 'Progresso Semanal'}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completed" name={t('convertedLeads') || 'Leads Convertidos'} stackId="a" fill="rgba(16, 185, 129, 0.8)" />
            <Bar dataKey="inProgress" name={t('qualifiedLeads') || 'Leads Qualificados'} stackId="a" fill="rgba(245, 158, 11, 0.8)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="glass-dark p-6 rounded-xl">
        {stats.leadsByStatus && stats.leadsByStatus.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold mb-4">{t('leadsByStatus') || 'Leads por Status'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.leadsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.leadsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">{t('clientsActivity')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  name={t('clientsTotal')}
                  stroke="rgba(59, 130, 246, 0.8)" 
                  strokeWidth={2}
                  dot={{ fill: 'rgba(59, 130, 246, 0.8)', r: 4 }}
                  activeDot={{ r: 6, fill: 'rgba(59, 130, 246, 1)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
