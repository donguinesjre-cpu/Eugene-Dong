

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

// Animate the robot when it is clicked, unless reduced motion is preferred.
const robotButton = document.getElementById("robotButton");
const robotMascot = robotButton.querySelector(".robot-mascot");
const robotArm = robotButton.querySelector(".robot-arm-right");
let robotClickAnimations = [];

robotButton.addEventListener("click", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  robotClickAnimations.forEach((animation) => animation.cancel());

  robotClickAnimations = [
    robotMascot.animate(
      [
        { transform: "translateY(0) rotate(0) scale(1.04)" },
        { transform: "translateY(-11px) rotate(-8deg) scale(1.13)" },
        { transform: "translateY(0) rotate(7deg) scale(1.04)" },
        { transform: "translateY(-5px) rotate(-4deg) scale(1.08)" },
        { transform: "translateY(0) rotate(0) scale(1.04)" },
      ],
      { duration: 760, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    ),

    robotArm.animate(
      [
        { transform: "rotate(-18deg)" },
        { transform: "rotate(-100deg)" },
        { transform: "rotate(-45deg)" },
        { transform: "rotate(-100deg)" },
        { transform: "rotate(-18deg)" },
      ],
      { duration: 650, easing: "ease-in-out" }
    ),
  ];
});

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
