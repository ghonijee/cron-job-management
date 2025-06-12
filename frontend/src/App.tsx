import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Login } from '@/pages/auth/Login';
import { Categories } from '@/pages/category/Categories';
import { Jobs } from '@/pages/job/Jobs';
import { History } from '@/pages/history/History';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.CATEGORIES} element={<Categories />} />
        <Route path={ROUTES.JOBS} element={<Jobs />} />
        <Route path={ROUTES.HISTORY} element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
