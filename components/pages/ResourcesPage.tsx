import React, { useState, useEffect } from 'react';
import { Resource, ResourceType } from '../../types';
import Card from '../ui/Card';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
    // Icons can be added here
    return (
        <Card className="p-4">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                <h3 className="font-bold hover:text-indigo-500">{resource.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{resource.description}</p>
                <span className="mt-2 bg-slate-200 dark:bg-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full self-start">{resource.category}</span>
            </a>
        </Card>
    );
};

const ResourcesPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getResources().then(data => {
            setResources(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">Free Learning Resources</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">A curated library of tutorials, books, and articles.</p>
            
            {isLoading ? <div className="text-center py-10"><Spinner /></div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;