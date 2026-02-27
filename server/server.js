/* ================================
   NETFLIX APP - PRODUCTION SERVER
   Render.com Ready
================================ */

const dns = require("node:dns");

// Force public DNS (fixes Mongo Atlas DNS issues on Render)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const playlistRoutes = require("./routes/playlist");
const Playlist = require("./models/Playlist");

const app = express();

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

/* ================================
   DATABASE
================================ */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("Mongo Error:", err);
    process.exit(1);
  });

/* ================================
   API ROUTES
================================ */

app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistRoutes);

/* REMOVE MOVIE FROM PLAYLIST */
app.delete("/api/playlists/:playlistId/:imdbID", async (req, res) => {
  try {
    const { playlistId, imdbID } = req.params;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { movies: { imdbID } } },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json({ message: "Movie removed successfully" });

  } catch (err) {
    console.error("REMOVE ERROR:", err);
    res.status(500).json({ message: "Server error removing movie" });
  }
});

/* ================================
   SERVE FRONTEND (IMPORTANT)
================================ */



/* Serve frontend */
app.use(express.static(path.join(__dirname, "../src")));

/* Serve JS folder */
app.use("/script", express.static(path.join(__dirname, "../script")));

/* SPA fallback */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../src", "index.html"));
});
/* ================================
   PORT (RENDER REQUIRES THIS)
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});