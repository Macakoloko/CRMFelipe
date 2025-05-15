import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Phone, Calendar as CalendarIcon, CheckCircle2, XCircle, Eye, Clock, Settings, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lead {
  nome: string;
  telefone: string;
  localizacao: string;
  email: string;
  site: string;
  nicho: string;
  status: 'pendente' | 'contatado' | 'agendado' | 'nao_interessado' | 'ligar_depois';
  observacoes?: string;
  dataReuniao?: Date;
  historicoLigacoes: CallHistory[];
}

interface CallHistory {
  data: Date;
  scriptUsado: string;
  status: Lead['status'];
  observacoes: string;
  dataRetorno?: Date;
}

interface Script {
  id: string;
  nome: string;
  conteudo: string;
}

const scriptsPadroes: Script[] = [
  {
    id: 'padrao',
    nome: 'Script Padrão',
    conteudo: `Olá, bom dia/boa tarde!

Meu nome é [SEU NOME] da [SUA EMPRESA]. 
Gostaria de falar com o responsável pela área de marketing/vendas.

[APÓS TRANSFERÊNCIA]

Olá [NOME DO RESPONSÁVEL],

Estou entrando em contato porque ajudamos empresas como a [NOME DA EMPRESA DELES] a aumentar suas vendas através de estratégias digitais personalizadas.

Nossos clientes têm conseguido aumentar em média 40% seu faturamento nos primeiros 6 meses de trabalho conosco.

Gostaria de agendar uma reunião rápida de 30 minutos para mostrar como podemos ajudar especificamente a [NOME DA EMPRESA DELES].

Qual o melhor horário para você essa semana?`
  },
  {
    id: 'beneficios',
    nome: 'Foco em Benefícios',
    conteudo: `Olá, bom dia/boa tarde!

Meu nome é [SEU NOME] da [SUA EMPRESA].
Estou ligando porque temos uma solução que já ajudou empresas do segmento de [NICHO] a:

✓ Aumentar em 40% suas vendas
✓ Reduzir custos de aquisição de clientes
✓ Melhorar o ROI das campanhas de marketing

Gostaria de falar com a pessoa responsável por essas decisões na [NOME DA EMPRESA DELES].`
  },
  {
    id: 'dor',
    nome: 'Abordagem pela Dor',
    conteudo: `Olá, bom dia/boa tarde!

Meu nome é [SEU NOME] da [SUA EMPRESA].

Percebi que a [NOME DA EMPRESA DELES] atua no segmento de [NICHO].
Você tem enfrentado desafios para:

- Atrair mais clientes qualificados?
- Converter leads em vendas?
- Aumentar a presença digital?

Trabalho com várias empresas do seu segmento que tinham esses mesmos desafios.
Gostaria de compartilhar como as ajudamos a superar essas dificuldades.`
  },
  {
    id: 'autoridade',
    nome: 'Posicionamento de Autoridade',
    conteudo: `Olá, bom dia/boa tarde!

Meu nome é [SEU NOME], sou especialista em marketing digital para o segmento de [NICHO].

Ajudamos mais de 100 empresas a aumentarem sua presença digital e vendas.
Inclusive, trabalho com a [EMPRESA REFERÊNCIA], que talvez você conheça.

Gostaria de compartilhar alguns insights específicos para a [NOME DA EMPRESA DELES].
Com quem eu poderia conversar sobre isso?`
  },
  {
    id: 'educativo',
    nome: 'Abordagem Educativa',
    conteudo: `Olá, bom dia/boa tarde!

Meu nome é [SEU NOME] da [SUA EMPRESA].

Estamos realizando um estudo sobre o mercado de [NICHO] e desenvolvemos um relatório exclusivo com:

- Tendências do setor para 2024
- Estratégias que estão gerando resultados
- Casos de sucesso

Gostaríamos de compartilhar esses insights com a [NOME DA EMPRESA DELES].
Quem seria a melhor pessoa para receber esse material?`
  }
];

// Dados realistas de exemplo
const exemploLeads: Lead[] = [
  {
    nome: "Tecnodata Soluções Ltda",
    telefone: "(11) 3456-7890",
    localizacao: "São Paulo, SP",
    email: "contato@tecnodata.com.br",
    site: "www.tecnodata.com.br",
    nicho: "SaaS B2B",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "LogTech Logística",
    telefone: "(21) 2345-6789",
    localizacao: "Rio de Janeiro, RJ",
    email: "comercial@logtech.com.br",
    site: "www.logtech.com.br",
    nicho: "Logística",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "EcoBrasil Soluções Ambientais",
    telefone: "(31) 3234-5678",
    localizacao: "Belo Horizonte, MG",
    email: "vendas@ecobrasil.com.br",
    site: "www.ecobrasil.com.br",
    nicho: "Sustentabilidade",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "FinancialPro Investimentos",
    telefone: "(11) 4567-8901",
    localizacao: "São Paulo, SP",
    email: "contato@financialpro.com.br",
    site: "www.financialpro.com.br",
    nicho: "Serviços Financeiros",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "EduTech Brasil",
    telefone: "(41) 3456-7891",
    localizacao: "Curitiba, PR",
    email: "contato@edutech.com.br",
    site: "www.edutech.com.br",
    nicho: "Educação",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "MedicalPlus Equipamentos",
    telefone: "(11) 2345-6780",
    localizacao: "Campinas, SP",
    email: "vendas@medicalplus.com.br",
    site: "www.medicalplus.com.br",
    nicho: "Saúde e Bem-estar",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "FashionMall E-commerce",
    telefone: "(21) 3456-7809",
    localizacao: "Rio de Janeiro, RJ",
    email: "marketing@fashionmall.com.br",
    site: "www.fashionmall.com.br",
    nicho: "E-commerce",
    status: "pendente",
    historicoLigacoes: []
  },
  {
    nome: "AgriTech Soluções Agrícolas",
    telefone: "(51) 3456-7892",
    localizacao: "Porto Alegre, RS",
    email: "contato@agritech.com.br",
    site: "www.agritech.com.br",
    nicho: "Agronegócio",
    status: "pendente",
    historicoLigacoes: []
  }
];

const ColdCallsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    // Tenta carregar do localStorage primeiro, se não existir, usa os dados de exemplo
    const savedLeads = localStorage.getItem('coldCallsLeads');
    return savedLeads ? JSON.parse(savedLeads) : exemploLeads;
  });
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedScript, setSelectedScript] = useState<Script>(scriptsPadroes[0]);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [scripts, setScripts] = useState<Script[]>(scriptsPadroes);
  const [dataRetorno, setDataRetorno] = useState<Date>();
  const [horaRetorno, setHoraRetorno] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Lead['status'] | 'todos'>('todos');

  // Salva leads no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem('coldCallsLeads', JSON.stringify(leads));
  }, [leads]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet);
        
        const formattedLeads: Lead[] = jsonData.map(row => ({
          nome: row.Nome || '',
          telefone: row.Telefone || '',
          localizacao: row.Localização || '',
          email: row['E-mail'] || '',
          site: row.Site || '',
          nicho: row.Nicho || '',
          status: 'pendente',
          historicoLigacoes: [],
        }));
        
        setLeads(formattedLeads);
        setCurrentLeadIndex(0);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportLeads = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads.map(lead => ({
      Nome: lead.nome,
      Telefone: lead.telefone,
      Localização: lead.localizacao,
      'E-mail': lead.email,
      Site: lead.site,
      Nicho: lead.nicho,
      Status: lead.status,
      Observações: lead.observacoes,
      'Data Reunião': lead.dataReuniao ? format(lead.dataReuniao, 'dd/MM/yyyy HH:mm') : '',
      'Histórico': lead.historicoLigacoes.length
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    
    // Gera o arquivo e força o download
    XLSX.writeFile(workbook, `leads_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handleNextLead = () => {
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
      setObservacao('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setDataRetorno(undefined);
      setHoraRetorno('');
    }
  };

  const handlePreviousLead = () => {
    if (currentLeadIndex > 0) {
      setCurrentLeadIndex(currentLeadIndex - 1);
      setObservacao('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setDataRetorno(undefined);
      setHoraRetorno('');
    }
  };

  const handleScheduleMeeting = () => {
    if (selectedDate && selectedTime) {
      const updatedLeads = [...leads];
      const dataReuniao = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
      
      updatedLeads[currentLeadIndex] = {
        ...updatedLeads[currentLeadIndex],
        status: 'agendado',
        dataReuniao,
        historicoLigacoes: [
          ...updatedLeads[currentLeadIndex].historicoLigacoes,
          {
            data: new Date(),
            scriptUsado: selectedScript.nome,
            status: 'agendado',
            observacoes: observacao,
            dataRetorno: dataReuniao,
          }
        ]
      };
      setLeads(updatedLeads);
      handleNextLead();
    }
  };

  const handleUpdateStatus = (status: Lead['status']) => {
    const updatedLeads = [...leads];
    const dataRetornoCompleta = dataRetorno && horaRetorno 
      ? new Date(`${format(dataRetorno, 'yyyy-MM-dd')}T${horaRetorno}`)
      : undefined;

    updatedLeads[currentLeadIndex] = {
      ...updatedLeads[currentLeadIndex],
      status,
      observacoes: observacao,
      historicoLigacoes: [
        ...updatedLeads[currentLeadIndex].historicoLigacoes,
        {
          data: new Date(),
          scriptUsado: selectedScript.nome,
          status,
          observacoes: observacao,
          dataRetorno: dataRetornoCompleta,
        }
      ]
    };
    setLeads(updatedLeads);
    handleNextLead();
  };

  const formatarScript = (script: string) => {
    const lead = leads[currentLeadIndex];
    return script
      .replace(/\[NOME DA EMPRESA DELES\]/g, lead.nome)
      .replace(/\[NICHO\]/g, lead.nicho);
  };

  const handleSelectLead = (index: number) => {
    setCurrentLeadIndex(index);
    setObservacao('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setDataRetorno(undefined);
    setHoraRetorno('');
  };

  const handleDeleteLead = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover este lead?')) {
      const newLeads = [...leads];
      newLeads.splice(index, 1);
      setLeads(newLeads);
      if (currentLeadIndex >= newLeads.length) {
        setCurrentLeadIndex(Math.max(0, newLeads.length - 1));
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.nicho.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const currentLead = leads[currentLeadIndex];
  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-800',
    contatado: 'bg-blue-100 text-blue-800',
    agendado: 'bg-green-100 text-green-800',
    nao_interessado: 'bg-gray-100 text-gray-800',
    ligar_depois: 'bg-purple-100 text-purple-800'
  };

  const statusLabels = {
    pendente: 'Pendente',
    contatado: 'Contatado',
    agendado: 'Reunião Agendada',
    nao_interessado: 'Não Interessado',
    ligar_depois: 'Retornar Depois'
  };

  const renderStatusBadge = (status: Lead['status']) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cold Calls</h1>
          <p className="text-muted-foreground">Gestão de ligações e agendamentos</p>
        </div>
        <div className="flex gap-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar Leads
          </Button>
          <Button onClick={handleExportLeads} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Leads
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Scripts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Scripts</DialogTitle>
                <DialogDescription>
                  Edite os scripts de abordagem disponíveis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {scripts.map((script) => (
                  <Card key={script.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{script.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={script.conteudo}
                        onChange={(e) => {
                          const updatedScripts = scripts.map(s =>
                            s.id === script.id ? { ...s, conteudo: e.target.value } : s
                          );
                          setScripts(updatedScripts);
                        }}
                        className="min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {leads.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Barra lateral com filtros e lista de leads */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtrar Leads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Pesquisar</Label>
                  <Input
                    id="search"
                    placeholder="Nome, email ou nicho..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="contatado">Contatado</SelectItem>
                      <SelectItem value="agendado">Reunião Agendada</SelectItem>
                      <SelectItem value="nao_interessado">Não Interessado</SelectItem>
                      <SelectItem value="ligar_depois">Retornar Depois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader>
                <CardTitle>Lista de Leads ({filteredLeads.length})</CardTitle>
                <CardDescription>Selecione um lead para trabalhar</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md">
                  <div className="space-y-3">
                    {filteredLeads.map((lead, index) => (
                      <div 
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${leads.indexOf(lead) === currentLeadIndex ? 'bg-accent' : ''}`}
                        onClick={() => handleSelectLead(leads.indexOf(lead))}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold truncate">{lead.nome}</h3>
                          <div className="flex gap-2">
                            {renderStatusBadge(lead.status)}
                          </div>
                        </div>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          <p>{lead.nicho}</p>
                          <p>{lead.telefone}</p>
                          <div className="flex justify-between mt-2">
                            <span>
                              {lead.historicoLigacoes.length > 0 ? 
                                `${lead.historicoLigacoes.length} contato(s)` : 
                                'Nenhum contato'}
                            </span>
                            {(lead.dataReuniao || (lead.historicoLigacoes.length > 0 && 
                              lead.historicoLigacoes[lead.historicoLigacoes.length-1].dataRetorno)) && (
                              <span className="text-primary font-medium">
                                Próximo: {lead.dataReuniao ? 
                                  format(lead.dataReuniao, 'dd/MM') :
                                  lead.historicoLigacoes[lead.historicoLigacoes.length-1].dataRetorno ?
                                  format(lead.historicoLigacoes[lead.historicoLigacoes.length-1].dataRetorno!, 'dd/MM') : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-xl font-bold">{leads.filter(l => l.status === 'pendente').length}</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Contatados</p>
                    <p className="text-xl font-bold">{leads.filter(l => l.status === 'contatado').length}</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Agendados</p>
                    <p className="text-xl font-bold">{leads.filter(l => l.status === 'agendado').length}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Retornar</p>
                    <p className="text-xl font-bold">{leads.filter(l => l.status === 'ligar_depois').length}</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="text-xl font-bold">
                    {leads.length > 0 ? 
                      `${Math.round((leads.filter(l => l.status === 'agendado').length / leads.length) * 100)}%` : 
                      '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área central - Lead atual e ações */}
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Lead Atual</CardTitle>
                  <CardDescription>
                    {currentLead?.nome} - {renderStatusBadge(currentLead?.status)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={currentLeadIndex === 0}
                    onClick={handlePreviousLead}
                  >
                    ←
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={currentLeadIndex >= leads.length - 1}
                    onClick={handleNextLead}
                  >
                    →
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteLead(currentLeadIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Empresa</Label>
                    <p className="font-medium truncate">{currentLead.nome}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Telefone</Label>
                    <p className="font-medium">{currentLead.telefone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="font-medium truncate">{currentLead.email || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Localização</Label>
                    <p className="font-medium">{currentLead.localizacao || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Site</Label>
                    <p className="font-medium truncate">{currentLead.site || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nicho</Label>
                    <p className="font-medium">{currentLead.nicho || 'Não informado'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Adicione suas observações sobre o contato..."
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => handleUpdateStatus('contatado')} className="bg-blue-500 hover:bg-blue-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Marcar como Contatado
                  </Button>
                  <Button onClick={() => handleUpdateStatus('nao_interessado')} variant="outline">
                    <XCircle className="mr-2 h-4 w-4" />
                    Não Interessado
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Agendar Reunião
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agendar Reunião</DialogTitle>
                        <DialogDescription>
                          Selecione a data e horário da reunião
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={ptBR}
                        />
                        <div className="space-y-2">
                          <Label>Horário</Label>
                          <Input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleScheduleMeeting} className="w-full">
                          Confirmar Agendamento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:text-yellow-700">
                        <Clock className="mr-2 h-4 w-4" />
                        Ligar Depois
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agendar Retorno</DialogTitle>
                        <DialogDescription>
                          Selecione quando devemos ligar novamente
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Calendar
                          mode="single"
                          selected={dataRetorno}
                          onSelect={setDataRetorno}
                          locale={ptBR}
                        />
                        <div className="space-y-2">
                          <Label>Horário</Label>
                          <Input
                            type="time"
                            value={horaRetorno}
                            onChange={(e) => setHoraRetorno(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={() => handleUpdateStatus('ligar_depois')} 
                          className="w-full"
                        >
                          Confirmar Retorno
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Script de Abordagem</CardTitle>
                  <Select
                    value={selectedScript.id}
                    onValueChange={(value) => {
                      const script = scripts.find(s => s.id === value);
                      if (script) setSelectedScript(script);
                    }}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione um script" />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowScript(!showScript)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </CardHeader>
              {showScript && (
                <CardContent>
                  <ScrollArea className="h-[250px] w-full rounded-md border p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {formatarScript(selectedScript.conteudo)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              )}
            </Card>

            {currentLead.historicoLigacoes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Ligações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px] w-full rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Script</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Retorno</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLead.historicoLigacoes.map((historico, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(historico.data, 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>{historico.scriptUsado}</TableCell>
                            <TableCell>{statusLabels[historico.status]}</TableCell>
                            <TableCell>
                              {historico.dataRetorno 
                                ? format(historico.dataRetorno, 'dd/MM/yyyy HH:mm')
                                : '-'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Importe sua lista de leads para começar as ligações.
              O arquivo deve ser uma planilha Excel (.xlsx ou .xls) com as colunas: Nome, Telefone, Localização, E-mail, Site e Nicho.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColdCallsPage; 