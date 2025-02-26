import {
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Button,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';

// Mock data - would come from API in real application
const mockUpcomingDeadlines = [
  { id: 1, task: 'Submit Research Proposal', project: 'AI Research Project', date: '2024-03-15' },
  { id: 2, task: 'Review Data Analysis', project: 'Climate Change Study', date: '2024-03-20' },
  { id: 3, task: 'Milestone Report', project: 'AI Research Project', date: '2024-03-25' }
];

const mockRecentActivities = [
  { id: 1, action: 'Updated milestone', project: 'AI Research Project', time: '2 hours ago' },
  { id: 2, action: 'Added new task', project: 'Climate Change Study', time: '5 hours ago' },
  { id: 3, action: 'Received review', project: 'AI Research Project', time: '1 day ago' }
];

const Dashboard = () => {
  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Research Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your research projects, deadlines, and activities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="/projects/new"
            >
              New Project
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/reviews"
            >
              Review Projects
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/projects"
            >
              View All Projects
            </Button>
          </Paper>
        </Grid>

        {/* Project Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Active Projects Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">2</Typography>
                    <Typography color="text.secondary">Active Projects</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">5</Typography>
                    <Typography color="text.secondary">Pending Reviews</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List>
              {mockUpcomingDeadlines.map((deadline) => (
                <ListItem key={deadline.id} divider>
                  <ListItemText
                    primary={deadline.task}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {deadline.project}
                        </Typography>
                        <Chip
                          label={deadline.date}
                          size="small"
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {mockRecentActivities.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemText
                    primary={activity.action}
                    secondary={
                      <>
                        {activity.project} • {activity.time}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 