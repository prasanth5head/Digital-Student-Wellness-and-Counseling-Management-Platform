import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Unauthorized from '../pages/auth/Unauthorized';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import AssessmentWizard from '../pages/student/AssessmentWizard';
import AssessmentHistory from '../pages/student/AssessmentHistory';
import StudentAppointments from '../pages/student/StudentAppointments';
import StudentRequests from '../pages/student/StudentRequests';
import StudentChat from '../pages/student/StudentChat';
import StudentResources from '../pages/student/StudentResources';
import StudentProfile from '../pages/student/StudentProfile';

// Counselor Pages
import CounselorDashboard from '../pages/counselor/CounselorDashboard';
import AssignedStudents from '../pages/counselor/AssignedStudents';
import StudentWellnessProfile from '../pages/counselor/StudentWellnessProfile';
import CounselorAppointments from '../pages/counselor/CounselorAppointments';
import CounselorRequests from '../pages/counselor/CounselorRequests';
import CounselorChat from '../pages/counselor/CounselorChat';
import CounselorSessions from '../pages/counselor/CounselorSessions';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import DepartmentAnalytics from '../pages/admin/DepartmentAnalytics';
import UserManagement from '../pages/admin/UserManagement';
import QuestionManagement from '../pages/admin/QuestionManagement';
import ResourceManagement from '../pages/admin/ResourceManagement';
import Announcements from '../pages/admin/Announcements';
import AuditLogs from '../pages/admin/AuditLogs';

// Protected Route Wrapper with Strict RBAC Isolation
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'ROLE_STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (role === 'ROLE_COUNSELOR') return <Navigate to="/counselor/dashboard" replace />;
    if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Root Redirect Helper
const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ROLE_STUDENT') return <Navigate to="/student/dashboard" replace />;
  if (role === 'ROLE_COUNSELOR') return <Navigate to="/counselor/dashboard" replace />;
  if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Student Portal Routes - STRICT: Only Students */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="assessment" element={<AssessmentWizard />} />
        <Route path="assessment/history" element={<AssessmentHistory />} />
        <Route path="appointments" element={<StudentAppointments />} />
        <Route path="requests" element={<StudentRequests />} />
        <Route path="chat" element={<StudentChat />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Counselor Portal Routes - STRICT: Only Counselors */}
      <Route
        path="/counselor"
        element={
          <ProtectedRoute allowedRoles={['ROLE_COUNSELOR']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CounselorDashboard />} />
        <Route path="students" element={<AssignedStudents />} />
        <Route path="students/:studentId" element={<StudentWellnessProfile />} />
        <Route path="appointments" element={<CounselorAppointments />} />
        <Route path="requests" element={<CounselorRequests />} />
        <Route path="chat" element={<CounselorChat />} />
        <Route path="sessions" element={<CounselorSessions />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Portal Routes - STRICT: Only Administrators */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="departments" element={<DepartmentAnalytics />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
