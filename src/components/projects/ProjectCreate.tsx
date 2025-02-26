import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  FormHelperText,
  Divider
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for dropdowns
const mockInstitutions = [
  'University of Technology',
  'Medical Research Institute',
  'Environmental Studies Center',
  'Tech University'
];

const mockResearchers = [
  'Dr. Jane Smith',
  'Dr. John Doe',
  'Prof. Sarah Wilson',
  'Dr. Michael Brown',
  'Dr. Emily Taylor'
];

interface ProjectFormData {
  title: string;
  description: string;
  institution: string;
  startDate: string;
  endDate: string;
  principalInvestigator: string;
  teamMembers: string[];
  fundingSource: string;
  fundingAmount: string;
  keywords: string[];
  objectives: string;
  methodology: string;
}

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    institution: '',
    startDate: '',
    endDate: '',
    principalInvestigator: '',
    teamMembers: [],
    fundingSource: '',
    fundingAmount: '',
    keywords: [],
    objectives: '',
    methodology: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In real app, would submit to API
    console.log('Creating project:', formData);
    navigate('/projects');
  };

  const handleChange = (field: keyof ProjectFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Research Project
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Fill in the details below to create a new research project. All fields marked with * are required.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Project Title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Enter the title of your research project"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Project Description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Provide a detailed description of your research project"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Institution</InputLabel>
              <Select
                value={formData.institution}
                label="Institution"
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              >
                {mockInstitutions.map((inst) => (
                  <MenuItem key={inst} value={inst}>{inst}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <Autocomplete
                value={formData.principalInvestigator}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, principalInvestigator: newValue || '' });
                }}
                options={mockResearchers}
                renderInput={(params) => (
                  <TextField {...params} label="Principal Investigator" required />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={handleChange('startDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Expected End Date"
              value={formData.endDate}
              onChange={handleChange('endDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Team and Funding */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Team and Funding
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              value={formData.teamMembers}
              onChange={(event, newValue) => {
                setFormData({ ...formData, teamMembers: newValue });
              }}
              options={mockResearchers}
              renderInput={(params) => (
                <TextField {...params} label="Team Members" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Funding Source"
              value={formData.fundingSource}
              onChange={handleChange('fundingSource')}
              placeholder="e.g., Research Grant, Institution Funding"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Funding Amount"
              value={formData.fundingAmount}
              onChange={handleChange('fundingAmount')}
              placeholder="Enter amount in USD"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Research Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Research Details
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              value={formData.keywords}
              onChange={(event, newValue) => {
                setFormData({ ...formData, keywords: newValue });
              }}
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Keywords"
                  placeholder="Add keywords and press enter"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Research Objectives"
              value={formData.objectives}
              onChange={handleChange('objectives')}
              placeholder="List the main objectives of your research"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Methodology"
              value={formData.methodology}
              onChange={handleChange('methodology')}
              placeholder="Describe your research methodology"
            />
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Create Project
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/projects')}
                size="large"
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProjectCreate; 