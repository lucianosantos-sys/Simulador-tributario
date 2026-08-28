import React from 'react';
import { X, FileSpreadsheet, Calculator, Info, ShieldCheck, Scale, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { RegimeResult, CompanyInput } from '../types/tax';
import { ANEXO_NAMES } from '../data/taxTables';

interface CalculationAuditModalProps {
  regimeResult: RegimeResult | null;
  input: CompanyInput;
  onClose: () => void;
}

export const CalculationAuditModal: React.FC<CalculationAuditModalProps> = ({
  regimeResult,
  input,
  onClose,
}) => {
  if (!regimeResult) return null;

  const anexoInfo = ANEXO_NAMES[regimeResult.audit.appliedAnexo];
  const { segregationSavings } = regimeResult;
  const hasMonofasicoOrSt = input.monofasicoPisCofinsPercentage > 0 || input.icmsStPercentage > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-indigo-900 flex items-center justify-between bg-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-800 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Memória de Cálculo: {regimeResult.name}
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Detalhamento matemático da apuração tributária (LC 123/2006 e Reforma 2027)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Base Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-xs font-medium">
            <div>
              <span className="text-slate-500 font-medium block">RBT12 Acumulado:</span>
              <span className="font-bold text-slate-900">
                R$ {input.rbt12.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Faturamento Mensal:</span>
              <span className="font-bold text-slate-900">
                R$ {input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Segmento Setorial:</span>
              <span className="font-bold text-indigo-700 capitalize">{input.businessSegment}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Enquadramento Aplicado:</span>
              <span className="font-bold text-indigo-700">{anexoInfo.name}</span>
            </div>
          </div>

          {/* SEGREGAÇÃO SETORIAL (LEGISLAÇÃO MONOFÁSICO & ICMS-ST) */}
          {hasMonofasicoOrSt && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Segregação Legal Aplicada (Art. 18, § 4º-A da LC 123/2006)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block">PIS/COFINS Monofásico ({input.monofasicoPisCofinsPercentage}% da receita):</span>
                  <span className="text-emerald-400 font-black text-sm block mt-0.5">
                    - R$ {segregationSavings.monofasicoPisCofinsMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Fundamento: Leis 10.147/00 (Medicamentos), 10.485/02 (Autopeças), 13.097/15 (Bebidas).
                  </span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-400 font-bold block">ICMS-ST Retido na Fonte ({input.icmsStPercentage}% da receita):</span>
                  <span className="text-emerald-400 font-black text-sm block mt-0.5">
                    - R$ {segregationSavings.icmsStMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Fundamento: Convênio ICMS 142/2018 e LC 123/2006 art. 18 § 4º-A, IV.
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                <span className="text-emerald-200">Economia Anual pela segregação no PGDAS-D:</span>
                <span className="text-emerald-400 font-black text-sm">
                  R$ {segregationSavings.totalAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ano
                </span>
              </div>
            </div>
          )}

          {/* LUCRO PRESUMIDO AUDIT (SEGREGAÇÃO DE VENDAS E SERVIÇOS - LEI 9.249/95) */}
          {regimeResult.regime === 'lucro_presumido' && regimeResult.revenueSegregationAudit && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                1. Base de Cálculo Segregada de IRPJ e CSLL (Lei 9.249/1995, arts. 15 e 20)
              </h3>

              <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs space-y-3 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-indigo-300 font-bold uppercase tracking-wider">
                    {regimeResult.revenueSegregationAudit.isSegregated ? 'Segregação Ativa (Comércio/Vendas + Serviços)' : 'Segregação Padrão por Atividade Principal'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Receita Total: R$ {regimeResult.revenueSegregationAudit.salesRevenueMonthly + regimeResult.revenueSegregationAudit.servicesRevenueMonthly > 0 ? (regimeResult.revenueSegregationAudit.salesRevenueMonthly + regimeResult.revenueSegregationAudit.servicesRevenueMonthly).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Composição por Anexos */}
                {regimeResult.revenueSegregationAudit.anexoRevenues && Object.values(regimeResult.revenueSegregationAudit.anexoRevenues).some((v) => Number(v || 0) > 0) && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 space-y-1.5 font-mono text-[11px]">
                    <span className="text-indigo-300 font-bold block uppercase tracking-wider text-[10px]">
                      Composição do Faturamento por Categoria / Anexo:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(regimeResult.revenueSegregationAudit.anexoRevenues).map(([k, v]) => {
                        const numVal = Number(v || 0);
                        if (numVal <= 0) return null;
                        const label = k === 'anexo_1' ? 'Anexo I (Comércio)' :
                                      k === 'anexo_2' ? 'Anexo II (Indústria)' :
                                      k === 'anexo_3' ? 'Anexo III (c/ ISS)' :
                                      k === 'anexo_3_sem_iss' ? 'Anexo III (s/ ISS)' :
                                      k === 'anexo_4' ? 'Anexo IV (c/ ISS)' :
                                      k === 'anexo_4_sem_iss' ? 'Anexo IV (s/ ISS)' : 'Anexo V (Fator R)';
                        return (
                          <div key={k} className="p-1.5 bg-slate-900 rounded border border-slate-800">
                            <span className="text-slate-400 block text-[10px] truncate">{label}</span>
                            <span className="text-emerald-400 font-bold">R$ {numVal.toLocaleString('pt-BR')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* IRPJ APURAÇÃO */}
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span>Apuração do IRPJ (Presunção Legal)</span>
                      <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-mono">Art. 15</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>• Vendas (8% de R$ {regimeResult.revenueSegregationAudit.salesRevenueMonthly.toLocaleString('pt-BR')}):</span>
                        <span className="text-white font-bold">R$ {regimeResult.revenueSegregationAudit.irpjPresumedBaseSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Serviços (32% de R$ {regimeResult.revenueSegregationAudit.servicesRevenueMonthly.toLocaleString('pt-BR')}):</span>
                        <span className="text-white font-bold">R$ {regimeResult.revenueSegregationAudit.irpjPresumedBaseServices.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 text-indigo-300 font-bold">
                        <span>Base Presumida Total IRPJ:</span>
                        <span>R$ {regimeResult.revenueSegregationAudit.totalIrpjPresumedBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span>Alíquota Básica (15%):</span>
                        <span>R$ {regimeResult.revenueSegregationAudit.irpjBaseRateAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-amber-300">
                        <span>Adicional IRPJ (10% &gt; R$ 20k/mês):</span>
                        <span>R$ {regimeResult.revenueSegregationAudit.irpjAdicionalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 text-emerald-400 font-black text-xs">
                        <span>IRPJ Total Devido:</span>
                        <span>R$ {regimeResult.revenueSegregationAudit.totalIrpjAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* CSLL APURAÇÃO */}
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-cyan-300 font-bold">
                      <span>Apuração da CSLL (Presunção Legal)</span>
                      <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-md font-mono">Art. 20</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>• Vendas (12% de R$ {regimeResult.revenueSegregationAudit.salesRevenueMonthly.toLocaleString('pt-BR')}):</span>
                        <span className="text-white font-bold">R$ {regimeResult.revenueSegregationAudit.csllPresumedBaseSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Serviços (32% de R$ {regimeResult.revenueSegregationAudit.servicesRevenueMonthly.toLocaleString('pt-BR')}):</span>
                        <span className="text-white font-bold">R$ {regimeResult.revenueSegregationAudit.csllPresumedBaseServices.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 text-indigo-300 font-bold">
                        <span>Base Presumida Total CSLL:</span>
                        <span>R$ {regimeResult.revenueSegregationAudit.totalCsllPresumedBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span>Alíquota CSLL (9% sobre a base):</span>
                        <span className="text-emerald-400 font-black text-xs">R$ {regimeResult.revenueSegregationAudit.totalCsllAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="pt-2 text-[10px] text-slate-400 italic">
                        * A presunção de 12% para vendas e 32% para serviços reflete o art. 20 da Lei 9.249/1995.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LUCRO REAL AUDIT (DEDUÇÕES LEGAIS E CONTÁBEIS - RIR/2018 E LEI 9.249/95) */}
          {regimeResult.regime === 'lucro_real' && regimeResult.lucroRealAudit && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                1. Demonstração das Deduções Legais e Apuração do IRPJ/CSLL (RIR/2018 Dec. 9.580/2018)
              </h3>

              <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs space-y-3 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-indigo-300 font-bold uppercase tracking-wider">
                    {regimeResult.lucroRealAudit.methodUsed === 'deducoes_reais'
                      ? 'Método Legal por Deduções Reais (DRE Contábil / LAIR)'
                      : 'Método por Margem Operacional Estimada'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Receita Bruta: R$ {regimeResult.lucroRealAudit.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Tabela de DRE e Deduções */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-800/90 text-slate-300">
                      <tr>
                        <th className="p-2.5">Rubrica Contábil / Fiscal</th>
                        <th className="p-2.5">Fundamentação Legal</th>
                        <th className="p-2.5 text-right">Valor Mensal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      <tr className="bg-slate-900/40">
                        <td className="p-2.5 font-bold text-white">(+) Receita Bruta Operacional</td>
                        <td className="p-2.5 text-slate-400">Total de faturamento auferido</td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">
                          + R$ {regimeResult.lucroRealAudit.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">(-) Custos das Mercadorias / Insumos (CPV/CMV)</td>
                        <td className="p-2.5 text-slate-400">RIR/2018 art. 290 e Lei 9.249/95</td>
                        <td className="p-2.5 text-right text-rose-400">
                          - R$ {regimeResult.lucroRealAudit.purchasesCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">(-) Salários de Empregados CLT</td>
                        <td className="p-2.5 text-slate-400">RIR/2018 art. 311 (Despesa necessária)</td>
                        <td className="p-2.5 text-right text-rose-400">
                          - R$ {regimeResult.lucroRealAudit.payrollSalaries.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">(-) Encargos Previdenciários e Sociais (28,8%)</td>
                        <td className="p-2.5 text-slate-400">INSS Patronal (20%), RAT (3%) e Terceiros (5,8%)</td>
                        <td className="p-2.5 text-right text-rose-400">
                          - R$ {regimeResult.lucroRealAudit.payrollCharges.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">(-) Remuneração de Administradores (Pró-labore)</td>
                        <td className="p-2.5 text-slate-400">RIR/2018 art. 357</td>
                        <td className="p-2.5 text-right text-rose-400">
                          - R$ {regimeResult.lucroRealAudit.proLabore.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">(-) Outras Despesas Operacionais / Administrativas</td>
                        <td className="p-2.5 text-slate-400">RIR/2018 art. 311 (Aluguéis, água, luz, internet, etc)</td>
                        <td className="p-2.5 text-right text-rose-400">
                          - R$ {regimeResult.lucroRealAudit.otherDeductibleExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr className="bg-indigo-950/80 font-bold border-t border-indigo-700">
                        <td className="p-2.5 text-indigo-200">(=) Lucro Contábil / LAIR (Base Real Efetiva)</td>
                        <td className="p-2.5 text-indigo-300">
                          {regimeResult.lucroRealAudit.isTaxLoss ? '⚠️ PREJUÍZO FISCAL CONTÁBIL' : 'Base Tributável Positiva'}
                        </td>
                        <td className={`p-2.5 text-right font-black ${regimeResult.lucroRealAudit.isTaxLoss ? 'text-amber-400' : 'text-emerald-400'}`}>
                          R$ {regimeResult.lucroRealAudit.accountingLair.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Resultado da Tributação no Lucro Real */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 font-bold block text-[11px]">IRPJ no Lucro Real:</span>
                    <div className="text-xs font-mono space-y-0.5 mt-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Base de Cálculo Real:</span>
                        <span className="font-bold">R$ {regimeResult.lucroRealAudit.taxableRealBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Alíquota Normal (15%):</span>
                        <span>R$ {regimeResult.lucroRealAudit.irpjBaseRateAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-amber-300">
                        <span>Adicional IRPJ (10% &gt; R$ 20k/mês):</span>
                        <span>R$ {regimeResult.lucroRealAudit.irpjAdicionalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 text-emerald-400 font-bold">
                        <span>Total IRPJ Real:</span>
                        <span>R$ {regimeResult.lucroRealAudit.totalIrpjAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 font-bold block text-[11px]">CSLL no Lucro Real:</span>
                    <div className="text-xs font-mono space-y-0.5 mt-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Base de Cálculo Real:</span>
                        <span className="font-bold">R$ {regimeResult.lucroRealAudit.taxableRealBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Alíquota CSLL (9%):</span>
                        <span>R$ {regimeResult.lucroRealAudit.totalCsllAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-1 text-emerald-400 font-bold">
                        <span>Total CSLL Real:</span>
                        <span>R$ {regimeResult.lucroRealAudit.totalCsllAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {regimeResult.lucroRealAudit.isTaxLoss && (
                        <div className="text-[10px] text-amber-300 pt-1 font-sans">
                          * Havendo prejuízo fiscal, não há incidência de IRPJ e CSLL (RIR/2018).
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMPLES NACIONAL DAS AUDIT */}
          {(regimeResult.regime === 'simples_simplificado' || regimeResult.regime === 'simples_hibrido') && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                1. Fórmula da Alíquota Efetiva do Simples Nacional (LC 123/2006)
              </h3>

              <div className="bg-indigo-950 text-emerald-300 p-5 rounded-2xl font-mono text-xs space-y-2 border border-indigo-900 shadow-inner">
                <div>Alíquota Efetiva = [(RBT12 × Alíquota Nominal) - Parcela a Deduzir] ÷ RBT12</div>
                <div className="text-indigo-200">
                  = [(R$ {input.rbt12.toLocaleString('pt-BR')} × {(regimeResult.audit.nominalRate * 100).toFixed(2)}%) - R$ {regimeResult.audit.deductionValue.toLocaleString('pt-BR')}] ÷ R$ {input.rbt12.toLocaleString('pt-BR')}
                </div>
                <div className="text-white font-black text-sm">
                  = {(regimeResult.audit.simplesEffectiveRate * 100).toFixed(4)}% (Faixa {regimeResult.audit.bracketNumber})
                </div>
              </div>

              {/* Segregação de Tributos da Guia DAS */}
              <div className="border border-indigo-100 rounded-2xl overflow-hidden mt-3 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-indigo-50/70 text-indigo-950 font-bold border-b border-indigo-100">
                    <tr>
                      <th className="p-3">Tributo</th>
                      <th className="p-3">Destinação / Fundamentação</th>
                      <th className="p-3 text-right">No DAS Simplificado</th>
                      <th className="p-3 text-right">No DAS Híbrido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">IRPJ</td>
                      <td className="p-3 text-slate-500 font-medium">Imposto de Renda PJ (Federal)</td>
                      <td className="p-3 text-right font-bold font-mono">
                        R$ {regimeResult.das.irpj.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 font-mono">
                        R$ {regimeResult.das.irpj.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">CSLL</td>
                      <td className="p-3 text-slate-500 font-medium">Contribuição Social sobre Lucro (Federal)</td>
                      <td className="p-3 text-right font-bold font-mono">
                        R$ {regimeResult.das.csll.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 font-mono">
                        R$ {regimeResult.das.csll.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">CPP (Previdenciária)</td>
                      <td className="p-3 text-slate-500 font-medium">
                        {regimeResult.audit?.appliedAnexo === 'anexo_4'
                          ? 'No Anexo IV, CPP é apurada por fora (20% patronal)'
                          : 'INSS Patronal da Empresa (unificado no DAS)'}
                      </td>
                      <td className="p-3 text-right font-bold font-mono">
                        R$ {regimeResult.das.cpp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600 font-mono">
                        R$ {regimeResult.das.cpp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-semibold text-slate-800">
                        PIS / COFINS
                        <span className="block text-[10px] text-indigo-700 font-semibold">
                          (Substituído pela CBS Federal - LC 214/2025)
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        {input.monofasicoPisCofinsPercentage > 0
                          ? `Dedução de ${input.monofasicoPisCofinsPercentage}% (Monofásico Leis 10.147/10.485/13.097 - CBS unificada no DAS)`
                          : 'Substituído pela CBS Federal (recolhida de forma unificada na guia DAS)'}
                      </td>
                      <td className="p-3 text-right font-mono">
                        <div className="font-bold text-slate-900">
                          R$ {(regimeResult.das.cofins + regimeResult.das.pis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] font-sans font-bold text-indigo-700 mt-0.5">
                          Alíq. Efetiva CBS: {input.monthlyRevenue > 0 ? (((regimeResult.das.cofins + regimeResult.das.pis) / input.monthlyRevenue) * 100).toFixed(4) : '0.0000'}%
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-400 font-mono">
                        R$ 0,00 <span className="text-[10px] block font-sans text-indigo-700 font-medium">(CBS apurada por fora a {(regimeResult.ibsCbs.cbsRateApplied * 100).toFixed(2)}%)</span>
                      </td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-semibold text-slate-800">
                        ICMS
                        <span className="block text-[10px] text-amber-700 font-normal">
                          (Substituído pelo IBS Estadual)
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        {input.icmsStPercentage > 0
                          ? `Dedução de ${input.icmsStPercentage}% (ICMS-ST Convênio 142/2018)`
                          : 'Tributado sobre vendas de mercadorias no DAS'}
                      </td>
                      <td className="p-3 text-right font-bold font-mono">
                        R$ {regimeResult.das.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-400 font-mono">
                        R$ 0,00 <span className="text-[10px] block font-sans text-amber-700 font-medium">(IBS apurado por fora a {(regimeResult.ibsCbs.ibsRateApplied * 100).toFixed(2)}%)</span>
                      </td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-semibold text-slate-800">
                        ISS
                        <span className="block text-[10px] text-amber-700 font-normal">
                          (Substituído pelo IBS Municipal)
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        {(regimeResult.das.deductedIss && regimeResult.das.deductedIss > 0)
                          ? `Dedução de R$ ${regimeResult.das.deductedIss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por receitas de serviços SEM ISS`
                          : 'Tributado sobre prestação de serviços no DAS'}
                      </td>
                      <td className="p-3 text-right font-bold font-mono">
                        R$ {regimeResult.das.iss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-400 font-mono">
                        R$ 0,00 <span className="text-[10px] block font-sans text-amber-700 font-medium">(IBS apurado por fora)</span>
                      </td>
                    </tr>
                    <tr className="bg-indigo-50 font-black text-indigo-950">
                      <td colSpan={2} className="p-3">Total da Guia DAS Mensal (com segregação):</td>
                      <td className="p-3 text-right text-emerald-600 font-mono text-sm">
                        R$ {regimeResult.das.totalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-emerald-600 font-mono text-sm">
                        R$ {(regimeResult.das.irpj + regimeResult.das.csll + (regimeResult.audit?.appliedAnexo === 'anexo_4' ? 0 : regimeResult.das.cpp)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-indigo-50/90 text-[11px] font-bold text-indigo-950 border-t border-indigo-200">
                      <td colSpan={2} className="p-2.5">
                        <span className="flex items-center gap-1.5 font-sans">
                          🏛️ <strong>Alíquota Efetiva da CBS Federal (PIS/COFINS) no Simples Simplificado:</strong>
                          <span className="text-[10px] text-indigo-700 font-normal">(Fração embutida no DAS)</span>
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-black text-indigo-900 font-mono text-xs">
                        {input.monthlyRevenue > 0 ? (((regimeResult.das.cofins + regimeResult.das.pis) / input.monthlyRevenue) * 100).toFixed(4) : '0.0000'}%
                        <span className="block text-[10px] text-slate-500 font-sans font-normal">
                          R$ {(regimeResult.das.cofins + regimeResult.das.pis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-500 text-xs">
                        0,0000%
                        <span className="block text-[10px] text-indigo-600 font-sans font-semibold">
                          (CBS apurada por fora a {(regimeResult.ibsCbs.cbsRateApplied * 100).toFixed(2)}%)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-800 border-t border-indigo-100">
                      <td colSpan={2} className="p-2.5">
                        <span className="flex items-center gap-1.5">
                          📌 Alíquota Efetiva Oficial da Tabela Simples Nacional (LC 123/2006):
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-black text-indigo-950 font-mono">
                        {(regimeResult.audit.simplesEffectiveRate * 100).toFixed(4)}%
                      </td>
                      <td className="p-2.5 text-right font-black text-indigo-950 font-mono">
                        {(regimeResult.audit.simplesEffectiveRate * 100).toFixed(4)}%
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/70 text-[11px] font-bold text-emerald-950 border-t border-emerald-100">
                      <td colSpan={2} className="p-2.5">
                        <span className="flex items-center gap-1.5">
                          ✅ Alíquota Efetiva Líquida da Guia DAS a Recolher (DAS ÷ Faturamento):
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-black text-emerald-700 font-mono">
                        {input.monthlyRevenue > 0 ? ((regimeResult.das.totalDas / input.monthlyRevenue) * 100).toFixed(2) : '0.00'}%
                      </td>
                      <td className="p-2.5 text-right font-black text-emerald-700 font-mono">
                        {input.monthlyRevenue > 0 ? (((regimeResult.das.irpj + regimeResult.das.csll + (regimeResult.audit?.appliedAnexo === 'anexo_4' ? 0 : regimeResult.das.cpp)) / input.monthlyRevenue) * 100).toFixed(2) : '0.00'}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Destaque da Substituição Constitucional PIS/COFINS -> CBS & LC 214/2025 */}
              <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl text-xs space-y-3 shadow-md border border-indigo-700/60">
                <div className="flex items-center gap-2 font-black text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm uppercase tracking-wider">
                    Substituição Constitucional de PIS / COFINS pela CBS Federal (EC 132/2023 & LC 214/2025)
                  </span>
                </div>
                <p className="text-indigo-100 leading-relaxed font-normal">
                  A partir de 2027, as contribuições federais de <strong>PIS</strong> e <strong>COFINS</strong> são <strong className="text-emerald-300">integralmente extintas</strong> e substituídas pela <strong>CBS (Contribuição sobre Bens e Serviços)</strong>. A <strong>Lei Complementar nº 214/2025</strong> também extinguiu a sistemática monofásica tradicional para autopeças, farmácia/medicamentos, cosméticos e bebidas, preservando o regime monofásico (ad rem) exclusivamente para combustíveis:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-slate-900 font-sans">
                  <div className="p-3 bg-white/95 rounded-xl border border-indigo-200 shadow-2xs">
                    <span className="text-[11px] font-black text-indigo-950 block">
                      📦 1. No Simples Nacional Simplificado (DAS Único)
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      A CBS passa a ser recolhida de forma <strong>unificada e embutida no DAS</strong> (substituindo a antiga fração de PIS/COFINS). A empresa recolhe <strong>R$ {(regimeResult.das.cofins + regimeResult.das.pis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês</strong> referente à CBS unificada{input.businessSegment === 'combustiveis' ? ' e mantém a dedução do regime monofásico ad rem de combustíveis' : ', com apuração simplificada sem créditos'}.
                    </p>
                  </div>
                  <div className="p-3 bg-white/95 rounded-xl border border-indigo-200 shadow-2xs">
                    <span className="text-[11px] font-black text-indigo-950 block">
                      ⚡ 2. No Simples Híbrido & Lucro Presumido / Real
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      A CBS é <strong>excluída da guia DAS (R$ 0,00 na guia)</strong> e apurada no regime não-cumulativo pela alíquota de <strong>{(regimeResult.ibsCbs.cbsRateApplied * 100).toFixed(2)}%</strong>. A empresa apropria créditos de CBS nas compras/insumos e transfere <strong>100% de crédito de CBS</strong> para seus clientes corporativos (B2B).
                    </p>
                  </div>
                </div>
              </div>

              {/* Destaque da Parcela ICMS e ISS no DAS */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Parcela de ICMS e ISS na Guia DAS (EC 132/2023 - ADCT Arts. 125 a 133):</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Soma de ICMS (R$ {(regimeResult.das.icms ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) + ISS (R$ {(regimeResult.das.iss ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) = <strong className="text-amber-950">R$ {((regimeResult.das.icms ?? 0) + (regimeResult.das.iss ?? 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> ({regimeResult.das.totalDas > 0 ? ((((regimeResult.das.icms ?? 0) + (regimeResult.das.iss ?? 0)) / regimeResult.das.totalDas) * 100).toFixed(1) : 0}% da Guia DAS total).
                  {String(input.simulationYear).includes('2026') || String(input.simulationYear).includes('2027') || String(input.simulationYear).includes('2028')
                    ? ' No período inicial (2026-2028), 100% da parcela de ICMS/ISS continua calculada e recolhida dentro da guia DAS normal.'
                    : ` No cronograma selecionado, aplica-se o fator de transição legal da EC 132/2023 de redução gradual da parcela de ICMS/ISS na DAS.`}
                </p>
              </div>
            </div>
          )}

          {/* IBS / CBS CALCULATION SECTION - LC 214/2025 */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                2. Apuração do IVA Dual & Alíquotas Efetivas (Lei Complementar nº 214/2025 & EC 132/2023)
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                Padrão LC 214/2025: CBS 8,80% + IBS 17,70% (26,50%)
              </span>
            </div>

            {/* Painel de Alíquotas Nominais vs Alíquotas Efetivas */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                    Demonstrativo de Alíquotas Oficiais e Efetivas
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Regime: <strong>{regimeResult.name}</strong> | Exercício: <strong>{input.simulationYear}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
                  <span className="text-slate-400">Alíquota Efetiva Líquida IVA:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {input.monthlyRevenue > 0
                      ? ((regimeResult.ibsCbs.netPayable / input.monthlyRevenue) * 100).toFixed(2)
                      : '0.00'}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 block font-sans">CBS Federal (Nominal):</span>
                  <span className="text-white font-bold text-sm">
                    {(regimeResult.ibsCbs.nominalCbsRatePct ?? 8.8).toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-indigo-300 block mt-0.5 font-sans">
                    Aplicada: {(regimeResult.ibsCbs.cbsRateApplied * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 block font-sans">IBS Subnacional (Nominal):</span>
                  <span className="text-white font-bold text-sm">
                    {(regimeResult.ibsCbs.nominalIbsRatePct ?? 17.7).toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-amber-300 block mt-0.5 font-sans">
                    Aplicado: {(regimeResult.ibsCbs.ibsRateApplied * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/80">
                  <span className="text-[10px] text-slate-400 block font-sans">IVA Dual Nominal Total:</span>
                  <span className="text-white font-black text-sm">
                    {(regimeResult.ibsCbs.nominalTotalRatePct ?? 26.5).toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                    Débito Bruto: {(regimeResult.ibsCbs.rateApplied * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/80">
                  <span className="text-[10px] text-emerald-300 block font-sans">Alíquota Efetiva Real:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {input.monthlyRevenue > 0
                      ? ((regimeResult.ibsCbs.netPayable / input.monthlyRevenue) * 100).toFixed(2)
                      : '0.00'}%
                  </span>
                  <span className="text-[10px] text-emerald-200 block mt-0.5 font-sans">
                    Líquida pós-créditos
                  </span>
                </div>
              </div>

              {/* Card Específico de CBS no Simples Nacional Simplificado */}
              {regimeResult.regime === 'simples_simplificado' && (
                <div className="p-3.5 bg-indigo-900/80 border border-indigo-600/80 rounded-xl text-xs space-y-2 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      📌 CBS Federal no Simples Nacional Simplificado (LC 214/2025 c/c LC 123/2006):
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-black text-xs">
                      Embutida no DAS Único
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Alíquota Efetiva da CBS no DAS:</span>
                      <span className="text-emerald-400 font-bold text-xs">
                        {input.monthlyRevenue > 0 ? (((regimeResult.das.cofins + regimeResult.das.pis) / input.monthlyRevenue) * 100).toFixed(4) : '0.0000'}%
                      </span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">
                        R$ {(regimeResult.das.cofins + regimeResult.das.pis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                      </span>
                    </div>

                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Crédito CBS Transferível (B2B):</span>
                      <span className="text-indigo-300 font-bold text-xs">
                        {(regimeResult.ibsCbs.creditTransferRate * 100).toFixed(2)}%
                      </span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">
                        R$ {regimeResult.ibsCbs.creditTransferredToB2B.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                      </span>
                    </div>

                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Guia Extra de CBS por Fora:</span>
                      <span className="text-white font-bold text-xs">
                        R$ 0,00
                      </span>
                      <span className="text-emerald-300 block text-[10px] mt-0.5">
                        100% Unificada no DAS
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Informação sobre Redução Setorial ou Rateio Personalizado */}
              {input.businessSegment === 'farmacia' && input.healthDiscountRatePct > 0 && (
                <div className="p-2.5 bg-indigo-900/60 border border-indigo-700 rounded-xl text-[11px] flex items-center justify-between font-sans">
                  <span className="text-indigo-200">
                    🏥 <strong>Regime Diferenciado de Saúde/Medicamentos (Art. 9º EC 132/23 & LC 214/25):</strong> Redução de {input.healthDiscountRatePct}% da alíquota padrão.
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    Economia: R$ {(regimeResult.ibsCbs.healthReductionSavings ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                  </span>
                </div>
              )}

              {input.salesReductionMode === 'rateio_personalizado' && (
                <div className="p-2.5 bg-amber-900/40 border border-amber-700/70 rounded-xl text-[11px] text-amber-200 font-sans">
                  📊 <strong>Rateio Personalizado de Vendas Ativo:</strong> Alíquota média de débito ponderada em <strong>{(regimeResult.ibsCbs.rateApplied * 100).toFixed(2)}%</strong> sobre a receita segregada por faixas de redução.
                </div>
              )}
            </div>

            {/* Tabela Completa de Memória de Cálculo Analítica do IVA Dual */}
            <div className="border border-indigo-100 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-indigo-900 text-white font-sans font-bold">
                  <tr>
                    <th className="p-3">Etapa da Apuração (LC 214/2025)</th>
                    <th className="p-3">Fundamento Legal / Alíquota</th>
                    <th className="p-3 text-right">CBS Federal</th>
                    <th className="p-3 text-right">IBS Subnacional</th>
                    <th className="p-3 text-right bg-indigo-950">Total IVA Dual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50 text-slate-800">
                  <tr className="bg-slate-50/70 font-bold font-sans">
                    <td className="p-3 text-slate-900">1. Base de Cálculo do Débito (Receita)</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">Faturamento mensal tributável</td>
                    <td className="p-3 text-right font-mono">
                      R$ {input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono">
                      R$ {input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono text-indigo-950 bg-indigo-50/50">
                      R$ {input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold">
                      (+) Débito Bruto Apurado
                    </td>
                    <td className="p-3 text-slate-500 text-[11px] font-sans">
                      CBS {(regimeResult.ibsCbs.cbsRateApplied * 100).toFixed(2)}% | IBS {(regimeResult.ibsCbs.ibsRateApplied * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right text-rose-700 font-bold">
                      + R$ {(regimeResult.ibsCbs.cbsGrossDebit ?? (regimeResult.ibsCbs.grossDebit * (8.8 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-rose-700 font-bold">
                      + R$ {(regimeResult.ibsCbs.ibsGrossDebit ?? (regimeResult.ibsCbs.grossDebit * (17.7 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-rose-800 font-black bg-rose-50/40">
                      + R$ {regimeResult.ibsCbs.grossDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr className="bg-slate-50/70 font-bold font-sans">
                    <td className="p-3 text-slate-900">2. Base de Insumos / Compras Elegíveis</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {input.creditEligibilityPct}% elegibilidade (Arts. 28 a 35 LC 214/2025)
                    </td>
                    <td className="p-3 text-right font-mono">
                      R$ {(input.monthlyPurchasesInputs * (input.creditEligibilityPct / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono">
                      R$ {(input.monthlyPurchasesInputs * (input.creditEligibilityPct / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono text-indigo-950 bg-indigo-50/50">
                      R$ {(input.monthlyPurchasesInputs * (input.creditEligibilityPct / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold">
                      (-) Créditos Não-cumulativos Apropriados
                    </td>
                    <td className="p-3 text-slate-500 text-[11px] font-sans">
                      Princípio da não-cumulatividade plena
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-bold">
                      - R$ {(regimeResult.ibsCbs.cbsEligibleCredits ?? (regimeResult.ibsCbs.eligibleCredits * (8.8 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-bold">
                      - R$ {(regimeResult.ibsCbs.ibsEligibleCredits ?? (regimeResult.ibsCbs.eligibleCredits * (17.7 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-800 font-black bg-emerald-50/40">
                      - R$ {regimeResult.ibsCbs.eligibleCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* Imposto Seletivo se aplicável */}
                  {(regimeResult.ibsCbs.selectiveTaxAmount ?? 0) > 0 && (
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-semibold text-amber-900">
                        (+) Imposto Seletivo (Art. 153, VIII CF/88)
                      </td>
                      <td className="p-3 text-amber-700 text-[11px] font-sans">
                        Incidência monofásica sobre bebidas/prejudiciais à saúde (5%)
                      </td>
                      <td className="p-3 text-right text-amber-900 font-bold">
                        + R$ {(regimeResult.ibsCbs.selectiveTaxAmount ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-slate-400 font-normal">
                        R$ 0,00
                      </td>
                      <td className="p-3 text-right text-amber-950 font-black bg-amber-100/60">
                        + R$ {(regimeResult.ibsCbs.selectiveTaxAmount ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}

                  {/* Saldo Líquido a Recolher */}
                  <tr className="bg-indigo-950 text-white font-bold text-xs">
                    <td className="p-3 font-sans">
                      (=) Saldo Líquido a Recolher ({regimeResult.regime === 'simples_simplificado' ? 'Incluso no DAS' : 'Guia Própria IVA Dual'})
                    </td>
                    <td className="p-3 text-indigo-300 font-sans font-normal text-[11px]">
                      {regimeResult.regime === 'simples_simplificado'
                        ? 'Recolhido via DAS unificado'
                        : 'DARF Única / Comitê Gestor IBS'}
                    </td>
                    <td className="p-3 text-right text-emerald-400 font-black">
                      R$ {(regimeResult.ibsCbs.cbsNetPayable ?? (regimeResult.ibsCbs.netPayable * (8.8 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-400 font-black">
                      R$ {(regimeResult.ibsCbs.ibsNetPayable ?? (regimeResult.ibsCbs.netPayable * (17.7 / 26.5))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-300 font-black text-sm bg-indigo-900 border-l border-indigo-800">
                      R$ {regimeResult.ibsCbs.netPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* Alíquota Efetiva Líquida */}
                  <tr className="bg-emerald-50 text-emerald-950 font-black font-sans">
                    <td colSpan={2} className="p-3 text-emerald-900">
                      🎯 Alíquota Efetiva Líquida do IVA Dual sobre a Receita Total:
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-800">
                      {input.monthlyRevenue > 0
                        ? (((regimeResult.ibsCbs.cbsNetPayable ?? (regimeResult.ibsCbs.netPayable * (8.8 / 26.5))) / input.monthlyRevenue) * 100).toFixed(2)
                        : '0.00'}%
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-800">
                      {input.monthlyRevenue > 0
                        ? (((regimeResult.ibsCbs.ibsNetPayable ?? (regimeResult.ibsCbs.netPayable * (17.7 / 26.5))) / input.monthlyRevenue) * 100).toFixed(2)
                        : '0.00'}%
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-950 text-sm bg-emerald-100/80 border-l border-emerald-300">
                      {input.monthlyRevenue > 0
                        ? ((regimeResult.ibsCbs.netPayable / input.monthlyRevenue) * 100).toFixed(2)
                        : '0.00'}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Explicação Didática da Sistemática do Regime */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-950">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Tratamento do IVA Dual (LC 214/2025) no {regimeResult.name}:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-normal">
                {regimeResult.regime === 'simples_simplificado' && (
                  <>
                    No <strong>Simples Nacional Simplificado</strong>, a empresa recolhe a CBS e o IBS embutidos dentro da guia DAS única simplificada (sem apuração de créditos por fora). Para clientes PJ (B2B), transfere crédito proporcional à alíquota de <strong>{(regimeResult.ibsCbs.creditTransferRate * 100).toFixed(2)}%</strong> (R$ {regimeResult.ibsCbs.creditTransferredToB2B.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês).
                  </>
                )}
                {regimeResult.regime === 'simples_hibrido' && (
                  <>
                    No <strong>Simples Nacional Híbrido</strong>, a CBS e o IBS são apurados no regime não-cumulativo pela <strong>Lei Complementar nº 214/2025</strong> com guia segregada de R$ {regimeResult.ibsCbs.netPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês. Isso reduz o DAS para <strong>R$ {regimeResult.das.totalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (apenas IRPJ, CSLL e CPP) e concede <strong>100% de crédito (R$ {regimeResult.ibsCbs.creditTransferredToB2B.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês)</strong> para clientes B2B à alíquota plena de <strong>{(regimeResult.ibsCbs.rateApplied * 100).toFixed(2)}%</strong>.
                  </>
                )}
                {(regimeResult.regime === 'lucro_presumido' || regimeResult.regime === 'lucro_real') && (
                  <>
                    Nos regimes de <strong>Lucro Presumido</strong> e <strong>Lucro Real</strong>, a apuração do IVA Dual segue o regime não-cumulativo universal da LC 214/2025. A empresa debita <strong>{(regimeResult.ibsCbs.rateApplied * 100).toFixed(2)}%</strong> sobre as saídas e credita <strong>{(regimeResult.ibsCbs.rateApplied * 100).toFixed(2)}%</strong> sobre compras e insumos com elegibilidade de {input.creditEligibilityPct}%, transferindo 100% de crédito aos adquirentes PJ.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* PAYROLL TAXES AUDIT */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600" />
              3. Encargos Previdenciários de Folha de Pagamento
            </h3>

            <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <span className="font-black text-slate-900 block">
                  INSS Patronal (CPP) + RAT + Terceiros
                </span>
                <p className="text-slate-500 font-medium mt-0.5">
                  {regimeResult.audit.appliedAnexo === 'anexo_4'
                    ? 'No Anexo IV, a CPP não está inclusa no DAS. Recolhe 28,8% sobre folha e pró-labore à parte.'
                    : regimeResult.regime === 'lucro_presumido' || regimeResult.regime === 'lucro_real'
                    ? 'Nos regimes de Lucro Presumido e Real, a empresa paga 28,8% de encargos patronais integrais.'
                    : 'Nos Anexos I, II, III e V do Simples, a empresa tem isenção dos 20% patronais (incluso no DAS).'}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-base font-black text-slate-900">
                  R$ {regimeResult.payrollCharges.totalPayrollTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
                </span>
              </div>
            </div>
          </div>

          {/* PROFIT MARGINS AUDIT */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              4. Análise de Margem de Lucro (Sem Impostos vs Com Impostos)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Margem de Lucro sem considerar impostos:</span>
                <p className="text-lg font-black text-slate-900 mt-1">
                  {regimeResult.profitMarginBeforeTaxesPct.toFixed(2)}%
                </p>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  R$ {regimeResult.profitMarginBeforeTaxesMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês (R$ {(regimeResult.profitMarginBeforeTaxesMonthly * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ano)
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Calculado: Faturamento (R$ {input.monthlyRevenue.toLocaleString('pt-BR')}) - Insumos (R$ {input.monthlyPurchasesInputs.toLocaleString('pt-BR')}) - Folha/Pró-labore (R$ {(input.monthlyPayroll + input.monthlyProLabore).toLocaleString('pt-BR')})
                </span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium block">Margem de Lucro considerando impostos:</span>
                <p className="text-lg font-black text-emerald-700 mt-1">
                  {regimeResult.profitMarginAfterTaxesPct.toFixed(2)}%
                </p>
                <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                  R$ {regimeResult.profitMarginAfterTaxesMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês (R$ {regimeResult.estimatedNetProfitAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ano)
                </span>
                <span className="text-[10px] text-emerald-700/80 mt-1 block">
                  Lucro Líquido final retido após dedução da carga direta e impacto comercial.
                </span>
              </div>
            </div>
          </div>

          {/* B2B COMPENSATION DISCOUNT & TAX GUIDE RECALCULATION AUDIT */}
          {input.b2bPercentage > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                5. Recálculo das Guias de Impostos sob Modo Competitivo B2B
              </h3>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-indigo-200/70">
                  <div>
                    <span className="font-black text-indigo-950 block">
                      Cenário B2B: {input.b2bPercentage}% das Vendas para Pessoas Jurídicas (PJ)
                    </span>
                    <span className="text-indigo-700 font-medium text-[11px]">
                      Base B2B Mensal: R$ {((input.monthlyRevenue * input.b2bPercentage) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]">
                    Margem de Compensação Ativa: {input.b2bDisputeDiscountPct}%
                  </div>
                </div>

                {/* 3 Cards de Apuração do Recálculo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-slate-500 font-medium block">Guia Nominal Direta:</span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5 font-mono">
                      R$ {regimeResult.totalMonthlyTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">Guia DAS / DARF mensal direta</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-amber-700 font-medium block">Compensação Comercial B2B:</span>
                    <span className="text-sm font-black text-amber-600 block mt-0.5 font-mono">
                      {regimeResult.estimatedCommercialLossMonthly > 0
                        ? `+ R$ ${regimeResult.estimatedCommercialLossMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : 'R$ 0,00 (Crédito Pleno)'}
                    </span>
                    <span className="text-[10px] text-amber-600/80">
                      {regimeResult.estimatedCommercialLossMonthly > 0
                        ? `Margem de ${input.b2bDisputeDiscountPct}% da perda de crédito`
                        : 'Cliente PJ toma 100% dos créditos'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    <span className="text-indigo-900 font-medium block">(=) Custo Total Recalculado:</span>
                    <span className="text-sm font-black text-indigo-950 block mt-0.5 font-mono">
                      R$ {regimeResult.totalAdjustedCostMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold">
                      Alíquota Recalculada: {regimeResult.adjustedEffectiveRatePct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Detalhamento Especial para o Simples Simplificado */}
                {regimeResult.regime === 'simples_simplificado' && regimeResult.competitiveRecalculation && (
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                    <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider block">
                      Memória do Recálculo da Guia DAS sob Desconto em Nota Fiscal (NF-e)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                      <div className="p-2 bg-amber-50/50 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Faturamento Original:</span>
                        <span className="font-bold font-mono">
                          R$ {input.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="p-2 bg-amber-50/50 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Receita Líquida Faturada:</span>
                        <span className="font-bold text-amber-900 font-mono">
                          R$ {regimeResult.competitiveRecalculation.netInvoicedRevenueMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 block">Guia DAS Recalculada (Base Menor):</span>
                        <span className="font-black text-emerald-900 font-mono">
                          R$ {regimeResult.competitiveRecalculation.recalculatedTaxGuideMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[9px] text-emerald-700 block mt-0.5">
                          Economia de R$ {regimeResult.competitiveRecalculation.taxBaseReductionSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} na guia
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Fechar Memória de Cálculo
          </button>
        </div>
      </div>
    </div>
  );
};
