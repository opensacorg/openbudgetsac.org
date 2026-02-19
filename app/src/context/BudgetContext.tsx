import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { BudgetContextValue, BudgetRow } from '../types/budget';
import { loadBudgetCSV } from '../lib/csvParser';

const BudgetContext = createContext<BudgetContextValue | null>(null);

const CSV_URL = '/data/City_of_Sacramento_Approved_Budgets.csv';

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<BudgetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBudgetCSV(CSV_URL)
      .then((data) => {
        setRows(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const availableYears = [...new Set(rows.map((r) => r.fiscalYear))].sort(
    (a, b) => b - a
  );

  return (
    <BudgetContext.Provider value={{ rows, isLoading, error, availableYears }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
}
