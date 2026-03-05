import React, { useState, useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

interface MessageProps {
    role: 'user' | 'assistant';
    content: string;
    isTyping?: boolean;
    isNew?: boolean;
}

function useTypewriter(text: string, enabled: boolean, speed = 12) {
    const [displayed, setDisplayed] = useState(enabled ? '' : text);
    const [done, setDone] = useState(!enabled);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!enabled) {
            setDisplayed(text);
            setDone(true);
            return;
        }

        setDisplayed('');
        indexRef.current = 0;
        setDone(false);

        const interval = setInterval(() => {
            indexRef.current += 1;
            const next = text.slice(0, indexRef.current);
            setDisplayed(next);
            if (indexRef.current >= text.length) {
                clearInterval(interval);
                setDone(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, enabled, speed]);

    return { displayed, done };
}

export const Message: React.FC<MessageProps> = ({ role, content, isTyping, isNew }) => {
    const isAssistant = role === 'assistant';
    const { displayed, done } = useTypewriter(content, !!(isAssistant && isNew && content));

    return (
        <div
            className={`flex gap-3 animate-fade-in ${isAssistant ? '' : 'flex-row-reverse'}`}
            style={{ maxWidth: '100%' }}
        >
            {/* Avatar */}
            {isAssistant ? (
                <img
                    src="/near-avatar.png"
                    alt="Near"
                    className="flex-shrink-0 w-8 h-8 rounded-full object-cover"
                />
            ) : (
                <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #333, #555)',
                    }}
                >
                    <User size={16} className="text-white" />
                </div>
            )}

            {/* Bubble */}
            <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                    maxWidth: '80%',
                    background: isAssistant
                        ? 'rgba(66, 133, 244, 0.1)'
                        : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isAssistant ? 'rgba(66, 133, 244, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isAssistant ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.85)',
                }}
            >
                {isTyping ? (
                    <div className="flex items-center justify-center gap-1.5" style={{ minHeight: '24px', padding: '4px 8px' }}>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                    </div>
                ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {isAssistant ? displayed : content}
                        {isAssistant && !done && (
                            <span
                                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                                style={{
                                    background: '#4285F4',
                                    animation: 'blink 0.8s infinite',
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
