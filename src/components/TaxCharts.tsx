import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  Layers,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
  CheckCircle2,
  HelpCircle,
  Activity,
  Sparkles,
  Clock,
  Milestone,
  FileSpreadsheet,
  Building2,
  Percent,
  Check,
} from 'lucide-react';
import { SimulationSummary } from '../types/tax';

interface TaxChartsProps {
  summary: SimulationSummary;
}

type TaxItemKey = 'pis_cofins' | 'ipi' | 'icms' | 'iss' | 'cbs' | 'ibs' | 'is' | 'das';

interface TaxTransitionProfile {
  id: TaxItemKey;
  name: string;
  sphere: 'Federal' | 'Estadual' | 'Municipal' | 'Subnacional' | 'Regime Especial';
  color: string;
  badgeBg: string;
  badgeText: string;
  status2026: string;
  status2027: string;
  status2029: string;
  status2033: string;
  summary: string;
  legalBase: string;
  ruleInSimples: string;
  timeline: { year: number; pctOrStatus: string; desc: string; phase: 'active' | 'transition' | 'extinct' | 'full' }[];
}

const TAX_PROFILES: Record<TaxItemKey, TaxTransitionProfile> = {
  pis_cofins: {
    id: 'pis_cofins',
    name: 'PIS e COFINS',
    sphere: 'Federal',
    color: '#6366f1',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-800',
    status2026: '100% Vigente (+ 0,9% teste CBS compensável)',
    status2027: 'EXTINTO Definitivamente',
    status2029: 'Extinto',
    status2033: 'Extinto',
    summary: 'O PIS e a COFINS serão totalmente extintos em 1º de janeiro de 2027, sendo substituídos de forma imediata pela CBS (Contribuição sobre Bens e Serviços).',
    legalBase: 'Art. 126 do ADCT (EC 132/2023)',
    ruleInSimples: 'No Simples Nacional Simplificado, a parcela de PIS/COFINS na DAS é suprimida em 2027 com a criação da CBS unificada na alíquota do Simples.',
    timeline: [
      { year: 2026, pctOrStatus: '100%', desc: 'Vigência normal das alíquotas atuais', phase: 'active' },
      { year: 2027, pctOrStatus: '0% (Extinto)', desc: 'Extinção total e substituição pela CBS', phase: 'extinct' },
      { year: 2028, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
      { year: 2029, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
      { year: 2030, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
      { year: 2031, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
      { year: 2032, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
      { year: 2033, pctOrStatus: '0% (Extinto)', desc: 'Totalmente extinto', phase: 'extinct' },
    ],
  },
  ipi: {
    id: 'ipi',
    name: 'IPI (Imposto sobre Produtos Industrializados)',
    sphere: 'Federal',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 border-purple-200',
    badgeText: 'text-purple-800',
    status2026: '100% Vigente (TIPI normal)',
    status2027: 'Alíquota Zero (exceto ZFM)',
    status2029: 'Alíquota Zero (exceto ZFM)',
    status2033: 'Restrito à ZFM',
    summary: 'A partir de 2027, as alíquotas do IPI são zeradas para todos os produtos fabricados no país, exceto aqueles que possuem produção incentivada na Zona Franca de Manaus.',
    legalBase: 'Art. 126, III do ADCT (EC 132/2023)',
    ruleInSimples: 'Indústrias no Simples deixam de ter a parcela de IPI na DAS para a grande maioria das NCMs.',
    timeline: [
      { year: 2026, pctOrStatus: '100%', desc: 'Tabela TIPI em vigor normal', phase: 'active' },
      { year: 2027, pctOrStatus: 'Alíquota 0%', desc: 'Zerado para todos os itens sem produção na ZFM', phase: 'transition' },
      { year: 2028, pctOrStatus: 'Alíquota 0%', desc: 'Zerado para todos os itens sem produção na ZFM', phase: 'transition' },
      { year: 2029, pctOrStatus: 'Alíquota 0%', desc: 'Mantido apenas como diferencial da ZFM', phase: 'transition' },
      { year: 2030, pctOrStatus: 'Alíquota 0%', desc: 'Mantido apenas como diferencial da ZFM', phase: 'transition' },
      { year: 2031, pctOrStatus: 'Alíquota 0%', desc: 'Mantido apenas como diferencial da ZFM', phase: 'transition' },
      { year: 2032, pctOrStatus: 'Alíquota 0%', desc: 'Mantido apenas como diferencial da ZFM', phase: 'transition' },
      { year: 2033, pctOrStatus: 'Restrito ZFM', desc: 'Regime definitivo protetivo da ZFM', phase: 'extinct' },
    ],
  },
  icms: {
    id: 'icms',
    name: 'ICMS (Estadual)',
    sphere: 'Estadual',
    color: '#0284c7',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-800',
    status2026: '100% Vigente',
    status2027: '100% Vigente (Dentro do DAS e Regime Normal)',
    status2029: '90% Vigente (Redução de 10%)',
    status2033: 'EXTINTO Definitivamente (100% absorvido pelo IBS)',
    summary: 'O ICMS permanece 100% ativo entre 2026 e 2028. De 2029 a 2032, reduz à razão de 1/10 ao ano (90%, 80%, 70%, 60%) até sua extinção definitiva em 2033.',
    legalBase: 'Arts. 128, 129 e 130 do ADCT (EC 132/2023)',
    ruleInSimples: 'Na Guia DAS do Simples Nacional, o percentual de ICMS é reduzido nas mesmas proporções de 2029 a 2032 no Simples Híbrido e compensado pelo IBS.',
    timeline: [
      { year: 2026, pctOrStatus: '100%', desc: 'Vigência plena nos 26 estados e DF', phase: 'active' },
      { year: 2027, pctOrStatus: '100%', desc: 'Mantido integralmente na DAS e no regime normal', phase: 'active' },
      { year: 2028, pctOrStatus: '100%', desc: 'Mantido integralmente na DAS e no regime normal', phase: 'active' },
      { year: 2029, pctOrStatus: '90% (9/10)', desc: 'Início da transição: redução de 10% da carga', phase: 'transition' },
      { year: 2030, pctOrStatus: '80% (8/10)', desc: 'Redução progressiva de 20% da carga', phase: 'transition' },
      { year: 2031, pctOrStatus: '70% (7/10)', desc: 'Redução progressiva de 30% da carga', phase: 'transition' },
      { year: 2032, pctOrStatus: '60% (6/10)', desc: 'Redução progressiva de 40% da carga', phase: 'transition' },
      { year: 2033, pctOrStatus: '0% (Extinto)', desc: 'Extinção definitiva e unificação pelo IBS', phase: 'extinct' },
    ],
  },
  iss: {
    id: 'iss',
    name: 'ISS / ISSQN (Municipal)',
    sphere: 'Municipal',
    color: '#0d9488',
    badgeBg: 'bg-teal-50 border-teal-200',
    badgeText: 'text-teal-800',
    status2026: '100% Vigente',
    status2027: '100% Vigente (Dentro do DAS e Municípios)',
    status2029: '90% Vigente (Redução de 10%)',
    status2033: 'EXTINTO Definitivamente (100% absorvido pelo IBS)',
    summary: 'O ISS municipal segue rigorosamente o mesmo cronograma de transição do ICMS: mantido integralmente até 2028, com redução linear de 10% a.a. entre 2029 e 2032 e extinção em 2033.',
    legalBase: 'Arts. 128, 129 e 130 do ADCT (EC 132/2023)',
    ruleInSimples: 'Para prestadores de serviços (Anexos III, IV e V), o ISS é o tributo de maior peso na DAS até 2028, iniciando sua transferência gradual para o IBS em 2029.',
    timeline: [
      { year: 2026, pctOrStatus: '100%', desc: 'Vigência plena nos 5.570 municípios', phase: 'active' },
      { year: 2027, pctOrStatus: '100%', desc: 'Mantido integralmente na DAS e nos municípios', phase: 'active' },
      { year: 2028, pctOrStatus: '100%', desc: 'Mantido integralmente na DAS e nos municípios', phase: 'active' },
      { year: 2029, pctOrStatus: '90% (9/10)', desc: 'Redução de 10% do ISS municipal', phase: 'transition' },
      { year: 2030, pctOrStatus: '80% (8/10)', desc: 'Redução de 20% do ISS municipal', phase: 'transition' },
      { year: 2031, pctOrStatus: '70% (7/10)', desc: 'Redução de 30% do ISS municipal', phase: 'transition' },
      { year: 2032, pctOrStatus: '60% (6/10)', desc: 'Redução de 40% do ISS municipal', phase: 'transition' },
      { year: 2033, pctOrStatus: '0% (Extinto)', desc: 'Extinção definitiva e substituição pelo IBS', phase: 'extinct' },
    ],
  },
  cbs: {
    id: 'cbs',
    name: 'CBS (Contribuição sobre Bens e Serviços)',
    sphere: 'Federal',
    color: '#4f46e5',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-800',
    status2026: '0,9% (Alíquota Teste Compensável)',
    status2027: '100% Plena (~8,80%)',
    status2029: '100% Plena (~8,80%)',
    status2033: '100% Plena (~8,80%)',
    summary: 'Novo IVA Federal que substitui o PIS e a COFINS. Inicia em 2026 com alíquota de teste de 0,9% e atinge vigência e alíquota plena em 2027 (~8,8%).',
    legalBase: 'Art. 195, V da CF/88 e Arts. 125 e 126 do ADCT',
    ruleInSimples: 'No Simples Simplificado, a CBS é calculada dentro da alíquota unificada da DAS. No Simples Híbrido, é apurada por fora gerando crédito de 100% da CBS para compradores PJ.',
    timeline: [
      { year: 2026, pctOrStatus: '0,9% (Teste)', desc: 'Alíquota de teste dedutível do PIS/COFINS', phase: 'transition' },
      { year: 2027, pctOrStatus: '100% (~8,8%)', desc: 'Implementação plena da CBS Federal', phase: 'full' },
      { year: 2028, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena da CBS Federal', phase: 'full' },
      { year: 2029, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena da CBS Federal', phase: 'full' },
      { year: 2030, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena da CBS Federal', phase: 'full' },
      { year: 2031, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena da CBS Federal', phase: 'full' },
      { year: 2032, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena da CBS Federal', phase: 'full' },
      { year: 2033, pctOrStatus: '100% (~8,8%)', desc: 'Vigência plena compondo o IVA Dual', phase: 'full' },
    ],
  },
  ibs: {
    id: 'ibs',
    name: 'IBS (Imposto sobre Bens e Serviços)',
    sphere: 'Subnacional',
    color: '#059669',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-800',
    status2026: '0,1% (Alíquota Teste Compensável)',
    status2027: '0,1% (0,05% Estado + 0,05% Município)',
    status2029: '10% da Alíquota de Referência (~1,77%)',
    status2033: '100% Pleno (~17,70%)',
    summary: 'Novo IVA Estadual e Municipal gerido pelo Comitê Gestor do IBS. Absorve gradualmente o ICMS e o ISS entre 2029 e 2032 até sua concretização plena em 2033 (~17,7%).',
    legalBase: 'Art. 156-A da CF/88 e Arts. 125, 127 a 130 do ADCT',
    ruleInSimples: 'No Simples Híbrido, o contribuinte recolhe o IBS por fora da DAS com não-cumulatividade ampla, permitindo repassar créditos cheios a adquirentes B2B.',
    timeline: [
      { year: 2026, pctOrStatus: '0,1% (Teste)', desc: 'Alíquota teste compensável', phase: 'transition' },
      { year: 2027, pctOrStatus: '0,1% (Teste)', desc: '0,05% Estado + 0,05% Município', phase: 'transition' },
      { year: 2028, pctOrStatus: '0,1% (Teste)', desc: '0,05% Estado + 0,05% Município', phase: 'transition' },
      { year: 2029, pctOrStatus: '10% (~1,77%)', desc: 'Início da absorção do ICMS e ISS (1/10)', phase: 'transition' },
      { year: 2030, pctOrStatus: '20% (~3,54%)', desc: 'Evolução para 20% da alíquota de referência', phase: 'transition' },
      { year: 2031, pctOrStatus: '30% (~5,31%)', desc: 'Evolução para 30% da alíquota de referência', phase: 'transition' },
      { year: 2032, pctOrStatus: '40% (~7,08%)', desc: 'Evolução para 40% da alíquota de referência', phase: 'transition' },
      { year: 2033, pctOrStatus: '100% (~17,7%)', desc: 'Vigência definitiva e unificação do ICMS/ISS', phase: 'full' },
    ],
  },
  is: {
    id: 'is',
    name: 'Imposto Seletivo (IS - "Imposto do Pecado")',
    sphere: 'Federal',
    color: '#e11d48',
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-800',
    status2026: 'Em Regulamentação',
    status2027: 'Vigência Plena sobre Bens Nocivos',
    status2029: 'Vigência Plena',
    status2033: 'Vigência Plena',
    summary: 'Tributo federal monofásico e não-cumulativo incidente sobre a produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente (cigarros, bebidas alcoólicas, bebidas açucaradas, veículos poluentes e minérios).',
    legalBase: 'Art. 153, VIII da CF/88 e Lei Complementar',
    ruleInSimples: 'O IS não integra a Guia DAS e não gera créditos para a cadeia produtiva posterior.',
    timeline: [
      { year: 2026, pctOrStatus: 'Preparação', desc: 'Regulamentação de alíquotas e fatos geradores', phase: 'active' },
      { year: 2027, pctOrStatus: 'Vigente', desc: 'Início da incidência sobre itens listados', phase: 'full' },
      { year: 2028, pctOrStatus: 'Vigente', desc: 'Incidência monofásica federal', phase: 'full' },
      { year: 2029, pctOrStatus: 'Vigente', desc: 'Incidência monofásica federal', phase: 'full' },
      { year: 2030, pctOrStatus: 'Vigente', desc: 'Incidência monofásica federal', phase: 'full' },
      { year: 2031, pctOrStatus: 'Vigente', desc: 'Incidência monofásica federal', phase: 'full' },
      { year: 2032, pctOrStatus: 'Vigente', desc: 'Incidência monofásica federal', phase: 'full' },
      { year: 2033, pctOrStatus: 'Vigente', desc: 'Regime definitivo do Imposto Seletivo', phase: 'full' },
    ],
  },
  das: {
    id: 'das',
    name: 'Guia DAS (Simples Nacional)',
    sphere: 'Regime Especial',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-800',
    status2026: 'DAS Tradicional (com PIS/COFINS/ICMS/ISS/IRPJ/CSLL/CPP)',
    status2027: 'DAS Reformada com Opção Híbrida (Opção IBS/CBS por fora)',
    status2029: 'DAS com Redução de 10% no ICMS/ISS (se no Híbrido)',
    status2033: 'DAS Federal (IRPJ, CSLL, CPP) + IBS/CBS no modelo definitivo',
    summary: 'O Simples Nacional é mantido constitucionalmente. As empresas podem continuar no regime unificado tradicional (com crédito proporcional restrito) ou optar pelo Simples Híbrido (recolhendo IBS/CBS por fora com crédito cheio para clientes PJ).',
    legalBase: 'Art. 146, III, "d" e Art. 146-A da CF/88',
    ruleInSimples: 'Garante a blindagem da micro e pequena empresa com a flexibilidade de neutralizar a perda de competitividade em operações B2B.',
    timeline: [
      { year: 2026, pctOrStatus: 'DAS Padrão', desc: 'Recolhimento dos 8 tributos unificados', phase: 'active' },
      { year: 2027, pctOrStatus: 'Opção Híbrida', desc: 'Possibilidade de recolher IBS/CBS por fora da DAS', phase: 'transition' },
      { year: 2028, pctOrStatus: 'Opção Híbrida', desc: 'Manutenção integral do ICMS/ISS na DAS', phase: 'transition' },
      { year: 2029, pctOrStatus: 'Redução ICMS/ISS', desc: 'DAS tem parcela estadual/municipal reduzida em 10%', phase: 'transition' },
      { year: 2030, pctOrStatus: 'Redução ICMS/ISS', desc: 'DAS tem parcela estadual/municipal reduzida em 20%', phase: 'transition' },
      { year: 2031, pctOrStatus: 'Redução ICMS/ISS', desc: 'DAS tem parcela estadual/municipal reduzida em 30%', phase: 'transition' },
      { year: 2032, pctOrStatus: 'Redução ICMS/ISS', desc: 'DAS tem parcela estadual/municipal reduzida em 40%', phase: 'transition' },
      { year: 2033, pctOrStatus: 'DAS Consolidada', desc: 'DAS foca nos tributos federais e previdência', phase: 'full' },
    ],
  },
};

// Timeline data for the evolution of tax rates / percentages
const TAX_EVOLUTION_CHART_DATA = [
  {
    year: '2026',
    label: '2026 (Teste)',
    pisCofins: 100,
    icmsIss: 100,
    ipi: 100,
    cbs: 0.9,
    ibs: 0.1,
    ivaDual: 1.0,
  },
  {
    year: '2027',
    label: '2027 (CBS Plena)',
    pisCofins: 0,
    icmsIss: 100,
    ipi: 0,
    cbs: 8.8,
    ibs: 0.1,
    ivaDual: 8.9,
  },
  {
    year: '2028',
    label: '2028 (CBS Plena)',
    pisCofins: 0,
    icmsIss: 100,
    ipi: 0,
    cbs: 8.8,
    ibs: 0.1,
    ivaDual: 8.9,
  },
  {
    year: '2029',
    label: '2029 (IBS 10%)',
    pisCofins: 0,
    icmsIss: 90,
    ipi: 0,
    cbs: 8.8,
    ibs: 1.77,
    ivaDual: 10.57,
  },
  {
    year: '2030',
    label: '2030 (IBS 20%)',
    pisCofins: 0,
    icmsIss: 80,
    ipi: 0,
    cbs: 8.8,
    ibs: 3.54,
    ivaDual: 12.34,
  },
  {
    year: '2031',
    label: '2031 (IBS 30%)',
    pisCofins: 0,
    icmsIss: 70,
    ipi: 0,
    cbs: 8.8,
    ibs: 5.31,
    ivaDual: 14.11,
  },
  {
    year: '2032',
    label: '2032 (IBS 40%)',
    pisCofins: 0,
    icmsIss: 60,
    ipi: 0,
    cbs: 8.8,
    ibs: 7.08,
    ivaDual: 15.88,
  },
  {
    year: '2033',
    label: '2033 (Plena)',
    pisCofins: 0,
    icmsIss: 0,
    ipi: 0,
    cbs: 8.8,
    ibs: 17.7,
    ivaDual: 26.5,
  },
];

export const TaxCharts: React.FC<TaxChartsProps> = ({ summary }) => {
  const { results, input, transitionSchedule } = summary;
  const [selectedTax, setSelectedTax] = useState<TaxItemKey>('cbs');
  const [chartViewMode, setChartViewMode] = useState<'taxes_trajectory' | 'company_transition_cost'>('taxes_trajectory');

  const comparisonData = [
    {
      name: 'Simples Simplificado',
      shortName: 'Simplificado',
      totalAnual: results.simples_simplificado.totalAnnualTax,
      aliquotaEfetiva: Number(results.simples_simplificado.effectiveRatePct.toFixed(2)),
      das: results.simples_simplificado.das.totalDas * 12,
      ibsCbs: results.simples_simplificado.ibsCbs.netPayable * 12,
      folha: results.simples_simplificado.payrollCharges.totalPayrollTaxes * 12,
      lucroLiquido: results.simples_simplificado.estimatedNetProfitAnnual,
      margemSemImpostos: Number(results.simples_simplificado.profitMarginBeforeTaxesPct.toFixed(1)),
      margemComImpostos: Number(results.simples_simplificado.profitMarginAfterTaxesPct.toFixed(1)),
    },
    {
      name: 'Simples Híbrido',
      shortName: 'Híbrido',
      totalAnual: results.simples_hibrido.totalAnnualTax,
      aliquotaEfetiva: Number(results.simples_hibrido.effectiveRatePct.toFixed(2)),
      das: results.simples_hibrido.das.totalDas * 12,
      ibsCbs: results.simples_hibrido.ibsCbs.netPayable * 12,
      folha: results.simples_hibrido.payrollCharges.totalPayrollTaxes * 12,
      lucroLiquido: results.simples_hibrido.estimatedNetProfitAnnual,
      margemSemImpostos: Number(results.simples_hibrido.profitMarginBeforeTaxesPct.toFixed(1)),
      margemComImpostos: Number(results.simples_hibrido.profitMarginAfterTaxesPct.toFixed(1)),
    },
    {
      name: 'Lucro Presumido',
      shortName: 'Presumido',
      totalAnual: results.lucro_presumido.totalAnnualTax,
      aliquotaEfetiva: Number(results.lucro_presumido.effectiveRatePct.toFixed(2)),
      das: results.lucro_presumido.das.totalDas * 12,
      ibsCbs: results.lucro_presumido.ibsCbs.netPayable * 12,
      folha: results.lucro_presumido.payrollCharges.totalPayrollTaxes * 12,
      lucroLiquido: results.lucro_presumido.estimatedNetProfitAnnual,
      margemSemImpostos: Number(results.lucro_presumido.profitMarginBeforeTaxesPct.toFixed(1)),
      margemComImpostos: Number(results.lucro_presumido.profitMarginAfterTaxesPct.toFixed(1)),
    },
    {
      name: 'Lucro Real',
      shortName: 'Real',
      totalAnual: results.lucro_real.totalAnnualTax,
      aliquotaEfetiva: Number(results.lucro_real.effectiveRatePct.toFixed(2)),
      das: results.lucro_real.das.totalDas * 12,
      ibsCbs: results.lucro_real.ibsCbs.netPayable * 12,
      folha: results.lucro_real.payrollCharges.totalPayrollTaxes * 12,
      lucroLiquido: results.lucro_real.estimatedNetProfitAnnual,
      margemSemImpostos: Number(results.lucro_real.profitMarginBeforeTaxesPct.toFixed(1)),
      margemComImpostos: Number(results.lucro_real.profitMarginAfterTaxesPct.toFixed(1)),
    },
  ];

  // Company transition simulation trajectory data
  const companyYearlyCostData = (transitionSchedule || []).map((t) => ({
    year: String(t.year),
    label: t.label,
    simplificado: t.dasTotal,
    hibrido: t.simplesHibridoTotal,
    presumido: t.lucroPresumidoTotal,
    real: t.lucroRealTotal,
    icmsIssPct: t.icmsIssRemainingPct,
    ibsCbsPct: t.totalIvaDualRatePct,
  }));

  const formatCurrency = (val?: number | null) =>
    `R$ ${(Number(val) || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

  const currentProfile = TAX_PROFILES[selectedTax];

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* SEÇÃO PRINCIPAL: PANORAMA COMPLETO DA TRANSIÇÃO DE CADA IMPOSTO (2026-2033) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800 space-y-6">
        {/* Header do Panorama */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Milestone className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300 font-mono">
                EC 132/2023 • Cronograma Oficial
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Panorama da Transição de Cada Imposto até 2033
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 font-medium max-w-3xl leading-relaxed">
              Acompanhe graficamente e em detalhes a extinção gradual do <strong>PIS, COFINS, IPI, ICMS e ISS</strong> e a implementação progressiva da <strong>CBS e do IBS (IVA Dual)</strong> até a sua concretização plena.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-indigo-700/60 self-start md:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setChartViewMode('taxes_trajectory')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'taxes_trajectory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Evolução das Alíquotas</span>
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('company_transition_cost')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'company_transition_cost'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Custo Real da Empresa (R$)</span>
            </button>
          </div>
        </div>

        {/* 1. GRÁFICO DINÂMICO DE TRANSIÇÃO */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-indigo-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                {chartViewMode === 'taxes_trajectory' ? (
                  <>
                    <Percent className="w-4 h-4 text-emerald-400" />
                    <span>Curva de Substituição dos Tributos Atuais pelos Novos Tributos (2026 – 2033)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                    <span>Projeção do Custo Mensal da Sua Empresa na Transição (R$/mês)</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-indigo-300 font-medium">
                {chartViewMode === 'taxes_trajectory'
                  ? 'Exibição da transição de alíquotas: CBS (Federal), IBS (Subnacional), ICMS/ISS (% remanescente) e extinção do PIS/COFINS.'
                  : 'Comparativo do valor mensal a recolher em cada ano de transição nos regimes tributários elegíveis.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 2026 (Teste)
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400"></span> 2027-2028 (CBS Plena)
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span> 2029-2032 (Transição IBS)
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span> 2033 (Plena)
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartViewMode === 'taxes_trajectory' ? (
                <AreaChart data={TAX_EVOLUTION_CHART_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorIvaDual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorCbs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorIbs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${Number(value).toFixed(2)}%`,
                      name === 'ivaDual'
                        ? 'IVA Dual (IBS + CBS Total)'
                        : name === 'cbs'
                        ? 'Alíquota CBS Federal'
                        : name === 'ibs'
                        ? 'Alíquota IBS Estadual/Municipal'
                        : name === 'icmsIss'
                        ? 'Parcela ICMS/ISS Remanescente'
                        : 'PIS/COFINS Remanescente',
                    ]}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#cbd5e1' }}
                  />
                  <Legend
                    formatter={(val) =>
                      val === 'ivaDual'
                        ? 'IVA Dual Total (CBS + IBS)'
                        : val === 'cbs'
                        ? 'CBS (Federal)'
                        : val === 'ibs'
                        ? 'IBS (Estadual/Mun.)'
                        : val === 'icmsIss'
                        ? 'ICMS / ISS Remanescente (%)'
                        : 'PIS / COFINS'
                    }
                  />
                  <Area type="monotone" dataKey="ivaDual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIvaDual)" />
                  <Line type="monotone" dataKey="cbs" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ibs" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="icmsIss" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pisCofins" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
              ) : (
                <LineChart data={companyYearlyCostData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value)),
                      name === 'simplificado'
                        ? 'Simples Simplificado'
                        : name === 'hibrido'
                        ? 'Simples Híbrido'
                        : name === 'presumido'
                        ? 'Lucro Presumido'
                        : 'Lucro Real',
                    ]}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#cbd5e1' }}
                  />
                  <Legend
                    formatter={(val) =>
                      val === 'simplificado'
                        ? 'Simples Simplificado'
                        : val === 'hibrido'
                        ? 'Simples Híbrido'
                        : val === 'presumido'
                        ? 'Lucro Presumido'
                        : 'Lucro Real'
                    }
                  />
                  <Line type="monotone" dataKey="simplificado" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="hibrido" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="presumido" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="real" stroke="#ec4899" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. SELETOR DE IMPOSTOS COM CRONOGRAMA INTERATIVO */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span>Explorar Detalhes de Cada Imposto na Reforma</span>
              </h3>
              <p className="text-xs text-indigo-200 font-medium">
                Clique no imposto abaixo para verificar sua esfera, base legal, cronograma e impacto no Simples Nacional:
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-700/50 self-start sm:self-auto">
              Selecione para auditar regras
            </span>
          </div>

          {/* Abas / Botões dos Tributos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {(Object.keys(TAX_PROFILES) as TaxItemKey[]).map((key) => {
              const profile = TAX_PROFILES[key];
              const isSelected = selectedTax === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTax(key)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-lg scale-102 ring-2 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/90 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    {profile.sphere}
                  </span>
                  <span className="text-xs font-black truncate mt-1">
                    {profile.name.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] font-bold mt-1.5 px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-700 text-slate-300'}`}>
                    {key === 'cbs' || key === 'ibs' ? 'Novo IVA' : key === 'das' ? 'Simples' : 'Atual'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Card Detalhado do Tributo Selecionado */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white text-slate-900 border border-indigo-100 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-sm">
                  {currentProfile.sphere}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {currentProfile.name}
                  </h4>
                  <span className="text-xs font-bold text-indigo-700">
                    Fundamentação Legal: {currentProfile.legalBase}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentProfile.badgeBg} ${currentProfile.badgeText}`}>
                  Status 2027: {currentProfile.status2027}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block text-[11px]">
                  📌 Resumo da Transição
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {currentProfile.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[11px]">
                  💡 Impacto no Simples Nacional
                </span>
                <p className="text-indigo-900 leading-relaxed font-medium">
                  {currentProfile.ruleInSimples}
                </p>
              </div>
            </div>

            {/* Linha do Tempo Ano a Ano do Imposto */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Cronograma de Vigência Ano a Ano (2026 a 2033)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {currentProfile.timeline.map((item) => (
                  <div
                    key={item.year}
                    className={`p-2.5 rounded-xl border text-center flex flex-col justify-between ${
                      item.phase === 'active'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : item.phase === 'transition'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : item.phase === 'extinct'
                        ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <span className="text-[10px] font-black text-slate-500 font-mono">
                      {item.year}
                    </span>
                    <span className="text-xs font-black my-1 block">
                      {item.pctOrStatus}
                    </span>
                    <span className="text-[9px] font-medium leading-tight opacity-80 line-clamp-2">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. MATRIZ RESUMIDA COMPARATIVA DA TRANSIÇÃO TRIBUTO A TRIBUTO */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-white">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-200">
              Matriz Geral da Transição Tributo a Tributo (EC 132/2023)
            </h3>
          </div>

          <div className="border border-indigo-800 rounded-2xl overflow-hidden shadow-inner bg-slate-900/90 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-indigo-900/80 text-indigo-200 font-bold border-b border-indigo-800 text-[11px]">
                  <tr>
                    <th className="p-3">Tributo</th>
                    <th className="p-3">Esfera</th>
                    <th className="p-3 text-center">2026 (Teste)</th>
                    <th className="p-3 text-center">2027 (CBS)</th>
                    <th className="p-3 text-center">2028</th>
                    <th className="p-3 text-center">2029 (IBS 10%)</th>
                    <th className="p-3 text-center">2030 (IBS 20%)</th>
                    <th className="p-3 text-center">2031 (IBS 30%)</th>
                    <th className="p-3 text-center">2032 (IBS 40%)</th>
                    <th className="p-3 text-center">2033 (Plena)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-800/60 font-mono text-[11px]">
                  {/* PIS/COFINS */}
                  <tr className="hover:bg-slate-800/60">
                    <td className="p-3 font-bold text-white font-sans">PIS / COFINS</td>
                    <td className="p-3 text-indigo-300 font-sans">Federal</td>
                    <td className="p-3 text-center text-slate-300">100%</td>
                    <td className="p-3 text-center font-bold text-rose-400">EXTINTO</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                    <td className="p-3 text-center text-rose-400">Extinto</td>
                  </tr>

                  {/* IPI */}
                  <tr className="hover:bg-slate-800/60">
                    <td className="p-3 font-bold text-white font-sans">IPI</td>
                    <td className="p-3 text-indigo-300 font-sans">Federal</td>
                    <td className="p-3 text-center text-slate-300">100%</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Alíquota 0%*</td>
                    <td className="p-3 text-center text-amber-300">Restrito ZFM</td>
                  </tr>

                  {/* ICMS & ISS */}
                  <tr className="hover:bg-slate-800/60">
                    <td className="p-3 font-bold text-white font-sans">ICMS & ISS</td>
                    <td className="p-3 text-cyan-300 font-sans">Estadual / Municipal</td>
                    <td className="p-3 text-center text-slate-300">100%</td>
                    <td className="p-3 text-center text-slate-300">100%</td>
                    <td className="p-3 text-center text-slate-300">100%</td>
                    <td className="p-3 text-center font-bold text-amber-300">90%</td>
                    <td className="p-3 text-center font-bold text-amber-300">80%</td>
                    <td className="p-3 text-center font-bold text-amber-300">70%</td>
                    <td className="p-3 text-center font-bold text-amber-300">60%</td>
                    <td className="p-3 text-center font-bold text-rose-400">EXTINTO</td>
                  </tr>

                  {/* CBS */}
                  <tr className="hover:bg-slate-800/60 bg-indigo-950/40">
                    <td className="p-3 font-bold text-indigo-300 font-sans">CBS (Novo)</td>
                    <td className="p-3 text-indigo-300 font-sans">Federal</td>
                    <td className="p-3 text-center text-amber-300">0,9% (teste)</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80% (100%)</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                    <td className="p-3 text-center font-bold text-emerald-400">8,80%</td>
                  </tr>

                  {/* IBS */}
                  <tr className="hover:bg-slate-800/60 bg-emerald-950/40">
                    <td className="p-3 font-bold text-emerald-300 font-sans">IBS (Novo)</td>
                    <td className="p-3 text-emerald-300 font-sans">Estados & Municípios</td>
                    <td className="p-3 text-center text-amber-300">0,1% (teste)</td>
                    <td className="p-3 text-center text-amber-300">0,1% (teste)</td>
                    <td className="p-3 text-center text-amber-300">0,1% (teste)</td>
                    <td className="p-3 text-center font-bold text-cyan-400">1,77% (10%)</td>
                    <td className="p-3 text-center font-bold text-cyan-400">3,54% (20%)</td>
                    <td className="p-3 text-center font-bold text-cyan-400">5,31% (30%)</td>
                    <td className="p-3 text-center font-bold text-cyan-400">7,08% (40%)</td>
                    <td className="p-3 text-center font-bold text-emerald-400">17,70% (100%)</td>
                  </tr>

                  {/* IVA DUAL TOTAL */}
                  <tr className="bg-emerald-900/50 font-bold">
                    <td className="p-3 text-emerald-200 font-sans">IVA Dual Total (CBS + IBS)</td>
                    <td className="p-3 text-emerald-200 font-sans">Federal + Subnacional</td>
                    <td className="p-3 text-center text-amber-300">1,00%</td>
                    <td className="p-3 text-center text-emerald-300">8,90%</td>
                    <td className="p-3 text-center text-emerald-300">8,90%</td>
                    <td className="p-3 text-center text-emerald-300">10,57%</td>
                    <td className="p-3 text-center text-emerald-300">12,34%</td>
                    <td className="p-3 text-center text-emerald-300">14,11%</td>
                    <td className="p-3 text-center text-emerald-300">15,88%</td>
                    <td className="p-3 text-center text-emerald-300 text-sm">26,50%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRÁFICOS COMPARATIVOS ATUAIS DA EMPRESA NO REGIME SELECIONADO */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Bar Chart: Total Annual Tax */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Comparativo de Carga Tributária Anual Total (R$)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Total recolhido aos cofres públicos em cada regime tributário no ano {input.simulationYear}.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="shortName" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Imposto Anual']}
                  labelStyle={{ fontWeight: 'bold', color: '#1e1b4b' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e0e7ff' }}
                />
                <Bar dataKey="totalAnual" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Stacked Bar Chart: Tax Composition Breakdown */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Composição da Carga Tributária por Categoria (Anual)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Separação entre Guia DAS / Guia IRPJ/CSLL, IBS/CBS Líquido e Encargos de Folha (INSS).
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="shortName" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    formatCurrency(Number(value)),
                    name === 'das'
                      ? 'Guia DAS / Guia IRPJ/CSLL'
                      : name === 'ibsCbs'
                      ? 'IBS + CBS Líquido'
                      : 'Encargos Folha (INSS)',
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e0e7ff' }}
                />
                <Legend
                  formatter={(val) =>
                    val === 'das'
                      ? 'Guia DAS / Guia IRPJ/CSLL'
                      : val === 'ibsCbs'
                      ? 'IBS + CBS Líquido'
                      : 'Encargos de Folha'
                  }
                />
                <Bar dataKey="das" stackId="a" fill="#4f46e5" />
                <Bar dataKey="ibsCbs" stackId="a" fill="#10b981" />
                <Bar dataKey="folha" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Bar Chart: Margens de Lucro (Sem Impostos vs Com Impostos) */}
      <div className="bg-white rounded-2xl border border-indigo-100 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Comparativo de Margem de Lucro (% sobre Faturamento)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Comparativo entre a Margem Operacional sem considerar impostos e a Margem Líquida considerando todos os impostos.
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="shortName" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${Number(value).toFixed(1)}%`,
                  name === 'margemSemImpostos'
                    ? 'Margem sem considerar impostos'
                    : 'Margem considerando impostos',
                ]}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e0e7ff' }}
              />
              <Legend
                formatter={(val) =>
                  val === 'margemSemImpostos'
                    ? 'Margem de Lucro sem impostos (%)'
                    : 'Margem de Lucro considerando impostos (%)'
                }
              />
              <Bar dataKey="margemSemImpostos" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="margemComImpostos" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
