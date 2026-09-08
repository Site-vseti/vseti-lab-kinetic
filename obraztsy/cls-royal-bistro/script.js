/* ==========================================
   LOADER
========================================== */

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 1000);
});

/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });
}

/* ==========================================
   CLOSE MENU AFTER CLICK
========================================== */

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");

    if (menuBtn) {
      const icon = menuBtn.querySelector("i");
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });
});

/* ==========================================
   STICKY NAVBAR
========================================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (!navbar) return;

  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* ==========================================
   HERO BACKGROUND SLIDER
========================================== */

const hero = document.querySelector(".hero");

const heroImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80"
];

let currentImage = 0;

function changeHeroImage() {
  if (!hero) return;

  currentImage++;

  if (currentImage >= heroImages.length) {
    currentImage = 0;
  }

  hero.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)),
     url('${heroImages[currentImage]}')`;

  hero.style.backgroundSize = "cover";
  hero.style.backgroundPosition = "center";
}

setInterval(changeHeroImage, 5000);

/* ==========================================
   SCROLL REVEAL
========================================== */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(item => {
    const windowHeight = window.innerHeight;
    const elementTop =
      item.getBoundingClientRect().top;

    const revealPoint = 100;

    if (elementTop <
      windowHeight - revealPoint) {
      item.classList.add("active");
    }
  });
}

window.addEventListener(
  "scroll",
  revealOnScroll
);

revealOnScroll();

/* ==========================================
   TESTIMONIAL SWIPER
========================================== */

if (document.querySelector(".reviewSwiper")) {
  new Swiper(".reviewSwiper", {
    loop: true,
    speed: 900,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },

    spaceBetween: 30
  });
}

/* ==========================================
   SMOOTH SCROLL
========================================== */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(anchor => {

    anchor.addEventListener(
      "click",
      function (e) {

        const target =
          document.querySelector(
            this.getAttribute("href")
          );

        if (!target) return;

        e.preventDefault();

        window.scrollTo({
          top:
            target.offsetTop - 90,
          behavior: "smooth"
        });

      });
  });

/* ==========================================
   ACTIVE NAV LINKS
========================================== */

const sections =
  document.querySelectorAll("section");

const navItems =
  document.querySelectorAll(
    ".nav-links a"
  );

window.addEventListener(
  "scroll",
  () => {

    let current = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop;

      const sectionHeight =
        section.clientHeight;

      if (
        pageYOffset >=
        sectionTop - 250
      ) {
        current =
          section.getAttribute("id");
      }
    });

    navItems.forEach(link => {

      link.classList.remove(
        "active-link"
      );

      if (
        link.getAttribute("href") ===
        `#${current}`
      ) {
        link.classList.add(
          "active-link"
        );
      }
    });
  });

/* ==========================================
   GALLERY LIGHTBOX
========================================== */

const galleryImages =
  document.querySelectorAll(
    ".gallery-grid img"
  );

const lightbox =
  document.createElement("div");

lightbox.id = "lightbox";

document.body.appendChild(
  lightbox
);

galleryImages.forEach(image => {

  image.addEventListener(
    "click",
    () => {

      lightbox.classList.add(
        "active"
      );

      const img =
        document.createElement("img");

      img.src = image.src;

      while (
        lightbox.firstChild
      ) {
        lightbox.removeChild(
          lightbox.firstChild
        );
      }

      lightbox.appendChild(img);

    });
});

lightbox.addEventListener(
  "click",
  () => {
    lightbox.classList.remove(
      "active"
    );
  }
);

/* ==========================================
   BOOKING FORM
========================================== */

const form =
  document.querySelector("form");

if (form) {

  form.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      alert(
        "Thank you! Your reservation request has been submitted."
      );

      form.reset();
    });
}

/* ==========================================
   SCROLL TO TOP BUTTON
========================================== */

const topBtn =
  document.createElement(
    "button"
  );

topBtn.innerHTML =
  '<i class="fa-solid fa-arrow-up"></i>';

topBtn.classList.add(
  "top-btn"
);

document.body.appendChild(
  topBtn
);

window.addEventListener(
  "scroll",
  () => {

    if (
      window.scrollY > 600
    ) {
      topBtn.classList.add(
        "show"
      );
    } else {
      topBtn.classList.remove(
        "show"
      );
    }
  });

topBtn.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);

/* ==========================================
   PARALLAX EFFECT
========================================== */

window.addEventListener(
  "scroll",
  () => {

    const scrolled =
      window.pageYOffset;

    if (hero) {
      hero.style.backgroundPositionY =
        scrolled * 0.4 + "px";
    }
  }
);