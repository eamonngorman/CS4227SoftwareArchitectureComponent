package com.example.research.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.research.model.ProjectStatus;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts from repositories
        long totalUsers = userRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        
        // Add statistics
        stats.put("totalUsers", totalUsers);
        stats.put("activeProjects", activeProjects);
        stats.put("pendingReviews", 0); // We'll implement this when we add reviews
        stats.put("recentActivities", new ArrayList<>()); // Empty list for now
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user-summary/{userId}")
    public ResponseEntity<?> getUserDashboardSummary(@PathVariable Long userId) {
        Map<String, Object> summary = new HashMap<>();
        
        // Get user's data
        return userRepository.findById(userId)
            .map(user -> {
                summary.put("user", user);
                summary.put("projectCount", projectRepository.countByOwner(user));
                summary.put("reviewCount", 0); // We'll implement this when we add reviews
                return ResponseEntity.ok(summary);
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 