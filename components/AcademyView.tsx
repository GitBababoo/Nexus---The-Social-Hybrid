
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { GraduationCap, Award } from 'lucide-react';
import { db } from '../services/db';
import { soundEngine } from '../services/soundService';
import { useTranslation } from 'react-i18next';

interface AcademyViewProps { searchTerm?: string; }

const AcademyView: React.FC<AcademyViewProps> = ({ searchTerm = '' }) => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<Course[]>([]);
    
    useEffect(() => { 
        setCourses(db.getCourses());
        const interval = setInterval(() => setCourses(db.getCourses()), 2000);
        return () => clearInterval(interval);
    }, []);

    const handleEnroll = (id: string) => {
        soundEngine.playSuccess();
        setCourses(db.enrollCourse(id));
    };

    const filtered = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8"><h2 className="text-2xl font-bold text-white flex gap-3"><GraduationCap size={32} className="text-blue-400"/> {t('academy.title')}</h2></div>
            
            {filtered.some(c => c.isEnrolled) && (
                <>
                    <h3 className="text-lg font-bold text-white mb-4">{t('academy.myLearning')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{filtered.filter(c => c.isEnrolled).map(course => (
                        <div key={course.id} className="glass-panel p-4 rounded-2xl border border-white/5 flex gap-4 items-center"><div className="w-20 h-20 rounded-xl overflow-hidden shrink-0"><img src={course.image} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><h4 className="font-bold text-white text-sm truncate">{course.title}</h4><p className="text-xs text-gray-500 mb-2">{course.progress}%</p><div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2"><div className="h-full bg-blue-500" style={{ width: `${course.progress}%` }}></div></div>{course.progress === 100 ? <span className="text-xs font-bold text-green-400 flex gap-1"><Award size={12}/> {t('academy.certified')}</span> : <button className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded hover:bg-white/20">{t('academy.continue')}</button>}</div></div>
                    ))}</div>
                </>
            )}

            <h3 className="text-lg font-bold text-white mb-4">{t('academy.catalog')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.filter(c => !c.isEnrolled).map(course => (
                <div key={course.id} className="glass-panel rounded-2xl overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-all"><div className="h-40 relative"><img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div><div className="p-5"><h4 className="font-bold text-white mb-1">{course.title}</h4><p className="text-xs text-gray-500 mb-3">{course.totalLessons} {t('academy.lessons')} • {course.category}</p><button onClick={() => handleEnroll(course.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs mt-2">{t('academy.enroll')}</button></div></div>
            ))}</div>
        </div>
    );
};
export default AcademyView;
