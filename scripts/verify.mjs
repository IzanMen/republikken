import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name))),
    )
  ).flat();
}
const files = await walk(root);
const pages = files.filter((p) => p.endsWith('.html'));
const errors = [];
const results = [];
const titles = new Set(),
  descriptions = new Set();
const sourceFiles = (await walk(path.resolve('src'))).filter((file) =>
  /\.(?:astro|css)$/.test(file),
);
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)) {
    if (Number(match[1]) < 14)
      errors.push(`${path.relative(path.resolve(), file)}: font size below 14px (${match[1]}px)`);
  }
}
for (const file of pages) {
  const html = await readFile(file, 'utf8'),
    doc = new JSDOM(html).window.document;
  const route =
    '/' +
    path
      .relative(root, file)
      .replace(/index\.html$/, '')
      .replace(/\/$/, '');
  const fail = (m) => errors.push(`${route || '/'}: ${m}`);
  const title = doc.title;
  const description = doc.querySelector('meta[name=description]')?.content;
  if (!title || title.length > 60) fail(`title missing/long (${title.length})`);
  if (titles.has(title)) fail('duplicate title');
  titles.add(title);
  if (!description || description.length > 155)
    fail(`description missing/long (${description?.length})`);
  if (descriptions.has(description)) fail('duplicate description');
  descriptions.add(description);
  if (doc.querySelectorAll('h1').length !== 1) fail('must have exactly one H1');
  if (doc.documentElement.lang !== 'es') fail('wrong language');
  if (!doc.querySelector('main#contenido')) fail('main landmark/skip target missing');
  if (/plaza.miranda/i.test(html)) fail('hidden location leaked');
  if (/\{\{precio_/.test(html)) fail('unresolved price token');
  if (!doc.querySelector('link[rel=canonical]')?.href.startsWith('https://www.republikkenmao.com/'))
    fail('invalid canonical');
  for (const img of doc.querySelectorAll('img'))
    if (!img.hasAttribute('alt') || !img.hasAttribute('width') || !img.hasAttribute('height'))
      fail('image missing dimensions or alt');
  for (const a of doc.querySelectorAll('a[target=_blank]'))
    if (!a.rel.includes('noopener')) fail('external link without noopener');
  for (const el of doc.querySelectorAll('a[href],img[src],script[src],link[rel=stylesheet]')) {
    const uri = el.getAttribute('href') || el.getAttribute('src');
    if (!uri || !uri.startsWith('/') || uri.startsWith('//')) continue;
    const url = new URL(uri, 'https://www.republikkenmao.com');
    const pathname = decodeURIComponent(url.pathname);
    const target = path.join(root, pathname);
    const alternatives = [target, path.join(target, 'index.html')];
    let exists = false;
    for (const candidate of alternatives)
      try {
        if ((await stat(candidate)).isFile()) {
          exists = true;
          break;
        }
      } catch {}
    if (!exists) fail(`broken local asset/link: ${uri}`);
    else if (url.hash) {
      let hashDocument = doc;
      if (pathname !== (route || '/')) {
        try {
          const targetHtml = await readFile(
            path.extname(target) ? target : path.join(target, 'index.html'),
            'utf8',
          );
          hashDocument = new JSDOM(targetHtml).window.document;
        } catch {}
      }
      if (!hashDocument.getElementById(decodeURIComponent(url.hash.slice(1))))
        fail(`missing anchor: ${uri}`);
    }
  }
  const og = doc.querySelector('meta[property="og:image"]')?.content;
  if (!og) fail('missing OG image');
  else
    try {
      await stat(path.join(root, new URL(og).pathname));
    } catch {
      fail('OG image missing on disk');
    }
  let graph = [];
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const ld = JSON.parse(script.textContent);
      if (ld['@context'] !== 'https://schema.org') fail('invalid schema context');
      graph.push(...ld['@graph']);
    } catch {
      fail('invalid JSON-LD');
    }
  }
  for (const type of ['Organization', 'WebSite', 'LocalBusiness'])
    if (!graph.find((x) => x['@type'] === type)) fail(`missing schema ${type}`);
  const business = graph.find((x) => x['@type'] === 'LocalBusiness');
  if (business?.telephone !== '+34652505948' || business?.address?.postalCode !== '07703')
    fail('NAP mismatch');
  const faq = graph.find((x) => x['@type'] === 'FAQPage');
  if (faq)
    for (const q of faq.mainEntity) {
      if (
        !doc.body.textContent.includes(q.name) ||
        !doc.body.textContent.includes(q.acceptedAnswer.text)
      )
        fail('FAQ schema differs from visible text');
    }
  for (const product of graph.filter((x) => ['Product', 'Service'].includes(x['@type']))) {
    if (
      !(product.offers?.price > 0) ||
      product.offers.priceCurrency !== 'EUR' ||
      product.offers.priceSpecification?.valueAddedTaxIncluded !== false
    )
      fail('invalid offer or VAT');
  }
  if (doc.querySelectorAll('details').length && !faq) fail('FAQ without schema');
  results.push({
    route: route || '/',
    title,
    titleLength: title.length,
    descriptionLength: description?.length,
    schemaTypes: graph.map((x) => x['@type']),
    faqCount: faq?.mainEntity.length || 0,
  });
}
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
if (/plaza.miranda/i.test(sitemap)) errors.push('hidden location in sitemap');
for (const file of files.filter((f) => /\.(js|json|xml)$/.test(f))) {
  if (/plaza.miranda/i.test(await readFile(file, 'utf8')))
    errors.push(`hidden location in public bundle ${file}`);
}
for (const expected of [
  '/profesionales',
  '/eventos-formaciones',
  '/reuniones-empresas',
  '/entrenadores-fitness',
  '/presupuesto',
  '/reservar',
  '/espacios',
  '/tarifas',
])
  if (!results.find((p) => p.route === expected)) errors.push(`missing expected route ${expected}`);
const report = {
  checkedAt: new Date().toISOString(),
  pages: results,
  errors,
  scope:
    'Local HTML, assets, links, SEO lengths, JSON-LD shape/content, hidden location. Not an external Google Rich Results certification.',
};
await writeFile('reports/structure.json', JSON.stringify(report, null, 2));
console.log(`${pages.length} pages checked; ${errors.length} error(s).`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
