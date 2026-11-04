'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products as p } from '@/lib/content';
import { SectionTag } from '@/components/ui/SectionTag';
import { Reveal } from '@/components/ui/Reveal';

const VISIBLE = 4; // cards shown before "Browse all"

export function Products() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? p.items : p.items.slice(0, VISIBLE);
  const hasMore = p.items.length > VISIBLE;

  return (
    <section id="products" className="bg-paper py-section-sm md:py-section">
      <div className="frame">
        <SectionTag label={p.label} index={p.index} />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="max-w-[16ch] t-h2 text-balance">{p.title}</h2>
            </Reveal>
          </div>
          <div className="flex items-end lg:col-span-4">
            <Reveal delay={0.1}>
              <p className="t-lead text-muted">{p.subtitle}</p>
            </Reveal>
          </div>
        </div>

        {/* Capability cards — each self-animates so revealed cards always show */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-20 lg:gap-x-10 lg:gap-y-16">
          {visible.map((item, i) => (
            <Reveal key={item.name} direction="up" delay={(i % 2) * 0.08} amount={0.15}>
              <Link href={`/products/${item.slug}`} className="group block">
                <div className="media aspect-[16/11] w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-5 top-5 text-micro font-medium tracking-[0.1em] text-paper/90">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="t-h3 transition-colors group-hover:text-brand-teal">
                      {item.name}
                    </h3>
                    <p className="mt-3 max-w-md text-body text-muted">{item.desc}</p>
                  </div>
                  <span className="mt-2 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line text-ink/60 transition-all duration-500 ease-smooth group-hover:border-brand-teal group-hover:bg-brand-teal group-hover:text-paper">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {hasMore && !showAll && (
          <div className="mt-16 flex justify-center lg:mt-20">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-3 rounded-full border border-ink/15 px-8 py-4 text-body font-medium uppercase tracking-[0.08em] transition-colors hover:border-brand-teal hover:text-brand-teal"
            >
              {p.cta.label}
              <span className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden>
                ↓
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
