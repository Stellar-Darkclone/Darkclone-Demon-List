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

function searchDemon() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!input) return;

  const items = document.querySelectorAll("ul.clean li");
  let found = false;

  items.forEach(li => {
    const text = li.innerText.toLowerCase();
    if (text.includes(input) && !found) {
      li.scrollIntoView({ behavior: "smooth", block: "center" });
      li.style.background = "rgba(255, 255, 0, 0.2)"; // highlight
      setTimeout(() => li.style.background = "", 2000);
      found = true;
    }
  });

  if (!found) {
    alert("No match found in the list!");
  }
}

// Attach events once the page loads
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchBtn");

  if (input && button) {
    button.addEventListener("click", searchDemon);
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        searchDemon();
      }
    });
  }
});


// THIS JAVASCRIPT FILE IS HEAVILY SPONSORED BY CHATGPT BECAUSE I SUCK AT JS LOL


