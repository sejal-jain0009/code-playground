require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Debug logging: confirm requests hit server and show body payload
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    query: req.query,
    body: req.body,
    headers: {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent'],
    },
  });
  next();
});

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.post('/signup', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn('Signup attempt with empty body');
      return res.status(400).json({ message: 'Request body is required.' });
    }

    const { name, email, password } = req.body;
    console.log('Signup data received:', { name, email, password: password ? '***' : '' });

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password: hash });
    await user.save();

    return res.status(201).json({ message: 'Signup successful.', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error in /signup:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'Auth server healthy' });
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error in /login:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/run-python', (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Python code is required.' });
    }

    const tempFilePath = path.join(__dirname, 'temp.py');
    fs.writeFileSync(tempFilePath, code, 'utf8');

    exec(
      `python "${tempFilePath}"`,
      { timeout: 10000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const isTimeout = error.killed || error.signal === 'SIGTERM' || error.signal === 'SIGKILL';
          const message = isTimeout
            ? 'Execution timed out.'
            : error.message || 'Unknown runtime error.';

          console.error('Python execution error:', message, stderr);
          return res.status(500).json({ error: message, stderr: stderr || '', stdout: stdout || '' });
        }

        return res.json({ stdout: stdout || '', stderr: stderr || '' });
      }
    );
  } catch (err) {
    console.error('Error in /run-python:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Auth server running.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
