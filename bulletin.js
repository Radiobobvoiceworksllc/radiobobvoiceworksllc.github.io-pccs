// ==========================
// 🌐 GLOBAL STATE
// ==========================
let allBulletins = [];
let currentGroup = "";
let currentSubgroup = "";
let sortOrder = "newest"; // default

// ==========================
// 📅 SORT FUNCTION
// ==========================
function sortBulletins(data) {
  return data.sort((a, b) => {
    const dateA = new Date(a.date || "2000-01-01");
    const dateB = new Date(b.date || "2000-01-01");

    return sortOrder === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });
}

// ==========================
// ⏰ REMOVE EXPIRED BULLETINS
// ==========================
function removeExpiredBulletins(data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  return data.filter(item => {
    if (!item.expirationDate) return true;

    const expiration = new Date(item.expirationDate);
    expiration.setHours(23, 59, 59, 999); // end of expiration day

    return expiration >= today;
  });
}

// ==========================
// 🔽 FETCH BULLETIN DATA
// ==========================
async function fetchBulletins() {
  try {
    const response = await fetch("bulletins.json"); // or Google Sheets endpoint
    const data = await response.json();

    allBulletins = data;

    applyFiltersAndRender();
  } catch (error) {
    console.error("Error loading bulletins:", error);
  }
}

// ==========================
// 🎯 FILTER + SORT + EXPIRE
// ==========================
function applyFiltersAndRender() {
  let filtered = allBulletins;

  // Filter by group
  if (currentGroup) {
    filtered = filtered.filter(item => item.group === currentGroup);
  }

  // Filter by subgroup
  if (currentSubgroup) {
    filtered = filtered.filter(item => item.subgroup === currentSubgroup);
  }

  // Remove expired items
  filtered = removeExpiredBulletins(filtered);

  // Apply sorting
  filtered = sortBulletins(filtered);

  renderBulletins(filtered);
}

// ==========================
// 🧱 RENDER BULLETINS
// ==========================
function renderBulletins(data) {
  const container = document.getElementById("bulletinList"); // ✅ MATCHES YOUR HTML
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No current bulletins.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "bulletin-card";

    card.innerHTML = `
      <h3>${item.title}</h3>
      ${item.description ? `<p>${item.description}</p>` : ""}
      <small>${formatDate(item.date)}</small>
    `;

    container.appendChild(card);
  });
}

// ==========================
// 📅 FORMAT DATE DISPLAY
// ==========================
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// ==========================
// 🎛️ SET FILTER
// ==========================
function setFilter(group = "", subgroup = "") {
  currentGroup = group;
  currentSubgroup = subgroup;

  applyFiltersAndRender();
}

// ==========================
// 🔄 RESET FILTERS
// ==========================
function resetFilters() {
  currentGroup = "";
  currentSubgroup = "";

  applyFiltersAndRender();
}

// ==========================
// 🔁 TOGGLE SORT ORDER
// ==========================
function toggleSort() {
  sortOrder = sortOrder === "newest" ? "oldest" : "newest";

  const btn = document.getElementById("sort-button");

  if (btn) {
    btn.textContent =
      sortOrder === "newest"
        ? "Sort: Newest First"
        : "Sort: Oldest First";
  }

  applyFiltersAndRender();
}

// ==========================
// 🚀 INITIAL PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  fetchBulletins();

  const btn = document.getElementById("sort-button");
  if (btn) {
    btn.textContent = "Sort: Newest First";
  }
});