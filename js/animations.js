/**
 * animations.js - Scroll Reveals and Magnetic Interactions
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
    rootMargin: "0px 0px -10% 0px", // Trigger slightly before it comes into view
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Stop observing once revealed
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

      // Calculate distance from center
      const x = (e.clientX - center.x) * 0.4; // Magnetic strength X
      const y = (e.clientY - center.y) * 0.4; // Magnetic strength Y

      // Animate button
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    wrap.addEventListener("mouseleave", () => {
      // Reset button to center smoothly
      btn.style.transform = "translate(0px, 0px)";
      btn.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";

      // Remove transition after it finished so hover effect feels instant next time
      setTimeout(() => {
        btn.style.transition = "";
      }, 500);
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
    parallaxElements.length === 0
  )
    return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (e) => {
    // Normalize mouse pos (-1 to 1) based on screen center
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const animateParallax = () => {
    // Ease the target values
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    parallaxElements.forEach((el) => {
      const speed = el.getAttribute("data-speed") || 20;
      const x = targetX * speed;
      const y = targetY * speed;

      el.style.transform = `translate(${x}px, ${y}px)`;
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
  const stickyWrapper = document.querySelector(".sticky-wrapper");
  const track = document.querySelector(".cards-track");

  if (!container || !stickyWrapper || !track) return;

  const setupHeight = () => {
    // Determine how far we need to scroll horizontally
    // Add that distance to the vertical viewport height to give scroll space
    const trackWidth = track.scrollWidth;
    const scrollableDistance = trackWidth - window.innerWidth + window.innerWidth * 0.1; // Add 10vw padding
    container.style.height = `${window.innerHeight + scrollableDistance}px`;
  };

  setupHeight();
  window.addEventListener("resize", setupHeight);

  // Use Lenis or native scroll event
  window.addEventListener(
    "scroll",
    () => {
      const rect = container.getBoundingClientRect();

      // When the top of container hits top of viewport, sticky wrapper stays.
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const maxScroll = container.offsetHeight - window.innerHeight;
        const currentScroll = -rect.top;
        const progress = currentScroll / maxScroll;

        const trackWidth = track.scrollWidth;
        const moveDistance = trackWidth - window.innerWidth + window.innerWidth * 0.1;

        track.style.transform = `translate3d(${-moveDistance * progress}px, 0, 0)`;
      } else if (rect.top > 0) {
        track.style.transform = `translate3d(0, 0, 0)`;
      } else {
        const moveDistance = track.scrollWidth - window.innerWidth + window.innerWidth * 0.1;
        track.style.transform = `translate3d(${-moveDistance}px, 0, 0)`;
      }
    },
    { passive: true },
  );
}

/* =========================================================================
   3D CARD TILT
   ========================================================================= */
function init3DTilt() {
  const tiltCards = document.querySelectorAll(".tilt-card");

  if (window.matchMedia("(pointer: coarse)").matches) return;

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max rotation 15 degrees
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
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
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active to clicked
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      items.forEach((item) => {
        const category = item.getAttribute("data-category");

        // Scale down animation
        item.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        item.style.transform = "scale(0.8)";
        item.style.opacity = "0";

        setTimeout(() => {
          if (filterValue === "all" || category === filterValue) {
            item.style.display = "flex"; // or block depending on original display
            // For cards from our grid, it's flex from .card class
            setTimeout(() => {
              item.style.transform = "scale(1)";
              item.style.opacity = "1";
            }, 50);
          } else {
            item.style.display = "none";
          }
        }, 400);
      });
    });
  });
}
