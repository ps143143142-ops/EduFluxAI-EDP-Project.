import * as db from './db';
import * as auth from './auth';
import * as ai from './aiService';
import * as user from './userService';

// This is the single, unified API object that the frontend will interact with.
// It simulates a complete backend API surface.
export const serverApi = {
  // Auth endpoints
  requestOtp: auth.requestOtp,
  verifyOtpAndRegister: auth.verifyOtpAndRegister,
  login: auth.login,
  
  // User endpoints
  getUserFromToken: user.getUserFromToken,
  updateUser: user.updateUser,
  processPaymentAndEnroll: user.processPaymentAndEnroll,
  
  // Data endpoints
  getCourses: db.getCourses,
  getCourseById: db.getCourseById,
  getCourseTags: db.getCourseTags,
  addCourse: db.addCourse,
  getResources: db.getResources,
  getDsaProblems: db.getDsaProblems,
  getLeaderboard: db.getLeaderboard,
  getTransactionsForUser: db.getTransactionsForUser,
  syncAccount: db.syncAccount,

  // AI service endpoints
  generateLearningRoadmap: ai.generateLearningRoadmap,
  recommendCareerPath: ai.recommendCareerPath,
  generateResume: ai.generateResume,
  getFutureTrends: ai.getFutureTrends,
  getDSAHint: ai.getDSAHint,
  findJobs: ai.findJobs,
  generateSpeech: ai.generateSpeech,
  continueChat: ai.continueChat,
};

// Expose the API to the window for easy access from the frontend services
(window as any).serverApi = serverApi;