/* ====================================================
   FONSEC SYSTEM TECH — JavaScript
   (sin chatbot · cursor normal · contadores fijos)
   ==================================================== */

// ── PARTICLES ────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;
  const colors = ['#00d4ff','#7c3aed','#10b981','#f59e0b','#a855f7'];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3.5 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 20 + 10}s;
      animation-delay:${Math.random() * 20}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(p);
  }
})();

// ── NAVBAR SCROLL ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── HAMBURGER ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
  });
});

// ── TYPEWRITER ───────────────────────────────────────
const twEl    = document.getElementById('typewriter');
const phrases = [
  'PC y Laptops.',
  'Consolas Xbox & PlayStation.',
  'Celulares y Smartphones.',
  'Diagnóstico por solo $15.000.',
  'Recogemos tu equipo a domicilio.',
];
let pi = 0, ci = 0, deleting = false;
function typeWrite() {
  const cur = phrases[pi];
  twEl.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
  deleting ? ci-- : ci++;
  if (!deleting && ci === cur.length) { deleting = true; setTimeout(typeWrite, 1800); return; }
  if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  setTimeout(typeWrite, deleting ? 48 : 78);
}
if (twEl) typeWrite();

// ── COUNTER ANIMATION ────────────────────────────────
function countUp(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const t = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(t); }
    else el.textContent = Math.floor(start);
  }, 16);
}

// Trigger counters when hero stats come into view
const statTargets = { statEquipos: 500, statClientes: 100, statEstrellas: 5 };
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const id = el.id;
    if (statTargets[id] !== undefined) {
      countUp(el, statTargets[id], id === 'statEstrellas' ? 1000 : 2000);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

Object.keys(statTargets).forEach(id => {
  const el = document.getElementById(id);
  if (el) counterObs.observe(el);
});

// ── SCROLL REVEAL ────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── 3D TILT ON SERVICE CARDS ─────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-6px)`;
    card.style.transition = 'transform 0.1s ease';
    const glow = card.querySelector('.card-glow');
    if (glow) { glow.style.left = (e.clientX - r.left - 100) + 'px'; glow.style.top = (e.clientY - r.top - 100) + 'px'; }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s ease';
    const glow = card.querySelector('.card-glow');
    if (glow) { glow.style.left = ''; glow.style.top = ''; }
  });
});

// ── MOUSE SHINE ON CARDS ─────────────────────────────
document.querySelectorAll('.mega-card, .galeria-card').forEach(card => {
  const shine = document.createElement('div');
  shine.style.cssText = `
    position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:0;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,212,255,0.07) 0%, transparent 55%);
    opacity:0; transition: opacity 0.3s ease;
  `;
  card.appendChild(shine);
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    shine.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    shine.style.setProperty('--my', ((e.clientY - r.top ) / r.height* 100).toFixed(1) + '%');
    shine.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => shine.style.opacity = '0');
});

// ── WINDOWS CARD FLASH ───────────────────────────────
document.querySelectorAll('.win-card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.boxShadow = '0 0 30px rgba(0,120,212,0.85)';
    setTimeout(() => card.style.boxShadow = '', 500);
  });
});

// ── STAR RATING ──────────────────────────────────────
const stars           = document.querySelectorAll('.star-btn');
const ratingLabel     = document.getElementById('ratingLabel');
const ratingComWrap   = document.getElementById('ratingCommentWrap');
const submitRatingBtn = document.getElementById('submitRating');
const ratingComInput  = document.getElementById('ratingComment');
const reviewsGrid     = document.getElementById('reviewsGrid');

const starLabels = ['','Muy malo 😞','Regular 😐','Bien 🙂','Muy bien 😊','¡Excelente! ⭐🔥'];
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const v = +star.dataset.value;
    stars.forEach(s => s.classList.toggle('hovered', +s.dataset.value <= v));
    if (ratingLabel) ratingLabel.textContent = starLabels[v];
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hovered'));
    if (ratingLabel) ratingLabel.textContent = selectedRating > 0 ? starLabels[selectedRating] : 'Sin calificar';
  });
  star.addEventListener('click', () => {
    selectedRating = +star.dataset.value;
    stars.forEach(s => s.classList.toggle('active', +s.dataset.value <= selectedRating));
    if (ratingLabel)   ratingLabel.textContent = starLabels[selectedRating];
    if (ratingComWrap) ratingComWrap.style.display = 'flex';
    star.style.transform = 'scale(1.5)';
    setTimeout(() => star.style.transform = '', 300);
    starBurst(star);
  });
});

function starBurst(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    const angle = (i / 8) * 360;
    spark.style.cssText = `
      position:fixed; width:6px; height:6px; background:#f59e0b; border-radius:50%;
      left:${rect.left + rect.width/2}px; top:${rect.top + rect.height/2}px;
      pointer-events:none; z-index:99999;
      transform:translate(-50%,-50%); box-shadow:0 0 6px #f59e0b;
    `;
    document.body.appendChild(spark);
    const rad = (angle * Math.PI) / 180;
    const d   = 40 + Math.random() * 30;
    spark.animate([
      { transform:'translate(-50%,-50%) scale(1)', opacity:1 },
      { transform:`translate(calc(-50% + ${Math.cos(rad)*d}px), calc(-50% + ${Math.sin(rad)*d}px)) scale(0)`, opacity:0 }
    ],{ duration:600, easing:'ease-out' }).onfinish = () => spark.remove();
  }
}

if (submitRatingBtn) {
  submitRatingBtn.addEventListener('click', () => {
    if (!selectedRating) return;
    const comment = (ratingComInput && ratingComInput.value.trim()) || '¡Excelente servicio, muy profesional!';
    const starStr = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
    const avatars = ['👨','👩','🧑','👦','👧','🧔','👩‍💻','👨‍💼'];
    const names   = ['Cliente Satisfecho','Usuario Nuevo','Visitante','Cliente Fonsec','Vecino de Soledad'];
    const card    = document.createElement('div');
    card.className = 'review-card new-review';
    card.innerHTML = `
      <div class="review-stars" style="color:#f59e0b">${starStr}</div>
      <p class="review-text">"${comment}"</p>
      <div class="review-author">
        <div class="review-avatar">${avatars[Math.floor(Math.random()*avatars.length)]}</div>
        <div>
          <span class="review-name">${names[Math.floor(Math.random()*names.length)]}</span>
          <span class="review-service">Calificación: ${selectedRating}/5</span>
        </div>
      </div>`;
    if (reviewsGrid) reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
    stars.forEach(s => s.classList.remove('active'));
    selectedRating = 0;
    if (ratingLabel)   ratingLabel.textContent = '¡Gracias por tu reseña! 🙏';
    if (ratingComWrap) ratingComWrap.style.display = 'none';
    if (ratingComInput) ratingComInput.value = '';
    launchConfetti();
  });
}

// ── CONFETTI ─────────────────────────────────────────
function launchConfetti() {
  const colors = ['#00d4ff','#7c3aed','#10b981','#f59e0b','#ef4444','#a855f7'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = Math.random() * 10 + 5;
    c.style.cssText = `
      position:fixed; width:${size}px; height:${size}px; background:${color};
      left:${Math.random()*100}vw; top:-20px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      pointer-events:none; z-index:99999;
    `;
    document.body.appendChild(c);
    c.animate([
      { transform:'translateY(0) rotate(0deg)', opacity:1 },
      { transform:`translateY(100vh) translateX(${(Math.random()-.5)*200}px) rotate(${Math.random()*720}deg)`, opacity:0 }
    ],{ duration: Math.random()*2000+1000, easing:'ease-in' }).onfinish = () => c.remove();
  }
}

// ── COTIZAR FORM ─────────────────────────────────────
const cotizarForm = document.getElementById('cotizarForm');
const formSuccess = document.getElementById('formSuccess');
if (cotizarForm) {
  cotizarForm.addEventListener('submit', e => {
    e.preventDefault();
    const nombre    = document.getElementById('nombre').value.trim();
    const telefono  = document.getElementById('telefono').value.trim();
    const equipo    = document.getElementById('equipo').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    if (!nombre || !telefono || !equipo || !descripcion) return;
    const btn = cotizarForm.querySelector('.btn-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled  = true;
    const labels  = { pc:'🖥️ PC de Escritorio', laptop:'💻 Laptop', xbox:'🎮 Xbox', playstation:'🎮 PlayStation', celular:'📱 Celular', otro:'🔧 Otro' };
    setTimeout(() => {
      const msg = `Hola Fonsec Necesito de tu ayuda con un equipo\n\n📋 *COTIZACIÓN*\n👤 Nombre: ${nombre}\n📞 Teléfono: ${telefono}\n🖥️ Equipo: ${labels[equipo]||equipo}\n📝 Descripción: ${descripcion}`;
      window.open(`https://wa.me/573043469821?text=${encodeURIComponent(msg)}`, '_blank');
      cotizarForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      launchConfetti();
    }, 1400);
  });
}

// ── SMOOTH SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 78, behavior:'smooth' });
  });
});

// ── RIPPLE ON BUTTONS ────────────────────────────────
document.querySelectorAll('.btn, .card-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r    = this.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const rip  = document.createElement('span');
    rip.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      background:rgba(255,255,255,0.25); border-radius:50%;
      left:${e.clientX-r.left-size/2}px; top:${e.clientY-r.top-size/2}px;
      transform:scale(0); pointer-events:none;
    `;
    this.appendChild(rip);
    rip.animate([{transform:'scale(0)',opacity:1},{transform:'scale(2)',opacity:0}],
      {duration:480,easing:'ease-out'}).onfinish = () => rip.remove();
  });
});

// ── ACTIVE NAV ON SCROLL ─────────────────────────────
const allSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const sy = window.pageYOffset;
  allSections.forEach(sec => {
    const top = sec.offsetTop - 110;
    const lnk = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (lnk) lnk.style.color = (sy >= top && sy < top + sec.offsetHeight) ? '#00d4ff' : '';
  });
}, { passive: true });

// ── CONSOLE EASTER EGG ───────────────────────────────
console.log('%c⚡ FONSEC SYSTEM TECH', 'color:#00d4ff;font-family:monospace;font-size:22px;font-weight:bold;');
console.log('%cServicio Técnico Profesional | WhatsApp: +57 304 346 9821','color:#10b981;font-size:13px;');

/* ════════════════════════════════════════════════════
   SERVICE DETAIL MODAL
════════════════════════════════════════════════════ */
const SERVICE_DATA = {
  // PC & LAPTOPS
  'pc-preventivo': {
    icon: '🔧', title: 'Mantenimiento Preventivo',
    sub: 'Evita fallas futuras con una revisión completa de tu PC o laptop.',
    items: [
      '🧹 Limpieza interna profunda de polvo y residuos',
      '🌡️ Cambio de pasta térmica en CPU y GPU',
      '🔩 Revisión y ajuste de conexiones internas',
      '💨 Verificación del sistema de ventilación',
      '🔋 Revisión del estado de la batería (laptops)',
      '⚡ Prueba de voltajes y estabilidad del sistema',
    ]
  },
  'pc-correctivo': {
    icon: '🛠️', title: 'Mantenimiento Correctivo',
    sub: 'Identificamos y reparamos la falla que tiene tu equipo.',
    items: [
      '🔍 Diagnóstico completo de hardware y software',
      '🔄 Cambio de componentes dañados',
      '🌡️ Cambio de pasta térmica si es necesario',
      '🔧 Reparación de puertos y conectores',
      '✅ Prueba final de funcionamiento',
      '📋 Reporte detallado del trabajo realizado',
    ]
  },
  'pc-diagnostico': {
    icon: '🔍', title: 'Diagnóstico de Fallas',
    sub: 'Precio fijo $15.000 — Para todos los equipos sin excepción.',
    items: [
      '🖥️ Revisión completa de hardware (RAM, disco, CPU)',
      '💿 Análisis del sistema operativo y software',
      '🌡️ Medición de temperaturas y voltajes',
      '📊 Prueba de rendimiento general del equipo',
      '📋 Informe detallado con las fallas encontradas',
      '💰 Cotización del servicio de reparación sin compromiso',
    ]
  },
  'pc-windows': {
    icon: '💿', title: 'Instalación de Windows',
    sub: 'Instalamos Windows 7, 8, 10 u 11 según tu equipo y necesidad.',
    items: [
      '🪟 Windows 7, 8, 8.1, 10 y 11 disponibles',
      '💾 Instalación limpia y activada originalmente',
      '🔧 Instalación de todos los drivers necesarios',
      '📦 Paquete Office actualizado incluido (opcional)',
      '⚡ Configuración inicial optimizada',
      '🛡️ Instalación de antivirus recomendado',
    ]
  },
  'pc-recuperacion': {
    icon: '💾', title: 'Recuperación de Archivos',
    sub: 'Recuperamos tus fotos, documentos y datos importantes.',
    items: [
      '📸 Recuperación de fotos y videos',
      '📄 Recuperación de documentos y archivos',
      '💽 Análisis de disco duro dañado o formateado',
      '🔐 Recuperación de datos de USB y memorias SD',
      '☁️ Copia de seguridad en disco externo (adicional)',
      '✅ Entrega organizada de todos los archivos recuperados',
    ]
  },
  'pc-formateo': {
    icon: '🧹', title: 'Formateo Completo',
    sub: 'Tu PC como nuevo — limpio, rápido y sin problemas.',
    items: [
      '🗑️ Formateo completo del disco duro o SSD',
      '💿 Instalación limpia del sistema operativo',
      '🔧 Instalación de todos los drivers',
      '📦 Office y programas básicos instalados',
      '🛡️ Antivirus configurado',
      '⚡ PC optimizado para máximo rendimiento',
    ]
  },
  'pc-office': {
    icon: '📦', title: 'Paquete Office Original',
    sub: 'Suite de oficina completa y actualizada para tu PC.',
    items: [
      '📝 Microsoft Word actualizado',
      '📊 Microsoft Excel actualizado',
      '📊 Microsoft PowerPoint actualizado',
      '📧 Microsoft Outlook (opcional)',
      '✅ Activación original garantizada',
      '🔄 Actualizaciones automáticas incluidas',
    ]
  },
  'pc-optimizacion': {
    icon: '⚡', title: 'PC Optimizado al Máximo',
    sub: 'Hacemos que tu PC vuele aunque sea antiguo.',
    items: [
      '🚀 Desactivación de programas innecesarios al inicio',
      '🧹 Limpieza profunda de archivos temporales y basura',
      '💿 Desfragmentación y optimización del disco',
      '⚙️ Ajuste de configuraciones de rendimiento',
      '🛡️ Eliminación de virus, malware y spyware',
      '📊 Reporte de mejora en velocidad antes/después',
    ]
  },
  // CONSOLAS
  'con-xbox1': {
    icon: '🕹️', title: 'Xbox One — Mantenimiento',
    sub: 'Servicio completo para tu Xbox One.',
    items: [
      '🧼 Limpieza interna profunda de polvo',
      '🌡️ Cambio de pasta térmica del procesador',
      '💨 Revisión y limpieza del sistema de ventilación',
      '🔧 Revisión de conectores y puertos HDMI',
      '💿 Diagnóstico de lector de discos',
      '✅ Prueba de funcionamiento con juego real',
    ]
  },
  'con-xbox360': {
    icon: '🕹️', title: 'Xbox 360 — Mantenimiento',
    sub: 'Reparamos y mantenemos tu Xbox 360.',
    items: [
      '🧼 Limpieza interna profunda',
      '🌡️ Cambio de pasta térmica',
      '🔴 Solución al error de los 3 aros rojos (RROD)',
      '💨 Revisión del ventilador',
      '💿 Revisión del lector de discos',
      '✅ Prueba completa de funcionamiento',
    ]
  },
  'con-ps': {
    icon: '🎮', title: 'PlayStation — Mantenimiento',
    sub: 'Servicio técnico completo para tu PlayStation.',
    items: [
      '🧼 Limpieza interna de polvo acumulado',
      '🌡️ Cambio de pasta térmica',
      '💨 Limpieza y revisión de ventiladores',
      '💿 Revisión del lector de discos Blu-ray',
      '🔧 Revisión de puertos USB y HDMI',
      '✅ Prueba con juego antes de entrega',
    ]
  },
  'con-joystick': {
    icon: '🔧', title: 'Cambio de Joystick / Control',
    sub: 'Reparamos o reemplazamos el joystick de tu control.',
    items: [
      '🕹️ Diagnóstico del control (stick drift, botones)',
      '🔧 Cambio de joystick analógico dañado',
      '🔘 Reparación de botones que no responden',
      '🔋 Revisión de la batería del control',
      '🧼 Limpieza interna del control',
      '✅ Prueba completa antes de entregar',
    ]
  },
  'con-diagnostico': {
    icon: '🔍', title: 'Diagnóstico de Consola',
    sub: 'Diagnóstico completo por solo $15.000.',
    items: [
      '🔌 Revisión de alimentación eléctrica',
      '📺 Prueba de salida de video HDMI',
      '💿 Verificación del lector de discos',
      '🌡️ Medición de temperatura interna',
      '🎮 Prueba de controles y puertos',
      '📋 Reporte con fallas encontradas y cotización',
    ]
  },
  'con-limpieza': {
    icon: '🧼', title: 'Limpieza Interna Profunda',
    sub: 'Tu consola silenciosa y fría como el primer día.',
    items: [
      '💨 Soplado y extracción de polvo acumulado',
      '🌡️ Cambio de pasta térmica obligatorio',
      '🔩 Desmontaje completo y limpieza de piezas',
      '💡 Revisión de luces indicadoras',
      '🧴 Limpieza de lentes del lector',
      '✅ Prueba de rendimiento térmico después',
    ]
  },
  // CELULARES
  'cel-pantalla': {
    icon: '📺', title: 'Cambio de Pantalla',
    sub: 'Pantalla nueva, táctil perfecto, colores vivos.',
    items: [
      '🔍 Diagnóstico previo completo del display',
      '📦 Pantalla de calidad garantizada',
      '🔧 Desmontaje y montaje profesional',
      '📱 Calibración del táctil después del cambio',
      '🛡️ Limpieza de cámara y altavoz',
      '✅ Garantía en la pantalla instalada',
    ]
  },
  'cel-pin': {
    icon: '🔌', title: 'Cambio de Pin de Carga',
    sub: 'Tu celular cargando perfectamente otra vez.',
    items: [
      '🔍 Diagnóstico del puerto de carga',
      '🔌 Cambio del conector USB-C / MicroUSB / Lightning',
      '🧹 Limpieza del puerto si hay suciedad',
      '⚡ Prueba de carga rápida si aplica',
      '🔋 Revisión del estado de la batería incluida',
      '✅ Prueba final con cargador original y genérico',
    ]
  },
  'cel-bateria': {
    icon: '🔋', title: 'Cambio de Batería',
    sub: 'Batería nueva = celular como nuevo.',
    items: [
      '🔍 Diagnóstico del estado actual de la batería',
      '🔋 Batería de calidad garantizada',
      '🔧 Cambio profesional sin dañar otros componentes',
      '⚡ Calibración de la nueva batería',
      '📊 Prueba de duración después del cambio',
      '✅ Garantía en la batería instalada',
    ]
  },
  'cel-diagnostico': {
    icon: '🔍', title: 'Diagnóstico de Celular',
    sub: 'Diagnóstico completo por solo $15.000.',
    items: [
      '📱 Revisión completa de hardware (pantalla, cámara, mic)',
      '🔋 Análisis del estado de la batería',
      '🔌 Revisión del puerto de carga',
      '🔊 Prueba de altavoces y micrófono',
      '📶 Verificación de antenas (WiFi, bluetooth, señal)',
      '📋 Informe detallado con cotización de reparación',
    ]
  },
};

// Modal open/close
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

function openModal(svcKey) {
  const data = SERVICE_DATA[svcKey];
  if (!data) return;
  document.getElementById('modalIcon').textContent  = data.icon;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalSub').textContent   = data.sub;
  const list = document.getElementById('modalList');
  list.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.svc-item').forEach(el => {
  el.addEventListener('click', () => openModal(el.dataset.svc));
});
if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ════════════════════════════════════════════════════
   HORARIO EN TIEMPO REAL — RELOJ LIVE + ESTADO ABIERTO/CERRADO
   Zona horaria: Colombia (UTC-5)
════════════════════════════════════════════════════ */

(function initHorarioLive() {

  // ── Horarios de atención (hora local Colombia) ────
  // Cada entrada: { days: [0-6 Sun=0], open: [h,m], close: [h,m] }
  const SCHEDULES = [
    { id: 'lun-jue', days: [1,2,3,4], open: [14,30], close: [17,0]  },
    { id: 'viernes', days: [5],        open: [9,0],  close: [16,30] },
    { id: 'sabado',  days: [6],        open: [9,0],  close: [15,30] },
  ];

  const DAYS_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  // DOM refs
  const liveTimeEl   = document.getElementById('liveTime');
  const liveDateEl   = document.getElementById('liveDate');
  const bannerEl     = document.getElementById('horarioStatusBanner');
  const bannerDotEl  = document.getElementById('statusBannerDot');
  const bannerTextEl = document.getElementById('statusBannerText');
  const bannerNextEl = document.getElementById('statusBannerNext');

  // Per-card refs keyed by schedule id
  const cardRefs = {};
  SCHEDULES.forEach(s => {
    cardRefs[s.id] = {
      card:     document.querySelector(`[data-schedule="${s.id}"]`),
      live:     document.getElementById(`hc-live-${s.id}`),
      status:   document.getElementById(`hs-${s.id}`),
      progress: document.getElementById(`hpf-${s.id}`),
    };
  });

  // ── Helpers ──────────────────────────────────────
  function toMins(h, m) { return h * 60 + m; }

  function pad(n) { return String(n).padStart(2, '0'); }

  function formatAMPM(h, m) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    return `${hh}:${pad(m)} ${ampm}`;
  }

  // Get current Colombia time (UTC-5)
  function getNowColombia() {
    // toLocaleString with timeZone is universally supported
    const opts = { timeZone: 'America/Bogota', hour12: false,
                   year:'numeric', month:'2-digit', day:'2-digit',
                   hour:'2-digit', minute:'2-digit', second:'2-digit' };
    const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(new Date());
    const get = type => parseInt(parts.find(p => p.type === type).value, 10);
    return {
      year:   get('year'),
      month:  get('month') - 1,  // 0-indexed
      day:    get('day'),
      hour:   get('hour') === 24 ? 0 : get('hour'),
      minute: get('minute'),
      second: get('second'),
      dow:    new Date(get('year'), get('month') - 1, get('day')).getDay(),
    };
  }

  // Find which schedule is currently open, if any
  function getCurrentSchedule(now) {
    const nowMins = toMins(now.hour, now.minute);
    return SCHEDULES.find(s =>
      s.days.includes(now.dow) &&
      nowMins >= toMins(s.open[0], s.open[1]) &&
      nowMins <  toMins(s.close[0], s.close[1])
    ) || null;
  }

  // Find next opening
  function getNextOpening(now) {
    const nowMins  = toMins(now.hour, now.minute);
    let bestDelta  = Infinity;
    let bestSched  = null;
    let bestDayOff = 0;

    for (let d = 0; d <= 7; d++) {
      const checkDow = (now.dow + d) % 7;
      SCHEDULES.forEach(s => {
        if (!s.days.includes(checkDow)) return;
        const openMins = toMins(s.open[0], s.open[1]);
        const delta    = d === 0
          ? (nowMins < openMins ? openMins - nowMins : Infinity)
          : (1440 * d - nowMins + openMins);
        if (delta < bestDelta) {
          bestDelta  = delta;
          bestSched  = s;
          bestDayOff = d;
        }
      });
      if (bestDelta < Infinity && d > 0) break;
    }

    if (!bestSched) return null;
    const dayName = DAYS_ES[(now.dow + bestDayOff) % 7];
    const timeStr = formatAMPM(bestSched.open[0], bestSched.open[1]);
    return bestDayOff === 0
      ? `Abre hoy a las ${timeStr}`
      : `Próxima apertura: ${dayName} ${timeStr}`;
  }

  // ── Main tick ────────────────────────────────────
  function tick() {
    const now = getNowColombia();

    // ── Update live clock display ─────────────────
    if (liveTimeEl) {
      liveTimeEl.textContent = formatAMPM(now.hour, now.minute) + ':' + pad(now.second)
        .replace(':' + pad(now.second), ''); // keep it to HH:MM AM/PM
      // Actually show HH:MM:SS AM/PM for live feel
      const h12 = now.hour % 12 || 12;
      const ampm = now.hour >= 12 ? 'PM' : 'AM';
      liveTimeEl.textContent = `${pad(h12)}:${pad(now.minute)}:${pad(now.second)} ${ampm}`;
    }
    if (liveDateEl) {
      liveDateEl.textContent = `${DAYS_ES[now.dow]} · ${now.day} ${MONTHS_ES[now.month]}`;
    }

    // ── Determine open/closed for each card ───────
    const openSched = getCurrentSchedule(now);

    SCHEDULES.forEach(s => {
      const refs      = cardRefs[s.id];
      if (!refs.card) return;

      const isThisDay = s.days.includes(now.dow);
      const nowMins   = toMins(now.hour, now.minute);
      const openMins  = toMins(s.open[0],  s.open[1]);
      const closeMins = toMins(s.close[0], s.close[1]);
      const isOpen    = openSched && openSched.id === s.id;

      // Toggle card classes
      refs.card.classList.toggle('is-open-now',   isOpen);
      refs.card.classList.toggle('is-closed-now', isThisDay && !isOpen);

      // Live indicator badge (only visible when currently open)
      if (refs.live) {
        refs.live.classList.toggle('visible', isOpen);
      }

      // Status text
      if (refs.status) {
        const dot  = refs.status.querySelector('.status-dot');
        const text = refs.status.querySelector('.hs-text');
        if (isOpen) {
          const minsLeft = closeMins - nowMins;
          const hLeft    = Math.floor(minsLeft / 60);
          const mLeft    = minsLeft % 60;
          const timeLeft = hLeft > 0 ? `${hLeft}h ${mLeft}m` : `${mLeft}m`;
          if (text) text.textContent = `Abierto · Cierra en ${timeLeft}`;
          if (dot)  { dot.style.background = 'var(--green)'; dot.style.boxShadow = '0 0 7px var(--green)'; dot.style.animation = 'blink 1.5s infinite'; }
          refs.status.style.background    = 'rgba(16,185,129,0.12)';
          refs.status.style.borderColor   = 'rgba(16,185,129,0.4)';
          refs.status.style.color         = 'var(--green)';
        } else if (isThisDay && nowMins < openMins) {
          const minsUntil = openMins - nowMins;
          const hu = Math.floor(minsUntil / 60);
          const mu = minsUntil % 60;
          if (text) text.textContent = `Abre en ${hu > 0 ? hu + 'h ' : ''}${mu}m`;
          if (dot)  { dot.style.background = '#f59e0b'; dot.style.boxShadow = '0 0 7px #f59e0b'; dot.style.animation = 'blink 1.5s infinite'; }
          refs.status.style.background  = 'rgba(245,158,11,0.1)';
          refs.status.style.borderColor = 'rgba(245,158,11,0.35)';
          refs.status.style.color       = '#f59e0b';
        } else {
          if (text) text.textContent = 'Cerrado hoy';
          if (dot)  { dot.style.background = '#ef4444'; dot.style.boxShadow = 'none'; dot.style.animation = 'none'; }
          refs.status.style.background  = 'rgba(239,68,68,0.09)';
          refs.status.style.borderColor = 'rgba(239,68,68,0.28)';
          refs.status.style.color       = '#f87171';
        }
      }

      // Progress bar (how far through today's open window)
      if (refs.progress) {
        let pct = 0;
        if (isThisDay && openMins > 0) {
          const totalWindow = closeMins - openMins;
          if (nowMins >= openMins && nowMins <= closeMins) {
            pct = Math.min(100, ((nowMins - openMins) / totalWindow) * 100);
          } else if (nowMins > closeMins) {
            pct = 100;
          }
        }
        refs.progress.style.width = pct.toFixed(1) + '%';
      }
    });

    // ── Sunday card: always show closed ─────────────
    const domingoCard   = document.querySelector('.hc-domingo');
    const domingoStatus = domingoCard && domingoCard.querySelector('.horario-status');
    if (domingoStatus) {
      const isSunday = now.dow === 0;
      if (isSunday) {
        domingoCard.classList.add('is-closed-now');
      }
    }

    // ── Global banner ──────────────────────────────
    if (bannerEl && bannerTextEl) {
      if (openSched) {
        const nowMins   = toMins(now.hour, now.minute);
        const closeMins = toMins(openSched.close[0], openSched.close[1]);
        const mLeft     = closeMins - nowMins;
        const hL = Math.floor(mLeft / 60), mL = mLeft % 60;
        const schName = {
          'lun-jue': 'Lunes–Jueves',
          'viernes': 'Viernes',
          'sabado':  'Sábado',
        }[openSched.id];

        bannerEl.className = 'horario-status-banner is-open';
        bannerTextEl.textContent = `✅ Abierto ahora — ${schName}`;
        if (bannerNextEl) {
          bannerNextEl.textContent = `Cierra en ${hL > 0 ? hL + 'h ' : ''}${mL}m`;
        }
      } else {
        const nextMsg = getNextOpening(now);
        bannerEl.className = 'horario-status-banner is-closed';
        bannerTextEl.textContent = '🔴 Cerrado en este momento';
        if (bannerNextEl) {
          bannerNextEl.textContent = nextMsg || '';
        }
      }
    }
  }

  // Run immediately then every second
  tick();
  setInterval(tick, 1000);

})();


/* ════════════════════════════════════════════════════
   FULL SITE 4K VISUAL UPGRADE — JavaScript
   Animated letters · Floating icons · Precio FX · Tilts
════════════════════════════════════════════════════ */

(function init4KUpgrade() {

  /* ── 1. FLOATING BACKGROUND TECH ICONS ─────────────
     Subtle icons drifting upward behind all content   */
  (function createFloatingIcons() {
    const wrap = document.createElement('div');
    wrap.id = 'floating-icons';
    document.body.appendChild(wrap);

    const icons = ['⚡','💻','🎮','📱','🔧','🖥️','🛠️','💾','🔋','📺','🕹️','🔌','⚙️','🖱️','💿'];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const el  = document.createElement('div');
      el.className = 'float-icon';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      const size  = Math.random() * 1.4 + 0.8;
      const left  = Math.random() * 100;
      const dur   = Math.random() * 22 + 18;
      const delay = Math.random() * 25;
      el.style.cssText = `
        left:${left}%;
        font-size:${size}rem;
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
      `;
      wrap.appendChild(el);
    }
  })();


  /* ── 2. SECTION TITLES — CSS-only fade-in (no split) ──
     splitLetters removido: rompía textos en móvil.
     La animación se hace 100% en CSS con .reveal        */


  /* ── 3. EMOJI AUTO-ANIMATE ON SCROLL ENTER ──────────
     Add bounce class to emojis when their section enters */
  const emojiObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const emojis = entry.target.querySelectorAll(
        '.horario-emoji, .service-emoji, .step-icon, .proximo-icon, .cta-icon, .success-icon'
      );
      emojis.forEach((em, i) => {
        setTimeout(() => {
          const classes = ['emoji-bounce','emoji-float','emoji-spin','emoji-pulse'];
          // assign based on position for variety
          const cls = classes[i % classes.length];
          if (!em.classList.contains('emoji-bounce') &&
              !em.classList.contains('emoji-float')  &&
              !em.classList.contains('emoji-spin')   &&
              !em.classList.contains('emoji-pulse')) {
            em.classList.add(cls);
          }
        }, i * 120);
      });
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section, .horario-section, .process-section, .cta-section').forEach(sec => {
    emojiObs.observe(sec);
  });


  /* ── 4. PRECIO SECTION — PARTICLE BURST + FLOATING COINS ─
     Triggers once when the price card enters the viewport   */
  const precioCard = document.querySelector('.precio-hero-card');

  function launchPrecioParticles() {
    if (!precioCard) return;
    const colors = ['#00d4ff','#a855f7','#10b981','#f59e0b','#ffffff'];
    const rect = precioCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = Math.random() * 6 + 3;
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const dist  = Math.random() * 180 + 80;
      p.style.cssText = `
        position:fixed;
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50%;
        left:${cx}px; top:${cy}px;
        pointer-events:none; z-index:99999;
        transform:translate(-50%,-50%);
        box-shadow:0 0 ${size*2}px ${color};
      `;
      document.body.appendChild(p);
      p.animate([
        { transform:'translate(-50%,-50%) scale(1)', opacity:1 },
        { transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity:0 }
      ], { duration: Math.random()*900+600, easing:'cubic-bezier(0,0.9,0.57,1)' })
      .onfinish = () => p.remove();
    }
  }

  // Floating coins inside price card
  function addPriceCoins() {
    if (!precioCard) return;
    const coinEmojis = ['💰','💵','✨','⭐','💎','🔥','⚡'];
    for (let i = 0; i < 8; i++) {
      const coin = document.createElement('div');
      coin.className = 'price-coin';
      coin.textContent = coinEmojis[Math.floor(Math.random() * coinEmojis.length)];
      const dur   = Math.random() * 4 + 4;
      const delay = Math.random() * 5;
      const left  = Math.random() * 80 + 10;
      coin.style.cssText = `
        left:${left}%;
        bottom:0;
        animation-duration:${dur}s;
        animation-delay:-${delay}s;
      `;
      precioCard.style.position = 'relative';
      precioCard.appendChild(coin);
    }
  }

  let precioBurst = false;
  const precioObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || precioBurst) return;
      precioBurst = true;
      addPriceCoins();
      setTimeout(launchPrecioParticles, 400);
      setTimeout(launchPrecioParticles, 1100);
    });
  }, { threshold: 0.5 });

  if (precioCard) precioObs.observe(precioCard);


  /* ── 5. HORARIO CARDS — 3D MOUSE TILT ──────────────── */
  document.querySelectorAll('.horario-card:not(.closed)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      const isFeatured = card.classList.contains('featured');
      const base = isFeatured ? 1.03 : 1;
      card.style.transform = `
        perspective(700px)
        rotateX(${-dy * 6}deg)
        rotateY(${dx * 6}deg)
        translateY(-10px)
        scale(${base})
      `;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
      // Move inner glow
      const emoji = card.querySelector('.hc-emoji-wrap');
      if (emoji) {
        emoji.style.transform = `translateX(${dx * 8}px) translateY(${dy * 8}px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      const isFeatured = card.classList.contains('featured');
      card.style.transform = isFeatured ? 'scale(1.03)' : '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease';
      const emoji = card.querySelector('.hc-emoji-wrap');
      if (emoji) emoji.style.transform = '';
    });
  });


  /* ── 6. STAT CARDS — SPARKLE ON HOVER ──────────────── */
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => spawnSparkles(card, 12));
  });

  function spawnSparkles(parent, count) {
    const rect   = parent.getBoundingClientRect();
    const colors = ['#00d4ff','#a855f7','#f59e0b','#10b981','#ffffff'];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const sz = Math.random() * 5 + 2;
      s.style.cssText = `
        position:fixed;
        width:${sz}px; height:${sz}px;
        background:${c}; border-radius:50%;
        left:${rect.left + Math.random() * rect.width}px;
        top:${rect.top  + Math.random() * rect.height}px;
        pointer-events:none; z-index:99999;
        box-shadow:0 0 ${sz*2}px ${c};
      `;
      document.body.appendChild(s);
      s.animate([
        { transform:'translate(0,0) scale(1)', opacity:1 },
        { transform:`translate(${(Math.random()-.5)*60}px, ${-Math.random()*60-20}px) scale(0)`, opacity:0 }
      ], { duration: Math.random()*500+400, easing:'ease-out' })
      .onfinish = () => s.remove();
    }
  }


  /* ── 7. REVIEW CARDS — SPARKLE ON HOVER ────────────── */
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('mouseenter', () => spawnSparkles(card, 8));
  });


  /* ── 8. PRECIO NUMBER — CLICK BURST ────────────────── */
  const precioNum = document.querySelector('.precio-num');
  if (precioNum) {
    precioNum.style.cursor = 'pointer';
    precioNum.addEventListener('click', () => {
      launchPrecioParticles();
      precioNum.animate([
        { transform:'scale(1)' },
        { transform:'scale(1.2)' },
        { transform:'scale(0.95)' },
        { transform:'scale(1.05)' },
        { transform:'scale(1)' }
      ], { duration:500, easing:'cubic-bezier(0.34,1.56,0.64,1)' });
    });
  }


  /* ── 9. MEGA CARDS — ENHANCED SHINE ────────────────── */
  document.querySelectorAll('.mega-card').forEach(card => {
    card.addEventListener('mouseenter', () => spawnSparkles(card, 6));
  });


  /* ── 10. SCROLL PROGRESS BAR — REMOVIDO ───────────────
     Quitado por petición: la barrita de arriba molestaba  */


  /* ── 11. SECTION HEADERS — GLOW AURA ON ENTER ──────── */
  const headerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const header = entry.target;
      header.style.transition = 'text-shadow 0.6s ease';
      const title = header.querySelector('.section-title');
      if (title) {
        title.style.filter = 'drop-shadow(0 0 30px rgba(0,212,255,0.4))';
        setTimeout(() => { title.style.filter = ''; }, 1200);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-header').forEach(h => headerObs.observe(h));


  /* ── 12. WORK CARDS — STAGGER ENTRANCE ─────────────── */
  document.querySelectorAll('.trabajo-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });


  /* ── 13. NAV LINKS — NEON RIPPLE ON HOVER ───────────── */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.textShadow = '0 0 12px rgba(0,212,255,0.6)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.textShadow = '';
    });
  });


  /* ── 14. HORARIO EMOJI — BURST ON CARD HOVER ────────── */
  document.querySelectorAll('.horario-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const emoji = this.querySelector('.horario-emoji');
      if (!emoji) return;
      emoji.animate([
        { transform:'scale(1) rotate(0deg)' },
        { transform:'scale(1.4) rotate(-10deg)' },
        { transform:'scale(1.2) rotate(8deg)' },
        { transform:'scale(1) rotate(0deg)' }
      ], { duration:500, easing:'cubic-bezier(0.34,1.56,0.64,1)' });
      spawnSparkles(this, 5);
    });
  });


  /* ── 15. CTA BUTTON — CONTINUOUS SHIMMER SWEEP ──────── */
  const ctaBtn = document.querySelector('.btn-cta');
  if (ctaBtn) {
    setInterval(() => {
      ctaBtn.animate([
        { boxShadow:'0 6px 30px rgba(37,211,102,0.5)' },
        { boxShadow:'0 6px 50px rgba(37,211,102,0.9), 0 0 80px rgba(37,211,102,0.3)' },
        { boxShadow:'0 6px 30px rgba(37,211,102,0.5)' }
      ], { duration:1500, easing:'ease-in-out' });
    }, 2500);
  }


  /* ── 16. PROXIMO ITEMS — STAGGER FLOAT ─────────────── */
  document.querySelectorAll('.proximo-item').forEach((item, i) => {
    item.style.animation = `fadeUp 0.6s ${i * 0.2}s ease both`;
    item.addEventListener('mouseenter', () => spawnSparkles(item, 6));
  });


  /* ── 17. FOOTER — LOGO SPIN ON CLICK ───────────────── */
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    footerLogo.addEventListener('click', () => {
      footerLogo.animate([
        { transform:'rotate(0deg) scale(1)' },
        { transform:'rotate(360deg) scale(1.2)' },
        { transform:'rotate(360deg) scale(1)' }
      ], { duration:700, easing:'cubic-bezier(0.34,1.56,0.64,1)' });
      spawnSparkles(footerLogo.parentElement, 10);
    });
  }

})(); // end init4KUpgrade


/* ════════════════════════════════════════════════════
   PERFORMANCE PATCH — 120fps Optimizations
   Runs AFTER all other scripts to override heavy defaults
════════════════════════════════════════════════════ */
(function perfPatch() {

  /* ── 1. REDUCE PARTICLE COUNT TO 30 (was 55) ─────── */
  const pBg = document.getElementById('particles-bg');
  if (pBg) {
    // Remove every other particle
    const all = Array.from(pBg.querySelectorAll('.particle'));
    all.forEach((p, i) => { if (i % 2 === 0 && i > 30) p.remove(); });
  }

  /* ── 2. REDUCE FLOATING ICONS TO 16 (was 28) ─────── */
  const fIcons = document.getElementById('floating-icons');
  if (fIcons) {
    const all = Array.from(fIcons.querySelectorAll('.float-icon'));
    all.forEach((el, i) => { if (i > 14) el.remove(); });
  }

  /* ── 3. PAUSE ANIMATIONS WHEN TAB IS HIDDEN ─────────
     Saves GPU entirely when user switches tabs          */
  document.addEventListener('visibilitychange', () => {
    const paused = document.hidden ? 'paused' : 'running';
    document.querySelectorAll(
      '.particle, .float-icon, .hero-logo-ring, .hc-emoji-ring, .icon-ring'
    ).forEach(el => {
      el.style.animationPlayState = paused;
    });
  });

  /* ── 4. PAUSE RING ANIMATIONS WHEN OFF-SCREEN ────────
     IntersectionObserver stops GPU work outside viewport */
  const ringPauseObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const rings = entry.target.querySelectorAll(
        '.hero-logo-ring, .hc-emoji-ring, .icon-ring, .live-pulse-ring'
      );
      const state = entry.isIntersecting ? 'running' : 'paused';
      rings.forEach(r => { r.style.animationPlayState = state; });
    });
  }, { rootMargin: '100px' });

  document.querySelectorAll('.hero, .horario-section, .servicios').forEach(sec => {
    ringPauseObs.observe(sec);
  });

  /* ── 5. DEFER COIN ANIMATIONS (only if card visible) ─ */
  const coins = document.querySelectorAll('.price-coin');
  coins.forEach(c => { c.style.animationPlayState = 'paused'; });

  const coinObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const state = entry.isIntersecting ? 'running' : 'paused';
      entry.target.querySelectorAll('.price-coin').forEach(c => {
        c.style.animationPlayState = state;
      });
    });
  }, { threshold: 0.2 });

  const precioCard = document.querySelector('.precio-hero-card');
  if (precioCard) coinObs.observe(precioCard);

  /* ── 6. THROTTLE SCROLL EVENTS ──────────────────────
     Batch scroll handlers with rAF to prevent 60+ calls/sec */
  let scrollTicking = false;
  const origHandlers = [];

  // The active-nav scroll listener already uses passive — just wrap in rAF
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => { scrollTicking = false; });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ── 7. LAZY-INIT SPARKLES (only on pointer devices) ─ */
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) {
    // On touch screens remove sparkle listeners to save CPU
    // (they don't get hover anyway)
    document.querySelectorAll('.stat-card, .review-card, .mega-card').forEach(el => {
      const clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
    });
  }

  /* ── 8. USE CSS CONTAIN ON PARTICLE CONTAINER ─────── */
  if (pBg) {
    pBg.style.contain = 'strict';
    pBg.style.willChange = 'auto';
  }

  /* ── 9. REDUCE HORARIO GRID LINES ON LOW-END DEVICES ─ */
  const fps = (() => {
    // Quick device tier check via memory API (Chromium only)
    const mem = navigator.deviceMemory;
    return mem && mem <= 2 ? 'low' : 'high';
  })();

  if (fps === 'low') {
    const gridLines = document.querySelector('.horario-grid-lines');
    if (gridLines) gridLines.style.display = 'none';

    const bgAura = document.querySelector('.horario-bg-aura');
    if (bgAura) bgAura.style.display = 'none';

    // Reduce particles further
    if (pBg) {
      const ps = Array.from(pBg.querySelectorAll('.particle'));
      ps.forEach((p, i) => { if (i > 15) p.remove(); });
    }
    if (fIcons) fIcons.style.display = 'none';
  }

  /* ── 10. FONT-DISPLAY SWAP FALLBACK ─────────────────
     If fonts haven't loaded, body already shows system font
     so page is usable immediately — no FOIT              */
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });

})();
