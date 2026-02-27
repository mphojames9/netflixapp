const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");

/* ===============================
   CREATE OR ADD TO PLAYLIST
================================= */
router.post("/", async (req, res) => {
  try {
    const { userId, name, movies } = req.body;

    // Check if playlist already exists for this user + name
    let playlist = await Playlist.findOne({ userId, name });

    if (playlist) {
      // Add movie only if it doesn't already exist
      const movie = movies[0];

      const alreadyExists = playlist.movies.some(
        m => m.imdbID === movie.imdbID
      );

      if (!alreadyExists) {
        playlist.movies.push(movie);
        await playlist.save();
      }

      return res.status(200).json(playlist);
    }

    // If playlist doesn't exist, create it
    const newPlaylist = new Playlist({
      userId,
      name,
      movies
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);

  } catch (err) {
    console.error("CREATE PLAYLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===============================
   GET USER PLAYLISTS
================================= */
router.get("/:userId", async (req, res) => {
  try {
    const playlists = await Playlist.find({
      userId: req.params.userId
    });

    res.json(playlists);

  } catch (err) {
    console.error("GET PLAYLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===============================
   REMOVE MOVIE FROM PLAYLIST
================================= */
router.delete("/:playlistId/:imdbID", async (req, res) => {
  try {

    const { playlistId, imdbID } = req.params;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { movies: { imdbID: imdbID } } },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json({
      message: "Movie removed successfully",
      playlist
    });

  } catch (err) {
    console.error("REMOVE ERROR:", err);
    res.status(500).json({
      message: "Server error removing movie"
    });
  }
});

module.exports = router;