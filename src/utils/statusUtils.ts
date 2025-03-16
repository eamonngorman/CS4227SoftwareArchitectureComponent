import { ProjectStatus } from '../types/project';

export const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.PENDING:
      return '#FFA726'; // Orange
    case ProjectStatus.IN_PROGRESS:
      return '#42A5F5'; // Blue
    case ProjectStatus.COMPLETED:
      return '#66BB6A'; // Green
    case ProjectStatus.ON_HOLD:
      return '#78909C'; // Grey
    case ProjectStatus.CANCELLED:
      return '#EF5350'; // Red
    default:
      return '#E0E0E0'; // Light Grey
  }
}; 