import { useState, useEffect, FormEvent } from 'react';
import { ArrowLeft, MessageSquare, Send, User, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { Article, Comment } from '../types';

interface ArticleDetailViewProps {
  articleId: string;
  articles: Article[];
  user: { email: string; name: string; token: string } | null;
  onNavigate: (view: string, articleId?: string) => void;
}

export default function ArticleDetailView({ articleId, articles, user, onNavigate }: ArticleDetailViewProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const article = articles.find((a) => a.id === articleId);

  // Fetch comments from local Express backend database API
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold font-display text-slate-900">Tutorial template not found</h3>
        <p className="text-slate-500 mt-2 text-sm">The article you were attempting to review does not exist or was deleted.</p>
        <button
          onClick={() => onNavigate('tutorials')}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </button>
      </div>
    );
  }

  // Handle posting a comment
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!commentText.trim()) return;

    if (!user) {
      setErrorMessage('Please sign in to join the discussion.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          user_email: user.email,
          user_name: user.name,
          content: commentText.trim(),
        }),
      });

      if (res.ok) {
        setCommentText('');
        fetchComments();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to submit comment.');
      }
    } catch (err) {
      setErrorMessage('Network connection lost. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('tutorials')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tutorials list
      </button>

      {/* Main Article Reading Container */}
      <article className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs mb-10 overflow-hidden">
        
        {/* Title & Author Info */}
        <header className="mb-8">
          <h1 className="font-display text-2xl sm:text-4.5xl font-black text-slate-950 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs sm:text-sm text-slate-500 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              <span>{article.source === 'local' ? 'TechThread Editor' : 'Community Writer'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Curated Template'}</span>
            </div>
            <span>•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold uppercase border border-slate-100">
              <ShieldCheck className="h-3 w-3 text-blue-500" />
              Verified Guide
            </span>
          </div>
        </header>

        {/* Cover image banner */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-8 border border-slate-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Inside Article Contents (Clean Markdown style typography) */}
        <div 
          className="prose prose-slate max-w-none prose-h2:font-display prose-h2:font-bold prose-h2:text-slate-950 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:font-display prose-h3:font-semibold prose-h3:text-slate-900 prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5 prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-5 prose-li:text-slate-700 prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

      </article>

      {/* Dynamic Comment Section Wrap */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xs">
        <h3 className="font-display text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-slate-500" />
          Comments Registry
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-bold rounded-full">
            {comments.length}
          </span>
        </h3>

        {/* Form area: verified login vs guest prompts */}
        {user ? (
          <form onSubmit={handlePostComment} className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Comment as {user.name} ({user.email})
            </label>
            <div className="relative">
              <textarea
                placeholder="Share your experience or ask a follow up question..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 pr-12 text-sm outline-none transitionfocus:border-blue-500 placeholder:text-slate-400 resize-none font-sans"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="absolute right-2 bottom-2.5 p-2 rounded-lg bg-slate-950 text-white transition hover:bg-blue-600 disabled:opacity-30 disabled:bg-slate-950 cursor-pointer"
                aria-label="Submit comment"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {errorMessage && (
              <p className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errorMessage}
              </p>
            )}
          </form>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-8">
            <p className="text-sm text-slate-500 font-medium">Want to share feedback or ask a troubleshooting question?</p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-950 text-white px-4 py-2 text-xs font-bold transition hover:bg-slate-800"
            >
              Sign in to publish comments
            </button>
          </div>
        )}

        {/* List of Comments */}
        {comments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {comments.map((comm) => (
              <div key={comm.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-display text-xs font-bold uppercase border border-slate-200">
                    {comm.user_name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-950">{comm.user_name}</div>
                    <div className="text-[10px] text-slate-400">{comm.user_email} • {new Date(comm.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed pl-11 font-sans">
                  {comm.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            No comments posted on this tutorial guide yet. Be the first to share!
          </div>
        )}

      </section>

    </div>
  );
}
