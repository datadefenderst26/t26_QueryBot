import express from "express";
import db from "./db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//  auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//  Add favorite
router.post("/add", auth, (req, res) => {
  const { query_name, route } = req.body;

  db.query(
    "INSERT INTO favorites (user_id, query_name, route) VALUES (?, ?, ?)",
    [req.user.id, query_name, route],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Get favorites
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, query_name, route FROM favorites WHERE user_id = ?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

export default router;
