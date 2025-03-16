import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectStatus } from '../types/project';
import type { RootState } from './index';

interface ProjectsState {
  items: Project[];
  isLoading: boolean;
  error: string | null;
  statusFilter: ProjectStatus | 'ALL';
  searchTerm: string;
}

const initialState: ProjectsState = {
  items: [],
  isLoading: false,
  error: null,
  statusFilter: 'ALL',
  searchTerm: '',
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateStatus',
  async ({ projectId, status }: { projectId: number; status: ProjectStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async (project: Project, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface ProjectFormData {
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  deadline?: string | null;
}

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: ProjectFormData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return projectId; // Return the ID of the deleted project
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<ProjectStatus | 'ALL'>) => {
      state.statusFilter = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch projects';
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const index = state.items.findIndex(project => project.id === updatedProject.id);
        if (index !== -1) {
          state.items[index] = updatedProject;
        }
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch project';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create project';
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(project => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to delete project';
      });
  },
});

// Selectors
export const selectAllProjects = (state: RootState) => state.projects.items;

export const selectFilteredProjects = (state: RootState) => {
  const { items, statusFilter, searchTerm } = state.projects;
  return items.filter(project => {
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};

export const selectProjectById = (projectId: number) => (state: RootState) =>
  state.projects.items.find(project => project.id === projectId);

export const { setStatusFilter, setSearchTerm } = projectsSlice.actions;
export default projectsSlice.reducer; 