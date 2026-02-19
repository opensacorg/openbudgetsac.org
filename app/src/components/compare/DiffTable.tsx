import type { CompareRecord } from '@/types/budget';
import { formatDollarsFull, formatPct, asDiff } from '@/lib/formatters';

interface DiffTableProps {
  records: CompareRecord[];
  year1: number;
  year2: number;
  usePct: boolean;
}

export function DiffTable({ records, year1, year2, usePct }: DiffTableProps) {
  const sorted = [...records].sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">FY {year1}</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">FY {year2}</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Change</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((rec) => {
            const isPos = rec.diff >= 0;
            const diffText =
              rec.pctDiff === Infinity
                ? 'Newly Added'
                : usePct
                ? formatPct(Math.abs(rec.pctDiff))
                : asDiff(rec.diff, false);
            return (
              <tr key={rec.key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-800 font-medium">{rec.key}</td>
                <td className="px-4 py-2.5 text-right text-gray-600 font-mono">
                  {rec.year1Amount > 0 ? formatDollarsFull(rec.year1Amount) : '—'}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-600 font-mono">
                  {rec.year2Amount > 0 ? formatDollarsFull(rec.year2Amount) : '—'}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium font-mono ${
                  rec.pctDiff === Infinity
                    ? 'text-blue-600'
                    : isPos
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {rec.pctDiff === Infinity ? diffText : `${isPos ? '+' : ''}${diffText}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
