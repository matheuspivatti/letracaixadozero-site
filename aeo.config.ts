import { defineConfig } from 'aeo.js';

export default defineConfig({
  title: 'Letra Caixa do Zero — O Maior Portal de Letras Caixa do Brasil',
  url: 'https://letracaixadozero.com',
  description: 'Aprenda a fabricar letras caixa profissionais: ACM, aço, acrílico, PVC, neon LED, impressão 3D, precificação e muito mais. Conteúdo técnico exclusivo de Matheus Pivatti com 15 anos de experiência em comunicação visual.',

  generators: {
    robotsTxt: true,
    llmsTxt: true,
    llmsFullTxt: true,
    rawMarkdown: true,
    manifest: true,
    sitemap: true,
    aiIndex: true,
  },

  schema: {
    enabled: true,
    organization: {
      name: 'Letra Caixa do Zero',
      url: 'https://letracaixadozero.com',
    },
    defaultType: 'WebSite',
  },

  og: {
    enabled: true,
    twitterHandle: '@letracaixadozero',
  },

  robots: {
    allow: ['/'],
    disallow: [],
    crawlDelay: 0,
  },

  widget: {
    enabled: true,
    position: 'bottom-right',
    humanLabel: 'Normal',
    aiLabel: 'IA',
    showBadge: true,
    theme: {
      background: 'rgba(15, 23, 42, 0.95)',
      text: '#e2e8f0',
      accent: '#fbbf24',
      badge: '#22c55e',
    },
  },
});
