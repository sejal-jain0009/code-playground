import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../pages/CodeEditor';

export default function PythonPlayground() {
  const navigate = useNavigate();
  const [code, setCode] = useState('# Write your code here\nprint("Hello World")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');

    try {
      const response = await fetch('http://localhost:5000/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = (errData && (errData.error || errData.message)) || `HTTP error ${response.status}`;
        setOutput(`Error: ${message}`);
        return;
      }

      console.log('response', response);
      const data = await response.json();
      console.log('Python response data:', data);

      if (data.error) {
        setOutput(`Error: ${data.error}`);
        return;
      }

      if (data.output) {
        setOutput(data.output);
        return;
      }

      setOutput('No output.');
    } catch (error) {
      console.error('Python run error:', error);
      setOutput(`Unexpected error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setCode('# Write your code here\nprint("Hello World")');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 page-transition">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between rounded-t-3xl bg-slate-900/95 px-6 py-4">
          <button
            onClick={() => navigate('/home')}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <select
              value="python"
              onChange={(e) => navigate(`/playground/${e.target.value}`)}
              className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="c">C</option>
            </select>
            <button
              onClick={runCode}
              disabled={isLoading}
              className={`rounded-lg px-4 py-2 font-semibold text-slate-950 transition ${isLoading ? 'bg-slate-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`}
            >
              {isLoading ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Clear Code
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-[1fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <h2 className="text-2xl font-bold text-cyan-300">Python Code Playground</h2>
            <p className="mt-1 text-sm text-slate-300">Write Python code and test your logic using sample inputs.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="editor-python">
              Editor
            </label>
            <CodeEditor
              id="editor-python"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-72 w-full resize-none rounded-2xl border border-white/20 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
            />

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <h3 className="text-lg font-semibold text-cyan-300">Output</h3>
              <pre className="mt-2 h-40 overflow-auto rounded-lg border border-white/10 bg-black/60 p-3 text-sm text-green-300">
                {output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
