import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Hello! I am **EduBot**, the Greenfield School AI Assistant. Ask me anything about class schedules, fee dues, attendance marking, or grading calculations! 🏫',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How in attendance logged?',
    'What is the fee policy?',
    'Where to check exam GPA?',
    'How do I add books?'
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await resp.json();
      const botResponseText = data.text || 'I sorry, a connection issue occurred while getting response.';

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I failed to reach Greenfield core backend servers. Please verify the server state or try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnswerFormatting = (text: string) => {
    // Simple markdown processor helper for safe rendering of bold titles
    const boldRegex = /\*\*(.*?)\*\*/g;
    return text.split('\n').map((line, idx) => {
      // replace **bold** with <strong> matching tags
      const rendered = line.replace(boldRegex, '<strong>$1</strong>');
      return (
        <p key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: rendered }} />
      );
    });
  };

  return (
    <div id="ai-chatbot-widget" className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* Floating Trigger Balloon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="chatbot-trigger-bubble"
          title="Speak with EduBot"
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 duration-200 cursor-pointer relative group-hover:rotate-12 border border-slate-700"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </button>
      )}

      {/* Floating Dialogue Chat Interface sheet */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl w-[350px] sm:w-[380px] h-[500px] shadow-2xl overflow-hidden flex flex-col justify-between animate-scale-up text-slate-800 dark:text-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-indigo-900/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-4.5 h-4.5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-none">EduBot Specialist</h3>
                <span className="text-[9px] text-emerald-450 font-bold uppercase leading-none mt-1 inline-block">● Online Support</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              id="chatbot-dismiss"
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Conversation Core panel */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-855">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-slate-800 border shrink-0 flex items-center justify-center text-indigo-650 font-bold">
                    E
                  </div>
                )}
                <div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-900 border border-gray-105 rounded-tl-none text-slate-750 dark:text-gray-150'
                  }`}>
                    {parseAnswerFormatting(m.text)}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block px-1 text-right font-semibold">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Waiting loader indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center font-bold">E</div>
                <div className="p-3 bg-white rounded-2xl border text-xs text-gray-400 font-bold tracking-widest leading-none flex gap-1 items-center">
                  Thinking<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chip responses triggers */}
          {messages.length === 1 && (
            <div className="bg-white dark:bg-slate-900 border-t p-2 px-3 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none border-gray-100">
              {quickPrompts.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 border hover:bg-slate-100 rounded-full transition-all text-neutral-600 cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Prompt sender input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask EduBot a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(input); }}
              className="w-full text-xs p-2.5 px-3.5 bg-gray-55 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-755 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend(input)}
              id="chatbot-send-btn"
              title="Send Prompt"
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
      
    </div>
  );
};
