import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultTemplates = {
  JavaScript: "// Write your code here\nconsole.log(\"Hello World\");",
  Python: "# Write your code here\nprint(\"Hello World\")",
  TypeScript: "// Write your code here\nconsole.log(\"Hello World\");",
  C: "// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
};

const languageDescriptions = {
  JavaScript: 'Write JavaScript code, execute it in the browser, and inspect the result immediately.',
  Python: 'Write Python code and test your logic using sample inputs.',
  TypeScript: 'Write TypeScript code with type safety and modern JavaScript features.',
  C: 'Write C code and execute it.',
};

export default function Playground() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(defaultTemplates.JavaScript);
  const [output, setOutput] = useState('');

  const runCode = () => {
    if (language !== 'JavaScript') {
      setOutput(`Only JavaScript execution is currently supported in this playground. You selected ${language}.`);
      return;
    }

    const logs = [];
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      logs.push(args.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' '));
      originalConsoleLog(...args);
    };

    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      if (logs.length > 0) {
        if (result !== undefined && result !== null) {
          logs.push(`=> ${result}`);
        }
        setOutput(logs.join('\n'));
      } else {
        setOutput(result === undefined ? 'undefined' : String(result));
      }
    } catch (err) {
      setOutput(`Error: ${(err && err.message) || err}`);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  const clearAll = () => {
    setCode('');
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
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                setCode(defaultTemplates[newLang]);
                setOutput('');
              }}
              className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="C">C</option>
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
            <h2 className="text-2xl font-bold text-cyan-300">{language} Code Playground</h2>
            <p className="mt-1 text-sm text-slate-300">
              {languageDescriptions[language]} This sandbox is ideal for quick experiments and debugging.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="editor">
              Editor
            </label>
            <textarea
              id="editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-72 w-full resize-none rounded-2xl border border-white/20 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
            />

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <h3 className="text-lg font-semibold text-cyan-300">Output</h3>
              <pre className="mt-2 h-40 overflow-auto rounded-lg border border-white/10 bg-black/60 p-3 text-sm text-green-300">{output || 'Output will appear here...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
