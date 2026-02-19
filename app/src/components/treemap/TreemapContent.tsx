import { formatDollars } from '@/lib/formatters';

// Color palette matching existing site
const COLORS = [
  '#970000', '#CD0059', '#E23600', '#F07400',
  '#EDA400', '#009F76', '#008F16', '#395BF6', '#690180',
];

interface ContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  name?: string;
  value?: number;
  onDrillDown?: (name: string) => void;
}

export function TreemapContent({
  x = 0, y = 0, width = 0, height = 0,
  index = 0, name = '', value = 0,
  onDrillDown,
}: ContentProps) {
  if (width <= 0 || height <= 0) return null;

  const color = COLORS[index % COLORS.length];
  const canShowLabel = width > 50 && height > 30;
  const canShowValue = width > 70 && height > 50;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        fill={color}
        fillOpacity={0.85}
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
        onClick={() => onDrillDown?.(name)}
      />
      {canShowLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (canShowValue ? 8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={Math.min(12, width / 8)}
          fontWeight="600"
          className="select-none pointer-events-none"
        >
          {name.length > 16 ? name.slice(0, 14) + '…' : name}
        </text>
      )}
      {canShowValue && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.85)"
          fontSize={10}
          className="select-none pointer-events-none"
        >
          {formatDollars(value)}
        </text>
      )}
    </g>
  );
}
