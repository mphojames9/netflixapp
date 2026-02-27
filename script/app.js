const API = "https://www.omdbapi.com/?apikey=a8cac9bd&";
const YT_KEY = "AIzaSyAzznNJmZPVU5uVX36c05CH2G8nuRuM3mI";

/* =========================
   CACHE SYSTEM
========================= */

const movieCache = {};
const trailerCache = {};
let currentMovieId = "";
let currentMoviePoster = "";

function isLoggedIn() {
  return !!localStorage.getItem("user");
}

/* Load saved trailer cache from localStorage */
const savedTrailerCache = localStorage.getItem("trailerCache");
if (savedTrailerCache) {
  Object.assign(trailerCache, JSON.parse(savedTrailerCache));
}

let heroMovies = [], heroIndex = 0, currentMovieTitle = "";

/* NAV SCROLL */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

/* HERO */
async function loadHero() {
  let res = await fetch(API + "s=avengers");
  let data = await res.json();
  heroMovies = data.Search || [];
  changeHero();
  setInterval(changeHero, 6000);
}
async function changeHero() {
  if (!heroMovies.length) return;
  let movie = heroMovies[heroIndex];
  let res = await fetch(API + "i=" + movie.imdbID);
  let m = await res.json();
  hero.style.backgroundImage =
    "linear-gradient(to top,#0b0b0b,transparent),url(" + m.Poster + ")";
  heroTitle.innerText = m.Title;
  heroPlot.innerText = m.Plot;
  heroIndex = (heroIndex + 1) % heroMovies.length;
}

/* CATEGORY */
async function loadCategory(title, keyword) {
  let res = await fetch(API + "s=" + keyword);
  let data = await res.json();
  if (!data.Search) return;

  content.innerHTML += `
<div class="section">
<h2 class="rowTitle">${title}</h2>
<div class="slider">
<button class="arrow left" onclick="scrollRow(this,-1)">❮</button>
<div class="sliderTrack">
${data.Search.map(m => cardHTML(m)).join("")}
</div>
<button class="arrow right" onclick="scrollRow(this,1)">❯</button>
</div>
</div>`;
}

/* CARD */
function cardHTML(m) {
  if (m.Poster === "N/A") return "";
  return `
<div class="card"
onmouseenter="hoverTrailer('${m.Title}','${m.imdbID}',this)"
onmouseleave="stopTrailer(this)">
<img src="${m.Poster}">
<div class="hoverPlayer"></div>
<div class="expandInfo">
<button class="playBtn"
onclick="event.stopPropagation();handlePlayClick('${m.imdbID}')">
${isLoggedIn() ? "▶ Play" : "Login to Play"}
</button>
<div class="meta">${m.Title}</div>
</div>
</div>`;
}

/* SCROLL */
function scrollRow(btn, dir) {
  let track = btn.parentElement.querySelector(".sliderTrack");
  track.scrollBy({ left: dir * 600, behavior: "smooth" });
}

/* SEARCH */
search.addEventListener("input", async e => {
  let q = e.target.value;
  if (q.length < 3) return;
  content.innerHTML = "";
  await loadCategory("Search Results", q);
});

async function openMovie(id) {

  let m;

  if (movieCache[id]) {
    m = movieCache[id];
  } else {
    let res = await fetch(API + "i=" + id);
    m = await res.json();
    movieCache[id] = m;
  }

  /* ✅ STORE MOVIE DATA GLOBALLY */
  currentMovieId = id;
  currentMovieTitle = m.Title;
  currentMoviePoster = m.Poster;

  /* UI */
  poster.src = m.Poster;
  title.innerText = m.Title;
  year.innerText = m.Year + " • " + m.Genre;
  rating.innerText = "⭐ " + m.imdbRating;
  plot.innerText = m.Plot;

  modal.style.display = "flex";
}
function applyPlayLockState() {

  document.querySelectorAll(".playBtn").forEach(btn => {

    if (!isLoggedIn()) {
      btn.classList.add("locked");
      btn.textContent = "Login to Play";
    } else {
      btn.classList.remove("locked");
      btn.textContent = "▶ Play";
    }

  });

} 


function closeModal() { modal.style.display = "none" }

async function playTrailer() {

  try {

    let search = currentMovieTitle + " official trailer";

    /* 1️⃣ Check trailer cache */
    let videoId = trailerCache[search];

    if (!videoId) {

      let res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(search)}&key=${YT_KEY}`
      );

      if (!res.ok) throw new Error("YT API error");

      let data = await res.json();
      videoId = data.items?.[0]?.id?.videoId;

      if (!videoId) return;

      /* 1 Save in memory cache */
      trailerCache[search] = videoId;

      /* 3 Save in localStorage */
      localStorage.setItem("trailerCache", JSON.stringify(trailerCache));
    }

    /* 4 Play */
    trailerFrame.src =
      `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    trailerModal.style.display = "flex";

  } catch (err) {
    console.error("Trailer error:", err);
  }

}

function closeTrailer() {
  trailerModal.style.display = "none";
  trailerFrame.src = "";
}

async function hoverTrailer(title, id, card) {

  let player = card.querySelector(".hoverPlayer");
  player.style.display = "block";

  let search = title + " official trailer";

  let videoId = trailerCache[search];

  if (!videoId) {

    let res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(search)}&key=${YT_KEY}`
    );

    let data = await res.json();
    videoId = data.items?.[0]?.id?.videoId;

    if (!videoId) return;

    trailerCache[search] = videoId;
    localStorage.setItem("trailerCache", JSON.stringify(trailerCache));
  }

  player.innerHTML =
    `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0"></iframe>`;
}

function stopTrailer(card) {
  let player = card.querySelector(".hoverPlayer");
  player.innerHTML = "";
  player.style.display = "none";
}

/* CONTINUE WATCHING */
function loadContinue() {
  let m = JSON.parse(localStorage.getItem("lastMovie"));
  if (!m) return;
  content.innerHTML += `
<div class="section">
<h2>Continue Watching</h2>
<div class="sliderTrack">${cardHTML(m)}</div>
</div>`;
}

/* HERO BUTTON */
function scrollToContent() {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
}

/* ESC KEY */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeTrailer();
  }
});

/* INIT */
loadHero();
loadContinue();
loadCategory("Trending Now", "movie");
loadCategory("Action", "action");
loadCategory("Comedy", "comedy");
loadCategory("Sci-Fi", "sci-fi");

async function savePlaylist() {

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch("http://localhost:5000/api/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        userId: user.id,
        name: "My Playlist",
        movies: [
          {
            imdbID: currentMovieId,
            title: currentMovieTitle,
            poster: currentMoviePoster
          }
        ]
      })
    });


    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    if (res.ok) {
      showToast(
        "Added to Playlist",
        `${currentMovieTitle} is now in My Playlist 🎬`
      );
    } else {
      showToast(
        "Failed",
        data.message || "Could not save movie",
        "error"
      );
    }

  } catch (err) {
    console.error("FRONTEND ERROR:", err);
    showToast("Network Error", "Server not reachable", "error");
  }
}

const overlay = document.getElementById("playlistOverlay");
const grid = document.getElementById("playlistGrid");
const openBtn = document.getElementById("openMyList");
const closeBtn = document.getElementById("closePlaylist");

/* Open Overlay */
openBtn.onclick = async () => {
  overlay.style.display = "flex";
  loadPlaylists();
};

/* Close Overlay */
closeBtn.onclick = () => {
  overlay.style.display = "none";
};

/* ESC close */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") overlay.style.display = "none";
});

/* Load Playlists */
async function loadPlaylists() {

  grid.innerHTML = "Loading...";

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(`http://localhost:5000/api/playlists/${user.id}`);
    const playlists = await res.json();

    grid.innerHTML = "";

    playlists.forEach(pl => {
      pl.movies.forEach(movie => {

        grid.innerHTML += `
  <div class="playlistCard">
    <img src="${movie.poster}" onclick="openMovie('${movie.imdbID}')">
    
    <button 
      class="removeBtn"
      onclick="removeMovie(event,'${pl._id}','${movie.imdbID}', this)">
      ✕
    </button>

    <div class="playlistCardTitle">${movie.title}</div>
  </div>
`;

      });
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "Failed to load playlists";
  }
}

async function removeMovie(e, playlistId, imdbID, btn) {

  e.stopPropagation(); // prevent opening movie

  if (btn.disabled) return;
  btn.disabled = true;

  try {

    const res = await fetch(
      `http://localhost:5000/api/playlists/${playlistId}/${imdbID}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Smooth UI removal (Netflix style)
    const card = btn.closest(".playlistCard");
    card.style.transition = "0.3s ease";
    card.style.transform = "scale(0.8)";
    card.style.opacity = "0";

    setTimeout(() => card.remove(), 300);

  } catch (err) {
    console.error("REMOVE FRONTEND ERROR:", err);
    btn.disabled = false;
    alert("Failed to remove movie");
  }
}

function showToast(title, message) {
  const toast = document.getElementById("netflixToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function handlePlayClick(id) {

  if (!isLoggedIn()) {

    showToast("Login Required", "Please login to play this movie 🎬");

    // Optional: open login modal here
    // showLoginModal();

    return;
  }

  openMovie(id);
}

function refreshPlayButtons() {

  document.querySelectorAll(".playBtn").forEach(btn => {

    if (isLoggedIn()) {
      btn.textContent = "▶ Play";
    } else {
      btn.textContent = "Login to Play";
    }

  });

}

applyPlayLockState();
refreshPlayButtons();