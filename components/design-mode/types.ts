/** Designlägets tillstånd. Allt som går att ändra i panelen bor här. */

export type TokenKind = "color" | "length" | "number" | "text" | "select";

export type TokenDef = {
  namn: string;
  etikett: string;
  kind: TokenKind;
  /** För reglage. */
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  val?: string[];
};

export type Tokens = Record<string, string>;

export type NavPlacering = "left" | "top";

export type SectionsState = {
  /** Sektionsordning per sida, som lista av sektions-id. */
  order: Record<string, string[]>;
  /** Dolda sektioner, per sektions-id. */
  hidden: string[];
  /** Vald variant per variantgrupp. */
  variants: Record<string, string>;
};

export type DesignState = {
  tokens: Tokens;
  nav: NavPlacering;
  sections: SectionsState;
};

export type Theme = {
  id: string;
  namn: string;
  inbyggt?: boolean;
  state: DesignState;
};

export type Persisted = {
  version: 1;
  aktivt: string;
  teman: Theme[];
};

/** Sektioner upptäcks i DOM:en via data-attribut — sidorna importerar ingenting. */
export type UpptacktSektion = {
  id: string;
  namn: string;
  /** Vilken spalt sektionen ligger i. Ordning gäller inom en spalt. */
  spalt: string;
  spaltNamn: string;
  variantGrupp?: string;
  varianter?: { id: string; namn: string }[];
};
