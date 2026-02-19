import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  department: string | null;
  onReset: () => void;
}

export function Breadcrumb({ department, onReset }: BreadcrumbProps) {
  if (!department) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-600 mb-3">
      <button
        onClick={onReset}
        className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
      >
        All Departments
      </button>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <span className="text-gray-900 font-medium">{department}</span>
    </nav>
  );
}
