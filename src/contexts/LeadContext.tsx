import React, { createContext, useState, useContext, useEffect } from 'react';

// Tipos de Lead
export interface Lead {
  id: string;
  nome: string;
  empresa: string;
  segmento: string;
  cargo: string;
  email: string;
  telefone: string;
  cidade: string;
  pais: string;
  fonte: string;
  campanha: string;
  dataEntrada: string;
  responsavel: string;
  tamanhoEmpresa: string;
  faturamento: string;
  orcamento: string;
  decisor: 'Sim' | 'Não' | 'Influenciador';
  desafio: string;
  interesse: string;
  fit: 'Alto' | 'Médio' | 'Baixo';
  engajamento: string;
  interacoes: string;
  temperatura: 'Frio' | 'Morno' | 'Quente';
  etapaFunil: 'Topo' | 'Meio' | 'Fundo' | 'Fechamento';
  probabilidade: number;
  notas: string;
  bantBudget: string;
  bantAuthority: string;
  bantNeed: string;
  bantTiming: string;
  gpctGoals: string;
  gpctPlans: string;
  gpctChallenges: string;
  gpctTimeline: string;
  status: 'Novo' | 'Em Qualificação' | 'Qualificado' | 'Em Proposta' | 'Ganhou' | 'Perdeu';
  dataUltimoContato: string;
  proximaAcao: string;
  responsavelFollowup: string;
  obsFinais: string;
  leadScoring: number;
  tempoConversao: string;
  valorPotencial: string;
  anotacoesObjecoes: string;
  dataConversao: string;
  statusPosVenda: 'Onboarding' | 'Em Andamento' | 'Suporte' | 'Cancelado' | 'Nenhum' | '';
  // Campos para integração com acompanhamento de lead
  acompanhamentoStatus?: 'pendente' | 'contatado' | 'agendado' | 'nao_interessado' | 'ligar_depois';
  acompanhamentoObservacoes?: string;
  dataProximoContato?: Date;
  historicoContatos?: ContatoHistorico[];
}

export interface ContatoHistorico {
  data: Date;
  scriptUsado?: string;
  status: 'pendente' | 'contatado' | 'agendado' | 'nao_interessado' | 'ligar_depois';
  observacoes: string;
  dataRetorno?: Date;
}

// Mapeamento entre os status de acompanhamento e status de lead
const statusMapping = {
  'pendente': 'Novo',
  'contatado': 'Em Qualificação',
  'agendado': 'Qualificado',
  'nao_interessado': 'Perdeu',
  'ligar_depois': 'Em Qualificação'
};

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
  acompanhamentoStatus: 'pendente',
  acompanhamentoObservacoes: '',
  historicoContatos: []
};

export const TEMPERATURAS = ['Frio', 'Morno', 'Quente'];
export const STATUS = ['Novo', 'Em Qualificação', 'Qualificado', 'Em Proposta', 'Ganhou', 'Perdeu'];
export const FITS = ['Alto', 'Médio', 'Baixo'];
export const ETAPAS = ['Topo', 'Meio', 'Fundo', 'Fechamento'];
export const POS_VENDA = ['Onboarding', 'Em Andamento', 'Suporte', 'Cancelado', 'Nenhum'];
export const ACOMPANHAMENTO_STATUS = ['pendente', 'contatado', 'agendado', 'nao_interessado', 'ligar_depois'];

interface LeadContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadFromAcompanhamento: (id: string, status: 'pendente' | 'contatado' | 'agendado' | 'nao_interessado' | 'ligar_depois', observacoes?: string, dataProximoContato?: Date, scriptUsado?: string) => void;
  getLeadsByStatus: (status: string) => Lead[];
  getLeadsBySegmento: (segmento: string) => Lead[];
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const savedLeads = localStorage.getItem('leads');
    return savedLeads ? JSON.parse(savedLeads) : [exemploLead];
  });

  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newId = (leads.length > 0 ? Math.max(...leads.map(l => parseInt(l.id))) + 1 : 1).toString();
    setLeads([...leads, { ...lead, id: newId } as Lead]);
  };

  const updateLead = (id: string, updatedLeadData: Partial<Lead>) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, ...updatedLeadData } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const updateLeadFromAcompanhamento = (
    id: string, 
    status: 'pendente' | 'contatado' | 'agendado' | 'nao_interessado' | 'ligar_depois', 
    observacoes?: string, 
    dataProximoContato?: Date,
    scriptUsado?: string
  ) => {
    const lead = leads.find(lead => lead.id === id);
    if (!lead) return;

    // Criar um novo registro de contato
    const novoContato: ContatoHistorico = {
      data: new Date(),
      status,
      observacoes: observacoes || '',
      dataRetorno: dataProximoContato,
      scriptUsado
    };

    // Atualizar o lead com as informações de acompanhamento
    const historicoContatos = lead.historicoContatos ? [...lead.historicoContatos, novoContato] : [novoContato];
    
    // Mapear o status de acompanhamento para o status do lead
    const updatedLeadStatus = statusMapping[status] as 'Novo' | 'Em Qualificação' | 'Qualificado' | 'Em Proposta' | 'Ganhou' | 'Perdeu';

    // Atualizar todos os dados relevantes do lead
    updateLead(id, {
      acompanhamentoStatus: status,
      acompanhamentoObservacoes: observacoes,
      dataProximoContato,
      historicoContatos,
      status: updatedLeadStatus,
      dataUltimoContato: new Date().toISOString().split('T')[0],
      proximaAcao: status === 'ligar_depois' ? 'Retornar contato' : 
                   status === 'agendado' ? 'Reunião agendada' : '',
      // Atualiza a temperatura baseada no status
      temperatura: status === 'agendado' ? 'Quente' : 
                  status === 'contatado' ? 'Morno' : 
                  status === 'nao_interessado' ? 'Frio' : lead.temperatura
    });
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getLeadsBySegmento = (segmento: string) => {
    return leads.filter(lead => lead.segmento === segmento);
  };

  return (
    <LeadContext.Provider value={{ 
      leads, 
      setLeads, 
      addLead, 
      updateLead, 
      deleteLead, 
      updateLeadFromAcompanhamento,
      getLeadsByStatus,
      getLeadsBySegmento
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}; 