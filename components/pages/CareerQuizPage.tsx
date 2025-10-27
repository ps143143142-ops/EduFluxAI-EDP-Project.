import React, { useState, useCallback } from 'react';
import * as api from '../../services/apiService';
import { CareerPath } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const CareerQuizPage: React.FC = () => {
    const [answers, setAnswers] = useState({ interests: '', activities: '', learningStyle: '', goal: '' });
    const [result, setResult] = useState<CareerPath | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const careerPath = await api.recommendCareerPath(answers);
            setResult(careerPath);
        } catch (err: any) {
            setError(err.message || 'Failed to get career recommendation.');
        } finally {
            setIsLoading(false);
        }
    }, [answers]);
    
    const isFormIncomplete = !answers.interests || !answers.activities || !answers.learningStyle || !answers.goal;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">AI Career Recommendation Engine</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Answer a few questions to find the perfect tech career path for you.</p>

            {!result && (
                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">What are your interests? (e.g., problem-solving, design, data)</label>
                            <input type="text" name="interests" value={answers.interests} onChange={e => setAnswers({...answers, interests: e.target.value})} required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What activities do you enjoy most?</label>
                            <select name="activities" value={answers.activities} onChange={e => setAnswers({...answers, activities: e.target.value})} required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md"><option value="">Select an option</option><option>Building tangible products</option><option>Analyzing data and finding patterns</option><option>Automating processes</option><option>Creating user interfaces</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What's your preferred learning style?</label>
                            <select name="learningStyle" value={answers.learningStyle} onChange={e => setAnswers({...answers, learningStyle: e.target.value})} required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md"><option value="">Select an option</option><option>Project-based and hands-on</option><option>Theoretical and reading-focused</option><option>Visual, through videos</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">What is your primary career goal?</label>
                            <input type="text" name="goal" value={answers.goal} onChange={e => setAnswers({...answers, goal: e.target.value})} placeholder="e.g., High salary, work-life balance" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                        </div>
                        <button type="submit" disabled={isLoading || isFormIncomplete} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isLoading ? <Spinner /> : 'Find My Career Path'}
                        </button>
                    </form>
                </Card>
            )}

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            {result && (
                <Card className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-2 text-indigo-500">Recommended: {result.name}</h2>
                    <p className="text-center mb-6">{result.description}</p>
                    <div className="space-y-4">
                        <div><h3 className="text-xl font-bold mb-2">Learning Plan</h3><ul className="list-disc list-inside space-y-1">{result.learningPlan.map((step, i) => <li key={i}>{step}</li>)}</ul></div>
                        <div><h3 className="text-xl font-bold mb-2">Certifications</h3><ul className="list-disc list-inside space-y-1">{result.certifications.map((cert, i) => <li key={i}>{cert}</li>)}</ul></div>
                        <div><h3 className="text-xl font-bold mb-2">Job Portals</h3><div className="flex flex-wrap gap-2">{result.jobPortals.map((portal, i) => <span key={i} className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-sm">{portal}</span>)}</div></div>
                    </div>
                    <button onClick={() => setResult(null)} className="mt-8 w-full px-6 py-3 text-lg font-semibold text-indigo-700 bg-indigo-100 dark:bg-slate-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-slate-600">Take Quiz Again</button>
                </Card>
            )}
        </div>
    );
};

export default CareerQuizPage;