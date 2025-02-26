import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data - would come from API in real application
const mockAvailableReviews = [
  {
    id: 1,
    projectTitle: 'Machine Learning in Healthcare',
    institution: 'Medical Research Institute',
    type: 'Project Review',
    deadline: '2024-04-15',
    status: 'Open',
    description: 'Comprehensive review needed for methodology and preliminary results.'
  },
  {
    id: 2,
    projectTitle: 'Climate Data Analysis',
    institution: 'Environmental Studies Center',
    type: 'Milestone Review',
    deadline: '2024-04-20',
    status: 'Open',
    description: 'Review of data collection methods and initial findings.'
  },
  {
    id: 3,
    projectTitle: 'Quantum Computing Applications',
    institution: 'Tech University',
    type: 'Task Review',
    deadline: '2024-04-10',
    status: 'Urgent',
    description: 'Technical review of quantum algorithm implementation.'
  }
];

const mockCompletedReviews = [
  {
    id: 101,
    projectTitle: 'Neural Networks in Image Recognition',
    type: 'Project Review',
    submittedDate: '2024-02-15',
    rating: 4.5,
    status: 'Completed'
  },
  {
    id: 102,
    projectTitle: 'Sustainable Energy Solutions',
    type: 'Milestone Review',
    submittedDate: '2024-03-01',
    rating: 4.0,
    status: 'Completed'
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`review-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ReviewList = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Peer Reviews
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Available Reviews" />
          <Tab label="My Review History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {mockAvailableReviews.map((review) => (
              <Grid item xs={12} md={6} key={review.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        {review.projectTitle}
                      </Typography>
                      <Chip 
                        label={review.status}
                        color={review.status === 'Urgent' ? 'error' : 'primary'}
                        size="small"
                      />
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {review.institution}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {review.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Chip 
                        label={review.type}
                        variant="outlined"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Due: {review.deadline}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained"
                      component={Link}
                      to={`/reviews/${review.id}`}
                    >
                      Start Review
                    </Button>
                    <Button size="small">View Project</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {mockCompletedReviews.map((review) => (
              <Paper key={review.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          {review.projectTitle}
                        </Typography>
                        <Chip 
                          label={`Rating: ${review.rating}/5`}
                          color="success"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" component="span">
                          {review.type} • Submitted: {review.submittedDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button size="small">View Review</Button>
                </ListItem>
              </Paper>
            ))}
          </List>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ReviewList; 