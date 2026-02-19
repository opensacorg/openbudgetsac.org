import { Link } from 'react-router-dom';

interface VisualizationCardProps {
  href: string;
  title: string;
  description: string;
  external?: boolean;
}

function VisualizationCard({ href, title, description, external }: VisualizationCardProps) {
  const inner = (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return <Link to={href} className="block">{inner}</Link>;
}

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Sacramento deserves to know what is in the budget and how it is made.
      </h1>
      <p className="text-lg text-gray-600 mb-4 leading-relaxed">
        Open Budget: Sacramento takes current and past budget data published by the City of
        Sacramento and transforms them into accessible visualizations. Our aim is to enable
        community members to examine their city&apos;s budget for themselves.
      </p>
      <p className="text-base text-gray-500 mb-10">
        We have a suite of data viewing tools to help you understand Sacramento&apos;s budget.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <VisualizationCard
          href="/adopted-budget-flow"
          title="Overview"
          description="Get a bird's eye view of the big picture for a single year: where money comes from, and where it goes."
        />
        <VisualizationCard
          href="/compare"
          title="Comparison"
          description="Put two budgets head-to-head. How much did the budget grow or shrink? How are cuts and increases distributed across spending categories? How did revenue sources change?"
        />
        <VisualizationCard
          href="/adopted-budget-tree"
          title="Detail"
          description="Drill down into detailed spending and revenue data for each department and fund for a single year."
        />
        <VisualizationCard
          href="https://explorer.openbudgetsac.org/"
          title="Custom Queries"
          description="Explore the details of the City of Sacramento's adopted budget."
          external
        />
      </div>
    </div>
  );
}
