// ================================================
// Geometry Dash Demon Lists - Script.js
// ================================================

// Basic search filter (kept for compatibility)
function filterList(inputId, listId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  const items = document.querySelectorAll(`#${listId} li`);
  items.forEach(li => {
    const txt = li.textContent.toLowerCase();
    li.style.display = txt.includes(q) ? "" : "none";
  });
}

// Orientation warning
function checkOrientation() {
  const warning = document.getElementById("landscape-warning");
  if (warning) {
    if (window.innerHeight > window.innerWidth) {
      warning.style.display = "block";
    } else {
      warning.style.display = "none";
    }
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

// Secret rickroll (3 taps)
document.addEventListener("DOMContentLoaded", () => {
  let tapCount = 0;
  let tapTimer;

  const secretText = document.getElementById("secret-text");
  if (secretText) {
    secretText.addEventListener("click", () => {
      tapCount++;

      if (tapCount === 3) {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        tapCount = 0;
        clearTimeout(tapTimer);
        return;
      }

      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 1200);
    });
  }
});

// ================================================
// IMPROVED SEARCH WITH HIGHLIGHT + SMOOTH SCROLL
// ================================================
(function() {
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function doSearch(query) {
    if (!query) return;

    const q = normalize(query);
    const items = Array.from(document.querySelectorAll('ul.clean li'));

    // Remove previous highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('search-highlight');
    });

    const found = items.find(li => normalize(li.innerText).includes(q));

    if (found) {
      // Smooth scroll with offset
      const yOffset = -140; // space for sticky header
      const y = found.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Highlight for 3 seconds
      found.classList.add('search-highlight');

      setTimeout(() => {
        found.classList.remove('search-highlight');
      }, 3000);
    } else {
      alert(`No match found for: "${query}"`);
    }
  }

  function initSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchBtn');

    if (form && input) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        doSearch(input.value);
      });

      if (button) {
        button.addEventListener('click', e => {
          e.preventDefault();
          doSearch(input.value);
        });
      }
    }
  }

  // Initialize search when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();

// ================================================
// Auto count completed demons on index.html
// ================================================
async function getCompletedCount(page) {
  try {
    const response = await fetch(page);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const completedSection = doc.querySelector("#completed");

    if (completedSection) {
      return completedSection.querySelectorAll("li").length;
    }
    return 0;
  } catch (err) {
    console.error("Error loading " + page, err);
    return 0;
  }
}

async function updateCounters() {
  const extremeCount = await getCompletedCount("extreme.html");
  const insaneCount = await getCompletedCount("insane.html");

  const extremeEl = document.getElementById("extreme-count");
  const insaneEl = document.getElementById("insane-count");

  if (extremeEl) extremeEl.textContent = `Completed extremes: ${extremeCount}`;
  if (insaneEl) insaneEl.textContent = `Completed insanes: ${extremeCount}`;
}

document.addEventListener("DOMContentLoaded", updateCounters);

// ================================================
// Live Reload (for development)
// ================================================
(function(){
  try {
    const meta = document.querySelector('meta[name="live-reload-files"]');
    const files = meta ? meta.content.split(',').map(s => s.trim()).filter(Boolean) :
      [ (location.pathname.replace(/^\//,'') || 'index.html') ];

    const cache = {};

    files.forEach(f => {
      fetch(f, { cache: 'no-store' })
        .then(r => r.text())
        .then(t => cache[f] = t)
        .catch(() => cache[f] = null);
    });

    async function poll(){
      for (const f of files) {
        try {
          const res = await fetch(f, { cache: 'no-store' });
          if (!res.ok) continue;
          const t = await res.text();
          if (cache[f] !== undefined && cache[f] !== t) {
            console.log('LiveReload: change detected in', f);
            setTimeout(() => location.reload(true), 80);
            return;
          }
          cache[f] = t;
        } catch (err) {}
      }
    }

    setInterval(poll, 1000);

    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) poll();
    });
  } catch (e) {
    console.warn('LiveReload script error', e);
  }
})();

// ================================================
// MOBILE HAMBURGER MENU (Fixed & Reliable)
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

// Final note
console.log("%cDarkclone's Demon Lists - Script loaded successfully", "color: #a855f7; font-weight: bold");
