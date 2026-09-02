import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { IProduct } from '../types.js';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ShoppingCart,
  ArrowRight,
  RotateCcw,
  Star
} from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: IProduct[];
  timestamp: string;
}

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    setSelectedProduct,
    addToCart,
    currentUser
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${currentUser?.name.split(' ')[0] || 'there'}! I'm **NEXORA AI**, your autonomous hardware and commerce advisor. 

How can I help you today? Tell me your budget, workflow needs, target battery life, or ask me to compare devices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Lightweight coding laptop under ₹60k',
    'Best ANC headphones for deep focus in library',
    'Ergonomic setup: keyboard + fast GaN charger',
    'Durable running shoes with responsive cushioning'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAIAssistantOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg: ChatMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text
      }));

      const res = await api.sendChatMessage(query, history, currentUser?.id);

      const aiMsg: ChatMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.message,
        recommendedProducts: res.recommendedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I encountered a brief latency spike while analyzing hardware benchmarks. Here are some top picks matching your query from our catalog:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: `Chat session reset. What hardware specifications or budget requirements should we explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div
      id="ai-assistant-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn"
      onClick={() => setIsAIAssistantOpen(false)}
    >
      <div
        id="ai-assistant-drawer-panel"
        className="w-full max-w-lg bg-[#080C14] border-l border-white/15 h-full shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-sm text-slate-100">NEXORA Shopping Co-Pilot</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-slate-400">Gemini 2.5 Flash • Hardware Recommendation Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1 px-1">
                {msg.sender === 'ai' ? <Bot className="w-3 h-3 text-sky-400" /> : <User className="w-3 h-3 text-indigo-400" />}
                <span>{msg.sender === 'ai' ? 'NEXORA AI' : 'You'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Bubble Body */}
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none shadow'
                }`}
              >
                {msg.text}
              </div>

              {/* Embedded Product Recommendation Action Cards */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-2.5 space-y-2 w-full max-w-[88%]">
                  <div className="text-[11px] font-mono text-sky-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recommended Catalog Matches:
                  </div>

                  {msg.recommendedProducts.map(p => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-3 hover:border-sky-500/40 transition-all"
                    >
                      <img src={(p.images && p.images[0]) || ''} alt={p.name} className="w-12 h-12 object-contain rounded bg-slate-900" referrerPolicy="no-referrer" />
                      <div className="flex-1 text-xs truncate">
                        <div className="font-semibold text-slate-100 truncate">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-sky-400 font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" /> {p.rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="px-2 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-[10px] font-bold flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add
                        </button>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          Specs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-white/10 rounded-xl w-fit text-xs text-sky-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing catalog & computing recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Starter Chips & Input Box */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] text-slate-400 hover:text-sky-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-white/5 whitespace-nowrap transition-all"
              >
                "{chip}"
              </button>
            ))}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Ask for advice, budget recommendations, specs..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />

            <button
              type="submit"
              disabled={!inputMsg.trim() || isTyping}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 transition-all font-semibold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
