package com.example.research.controller;

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

import com.example.research.dto.DashboardStatsDTO;
import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.UserRepository;
import com.example.research.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getDashboardStats();
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