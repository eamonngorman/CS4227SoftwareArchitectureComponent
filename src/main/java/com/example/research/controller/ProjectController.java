package com.example.research.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.model.StatusHistory;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.StatusHistoryRepository;
import com.example.research.repository.UserRepository;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusHistoryRepository statusHistoryRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        logger.info("Fetching all projects");
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        logger.info("Fetching project with id: {}", id);
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        logger.info("Creating new project");
        project.setStatus(ProjectStatus.PENDING);
        Project savedProject = projectRepository.save(project);
        // Add initial status history
        savedProject.addStatusHistory(null, ProjectStatus.PENDING);
        return ResponseEntity.ok(savedProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        logger.info("Updating project with id: {}", id);
        return projectRepository.findById(id)
                .map(existingProject -> {
                    // If status is changing, record it in history
                    if (existingProject.getStatus() != updatedProject.getStatus()) {
                        logger.info("Status changing from {} to {}", existingProject.getStatus(), updatedProject.getStatus());
                        existingProject.addStatusHistory(existingProject.getStatus(), updatedProject.getStatus());
                    }
                    
                    // Update other fields
                    existingProject.setTitle(updatedProject.getTitle());
                    existingProject.setDescription(updatedProject.getDescription());
                    existingProject.setStatus(updatedProject.getStatus());
                    existingProject.setStartDate(updatedProject.getStartDate());
                    existingProject.setEndDate(updatedProject.getEndDate());
                    
                    Project saved = projectRepository.save(existingProject);
                    logger.info("Project updated successfully");
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        logger.info("Deleting project with id: {}", id);
        return projectRepository.findById(id)
                .map(project -> {
                    projectRepository.delete(project);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Project>> getProjectsByUser(@PathVariable Long userId) {
        logger.info("Fetching projects for user: {}", userId);
        return userRepository.findById(userId)
                .map(user -> {
                    List<Project> projects = projectRepository.findByOwner(user);
                    logger.info("Found {} projects for user", projects.size());
                    return ResponseEntity.ok(projects);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable ProjectStatus status) {
        logger.info("Fetching projects with status: {}", status);
        List<Project> projects = projectRepository.findByStatus(status);
        logger.info("Found {} projects with status {}", projects.size(), status);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}/status-history")
    public ResponseEntity<List<StatusHistory>> getProjectStatusHistory(@PathVariable Long id) {
        logger.info("Fetching status history for project with id: {}", id);
        return projectRepository.findById(id)
                .map(project -> ResponseEntity.ok(project.getStatusHistory()))
                .orElse(ResponseEntity.notFound().build());
    }
} 