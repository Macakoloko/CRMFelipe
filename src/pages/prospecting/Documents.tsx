import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

const documents = [
  { 
    name: 'Manual de Prospecção 2024', 
    description: 'Guia completo com estratégias e metodologias atualizadas', 
    url: '/docs/manual-prospeccao-2024.pdf',
    category: 'Guias'
  },
  { 
    name: 'Política Comercial', 
    description: 'Diretrizes e procedimentos para negociações', 
    url: '/docs/politica-comercial.pdf',
    category: 'Políticas'
  },
  { 
    name: 'Objeções Frequentes', 
    description: 'Como responder efetivamente às principais objeções', 
    url: '/docs/objecoes-frequentes.pdf',
    category: 'Suporte'
  },
  { 
    name: 'Benchmark do Mercado', 
    description: 'Análise comparativa de concorrentes e suas estratégias', 
    url: '/docs/benchmark-mercado.pdf',
    category: 'Análises'
  },
  { 
    name: 'Guia de Cadência Multicanal', 
    description: 'Estratégias para sequências de contato eficientes', 
    url: '/docs/guia-cadencia.pdf',
    category: 'Guias'
  },
  { 
    name: 'Técnicas de Qualificação Avançada', 
    description: 'Metodologias BANT, MEDDIC e outras para qualificação', 
    url: '/docs/tecnicas-qualificacao.pdf',
    category: 'Guias'
  },
  { 
    name: 'Política de Descontos', 
    description: 'Regras e limitações para ofertas promocionais', 
    url: '/docs/politica-descontos.pdf',
    category: 'Políticas'
  },
  { 
    name: 'Perfis de Clientes Ideais (ICP)', 
    description: 'Detalhamento dos perfis de clientes prioritários', 
    url: '/docs/perfis-clientes-ideais.pdf',
    category: 'Análises'
  },
  { 
    name: 'FAQ - Perguntas Frequentes', 
    description: 'Respostas para as dúvidas mais comuns dos prospects', 
    url: '/docs/faq-comercial.pdf',
    category: 'Suporte'
  },
  { 
    name: 'Guia de Integração com CRM', 
    description: 'Como utilizar o CRM para otimizar a prospecção', 
    url: '/docs/integracao-crm.pdf',
    category: 'Técnico'
  },
  { 
    name: 'Requisitos Técnicos', 
    description: 'Especificações técnicas dos produtos e serviços', 
    url: '/docs/requisitos-tecnicos.pdf',
    category: 'Técnico'
  },
];

const DocumentsPage = () => {
  const categories = [...new Set(documents.map(doc => doc.category))];

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos Úteis</h1>
        <p className="text-muted-foreground">Biblioteca de documentos para auxiliar no processo de prospecção</p>
      </div>

      {categories.map(category => (
        <section key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents
              .filter(doc => doc.category === category)
              .map((doc) => (
                <Card key={doc.name}>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
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

export default DocumentsPage; 