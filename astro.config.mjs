import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://akuederle.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  redirects: {
    // Posts
    '/scientific-python-now-2': '/posts/scientific-python-now-2/',
    '/awesome_wm-widgets-1': '/posts/awesome_wm-widgets-1/',
    '/Automatization-with-Latex-and-Python-2': '/posts/automatization-with-latex-and-python-2/',
    '/scientific-python-now-1': '/posts/scientific-python-now-1/',
    '/windows-like-appshortcuts-in-linux': '/posts/windows-like-appshortcuts-in-linux/',
    '/awesome-dmenu': '/posts/awesome-dmenu/',
    '/create-professional-signature-with-latex': '/posts/create-professional-signature-with-latex/',
    '/Automatization-with-Latex-and-Python-3': '/posts/automatization-with-latex-and-python-3/',
    '/Automatization-with-Latex-and-Python-1': '/posts/automatization-with-latex-and-python-1/',
    '/customize-ipython-keymap': '/posts/customize-ipython-keymap/',
    // Quicktips
    '/stop-using-numpy-loadtxt': '/quicktips/stop-using-numpy-loadtxt/',
    '/commit-changed-to-a-different-branch': '/quicktips/commit-changed-to-a-different-branch/',
    '/modify-your-powershell-prompt': '/quicktips/modify-your-powershell-prompt/',
    '/boost-your-productivity-by-increasing-Video-Playback-Speed': '/quicktips/boost-your-productivity-by-increasing-video-playback-speed/',
    '/fix-battery-drain': '/quicktips/fix-battery-drain/',
    '/create-numpy-array-with-for-loop': '/quicktips/create-numpy-array-with-for-loop/',
    '/aur-curl-error': '/quicktips/aur-curl-error/',
    '/extend-latex-begin-document': '/quicktips/extend-latex-begin-document/',
    '/change-color-of-matplotlib-plots': '/quicktips/change-color-of-matplotlib-plots/',
    '/matplotlib-zoomed-up-inset': '/quicktips/matplotlib-zoomed-up-inset/',
  },
});
