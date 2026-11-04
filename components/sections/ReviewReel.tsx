'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { reviewReel } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Video review reel: a centred lead over a full-bleed, continuously moving
 * row of portrait cards — the same marquee technique as `LineRail`.
 *
 * The list is rendered twice and the track translates by exactly −50%, so the
 * loop restarts on the frame it ended (no seam). Spacing is `mr-*` per card
 * rather than `gap`, so each copy is exactly half the track. The second copy
 * is `aria-hidden` and its controls are unfocusable.
 *
 * The row pauses on hover, on keyboard focus, and while a clip is playing with
 * sound. Under reduced motion it stops moving and the previews hold their
 * first frame.
 *
 * Each card with a `video` shows it as a silent looping preview; the play
 * button replays it with sound and native controls. Only one plays at a time.
 */


type Item = (typeof reviewReel.items)[number];

function Card({
  item,
  isPlaying,
  hidden,
  reduce,
  onPlay,
  onEnd,
}: {
  item: Item;
  isPlaying: boolean;
  hidden: boolean;
  reduce: boolean;
  onPlay: () => void;
  onEnd: () => void;
}) {
  return (
    <li className="relative mr-5 aspect-[9/16] w-[56vw] flex-none overflow-hidden rounded-[1.25rem] bg-ink/10 sm:w-[33vw] lg:w-[16vw]">
      {isPlaying && item.video ? (
        <video
          src={item.video}
          poster={item.poster}
          autoPlay
          controls
          playsInline
          onEnded={onEnd}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {item.video ? (
            <video
              src={item.video}
              muted
              loop
              playsInline
              autoPlay={!reduce}
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={item.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 56vw"
              className="object-cover"
            />
          )}

          <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[1.0625rem] font-bold uppercase md:text-h3 tracking-[0.04em] text-paper">
                <span className="truncate">{item.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" className="flex-none fill-brand-sky" aria-hidden>
                  <path d="M12 2.5 14.6 5l3.5-.4.6 3.5 3 1.9-1.4 3.2 1.4 3.2-3 1.9-.6 3.5-3.5-.4L12 23.5 9.4 21l-3.5.4-.6-3.5-3-1.9L3.7 12.8 2.3 9.6l3-1.9.6-3.5 3.5.4Z" />
                  <path d="m8.5 12.5 2.3 2.3 4.7-4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
              <p className="mt-0.5 truncate text-label uppercase tracking-[0.12em] text-paper/70">{item.meta}</p>
            </div>

            {item.video && (
              <button
                type="button"
                onClick={onPlay}
                tabIndex={hidden ? -1 : undefined}
                aria-label={`Play ${item.name}'s review`}
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-paper/90 text-ink transition-colors duration-300 hover:bg-paper"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l13-7.5Z" />
                </svg>
              </button>
            )}
          </div>
        </>
      )}
    </li>
  );
}

export function ReviewReel() {
  // Key (`copy-index`) of the card currently playing with sound, or null.
  const [playing, setPlaying] = useState<string | null>(null);
  const reduce = !!useReducedMotion();
  const copies = reduce ? [0] : [0, 1];

  return (
    <section id="reviews" className="scroll-mt-28 py-section-sm">
      <div className="frame">
        <Reveal className="text-center">
          <span className="pill-eyebrow">
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" className="fill-brand">
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                </svg>
              ))}
            </span>
            {reviewReel.pill}
          </span>
          <h2 className="mx-auto mt-6 max-w-[18ch] text-balance t-h1 text-ink">{reviewReel.title}</h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-body font-medium text-ink/65">
            {reviewReel.subtitle}
          </p>
        </Reveal>
      </div>

      {/* Full-bleed moving track. */}
      <Reveal delay={0.1}>
        <div
          className={`group/rail mt-12 w-full md:mt-14 ${reduce ? 'overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'overflow-hidden'}`}
        >
          <div
            className={`flex w-max ${reduce ? '' : 'animate-ticker [animation-duration:45s] group-hover/rail:[animation-play-state:paused] group-focus-within/rail:[animation-play-state:paused]'}`}
            style={playing ? { animationPlayState: 'paused' } : undefined}
          >
            {copies.map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                aria-label={copy === 0 ? 'Customer video reviews' : undefined}
                className="flex shrink-0"
              >
                {reviewReel.items.map((item, i) => {
                  const key = `${copy}-${i}`;
                  return (
                    <Card
                      key={key}
                      item={item}
                      hidden={copy === 1}
                      reduce={reduce}
                      isPlaying={playing === key}
                      onPlay={() => setPlaying(key)}
                      onEnd={() => setPlaying(null)}
                    />
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
