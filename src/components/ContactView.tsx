import { useState, FormEvent } from 'react';
import { Mail, Send, AlertCircle, HelpCircle, CheckCircle, Smartphone } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorText('Please fill in check parameters in all core fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const err = await res.json();
        setErrorText(err.error || 'The server rejected submission.');
      }
    } catch {
      setErrorText('Network breakdown. Check server status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Intro info */}
      <section className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Us
        </h2>
        <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
          Have diagnostic questions, custom errors, or interesting tutorials feedback? File details below, and our editors will review them.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Lefthand Info panel cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
            <h4 className="font-display text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              Technical Support
            </h4>
            <div className="text-xs text-slate-400 mt-1">Available 24/7 via diagnostic AI.</div>
            <p className="text-slate-300 text-sm mt-4 font-sans leading-relaxed">
              If your system suffers from a critical crash (e.g. boot loops or Code 43 screen errors), please use our smart interactive helpdesk chatbot in the Fix section for instant solutions.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h4 className="font-display text-sm font-bold text-slate-950 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
              Editorial Contributions
            </h4>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              For partnership updates, group registration access codes, or deleting core guides, drop detailed messages including authorization headers.
            </p>
          </div>
        </div>

        {/* Dynamic Contact Form body */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Peter Tech"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-slate-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                Your Contact Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. peter@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-slate-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                Your Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Detail the computer fault, steps already tried, or questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none transition focus:bg-white focus:border-slate-300 font-sans resize-none"
              />
            </div>

            {errorText && (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorText}
              </p>
            )}

            {success && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>✅ Message sent successfully! We and our editors will get back to you soon.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 text-white font-bold px-6 py-3 hover:bg-blue-600 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Transmitting transmission...' : 'Send Message'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
