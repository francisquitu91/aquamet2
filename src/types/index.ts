// Database types for the Student Pickup Management System
export interface Course {
  id: string; // UUID
  name: string; // e.g., "1° BÁSICO A", "IV B"
}

export interface Student {
  id: string; // UUID
  full_name: string;
  rut_passport: string; // RUT chileno o número de pasaporte para extranjeros
  course_id: string; // Foreign Key to courses.id
  status: 'Presente' | 'Retirado'; // Resets daily
}

export interface AuthorizedPerson {
  id: string; // UUID
  full_name: string;
  relationship: string; // e.g., "Madre", "Abuelo", "Transporte Escolar"
  student_id: string; // Foreign Key to students.id
}

export interface PickupLog {
  id: number; // BigSerial
  student_id: string; // Foreign Key to students.id
  authorized_person_id: string; // Foreign Key to authorized_persons.id
  pickup_timestamp: Date; // Timestamp with Time Zone
  recorded_by_user: string; // Name or ID of the teacher
}

export interface Schedule {
  id: number; // BigSerial
  course_id: string; // Foreign Key to courses.id
  day_of_week: number; // 1=Monday, 5=Friday
  start_time: string; // Time format HH:mm
  end_time: string; // Time format HH:mm
  subject: string; // e.g., "Matemática", "Ed. Física"
}

// Authentication types
export interface User {
  id: string;
  email: string;
  password_hash?: string; // Optional for client-side (never expose)
  name: string;
  role: 'admin' | 'teacher' | 'inspector' | 'Parent';
  subject?: string; // Asignatura del profesor o área del inspector
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// UI types
export interface StudentWithCourse extends Student {
  course: Course;
}

export interface StudentWithAuthorizedPersons extends Student {
  course: Course;
  authorizedPersons: AuthorizedPerson[];
}

export interface PickupLogWithDetails extends PickupLog {
  student: Student;
  authorized_person: AuthorizedPerson;
  course: Course;
}

// Settings types
export interface PickupSchedule {
  day: number; // 1=Monday, 5=Friday
  start_time: string;
  end_time: string;
}

export interface InstitutionSettings {
  name: string;
  pickup_schedules: PickupSchedule[];
}

// Report types
export interface DailyPickupStats {
  date: string;
  total_students: number;
  picked_up: number;
  remaining: number;
}

export interface CoursePickupStats {
  course: Course;
  total_students: number;
  picked_up: number;
  remaining: number;
}

export interface AuthorizedPersonPickupStats {
  authorized_person: AuthorizedPerson;
  pickup_count: number;
}
