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

let tapCount = 0;
let tapTimer;

document.getElementById("secret-text").addEventListener("click", () => {
  tapCount++;

  if (tapCount === 3) {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    tapCount = 0; // reset
    clearTimeout(tapTimer);
    return;
  }

  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    tapCount = 0;
  }, 2000);
});


