/**
 * Main Application Script for Sri Sanjundeshwara Nilaya Gruhapravesha 2026
 * Handles smooth navigation for CTA buttons, card view language toggle,
 * IntersectionObserver animations, and print invitation card.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCardLanguageToggle();
  initScrollAnimations();
  initPrintButton();
});

/**
 * Smooth Scroll for In-Page Anchor Links (e.g. View Invitation, Get Directions)
 */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Invitation Card Language Toggle (Kannada / English)
 */
function initCardLanguageToggle() {
  const toggleBtns = document.querySelectorAll('.card-lang-btn');
  const kannadaCard = document.getElementById('card-view-kannada');
  const englishCard = document.getElementById('card-view-english');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');

      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetLang === 'kannada') {
        if (kannadaCard) {
          kannadaCard.style.display = 'block';
          kannadaCard.classList.add('fade-in');
        }
        if (englishCard) {
          englishCard.style.display = 'none';
        }
      } else {
        if (englishCard) {
          englishCard.style.display = 'block';
          englishCard.classList.add('fade-in');
        }
        if (kannadaCard) {
          kannadaCard.style.display = 'none';
        }
      }
    });
  });
}

/**
 * Scroll Reveal Animations via IntersectionObserver
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Print / Save Invitation Card
 */
function initPrintButton() {
  const printBtns = document.querySelectorAll('.print-card-btn');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}
