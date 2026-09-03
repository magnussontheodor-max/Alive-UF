import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import ValidationBoard from "@/components/validation/ValidationBoard";

export default function ValidationPage() {
  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Validation</span> — testing whether LeadFlow AI&rsquo;s core risk actually holds.</>}
        accomplished={<>7 of 10 interviews done. Problem confirmed. Confidence at 72%.</>}
        blocking={<>Willingness to pay at your target price point is still unconfirmed.</>}
        next={<>Run the pricing experiment below with 5 more sales managers.</>}
      />

      <ValidationBoard />
    </PageShell>
  );
}
