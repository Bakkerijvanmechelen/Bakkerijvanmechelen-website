"use client";

import { useEffect, useRef } from "react";

/** Verborgen veld met het moment waarop het formulier geopend werd (tijdsval tegen bots). */
export default function FormStartedAt() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);
  return <input ref={ref} type="hidden" name="t" defaultValue="" />;
}
