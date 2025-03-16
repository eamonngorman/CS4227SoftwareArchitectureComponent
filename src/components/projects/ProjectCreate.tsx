import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from '../../types/project';
import { useAppDispatch, useAppSelector } from '../../types/store';
import { createProject, ProjectFormData } from '../../store/projectsSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  status: ProjectStatus.PENDING,
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
  deadline: null
};

const ProjectCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  
  const isLoading = useAppSelector((state) => state.projects.isLoading);
  const error = useAppSelector((state) => state.projects.error);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(createProject(formData)).unwrap();
      navigate('/projects');
    } catch (err) {
      // Error handling is managed by Redux
    }
  };

  const handleChange = (field: keyof ProjectFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleStatusChange = (event: SelectChangeEvent<ProjectStatus>) => {
    setFormData(prev => ({
      ...prev,
      status: event.target.value as ProjectStatus
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate' | 'deadline') => (date: dayjs.Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD') : null
    }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Project
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Project Title"
            value={formData.title}
            onChange={handleChange('title')}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            margin="normal"
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select<ProjectStatus>
              value={formData.status}
              label="Status"
              onChange={handleStatusChange}
            >
              {Object.values(ProjectStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={dayjs(formData.startDate)}
              onChange={handleDateChange('startDate')}
              sx={{ flex: 1 }}
            />
            <DatePicker
              label="End Date"
              value={dayjs(formData.endDate)}
              onChange={handleDateChange('endDate')}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <DatePicker
              label="Deadline (Optional)"
              value={formData.deadline ? dayjs(formData.deadline) : null}
              onChange={handleDateChange('deadline')}
              sx={{ width: '100%' }}
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
            >
              Create Project
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/projects')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProjectCreate; 