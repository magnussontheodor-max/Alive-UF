"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { nextSteps, trail as initialTrail, type TrailEntry } from "@/data/home";
import { brainNotes as initialNotes, type BrainNote } from "@/data/brain";
import { scoreParts } from "@/data/score";
import type { ScoreKey } from "@/data/types";

type PartScores = Record<ScoreKey, number>;

const startScores = Object.fromEntries(
  scoreParts.map((p) => [p.nyckel, p.poang]),
) as PartScores;

type DemoValue = {
  parts: PartScores;
  total: number;
  /** Poängen innan senaste höjningen — driver uppräkningen. */
  previous: number;
  sinceLast: number;
  stepIndex: number;
  currentStep: (typeof nextSteps)[number];
  doneCount: number;
  trail: TrailEntry[];
  notes: BrainNote[];
  completeStep: () => void;
  deferStep: () => void;
  deferred: boolean;
  addNote: (text: string) => void;
  reset: () => void;
};

const Ctx = createContext<DemoValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<PartScores>(startScores);
  const [previous, setPrevious] = useState<number>(52);
  const [stepIndex, setStepIndex] = useState(0);
  const [trail, setTrail] = useState<TrailEntry[]>(initialTrail);
  const [notes, setNotes] = useState<BrainNote[]>(initialNotes);
  const [sinceLast, setSinceLast] = useState(14);
  const [deferred, setDeferred] = useState(false);

  const total = useMemo(
    () => Object.values(parts).reduce((a, b) => a + b, 0),
    [parts],
  );

  const currentStep = nextSteps[Math.min(stepIndex, nextSteps.length - 1)];

  const completeStep = useCallback(() => {
    const step = nextSteps[Math.min(stepIndex, nextSteps.length - 1)];
    if (step.sist) return;

    setPrevious(total);
    setParts((prev) => {
      const next = { ...prev };
      for (const d of step.delar) {
        next[d.nyckel] = next[d.nyckel] + d.delta;
      }
      return next;
    });
    setSinceLast((s) => s + step.okning);
    setTrail((prev) => [
      {
        id: `t-ny-${step.id}`,
        text: step.spar,
        tid: "Just nu",
        typ: "verktyg" as const,
      },
      ...(step.okning > 0
        ? [
            {
              id: `t-poang-${step.id}`,
              text: `Din poäng steg med ${step.okning}. ${step.delar
                .map((d) => {
                  const namn = scoreParts.find((p) => p.nyckel === d.nyckel)?.namn ?? d.nyckel;
                  return `${namn} +${d.delta}`;
                })
                .join(", ")}.`,
              tid: "Just nu",
              typ: "poang" as const,
            },
          ]
        : []),
      ...prev,
    ]);
    setStepIndex((i) => Math.min(i + 1, nextSteps.length - 1));
    setDeferred(false);
  }, [stepIndex, total]);

  const deferStep = useCallback(() => setDeferred(true), []);

  const addNote = useCallback((text: string) => {
    setNotes((prev) => [
      { id: `b-ny-${prev.length}`, datum: "I dag", text },
      ...prev,
    ]);
  }, []);

  const reset = useCallback(() => {
    setParts(startScores);
    setPrevious(52);
    setStepIndex(0);
    setTrail(initialTrail);
    setNotes(initialNotes);
    setSinceLast(14);
    setDeferred(false);
  }, []);

  const value: DemoValue = {
    parts,
    total,
    previous,
    sinceLast,
    stepIndex,
    currentStep,
    doneCount: stepIndex,
    trail,
    notes,
    completeStep,
    deferStep,
    deferred,
    addNote,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo måste användas inuti DemoProvider");
  return v;
}
