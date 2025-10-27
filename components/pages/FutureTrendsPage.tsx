import React, { useState, useCallback } from 'react';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import { GroundingSource } from '../../types';

const FutureTrendsPage: React.FC = () => {
    const [career, setCareer] = useState('Software Engineer');
    const [trends, setTrends] = useState<string>('');
    const [sources, setSources] = useState<GroundingSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!career) { setError('Please enter a career path.'); return; }
        setIsLoading(true);
        setError(null);
        setTrends('');
        setSources([]);
        try {
            const result = await api.getFutureTrends(career);
            setTrends(result.text);
            setSources(result.sources);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [career]);
    
    const renderMarkdown = (text: string) => {
        return text.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2">$1</h3>').replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 border-b pb-1">$1</h2>').replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>').replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>').replace(/\n/g, '<br />');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">AI Future Trends Advisor</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Discover future skills and tech for your career, with up-to-date info from Google Search.</p>
            
            <Card className="p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={career} onChange={(e) => setCareer(e.target.value)} placeholder="e.g., Data Scientist" className="flex-grow w-full px-4 py-2 text-lg bg-white dark:bg-slate-700 border rounded-md" disabled={isLoading} />
                    <button type="submit" className="px-6 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Analyze'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </Card>

            {isLoading && <div className="text-center py-10"><Spinner /><p className="mt-4">Analyzing future trends...</p></div>}

            {trends && (
                <Card className="p-6">
                     <div dangerouslySetInnerHTML={{ __html: renderMarkdown(trends) }} />
                     {sources.length > 0 && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-bold mb-2">Sources:</h3>
                            <ul className="space-y-2">
                                {sources.map((source, index) => source.web && (
                                    <li key={index} className="text-sm">
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{source.web.title || source.web.uri}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     )}
                </Card>
            )}
        </div>
    );
};

export default FutureTrendsPage;