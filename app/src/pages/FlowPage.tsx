import { useState, useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { buildSankeyData } from '@/lib/flowTransforms';
import { SankeyChart } from '@/components/flow/SankeyChart';
import { YearSelector } from '@/components/shared/YearSelector';
import { LoadingState } from '@/components/shared/LoadingState';

export function FlowPage() {
  const { rows, isLoading, error, availableYears } = useBudget();
  const [year, setYear] = useState<number | null>(null);

  const selectedYear = year ?? availableYears[0] ?? 2025;

  const sankeyData = useMemo(
    () => (rows.length > 0 ? buildSankeyData(rows, selectedYear) : { nodes: [], links: [] }),
    [rows, selectedYear]
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Budget Overview</h1>
        <p className="text-gray-600 mb-4">
          A bird&apos;s eye view of where Sacramento&apos;s money comes from and where it goes.
          Revenues flow left-to-right through funds into expenses.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <YearSelector
            years={availableYears}
            value={selectedYear}
            onChange={setYear}
          />
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#7fc97f' }} />
              Revenue
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#4285ff' }} />
              General Fund
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#8249b7' }} />
              Non-Discretionary
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#ff8129' }} />
              Expense
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 px-2">
          <span>Revenues</span>
          <span>Expenses</span>
        </div>
        <SankeyChart data={sankeyData} />
      </div>
    </div>
  );
}
