import React from 'react';
import { ParticleBackground } from '../ui/particle-background';
import { ChatWindow } from '../Chat/ChatWindow';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { SparklesCore } from '../ui/sparkles';

export const Hero: React.FC = () => {
    const [hasStarted, setHasStarted] = React.useState(false);

    return (
        <section
            id="hero"
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{ minHeight: '100vh' }}
        >
            {/* Particle Background */}
            <ParticleBackground />

            {/* Content Overlay */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
                {/* Title Container */}
                <div
                    className={`text-center transition-all duration-1000 ease-in-out ${hasStarted ? 'opacity-0 scale-90 -translate-y-24 pointer-events-none h-0' : 'opacity-100 scale-100 translate-y-0 h-auto'} ${hasStarted ? '' : 'animate-fade-in-up'}`}
                >
                    <span
                        className="inline-block py-1 px-3 rounded-full text-xs font-mono tracking-widest uppercase mb-6"
                        style={{
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <MessageCircle size={12} className="inline mr-1.5 -mt-0.5" />
                        AI-Powered Portfolio
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Hi, I'm Jafet Duarte
                    </h1>

                    {/* Sparkles Effect */}
                    <div className="w-[20rem] sm:w-[30rem] md:w-[40rem] h-10 relative mx-auto -mt-6">
                        <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px] w-3/4 blur-sm" />
                        <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px w-3/4" />
                        <div className="absolute inset-x-32 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-[5px] w-1/4 blur-sm" />
                        <div className="absolute inset-x-32 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-px w-1/4" />
                        <SparklesCore
                            background="transparent"
                            minSize={0.4}
                            maxSize={1}
                            particleDensity={1200}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                        />
                        <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
                    </div>
                </div>

                {/* Chat Container */}
                <div
                    className={`w-full -mt-24 transition-all duration-1000 ease-in-out ${hasStarted ? 'max-w-4xl' : 'max-w-2xl'} ${hasStarted ? '' : 'animate-fade-in-up delay-200'}`}
                >
                    <ChatWindow
                        onInteraction={() => setHasStarted(true)}
                        className={`transition-all duration-1000 ${hasStarted ? '!h-[80vh]' : ''}`}
                    />
                </div>
            </div>

            {/* Scroll Indicator */}
            <a
                href="#experience"
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-pulse transition-opacity duration-500 ${hasStarted ? 'opacity-0' : 'opacity-100'}`}
                style={{ color: 'rgba(255,255,255,0.25)' }}
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <ChevronDown size={16} />
            </a>
        </section>
    );
};
