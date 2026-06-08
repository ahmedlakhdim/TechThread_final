import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, Trash2, Globe, Send, RefreshCw, BadgeAlert, Users, 
  Key, AlertCircle, Sparkles, BookOpen, UserX, UserCheck, Calendar
} from 'lucide-react';
import { Article, WriterRequest, InviteCode } from '../types';

interface DashboardViewProps {
  user: { email: string; name: string; token: string; role: string };
  articles: Article[];
  onRefreshArticles: () => void;
  onNavigate: (view: string, articleId?: string) => void;
}

export default function DashboardView({ user, articles, onRefreshArticles, onNavigate }: DashboardViewProps) {
  // Tabs: 'publish' | 'requests' | 'invite'
  const [activeTab, setActiveTab] = useState<'publish' | 'requests' | 'invite'>('publish');

  // Article form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [pubMessage, setPubMessage] = useState('');
  const [pubError, setPubError] = useState('');

  // Requests state
  const [requests, setRequests] = useState<WriterRequest[]>([]);
  const [isReqLoading, setIsReqLoading] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<InviteCode | null>(null);

  // Load writer applications for Editorial view
  const fetchRequests = async () => {
    setIsReqLoading(true);
    try {
      const res = await fetch('/api/writer-requests');
      if (res.ok) {
        const data = await res.json();
        // Return only pending ones
        setRequests(data.filter((r: WriterRequest) => r.status === 'pending'));
      }
    } catch (err) {
      console.error('Error fetching writer requests:', err);
    } finally {
      setIsReqLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  // Handle publishing tutorial draft
  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();
    setPubError('');
    setPubMessage('');

    if (!title.trim() || !content.trim()) {
      setPubError('Title and core content fields cannot be empty.');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
          image: image.trim() || undefined,
          content: content.trim(),
          author_name: user.name,
        }),
      });

      if (res.ok) {
        setPubMessage('✅ Article published successfully to the registry list!');
        setTitle('');
        setDesc('');
        setImage('');
        setContent('');
        onRefreshArticles();
        setTimeout(() => setPubMessage(''), 4000);
      } else {
        const err = await res.json();
        setPubError(err.error || 'Server error publishing article.');
      }
    } catch {
      setPubError('Network breakdown. Check server status.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle deleting custom articles
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you certain you wish to purge and delete this article from registry?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onRefreshArticles();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete core curated system articles.');
      }
    } catch {
      alert('Communication crash. Could not delete article.');
    }
  };

  // Handle approving applicant request
  const handleApproveRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/writer-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.invite) {
          alert(`✅ Request Approved Successfully!\n\nEmail: ${data.invite.email}\nGenerated Entry Code: ${data.invite.code}\n\nProvide this 4-digit code to the writer manually.`);
        }
        fetchRequests();
      }
    } catch {
      alert('Could not approve request.');
    }
  };

  // Handle rejecting applicant request
  const handleRejectRequest = async (id: string) => {
    if (!confirm('Reject this applicant request?')) return;

    try {
      const res = await fetch(`/api/writer-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch {
      alert('Could not reject request.');
    }
  };

  // Handle generating invite code manually
  const handleGenerateCode = async (e: FormEvent) => {
    e.preventDefault();
    setInviteResult(null);

    const emailStr = inviteEmail.trim();
    if (!emailStr) return;

    setIsInviting(true);
    try {
      const res = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailStr }),
      });

      if (res.ok) {
        const data = await res.json();
        setInviteResult(data);
        setInviteEmail('');
      } else {
        alert('Server declined to generate invite.');
      }
    } catch {
      alert('Connection lost.');
    } finally {
      setIsInviting(false);
    }
  };

  const myCustomArticles = user.role === 'editor'
    ? articles.filter((a) => a.source === 'custom')
    : articles.filter((a) => a.source === 'custom' && a.author_name === user.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
            {user.role === 'editor' ? 'TechThread Editor Console' : 'Author Dashboard'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Publish tutorial templates, approve peer requests, and handle active invites.
          </p>
        </div>

        {/* Dashboard navigation tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('publish')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
              activeTab === 'publish'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Editor Desk
          </button>
          {user.role === 'editor' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
                  activeTab === 'requests'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Applicants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('invite')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
                  activeTab === 'invite'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Manual Invites
              </button>
            </>
          )}
        </div>
      </section>

      {/* Tab CONTENT: Publisher Area */}
      {activeTab === 'publish' && (
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* New article Form */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2 mb-6">
              <Plus className="h-5 w-5 text-emerald-500" />
              Publish New Tutorial
            </h3>

            <form onSubmit={handlePublish} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to roll back corrupted graphics display registers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                  Short Synopsis / Synopsis <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="A snippet overview shown on the Tutorials board registry card..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                  Splash Header Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/your-image... (Default loaded if empty)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1 flex justify-between items-center pr-1">
                  <span>Html Content Editor <span className="text-red-400">*</span></span>
                  <span className="text-[10px] lowercase text-slate-400">supports raw &lt;p&gt; and &lt;h2&gt; formatting</span>
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder={`<h2>1. Primary Header</h2>\n<p>Explain step configurations here. Highlight details inside <strong>bold tags</strong>.</p>`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-mono outline-none transition focus:bg-white focus:border-slate-300"
                />
              </div>

              {pubError && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {pubError}
                </p>
              )}

              {pubMessage && (
                <p className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  {pubMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isPublishing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 text-white font-bold px-6 py-3 hover:bg-blue-600 transition disabled:opacity-50"
              >
                <Globe className="h-4 w-4" />
                {isPublishing ? 'Publishing tutorial...' : 'Publish Article Live'}
              </button>

            </form>
          </div>

          {/* Side panel: Custom Submissions catalog */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                My Custom Manuals ({myCustomArticles.length})
              </h3>
              
              {myCustomArticles.length > 0 ? (
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[360px] pr-1">
                  {myCustomArticles.map((art) => (
                    <div key={art.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <h4 
                          onClick={() => onNavigate('article-detail', art.id)}
                          className="font-display text-sm font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                        >
                          {art.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{art.created_at ? new Date(art.created_at).toLocaleDateString() : 'Today'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-6 text-center">
                  You have not published any custom tutorials yet using this writer account.
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 text-xs text-slate-400 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <span className="font-semibold block mb-1 text-slate-500">Security Warning</span>
              Drafts immediately launch onto the public Tutorials timeline list for visitors to comment. Purge drafts if troubleshooting strategies need update.
            </div>
          </div>

        </div>
      )}

      {/* Tab CONTENT: Applicants Area */}
      {activeTab === 'requests' && (
        <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Pending Editorial Registrations
            </h3>
            <button
              onClick={fetchRequests}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh requests"
            >
              <RefreshCw className={`h-4 w-4 ${isReqLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isReqLoading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Loading requests...
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-6">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-slate-900 text-base">{req.full_name}</span>
                      <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Age: {req.age}
                      </span>
                      {req.is_creator && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Creator
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{req.email || 'No email filed'}</div>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-sans bg-white p-3 rounded-xl border border-slate-100">
                      "{req.message}"
                    </p>
                    {req.channel_url && (
                      <a
                        href={req.channel_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline inline-block mt-1"
                      >
                        Visit Portfolio URL →
                      </a>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 transition shadow-xs cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-4 py-2.5 transition cursor-pointer"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center">
              <span className="text-4xl mb-2">🎈</span>
              <div className="font-bold text-slate-800">Clear queue!</div>
              <div>No registration requests are currently filed for moderation.</div>
            </div>
          )}
        </section>
      )}

      {/* Tab CONTENT: Manual Invites Area */}
      {activeTab === 'invite' && (
        <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs max-w-md mx-auto">
          <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
            <Key className="h-5 w-5 text-amber-500" />
            Invite Co-Writer Partner
          </h3>
          <p className="text-slate-500 text-xs mb-4 leading-relaxed font-sans mt-1">
            Specify a user's Google Email to authorize. The system generates a single and unrepeatable security pin code instantly.
          </p>

          <form onSubmit={handleGenerateCode} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                Recipient Google Email
              </label>
              <input
                type="email"
                required
                placeholder="co-writer@gmail.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isInviting}
              className="w-full bg-slate-950 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-amber-600 transition"
            >
              {isInviting ? 'Generating security pins...' : 'Generate Writer Pin Code'}
            </button>
          </form>

          {inviteResult && (
            <div className="mt-6 p-5 bg-amber-50 rounded-2xl border border-amber-200/80 text-center animate-in fade-in duration-200">
              <div className="text-xs font-bold text-amber-800 mb-1">✅ Writer Pin Code Generated!</div>
              <p className="text-[11px] text-amber-600 truncate">{inviteResult.email}</p>
              <div className="mt-3 bg-white border border-amber-200 font-mono font-bold text-2xl tracking-widest text-slate-900 py-2.5 px-4 rounded-xl inline-block shadow-xs">
                {inviteResult.code}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                Provide this 4-digit token to the writer via messaging. It only works once.
              </p>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
