import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/auth-context';
import { queryClient } from './lib/query-client';
import { ProtectedRoute } from './components/auth/protected-route';
import { AuthenticatedLayout } from './components/layout/authenticated-layout';
import { LoginPage } from './pages/login';
import { CategoriesPage } from './pages/categories';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="jobs" element={<div>Jobs</div>} />
              <Route path="history" element={<div>History</div>} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

// Dashboard component for authenticated layout
function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Dashboard coming soon...</p>
      </div>
    </div>
  );
}

export default App
