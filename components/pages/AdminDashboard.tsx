import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../ui/Card';

const AdminDashboard: React.FC = () => {
    // In a real app, this data would be fetched from the backend API
    const revenueData = [
      { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
      { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
    ];
    const courseData = [
      { name: 'Full-Stack', value: 400 }, { name: 'AI/ML', value: 300 },
      { name: 'Frontend', value: 300 }, { name: 'Cloud', value: 200 },
    ];
    const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
    const topCourses = [
        { name: 'Java Full-Stack Mastery', enrollments: 412 },
        { name: 'AI & Machine Learning Deep Dive', enrollments: 358 },
        { name: 'Modern Frontend with React & Tailwind', enrollments: 295 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Total Revenue</h3><p className="text-5xl font-bold text-indigo-500">$28,000</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Total Students</h3><p className="text-5xl font-bold text-indigo-500">1,250</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">Courses</h3><p className="text-5xl font-bold text-indigo-500">12</p></Card>
                <Card className="p-6"><h3 className="font-bold text-lg mb-2">New Signups (30d)</h3><p className="text-5xl font-bold text-indigo-500">82</p></Card>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                    <h2 className="text-2xl font-bold mb-4">Revenue This Year</h2>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Courses</h2>
                    <ul className="space-y-4">
                       {topCourses.map((course, index) => (
                         <li key={index} className="flex justify-between items-center">
                           <span className="font-medium">{course.name}</span>
                           <span className="font-bold text-indigo-500">{course.enrollments}</span>
                         </li>
                       ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;