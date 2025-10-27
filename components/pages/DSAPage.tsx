import React, { useState, useCallback, useEffect } from 'react';
import { DSAProblem } from '../../types';
import Card from '../ui/Card';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

const HintModal: React.FC<{ title: string; hint: string; isLoading: boolean; onClose: () => void; }> = ({ title, hint, isLoading, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <Card className="w-full max-w-lg p-6 relative">
             <button onClick={onClose} className="absolute top-3 right-4 text-3xl font-bold">&times;</button>
             <h2 className="text-xl font-bold mb-4">AI Hint for: <span className="text-indigo-500">{title}</span></h2>
             {isLoading ? <div className="text-center py-8"><Spinner /></div> : <p>{hint}</p>}
        </Card>
    </div>
);

const DSAPage: React.FC = () => {
    const [dsaProblems, setDsaProblems] = useState<{ category: string, problems: DSAProblem[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hintData, setHintData] = useState<{ problem: DSAProblem | null, hint: string, isLoading: boolean }>({ problem: null, hint: '', isLoading: false });
    
    useEffect(() => {
        api.getDsaProblems().then(data => {
            setDsaProblems(data);
            setIsLoading(false);
        });
    }, []);
    
    const handleGetHint = useCallback(async (problem: DSAProblem) => {
        setHintData({ problem, hint: '', isLoading: true });
        try {
            const hintText = await api.getDSAHint(problem.title);
            setHintData({ problem, hint: hintText, isLoading: false });
        } catch (error: any) {
            setHintData({ problem, hint: error.message || 'Failed to load hint.', isLoading: false });
        }
    }, []);
    
    const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        if (difficulty === 'Easy') return 'text-green-500 bg-green-100 dark:bg-green-900';
        if (difficulty === 'Medium') return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
        return 'text-red-500 bg-red-100 dark:bg-red-900';
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">DSA Practice Zone</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Hone your skills with curated problems and get AI-powered hints.</p>
            
            {isLoading ? <div className="text-center py-10"><Spinner/></div> : (
                <div className="space-y-8">
                    {dsaProblems.map(({ category, problems }) => (
                        <Card key={category} className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{category}</h2>
                            <ul className="space-y-3">
                                {problems.map(problem => (
                                    <li key={problem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <div className="flex-grow">
                                            <a href={problem.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{problem.title}</a>
                                            <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
                                        </div>
                                        <div className="mt-2 sm:mt-0 flex gap-2">
                                            <button onClick={() => handleGetHint(problem)} className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Get AI Hint</button>
                                            <a href={problem.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-slate-700 rounded-md">Solve</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            )}
            
            {hintData.problem && <HintModal title={hintData.problem.title} hint={hintData.hint} isLoading={hintData.isLoading} onClose={() => setHintData({ problem: null, hint: '', isLoading: false })} />}
        </div>
    );
};

export default DSAPage;