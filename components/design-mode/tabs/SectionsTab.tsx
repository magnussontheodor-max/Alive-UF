"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { useDesign } from "../store";
import type { UpptacktSektion } from "../types";
import { Grupp, P } from "../bits";

function Rad({ s }: { s: UpptacktSektion }) {
  const { state, satt, sattHovrad } = useDesign();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: s.id });
  const dold = state.sections.hidden.includes(s.id);
  const vald = s.variantGrupp ? state.sections.variants[s.variantGrupp] : undefined;

  const vaxlaDold = () => {
    const h = dold
      ? state.sections.hidden.filter((x) => x !== s.id)
      : [...state.sections.hidden, s.id];
    satt({ sections: { ...state.sections, hidden: h } });
  };

  const valjVariant = (v: string) => {
    satt({ sections: { ...state.sections, variants: { ...state.sections.variants, [s.variantGrupp!]: v } } });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.6 : 1,
        border: `1px solid ${P.kant}`, borderRadius: 5, background: P.yta2,
        marginBottom: 6, padding: "7px 8px",
      }}
      onMouseEnter={() => sattHovrad(s.id)}
      onMouseLeave={() => sattHovrad(null)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Flytta ${s.namn}`}
          style={{ display: "flex", color: P.text3, cursor: "grab", background: "none", border: 0, padding: 0 }}
        >
          <GripVertical size={14} />
        </button>
        <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: dold ? P.text3 : P.text }}>
          {s.namn}
        </span>
        <button
          type="button"
          onClick={vaxlaDold}
          aria-label={dold ? `Visa ${s.namn}` : `Dölj ${s.namn}`}
          title={dold ? "Visa" : "Dölj"}
          style={{ display: "flex", color: dold ? P.bad : P.text3, background: "none", border: 0, padding: 0, cursor: "pointer" }}
        >
          {dold ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      {s.varianter && s.varianter.length > 1 ? (
        <div style={{ display: "flex", gap: 4, marginTop: 7 }}>
          {s.varianter.map((v) => {
            const aktiv = (vald ?? s.varianter![0].id) === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => valjVariant(v.id)}
                style={{
                  flex: 1, padding: "4px 6px", borderRadius: 4, fontSize: 10.5, lineHeight: 1.3,
                  border: `1px solid ${aktiv ? P.accent : P.kant}`,
                  background: aktiv ? "rgba(91,157,217,.16)" : "transparent",
                  color: aktiv ? P.text : P.text2, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {v.namn}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SectionsTab() {
  const { sektioner, state, satt, sida } = useDesign();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  if (!sektioner.length) {
    return (
      <p style={{ fontSize: 11.5, lineHeight: 1.6, color: P.text3 }}>
        Den här sidan har inga märkta sektioner.
      </p>
    );
  }

  const spalter = Array.from(new Set(sektioner.map((s) => s.spalt)));

  const ordningFor = (spalt: string) => {
    const iSpalt = sektioner.filter((s) => s.spalt === spalt).map((s) => s.id);
    const sparad = state.sections.order[`${sida}:${spalt}`];
    if (!sparad) return iSpalt;
    const kvar = iSpalt.filter((id) => !sparad.includes(id));
    return [...sparad.filter((id) => iSpalt.includes(id)), ...kvar];
  };

  const slut = (spalt: string) => (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const nu = ordningFor(spalt);
    const fran = nu.indexOf(String(active.id));
    const till = nu.indexOf(String(over.id));
    const ny = [...nu];
    ny.splice(till, 0, ny.splice(fran, 1)[0]);
    satt({
      sections: { ...state.sections, order: { ...state.sections.order, [`${sida}:${spalt}`]: ny } },
    });
  };

  return (
    <>
      {spalter.map((spalt) => {
        const ordning = ordningFor(spalt);
        const namn = sektioner.find((s) => s.spalt === spalt)?.spaltNamn ?? spalt;
        return (
          <Grupp key={spalt} titel={namn}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragEnd={slut(spalt)}
            >
              <SortableContext items={ordning} strategy={verticalListSortingStrategy}>
                {ordning.map((id) => {
                  const s = sektioner.find((x) => x.id === id);
                  return s ? <Rad key={id} s={s} /> : null;
                })}
              </SortableContext>
            </DndContext>
          </Grupp>
        );
      })}
      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5, color: P.text3 }}>
        Ordningen gäller inom en spalt. Hovra en rad för att se sektionen markeras på sidan.
      </p>
    </>
  );
}
