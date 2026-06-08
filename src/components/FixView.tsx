import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, Wrench, Wifi, Volume2, ShieldCheck, Cpu } from 'lucide-react';
import { ChatMessage } from '../types';

export default function FixView() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      text: 'Hello! I am your Technical Troubleshooting Assistant. Describe your system fault or software error, and I will outline a practical step-by-step resolution.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Set up accordion static configurations
  const faqItems = [
    {
      id: 'faq-1',
      icon: Cpu,
      title: '🖥️ My computer is running very slow',
      steps: [
        'Press Ctrl + Shift + Esc on your keyboard to instantly open Task Manager.',
        'Navigate to the Startup tab and review running items.',
        'Right click and choose Disable for items you do not need upon reboot.',
        'Clear cached local temp registers by deleting files in your %TEMP% folder.'
      ],
      link: '1'
    },
    {
      id: 'faq-2',
      icon: Wifi,
      title: '📶 WiFi keeps disconnecting or has no internet access',
      steps: [
        'Right click on the Network icon in the Taskbar tray.',
        'Choose Open Network & Internet settings, then select Network Troubleshooter.',
        'Flush local configurations by typing `ipconfig /flushdns` in Command Prompt (CMD).',
        'In Device Manager, locate Network Adapters, right-click and select Update Driver.'
      ]
    },
    {
      id: 'faq-3',
      icon: Volume2,
      title: '🔊 No sound is coming from external audio speakers',
      steps: [
        'Right-click the Speaker icon in the Taskbar taskbar tray and run Diagnose.',
        'Ensure the active default audio output device matches your hardware.',
        'Open Device Manager, expand Sound, video and game controllers.',
        'Right-click on your Realtek/Intel audio chipset and click Reinstall.'
      ]
    }
  ];

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  // Scroll chat window automatically
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle chatbot transmission
  const handleSendMessage = async (textToSend?: string) => {
    const messageQuery = textToSend || inputText;
    if (!messageQuery.trim()) return;

    // Clear main edit container only if clicked from submit button
    if (!textToSend) setInputText('');

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: messageQuery.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageQuery.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `b_${Date.now()}`,
            sender: 'bot',
            text: data.response || 'Apologies, I encountered a communication slip. Let me retry.',
            isHTML: true,
          },
        ]);
      } else {
        throw new Error('Communications error');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b_err_${Date.now()}`,
          sender: 'bot',
          text: '❌ Network timeout. Ensure your connection is active and resubmit the issue.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const promptSuggestions = [
    'WiFi keeps dropping out',
    'Windows Blue Screen error code',
    'Graphics card driver crashes',
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Summary */}
      <section className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          Fix Your Computer Issues
        </h2>
        <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
          Search immediate hardware diagnostic FAQS below, or describe your system symptoms immediately to our conversational tech support AI.
        </p>
      </section>

      {/* Accordion List for Swift Fixes */}
      <section className="mb-14">
        <h3 className="font-display text-xl font-bold text-slate-950 mb-6 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          Common Problems & Quick Fixes
        </h3>

        <div className="space-y-4">
          {faqItems.map((item) => {
            const Icon = item.icon;
            const isOpen = activeAccordion === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xs transition duration-200"
              >
                {/* Header Click action */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>

                {/* Extensible Body area */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-96 border-t border-slate-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 bg-slate-50/50">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Standard troubleshoot steps:
                    </div>
                    <ol className="list-decimal pl-5 space-y-2.5 text-sm text-slate-700 leading-relaxed font-sans">
                      {item.steps.map((stp, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: stp }} />
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Troubleshooting Interactive Chat Console */}
      <section className="bg-white border border-slate-100 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[520px] max-w-3xl mx-auto">
        
        {/* Chat box Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 animate-pulse">
              <Bot className="h-4.5 w-4.5 text-blue-400" />
            </div>
            <div>
              <div className="font-display font-semibold text-sm tracking-tight">Interactive Helpdesk AI</div>
              <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block" />
                <span>Powered by Gemini 3.5 Flash</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-blue-600/90 text-white rounded px-2 py-0.5 uppercase tracking-wider">
            Diagnostics
          </span>
        </div>

        {/* Scrollable Conversation stream logs */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                {/* Visual Avatar symbol */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs text-xs font-bold ${
                    isBot
                      ? 'bg-slate-900 border-slate-800 text-white'
                      : 'bg-blue-600 border-blue-500 text-white'
                  }`}
                >
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Speech block bubble */}
                <div className={`p-3.5 rounded-2xl shadow-xs text-sm leading-relaxed font-sans ${
                  isBot 
                    ? 'bg-white border border-slate-200/60 text-slate-900' 
                    : 'bg-blue-600 text-white rounded-br-none'
                }`}>
                  {msg.isHTML ? (
                    <div 
                      className="prose prose-sm prose-slate max-w-none prose-p:mb-3 last:prose-p:mb-0 prose-strong:font-bold prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:rounded"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing dots state effect placeholder */}
          {isTyping && (
            <div className="flex gap-3 max-w-[70%] mr-auto items-center">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200/50 p-4 rounded-2xl flex items-center gap-1 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Console Action Bar Suggestions */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-2.5 flex flex-wrap gap-1.5 items-center justify-items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1.5">Suggests:</span>
          {promptSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(sug)}
              className="text-xs bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200/80 hover:bg-slate-50 transition cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Text Area Form Transmitter */}
        <div className="bg-white p-4 border-t border-slate-100 flex gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your configuration error message or software glitch query here..."
            className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none font-sans"
            rows={1}
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-slate-950 text-white rounded-xl px-5 flex items-center justify-center font-bold hover:bg-blue-600 transition"
            aria-label="Submit chat"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>

      </section>

    </div>
  );
}
