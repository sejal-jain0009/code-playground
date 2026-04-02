import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-slate-950 text-white page-transition">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#0f172a]/95 backdrop-filter backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative">
        <div className="navbar-divider absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,200,255,0.3)] to-transparent z-40"></div>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">  
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-wider text-cyan-300">Code Playground</span>
          </div>

          <nav className="flex items-center gap-4">
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                `navbar-link rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-cyan-300 active' : 'text-slate-200'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/playground"
              className={({ isActive }) =>
                `navbar-link rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-cyan-300 active' : 'text-slate-200'
                }`
              }
            >
              Playground
            </NavLink>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `navbar-link rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-cyan-300 active' : 'text-slate-200'
                }`
              }
            >
              Profile
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="btn btn-hover button-gradient rounded-lg px-3 py-2 text-sm font-semibold text-slate-950"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto mt-20 grid w-full max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:px-8">
        <section className="card-glass rounded-3xl p-6">
          <div className="welcome-text">
            <h1 className="text-3xl font-bold text-cyan-200 welcome-title">Welcome back{user.name ? `, ${user.name}` : ''}!</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              This dashboard gives you clean access to playgrounds and your user activity. Use top navigation to switch pages without reload.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="card-glass rounded-2xl p-5 magnetic">
            <h2 className="text-xl font-semibold text-cyan-300">Profile</h2>
            <p className="mt-2 text-slate-300">Name: <span className="font-medium text-white">{user.name || 'Guest'}</span></p>
            <p className="text-slate-300">Email: <span className="font-medium text-white">{user.email || 'None'}</span></p>
          </article>

          <article className="card-glass rounded-2xl p-5 magnetic">
            <h2 className="text-xl font-semibold text-cyan-300">Activity</h2>
            <p className="mt-2 text-slate-300">Last login and recent code runs appear here soon for detailed tracking.</p>
          </article>

          <article className="card-glass rounded-2xl p-5 magnetic">
            <h2 className="text-xl font-semibold text-cyan-300">Playground</h2>
            <p className="mt-2 text-slate-300">Quick jump into a coding session for any supported language.</p>
            <div className="mt-4 flex flex-col gap-3">
              <select id="dashboard-lang" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="c">C</option>
              </select>
              <button
                onClick={() => navigate('/playground')}
                className="btn btn-hover button-gradient rounded-lg px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Start Coding
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
