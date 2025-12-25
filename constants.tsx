
import { SkillStatus, ExperienceLevel, Skill, MaxwellLaw, Goal, Task, Course, PrayerItem, PortfolioProject, MoodEntry, Debt, Ebook, CommunityPost, AccountabilityPartner } from './types';

export const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'Author', status: SkillStatus.NOT_MONETIZED, experience: ExperienceLevel.ADVANCED, monthlyIncome: 0, targetIncome: 2000, color: 'bg-blue-500' },
  { id: '2', name: 'MC / Anchor', status: SkillStatus.SIDE_HUSTLE, experience: ExperienceLevel.ADVANCED, monthlyIncome: 500, targetIncome: 1500, color: 'bg-purple-500' },
  { id: '3', name: 'AI Developer', status: SkillStatus.HOBBY, experience: ExperienceLevel.INTERMEDIATE, monthlyIncome: 0, targetIncome: 3000, color: 'bg-green-500' },
  { id: '4', name: 'Pastor/Counselor', status: SkillStatus.MAIN_INCOME, experience: ExperienceLevel.ADVANCED, monthlyIncome: 1200, targetIncome: 1200, color: 'bg-amber-500' },
];

export const MAXWELL_LAWS: MaxwellLaw[] = [
  { number: 1, name: 'Law of Intentionality', description: 'Growth doesn\'t just happen.', reflectionPrompt: 'What specific steps are you taking today to grow, rather than just waiting for it to happen?' },
  { number: 2, name: 'Law of Awareness', description: 'You must know yourself to grow yourself.', reflectionPrompt: 'What are your greatest strengths and weaknesses today?' },
  { number: 3, name: 'Law of the Mirror', description: 'You must see value in yourself to add value to yourself.', reflectionPrompt: 'What value did you add to your own character today?' },
  { number: 4, name: 'Law of Reflection', description: 'Learning to pause allows growth to catch up with you.', reflectionPrompt: 'Take 5 minutes to pause. What did you learn from today\'s challenges?' },
  { number: 5, name: 'Law of Consistency', description: 'Motivation gets you going, discipline keeps you growing.', reflectionPrompt: 'Which daily habit are you strictly adhering to?' },
  { number: 15, name: 'Law of Contribution', description: 'Growing yourself enables you to grow others.', reflectionPrompt: 'Who did you help grow today?' },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Complete BSc Degree', category: 'Education', status: 'In Progress', progress: 65, deadline: '2026-06-30', velocity: 5 },
  { id: 'g2', title: 'Publish First Book', category: 'Career', status: 'In Progress', progress: 40, deadline: '2026-12-01', velocity: 3 },
  { id: 'g3', title: 'Debt-Free Status', category: 'Financial', status: 'In Progress', progress: 20, deadline: '2026-12-31', velocity: 2 },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Chapter 4 Outline', skillId: '1', completed: false, priority: 'High', dueDate: today, timeSpent: 2, scope: 'daily' },
  { id: 't2', title: 'AI Ethics Research', skillId: '3', completed: true, priority: 'Medium', dueDate: today, timeSpent: 4, scope: 'daily' },
  { id: 't3', title: 'Weekend Sermon Prep', skillId: '4', completed: false, priority: 'High', dueDate: today, timeSpent: 3, scope: 'daily' },
  { id: 't4', title: 'Unfinished Task from Yesterday', skillId: '1', completed: false, priority: 'High', dueDate: yesterday, timeSpent: 0, scope: 'daily' },
  { id: 't5', title: 'Finalize Monthly Budget', skillId: '4', completed: false, priority: 'Medium', dueDate: today, timeSpent: 0, scope: 'monthly' },
  { id: 't6', title: 'Complete Weekly Course Module', skillId: '3', completed: false, priority: 'High', dueDate: today, timeSpent: 0, scope: 'weekly' },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  { id: 'cp1', userId: 'u1', userName: 'Jane D.', action: 'just published her first strategic guide for authors!', timestamp: '2h ago', likes: 24, category: 'Career' },
  { id: 'cp2', userId: 'u2', userName: 'Mark S.', action: 'secured a major anchor role for a Q4 corporate event!', timestamp: '5h ago', likes: 18, category: 'Monetization' },
  { id: 'cp3', userId: 'u3', userName: 'Sarah L.', action: 'completed her Maxwell Certification module!', timestamp: '1d ago', likes: 32, category: 'Growth' },
];

export const INITIAL_PARTNERS: AccountabilityPartner[] = [
  { id: 'p1', name: 'Samuel K.', matchScore: 94, skills: ['Author', 'Speaker'] },
  { id: 'p2', name: 'Lydia M.', matchScore: 88, skills: ['Digital Marketer', 'Educator'] },
  { id: 'p3', name: 'Chris P.', matchScore: 82, skills: ['AI Dev', 'Productivity Coach'] },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'CS101', title: 'Introduction to Computer Science', credits: 3, status: 'Completed', grade: 'A' },
  { id: 'c2', code: 'MATH201', title: 'Calculus II', credits: 4, status: 'In Progress' },
  { id: 'c3', code: 'ENG305', title: 'Creative Writing Workshop', credits: 3, status: 'In Progress' },
];

export const INITIAL_PRAYERS: PrayerItem[] = [
  { id: 'p1', request: 'Financial provision for next semester tuition', status: 'Active', date: '2025-10-20' },
  { id: 'p2', request: 'Wisdom for the book project chapters', status: 'Active', date: '2025-10-22' },
  { id: 'p3', request: 'Successful anchor role at upcoming wedding', status: 'Active', date: '2025-10-24' },
];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  { id: 'proj1', skillId: '1', title: 'The Unseen Call', description: 'A draft manuscript focusing on multi-talented leadership.', date: '2025-08-15' },
  { id: 'proj2', skillId: '3', title: 'AI Ethics Chatbot', description: 'An experimental NLP tool for ethical decision making.', link: 'https://github.com/durelle/ai-ethics', date: '2025-09-10' },
];

export const INITIAL_MOODS: MoodEntry[] = [
  { id: 'm1', score: 8, tags: ['Hopeful', 'Productive'], note: 'Great progress on BSc assignment.', date: '2025-10-24' },
  { id: 'm2', score: 5, tags: ['Overwhelmed', 'Tired'], note: 'Too many MC requests at once.', date: '2025-10-23' },
  { id: 'm3', score: 9, tags: ['Inspired', 'Grateful'], note: 'Sermon prep went smoothly.', date: '2025-10-22' },
];

export const INITIAL_DEBTS: Debt[] = [
  { id: 'd1', name: 'Credit Card A', amount: 4500, interest: 18, monthlyPayment: 250 },
  { id: 'd2', name: 'Student Loan', amount: 12000, interest: 5, monthlyPayment: 300 },
];

export const INITIAL_EBOOKS: Ebook[] = [
  {
    id: 'eb1',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    description: 'The landmark bestseller that has helped millions achieve success by understanding the power of thought.',
    link: 'https://archive.org/details/Think_and_Grow_Rich',
    coverColor: 'bg-amber-700',
    category: 'Success'
  },
  {
    id: 'eb2',
    title: 'As a Man Thinketh',
    author: 'James Allen',
    description: 'A classic guide to the power of thought in shaping ones character and circumstances.',
    link: 'https://standardebooks.org/ebooks/james-allen/as-a-man-thinketh',
    coverColor: 'bg-indigo-800',
    category: 'Personal Growth'
  },
  {
    id: 'eb3',
    title: 'The Science of Getting Rich',
    author: 'Wallace D. Wattles',
    description: 'Practical instructions on how to manifest wealth through a specific mindset and action plan.',
    link: 'https://standardebooks.org/ebooks/wallace-d-wattles/the-science-of-getting-rich',
    coverColor: 'bg-green-800',
    category: 'Wealth'
  },
  {
    id: 'eb4',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'The personal reflections of the Roman Emperor on Stoic philosophy and living with purpose.',
    link: 'https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long',
    coverColor: 'bg-slate-700',
    category: 'Philosophy'
  },
  {
    id: 'eb5',
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'Ancient Chinese military treatise that provides timeless wisdom on strategy and conflict resolution.',
    link: 'https://standardebooks.org/ebooks/sun-tzu/the-art-of-war/lionel-giles',
    coverColor: 'bg-red-900',
    category: 'Strategy'
  }
];
