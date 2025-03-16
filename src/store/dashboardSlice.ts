import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectStatus } from '../types/project';
import type { RootState } from './index';

export interface StatusChange {
  projectId: number;
  projectTitle: string;
  oldStatus: ProjectStatus;
  newStatus: ProjectStatus;
  changedAt: string;
  changedBy: string;
}

export interface UpcomingDeadline {
  projectId: number;
  projectTitle: string;
  deadline: string;
  daysUntilDeadline: number;
  status: 'ON_TRACK' | 'APPROACHING' | 'OVERDUE';
}

export interface UserSummary {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  projectCount: number;
  reviewCount: number;
}

interface DashboardState {
  stats: {
    totalUsers: number;
    activeProjects: number;
    pendingReviews: number;
    recentStatusChanges: StatusChange[];
    upcomingDeadlines: UpcomingDeadline[];
  } | null;
  userSummary: UserSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  userSummary: null,
  isLoading: false,
  error: null
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [statsResponse, summaryResponse] = await Promise.all([
        fetch('http://localhost:8080/api/dashboard', {
          credentials: 'include'
        }),
        fetch('http://localhost:8080/api/dashboard/user-summary/1', {
          credentials: 'include'
        })
      ]);

      if (!statsResponse.ok || !summaryResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, summaryData] = await Promise.all([
        statsResponse.json(),
        summaryResponse.json()
      ]);

      return {
        stats: statsData,
        userSummary: summaryData
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.userSummary = action.payload.userSummary;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch dashboard data';
      });
  },
});

// Selectors
export const selectDashboardStats = (state: RootState) => state.dashboard.stats;
export const selectUserSummary = (state: RootState) => state.dashboard.userSummary;
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer; 