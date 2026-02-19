import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearSelectorProps {
  years: number[];
  value: number;
  onChange: (year: number) => void;
  label?: string;
}

export function YearSelector({ years, value, onChange, label = 'Fiscal Year' }: YearSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{label}:</label>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              FY {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
