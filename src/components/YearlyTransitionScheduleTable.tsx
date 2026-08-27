import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Scale,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { SimulationSummary, TransitionYearDetail } from '../types/tax';

interface YearlyTransitionScheduleTableProps {
  summary: SimulationSummary;
}

export const YearlyTransitionScheduleTable: React.FC<YearlyTransitionScheduleTableProps> = ({ summary }) => {
  const { transitionSchedule, input, results } = summary;
  const [selectedYear, setSelectedYear] = useState<number>(input.simulationYear || 2027);

  if (!transitionSchedule || transitionSchedule.length === 0) {
    return null;
  }

  const selectedYearData = transitionSchedule.find((item) => item.year === selectedYear) || transitionSchedule[0];

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-50 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              Régua de Transição Ano a Ano do ICMS e ISS (2026 – 2033)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Cronograma oficial da EC 132/2023 (ADCT Arts. 125-133): Como o ICMS e ISS permanecem na Guia DAS e sua transição gradual para o IBS/CBS.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Simular Ano:</span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {transitionSchedule.map((t) => (
              <button
                key={t.year}
                type="button"
                onClick={() => setSelectedYear(t.year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === t.year
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {t.year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destaque do Ano Selecionado */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-900 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 font-black text-xs font-mono">
              Ano {selectedYearData.year}
            </span>
            <h4 className="font-bold text-white text-sm">
              {selectedYearData.phase}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-300 block">Custo Tributário Estimado:</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              R$ {selectedYearData.totalMonthlyTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês ({selectedYearData.effectiveRatePct.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Parcela ICMS/ISS no DAS:</span>
            <span className="text-white font-black text-sm font-mono mt-0.5 block">
              {(selectedYearData.icmsIssFactor * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedYearData.icmsIssFactor === 1.0 ? '100% mantido na Guia DAS' : `${(selectedYearData.icmsIssFactor * 100).toFixed(0)}% no DAS / ${((1 - selectedYearData.icmsIssFactor) * 100).toFixed(0)}% IBS`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Alíquota CBS Federal:</span>
            <span className="text-indigo-300 font-black text-sm font-mono mt-0.5 block">
              {selectedYearData.cbsRate.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedYearData.year <= 2026 ? 'Alíquota teste compensável' : 'CBS definitiva'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Alíquota IBS Estadual/Mun.:</span>
            <span className="text-amber-300 font-black text-sm font-mono mt-0.5 block">
              {selectedYearData.ibsRate.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedYearData.year <= 2026 ? 'Alíquota teste estadual' : selectedYearData.year <= 2028 ? '0% (ICMS/ISS no DAS)' : 'Transição progressiva'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Guia DAS Estimada:</span>
            <span className="text-emerald-400 font-black text-sm font-mono mt-0.5 block">
              R$ {selectedYearData.dasEstimatedMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              + R$ {selectedYearData.ibsCbsNetMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (IBS/CBS líquido)
            </span>
          </div>
        </div>

        <p className="text-xs text-indigo-200/90 font-medium leading-relaxed pt-1">
          💡 <strong className="text-white">Fundamentação:</strong> {selectedYearData.notes}
        </p>
      </div>

      {/* Tabela Comparativa Completa 2026-2033 */}
      <div className="border border-indigo-100 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-indigo-50/70 text-indigo-950 font-bold border-b border-indigo-100">
              <tr>
                <th className="p-3">Ano</th>
                <th className="p-3">Fase da Transição Legal</th>
                <th className="p-3 text-center">Fator ICMS/ISS no DAS</th>
                <th className="p-3 text-center">Alíquota CBS</th>
                <th className="p-3 text-center">Alíquota IBS</th>
                <th className="p-3 text-right">Guia DAS Mensal</th>
                <th className="p-3 text-right">IBS + CBS Líquido</th>
                <th className="p-3 text-right">Total Impostos/mês</th>
                <th className="p-3 text-right">Carga Efetiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 font-mono">
              {transitionSchedule.map((row) => {
                const isSelected = row.year === selectedYear;
                return (
                  <tr
                    key={row.year}
                    onClick={() => setSelectedYear(row.year)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 font-bold text-slate-900'
                        : 'hover:bg-slate-50/70 text-slate-700'
                    }`}
                  >
                    <td className="p-3 font-black text-indigo-900 font-sans">
                      {row.year}
                      {isSelected && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      )}
                    </td>
                    <td className="p-3 font-medium text-slate-800 font-sans">
                      {row.phase}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.icmsIssFactor === 1.0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.icmsIssFactor > 0
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {(row.icmsIssFactor * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3 text-center text-indigo-700">
                      {row.cbsRate.toFixed(2)}%
                    </td>
                    <td className="p-3 text-center text-amber-700">
                      {row.ibsRate.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right font-medium">
                      R$ {row.dasEstimatedMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-indigo-800">
                      R$ {row.ibsCbsNetMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">
                      R$ {row.totalMonthlyTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {row.effectiveRatePct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicação de Destaque sobre o ICMS e ISS no DAS */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 text-indigo-900 font-black">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Diretriz Constitucional sobre o ICMS e ISS no Simples Nacional:</span>
        </div>
        <p className="leading-relaxed font-medium">
          O ICMS e o ISS continuam sendo recolhidos dentro da guia DAS unificada durante todo o período inicial da reforma (2027 a 2028), correspondendo à maior parcela tributária do Simples Nacional (de 45% a 65% da alíquota efetiva). A partir de 2029, inicia-se a redução gradual de 10% ao ano na parcela estadual e municipal da DAS, sendo absorvida progressivamente pelo IBS até a sua unificação completa em 2033 (Art. 130 do ADCT).
        </p>
      </div>
    </div>
  );
};
