import React, { useState } from 'react';
import Card from '../ui/Card';
import { Page, User } from '../../types';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

interface RegisterPageProps {
  onRegisterSuccess: (user: User, token: string) => void;
  navigate: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, navigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
        const result = await api.requestOtp(formData.name, formData.email, formData.password);
        if (result.success) {
            setMessage(result.message);
            setStep(2);
        } else {
            setError(result.message);
        }
    } catch (err: any) {
        setError(err.message || "An error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setMessage('');
      setIsLoading(true);
      try {
        const result = await api.verifyOtpAndRegister(formData.email, otp);
        if (result.success && result.user && result.token) {
            alert(result.message);
            onRegisterSuccess(result.user, result.token);
        } else {
            setError(result.message);
        }
    } catch (err: any) {
        setError(err.message || "An error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <Card className="w-full max-w-md p-8">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Start your AI learning journey.</p>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Full Name" className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="Email Address" className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
              <input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="Password" className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                {isLoading ? <Spinner /> : 'Register'}
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Verify Your Email</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{message}</p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter 6-digit OTP" maxLength={6} className="w-full p-2 text-center tracking-[1em] bg-white dark:bg-slate-700 border rounded-md" />
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400">
                    {isLoading ? <Spinner /> : 'Verify Account'}
                </button>
            </form>
          </>
        )}
        <div className="text-center mt-6">
          <button onClick={() => navigate('login')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Already have an account? Login.
          </button>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;