/* ==========================================================================
   CASA EMPANADA — LATIN STREET FOOD KITCHEN
   Master JavaScript Interactions & Theme Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Theme Engine (Light / Dark Mode with Persistence)
     -------------------------------------------------------------------------- */
  const THEME_STORAGE_KEY = 'casa_empanada_theme';
  const htmlElement = document.documentElement;
  const themeToggleBtns = document.querySelectorAll('.btn-theme-toggle');

  // Determine initial theme
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeUI(theme);
  };

  const updateThemeUI = (theme) => {
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  };

  // Initialize Theme
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  // Bind Theme Toggle Buttons
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = htmlElement.getAttribute('data-theme');
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });

  /* --------------------------------------------------------------------------
     1b. RTL Direction Engine (LTR / RTL Switcher with Persistence)
     -------------------------------------------------------------------------- */
  const DIR_STORAGE_KEY = 'casa_empanada_dir';
  const rtlToggleBtns = document.querySelectorAll('.btn-rtl-toggle');

  const getPreferredDir = () => {
    return localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
  };

  const setDir = (dir) => {
    htmlElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_STORAGE_KEY, dir);
    updateRtlUI(dir);
  };

  const updateRtlUI = (dir) => {
    rtlToggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
    });
  };

  const currentDir = getPreferredDir();
  setDir(currentDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = htmlElement.getAttribute('dir') || 'ltr';
      const nextDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      setDir(nextDir);
    });
  });

  // Listen to OS theme changes if not overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* --------------------------------------------------------------------------
     2. Sticky Navbar & Scroll Progress
     -------------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar-casa');
  const backToTopBtn = document.querySelector('.btn-back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar Shrink
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to Top Visibility
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Scroll Reveal & GSAP Animations
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-element');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 120;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();

  // GSAP Entrance Animations if available
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
    gsap.from('.hero-lead', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
    gsap.from('.hero-btn-group', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
    gsap.from('.hero-image-wrapper', { opacity: 0, scale: 0.95, duration: 1.2, delay: 0.5 });
  }

  /* --------------------------------------------------------------------------
     4. Menu Filter Engine (for menu.html)
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-filterable-item');

  if (filterBtns.length > 0 && menuItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        menuItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.classList.add('active');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Home 2 Interactive Filling Showcase
     -------------------------------------------------------------------------- */
  const fillingChips = document.querySelectorAll('.filling-chip');
  const fillingDisplayTitle = document.getElementById('fillingDisplayTitle');
  const fillingDisplayDesc = document.getElementById('fillingDisplayDesc');
  const fillingDisplayPrice = document.getElementById('fillingDisplayPrice');
  const fillingDisplayImage = document.getElementById('fillingDisplayImage');

  if (fillingChips.length > 0 && fillingDisplayTitle) {
    fillingChips.forEach(chip => {
      chip.addEventListener('click', () => {
        fillingChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const title = chip.getAttribute('data-title');
        const desc = chip.getAttribute('data-desc');
        const price = chip.getAttribute('data-price');
        const img = chip.getAttribute('data-img');

        if (fillingDisplayTitle) fillingDisplayTitle.textContent = title;
        if (fillingDisplayDesc) fillingDisplayDesc.textContent = desc;
        if (fillingDisplayPrice) fillingDisplayPrice.textContent = price;
        if (fillingDisplayImage && img) fillingDisplayImage.src = img;
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Form Interception & Feedback Feedback Toasts
     -------------------------------------------------------------------------- */
  const formsToValidate = document.querySelectorAll('.needs-casa-validation');

  formsToValidate.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      form.classList.add('was-validated');

      // Show Success Feedback Toast
      showSuccessToast(form.getAttribute('data-success-msg') || 'Thank you! Your request has been received. We will get back to you shortly.');

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        form.classList.remove('was-validated');
      }, 3000);
    });
  });

  function showSuccessToast(message) {
    let toastContainer = document.getElementById('casaToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'casaToastContainer';
      toastContainer.style.position = 'fixed';
      toastContainer.style.bottom = '30px';
      toastContainer.style.left = '50%';
      toastContainer.style.transform = 'translateX(-50%)';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'casa-toast';
    toast.style.background = 'var(--accent-green)';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = 'var(--radius-pill)';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    toast.style.fontFamily = 'var(--font-accent)';
    toast.style.fontWeight = '700';
    toast.style.fontSize = '0.95rem';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.75rem';
    toast.innerHTML = `<i class="bi bi-check-circle-fill fs-5"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     7. Accessibility Helpers (ESC key listener for modals/drawers)
     -------------------------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openNav = document.querySelector('.navbar-collapse.show');
      if (openNav && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(openNav);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  });
});
