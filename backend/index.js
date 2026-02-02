import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './auth.js'; // ✅ matches your file

const app = express();

// =======================
// MIDDLEWARE (ORDER MATTERS)
// =======================

// CORS — REQUIRED
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true
}));

// JSON parser
app.use(express.json());

// Cookie parser (for credentials: include)
app.use(cookieParser());

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// =======================
// SERVER
// =======================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

