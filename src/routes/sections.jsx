import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import BlankLayout from 'src/layouts/components/blank-layout';
import FullLayout from 'src/layouts/components/dashboard-layout';
import Loadable from 'src/components/loadable/loadable';
import ProtectedRoute from './components/protected-route';

export const DashboardPage = Loadable(lazy(() => import('src/pages/dashboard')));
export const SuaraPage = Loadable(lazy(() => import('src/pages/suara')));
export const TimsesPage = Loadable(lazy(() => import('src/pages/timses')));
export const ProfilePage = Loadable(lazy(() => import('src/pages/profile')));
export const FullLogsPage = Loadable(lazy(() => import('src/pages/full-logs')));
export const LoginPage = Loadable(lazy(() => import('src/pages/login')));
export const Page404 = Loadable(lazy(() => import('src/pages/page-not-found')));

const Router = () => (
  <Routes>
    <Route path="/auth" element={<BlankLayout />}>
      <Route index element={<Navigate to="/auth/login" />} />
      <Route path="404" element={<Page404 />} />
      <Route path="login" element={<LoginPage />} />
    </Route>
    <Route path="/" element={<FullLayout />}>
      <Route index element={<Navigate to="/auth/login" />} />
      <Route path="dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="suara" element={<ProtectedRoute element={<SuaraPage />} />} />
      <Route path="timses" element={<ProtectedRoute element={<TimsesPage />} />} />
      <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="logs" element={<ProtectedRoute element={<FullLogsPage />} />} />
      <Route path="*" element={<Navigate to="/auth/404" />} />
    </Route>
  </Routes>
);

export default Router;
