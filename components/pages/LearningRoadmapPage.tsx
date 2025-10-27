import React, { useState, useCallback } from 'react';
import * as api from '../../services/apiService';
import { LearningRoadmap, LearningStep } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const ResourceLink: React.FC<{ resource: LearningStep['resources'][0] }> = ({ resource }) => {
    // Icons can be added here based on resource.type
    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200">
            <span className="truncate text-sm font-medium">{resource.title}</span>
        </a>
    )
};

const LearningRoadmapPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) { setError('Please enter a topic.'); return; }
        setIsLoading(true);
        setError(null);
        setRoadmap(null);
        try {
            const result = await api.generateLearningRoadmap(topic);
            setRoadmap(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">AI Learning Roadmap Generator</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Enter any tech topic and get a personalized, step-by-step learning plan.</p>
            
            <Card className="p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Full Stack Java with Spring and React" className="flex-grow w-full px-4 py-2 text-lg bg-white dark:bg-slate-700 border rounded-md" disabled={isLoading} />
                    <button type="submit" className="px-6 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Generate'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </Card>

            {isLoading && <div className="text-center py-10"><Spinner /><p className="mt-4">Generating your roadmap...</p></div>}

            {roadmap && (
                <Card className="p-6">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-500">{roadmap.topic}</h2>
                    <div className="space-y-6">
                        {roadmap.steps.map((step, index) => (
                            <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">{index + 1}. {step.title}</h3>
                                <p className="mb-4">{step.description}</p>
                                <h4 className="font-semibold mb-2">Resources:</h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {step.resources.map((res, resIndex) => <ResourceLink key={resIndex} resource={res} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default LearningRoadmapPage;