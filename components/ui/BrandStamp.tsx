import { brand } from '@/lib/content';

/**
 * The Peptiq brand stamp — a wordmark + hairline + section label, used above
 * the `PeptiqStandard` heading.
 *
 * It sets `brand.name` in the display face (Baloo 2 800, lowercase, tight)
 * rather than as a tracked-out caps eyebrow, so the section opens on the brand
 * itself. The label after the hairline names the part of the Peptiq system the
 * section covers, which is information the heading underneath does not repeat.
 *
 * ⚠️ This lockup does NOT currently match the header. `Wordmark.tsx` sets a
 * letterspaced `P E P T I Q` with a `RESEARCH` subline; this sets a solid
 * lowercase "peptiq". The two were matched while the header carried the
 * lowercase mark, and that header change has since been reverted — so the page
 * now shows two different treatments of the same name. Align one to the other
 * before publishing.
 *
 * `tone="light"` is for dark surfaces. Styling lives in `globals.css` under
 * `.brand-stamp` so both tones stay in one place.
 *
 * The whole lockup is read out as one phrase ("Peptiq — Quality protocol") and
 * the rule and dot are hidden from assistive tech, so it announces as a label
 * rather than as three loose fragments.
 */
export function BrandStamp({
  label,
  tone = 'dark',
  className = '',
}: {
  /** The section's name within the Peptiq system, e.g. 'Quality protocol'. */
  label: string;
  /** `dark` = ink on the page or a lavender band. `light` = paper on a photo. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <p
      className={`brand-stamp ${tone === 'light' ? 'brand-stamp--light' : ''} ${className}`}
      aria-label={`${brand.name} — ${label}`}
    >
      <span aria-hidden className="brand-stamp__dot" />
      <span aria-hidden className="brand-stamp__mark">
        {brand.name}
      </span>
      <span aria-hidden className="brand-stamp__rule" />
      <span aria-hidden className="brand-stamp__label">
        {label}
      </span>
    </p>
  );
}
