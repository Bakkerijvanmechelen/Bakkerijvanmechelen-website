"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  as?: "div" | "li" | "article" | "section" | "p";
  delay?: number;
  from?: "up" | "left" | "right" | "zoom";
  className?: string;
};

/**
 * Laat een element zacht verschijnen als het in beeld komt.
 * Zonder JavaScript of met "minder beweging" blijft alles gewoon zichtbaar.
 */
export default function Reveal({ children, as = "div", delay = 0, from = "up", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // al in beeld
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`${className} ${state === "hidden" ? `reveal-hidden reveal-from-${from}` : ""} ${state === "shown" ? "reveal-shown" : ""}`}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
