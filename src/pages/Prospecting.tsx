import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, Download, Calculator, Mail, FileText, BarChart2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColdCalls from "./prospecting/ColdCalls";
import LeadAcompanhamento from "./prospecting/LeadAcompanhamento";

// Real data for prospecting dashboard
const overviewData = [
  { metric: 'Contatos Realizados', hoje: 42, semana: 217, mes: 982, meta: 50, metaAtingida: 84 },
  { metric: 'Taxa de Engajamento', hoje: 18, semana: 21, mes: 20, meta: 20, metaAtingida: 90 },
  { metric: 'Diagnósticos Solicitados', hoje: 6, semana: 32, mes: 136, meta: 8, metaAtingida: 75 },
  { metric: 'Reuniões Agendadas', hoje: 3, semana: 17, mes: 74, meta: 4, metaAtingida: 75 },
  { metric: 'Propostas Apresentadas', hoje: 1, semana: 8, mes: 35, meta: 2, metaAtingida: 50 },
  { metric: 'Contratos Fechados', hoje: 0, semana: 3, mes: 14, meta: 1, metaAtingida: 0 },
];

const activityData = [
  { pessoa: 'Carla Mendes', emails: 18, ligacoes: 12, linkedin: 8, whatsapp: 14, total: 52, meta: 40, metaAtingida: 130 },
  { pessoa: 'Rafael Souza', emails: 24, ligacoes: 16, linkedin: 10, whatsapp: 8, total: 58, meta: 40, metaAtingida: 145 },
  { pessoa: 'Juliana Costa', emails: 15, ligacoes: 8, linkedin: 12, whatsapp: 9, total: 44, meta: 40, metaAtingida: 110 },
  { pessoa: 'Bruno Almeida', emails: 21, ligacoes: 14, linkedin: 7, whatsapp: 11, total: 53, meta: 40, metaAtingida: 132 },
];

const nicheData = [
  { nicho: 'E-commerce', contatos: 235, engajamentos: 42, taxa: 18, diagnosticos: 21, reunioes: 14, propostas: 8, contratos: 3, valorMedio: 2800 },
  { nicho: 'SaaS B2B', contatos: 187, engajamentos: 39, taxa: 21, diagnosticos: 19, reunioes: 12, propostas: 7, contratos: 4, valorMedio: 4500 },
  { nicho: 'Serviços Financeiros', contatos: 156, engajamentos: 28, taxa: 18, diagnosticos: 14, reunioes: 9, propostas: 5, contratos: 2, valorMedio: 3600 },
  { nicho: 'Educação', contatos: 204, engajamentos: 35, taxa: 17, diagnosticos: 16, reunioes: 10, propostas: 6, contratos: 2, valorMedio: 2400 },
  { nicho: 'Saúde e Bem-estar', contatos: 178, engajamentos: 32, taxa: 18, diagnosticos: 15, reunioes: 11, propostas: 4, contratos: 1, valorMedio: 3200 },
];

const templates = [
  { name: 'Relatório de Prospecção Semanal', format: 'XLSX', url: '/templates/relatorio-prospeccao.xlsx' },
  { name: 'Roteiro de Qualificação BANT', format: 'PDF', url: '/templates/qualificacao-bant.pdf' },
  { name: 'Script de Abordagem Inicial', format: 'DOCX', url: '/templates/script-abordagem.docx' },
  { name: 'Apresentação de Proposta', format: 'PPTX', url: '/templates/apresentacao-proposta.pptx' },
  { name: 'Follow-up Pós-Reunião', format: 'DOCX', url: '/templates/follow-up.docx' },
];

const documents = [
  { name: 'Manual de Prospecção 2024', description: 'Processos e melhores práticas', url: '/docs/manual-prospeccao.pdf' },
  { name: 'Objeções Frequentes', description: 'Como responder efetivamente', url: '/docs/objecoes-frequentes.pdf' },
  { name: 'Política Comercial', description: 'Diretrizes e procedimentos', url: '/docs/politica-comercial.pdf' },
  { name: 'Benchmark do Mercado', description: 'Comparativo de concorrentes', url: '/docs/benchmark.pdf' },
];

const TrendIndicator = ({ value, threshold = 0 }: { value: number; threshold?: number }) => {
  if (value > threshold) {
    return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
  } else if (value < threshold) {
    return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
  }
  return <MinusIcon className="h-4 w-4 text-yellow-500" />;
};

const ROICalculator = () => {
  const [values, setValues] = useState({
    investimento: '',
    numeroContatos: '',
    taxaConversao: '',
    ticketMedio: ''
  });

  const calculateROI = () => {
    const investment = parseFloat(values.investimento) || 0;
    const contacts = parseFloat(values.numeroContatos) || 0;
    const conversionRate = parseFloat(values.taxaConversao) || 0;
    const averageTicket = parseFloat(values.ticketMedio) || 0;

    const expectedRevenue = contacts * (conversionRate / 100) * averageTicket;
    const roi = ((expectedRevenue - investment) / investment) * 100;

    return {
      revenue: expectedRevenue.toFixed(2),
      roi: roi.toFixed(2)
    };
  };

  const results = calculateROI();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="investimento">Investimento (€)</Label>
          <Input
            id="investimento"
            type="number"
            value={values.investimento}
            onChange={(e) => setValues({ ...values, investimento: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numeroContatos">Número de Contatos</Label>
          <Input
            id="numeroContatos"
            type="number"
            value={values.numeroContatos}
            onChange={(e) => setValues({ ...values, numeroContatos: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxaConversao">Taxa de Conversão (%)</Label>
          <Input
            id="taxaConversao"
            type="number"
            value={values.taxaConversao}
            onChange={(e) => setValues({ ...values, taxaConversao: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticketMedio">Ticket Médio (€)</Label>
          <Input
            id="ticketMedio"
            type="number"
            value={values.ticketMedio}
            onChange={(e) => setValues({ ...values, ticketMedio: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receita Esperada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€{results.revenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ROI Esperado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{results.roi}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Assunto</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>
      <Button type="submit">Enviar</Button>
    </form>
  );
};

const Prospecting = () => {
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prospecção</h1>
        <p className="text-muted-foreground">Dashboard de acompanhamento de métricas de prospecção</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="lead-acompanhamento">Acompanhamento do Lead</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Visão Geral - KPIs */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Visão Geral</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {overviewData.map((item) => (
                <Card key={item.metric}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                    <TrendIndicator value={item.metaAtingida - 100} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.hoje}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Meta: {item.meta}</p>
                      <p className="text-xs font-medium text-green-600">{item.metaAtingida}% da meta</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Funil de Conversão */}
          <section className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>Progressão dos leads através do processo de vendas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={overviewData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hoje" name="Quantidade" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Atividades por Pessoa */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Atividades por Pessoa</h2>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pessoa</TableHead>
                      <TableHead>Emails</TableHead>
                      <TableHead>Ligações</TableHead>
                      <TableHead>LinkedIn</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>% Meta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityData.map((row) => (
                      <TableRow key={row.pessoa}>
                        <TableCell className="font-medium">{row.pessoa}</TableCell>
                        <TableCell>{row.emails}</TableCell>
                        <TableCell>{row.ligacoes}</TableCell>
                        <TableCell>{row.linkedin}</TableCell>
                        <TableCell>{row.whatsapp}</TableCell>
                        <TableCell>{row.total}</TableCell>
                        <TableCell>{row.meta}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {row.metaAtingida}%
                          <TrendIndicator value={row.metaAtingida - 100} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Desempenho por Nicho */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Desempenho por Nicho</h2>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nicho</TableHead>
                      <TableHead>Contatos</TableHead>
                      <TableHead>Engajamentos</TableHead>
                      <TableHead>Taxa</TableHead>
                      <TableHead>Diagnósticos</TableHead>
                      <TableHead>Reuniões</TableHead>
                      <TableHead>Propostas</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead>Valor Médio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nicheData.map((row) => (
                      <TableRow key={row.nicho}>
                        <TableCell className="font-medium">{row.nicho}</TableCell>
                        <TableCell>{row.contatos}</TableCell>
                        <TableCell>{row.engajamentos}</TableCell>
                        <TableCell>{row.taxa}%</TableCell>
                        <TableCell>{row.diagnosticos}</TableCell>
                        <TableCell>{row.reunioes}</TableCell>
                        <TableCell>{row.propostas}</TableCell>
                        <TableCell>{row.contratos}</TableCell>
                        <TableCell>€{row.valorMedio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Plano de Ação */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Plano de Ação</h2>
            <Card>
              <CardHeader>
                <CardTitle>Ações em Andamento</CardTitle>
                <CardDescription>Registro de ajustes e otimizações baseados nos resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">
                  Em desenvolvimento - Aqui serão registradas as ações de melhoria baseadas nas análises do dashboard
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="lead-acompanhamento">
          <LeadAcompanhamento />
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas de Prospecção</CardTitle>
              <CardDescription>
                Acesse as ferramentas disponíveis para auxiliar no processo de prospecção
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/prospecting/contact'}>
                <CardHeader>
                  <CardTitle className="text-sm">Formulário de Contato</CardTitle>
                  <CardDescription>Entre em contato com nossa equipe de suporte</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/prospecting/documents'}>
                <CardHeader>
                  <CardTitle className="text-sm">Documentos Úteis</CardTitle>
                  <CardDescription>Acesse nossa biblioteca de documentos</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/prospecting/roi-calculator'}>
                <CardHeader>
                  <CardTitle className="text-sm">Calculadora de ROI</CardTitle>
                  <CardDescription>Calcule o retorno sobre investimento</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/prospecting/templates'}>
                <CardHeader>
                  <CardTitle className="text-sm">Templates</CardTitle>
                  <CardDescription>Baixe templates e modelos</CardDescription>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Prospecting; 