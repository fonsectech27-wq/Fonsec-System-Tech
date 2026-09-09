/* ====================================================
   FONSEC SYSTEM TECH — NOTIFICACIONES DE VISITA
   Cuando alguien entra a tu página, te llega un
   mensaje a Telegram con la info del visitante.
   ====================================================

   CONFIGURACIÓN (solo tienes que cambiar 2 cosas):
   1. BOT_TOKEN  → el token que te da @BotFather
   2. CHAT_ID    → tu ID personal de Telegram

   CÓMO OBTENER EL BOT TOKEN:
   1. Abre Telegram y busca @BotFather
   2. Escribe /newbot y sigue las instrucciones
   3. Te dará un token así: 7123456789:AAHx...
   4. Pégalo abajo en BOT_TOKEN

   CÓMO OBTENER TU CHAT ID:
   1. Busca @userinfobot en Telegram
   2. Escríbele cualquier mensaje
   3. Te responde con tu ID numérico (ej: 987654321)
   4. Pégalo abajo en CHAT_ID
   ==================================================== */

const BOT_TOKEN = '8747454717:AAEDSlAt6NzYNsB28nXbR3WVeComtsYQPaU';
const CHAT_ID   = '8212900917';

// ── No toques nada de aquí para abajo ────────────────

(function initVisitorTracker() {

  // Evitar spam: solo notificar 1 vez por sesión de navegación
  if (sessionStorage.getItem('fonsec_notified')) return;
  sessionStorage.setItem('fonsec_notified', '1');

  // Validar que el token fue configurado
  if (BOT_TOKEN === 'PEGA_AQUI_TU_TOKEN' || CHAT_ID === 'PEGA_AQUI_TU_CHAT_ID') {
    console.warn('⚠️ Fonsec Tracker: configura BOT_TOKEN y CHAT_ID en visitor-tracker.js');
    return;
  }

  // ── Detectar info del dispositivo ──────────────────
  function getDeviceInfo() {
    const ua  = navigator.userAgent;
    const w   = window.innerWidth;

    // Tipo de dispositivo
    let device = '🖥️ PC / Escritorio';
    if (/Mobi|Android|iPhone|iPod/i.test(ua))  device = '📱 Celular';
    else if (/iPad|Tablet/i.test(ua))           device = '📲 Tablet';

    // Navegador
    let browser = 'Otro';
    if      (/Chrome/i.test(ua) && !/Edg/i.test(ua))  browser = 'Chrome';
    else if (/Firefox/i.test(ua))                       browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua))browser = 'Safari';
    else if (/Edg/i.test(ua))                           browser = 'Edge';
    else if (/OPR|Opera/i.test(ua))                     browser = 'Opera';

    // Sistema operativo
    let os = 'Desconocido';
    if      (/Windows/i.test(ua))  os = 'Windows';
    else if (/Android/i.test(ua))  os = 'Android';
    else if (/iPhone|iPad/i.test(ua)) os = 'iOS';
    else if (/Mac/i.test(ua))      os = 'macOS';
    else if (/Linux/i.test(ua))    os = 'Linux';

    // Página de referencia (de dónde vino)
    const ref = document.referrer
      ? decodeURIComponent(document.referrer).substring(0, 60)
      : 'Directo / Link directo';

    return { device, browser, os, ref, width: w };
  }

  // ── Hora Colombia (UTC-5) ───────────────────────────
  function getColombiaTime() {
    const opts = {
      timeZone: 'America/Bogota',
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    return new Intl.DateTimeFormat('es-CO', opts).format(new Date());
  }

  // ── Obtener país via IP (servicio público gratuito) ─
  function getLocationAndNotify(info) {
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      .then(r => r.json())
      .then(loc => {
        const country = loc.country_name || 'Desconocido';
        const city    = loc.city         || '—';
        const region  = loc.region       || '—';
        const ip      = loc.ip           || '—';
        sendNotification(info, { country, city, region, ip });
      })
      .catch(() => {
        // Si falla la geolocalización, notificar igual sin ubicación
        sendNotification(info, { country: 'No disponible', city: '—', region: '—', ip: '—' });
      });
  }

  // ── Armar y enviar el mensaje a Telegram ───────────
  function sendNotification(info, loc) {
    const time = getColombiaTime();

    const msg = [
      '🔔 *NUEVA VISITA — Fonsec System Tech*',
      '',
      `🕐 *Hora:* ${time}`,
      '',
      '📍 *Ubicación:*',
      `   🌍 País: ${loc.country}`,
      `   🏙️ Ciudad: ${loc.city}, ${loc.region}`,
      `   🌐 IP: ${loc.ip}`,
      '',
      '💻 *Dispositivo:*',
      `   ${info.device}`,
      `   🌐 Navegador: ${info.browser}`,
      `   💿 Sistema: ${info.os}`,
      `   📐 Pantalla: ${info.width}px`,
      '',
      '🔗 *Vino desde:*',
      `   ${info.ref}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━',
      '🏢 _Fonsec System Tech · Soledad 2000_',
    ].join('\n');

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    CHAT_ID,
        text:       msg,
        parse_mode: 'Markdown',
      }),
    })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        console.log('✅ Fonsec Tracker: notificación enviada a Telegram');
      } else {
        console.warn('⚠️ Fonsec Tracker error:', data.description);
      }
    })
    .catch(err => {
      console.warn('⚠️ Fonsec Tracker: no se pudo conectar con Telegram', err);
    });
  }

  // ── Arrancar después de que cargue la página ───────
  if (document.readyState === 'complete') {
    getLocationAndNotify(getDeviceInfo());
  } else {
    window.addEventListener('load', () => {
      getLocationAndNotify(getDeviceInfo());
    });
  }

})();
