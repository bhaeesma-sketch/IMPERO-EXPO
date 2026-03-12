import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Send, User, Bot, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export const AIStylistBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Welcome to Impero Di Gold. I am your private concierge. How may I assist you with your styling today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        setIsTyping(true);

        // Simulate AI Response based on luxury styling
        setTimeout(() => {
            let botResponse = "That's a sophisticated choice. For a truly timeless look, I recommend pairing that with our 22K handcrafted gold bangles.";

            const lowerInput = userMessage.toLowerCase();
            if (lowerInput.includes('wedding') || lowerInput.includes('marriage')) {
                botResponse = "For weddings, our Royal Bridal Collection in 22K gold is unmatched. Would you like to view our latest necklace sets?";
            } else if (lowerInput.includes('gift')) {
                botResponse = "A gift from Impero is a gift of legacy. Our 999.9 fine gold coins are highly recommended for meaningful gestures.";
            } else if (lowerInput.includes('invest') || lowerInput.includes('rate')) {
                botResponse = "Gold is the ultimate store of value. You can view our live market rates and investment bars in the Bullion section.";
            }

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-8 right-8 z-[100]"
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] shadow-2xl hover:scale-110 transition-transform p-0"
                >
                    {isOpen ? <X className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
                        className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-[#BF953F]/20 overflow-hidden z-[100] flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#BF953F] to-[#AA771C] p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <Crown className="w-8 h-8 mx-auto mb-2 text-[#FCF6BA]" />
                            <h3 className="font-serif text-xl font-medium">Impero Concierge</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Private Styling Assistant</p>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-6 space-y-4 overflow-y-auto" ref={scrollRef}>
                            <div className="space-y-6 pb-4">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-100' : 'bg-[#BF953F]/10'}`}>
                                                {m.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-[#BF953F]" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                                    ? 'bg-gray-900 text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                                                }`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="bg-gray-100 px-4 py-2 rounded-full flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask a styling question..."
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#BF953F]/50 transition-all dark:text-white"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-2 w-10 h-10 rounded-full bg-black hover:bg-gray-800 p-0 text-white"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
