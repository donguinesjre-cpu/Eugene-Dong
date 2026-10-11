
/* =========================================
   PORTFOLIO INTERACTIONS
========================================= */

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

// Close the mobile menu after selecting a section
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Show a placeholder if the profile photo is missing
const profilePhoto = document.getElementById("profilePhoto");
const photoFallback = document.getElementById("photoFallback");

function showPhotoFallback() {
  profilePhoto.style.display = "none";
  photoFallback.style.display = "grid";
}

profilePhoto.addEventListener("error", showPhotoFallback);

if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
  showPhotoFallback();
}

// Reveal elements when they enter the viewport
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

// Automatic footer year
document.getElementById("year").textContent =
  new Date().getFullYear();
