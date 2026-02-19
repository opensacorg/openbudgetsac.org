import type { BudgetRow, SankeyData, SankeyNodeDatum, SankeyLinkDatum } from '../types/budget';

// Fixed ordering from flow.js
const REV_ORDER = [
  'Taxes',
  'Charges, Fees, and Services',
  'Miscellaneous Revenue',
  'Intergovernmental',
  'Contributions from Other Funds',
  'Licenses and Permits',
  'Fines, Forfeitures, and  Penalties',
  'Interest, Rents, and Concessions',
];

const EXP_ORDER = [
  'Police',
  'Utilities',
  'Citywide and Community Support',
  'General Services',
  'Fire',
  'Debt Service',
  'Public Works',
  'Human Resources',
  'Parks and Recreation',
  'Community Development',
  'Convention and Cultural Services',
  'Finance',
  'Information Technology',
  'City Attorney',
  'Mayor/Council',
  'City Manager',
  'City Treasurer',
  'Economic Development',
  'City Clerk',
  'Non-Appropriated',
];

function sortByOrder(order: string[]) {
  return (a: string, b: string) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  };
}

function groupByKey<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
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

export function buildSankeyData(rows: BudgetRow[], year: number): SankeyData {
  const yearRows = rows.filter((r) => r.fiscalYear === year);

  // Index 0: General Fund, Index 1: Non-Discretionary Funds
  const nodes: SankeyNodeDatum[] = [
    { name: 'General Fund', nodeType: 'fund' },
    { name: 'Non-Discretionary Funds', nodeType: 'fund' },
  ];
  const links: SankeyLinkDatum[] = [];

  // --- Revenue nodes (indices 2..N) ---
  const revRows = yearRows.filter((r) => r.type === 'revenue');
  const revByCategory = groupByKey(revRows, (r) => r.category);
  const revCategories = [...revByCategory.keys()].sort(sortByOrder(REV_ORDER));

  for (const cat of revCategories) {
    const catRows = revByCategory.get(cat)!;
    const nodeIdx = nodes.length;
    nodes.push({ name: cat, nodeType: 'revenue' });

    // Split between GF and non-GF
    const gfAmount = sum(catRows.filter((r) => r.fund === 'General Fund'));
    const nonGfAmount = sum(catRows.filter((r) => r.fund !== 'General Fund'));

    if (gfAmount > 0) {
      links.push({ source: nodeIdx, target: 0, value: gfAmount });
    }
    if (nonGfAmount > 0) {
      links.push({ source: nodeIdx, target: 1, value: nonGfAmount });
    }
  }

  // --- Expense nodes (indices N+1..M) ---
  const expRows = yearRows.filter((r) => r.type === 'expense');
  const expByDept = groupByKey(expRows, (r) => r.department);
  const expDepts = [...expByDept.keys()].sort(sortByOrder(EXP_ORDER));

  for (const dept of expDepts) {
    const deptRows = expByDept.get(dept)!;
    const nodeIdx = nodes.length;
    nodes.push({ name: dept, nodeType: 'expense' });

    // Split between GF and non-GF
    const gfAmount = sum(deptRows.filter((r) => r.fund === 'General Fund'));
    const nonGfAmount = sum(deptRows.filter((r) => r.fund !== 'General Fund'));

    if (gfAmount > 0) {
      links.push({ source: 0, target: nodeIdx, value: gfAmount });
    }
    if (nonGfAmount > 0) {
      links.push({ source: 1, target: nodeIdx, value: nonGfAmount });
    }
  }

  return { nodes, links };
}
