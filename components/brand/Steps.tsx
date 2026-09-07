// The whole product as one list. Every step is visible at once: the section is
// meant to be read in a few seconds, not clicked through.
//
// A green number, a tracked uppercase label, and the answer in sentence case
// beside it. Everything is visible at once: the section is read in a few
// seconds rather than clicked through.

const STEPS = [
  {
    id: "start",
    label: "Start",
    body: "Berätta om dig själv, dina mål och din situation. Spark börjar med dig, inte med en idé.",
  },
  {
    id: "ideas",
    label: "Idéer",
    body: "Idéer som passar just dig. Inte en generisk lista.",
  },
  {
    id: "selection",
    label: "Urval",
    body: "Vilken av dem är faktiskt värd din tid? Vi jämför dem mot varandra.",
  },
  {
    id: "market",
    label: "Marknad",
    body: "Kunder, konkurrenter och risker — innan du lägger månader på fel sak.",
  },
  {
    id: "validation",
    label: "Validering",
    body: "Testa de antaganden som skulle få idén att falla. Det billigaste sättet att ha fel är tidigt.",
  },
  {
    id: "product",
    label: "Produkt",
    body: "Gör om det du lärt dig till en fokuserad MVP. Liten nog att faktiskt bli klar.",
  },
  {
    id: "build",
    label: "Bygg",
    body: "Från spec till körbar produkt. Spark bygger den.",
  },
];

export default function Steps() {
  return (
    <ol className="b-steps">
      {STEPS.map((step, i) => (
        <li key={step.id} className="b-step">
          {/* The number is decoration beside a labelled row, not content. */}
          <span className="b-num" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="b-step-label">{step.label}</p>
          <p className="b-step-body">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
