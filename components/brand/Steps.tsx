// Three tight columns — a green number, a tracked label, the description —
// with a hairline between rows and none after the last. All seven fit on one
// screen, so the section is read rather than scrolled through.

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
    <ol className="mt-6">
      {STEPS.map((step, i) => (
        <li key={step.id} className="b-step">
          {/* Decoration beside a labelled row, not content. */}
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
