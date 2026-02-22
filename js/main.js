/**
 * main.js - Core UI Logic (Cursor, Mobile Menu, Routing Hooks)
 */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initLenis();
  initCustomCursor();
  initMobileMenu();
  initNavbarScroll();
});

/* =========================================================================
   PRELOADER & SMOOTH SCROLL (LENIS)
   ========================================================================= */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Add a slight delay so user can see it briefly, then fade out
    setTimeout(() => {
      preloader.classList.add("hidden");
      // Remove it from flow after transition
      setTimeout(() => preloader.style.display = "none", 800);
    }, 600);
  }
}

function initLenis() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
}

/* =========================================================================
   CUSTOM CURSOR LOGIC
   ========================================================================= */
function initCustomCursor() {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  // Fallback if cursor elements don't exist
  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  // Smooth following for the outline
  const animateCursor = () => {
    // Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Outline follows with easing
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  };

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  animateCursor();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll(
    "a, button, input, textarea, .magnetic-wrap, .video-card",
  );

  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
      cursorOutline.classList.add("hover");
      cursorDot.classList.add("hover");

      const hoverText = el.getAttribute("data-cursor-text");
      if (hoverText) {
        cursorOutline.setAttribute("data-cursor-text", hoverText);
        cursorOutline.classList.add("has-text");
      }
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
      cursorOutline.classList.remove("hover");
      cursorDot.classList.remove("hover");
      cursorOutline.classList.remove("has-text");
      cursorOutline.removeAttribute("data-cursor-text");
    });
  });
}

/* =========================================================================
   MOBILE MENU LOGIC
   ========================================================================= */
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    const isActive = menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Close menu when clicking a link
  const links = navLinks.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/* =========================================================================
   NAVBAR SCROLL LOGIC
   ========================================================================= */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      // Add glassy background when scrolled down
      if (window.scrollY > 50) {
        navbar.style.background = "var(--bg-glass-hover)";
        navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
      } else {
        navbar.style.background = "var(--bg-glass)";
        navbar.style.boxShadow = "none";
      }

      // Hide on scroll down, show on scroll up
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.classList.add("hidden");
      } else {
        navbar.classList.remove("hidden");
      }
      lastScrollY = window.scrollY;
    },
    { passive: true },
  );
}

/* =========================================================================
   PAGE TRANSITION UTILITY
   ========================================================================= */
// Simple utility for smooth page exits (can be bound to links manually)
window.triggerPageExit = function (url) {
  const transitionEl = document.querySelector(".page-transition");
  if (transitionEl) {
    transitionEl.classList.add("active");
    setTimeout(() => {
      window.location.href = url;
    }, 600); // Matches CSS transition duration
  } else {
    window.location.href = url;
  }
};
