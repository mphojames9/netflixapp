const dns = require('node:dns');

// Force public DNS servers
dns.setServers(['1.1.1.1', '8.8.8.8']);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);

app.listen(5000, ()=>console.log("Server running on port 5000"));

const playlistRoutes = require("./routes/playlist");

app.use("/api/playlists", playlistRoutes);


// REMOVE MOVIE FROM PLAYLIST
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