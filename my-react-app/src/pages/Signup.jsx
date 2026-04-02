import { useEffect, useState } from 'react';

export default function Signup({ onSwitchPage, onAuthSuccess, initialData = {} }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, name: initialData.name || '', email: initialData.email || '' }));
  }, [initialData.name, initialData.email]);

  const validate = () => {
    const err = {};
    const { name, email, password } = form;

    if (!name.trim()) err.name = 'Name is required.';

    if (!email.trim()) {
      err.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Please enter a valid email address.';
    }

    if (!password) {
      err.password = 'Password is required.';
    } else {
      if (password.length < 8) {
        err.password = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(password)) {
        err.password = 'Password must include at least 1 uppercase letter.';
      } else if (!/[0-9]/.test(password)) {
        err.password = 'Password must include at least 1 number.';
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        err.password = 'Password must include at least 1 special character.';
      }
    }

    return err;
  };

  const clearStatus = () => setStatus(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status) clearStatus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) {
      return;
    }

    const inputUser = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    const existingJson = localStorage.getItem('auth_user');
    if (existingJson) {
      try {
        const existing = JSON.parse(existingJson);
        console.log('Signup attempt:', inputUser.email.toLowerCase(), 'vs existing:', existing.email);
        if (existing.email === inputUser.email.toLowerCase()) {
          setStatus({ type: 'error', message: 'User already exists with this email.' });
          return;
        }
      } catch {
        localStorage.removeItem('auth_user');
      }
    }

    localStorage.setItem('auth_user', JSON.stringify(inputUser));

    setStatus({ type: 'success', message: 'Welcome aboard! Redirecting to dashboard...' });
    setForm((prev) => ({ ...prev, password: '' }));
    onAuthSuccess(inputUser);
  };

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 bg-slate-900/70 text-white outline-none transition-all duration-300 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 shadow-inner hover:shadow-cyan-400/20 border-2 ${
      errors[field]
        ? 'border-red-500 focus:border-red-400 focus:ring-red-400/30'
        : 'border-slate-700/50 focus:border-cyan-400'
    }`;

  return (
    <div className="space-y-6">
      {/* Header with gradient glow */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border-2 border-cyan-400/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
            <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">CodeHub</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent mb-2 tracking-tight">Join the creators</h1>
        <p className="text-slate-300 max-w-md mx-auto leading-relaxed">Create your account to unlock real-time code playgrounds with zero setup.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClass('name')}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClass('email')}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field with toggle */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">
            Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={inputClass('password')}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="profile-password-toggle absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:scale-110 transition-transform"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 1112 19c.717 0 2.25-.47 4.125-1.175zM15 18a4 4 0 104-4 4 4 0 00-4 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4 0l8 8" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            • 8+ characters • 1 uppercase • 1 number • 1 special character
          </p>
        </div>

        {status && (
          <div className={`p-4 rounded-2xl backdrop-blur-sm border shadow-xl animate-in slide-in-from-top-4 ${
            status.type === 'success' 
              ? 'bg-emerald-900/30 border-emerald-400/40 shadow-emerald-400/20' 
              : 'bg-rose-900/30 border-rose-400/40 shadow-rose-400/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                status.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></div>
              <span className={`font-semibold text-sm ${
                status.type === 'success' ? 'text-emerald-200' : 'text-rose-200'
              }`}>
                {status.message}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="group relative w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-8 text-lg font-bold text-slate-900 shadow-2xl shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-600/60 active:translate-y-0 active:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Create Account
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
        </button>
      </form>

      <div className="pt-6 border-t border-slate-800/50 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <button 
            onClick={onSwitchPage} 
            className="font-semibold text-cyan-300 hover:text-cyan-200 hover:underline transition-all duration-200"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

