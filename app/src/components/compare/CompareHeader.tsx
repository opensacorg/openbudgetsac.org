import { YearSelector } from '@/components/shared/YearSelector';

interface CompareHeaderProps {
  years: number[];
  year1: number;
  year2: number;
  usePct: boolean;
  onYear1Change: (y: number) => void;
  onYear2Change: (y: number) => void;
  onTogglePct: () => void;
}

export function CompareHeader({
  years, year1, year2, usePct,
  onYear1Change, onYear2Change, onTogglePct,
}: CompareHeaderProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap mb-6">
      <YearSelector
        years={years}
        value={year1}
        onChange={onYear1Change}
        label="Year 1"
      />
      <span className="text-gray-400 font-bold">vs</span>
      <YearSelector
        years={years}
        value={year2}
        onChange={onYear2Change}
        label="Year 2"
      />
      <div className="ml-auto flex rounded-md border border-gray-300 overflow-hidden">
        <button
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            !usePct ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => usePct && onTogglePct()}
        >
          $ Amount
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
            usePct ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => !usePct && onTogglePct()}
        >
          % Change
        </button>
      </div>
    </div>
  );
}
