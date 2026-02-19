import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
          {items.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  {
    label: 'Visualizations',
    items: [
      { label: 'Budget Overview (Flow)', href: '/adopted-budget-flow' },
      { label: 'Budget Detail (Treemap)', href: '/adopted-budget-tree' },
      { label: 'Compare Budgets', href: '/compare' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'Who We Are', href: '/who-we-are' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    label: 'Data',
    items: [
      {
        label: 'Sacramento Budget 2022/23',
        href: 'https://www.cityofsacramento.org/-/media/Corporate/Files/Finance/Budget/FY2022_23_ApprovedBudget_Revised_WEB.pdf',
        external: true,
      },
      {
        label: 'City of Sacramento Budget',
        href: 'https://www.cityofsacramento.org/Finance/Budget',
        external: true,
      },
      {
        label: 'Recent Sacramento Budget Data',
        href: 'https://data.cityofsacramento.org/datasets/7b8b3680603c4894bd3faaa41c986c7c_0/explore',
        external: true,
      },
    ],
  },
  {
    label: 'Resources',
    items: [{ label: 'Tools and Projects', href: '/tools-projects' }],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center">
            <span className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Open Budget: Sacramento
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavDropdown key={item.label} label={item.label} items={item.items} />
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((group) =>
            group.items.map((item) =>
              ('external' in item && item.external) ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )
          )}
        </div>
      )}
    </nav>
  );
}
