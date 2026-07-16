// ============================================
// LIGHT / DARK MODE TOGGLE
// (same idea as the Light/Dark Mode Website project)
// ============================================
const root = document.documentElement;
const modeToggle = document.getElementById('modeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('fj-theme', theme);
}

const savedTheme = localStorage.getItem('fj-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

modeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================
// SIGNATURE CORNER HANDLES (Figma-style selection marks)
// ============================================
document.querySelectorAll('[data-handles]').forEach(el => {
  ['tl', 'tr', 'bl', 'br'].forEach(pos => {
    const span = document.createElement('span');
    span.className = `handle handle--${pos}`;
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
  });
});

// ============================================
// MOBILE MENU
// ============================================
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// HERO ROLE TYPING EFFECT
// ============================================
const roles = ['work.', 'feel right.', 'ship fast.', 'don\u2019t break.'];
const roleEl = document.getElementById('roleText');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (roleEl && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > word.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }

    roleEl.textContent = roles[roleIndex].slice(0, charIndex);
    setTimeout(tick, deleting ? 45 : 85);
  }

  setTimeout(tick, 2200);
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealTargets = document.querySelectorAll(
  '.about__grid, .timeline__item, .internship-card, .project, .skills__col, .cert, .contact__grid'
);

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s cubic-bezier(.16,.84,.44,1), transform .7s cubic-bezier(.16,.84,.44,1)';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => observer.observe(el));

if (reduceMotion) {
  revealTargets.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
// ============================================
// CONTACT FORM — opens the visitor's email app
// (no backend here, so mailto is the honest option)
// ============================================
const contactForm = document.getElementById('contactForm');
const cfNote = document.getElementById('cfNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim() || 'Project discussion';
    const message = contactForm.message.value.trim();

    const body = `${message}\n\n— ${name} (${email})`;
    const mailto = `mailto:fjain080@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    if (cfNote) {
      cfNote.textContent = 'Opening your email app…';
      setTimeout(() => {
        cfNote.textContent = "Opens your email app with this filled in — I'll reply from there.";
      }, 4000);
    }
  });
}