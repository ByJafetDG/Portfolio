import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, ExternalLink } from 'lucide-react';
import { ShapeBackground } from '@/components/ui/shape-background';

interface Profile {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
}

export const Contact: React.FC = () => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/data`)
            .then(res => res.json())
            .then(data => {
                if (data.profile) setProfile(data.profile);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch contact data:', err);
                setLoading(false);
            });
    }, []);

    if (loading || !profile) return null;

    const contactInfo = [
        { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
        { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
        { icon: MapPin, label: profile.location, href: null },
        { icon: Linkedin, label: profile.linkedin, href: `https://${profile.linkedin}` },
    ];

    return (
        <div className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ShapeBackground />
            <section id="contact" className="relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="section-container" style={{ width: '100%' }}>

                    {/* Contact */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <span
                            className="inline-block py-1 px-3 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
                            style={{
                                border: '1px solid rgba(66, 133, 244, 0.25)',
                                background: 'rgba(66, 133, 244, 0.08)',
                                color: 'rgba(66, 133, 244, 0.8)',
                            }}
                        >
                            Get in Touch
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Let's Work Together
                        </h2>
                        <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            I'm currently available for freelance and full-time opportunities. Let's connect!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto animate-fade-in-up delay-200">
                        {contactInfo.map((info, i) => {
                            const Icon = info.icon;
                            const content = (
                                <div
                                    className="rounded-xl p-4 glass flex items-center gap-3 transition-all duration-200 hover:border-blue-500/30"
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(66, 133, 244, 0.1)' }}
                                    >
                                        <Icon size={16} style={{ color: '#4285F4' }} />
                                    </div>
                                    <span className="text-sm text-white truncate">{info.label}</span>
                                    {info.href && (
                                        <ExternalLink size={12} className="ml-auto flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                                    )}
                                </div>
                            );

                            return info.href ? (
                                <a key={i} href={info.href} target="_blank" rel="noopener noreferrer">
                                    {content}
                                </a>
                            ) : (
                                <div key={i}>{content}</div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-20 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            © {new Date().getFullYear()} Jafet Duarte. Built with React, TypeScript & AI.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
