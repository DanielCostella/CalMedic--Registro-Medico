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

interface ChatbotMedicoProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ChatbotMedico: React.FC<ChatbotMedicoProps> = ({ isOpen, onToggle, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente médico virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
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

      // Simular respuesta del bot
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
    
    if (input.includes('dolor') || input.includes('duele')) {
      return '🩺 Entiendo que tienes dolor. ¿Podrías describir dónde sientes el dolor y qué intensidad tiene del 1 al 10? Es importante que consultes con un médico para una evaluación adecuada.';
    }
    
    if (input.includes('fiebre') || input.includes('temperatura')) {
      return '🌡️ La fiebre puede ser síntoma de infección. Si tienes más de 38°C, es recomendable que consultes con un médico. Mantente hidratado y descansa.';
    }
    
    if (input.includes('medicamento') || input.includes('medicina')) {
      return '💊 Para información sobre medicamentos, siempre consulta con tu médico o farmacéutico. No puedo recomendar medicamentos específicos, pero puedo ayudarte con información general.';
    }
    
    if (input.includes('cita') || input.includes('turno')) {
      return '📅 Para programar una cita médica, puedes contactar directamente con la recepción del hospital o usar nuestro sistema de citas online.';
    }
    
    if (input.includes('emergencia') || input.includes('urgencia')) {
      return '🚨 Si tienes una emergencia médica, llama inmediatamente al 911 o dirígete al hospital más cercano. No uses este chat para emergencias.';
    }

    if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas tardes')) {
      return '👋 ¡Hola! Me alegra poder ayudarte. Soy tu asistente médico virtual. Puedes preguntarme sobre síntomas, medicamentos, o cómo programar citas médicas.';
    }
    
    return '🤖 Gracias por tu consulta. Recuerda que soy un asistente virtual y no reemplazo la consulta médica profesional. ¿Hay algo más en lo que pueda ayudarte?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: '¡Hola! Soy tu asistente médico virtual. ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 sm:w-96 bg-white shadow-2xl border-2 border-blue-200 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
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
                <p className="text-xs opacity-90">En línea</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              title="Limpiar chat"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              title={isMinimized ? "Expandir" : "Minimizar"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              title="Cerrar"
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
                    <div className={`flex items-start gap-2 max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Stethoscope className="w-3 h-3" />
                        )}
                      </div>
                      
                      <div className={`p-3 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('es-ES', { 
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
                  placeholder="Escribe tu consulta médica..."
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
                  onClick={() => setInputMessage('¿Cómo programar una cita?')}
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Citas
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => setInputMessage('Información sobre medicamentos')}
                >
                  <Pill className="w-3 h-3 mr-1" />
                  Medicamentos
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => setInputMessage('Tengo una emergencia')}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Urgencias
                </Badge>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                ⚠️ Solo información general. No reemplaza consulta médica profesional.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatbotMedico;