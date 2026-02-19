import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import type { SankeyData } from '@/types/budget';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';
import { FlowTooltip } from './FlowTooltip';

interface SankeyChartProps {
  data: SankeyData;
}

export function SankeyChart({ data }: SankeyChartProps) {
  if (data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available for this year.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: 620 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<SankeyNode />}
          link={<SankeyLink />}
          nodePadding={10}
          nodeWidth={20}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
        >
          <Tooltip content={<FlowTooltip />} />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
