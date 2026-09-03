import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import IdeaFinder from "@/components/idea/IdeaFinder";

export default function IdeaPage() {
  return (
    <PageShell>
      <div>
        <h2 className="text-[22px] font-semibold text-ink-950 tracking-tight mb-2">
          Let&rsquo;s find a business worth building.
        </h2>
        <p className="text-[13.5px] text-ink-500 max-w-xl">
          No idea yet is fine. Answer a few questions and the Idea Agent will generate opportunities scored
          against who you are, not generic trends.
        </p>
      </div>

      <OrientationBar
        where={<>You&rsquo;re at the very start — no validated idea yet.</>}
        accomplished={<>Founder profile captured.</>}
        blocking={<>No opportunity selected to move into Research.</>}
        next={<>Answer the questions below and generate opportunities.</>}
      />

      <IdeaFinder />
    </PageShell>
  );
}
