import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { BudgetProvider } from './context/BudgetContext';
import { PageLayout } from './components/layout/PageLayout';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { FlowPage } from './pages/FlowPage';
import { TreemapPage } from './pages/TreemapPage';
import { ComparePage } from './pages/ComparePage';
import { WhoWeArePage } from './pages/WhoWeArePage';
import { NotFoundPage } from './pages/NotFoundPage';

function Root() {
  return (
    <BudgetProvider>
      <ErrorBoundary>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </ErrorBoundary>
    </BudgetProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'adopted-budget-flow', element: <FlowPage /> },
      { path: 'adopted-budget-tree', element: <TreemapPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'who-we-are', element: <WhoWeArePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
