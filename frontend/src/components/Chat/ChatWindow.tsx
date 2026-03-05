import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';
import { ChatInput } from './ChatInput';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: "👋 Hi! I'm Near, Jafet's analytical AI assistant. Ask me anything about his skills, projects, or even why I'm named this way — I'm here to help!",
};

interface ChatWindowProps {
    onInteraction?: () => void;
    className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onInteraction, className }) => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastAssistantId, setLastAssistantId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (text: string) => {
        if (messages.length === 1 && onInteraction) {
            onInteraction();
        }
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const controller = new AbortController();
            abortControllerRef.current = controller;
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                signal: controller.signal,
            });

            if (!res.ok) throw new Error('API error');

            const data = await res.json();
            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || "Sorry, I couldn't process that. Please try again.",
            };
            setLastAssistantId(assistantMsg.id);
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err: any) {
            if (err?.name === 'AbortError') {
                // User stopped generation — add a note
                const stoppedMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: '⏹️ Generation stopped.',
                };
                setLastAssistantId(stoppedMsg.id);
                setMessages(prev => [...prev, stoppedMsg]);
            } else {
                const errorMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "⚠️ I'm having trouble connecting right now. Please try again in a moment, or contact Jafet directly at jafetduarte01@gmail.com.",
                };
                setLastAssistantId(errorMsg.id);
                setMessages(prev => [...prev, errorMsg]);
            }
        } finally {
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    };

    const quickQuestions = [
        "What are Jafet's skills?",
        "Tell me about his experience",
        "What did he study?",
        "Is he available for work?",
    ];

    return (
        <div
            className={`w-full mx-auto rounded-3xl overflow-hidden flex flex-col glass ${className || ''}`}
            style={{
                height: 'min(520px, 60vh)',
                animation: 'pulse-glow 4s ease-in-out infinite',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
                <img
                    src="/near-avatar.png"
                    alt="Near"
                    className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                    <h3 className="text-white text-sm font-semibold">Near</h3>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Analytical Assistant · Powered by Jafet's Data
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Online</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 20px' }}>
                {messages.map(msg => (
                    <Message key={msg.id} role={msg.role} content={msg.content} isNew={msg.id === lastAssistantId} />
                ))}
                {isLoading && (
                    <Message role="assistant" content="" isTyping />
                )}

                {/* Quick Questions (only show at start) */}
                {messages.length === 1 && !isLoading && (
                    <div className="flex flex-wrap gap-2 mt-2 animate-fade-in delay-300">
                        {quickQuestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => handleSend(q)}
                                className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 hover:scale-105"
                                style={{
                                    background: 'rgba(66, 133, 244, 0.1)',
                                    border: '1px solid rgba(66, 133, 244, 0.25)',
                                    color: 'rgba(66, 133, 244, 0.9)',
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <ChatInput onSend={handleSend} disabled={isLoading} isLoading={isLoading} onStop={() => abortControllerRef.current?.abort()} />
            </div>
        </div>
    );
};
