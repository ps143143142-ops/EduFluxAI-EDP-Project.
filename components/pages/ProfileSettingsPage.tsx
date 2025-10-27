import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, ExternalAccount } from '../../types';
import * as api from '../../services/apiService';
import { getToken } from '../../utils/auth';
import Spinner from '../ui/Spinner';

interface ProfileSettingsPageProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onUpdateUser }) => {
    const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

    const handleSync = async (accountToSync: ExternalAccount) => {
        const token = getToken();
        if (!token) return;
        setSyncingPlatform(accountToSync.platform);
        try {
            const result = await api.syncAccount(token, accountToSync);
            if (result.success && result.user) {
                onUpdateUser(result.user);
            }
        } catch (error) {
            console.error("Failed to sync account:", error);
            alert("Failed to sync account.");
        } finally {
            setSyncingPlatform(null);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
             <h1 className="text-4xl font-bold mb-8">Profile & Settings</h1>
             <div className="space-y-8">
                <Card className="p-6">
                     <h2 className="text-2xl font-bold mb-4">User Information</h2>
                     <div className="space-y-2">
                         <p><span className="font-semibold">Name:</span> {user.name}</p>
                         <p><span className="font-semibold">Email:</span> {user.email}</p>
                     </div>
                </Card>
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Linked Accounts</h2>
                    <div className="space-y-4">
                        {user.externalAccounts.map(account => (
                            <div key={account.platform} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold">{account.platform}</h3>
                                    <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">{account.username}</a>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Last synced: {new Date(account.lastSynced).toLocaleString()}</p>
                                </div>
                                <div className="text-sm text-center">
                                    <p><span className="font-semibold">Solved:</span> {account.stats.solvedCount}</p>
                                    <p><span className="font-semibold">Ranking:</span> {account.stats.ranking.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                     <button onClick={() => handleSync(account)} disabled={!!syncingPlatform} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 w-24">
                                        {syncingPlatform === account.platform ? <Spinner/> : 'Sync Now'}
                                     </button>
                                </div>
                            </div>
                        ))}
                         {user.externalAccounts.length === 0 && <p className="text-center py-4">No accounts linked yet.</p>}
                    </div>
                </Card>
             </div>
        </div>
    );
};

export default ProfileSettingsPage;