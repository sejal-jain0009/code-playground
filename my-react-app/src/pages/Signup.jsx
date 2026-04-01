import { useEffect, useState } from 'react';

export default function Signup({ onSwitchPage, onAuthSuccess, initialData = {} }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

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

    const existingJson = localStorage.getItem('saved_user');
    if (existingJson) {
      try {
        const existing = JSON.parse(existingJson);
        if (existing.email === inputUser.email) {
          setStatus({ type: 'error', message: 'A user with this email already exists.' });
          return;
        }
      } catch {
        // If parsing fails, overwrite broken data
        localStorage.removeItem('saved_user');
      }
    }

    localStorage.setItem('saved_user', JSON.stringify(inputUser));

    setStatus({ type: 'success', message: 'Signup successful! Redirecting to home...' });
    setForm((prev) => ({ ...prev, password: '' }));
    onAuthSuccess({ name: inputUser.name, email: inputUser.email });
  };

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 bg-slate-900/70 text-white outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border border-red-500 focus:border-red-400 focus:ring-red-200'
        : 'border border-slate-600 focus:border-cyan-300'
    }`;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-white mb-1">Create your account</h1>
      <p className="text-slate-200 mb-6">Join us with a secure, modern signup.</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-100 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass('name')}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

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
            placeholder="Strong password"
            className={inputClass('password')}
            autoComplete="new-password"
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
          Signup
        </button>
      </form>

      <p className="text-center text-sm text-slate-300 mt-4">
        Already have an account?{' '}
        <button onClick={onSwitchPage} className="text-cyan-300 hover:text-cyan-100 font-medium">
          Login
        </button>
      </p>
    </div>
  );
}
