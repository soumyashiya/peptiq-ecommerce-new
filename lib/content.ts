/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL CONTENT & BRANDING
 * ─────────────────────────────────────────────────────────────────────────────
 *  Content modelled on peptiq.bz — premium research peptides for laboratory
 *  R&D. All products are for laboratory research and development only.
 *  Not for human or veterinary consumption.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'Peptiq',
  suffix: '',
  // Small spaced line under the header wordmark.
  sub: 'RESEARCH',
  tagline: 'ADVANCING DISCOVERY THROUGH PEPTIQ RESEARCH',
  established: 2024,
  email: 'research@peptiq.org',
  phone: 'Contact via email (support@peptiq.org)',
  address: 'United Kingdom · Research operations',
};

/**
 * Compliance copy. These strings are used verbatim across the product,
 * cart, checkout and order pages. Do not soften them — they exist to
 * position every product as strictly research-use-only and to avoid any
 * medical, therapeutic, transformation, or personal-use implication.
 */
export const compliance = {
  productDisclaimer:
    'FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Products are supplied strictly for laboratory and analytical research conducted by qualified professionals.',
  productDisclaimerShort:
    'For research purposes only. Not intended for human or veterinary use.',
  checkoutAcknowledgement:
    'By proceeding with this purchase, you acknowledge that these products are intended solely for laboratory research purposes and are not intended for human or veterinary use.',
  checkoutMedical:
    'These products are not intended to diagnose, treat, cure, or prevent any disease.',
};

/**
 * The notice shown on arriving at the homepage (PartnerModal.tsx).
 *
 * ⚠️ "Authorised" and "genuine" are factual claims about the Alluvi relationship:
 * keep them only while the partnership paperwork backs them.
 */
export const partnerModal = {
  eyebrow: 'Official partner',
  logo: 'ALLUVI',
  logoSub: 'Healthcare',
  title: 'Authorised reseller of Alluvi research products.',
  body: 'Every pen on this site is a genuine Alluvi Healthcare kit, supplied through our authorised partnership, batch-verified by Janoshik Analytical and shipped sealed and cold.',
  tags: ['Genuine Alluvi batches', 'Janoshik verified'],
  shopCta: { label: 'Shop the range', href: '/shop' },
  verifyCta: { label: 'Verify a batch', href: '#process' },
  image: '/images/partner-modal.jpg',
  imageAlt: 'A BPC-157 and TB-500 carton and pen from Alluvi Healthcare on dark slate',
  imagePosition: '30% 50%',
};

export const nav = {
  links: [
    { label: 'Home', href: '#top' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '#products' },
    { label: 'Why Us', href: '#assurances' },
    { label: 'Testimonial', href: '#news' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Shop', href: '/shop' },
  menuLabel: 'Menu',
  language: 'ENG',
};

export const hero = {
  kicker:
    'RESEARCH USE ONLY — PREMIUM RESEARCH PEPTIDES FOR LABORATORY R&D. NOT FOR HUMAN OR VETERINARY CONSUMPTION.',
  // Backed by the per-batch Janoshik report on every product page — keep the
  // claim about verification, never about effect.
  line1: 'PEPTIDES YOU CAN',
  line2: 'ACTUALLY VERIFY.',
  scrollCue: '[ SCROLL DOWN AND ENTER ]',
  footerLeft: 'ADVANCING DISCOVERY',
  footerRight: 'THROUGH PEPTIQ RESEARCH',
  primaryCta: { label: 'Shop all', href: '/shop' },
  secondaryCta: { label: 'Discover our process', href: '#process' },
  // Subject sits right-of-centre, leaving the left third open for the copy
  // stack — Hero.tsx pins the crop with `object-[70%_center]` to keep it there.
  image: '/images/hero1.jpg',
};

/**
 * Pill badge strip between the hero and the spotlight (TrustStrip.tsx).
 *
 * Badges only — the section deliberately has no heading. It previously carried
 * a brand-stamp label and a one-line note above the row; both were dropped, so
 * there is nothing here but `items`. The section's accessible name is set on
 * the element in TrustStrip.tsx, not from this file.
 */
export const trustStrip = {
  items: [
    {
      icon: 'shield',
      label: 'Verified sourcing',
      body: 'Direct contracts with certified manufacturers. No grey-market resellers in the chain.',
    },
    {
      icon: 'flask',
      label: 'Lab-tested purity',
      body: 'Every batch independently assayed by Janoshik Analytical before it is listed.',
    },
    {
      icon: 'snow',
      label: 'Sealed cold packaging',
      body: 'Cold-stored, tamper-sealed and labelled accurately before it leaves the shelf.',
    },
    {
      icon: 'chat',
      // ⚠️ Confirm a WhatsApp support line actually exists before publishing.
      label: 'A human on WhatsApp',
      body: 'Real replies from a real person, usually within minutes on working days.',
    },
  ],
};

export const story = {
  index: '01',
  label: 'ABOUT',
  overline: 'Our story — Built for research supply',
  title:
    'Effortlessly advance research with research-grade peptides, validated by independent laboratories.',
  body: [
    'Peptiq develops research compounds for laboratory use only. Our science-backed peptides and formulations are produced in-house and supplied in sealed, traceable formats for controlled R&D programmes.',
    'We eliminate uncertainty with batch-tested compounds, ISO-certified clean-room manufacturing, and fully documented per-batch records. Every Peptiq research pen is independently verified by Janoshik Analytical.',
  ],
  cta: { label: 'Our process', href: '#process' },
  facts: [
    { value: '48+', label: 'Advanced formulations developed' },
    { value: '26.3k+', label: 'R&D-tested research units' },
    { value: '99.95%', label: 'Lab-tested purity' },
  ],
  image: '/images/about-big.webp',
  image2: '/images/about-small.webp',

  /* ── Editorial "About" layout (Story.tsx) ───────────────────────────────── */
  eyebrow: 'The Peptiq standard',
  /** Two-line heading; the second line is set in the purple italic accent. */
  headlineA: 'Purity, verified.',
  headlineB: 'Paperwork, included.',
  founding:
    'We started Peptiq because the research peptide market needed a supplier willing to be boring about the basics — transparent sourcing, third-party lab testing, and people you can actually message. Every batch is checked before it reaches our shelves, and every product is supplied strictly for laboratory research use.',
  // AI-generated (Magnific): gloved hands racking unbranded pens in a 4°C lab fridge.
  photo: '/images/about-cold-storage.jpg',
  photoAlt: 'Gloved hands placing a research pen into a refrigerated rack',
  /*
   * Client-supplied banner. Two people seated behind two cartons, pens laid in
   * front, on a lavender set — faces in the upper half, product across the
   * lower half. Story.tsx's fade was moved down to suit it: the old shot put
   * its subject in the top half and had nothing below worth keeping clear.
   *
   * ⚠️ Carries **ALLUVI Healthcare** branding, not Peptiq, and the cartons
   * print "For subcutaneous injection only", "Single patient use", "Read
   * package leaflet before use", plus "SKIN · HAIR · CELLULAR REPAIR" and
   * "Focus · Brain Cellular Repair & Anti-Aging". Those are human-use and
   * therapeutic claims, and they sit directly against the research-use-only
   * positioning this site is built on — including `story.founding` three lines
   * above, which ends "supplied strictly for laboratory research use".
   * Flagged, not swapped: the client chose the image.
   *
   * Source is a 1.4 MB PNG of a photograph. next/image re-encodes it, but a
   * JPEG or WebP original would cut the build input substantially.
   */
  bannerImage: '/images/about-banner-new.png',
  /** Story.tsx shows the banner as two panels, one model each; `position` is the crop. */
  bannerPanels: [
    {
      position: '7% 50%',
      alt: 'A person seated behind a GHK-Cu carton, with its pre-filled pen laid out in front on a lavender set',
    },
    {
      position: '82% 50%',
      alt: 'A person seated behind a NAD+ carton, with its pre-filled pen laid out in front on a lavender set',
    },
  ],
  bannerAlt:
    'Two people seated behind GHK-Cu and NAD+ cartons, with their pre-filled pens laid out in front on a lavender set',
  noteLabel: 'Janoshik verified',
  noteText: 'Every batch assayed before it is listed.',
};

/**
 * "The Peptiq standard" — the brand band between the story and the assurance
 * grid (PeptiqStandard.tsx).
 *
 * `points` are the batch's three stages in order, each with its photo and the
 * product shown on it. The Sealed photo is the page's one shot of real Peptiq
 * packaging.
 */
export const peptiqStandard = {
  label: 'How every batch ships',
  /** One entry per visual line. */
  headlineA: 'Nothing ships',
  headlineB: 'on trust.',
  body:
    'One standard runs across every Peptiq line: an independent assay before a batch is listed, a sealed fixed-volume pen, cold-chain dispatch, and the batch-specific certificate in the box. The paperwork is not an extra — it is the product.',
  cta: { label: 'See the quality protocol', href: '#process' },
  shopCta: { label: 'Shop all lines', href: '/shop' },
  addLabel: 'Add to cart',
  addedLabel: 'Added',
  points: [
    {
      title: 'Assayed before listed',
      body: 'Every batch goes to Janoshik Analytical for independent purity and concentration checks before it is offered for sale.',
      image: '/images/featured-review-lab.jpg',
      alt: 'Researcher inspecting a sealed research pen at the laboratory bench',
      position: '60% 30%',
      productSlug: 'mots-c-40mg',
    },
    {
      title: 'Sealed, fixed volume',
      body: 'Supplied in pre-filled research pens — nothing to reconstitute, measure or transfer at the bench.',
      image: '/images/supply-still-life.jpg',
      alt: 'Peptiq cartons stacked beside a pre-filled research pen and a lavender pouch',
      position: '85% 40%',
      productSlug: 'tesamorelin-20mg',
    },
    {
      title: 'Documented on dispatch',
      body: 'The batch-specific certificate of analysis ships in the box, and its reference matches the number printed on the pen.',
      image: '/images/about-banner.jpg',
      alt: 'A gloved hand lifting a research pen from an open case, beside lab vials',
      position: '42% 30%',
      productSlug: 'retatrutide-40mg',
    },
  ],
};

/**
 * The /about page (app/about/page.tsx). The story reuses the homepage's copy, so
 * the two can't drift. It speaks as the company: the people in the banner are from
 * the client's image, so nothing here presents them as founders or staff.
 */
export const aboutPage = {
  metaTitle: 'About',
  metaDescription: 'Why Peptiq exists, and the standard every research batch is held to before it ships.',
  banner: {
    image: story.bannerImage,
    alt: story.bannerAlt,
  },
  title: 'The standard behind Peptiq',
  quote: '"We started Peptiq because the research peptide market needed a supplier willing to be boring about the basics."',
  photo: {
    image: '/images/featured-review-lab.jpg',
    alt: 'Researcher inspecting a sealed research pen at the laboratory bench',
    position: '60% 30%',
  },
  eyebrow: 'Why we started',
  heading: 'A research supplier should be able to show its paperwork.',
  paragraphs: [
    'Transparent sourcing, third-party lab testing, and people you can actually message. Every batch is checked before it reaches our shelves, and every product is supplied strictly for laboratory research use.',
    ...story.body,
    peptiqStandard.body,
  ],
  statement: `${story.headlineA} ${story.headlineB}`,
  closingPhoto: {
    image: '/images/supply-still-life.jpg',
    alt: 'Peptiq cartons stacked beside a pre-filled research pen and a lavender pouch',
    position: '85% 40%',
  },
  cta: { label: 'Shop all lines', href: '/shop' },
};

export const stats = {
  label: 'INDEPENDENTLY VERIFIED · BATCH TESTED',
  items: [
    { value: 99.9, suffix: '%', caption: 'Lab-tested purity (Janoshik verified)' },
    { value: 56, suffix: ' DAYS', caption: 'Room-temperature stability hold' },
    { value: 26.3, suffix: 'K+', caption: 'R&D-tested research units' },
    { value: 48, suffix: '+', caption: 'Advanced formulations developed' },
  ],
};

export const sustainability = {
  index: '02',
  label: 'QUALITY ASSURANCE PROTOCOL',
  title: 'Trusted through',
  rotating: ['Testing', 'Purity', 'Stability', 'Traceability'],
  body:
    'Peptiq randomly selects research pens from every batch and sends them to Janoshik — a globally recognised laboratory — for fully independent verification. ISO-certified filling, tamper-evident labelling, and full chain-of-custody records protect every research unit from synthesis onward.',
  cta: { label: 'View Janoshik report', href: '#innovation' },
  // The centre media that zooms from a small window to full-screen on scroll.
  video: '/images/video-new.mp4',
  poster: '/images/lab-new1.avif',
  image: '/images/lab-new1.avif',
};

export const shop = {
  label: 'SHOP',
  eyebrow:
    'RESEARCH USE ONLY — SUPPLYING LABORATORIES WITH HIGH-PURITY RESEARCH PEPTIDES. NOT FOR HUMAN OR VETERINARY CONSUMPTION.',
  title: 'Research peptides, ready to ship.',
  subtitle:
    'Every pre-filled research pen is independently verified by Janoshik Analytical and issued with full batch documentation. Supplied exclusively for controlled laboratory R&D.',
};

export type ProductCompound = {
  name: string;
  concentration: string;
  content: string;
};

export type ProductJanoshik = {
  fillVolume: string;
  batchNumber: string;
  purity?: string;
  compounds: ProductCompound[];
};

export type ProductDetails = {
  contents: string[];
  storage: string[];
};

/** Shop taxonomy — drives the category tabs and `?category=` deep links. */
export type ProductCategory = 'metabolic' | 'recovery' | 'aesthetic' | 'longevity';

/** Single-compound vs multi-compound; drives the `?format=blend` filter. */
export type ProductFormat = 'single' | 'blend';

export type ProductBadge = 'New' | 'Limited';

export type Product = {
  slug: string;
  name: string;
  price: number;
  blurb: string;
  desc: string;
  image: string;
  gallery: string[];
  longDesc: string;
  specs: { label: string; value: string }[];
  labTestUrl?: string;
  janoshik?: ProductJanoshik;
  certificate?: string[];
  details?: ProductDetails;
  category: ProductCategory;
  format: ProductFormat;
  /** One-line card subtitle, e.g. 'Triple agonist · 2.4 mL pen'. */
  tagline: string;
  /** Short strength chip shown on the card, e.g. '40mg (20 / 20)'. */
  strength: string;
  badge?: ProductBadge;
  /**
   * Star rating and review count are rendered on product cards only when set.
   * Deliberately left unset — populate from real review data rather than
   * publishing an unverifiable average.
   */
  rating?: number;
  reviewCount?: number;
};

export const products: {
  index: string;
  label: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  items: Product[];
} = {
  index: '03',
  label: 'RESEARCH PEPTIDES',
  title: 'Engineered for research precision.',
  subtitle:
    'Pre-filled research pens, independently tested by Janoshik. Supplied exclusively for controlled laboratory R&D. Not for human or veterinary consumption.',
  cta: { label: 'Browse all research peptides', href: '#contact' },
  items: [
    {
      slug: 'retatrutide-40mg',
      name: 'Retatrutide 40mg',
      price: 180,
      category: 'metabolic',
      format: 'single',
      tagline: 'Triple agonist · 2.4 mL pen',
      strength: '40mg',
      badge: 'New',
      blurb: '2.4 mL pre-filled research pen',
      desc: '40mg Retatrutide, pre-filled research pen. 56-day room-temp stability.',
      image: '/new%20images/products/Retatrutide%20carton%20and%20turquoise%20pen-4.png',
      gallery: ['/new%20images/products/Retatrutide%20carton%20and%20turquoise%20pen-4.png'],
      longDesc:
        'A 40mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and device-mechanism evaluation.',
      specs: [
        { label: 'Format', value: '2.4 mL pre-filled pen' },
        { label: 'Compound', value: 'Retatrutide' },
        { label: 'Strength', value: '40mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each Retatrutide 40mg Research kit includes:',
          'Pre-filled Research pen (40mg Retatrutide)',
          'Research information sheet',
        ],
        storage: [
          'Store refrigerated (2–8°C). Do not freeze.',
          'Supplied in fixed-volume sealed format for laboratory analysis.',
        ],
      },
    },
    {
      slug: 'retatrutide-20mg',
      name: 'Retatrutide 20mg',
      price: 100,
      category: 'metabolic',
      format: 'single',
      tagline: 'Triple agonist · 2.4 mL pen',
      strength: '20mg',
      blurb: '2.4 mL pre-filled research pen',
      desc: '20mg Retatrutide, pre-filled research pen.',
      image: '/new%20images/products/Retatrutide%2020mg%20carton%20with%20turquoise%20pen-5.png',
      gallery: ['/new%20images/products/Retatrutide%2020mg%20carton%20with%20turquoise%20pen-5.png'],
      longDesc:
        'A 20mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and device-mechanism evaluation.',
      specs: [
        { label: 'Format', value: '2.4 mL pre-filled pen' },
        { label: 'Compound', value: 'Retatrutide' },
        { label: 'Strength', value: '20mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each Retatrutide 20mg Research kit includes:',
          'Pre-filled Research pen (20mg Retatrutide)',
          'Research information sheet',
        ],
        storage: [
          'Store refrigerated (2–8°C). Do not freeze.',
          'Supplied in fixed-volume sealed format for laboratory analysis.',
        ],
      },
    },
    {
      slug: 'tirzepatide-40mg',
      name: 'Tirzepatide 40mg',
      price: 100,
      category: 'metabolic',
      format: 'single',
      tagline: 'Dual agonist · 3 mL pen',
      strength: '40mg',
      blurb: '3 mL pre-filled research pen',
      desc: '40mg Tirzepatide, pre-filled research pen. Sealed for formulation studies.',
      image: '/new%20images/products/Tirzepatide%20Carton%20and%20Pen%20in%20Warm%20Light-6.png',
      gallery: ['/new%20images/products/Tirzepatide%20Carton%20and%20Pen%20in%20Warm%20Light-6.png'],
      longDesc:
        'A 40mg Tirzepatide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and device-mechanism evaluation.',
      specs: [
        { label: 'Format', value: '3 mL pre-filled pen' },
        { label: 'Compound', value: 'Tirzepatide' },
        { label: 'Strength', value: '40mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each Tirzepatide 40mg Research kit includes:',
          'Pre-filled Research pen (40mg Tirzepatide)',
          'Research information sheet',
        ],
        storage: [
          'Store refrigerated (2–8°C). Do not freeze.',
          'Supplied in fixed-volume sealed format for laboratory analysis.',
        ],
      },
    },
    {
      slug: 'bpc-157-tb-500-40mg',
      name: 'BPC-157 & TB-500 40mg',
      price: 130,
      category: 'recovery',
      format: 'blend',
      tagline: 'Recovery blend · dual-compound pen',
      strength: '40mg (20 / 20)',
      blurb: '20mg BPC-157 + 20mg TB-500',
      desc: '20mg BPC-157 + 20mg TB-500, pre-filled research pen.',
      image: '/new%20images/products/BPC-157%20%26%20TB-500%20on%20Graphite%20Slate-1.png',
      gallery: ['/new%20images/products/BPC-157%20%26%20TB-500%20on%20Graphite%20Slate-1.png'],
      longDesc:
        'A 40mg BPC-157 & TB-500 formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and device-mechanism evaluation.',
      specs: [
        { label: 'Format', value: '3 mL pre-filled pen' },
        { label: 'Compounds', value: 'BPC-157 + TB-500' },
        { label: 'Strength', value: '20mg + 20mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each BPC-157 & TB-500 40mg Research kit includes:',
          'Pre-filled Research pen (20mg BPC-157, 20mg TB-500)',
          'Research information sheet',
        ],
        storage: [
          'Store refrigerated (2–8°C). Do not freeze.',
          'Supplied in fixed-volume sealed format for laboratory analysis.',
        ],
      },
    },
    {
      slug: 'glow-70mg',
      name: 'Glow 70mg',
      price: 100,
      category: 'aesthetic',
      format: 'blend',
      tagline: 'GHK-Cu · BPC-157 · TB-500 blend',
      strength: '70mg',
      badge: 'New',
      blurb: '2 × pre-filled research pens',
      desc: '50mg GHK-Cu + 10mg BPC-157 + 10mg TB-500, pre-filled research pens.',
      image: '/new%20images/products/GLOW%20GHK-CU%20Carton%20with%20Blue%20Pen-3.png',
      gallery: ['/new%20images/products/GLOW%20GHK-CU%20Carton%20with%20Blue%20Pen-3.png'],
      longDesc:
        'A 70mg Glow formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and device-mechanism evaluation.',
      specs: [
        { label: 'Format', value: '2 × pre-filled pens' },
        { label: 'Compounds', value: 'GHK-Cu + BPC-157 + TB-500' },
        { label: 'Strength', value: '50mg / 10mg / 10mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each Glow 70mg Research kit includes:',
          '2 × Pre-filled Research pens (each pen contains 5mg BPC-157, 5mg TB-500, 25mg GHK-Cu)',
          'Total contents: 10mg BPC-157, 10mg TB-500, 50mg GHK-Cu',
        ],
        storage: [
          'Store refrigerated (2–8°C). Do not freeze.',
          'Supplied in fixed-volume sealed format for laboratory analysis.',
        ],
      },
    },
    {
      slug: 'nad-1000mg',
      name: 'NAD+ 1,000mg',
      price: 140,
      category: 'longevity',
      format: 'single',
      tagline: 'Longevity · 2 × 500mg pens',
      strength: '1,000mg',
      badge: 'Limited',
      blurb: '1,000mg for laboratory research',
      desc: '1,000mg NAD+, ISO 9001:2015 with full batch documentation.',
      image: '/new%20images/products/NAD%2B%20Carton%20and%20Yellow%20Pen-2.png',
      gallery: ['/new%20images/products/NAD%2B%20Carton%20and%20Yellow%20Pen-2.png'],
      longDesc:
        'NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.',
      specs: [
        { label: 'Content', value: '1,000mg NAD+' },
        { label: 'Standard', value: 'ISO 9001:2015' },
        { label: 'Docs', value: 'Full batch COA' },
        { label: 'Use', value: 'Laboratory R&D' },
      ],
      details: {
        contents: [
          'Each NAD+ 1,000mg kit includes:',
          '2 × Pre-filled NAD+ pens (500mg each)',
          'Research information sheet',
        ],
        storage: ['Store refrigerated (2–8°C). Do not freeze.'],
      },
    },
    {
      slug: 'mots-c-40mg',
      name: 'MOTS-C 40mg',
      // Placeholder — confirm the real price before launch.
      price: 140,
      category: 'longevity',
      format: 'single',
      tagline: 'Mitochondrial peptide · 4 × 10mg pen',
      strength: '40mg',
      badge: 'New',
      blurb: '40mg pre-filled research pen',
      desc: '40mg MOTS-C, pre-filled research pen with full batch documentation.',
      image: '/new%20images/products/MOTS-C%20Carton%20and%20Matching%20Pen-7.png',
      gallery: ['/new%20images/products/MOTS-C%20Carton%20and%20Matching%20Pen-7.png'],
      longDesc:
        'A 40mg MOTS-C (mitochondrial-derived peptide) formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications such as cellular-metabolism and in vitro studies.',
      specs: [
        { label: 'Format', value: 'Pre-filled pen, 4 × 10mg' },
        { label: 'Compound', value: 'MOTS-C' },
        { label: 'Strength', value: '40mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each MOTS-C 40mg Research kit includes:',
          'Pre-filled Research pen (40mg MOTS-C)',
          'Research information sheet',
        ],
        storage: ['Store refrigerated (2–8°C). Do not freeze.'],
      },
    },
    {
      slug: 'tesamorelin-20mg',
      name: 'Tesamorelin 20mg',
      // Placeholder — confirm the real price before launch.
      price: 120,
      category: 'recovery',
      format: 'single',
      tagline: 'GHRH analogue · 10 × 2mg pen',
      strength: '20mg',
      badge: 'New',
      blurb: '20mg pre-filled research pen',
      desc: '20mg Tesamorelin, pre-filled research pen with full batch documentation.',
      image: '/new%20images/products/Tesamorelin%2020mg%20carton%20and%20red%20pen-8.png',
      gallery: ['/new%20images/products/Tesamorelin%2020mg%20carton%20and%20red%20pen-8.png'],
      longDesc:
        'A 20mg Tesamorelin (growth-hormone-releasing hormone analogue) formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications such as receptor-binding and in vitro studies.',
      specs: [
        { label: 'Format', value: 'Pre-filled pen, 10 × 2mg' },
        { label: 'Compound', value: 'Tesamorelin' },
        { label: 'Strength', value: '20mg' },
        { label: 'Storage', value: 'Refrigerated, 2–8°C' },
      ],
      details: {
        contents: [
          'Each Tesamorelin 20mg Research kit includes:',
          'Pre-filled Research pen (20mg Tesamorelin)',
          'Research information sheet',
        ],
        storage: ['Store refrigerated (2–8°C). Do not freeze.'],
      },
    },
  ],
};

// Convenience: look up a product by slug (used by the detail route).
export const getProduct = (slug: string): Product | undefined =>
  products.items.find((p) => p.slug === slug);

/* ─────────────────────────────────────────────────────────────────────────────
 *  COMMERCE SURFACES — header, ticker, shop taxonomy, merchandising rails
 * ─────────────────────────────────────────────────────────────────────────── */

/** Scrolling assurance strip pinned above the header. */
export const ticker = {
  items: [
    'Third-party tested by Janoshik Analytical',
    'Sealed & cold-stored before dispatch',
    'Full batch documentation with every order',
    'For research use only',
  ],
};

/**
 * "Why Peptiq" — six assurance cards flanking a centred image. The first three
 * render in the left column, the rest on the right.
 *
 * `mission` and `featured` are unused by the current layout; they are kept for
 * the single-panel treatment that reads heading + mission on the left and the
 * three featured titles on the right.
 */
export const assurances = {
  label: 'Why Peptiq',
  /** Rendered as `title` + `titleAccent`, the accent in brand purple. */
  title: 'Why Researchers Choose',
  titleAccent: 'Peptiq.',
  subtitle: 'Trusted by scientists. Backed by quality. Designed for real research.',
  // Transparent 1:1 cut-out; the folder name contains spaces, so it is URL-encoded.
  // Background removed from "why us new22.png" (Magnific) so it floats on the band.
  image: '/new%20images/why%20us%20new22-cutout.png',
  imageAlt: 'Laboratory scientist holding a research pen and its carton',
  cta: { label: 'Browse the range', href: '/shop' },
  note: 'Janoshik-verified per batch · documentation with every order',
  /** Footer line of the panel's left column. */
  mission:
    'We believe every lab deserves research peptides it can actually verify — independently tested, fully documented, and supplied strictly for research use.',
  /** The three items (by title) shown in the panel's right column. */
  featured: ['Verified sourcing', 'Lab-tested purity', 'Documentation included'],
  items: [
    {
      title: 'Verified sourcing',
      body: 'Direct contracts with certified manufacturers. No grey-market resellers in the chain.',
    },
    {
      title: 'Lab-tested purity',
      body: 'Every batch independently assayed by Janoshik Analytical before it is listed.',
    },
    {
      title: 'Pre-filled research pens',
      body: 'Fixed-volume sealed format — no reconstitution or measuring at the bench.',
    },
    {
      title: 'Sealed cold packaging',
      body: 'Cold-stored, tamper-sealed and accurately labelled before it leaves the shelf.',
    },
    {
      title: 'Documentation included',
      body: 'The batch-specific certificate of analysis ships with every order, no request needed.',
    },
    {
      title: 'Batch traceability',
      body: 'Every pen carries a batch number that matches its published Janoshik report.',
    },
  ],
};

export type ShopLine = {
  key: ProductCategory | 'blend';
  label: string;
  blurb: string;
  /**
   * Optional, and the opt-in for a PHOTOGRAPHIC tile — set it and `LineRail`
   * renders the shot behind the label; omit it and the tile stays a plain
   * lavender gradient. Only lines with a shot worth the space should set it.
   */
  image?: string;
  /** Deep link into the shop with the matching filter pre-applied. */
  href: string;
};

/**
 * Category rail — "Shop by line". Keys match `Product.category`, plus blends.
 * Tile images are read from a representative product, so they always match
 * the photo on that product's card.
 */
export const lines: { label: string; title: string; cta: string; items: ShopLine[] } = {
  label: 'SHOP BY LINE',
  title: 'Every line on the bench.',
  cta: 'View all',
  items: [
    {
      key: 'metabolic',
      label: 'Metabolic',
      blurb: 'Incretin receptor agonists for metabolic pathway research.',
      image: getProduct('retatrutide-20mg')?.image,
      href: '/shop?category=metabolic',
    },
    {
      key: 'recovery',
      label: 'Recovery',
      blurb: 'Repair and regeneration compounds for tissue-model work.',
      image: getProduct('tesamorelin-20mg')?.image,
      href: '/shop?category=recovery',
    },
    {
      key: 'aesthetic',
      label: 'Skin & Hair',
      blurb: 'Copper peptide and blend formulations for dermal research.',
      image: getProduct('glow-70mg')?.image,
      href: '/shop?category=aesthetic',
    },
    {
      key: 'longevity',
      label: 'Longevity',
      blurb: 'Cofactor compounds for cellular-metabolism studies.',
      image: getProduct('mots-c-40mg')?.image,
      href: '/shop?category=longevity',
    },
    {
      key: 'blend',
      label: 'Blends',
      blurb: 'Multi-compound pens supplied as a single sealed unit.',
      image: getProduct('bpc-157-tb-500-40mg')?.image,
      href: '/shop?format=blend',
    },
  ],
};

/**
 * Merchandising rails. Both are explicit editorial slug lists rather than
 * computed ordering, so the homepage never silently reshuffles when a product
 * is added.
 */
export const merch = {
  bestsellers: {
    label: 'LOVED BY THE BENCH',
    title: 'Bestsellers',
    cta: 'Shop all',
    ctaHref: '/shop?sort=bestsellers',
    slugs: [
      'bpc-157-tb-500-40mg',
      'retatrutide-20mg',
      'tirzepatide-40mg',
      'glow-70mg',
      'retatrutide-40mg',
      'nad-1000mg',
    ],
  },
  newArrivals: {
    label: 'JUST LANDED',
    title: 'New arrivals',
    subtitle:
      'The latest additions to the range — new batches, new concentrations, every one independently verified.',
    cta: 'Shop all',
    ctaHref: '/shop?sort=new',
    slugs: ['retatrutide-40mg', 'glow-70mg', 'nad-1000mg'],
  },
};

/**
 * Product spotlight under the hero — an auto-advancing slider. Each slide's
 * price is read from the live product by `slug`, so only the editorial copy
 * lives here. No star rating — see `Product.rating`.
 *
 * Every `image` must be a transparent square cut-out: it floats directly on the
 * section colour with no panel behind it.
 */
export const spotlight = {
  /** Milliseconds each slide stays up before advancing. */
  interval: 6000,
  proof: 'Independently verified batch',
  supplyNote: 'Research Supply Programme · 3 monthly deliveries',
  footnote: 'Cold-chain dispatch · Certificate of analysis with every order',
  slides: [
    // First entry is the slide shown on load.
    {
      slug: 'mots-c-40mg',
      badge: 'New arrival',
      title: 'MOTS-C',
      kicker: 'the mitochondrial peptide.',
      image: '/new%20images/new%20arrival/Alluvi%20MOTS-C%20carton%20and%20pen%2C%20amethyst%20splash-4.png',
      chips: ['40mg', '4 × 10mg pen', 'Janoshik tested'],
      cta: 'Shop MOTS-C',
    },
    {
      slug: 'tesamorelin-20mg',
      badge: 'New arrival',
      title: 'Tesamorelin',
      kicker: 'the GHRH analogue.',
      image: '/new%20images/new%20arrival/Alluvi%20Tesamorelin%20Duo%2C%20Ruby%20Splash-7.png',
      chips: ['20mg', '10 × 2mg pen', 'Janoshik tested'],
      cta: 'Shop Tesamorelin',
    },
  ],
};

/** Full-screen site menu opened from the header's MENU button. */
export const menu = {
  closeLabel: 'Close',
  columns: [
    {
      title: 'Shop by line',
      links: lines.items.map((l) => ({ label: l.label, href: l.href })),
    },
    {
      title: 'Laboratory',
      links: [
        { label: 'Lab reports', href: '/shop' },
        { label: 'How we verify', href: '/#process' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    {
      title: 'Client care',
      links: [
        { label: 'Account', href: '/login' },
        { label: 'Wishlist', href: '/wishlist' },
        { label: 'Track order', href: '/track-order' },
        { label: 'Cart', href: '/cart' },
      ],
    },
  ],
  featured: {
    label: 'NEW BATCH',
    slug: merch.newArrivals.slugs[0],
    meta: 'Janoshik verified',
  },
};

/** Resolve a merchandising slug list to products, dropping any stale slugs. */
export const getProducts = (slugs: string[]): Product[] =>
  slugs.map(getProduct).filter((p): p is Product => Boolean(p));

/* ── Recurring supply programme ──────────────────────────────────────────── */

/** Percentage saved on each delivery when a line is enrolled. */
export const SUPPLY_DISCOUNT = 0.15;

/** Deliveries in one enrolment term. */
export const SUPPLY_DELIVERIES = 3;

export const supply = {
  label: 'RECURRING SUPPLY',
  name: 'Research Supply Programme',
  /** Short form used on product cards: "Save $15 with Supply". */
  shortName: 'Supply',
  title: 'Subscribe to the Research Supply Programme.',
  /** Homepage banner copy (SupplyProgramme). */
  bannerTitle: 'Subscribe & save on your research supply',
  tagline: 'Because consistent research starts with a consistent supply.',
  // Still life with ALLUVI-branded cartons and pens, product on the right.
  // Product sits on the right of the frame; the folder name contains a space.
  image: '/new%20images/sub.png',
  body: 'Your bench supply, delivered with each verified batch. Choose any line, receive it monthly for three deliveries, and save 15% on every one — with complimentary cold-chain shipping on everything else in your order.',
  primaryCta: { label: 'How it works', href: '#supply' },
  secondaryCta: { label: 'Choose a line', href: '/shop' },
  benefits: [
    {
      index: '01',
      title: '15% off every delivery',
      body: 'Enrol any line for three monthly deliveries and save on each one.',
    },
    {
      index: '02',
      title: 'Complimentary cold-chain',
      body: 'Insulated shipping on every order containing a Supply enrolment, no minimum spend.',
    },
    {
      index: '03',
      title: 'Priority batch allocation',
      body: 'Members are allocated from each verified batch before it is listed publicly.',
    },
    {
      index: '04',
      title: 'Reports on dispatch',
      body: 'The batch-specific certificate of analysis is emailed the moment your order ships.',
    },
  ],
};

/** Per-delivery price and saving for an enrolled line. */
export const supplyPricing = (price: number) => {
  const saving = Math.round(price * SUPPLY_DISCOUNT * 100) / 100;
  return { saving, perDelivery: Math.round((price - saving) * 100) / 100 };
};

/* ── Preparation process ─────────────────────────────────────────────────── */

export const process = {
  label: 'THREE DELIBERATE STEPS',
  eyebrow: 'Three deliberate steps',
  title: 'How each pen is prepared.',
  subtitle:
    'Three deliberate steps between the lab bench and the sealed pen — so nothing about the product is left to chance.',
  cta: { label: 'Browse verified batches', href: '/shop' },
  // AI-generated (Magnific): scientist at an HPLC screen, subject on the right.
  image: '/images/process-lab-dusk.jpg',
  imageAlt: 'Scientist reviewing a chromatography result beside HPLC instruments',
  /** Small chip on the photo. */
  status: 'Every batch assayed by Janoshik',
  steps: [
    {
      index: 'Step 01',
      title: 'Source',
      body: 'Direct contracts with certified manufacturers. No grey-market resellers in the chain.',
      image: '/images/purification-seo.webp',
    },
    {
      index: 'Step 02',
      title: 'Verify',
      body: 'Independent purity and concentration checks on every batch before it touches an order.',
      image: '/images/api-seo.webp',
    },
    {
      index: 'Step 03',
      title: 'Seal',
      body: 'Cold-stored and tamper-sealed, with accurate labelling on every pen before it leaves the shelf.',
      image: '/images/cold-chain-seo.webp',
    },
  ],
};

/* ── Shop controls ───────────────────────────────────────────────────────── */

export const shopControls = {
  categories: [
    { value: 'all', label: 'All' },
    { value: 'metabolic', label: 'Metabolic' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'aesthetic', label: 'Skin & Hair' },
    { value: 'longevity', label: 'Longevity' },
  ],
  sorts: [
    { value: 'featured', label: 'Featured' },
    { value: 'bestsellers', label: 'Bestsellers' },
    { value: 'new', label: 'New in' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
  ],
  formats: [
    { value: 'single', label: 'Single compound' },
    { value: 'blend', label: 'Blend' },
  ],
  searchPlaceholder: 'Search compounds, strengths or blends…',
};

export const services = {
  index: '04',
  label: 'SERVICES',
  title: 'End-to-end infrastructure for R&D supply',
  body:
    'From in-house API synthesis to independent third-party verification, Peptiq provides research-only peptide compounds with full traceability, published documentation, and dedicated research-programme support.',
  items: [
    {
      title: 'Independent Lab Testing',
      desc:
        'Every batch is independently verified by Janoshik Analytical. Random pens are pulled from production runs, sealed, and submitted for blind third-party analysis. Certificates of Analysis are published per batch — purity, concentration, and verified content.',
      image: '/images/independent-lab-test.webp',
    },
    {
      title: 'Batch Documentation',
      desc:
        'Every research unit is issued with a full per-batch record: Janoshik certificate of analysis, purity assay, verified compound content, chain-of-custody log, and tamper-evident batch coding — archived and available on request for every research programme.',
      image: '/images/cold-chain-seo.webp',
    },
    {
      title: 'Wholesale & Supply',
      desc:
        'Three tiered wholesale programmes — 50–100, 100–1,000, and 1,000+ research pens — with volume pricing, scheduled fulfilment, and dedicated support. Consistent stock, clear pricing, and full batch documentation for every research programme.',
      image: '/images/wholesale-seo.webp',
    },
  ],
};

export const innovation = {
  index: '05',
  label: 'WHY PEPTIQ',
  title: 'The standards that set Peptiq apart',
  body:
    'Not opaque supply behind closed doors, but a transparent R&D operation built around in-house API manufacturing, independent verification, and proven long-term stability. Here is what separates Peptiq from ordinary peptide suppliers.',
  milestones: [
    {
      year: '01',
      title: 'In-House API Manufacturing',
      desc:
        'Core peptide APIs synthesised in-house under ISO 9001:2015 clean-room standards. Quality controlled at every step, with full batch validation and chain-of-custody logs.',
    },
    {
      year: '02',
      title: 'Janoshik Third-Party Verification',
      desc:
        'Peptiq randomly selects research pens from production batches and submits them to Janoshik — a globally recognised laboratory — for fully independent purity and content analysis.',
    },
    {
      year: '03',
      title: '56-Day Room-Temperature Stability',
      desc:
        'A 40mg Retatrutide Peptiq research pen held at room temperature for 56 days retained 98.32% purity and lost just 0.07% of verified content. Independently re-tested by Janoshik at each checkpoint.',
    },
    {
      year: '04',
      title: 'Full Batch Documentation',
      desc:
        'Every research unit carries a per-batch Janoshik certificate of analysis, purity assay, verified compound content, and tamper-evident batch coding — archived and traceable for every research programme.',
    },
    {
      year: '05',
      title: 'Direct, No Social Media',
      desc:
        'Peptiq operates exclusively through peptiq.bz and peptiq.store. We have no presence on TikTok, Instagram, WhatsApp, or Facebook — any seller claiming otherwise is unauthorised.',
    },
  ],
};

export const gallery = {
  label: 'INSIDE PEPTIQ LABS',
  title: 'Where precision meets process',
  intro:
    'Five controlled stages take every compound from synthesis to a sealed, traceable research unit — each one documented, independently verified, and archived per batch.',
  items: [
    {
      tag: 'STAGE 01',
      title: 'API Synthesis',
      caption:
        'Compounds produced in-house under ISO 9001:2015 in a controlled clean-room environment.',
      image: '/images/api-seo.webp',
    },
    {
      tag: 'STAGE 02',
      title: 'Purification',
      caption:
        'Chromatographic purification and assay — every batch reaches 99%+ before it advances.',
      image: '/images/purification-seo.webp',
    },
    {
      tag: 'STAGE 03',
      title: 'Independent QC',
      caption:
        'Random research pens are pulled and submitted blind to Janoshik Analytical for third-party verification.',
      image: '/images/independen-seo.webp',
    },
    {
      tag: 'STAGE 04',
      title: 'Sterile Filling',
      caption:
        'Tamper-evident, batch-coded filling of pre-filled research pens for fully traceable supply.',
      image: '/images/filling.webp',
    },
    {
      tag: 'STAGE 05',
      title: 'Batch Archival',
      caption:
        'Every unit is sealed, labelled with a batch code, and archived alongside its Janoshik certificate of analysis.',
      image: '/images/cold-chain-seo.webp',
    },
  ],
};

/** Philosophy banner (Philosophy.tsx). */
export const philosophy = {
  title: 'A new standard for research peptides: verified and documented',
  body: [
    'Peptiq is about research you can trust — independently tested compounds, sealed pre-filled pens, and documentation that ships with every order.',
    'We believe research supply should support the work, not complicate it — pairing rigorous third-party testing with a clean, traceable format.',
  ],
  cta: { label: 'More about Peptiq', href: '/about' },
  // Transparent cut-out; the folder name contains a space, so it is URL-encoded.
  image: '/new%20images/tessa-without%20bg.png',
  imageAlt: 'Tesamorelin 20mg carton and research pen',
};

/**
 * Featured review band (FeaturedReview.tsx): a big headline, two product
 * thumbnails, a lab photo, and one quote pulled from `news.items` by index so
 * the words are never duplicated here.
 */
export const featuredReview = {
  title: 'Purity that keeps up with your research',
  /** Product slugs for the two small thumbnails. */
  thumbs: ['retatrutide-40mg', 'mots-c-40mg'],
  // AI-generated (Magnific): researcher inspecting an unbranded white pen.
  photo: '/images/featured-review-lab.jpg',
  photoAlt: 'Researcher inspecting a sealed research pen at the lab bench',
  /** Which `news.items` entry to feature. */
  reviewIndex: 1,
};

export const news = {
  index: '06',
  label: 'TESTIMONIALS',
  title: 'The quality our research community relies on',
  body:
    'Verified reviews from research customers — focused on packaging quality, batch documentation, presentation, order accuracy, and support responsiveness. Every review is from a confirmed order.',
  // Aggregate trust signal shown beside the heading.
  rating: { score: '4.9', outOf: '5', count: '2,400+ verified reviews' },
  items: [
    {
      quote:
        'Presentation was faultless — sealed research pen with the Janoshik COA inside the box, batch numbers matched, tamper-evident seal intact. Exactly what a research kit should be.',
      name: 'Daniel K.',
      role: 'Verified buyer',
      org: 'United Kingdom',
      rating: 5,
      tag: 'Verified purchase',
      avatar: '/images/review2-seo.webp',
    },
    {
      quote:
        'Consistent presentation from batch to batch — tamper-evident seal, matching COA, and traceable batch numbers. Documentation quality is what keeps me ordering from Peptiq for the lab.',
      name: 'Sophie R.',
      role: 'Repeat customer',
      org: 'Research lab',
      rating: 5,
      tag: 'Repeat customer',
      avatar: '/images/review1-seo.webp',
    },
    {
      quote:
        'Support replied within the hour and resolved my order query with zero hassle. Clear paperwork, tamper-evident packaging, and batch documentation exactly matched the COA reference.',
      name: 'Marcus T.',
      role: 'Verified buyer',
      org: 'Research customer',
      rating: 5,
      tag: 'Verified purchase',
      avatar: '/images/review4-seo.webp',
    },
    {
      quote:
        'Presentation and documentation are excellent. Full batch COA, clear per-compound content, and fair pricing for this level of paperwork. Already reordered the BPC-157 & TB-500 for the archive.',
      name: 'Priya N.',
      role: 'Research customer',
      org: 'United Kingdom',
      rating: 5,
      tag: 'Verified purchase',
      avatar: '/images/review3-seo.webp',
    },
  ],
};

/**
 * Video review reel — portrait clips from verified buyers, shown as a rail.
 *
 * ── On `video` being optional ──────────────────────────────────────────────
 * `poster` is required and is what actually renders. `video` is optional, and
 * the play control appears ONLY on items that have one. That is deliberate: a
 * play button on a card with nothing behind it is a broken promise, so until
 * real clips exist the section degrades honestly into a photo wall.
 *
 * Only one clip ships with the repo today, so only the first item carries a
 * `video`. To add the rest: drop the files in `public/videos/` and point each
 * item's `video` at one — no component changes needed.
 *
 * The people and photographs are the same verified buyers as `news.items`;
 * `meta` is their real role from that list, not an invented order date.
 */
export const reviewReel = {
  pill: '2,400+ verified reviews',
  title: 'Real labs. Real batches.',
  subtitle: 'What our research customers say about the paperwork.',
  // Clips live in public/new images/videos/ — the folder names contain spaces
  // (and some filenames brackets), so every path is URL-encoded.
  items: [
    {
      name: 'Daniel K.',
      meta: 'Verified buyer',
      poster: '/images/review2-seo.webp',
      video: '/new%20images/videos/bedroom_window_stretch_213-video%20(2).mp4',
    },
    {
      name: 'Sophie R.',
      meta: 'Repeat customer',
      poster: '/images/review1-seo.webp',
      video: '/new%20images/videos/calisthenics_bars_park_217-video.mp4',
    },
    {
      name: 'Marcus T.',
      meta: 'Verified buyer',
      poster: '/images/review4-seo.webp',
      video: '/new%20images/videos/foam_roll_lounge_215-video%20(1).mp4',
    },
    {
      name: 'Priya N.',
      meta: 'Research customer',
      poster: '/images/review3-seo.webp',
      video: '/new%20images/videos/terrace_cafe_afternoon_229-video.mp4',
    },
  ] as { name: string; meta: string; poster: string; video?: string }[],
};

export const contact = {
  index: '07',
  label: 'CONTACT US',
  title: 'Talk to our research team',
  body:
    'Tell us about your laboratory programme — research compounds, volumes, and documentation requirements. Our team responds to enquiries within one working day.',
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'organisation', label: 'Laboratory / Organisation', type: 'text', required: true },
    { name: 'phone', label: 'Mobile Phone Number', type: 'tel', required: false },
  ],
  message: { name: 'message', label: 'How can we help with your R&D programme?' },
  submit: 'Send enquiry',

  /* ── Sign-up layout (Contact.tsx) ───────────────────────────────────────── */
  statement:
    'Advancing laboratory research with independently verified peptides — tested, documented and supplied for controlled R&D.',
  emailPlaceholder: 'Enter your email',
  join: 'Join',
  joinSuccess: 'You’re on the list — watch your inbox for the next batch drop.',
  direct: 'Prefer to talk to the research team?',
  // AI-generated portrait (Magnific), background removed. No third-party branding.
  image: '/images/contact-scientist.png',
  imageAlt: 'Laboratory scientist holding a tablet',
};

export const resources = {
  title: 'Useful research documents to download',
  body:
    'Janoshik certificates of analysis, stability reports, and supply documentation. A space designed to give your laboratory everything it needs.',
  items: [
    { title: 'Janoshik Analytical Report — Retatrutide 40mg', meta: 'PDF · 1.4 MB', href: '#' },
    { title: 'Room-Temperature Stability Study (56-Day)', meta: 'PDF · 2.1 MB', href: '#' },
    { title: 'Batch Documentation & COA Archive', meta: 'ZIP · 8 MB', href: '#' },
  ],
};

export const footer = {
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '/about' },
        { label: 'Why Peptiq', href: '/#assurances' },
        { label: 'Quality protocol', href: '/#process' },
        { label: 'Testimonials', href: '/#news' },
      ],
    },
    {
      title: 'Research peptides',
      links: [
        { label: 'Retatrutide 40mg', href: '/products/retatrutide-40mg' },
        { label: 'Tirzepatide 40mg', href: '/products/tirzepatide-40mg' },
        { label: 'BPC-157 & TB-500 40mg', href: '/products/bpc-157-tb-500-40mg' },
        { label: 'Glow 70mg', href: '/products/glow-70mg' },
        { label: 'NAD+ 1,000mg', href: '/products/nad-1000mg' },
        { label: 'Browse all', href: '/shop' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign in', href: '/login' },
        { label: 'Create account', href: '/register' },
        { label: 'Cart', href: '/cart' },
        { label: 'Track order', href: '/track-order' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact', href: '/#contact' },
        { label: 'Verify a batch', href: '/#process' },
        { label: 'For laboratories', href: '/#contact' },
      ],
    },
  ],
  legal: [
    { label: 'Press Release', href: '/policies/press-release' },
    { label: 'Privacy Policy', href: '/policies/privacy-policy' },
    { label: 'Refund Policy', href: '/policies/refund-policy' },
    { label: 'Shipping Policy', href: '/policies/shipping-policy' },
    { label: 'Terms of Service', href: '/policies/terms-of-service' },
  ],
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LEGAL / POLICY PAGES
 * ─────────────────────────────────────────────────────────────────────────────
 *  Plain-language boilerplate tailored to a research-use-only peptide supplier.
 *  Review with qualified legal counsel before relying on this in production.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export type PolicySection = { heading: string; body: string[] };
export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: PolicySection[];
};

export const policies: { items: Policy[] } = {
  items: [
    {
      slug: 'press-release',
      title: 'Press Release',
      summary:
        'An official public statement from Peptiq on our research focus, distribution channels, and commitment to consumer safety.',
      updated: '31 July 2026',
      sections: [
        {
          heading: 'Official public statement',
          body: [
            `${brand.name} is a research and development supplier of laboratory-grade peptide compounds. This statement sets out, in plain terms, how we operate, how we distribute our products, and how researchers can verify that they are dealing with the genuine ${brand.name}.`,
          ],
        },
        {
          heading: 'No social-media sales or promotion',
          body: [
            `${brand.name} operates exclusively through its official website. We do not sell, promote, or take payments through TikTok, Instagram, Facebook, WhatsApp, Telegram, or any other social platform.`,
            `Any account, page, or individual claiming to represent ${brand.name} on social media is unauthorised and is not affiliated with us. Please do not make payments to, or share personal details with, anyone contacting you through social media in our name — report it and verify any communication directly through ${brand.email}.`,
          ],
        },
        {
          heading: 'Research-use focus',
          body: [
            'Every compound we supply is manufactured and sold strictly for laboratory research and development. Our products are not medicines, are not intended for human or veterinary use, and carry no therapeutic claims. This distinguishes research-only suppliers from the marketing and sale of medicinal products.',
          ],
        },
        {
          heading: 'Independent verification',
          body: [
            'We do not ask researchers to take purity or content on trust. Research pens are randomly pulled from every production batch and sent for independent, third-party analysis by Janoshik Analytical. Certificates of analysis are published per batch and can be verified against the batch code on your packaging.',
          ],
        },
        {
          heading: 'Consumer safety',
          body: [
            'We strongly advise against purchasing injectable research materials through social media, unverified resellers, or marketplaces outside our official domain. Counterfeit or mislabelled products sold under our name harm researchers and the broader research community, and we actively monitor and report misuse of our branding.',
          ],
        },
        {
          heading: 'Contact us',
          body: [`For any press or media enquiries, please contact: ${brand.email}`],
        },
      ],
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      summary:
        'How Peptiq collects, uses, stores and protects the personal data of researchers and account holders.',
      updated: '31 July 2026',
      sections: [
        {
          heading: 'Introduction',
          body: [
            `This Privacy Policy explains how ${brand.name} ("we", "us", "our") collects, uses, and protects your personal information when you visit our website or place an order.`,
            'We are committed to safeguarding your privacy and to handling your data fairly, transparently, and securely.',
          ],
        },
        {
          heading: 'Data we collect',
          body: [
            'We collect the details you provide when you create an account or place an order — including your name, email address, contact and delivery address, and order history.',
            'We also collect limited technical data (such as device, browser, and IP information) needed to operate the site securely. Your cart and session are stored locally in your browser.',
          ],
        },
        {
          heading: 'How we use your data',
          body: [
            'Your data is used solely to process and fulfil orders, provide customer support and order updates, verify eligibility for research-use-only supply, respond to enquiries, improve website functionality, and meet our legal and record-keeping obligations.',
            'We do not sell or rent your personal data to third parties.',
          ],
        },
        {
          heading: 'Third-party sharing',
          body: [
            'We only share data with trusted third-party providers who help us operate the business — such as payment processors, couriers and logistics providers, and website or IT service platforms. Every third party is required to process your data securely and only as instructed by us.',
          ],
        },
        {
          heading: 'Data security',
          body: [
            'We implement appropriate technical and organisational measures to protect your personal information, including encrypted connections, restricted access to data by authorised staff only, and regular reviews of our security practices.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            `You have the right to access the personal data we hold on you, request corrections to inaccurate information, request deletion of your data where appropriate, object to certain processing activities, and withdraw consent at any time. To exercise any of these rights, contact us at ${brand.email}.`,
          ],
        },
        {
          heading: 'Cookies',
          body: [
            'We use cookies to keep you signed in, remember your cart, and understand how the site is used. You can manage or disable cookies in your browser settings at any time.',
          ],
        },
        {
          heading: 'Data retention',
          body: [
            'We retain your data only for as long as necessary to fulfil the purposes outlined in this policy, including legal, accounting, or regulatory record-keeping obligations.',
          ],
        },
        {
          heading: 'Policy updates',
          body: [
            'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a new "last updated" date.',
          ],
        },
      ],
    },
    {
      slug: 'refund-policy',
      title: 'Refund Policy',
      summary:
        'The conditions under which returns, replacements and refunds are offered on Peptiq research compounds.',
      updated: '31 July 2026',
      sections: [
        {
          heading: 'Research-use products',
          body: [
            `All items sold by ${brand.name}, including research pens and formulations, are intended strictly for laboratory research and development. They are not intended for human consumption, diagnosis, or treatment. By purchasing, you agree to these terms.`,
          ],
        },
        {
          heading: 'Returns eligibility',
          body: [
            'Due to the sensitive nature of our products and to maintain quality assurance, we do not accept returns on opened or used items. Only unopened, unused items in their original, seal-intact condition may be considered for return.',
          ],
        },
        {
          heading: 'Return window',
          body: [
            'You may request a return within 7 days of delivery. If more than 7 days have passed since your order was received, we are unfortunately unable to offer a refund or exchange.',
          ],
        },
        {
          heading: 'Non-returnable items',
          body: [
            'We are unable to accept returns for: opened or used items; products not stored correctly (for example, not kept refrigerated); items not in their original packaging; and returns requested more than 7 days after delivery.',
          ],
        },
        {
          heading: 'Reporting a damaged or incorrect order',
          body: [
            `If your order arrives damaged, incomplete, or is not what you ordered, contact us within 48 hours of delivery at ${brand.email} with your order number, a description of the issue, and supporting photographs.`,
          ],
        },
        {
          heading: 'Return approval',
          body: [
            'Once we receive your request, we will assess it and notify you of the outcome. If approved, we will issue return instructions. Return postage is the customer’s responsibility unless the error was ours.',
          ],
        },
        {
          heading: 'Refund processing',
          body: [
            'Approved refunds are returned to your original payment method within 5–10 business days of confirmation.',
          ],
        },
        {
          heading: 'Delayed refunds',
          body: [
            `If you have not received your refund after 10 business days, please first check with your bank, then contact us at ${brand.email} for assistance.`,
          ],
        },
      ],
    },
    {
      slug: 'shipping-policy',
      title: 'Shipping Policy',
      summary:
        'How Peptiq orders are processed, dispatched, tracked, and delivered.',
      updated: '31 July 2026',
      sections: [
        {
          heading: 'Dispatch time',
          body: [
            'Orders placed and paid for before 3pm (UK time) on working days are typically dispatched the same day. Orders received after 3pm, or on weekends and public holidays, are dispatched the next working day.',
          ],
        },
        {
          heading: 'Shipping carriers',
          body: [
            'We use tracked and signed-for courier services depending on destination, weight, and service availability. Once your order has shipped, you will receive tracking information by email.',
          ],
        },
        {
          heading: 'Delivery times',
          body: [
            'UK orders are typically delivered the next working day after dispatch. International orders vary by location and customs handling, but usually arrive within 3–10 working days.',
          ],
        },
        {
          heading: 'Shipping fees',
          body: [
            'Shipping costs are calculated based on your location and parcel weight, and shown at checkout before you pay. We occasionally run free-shipping promotions.',
          ],
        },
        {
          heading: 'Order tracking',
          body: [
            'All shipments include tracking. You will receive a tracking number by email once your parcel leaves our fulfilment centre — you can also look up your order at any time on our Track Order page.',
          ],
        },
        {
          heading: 'Failed delivery attempts',
          body: [
            'If no one is available to accept the parcel, the courier may leave a card or attempt redelivery. Please follow up with the courier directly using your tracking number.',
          ],
        },
        {
          heading: 'Customs & import duties',
          body: [
            'International buyers are responsible for any applicable customs duties, VAT, or import taxes. These charges are not included in our product or shipping prices.',
          ],
        },
        {
          heading: 'Delivery issues',
          body: [
            `If your parcel is delayed, lost, or arrives damaged, please contact us at ${brand.email} within 72 hours of the expected delivery date, including your order number and tracking details.`,
          ],
        },
        {
          heading: 'Address accuracy',
          body: [
            'Please ensure your delivery details are entered correctly at checkout. We cannot be held responsible for delivery issues resulting from incorrect or incomplete address information.',
          ],
        },
      ],
    },
    {
      slug: 'terms-of-service',
      title: 'Terms of Service',
      summary:
        'The terms governing use of the Peptiq website and the purchase of research-use-only compounds.',
      updated: '31 July 2026',
      sections: [
        {
          heading: 'General',
          body: [
            `You are using the official website of ${brand.name} ("we", "us", "our"). By using this site, you agree to comply with these Terms. If you do not agree with any part of them, please do not use our website or services.`,
            'We may update these Terms from time to time. Continued use of the website constitutes acceptance of the current Terms.',
          ],
        },
        {
          heading: 'Age requirement',
          body: [
            'By accessing this site, you confirm that you are at least 18 years old and legally able to enter into contracts. Our products and services are intended only for individuals who meet this requirement.',
          ],
        },
        {
          heading: 'Research use only',
          body: [
            `All products supplied by ${brand.name} are intended strictly for laboratory research and development. They are not for human or veterinary consumption, and must not be administered to humans or animals, nor used to diagnose, treat, cure, or prevent any disease.`,
            'By placing an order you confirm that you are a qualified researcher or organisation and that the products will be handled in accordance with applicable laws and safety standards.',
          ],
        },
        {
          heading: 'Orders & payment',
          body: [
            'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Payment must be made in full, using one of the payment methods offered at checkout, before an order is dispatched.',
          ],
        },
        {
          heading: 'Dispatch & delivery',
          body: [
            'We aim to dispatch orders promptly in line with our Shipping Policy. Delivery timelines are estimates, not guarantees, and we are not liable for delays caused by couriers or other factors outside our control.',
          ],
        },
        {
          heading: 'Refunds & returns',
          body: [
            'Due to the nature of our products, returns are accepted only for items that are unopened, unused, and in their original condition. Opened or tampered-with items are non-refundable. See our Refund Policy for full details.',
          ],
        },
        {
          heading: 'Eligibility',
          body: [
            'You must be of legal age in your jurisdiction and provide accurate account information. We reserve the right to refuse or cancel any order that does not meet our research-use eligibility criteria.',
          ],
        },
        {
          heading: 'Disclaimer',
          body: [
            `All products are sold solely for laboratory research and development. ${brand.name} does not accept or condone misuse, including but not limited to human consumption, veterinary use, or resale.`,
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            `${brand.name} is not liable for any misuse of its products, or for outcomes arising from handling that falls outside documented laboratory research practice. By using this site, you agree to indemnify and hold harmless ${brand.name} and its affiliates from claims, damages, or liabilities arising from product use or misuse. Nothing in these Terms limits liability that cannot be excluded by law.`,
          ],
        },
        {
          heading: 'Account responsibility',
          body: [
            'If you create an account on our website, you are responsible for maintaining the confidentiality of your log-in credentials. All activity conducted under your account is your responsibility.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            `All trademarks, logos, and content displayed on our website are owned or licensed by ${brand.name}. You may not reproduce, distribute, or commercially exploit any content without our prior written consent.`,
          ],
        },
        {
          heading: 'Governing law',
          body: [
            'These Terms are governed by and construed in accordance with the laws of England and Wales, without regard to conflict-of-law principles. Any disputes arising will be subject to the exclusive jurisdiction of the courts of England and Wales.',
          ],
        },
      ],
    },
  ],
};

export const getPolicy = (slug: string): Policy | undefined =>
  policies.items.find((p) => p.slug === slug);
