import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, KeyValue, Section, SubmitButton } from "@/components/Primitives";
import { getCurrentStartup } from "@/lib/current";
import { getSession } from "@/lib/session";
import { backendMode } from "@/data";
import { REASONING_MODE_EXPLANATION, reasoningMode } from "@/ai";
import { seedDemoAction } from "../actions";

export default async function SettingsPage() {
  const session = await getSession();
  const startup = await getCurrentStartup();
  const backend = backendMode();
  const reasoning = reasoningMode();

  return (
    <PageShell>
      <Section
        title="How this workspace is running"
        subtitle="Spark works with or without a backend and a model. It tells you which, rather than hiding it."
      >
        <dl className="divide-y divide-ink-100">
          <KeyValue label="Storage">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={backend === "supabase" ? "good" : "neutral"}>
                {backend === "supabase" ? "Supabase" : "Local"}
              </Badge>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
              {backend === "supabase"
                ? "Data is stored in Postgres with row level security, scoped to your account."
                : "Supabase is not configured, so data is kept in this session's local store. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to switch — no code changes needed."}
            </p>
          </KeyValue>

          <KeyValue label="Reasoning">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={reasoning === "live" ? "good" : "neutral"}>
                {reasoning === "live" ? "Model connected" : "Built-in rules"}
              </Badge>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
              {REASONING_MODE_EXPLANATION[reasoning]}
              {reasoning === "deterministic" &&
                " Set ANTHROPIC_API_KEY to connect a model."}
            </p>
          </KeyValue>

          <KeyValue label="Account">
            {session ? (
              <>
                {session.authenticated ? session.founder.email : "Local session"}
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                  {session.authenticated
                    ? "Signed in through Supabase Auth."
                    : "No authentication in local mode. Everything is scoped to this machine."}
                </p>
              </>
            ) : (
              "Not signed in"
            )}
          </KeyValue>
        </dl>
      </Section>

      <Section title="Startup">
        {startup ? (
          <dl className="divide-y divide-ink-100">
            <KeyValue label="Name">{startup.name}</KeyValue>
            <KeyValue label="Country">{startup.country}</KeyValue>
            <KeyValue label="Stage">{startup.stage}</KeyValue>
            <KeyValue label="Created">
              {new Date(startup.createdAt).toLocaleDateString("sv-SE")}
            </KeyValue>
            {startup.isDemo && (
              <KeyValue label="Demo">
                <Badge tone="warn">Demo workspace</Badge>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                  Seeded with an example founder profile. Everything else in it was produced
                  by the real agents from that input.
                </p>
              </KeyValue>
            )}
          </dl>
        ) : (
          <Empty>No startup yet.</Empty>
        )}
      </Section>

      <Section
        title="Later stages"
        subtitle="What this version deliberately does not do."
      >
        <ul className="space-y-2.5 text-[13px] leading-relaxed text-ink-700">
          <li>· Research, validation and product agents arrive in the next phases.</li>
          <li>· Build planning is simplified and does not generate code.</li>
          <li>
            · Swedish company setup and launch are not implemented. Company form,
            Bolagsverket registration and tax are real decisions that deserve real work, not
            a checklist that looks finished.
          </li>
        </ul>
      </Section>

      {!startup && (
        <Section title="Demo workspace">
          <form action={seedDemoAction}>
            <SubmitButton variant="secondary">Load demo data</SubmitButton>
          </form>
        </Section>
      )}
    </PageShell>
  );
}
