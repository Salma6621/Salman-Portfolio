/* ===================================================
   GAME DEVELOPER PORTFOLIO — script.js
   =================================================== */

'use strict';

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── Mobile hamburger ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Typewriter effect ── */
const typeEl = document.getElementById('typewriter-text');
const cursor = document.querySelector('.cursor');
const phrases = [
  'Game Developer',
  'Unity Specialist',
  'Gameplay Programmer',
  'Puzzle Architect',
  'Interactive Experience Creator',
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typewrite() {
  const current = phrases[phraseIndex];
  if (deleting) {
    typeEl.textContent = current.slice(0, --charIndex);
  } else {
    typeEl.textContent = current.slice(0, ++charIndex);
  }

  let delay = deleting ? 50 : 100;
  if (!deleting && charIndex === current.length) {
    delay = 2200; deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(typewrite, delay);
}
setTimeout(typewrite, 1200);

/* ── Canvas Particle System ── */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.spawn();
    this.bindEvents();
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn() {
    const count = Math.floor((this.canvas.width * this.canvas.height) / 9000);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(x, y) {
    const palette = ['#7c3aed', '#00f5ff', '#a855f7', '#fbbf24', '#ffffff'];
    return {
      x: x ?? Math.random() * this.canvas.width,
      y: y ?? Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      color: palette[Math.floor(Math.random() * palette.length)],
      life: 1,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles = [];
      this.spawn();
    });
    this.canvas.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      for (let i = 0; i < 3; i++) {
        this.particles.push(this.createParticle(
          e.clientX + (Math.random() - 0.5) * 20,
          e.clientY + (Math.random() - 0.5) * 20,
        ));
      }
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null; this.mouse.y = null;
    });
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => p.alpha > 0.01);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.0015;

      // Mouse repel
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x, dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += (dx / dist) * 0.15;
          p.vy += (dy / dist) * 0.15;
        }
      }

      // Draw
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Replenish
    if (Math.random() < 0.3) {
      this.particles.push(this.createParticle());
    }

    this.ctx.globalAlpha = 1;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.loop());
  }
}

const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) new ParticleSystem(heroCanvas);

/* ── Scroll Reveal ── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ── Skill Bar Animation ── */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target;
      fill.style.width = fill.dataset.width;
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(fill => skillObserver.observe(fill));

/* ── Stat counter animation ── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCounter(el, parseInt(el.dataset.target));
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ── Active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--accent-cyan)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObserver.observe(s));
