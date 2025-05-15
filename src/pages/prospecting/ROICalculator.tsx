import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROICalculatorPage = () => {
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
    const roi = investment > 0 ? ((expectedRevenue - investment) / investment) * 100 : 0;

    return {
      revenue: expectedRevenue.toFixed(2),
      roi: roi.toFixed(2),
      leadsGerados: Math.round(contacts * (conversionRate / 100)),
      custoLeadMedio: contacts > 0 ? (investment / contacts).toFixed(2) : '0.00'
    };
  };

  const results = calculateROI();

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de ROI</h1>
        <p className="text-muted-foreground">Calcule o retorno sobre investimento da sua prospecção</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Campanha</CardTitle>
            <CardDescription>
              Insira os dados da sua campanha de prospecção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investimento">Investimento Total (€)</Label>
              <Input
                id="investimento"
                type="number"
                value={values.investimento}
                onChange={(e) => setValues({ ...values, investimento: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroContatos">Número de Contatos Previstos</Label>
              <Input
                id="numeroContatos"
                type="number"
                value={values.numeroContatos}
                onChange={(e) => setValues({ ...values, numeroContatos: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxaConversao">Taxa de Conversão Esperada (%)</Label>
              <Input
                id="taxaConversao"
                type="number"
                value={values.taxaConversao}
                onChange={(e) => setValues({ ...values, taxaConversao: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticketMedio">Ticket Médio (€)</Label>
              <Input
                id="ticketMedio"
                type="number"
                value={values.ticketMedio}
                onChange={(e) => setValues({ ...values, ticketMedio: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados Projetados</CardTitle>
            <CardDescription>
              Análise dos resultados esperados com base nos dados fornecidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Leads Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{results.leadsGerados}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Custo por Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">€{results.custoLeadMedio}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Análise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {results.roi > 0
                    ? `Com base nas projeções, a campanha deve gerar um retorno positivo de ${results.roi}% sobre o investimento.`
                    : 'Insira os dados da campanha para ver a análise de ROI.'}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculatorPage; 