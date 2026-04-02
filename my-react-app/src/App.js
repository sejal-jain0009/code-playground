import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthCard from './pages/AuthCard';
import Home from './pages/Home';
import JavaScriptPlayground from './pages/JavaScriptPlayground';
import PythonPlayground from './pages/PythonPlayground';
import TypeScriptPlayground from './pages/TypeScriptPlayground';
import CPlayground from './pages/CPlayground';
import Profile from './pages/Profile';

function App() {
  useEffect(() => {
    const clickHandler = (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    };

    const inner = document.createElement('div');
    inner.className = 'custom-cursor-inner';
    const outer = document.createElement('div');
    outer.className = 'custom-cursor-outer';
    document.body.append(inner);
    document.body.append(outer);
    document.body.classList.add('custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outerX = mouseX;
    let outerY = mouseY;
    let animationFrame = null;

    const interactiveSelector = 'button, a, input, textarea, select, option, .navbar-link, .card-glass, .magnetic';

    const setHoverMode = (isHover) => {
      if (isHover) {
        document.body.classList.add('custom-cursor-hover');
      } else {
        document.body.classList.remove('custom-cursor-hover');
      }
    };

    const updateCursor = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;

      inner.style.left = `${mouseX}px`;
      inner.style.top = `${mouseY}px`;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;

      animationFrame = requestAnimationFrame(updateCursor);
    };

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const hoverTarget = e.target.closest(interactiveSelector);
      setHoverMode(Boolean(hoverTarget));

      const magnet = e.target.closest('.card-glass, .magnetic');
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = relY * 12;
        const rotateY = relX * -12;

        magnet.style.transform = `perspective(1000px) translateZ(0) translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        magnet.style.boxShadow = `0 18px 45px rgba(0,0,0,0.45), ${-relY*12}px ${relX*12}px 40px rgba(0,200,255,0.22)`; 

        const light = magnet.querySelector('.card-light');
        if (light) {
          const posX = 50 + relX * 40;
          const posY = 30 + relY * 40;
          light.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.35), transparent 60%)`;
        }
      }
    };

    const resetMagnet = (e) => {
      const magnet = e.target.closest('.card-glass, .magnetic');
      if (magnet) {
        magnet.style.transform = '';
        magnet.style.boxShadow = '';
      }
    };

    const onPointerDown = () => {
      inner.style.transform = 'translate(-50%, -50%) scale(0.7)';
      outer.style.transform = 'translate(-50%, -50%) scale(1.4)';
    };

    const onPointerUp = () => {
      inner.style.transform = 'translate(-50%, -50%) scale(1)';
      outer.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    const onMouseOver = (e) => {
      if (e.target.closest(interactiveSelector)) setHoverMode(true);
    };

    const onMouseOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelector)) setHoverMode(false);
      resetMagnet(e);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', clickHandler);

    updateCursor();

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('click', clickHandler);
      document.body.classList.remove('custom-cursor', 'custom-cursor-hover');
      inner.remove();
      outer.remove();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthCard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/playground" element={<Navigate to="/playground/javascript" replace />} />
        <Route path="/playground/javascript" element={<JavaScriptPlayground />} />
        <Route path="/playground/python" element={<PythonPlayground />} />
        <Route path="/playground/typescript" element={<TypeScriptPlayground />} />
        <Route path="/playground/c" element={<CPlayground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;