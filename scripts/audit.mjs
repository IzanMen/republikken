import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const base = process.env.AUDIT_URL || 'http://localhost:4322';
const structure = JSON.parse(await readFile('reports/structure.json', 'utf8'));
const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : structure.pages
      .map((p) => p.route)
      .filter((p) => !['/404.html', '/aviso-legal', '/privacidad', '/cookies'].includes(p));
await mkdir('reports/lighthouse', { recursive: true });
const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
});
const results = [];
try {
  for (const route of routes) {
    const name = route === '/' ? 'inicio' : route.slice(1).replaceAll('/', '-');
    const run = await lighthouse(new URL(route, base).href, {
      port: chrome.port,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
    });
    if (!run) throw Error(`No result for ${route}`);
    await writeFile(`reports/lighthouse/${name}.json`, run.report[0]);
    await writeFile(`reports/lighthouse/${name}.html`, run.report[1]);
    const r = run.lhr;
    if (r.runtimeError) throw Error(`${route}: ${r.runtimeError.message}`);
    const scores = Object.fromEntries(
      Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]),
    );
    results.push({
      route,
      scores,
      lcp: r.audits['largest-contentful-paint'].numericValue,
      cls: r.audits['cumulative-layout-shift'].numericValue,
      tbt: r.audits['total-blocking-time'].numericValue,
      failedAudits: Object.values(r.audits)
        .filter((a) => a.score === 0)
        .map((a) => ({ id: a.id, title: a.title })),
      environment: r.environment,
    });
    if (r.fullPageScreenshot?.screenshot?.data)
      await writeFile(
        `reports/lighthouse/${name}-mobile.jpg`,
        Buffer.from(r.fullPageScreenshot.screenshot.data.split(',')[1], 'base64'),
      );
    console.log(
      `${route} ${JSON.stringify(scores)} LCP=${Math.round(results.at(-1).lcp)}ms CLS=${results.at(-1).cls}`,
    );
  }
} finally {
  chrome.kill();
  await writeFile(
    'reports/lighthouse-summary.json',
    JSON.stringify(
      {
        measuredAt: new Date().toISOString(),
        base,
        profile: 'Lighthouse mobile default simulated throttling, local production preview',
        results,
      },
      null,
      2,
    ),
  );
}
