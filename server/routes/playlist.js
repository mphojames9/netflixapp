const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");

// Create playlist
router.post("/", async (req, res) => {
  try {
    const { userId, name, movies } = req.body;

    const newPlaylist = new Playlist({
      userId,
      name,
      movies
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user playlists
router.get("/:userId", async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.params.userId });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;