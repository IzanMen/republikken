import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.republikkenmao.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({ filter: (url) => !/\/(404|aviso-legal|privacidad|cookies)$/.test(url) }),
  ],
  i18n: { defaultLocale: 'es', locales: ['es'], routing: { prefixDefaultLocale: false } },
  build: { inlineStylesheets: 'auto' },
});
