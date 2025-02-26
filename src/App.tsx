import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProjectList from './components/projects/ProjectList';
import ProjectDetails from './components/projects/ProjectDetails';
import ProjectCreate from './components/projects/ProjectCreate';
import Dashboard from './components/dashboard/Dashboard';
import ReviewList from './components/reviews/ReviewList';
import ReviewForm from './components/reviews/ReviewForm';
import InstitutionDashboard from './components/institution/InstitutionDashboard';
import UserProfileSettings from './components/user/UserProfileSettings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* All Routes are now public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <ProjectList />
            </Layout>
          }
        />
        <Route
          path="/projects/new"
          element={
            <Layout>
              <ProjectCreate />
            </Layout>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Layout>
              <ProjectDetails />
            </Layout>
          }
        />
        <Route
          path="/reviews"
          element={
            <Layout>
              <ReviewList />
            </Layout>
          }
        />
        <Route
          path="/reviews/:id"
          element={
            <Layout>
              <ReviewForm />
            </Layout>
          }
        />
        <Route
          path="/institution"
          element={
            <Layout>
              <InstitutionDashboard />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <UserProfileSettings />
            </Layout>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
