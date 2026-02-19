import type { BudgetRow, CompareRecord, CompareType, CompareDimension } from '../types/budget';

function sum(rows: BudgetRow[]): number {
  return rows.reduce((acc, r) => acc + r.amount, 0);
}

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

export function buildCompareData(
  rows: BudgetRow[],
  year1: number,
  year2: number,
  compareType: CompareType,
  dimension: CompareDimension
): CompareRecord[] {
  const rowType: 'expense' | 'revenue' =
    compareType === 'spending' ? 'expense' : 'revenue';
  const keyFn = dimension === 'department'
    ? (r: BudgetRow) => r.department
    : (r: BudgetRow) => r.category;

  const y1Rows = rows.filter((r) => r.fiscalYear === year1 && r.type === rowType);
  const y2Rows = rows.filter((r) => r.fiscalYear === year2 && r.type === rowType);

  const y1Map = groupBy(y1Rows, keyFn);
  const y2Map = groupBy(y2Rows, keyFn);

  const allKeys = new Set([...y1Map.keys(), ...y2Map.keys()]);
  const records: CompareRecord[] = [];

  for (const key of allKeys) {
    const year1Amount = sum(y1Map.get(key) ?? []);
    const year2Amount = sum(y2Map.get(key) ?? []);
    const diff = year2Amount - year1Amount;
    let pctDiff: number;
    if (year1Amount === 0 && year2Amount > 0) {
      pctDiff = Infinity; // Newly Added
    } else if (year1Amount > 0 && year2Amount === 0) {
      pctDiff = -1; // 100% reduction
    } else if (year1Amount === 0) {
      pctDiff = 0;
    } else {
      pctDiff = diff / year1Amount;
    }
    records.push({ key, year1Amount, year2Amount, diff, pctDiff });
  }

  return records.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}

export function getTotalForYear(
  rows: BudgetRow[],
  year: number,
  compareType: CompareType
): number {
  const rowType: 'expense' | 'revenue' =
    compareType === 'spending' ? 'expense' : 'revenue';
  return sum(rows.filter((r) => r.fiscalYear === year && r.type === rowType));
}
