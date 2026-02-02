import express from 'express';
import cors from 'cors';
import authRoutes from './auth.js';

const PORT = 5000;

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
