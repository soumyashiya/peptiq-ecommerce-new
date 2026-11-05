import { brand } from '@/lib/content';

/**
 * The single Peptiq lockup.
 *
 * The site used to carry two unrelated marks: a letterspaced `P E P T I Q` with
 * a `RESEARCH` subline in the header, and a purple hexagon chip beside a
 * two-tone `Pept<span>iq</span>` in the footer. Visitors who scrolled the page
 * saw two different companies.
 *
 * This is the header lockup, kept because the wide letterspacing and the
 * subline read as laboratory labelling rather than as an app logo — which is
 * the right register for a research supplier. Every placement uses it.
 *
 * The right-hand letterspace on each line is optically dead space, so both
 * lines carry a matching left pad to keep the block centred on its own axis.
 */
export function Wordmark({
  align = 'center',
  size = 'md',
  className = '',
}: {
  align?: 'center' | 'start';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const name = size === 'sm' ? 'text-[1.125rem] md:text-[1.25rem]' : 'text-[1.5rem] md:text-[1.75rem]';
  const sub = size === 'sm' ? 'text-[0.5625rem]' : 'text-[0.5625rem] md:text-[0.625rem]';

  return (
    <span
      className={`flex flex-col leading-none ${
        align === 'center' ? 'items-center' : 'items-start'
      } ${className}`}
    >
      <span className={`pl-[0.28em] font-bold uppercase tracking-[0.28em] ${name}`}>
        {brand.name}
      </span>
      <span className={`mt-1.5 pl-[0.38em] font-bold uppercase tracking-[0.38em] opacity-80 ${sub}`}>
        {brand.sub}
      </span>
    </span>
  );
}
