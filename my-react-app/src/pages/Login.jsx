import { useEffect, useState } from 'react';

export default function Login({ onSwitchPage, onAuthSuccess, initialData = {} }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, email: initialData.email || '' }));
  }, [initialData.email]);

  const clearStatus = () => setStatus(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status) clearStatus();
  };

  const validate = () => {
    const err = {};
    if (!form.email.trim()) {
      err.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      err.password = 'Password is required.';
    }

    return err;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    const storedJson = localStorage.getItem('auth_user');
    if (!storedJson) {
      setStatus({ type: 'error', message: 'Invalid email or password.' });
      return;
    }

    let storedUser;
    try {
      storedUser = JSON.parse(storedJson);
    } catch {
      setStatus({ type: 'error', message: 'No saved user found. Please signup first.' });
      return;
    }

    const enteredEmail = form.email.trim().toLowerCase();
    const enteredPassword = form.password;

    console.log('Stored email:', storedUser.email);
    console.log('Entered email:', enteredEmail);
    console.log('Stored password:', storedUser.password ? '[HIDDEN]' : 'null');
    console.log('Entered password length:', enteredPassword.length);

    if (storedUser.email !== enteredEmail || storedUser.password !== enteredPassword) {
      setStatus({ type: 'error', message: 'Invalid email or password' });
      return;
    }

    setStatus({ type: 'success', message: 'Login successful! Redirecting to home...' });
    setForm((prev) => ({ ...prev, password: '' }));
    onAuthSuccess({ name: storedUser.name, email: storedUser.email });
  };

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 bg-slate-900/70 text-white outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border border-red-500 focus:border-red-400 focus:ring-red-200'
        : 'border border-slate-600 focus:border-cyan-300'
    }`;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-white mb-1">Welcome back</h1>
      <p className="text-slate-200 mb-6">Log in to your account to continue.</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-100 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass('email')}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-100 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            className={inputClass('password')}
            autoComplete="current-password"
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
        </div>

        {status && (
          <p className={`text-sm ${status.type === 'error' ? 'text-red-400' : 'text-emerald-300'}`}>
            {status.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:scale-[1.01] hover:shadow-cyan-500/50 active:scale-[0.99]"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-slate-300 mt-4">
        Don't have an account?{' '}
        <button onClick={onSwitchPage} className="text-cyan-300 hover:text-cyan-100 font-medium">
          Signup
        </button>
      </p>
    </div>
  );
}
