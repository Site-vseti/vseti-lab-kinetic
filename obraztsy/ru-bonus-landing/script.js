document.addEventListener("DOMContentLoaded", function() {
  const yearEl = document.getElementById("year");
  const now = new Date();
  yearEl.textContent = now.getFullYear();
});
