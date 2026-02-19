import { formatDollarsFull } from '@/lib/formatters';

interface FlowTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      source?: { name: string };
      target?: { name: string };
      value?: number;
      name?: string;
    };
  }>;
}

export function FlowTooltip({ active, payload }: FlowTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const isLink = data.source !== undefined;

  if (isLink) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm">
        <p className="font-medium text-gray-900">
          {data.source?.name} → {data.target?.name}
        </p>
        <p className="text-gray-600">{formatDollarsFull(data.value ?? 0)}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{data.name}</p>
      <p className="text-gray-600">{formatDollarsFull(data.value ?? 0)}</p>
    </div>
  );
}
