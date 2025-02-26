import { Grid, Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// Mock data - in real app this would come from an API
const mockProjects = [
  {
    id: 1,
    title: 'AI Research Project',
    description: 'Research on machine learning applications in healthcare',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Climate Change Study',
    description: 'Analysis of global temperature patterns',
    status: 'Planning'
  }
];

const ProjectList = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Research Projects
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/projects/new"
        sx={{ mb: 3 }}
      >
        Create New Project
      </Button>
      <Grid container spacing={3}>
        {mockProjects.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography color="textSecondary">{project.description}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Status: {project.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/projects/${project.id}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProjectList; 