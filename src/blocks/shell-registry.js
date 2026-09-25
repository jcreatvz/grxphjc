// Shell block registry — used by Header + Footer.
// Kept separate from content blockRegistry because shell blocks assume
// horizontal / narrow layout context; content blocks assume full-width.
// Mixing them causes weird bugs. Add new chrome blocks here.
import Logo from './shell/logo/Logo.astro';
import logoSchema from './shell/logo/schema.js';

import NavPrimary from './shell/nav-primary/NavPrimary.astro';
import navPrimarySchema from './shell/nav-primary/schema.js';

import FooterColumns from './shell/footer-columns/FooterColumns.astro';
import footerColumnsSchema from './shell/footer-columns/schema.js';

import FooterCredits from './shell/footer-credits/FooterCredits.astro';
import footerCreditsSchema from './shell/footer-credits/schema.js';

export const shellRegistry = {
  'logo':            { component: Logo,          schema: logoSchema },
  'nav-primary':     { component: NavPrimary,    schema: navPrimarySchema },
  'footer-columns':  { component: FooterColumns, schema: footerColumnsSchema },
  'footer-credits':  { component: FooterCredits, schema: footerCreditsSchema },
};
