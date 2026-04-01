import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ name: parsed.name || '', email: parsed.email || '' });
      } catch {
        setUser({ name: '', email: '' });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl p-6 sm:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{user.name ? `, ${user.name}` : ''}!</h1>
            <p className="text-slate-300">Start exploring your coding playground and manage your profile from the dashboard.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-rose-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-rose-400"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-blue-950/40 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-3">Dashboard</h2>
            <p className="text-slate-300 mb-4">Welcome back! Start exploring your coding playground. Use the quick actions below to view and edit your profile.</p>
            <ul className="space-y-2 text-slate-100">
              <li className="rounded-lg bg-slate-900/60 p-3 transition hover:bg-slate-800 cursor-pointer">View Profile</li>
              <li className="rounded-lg bg-slate-900/60 p-3 transition hover:bg-slate-800 cursor-pointer">Edit Profile (coming soon)</li>
            </ul>
            <div className="mt-5 rounded-lg bg-slate-900/70 p-3 text-slate-300">
              <p>This app is designed to help you build and test code quickly in a responsive environment. Get your ideas from concept to working prototype fast.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-indigo-950/40 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-3">Code Playground</h2>
            <p className="text-slate-300 mb-5">Write, run, and test your code instantly. Jump into a live playground session and develop your next feature.</p>
            <button
              onClick={() => navigate('/playground')}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 font-semibold text-slate-950 shadow hover:scale-[1.01] hover:opacity-95 transition"
            >
              Start Coding
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-900/60 p-4 text-slate-300">
          <p>Logged in as: <strong>{user.email || 'Not available'}</strong></p>
        </div>
      </div>
    </div>
  );
}
