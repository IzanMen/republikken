type AnalyticsConfig = {
  provider: 'umami';
  websiteId: string;
  scriptUrl: string;
};
type AnalyticsWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, string | number>) => void };
};
const aw = window as AnalyticsWindow;
const config: AnalyticsConfig = JSON.parse(
  document.getElementById('analytics-config')?.textContent || '{}',
);
let consent = '';
let analyticsLoaded = false;
try {
  consent = localStorage.getItem('republikken-consent-v1') || '';
} catch {
  /* Storage is optional. */
}
const hasAnalytics =
  config.provider === 'umami' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    config.websiteId,
  ) &&
  /^https:\/\//.test(config.scriptUrl);
function loadAnalytics() {
  if (consent !== 'granted' || !hasAnalytics || analyticsLoaded) return;
  analyticsLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = config.scriptUrl;
  script.dataset.websiteId = config.websiteId;
  script.dataset.domains = location.hostname;
  script.dataset.excludeSearch = 'true';
  script.dataset.excludeHash = 'true';
  document.head.appendChild(script);
}
function track(name: string, props: Record<string, string | number> = {}) {
  if (consent !== 'granted' || !hasAnalytics) return;
  aw.umami?.track(name, props);
}
function loadMaps() {
  if (consent !== 'granted') return;
  document.querySelectorAll<HTMLElement>('[data-map-embed]').forEach((container) => {
    if (container.querySelector('iframe') || !container.dataset.mapSrc) return;
    const iframe = document.createElement('iframe');
    iframe.title = container.dataset.mapTitle || 'Mapa de ubicación';
    iframe.src = container.dataset.mapSrc;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    container.replaceChildren(iframe);
  });
}
loadAnalytics();
loadMaps();
const banner = document.getElementById('cookie-banner');
if (banner && !consent) banner.hidden = false;
document.querySelectorAll<HTMLElement>('[data-cookie-settings]').forEach((button) =>
  button.addEventListener('click', () => {
    if (!banner) return;
    banner.hidden = false;
    const status = banner.querySelector<HTMLElement>('.cookie-status');
    if (status) {
      status.hidden = false;
      status.textContent = hasAnalytics
        ? 'Puedes cambiar tu elección para la medición con Umami y los mapas de Google.'
        : 'Umami quedará activo al incorporar su identificador. La elección también controla los mapas de Google.';
    }
    banner.querySelector<HTMLButtonElement>('button')?.focus();
  }),
);
document.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((button) =>
  button.addEventListener('click', () => {
    const externalContentLoaded =
      analyticsLoaded || !!document.querySelector('[data-map-embed] iframe');
    consent = button.dataset.consent || 'denied';
    try {
      localStorage.setItem('republikken-consent-v1', consent);
    } catch {
      /* Continue without persistent storage. */
    }
    if (banner) banner.hidden = true;
    if (consent === 'denied' && externalContentLoaded) {
      location.reload();
    } else {
      loadAnalytics();
      loadMaps();
    }
  }),
);
document.addEventListener('click', (event) => {
  const target = (event.target as Element).closest<HTMLElement>('[data-track]');
  if (target) track(target.dataset.track!, { space: target.dataset.space || 'general' });
});

// Branded cross-page transition with a normal navigation fallback.
document.addEventListener('click', (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;

  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;

  const destination = new URL(link.href, location.href);
  const sameDocumentHash =
    destination.pathname === location.pathname &&
    destination.search === location.search &&
    destination.hash;
  if (destination.origin !== location.origin || sameDocumentHash) return;

  event.preventDefault();
  if (document.body.classList.contains('page-leaving')) return;
  document.body.classList.add('page-leaving');
  document.body.setAttribute('aria-busy', 'true');
  try {
    sessionStorage.setItem('republikken-page-transition', 'enter');
  } catch {
    /* Continue with the navigation. */
  }
  // Let the curtain fully settle before replacing the document.
  setTimeout(() => location.assign(destination.href), 500);
});

// Browsers can restore the outgoing DOM from their back-forward cache.
addEventListener('pageshow', (event) => {
  if (
    !(event as PageTransitionEvent).persisted &&
    !document.body.classList.contains('page-leaving')
  )
    return;
  document.body.classList.remove('page-leaving');
  document.body.removeAttribute('aria-busy');
  document.documentElement.classList.remove('page-entering');
  try {
    sessionStorage.removeItem('republikken-page-transition');
  } catch {
    /* The restored page is already usable without storage. */
  }
});
const priceSection = document.querySelector('[data-track-prices]');
if (priceSection && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track('view_prices');
        observer.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  observer.observe(priceSection);
}
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const menu = document.getElementById('mobile-menu');
function closeMenu() {
  if (menu) menu.hidden = true;
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
}
menuButton?.addEventListener('click', () => {
  if (!menu) return;
  const open = menu.hidden;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) {
    closeMenu();
    menuButton?.focus();
  }
});
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
matchMedia('(min-width: 851px)').addEventListener('change', (e) => {
  if (e.matches) closeMenu();
});

// Motion system: progressive, lightweight and fully disabled for reduced-motion users.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector<HTMLElement>('.site-header');
const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 24);
updateHeader();
addEventListener('scroll', updateHeader, { passive: true });

if (!reduceMotion) {
  const revealGroups = [
    '.section-heading > *',
    '.intent-links > *',
    '.space-cards > *',
    '.steps > *',
    '.community > *',
    '.values > *',
    '.host-section > *',
    '.social-proof figure',
    '.location-section > *',
    '.faq-section > *',
    '.closing-inner > *',
    '.footer-top > *',
    '.landing-hero > *',
    '.equipment-list > *',
    '.use-grid > *',
    '.pricing-grid > *',
    '.process-row',
    '.space-detail',
    '.guide-grid > *',
    '.contact-grid > *',
    '.booking-layout > *',
    '.form-layout > *',
    '.page-intro > *',
  ];
  const revealItems = [...document.querySelectorAll<HTMLElement>(revealGroups.join(','))];
  revealItems.forEach((item) => {
    const siblings = item.parentElement
      ? [...item.parentElement.children].filter((child) =>
          revealItems.includes(child as HTMLElement),
        )
      : [];
    const index = Math.max(0, siblings.indexOf(item));
    item.classList.add('motion-reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 70}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
    document.documentElement.classList.add('motion-observing');
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const heroImage = document.querySelector<HTMLElement>('.hero-photo > img');
  if (heroImage) {
    let frame = 0;
    const updateHeroDepth = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = heroImage.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, rect.top / innerHeight));
        heroImage.style.setProperty('--hero-shift', `${progress * -12}px`);
      });
    };
    updateHeroDepth();
    addEventListener('scroll', updateHeroDepth, { passive: true });
  }

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('.space-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
      });
    });
  }
}
const calculator = document.querySelector<HTMLElement>('[data-calculator]');
if (calculator) {
  const hours = calculator.querySelector<HTMLInputElement>('[name="hours"]')!;
  const alternative = calculator.querySelector<HTMLInputElement>('[name="alternative"]')!;
  const total = calculator.querySelector<HTMLOutputElement>('[data-calc-total]')!;
  const comparison = calculator.querySelector<HTMLElement>('[data-calc-comparison]')!;
  const euro = (value: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(value);
  const calculate = () => {
    if (!hours.validity.valid || !hours.value) {
      total.textContent = '—';
      comparison.textContent = 'Introduce entre 1 y 500 horas completas.';
      return;
    }
    const cost = Number(hours.value) * Number(calculator.dataset.rate);
    total.textContent = euro(cost);
    if (alternative.value === '' || !alternative.validity.valid) {
      comparison.textContent = 'Coste base en Republikken, sin IVA.';
      return;
    }
    const difference = Number(alternative.value) - cost;
    comparison.textContent =
      difference > 0
        ? `${euro(difference)} menos que tu estimación alternativa.`
        : difference < 0
          ? `${euro(-difference)} más que tu estimación alternativa.`
          : 'El mismo coste que tu estimación alternativa.';
  };
  [hours, alternative].forEach((input) => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', () =>
      track('calculator_use', {
        space: calculator.dataset.space || 'despacho',
      }),
    );
  });
  calculate();
}
const booking = document.querySelector('[data-booking]');
if (booking) {
  const radios = [...booking.querySelectorAll<HTMLInputElement>('input[name="space"]')];
  const marketing = booking.querySelector<HTMLInputElement>('#booking-marketing');
  const selected = new URLSearchParams(location.search).get('espacio');
  const initial = radios.find((r) => r.value === selected);
  if (initial) initial.checked = true;
  const update = () => {
    const input = radios.find((r) => r.checked)!;
    booking.querySelector('[data-booking-name]')!.textContent = input.dataset.name!;
    booking.querySelector('[data-booking-price]')!.textContent = input.dataset.price!;
    const link = booking.querySelector<HTMLAnchorElement>('[data-booking-link]')!;
    link.href = input.dataset.cobot!;
    link.dataset.space = input.value;
    const wa = booking.querySelector<HTMLAnchorElement>('[data-booking-whatsapp]')!;
    const marketingMessage = marketing?.checked
      ? '\n\nQuiero recibir novedades y promociones de Republikken Maó por correo o WhatsApp. Puedo darme de baja cuando quiera.'
      : '';
    wa.href = `https://wa.me/34652505948?text=${encodeURIComponent(`Hola, Fran. Quería consultar disponibilidad de ${input.dataset.name!.toLowerCase()}.${marketingMessage}`)}`;
    wa.dataset.space = input.value;
    booking.querySelector('[data-booking-hint]')!.textContent =
      input.dataset.direct === 'true'
        ? 'Se abre la disponibilidad de este espacio en otra pestaña. Revisa el precio total y las condiciones antes de pagar.'
        : 'Se abre el calendario general de salas en otra pestaña. Selecciona allí el recurso; si no aparece, consulta con Fran.';
  };
  radios.forEach((r) => r.addEventListener('change', update));
  marketing?.addEventListener('change', update);
  update();
}
const form = document.querySelector<HTMLFormElement>('#quote-form');
if (form) {
  const status = document.getElementById('form-status')!;
  const date = form.querySelector<HTMLInputElement>('[name="fecha"]')!;
  // ISO date in the business timezone, independent of the visitor's timezone.
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  date.min = today;
  const attendees = form.querySelector<HTMLInputElement>('[name="asistentes"]')!;
  const format = form.querySelector<HTMLSelectElement>('[name="formato"]')!;
  const privacy = form.querySelector<HTMLInputElement>('[name="privacidad"]')!;
  const controls = [
    ...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      'input:not([type=checkbox]):not([name=_gotcha]),select',
    ),
  ];
  function validate(control: HTMLInputElement | HTMLSelectElement) {
    control.setCustomValidity('');
    if (control === attendees) {
      const max = format.value === 'Taller con mesas' ? 24 : 70;
      attendees.max = String(max);
      if (Number(attendees.value) > max)
        attendees.setCustomValidity(
          `Para este formato, el máximo es de ${max} personas. Elige otro formato o consulta con Fran.`,
        );
    }
    if (control === date && date.value) {
      const weekday = new Date(`${date.value}T12:00:00`).getDay();
      if (weekday === 0)
        date.setCustomValidity(
          'El horario habitual es de lunes a sábado. Elige otra fecha o consulta con Fran.',
        );
    }
    const valid = control.validity.valid;
    control.setAttribute('aria-invalid', String(!valid));
    const error = control.parentElement?.querySelector<HTMLElement>('.error-text');
    if (error) {
      const id = `${control.id}-error`;
      error.id = id;
      control.setAttribute('aria-describedby', id);
      error.textContent = valid
        ? ''
        : control.validity.valueMissing
          ? 'Completa este campo para poder preparar tu solicitud.'
          : control.validity.typeMismatch
            ? 'Revisa el correo: necesitamos una dirección válida.'
            : control.validity.rangeUnderflow
              ? 'Revisa el valor: no puede ser anterior o inferior al mínimo.'
              : control.validationMessage;
    }
    return valid;
  }
  controls.forEach((control) => {
    control.addEventListener('blur', () => validate(control));
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') validate(control);
    });
  });
  format.addEventListener('change', () => {
    if (attendees.value) validate(attendees);
  });
  privacy.addEventListener('change', () => {
    document.getElementById('privacy-error')!.textContent = '';
    privacy.removeAttribute('aria-invalid');
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.hidden = true;
    if ((form.querySelector('[name="_gotcha"]') as HTMLInputElement).value) return;
    const validity = controls.map(validate);
    if (!privacy.checked) {
      privacy.setAttribute('aria-invalid', 'true');
      privacy.setAttribute('aria-describedby', 'privacy-error');
      document.getElementById('privacy-error')!.textContent =
        'Acepta la información de privacidad para atender tu solicitud.';
    }
    if (validity.some((v) => !v) || !privacy.checked) {
      (controls.find((c) => !c.validity.valid) || privacy).focus();
      return;
    }
    const data = new FormData(form);
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      const fields = [
        ['Evento', 'tipo'],
        ['Fecha', 'fecha'],
        ['Asistentes', 'asistentes'],
        ['Formato', 'formato'],
        ['Horario', 'horario'],
        ['Nombre', 'nombre'],
        ['Empresa', 'empresa'],
        ['Correo', 'email'],
        ['Teléfono', 'telefono'],
        ['Detalles', 'detalles'],
      ];
      const lines = fields
        .map(([label, key]) => (data.get(key) ? `${label}: ${data.get(key)}` : ''))
        .filter(Boolean);
      if (data.getAll('servicios').length)
        lines.push(`Servicios: ${data.getAll('servicios').join(', ')}`);
      if (data.get('marketing')) lines.push('Novedades y promociones: Sí, doy mi consentimiento.');
      const message = `Hola, Fran. Me gustaría pedir presupuesto para un evento en Republikken.\n\n${lines.join('\n')}\n\nHe leído la política de privacidad y acepto que Republikken C.B. use mis datos para responder a mi solicitud.`;
      const intro = document.createElement('p');
      intro.textContent =
        'Tu solicitud está preparada. Todavía no se ha enviado. Abre WhatsApp, revisa el mensaje y pulsa Enviar para que Fran lo reciba.';
      const a = document.createElement('a');
      a.className = 'button';
      a.href = `https://wa.me/34652505948?text=${encodeURIComponent(message)}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Revisar y enviar en WhatsApp';
      a.dataset.track = 'whatsapp_click';
      a.dataset.space = 'presupuesto';
      status.replaceChildren(intro, a);
      status.hidden = false;
      status.focus();
      track('quote_prepared', { channel: 'whatsapp' });
      return;
    }
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission failed');
      status.textContent =
        'Solicitud enviada. Fran revisará los detalles y se pondrá en contacto contigo en el correo o teléfono indicado. La fecha quedará confirmada cuando acordéis la reserva.';
      track('quote_submit', { channel: 'form' });
      form.reset();
    } catch {
      const p = document.createElement('p');
      p.textContent =
        'No hemos podido confirmar el envío. Conservamos tus datos en el formulario para que lo intentes de nuevo. También puedes contactar con Fran por WhatsApp o en el 652 505 948.';
      const link = document.createElement('a');
      link.href =
        'https://wa.me/34652505948?text=Hola%2C%20Fran.%20Necesito%20ayuda%20para%20pedir%20presupuesto.';
      link.textContent = 'Hablar con Fran';
      link.className = 'text-link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      status.replaceChildren(p, link);
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.removeAttribute('aria-busy');
      status.hidden = false;
      status.focus();
    }
  });
}
