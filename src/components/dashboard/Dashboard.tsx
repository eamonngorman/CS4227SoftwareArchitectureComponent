import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from '../../types/project';

interface StatusChange {
  projectId: number;
  projectTitle: string;
  oldStatus: ProjectStatus;
  newStatus: ProjectStatus;
  changedAt: string;
  changedBy: string;
}

interface UpcomingDeadline {
  projectId: number;
  projectTitle: string;
  deadline: string;
  daysUntilDeadline: number;
  status: 'ON_TRACK' | 'APPROACHING' | 'OVERDUE';
}

interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  pendingReviews: number;
  recentStatusChanges: StatusChange[];
  upcomingDeadlines: UpcomingDeadline[];
}

interface UserSummary {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  projectCount: number;
  reviewCount: number;
}

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

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await fetch('http://localhost:8080/api/dashboard');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch user summary (using ID 1 for demo)
        const summaryResponse = await fetch('http://localhost:8080/api/dashboard/user-summary/1');
        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch user summary');
        }
        const summaryData = await summaryResponse.json();
        setUserSummary(summaryData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Welcome{userSummary?.user.firstName ? `, ${userSummary.user.firstName}` : ''}!
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h3">{stats?.totalUsers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Projects</Typography>
              <Typography variant="h3">{stats?.activeProjects || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Reviews</Typography>
              <Typography variant="h3">{stats?.pendingReviews || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Status Changes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Recent Status Changes</Typography>
            <List>
              {stats?.recentStatusChanges && stats.recentStatusChanges.length > 0 ? (
                stats.recentStatusChanges.map((change, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/projects/${change.projectId}`)}
                  >
                    <Typography variant="subtitle1" component="div" gutterBottom>
                      {change.projectTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={formatStatus(change.oldStatus)}
                        color={getStatusColor(change.oldStatus)}
                        size="small"
                      />
                      <Typography>→</Typography>
                      <Chip
                        label={formatStatus(change.newStatus)}
                        color={getStatusColor(change.newStatus)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Changed by {change.changedBy} on {new Date(change.changedAt).toLocaleDateString()}
                    </Typography>
                    {index < stats.recentStatusChanges.length - 1 && <Divider sx={{ width: '100%', my: 1 }} />}
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent status changes" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
            <List>
              {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                stats.upcomingDeadlines.map((deadline, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/projects/${deadline.projectId}`)}
                  >
                    <Typography variant="subtitle1" component="div" gutterBottom>
                      {deadline.projectTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={formatStatus(deadline.status)}
                        color={getDeadlineStatusColor(deadline.status)}
                        size="small"
                      />
                      <Typography variant="body2">
                        {deadline.daysUntilDeadline === 0 
                          ? "Due today"
                          : deadline.daysUntilDeadline < 0 
                            ? `Overdue by ${Math.abs(deadline.daysUntilDeadline)} days`
                            : `Due in ${deadline.daysUntilDeadline} days`
                        }
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Deadline: {new Date(deadline.deadline).toLocaleDateString()}
                    </Typography>
                    {index < stats.upcomingDeadlines.length - 1 && <Divider sx={{ width: '100%', my: 1 }} />}
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No upcoming deadlines" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* User Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Your Summary</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Projects" 
                  secondary={`You have ${userSummary?.projectCount || 0} active projects`} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Reviews" 
                  secondary={`You have ${userSummary?.reviewCount || 0} pending reviews`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 