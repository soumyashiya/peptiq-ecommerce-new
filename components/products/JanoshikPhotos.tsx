import Image from 'next/image';

/**
 * The tested batch as Janoshik photographed it — their watermarked shots of the
 * carton and pen, which show the batch number the report refers to. Each opens
 * full size in a new tab. No `'use client'`, so the product page (server) and the
 * lab report modal (client) can both render it.
 */
export function JanoshikPhotos({ images, productName }: { images: string[]; productName: string }) {
  if (images.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="text-label font-medium uppercase tracking-[0.1em] text-muted">
        Tested sample, photographed by Janoshik
      </p>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <li key={src}>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-[6px] border border-line bg-paper"
            >
              <Image
                src={src}
                alt={`${productName} sample photographed by Janoshik Analytical, image ${i + 1} of ${images.length}`}
                fill
                sizes="(min-width: 1024px) 12rem, 30vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
              />
              <span className="sr-only">(opens full size in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
