import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProjectList from './components/projects/ProjectList';
import ProjectDetails from './components/projects/ProjectDetails';
import ProjectCreate from './components/projects/ProjectCreate';
import ProjectEdit from './components/projects/ProjectEdit';
import Dashboard from './components/dashboard/Dashboard';
import ReviewList from './components/reviews/ReviewList';
import ReviewForm from './components/reviews/ReviewForm';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <CssBaseline />
        <Routes>
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
            path="/projects/:id/edit"
            element={
              <Layout>
                <ProjectEdit />
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

          {/* Default route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
