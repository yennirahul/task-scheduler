import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';
import Workers from './pages/Workers';
import ExecutionHistory from './pages/ExecutionHistory';
import ExecutionDetails from './pages/ExecutionDetails';
import AuditLogs from './pages/AuditLogs';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="workers" element={<Workers />} />
          <Route path="executions" element={<ExecutionHistory />} />
          <Route path="executions/:id" element={<ExecutionDetails />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
