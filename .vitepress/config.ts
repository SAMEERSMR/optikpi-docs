import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

const requiredIcon =
  '<span class="vp-icon vp-icon-required vp-icon-check" role="img" aria-label="Required"></span>';
const optionalIcon =
  '<span class="vp-icon vp-icon-optional vp-icon-incorrect" role="img" aria-label="Optional"></span>';
const warningIcon =
  '<span class="vp-icon vp-icon-warning vp-icon-warning-triangle" role="img" aria-label="Warning"></span>';

export default defineConfig({
  title: "OptiKPI",
  description:
    "Official documentation for the OptiKPI Marketing Automation Platform — APIs, Push SDK, and integration guides.",
  cleanUrls: true,
  lastUpdated: true,

  ignoreDeadLinks: [/^http:\/\/localhost/, /^https?:\/\/.+/, /^\.\/.+/],

  rewrites: {
    "": "getting-started/introduction",
    es: "es/getting-started/introduction",
  },

  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    es: {
      label: "Español",
      lang: "es",
      link: "/es/",
    },
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#07388A" }],
  ],

  markdown: {
    theme: {
      light: "github-light",
      dark: "night-owl",
    },
    lineNumbers: false,
    config: (md) => {
      md.use(tabsMarkdownPlugin);

      const escapeHtml = (s: string) =>
        String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      const defaultText = md.renderer.rules?.text;
      md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const content = tokens[idx]?.content ?? "";
        if (!/✅|❌|⚠️/.test(content))
          return defaultText
            ? defaultText(tokens, idx, options, env, self)
            : escapeHtml(content);
        const parts = content.split(/(✅|❌|⚠️)/g);
        return parts
          .map((p) => {
            if (p === "✅") return requiredIcon;
            if (p === "❌") return optionalIcon;
            if (p === "⚠️") return warningIcon;
            return escapeHtml(p);
          })
          .join("");
      };
    },
  },

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "OptiKPI Docs",

    nav: [{ text: "Getting Started", link: "/getting-started/introduction" }],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/getting-started/introduction" },
          { text: "Authentication", link: "/getting-started/authentication" },
          { text: "Response Format", link: "/getting-started/response-format" },
        ],
      },
      {
        text: "Data Pipeline SDK",
        collapsed: false,
        items: [
          {
            text: "Overall",
            collapsed: false,
            items: [{ text: "Overview", link: "/data-pipeline-sdk/overview" }],
          },
          {
            text: "Official",
            collapsed: false,
            items: [
              { text: "JavaScript", link: "/data-pipeline-sdk/javascript" },
              { text: "Java", link: "/data-pipeline-sdk/java" },
              { text: "Python", link: "/data-pipeline-sdk/python" },
              { text: "PHP", link: "/data-pipeline-sdk/php" },
            ],
          },
          {
            text: "Reference",
            collapsed: false,
            items: [
              {
                text: "Integration Guide",
                link: "/data-pipeline-sdk/integration-guide",
              },
            ],
          },
        ],
      },
      // {
      //   text: "Push SDK",
      //   collapsed: false,
      //   items: [
      //     { text: "Overview", link: "/push-sdk/overview" },
      //     { text: "Installation", link: "/push-sdk/installation" },
      //     { text: "API Reference", link: "/push-sdk/api-reference" },
      //     { text: "Service Worker", link: "/push-sdk/service-worker" },
      //   ],
      // },
      // {
      //   text: "API Reference",
      //   collapsed: false,
      //   items: [
      //     { text: "User", link: "/api-reference/user" },
      //     { text: "Audience", link: "/api-reference/audience" },
      //     { text: "Campaign", link: "/api-reference/campaign" },
      //     { text: "Workflow", link: "/api-reference/workflow" },
      //     { text: "Library", link: "/api-reference/library" },
      //     { text: "Report", link: "/api-reference/report" },
      //     { text: "Integration", link: "/api-reference/integration" },
      //     { text: "Workspace", link: "/api-reference/workspace" },
      //     { text: "Tags", link: "/api-reference/tags" },
      //     { text: "Uploads", link: "/api-reference/uploads" },
      //     { text: "Roles", link: "/api-reference/roles" },
      //     { text: "Module Usage", link: "/api-reference/module-usage" },
      //     { text: "Dashboard", link: "/api-reference/dashboard" },
      //     { text: "Customer 360", link: "/api-reference/customer360" },
      //     { text: "Data Platform", link: "/api-reference/data-platform" },
      //     { text: "History Log", link: "/api-reference/history-log" },
      //   ],
      // },
    ],

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
      label: "On this page",
    },

    docFooter: {
      prev: "Previous",
      next: "Next",
    },

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
      },
    },

    socialLinks: [],

    footer: {
      message: "OptiKPI Marketing Automation Platform",
      copyright: `Copyright © ${new Date().getFullYear()} OptiKPI`,
    },
  },
});
