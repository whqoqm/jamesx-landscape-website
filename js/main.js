/* ============================================
   JAMES X LANDSCAPE PHOTOGRAPHY
   Main JavaScript
   ============================================ */

(function() {
  'use strict';

  /* ---- Hero Slideshow ---- */
  // Hero slideshow — 6 dramatic landscape shots
  const SLIDES = [
    'DSC_4479_ffff1.jpg',
    'DSC_5571-Edit_fff1.jpg',
    'DSC_8958_ffff1.jpg',
    'DSC_5586_ffff1.jpg',
    'DSC_0988_fff1.jpg',
    'DSC_2070_fff1.jpg',
  ];

  function initHeroSlideshow() {
    const container = document.querySelector('.hero-slides');
    if (!container) return;

    // Build slides
    SLIDES.forEach((photo, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.src = `optimized/${photo}`;
      img.alt = 'James X Landscape Photography';
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      container.appendChild(slide);
    });

    // Build dots
    const dotsContainer = document.querySelector('.hero-dots');
    if (dotsContainer) {
      SLIDES.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    let current = 0;
    let timer;

    function goToSlide(idx) {
      const slides = document.querySelectorAll('.hero-slide');
      const dots = document.querySelectorAll('.hero-dot');
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + SLIDES.length) % SLIDES.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      resetTimer();
    }

    function nextSlide() {
      goToSlide(current + 1);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 5000);
    }

    timer = setInterval(nextSlide, 5000);

    // Touch / swipe support
    let touchStartX = 0;
    container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? goToSlide(current + 1) : goToSlide(current - 1);
      }
    });
  }

  /* ---- Lightbox ---- */
  const ALL_PHOTOS = [
    'DSC_0041_f1.jpg','DSC_0050_f1.jpg','DSC_0192_ff1.jpg','DSC_0597_f1.jpg',
    'DSC_0988_fff1.jpg','DSC_1416_f1.jpg','DSC_2070_fff1.jpg','DSC_2644_ff1.jpg',
    'DSC_3178_ff1.jpg','DSC_3356-ff1.jpg','DSC_4459_f1.jpg','DSC_4479_ffff1.jpg',
    'DSC_5519_f1.jpg','DSC_5534_ff1.jpg','DSC_5571-Edit_fff1.jpg','DSC_5586_ffff1.jpg',
    'DSC_5632_f1.jpg','DSC_5632_fff1.jpg','DSC_5673_f1.jpg','DSC_5834_f1.jpg',
    'DSC_6062_f1.jpg','DSC_6099_f1.jpg','DSC_6731_ff1.jpg','DSC_7057_ff1.jpg',
    'DSC_7518_f1.jpg','DSC_7741-f111.jpg','DSC_7763_f1.jpg','DSC_8137_fff1.jpg',
    'DSC_8958_ffff1.jpg','DSC_9301_fff1.jpg',
  ];

  let lbCurrent = 0;
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  function openLightbox(index) {
    lbCurrent = index;
    showLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLightboxImage() {
    lbImg.src = `optimized/${ALL_PHOTOS[lbCurrent]}`;
    lbCounter.textContent = `${lbCurrent + 1} / ${ALL_PHOTOS.length}`;
    lbPrev.style.display = lbCurrent === 0 ? 'none' : '';
    lbNext.style.display = lbCurrent === ALL_PHOTOS.length - 1 ? 'none' : '';
  }

  function lbPrevFn() {
    if (lbCurrent > 0) { lbCurrent--; showLightboxImage(); }
  }

  function lbNextFn() {
    if (lbCurrent < ALL_PHOTOS.length - 1) { lbCurrent++; showLightboxImage(); }
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', lbPrevFn);
  if (lbNext) lbNext.addEventListener('click', lbNextFn);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrevFn();
    if (e.key === 'ArrowRight') lbNextFn();
  });

  // Attach to gallery items
  function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(i); });
    });
  }

  /* ---- Nav scroll effect ---- */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---- Hamburger menu ---- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active nav link ---- */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) current = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
      });
    }, { passive: true });
  }

  /* ---- Contact form ---- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        message: form.querySelector('#message').value,
      };

      try {
        const res = await fetch(form.action || '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          btn.textContent = 'Message Sent';
          btn.style.background = 'var(--accent)';
          btn.style.color = 'var(--bg)';
          form.reset();
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        btn.textContent = 'Error — Please try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = original; }, 3000);
      }
    });
  }

  /* ---- Scroll reveal ---- */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
  }

  /* ---- Init all ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroSlideshow();
    initGallery();
    initNavScroll();
    initMobileMenu();
    initActiveNav();
    initContactForm();
    initScrollReveal();
  });

})();
