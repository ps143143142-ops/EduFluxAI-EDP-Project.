import React from 'react';
import Card from '../ui/Card';
import { Page } from '../../types';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <Card className="p-6 text-center">
        <div className="flex justify-center mb-4 text-indigo-500">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </Card>
);

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="text-center">
      <div className="py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Your <span className="text-indigo-500">AI-Powered</span> Learning Journey
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
          EduFluxAI provides intelligent career guidance, smart learning roadmaps, and personalized course recommendations to accelerate your tech career.
        </p>
        <div className="mt-8">
          <button onClick={() => navigate('login')} className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-transform">
            Get Started
          </button>
        </div>
      </div>

      <div className="py-16 bg-slate-200 dark:bg-slate-800 rounded-xl">
        <h2 className="text-3xl font-bold mb-10">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} title="AI Smart Learning" description="Personalized learning roadmaps with curated resources."/>
          <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="AI Career Engine" description="AI-recommended career paths tailored to your goals."/>
          <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a10 10 0 01-4-1L3 20l1-4a10 10 0 0117 0z" /></svg>} title="Smart AI Tutor" description="An integrated AI chatbot for instant help, available 24/7."/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;