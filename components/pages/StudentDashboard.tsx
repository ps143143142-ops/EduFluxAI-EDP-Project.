import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { User, Course, Payment } from '../../types';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

interface StudentDashboardProps {
    user: User;
    navigateToCourse: (courseId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, navigateToCourse }) => {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        Promise.all([
            api.getCourses(),
            api.getTransactionsForUser(user.id)
        ]).then(([allCourses, userTransactions]) => {
            setEnrolledCourses(allCourses.filter(course => user.enrolledCourses.includes(course.id)));
            setTransactions(userTransactions);
            setIsLoading(false);
        });
    }, [user.id, user.enrolledCourses]);
    
    const totalSolvedProblems = user.externalAccounts.reduce((sum, acc) => sum + acc.stats.solvedCount, 0);

    if (isLoading) {
        return <div className="text-center py-20"><Spinner /></div>
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Enrolled Courses</h3><p className="text-5xl font-bold text-indigo-500">{enrolledCourses.length}</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">DSA Solved</h3><p className="text-5xl font-bold text-indigo-500">{totalSolvedProblems}</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Progress</h3><p className="text-5xl font-bold text-indigo-500">48%</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Certificates</h3><p className="text-5xl font-bold text-indigo-500">1</p></Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Your Enrolled Courses</h2>
                        <div className="space-y-4">
                            {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                                <div key={course.id} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <div><h4 className="font-bold text-lg">{course.title}</h4><p className="text-sm text-slate-500">{course.instructor}</p></div>
                                    <button onClick={() => navigateToCourse(course.id)} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Continue</button>
                                </div>
                            )) : <p>You are not enrolled in any courses yet.</p>}
                        </div>
                    </Card>
                     <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
                        {transactions.length > 0 ? (
                             <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-200 dark:border-slate-700"><tr><th className="p-2">Course</th><th className="p-2 text-right">Amount</th><th className="p-2 text-right">Date</th></tr></thead>
                                <tbody>
                                    {transactions.map(tx => {
                                        const course = enrolledCourses.find(c => c.id === tx.courseId);
                                        return <tr key={tx.transactionId}><td className="p-2">{course?.title}</td><td className="p-2 text-right">${tx.amount.toFixed(2)}</td><td className="p-2 text-right text-sm">{new Date(tx.timestamp).toLocaleDateString()}</td></tr>
                                    })}
                                </tbody>
                            </table>
                        ) : <p>No payment history found.</p>}
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">CP Stats</h2>
                        {user.externalAccounts.length > 0 ? (
                             <div className="space-y-4">
                                {user.externalAccounts.map(account => (
                                    <div key={account.platform} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <h4 className="font-bold">{account.platform}</h4>
                                        <p className="text-sm">Solved: {account.stats.solvedCount} | Rank: {account.stats.ranking}</p>
                                    </div>
                                ))}
                             </div>
                        ) : <p>Link competitive programming accounts in settings!</p>}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;