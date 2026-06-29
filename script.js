// NAV
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

function highlightNav() {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) cur = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.getAttribute('href') === '#' + cur)
  );
}

// REVEAL
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// COUNTERS
function count(el) {
  const target = +el.dataset.target, dur = 1800, step = target / (dur / 16);
  const addPlus = ['9','10','8'].includes(String(target));
  let c = 0;
  const t = setInterval(() => {
    c = Math.min(c + step, target);
    el.textContent = Math.floor(c) + (c >= target && addPlus ? '+' : '');
    if (c >= target) clearInterval(t);
  }, 16);
}
const co = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n').forEach(el => co.observe(el));

// BARS ANIMATION
window.addEventListener('load', () => {
  document.querySelectorAll('.hv-bar').forEach((b, i) => {
    const h = b.style.height; b.style.height = '0%';
    setTimeout(() => { b.style.height = h; }, 500 + i * 100);
  });
});

// BENTO MOUSE GLOW
document.querySelectorAll('.bc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});
