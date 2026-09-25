import { defineConfig } from 'astro/config';

// Deployment target: https://jcreatvz.github.io/grxphjc
// If you rename the repo, update `base` to match.
// If you deploy to the user root (repo named `jcreatvz.github.io`),
// set base to '/' and site to 'https://jcreatvz.github.io'.
export default defineConfig({
  site: 'https://jcreatvz.github.io',
  base: '/grxphjc',
  trailingSlash: 'ignore',
});
