-- Create a test user (required for project ownership and status changes)
INSERT INTO users (
    id, username, email, password,
    first_name, last_name,
    title, department, institution
) VALUES (
    1,
    'researcher1',
    'researcher1@university.edu',
    '$2a$10$secure.hash.placeholder',
    'John',
    'Smith',
    'Associate Professor',
    'Computer Science',
    'University Research Center'
);

-- Create test projects with valid ProjectStatus values
INSERT INTO projects (
    id, title, description,
    status, -- Using valid ProjectStatus enum values: PENDING, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED
    start_date, end_date,
    owner_id,
    deadline,
    deadline_status, -- Using valid DeadlineStatus enum values: NO_DEADLINE, ON_TRACK, APPROACHING, OVERDUE
    reminder_sent
) VALUES 
-- Project 1: Active project approaching deadline
(1,
 'Research Data Analysis',
 'Analysis of experimental results from Q1',
 'IN_PROGRESS',
 CURRENT_DATE - INTERVAL 15 DAY,
 CURRENT_DATE + INTERVAL 15 DAY,
 1,
 CURRENT_DATE + INTERVAL 5 DAY,
 'APPROACHING',
 false),

-- Project 2: Completed project that was overdue
(2,
 'Literature Review',
 'Systematic review of recent publications',
 'COMPLETED',
 CURRENT_DATE - INTERVAL 30 DAY,
 CURRENT_DATE - INTERVAL 1 DAY,
 1,
 CURRENT_DATE - INTERVAL 2 DAY,
 'OVERDUE',
 true),

-- Project 3: New project on track
(3,
 'Grant Proposal',
 'Preparation of research grant application',
 'PENDING',
 CURRENT_DATE + INTERVAL 1 DAY,
 CURRENT_DATE + INTERVAL 60 DAY,
 1,
 CURRENT_DATE + INTERVAL 45 DAY,
 'ON_TRACK',
 false);

-- Add status history entries
INSERT INTO status_history (
    project_id,
    old_status, -- Using valid ProjectStatus enum values
    new_status, -- Using valid ProjectStatus enum values
    changed_by_id
) VALUES 
-- Project 1 status changes
(1, 'PENDING', 'IN_PROGRESS', 1),

-- Project 2 status changes
(2, 'PENDING', 'IN_PROGRESS', 1),
(2, 'IN_PROGRESS', 'COMPLETED', 1),

-- Project 3 has no status changes yet as it's new 