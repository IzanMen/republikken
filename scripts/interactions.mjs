import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { JSDOM, VirtualConsole } from 'jsdom';
import ts from 'typescript';
const source = await readFile('src/scripts/site.ts', 'utf8');
const script = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const results = [];
async function create(route = '/', search = '', configure = () => {}) {
  const file = route === '/' ? 'dist/index.html' : `dist${route}/index.html`;
  const dom = new JSDOM(await readFile(file, 'utf8'), {
    url: `https://www.republikkenmao.com${route}${search}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  const { window: w } = dom;
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  const calls = [];
  w.fetch = async (...args) => {
    calls.push(args);
    return { ok: true };
  };
  configure(w);
  w.eval(script);
  const doc = w.document;
  const fill = (selector, value) => {
    const el = doc.querySelector(selector);
    assert(el, selector);
    el.value = String(value);
    el.dispatchEvent(new w.Event('input', { bubbles: true }));
    el.dispatchEvent(new w.Event('change', { bubbles: true }));
    return el;
  };
  const click = (selector) => {
    const el = doc.querySelector(selector);
    assert(el, selector);
    el.click();
    return el;
  };
  const submit = async () => {
    doc
      .querySelector('form')
      .dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 5));
  };
  return { dom, w, doc, calls, fill, click, submit };
}
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, pass: true });
    console.log(`PASS ${name}`);
  } catch (e) {
    results.push({ name, pass: false, error: e.message });
    console.error(`FAIL ${name}: ${e.message}`);
  }
}
await test('Mobile menu opens, Escape closes it and returns focus', async () => {
  const t = await create();
  const b = t.click('.menu-toggle');
  assert.equal(b.getAttribute('aria-expanded'), 'true');
  assert.equal(t.doc.querySelector('#mobile-menu').hidden, false);
  t.doc.dispatchEvent(new t.w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(t.doc.querySelector('#mobile-menu').hidden, true);
  assert.equal(t.doc.activeElement, b);
  t.dom.window.close();
});
await test('Calculator updates cost, saving and rejects invalid hours', async () => {
  const t = await create('/profesionales');
  t.fill('#calc-hours', 20);
  t.fill('#calc-alternative', 500);
  assert.match(t.doc.querySelector('[data-calc-total]').textContent, /240/);
  assert.match(t.doc.querySelector('[data-calc-comparison]').textContent, /260.*menos/);
  t.fill('#calc-alternative', 100);
  assert.match(t.doc.querySelector('[data-calc-comparison]').textContent, /140.*más/);
  t.fill('#calc-hours', -1);
  assert.equal(t.doc.querySelector('[data-calc-total]').textContent, '—');
  t.fill('#calc-hours', 1.5);
  assert.equal(t.doc.querySelector('[data-calc-total]').textContent, '—');
  t.dom.window.close();
});
await test('Booking respects deep link and updates outgoing resource and WhatsApp', async () => {
  const t = await create('/reservar', '?espacio=fitness');
  assert.match(t.doc.querySelector('[data-booking-name]').textContent, /fitness/);
  assert.match(t.doc.querySelector('[data-booking-price]').textContent, /15/);
  assert.match(
    decodeURIComponent(t.doc.querySelector('[data-booking-whatsapp]').href),
    /yoga y fitness/,
  );
  assert.equal(t.doc.querySelector('[data-booking-link]').dataset.space, 'fitness');
  t.click('input[value=eventos]');
  assert.equal(t.doc.querySelector('[data-booking-name]').textContent, 'Sala de eventos');
  assert.match(t.doc.querySelector('[data-booking-hint]').textContent, /calendario general/);
  assert.equal(t.doc.querySelectorAll('input[value=miranda]').length, 0);
  t.dom.window.close();
});
await test('Unknown booking space safely falls back to the private office', async () => {
  const t = await create('/reservar', '?espacio=miranda');
  assert.equal(t.doc.querySelector('[data-booking-name]').textContent, 'Despacho privado');
  t.dom.window.close();
});
await test('Quote requires core fields and privacy without making a request', async () => {
  const t = await create('/presupuesto');
  await t.submit();
  assert(t.doc.querySelectorAll('[aria-invalid=true]').length >= 5);
  assert.equal(t.calls.length, 0);
  assert.equal(t.doc.querySelector('#form-status').hidden, true);
  assert.equal(t.doc.activeElement.id, 'event-type');
  t.dom.window.close();
});
function validForm(t) {
  t.fill('#event-type', 'Formación o taller');
  t.fill('#attendees', 20);
  t.fill('#format', 'Taller con mesas');
  t.fill('#name', 'Prueba local');
  t.fill('#email', 'prueba@example.com');
  t.click('#privacy');
}
await test('Quote checks workshop capacity and audience maximum', async () => {
  const t = await create('/presupuesto');
  validForm(t);
  t.fill('#attendees', 25);
  await t.submit();
  assert.match(t.doc.querySelector('#attendees-error').textContent, /24/);
  t.fill('#format', 'Auditorio');
  t.fill('#attendees', 71);
  await t.submit();
  assert.match(t.doc.querySelector('#attendees-error').textContent, /70/);
  t.dom.window.close();
});
await test('Quote rejects invalid email, past dates and Sunday', async () => {
  const t = await create('/presupuesto');
  validForm(t);
  t.fill('#email', 'invalid');
  t.fill('#event-date', '2027-01-03');
  await t.submit();
  assert.equal(t.doc.querySelector('#email').getAttribute('aria-invalid'), 'true');
  assert.match(t.doc.querySelector('#event-date-error').textContent, /lunes a sábado/);
  t.fill('#event-date', '2020-01-01');
  await t.submit();
  assert.equal(t.doc.querySelector('#event-date').getAttribute('aria-invalid'), 'true');
  t.dom.window.close();
});
await test('WhatsApp fallback prepares an encoded message, never pretends to send', async () => {
  const t = await create('/presupuesto');
  validForm(t);
  t.fill('#details', 'Prueba local <script>alert(1)</script>');
  await t.submit();
  const status = t.doc.querySelector('#form-status');
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /Todavía no se ha enviado/);
  const a = status.querySelector('a');
  assert.match(a.href, /^https:\/\/wa.me\/34652505948\?text=/);
  assert.match(decodeURIComponent(a.href), /prueba@example.com/);
  assert.equal(status.querySelector('script'), null);
  assert.equal(t.calls.length, 0);
  t.dom.window.close();
});
await test('Honeypot blocks the outgoing request', async () => {
  const t = await create(
    '/presupuesto',
    '',
    (w) => (w.document.querySelector('form').dataset.endpoint = 'https://forms.example.test/quote'),
  );
  validForm(t);
  t.fill('#website', 'spam');
  await t.submit();
  assert.equal(t.calls.length, 0);
  t.dom.window.close();
});
await test('Configured form shows success only after HTTP confirmation', async () => {
  const t = await create(
    '/presupuesto',
    '',
    (w) => (w.document.querySelector('form').dataset.endpoint = 'https://forms.example.test/quote'),
  );
  validForm(t);
  await t.submit();
  assert.equal(t.calls.length, 1);
  assert.match(t.doc.querySelector('#form-status').textContent, /Solicitud enviada/);
  assert.equal(t.doc.querySelector('#name').value, '');
  t.dom.window.close();
});
await test('Form HTTP failure preserves entered data and shows recovery', async () => {
  const t = await create('/presupuesto', '', (w) => {
    w.document.querySelector('form').dataset.endpoint = 'https://forms.example.test/quote';
    w.fetch = async () => ({ ok: false });
  });
  validForm(t);
  await t.submit();
  assert.match(t.doc.querySelector('#form-status').textContent, /No hemos podido confirmar/);
  assert.equal(t.doc.querySelector('#name').value, 'Prueba local');
  assert.equal(t.doc.querySelector('button[type=submit]').disabled, false);
  t.dom.window.close();
});
await test('Home and contact include Google Maps without interaction', async () => {
  for (const route of ['/', '/contacto']) {
    const t = await create(route);
    assert.equal(t.doc.querySelectorAll('iframe').length, 1);
    assert.match(t.doc.querySelector('iframe').title, /Republikken/);
    assert.match(t.doc.querySelector('iframe').src, /^https:\/\/maps\.google\.com\/maps\?/);
    t.dom.window.close();
  }
});
await test('No analytics configuration means no tracker or unsolicited banner', async () => {
  const t = await create();
  assert.equal(t.doc.querySelector('#cookie-banner').hidden, true);
  assert.equal(t.doc.querySelectorAll('script[src^="https://"]').length, 0);
  t.click('[data-cookie-settings]');
  assert.match(t.doc.querySelector('.cookie-status').textContent, /no hay analítica activa/);
  t.dom.window.close();
});
await test('Configured analytics waits for consent; reject loads nothing', async () => {
  const t = await create(
    '/',
    '',
    (w) =>
      (w.document.querySelector('#analytics-config').textContent = JSON.stringify({
        provider: 'ga4',
        id: 'G-TEST123',
        domain: '',
      })),
  );
  assert.equal(t.doc.querySelector('#cookie-banner').hidden, false);
  assert.equal(t.doc.querySelectorAll('script[src^="https://"]').length, 0);
  t.click('[data-consent=denied]');
  assert.equal(t.doc.querySelectorAll('script[src^="https://"]').length, 0);
  t.click('[data-cookie-settings]');
  t.click('[data-consent=granted]');
  assert.equal(t.doc.querySelectorAll('script[src^="https://www.googletagmanager.com"]').length, 1);
  assert.equal(t.w.localStorage.getItem('republikken-consent-v1'), 'granted');
  t.click('[data-cookie-settings]');
  t.click('[data-consent=granted]');
  assert.equal(t.doc.querySelectorAll('script[src^="https://www.googletagmanager.com"]').length, 1);
  t.dom.window.close();
});
await writeFile(
  'reports/interactions.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      scope:
        'Isolated JSDOM integration checks with mocked network; no real message, booking, payment or external form submission.',
      results,
    },
    null,
    2,
  ),
);
console.log(`${results.filter((r) => r.pass).length}/${results.length} passed`);
if (results.some((r) => !r.pass)) process.exitCode = 1;
