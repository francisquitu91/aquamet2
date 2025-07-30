# Copilot Instructions - Student Pickup Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Student Pickup Management System for Colegio Sagrada Familia. The application manages student pickups with two distinct user roles: Administrator and Teacher/Assistant.

## Architecture
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Authentication**: Role-based authentication (admin/teacher)
- **Responsive Design**: Desktop interface for administrators, mobile-optimized for teachers
- **Database**: Ready for backend integration with PostgreSQL schema

## Key Features
1. **Administrator View (Desktop)**:
   - Student management (CRUD operations)
   - Authorized persons management
   - Reports and statistics with charts
   - Schedule management
   - General settings

2. **Teacher/Assistant View (Mobile)**:
   - Course and student listings
   - Quick search functionality
   - Pickup registration flow
   - Status tracking (Presente/Retirado)

## Design Guidelines
- Use Tailwind CSS for styling
- Implement responsive design with mobile-first approach
- Include the school logo: https://colegiosagradafamilia.cl/www/wp-content/uploads/2022/04/cropped-logo-hd-1.png
- Use intuitive UI/UX for quick operations
- Ensure accessibility standards

## Database Schema (Ready for Backend)
- courses (id, name)
- students (id, full_name, course_id, status)
- authorized_persons (id, full_name, relationship, student_id)
- pickup_logs (id, student_id, authorized_person_id, pickup_timestamp, recorded_by_user)
- schedules (id, course_id, day_of_week, start_time, end_time, subject)

## Security Considerations
- Implement secure authentication
- Role-based access control
- Input validation and sanitization
- Secure API endpoints (when backend is integrated)

## Code Standards
- Use TypeScript for type safety
- Follow Next.js best practices with App Router
- Implement proper error handling
- Write clean, maintainable code with proper documentation
