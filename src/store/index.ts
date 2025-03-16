import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 