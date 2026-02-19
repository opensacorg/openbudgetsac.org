export interface BudgetRow {
  fiscalYear: number;
  department: string;
  fund: string;
  category: string;
  amount: number;
  type: 'expense' | 'revenue';
  fundCategory: string;
  objectId: number;
}

// Sankey
export interface SankeyNodeDatum {
  name: string;
  nodeType: 'revenue' | 'fund' | 'expense';
}
export interface SankeyLinkDatum {
  source: number;
  target: number;
  value: number;
}
export interface SankeyData {
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
}

// Treemap
export interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
  [key: string]: unknown;
}
export interface TreemapDrillState {
  level: 'top' | 'department';
  selectedDepartment: string | null;
}

// Compare
export type CompareType = 'spending' | 'revenue';
export type CompareDimension = 'department' | 'category';
export interface CompareRecord {
  key: string;
  year1Amount: number;
  year2Amount: number;
  diff: number;
  pctDiff: number;
}

// Context
export interface BudgetContextValue {
  rows: BudgetRow[];
  isLoading: boolean;
  error: string | null;
  availableYears: number[];
}
