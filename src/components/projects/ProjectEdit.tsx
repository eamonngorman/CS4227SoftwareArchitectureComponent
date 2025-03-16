import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { ProjectStatus, DeadlineStatus, Project } from '../../types/project';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch, useAppSelector } from '../../types/store';
import { fetchProjectById, updateProject, selectProjectById } from '../../store/projectsSlice';

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const projectId = id ? parseInt(id) : 0;
  const project = useAppSelector((state) => selectProjectById(projectId)(state));
  const isLoading = useAppSelector((state) => state.projects.isLoading);
  const error = useAppSelector((state) => state.projects.error);
  
  // Local state for form data
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    try {
      await dispatch(updateProject(formData)).unwrap();
      navigate('/projects');
    } catch (err) {
      // Error handling is managed by Redux
    }
  };

  const handleChange = (field: keyof Project, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleClearDeadline = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      deadline: null,
      deadlineStatus: DeadlineStatus.NO_DEADLINE
    });
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
      <Container maxWidth="sm">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Project
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {Object.values(ProjectStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="Start Date"
            value={dayjs(formData.startDate)}
            onChange={(date) => handleChange('startDate', date?.format('YYYY-MM-DD'))}
            sx={{ mt: 2, width: '100%' }}
          />

          <DatePicker
            label="End Date"
            value={dayjs(formData.endDate)}
            onChange={(date) => handleChange('endDate', date?.format('YYYY-MM-DD'))}
            sx={{ mt: 2, width: '100%' }}
          />

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DatePicker
              label="Deadline"
              value={formData.deadline ? dayjs(formData.deadline) : null}
              onChange={(date) => handleChange('deadline', date?.format('YYYY-MM-DD') || null)}
              sx={{ flex: 1 }}
            />
            <Tooltip title="Clear deadline">
              <IconButton 
                onClick={handleClearDeadline}
                disabled={!formData.deadline}
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/projects')}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
} 