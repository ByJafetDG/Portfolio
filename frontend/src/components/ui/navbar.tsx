import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Chat', href: '#hero' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
    { label: 'Testimonials', href: '#testimonials' },
];

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const shapeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Track active section via scroll position
    useEffect(() => {
        const sectionIds = navLinks.map(l => l.href.replace('#', ''));

        const handleScroll = () => {
            const offset = window.innerHeight * 0.35;
            let currentIndex = 0;

            for (let i = 0; i < sectionIds.length; i++) {
                const el = document.getElementById(sectionIds[i]);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= offset) {
                    currentIndex = i;
                }
            }

            setActiveIndex(currentIndex);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Update the sliding indicator position
    const updateIndicator = useCallback(() => {
        const link = linkRefs.current[activeIndex];
        const nav = navRef.current;
        if (!link || !nav) return;

        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        setIndicatorStyle({
            width: `${linkRect.width + 20}px`,
            height: `${linkRect.height + 10}px`,
            transform: `translateX(${linkRect.left - navRect.left - 10}px)`,
            opacity: 1,
        });
    }, [activeIndex]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    // Header shape animation on mobile toggle
    useEffect(() => {
        if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
        if (isOpen) {
            setHeaderShapeClass('rounded-xl');
        } else {
            shapeTimeoutRef.current = setTimeout(() => setHeaderShapeClass('rounded-full'), 300);
        }
        return () => {
            if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
        };
    }, [isOpen]);

    const handleNavClick = (e: React.MouseEvent, index: number, href: string) => {
        e.preventDefault();
        setActiveIndex(index);
        setIsOpen(false);
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <header
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-30
        flex flex-col items-center px-6 py-3
        backdrop-blur-md border bg-opacity-50
        w-[calc(100%-2rem)] sm:w-auto
        transition-[border-radius] duration-200 ease-in-out
        ${headerShapeClass}`}
            style={{
                borderColor: 'rgba(255,255,255,0.12)',
                background: 'rgba(15, 15, 20, 0.6)',
            }}
        >
            <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
                {/* Logo */}
                <a href="#hero" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, 0, '#hero')}>
                    <img
                        src="/near-avatar.png"
                        alt="Near"
                        className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-white font-medium tracking-wide text-sm hidden sm:inline">
                        Jafet Duarte
                    </span>
                </a>

                {/* Desktop Nav — with liquid glass indicator */}
                <nav ref={navRef} className="hidden sm:flex items-center relative" style={{ gap: '24px' }}>
                    {/* Liquid Glass Indicator */}
                    <div
                        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none"
                        style={{
                            ...indicatorStyle,
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            borderRadius: '999px',
                            background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(110, 163, 247, 0.08))',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: `
                                0 0 20px rgba(66, 133, 244, 0.15),
                                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                            `,
                        }}
                    />

                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            ref={(el) => { linkRefs.current[i] = el; }}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, i, link.href)}
                            className="relative z-10 text-sm transition-colors duration-300"
                            style={{
                                color: activeIndex === i ? '#ffffff' : '#9ca3af',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>



                {/* Mobile Toggle */}
                <button
                    className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
          ${isOpen ? 'max-h-[500px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}
            >
                <nav className="flex flex-col items-center space-y-1 w-full">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="relative w-full text-center text-sm py-2 rounded-xl transition-all duration-300"
                            style={{
                                color: activeIndex === i ? '#ffffff' : '#9ca3af',
                                background: activeIndex === i
                                    ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(110, 163, 247, 0.08))'
                                    : 'transparent',
                                border: activeIndex === i ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                            }}
                            onClick={(e) => handleNavClick(e, i, link.href)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

            </div>
        </header>
    );
};
