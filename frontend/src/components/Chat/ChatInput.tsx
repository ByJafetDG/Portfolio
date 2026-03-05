import React, { useState, useEffect, useRef } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    onStop?: () => void;
}

const basePlaceholder = "Ask me about Jafet's ";
const suggestions = [
    "skills",
    "work experience",
    "education",
    "certifications",
    "projects",
    "contact info",
    "tech stack",
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, isLoading, onStop }) => {
    const [value, setValue] = useState('');
    const [animatedPlaceholder, setAnimatedPlaceholder] = useState(basePlaceholder);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingState = useRef({
        suggestionIndex: 0,
        charIndex: 0,
        deleting: false,
        running: true,
    });
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
        typingState.current.running = true;
        const typeSpeed = 70;
        const deleteSpeed = 40;
        const pauseAtEnd = 1200;
        const pauseBetween = 500;

        function schedule(fn: () => void, delay: number) {
            const id = window.setTimeout(fn, delay);
            timersRef.current.push(id);
        }

        function clearTimers() {
            for (const id of timersRef.current) window.clearTimeout(id);
            timersRef.current = [];
        }

        function step() {
            if (!typingState.current.running) return;
            if (value !== '') {
                setAnimatedPlaceholder(basePlaceholder);
                schedule(step, 300);
                return;
            }

            const state = typingState.current;
            const current = suggestions[state.suggestionIndex % suggestions.length] || '';

            if (!state.deleting) {
                const nextIndex = state.charIndex + 1;
                setAnimatedPlaceholder(basePlaceholder + current.slice(0, nextIndex));
                state.charIndex = nextIndex;
                if (nextIndex >= current.length) {
                    schedule(() => { state.deleting = true; step(); }, pauseAtEnd);
                } else {
                    schedule(step, typeSpeed);
                }
            } else {
                const nextIndex = Math.max(0, state.charIndex - 1);
                setAnimatedPlaceholder(basePlaceholder + current.slice(0, nextIndex));
                state.charIndex = nextIndex;
                if (nextIndex <= 0) {
                    state.deleting = false;
                    state.suggestionIndex = (state.suggestionIndex + 1) % suggestions.length;
                    schedule(step, pauseBetween);
                } else {
                    schedule(step, deleteSpeed);
                }
            }
        }

        clearTimers();
        schedule(step, 400);
        return () => {
            typingState.current.running = false;
            clearTimers();
        };
    }, [value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onSend(value.trim());
            setValue('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        // Auto-resize
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div
                className="relative rounded-2xl p-[1px] shadow-lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.3), rgba(255,255,255,0.05), rgba(0,0,0,0.2))',
                }}
            >
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={animatedPlaceholder}
                        rows={1}
                        disabled={disabled}
                        className="w-full resize-none rounded-2xl border-0 outline-none px-6 py-3.5 pr-14 text-sm text-white"
                        style={{
                            background: 'rgba(15, 15, 20, 0.7)',
                            backdropFilter: 'blur(20px)',
                            minHeight: '52px',
                            maxHeight: '150px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            paddingLeft: '12px',
                            paddingTop: '12px',
                        }}
                    />
                    {isLoading ? (
                        <button
                            type="button"
                            onClick={onStop}
                            aria-label="Stop generation"
                            className="absolute right-2 bottom-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #EA4335, #ff6b5b)',
                            }}
                        >
                            <Square size={14} fill="white" className="text-white" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={disabled || !value.trim()}
                            aria-label="Send message"
                            className="absolute right-2 bottom-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                            style={{
                                background: value.trim()
                                    ? 'linear-gradient(135deg, #4285F4, #6ea3f7)'
                                    : 'rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <Send size={16} className="text-white" />
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};
