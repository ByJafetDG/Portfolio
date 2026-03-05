import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { ShapeBackground } from '@/components/ui/shape-background';

interface ExperienceItem {
    id: number;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
}

export const Experience: React.FC = () => {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/data')
            .then(res => res.json())
            .then(data => {
                if (data.experiences) {
                    setExperiences(data.experiences);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch experience:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
            <ShapeBackground />
            <section id="experience" className="section-container relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span
                        className="inline-block py-1 px-3 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
                        style={{
                            border: '1px solid rgba(66, 133, 244, 0.25)',
                            background: 'rgba(66, 133, 244, 0.08)',
                            color: 'rgba(66, 133, 244, 0.8)',
                        }}
                    >
                        Career
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Work Experience
                    </h2>
                </div>

                <div className="relative">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {experiences.map((exp, index) => (
                            <div
                                key={exp.id || index}
                                className="relative animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div
                                    className="rounded-2xl p-6 glass transition-all duration-300 hover:border-blue-500/30"
                                    style={{ borderLeft: '3px solid rgba(66, 133, 244, 0.5)' }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Briefcase size={14} style={{ color: 'rgba(66, 133, 244, 0.7)' }} />
                                                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-1">
                                            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                <Calendar size={12} />
                                                {exp.startDate} – {exp.endDate}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                <MapPin size={12} />
                                                {exp.location}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {exp.description.map((desc, i) => (
                                            <li key={i} className="flex gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                                <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-blue-400" />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
