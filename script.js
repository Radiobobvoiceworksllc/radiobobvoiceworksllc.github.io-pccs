//		  const API_KEY = "AIzaSyBKdJ_Q1VJrQTOAWC1ESTZtmE4n-_X_n_M";
// ==========================
// 🚀 PAGE LOAD
// ==========================
window.addEventListener("load", function () {

  // ==========================
  // 🔧 CONFIG
  // ==========================
  const playlistId = "PL8GurXRLQoIoVjgkspWG1zlBEMwcJ6vmu";
  const API_KEY = "AIzaSyBKdJ_Q1VJrQTOAWC1ESTZtmE4n-_X_n_M"; // 🔴 ADD YOUR KEY
  const CHANNEL_ID = "UCaQ1U8g7kZy2J7Fv8Q0kW8A";

  // ==========================
  // 🎯 ELEMENTS
  // ==========================
  const mainVideo = document.getElementById("mainVideo");
  const videoGrid = document.getElementById("videoGrid");
  const liveBadge = document.getElementById("liveBadge");

  if (!mainVideo || !videoGrid) {
    console.error("Missing elements");
    return;
  }

  // ==========================
  // 🧠 STATE TRACKING
  // ==========================
  let defaultVideoId = null; // first playlist video
  let currentLiveVideoId = null; // active live video

  // ==========================
  // 📡 LOAD PLAYLIST VIDEOS
  // ==========================
  async function loadPlaylist() {
    try {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${playlistId}&key=${API_KEY}`;

      const res = await fetch(playlistUrl);
      const data = await res.json();

      const items = data.items;

      if (!items || items.length === 0) {
        console.error("No videos found");
        return;
      }

      videoGrid.innerHTML = "";

      // 🎬 Set default video
      defaultVideoId = items[0].snippet.resourceId.videoId;
      mainVideo.src = `https://www.youtube.com/embed/${defaultVideoId}?rel=0`;

      // 🧱 Build video grid
      items.forEach(item => {
        if (!item.snippet || !item.snippet.resourceId) return;

        const videoId = item.snippet.resourceId.videoId;

        const card = document.createElement("div");
        card.className = "video-card";

        const img = document.createElement("img");
        img.src = item.snippet.thumbnails.medium.url;

        const title = document.createElement("p");
        title.textContent = item.snippet.title;

        card.onclick = () => {
          mainVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        };

        card.appendChild(img);
        card.appendChild(title);
        videoGrid.appendChild(card);
      });

    } catch (err) {
      console.error("Playlist error:", err);
    }
  }

  // ==========================
  // 🔴 CHECK LIVE STATUS
  // ==========================
  async function checkLiveAndOverride() {
    try {
      const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;

      const res = await fetch(liveUrl);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const liveVideoId = data.items[0].id.videoId;

        // Only update if NEW live detected
        if (liveVideoId !== currentLiveVideoId) {
          currentLiveVideoId = liveVideoId;

          // Show badge
          if (liveBadge) {
            liveBadge.style.display = "block";
          }

          // Switch to live stream
          mainVideo.src = `https://www.youtube.com/embed/${liveVideoId}?autoplay=1`;
        }

      } else {
        // 🔁 LIVE HAS ENDED

        if (currentLiveVideoId !== null) {
          currentLiveVideoId = null;

          // Hide badge
          if (liveBadge) {
            liveBadge.style.display = "none";
          }

          // Restore default video
          if (defaultVideoId) {
            mainVideo.src = `https://www.youtube.com/embed/${defaultVideoId}`;
          }
        }
      }

    } catch (err) {
      console.error("Live check error:", err);
    }
  }

  // ==========================
  // 🚀 INIT
  // ==========================
  async function init() {
    await loadPlaylist();        // load videos first
    await checkLiveAndOverride(); // check live immediately

    // 🔁 CHECK EVERY 60 SECONDS
    setInterval(() => {
      checkLiveAndOverride();
    }, 60000);
  }

  init();
});


// ==========================
// 🖼️ CAROUSEL LOGIC
// ==========================
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-slide");

  if (slides.length === 0) return;

  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

setInterval(() => {
  const slides = document.querySelectorAll(".carousel-slide");

  if (slides.length === 0) return;

  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);

}, 4000);