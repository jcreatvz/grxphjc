// Single client entry. Each module is self-guarding (no-ops if its markup is absent).
import { initPrefs } from './prefs';
import { initMenu } from './menu';
import { initScramble } from './scramble';
import { initReveal } from './reveal';
import { initProgress } from './progress';
import { initCursor } from './cursor';
import { initLightbox } from './lightbox';
import { initLoader } from './loader';
import { initOrbits } from './orbit';
import { initPinnedGalleries } from './pinned';
import { initVideos } from './video';
import { initFooterReveal } from './footer';
import { initMarquees } from './marquee';

initPrefs();
initMenu();
initScramble();
initProgress();
initCursor();
initLightbox();
initMarquees();
initOrbits();
initPinnedGalleries();
initVideos();
initFooterReveal();
initLoader(() => initReveal()); // reveal runs once the intro has cleared
