
import React from 'react';
import { Briefcase, MapPin, DollarSign, Building, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const JOBS = [
    { id: 1, role: 'Senior Frontend Engineer', company: 'Nexus Corp', location: 'Remote', salary: '120k - 160k NEX', type: 'Full-time', logo: 'https://picsum.photos/seed/job1/100' },
    { id: 2, role: 'Product Designer', company: 'PixelStudio', location: 'Tokyo, JP', salary: '90k - 120k NEX', type: 'Contract', logo: 'https://picsum.photos/seed/job2/100' },
    { id: 3, role: 'Smart Contract Auditor', company: 'SafeChain', location: 'Remote', salary: '200k NEX', type: 'Full-time', logo: 'https://picsum.photos/seed/job3/100' },
    { id: 4, role: 'Community Manager', company: 'DAO Central', location: 'New York, US', salary: '70k - 90k NEX', type: 'Full-time', logo: 'https://picsum.photos/seed/job4/100' },
];

const JobsView: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-enter pb-24">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
                    <Briefcase size={32} className="text-blue-400" />
                    {t('jobs.title')}
                </h2>
                <p className="text-gray-400 text-xs">{t('jobs.subtitle')}</p>
            </div>

            <div className="space-y-4">
                {JOBS.map(job => (
                    <div key={job.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer">
                        <div className="flex items-start gap-4">
                            <img src={job.logo} className="w-14 h-14 rounded-xl bg-gray-800 object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.role}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                    <Building size={14} /> {job.company}
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs font-medium">
                                    <span className="flex items-center gap-1 text-gray-500 bg-white/5 px-2 py-1 rounded"><MapPin size={12}/> {job.location}</span>
                                    <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded"><DollarSign size={12}/> {job.salary}</span>
                                    <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded"><Globe size={12}/> {job.type}</span>
                                </div>
                            </div>
                            <button className="hidden md:block px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                {t('jobs.apply')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobsView;
