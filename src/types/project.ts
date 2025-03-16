export enum ProjectStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED'
}

export enum DeadlineStatus {
  NO_DEADLINE = 'NO_DEADLINE',
  ON_TRACK = 'ON_TRACK',
  APPROACHING = 'APPROACHING',
  OVERDUE = 'OVERDUE'
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  owner: User;
  deadline: string | null;
  deadlineStatus: DeadlineStatus;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  id: number;
  projectId: number;
  oldStatus: ProjectStatus;
  newStatus: ProjectStatus;
  changedAt: string;
  changedBy: User;
} 