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
  CircularProgress
} from '@mui/material';

interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  pendingReviews: number;
  recentActivities: any[];
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

const Dashboard = () => {
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
        const statsResponse = await fetch('http://localhost:8080/api/dashboard/stats');
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

        {/* User Summary */}
        <Grid item xs={12} md={6}>
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

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={activity.description} secondary={activity.date} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent activities" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 