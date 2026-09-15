"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow, PageTitle, Panel, PanelHead, SourceChip } from "@/components/ui";
import { founder, profile, profileToIdea } from "@/data/founder";

export default function Profilen() {
  return (
    <div className="space-y-5">
      <PageTitle
        eyebrow="Profilen"
        titel={`${founder.namn}, ${founder.alder} år, ${founder.ort}`}
        ingress="Byggd genom samtal, inte formulär. Det är härifrån idéerna kommer — och det är därför medgrundaren kan säga emot dig utan att behöva fråga om bakgrunden varje gång."
      />

      <Panel className="rise border-slab/35">
        <div className="border-b border-slab/20 px-5 py-2.5">
          <span className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-wide)] text-slab">
            Härifrån kom idén
          </span>
        </div>
        <div className="px-5 py-6">
          <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="border border-line bg-page/40 px-4 py-3.5">
              <Eyebrow>Bakgrunden</Eyebrow>
              <p className="mt-2 text-[length:var(--fs-12-5)] leading-[var(--lh-body)] text-bone">
                {profileToIdea.fran}
              </p>
            </div>
            <ArrowRight size={14} strokeWidth={2.2} className="mx-auto text-dim lg:rotate-0" />
            <div className="border border-line bg-page/40 px-4 py-3.5">
              <Eyebrow>Genom hjärnan</Eyebrow>
              <p className="mt-2 text-[length:var(--fs-12-5)] leading-[var(--lh-body)] text-bone">
                {profileToIdea.via}
              </p>
            </div>
            <ArrowRight size={14} strokeWidth={2.2} className="mx-auto text-dim" />
            <div className="border border-slab/45 bg-slab/[0.08] px-4 py-3.5">
              <Eyebrow>Idén</Eyebrow>
              <p className="mt-2 text-[length:var(--fs-12-5)] leading-[var(--lh-body)] text-bone">
                {profileToIdea.till}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-[84ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
            {profileToIdea.motivering}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <SourceChip kalla={{ origin: "Profilen och Hjärnan", date: "2 september" }} />
            <Link
              href="/hjarnan"
              className="inline-flex items-center gap-2 text-[length:var(--fs-10-5)] label-caps tracking-[var(--track-label)] text-slab transition-opacity hover:opacity-75"
            >
              Se anteckningarna <ArrowRight size={11} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        {profile.map((block) => (
          <Panel key={block.rubrik} className="rise">
            <PanelHead titel={block.rubrik} />
            <dl className="px-5 py-4">
              {block.rader.map((r) => (
                <div
                  key={r.etikett}
                  className="border-b border-linesoft py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[length:var(--fs-10)] label-caps tracking-[var(--track-label)] text-dim">
                    {r.etikett}
                  </dt>
                  <dd className="mt-1.5 max-w-[62ch] text-[length:var(--fs-12-5)] leading-[var(--lh-relaxed)] text-body">
                    {r.text}
                  </dd>
                  {r.kalla ? (
                    <div className="mt-2">
                      <SourceChip kalla={r.kalla} />
                    </div>
                  ) : null}
                </div>
              ))}
            </dl>
          </Panel>
        ))}
      </div>
    </div>
  );
}
