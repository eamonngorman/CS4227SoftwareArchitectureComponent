import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data - would come from API in real application
const mockReviewData = {
  id: 1,
  projectTitle: 'Machine Learning in Healthcare',
  institution: 'Medical Research Institute',
  type: 'Project Review',
  deadline: '2024-04-15',
  description: 'Comprehensive review needed for methodology and preliminary results.',
  criteria: [
    'Research Methodology',
    'Data Analysis',
    'Innovation',
    'Technical Implementation',
    'Impact Potential'
  ]
};

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    overallRating: 0,
    methodology: '',
    strengths: '',
    weaknesses: '',
    recommendations: '',
    confidentialNotes: '',
    decision: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In real app, would submit to API
    console.log('Submitting review:', formData);
    navigate('/reviews');
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Peer Review
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {mockReviewData.projectTitle}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={mockReviewData.type} />
          <Chip label={`Due: ${mockReviewData.deadline}`} variant="outlined" />
        </Box>
        <Typography variant="body1">
          {mockReviewData.description}
        </Typography>
      </Paper>

      {/* Review Form */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Overall Rating */}
          <Grid item xs={12}>
            <Typography component="legend" variant="h6" gutterBottom>
              Overall Rating
            </Typography>
            <Rating
              value={formData.overallRating}
              onChange={(event, newValue) => {
                setFormData({ ...formData, overallRating: newValue || 0 });
              }}
              size="large"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Evaluation Criteria */}
          {mockReviewData.criteria.map((criterion) => (
            <Grid item xs={12} key={criterion}>
              <Typography variant="subtitle1" gutterBottom>
                {criterion} Evaluation
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={`Evaluate the ${criterion.toLowerCase()}...`}
                variant="outlined"
              />
            </Grid>
          ))}

          {/* Strengths and Weaknesses */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Strengths"
              multiline
              rows={4}
              value={formData.strengths}
              onChange={handleChange('strengths')}
              placeholder="List the main strengths..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Weaknesses"
              multiline
              rows={4}
              value={formData.weaknesses}
              onChange={handleChange('weaknesses')}
              placeholder="List the main weaknesses..."
            />
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recommendations"
              multiline
              rows={4}
              value={formData.recommendations}
              onChange={handleChange('recommendations')}
              placeholder="Provide specific recommendations for improvement..."
            />
          </Grid>

          {/* Confidential Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confidential Notes to Editor"
              multiline
              rows={3}
              value={formData.confidentialNotes}
              onChange={handleChange('confidentialNotes')}
              placeholder="Add any confidential notes (not shared with authors)..."
            />
          </Grid>

          {/* Review Decision */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Review Decision</FormLabel>
              <RadioGroup
                value={formData.decision}
                onChange={handleChange('decision')}
              >
                <FormControlLabel 
                  value="accept" 
                  control={<Radio />} 
                  label="Accept" 
                />
                <FormControlLabel 
                  value="minorRevisions" 
                  control={<Radio />} 
                  label="Accept with Minor Revisions" 
                />
                <FormControlLabel 
                  value="majorRevisions" 
                  control={<Radio />} 
                  label="Major Revisions Required" 
                />
                <FormControlLabel 
                  value="reject" 
                  control={<Radio />} 
                  label="Reject" 
                />
              </RadioGroup>
            </FormControl>
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
                Submit Review
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/reviews')}
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

export default ReviewForm; 