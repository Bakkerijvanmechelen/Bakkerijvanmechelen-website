"use client";

import { useState } from "react";
import { secondaryBtn } from "./ui";

export default function CopyButton({ text, label = "Kopiëren" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={secondaryBtn}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          window.prompt("Kopieer met Ctrl+C:", text);
        }
      }}
    >
      {done ? "✓ Gekopieerd" : label}
    </button>
  );
}
