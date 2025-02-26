import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Divider
} from '@mui/material';
import { useState } from 'react';

// Mock data
const mockInstitutionData = {
  name: 'University of Technology',
  stats: {
    activeProjects: 15,
    researchers: 45,
    totalFunding: '2.5M',
    publications: 78
  },
  projects: [
    {
      id: 1,
      title: 'AI in Healthcare',
      pi: 'Dr. Jane Smith',
      status: 'Active',
      progress: 65,
      funding: '500K'
    },
    {
      id: 2,
      title: 'Quantum Computing Research',
      pi: 'Dr. John Doe',
      status: 'Active',
      progress: 30,
      funding: '750K'
    },
    {
      id: 3,
      title: 'Climate Change Analysis',
      pi: 'Prof. Sarah Wilson',
      status: 'Pending Review',
      progress: 90,
      funding: '300K'
    }
  ],
  publications: [
    {
      id: 1,
      title: 'Machine Learning Applications in Modern Healthcare',
      authors: 'Smith J., Doe J., Wilson S.',
      journal: 'Journal of Medical AI',
      date: '2024-02',
      citations: 12
    },
    {
      id: 2,
      title: 'Quantum Algorithms for Data Analysis',
      authors: 'Doe J., Brown M.',
      journal: 'Quantum Computing Review',
      date: '2024-01',
      citations: 8
    }
  ],
  patents: [
    {
      id: 1,
      title: 'Neural Network Architecture for Medical Diagnosis',
      inventors: 'Smith J., Wilson S.',
      status: 'Pending',
      filingDate: '2023-12-15'
    },
    {
      id: 2,
      title: 'Quantum Error Correction Method',
      inventors: 'Doe J.',
      status: 'Granted',
      filingDate: '2023-10-20'
    }
  ]
};

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
      id={`institution-tabpanel-${index}`}
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

const InstitutionDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Institution Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {mockInstitutionData.name}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Projects
                </Typography>
                <Typography variant="h4">
                  {mockInstitutionData.stats.activeProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Researchers
                </Typography>
                <Typography variant="h4">
                  {mockInstitutionData.stats.researchers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Funding
                </Typography>
                <Typography variant="h4">
                  ${mockInstitutionData.stats.totalFunding}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Publications
                </Typography>
                <Typography variant="h4">
                  {mockInstitutionData.stats.publications}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Research Projects" />
          <Tab label="Publications" />
          <Tab label="Patents & IP" />
        </Tabs>

        {/* Projects Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Title</TableCell>
                  <TableCell>Principal Investigator</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Funding</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockInstitutionData.projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>{project.pi}</TableCell>
                    <TableCell>
                      <Chip 
                        label={project.status}
                        color={project.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {project.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>${project.funding}</TableCell>
                    <TableCell>
                      <Button size="small">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Publications Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {mockInstitutionData.publications.map((pub) => (
              <Paper key={pub.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {pub.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" paragraph>
                          {pub.authors}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pub.journal} • {pub.date}
                        </Typography>
                        <Chip 
                          label={`${pub.citations} citations`}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    }
                  />
                  <Button size="small">View Publication</Button>
                </ListItem>
              </Paper>
            ))}
          </List>
        </TabPanel>

        {/* Patents Tab */}
        <TabPanel value={tabValue} index={2}>
          <List>
            {mockInstitutionData.patents.map((patent) => (
              <Paper key={patent.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">
                          {patent.title}
                        </Typography>
                        <Chip 
                          label={patent.status}
                          color={patent.status === 'Granted' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Inventors: {patent.inventors}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Filing Date: {patent.filingDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button size="small">View Details</Button>
                </ListItem>
              </Paper>
            ))}
          </List>
        </TabPanel>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          Generate Report
        </Button>
        <Button variant="outlined">
          Export Data
        </Button>
      </Box>
    </Box>
  );
};

export default InstitutionDashboard; 