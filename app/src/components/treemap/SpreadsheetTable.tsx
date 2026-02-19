import { formatDollarsFull } from '@/lib/formatters';
import type { SpreadsheetRow } from '@/lib/treemapTransforms';

interface SpreadsheetTableProps {
  rows: SpreadsheetRow[];
  type: 'expense' | 'revenue';
}

export function SpreadsheetTable({ rows, type }: SpreadsheetTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Top {rows.length} {type === 'expense' ? 'Expenses' : 'Revenue Sources'}
      </h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-12">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.rank}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-2.5 text-gray-400">{row.rank}</td>
                <td className="px-4 py-2.5 text-gray-800">{row.name}</td>
                <td className="px-4 py-2.5 text-right text-gray-800 font-mono">
                  {formatDollarsFull(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
