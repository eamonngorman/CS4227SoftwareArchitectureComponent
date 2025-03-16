import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchDashboardData,
  selectDashboardStats,
  selectUserSummary,
  selectDashboardLoading,
  selectDashboardError,
  StatusChange,
  UpcomingDeadline
} from '../store/dashboardSlice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  Chip
} from '@mui/material';
import { formatDate } from '../utils/dateUtils';
import { getStatusColor } from '../utils/statusUtils';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const userSummary = useAppSelector(selectUserSummary);
  const isLoading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!stats || !userSummary) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Active Projects"
                  secondary={userSummary.projectCount}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Pending Reviews"
                  secondary={userSummary.reviewCount}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Overall Stats */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Active Projects</Typography>
                <Typography variant="h4">{stats.activeProjects}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Pending Reviews</Typography>
                <Typography variant="h4">{stats.pendingReviews}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Status Changes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Status Changes
            </Typography>
            <List>
              {stats.recentStatusChanges.map((change: StatusChange, index: number) => (
                <ListItem key={index} divider={index < stats.recentStatusChanges.length - 1}>
                  <ListItemText
                    primary={change.projectTitle}
                    secondary={
                      <>
                        <Chip
                          label={change.oldStatus}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(change.oldStatus),
                            mr: 1
                          }}
                        />
                        →
                        <Chip
                          label={change.newStatus}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(change.newStatus),
                            ml: 1
                          }}
                        />
                        <Typography variant="caption" display="block">
                          {formatDate(change.changedAt)} by {change.changedBy}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List>
              {stats.upcomingDeadlines.map((deadline: UpcomingDeadline, index: number) => (
                <ListItem key={index} divider={index < stats.upcomingDeadlines.length - 1}>
                  <ListItemText
                    primary={deadline.projectTitle}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Due: {formatDate(deadline.deadline)}
                        </Typography>
                        <Chip
                          label={`${deadline.daysUntilDeadline} days remaining`}
                          size="small"
                          color={
                            deadline.status === 'OVERDUE'
                              ? 'error'
                              : deadline.status === 'APPROACHING'
                              ? 'warning'
                              : 'success'
                          }
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
      </Grid>
    </Container>
  );
};

export default Dashboard; 