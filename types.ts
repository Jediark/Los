
export enum SkillStatus {
  HOBBY = 'Hobby',
  SIDE_HUSTLE = 'Side Hustle',
  MAIN_INCOME = 'Main Income',
  NOT_MONETIZED = 'Not Monetized'
}

export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface UserProfile {
  name: string;
  email: string;
  onboarded: boolean;
  tier: 'Free' | 'Premium' | 'Pro';
  situation: string;
  financialStatus: 'Struggling' | 'Stable' | 'Comfortable';
}

export interface Skill {
  id: string;
  name: string;
  status: SkillStatus;
  experience: ExperienceLevel;
  monthlyIncome: number;
  targetIncome: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Financial' | 'Career' | 'Education' | 'Health' | 'Relationships' | 'Spiritual' | 'Personal';
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  deadline: string;
  velocity?: number; // % progress per month
}

export interface Task {
  id: string;
  title: string;
  skillId?: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  timeSpent?: number; // hours
  scope: 'daily' | 'weekly' | 'monthly';
  wasCarriedOver?: boolean;
}

export interface MaxwellLaw {
  number: number;
  name: string;
  description: string;
  reflectionPrompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  likes: number;
  category: string;
}

export interface AccountabilityPartner {
  id: string;
  name: string;
  matchScore: number;
  skills: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  status: 'In Progress' | 'Completed' | 'Upcoming';
  grade?: string;
}

export interface PrayerItem {
  id: string;
  request: string;
  status: 'Active' | 'Answered';
  date: string;
}

export interface PortfolioProject {
  id: string;
  skillId: string;
  title: string;
  description: string;
  link?: string;
  date: string;
}

export interface MoodEntry {
  id: string;
  score: number; // 1-10
  tags: string[];
  note: string;
  date: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interest: number;
  monthlyPayment: number;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  link: string;
  coverColor: string;
  category: string;
}

export type ViewType = 
  | 'dashboard' | 'goals' | 'skills' | 'tasks' | 'finance' 
  | 'growth' | 'coach' | 'education' | 'spiritual' 
  | 'portfolio' | 'profile' | 'support' | 'wellness' 
  | 'community' | 'review' | 'library' | 'onboarding'
  | 'landing' | 'about' | 'services' | 'pricing' | 'contact';
