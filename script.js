(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('dm-toggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    root.setAttribute('data-theme', 'dark');
    toggle && (toggle.textContent = '☀️');
  } else if (saved === 'light') {
    root.setAttribute('data-theme', 'light');
    toggle && (toggle.textContent = '🌙');
  }

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // Profile switcher
  // (removed) unified layout now

  // Vertical skills ticker (right column)
  const skillsTicker = document.getElementById('skills-ticker');
  if (skillsTicker) {
    const track = skillsTicker.querySelector('.ticker-track');
    const items = Array.from(track.children);
    // дублируем элементы для бесшовной прокрутки
    items.forEach(i => track.appendChild(i.cloneNode(true)));
    let offset = 0;
    const rowHeight = () => track.querySelector('.ticker-row').getBoundingClientRect().height + 8; // +gap
    const step = () => {
      offset += 0.35; // медленнее
      const h = rowHeight();
      if (offset >= h) {
        track.appendChild(track.firstElementChild);
        offset = 0;
      }
      track.style.transform = `translateY(${-offset}px)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Animate radial charts on view
  const radials = document.querySelectorAll('.radial');
  const circumference = 2 * Math.PI * 52; // r=52
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const fg = el.querySelector('.fg');
        const pct = Number(el.getAttribute('data-percent')) || 0;
        const offset = circumference * (1 - pct / 100);
        if (fg) {
          fg.style.strokeDasharray = String(circumference);
          fg.style.strokeDashoffset = String(circumference);
          requestAnimationFrame(() => {
            fg.style.transition = 'stroke-dashoffset 1.2s ease';
            fg.style.strokeDashoffset = String(offset);
          });
        }
        io.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  radials.forEach(r => io.observe(r));

  // Animated counters for badges
  const counters = document.querySelectorAll('.badge .count');
  const co = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-target')) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) { current = target; }
        el.textContent = String(current);
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));

  // Ripple/spotlight follow for buttons
  document.addEventListener('pointermove', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('btn')) return;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--x', x + '%');
    target.style.setProperty('--y', y + '%');
  });

  // Horizontal projects carousel auto-rotate
  const pv = document.getElementById('projects-viewport');
  if (pv) {
    const track = pv.querySelector('.carousel-track');
    const cards = Array.from(track.querySelectorAll('.proj-card'));
    // копируем для бесшовного потока
    cards.forEach(c => track.appendChild(c.cloneNode(true)));
    let offsetX = 0;
    const cardW = () => track.querySelector('.proj-card').getBoundingClientRect().width + 16; // учитывать gap
    const animate = () => {
      offsetX += 0.35; // медленнее и мягче
      const w = cardW();
      if (offsetX >= w) {
        track.appendChild(track.firstElementChild);
        offsetX = 0;
      }
      track.style.transform = `translateX(${-offsetX}px)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
})();


