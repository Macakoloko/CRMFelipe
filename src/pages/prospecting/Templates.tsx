import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

const templates = [
  {
    name: 'Planilha de Análise de Leads',
    description: 'Template completo para qualificação e análise de leads (BANT)',
    format: 'XLSX',
    category: 'Análise',
    url: '/templates/analise-leads.xlsx'
  },
  {
    name: 'Dashboard de Métricas Comerciais',
    description: 'Painel de controle para acompanhamento diário das atividades',
    format: 'XLSX',
    category: 'Métricas',
    url: '/templates/dashboard-metricas.xlsx'
  },
  {
    name: 'Roteiro de Qualificação BANT',
    description: 'Guia passo a passo para qualificação de leads pelo método BANT',
    format: 'PDF',
    category: 'Processos',
    url: '/templates/qualificacao-bant.pdf'
  },
  {
    name: 'Script de Abordagem B2B',
    description: 'Modelo de script otimizado para primeiros contatos com empresas',
    format: 'DOCX',
    category: 'Comunicação',
    url: '/templates/script-b2b.docx'
  },
  {
    name: 'Apresentação de Proposta',
    description: 'Template profissional para apresentação de propostas comerciais',
    format: 'PPTX',
    category: 'Vendas',
    url: '/templates/apresentacao-proposta.pptx'
  },
  {
    name: 'Modelo de Follow-up',
    description: 'Templates de e-mails para diferentes etapas de follow-up',
    format: 'DOCX',
    category: 'Comunicação',
    url: '/templates/follow-up.docx'
  },
  {
    name: 'Plano de Prospecção Trimestral',
    description: 'Modelo para planejamento estratégico de ações de prospecção',
    format: 'XLSX',
    category: 'Estratégia',
    url: '/templates/plano-trimestral.xlsx'
  },
  {
    name: 'Calculadora de ROI',
    description: 'Planilha para cálculo de ROI de campanhas de prospecção',
    format: 'XLSX',
    category: 'Métricas',
    url: '/templates/calculadora-roi.xlsx'
  },
  {
    name: 'Cadência de Outbound',
    description: 'Modelo para definição de cadência de contatos multicanal',
    format: 'PDF',
    category: 'Processos',
    url: '/templates/cadencia-outbound.pdf'
  },
  {
    name: 'Email Sequence Builder',
    description: 'Template para criar sequências de emails automatizados',
    format: 'XLSX',
    category: 'Automação',
    url: '/templates/email-sequence.xlsx'
  },
  {
    name: 'Mapeamento de Stakeholders',
    description: 'Ferramenta para mapeamento de decisores em contas estratégicas',
    format: 'PPTX',
    category: 'Estratégia',
    url: '/templates/mapeamento-stakeholders.pptx'
  },
  {
    name: 'Objeções e Respostas',
    description: 'Guia completo de respostas para objeções comuns',
    format: 'PDF',
    category: 'Vendas',
    url: '/templates/objecoes-respostas.pdf'
  }
];

const TemplatesPage = () => {
  const categories = [...new Set(templates.map(template => template.category))];

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">Modelos e templates para suas atividades de prospecção</p>
      </div>

      {categories.map(category => (
        <section key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter(template => template.category === category)
              .map((template) => (
                <Card key={template.name}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Formato: {template.format}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Baixar
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TemplatesPage; 