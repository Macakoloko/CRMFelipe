import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Download, Upload, List, Grid, KanbanSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DroppableStateSnapshot, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';
import { useLeads, Lead, TEMPERATURAS, STATUS, FITS, ETAPAS, POS_VENDA } from '@/contexts/LeadContext';

const exemploLead: Lead = {
  id: '1',
  nome: 'João da Silva',
  empresa: 'Empresa Exemplo',
  segmento: 'Tecnologia',
  cargo: 'CEO',
  email: 'joao@exemplo.com',
  telefone: '(11) 99999-9999',
  cidade: 'São Paulo',
  pais: 'Brasil',
  fonte: 'Instagram',
  campanha: 'Campanha X',
  dataEntrada: '2024-06-01',
  responsavel: 'Maria SDR',
  tamanhoEmpresa: '10-50',
  faturamento: 'R$ 100k/mês',
  orcamento: 'R$ 5k/mês',
  decisor: 'Sim',
  desafio: 'Gerar mais leads',
  interesse: 'Gestão de Tráfego',
  fit: 'Alto',
  engajamento: 'Baixou e-book',
  interacoes: 'Reunião agendada',
  temperatura: 'Quente',
  etapaFunil: 'Fechamento',
  probabilidade: 80,
  notas: 'Lead muito interessado',
  bantBudget: 'R$ 5k',
  bantAuthority: 'Sim',
  bantNeed: 'Alta',
  bantTiming: 'Imediato',
  gpctGoals: 'Aumentar vendas',
  gpctPlans: 'Contratar agência',
  gpctChallenges: 'Falta de tempo',
  gpctTimeline: '30 dias',
  status: 'Em Proposta',
  dataUltimoContato: '2024-06-02',
  proximaAcao: 'Enviar proposta',
  responsavelFollowup: 'Maria SDR',
  obsFinais: '',
  leadScoring: 95,
  tempoConversao: '10',
  valorPotencial: 'R$ 60.000',
  anotacoesObjecoes: '',
  dataConversao: '',
  statusPosVenda: 'Nenhum',
};

export default function Leads() {
  // Usar o contexto compartilhado em vez do estado local
  const { leads, setLeads, updateLead, deleteLead } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
  const [columns, setColumns] = useState<{id: string; title: string; leadIds: string[]}[]>([]);

  // Update columns whenever leads change
  useEffect(() => {
    const statusColumns = STATUS.map(status => ({
      id: status,
      title: status,
      leadIds: leads.filter(lead => lead.status === status).map(lead => lead.id)
    }));
    setColumns(statusColumns);
  }, [leads]);

  // Função para adicionar/editar lead
  const handleSaveLead = (lead: Lead) => {
    if (editingLead) {
      updateLead(lead.id, lead);
    } else {
      const newId = (leads.length > 0 ? Math.max(...leads.map(l => parseInt(l.id))) + 1 : 1).toString();
      setLeads([...leads, { ...lead, id: newId }]);
    }
    setShowForm(false);
    setEditingLead(null);
  };

  // Função para deletar lead
  const handleDeleteLead = (id: string) => {
    deleteLead(id);
  };

  // Função para exportar leads
  const handleExportLeads = () => {
    // Cabeçalho CSV
    const headers = [
      'ID', 'Nome', 'Empresa', 'Segmento', 'Cargo', 'Email', 'Telefone',
      'Cidade', 'País', 'Fonte', 'Campanha', 'Data Entrada', 'Responsável',
      'Fit', 'Temperatura', 'Status', 'Orçamento', 'Decisor', 'Desafio',
      'Interesse', 'Etapa do Funil', 'Valor Potencial', 'Observações'
    ].join(',');

    // Transformar leads em linhas CSV
    const csvRows = leads.map(lead => {
      return [
        lead.id,
        `"${lead.nome || ''}"`,
        `"${lead.empresa || ''}"`,
        `"${lead.segmento || ''}"`,
        `"${lead.cargo || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.telefone || ''}"`,
        `"${lead.cidade || ''}"`,
        `"${lead.pais || ''}"`,
        `"${lead.fonte || ''}"`,
        `"${lead.campanha || ''}"`,
        `"${lead.dataEntrada || ''}"`,
        `"${lead.responsavel || ''}"`,
        `"${lead.fit || ''}"`,
        `"${lead.temperatura || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.orcamento || ''}"`,
        `"${lead.decisor || ''}"`,
        `"${lead.desafio || ''}"`,
        `"${lead.interesse || ''}"`,
        `"${lead.etapaFunil || ''}"`,
        `"${lead.valorPotencial || ''}"`,
        `"${lead.notas?.replace(/"/g, '""') || ''}"`,
      ].join(',');
    });

    // Combinar cabeçalho e linhas
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Criar um blob e um link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast(`Exportação concluída: ${leads.length} leads exportados com sucesso.`);
  };

  // Função para lidar com a importação de leads
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Função para processar o arquivo importado
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) return;

      const rows = csvText.split('\n');
      const headers = rows[0].split(',');
      
      // Mapear índices das colunas
      const getColumnIndex = (name: string) => {
        const index = headers.findIndex(h => h.trim().toLowerCase() === name.toLowerCase());
        return index >= 0 ? index : null;
      };
      
      const colMap = {
        id: getColumnIndex('ID'),
        nome: getColumnIndex('Nome'),
        empresa: getColumnIndex('Empresa'),
        segmento: getColumnIndex('Segmento'),
        cargo: getColumnIndex('Cargo'),
        email: getColumnIndex('Email'),
        telefone: getColumnIndex('Telefone'),
        cidade: getColumnIndex('Cidade'),
        pais: getColumnIndex('País'),
        fonte: getColumnIndex('Fonte'),
        campanha: getColumnIndex('Campanha'),
        dataEntrada: getColumnIndex('Data Entrada'),
        responsavel: getColumnIndex('Responsável'),
        fit: getColumnIndex('Fit'),
        temperatura: getColumnIndex('Temperatura'),
        status: getColumnIndex('Status'),
        orcamento: getColumnIndex('Orçamento'),
        decisor: getColumnIndex('Decisor'),
        desafio: getColumnIndex('Desafio'),
        interesse: getColumnIndex('Interesse'),
        etapaFunil: getColumnIndex('Etapa do Funil'),
        valorPotencial: getColumnIndex('Valor Potencial'),
        notas: getColumnIndex('Observações')
      };
      
      // Parser para células CSV
      const parseCSVCell = (cell: string) => {
        if (cell.startsWith('"') && cell.endsWith('"')) {
          return cell.slice(1, -1).replace(/""/g, '"');
        }
        return cell;
      };
      
      // Processar linhas (excluindo o cabeçalho)
      const importedLeads: Partial<Lead>[] = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Pular linhas vazias
        
        const cells = rows[i].split(',');
        const lead: Partial<Lead> = {};
        
        // ID é obrigatório
        const idIdx = colMap.id !== null ? colMap.id : -1;
        if (idIdx >= 0 && cells[idIdx]) {
          lead.id = parseCSVCell(cells[idIdx]);
        } else {
          // Gerar um novo ID se não estiver presente
          lead.id = (Math.random() * 10000).toFixed(0);
        }
        
        // Processar outros campos
        Object.entries(colMap).forEach(([field, idx]) => {
          if (idx !== null && idx >= 0 && cells[idx] && field !== 'id') {
            (lead as any)[field] = parseCSVCell(cells[idx]);
          }
        });
        
        importedLeads.push(lead as Lead);
      }
      
      // Atualizar leads
      if (importedLeads.length > 0) {
        const newLeads = [...leads];
        
        importedLeads.forEach(importedLead => {
          const existingIndex = newLeads.findIndex(l => l.id === importedLead.id);
          if (existingIndex >= 0) {
            // Atualizar lead existente
            newLeads[existingIndex] = { ...newLeads[existingIndex], ...importedLead } as Lead;
          } else {
            // Adicionar novo lead
            newLeads.push(importedLead as Lead);
          }
        });
        
        setLeads(newLeads);
        toast(`Importação concluída: ${importedLeads.length} leads importados com sucesso.`);
      }
    };
    
    reader.readAsText(file);
  };

  // Drag and drop for kanban
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Get source and destination column
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Same column movement - just reorder the IDs in the column
    if (source.droppableId === destination.droppableId) {
      const newLeadIds = Array.from(sourceColumn.leadIds);
      newLeadIds.splice(source.index, 1);
      newLeadIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        leadIds: newLeadIds,
      };

      const newColumns = columns.map(col =>
        col.id === newColumn.id ? newColumn : col
      );

      setColumns(newColumns);
      return;
    }

    // Moving from one list to another - update both columns
    const sourceLeadIds = Array.from(sourceColumn.leadIds);
    sourceLeadIds.splice(source.index, 1);
    
    const destLeadIds = Array.from(destColumn.leadIds);
    destLeadIds.splice(destination.index, 0, draggableId);

    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, leadIds: sourceLeadIds };
      }
      if (col.id === destination.droppableId) {
        return { ...col, leadIds: destLeadIds };
      }
      return col;
    });

    setColumns(newColumns);

    // Update the lead's status
    const lead = leads.find(l => l.id === draggableId);
    if (lead) {
      const updatedLead = { ...lead, status: destination.droppableId as any };
      updateLead(lead.id, updatedLead);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Qualificação dos Leads</h1>
          <p className="text-muted-foreground mt-1">Gerencie e qualifique seus leads de forma eficiente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLeads}>
            <Download className="w-4 h-4 mr-2" />Exportar
          </Button>
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="w-4 h-4 mr-2" />Importar
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport}
            accept=".csv" 
            className="hidden" 
          />
          <Button onClick={() => { setShowForm(true); setEditingLead(null); }}>
            <Plus className="w-4 h-4 mr-2" />Novo Lead
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />Lista
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-2" />Grade
          </Button>
          <Button 
            variant={viewMode === 'kanban' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('kanban')}
          >
            <KanbanSquare className="w-4 h-4 mr-2" />Kanban
          </Button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="overflow-x-auto rounded-lg border border-border/30 bg-card">
          <table className="min-w-[1200px] w-full text-sm">
            <thead>
              <tr className="bg-muted/40">
                <th className="p-2">ID</th>
                <th className="p-2">Nome</th>
                <th className="p-2">Empresa</th>
                <th className="p-2">Segmento</th>
                <th className="p-2">Cargo</th>
                <th className="p-2">Email</th>
                <th className="p-2">Telefone</th>
                <th className="p-2">Cidade/País</th>
                <th className="p-2">Fonte</th>
                <th className="p-2">Campanha</th>
                <th className="p-2">Data Entrada</th>
                <th className="p-2">Responsável</th>
                <th className="p-2">Fit</th>
                <th className="p-2">Temperatura</th>
                <th className="p-2">Status</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-border/20 hover:bg-muted/10 cursor-pointer" onClick={() => setViewingLead(lead)}>
                  <td className="p-2 font-mono text-xs">{lead.id}</td>
                  <td className="p-2">{lead.nome}</td>
                  <td className="p-2">{lead.empresa}</td>
                  <td className="p-2">{lead.segmento}</td>
                  <td className="p-2">{lead.cargo}</td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{lead.telefone}</td>
                  <td className="p-2">{lead.cidade} / {lead.pais}</td>
                  <td className="p-2">{lead.fonte}</td>
                  <td className="p-2">{lead.campanha}</td>
                  <td className="p-2">{lead.dataEntrada}</td>
                  <td className="p-2">{lead.responsavel}</td>
                  <td className="p-2">
                    <Badge variant={lead.fit === 'Alto' ? 'default' : lead.fit === 'Médio' ? 'secondary' : 'outline'}>{lead.fit}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge variant={lead.temperatura === 'Quente' ? 'default' : lead.temperatura === 'Morno' ? 'secondary' : 'outline'}>{lead.temperatura}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge variant={lead.status === 'Ganhou' ? 'default' : lead.status === 'Perdeu' ? 'destructive' : 'outline'}>{lead.status}</Badge>
                  </td>
                  <td className="p-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingLead(lead); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteLead(lead.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {leads.map(lead => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingLead(lead)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{lead.nome}</h3>
                  <Badge variant={lead.status === 'Ganhou' ? 'default' : lead.status === 'Perdeu' ? 'destructive' : 'outline'}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{lead.empresa}</div>
                <div className="text-sm mb-2">{lead.cargo}</div>
                <div className="flex gap-2 mb-3">
                  <Badge variant={lead.fit === 'Alto' ? 'default' : lead.fit === 'Médio' ? 'secondary' : 'outline'} className="text-xs">
                    {lead.fit}
                  </Badge>
                  <Badge variant={lead.temperatura === 'Quente' ? 'default' : lead.temperatura === 'Morno' ? 'secondary' : 'outline'} className="text-xs">
                    {lead.temperatura}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{lead.fonte}</span>
                  <span>{lead.dataEntrada}</span>
                </div>
                <div className="flex gap-1 mt-3 justify-end" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" onClick={() => { setEditingLead(lead); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteLead(lead.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'kanban' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
            {columns.map(column => (
              <div key={column.id} className="glass-dark rounded-xl flex-shrink-0 w-80">
                <div className="p-3 border-b border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{column.title}</h3>
                      <span className="text-sm text-muted-foreground">({column.leadIds.length})</span>
                    </div>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "p-3 min-h-[calc(100vh-230px)] overflow-y-auto",
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      )}
                    >
                      {column.leadIds.map((leadId, index) => {
                        const lead = leads.find(l => l.id === leadId);
                        if (!lead) return null;
                        
                        return (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3"
                              >
                                <Card 
                                  className="hover:shadow-md transition-shadow cursor-pointer" 
                                  onClick={() => setViewingLead(lead)}
                                >
                                  <CardContent className="p-3">
                                    <div className="mb-2">
                                      <h4 className="font-medium">{lead.nome}</h4>
                                      <div className="text-sm text-muted-foreground">{lead.empresa}</div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap mb-2">
                                      <Badge 
                                        variant={lead.fit === 'Alto' ? 'default' : lead.fit === 'Médio' ? 'secondary' : 'outline'}
                                        className="text-xs"
                                      >
                                        {lead.fit}
                                      </Badge>
                                      <Badge 
                                        variant={lead.temperatura === 'Quente' ? 'default' : lead.temperatura === 'Morno' ? 'secondary' : 'outline'}
                                        className="text-xs"
                                      >
                                        {lead.temperatura}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>{lead.fonte}</span>
                                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button 
                                          size="icon" 
                                          variant="ghost" 
                                          className="h-6 w-6" 
                                          onClick={() => { setEditingLead(lead); setShowForm(true); }}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="icon" 
                                          variant="ghost" 
                                          className="h-6 w-6 text-destructive" 
                                          onClick={() => handleDeleteLead(lead.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showForm && (
        <LeadForm
          lead={editingLead}
          onSave={handleSaveLead}
          onCancel={() => { setShowForm(false); setEditingLead(null); }}
        />
      )}
      
      {viewingLead && (
        <LeadView 
          lead={viewingLead} 
          onClose={() => setViewingLead(null)}
          onEdit={() => { setEditingLead(viewingLead); setShowForm(true); setViewingLead(null); }}
        />
      )}
    </div>
  );
}

function LeadForm({ lead, onSave, onCancel }: { lead: Lead | null, onSave: (lead: Lead) => void, onCancel: () => void }) {
  const [tab, setTab] = useState<'dados' | 'qualificacao'>('dados');
  const [form, setForm] = useState<Lead>(lead || {
    ...exemploLead,
    id: '',
    nome: '',
    empresa: '',
    segmento: '',
    cargo: '',
    email: '',
    telefone: '',
    cidade: '',
    pais: '',
    fonte: '',
    campanha: '',
    dataEntrada: '',
    responsavel: '',
    tamanhoEmpresa: '',
    faturamento: '',
    orcamento: '',
    decisor: 'Sim',
    desafio: '',
    interesse: '',
    fit: 'Médio',
    engajamento: '',
    interacoes: '',
    temperatura: 'Morno',
    etapaFunil: 'Topo',
    probabilidade: 0,
    notas: '',
    bantBudget: '',
    bantAuthority: '',
    bantNeed: '',
    bantTiming: '',
    gpctGoals: '',
    gpctPlans: '',
    gpctChallenges: '',
    gpctTimeline: '',
    status: 'Novo',
    dataUltimoContato: '',
    proximaAcao: '',
    responsavelFollowup: '',
    obsFinais: '',
    leadScoring: 0,
    tempoConversao: '',
    valorPotencial: '',
    anotacoesObjecoes: '',
    dataConversao: '',
    statusPosVenda: '',
  });

  const handleChange = (field: keyof Lead, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center z-50 mt-[180px]">
      <Card className="w-full max-w-[90vw] max-h-[90vh] h-[90vh] p-6 relative flex flex-col">
        <button className="absolute top-4 right-4" onClick={onCancel}>X</button>
        <h2 className="text-xl font-bold mb-4">{lead ? 'Editar Lead' : 'Novo Lead'}</h2>
        
        <form id="lead-form" onSubmit={handleSubmit}>
          <Tabs value={tab} onValueChange={v => setTab(v as 'dados' | 'qualificacao')} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="dados">Dados do Lead</TabsTrigger>
              <TabsTrigger value="qualificacao">Qualificação</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="dados" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dados básicos do lead */}
                <div>
                  <label className="text-sm text-muted-foreground">Nome</label>
                  <Input value={form.nome} onChange={e => handleChange('nome', e.target.value)} placeholder="Nome completo" required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Empresa</label>
                  <Input value={form.empresa} onChange={e => handleChange('empresa', e.target.value)} placeholder="Empresa" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Segmento</label>
                  <Input value={form.segmento} onChange={e => handleChange('segmento', e.target.value)} placeholder="Segmento" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Cargo</label>
                  <Input value={form.cargo} onChange={e => handleChange('cargo', e.target.value)} placeholder="Cargo" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <Input value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="Email" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <Input value={form.telefone} onChange={e => handleChange('telefone', e.target.value)} placeholder="Telefone" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Cidade</label>
                  <Input value={form.cidade} onChange={e => handleChange('cidade', e.target.value)} placeholder="Cidade" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">País</label>
                  <Input value={form.pais} onChange={e => handleChange('pais', e.target.value)} placeholder="País" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Fonte</label>
                  <Input value={form.fonte} onChange={e => handleChange('fonte', e.target.value)} placeholder="Fonte do lead" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Campanha</label>
                  <Input value={form.campanha} onChange={e => handleChange('campanha', e.target.value)} placeholder="Campanha/Anúncio" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data de Entrada</label>
                  <Input type="date" value={form.dataEntrada} onChange={e => handleChange('dataEntrada', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Responsável</label>
                  <Input value={form.responsavel} onChange={e => handleChange('responsavel', e.target.value)} placeholder="Responsável pelo lead" />
                </div>
              </TabsContent>
              
              <TabsContent value="qualificacao" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos de qualificação (10 campos mais importantes) */}
                <div>
                  <label className="text-sm text-muted-foreground">Orçamento Disponível</label>
                  <Input value={form.orcamento} onChange={e => handleChange('orcamento', e.target.value)} placeholder="Orçamento disponível" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Poder de Decisão</label>
                  <Select value={form.decisor} onValueChange={v => handleChange('decisor', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Poder de Decisão" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                      <SelectItem value="Influenciador">Influenciador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Principal Desafio</label>
                  <Input value={form.desafio} onChange={e => handleChange('desafio', e.target.value)} placeholder="Desafio atual" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Produto de Interesse</label>
                  <Input value={form.interesse} onChange={e => handleChange('interesse', e.target.value)} placeholder="Serviço/Produto de interesse" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Fit Comercial</label>
                  <Select value={form.fit} onValueChange={v => handleChange('fit', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Fit" /></SelectTrigger>
                    <SelectContent>
                      {FITS.map(fit => <SelectItem key={fit} value={fit}>{fit}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Temperatura</label>
                  <Select value={form.temperatura} onValueChange={v => handleChange('temperatura', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Temperatura" /></SelectTrigger>
                    <SelectContent>
                      {TEMPERATURAS.map(temp => <SelectItem key={temp} value={temp}>{temp}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Etapa do Funil</label>
                  <Select value={form.etapaFunil} onValueChange={v => handleChange('etapaFunil', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Etapa do Funil" /></SelectTrigger>
                    <SelectContent>
                      {ETAPAS.map(etapa => <SelectItem key={etapa} value={etapa}>{etapa}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status Atual</label>
                  <Select value={form.status} onValueChange={v => handleChange('status', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {STATUS.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Valor Potencial</label>
                  <Input value={form.valorPotencial} onChange={e => handleChange('valorPotencial', e.target.value)} placeholder="Valor potencial do negócio" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Observações</label>
                  <Textarea value={form.notas} onChange={e => handleChange('notas', e.target.value)} placeholder="Notas do atendimento / Observações" />
                </div>
              </TabsContent>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
              <Button type="submit" form="lead-form">{lead ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </Tabs>
        </form>
      </Card>
    </div>
  );
}

// Componente de visualização detalhada do Lead
function LeadView({ lead, onClose, onEdit }: { lead: Lead, onClose: () => void, onEdit: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center z-50 mt-[180px]">
      <Card className="w-full max-w-[90vw] max-h-[90vh] h-[90vh] p-6 relative flex flex-col">
        <button className="absolute top-4 right-4" onClick={onClose}>X</button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detalhes do Lead</h2>
          <Button variant="outline" onClick={onEdit}>Editar</Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="dados" className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="dados">Dados do Lead</TabsTrigger>
              <TabsTrigger value="qualificacao">Qualificação</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="dados" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Nome</div>
                  <div className="font-medium">{lead.nome || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Empresa</div>
                  <div className="font-medium">{lead.empresa || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Segmento</div>
                  <div className="font-medium">{lead.segmento || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Cargo</div>
                  <div className="font-medium">{lead.cargo || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{lead.email || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Telefone</div>
                  <div className="font-medium">{lead.telefone || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Cidade</div>
                  <div className="font-medium">{lead.cidade || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">País</div>
                  <div className="font-medium">{lead.pais || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Fonte</div>
                  <div className="font-medium">{lead.fonte || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Campanha</div>
                  <div className="font-medium">{lead.campanha || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Data de Entrada</div>
                  <div className="font-medium">{lead.dataEntrada || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Responsável</div>
                  <div className="font-medium">{lead.responsavel || "—"}</div>
                </div>
              </TabsContent>
              
              <TabsContent value="qualificacao" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Orçamento Disponível</div>
                  <div className="font-medium">{lead.orcamento || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Poder de Decisão</div>
                  <div className="font-medium">{lead.decisor || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Principal Desafio</div>
                  <div className="font-medium">{lead.desafio || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Produto de Interesse</div>
                  <div className="font-medium">{lead.interesse || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Fit Comercial</div>
                  <div className="font-medium">
                    <Badge variant={lead.fit === 'Alto' ? 'default' : lead.fit === 'Médio' ? 'secondary' : 'outline'}>{lead.fit || "—"}</Badge>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Temperatura</div>
                  <div className="font-medium">
                    <Badge variant={lead.temperatura === 'Quente' ? 'default' : lead.temperatura === 'Morno' ? 'secondary' : 'outline'}>{lead.temperatura || "—"}</Badge>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Etapa do Funil</div>
                  <div className="font-medium">{lead.etapaFunil || "—"}</div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Status Atual</div>
                  <div className="font-medium">
                    <Badge variant={lead.status === 'Ganhou' ? 'default' : lead.status === 'Perdeu' ? 'destructive' : 'outline'}>{lead.status || "—"}</Badge>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Valor Potencial</div>
                  <div className="font-medium">{lead.valorPotencial || "—"}</div>
                </div>
                <div className="border p-3 rounded-md md:col-span-2">
                  <div className="text-sm text-muted-foreground">Observações</div>
                  <div className="font-medium whitespace-pre-wrap">{lead.notas || "—"}</div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
} 