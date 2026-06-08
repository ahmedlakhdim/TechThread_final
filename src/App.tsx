import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import TutorialsView from './components/TutorialsView';
import ArticleDetailView from './components/ArticleDetailView';
import FixView from './components/FixView';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import ContactView from './components/ContactView';
import { Article } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<{ email: string; name: string; token: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Articles with Backend
  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error('Failed to connect to full-stack Express articles registry API.', err);
    }
  };

  // Sync Hash route parser
  const parseHashRoute = (hash: string) => {
    const route = hash.replace(/^#/, '');
    if (!route || route === 'home') {
      setCurrentView('home');
      setSelectedArticleId('');
    } else if (route === 'tutorials') {
      setCurrentView('tutorials');
      setSelectedArticleId('');
    } else if (route === 'fix') {
      setCurrentView('fix');
      setSelectedArticleId('');
    } else if (route === 'contact') {
      setCurrentView('contact');
      setSelectedArticleId('');
    } else if (route === 'login') {
      setCurrentView('login');
      setSelectedArticleId('');
    } else if (route === 'dashboard') {
      setCurrentView('dashboard');
      setSelectedArticleId('');
    } else if (route.startsWith('article/')) {
      const artId = route.split('/')[1];
      setCurrentView('article-detail');
      setSelectedArticleId(artId);
    } else {
      setCurrentView('home');
      setSelectedArticleId('');
    }
  };

  // On mount actions
  useEffect(() => {
    // 1. Load active session
    const stored = localStorage.getItem('techthread_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('techthread_user');
      }
    }

    // 2. Fetch seed data
    loadArticles().finally(() => {
      setIsLoading(false);
    });

    // 3. Initialize first route
    parseHashRoute(window.location.hash);

    // 4. Listen on back/forward browser presses
    const handleHashChange = () => {
      parseHashRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set URL hash and navigate
  const handleNavigate = (view: string, articleId?: string) => {
    if (view === 'article-detail' && articleId) {
      window.location.hash = `#article/${articleId}`;
    } else {
      window.location.hash = `#${view}`;
    }
    // Scroll window premium UX
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Login handler
  const handleLoginSuccess = (session: { email: string; name: string; token: string }) => {
    setUser(session);
    localStorage.setItem('techthread_user', JSON.stringify(session));
    handleNavigate('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('techthread_user');
    handleNavigate('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      {/* Navigation header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main viewport region with nice transitions */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center flex-col gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Initializing TechThread registries...
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {currentView === 'home' && (
              <HomeView articles={articles} onNavigate={handleNavigate} />
            )}
            {currentView === 'tutorials' && (
              <TutorialsView articles={articles} onNavigate={handleNavigate} />
            )}
            {currentView === 'article-detail' && (
              <ArticleDetailView
                articleId={selectedArticleId}
                articles={articles}
                user={user}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === 'fix' && <FixView />}
            {currentView === 'contact' && <ContactView />}
            {currentView === 'login' && (
              <LoginView onLoginSuccess={handleLoginSuccess} />
            )}
            {currentView === 'dashboard' && user && (
              <DashboardView
                user={user}
                articles={articles}
                onRefreshArticles={loadArticles}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === 'dashboard' && !user && (
              <div className="mx-auto max-w-md py-16 text-center">
                <p className="text-slate-500 text-sm">Dashboard is reserved for authorized writers.</p>
                <button
                  onClick={() => handleNavigate('login')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-950 text-white px-4 py-2 text-xs font-semibold"
                >
                  Go to credentials portal
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TechThread Service Desk Corp. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-300 justify-items-center">
            <span>Client Version 2.4.0 (Fullstack Live)</span>
            <span>•</span>
            <button onClick={() => handleNavigate('contact')} className="hover:text-slate-500">Service Desk</button>
            <span>•</span>
            <button onClick={() => handleNavigate('login')} className="hover:text-slate-500 font-medium text-emerald-600">Writer Portal</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
