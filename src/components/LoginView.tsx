import { useState, FormEvent } from 'react';
import { Key, Mail, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (session: { email: string; name: string; token: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  // Login form states
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isWriterFormOpen, setIsWriterFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Application Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqAge, setReqAge] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqMsg, setReqMsg] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [reqChannel, setReqChannel] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  // Sign in as Writer handler
  const handleWriterSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email.trim() || !code.trim()) {
      setErrorText('Please fill in both email and access code fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/writer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess({
          email: data.email,
          name: data.name,
          token: data.token,
          role: data.role || "author",
        });
      } else {
        const err = await res.json();
        setErrorText(err.error || 'Invalid credentials or expired code.');
      }
    } catch {
      setErrorText('Server communication failed. Please attempt again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  // Submit Writer Access Application
  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess(false);

    if (!reqName.trim()) {
      setModalError('Please supply your full legal name.');
      return;
    }
    const ageNum = Number(reqAge);
    if (!reqAge || ageNum < 13) {
      setModalError('Age must be larger than 13 to participate.');
      return;
    }
    if (!reqEmail.trim() || !reqEmail.includes('@')) {
      setModalError('Please supply a valid contact email.');
      return;
    }
    if (!reqMsg.trim() || reqMsg.trim().length < 20) {
      setModalError('Message description must have at least 20 characters.');
      return;
    }

    setIsModalSubmitting(true);
    try {
      const res = await fetch('/api/writer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: reqName.trim(),
          age: ageNum,
          message: reqMsg.trim(),
          is_creator: isCreator,
          channel_url: reqChannel.trim() || undefined,
          email: reqEmail.trim(),
        }),
      });

      if (res.ok) {
        setModalSuccess(true);
        // Clear application fields
        setReqName('');
        setReqAge('');
        setReqEmail('');
        setReqMsg('');
        setReqChannel('');
        setIsCreator(false);

        // Auto Close modal after 2.5s
        setTimeout(() => {
          setIsModalOpen(false);
          setModalSuccess(false);
        }, 2500);
      } else {
        const err = await res.json();
        setModalError(err.error || 'Server rejected application.');
      }
    } catch {
      setModalError('Network error. Check network settings.');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      
      {/* Box layout container wrapper */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-lg">
        
        <div className="text-center mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-display text-lg font-bold text-white mb-4">
            T
          </span>
          <h2 className="font-display text-2xl font-extrabold text-slate-950">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Access the TechThread publication and moderation client.
          </p>
        </div>



        {/* Normal Login Actions */}
        <div className="space-y-4">
          
          {/* Action trigger button */}
          {!isWriterFormOpen ? (
            <button
              onClick={() => setIsWriterFormOpen(true)}
              className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 py-3 text-sm transition"
            >
              <Key className="h-4.5 w-4.5" />
              Sign in with Access Pin Code
            </button>
          ) : (
            <form onSubmit={handleWriterSignIn} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Google Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-slate-400 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  4-Digit Access Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. 4829"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm tracking-widest font-mono focus:bg-white focus:border-slate-400 outline-none transition"
                  />
                </div>
              </div>

              {errorText && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pl-1">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorText}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-950 text-white font-bold rounded-xl py-3 text-sm hover:bg-blue-600 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying access credentials...' : 'Authenticate Account'}
              </button>

              <button
                type="button"
                onClick={() => setIsWriterFormOpen(false)}
                className="w-full text-slate-400 hover:text-slate-600 text-xs font-medium text-center"
              >
                Cancel credential login
              </button>
            </form>
          )}

          {/* Prompt modal trigger */}
          <div className="text-center pt-6 border-t border-slate-100 mt-6">
            <span className="text-xs text-slate-400">Do not have an editorial pin code?</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="block cursor-pointer mx-auto text-sm font-bold text-blue-600 hover:underline mt-1"
              id="noCodeBtn"
            >
              Request Writer Access Privileges
            </button>
          </div>

        </div>

      </div>

      {/* Slide-in Overlay Modal Dialog Area */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
            
            <header className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2">
                  <ShieldAlert className="text-blue-500 h-5 w-5" />
                  Apply as a Writer
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Submit details to be assigned a verification log.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {modalSuccess ? (
              <div className="text-center py-10">
                <span className="text-4xl block mb-3">✉️</span>
                <h4 className="font-display text-lg font-bold text-slate-900">Application successfully filed!</h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                  Our system editors are reviewing applications. Your pin code will display in the Moderation dashboard once verified.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs px-3 py-1 font-semibold border border-emerald-100">
                  <span>Processed and tracked</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                
                {/* Form fields */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Legal Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amelia Cruz"
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      className="block w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={13}
                      max={99}
                      placeholder="Age"
                      value={reqAge}
                      onChange={(e) => setReqAge(e.target.value)}
                      className="block w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Google Contact Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="amelia@gmail.com"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    className="block w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Application Pitch <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Experience, typical topics, troubleshooting interests (minimum 20 characters)..."
                    value={reqMsg}
                    onChange={(e) => setReqMsg(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-slate-400 font-sans resize-none"
                  />
                </div>

                {/* Creator Toggle switches */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">
                    Are you a software content publisher?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreator(false)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                        !isCreator
                          ? 'bg-slate-950 border-slate-950 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      No, diagnostics enthusiast
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreator(true)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                        isCreator
                          ? 'bg-slate-950 border-slate-950 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      id="isCreatorBtn"
                    >
                      Yes, publisher
                    </button>
                  </div>
                </div>

                {isCreator && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                      Channel or Medium URL Reference
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/your-channel"
                      value={reqChannel}
                      onChange={(e) => setReqChannel(e.target.value)}
                      className="block w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none transition focus:border-slate-400"
                    />
                  </div>
                )}

                {modalError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {modalError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isModalSubmitting}
                  className="w-full bg-slate-950 text-white font-bold rounded-xl py-3 text-sm hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isModalSubmitting ? 'Transmitting credentials...' : 'File Application'}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
