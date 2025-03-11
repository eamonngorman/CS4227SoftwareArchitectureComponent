package com.example.research.dto;

import java.time.LocalDateTime;

import com.example.research.model.ProjectStatus;

public class StatusChangeDTO {
    private Long projectId;
    private String projectTitle;
    private ProjectStatus oldStatus;
    private ProjectStatus newStatus;
    private LocalDateTime changedAt;
    private String changedBy;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public ProjectStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(ProjectStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public ProjectStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ProjectStatus newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }
} 