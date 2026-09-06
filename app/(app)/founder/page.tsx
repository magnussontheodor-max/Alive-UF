import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import {
  ClaimList,
  ConfidenceDisplay,
  Empty,
  KeyValue,
  Section,
} from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { profileGaps } from "@/domain";
import { nextQuestion } from "@/agents/interview";
import { profileAnswered } from "@/lib/interview-state";
import { answerInterviewAction } from "../actions";
import InterviewCard from "./InterviewCard";

export default async function FounderPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const profile = memory.founderProfile;
  if (!profile) {
    return (
      <PageShell>
        <Empty>No founder profile yet.</Empty>
      </PageShell>
    );
  }

  const answered = profileAnswered(profile);
  const question = nextQuestion({ profile, answered });
  const gaps = profileGaps(profile);

  const totalProblems = profile.domainExposure.reduce(
    (sum, d) => sum + d.observedProblems.length,
    0
  );
  const totalReach = profile.networkAccess.reduce(
    (sum, n) => sum + n.reachableThisWeek,
    0
  );

  return (
    <PageShell>
      {question ? (
        <InterviewCard question={question} action={answerInterviewAction} />
      ) : (
        <div className="card p-6">
          <h3 className="text-[14.5px] font-semibold text-ink-950">
            Nothing more to ask right now
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
            Spark has what it needs to start finding opportunities. You can always add more
            later — more domains you know well means more real problems to work from.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section
            title="What you have described"
            subtitle="Everything an opportunity could be built from."
          >
            {profile.domainExposure.length === 0 ? (
              <Empty>No domains recorded yet.</Empty>
            ) : (
              <div className="space-y-5">
                {profile.domainExposure.map((domain) => (
                  <div key={domain.id} className="rounded-xl border border-ink-100 p-4">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-medium text-ink-950">
                        {domain.domain}
                      </p>
                      {domain.yearsExposure !== null && (
                        <Badge tone="neutral">
                          {domain.yearsExposure} year
                          {domain.yearsExposure === 1 ? "" : "s"}
                        </Badge>
                      )}
                    </div>
                    {domain.howAcquired && (
                      <p className="text-[12.5px] leading-relaxed text-ink-500">
                        {domain.howAcquired}
                      </p>
                    )}

                    {domain.observedProblems.length > 0 && (
                      <ul className="mt-3 space-y-2.5 border-t border-ink-100 pt-3">
                        {domain.observedProblems.map((problem) => (
                          <li key={problem.id}>
                            <p className="text-[13px] leading-relaxed text-ink-800">
                              {problem.description}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {problem.whoHasIt && (
                                <Badge tone="neutral">{problem.whoHasIt}</Badge>
                              )}
                              {problem.frequency !== "UNKNOWN" && (
                                <Badge tone="neutral">
                                  {problem.frequency.toLowerCase()}
                                </Badge>
                              )}
                              {problem.founderPerceivedSeverity !== "UNKNOWN" && (
                                <Badge tone="neutral">
                                  felt {problem.founderPerceivedSeverity.toLowerCase()}
                                </Badge>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section
            title="What Spark concluded"
            subtitle="Marked by whether it is established, inferred, or still a guess."
          >
            <ClaimList claims={profile.claims} />
          </Section>

          <Section
            title="Your advantages"
            subtitle="Deliberately conservative. Most people starting out have one or none, and pretending otherwise would not help you."
          >
            {profile.advantages.length === 0 ? (
              <Empty>
                Nothing yet amounts to a clear edge. That is normal, and it means the first
                opportunities need more validation rather than less.
              </Empty>
            ) : (
              <ul className="space-y-3">
                {profile.advantages.map((advantage) => (
                  <li key={advantage.id} className="rounded-xl border border-ink-100 p-4">
                    <Badge
                      tone={
                        advantage.strength === "STRONG"
                          ? "good"
                          : advantage.strength === "MODERATE"
                            ? "accent"
                            : "neutral"
                      }
                      className="mb-2"
                    >
                      {advantage.strength.toLowerCase()}
                    </Badge>
                    <p className="text-[13.5px] leading-relaxed text-ink-900">
                      {advantage.statement}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                      {advantage.reasoning}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="At a glance">
            <dl className="divide-y divide-ink-100">
              <KeyValue label="Domains">{profile.domainExposure.length}</KeyValue>
              <KeyValue label="Problems seen">{totalProblems}</KeyValue>
              <KeyValue label="Reachable people">
                {totalReach > 0 ? `~${totalReach} this week` : "None recorded"}
              </KeyValue>
              <KeyValue label="Time">
                {profile.constraints.hoursPerWeek === null
                  ? "Not set"
                  : `${profile.constraints.hoursPerWeek} h / week`}
              </KeyValue>
              <KeyValue label="Budget">
                {profile.constraints.budgetSek === null
                  ? "Not set"
                  : `${profile.constraints.budgetSek.toLocaleString("sv-SE")} SEK`}
              </KeyValue>
              <KeyValue label="Can build">
                {profile.constraints.technicalAbility
                  .toLowerCase()
                  .replace(/_/g, " ")}
              </KeyValue>
            </dl>
          </Section>

          <Section title="How well we understand you">
            <ConfidenceDisplay confidence={profile.confidence} />
          </Section>

          {gaps.length > 0 && (
            <Section
              title="Still missing"
              subtitle="These gate the next stage, and each one is here for a reason."
            >
              <ul className="space-y-3">
                {gaps.map((gap) => (
                  <li key={gap.field}>
                    <p className="text-[12.5px] font-medium text-ink-900">{gap.label}</p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-500">
                      {gap.whyItMatters}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {profile.openQuestions.length > 0 && (
            <Section title="Open questions">
              <ul className="space-y-2.5">
                {profile.openQuestions.map((q, i) => (
                  <li key={i} className="text-[12.5px] leading-relaxed text-ink-700">
                    {q}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </PageShell>
  );
}
