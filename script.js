document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#primary-menu');

  if (!toggle || !menu) return;

  // Initialize ARIA state
  menu.setAttribute('aria-hidden', 'true');

  const firstLink = menu.querySelector('a');

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('show');
    menu.setAttribute('aria-hidden', 'false');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!menu.contains(target) && target !== toggle) {
      closeMenu();
    }
  });

  // Scrollspy: highlight active nav item based on visible section
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(l => {
      const match = l.getAttribute('href') === `#${id}`;
      l.classList.toggle('active', match);
      if (match) {
        l.setAttribute('aria-current', 'page');
      } else {
        l.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { root: null, threshold: 0.6 });

  sections.forEach(sec => observer.observe(sec));

  // Close mobile menu after clicking a nav link
  navLinks.forEach(link => link.addEventListener('click', () => {
    closeMenu();
  }));

  // Initial active state from hash or default to home
  const initialId = (location.hash || '#home').slice(1);
  setActive(initialId);
});
