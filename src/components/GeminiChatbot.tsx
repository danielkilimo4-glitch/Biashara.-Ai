import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Brain, 
  Zap, 
  Sparkles, 
  Trash2, 
  User, 
  Cpu, 
  HelpCircle,
  Briefcase,
  Megaphone,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { AdvisorRole, ChatMessage, BusinessProfile } from '../types';

interface GeminiChatbotProps {
  profile: BusinessProfile;
}

const ROLE_CONFIGS: Record<AdvisorRole, {
  name: string;
  badge: string;
  description: string;
  icon: any;
  starterPrompt: string;
}> = {
  biashara_advisor: {
    name: 'Jirani Biashara Advisor',
    badge: 'Ukuaji & Mikakati',
    description: 'Kenyan business mentor for cashflow, stock sourcing, county laws, and daily hustle strategy.',
    icon: Briefcase,
    starterPrompt: 'Karibu! Mimi ni mshauri wako wa biashara. Je, ungependa tuangalie jinsi ya kukuza mauzo, kusimamia madeni, au kuchagua eneo zuri la biashara?',
  },
  digital_marketer: {
    name: 'Wasee Digital Marketer',
    badge: 'Social Media & Sheng Copy',
    description: 'Kenyan sales copywriter for WhatsApp Status, TikTok reels, and Instagram conversion in Sheng/Swahili.',
    icon: Megaphone,
    starterPrompt: 'Niaje mdau! Mimi hapa kukusaidia kutengeneza caption za kijanja, WhatsApp status zinazovuta wateja, na video scripts za TikTok. Tuanze na bidhaa gani leo?',
  },
  financial_strategist: {
    name: 'Hesabu Pro Accountant',
    badge: 'Hesabu & M-Pesa Tariffs',
    description: 'Pricing & margin analyst, Safaricom M-Pesa fee optimizer, and debt-free accounting advisor.',
    icon: Calculator,
    starterPrompt: 'Habari za kazi! Kazi yangu ni kuhakikisha kila shilingi inazaa faida halisi. Tuchambue bei ya bidhaa yako, gharama za boda, au jinsi ya kupunguza ada za M-Pesa?',
  },
};

const SUGGESTED_QUESTIONS: Record<AdvisorRole, string[]> = {
  biashara_advisor: [
    'Nina mtaji wa KSh 10,000, nianzie biashara gani Nairobi?',
    'Nifanye nini mteja anapokataa kulipa deni la mzigo bila kugombana?',
    'Je, nifungue stall physical ama nibaki tu online na delivery ya boda?',
  ],
  digital_marketer: [
    'Niandikie WhatsApp status ya kuvutia wateja wa viatu vya mtumba leo jioni',
    'Viral TikTok script ya salon yangu ya kusuka braids za knotless',
    'Mbinu za kupata wateja 10 wa kwanza kwenye Instagram bila kulipia sponsored ads',
  ],
  financial_strategist: [
    'Nimeuza nguo ya KSh 2,000, niliinunua KSh 1,200. M-Pesa na boda vimekula KSh 300. Faida yangu ni ngapi?',
    'Jinsi ya kuepuka hasara ya ada za M-Pesa kwa kutumia Till badala ya Send Money',
    'Njia bora ya kuweka bei (markup) ili iweze kuvumilia bargaining za wateja',
  ],
};

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ profile }) => {
  const [role, setRole] = useState<AdvisorRole>('biashara_advisor');
  const [speed, setSpeed] = useState<'fast' | 'general' | 'deep_thinking'>('general');
  const [highThinking, setHighThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: ROLE_CONFIGS.biashara_advisor.starterPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleRoleChange = (newRole: AdvisorRole) => {
    setRole(newRole);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: ROLE_CONFIGS[newRole].starterPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: speed === 'deep_thinking' || highThinking ? 'gemini-4-argon' : speed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash',
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputValue).trim();
    if (!promptText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          role,
          speed: highThinking ? 'deep_thinking' : speed,
          highThinking,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed,
          thinkingMode: data.thinkingApplied || highThinking,
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || 'No response returned');
      }
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Pole sana, kumekuwa na changamoto ya mawasiliano. Tafadhali jaribu tena au tumia zana za Invoice na Profit Calculator hapo juu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: ROLE_CONFIGS[role].starterPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Role Selector */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Bot className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">Gemini Biashara AI Advisor</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Multi-turn conversational advisor powered by Gemini models for Kenyan entrepreneurs.
            </p>
          </div>

          {/* Model & Thinking Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* High Thinking Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !highThinking;
                setHighThinking(nextState);
                if (nextState) setSpeed('deep_thinking');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                highThinking
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50'
                  : 'bg-stone-900 border-stone-750 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Brain className={`w-3.5 h-3.5 ${highThinking ? 'text-purple-400 animate-pulse' : 'text-stone-400'}`} />
              <span>High Thinking (gemini-4-argon)</span>
              {highThinking && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
            </button>

            {/* Clear Chat Button */}
            <button
              type="button"
              onClick={clearChat}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 rounded-xl border border-stone-750 transition-colors"
              title="Futa Mazungumzo (Clear Chat)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advisor Persona Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {(Object.keys(ROLE_CONFIGS) as AdvisorRole[]).map((r) => {
            const conf = ROLE_CONFIGS[r];
            const Icon = conf.icon;
            const isSelected = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
                    : 'bg-stone-900/90 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold text-white">{conf.name}</span>
                  </div>
                  <span className="text-[9px] bg-stone-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                    {conf.badge}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                  {conf.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Speed / Tier Selector (when high thinking is disabled) */}
        {!highThinking && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-800 text-xs">
            <span className="text-stone-500 font-semibold text-[11px]">Model Speed:</span>
            <button
              onClick={() => setSpeed('fast')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                speed === 'fast'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚡ Fast (gemini-3.1-flash-lite)
            </button>
            <button
              onClick={() => setSpeed('general')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                speed === 'general'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚖️ Standard (gemini-3.8-flash)
            </button>
          </div>
        )}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-stone-850 border border-stone-800 rounded-2xl shadow-xl flex flex-col h-[520px] overflow-hidden">
        {/* Messages scrollable thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-stone-900 text-stone-200 rounded-tl-sm border border-stone-800 shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] text-stone-400">
                    <span className="font-mono">{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="inline-flex items-center gap-1 bg-stone-800/80 px-2 py-0.5 rounded text-emerald-400 font-mono text-[9px] border border-stone-700/50">
                        {msg.thinkingMode && <Brain className="w-2.5 h-2.5 text-purple-400" />}
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-stone-300 border border-stone-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-stone-900 rounded-2xl rounded-tl-sm p-3.5 border border-stone-800 text-xs text-stone-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>
                  {highThinking
                    ? 'Inafanya uchambuzi wa kina kupitia Thinking Mode (gemini-4-argon)...'
                    : 'Inachambua jibu lako...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-2 sm:px-4 bg-stone-900/60 border-t border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider shrink-0">
            Maswali:
          </span>
          {SUGGESTED_QUESTIONS[role].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap px-2.5 py-1 bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-emerald-300 rounded-lg text-xs font-medium border border-stone-750 transition-colors shrink-0 max-w-[280px] truncate"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Uliza ushauri kuhusu biashara, bei, au tangazo..."
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 sm:px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
              aria-label="Send message to Gemini"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Tuma</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
