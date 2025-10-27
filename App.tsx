import React, { useState, useCallback, useEffect } from 'react';
import { User, Page } from './types';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import StudentDashboard from './components/pages/StudentDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import CoursesPage from './components/pages/CoursesPage';
import LearningRoadmapPage from './components/pages/LearningRoadmapPage';
import CareerQuizPage from './components/pages/CareerQuizPage';
import ResumeBuilderPage from './components/pages/ResumeBuilderPage';
import AIAssistantChatbot from './components/AIAssistantChatbot';
import FutureTrendsPage from './components/pages/FutureTrendsPage';
import DSAPage from './components/pages/DSAPage';
import ResourcesPage from './components/pages/ResourcesPage';
import ProfileSettingsPage from './components/pages/ProfileSettingsPage';
import LeaderboardPage from './components/pages/LeaderboardPage';
import CourseDetailPage from './components/pages/CourseDetailPage';
import AIJobFinderPage from './components/pages/AIJobFinderPage';
import * as api from './services/apiService';
import { getToken, removeToken, setToken } from './utils/auth';
import Spinner from './components/ui/Spinner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check for token on initial load and verify with backend
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.getUserFromToken(token).then(result => {
        if (result.success && result.user) {
          setCurrentUser(result.user);
        } else {
          removeToken();
        }
        setIsAuthLoading(false);
      });
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const handleLogin = (user: User, token: string) => {
    setToken(token);
    setCurrentUser(user);
    setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleLogout = useCallback(() => {
    removeToken();
    setCurrentUser(null);
    setCurrentPage('home');
    setSelectedCourseId(null);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);
  
  const navigateToCourse = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  }, []);
  
  const handleUpdateUser = useCallback(async (updatedUser: User) => {
      const token = getToken();
      if (!token) { handleLogout(); return; } // Should not happen
      
      const result = await api.updateUser(token, updatedUser);
      if(result.success && result.user) {
        setCurrentUser(result.user);
        // In a real app, the backend might issue a new token with updated claims
      } else {
        alert("Failed to update user profile.");
      }
  }, [handleLogout]);

  // Route protection logic
  useEffect(() => {
    if (isAuthLoading) return;

    const protectedPages: Page[] = [
        'student-dashboard', 'admin-dashboard', 'courses', 'learning-roadmap', 
        'career-quiz', 'resume-builder', 'dsa-learning', 'future-trends', 
        'dsa-problems', 'resources', 'profile-settings', 'dsa-leaderboard', 'course-detail',
        'ai-job-finder'
    ];
    
    if (!currentUser && protectedPages.includes(currentPage)) setCurrentPage('login');
    if (currentUser && (currentPage === 'login' || currentPage === 'register')) {
        setCurrentPage(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    }
  }, [currentPage, currentUser, isAuthLoading]);

  if (isAuthLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 justify-center items-center">
            <Spinner />
        </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'login': return <LoginPage onLogin={handleLogin} navigate={navigate} />;
      case 'register': return <RegisterPage onRegisterSuccess={handleLogin} navigate={navigate} />;
      case 'student-dashboard': return currentUser ? <StudentDashboard user={currentUser} navigateToCourse={navigateToCourse} /> : null;
      case 'admin-dashboard': return currentUser?.role === 'admin' ? <AdminDashboard /> : null;
      case 'courses': return currentUser ? <CoursesPage currentUser={currentUser} navigateToCourse={navigateToCourse} /> : null;
      case 'course-detail': return (selectedCourseId && currentUser) ? <CourseDetailPage courseId={selectedCourseId} currentUser={currentUser} onUpdateUser={(u) => handleUpdateUser(u)} /> : null;
      case 'learning-roadmap': return <LearningRoadmapPage />;
      case 'career-quiz': return <CareerQuizPage />;
      case 'resume-builder': return <ResumeBuilderPage />;
      case 'future-trends': return <FutureTrendsPage />;
      case 'dsa-problems': return <DSAPage />;
      case 'resources': return <ResourcesPage />;
      case 'profile-settings': return currentUser ? <ProfileSettingsPage user={currentUser} onUpdateUser={handleUpdateUser} /> : null;
      case 'dsa-leaderboard': return <LeaderboardPage currentUser={currentUser} />;
      case 'ai-job-finder': return <AIJobFinderPage />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Sidebar currentUser={currentUser} navigate={navigate} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLogout={handleLogout} navigate={navigate} />
        <main className="flex-grow overflow-y-auto container mx-auto px-4 py-8">
            {renderPage()}
        </main>
        <Footer />
      </div>
      {currentUser && <AIAssistantChatbot userId={currentUser.id} />}
    </div>
  );
};

export default App;