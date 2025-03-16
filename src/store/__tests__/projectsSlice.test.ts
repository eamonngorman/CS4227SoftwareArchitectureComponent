import { configureStore } from '@reduxjs/toolkit';
import type { Store, AnyAction } from '@reduxjs/toolkit';
import projectsReducer, {
  fetchProjects,
  updateProjectStatus,
  setStatusFilter,
  setSearchTerm,
  selectFilteredProjects
} from '../projectsSlice';
import { ProjectStatus, DeadlineStatus } from '../../types/project';
import type { RootState } from '../../store';
import { ThunkDispatch } from '@reduxjs/toolkit';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('projects slice', () => {
  let store: Store<RootState> & {
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projects: projectsReducer,
      },
    });
    mockFetch.mockClear();
  });

  const mockProjects = [
    {
      id: 1,
      title: 'Test Project 1',
      description: 'Test Description 1',
      status: ProjectStatus.IN_PROGRESS,
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      deadline: '2024-03-15',
      deadlineStatus: DeadlineStatus.ON_TRACK,
      reminderSent: false,
      owner: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    },
    {
      id: 2,
      title: 'Test Project 2',
      description: 'Test Description 2',
      status: ProjectStatus.COMPLETED,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      deadline: '2024-02-15',
      deadlineStatus: DeadlineStatus.ON_TRACK,
      reminderSent: false,
      owner: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    }
  ];

  it('should handle initial state', () => {
    const state = store.getState().projects;
    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null,
      statusFilter: 'ALL',
      searchTerm: ''
    });
  });

  it('should handle successful projects fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects
    });

    await store.dispatch(fetchProjects());
    const state = store.getState().projects;

    expect(state.items).toEqual(mockProjects);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle failed projects fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await store.dispatch(fetchProjects());
    const state = store.getState().projects;

    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('HTTP error');
  });

  it('should set loading state while fetching', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    store.dispatch(fetchProjects());
    const loadingState = store.getState().projects;

    expect(loadingState.isLoading).toBe(true);
    expect(loadingState.error).toBeNull();
  });

  it('should handle successful project status update', async () => {
    // First load mock projects
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects
    });
    await store.dispatch(fetchProjects());

    // Mock status update response
    const updatedProject = { ...mockProjects[0], status: ProjectStatus.COMPLETED };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProject
    });

    await store.dispatch(updateProjectStatus({ projectId: 1, status: ProjectStatus.COMPLETED }));
    const state = store.getState().projects;

    expect(state.items[0].status).toBe(ProjectStatus.COMPLETED);
  });

  describe('filtering and search', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects
      });
      await store.dispatch(fetchProjects());
    });

    it('should filter projects by status', () => {
      store.dispatch(setStatusFilter(ProjectStatus.IN_PROGRESS));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].status).toBe(ProjectStatus.IN_PROGRESS);
    });

    it('should show all projects when filter is ALL', () => {
      store.dispatch(setStatusFilter('ALL'));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(2);
    });

    it('should filter projects by search term in title', () => {
      store.dispatch(setSearchTerm('Project 1'));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].title).toContain('Project 1');
    });

    it('should filter projects by search term in description', () => {
      store.dispatch(setSearchTerm('Description 2'));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].description).toContain('Description 2');
    });

    it('should combine status and search filters', () => {
      store.dispatch(setStatusFilter(ProjectStatus.IN_PROGRESS));
      store.dispatch(setSearchTerm('Project 1'));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].status).toBe(ProjectStatus.IN_PROGRESS);
      expect(filteredProjects[0].title).toContain('Project 1');
    });

    it('should return empty array when no projects match filters', () => {
      store.dispatch(setStatusFilter(ProjectStatus.IN_PROGRESS));
      store.dispatch(setSearchTerm('nonexistent'));
      const state = store.getState();
      const filteredProjects = selectFilteredProjects(state);

      expect(filteredProjects).toHaveLength(0);
    });
  });
}); 