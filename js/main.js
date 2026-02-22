/**
 * main.js - Core UI Logic (Preloader, Lenis, Cursor, Mobile Menu, Nav)
 */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initLenis();
  initCustomCursor();
  initMobileMenu();
  initNavbarScroll();
});

/* =========================================================================
   PRELOADER
   ========================================================================= */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  // Wait for critical resources, then fade out
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
      setTimeout(() => { preloader.style.display = "none"; }, 800);
    }, 300);
  });

  // Safety fallback: hide after 4s regardless
  setTimeout(() => {
    if (!preloader.classList.contains("hidden")) {
      preloader.classList.add("hidden");
      setTimeout(() => { preloader.style.display = "none"; }, 800);
    }
  }, 4000);
}

/* =========================================================================
   SMOOTH SCROLL (LENIS)
   ========================================================================= */
function initLenis() {
  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Store Lenis instance globally for potential external use
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* =========================================================================
   CUSTOM CURSOR LOGIC
   ========================================================================= */
function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  const animateCursor = () => {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Smooth easing for outline
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  };

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  animateCursor();

  // Enhanced hover effect on interactive elements
  const interactives = document.querySelectorAll(
    "a, button, input, textarea, .magnetic-wrap, .video-card, .hz-card, .card",
  );

  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");

      const hoverText = el.getAttribute("data-cursor-text");
      if (hoverText) {
        cursorOutline.setAttribute("data-cursor-text", hoverText);
        cursorOutline.classList.add("has-text");
      }
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
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
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Close menu when clicking a nav link
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
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
  let ticking = false;

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Add glassy background when scrolled
    if (scrollY > 50) {
      navbar.style.background = "var(--bg-glass-hover)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.15)";
    } else {
      navbar.style.background = "var(--bg-glass)";
      navbar.style.boxShadow = "none";
    }

    // Auto-hide navbar on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 100) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* =========================================================================
   PAGE TRANSITION UTILITY
   ========================================================================= */
window.triggerPageExit = function (url) {
  const transitionEl = document.querySelector(".page-transition");
  if (transitionEl) {
    transitionEl.classList.add("active");
    setTimeout(() => { window.location.href = url; }, 600);
  } else {
    window.location.href = url;
  }
};
