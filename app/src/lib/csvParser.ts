import Papa from 'papaparse';
import type { BudgetRow } from '../types/budget';

// Department name normalization across years
const DEPT_NAME_MAP: Record<string, string> = {
  'Convention & Cultural Services': 'Convention and Cultural Services',
  'Human Resourcess': 'Human Resources',
  'Citywide & Community Support': 'Citywide and Community Support',
};

function normalizeDeptName(name: string): string {
  return DEPT_NAME_MAP[name] ?? name;
}

// Raw CSV row shape
interface RawRow {
  Fiscal_Year?: string;
  Department?: string;
  Fund?: string;
  CATEGORY?: string;
  Amount?: string;
  ExpenseRevenue?: string;
  Fund_Category?: string;
  ObjectId?: string;
  [key: string]: string | undefined;
}

function normalizeRow(raw: RawRow): BudgetRow | null {
  const erRaw = raw.ExpenseRevenue?.trim();
  let type: 'expense' | 'revenue';
  if (erRaw === 'E' || erRaw === 'Expenses') {
    type = 'expense';
  } else if (erRaw === 'R' || erRaw === 'Revenues') {
    type = 'revenue';
  } else {
    return null; // drop malformed rows
  }

  const fiscalYear = parseInt(raw.Fiscal_Year ?? '', 10);
  if (isNaN(fiscalYear)) return null;

  const amount = parseFloat(raw.Amount ?? '0');
  if (isNaN(amount)) return null;

  const department = normalizeDeptName((raw.Department ?? '').trim());

  return {
    fiscalYear,
    department,
    fund: (raw.Fund ?? '').trim(),
    category: (raw.CATEGORY ?? '').trim(),
    amount,
    type,
    fundCategory: (raw.Fund_Category ?? '').trim(),
    objectId: parseInt(raw.ObjectId ?? '0', 10),
  };
}

export async function loadBudgetCSV(url: string): Promise<BudgetRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rows: BudgetRow[] = [];
        for (const raw of results.data) {
          const row = normalizeRow(raw);
          if (row) rows.push(row);
        }
        resolve(rows);
      },
      error(err) {
        reject(new Error(err.message));
      },
    });
  });
}
