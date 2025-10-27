import { User, Course, Resource, DSAProblem, LeaderboardUser, LearningRoadmap, CareerPath, ResumeData, JobPosting, GroundingSource, ExternalAccount, Payment } from '../types';

// The serverApi is attached to the window object by server/index.ts
// This simulates the frontend accessing a backend API.
const api = (window as any).serverApi;

const simulateLatency = <T>(promise: Promise<T> | T, delay: number = 300): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(promise), delay);
  });
};

// --- Auth ---
export const requestOtp = (name: string, email: string, password: string) => 
    simulateLatency(api.requestOtp(name, email, password));

export const verifyOtpAndRegister = (email: string, otp: string) => 
    simulateLatency(api.verifyOtpAndRegister(email, otp));

export const loginUser = (email: string, password: string) => 
    simulateLatency(api.login(email, password));

// --- User ---
export const getUserFromToken = (token: string) => 
    simulateLatency(api.getUserFromToken(token), 100);

export const updateUser = (token: string, updatedUser: User) => 
    simulateLatency(api.updateUser(updatedUser.id, updatedUser));

export const processPaymentAndEnroll = (token: string, courseId: string, amount: number, transactionId: string) => {
    const user = api.getUserFromToken(token).user; // Get user ID from token
    if (!user) return Promise.reject("Invalid token");
    return simulateLatency(api.processPaymentAndEnroll(user.id, courseId, amount, transactionId));
}

export const syncAccount = (token: string, account: ExternalAccount) => {
     const user = api.getUserFromToken(token).user;
    if (!user) return Promise.reject("Invalid token");
    const synced = api.syncAccount(account);
    const updatedAccounts = user.externalAccounts.map(acc => acc.platform === synced.platform ? synced : acc);
    return simulateLatency(api.updateUser(user.id, { ...user, externalAccounts: updatedAccounts }), 1500);
}

// --- Data Fetching ---
export const getCourses = (filters: any = {}) => simulateLatency(api.getCourses(filters));
export const getCourseById = (id: string) => simulateLatency(api.getCourseById(id));
export const getCourseTags = () => simulateLatency(api.getCourseTags());
export const addCourse = (data: any) => simulateLatency(api.addCourse(data));
export const getResources = () => simulateLatency(api.getResources());
export const getDsaProblems = () => simulateLatency(api.getDsaProblems());
export const getLeaderboard = () => simulateLatency(api.getLeaderboard());
export const getTransactionsForUser = (userId: string) => simulateLatency(api.getTransactionsForUser(userId));


// --- AI Services ---
export const generateLearningRoadmap = (topic: string): Promise<LearningRoadmap> => 
    simulateLatency(api.generateLearningRoadmap(topic), 2000);

export const recommendCareerPath = (answers: Record<string, string>): Promise<CareerPath> => 
    simulateLatency(api.recommendCareerPath(answers), 2000);
    
export const continueChat = (userId: string, message: string): Promise<string> =>
    simulateLatency(api.continueChat(userId, message), 1000);

export const generateResume = (data: ResumeData): Promise<string> =>
    simulateLatency(api.generateResume(data), 2000);
    
export const getFutureTrends = (career: string): Promise<{ text: string; sources: any[] }> =>
    simulateLatency(api.getFutureTrends(career), 2000);

export const getDSAHint = (problemTitle: string): Promise<string> =>
    simulateLatency(api.getDSAHint(problemTitle), 1000);

export const findJobs = (role: string, skills: string): Promise<{ jobs: JobPosting[], sources: GroundingSource[] }> =>
    simulateLatency(api.findJobs(role, skills), 2500);

export const generateSpeech = (text: string): Promise<string | null> =>
    simulateLatency(api.generateSpeech(text), 1000);