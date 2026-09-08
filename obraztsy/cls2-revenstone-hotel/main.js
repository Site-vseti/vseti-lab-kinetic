/* THE RIVENSTONE — shared scripts */

document.addEventListener("DOMContentLoaded", () => {

  /* ----- Mobile navigation ----- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ----- Booking enquiry form (concept demo) ----- */
  const form = document.querySelector(".booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("visible");
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      form.reset();
    });
  }
});
