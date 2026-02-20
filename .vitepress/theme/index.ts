import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';
import HomeRedirect from './components/HomeRedirect.vue';
import EmojiToIcon from './components/EmojiToIcon.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app);
    app.component('HomeRedirect', HomeRedirect);
    app.component('EmojiToIcon', EmojiToIcon);
  },
  setup() {
    // EmojiToIcon will run on mount via Layout.vue
  }
} satisfies Theme;
