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

// -------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const extra = btn.nextElementSibling;
      extra.classList.toggle("show");
      btn.textContent = extra.classList.contains("show") ? "▲" : "▼";
    });
  });
});

// -------------------------------------------------------------------------------


function makeListItemsExpandable() {
  // Find all lists that use your "clean" class (your lists use <ul class="clean">)
  const lists = document.querySelectorAll('ul.clean');
  lists.forEach(list => {
    list.querySelectorAll('li').forEach(li => {
      // skip if already processed
      if (li.classList.contains('expandable-processed')) return;

      // Work on the raw HTML of the LI
      const html = li.innerHTML.trim();

      // If it already contains an .extra-info or a toggle button, skip
      if (/class\s*=\s*["']?extra-info["']?/i.test(html) || /toggle-btn/.test(html)) {
        li.classList.add('expandable-processed');
        return;
      }

      // Regex: capture trailing parenthesis groups like " ... (Memory) (Timing)"
      // Use [\s\S] to safely match across newlines if any
      const m = html.match(/^([\s\S]*?)(\s*(?:\([^)]*\)\s*)+)$/);
      if (m) {
        const main = m[1].trim();
        const extras = m[2].trim();

        // Build the new structure: main text, toggle button, extra-info container
        li.innerHTML = '<span class="main-text">' + main + '</span> ' +
                       '<button class="toggle-btn" aria-expanded="false" title="Show details">▼</button>' +
                       '<div class="extra-info" aria-hidden="true">' + extras + '</div>';
        li.classList.add('expandable-processed');
      }
    });
  });

  // Wire up buttons (also handles buttons that might already exist in the markup)
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    // avoid double-binding
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';

    btn.addEventListener('click', () => {
      const li = btn.closest('li');
      if (!li) return;
      const extra = li.querySelector('.extra-info');
      if (!extra) return;
      const show = extra.classList.toggle('show');
      btn.textContent = show ? '▲' : '▼';
      btn.setAttribute('aria-expanded', show ? 'true' : 'false');
      extra.setAttribute('aria-hidden', show ? 'false' : 'true');
    });

    // keyboard support: Enter and Space toggle
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

// THIS JAVASCRIPT FILE IS HEAVILY SPONSORED BY CHATGPT BECAUSE I SUCK AT JS LOL
