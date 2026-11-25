import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  ShoppingBag,
  RotateCcw,
  Minimize2,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const PROMPT_SUGGESTIONS = [
  "🔥 Recommend top trending products",
  "🎧 What are the best headphones?",
  "💻 Best laptops for coding & work?",
  "🚚 Tell me about shipping and returns",
  "🏷️ What discount codes are available?"
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi! I'm **ShopSmart AI**, your personal shopping companion powered by Gemini. Ask me about products, tech specs, shipping, or let me recommend the perfect item for you!",
      suggestions: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    let id = localStorage.getItem('shopsmart_chat_session');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem('shopsmart_chat_session', id);
    }
    return id;
  });

  const { addToCart } = useCart();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend) => {
    const userText = textToSend || input;
    if (!userText.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: 'user', text: userText }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Prepare history payload
      const historyPayload = newMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await api.post('/ai/chat', {
        message: userText,
        sessionId,
        history: historyPayload.slice(-8)
      });

      if (res.data.success) {
        setMessages([
          ...newMessages,
          {
            role: 'model',
            text: res.data.data.reply,
            suggestions: res.data.data.suggestions || []
          }
        ]);
      }
    } catch (err) {
      console.error('Chat AI error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'model',
          text: "I'm having a brief connection hiccup. Please try again or feel free to browse our full catalog directly!",
          suggestions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'model',
        text: "Conversation refreshed! How can I assist your shopping journey today?",
        suggestions: []
      }
    ]);
  };

  // Simple Markdown renderer for bold, italic, and bullets
  const renderFormattedText = (text) => {
    if (!text) return '';
    const lines = text.split('\n');

    return (
      <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;
          
          // Bullet point
          if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const content = line.trim().slice(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-violet-500 font-bold">•</span>
                <span>{formatBold(content)}</span>
              </div>
            );
          }

          return <p key={idx}>{formatBold(line)}</p>;
        })}
      </div>
    );
  };

  const formatBold = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Sparkles size={18} className="animate-spin-slow" />
          <span className="text-xs font-bold tracking-wide">
            ShopSmart AI
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/30">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  ShopSmart AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </h3>
                <p className="text-[10px] text-violet-100 font-medium">
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Refresh chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Horizontal Scroll */}
          <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {PROMPT_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(s)}
                className="whitespace-nowrap text-[11px] font-medium bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-600 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    m.role === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="text-xs sm:text-[13px]">{m.text}</p>
                  ) : (
                    renderFormattedText(m.text)
                  )}

                  {/* Embedded Recommended Product Cards */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Recommended For You
                      </p>
                      {m.suggestions.map((prod) => (
                        <div
                          key={prod._id}
                          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-xl p-2.5 flex items-center gap-2.5 transition-colors"
                        >
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-semibold text-slate-800 truncate">
                              {prod.name}
                            </h5>
                            <p className="text-[11px] font-bold text-violet-600">
                              ${prod.discountPrice || prod.price}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => {
                                addToCart(prod, 1);
                              }}
                              title="Add to cart"
                              className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-[10px] flex items-center gap-1 font-semibold"
                            >
                              <ShoppingBag size={12} /> Add
                            </button>
                            <Link
                              to={`/products/${prod._id}`}
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] text-center text-slate-500 hover:text-slate-800 font-medium"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-medium text-slate-400">ShopSmart is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our products..."
              className="flex-1 bg-slate-100 hover:bg-slate-150 focus:bg-white text-xs px-3.5 py-2.5 rounded-full border border-slate-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white rounded-full transition-colors shrink-0 shadow-sm"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
