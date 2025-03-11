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
import com.example.research.model.User;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.UserRepository;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        logger.info("Fetching all projects");
        List<Project> projects = projectRepository.findAll();
        logger.info("Found {} projects", projects.size());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        logger.info("Fetching project with id: {}", id);
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            // Get the default user (ID 1)
            User defaultUser = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Default user not found"));
            
            project.setOwner(defaultUser);
            logger.info("Creating new project: {}", project.getTitle());
            Project savedProject = projectRepository.save(project);
            logger.info("Project created successfully with id: {}", savedProject.getId());
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            logger.error("Error creating project: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body("Failed to create project: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        logger.info("Updating project with id: {}", id);
        return projectRepository.findById(id)
                .map(existingProject -> {
                    project.setId(id);
                    project.setOwner(existingProject.getOwner());
                    Project updatedProject = projectRepository.save(project);
                    logger.info("Project updated successfully");
                    return ResponseEntity.ok(updatedProject);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        logger.info("Deleting project with id: {}", id);
        return projectRepository.findById(id)
                .map(project -> {
                    projectRepository.delete(project);
                    logger.info("Project deleted successfully");
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
} 