// Content block registry — used by projects AND pages via BlockRenderer.
// New block: src/blocks/<type>/{Component.astro, schema.js} + one line here.
import Hero from './hero/Hero.astro';                 import heroSchema from './hero/schema.js';
import Gallery from './gallery/Gallery.astro';        import gallerySchema from './gallery/schema.js';
import Orbit from './orbit/Orbit.astro';              import orbitSchema from './orbit/schema.js';
import Statement from './statement/Statement.astro';  import statementSchema from './statement/schema.js';
import ProjectGrid from './project-grid/ProjectGrid.astro'; import projectGridSchema from './project-grid/schema.js';
import Metrics from './metrics/Metrics.astro';        import metricsSchema from './metrics/schema.js';
import ListRows from './list-rows/ListRows.astro';    import listRowsSchema from './list-rows/schema.js';
import Steps from './steps/Steps.astro';              import stepsSchema from './steps/schema.js';
import Marquee from './marquee/Marquee.astro';        import marqueeSchema from './marquee/schema.js';
import Cta from './cta/Cta.astro';                    import ctaSchema from './cta/schema.js';
import Text from './text/Text.astro';                 import textSchema from './text/schema.js';
import Video from './video/Video.astro';             import videoSchema from './video/schema.js';
import Embed from './embed/Embed.astro';             import embedSchema from './embed/schema.js';
import Quote from './quote/Quote.astro';             import quoteSchema from './quote/schema.js';
import Credits from './credits/Credits.astro';       import creditsSchema from './credits/schema.js';
import ProjectMeta from './project-meta/ProjectMeta.astro'; import projectMetaSchema from './project-meta/schema.js';
import FullbleedImage from './fullbleed-image/FullbleedImage.astro'; import fullbleedSchema from './fullbleed-image/schema.js';

export const blockRegistry = {
  'hero':         { component: Hero,        schema: heroSchema },
  'gallery':      { component: Gallery,     schema: gallerySchema },
  'orbit':        { component: Orbit,       schema: orbitSchema },
  'statement':    { component: Statement,   schema: statementSchema },
  'project-grid': { component: ProjectGrid, schema: projectGridSchema },
  'metrics':      { component: Metrics,     schema: metricsSchema },
  'list-rows':    { component: ListRows,    schema: listRowsSchema },
  'steps':        { component: Steps,       schema: stepsSchema },
  'marquee':      { component: Marquee,     schema: marqueeSchema },
  'cta':          { component: Cta,         schema: ctaSchema },
  'text':         { component: Text,        schema: textSchema },
  'video':        { component: Video,       schema: videoSchema },
  'embed':        { component: Embed,       schema: embedSchema },
  'quote':        { component: Quote,       schema: quoteSchema },
  'credits':      { component: Credits,     schema: creditsSchema },
  'project-meta': { component: ProjectMeta, schema: projectMetaSchema },
  'fullbleed-image': { component: FullbleedImage, schema: fullbleedSchema },
};
