import { useState, useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { buildCompareData, getTotalForYear } from '@/lib/compareTransforms';
import type { CompareType, CompareDimension } from '@/types/budget';
import { CompareHeader } from '@/components/compare/CompareHeader';
import { TotalSummary } from '@/components/compare/TotalSummary';
import { BreakdownTabs } from '@/components/compare/BreakdownTabs';
import { LoadingState } from '@/components/shared/LoadingState';

export function ComparePage() {
  const { rows, isLoading, error, availableYears } = useBudget();

  const defaultYear1 = availableYears[1] ?? 2024;
  const defaultYear2 = availableYears[0] ?? 2025;

  const [year1, setYear1] = useState<number | null>(null);
  const [year2, setYear2] = useState<number | null>(null);
  const [compareType, setCompareType] = useState<CompareType>('spending');
  const [dimension, setDimension] = useState<CompareDimension>('department');
  const [usePct, setUsePct] = useState(false);

  const selectedYear1 = year1 ?? defaultYear1;
  const selectedYear2 = year2 ?? defaultYear2;

  const compareData = useMemo(
    () => buildCompareData(rows, selectedYear1, selectedYear2, compareType, dimension),
    [rows, selectedYear1, selectedYear2, compareType, dimension]
  );

  const total1 = useMemo(
    () => getTotalForYear(rows, selectedYear1, compareType),
    [rows, selectedYear1, compareType]
  );

  const total2 = useMemo(
    () => getTotalForYear(rows, selectedYear2, compareType),
    [rows, selectedYear2, compareType]
  );

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Budgets</h1>
        <p className="text-gray-600 mb-4">
          Put two fiscal years head-to-head to see how spending and revenue changed.
        </p>
        <div className="flex rounded-md border border-gray-300 overflow-hidden w-fit mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              compareType === 'spending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCompareType('spending')}
          >
            Spending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              compareType === 'revenue'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCompareType('revenue')}
          >
            Revenue
          </button>
        </div>
      </div>

      <CompareHeader
        years={availableYears}
        year1={selectedYear1}
        year2={selectedYear2}
        usePct={usePct}
        onYear1Change={setYear1}
        onYear2Change={setYear2}
        onTogglePct={() => setUsePct((v) => !v)}
      />

      <TotalSummary
        year1={selectedYear1}
        year2={selectedYear2}
        total1={total1}
        total2={total2}
        compareType={compareType}
      />

      <BreakdownTabs
        records={compareData}
        year1={selectedYear1}
        year2={selectedYear2}
        usePct={usePct}
        dimension={dimension}
        onDimensionChange={setDimension}
      />
    </div>
  );
}
