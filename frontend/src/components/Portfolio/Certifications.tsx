import React, { useEffect, useState } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { ShapeBackground } from '@/components/ui/shape-background';

interface Education {
    id: number;
    degree: string;
    school: string;
    period: string;
}

interface Certification {
    id: number;
    name: string;
    issuer: string;
    year: string;
}

export const Certifications: React.FC = () => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const [education, setEducation] = useState<Education[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/data`)
            .then(res => res.json())
            .then(data => {
                if (data.education) setEducation(data.education);
                if (data.certifications) setCertifications(data.certifications);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch certifications data:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
            <ShapeBackground />
            <section id="certifications" className="relative z-10">
                <div className="section-container">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span
                            className="inline-block py-1 px-3 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
                            style={{
                                border: '1px solid rgba(251, 188, 4, 0.25)',
                                background: 'rgba(251, 188, 4, 0.08)',
                                color: 'rgba(251, 188, 4, 0.8)',
                            }}
                        >
                            Credentials
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Education & Certifications
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Education */}
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-6">
                                <GraduationCap size={20} style={{ color: '#4285F4' }} />
                                <h3 className="text-xl font-semibold text-white">Education</h3>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu, i) => (
                                    <div
                                        key={edu.id || i}
                                        className="rounded-xl p-4 glass"
                                    >
                                        <h4 className="text-sm font-medium text-white">{edu.degree}</h4>
                                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {edu.school}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(66, 133, 244, 0.6)' }}>
                                            {edu.period}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="animate-fade-in-up delay-200">
                            <div className="flex items-center gap-2 mb-6">
                                <Award size={20} style={{ color: '#FBBC04' }} />
                                <h3 className="text-xl font-semibold text-white">Certifications</h3>
                            </div>
                            <div className="space-y-4">
                                {certifications.map((cert, i) => (
                                    <div
                                        key={cert.id || i}
                                        className="rounded-xl p-4 glass"
                                    >
                                        <h4 className="text-sm font-medium text-white">{cert.name}</h4>
                                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {cert.issuer} · {cert.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
