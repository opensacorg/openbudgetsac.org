import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { CompareRecord } from '@/types/budget';
import { formatDollars, formatDollarsFull } from '@/lib/formatters';

interface BarComparisonProps {
  records: CompareRecord[];
  year1: number;
  year2: number;
  limit?: number;
}

export function BarComparison({ records, year1, year2, limit = 15 }: BarComparisonProps) {
  const data = records
    .slice(0, limit)
    .map((r) => ({
      name: r.key.length > 20 ? r.key.slice(0, 18) + '…' : r.key,
      [String(year1)]: r.year1Amount,
      [String(year2)]: r.year2Amount,
    }));

  return (
    <div style={{ height: Math.max(300, data.length * 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatDollars(v)}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number | string | undefined) =>
              formatDollarsFull(Number(value ?? 0))
            }
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend />
          <Bar dataKey={String(year1)} fill="#4285ff" name={`FY ${year1}`} />
          <Bar dataKey={String(year2)} fill="#ff8129" name={`FY ${year2}`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
