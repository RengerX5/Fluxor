/* =============================================
   FLUXOR — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Navbar: scroll effect + mobile toggle ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navbar-toggle');
  const navMenu = document.getElementById('navbar-menu');

  // Scroll sticky effect
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ---- 2. Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ---- 3. FAQ Accordion ---- */
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('faq-item--open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('faq-item--open');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was open)
      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ---- 4. Pricing Toggle ---- */
  const pricingToggle = document.getElementById('pricing-toggle');
  if (pricingToggle) {
    const btns = pricingToggle.querySelectorAll('.pricing__toggle-btn');
    let currentPlan = 'yearly';

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.plan;
        if (plan === currentPlan) return;

        currentPlan = plan;

        btns.forEach(b => b.classList.toggle('pricing__toggle-btn--active', b.dataset.plan === plan));

        // Update prices with animation
        document.querySelectorAll('.pricing-card__amount').forEach(el => {
          el.classList.add('changing');
          setTimeout(() => {
            el.textContent = el.dataset[plan] || el.textContent;
            el.classList.remove('changing');
          }, 125);
        });
      });
    });
  }


  /* ---- 5. Animated Number Counters (Stats section) ---- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item__value[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const isDecimal = String(target).includes('.');

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const display = isDecimal ? current.toFixed(1) : Math.floor(current);
      el.textContent = `${prefix}${display}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }


  /* ---- 6. Reviews Carousel: drag/swipe + auto-scroll ---- */
  const track = document.getElementById('reviews-track');
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      const diff = touchStartX - e.touches[0].clientX;
      track.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });

    // Auto-scroll (pauses on hover)
    let autoScroll;
    let paused = false;

    const startAutoScroll = () => {
      autoScroll = setInterval(() => {
        if (!paused) {
          const maxScroll = track.scrollWidth - track.clientWidth;
          if (track.scrollLeft >= maxScroll) {
            track.scrollLeft = 0;
          } else {
            track.scrollLeft += 390;
          }
        }
      }, 4000);
    };

    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    startAutoScroll();
  }


  /* ---- 7. Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        navMenu?.classList.remove('open');
        navToggle?.classList.remove('open');
      }
    });
  });

});
