import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowUpRight, Search, FileCode } from 'lucide-react';
import { Article } from '../types';

interface TutorialsViewProps {
  articles: Article[];
  onNavigate: (view: string, articleId?: string) => void;
}

export default function TutorialsView({ articles, onNavigate }: TutorialsViewProps) {
  const [filterQuery, setFilterQuery] = useState('');
  
  // Custom typewriter effect states
  const textOptions = ['Fix Computer Glitches', 'Resolve Corrupted Drivers', 'Purge Temporary Files'];
  const [displayText, setDisplayText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = textOptions[wordIdx];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, charIdx - 1));
        setCharIdx((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, charIdx + 1));
        setCharIdx((prev) => prev + 1);
      }, 90);
    }

    if (!isDeleting && charIdx === currentWord.length) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % textOptions.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, wordIdx]);

  // Split into curated vs community
  const curatedArticles = articles.filter(
    (a) =>
      a.source === 'local' &&
      (a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const communityArticles = articles.filter(
    (a) =>
      a.source === 'custom' &&
      (a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Typewriter Hero */}
      <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-12 mb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Welcome to the Registry</span>
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Here you can <span className="text-blue-600 block sm:inline">{displayText}</span>
          <span className="inline-block w-[3px] h-6 sm:h-9 bg-blue-600 ml-1 transform translate-y-1 animate-pulse" />
        </h2>
        <div className="max-w-md mx-auto mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Quick filter registry templates..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>
      </section>

      {/* Grid: Curated Manuals */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
          <BookOpen className="text-slate-900 h-5 w-5" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Curated Core Manuals
          </h3>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {curatedArticles.length}
          </span>
        </div>

        {curatedArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {curatedArticles.map((art) => (
              <article
                key={art.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      Certified
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-display text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-3 leading-relaxed">
                      {art.description}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <button
                    onClick={() => onNavigate('article-detail', art.id)}
                    className="w-full flex items-center justify-center gap-1 bg-slate-950 hover:bg-blue-600 text-white font-semibold rounded-xl py-3 text-sm transition-colors duration-200"
                  >
                    Read Guide
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No core guides found matching "{filterQuery}"</p>
          </div>
        )}
      </section>

      {/* List: Latest Community Submissions */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
          <FileCode className="text-emerald-600 h-5 w-5" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Latest Community Submissions
          </h3>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {communityArticles.length}
          </span>
        </div>

        {communityArticles.length > 0 ? (
          <div className="space-y-4">
            {communityArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('article-detail', art.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl shadow-xs hover:shadow-sm cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100 relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-slate-950 group-hover:text-blue-600 transition-colors text-base line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5 max-w-xl truncate">
                      {art.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{art.created_at ? new Date(art.created_at).toLocaleDateString() : 'Dec 18, 2025'}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600 uppercase tracking-wider">Independent Writer</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-950 shrink-0 self-end sm:self-center transition-colors">
                  <span>Read submission</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-3xl mb-1 block">✍️</span>
            <p className="text-sm text-slate-500 font-medium">No custom writer articles yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">
              Are you an expert? Apply to join other writers and publish your troubleshoot guide here!
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
