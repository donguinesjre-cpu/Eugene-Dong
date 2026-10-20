

// Portfolio introduction
const introOverlay = document.getElementById("portfolioIntro");
const introProgress = document.getElementById("introProgress");
const introProgressFill = document.getElementById("introProgressFill");
const introPercentage = document.getElementById("introPercentage");
const introStatus = document.getElementById("introStatus");
const introTerminalStatus = document.getElementById("introTerminalStatus");
const introEnter = document.getElementById("introEnter");
const introSkip = document.getElementById("introSkip");
const replayIntro = document.getElementById("replayIntro");
const pageRegions = [
  document.querySelector(".site-header"),
  document.querySelector("main"),
  document.querySelector(".site-footer"),
].filter(Boolean);
const introStorageKey = "projectNexusIntroSeen";
const introDuration = 2800;
let introAnimationFrame = 0;
let introExitTimer = 0;
let introStartTime = 0;

function readIntroSeen() {
  try {
    return sessionStorage.getItem(introStorageKey) === "true";
  } catch (error) {
    console.warn("Could not read the intro session preference.", error);
    return false;
  }
}

function saveIntroSeen(seen) {
  try {
    if (seen) {
      sessionStorage.setItem(introStorageKey, "true");
    } else {
      sessionStorage.removeItem(introStorageKey);
    }
  } catch (error) {
    console.warn("Could not save the intro session preference.", error);
  }
}

function setPageRegionsInert(isInert) {
  pageRegions.forEach((region) => {
    region.inert = isInert;

    if (isInert) {
      region.setAttribute("aria-hidden", "true");
    } else {
      region.removeAttribute("aria-hidden");
    }
  });
}

function updateIntroProgress(progress) {
  const value = Math.min(100, Math.round(progress));
  const status =
    value >= 100
      ? "System ready."
      : value >= 72
        ? "Preparing digital experience..."
        : value >= 38
          ? "Loading projects..."
          : "Initializing portfolio...";

  introProgress.setAttribute("aria-valuenow", String(value));
  introProgressFill.style.transform = `scaleX(${value / 100})`;
  introPercentage.textContent = `${value}%`;
  introStatus.textContent = status;
  introTerminalStatus.textContent = status;

  if (value === 100) {
    introEnter.hidden = false;
  }
}

function completeIntroProgress() {
  cancelAnimationFrame(introAnimationFrame);
  updateIntroProgress(100);
}

function animateIntroProgress(timestamp) {
  const progress = Math.min(100, ((timestamp - introStartTime) / introDuration) * 100);
  updateIntroProgress(progress);

  if (progress < 100) {
    introAnimationFrame = requestAnimationFrame(animateIntroProgress);
  }
}

function showIntro(isReplay = false) {
  if (!introOverlay) {
    return;
  }

  if (isReplay) {
    saveIntroSeen(false);
  }

  cancelAnimationFrame(introAnimationFrame);
  window.clearTimeout(introExitTimer);
  introOverlay.classList.remove("is-exiting");
  introOverlay.classList.add("is-active");
  introOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("intro-open");
  setPageRegionsInert(true);
  introEnter.hidden = true;
  updateIntroProgress(0);
  introSkip.focus({ preventScroll: true });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    completeIntroProgress();
    return;
  }

  introStartTime = performance.now();
  introAnimationFrame = requestAnimationFrame(animateIntroProgress);
}

function dismissIntro() {
  if (!introOverlay || !introOverlay.classList.contains("is-active")) {
    return;
  }

  cancelAnimationFrame(introAnimationFrame);
  saveIntroSeen(true);
  introOverlay.classList.add("is-exiting");
  introOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("intro-open");
  setPageRegionsInert(false);

  const homeHeading = document.querySelector(".hero h1");
  if (homeHeading) {
    homeHeading.setAttribute("tabindex", "-1");
    homeHeading.focus({ preventScroll: true });
  }

  introExitTimer = window.setTimeout(() => {
    introOverlay.classList.remove("is-active", "is-exiting");
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600);
}

if (introOverlay && !readIntroSeen()) {
  showIntro();
}

introEnter?.addEventListener("click", dismissIntro);
introSkip?.addEventListener("click", dismissIntro);
introOverlay?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") {
    return;
  }

  const focusableControls = [...introOverlay.querySelectorAll("button:not([hidden])")];
  const firstControl = focusableControls[0];
  const lastControl = focusableControls[focusableControls.length - 1];

  if (event.shiftKey && document.activeElement === firstControl) {
    event.preventDefault();
    lastControl.focus();
  } else if (!event.shiftKey && document.activeElement === lastControl) {
    event.preventDefault();
    firstControl.focus();
  }
});
replayIntro?.addEventListener("click", (event) => {
  event.preventDefault();
  showIntro(true);
});

// Filter the existing skill cards by category.
const skillTabs = [...document.querySelectorAll("[data-skill-category]")];
const skillPanels = [...document.querySelectorAll("[data-skill-panel]")];

function activateSkillCategory(category, moveFocus = false) {
  const selectedTab = skillTabs.find(
    (tab) => tab.dataset.skillCategory === category
  );

  if (!selectedTab) {
    return;
  }

  skillTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;

    if (isSelected && moveFocus) {
      tab.focus();
    }
  });

  skillPanels.forEach((panel) => {
    panel.hidden = panel.dataset.skillPanel !== category;
  });
}

skillTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateSkillCategory(tab.dataset.skillCategory);
  });

  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % skillTabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = skillTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateSkillCategory(skillTabs[nextIndex].dataset.skillCategory, true);
  });
});

if (skillTabs.length && skillPanels.length) {
  activateSkillCategory(
    skillTabs.find((tab) => tab.getAttribute("aria-selected") === "true")
      ?.dataset.skillCategory || skillTabs[0].dataset.skillCategory
  );
}

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
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent = currentYear;
document.getElementById("introYear").textContent = currentYear;
