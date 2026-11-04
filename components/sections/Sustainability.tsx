'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sustainability as s } from '@/lib/content';
import { RotatingWord } from '@/components/ui/RotatingWord';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic scroll-zoom (à la the reference's "We all sustain" section):
 * a small centred media window is pinned, then expands to full-bleed as the
 * user scrolls. The intro row fades out and a caption fades in at full zoom.
 * Only once the zoom completes does the page continue to the next section.
 */
export function Sustainability() {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // This section sits ~3 screens down, so the 2 MB source is fetched on approach
  // rather than during load, where `preload="auto"` competed with the hero LCP.
  // The poster still paints immediately, so the clip-path reveal looks unchanged.
  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = 'auto';
          void el.play().catch(() => {
            /* autoplay refused — poster remains, which is an acceptable fallback */
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: '200px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Responsive starting window — a wide, short landscape banner (≈2.3:1),
      // matching the reference. Larger vertical inset = shorter window.
      const startV = window.innerWidth < 768 ? 38 : 37; // top/bottom inset %
      const startH = window.innerWidth < 768 ? 10 : 34; // left/right inset %

      const setClip = (t: number) => {
        // t: 0 = small centred window, 1 = full-bleed. Equal on every side.
        const v = startV * (1 - t);
        const h = startH * (1 - t);
        if (media.current) {
          media.current.style.clipPath = `inset(${v}% ${h}% ${v}% ${h}%)`;
        }
      };

      setClip(reduce ? 1 : 0);
      gsap.set(caption.current, { opacity: 0, y: 24 });

      if (reduce) return; // show full media statically, no pin

      // Numeric proxy → we write all four inset sides ourselves each frame,
      // so the zoom expands symmetrically from the centre (no string-parse drift).
      const proxy = { t: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(proxy, { t: 1, ease: 'none', duration: 1, onUpdate: () => setClip(proxy.t) }, 0)
        .to(intro.current, { opacity: 0, ease: 'none', duration: 0.35 }, 0)
        .to(caption.current, { opacity: 1, y: 0, ease: 'none', duration: 0.3 }, 0.72);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sustainability"
      ref={section}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full-bleed media, revealed by an expanding clip window */}
      <div ref={media} className="absolute inset-0 h-full w-full will-change-[clip-path]">
        <video
          ref={video}
          className="h-full w-full object-cover"
          src={s.video}
          poster={s.poster}
          preload="none"
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      {/* Top section label */}
      <div className="frame absolute inset-x-0 top-8 z-20 flex items-center justify-between text-label font-medium uppercase tracking-[0.12em] text-brand-teal mix-blend-difference">
        <span>{s.label}</span>
        <span className="opacity-50">[{s.index}]</span>
      </div>

      {/* Intro: horizontal row on large screens, stacked above/below the
          centred window on mobile & tablet (so nothing overflows). */}
      <div ref={intro} className="absolute inset-0 z-10">
        {/* lg+ : title —— [window] —— rotating word */}
        <div className="hidden h-full items-center lg:flex">
          <div className="frame flex w-full items-center gap-6">
            <span className="whitespace-nowrap t-h3 text-brand-teal">
              {s.title}
            </span>
            <span className="h-px flex-1 bg-brand-teal/40" />
            <span className="w-[32vw] flex-none" />
            <span className="h-px flex-1 bg-brand-sky/50" />
            <span className="flex-none whitespace-nowrap rounded-full border border-brand-teal px-6 py-2 t-h3 text-brand-teal">
              <RotatingWord words={s.rotating} />
            </span>
          </div>
        </div>

        {/* < lg : title above the window, rotating word below */}
        <div className="flex h-full flex-col items-center justify-between px-6 py-[22vh] text-center lg:hidden">
          <span className="whitespace-nowrap text-2xl font-normal tracking-tight text-brand-teal sm:text-3xl">
            {s.title}
          </span>
          <span className="flex-none whitespace-nowrap rounded-full border border-brand-teal px-5 py-1.5 text-2xl font-normal tracking-tight text-brand-teal sm:text-3xl">
            <RotatingWord words={s.rotating} />
          </span>
        </div>
      </div>

      {/* Caption revealed at full zoom */}
      <div
        ref={caption}
        className="absolute inset-x-0 bottom-0 z-20 pb-16 md:pb-20"
      >
        <div className="frame max-w-content">
          <p className="max-w-2xl t-lead text-paper">{s.body}</p>
          <a
            href={s.cta.href}
            className="group mt-7 inline-flex items-center gap-2 text-body font-medium uppercase tracking-[0.08em] text-paper"
          >
            {s.cta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
