import React, { useState, useEffect, useCallback } from 'react';
import { Course, User } from '../../types';
import * as api from '../../services/apiService';
import { getToken } from '../../utils/auth';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';

const DownloadIcon: React.FC<{ type: 'pdf' | 'zip' }> = ({ type }) => {
    if (type === 'pdf') return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
};

interface CourseDetailPageProps {
    courseId: string;
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, currentUser, onUpdateUser }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getCourseById(courseId).then(fetchedCourse => {
            if (fetchedCourse) setCourse(fetchedCourse);
            setIsLoading(false);
        });
    }, [courseId]);

    const handlePaymentAndEnroll = useCallback(async (transactionId: string) => {
        const token = getToken();
        if (!token || !course) return;

        try {
            const result = await api.processPaymentAndEnroll(token, course.id, course.price, transactionId);
            if (result.success && result.user) {
                onUpdateUser(result.user);
                alert(`Payment successful! You are now enrolled in "${course.title}".`);
            } else {
                throw new Error("Enrollment failed on the server.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during enrollment. Please contact support.");
        }
    }, [course, onUpdateUser]);

    const handlePaymentGateway = useCallback(() => {
        if (!course || !currentUser) return;
        
        // Free course enrollment
        if (course.type === 'free') {
            handlePaymentAndEnroll("FREE_ENROLLMENT");
            return;
        }
        
        // Paid course via Razorpay
        const options = {
            key: 'rzp_test_your_key', // Replace with your test key
            amount: course.price * 100, currency: 'USD', name: 'EduFluxAI',
            description: `Payment for ${course.title}`, image: 'https://picsum.photos/seed/logo/128/128',
            handler: (response: any) => handlePaymentAndEnroll(response.razorpay_payment_id),
            prefill: { name: currentUser.name, email: currentUser.email },
            theme: { color: '#6366f1' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    }, [course, currentUser, handlePaymentAndEnroll]);

    if (isLoading) return <div className="text-center py-20"><Spinner /></div>;
    if (!course) return <div className="text-center py-20">Course not found.</div>;
    
    const isEnrolled = currentUser?.enrolledCourses.includes(course.id);

    if (isEnrolled) {
        return (
            <Card className="p-6">
                <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2"><div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center text-white">Video Player</div></div>
                    <div className="lg:col-span-1 space-y-6">
                        <div><h2 className="text-xl font-bold mb-3">Course Content</h2><ul className="space-y-2">{course.modules.map((m, i) => <li key={i} className="flex items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-md">{m.title}</li>)}</ul></div>
                        <div><h2 className="text-xl font-bold mb-3">Downloads</h2><ul className="space-y-2">{course.downloads.map((d, i) => <li key={i}><a href={d.url} download className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200"><DownloadIcon type={d.type} /><span>{d.title}</span></a></li>)}</ul></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="grid md:grid-cols-2 overflow-hidden">
                <img src={course.imageUrl} alt={course.title} className="w-full h-64 md:h-full object-cover"/>
                <div className="p-8 flex flex-col">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">By {course.instructor}</p>
                    <div className="mt-2">{course.tags.map(tag => <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>)}</div>
                    <p className="mt-4 flex-grow">{course.description}</p>
                    <div className="mt-6 text-center">
                        {course.type === 'free' ? (
                            <button onClick={handlePaymentGateway} className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">Enroll for Free</button>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-indigo-500 mb-4">${course.price}</p>
                                <button onClick={handlePaymentGateway} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">Buy Now</button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CourseDetailPage;