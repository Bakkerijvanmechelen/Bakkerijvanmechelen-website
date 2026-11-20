import { Fragment } from "react";

/** Zet **vet** om naar vette tekst en enkele enters naar een nieuwe regel. */
function inline(text: string, boldClass?: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={j} className={boldClass}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={j}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}

/**
 * Tekst uit het beheer: een lege regel begint een nieuwe alinea.
 * Zo kan de beheerder schrijven zonder de opmaak van de website te breken.
 */
export default function Rich({ text, className, boldClass, inlineOnly }: { text: string; className?: string; boldClass?: string; inlineOnly?: boolean }) {
  if (inlineOnly) return <>{inline(text, boldClass)}</>;
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className={className}>
          {inline(p, boldClass)}
        </p>
      ))}
    </>
  );
}
