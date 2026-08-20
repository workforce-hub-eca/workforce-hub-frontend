import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeDetailsPage } from './pages/EmployeeDetailsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/departments" replace />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/:id" element={<EmployeeDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
