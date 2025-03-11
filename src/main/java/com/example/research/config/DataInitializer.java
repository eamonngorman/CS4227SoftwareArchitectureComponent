package com.example.research.config;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.research.model.Project;
import com.example.research.model.ProjectStatus;
import com.example.research.model.User;
import com.example.research.repository.ProjectRepository;
import com.example.research.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Create default user if it doesn't exist
        User defaultUser = null;
        if (userRepository.count() == 0) {
            defaultUser = new User();
            defaultUser.setUsername("default_user");
            defaultUser.setEmail("default@example.com");
            defaultUser.setPassword("default123"); // In a real app, this should be encrypted
            defaultUser.setFirstName("Default");
            defaultUser.setLastName("User");
            defaultUser.setDepartment("Research");
            defaultUser.setInstitution("Default Institution");
            defaultUser = userRepository.save(defaultUser);
        } else {
            defaultUser = userRepository.findById(1L).orElse(null);
        }

        // Create sample projects if none exist
        if (projectRepository.count() == 0 && defaultUser != null) {
            // Project 1
            Project project1 = new Project();
            project1.setTitle("AI Research Project");
            project1.setDescription("Research on advanced machine learning algorithms");
            project1.setStatus(ProjectStatus.IN_PROGRESS);
            project1.setStartDate(LocalDate.now());
            project1.setEndDate(LocalDate.now().plusMonths(6));
            project1.setOwner(defaultUser);
            projectRepository.save(project1);

            // Project 2
            Project project2 = new Project();
            project2.setTitle("Climate Change Study");
            project2.setDescription("Analysis of global climate patterns");
            project2.setStatus(ProjectStatus.PENDING);
            project2.setStartDate(LocalDate.now().plusMonths(1));
            project2.setEndDate(LocalDate.now().plusMonths(8));
            project2.setOwner(defaultUser);
            projectRepository.save(project2);

            // Project 3
            Project project3 = new Project();
            project3.setTitle("Medical Research");
            project3.setDescription("Study on new treatment methods");
            project3.setStatus(ProjectStatus.COMPLETED);
            project3.setStartDate(LocalDate.now().minusMonths(6));
            project3.setEndDate(LocalDate.now().minusMonths(1));
            project3.setOwner(defaultUser);
            projectRepository.save(project3);
        }
    }
} 