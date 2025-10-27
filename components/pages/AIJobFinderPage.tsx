import React, { useState, useCallback } from 'react';
import * as api from '../../services/apiService';
import { JobPosting, GroundingSource } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const AIJobFinderPage: React.FC = () => {
    const [role, setRole] = useState('Java Full-Stack Developer');
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [sources, setSources] = useState<GroundingSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) { setError('Please enter a job role.'); return; }
        setIsLoading(true);
        setError(null);
        setJobs([]);
        setSources([]);

        const userSkills = 'Java, Spring Boot, Python, React, TypeScript, SQL, Git, Docker';

        try {
            const result = await api.findJobs(role, userSkills);
            setJobs(result.jobs);
            setSources(result.sources);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [role]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">AI Job Finder</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Let our AI find the latest job opportunities tailored for you, powered by Google Search.</p>
            
            <Card className="p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Senior React Developer" className="flex-grow w-full px-4 py-2 text-lg bg-white dark:bg-slate-700 border rounded-md" disabled={isLoading}/>
                    <button type="submit" className="px-6 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Find Jobs'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </Card>

            {isLoading && <div className="text-center py-10"><Spinner /><p className="mt-4">Searching for jobs...</p></div>}

            {jobs.length > 0 && (
                <div className="space-y-6">
                    {jobs.map((job, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-indigo-500">{job.jobTitle}</h2>
                                    <p className="font-semibold">{job.company} - <span className="font-normal text-sm">{job.location}</span></p>
                                </div>
                                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Apply</a>
                            </div>
                            <p className="mt-4 text-sm">{job.description}</p>
                        </Card>
                    ))}
                     {sources.length > 0 && (
                        <Card className="p-4 mt-4">
                            <h3 className="text-sm font-bold mb-2">Sources:</h3>
                            <ul className="space-y-1 list-disc list-inside">
                                {sources.filter(s => s.web).map((source, index) => (
                                    <li key={index} className="text-xs"><a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{source.web!.title || source.web!.uri}</a></li>
                                ))}
                            </ul>
                        </Card>
                     )}
                </div>
            )}
        </div>
    );
};

export default AIJobFinderPage;