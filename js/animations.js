/**
 * animations.js - Scroll Reveals and Magnetic Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveals();
  initMagneticButtons();
  initParallax();
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
