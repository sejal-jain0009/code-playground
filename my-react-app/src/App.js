import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthCard from './pages/AuthCard';
import Home from './pages/Home';
import JavaScriptPlayground from './pages/JavaScriptPlayground';
import PythonPlayground from './pages/PythonPlayground';
import TypeScriptPlayground from './pages/TypeScriptPlayground';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthCard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/playground" element={<Navigate to="/playground/javascript" replace />} />
        <Route path="/playground/javascript" element={<JavaScriptPlayground />} />
        <Route path="/playground/python" element={<PythonPlayground />} />
        <Route path="/playground/typescript" element={<TypeScriptPlayground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
