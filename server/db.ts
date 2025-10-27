import { User, Course, Resource, DSAProblem, LeaderboardUser, Payment, ExternalAccount } from '../types';

// --- SEED DATA ---
const ADMIN_USER_SEED: User = {
    id: 'admin01', name: 'Admin User', email: 'admin@eduflux.ai', password: 'admin', role: 'admin',
    enrolledCourses: [], externalAccounts: [], isVerified: true,
};

const STUDENT_USER_SEED: User = {
    id: 'student01', name: 'Alex Johnson', email: 'alex@eduflux.ai', password: 'alex', role: 'student',
    enrolledCourses: ['c1', 'c3'],
    externalAccounts: [
        { platform: 'LeetCode', username: 'alex_j', profileUrl: '#', stats: { solvedCount: 150, ranking: 10250 }, lastSynced: '2024-07-28T10:00:00Z' },
        { platform: 'HackerRank', username: 'alex_j_hr', profileUrl: '#', apiKey: 'dummy_api_key_12345', stats: { solvedCount: 85, ranking: 5120 }, lastSynced: '2024-07-27T18:30:00Z' },
    ], isVerified: true,
};

const MOCK_COURSES: Course[] = [
  { id: 'c1', title: 'Java Full-Stack Mastery', description: 'Become a complete Java developer. From Spring Boot to React, this course covers it all.', instructor: 'Dr. Evelyn Reed', price: 49.99, tags: ['Java', 'Spring Boot', 'Full-Stack'], imageUrl: 'https://picsum.photos/seed/java/600/400', type: 'paid', modules: [ { title: '1. Introduction', status: 'Completed' }, { title: '2. Spring Boot Basics', status: 'In Progress' }, { title: '3. RESTful APIs', status: 'Not Started' } ], downloads: [ { title: 'Lecture_Slides.pdf', type: 'pdf', url: '#' }, { title: 'Code_Snippets.zip', type: 'zip', url: '#' } ] },
  { id: 'c2', title: 'AI & Machine Learning Deep Dive', description: 'Explore the world of AI with Python, TensorFlow, and PyTorch. Build real-world models.', instructor: 'Prof. Kenji Tanaka', price: 79.99, tags: ['AI', 'Machine Learning', 'Python'], imageUrl: 'https://picsum.photos/seed/ai/600/400', type: 'paid', modules: [], downloads: [] },
  { id: 'c3', title: 'Modern Frontend with React & Tailwind', description: 'Create beautiful, responsive user interfaces with React, TypeScript, and Tailwind CSS.', instructor: 'Maria Garcia', price: 39.99, tags: ['React', 'Frontend', 'Tailwind CSS'], imageUrl: 'https://picsum.photos/seed/react/600/400', type: 'paid', modules: [ { title: '1. Introduction to React', status: 'Completed' }, { title: '2. Hooks Deep Dive', status: 'In Progress' } ], downloads: [ { title: 'React_Cheatsheet.pdf', type: 'pdf', url: '#' } ] },
  { id: 'c4', title: 'Cloud Native with Docker & Kubernetes', description: 'Learn to deploy and manage scalable applications using containerization and orchestration.', instructor: 'David Chen', price: 59.99, tags: ['Cloud', 'DevOps', 'Kubernetes'], imageUrl: 'https://picsum.photos/seed/cloud/600/400', type: 'paid', modules: [], downloads: [] },
  { id: 'c5', title: 'Data Science & Big Data Analytics', description: 'Master data analysis, visualization, and big data technologies like Spark and Hadoop.', instructor: 'Dr. Aisha Khan', price: 69.99, tags: ['Data Science', 'Big Data', 'Analytics'], imageUrl: 'https://picsum.photos/seed/datascience/600/400', type: 'paid', modules: [], downloads: [] },
  { id: 'c6', title: 'Introduction to Data Structures', description: 'A beginner-friendly introduction to fundamental data structures like arrays, linked lists, and trees.', instructor: 'Community Contribution', price: 0, tags: ['DSA', 'Beginner'], imageUrl: 'https://picsum.photos/seed/dsa/600/400', type: 'free', modules: [], downloads: [] },
];

const MOCK_RESOURCES: Resource[] = [
    { id: 'r1', type: 'youtube', title: 'Spring Boot Tutorial for Beginners', description: 'A complete 4-hour course on Spring Boot.', url: '#', category: 'Java' },
    { id: 'r2', type: 'book', title: 'Clean Code by Robert C. Martin', description: 'A handbook of agile software craftsmanship.', url: '#', category: 'Software Design' },
    { id: 'r3', type: 'article', title: 'Understanding React Hooks', description: 'A deep dive into useState and useEffect.', url: '#', category: 'React' },
    { id: 'r4', type: 'link', title: 'GeeksforGeeks DSA Problems', description: 'Practice data structures and algorithms.', url: '#', category: 'DSA' },
];

const MOCK_DSA_PROBLEMS: { category: string, problems: DSAProblem[] }[] = [
    { category: 'Arrays', problems: [ { id: 'dsa1', title: 'Two Sum', difficulty: 'Easy', url: '#', platform: 'LeetCode' }, { id: 'dsa2', title: 'Container With Most Water', difficulty: 'Medium', url: '#', platform: 'LeetCode' } ] },
    { category: 'Linked Lists', problems: [ { id: 'dsa3', title: 'Reverse a Linked List', difficulty: 'Easy', url: '#', platform: 'HackerRank' }, { id: 'dsa4', title: 'Merge K Sorted Lists', difficulty: 'Hard', url: '#', platform: 'LeetCode' } ] },
];


// --- IN-MEMORY DATABASE ---
class Database {
  users: User[] = [ADMIN_USER_SEED, STUDENT_USER_SEED];
  courses: Course[] = MOCK_COURSES;
  resources: Resource[] = MOCK_RESOURCES;
  dsaProblems: { category: string, problems: DSAProblem[] }[] = MOCK_DSA_PROBLEMS;
  otpStore: Record<string, { otp: string, expires: number }> = {};
  transactions: Payment[] = [
    { transactionId: 'tx1', userId: 'student01', courseId: 'c1', amount: 49.99, timestamp: '2024-07-20T10:00:00Z' },
    { transactionId: 'tx2', userId: 'student01', courseId: 'c3', amount: 39.99, timestamp: '2024-07-25T15:30:00Z' },
  ];
}

const db = new Database();

// --- DATA ACCESS FUNCTIONS ---

// User Data
export const findUserByEmail = (email: string) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
export const findUserById = (id: string) => db.users.find(u => u.id === id);
export const addUser = (user: User) => { db.users.push(user); return user; };

// Course Data
export const getCourses = (filters: { searchTerm?: string, tag?: string, price?: 'all' | 'paid' | 'free' } = {}): Course[] => {
    let courses = db.courses;
    if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        courses = courses.filter(c => c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term));
    }
    if (filters.tag) courses = courses.filter(c => c.tags.includes(filters.tag!));
    if (filters.price && filters.price !== 'all') {
        const type = filters.price === 'free' ? 'free' : 'paid';
        courses = courses.filter(c => c.type === type);
    }
    return courses;
};
export const getCourseById = (id: string) => db.courses.find(c => c.id === id);
export const getCourseTags = () => [...new Set(db.courses.flatMap(course => course.tags))];
export const addCourse = (data: Omit<Course, 'id' | 'imageUrl' | 'modules' | 'downloads'>) => {
    const newCourse: Course = { ...data, id: `c${db.courses.length + 1}_${Date.now()}`, imageUrl: `https://picsum.photos/seed/${data.title.split(' ')[0]}/600/400`, modules: [], downloads: [] };
    db.courses.unshift(newCourse);
    return newCourse;
};

// Other Data
export const getResources = () => db.resources;
export const getDsaProblems = () => db.dsaProblems;

// Leaderboard
export const getLeaderboard = (): LeaderboardUser[] => {
    const students = db.users.filter(u => u.role === 'student');
    const leaderboard = students.map(student => ({
        id: student.id, name: student.name,
        totalSolved: student.externalAccounts.reduce((sum, acc) => sum + acc.stats.solvedCount, 0)
    }));
    leaderboard.sort((a, b) => b.totalSolved - a.totalSolved);
    return leaderboard.map((user, index) => ({ ...user, rank: index + 1 }));
};

// Transactions
export const getTransactionsForUser = (userId: string) => db.transactions.filter(tx => tx.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
export const addTransaction = (payment: Payment) => { db.transactions.push(payment); return payment; };

// OTP Store
export const getOtp = (email: string) => db.otpStore[email.toLowerCase()];
export const setOtp = (email: string, otp: string) => {
    db.otpStore[email.toLowerCase()] = { otp, expires: Date.now() + 10 * 60 * 1000 };
};
export const deleteOtp = (email: string) => { delete db.otpStore[email.toLowerCase()]; };

// External Account Syncing
export const syncAccount = (account: ExternalAccount): ExternalAccount => {
    console.log(`Syncing ${account.platform} for ${account.username}...`);
    const updatedAccount: ExternalAccount = {
        ...account,
        stats: {
            solvedCount: account.stats.solvedCount + Math.floor(Math.random() * 5),
            ranking: Math.max(1, account.stats.ranking - Math.floor(Math.random() * 50)),
        },
        lastSynced: new Date().toISOString(),
    };
    console.log(`Sync complete for ${account.platform}. New stats:`, updatedAccount.stats);
    return updatedAccount;
};