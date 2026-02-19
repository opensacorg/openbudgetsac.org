import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import type { TreemapNode } from '@/types/budget';
import { TreemapContent } from './TreemapContent';
import { formatDollarsFull } from '@/lib/formatters';

interface TreemapChartProps {
  data: TreemapNode[];
  onDrillDown: (name: string) => void;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: TreemapNode }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{name}</p>
      {value !== undefined && <p className="text-gray-600">{formatDollarsFull(value)}</p>}
    </div>
  );
}

export function TreemapChart({ data, onDrillDown }: TreemapChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#fff"
          content={
            <TreemapContent onDrillDown={onDrillDown} />
          }
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
