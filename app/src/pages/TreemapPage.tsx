import { useState, useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { buildTreemapData, buildSpreadsheetRows } from '@/lib/treemapTransforms';
import type { TreemapDrillState } from '@/types/budget';
import { TreemapChart } from '@/components/treemap/TreemapChart';
import { Breadcrumb } from '@/components/treemap/Breadcrumb';
import { SpreadsheetTable } from '@/components/treemap/SpreadsheetTable';
import { YearSelector } from '@/components/shared/YearSelector';
import { LoadingState } from '@/components/shared/LoadingState';

const INITIAL_DRILL_STATE: TreemapDrillState = { level: 'top', selectedDepartment: null };

export function TreemapPage() {
  const { rows, isLoading, error, availableYears } = useBudget();
  const [year, setYear] = useState<number | null>(null);
  const [dataType, setDataType] = useState<'expense' | 'revenue'>('expense');
  const [drillState, setDrillState] = useState<TreemapDrillState>(INITIAL_DRILL_STATE);

  const selectedYear = year ?? availableYears[0] ?? 2025;

  const treemapData = useMemo(
    () => buildTreemapData(rows, selectedYear, dataType, drillState),
    [rows, selectedYear, dataType, drillState]
  );

  const spreadsheetRows = useMemo(
    () => buildSpreadsheetRows(treemapData),
    [treemapData]
  );

  function handleDrillDown(name: string) {
    setDrillState({ level: 'department', selectedDepartment: name });
  }

  function handleReset() {
    setDrillState(INITIAL_DRILL_STATE);
  }

  function handleYearChange(y: number) {
    setYear(y);
    setDrillState(INITIAL_DRILL_STATE);
  }

  function handleTypeChange(t: 'expense' | 'revenue') {
    setDataType(t);
    setDrillState(INITIAL_DRILL_STATE);
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Budget Detail</h1>
        <p className="text-gray-600 mb-4">
          Click a department to drill down into individual spending categories. Each box is sized proportionally to its budget.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <YearSelector
            years={availableYears}
            value={selectedYear}
            onChange={handleYearChange}
          />
          <div className="flex rounded-md border border-gray-300 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                dataType === 'expense'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              Spending
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                dataType === 'revenue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTypeChange('revenue')}
            >
              Revenue
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <Breadcrumb
          department={drillState.selectedDepartment}
          onReset={handleReset}
        />
        <TreemapChart data={treemapData} onDrillDown={handleDrillDown} />
      </div>

      <SpreadsheetTable rows={spreadsheetRows} type={dataType} />
    </div>
  );
}
