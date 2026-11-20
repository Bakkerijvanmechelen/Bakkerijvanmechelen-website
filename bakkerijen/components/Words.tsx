/** Splitst een titel in woorden die één voor één omhoog komen. */
export default function Words({ text, delay = 120, accentClass = "" }: { text: string; delay?: number; accentClass?: string }) {
  return (
    <>
      <span className="sr-only">{text.replace(/\*\*/g, "")}</span>
      <span aria-hidden>
        {text.split(" ").map((w, i) => (
          <span key={i} className={`word ${/^\*\*.*\*\*[.,!?]?$/.test(w) ? accentClass : ""}`} style={{ animationDelay: `${delay + i * 110}ms` }}>
            {w.replace(/\*\*/g, "")}
            {" "}
          </span>
        ))}
      </span>
    </>
  );
}
