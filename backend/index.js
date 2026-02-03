import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./auth.js";
import favoritesRoutes from "./favorites.js";

const app = express(); // ✅ app MUST come before app.use
const PORT = 5000;

/* ========= MIDDLEWARE ========= */

// CORS (allow all during dev)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

/* ========= ROUTES ========= */

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes); // ✅ moved here (FIX)

app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

/* ========= SERVER ========= */

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
