"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { DesignState, Persisted, Theme, UpptacktSektion } from "./types";
import { UTGANG } from "./tokens";
import { INBYGGDA_TEMAN, START_STATE } from "./presets";
import { laddaAllaFran } from "./fonts";

const NYCKEL = "spark-design";
const HISTORIK_MAX = 20;
const STYLE_ID = "spark-design-css";

export type Bredd = "full" | 390 | 768 | 1280;

/* —————————————— historik som reducer ——————————————
   Ett steg i historiken skapas atomiskt tillsammans med ändringen. Utan det
   blir ångra opålitligt, och utan ångra vågar man inte experimentera. */
type Store = { nu: DesignState; bak: DesignState[]; fram: DesignState[] };

type Act =
  | { t: "delta"; delta: Partial<DesignState>; samman: boolean }
  | { t: "token"; namn: string; varde: string; samman: boolean }
  | { t: "tokens"; tokens: Record<string, string> }
  | { t: "ersatt"; state: DesignState }
  | { t: "angra" }
  | { t: "gorOm" };

function stega(s: Store, nyNu: DesignState, samman: boolean): Store {
  if (samman) return { ...s, nu: nyNu };
  return { nu: nyNu, bak: [...s.bak.slice(-(HISTORIK_MAX - 1)), s.nu], fram: [] };
}

function reducer(s: Store, a: Act): Store {
  switch (a.t) {
    case "delta":
      return stega(s, { ...s.nu, ...a.delta }, a.samman);
    case "token":
      return stega(s, { ...s.nu, tokens: { ...s.nu.tokens, [a.namn]: a.varde } }, a.samman);
    case "tokens":
      return stega(s, { ...s.nu, tokens: { ...s.nu.tokens, ...a.tokens } }, false);
    case "ersatt":
      return stega(s, a.state, false);
    case "angra": {
      if (!s.bak.length) return s;
      return { nu: s.bak[s.bak.length - 1], bak: s.bak.slice(0, -1), fram: [...s.fram, s.nu] };
    }
    case "gorOm": {
      if (!s.fram.length) return s;
      return { nu: s.fram[s.fram.length - 1], bak: [...s.bak, s.nu], fram: s.fram.slice(0, -1) };
    }
  }
}

type Ctx = {
  aktiv: boolean;
  tillganglig: boolean;
  vaxla: () => void;
  state: DesignState;
  satt: (delta: Partial<DesignState>, slaSamman?: boolean) => void;
  sattToken: (namn: string, varde: string, slaSamman?: boolean) => void;
  sattTokens: (t: Record<string, string>) => void;
  angra: () => void;
  gorOm: () => void;
  kanAngra: boolean;
  kanGoraOm: boolean;
  aterstall: () => void;
  jamfor: boolean;
  bredd: Bredd;
  sattBredd: (b: Bredd) => void;
  panelSida: "right" | "left";
  vaxlaSida: () => void;
  teman: Theme[];
  aktivtTema: string;
  valjTema: (id: string) => void;
  nyttTema: (namn: string) => void;
  sparaTema: () => void;
  dupliceraTema: () => void;
  taBortTema: () => void;
  sektioner: UpptacktSektion[];
  sida: string;
  hovrad: string | null;
  sattHovrad: (id: string | null) => void;
};

const C = createContext<Ctx | null>(null);

/** Läses en gång, innan första renderingen, så ingen effekt behöver sätta tillstånd. */
function startlage(): { store: Store; teman: Theme[]; aktivt: string; tillganglig: boolean } {
  const tomt = { store: { nu: START_STATE, bak: [], fram: [] }, teman: INBYGGDA_TEMAN, aktivt: "blagra" };
  if (typeof window === "undefined") return { ...tomt, tillganglig: false };

  const url = new URLSearchParams(window.location.search);
  const tillganglig = process.env.NODE_ENV === "development" || url.get("design") === "1";

  try {
    const rå = localStorage.getItem(NYCKEL);
    if (!rå) return { ...tomt, tillganglig };
    const p = JSON.parse(rå) as Persisted;
    if (p.version !== 1 || !Array.isArray(p.teman) || !p.teman.length) return { ...tomt, tillganglig };
    const t = p.teman.find((x) => x.id === p.aktivt) ?? p.teman[0];
    return { store: { nu: t.state, bak: [], fram: [] }, teman: p.teman, aktivt: t.id, tillganglig };
  } catch {
    return { ...tomt, tillganglig };
  }
}

/** Sektioner läses ur DOM:en. Sidorna bär bara data-attribut och importerar inget. */
function upptack(): UpptacktSektion[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<HTMLElement>("[data-section]")).map((n) => {
    const rå = n.dataset.variants;
    const varianter = rå
      ? rå.split("|").map((d) => {
          const [id, ...namn] = d.split(":");
          return { id, namn: namn.join(":") || id };
        })
      : undefined;
    return {
      id: n.dataset.section!,
      namn: n.dataset.sectionName || n.dataset.section!,
      spalt: n.dataset.col || "huvud",
      spaltNamn: n.dataset.colName || "Huvudspalt",
      variantGrupp: n.dataset.variantGroup,
      varianter,
    };
  });
}

export function DesignModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sida = pathname === "/" ? "hem" : pathname.replace(/^\//, "");

  const [start] = useState(startlage);
  const [store, skicka] = useReducer(reducer, start.store);
  const [tillganglig] = useState(start.tillganglig);
  const [teman, setTeman] = useState<Theme[]>(start.teman);
  const [aktivtTema, setAktivtTema] = useState(start.aktivt);
  const [aktiv, setAktiv] = useState(false);
  const [jamfor, setJamfor] = useState(false);
  const [bredd, setBredd] = useState<Bredd>("full");
  const [panelSida, setPanelSida] = useState<"right" | "left">("right");
  const [sektioner, setSektioner] = useState<UpptacktSektion[]>([]);
  const [hovrad, setHovrad] = useState<string | null>(null);

  const state = store.nu;
  const senaste = useRef(0);

  /** Reglage och färgväljare skickar många ändringar i följd — de slås ihop
      till ett historiksteg så att ångra inte blir meningslöst. */
  const samman = useCallback((slaSamman?: boolean) => {
    const nu = Date.now();
    const s = Boolean(slaSamman) && nu - senaste.current < 400;
    senaste.current = nu;
    return s;
  }, []);

  /* —— typsnitt som ett sparat tema redan använder —— */
  useEffect(() => {
    laddaAllaFran(start.store.nu.tokens);
  }, [start]);

  /* —— skriv tokens rakt på :root —— */
  useEffect(() => {
    const rot = document.documentElement;
    const kalla = jamfor ? UTGANG : state.tokens;
    Object.entries(kalla).forEach(([k, v]) => rot.style.setProperty(k, v));
    rot.dataset.nav = jamfor ? "left" : state.nav;
  }, [state.tokens, state.nav, jamfor]);

  /* —— ordning, dolda sektioner och varianter som injicerad CSS —— */
  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    if (jamfor) {
      el.textContent = "";
      return;
    }
    const rader: string[] = [];
    Object.values(state.sections.order).forEach((lista) =>
      lista.forEach((id, i) => rader.push(`[data-section="${id}"]{order:${i};}`)),
    );
    state.sections.hidden.forEach((id) =>
      rader.push(`[data-section="${id}"]{display:none !important;}`),
    );
    Object.entries(state.sections.variants).forEach(([grupp, vald]) =>
      rader.push(
        `[data-variant-group="${grupp}"] > [data-variant]{display:none;}`,
        `[data-variant-group="${grupp}"] > [data-variant="${vald}"]{display:contents;}`,
      ),
    );
    el.textContent = rader.join("\n");
  }, [state.sections, jamfor]);

  /* —— upptäck sektioner när sidan eller en variant byts —— */
  useEffect(() => {
    const t = window.setTimeout(() => setSektioner(upptack()), 60);
    return () => window.clearTimeout(t);
  }, [sida, aktiv, state.sections.variants]);

  const satt = useCallback(
    (delta: Partial<DesignState>, slaSamman?: boolean) =>
      skicka({ t: "delta", delta, samman: samman(slaSamman) }),
    [samman],
  );
  const sattToken = useCallback(
    (namn: string, varde: string, slaSamman?: boolean) =>
      skicka({ t: "token", namn, varde, samman: samman(slaSamman) }),
    [samman],
  );
  const sattTokens = useCallback((tokens: Record<string, string>) => {
    laddaAllaFran(tokens);
    skicka({ t: "tokens", tokens });
  }, []);
  const angra = useCallback(() => skicka({ t: "angra" }), []);
  const gorOm = useCallback(() => skicka({ t: "gorOm" }), []);
  const aterstall = useCallback(
    () => skicka({ t: "ersatt", state: { tokens: { ...UTGANG }, nav: "left", sections: { order: {}, hidden: [], variants: {} } } }),
    [],
  );

  /* —— teman —— */
  const spara = useCallback((nya: Theme[], nyttAktivt: string) => {
    setTeman(nya);
    setAktivtTema(nyttAktivt);
    try {
      localStorage.setItem(NYCKEL, JSON.stringify({ version: 1, aktivt: nyttAktivt, teman: nya } satisfies Persisted));
    } catch {
      /* privat läge eller full lagring — designläget fungerar ändå, bara utan att minnas */
    }
  }, []);

  const valjTema = useCallback(
    (id: string) => {
      const t = teman.find((x) => x.id === id);
      if (!t) return;
      laddaAllaFran(t.state.tokens);
      skicka({ t: "ersatt", state: t.state });
      spara(teman, id);
    },
    [teman, spara],
  );
  const sparaTema = useCallback(
    () => spara(teman.map((t) => (t.id === aktivtTema ? { ...t, inbyggt: false, state } : t)), aktivtTema),
    [teman, aktivtTema, state, spara],
  );
  const nyttTema = useCallback(
    (namn: string) => {
      const id = "t" + Date.now();
      spara([...teman, { id, namn: namn || "Nytt tema", state }], id);
    },
    [teman, state, spara],
  );
  const dupliceraTema = useCallback(() => {
    const t = teman.find((x) => x.id === aktivtTema);
    const id = "t" + Date.now();
    spara([...teman, { id, namn: (t?.namn ?? "Tema") + " kopia", state }], id);
  }, [teman, aktivtTema, state, spara]);
  const taBortTema = useCallback(() => {
    if (teman.length <= 1) return;
    const kvar = teman.filter((x) => x.id !== aktivtTema);
    spara(kvar, kvar[0].id);
    skicka({ t: "ersatt", state: kvar[0].state });
  }, [teman, aktivtTema, spara]);

  /* —— tangentbord —— */
  useEffect(() => {
    if (!tillganglig) return;
    const iFalt = (t: EventTarget | null) => {
      const e = t as HTMLElement | null;
      return !!e && (e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable);
    };
    const ned = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setAktiv((a) => !a);
        return;
      }
      if (!aktiv) return;
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) gorOm();
        else angra();
        return;
      }
      if (e.code === "Space" && !iFalt(e.target)) {
        e.preventDefault();
        setJamfor(true);
      }
    };
    const upp = (e: KeyboardEvent) => {
      if (e.code === "Space") setJamfor(false);
    };
    window.addEventListener("keydown", ned);
    window.addEventListener("keyup", upp);
    return () => {
      window.removeEventListener("keydown", ned);
      window.removeEventListener("keyup", upp);
    };
  }, [tillganglig, aktiv, angra, gorOm]);

  const varde: Ctx = useMemo(
    () => ({
      aktiv: aktiv && tillganglig,
      tillganglig,
      vaxla: () => setAktiv((a) => !a),
      state,
      satt,
      sattToken,
      sattTokens,
      angra,
      gorOm,
      kanAngra: store.bak.length > 0,
      kanGoraOm: store.fram.length > 0,
      aterstall,
      jamfor,
      bredd,
      sattBredd: setBredd,
      panelSida,
      vaxlaSida: () => setPanelSida((s) => (s === "right" ? "left" : "right")),
      teman,
      aktivtTema,
      valjTema,
      nyttTema,
      sparaTema,
      dupliceraTema,
      taBortTema,
      sektioner,
      sida,
      hovrad,
      sattHovrad: setHovrad,
    }),
    [aktiv, tillganglig, state, satt, sattToken, sattTokens, angra, gorOm, aterstall,
     store.bak.length, store.fram.length, jamfor, bredd, panelSida, teman, aktivtTema,
     valjTema, nyttTema, sparaTema, dupliceraTema, taBortTema, sektioner, sida, hovrad],
  );

  return <C.Provider value={varde}>{children}</C.Provider>;
}

export function useDesign() {
  const v = useContext(C);
  if (!v) throw new Error("useDesign kräver DesignModeProvider");
  return v;
}
