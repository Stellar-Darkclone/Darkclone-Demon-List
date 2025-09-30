function filterList(inputId, listId){
  const q = document.getElementById(inputId).value.toLowerCase();
  const items = document.querySelectorAll(`#${listId} li`);
  items.forEach(li => {
    const txt = li.textContent.toLowerCase();
    li.style.display = txt.includes(q) ? "" : "none";
  });
}

// -------------------------------------------------------------------------------

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
      document.getElementById("landscape-warning").style.display = "block";
    } else {
      document.getElementById("landscape-warning").style.display = "none";
    }
  }

  window.addEventListener("load", checkOrientation);
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

// -------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  let tapCount = 0;
  let tapTimer;

  const secretText = document.getElementById("secret-text");

  if (secretText) {
    secretText.addEventListener("click", () => {
      tapCount++;

      if (tapCount === 3) {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        tapCount = 0; // reset
        clearTimeout(tapTimer);
        return;
      }

      // reset if no 3rd click within 1.2s
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 1200);
    });
  }
});

// -------------------------------------------------------------------------------

(function() {
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip invisible chars
      .replace(/\s+/g, ' ')
      .trim();
  }

  function doSearch(query) {
    if (!query) return;
    const q = normalize(query);

    const items = Array.from(document.querySelectorAll('ul.clean li'));
    document.querySelectorAll('.search-highlight')
      .forEach(el => el.classList.remove('search-highlight'));

    const found = items.find(li =>
      normalize(li.innerText).includes(q)
    );

    if (found) {
      // smooth scroll with offset so it's not hidden under header
      const yOffset = -100; // adjust if needed
      const y = found.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      found.classList.add('search-highlight');
      setTimeout(() => found.classList.remove('search-highlight'), 3000);
    } else {
      alert(`No match found for: "${query}"`);
    }
  }

  function initSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchBtn');

    if (form && input) {
      // Kill form’s default action COMPLETELY
      form.addEventListener('submit', e => {
        e.preventDefault();
        e.stopPropagation(); // stop bubbling
        doSearch(input.value);
        return false; // extra safety to block reload
      });

      if (button) {
        button.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          doSearch(input.value);
          return false;
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();

// -------------------------------------------------------------------------------

// Utility: fetch HTML and count <li> inside a section with ID="completed"
async function getCompletedCount(page) {
  try {
    const response = await fetch(page);
    const text = await response.text();

    // Parse HTML text
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Adjust this selector to where your "Completed" <li> live
    // Example: <ul id="completed"><li>...</li></ul>
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

// Update counters on index.html
async function updateCounters() {
  const extremeCount = await getCompletedCount("extreme.html");
  const insaneCount = await getCompletedCount("insane.html");

  document.getElementById("extreme-count").textContent =
    `Completed extremes: ${extremeCount}`;
  document.getElementById("insane-count").textContent =
    `Completed insanes: ${insaneCount}`;
}

// Run after page loads
document.addEventListener("DOMContentLoaded", updateCounters);

// -------------------------------------------------------------------------------

(function(){
  try {
    // Read optional meta tag: <meta name="live-reload-files" content="index.html,about.html">
    const meta = document.querySelector('meta[name="live-reload-files"]');
    const files = meta ? meta.content.split(',').map(s => s.trim()).filter(Boolean) :
      [ (location.pathname.replace(/^\//,'') || 'index.html') ];

    const cache = {};

    // initialize cache
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
            setTimeout(() => location.reload(true), 80); // small delay before reload
            return;
          }
          cache[f] = t;
        } catch (err) {
          // ignore fetch errors (file may be temporarily unavailable)
        }
      }
    }

    // Poll every 1000ms (1s). You can increase to reduce network load.
    setInterval(poll, 1000);

    // Extra: check immediately when page becomes visible again
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) poll();
    });
  } catch (e) {
    console.warn('LiveReload script error', e);
  }
})();

// THIS JAVASCRIPT FILE IS HEAVILY SPONSORED BY CHATGPT BECAUSE I SUCK AT JS LOL
