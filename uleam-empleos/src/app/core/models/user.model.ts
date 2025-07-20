export interface User {
  id: string;
  email: string;
  password: string;
  role: 'graduate' | 'employer';
  createdAt: Date;
  profile: GraduateProfile | EmployerProfile;
}

export interface GraduateProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  cv?: string; // URL o base64 del CV
}

export interface EmployerProfile {
  companyName: string;
  industry: string;
  description: string;
  website: string;
  contactPerson: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate: Date;
  current: boolean;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  modality: 'presencial' | 'remoto' | 'hibrido';
  publishDate: Date;
  deadline: Date;
  employerId: string;
  applications: Application[];
  area: string;
  status: 'active' | 'inactive' | 'closed';
}

export interface Application {
  id: string;
  jobId: string;
  graduateId: string;
  applicationDate: Date;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  coverLetter: string;
}

export interface JobFilter {
  area?: string;
  location?: string;
  modality?: 'presencial' | 'remoto' | 'hibrido';
  salaryRange?: string;
  keyword?: string;
}

export interface DashboardStats {
  totalJobs?: number;
  totalApplications?: number;
  pendingApplications?: number;
  acceptedApplications?: number;
  rejectedApplications?: number;
  totalCandidates?: number;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}
