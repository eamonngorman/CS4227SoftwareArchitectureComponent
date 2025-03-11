package com.example.research.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get counts from repositories
            long totalUsers = userRepository.count();
            long totalProjects = projectRepository.count();
            
            // Get all projects and count by status
            List<Project> allProjects = projectRepository.findAll();
            
            // Log counts by status
            Map<ProjectStatus, Long> countsByStatus = allProjects.stream()
                .collect(Collectors.groupingBy(Project::getStatus, Collectors.counting()));
            
            logger.info("Project counts by status: {}", countsByStatus);
            
            // Count active projects (IN_PROGRESS)
            long activeProjects = countsByStatus.getOrDefault(ProjectStatus.IN_PROGRESS, 0L);
            
            stats.put("totalUsers", totalUsers);
            stats.put("activeProjects", activeProjects);
            stats.put("totalProjects", totalProjects);
            stats.put("pendingReviews", 0); // To be implemented with review system
            stats.put("recentActivities", new ArrayList<>()); // To be implemented
            
            logger.info("Dashboard stats: {}", stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error getting dashboard stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch dashboard stats");
        }
    }

    @GetMapping("/user-summary/{userId}")
    public ResponseEntity<?> getUserDashboardSummary(@PathVariable Long userId) {
        try {
            return userRepository.findById(userId)
                .map(user -> {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("user", user);
                    
                    // Get all projects for user
                    List<Project> userProjects = projectRepository.findByOwner(user);
                    
                    // Count projects by status
                    Map<ProjectStatus, Long> userCountsByStatus = userProjects.stream()
                        .collect(Collectors.groupingBy(Project::getStatus, Collectors.counting()));
                    
                    logger.info("User {} project counts by status: {}", userId, userCountsByStatus);
                    
                    // Count active projects
                    long activeProjectCount = userCountsByStatus.getOrDefault(ProjectStatus.IN_PROGRESS, 0L);
                    
                    summary.put("projectCount", activeProjectCount);
                    summary.put("totalProjects", userProjects.size());
                    summary.put("reviewCount", 0); // To be implemented
                    
                    logger.info("User dashboard summary: {}", summary);
                    return ResponseEntity.ok(summary);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting user dashboard summary: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch user dashboard summary");
        }
    }
} 