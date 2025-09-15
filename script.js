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

// THIS JAVASCRIPT FILE IS HEAVILY SPONSORED BY CHATGPT BECAUSE I SUCK AT JS LOL
