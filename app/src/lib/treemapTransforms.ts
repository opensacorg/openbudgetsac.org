import type { BudgetRow, TreemapNode, TreemapDrillState } from '../types/budget';

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const arr = map.get(key) ?? [];
    arr.push(item);
    map.set(key, arr);
  }
  return map;
}

function sum(rows: BudgetRow[]): number {
  return rows.reduce((acc, r) => acc + r.amount, 0);
}

export function buildTreemapData(
  rows: BudgetRow[],
  year: number,
  type: 'expense' | 'revenue',
  drillState: TreemapDrillState
): TreemapNode[] {
  const filtered = rows.filter((r) => r.fiscalYear === year && r.type === type);

  if (drillState.level === 'top') {
    const byDept = groupBy(filtered, (r) => r.department);
    return [...byDept.entries()]
      .map(([name, deptRows]) => ({
        name,
        value: sum(deptRows),
      }))
      .filter((n) => n.value > 0)
      .sort((a, b) => b.value - a.value);
  } else {
    // Drilled into a department
    const deptRows = filtered.filter(
      (r) => r.department === drillState.selectedDepartment
    );
    const byCategory = groupBy(deptRows, (r) => r.category);
    return [...byCategory.entries()]
      .map(([name, catRows]) => ({
        name,
        value: sum(catRows),
      }))
      .filter((n) => n.value > 0)
      .sort((a, b) => b.value - a.value);
  }
}

export interface SpreadsheetRow {
  rank: number;
  name: string;
  amount: number;
}

export function buildSpreadsheetRows(
  nodes: TreemapNode[],
  limit = 40
): SpreadsheetRow[] {
  return nodes
    .slice(0, limit)
    .map((n, i) => ({ rank: i + 1, name: n.name, value: n.value ?? 0 }))
    .map((n) => ({ rank: n.rank, name: n.name, amount: n.value }));
}
