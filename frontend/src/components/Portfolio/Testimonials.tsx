import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ArrowLeft, ArrowRight, Sparkles, Send, MessageSquare, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TestimonialData {
    id: number;
    name: string;
    company: string;
    rating: number;
    message: string;
    createdAt: string;
}

// Generate a deterministic avatar color from a name
function getAvatarColor(name: string): string {
    const colors = [
        'from-indigo-500 to-purple-600',
        'from-rose-500 to-pink-600',
        'from-emerald-500 to-teal-600',
        'from-amber-500 to-orange-600',
        'from-cyan-500 to-blue-600',
        'from-violet-500 to-fuchsia-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export const Testimonials: React.FC = () => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({ name: '', company: '', rating: 5, message: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTestimonials();

        // Supabase Realtime subscription
        const channel = supabase
            .channel('testimonials-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Testimonial' },
                (payload) => {
                    console.log('Realtime INSERT received:', payload);
                    const raw = payload.new as any;
                    if (!raw || !raw.id) return;

                    // Normalize data
                    const newItem: TestimonialData = {
                        ...raw,
                        id: Number(raw.id), // Ensure ID is a number
                        createdAt: raw.createdAt || raw.created_at || new Date().toISOString()
                    };

                    setTestimonials((prev) => {
                        // Prevent duplicates (e.g., if we just added it via API too)
                        if (prev.some(t => t.id === newItem.id)) return prev;
                        return [newItem, ...prev];
                    });
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'Testimonial' },
                (payload) => {
                    console.log('Realtime DELETE:', payload);
                    const deletedId = (payload.old as any).id;
                    setTestimonials((prev) => prev.filter((t) => t.id !== deletedId));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/testimonials`);
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (err) {
            console.error('Failed to fetch testimonials:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.company || !formData.message) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/testimonial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', company: '', rating: 5, message: '' });
                fetchTestimonials();
                setTimeout(() => setSubmitted(false), 4000);
            }
        } catch (err) {
            console.error('Failed to submit:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const nextTestimonial = () => {
        if (testimonials.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        if (testimonials.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: dir > 0 ? 45 : -45,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: dir < 0 ? 45 : -45,
        }),
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.23, 0.86, 0.39, 0.96] as [number, number, number, number],
            },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const current = testimonials[currentIndex];

    // Derive tags from the message for the result badges
    const getResultTags = (t: TestimonialData): string[] => {
        const dateStr = new Date(t.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        return [`⭐ ${t.rating}/5`, t.company, dateStr];
    };

    return (
        <>
            {/* ═══════════════ SECTION 1: Testimonials Display ═══════════════ */}
            <section
                id="testimonials"
                className="relative text-white overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #000 0%, rgba(20, 10, 40, 0.95) 100%)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05), rgba(244,63,94,0.08))',
                            backgroundSize: '400% 400%',
                        }}
                        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute rounded-full blur-3xl"
                        style={{ top: '30%', left: '15%', width: '18rem', height: '18rem', background: 'rgba(129, 140, 248, 0.15)' }}
                        animate={{ x: [0, 150, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute rounded-full blur-3xl"
                        style={{ bottom: '30%', right: '15%', width: '20rem', height: '20rem', background: 'rgba(244, 63, 94, 0.12)' }}
                        animate={{ x: [0, -100, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{ left: `${15 + i * 10}%`, top: `${25 + i * 7}%` }}
                            animate={{ y: [0, -50, 0], opacity: [0.2, 1, 0.2], scale: [1, 2, 1] }}
                            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                        />
                    ))}
                </div>

                <motion.div
                    ref={containerRef}
                    className="relative z-10"
                    style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.5rem' }}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {/* Header */}
                    <motion.div className="text-center" style={{ marginBottom: '3rem' }} variants={fadeInUp}>
                        <motion.div
                            className="inline-flex items-center gap-3 rounded-full"
                            style={{
                                padding: '0.5rem 1rem',
                                marginBottom: '1.5rem',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(8px)',
                            }}
                            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                        >
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                <Sparkles className="h-4 w-4 text-indigo-300" />
                            </motion.div>
                            <span style={{ fontSize: '0.8rem' }} className="font-medium text-white/80">Opiniones del Portafolio</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </motion.div>

                        <motion.h2
                            className="font-bold tracking-tight" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}
                            variants={fadeInUp}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                ¿Qué opinan de{' '}
                            </span>
                            <motion.span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300"
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ backgroundSize: '200% 200%' }}
                            >
                                mi trabajo?
                            </motion.span>
                        </motion.h2>

                        <motion.p className="text-white/50" style={{ fontSize: '0.95rem' }} variants={fadeInUp}>
                            Dejá tu opinión o sugerencia sobre mi portafolio
                        </motion.p>
                    </motion.div>

                    {/* Main Testimonial Carousel */}
                    {testimonials.length > 0 && current && (
                        <div className="relative" style={{ maxWidth: '52rem', margin: '0 auto', marginBottom: '2.5rem' }}>
                            <div className="relative" style={{ height: '220px', perspective: '1000px' }}>
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: 'spring', stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.4 },
                                            scale: { duration: 0.4 },
                                            rotateY: { duration: 0.6 },
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <div
                                            className="relative h-full rounded-2xl overflow-hidden group"
                                            style={{
                                                padding: '2rem 2.5rem',
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            {/* Animated bg */}
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05), rgba(244,63,94,0.08))',
                                                    backgroundSize: '300% 300%',
                                                }}
                                                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                            />

                                            {/* Quote icon */}
                                            <motion.div
                                                className="absolute opacity-10"
                                                style={{ top: '1.5rem', right: '1.5rem' }}
                                                animate={{ rotate: [0, 10, 0] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            >
                                                <Quote className="w-10 h-10 text-white" />
                                            </motion.div>

                                            <div className="relative z-10 h-full flex flex-col md:flex-row items-center" style={{ gap: '2rem' }}>
                                                {/* User Info */}
                                                <div className="flex-shrink-0 text-center md:text-left" style={{ width: '130px' }}>
                                                    <div className="relative inline-block" style={{ marginBottom: '0.5rem' }}>
                                                        <div className="rounded-full overflow-hidden relative" style={{ width: '4rem', height: '4rem', border: '3px solid rgba(255,255,255,0.2)' }}>
                                                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarColor(current.name)}`}>
                                                                <span className="text-white font-bold" style={{ fontSize: '1rem' }}>
                                                                    {getInitials(current.name)}
                                                                </span>
                                                            </div>
                                                            <motion.div
                                                                className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-rose-400/20"
                                                                animate={{ opacity: [0, 0.3, 0] }}
                                                                transition={{ duration: 3, repeat: Infinity }}
                                                            />
                                                        </div>
                                                        <motion.div
                                                            className="absolute left-0 top-0 border-2 border-indigo-400/30 rounded-full pointer-events-none"
                                                            style={{ width: '4rem', height: '4rem' }}
                                                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        />
                                                    </div>

                                                    <h3 className="font-bold text-white" style={{ fontSize: '0.9rem', marginBottom: '0.125rem' }}>
                                                        {current.name}
                                                    </h3>
                                                    <p className="text-indigo-300 font-medium" style={{ fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                                                        {current.company}
                                                    </p>

                                                    <div className="flex justify-center md:justify-start gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
                                                                <Star
                                                                    className={`${i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                                                    style={{ width: '0.875rem', height: '0.875rem' }}
                                                                />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quote Content */}
                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <motion.blockquote
                                                        className="text-white/90 leading-relaxed font-light italic"
                                                        style={{ fontSize: '1rem', marginBottom: '1rem' }}
                                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                                                    >
                                                        &ldquo;{current.message}&rdquo;
                                                    </motion.blockquote>

                                                    <div className="flex flex-wrap gap-2">
                                                        {getResultTags(current).map((tag, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="rounded-lg"
                                                                style={{
                                                                    padding: '0.375rem 0.75rem',
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                                }}
                                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                                            >
                                                                <span style={{ fontSize: '0.75rem' }} className="text-white/70 font-medium">{tag}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-center items-center gap-4" style={{ marginTop: '1rem' }}>
                                <motion.button
                                    onClick={prevTestimonial}
                                    className="rounded-full text-white transition-all"
                                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </motion.button>

                                <div className="flex gap-2">
                                    {testimonials.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
                                            className={`rounded-full transition-all ${index === currentIndex ? 'bg-indigo-400 scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                                            style={{ width: '0.5rem', height: '0.5rem' }}
                                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    onClick={nextTestimonial}
                                    className="rounded-full text-white transition-all"
                                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {testimonials.length === 0 && (
                        <motion.div
                            className="text-center rounded-2xl"
                            style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                            variants={fadeInUp}
                        >
                            <MessageSquare size={36} className="mx-auto" style={{ marginBottom: '1rem', color: 'rgba(129, 140, 248, 0.5)' }} />
                            <p style={{ fontSize: '1rem' }} className="text-white/40">Sé el primero en dejar una opinión</p>
                        </motion.div>
                    )}

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4"
                        style={{ gap: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}
                        variants={staggerContainer}
                    >
                        {[
                            { number: `${testimonials.length}`, label: 'Opiniones' },
                            {
                                number: testimonials.length > 0
                                    ? `${(testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)}★`
                                    : '—',
                                label: 'Calificación Promedio',
                            },
                            { number: '5+', label: 'Años de Experiencia' },
                            { number: '100%', label: 'Compromiso' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    className="font-bold bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-transparent"
                                    style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-white/60 font-medium group-hover:text-white/80 transition-colors" style={{ fontSize: '0.7rem' }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                </motion.div>

                {/* Scroll down indicator */}
                <a
                    href="#feedback"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.375rem',
                        color: 'rgba(255,255,255,0.25)',
                        zIndex: 10,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                >
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Scroll</span>
                    <ChevronDown size={16} />
                </a>
            </section>

            {/* ═══════════════ SECTION 2: Feedback Form ═══════════════ */}
            <section
                id="feedback"
                className="relative text-white overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(20, 10, 40, 0.95) 0%, #000 100%)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {/* Subtle background effects */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute rounded-full blur-3xl"
                        style={{ top: '40%', right: '20%', width: '16rem', height: '16rem', background: 'rgba(168, 85, 247, 0.1)' }}
                        animate={{ x: [0, -80, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{ left: `${20 + i * 15}%`, top: `${30 + i * 8}%` }}
                            animate={{ y: [0, -40, 0], opacity: [0.1, 0.6, 0.1] }}
                            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                        />
                    ))}
                </div>

                <motion.div
                    className="relative z-10"
                    style={{ maxWidth: '42rem', margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={staggerContainer}
                >
                    {/* Form Header */}
                    <motion.div className="text-center" style={{ marginBottom: '2.5rem' }} variants={fadeInUp}>
                        <motion.h2
                            className="font-bold tracking-tight"
                            style={{ fontSize: '2rem', marginBottom: '0.5rem' }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                                ✍️ Dejá tu opinión
                            </span>
                        </motion.h2>
                        <p className="text-white/40" style={{ fontSize: '0.9rem' }}>
                            Tu feedback me ayuda a mejorar
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div variants={fadeInUp}>
                        <div
                            className="rounded-2xl"
                            style={{
                                padding: '2.5rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}
                        >
                            {submitted ? (
                                <div className="text-center" style={{ padding: '3rem 0' }}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                        <p className="text-white font-semibold" style={{ fontSize: '1.1rem' }}>¡Gracias por tu opinión!</p>
                                        <p className="text-white/50" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Tu feedback es muy valioso para mí</p>
                                    </motion.div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-wider text-white/40" style={{ marginBottom: '0.5rem' }}>
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Tu nombre"
                                                required
                                                className="w-full rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                                                style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-wider text-white/40" style={{ marginBottom: '0.5rem' }}>
                                                Empresa / Trabajo
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="Tu empresa"
                                                required
                                                className="w-full rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                                                style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wider text-white/40" style={{ marginBottom: '0.5rem' }}>
                                            Calificación
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        size={28}
                                                        className={`transition-colors ${star <= (hoverRating || formData.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-600'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wider text-white/40" style={{ marginBottom: '0.5rem' }}>
                                            Opinión / Sugerencia
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="¿Qué te pareció mi portafolio?"
                                            required
                                            maxLength={500}
                                            rows={4}
                                            className="w-full rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                            style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        />
                                        <p className="text-right text-xs text-white/25" style={{ marginTop: '0.25rem' }}>
                                            {formData.message.length}/500
                                        </p>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                                        style={{
                                            padding: '0.875rem',
                                            background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                                            color: '#fff',
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {submitting ? 'Enviando...' : 'Enviar opinión'}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
};
