import { formatDollarsFull } from '@/lib/formatters';

// Color palette matching existing site
const NODE_COLORS: Record<string, string> = {
  revenue: '#7fc97f',
  'General Fund': '#4285ff',
  'Non-Discretionary Funds': '#8249b7',
  expense: '#ff8129',
};

export interface SankeyNodePayload {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  name: string;
  nodeType: 'revenue' | 'fund' | 'expense';
  value: number;
}

interface SankeyNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: SankeyNodePayload;
}

export function SankeyNode({ x = 0, y = 0, width = 20, height = 0, payload }: SankeyNodeProps) {
  if (!payload || height <= 0) return null;

  const { name, nodeType } = payload;
  const fillColor =
    nodeType === 'fund' ? (NODE_COLORS[name] ?? NODE_COLORS[nodeType]) : NODE_COLORS[nodeType] ?? '#888';

  const isLeftSide = nodeType === 'revenue';
  const textX = isLeftSide ? x - 6 : x + width + 6;
  const textAnchor = isLeftSide ? 'end' : 'start';
  const displayValue = formatDollarsFull(payload.value ?? 0);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fillColor} fillOpacity={0.9} />
      <title>{name}: {displayValue}</title>
      {height > 14 && (
        <text
          x={textX}
          y={y + height / 2}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={11}
          fill="#333"
          className="select-none"
        >
          {name.length > 22 ? name.slice(0, 20) + '…' : name}
        </text>
      )}
    </g>
  );
}
