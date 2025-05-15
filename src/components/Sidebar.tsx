import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Kanban,
  MessageSquare,
  Target,
  LogOut,
  BarChart2
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, collapsed, onClick }: SidebarItemProps) => {
  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all-200 w-full",
          "hover:bg-primary/20 group",
          isActive ? "bg-primary/20 text-cream" : "text-muted-foreground",
          collapsed ? "justify-center" : ""
        )}
      >
        <Icon className={cn("h-5 w-5", collapsed ? "text-foreground" : "")} />
        {!collapsed && <span className="font-medium">{label}</span>}
        
        {collapsed && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-card text-foreground text-sm 
            invisible opacity-0 -translate-x-3 transition-all-200 group-hover:visible 
            group-hover:opacity-100 group-hover:translate-x-0 z-50">
            {label}
          </div>
        )}
      </NavLink>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all-200 w-full",
        "hover:bg-primary/20 group",
        "text-muted-foreground",
        collapsed ? "justify-center" : ""
      )}
    >
      <Icon className={cn("h-5 w-5", collapsed ? "text-foreground" : "")} />
      {!collapsed && <span className="font-medium">{label}</span>}
      
      {collapsed && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-card text-foreground text-sm 
          invisible opacity-0 -translate-x-3 transition-all-200 group-hover:visible 
          group-hover:opacity-100 group-hover:translate-x-0 z-50">
          {label}
        </div>
      )}
    </button>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const { logout } = useAuth();
  const { logo, useTextLogo, customText } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "glass-dark h-screen flex flex-col border-r border-border/80 relative",
      collapsed ? "w-[70px]" : "w-[240px]",
      "transition-all duration-300 ease-in-out"
    )}>
      <div className="p-4 flex items-center mb-2 justify-center">
        {useTextLogo ? (
          <div className={cn(
            "text-foreground font-bold transition-all duration-300",
            collapsed ? "text-sm" : "text-xl"
          )}>
            {collapsed ? customText.charAt(0) : customText}
          </div>
        ) : (
          !collapsed ? (
            <img 
              src={logo.path} 
              alt={logo.name} 
              className="h-8" 
            />
          ) : (
            <img 
              src={logo.path} 
              alt={logo.name} 
              className="h-6" 
            />
          )
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 glass-dark rounded-full w-6 h-6 flex items-center justify-center text-xs"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
      
      <div className="space-y-1 px-2 flex-1">
        <SidebarItem icon={LayoutDashboard} label={t('dashboard')} to="/dashboard" collapsed={collapsed} />
        <SidebarItem icon={Target} label={t('prospecting')} to="/prospecting" collapsed={collapsed} />
        <SidebarItem icon={BarChart2} label={t('leads')} to="/leads" collapsed={collapsed} />
        <SidebarItem icon={ListTodo} label={t('tasks')} to="/tasks" collapsed={collapsed} />
        <SidebarItem icon={Kanban} label={t('projects')} to="/projects" collapsed={collapsed} />
        <SidebarItem icon={Calendar} label={t('calendar')} to="/calendar" collapsed={collapsed} />
        <SidebarItem icon={Users} label={t('clients')} to="/clients" collapsed={collapsed} />
        <SidebarItem icon={MessageSquare} label={t('chat')} to="/chat" collapsed={collapsed} />
      </div>
      
      <div className="border-t border-border/40 pt-2 p-2 space-y-1">
        <button 
          onClick={() => setTurboMode(!turboMode)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all-200",
            "hover:bg-secondary/40",
            turboMode ? "bg-secondary/40 text-cream" : "text-muted-foreground",
            collapsed ? "justify-center" : ""
          )}
        >
          <Zap className={cn(
            "h-5 w-5",
            turboMode ? "text-cream" : ""
          )} />
          {!collapsed && <span className="font-medium">{t('turboMode')}</span>}
          
          {collapsed && turboMode && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-secondary text-secondary-foreground text-sm 
              invisible opacity-0 -translate-x-3 transition-all-200 group-hover:visible 
              group-hover:opacity-100 group-hover:translate-x-0 z-50">
              {t('turboModeActive')}
            </div>
          )}
        </button>
        
        <SidebarItem icon={Settings} label={t('settings')} to="/settings" collapsed={collapsed} />
        <SidebarItem 
          icon={LogOut} 
          label={t('logout')} 
          onClick={handleLogout} 
          collapsed={collapsed} 
        />
      </div>
    </aside>
  );
}
