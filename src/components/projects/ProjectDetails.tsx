import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../types/store';
import { 
  fetchProjectById, 
  deleteProject, 
  selectProjectById 
} from '../../store/projectsSlice';
import { Project, ProjectStatus } from '../../types/project';
import StatusHistoryList from './StatusHistoryList';

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.PENDING:
      return 'warning';
    case ProjectStatus.IN_PROGRESS:
      return 'info';
    case ProjectStatus.COMPLETED:
      return 'success';
    case ProjectStatus.ON_HOLD:
      return 'warning';
    case ProjectStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

const getDeadlineStatusColor = (status: string) => {
  switch (status) {
    case 'ON_TRACK':
      return 'success';
    case 'APPROACHING':
      return 'warning';
    case 'OVERDUE':
      return 'error';
    default:
      return 'default';
  }
};

const formatStatus = (status: string | null) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projectId = id ? parseInt(id) : 0;
  
  const project = useAppSelector((state) => selectProjectById(projectId)(state));
  const isLoading = useAppSelector((state) => state.projects.isLoading);
  const error = useAppSelector((state) => state.projects.error);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      navigate('/projects', { state: { message: 'Project deleted successfully' } });
    } catch (err) {
      // Error handling is managed by Redux
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {project.title}
            </Typography>
            <Chip
              label={formatStatus(project.status)}
              color={getStatusColor(project.status)}
              sx={{ mb: 2 }}
            />
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/projects/${project.id}/edit`)}
            >
              Edit Project
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Project
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {project.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography>
                  {formatDate(project.startDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  End Date
                </Typography>
                <Typography>
                  {formatDate(project.endDate)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Deadline
                </Typography>
                <Typography>
                  {project.deadline ? formatDate(project.deadline) : 'No deadline set'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Deadline Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={project.deadlineStatus ? project.deadlineStatus.replace('_', ' ') : 'NO DEADLINE'}
                    color={getDeadlineStatusColor(project.deadlineStatus || 'NO_DEADLINE')}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Status History
            </Typography>
            <StatusHistoryList projectId={project.id} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Owner
              </Typography>
              <Typography paragraph>
                {project.owner.username}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography paragraph>
                {formatDate(project.createdAt)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography>
                {formatDate(project.updatedAt)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails; 