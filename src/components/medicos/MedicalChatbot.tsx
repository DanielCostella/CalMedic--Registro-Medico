import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageCircle,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2,
    X,
    Stethoscope,
    Heart,
    Pill,
    Activity,
    RefreshCw
} from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface MedicalChatbotProps {
    isMinimized: boolean;
    onToggleMinimize: () => void;
    onClose: () => void;
}

const MedicalChatbot: React.FC<MedicalChatbotProps> = ({ isMinimized, onToggleMinimize, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your virtual medical assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const userMessage: Message = {
                id: Date.now().toString(),
                text: inputMessage,
                sender: 'user',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            setInputMessage('');
            setIsTyping(true);

            // Simulate bot response
            setTimeout(() => {
                const botResponse = generateBotResponse(inputMessage);
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: botResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }, 1500);
        }
    };

    const generateBotResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('pain') || input.includes('hurts')) {
            return "🩺 I understand you're feeling pain. Could you describe where it is and rate its intensity from 1 to 10? It's important to consult with a doctor for a proper evaluation.";
        }

        if (input.includes('fever') || input.includes('temperature')) {
            return "🌡️ Fever can be a sign of infection. If your temperature is above 38°C (100.4°F), it's advisable to consult a doctor. Stay hydrated and rest.";
        }

        if (input.includes('medication') || input.includes('medicine') || input.includes('pill')) {
            return "💊 For information about medication, always consult your doctor or pharmacist. I cannot recommend specific drugs, but I can provide general health information.";
        }

        if (input.includes('appointment') || input.includes('schedule') || input.includes('book')) {
            return "📅 To schedule a medical appointment, you can contact the hospital reception directly or use our online appointment system.";
        }

        if (input.includes('emergency') || input.includes('urgent')) {
            return "🚨 If you're having a medical emergency, call 911 immediately or go to the nearest hospital. Do not use this chat for emergencies.";
        }

        if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
            return "👋 Hello! I'm glad to help. I'm your virtual medical assistant. You can ask me about symptoms, general health information, or how to book appointments.";
        }

        return "🤖 Thank you for your inquiry. Please remember I'm a virtual assistant and do not replace professional medical advice. Is there anything else I can help you with?";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: '1',
                text: "Hello! I'm your virtual medical assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <Card className={`w-80 sm:w-96 bg-white shadow-2xl border-2 border-blue-200 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'
            }`}>
            <CardHeader className="flex flex-row items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">Dr. Bot</CardTitle>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-xs opacity-90">Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearChat}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        title="Clear Chat"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleMinimize}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-[calc(500px-64px)]">
                    <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-green-600 text-white'
                                            }`}>
                                            {message.sender === 'user' ? (
                                                <User className="w-3 h-3" />
                                            ) : (
                                                <Stethoscope className="w-3 h-3" />
                                            )}
                                        </div>

                                        <div className={`p-3 rounded-lg text-sm ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                            }`}>
                                            <p className="whitespace-pre-wrap">{message.text}</p>
                                            <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Stethoscope className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 rounded-bl-none shadow-sm">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-3 bg-white border-t border-gray-200">
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your medical query..."
                                className="flex-1 text-sm"
                                disabled={isTyping}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            <Badge
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={() => setInputMessage('How to schedule an appointment?')}
                            >
                                <Activity className="w-3 h-3 mr-1" />
                                Appointments
                            </Badge>
                            <Badge
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-green-50 transition-colors"
                                onClick={() => setInputMessage('Information about medications')}
                            >
                                <Pill className="w-3 h-3 mr-1" />
                                Medications
                            </Badge>
                            <Badge
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-red-50 transition-colors"
                                onClick={() => setInputMessage('I have an emergency')}
                            >
                                <Heart className="w-3 h-3 mr-1" />
                                Emergencies
                            </Badge>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-2">
                            ⚠️ General information only. Not a replacement for professional medical advice.
                        </p>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

export default MedicalChatbot;
