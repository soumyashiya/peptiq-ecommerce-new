import type { Config } from 'tailwindcss';

/**
 * Design tokens: read off hermujo.com's computed styles — black type and
 * lime accents on saturated lavender, rounded geometric type.
 *
 * Token NAMES are historical (`brand.sky`, `brand.teal`) and no longer describe
 * their hues — they describe their ROLE, which is what every component relies
 * on. Renaming them would touch ~130 call sites for no behavioural gain.
 *
 *   brand        primary action — safe as a background with `text-paper` AND as
 *                text on `paper` or the page, which is why it is black, not lime.
 *   brand.sky    secondary accent text / icons.
 *   brand.teal   strongest accent text — eyebrows, links, labels.
 *   brand.wash   the PAGE background, set once on `body`.
 *   brand.soft   lavender SURFACE (never text) — currently the same value as
 *                `wash`, as the reference uses one lavender throughout.
 *   brand.lime   high-visibility accent SURFACE only. Pair with `text-ink`;
 *                it fails contrast against white or `text-paper`.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        paper: '#FFFFFF',
        mist: '#FAF8F5', // warm off-white, also the mid-stop of the Process band
        line: '#BDAAE3',
        brand: {
          DEFAULT: '#000000', // primary action — white text passes
          sky: '#444444', // secondary accent text — 5.3:1 on the page
          teal: '#1A1A1A', // strongest accent text
          wash: '#D2BFFC', // page background
          soft: '#D2BFFC', // lavender surface
          lime: '#EFF860', // accent surface ONLY — pair with text-ink
        },
        muted: '#444444',
      },
      fontFamily: {
        // Loaded via next/font in app/layout.tsx and exposed as a CSS var.
        sans: ['var(--font-sans)', 'ui-rounded', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Heavy rounded headline face. `font-display` (family) is unrelated to
        // `text-display` (size) — Tailwind namespaces them separately.
        display: ['var(--font-display)', 'ui-rounded', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Figures ONLY — prices, percentages, batch codes, assay tables. These
        // have to align in columns and be compared digit by digit, which
        // Quicksand's proportional numerals can't do. Never for prose or
        // labels: a mono caption above every heading is a template tell.
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      /*
       * Tailwind's stock `tracking-tight` is -0.025em. The reference sets only
       * -0.5px at 52px and -1px at 79px on its headlines (≈ -0.01em), so the
       * default was roughly twice as tight as the look being matched. Overriding
       * the token rather than editing ~50 `tracking-tight` call sites keeps the
       * value in one place — change it here, not per component.
       */
      letterSpacing: {
        tight: '-0.01em',
        tighter: '-0.02em',
      },
      /*
       * ── Type scale ───────────────────────────────────────────────────────
       *
       * REFERENCE: hermujo.com, re-measured from live computed styles at
       * 1440 / 768 / 390 (not from its CSS source, and not estimated):
       *
       *   role            1440     768      390    lh     tracking  face
       *   hero            72px     46px     36px   1.05   0         Indarung 400
       *   section head    52px     34px     34px   1.05   -0.5px    Indarung 400
       *   faq/large head  56px     38px     32px   1.05   0         Indarung 400
       *   product display 79px     44px     44px   0.95   -1px      Indarung 400
       *   sub-head        18px     18px     18px   1.3    0         Quicksand 700
       *   card title      15px     15px     15px   1.3    0         Quicksand 700
       *   lead            18px     15px     14px   1.6    0         Quicksand 500
       *   body            14px     14px     13px   1.65   0         Quicksand 500
       *   card text       13px     13px     13px   1.5    0         Quicksand 500
       *   price           26px     26px     26px   1.15   0         Quicksand 700
       *   button          14px     14px     13px   1.15   1px       Quicksand 600
       *   eyebrow         11px     11px     11px   1.28   1.5px     Quicksand 700
       *
       * WHAT IS APPLIED BELOW — and where it deliberately departs.
       *
       * The reference's absolute sizes were already matched almost exactly by
       * the previous scale (hero 72, h1 56, h2 52, lead 18, body 14, label 11,
       * price 26 all landed on the reference). The brief asked for visibly
       * larger type with a 16–18px body, 24–32px sub-heads and a 64–88px hero,
       * which the reference's own 14px body cannot satisfy.
       *
       * So what is matched here is the reference's PROPORTIONS, re-based on a
       * 17px body instead of its 14px one — every ratio against body is
       * preserved, then capped to the brief's ranges where the two collide:
       *
       *   role      ref ratio   17px-based   applied   note
       *   hero      5.14x       87px         87px      brief 64–88
       *   h1        4.00x       68px         60px      capped, brief max 60
       *   h2        3.71x       63px         56px      capped, brief max 60
       *   sub-head  1.29x       22px         26px      RAISED, brief min 24
       *   lead      1.29x       22px         21px
       *   body      1.00x       17px         17px      brief 16–18
       *   price     1.86x       32px         26px      held at reference
       *   button    1.00x       17px         15px      brief nav/btn 13–15
       *   eyebrow   0.79x       13px         13px      brief 11–13
       *
       * Line-heights and tracking are taken from the reference VERBATIM —
       * 1.05 on every display heading, 1.3 on sub-heads, 1.6 on lead, 1.65 on
       * body, 1.15 on price and buttons. That tight 1.05 leading is the
       * reference's defining move: a two-line headline reads as one block of
       * colour rather than two sentences.
       *
       * Clamps interpolate 390 → 1440. To retune one: slope = (max − min)/1050,
       * intercept = min − slope × 390.
       *
       * Hierarchy is carried by weight (400 → 500 → 600 → 700 → 800) and by the
       * display face, never by thin text. Nothing is set below 400.
       */
      fontSize: {
        // Hero only. 44px → 87px.
        'display': [
          'clamp(2.75rem, 1.7518rem + 4.0952vw, 5.4375rem)',
          { lineHeight: '1.05', letterSpacing: '-0.005em' },
        ],
        /*
         * Primary section headings — the "main title" treatment.
         *
         * Taken from the reference's own `.mujo-ed__flavor-name` rule, which is
         * the largest and most characteristic type on hermujo:
         *
         *   font-size:      clamp(44px, 5.5vw, 80px)   <- used verbatim
         *   line-height:    .95                        <- used verbatim
         *   letter-spacing: -1px                       <- as -0.0125em, see below
         *   text-transform: none                       <- `uppercase` removed at call sites
         *   font-weight:    400                        <- NOT copied, see below
         *   white-space:    nowrap                     <- NOT copied, see below
         *
         * Tracking is set in em, not px. The reference's -1px is measured at its
         * 80px desktop size (-0.0125em); as a fixed px value it would be a
         * punishing -2.3% at the 44px mobile end. In em it holds the same
         * optical tightness at every size.
         *
         * WEIGHT: the reference is 400 because Indarung ships a single heavy
         * display weight — 400 *is* its bold. Baloo 2's 400 is a light text
         * weight, so copying the number would make headings thin rather than
         * matching them. 800 is Baloo 2's optical equivalent.
         *
         * NOWRAP is deliberately not copied: on the reference it wraps a short
         * product name ("Tropical Punch"). Peptiq's headings are sentences —
         * "The quality our research community relies on" at 79px on one line is
         * roughly 1700px wide and would force the whole page to scroll
         * sideways. Verified: with nowrap omitted, scrollWidth === clientWidth
         * at 320/390/768/1440.
         */
        'h1': [
          'clamp(2.75rem, 5.5vw, 5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.0125em' },
        ],
        // Secondary section headings — same treatment, one step down. 36→64px.
        'h2': [
          'clamp(2.25rem, 4.4vw, 4rem)',
          { lineHeight: '0.95', letterSpacing: '-0.0125em' },
        ],
        /*
         * One step under `h2`, for a heading that is a sentence rather than a
         * title. A 20-word statement set at the full h2 reads as shouting and
         * eats half the panel; at this size it still leads the block without
         * becoming the loudest thing on the page. 26px → 36px.
         */
        'h2-sm': [
          'clamp(1.625rem, 1.3929rem + 0.9524vw, 2.25rem)',
          { lineHeight: '1.12', letterSpacing: '-0.012em' },
        ],
        // Sub-heads, card titles and product names. 20px → 26px.
        'h3': [
          'clamp(1.25rem, 1.1107rem + 0.5714vw, 1.625rem)',
          { lineHeight: '1.3', letterSpacing: '-0.01em' },
        ],
        // Lead paragraph under a heading. 17px → 21px.
        'lead': [
          'clamp(1.0625rem, 0.9696rem + 0.381vw, 1.3125rem)',
          { lineHeight: '1.6' },
        ],
        // Body copy. 16px → 17px. Reference leading, verbatim.
        'body': [
          'clamp(1rem, 0.9768rem + 0.0952vw, 1.0625rem)',
          { lineHeight: '1.65' },
        ],
        // Eyebrows, badges and chips: heavy, tracked out, uppercase.
        // 1.5px of tracking at the reference's 11px is 0.136em; held here.
        'label': ['0.8125rem', { lineHeight: '1.28', letterSpacing: '0.13em' }],
        // Navigation, footer links and inline meta.
        'nav': ['0.9375rem', { lineHeight: '1.15' }],
        // Button text. The reference tracks its buttons 1px at 14px (0.071em).
        'btn': ['0.9375rem', { lineHeight: '1.15', letterSpacing: '0.07em' }],
        // Money. Set once so a price is the same object in a card, the cart,
        // the drawer and the order summary. 22px → 26px, the reference's size.
        'price': [
          'clamp(1.375rem, 1.2821rem + 0.381vw, 1.625rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ],
        // Captions, legal lines, form hints.
        'micro': ['0.8125rem', { lineHeight: '1.55' }],
        // Mono figures: inline data (batch codes, units) and the large numerals.
        'data': ['0.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'figure': ['clamp(2.5rem, 3.6vw, 3.75rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      maxWidth: {
        frame: '1600px',
        content: '1400px',
        /*
         * Reading measure, not a round number. At the new 17px body this is
         * ~70 characters — inside the 65–75ch band where the eye still tracks
         * from one line to the next without losing its place.
         *
         * It was 720px, which at 17px body would be ~85ch: raising the body
         * size without shortening the line would have made prose HARDER to
         * read, not easier.
         */
        prose: '40rem',
      },
      borderRadius: {
        // Tightened from 22/16px. At 22px every panel read as a soft bubble and
        // the product card — the one surface that should feel like an object —
        // looked the same as a text box. Controls still use `rounded-full`.
        card: '14px',
        panel: '10px',
      },
      spacing: {
        /*
         * Section rhythm. Read these DOUBLED: they are applied as `py-*`, so
         * the gap a reader actually sees between two neighbouring sections is
         * twice the token.
         *
         *                    390px        1440px      gap between sections
         *   section          52px         88px        104px → 176px
         *   section-sm       36px         60px        72px  → 120px
         *
         * Fluid rather than fixed because the fixed values were set for
         * desktop and were punishing on a phone — 84px of empty lavender above
         * and below every section meant scrolling past more void than content.
         * Density belongs inside a section, air belongs between them, and how
         * much air depends on how wide the viewport is.
         */
        section: 'clamp(3.25rem, 2.4125rem + 3.43vw, 5.5rem)',
        'section-sm': 'clamp(2.25rem, 1.6929rem + 2.286vw, 3.75rem)',
        group: '3.5rem', // 56px content-group spacing
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        // -50% is exactly one copy of the duplicated ticker list, so the loop
        // restarts on the same frame it ended — no visible seam.
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 38s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
