import { useState, useRef, useEffect } from 'react';
import { Search, Wrench, BookOpen, Clock, Bot, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Article } from '../types';

interface HomeViewProps {
  articles: Article[];
  onNavigate: (view: string, articleId?: string) => void;
}

export default function HomeView({ articles, onNavigate }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close auto-suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = searchQuery.trim()
    ? articles.filter(
        (art) =>
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      
      {/* Dynamic Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 uppercase tracking-widest mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          24/7 IT Guidance Hub
        </span>
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Learn. <span className="text-blue-600">Fix.</span> Improve.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          Simple step-by-step tutorials to resolve your frustrating computer glitches and boost operating performance. Powered by our interactive AI troubleshooting companion.
        </p>

        {/* Dynamic Interactive Search Wrapper */}
        <div ref={searchContainerRef} className="relative max-w-xl mx-auto mt-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search guides, errors, drivers... (e.g. 'slow pc')"
              className="block w-full pl-11 pr-4 py-4 rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg text-sm sm:text-base outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
              autoComplete="off"
            />
          </div>

          {/* Search Dropdown Panel */}
          {showSuggestions && searchQuery.trim() && (
            <div 
              className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-80 overflow-y-auto text-left"
              id="searchResults"
            >
              {filteredResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-1 text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-50 mb-1">
                    Matching Tutorials ({filteredResults.length})
                  </div>
                  {filteredResults.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => {
                        onNavigate('article-detail', art.id);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 flex flex-col gap-0.5 border-b border-slate-50/60 last:border-none focus:outline-none focus:bg-slate-50"
                    >
                      <div className="font-semibold text-sm text-slate-950 font-display">
                        {art.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {art.description}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center" id="noResultsBlock">
                  <span className="text-2xl mb-1 block">🔍</span>
                  <div className="font-medium text-slate-800 text-sm">No exact guides found</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">
                    Try searching simpler terms or ask our AI assistant system in the Fix section.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-slate-500 justify-items-center">
          <span className="font-semibold text-slate-400">Popular:</span>
          <button onClick={() => setSearchQuery('slow')} className="underline hover:text-slate-800">slow computer</button>
          <span>•</span>
          <button onClick={() => setSearchQuery('driver')} className="underline hover:text-slate-800">device drivers</button>
          <span>•</span>
          <button onClick={() => setSearchQuery('install')} className="underline hover:text-slate-800">install block</button>
        </div>
      </section>

      {/* Bento Grid Feature Layout */}
      <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-8 border-b border-slate-100 pb-3">
        Engineered Technical Assistance
      </h3>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        
        {/* Card 1 */}
        <div className="group rounded-2xl bg-white border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <h4 className="font-display text-lg font-bold text-slate-950">
              Interactive Fix Center
            </h4>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Explore step-by-step diagnostic workflows for blue screen problems, persistent network disconnections, and sound output failures.
            </p>
          </div>
          <button
            onClick={() => onNavigate('fix')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-6 group/btn"
          >
            Access diagnostics
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="group rounded-2xl bg-white border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white mb-5 group-hover:scale-105 transition-transform">
              <Bot className="h-5 w-5" />
            </div>
            <h4 className="font-display text-lg font-bold text-slate-950">
              Conversational Helpdesk AI
            </h4>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Solve complicated software glitches instantly. Our AI troubleshooter answers code bugs and driver registry overrides in plain language of absolute clarity.
            </p>
          </div>
          <button
            onClick={() => onNavigate('fix')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-950 hover:text-slate-700 mt-6 group/btn"
          >
            Initiate chat session
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3 */}
        <div className="group rounded-2xl bg-white border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="font-display text-lg font-bold text-slate-950">
              Community Contributions
            </h4>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Our registered writers and system experts regularly publish manuals. All articles feature active comments sections to clarify specific device bugs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tutorials')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-6 group/btn"
          >
            Explore tutorials
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

      {/* Aesthetic Highlight panel */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="absolute right-0 bottom-0 top-0 w-80 bg-linear-to-bl from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-400 h-5 w-5" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Trusted Operations</span>
          </div>
          <h4 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Having a sudden critical issue right now?
          </h4>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Do not let registry configuration screens panic you. Skip general internet searches and dive straight into the Fix System for swift guidance.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => onNavigate('fix')}
            className="bg-white text-slate-950 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm"
          >
            Go to Fix System
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-slate-800 text-slate-300 font-semibold border border-slate-700 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors text-sm"
          >
            Ask a Specialist
          </button>
        </div>
      </section>

    </div>
  );
}
