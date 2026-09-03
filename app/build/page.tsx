import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import BuildRunner from "@/components/build/BuildRunner";

export default function BuildPage() {
  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Build</span> — turning the MVP spec into a working product.</>}
        accomplished={<>MVP specification is locked and ready to build.</>}
        blocking={<>Nothing — click below to start.</>}
        next={<>Click &ldquo;Build my MVP&rdquo; and let Startup OS orchestrate the build.</>}
      />

      <BuildRunner />

      <p className="text-[12px] text-ink-400 max-w-xl">
        Startup OS doesn&rsquo;t run its own coding model — it orchestrates specialised AI coding agents behind the
        scenes and keeps the result in sync with your Startup Memory.
      </p>
    </PageShell>
  );
}
