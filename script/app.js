const API="https://www.omdbapi.com/?apikey=a8cac9bd&";
const YT_KEY="AIzaSyAzznNJmZPVU5uVX36c05CH2G8nuRuM3mI";

/* =========================
   CACHE SYSTEM
========================= */

const movieCache = {};
const trailerCache = {};

/* Load saved trailer cache from localStorage */
const savedTrailerCache = localStorage.getItem("trailerCache");
if(savedTrailerCache){
  Object.assign(trailerCache, JSON.parse(savedTrailerCache));
}

let heroMovies=[],heroIndex=0,currentMovieTitle="";

/* NAV SCROLL */
window.addEventListener("scroll",()=>{
navbar.classList.toggle("scrolled",window.scrollY>50);
});

/* HERO */
async function loadHero(){
let res=await fetch(API+"s=avengers");
let data=await res.json();
heroMovies=data.Search||[];
changeHero();
setInterval(changeHero,6000);
}
async function changeHero(){
if(!heroMovies.length) return;
let movie=heroMovies[heroIndex];
let res=await fetch(API+"i="+movie.imdbID);
let m=await res.json();
hero.style.backgroundImage=
"linear-gradient(to top,#0b0b0b,transparent),url("+m.Poster+")";
heroTitle.innerText=m.Title;
heroPlot.innerText=m.Plot;
heroIndex=(heroIndex+1)%heroMovies.length;
}

/* CATEGORY */
async function loadCategory(title,keyword){
let res=await fetch(API+"s="+keyword);
let data=await res.json();
if(!data.Search) return;

content.innerHTML+=`
<div class="section">
<h2 class="rowTitle">${title}</h2>
<div class="slider">
<button class="arrow left" onclick="scrollRow(this,-1)">❮</button>
<div class="sliderTrack">
${data.Search.map(m=>cardHTML(m)).join("")}
</div>
<button class="arrow right" onclick="scrollRow(this,1)">❯</button>
</div>
</div>`;
}

/* CARD */
function cardHTML(m){
if(m.Poster==="N/A") return "";
return `
<div class="card"
onmouseenter="hoverTrailer('${m.Title}','${m.imdbID}',this)"
onmouseleave="stopTrailer(this)">
<img src="${m.Poster}">
<div class="hoverPlayer"></div>
<div class="expandInfo">
<button class="playBtn"
onclick="event.stopPropagation();openMovie('${m.imdbID}')">
▶ Play
</button>
<div class="meta">${m.Title}</div>
</div>
</div>`;
}

/* SCROLL */
function scrollRow(btn,dir){
let track=btn.parentElement.querySelector(".sliderTrack");
track.scrollBy({left:dir*600,behavior:"smooth"});
}

/* SEARCH */
search.addEventListener("input",async e=>{
let q=e.target.value;
if(q.length<3) return;
content.innerHTML="";
await loadCategory("Search Results",q);
});

async function openMovie(id){

let m;

/* 1️⃣ Check memory cache first */
if(movieCache[id]){
  m = movieCache[id];
}

/* 2️⃣ Otherwise fetch and cache */
else{
  let res = await fetch(API+"i="+id);
  m = await res.json();
  movieCache[id] = m;
}

currentMovieTitle = m.Title;

poster.src = m.Poster;
title.innerText = m.Title;
year.innerText = m.Year+" • "+m.Genre;
rating.innerText = "⭐ "+m.imdbRating;
plot.innerText = m.Plot;

modal.style.display="flex";

/* Continue Watching */
localStorage.setItem("lastMovie",JSON.stringify(m));
}

function closeModal(){modal.style.display="none"}

async function playTrailer(){

try{

let search = currentMovieTitle+" official trailer";

/* 1️⃣ Check trailer cache */
let videoId = trailerCache[search];

if(!videoId){

  let res = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(search)}&key=${YT_KEY}`
  );

  if(!res.ok) throw new Error("YT API error");

  let data = await res.json();
  videoId = data.items?.[0]?.id?.videoId;

  if(!videoId) return;

  /* 1 Save in memory cache */
  trailerCache[search] = videoId;

  /* 3 Save in localStorage */
  localStorage.setItem("trailerCache", JSON.stringify(trailerCache));
}

/* 4 Play */
trailerFrame.src =
`https://www.youtube.com/embed/${videoId}?autoplay=1`;

trailerModal.style.display="flex";

}catch(err){
console.error("Trailer error:",err);
}

}

function closeTrailer(){
trailerModal.style.display="none";
trailerFrame.src="";
}

async function hoverTrailer(title,id,card){

let player = card.querySelector(".hoverPlayer");
player.style.display="block";

let search = title+" official trailer";

let videoId = trailerCache[search];

if(!videoId){

  let res = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(search)}&key=${YT_KEY}`
  );

  let data = await res.json();
  videoId = data.items?.[0]?.id?.videoId;

  if(!videoId) return;

  trailerCache[search] = videoId;
  localStorage.setItem("trailerCache", JSON.stringify(trailerCache));
}

player.innerHTML =
`<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0"></iframe>`;
}

function stopTrailer(card){
let player=card.querySelector(".hoverPlayer");
player.innerHTML="";
player.style.display="none";
}

/* CONTINUE WATCHING */
function loadContinue(){
let m=JSON.parse(localStorage.getItem("lastMovie"));
if(!m) return;
content.innerHTML+=`
<div class="section">
<h2>Continue Watching</h2>
<div class="sliderTrack">${cardHTML(m)}</div>
</div>`;
}

/* HERO BUTTON */
function scrollToContent(){
window.scrollTo({top:window.innerHeight,behavior:"smooth"});
}

/* ESC KEY */
document.addEventListener("keydown",e=>{
if(e.key==="Escape"){
closeModal();
closeTrailer();
}
});

/* INIT */
loadHero();
loadContinue();
loadCategory("Trending Now","movie");
loadCategory("Action","action");
loadCategory("Comedy","comedy");
loadCategory("Sci-Fi","sci-fi");