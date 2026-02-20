import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

export default defineConfig({
  title: 'OptikPI',
  description:
    'Official documentation for the OptikPI Marketing Automation Platform — APIs, Push SDK, and integration guides.',
  cleanUrls: true,
  lastUpdated: true,

  rewrites: {
    '': 'getting-started/introduction'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#07388A' }]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'night-owl'
    },
    lineNumbers: false,
    config: (md) => {
      md.use(tabsMarkdownPlugin);
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'OptikPI Docs',

    nav: [
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'Push SDK', link: '/push-sdk/overview' },
      { text: 'API Reference', link: '/api-reference/user' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started/introduction' },
          { text: 'Authentication', link: '/getting-started/authentication' },
          { text: 'Response Format', link: '/getting-started/response-format' }
        ]
      },
      {
        text: 'Push SDK',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/push-sdk/overview' },
          { text: 'Installation', link: '/push-sdk/installation' },
          { text: 'API Reference', link: '/push-sdk/api-reference' },
          { text: 'Service Worker', link: '/push-sdk/service-worker' }
        ]
      },
      {
        text: 'API Reference',
        collapsed: false,
        items: [
          { text: 'User', link: '/api-reference/user' },
          { text: 'Audience', link: '/api-reference/audience' },
          { text: 'Campaign', link: '/api-reference/campaign' },
          { text: 'Workflow', link: '/api-reference/workflow' },
          { text: 'Library', link: '/api-reference/library' },
          { text: 'Report', link: '/api-reference/report' },
          { text: 'Integration', link: '/api-reference/integration' },
          { text: 'Workspace', link: '/api-reference/workspace' },
          { text: 'Tags', link: '/api-reference/tags' },
          { text: 'Uploads', link: '/api-reference/uploads' },
          { text: 'Roles', link: '/api-reference/roles' },
          { text: 'Module Usage', link: '/api-reference/module-usage' },
          { text: 'Dashboard', link: '/api-reference/dashboard' },
          { text: 'Customer 360', link: '/api-reference/customer360' },
          { text: 'Data Platform', link: '/api-reference/data-platform' },
          { text: 'History Log', link: '/api-reference/history-log' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium'
      }
    },

    socialLinks: [],

    footer: {
      message: 'OptikPI Marketing Automation Platform',
      copyright: `Copyright © ${new Date().getFullYear()} OptikPI`
    }
  }
});
