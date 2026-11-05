import { Hero } from '@/components/sections/Hero';
import { Assurances } from '@/components/sections/Assurances';
import { LineRail } from '@/components/sections/LineRail';
import { Spotlight } from '@/components/sections/Spotlight';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { PeptiqStandard } from '@/components/sections/PeptiqStandard';
import { Bestsellers } from '@/components/sections/Bestsellers';
import { SupplyProgramme } from '@/components/sections/SupplyProgramme';
import { Story } from '@/components/sections/Story';
import { ReviewReel } from '@/components/sections/ReviewReel';
import { Process } from '@/components/sections/Process';
import { News } from '@/components/sections/News';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { PartnerModal } from '@/components/layout/PartnerModal';

/**
 * Commerce-forward ordering: browse → trust → buy → recurring supply, then the
 * brand and process story, then testimonials and contact.
 *
 * `Spotlight` (one featured product) sits immediately under the hero, then
 * `LineRail` as the way into the rest of the catalogue.
 *
 * `TrustStrip` sits between the two — the four assurances every order carries,
 * answering "why buy from here" before the first product is priced.
 *
 * `Bestsellers` follows the About section, so the first products after the brand
 * story are the ones that sell. `PeptiqStandard` comes next: it is the brand
 * chapter, and the only place on the page that shows Peptiq-branded packaging
 * rather than a person in a lab.
 *
 * The old static `Products` section was replaced by the LineRail / Bestsellers
 * pair; Bestsellers carries its `#products` anchor so the nav link still lands
 * in the right place.
 *
 * `NewArrivals` is no longer mounted — the slot now carries `ReviewReel`, the
 * video review rail. The component and its `merch.newArrivals` content are
 * both still here, so putting it back is a one-line change.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Spotlight />
      <LineRail />
      <Story />
      <Bestsellers />
      <PeptiqStandard />
      <Assurances />
      <SupplyProgramme />
      <ReviewReel />
      <Process />
      <News />
      <Faq />
      <Contact />
      <PartnerModal />
    </main>
  );
}
