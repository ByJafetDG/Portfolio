import React, { useEffect, useState } from 'react';
import { Code, Server, Database, Cloud, Wrench, Shield, LucideIcon } from 'lucide-react';
import { ShapeBackground } from '@/components/ui/shape-background';

interface Skill {
    id: number;
    category: string;
    items: string[];
}

const CATEGORY_MAP: Record<string, { icon: LucideIcon, gradient: string, borderColor: string, iconColor: string }> = {
    'Front-End': {
        icon: Code,
        gradient: 'linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(66, 133, 244, 0.05))',
        borderColor: 'rgba(66, 133, 244, 0.25)',
        iconColor: '#4285F4',
    },
    'Back-End': {
        icon: Server,
        gradient: 'linear-gradient(135deg, rgba(52, 168, 83, 0.15), rgba(52, 168, 83, 0.05))',
        borderColor: 'rgba(52, 168, 83, 0.25)',
        iconColor: '#34A853',
    },
    'Databases': {
        icon: Database,
        gradient: 'linear-gradient(135deg, rgba(251, 188, 4, 0.15), rgba(251, 188, 4, 0.05))',
        borderColor: 'rgba(251, 188, 4, 0.25)',
        iconColor: '#FBBC04',
    },
    'DevOps & Tools': {
        icon: Wrench,
        gradient: 'linear-gradient(135deg, rgba(234, 67, 53, 0.15), rgba(234, 67, 53, 0.05))',
        borderColor: 'rgba(234, 67, 53, 0.25)',
        iconColor: '#EA4335',
    },
    'Cloud': {
        icon: Cloud,
        gradient: 'linear-gradient(135deg, rgba(156, 85, 245, 0.15), rgba(156, 85, 245, 0.05))',
        borderColor: 'rgba(156, 85, 245, 0.25)',
        iconColor: '#9C55F5',
    },
};

const DEFAULT_STYLE = {
    icon: Shield,
    gradient: 'linear-gradient(135deg, rgba(255, 136, 0, 0.15), rgba(255, 136, 0, 0.05))',
    borderColor: 'rgba(255, 136, 0, 0.25)',
    iconColor: '#FF8800',
};

export const Skills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/data')
            .then(res => res.json())
            .then(data => {
                if (data.skills) {
                    // Group skills by category to avoid duplicate cards
                    const grouped = new Map<string, Skill>();
                    data.skills.forEach((s: Skill) => {
                        const existing = grouped.get(s.category);
                        if (existing) {
                            // Merge items, avoiding duplicates
                            const allItems = new Set([...existing.items, ...s.items]);
                            existing.items = Array.from(allItems);
                        } else {
                            grouped.set(s.category, { ...s, items: [...s.items] });
                        }
                    });
                    setSkills(Array.from(grouped.values()));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch skills:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
            <ShapeBackground />
            <section id="skills" className="relative z-10">
                <div className="section-container">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span
                            className="inline-block py-1 px-3 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
                            style={{
                                border: '1px solid rgba(66, 133, 244, 0.25)',
                                background: 'rgba(66, 133, 244, 0.08)',
                                color: 'rgba(66, 133, 244, 0.8)',
                            }}
                        >
                            Tech Stack
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Skills & Technologies
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {skills.map((cat, index) => {
                            const style = CATEGORY_MAP[cat.category] || DEFAULT_STYLE;
                            const Icon = style.icon;
                            return (
                                <div
                                    key={cat.id || index}
                                    className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
                                    style={{
                                        background: style.gradient,
                                        border: `1px solid ${style.borderColor}`,
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.3)' }}
                                        >
                                            <Icon size={16} style={{ color: style.iconColor }} />
                                        </div>
                                        <h3 className="text-sm font-semibold text-white">{cat.category}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.items.map((item) => (
                                            <span
                                                key={item}
                                                className="px-2.5 py-1 rounded-full text-xs"
                                                style={{
                                                    background: 'rgba(0, 0, 0, 0.3)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                }}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};
