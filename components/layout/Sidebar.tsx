import React from 'react';
import { User, Page } from '../../types';

interface SidebarProps {
  currentUser: User | null;
  navigate: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    navigate: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, navigate, children }) => {
    const isActive = currentPage === page;
    const classes = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        isActive
            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;
    return (
        <button onClick={() => navigate(page)} className={classes}>
            <span>{children}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentUser, navigate, currentPage }) => {
    if (!currentUser) {
        return null;
    }

    const renderStudentLinks = () => (
        <>
            <NavLink page="student-dashboard" currentPage={currentPage} navigate={navigate}>Dashboard</NavLink>
            <NavLink page="courses" currentPage={currentPage} navigate={navigate}>Courses</NavLink>
            <NavLink page="dsa-problems" currentPage={currentPage} navigate={navigate}>DSA Problems</NavLink>
            <NavLink page="dsa-leaderboard" currentPage={currentPage} navigate={navigate}>Leaderboard</NavLink>
            <NavLink page="resources" currentPage={currentPage} navigate={navigate}>Resources</NavLink>
            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Tools</h3>
            <NavLink page="learning-roadmap" currentPage={currentPage} navigate={navigate}>AI Roadmap</NavLink>
            <NavLink page="career-quiz" currentPage={currentPage} navigate={navigate}>Career Quiz</NavLink>
            <NavLink page="future-trends" currentPage={currentPage} navigate={navigate}>Future Trends</NavLink>
            <NavLink page="resume-builder" currentPage={currentPage} navigate={navigate}>AI Resume Builder</NavLink>
            <NavLink page="ai-job-finder" currentPage={currentPage} navigate={navigate}>AI Job Finder</NavLink>
        </>
    );
    
    const renderAdminLinks = () => (
        <>
            <NavLink page="admin-dashboard" currentPage={currentPage} navigate={navigate}>Dashboard</NavLink>
            <NavLink page="courses" currentPage={currentPage} navigate={navigate}>Manage Courses</NavLink>
        </>
    );

    return (
        <aside className="w-60 flex-shrink-0 bg-white dark:bg-slate-800 p-4 flex-col hidden md:flex border-r border-slate-200 dark:border-slate-700">
            <div className="flex-grow">
                <nav className="flex flex-col gap-1">
                    {currentUser.role === 'student' ? renderStudentLinks() : renderAdminLinks()}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;