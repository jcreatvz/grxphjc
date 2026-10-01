// Shell block registry — chrome regions (bottom bar + footer).
// Kept separate from content blocks: different layout assumptions.
import Logo from './shell/logo/Logo.astro';
import logoSchema from './shell/logo/schema.js';
import NavLinks from './shell/nav-links/NavLinks.astro';
import navLinksSchema from './shell/nav-links/schema.js';
import MenuToggle from './shell/menu-toggle/MenuToggle.astro';
import menuToggleSchema from './shell/menu-toggle/schema.js';
import FooterColumns from './shell/footer-columns/FooterColumns.astro';
import footerColumnsSchema from './shell/footer-columns/schema.js';
import FooterCredits from './shell/footer-credits/FooterCredits.astro';
import footerCreditsSchema from './shell/footer-credits/schema.js';

export const shellRegistry = {
  'logo':           { component: Logo,          schema: logoSchema },
  'nav-links':      { component: NavLinks,      schema: navLinksSchema },
  'menu-toggle':    { component: MenuToggle,    schema: menuToggleSchema },
  'footer-columns': { component: FooterColumns, schema: footerColumnsSchema },
  'footer-credits': { component: FooterCredits, schema: footerCreditsSchema },
};
