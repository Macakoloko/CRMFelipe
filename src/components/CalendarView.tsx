
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { calendarEvents, getClientById, getContentTypeIcon } from '@/lib/data';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get client for a specific event
  const getClientForEvent = (clientId: number) => {
    return getClientById(clientId);
  };
  
  // Generate days for current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Previous month days to show
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: startingDayOfWeek }, (_, i) => ({
      day: prevMonthLastDay - startingDayOfWeek + i + 1,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - startingDayOfWeek + i + 1)
    }));
    
    // Current month days
    const currentMonthDays = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      date: new Date(year, month, i + 1)
    }));
    
    // Next month days to complete the grid
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i + 1)
    }));
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };
  
  // Events for a specific date
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Days of week
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div className="glass-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold capitalize">{formatMonthName(currentDate)}</h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="text-sm px-4 py-1.5 glass rounded-lg hover:bg-muted/30 transition-all-200"
          >
            Hoje
          </button>
          
          <div className="flex items-center">
            <button 
              onClick={goToPreviousMonth}
              className="p-1.5 glass rounded-lg hover:bg-muted/30 transition-all-200 mr-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button 
              onClick={goToNextMonth}
              className="p-1.5 glass rounded-lg hover:bg-muted/30 transition-all-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center py-2 text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {generateCalendarDays().map((day, index) => {
          const events = getEventsForDate(day.date);
          const hasEvents = events.length > 0;
          
          return (
            <div 
              key={index} 
              className={cn(
                "min-h-[110px] p-1 rounded-lg border border-border/20",
                day.isCurrentMonth ? "bg-muted/10" : "bg-muted/5",
                isToday(day.date) && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="flex justify-between items-center mb-1 px-1">
                <span className={cn(
                  "text-sm",
                  !day.isCurrentMonth && "text-muted-foreground/50",
                  isToday(day.date) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center font-medium"
                )}>
                  {day.day}
                </span>
                
                {day.isCurrentMonth && (
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full">
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                {hasEvents && events.slice(0, 2).map((event, idx) => {
                  const client = getClientForEvent(event.clientId);
                  const ContentTypeIcon = getContentTypeIcon(event.contentType);
                  
                  return (
                    <div 
                      key={idx} 
                      className="text-xs p-1 rounded bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                      style={{
                        borderLeft: `2px solid ${client?.primaryColor || '#436051'}`
                      }}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium line-clamp-1">{event.title}</span>
                        <ContentTypeIcon className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="text-muted-foreground text-[10px]">{event.time}</div>
                    </div>
                  );
                })}
                
                {events.length > 2 && (
                  <div className="text-xs text-center text-muted-foreground">
                    +{events.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
