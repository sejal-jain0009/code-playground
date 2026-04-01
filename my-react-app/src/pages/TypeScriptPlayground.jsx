import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TypeScriptPlayground() {
  const navigate = useNavigate();
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World");');
  const [output, setOutput] = useState('');

  const transpileTypeScript = (tsCode) => {
    // Remove basic type annotations from variable declarations and function parameters
    let jsCode = tsCode
      .replace(/:\s*(number|string|boolean|any|unknown|void|object|Array<.*?>|\w+)/g, '')
      .replace(/<\w+>/g, '')
      .replace(/\sas\s+\w+/g, '');

    // Remove interface/type declarations entirely
    jsCode = jsCode.replace(/(?:interface|type)\s+[^\n{]+\{[^}]*\}/g, '');

    return jsCode;
  };

  const runCode = () => {
    const jsCode = transpileTypeScript(code);
    let logs = [];
    const originalLog = console.log;

    console.log = (...args) => {
      logs.push(args.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' '));
      originalLog(...args);
    };

    try {
      const result = eval(jsCode); // eslint-disable-line no-eval

      if (logs.length > 0) {
        setOutput(logs.join('\n') + (result !== undefined ? `\n=> ${result}` : ''));
      } else if (result !== undefined) {
        setOutput(`=> ${result}`);
      } else {
        setOutput('No output from execution.');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      console.log = originalLog;
    }
  };

  const clearAll = () => {
    setCode('// Write your code here\nconsole.log("Hello World");');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
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
              value="typescript"
              onChange={(e) => navigate(`/playground/${e.target.value}`)}
              className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
            </select>
            <button
              onClick={runCode}
              className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-400"
            >
              Run Code
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
            <h2 className="text-2xl font-bold text-cyan-300">TypeScript Code Playground</h2>
            <p className="mt-1 text-sm text-slate-300">
              Write TypeScript code with type safety and modern JavaScript features.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="editor-ts">
              Editor
            </label>
            <textarea
              id="editor-ts"
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
