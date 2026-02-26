const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  movies: [
    {
      imdbID: String,
      title: String,
      poster: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Playlist", playlistSchema);