import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { useParams } from 'react-router-dom';

// Mock data - would come from API in real application
const mockProject = {
  id: 1,
  title: 'AI Research Project',
  description: 'Research on machine learning applications in healthcare, focusing on early disease detection using neural networks.',
  status: 'In Progress',
  startDate: '2024-01-15',
  endDate: '2024-12-31',
  progress: 35,
  institution: 'University of Technology',
  principalInvestigator: 'Dr. Jane Smith',
  team: ['Dr. Jane Smith', 'John Doe', 'Sarah Wilson'],
  milestones: [
    {
      id: 1,
      title: 'Literature Review',
      status: 'Completed',
      dueDate: '2024-02-28',
      progress: 100
    },
    {
      id: 2,
      title: 'Data Collection',
      status: 'In Progress',
      dueDate: '2024-04-30',
      progress: 45
    },
    {
      id: 3,
      title: 'Initial Analysis',
      status: 'Not Started',
      dueDate: '2024-06-30',
      progress: 0
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Review Recent Publications',
      status: 'Completed',
      assignedTo: 'Sarah Wilson',
      dueDate: '2024-02-15'
    },
    {
      id: 2,
      title: 'Data Preprocessing',
      status: 'In Progress',
      assignedTo: 'John Doe',
      dueDate: '2024-03-20'
    },
    {
      id: 3,
      title: 'Model Architecture Design',
      status: 'Not Started',
      assignedTo: 'Dr. Jane Smith',
      dueDate: '2024-04-15'
    }
  ]
};

const ProjectDetails = () => {
  const { id } = useParams();

  // In real app, would fetch project data based on id
  
  return (
    <Box>
      {/* Project Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {mockProject.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {mockProject.description}
            </Typography>
          </Box>
          <Button variant="contained" color="primary">
            Edit Project
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Chip 
              label={mockProject.status} 
              color={mockProject.status === 'In Progress' ? 'primary' : 'default'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Timeline</Typography>
            <Typography variant="body2">
              {mockProject.startDate} - {mockProject.endDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Institution</Typography>
            <Typography variant="body2">{mockProject.institution}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Principal Investigator</Typography>
            <Typography variant="body2">{mockProject.principalInvestigator}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Overall Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={mockProject.progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {mockProject.progress}% Complete
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Milestones Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Milestones</Typography>
              <Button variant="outlined" size="small">Add Milestone</Button>
            </Box>
            <List>
              {mockProject.milestones.map((milestone) => (
                <ListItem key={milestone.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Typography variant="subtitle1">{milestone.title}</Typography>
                    <Chip 
                      label={milestone.status} 
                      size="small"
                      color={milestone.status === 'Completed' ? 'success' : 'default'}
                    />
                  </Box>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={milestone.progress} 
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Due: {milestone.dueDate}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Tasks</Typography>
              <Button variant="outlined" size="small">Add Task</Button>
            </Box>
            <List>
              {mockProject.tasks.map((task) => (
                <ListItem key={task.id}>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" component="span">
                          Assigned to: {task.assignedTo}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          Due: {task.dueDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip 
                    label={task.status} 
                    size="small"
                    color={
                      task.status === 'Completed' ? 'success' : 
                      task.status === 'In Progress' ? 'primary' : 
                      'default'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Team Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Team Members</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {mockProject.team.map((member, index) => (
                <Chip 
                  key={index}
                  label={member}
                  variant="outlined"
                />
              ))}
              <Button size="small">+ Add Member</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetails; 