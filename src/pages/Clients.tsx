import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Plus, MoreHorizontal, Mail, Phone, ArrowUpDown } from 'lucide-react';
import ClientCard from '@/components/ClientCard';
import ClientModal from '@/components/ClientModal';
import { fetchClients } from '@/lib/supabaseQueries';
import { useLanguage } from '@/lib/LanguageContext';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await fetchClients();
        setClients(data);
      } catch (err) {
        setError(t('failedToLoad'));
        console.error('Client loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadClients();
  }, [t]);
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.company.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  });
  
  // Sort clients based on current sort settings
  const sortedClients = [...filteredClients].sort((a, b) => {
    const aValue = sortBy === 'name' ? a.name : a.projectsCount;
    const bValue = sortBy === 'name' ? b.name : b.projectsCount;
    
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });
  
  // Toggle sort order or change sort field
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle creating or updating a client
  const handleSubmitClient = (clientData: any) => {
    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === editingClient.id ? { ...client, ...clientData } : client
      );
      setClients(updatedClients);
    } else {
      // Create new client with default values for required fields
      const newClient = {
        id: Date.now(), // temporary ID
        ...clientData,
        projectsCount: clientData.projectsCount || 0,
        status: clientData.status || 'active',
        tasksCompleted: clientData.tasksCompleted || 0,
        tasksPending: clientData.tasksPending || 0
      };
      setClients([...clients, newClient]);
    }
    setEditingClient(null);
    setIsModalOpen(false);
  };

  // Open modal to edit client
  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('clients')}</h1>
          <p className="text-muted-foreground mt-1">{t('manageYourClients')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="glass flex items-center px-3 py-2 rounded-lg w-[250px]">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setEditingClient(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('newClient')}</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${view === 'grid' ? 'glass-dark' : 'glass'}`}
            onClick={() => setView('grid')}
          >
            {t('gridView')}
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${view === 'list' ? 'glass-dark' : 'glass'}`}
            onClick={() => setView('list')}
          >
            {t('listView')}
          </button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {sortedClients.length} {t('clientsFound')}
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedClients.map((client, index) => (
            <div key={index} onClick={() => handleEditClient(client)} className="cursor-pointer">
              <ClientCard client={client} />
            </div>
          ))}
          
          <button 
            className="glass-dark h-[220px] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-all-200"
            onClick={() => {
              setEditingClient(null);
              setIsModalOpen(true);
            }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span>{t('addClient')}</span>
          </button>
        </div>
      ) : (
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('name')}
                  >
                    {t('clientName')}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium">{t('email')}</th>
                <th className="text-left p-4 text-sm font-medium">{t('phone')}</th>
                <th className="text-left p-4 text-sm font-medium">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('projectsCount')}
                  >
                    {t('projects')}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium">{t('taskStatus')}</th>
                <th className="p-4 text-sm font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((client, index) => (
                <tr 
                  key={index} 
                  className="border-b border-border hover:bg-muted/10 cursor-pointer"
                  onClick={() => handleEditClient(client)}
                >
                  <td className="p-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">{client.projectsCount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.status === 'active' ? 'bg-green-500/20 text-green-200' : 
                      client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200' : 
                      'bg-red-500/20 text-red-200'
                    }`}>
                      {client.status === 'active' ? t('active') : 
                       client.status === 'pending' ? t('pending') : 
                       t('inactive')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      className="p-1 rounded-full hover:bg-muted/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClient(client);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para criar/editar cliente */}
      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmitClient}
        initialData={editingClient}
      />
    </div>
  );
}
