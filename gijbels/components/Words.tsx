/** Splitst een titel in woorden die één voor één omhoog komen. */
export default function Words({ text, delay = 120 }: { text: string; delay?: number }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((w, i) => (
          <span key={i} className="word" style={{ animationDelay: `${delay + i * 110}ms` }}>
            {w}
            {" "}
          </span>
        ))}
      </span>
    </>
  );
}
