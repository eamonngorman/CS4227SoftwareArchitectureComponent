package com.example.research.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
    List<Project> findByStatus(ProjectStatus status);
    long countByStatus(ProjectStatus status);
    long countByOwner(User owner);
    List<Project> findByDeadlineIsNotNullOrderByDeadline();
} 