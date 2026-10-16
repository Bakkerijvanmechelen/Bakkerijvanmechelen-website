"use client";

import { useState, useTransition } from "react";
import { saveZasPassword } from "@/app/admin/actions";
import CopyButton from "./CopyButton";
import { dangerBtn, fieldCls, primaryBtn, secondaryBtn } from "./ui";

const WORDS = ["Brood", "Pistolet", "Vlaai", "Koek", "Taart", "Bakker", "Meel", "Oven", "Croissant", "Gist"];

function suggest() {
  const r = new Uint32Array(3);
  crypto.getRandomValues(r);
  return `${WORDS[r[0] % WORDS.length]}-${WORDS[r[1] % WORDS.length]}-${1000 + (r[2] % 9000)}`;
}

export default function PasswordPanel({ isSet }: { isSet: boolean }) {
  const [value, setValue] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [pending, start] = useTransition();

  const tooShort = value.trim().length < 8;

  function save() {
    start(async () => {
      const r = await saveZasPassword(value);
      if (r?.ok) {
        setSaved(value.trim());
        setValue("");
        setAsking(false);
        setError("");
      } else setError(r?.message ?? "Opslaan mislukt.");
    });
  }

  if (saved) {
    return (
      <div className="rounded-2xl bg-green-50 p-6">
        <p className="font-display text-2xl">✅ Het wachtwoord is opgeslagen</p>
        <p className="mt-2">
          Geef dit wachtwoord nu door aan ZAS. <strong>Je ziet het hierna nooit meer</strong>: het wordt beveiligd bewaard en kan niet worden teruggelezen. Ben je het kwijt, dan stel je gewoon een nieuw in.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-white px-4 py-3 text-xl font-bold tracking-wide">{saved}</code>
          <CopyButton text={saved} label="Wachtwoord kopiëren" />
        </div>
        <button onClick={() => setSaved("")} className={`${secondaryBtn} mt-5`}>
          Klaar, verberg het wachtwoord
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-1 font-bold sm:max-w-md">
        {isSet ? "Nieuw wachtwoord" : "Kies een wachtwoord"}
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setAsking(false);
          }}
          autoComplete="off"
          placeholder="Minstens 8 tekens"
          className={fieldCls}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setValue(suggest())} className={secondaryBtn}>
          🎲 Bedenk een wachtwoord voor mij
        </button>
      </div>
      {tooShort && value.length > 0 && <p className="text-sm font-bold text-amber-900">Nog {8 - value.trim().length} teken(s) nodig.</p>}
      {error && <p role="alert" className="font-bold text-red-700">{error}</p>}

      {!asking ? (
        <div>
          <button onClick={() => (isSet ? setAsking(true) : save())} disabled={tooShort || pending} className={primaryBtn}>
            {pending ? "Bezig…" : isSet ? "Wachtwoord wijzigen" : "Wachtwoord instellen"}
          </button>
          {tooShort && <p className="mt-2 text-sm text-ink/60">Vul eerst een wachtwoord in van minstens 8 tekens.</p>}
        </div>
      ) : (
        <div role="alertdialog" className="grid gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4">
          <p>
            <strong>Zeker weten?</strong> Iedereen die nu is ingelogd op de ZAS-pagina wordt afgemeld, en het oude wachtwoord werkt niet meer. Vergeet niet het nieuwe wachtwoord door te geven aan ZAS.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={save} disabled={pending} className={dangerBtn}>
              {pending ? "Bezig…" : "Ja, wijzig het wachtwoord"}
            </button>
            <button onClick={() => setAsking(false)} className={secondaryBtn}>
              Nee, het oude behouden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
