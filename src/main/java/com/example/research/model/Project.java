package com.example.research.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = true)
    private User owner;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<StatusHistory> statusHistory;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "deadline_status")
    private DeadlineStatus deadlineStatus;

    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }

    public void addStatusHistory(ProjectStatus previousStatus, ProjectStatus newStatus, User changedBy) {
        StatusHistory history = new StatusHistory();
        history.setProject(this);
        history.setOldStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        if (this.statusHistory == null) {
            this.statusHistory = new ArrayList<>();
        }
        this.statusHistory.add(history);
    }

    public void updateDeadlineStatus() {
        if (deadline == null) {
            deadlineStatus = DeadlineStatus.NO_DEADLINE;
            return;
        }

        LocalDate today = LocalDate.now();
        long daysUntilDeadline = ChronoUnit.DAYS.between(today, deadline);

        if (daysUntilDeadline < 0) {
            deadlineStatus = DeadlineStatus.OVERDUE;
        } else if (daysUntilDeadline <= 7) {
            deadlineStatus = DeadlineStatus.APPROACHING;
        } else {
            deadlineStatus = DeadlineStatus.ON_TRACK;
        }
    }

    public List<StatusHistory> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<StatusHistory> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public DeadlineStatus getDeadlineStatus() {
        return deadlineStatus;
    }

    public void setDeadlineStatus(DeadlineStatus deadlineStatus) {
        this.deadlineStatus = deadlineStatus;
    }
} 