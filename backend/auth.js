import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const router = express.Router();
const JWT_SECRET = 'dev_secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    'SELECT id, email, password, role FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: { email: user.email, role: user.role }
  });
});

export default router;
