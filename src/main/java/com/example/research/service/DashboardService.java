package com.example.research.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.research.dto.DashboardStatsDTO;
import com.example.research.dto.StatusChangeDTO;
import com.example.research.dto.UpcomingDeadlineDTO;
import com.example.research.model.DeadlineStatus;
import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.model.StatusHistory;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.StatusHistoryRepository;
import com.example.research.repository.UserRepository;

@Service
public class DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Set basic stats
        stats.setTotalUsers(userRepository.count());
        stats.setActiveProjects(projectRepository.countByStatus(ProjectStatus.IN_PROGRESS));
        stats.setPendingReviews(0L); // TODO: Implement when review system is added

        // Get recent status changes
        List<StatusHistory> recentChanges = statusHistoryRepository.findTop10ByOrderByChangedAtDesc();
        List<StatusChangeDTO> statusChanges = recentChanges.stream()
            .map(this::convertToStatusChangeDTO)
            .collect(Collectors.toList());
        stats.setRecentStatusChanges(statusChanges);

        // Get upcoming deadlines
        List<Project> projectsWithDeadlines = projectRepository.findByDeadlineIsNotNullOrderByDeadline();
        List<UpcomingDeadlineDTO> upcomingDeadlines = projectsWithDeadlines.stream()
            .map(this::convertToUpcomingDeadlineDTO)
            .filter(dto -> dto != null && (dto.getStatus().equals("APPROACHING") || dto.getStatus().equals("OVERDUE")))
            .collect(Collectors.toList());
        stats.setUpcomingDeadlines(upcomingDeadlines);

        return stats;
    }

    private StatusChangeDTO convertToStatusChangeDTO(StatusHistory history) {
        StatusChangeDTO dto = new StatusChangeDTO();
        dto.setProjectId(history.getProject().getId());
        dto.setProjectTitle(history.getProject().getTitle());
        dto.setOldStatus(history.getOldStatus());
        dto.setNewStatus(history.getNewStatus());
        dto.setChangedAt(history.getChangedAt());
        dto.setChangedBy(history.getChangedBy().getUsername());
        return dto;
    }

    private UpcomingDeadlineDTO convertToUpcomingDeadlineDTO(Project project) {
        if (project.getDeadline() == null) {
            return null;
        }

        UpcomingDeadlineDTO dto = new UpcomingDeadlineDTO();
        dto.setProjectId(project.getId());
        dto.setProjectTitle(project.getTitle());
        dto.setDeadline(project.getDeadline());

        LocalDate today = LocalDate.now();
        long daysUntil = ChronoUnit.DAYS.between(today, project.getDeadline());
        dto.setDaysUntilDeadline((int) daysUntil);

        // Set deadline status
        if (daysUntil < 0) {
            dto.setStatus(DeadlineStatus.OVERDUE.name());
        } else if (daysUntil <= 7) {
            dto.setStatus(DeadlineStatus.APPROACHING.name());
        } else {
            dto.setStatus(DeadlineStatus.ON_TRACK.name());
        }

        return dto;
    }
} 