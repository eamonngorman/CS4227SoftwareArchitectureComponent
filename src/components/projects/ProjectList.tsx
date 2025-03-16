import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from '../../types/project';
import { useAppDispatch, useAppSelector } from '../../types/store';
import { 
  fetchProjects, 
  updateProjectStatus, 
  setStatusFilter, 
  setSearchTerm,
  selectFilteredProjects 
} from '../../store/projectsSlice';

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

const ProjectList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const filteredProjects = useAppSelector(selectFilteredProjects);
  const isLoading = useAppSelector((state) => state.projects.isLoading);
  const error = useAppSelector((state) => state.projects.error);
  const statusFilter = useAppSelector((state) => state.projects.statusFilter);
  const searchTerm = useAppSelector((state) => state.projects.searchTerm);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleStatusFilterChange = (event: any) => {
    dispatch(setStatusFilter(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Research Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/projects/new')}
        >
          Create New Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search projects"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title or description"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status Filter</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status Filter"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              {Object.values(ProjectStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {formatStatus(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Deadline Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!filteredProjects || filteredProjects.length === 0) ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    {error ? 'Error loading projects' : 
                     searchTerm || statusFilter !== 'ALL' ? 
                     'No projects match the current filters' : 
                     'No projects found. Create your first project!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(project.status)}
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={project.deadlineStatus ? project.deadlineStatus.replace('_', ' ') : 'NO DEADLINE'}
                      color={getDeadlineStatusColor(project.deadlineStatus || 'NO_DEADLINE')}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{project.owner?.username || 'No owner'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProjectList; 