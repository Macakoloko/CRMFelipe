import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar as CalendarIcon, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { initialClients } from '@/lib/data';
import CalendarEventModal from '@/components/CalendarEventModal';
import { db } from '@/lib/db';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const calendarMessages = {
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  today: 'Hoje',
  next: 'Próximo',
  previous: 'Anterior',
  showMore: (total: number) => `+${total} mais`,
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Dia inteiro',
  work_week: 'Semana de trabalho',
  agenda: 'Agenda',
  noEventsInRange: 'Não há eventos neste período.',
};

export default function Calendar() {
  const [events, setEvents] = useState(db.getEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deleteEvent, setDeleteEvent] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Carregar eventos do banco de dados ao iniciar
  useEffect(() => {
    setEvents(db.getEvents());
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    initialClients.find(c => c.id === event.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calendarEvents = events.map(event => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const client = initialClients.find(c => c.id === event.clientId);
    
    return {
      id: event.id,
      title: event.title,
      start: startDate,
      end: endDate,
      client: client?.name,
      status: event.status,
      contentType: event.contentType,
      style: {
        backgroundColor: client?.primaryColor + '20',
        color: client?.primaryColor,
        borderColor: client?.primaryColor,
      }
    };
  });

  const handleCreateEvent = (eventData: any) => {
    // Adicionar evento no banco de dados
    const newEvent = db.addEvent({
      ...eventData,
      status: 'pending',
      contentType: 'post'
    });
    setEvents(db.getEvents());
  };

  const handleUpdateEvent = (eventData: any) => {
    // Atualizar evento no banco de dados
    db.updateEvent(eventData);
    setEvents(db.getEvents());
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    // Remover evento do banco de dados
    db.deleteEvent(eventId);
    setEvents(db.getEvents());
    setDeleteEvent(null);
  };

  const handleSelectEvent = (event: any) => {
    const originalEvent = events.find(e => e.id === event.id);
    if (originalEvent) {
      setEditingEvent(originalEvent);
      setIsModalOpen(true);
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus eventos e compromissos</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass flex items-center px-3 py-2 rounded-lg w-[250px]">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="glass rounded-lg flex p-1">
            <Button
              variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('calendar')}
              className="rounded-lg"
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-lg"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Novo Evento</span>
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const client = initialClients.find(c => c.id === event.clientId);
            return (
              <Card key={event.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{client?.name}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às{' '}
                      {event.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" style={{ backgroundColor: client?.primaryColor + '20', color: client?.primaryColor }}>
                      {event.status}
                    </Badge>
                    <Badge variant="outline" style={{ backgroundColor: client?.secondaryColor + '20', color: client?.primaryColor }}>
                      {event.contentType}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-lg p-4 backdrop-blur-sm">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 250px)' }}
            defaultView="month"
            views={['month', 'week', 'day']}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            culture="pt-BR"
            messages={calendarMessages}
            eventPropGetter={(event) => ({
              style: {
                ...event.style,
                fontSize: '0.875rem',
                borderRadius: '4px',
                border: 'none',
                padding: '4px 8px',
              }
            })}
            dayPropGetter={(date) => ({
              style: {
                backgroundColor: 'transparent',
              }
            })}
          />
        </div>
      )}

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        initialData={editingEvent}
      />

      <AlertDialog open={deleteEvent !== null} onOpenChange={() => setDeleteEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEvent && handleDeleteEvent(deleteEvent)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 