import React, { useState, useEffect } from 'react';
// FIX: The `generateLearningRoadmap` function should be imported from the unified `apiService`, not the empty `geminiService`.
import * as api from '../../services/apiService';
import { LearningRoadmap, LearningStep } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const ResourceLink: React.FC<{ resource: LearningStep['resources'][0] }> = ({ resource }) => {
    const iconMap = {
        youtube: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        book: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        article: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        documentation: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    };
    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            {iconMap[resource.type] || iconMap.article}
            <span className="truncate text-sm font-medium">{resource.title}</span>
        </a>
    )
};

const DSALearningPage: React.FC = () => {
    const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoadmap = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // FIX: The function call must be prefixed with `api.` to match the updated import.
                const result = await api.generateLearningRoadmap("Data Structures and Algorithms for beginners in Java");
                setRoadmap(result);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoadmap();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10">
                    <Spinner />
                    <p className="mt-4 text-slate-500">Generating your DSA roadmap...</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 mt-4 text-center">{error}</p>;
        }

        if (roadmap) {
            return (
                <Card className="p-6">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-500">{roadmap.topic}</h2>
                    <div className="space-y-6">
                        {roadmap.steps.map((step, index) => (
                            <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{index + 1}. {step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">{step.description}</p>
                                <h4 className="font-semibold mb-2">Recommended Resources:</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {step.resources.map((res, resIndex) => (
                                        <ResourceLink key={resIndex} resource={res} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            );
        }

        return null;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">AI-Generated DSA Learning Path</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Your personalized roadmap to mastering Data Structures and Algorithms.</p>
            {renderContent()}
        </div>
    );
};

export default DSALearningPage;