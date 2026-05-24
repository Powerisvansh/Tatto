/* ── CURSOR GLOW FOLLOW ── */
const glow = document.querySelector('.cursor-glow');
if (glow) {
  let gx = -200, gy = -200;
  document.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });
  let cx = -150, cy = -150;
  function tickGlow() {
    cx += (gx - cx) * 0.08;
    cy += (gy - cy) * 0.08;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(tickGlow);
  }
  tickGlow();
}

/* ── PARALLAX ON SCROLL ── */
const parallaxEls = document.querySelectorAll('.parallax-section');
function updateParallax() {
  const sy = window.scrollY;
  const wh = window.innerHeight;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0;
    const inner = el.querySelector('.parallax-inner');
    if (!inner) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    if (center > -rect.height && center < wh + rect.height) {
      const offset = (center - wh / 2) * speed;
      inner.style.transform = `translateY(${offset}px)`;
    }
  });
}
window.addEventListener('scroll', updateParallax, { passive: true });

/* ── LOADING SCREEN ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 600);
});

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE MENU ── */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.innerHTML = open ? '&#10005;' : '&#9776;';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '&#9776;';
  });
});

/* ── SMOOTH SCROLL WITH OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL PROGRESS ── */
const progressBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
});

/* ── COUNTER ANIMATION ── */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : '+';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── GALLERY LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
const galleryItems = document.querySelectorAll('.g-item');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  const src = item.dataset.src || item.querySelector('img').src;
  const label = item.querySelector('.g-label')?.textContent || '';
  lightboxImg.src = src;
  lightboxCaption.textContent = label;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  let next = currentIndex + dir;
  if (next < 0) next = galleryItems.length - 1;
  if (next >= galleryItems.length) next = 0;
  openLightbox(next);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── FORM VALIDATION ── */
const form = document.getElementById('bookForm');
const formMsg = document.getElementById('bookMsg');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;
  const fields = form.querySelectorAll('input[required], select[required], textarea');

  fields.forEach(field => {
    const group = field.closest('.form-group');
    const error = group.querySelector('.form-error');
    field.classList.remove('error', 'valid');

    if (!field.value.trim()) {
      field.classList.add('error');
      const label = field.placeholder || field.querySelector('option:checked')?.textContent || 'This field';
      error.textContent = `${label} is required`;
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('error');
      error.textContent = 'Please enter a valid email address';
      valid = false;
    } else if (field.type === 'tel' && field.value.trim().length < 7) {
      field.classList.add('error');
      error.textContent = 'Please enter a valid phone number';
      valid = false;
    } else {
      field.classList.add('valid');
      error.textContent = '';
    }
  });

  if (!valid) {
    formMsg.textContent = 'Please fix the errors above';
    formMsg.className = '';
    return;
  }

  formMsg.textContent = '✓ Request sent! We\'ll contact you within 24 hours.';
  formMsg.className = 'success';
  form.reset();
  fields.forEach(f => f.classList.remove('valid'));
});

/* ── LIVE INPUT VALIDATION ── */
form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    const group = field.closest('.form-group');
    const error = group.querySelector('.form-error');
    if (!field.hasAttribute('required')) return;
    if (!field.value.trim()) {
      field.classList.add('error');
      field.classList.remove('valid');
      error.textContent = `${field.placeholder || 'This field'} is required`;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('error');
      field.classList.remove('valid');
      error.textContent = 'Please enter a valid email address';
    } else if (field.type === 'tel' && field.value.trim().length < 7) {
      field.classList.add('error');
      field.classList.remove('valid');
      error.textContent = 'Please enter a valid phone number';
    } else {
      field.classList.remove('error');
      field.classList.add('valid');
      error.textContent = '';
    }
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.artist-card, .style-card, .care-card, .g-item, .section-head').forEach((el, i) => {
  const revealClass = el.classList.contains('care-card') ? 'reveal-scale' : 'reveal';
  el.classList.add(revealClass);
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});