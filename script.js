
/* Updated script.js
   - Automatically converts trailing "(...)" groups in list items into hidden .extra-info
   - Adds a toggle button "▼/▲" and keyboard support
   - Keeps filterList and checkOrientation helpers
*/

function filterList(inputId, listId){
  const q = (document.getElementById(inputId) || {value:''}).value.toLowerCase();
  const items = document.querySelectorAll(`#${listId} li`);
  items.forEach(li => {
    const txt = li.textContent.toLowerCase();
    li.style.display = txt.includes(q) ? "" : "none";
  });
}

// -------------------------------------------------------------------------------

function checkOrientation() {
    const warn = document.getElementById("landscape-warning");
    if (!warn) return;
    if (window.innerHeight > window.innerWidth) {
      warn.style.display = "block";
    } else {
      warn.style.display = "none";
    }
}
window.addEventListener('resize', checkOrientation);

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

// -------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // initial orientation check
  try { checkOrientation(); } catch(e) { /* ignore */ }

  // convert list items and attach handlers
  try { makeListItemsExpandable(); } catch(e) { console.error(e); }

  // If you dynamically add items later, you can call makeListItemsExpandable() again.
});
