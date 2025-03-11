package com.example.research.dto;

import java.util.List;

public class DashboardStatsDTO {
    private long totalUsers;
    private long activeProjects;
    private long pendingReviews;
    private List<StatusChangeDTO> recentStatusChanges;
    private List<UpcomingDeadlineDTO> upcomingDeadlines;

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public List<StatusChangeDTO> getRecentStatusChanges() {
        return recentStatusChanges;
    }

    public void setRecentStatusChanges(List<StatusChangeDTO> recentStatusChanges) {
        this.recentStatusChanges = recentStatusChanges;
    }

    public List<UpcomingDeadlineDTO> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<UpcomingDeadlineDTO> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }
} 