import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import { founder, startupName } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Settings</span> — your founder profile and preferences.</>}
        accomplished={<>Profile connected to {startupName} and used across every stage.</>}
        blocking={<>Nothing.</>}
        next={<>Keep this up to date so recommendations stay relevant.</>}
      />

      <div className="card p-6 md:p-8 max-w-2xl">
        <h3 className="text-[14.5px] font-semibold text-ink-950 mb-5">Founder profile</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Name" value={founder.name} />
          <Field label="Email" value={founder.email} />
          <Field label="Location" value={founder.location} />
          <Field label="Preference" value={founder.preference} />
          <Field label="Skills" value={founder.skills.join(", ")} />
          <Field label="Interests" value={founder.interests.join(", ")} />
          <Field label="Time available" value={`${founder.hoursPerWeek} hrs / week`} />
          <Field label="Budget" value={`${founder.budgetSek.toLocaleString("sv-SE")} SEK`} />
        </div>
      </div>

      <div className="card p-6 md:p-8 max-w-2xl">
        <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Notifications</h3>
        <p className="text-[12.5px] text-ink-500 mb-4">
          Prototype placeholder — in the full product this controls how the Orchestrator reaches you between
          sessions.
        </p>
        <div className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
          <span className="text-[13px] text-ink-700">Notify me when a new task is ready</span>
          <span className="text-[11px] font-medium text-ink-400 bg-ink-50 border border-ink-150 rounded-full px-2.5 py-1">
            Coming soon
          </span>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-ink-400 font-medium mb-1">{label}</p>
      <p className="text-[13.5px] text-ink-800">{value}</p>
    </div>
  );
}
