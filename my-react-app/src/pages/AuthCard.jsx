import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

export default function AuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-md" style={{ perspective: '1500px' }}>
        <div
          className="relative w-full grid"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.65, 0.05, 0.36, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            className="row-start-1 col-start-1 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 transition-transform duration-300 hover:scale-[1.01]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <Signup onSwitchPage={() => setIsFlipped(true)} />
          </div>

          <div
            className="row-start-1 col-start-1 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 transition-transform duration-300 hover:scale-[1.01]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <Login onSwitchPage={() => setIsFlipped(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
