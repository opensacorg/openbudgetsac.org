import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { CompareRecord, CompareDimension } from '@/types/budget';
import { DiffTable } from './DiffTable';
import { BarComparison } from './BarComparison';

interface BreakdownTabsProps {
  records: CompareRecord[];
  year1: number;
  year2: number;
  usePct: boolean;
  dimension: CompareDimension;
  onDimensionChange: (d: CompareDimension) => void;
}

export function BreakdownTabs({
  records, year1, year2, usePct, dimension, onDimensionChange,
}: BreakdownTabsProps) {
  return (
    <Tabs defaultValue="table">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
          <button
            className={`px-3 py-1.5 font-medium transition-colors ${
              dimension === 'department'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onDimensionChange('department')}
          >
            By Department
          </button>
          <button
            className={`px-3 py-1.5 font-medium border-l border-gray-300 transition-colors ${
              dimension === 'category'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onDimensionChange('category')}
          >
            By Category
          </button>
        </div>
      </div>
      <TabsContent value="table">
        <DiffTable records={records} year1={year1} year2={year2} usePct={usePct} />
      </TabsContent>
      <TabsContent value="bar">
        <BarComparison records={records} year1={year1} year2={year2} />
      </TabsContent>
    </Tabs>
  );
}
