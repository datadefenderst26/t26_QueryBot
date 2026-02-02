import express from 'express';
import db from "./db.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // OPTIONAL role check
    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


