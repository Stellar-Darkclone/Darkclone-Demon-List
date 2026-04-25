// ================================================
// Darkclone Demon Lists - Clean Script
// ================================================

// Orientation warning
function checkOrientation() {
  const warning = document.getElementById("landscape-warning");
  if (warning) {
    warning.style.display = (window.innerHeight > window.innerWidth) ? "block" : "none";
  }
}
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

// Secret rickroll (3 taps)
let tapCount = 0;
let tapTimer;
document.addEventListener("DOMContentLoaded", () => {
  const secretText = document.getElementById("secret-text");
  if (secretText) {
    secretText.addEventListener("click", () => {
      tapCount++;
      if (tapCount === 3) {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        tapCount = 0;
        return;
      }
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => tapCount = 0, 1200);
    });
  }
});

// ================================================
// IMPROVED SEARCH WITH 3-SECOND HIGHLIGHT
// ================================================
function doSearch(query) {
  if (!query) return;
  const q = query.toLowerCase().trim();

  const items = Array.from(document.querySelectorAll('ul.clean li'));
  document.querySelectorAll('.search-highlight').forEach(el => el.classList.remove('search-highlight'));

  const found = items.find(li => li.textContent.toLowerCase().includes(q));

  if (found) {
    const yOffset = -140;
    const y = found.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    found.classList.add('search-highlight');
    setTimeout(() => found.classList.remove('search-highlight'), 3000);
  } else {
    alert(`No match found for: "${query}"`);
  }
}

// Initialize search on both index and list pages
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const button = document.getElementById('searchBtn');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      doSearch(input ? input.value : '');
    });
  }

  if (button) {
    button.addEventListener('click', e => {
      e.preventDefault();
      doSearch(input ? input.value : '');
    });
  }
});

// ================================================
// Auto count completed demons (for index.html)
// ================================================
async function getCompletedCount(page) {
  try {
    const res = await fetch(page);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const section = doc.querySelector("#completed");
    return section ? section.querySelectorAll("li").length : 0;
  } catch (e) {
    console.error("Count error:", e);
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const extremeEl = document.getElementById("extreme-count");
  const insaneEl = document.getElementById("insane-count");

  if (extremeEl || insaneEl) {
    const [extremeCount, insaneCount] = await Promise.all([
      getCompletedCount("extreme.html"),
      getCompletedCount("insane.html")
    ]);

    if (extremeEl) extremeEl.textContent = `Completed extremes: ${extremeCount}`;
    if (insaneEl) insaneEl.textContent = `Completed insanes: ${insaneCount}`;
  }
});

// ================================================
// Mobile Hamburger Menu
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});

// Live reload (optional, safe)
console.log("%c✅ Darkclone Demon Lists script loaded", "color: #a855f7; font-weight: bold");
