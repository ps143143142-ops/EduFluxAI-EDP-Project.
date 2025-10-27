import React, { useState, useEffect, useMemo } from 'react';
import { Course, User } from '../../types';
import Card from '../ui/Card';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

const CourseCard: React.FC<{ course: Course; isEnrolled: boolean; onClick: () => void; }> = ({ course, isEnrolled, onClick }) => (
    <Card className="flex flex-col cursor-pointer" onClick={onClick}>
        <img className="h-48 w-full object-cover" src={course.imageUrl} alt={course.title} />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 flex-grow text-sm">{course.description}</p>
            <div className="flex justify-between items-center mt-6">
                 {course.type === 'free' ? <p className="text-2xl font-bold text-green-500">Free</p> : <p className="text-2xl font-bold text-indigo-500">${course.price}</p>}
                <button disabled={isEnrolled} onClick={(e) => { e.stopPropagation(); onClick(); }} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                    {isEnrolled ? 'View Course' : 'View Details'}
                </button>
            </div>
        </div>
    </Card>
);

interface CoursesPageProps {
  currentUser: User;
  navigateToCourse: (courseId: string) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ currentUser, navigateToCourse }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState<string[]>([]);
    const [filters, setFilters] = useState({ searchTerm: '', tag: '', price: 'all' });

    useEffect(() => {
        api.getCourseTags().then(setTags);
    }, []);
    
    useEffect(() => {
        setIsLoading(true);
        api.getCourses(filters).then(data => {
            setCourses(data);
            setIsLoading(false);
        });
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">{currentUser.role === 'admin' ? 'Manage Courses' : 'Explore Courses'}</h1>
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="searchTerm" placeholder="Search courses..." value={filters.searchTerm} onChange={handleFilterChange} className="p-2 bg-white dark:bg-slate-700 border rounded-md"/>
            <select name="tag" value={filters.tag} onChange={handleFilterChange} className="p-2 bg-white dark:bg-slate-700 border rounded-md">
                <option value="">All Categories</option>
                {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
             <select name="price" value={filters.price} onChange={handleFilterChange} className="p-2 bg-white dark:bg-slate-700 border rounded-md">
                <option value="all">All Prices</option>
                <option value="paid">Paid</option>
                <option value="free">Free</option>
            </select>
        </div>
      </Card>
      {isLoading ? <div className="text-center py-10"><Spinner /></div> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? courses.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => navigateToCourse(course.id)} isEnrolled={currentUser.enrolledCourses.includes(course.id)}/>
            )) : <p className="col-span-full text-center py-10">No courses match your criteria.</p>}
          </div>
      )}
    </div>
  );
};

export default CoursesPage;