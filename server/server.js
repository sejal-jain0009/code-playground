const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/run-python", (req, res) => {
  const code = req.body.code;
  console.log("Received Python code:", code);

  fs.writeFileSync("temp.py", code);

  exec("python temp.py", (error, stdout, stderr) => {
    const out = stdout ? stdout.trim() : "";
    const err = stderr ? stderr.trim() : "";

    console.log("Python stdout:", out);
    console.log("Python stderr:", err);

    if (error || err) {
      const message = err || error.message;
      return res.status(400).json({ error: message });
    }

    res.json({ output: out });
  });
});

app.post("/run-c", (req, res) => {
  const code = req.body.code;
  console.log("Received C code:", code);

  const sourceFile = "temp.c";
  const exeFile = process.platform === "win32" ? "temp.exe" : "temp";

  fs.writeFileSync(sourceFile, code);

  exec(`gcc ${sourceFile} -o ${exeFile}`, (compileError, compileStdout, compileStderr) => {
    const cOut = compileStdout ? compileStdout.trim() : "";
    const cErr = compileStderr ? compileStderr.trim() : "";

    console.log("C compile stdout:", cOut);
    console.log("C compile stderr:", cErr);

    if (compileError) {
      cleanupFiles(sourceFile, exeFile);
      return res.status(400).json({ error: cErr || compileError.message });
    }

    const runCmd = process.platform === "win32" ? `${exeFile}` : `./${exeFile}`;
    exec(runCmd, { timeout: 10000, maxBuffer: 1024 * 1024 }, (runError, runStdout, runStderr) => {
      const runOut = runStdout ? runStdout.trim() : "";
      const runErr = runStderr ? runStderr.trim() : "";

      console.log("C run stdout:", runOut);
      console.log("C run stderr:", runErr);

      cleanupFiles(sourceFile, exeFile);

      if (runError || runErr) {
        return res.status(400).json({ error: runErr || runError.message });
      }

      res.json({ output: runOut });
    });
  });
});

function cleanupFiles(source, executable) {
  try { if (fs.existsSync(source)) fs.unlinkSync(source); } catch (e) { console.warn("cleanup source error", e.message); }
  try { if (fs.existsSync(executable)) fs.unlinkSync(executable); } catch (e) { console.warn("cleanup exe error", e.message); }
}

app.listen(5000, () => {
  console.log("Server running on port 5000");
});