import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, Page } from '../../types';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
  navigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('alex@eduflux.ai');
  const [password, setPassword] = useState('alex');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await api.loginUser(email, password);
        if (result.success && result.user && result.token) {
            onLogin(result.user, result.token);
        } else {
            setError(result.message);
        }
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back!</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Login to continue your journey.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" placeholder="alex@eduflux.ai" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" placeholder="••••••••" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
            {isLoading ? <Spinner /> : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => navigate('register')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Don't have an account? Register.
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;