/**
 * animations.js - Scroll Reveals, Magnetic Interactions, Horizontal Scroll, 3D Tilt, Filters
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveals();
  initMagneticButtons();
  initParallax();
  initHorizontalScroll();
  init3DTilt();
  initFilters();
});

/* =========================================================================
   SCROLL REVEALS (Intersection Observer)
   ========================================================================= */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* =========================================================================
   MAGNETIC BUTTONS
   ========================================================================= */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll(".magnetic-wrap");

  // Only apply on non-touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  magneticBtns.forEach((wrap) => {
    const btn = wrap.querySelector(".btn");
    if (!btn) return;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const x = (e.clientX - center.x) * 0.35;
      const y = (e.clientY - center.y) * 0.35;

      btn.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });

    wrap.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
      btn.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";

      setTimeout(() => { btn.style.transition = ""; }, 500);
    });
  });
}

/* =========================================================================
   MOUSE PARALLAX (Background Shapes / Cards)
   ========================================================================= */
function initParallax() {
  const parallaxElements = document.querySelectorAll(".parallax-mouse");

  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    parallaxElements.length === 0
  )
    return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const animateParallax = () => {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-speed")) || 20;
      const x = targetX * speed;
      const y = targetY * speed;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(animateParallax);
  };

  animateParallax();
}

/* =========================================================================
   HORIZONTAL SCROLL
   ========================================================================= */
function initHorizontalScroll() {
  const container = document.querySelector(".horizontal-scroll-container");
  const track = document.querySelector(".cards-track");

  if (!container || !track) return;

  // On mobile, allow native horizontal scroll instead
  if (window.innerWidth < 769) return;

  const setupHeight = () => {
    const trackWidth = track.scrollWidth;
    const scrollableDistance = trackWidth - window.innerWidth + window.innerWidth * 0.1;
    container.style.height = `${window.innerHeight + Math.max(0, scrollableDistance)}px`;
  };

  setupHeight();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupHeight, 150);
  });

  let scrollTicking = false;

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();

        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          const maxScroll = container.offsetHeight - window.innerHeight;
          const currentScroll = -rect.top;
          const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));

          const trackWidth = track.scrollWidth;
          const moveDistance = trackWidth - window.innerWidth + window.innerWidth * 0.1;

          track.style.transform = `translate3d(${-moveDistance * progress}px, 0, 0)`;
        } else if (rect.top > 0) {
          track.style.transform = `translate3d(0, 0, 0)`;
        } else {
          const moveDistance = track.scrollWidth - window.innerWidth + window.innerWidth * 0.1;
          track.style.transform = `translate3d(${-moveDistance}px, 0, 0)`;
        }

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
}

/* =========================================================================
   3D CARD TILT
   ========================================================================= */
function init3DTilt() {
  const tiltCards = document.querySelectorAll(".tilt-card");

  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max rotation 12 degrees (slightly less = more elegant)
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }, { passive: true });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      setTimeout(() => { card.style.transition = ""; }, 600);
    });
  });
}

/* =========================================================================
   DYNAMIC FILTERING (Episodes/Guests)
   ========================================================================= */
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".episode-card, .guest-card");

  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Toggle active class
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      items.forEach((item) => {
        const category = item.getAttribute("data-category");

        // Animate out
        item.style.transition = "transform 0.35s ease, opacity 0.35s ease";
        item.style.transform = "scale(0.85)";
        item.style.opacity = "0";

        setTimeout(() => {
          if (filterValue === "all" || category === filterValue) {
            item.style.display = "flex";
            // Force reflow before animating in
            void item.offsetHeight;
            item.style.transform = "scale(1)";
            item.style.opacity = "1";
          } else {
            item.style.display = "none";
          }
        }, 350);
      });
    });
  });
}
