import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDollarsFull } from '@/lib/formatters';
import type { CompareType } from '@/types/budget';

interface TotalSummaryProps {
  year1: number;
  year2: number;
  total1: number;
  total2: number;
  compareType: CompareType;
}

export function TotalSummary({ year1, year2, total1, total2, compareType }: TotalSummaryProps) {
  const diff = total2 - total1;
  const pctDiff = total1 > 0 ? diff / total1 : 0;
  const label = compareType === 'spending' ? 'Total Spending' : 'Total Revenue';
  const isIncrease = diff >= 0;

  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-600">{label} FY {year1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gray-900">{formatDollarsFull(total1)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-600">{label} FY {year2}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gray-900">{formatDollarsFull(total2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-600">Change</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {isIncrease ? '+' : ''}{formatDollarsFull(diff)}
          </p>
          <p className={`text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
            {isIncrease ? '+' : ''}{(pctDiff * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
