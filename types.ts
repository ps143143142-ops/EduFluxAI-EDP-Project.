export type UserRole = 'student' | 'admin';

export interface ExternalAccount {
  platform: 'LeetCode' | 'HackerRank' | 'CodeChef' | 'GeeksforGeeks';
  username: string;
  profileUrl: string;
  apiKey?: string;
  stats: {
    solvedCount: number;
    ranking: number;
  };
  lastSynced: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app this would be a hash
  role: UserRole;
  enrolledCourses: string[];
  externalAccounts: ExternalAccount[];
  isVerified?: boolean;
}

export interface Payment {
    transactionId: string;
    userId: string;
    courseId: string;
    amount: number;
    timestamp: string;
}

export interface LeaderboardUser {
    id: string;
    name: string;
    totalSolved: number;
    rank: number;
}

export interface CourseModule {
    title: string;
    status: 'Completed' | 'In Progress' | 'Not Started';
}

export interface CourseResource {
    title: string;
    type: 'pdf' | 'zip';
    url: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  tags: string[];
  imageUrl: string;
  type: 'free' | 'paid';
  modules: CourseModule[];
  downloads: CourseResource[];
}

export interface LearningStep {
  title: string;
  description: string;
  resources: {
    type: 'youtube' | 'book' | 'article' | 'documentation';
    title: string;
    url: string;
  }[];
}

export interface LearningRoadmap {
  topic: string;
  steps: LearningStep[];
}

export interface CareerPath {
    name: string;
    description: string;
    learningPlan: string[];
    certifications: string[];
    jobPortals: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export type Page = 'home' | 'login' | 'register' | 'student-dashboard' | 'admin-dashboard' | 'courses' | 'learning-roadmap' | 'career-quiz' | 'resume-builder' | 'dsa-learning' | 'future-trends' | 'dsa-problems' | 'resources' | 'profile-settings' | 'dsa-leaderboard' | 'course-detail' | 'ai-job-finder';

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    summary: string;
    experience: { title: string; company: string; dates: string; description: string }[];
    education: { degree: string; school: string; dates: string }[];
    skills: string;
}

export type ResourceType = 'youtube' | 'book' | 'article' | 'pdf' | 'link';

export interface Resource {
    id: string;
    type: ResourceType;
    title: string;
    description: string;
    url: string;
    category: string;
}

export interface DSAProblem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url: string;
    platform: 'LeetCode' | 'HackerRank' | 'CodeChef' | 'GeeksforGeeks';
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface JobPosting {
  jobTitle: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
}

// Add Razorpay to the window object for global access
declare global {
  interface Window {
    Razorpay: any;
  }
}