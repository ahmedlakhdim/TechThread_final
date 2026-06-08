import { useState } from 'react';
import { Menu, X, Home, BookOpen, Wrench, Mail, LayoutDashboard, LogIn, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, articleId?: string) => void;
  user: { email: string; name: string; token: string } | null;
  onLogout: () => void;
}

export default function Navbar({ currentView, onNavigate, user, onLogout }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Tutorials', view: 'tutorials', icon: BookOpen },
    { label: 'Fix System', view: 'fix', icon: Wrench },
    { label: 'Contact Us', view: 'contact', icon: Mail },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Primary Top Header bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Hamburguer toggler */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Open Sidebar menu"
              id="menuToggleBtn"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div 
              onClick={() => onNavigate('home')}
              className="flex cursor-pointer items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-display font-bold text-white shadow-sm">
                T
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-slate-950">
                Tech<span className="font-medium text-slate-500">Thread</span>
              </span>
            </div>
          </div>

          {/* Desktop Tab Menu Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-950 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  id={`nav-link-${item.view}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Hand Control Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    currentView === 'dashboard'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                  id="nav-link-dashboard"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </button>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 pl-2 pr-3 py-1 text-xs font-medium text-slate-700">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white font-bold uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  currentView === 'login'
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                id="nav-link-login"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Slide-out Overlay Drawer Side Panel */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Blur Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
              id="drawerOverlay"
            />

            {/* Sidebar drawer element */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="fixed bottom-0 top-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl border-r border-slate-100"
              id="drawer"
            >
              {/* Drawer Top Header info */}
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
                    T
                  </span>
                  <span className="font-display text-lg font-bold text-slate-950">
                    TechThread
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Identity Area */}
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-100">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white font-bold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{user.email}</div>
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded mt-1">
                        Writer Access
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Guest Reader</div>
                      <button
                        onClick={() => handleNavClick('login')}
                        className="text-xs font-semibold text-blue-600 hover:underline mt-0.5 block"
                      >
                        Sign in to access admin tools
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Actions */}
              <div className="flex-1 space-y-1.5 px-3 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-950 text-white font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}

                {user && (
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      currentView === 'dashboard'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Writer Dashboard
                  </button>
                )}
              </div>

              {/* Drawer Bottom controls */}
              {user && (
                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsDrawerOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    De-authorize Account
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
