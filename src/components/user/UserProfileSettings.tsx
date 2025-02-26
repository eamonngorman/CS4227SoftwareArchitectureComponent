import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useState, useEffect } from 'react';

// Mock user data
const mockUserData = {
  id: 1,
  name: 'Dr. Jane Smith',
  email: 'jane.smith@university.edu',
  avatar: '', // URL would go here
  title: 'Senior Researcher',
  department: 'Computer Science',
  institution: 'University of Technology',
  expertise: ['Machine Learning', 'Healthcare AI', 'Data Analytics'],
  bio: 'Senior researcher specializing in AI applications in healthcare with over 10 years of experience.',
  notifications: {
    emailUpdates: true,
    projectReminders: true,
    reviewRequests: true,
    teamMessages: false
  },
  preferences: {
    theme: 'light',
    language: 'English',
    timezone: 'UTC-5'
  }
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
      id={`settings-tabpanel-${index}`}
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

interface FormErrors {
  name: string;
  email: string;
  title: string;
  department: string;
  bio: string;
}

const UserProfileSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    title: '',
    department: '',
    bio: ''
  });
  const [isFormValid, setIsFormValid] = useState(true);

  // Validation rules
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const validateRequired = (value: string, field: string): string => {
    if (!value.trim()) return `${field} is required`;
    return '';
  };

  const validateLength = (value: string, field: string, min: number, max: number): string => {
    if (value.length < min) return `${field} must be at least ${min} characters`;
    if (value.length > max) return `${field} must be less than ${max} characters`;
    return '';
  };

  // Validate form fields
  const validateField = (name: keyof FormErrors, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        error = validateRequired(value, 'Name') || 
                validateLength(value, 'Name', 2, 50);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'title':
        error = validateRequired(value, 'Title') ||
                validateLength(value, 'Title', 2, 100);
        break;
      case 'department':
        error = validateRequired(value, 'Department');
        break;
      case 'bio':
        error = validateLength(value, 'Bio', 0, 500);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check overall form validity
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '');
    setIsFormValid(!hasErrors);
  }, [errors]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [setting]: event.target.checked
      }
    });
  };

  const handleChange = (field: keyof FormErrors) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    setUserData({
      ...userData,
      [field]: newValue
    });
    validateField(field, newValue);
  };

  const handleSaveChanges = () => {
    // Validate all fields before saving
    const fieldsToValidate: (keyof FormErrors)[] = ['name', 'email', 'title', 'department', 'bio'];
    fieldsToValidate.forEach(field => {
      validateField(field, userData[field]);
    });

    if (isFormValid) {
      // In real app, would save to API
      setIsEditing(false);
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    }
  };

  return (
    <Box>
      {showSaveAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      {!isFormValid && isEditing && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please fix the errors before saving.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={userData.avatar || undefined}
            >
              {userData.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {userData.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {userData.title} • {userData.department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.institution}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Profile Information" />
          <Tab label="Notifications" />
          <Tab label="Preferences" />
          <Tab label="Account Settings" />
        </Tabs>

        {/* Profile Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={userData.name}
                onChange={handleChange('name')}
                disabled={!isEditing}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={userData.email}
                onChange={handleChange('email')}
                disabled={!isEditing}
                error={!!errors.email}
                helperText={errors.email}
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={userData.title}
                onChange={handleChange('title')}
                disabled={!isEditing}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={userData.department}
                onChange={handleChange('department')}
                disabled={!isEditing}
                error={!!errors.department}
                helperText={errors.department}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={userData.bio}
                onChange={handleChange('bio')}
                disabled={!isEditing}
                error={!!errors.bio}
                helperText={errors.bio || 'Maximum 500 characters'}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Areas of Expertise
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {userData.expertise.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={isEditing ? () => {} : undefined}
                  />
                ))}
                {isEditing && (
                  <Chip
                    label="+ Add"
                    variant="outlined"
                    onClick={() => {}}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            <ListItem>
              <ListItemText
                primary="Email Updates"
                secondary="Receive updates about your research projects via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={userData.notifications.emailUpdates}
                  onChange={handleNotificationChange('emailUpdates')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Project Reminders"
                secondary="Get reminded about upcoming deadlines and milestones"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={userData.notifications.projectReminders}
                  onChange={handleNotificationChange('projectReminders')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Review Requests"
                secondary="Receive notifications for new peer review requests"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={userData.notifications.reviewRequests}
                  onChange={handleNotificationChange('reviewRequests')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Team Messages"
                secondary="Get notified about team communications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={userData.notifications.teamMessages}
                  onChange={handleNotificationChange('teamMessages')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={userData.preferences.theme}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System Default</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={userData.preferences.language}
                  label="Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={userData.preferences.timezone}
                  label="Timezone"
                >
                  <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                  <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                  <MenuItem value="UTC+0">UTC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <List>
            <ListItem>
              <ListItemText
                primary="Change Password"
                secondary="Update your account password"
              />
              <Button variant="outlined" size="small">
                Change
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Add an extra layer of security to your account"
              />
              <Button variant="outlined" size="small" color="success">
                Enable
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Connected Accounts"
                secondary="Manage your connected academic and social accounts"
              />
              <Button variant="outlined" size="small">
                Manage
              </Button>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem>
              <ListItemText
                primary="Delete Account"
                secondary="Permanently delete your account and all associated data"
              />
              <Button variant="outlined" size="small" color="error">
                Delete
              </Button>
            </ListItem>
          </List>
        </TabPanel>
      </Paper>

      {isEditing && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setIsEditing(false);
              setErrors({
                name: '',
                email: '',
                title: '',
                department: '',
                bio: ''
              });
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserProfileSettings; 