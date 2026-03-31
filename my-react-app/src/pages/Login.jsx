export default function Login({ onSwitchPage }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-white mb-1">Welcome back</h1>
      <p className="text-slate-200 mb-6">Log in to your account to continue.</p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-100 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-xl px-4 py-3 bg-slate-900/70 text-white outline-none border border-slate-600 focus:ring-2 focus:ring-cyan-300/40 focus:border-cyan-300 transition"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-100 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your password"
            className="w-full rounded-xl px-4 py-3 bg-slate-900/70 text-white outline-none border border-slate-600 focus:ring-2 focus:ring-cyan-300/40 focus:border-cyan-300 transition"
          />
        </div>

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
