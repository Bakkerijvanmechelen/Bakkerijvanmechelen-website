"use client";

import Image from "next/image";
import { useRef } from "react";

export default function Gallery({ images }: { images: string[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  const btn = "grid size-12 place-items-center rounded-full bg-paper text-lg shadow-md ring-1 ring-ink/10 transition hover:bg-blue hover:text-white";

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label="Vorige foto's" className={btn}>
          ←
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Volgende foto's" className={btn}>
          →
        </button>
      </div>
      <ul ref={track} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((src, i) => (
          <li key={`${i}-${src}`} className="relative aspect-[4/5] w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl bg-blue-soft md:w-[300px]">
            <Image src={src} alt={`Gijbels assortiment ${i + 1}`} fill sizes="300px" className="object-cover transition duration-700 hover:scale-105" />
          </li>
        ))}
      </ul>
    </div>
  );
}
