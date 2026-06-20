/**
 * Chord shape definitions for standard tuning (E A D G B E).
 *
 * `frets` is bottom-to-top: [lowE, A, D, G, B, highE].
 * Negative values mean "don't play" (-1) or "muted" (special-cased to "x").
 * The first positive fret determines the diagram's starting position;
 * if the first fret is >0 the nut is omitted (we show "fr X" label).
 *
 * `fingers` mirrors `frets` and gives the finger number (0 = open, undefined = muted).
 * `barre` draws a barre line across strings within a fret.
 *
 * `tier` orders the chord by learning difficulty (Principiante → Experto).
 * `category` groups chords by harmonic function for filtering.
 */

export type Tier = "principiante" | "intermedio" | "avanzado" | "experto";

export type Category =
  | "major"
  | "minor"
  | "dom7"
  | "maj7"
  | "m7"
  | "sus"
  | "add"
  | "power"
  | "dim"
  | "aug"
  | "9"
  | "altered"
  | "slash";

export const TIER_ORDER: Tier[] = [
  "principiante",
  "intermedio",
  "avanzado",
  "experto",
];

export const TIER_LABEL: Record<Tier, string> = {
  principiante: "Principiant",
  intermedio: "Intermedi",
  avanzado: "Avançat",
  experto: "Expert",
};

export const TIER_DESCRIPTION: Record<Tier, string> = {
  principiante:
    "Acords oberts sense barra. La base de qualsevol cançoner.",
  intermedio:
    "Setenes, sus, add i power chords oberts. Amplien el vocabulari.",
  avanzado:
    "Acords amb barra i extensions bàsiques (maj7, m7).",
  experto:
    "Extensions (9, 11, 13), alteracions, dim, aug i inversions amb baix.",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  major: "Major",
  minor: "Minor",
  dom7: "7",
  maj7: "maj7",
  m7: "m7",
  sus: "sus",
  add: "add",
  power: "power",
  dim: "dim",
  aug: "aug",
  "9": "9",
  altered: "alt.",
  slash: "baix",
};

export type ChordShape = {
  /** Display name, e.g. "Am", "Cadd9", "F" */
  name: string;
  /** Bottom-to-top fret per string. 0 = open, positive = fret, negative = skip */
  frets: [number, number, number, number, number, number];
  /** Optional finger numbers per string. 0 = open, undefined = muted */
  fingers?: [number | null, number | null, number | null, number | null, number | null, number | null];
  /** Optional barre line */
  barre?: { fret: number; from: number; to: number; finger?: number };
  /** Where the diagram starts on the fretboard. 1 = first fret. */
  baseFret?: number;
  /** Variant label, e.g. "barre" or "easy" */
  variant?: string;
  /** Difficulty tier. */
  tier?: Tier;
  /** Harmonic category for filtering. */
  category?: Category;
  /** Short note (e.g. "ceja abierta 1fr", "low E muted") */
  tip?: string;
};

export const CHORD_LIBRARY: Record<string, ChordShape> = {
  /* ──────────── Principiante (9) ──────────── */
  C: {
    name: "C",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, 0, 1, 0],
    tier: "principiante",
    category: "major",
  },
  D: {
    name: "D",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [null, null, 0, 1, 3, 2],
    tier: "principiante",
    category: "major",
  },
  E: {
    name: "E",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    tier: "principiante",
    category: "major",
  },
  G: {
    name: "G",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    tier: "principiante",
    category: "major",
  },
  A: {
    name: "A",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [null, 0, 1, 2, 3, 0],
    tier: "principiante",
    category: "major",
  },
  Am: {
    name: "Am",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [null, 0, 2, 3, 1, 0],
    tier: "principiante",
    category: "minor",
  },
  Dm: {
    name: "Dm",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [null, null, 0, 2, 3, 1],
    tier: "principiante",
    category: "minor",
  },
  Em: {
    name: "Em",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    tier: "principiante",
    category: "minor",
  },
  "E7": {
    name: "E7",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    tier: "principiante",
    category: "dom7",
  },

  /* ──────────── Intermedio (15) ──────────── */
  A7: {
    name: "A7",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [null, 0, 2, 0, 3, 0],
    tier: "intermedio",
    category: "dom7",
  },
  B7: {
    name: "B7",
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [null, 2, 1, 3, 0, 4],
    tier: "intermedio",
    category: "dom7",
  },
  D7: {
    name: "D7",
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [null, null, 0, 2, 1, 3],
    tier: "intermedio",
    category: "dom7",
  },
  G7: {
    name: "G7",
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [2, 1, 0, 0, 0, 3],
    tier: "intermedio",
    category: "dom7",
  },
  Asus2: {
    name: "Asus2",
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [null, 0, 1, 2, 0, 0],
    tier: "intermedio",
    category: "sus",
  },
  Asus4: {
    name: "Asus4",
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [null, 0, 1, 2, 4, 0],
    tier: "intermedio",
    category: "sus",
  },
  Cadd9: {
    name: "Cadd9",
    frets: [-1, 3, 2, 0, 3, 0],
    fingers: [null, 2, 1, 0, 3, 0],
    tier: "intermedio",
    category: "add",
  },
  Dsus2: {
    name: "Dsus2",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [null, null, 0, 1, 3, 0],
    tier: "intermedio",
    category: "sus",
  },
  Dsus4: {
    name: "Dsus4",
    frets: [-1, -1, 0, 2, 3, 3],
    fingers: [null, null, 0, 1, 2, 4],
    tier: "intermedio",
    category: "sus",
  },
  D5: {
    name: "D5",
    frets: [-1, -1, 0, 2, 3, -1],
    fingers: [null, null, 0, 1, 3, null],
    variant: "power",
    tier: "intermedio",
    category: "power",
  },
  G5: {
    name: "G5",
    frets: [3, 5, 5, -1, -1, -1],
    fingers: [1, 3, 4, null, null, null],
    variant: "power",
    tier: "intermedio",
    category: "power",
  },
  A5: {
    name: "A5",
    frets: [-1, 0, 2, 2, -1, -1],
    fingers: [null, 0, 1, 2, null, null],
    variant: "power",
    tier: "intermedio",
    category: "power",
  },
  E5: {
    name: "E5",
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 2, 3, null, null, null],
    variant: "power",
    tier: "intermedio",
    category: "power",
  },
  G6: {
    name: "G6",
    frets: [3, 2, 0, 0, 0, 0],
    fingers: [2, 1, 0, 0, 0, 0],
    tier: "intermedio",
    category: "major",
  },
  Dm7: {
    name: "Dm7",
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [null, null, 0, 2, 1, 1],
    tier: "intermedio",
    category: "m7",
  },

  /* ──────────── Avanzado (20) ──────────── */
  F: {
    name: "F",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "major",
  },
  B: {
    name: "B",
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [null, 1, 2, 3, 4, 1],
    barre: { fret: 2, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "major",
  },
  Bb: {
    name: "Bb",
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [null, 1, 2, 3, 4, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "major",
  },
  Cm: {
    name: "Cm",
    frets: [-1, 3, 5, 5, 4, 3],
    fingers: [null, 1, 3, 4, 2, 1],
    barre: { fret: 3, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "minor",
  },
  Fm: {
    name: "Fm",
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "minor",
  },
  Bm: {
    name: "Bm",
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    barre: { fret: 2, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "minor",
  },
  Gm: {
    name: "Gm",
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 3, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "minor",
  },
  F7: {
    name: "F7",
    frets: [1, 3, 1, 2, 1, 1],
    fingers: [1, 3, 1, 2, 1, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "dom7",
  },
  Bb7: {
    name: "Bb7",
    frets: [-1, 1, 3, 1, 3, 1],
    fingers: [null, 1, 3, 1, 4, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "dom7",
  },
  Cmaj7: {
    name: "Cmaj7",
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [null, 3, 2, 0, 0, 0],
    tier: "avanzado",
    category: "maj7",
  },
  Gmaj7: {
    name: "Gmaj7",
    frets: [3, 2, 0, 0, 0, 2],
    fingers: [2, 1, 0, 0, 0, 3],
    tier: "avanzado",
    category: "maj7",
  },
  Bbmaj7: {
    name: "Bbmaj7",
    frets: [-1, 1, 3, 2, 3, 1],
    fingers: [null, 1, 3, 2, 4, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "maj7",
  },
  Am7: {
    name: "Am7",
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [null, 0, 2, 0, 1, 0],
    tier: "avanzado",
    category: "m7",
  },
  Em7: {
    name: "Em7",
    frets: [0, 2, 2, 0, 3, 0],
    fingers: [0, 2, 3, 0, 4, 0],
    tier: "avanzado",
    category: "m7",
  },
  Bm7: {
    name: "Bm7",
    frets: [-1, 2, 4, 2, 3, 2],
    fingers: [null, 1, 3, 1, 2, 1],
    barre: { fret: 2, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "m7",
  },
  Fm7: {
    name: "Fm7",
    frets: [1, 3, 1, 1, 1, 1],
    fingers: [1, 3, 1, 1, 1, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "m7",
  },
  A7sus4: {
    name: "A7sus4",
    frets: [-1, 0, 2, 0, 3, 0],
    fingers: [null, 0, 2, 0, 4, 0],
    tier: "avanzado",
    category: "sus",
  },
  Fsus4: {
    name: "Fsus4",
    frets: [1, 3, 3, 3, 1, 1],
    fingers: [1, 3, 4, 4, 1, 1],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "avanzado",
    category: "sus",
  },
  Am11: {
    name: "Am11",
    frets: [-1, 0, 0, 0, 1, 0],
    fingers: [null, 0, 0, 0, 1, 0],
    tier: "avanzado",
    category: "altered",
    tip: "Inclou la 11a (D) sense 3a ni 5a — so obert i ambigu.",
  },
  "C/E": {
    name: "C/E",
    frets: [0, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    tier: "avanzado",
    category: "slash",
    tip: "C amb baix E (6a corda).",
  },

  /* ──────────── Experto (21) ──────────── */
  Dmaj7: {
    name: "Dmaj7",
    frets: [-1, -1, 0, 2, 2, 2],
    fingers: [null, null, 0, 1, 1, 1],
    tier: "experto",
    category: "maj7",
  },
  Fmaj7: {
    name: "Fmaj7",
    frets: [-1, -1, 3, 2, 1, 0],
    fingers: [null, null, 3, 2, 1, 0],
    tier: "experto",
    category: "maj7",
  },
  Am9: {
    name: "Am9",
    frets: [-1, 0, 2, 0, 1, 3],
    fingers: [null, 0, 2, 0, 1, 4],
    tier: "experto",
    category: "9",
  },
  C9: {
    name: "C9",
    frets: [-1, 3, 2, 3, 3, 3],
    fingers: [null, 1, 2, 3, 4, 4],
    barre: { fret: 3, from: 1, to: 5, finger: 1 },
    tier: "experto",
    category: "9",
  },
  D9: {
    name: "D9",
    frets: [-1, 5, 4, 5, 5, 5],
    fingers: [null, 1, 4, 2, 3, 4],
    barre: { fret: 5, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "experto",
    category: "9",
  },
  E9: {
    name: "E9",
    frets: [0, 2, 0, 1, 0, 2],
    fingers: [0, 2, 0, 1, 0, 3],
    tier: "experto",
    category: "9",
  },
  A9: {
    name: "A9",
    frets: [-1, 0, 2, 4, 2, 0],
    fingers: [null, 0, 1, 3, 2, 0],
    tier: "experto",
    category: "9",
  },
  G9: {
    name: "G9",
    frets: [3, 3, 0, 2, 3, 3],
    fingers: [1, 2, 0, 3, 4, 4],
    barre: { fret: 3, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "experto",
    category: "9",
  },
  Dm9: {
    name: "Dm9",
    frets: [-1, -1, 0, 2, 1, 3],
    fingers: [null, null, 0, 2, 1, 4],
    tier: "experto",
    category: "9",
  },
  Bm7b5: {
    name: "Bm7b5",
    frets: [-1, 2, 3, 2, 3, -1],
    fingers: [null, 1, 3, 2, 4, null],
    tier: "experto",
    category: "altered",
    tip: "També conegut com Bø. ii de A menor (jazz).",
  },
  Cdim: {
    name: "Cdim",
    frets: [-1, 3, 4, 5, 4, -1],
    fingers: [null, 1, 2, 4, 3, null],
    barre: { fret: 4, from: 1, to: 4, finger: 3 },
    variant: "barre",
    tier: "experto",
    category: "dim",
  },
  Ddim: {
    name: "Ddim",
    frets: [-1, -1, 0, 1, 3, 1],
    fingers: [null, null, 0, 1, 3, 1],
    tier: "experto",
    category: "dim",
  },
  Cdim7: {
    name: "Cdim7",
    frets: [-1, 3, 4, 3, 4, -1],
    fingers: [null, 1, 3, 1, 4, null],
    barre: { fret: 3, from: 1, to: 4, finger: 1 },
    variant: "barre",
    tier: "experto",
    category: "dim",
  },
  Caug: {
    name: "Caug",
    frets: [-1, 3, 2, 1, 0, 0],
    fingers: [null, 4, 3, 2, 0, 0],
    tier: "experto",
    category: "aug",
  },
  Eaug: {
    name: "Eaug",
    frets: [0, 3, 2, 1, 0, 0],
    fingers: [0, 4, 3, 2, 0, 0],
    tier: "experto",
    category: "aug",
  },
  "D/F#": {
    name: "D/F#",
    frets: [2, -1, 0, 2, 3, 2],
    fingers: [1, null, 0, 2, 4, 3],
    tier: "experto",
    category: "slash",
    tip: "D amb baix F# (6a corda, traste 2).",
  },
  "G/B": {
    name: "G/B",
    frets: [-1, 2, 0, 0, 0, 3],
    fingers: [null, 1, 0, 0, 0, 2],
    tier: "experto",
    category: "slash",
    tip: "G amb baix B (5a corda).",
  },
  Gadd9: {
    name: "Gadd9",
    frets: [3, -1, 0, 2, 0, 3],
    fingers: [2, null, 0, 1, 0, 3],
    tier: "experto",
    category: "add",
  },
  Dadd9: {
    name: "Dadd9",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [null, null, 0, 1, 3, 0],
    tier: "experto",
    category: "add",
  },
  F13: {
    name: "F13",
    frets: [1, 3, 1, 2, 3, 3],
    fingers: [1, 3, 1, 2, 4, 4],
    barre: { fret: 1, from: 0, to: 5, finger: 1 },
    variant: "barre",
    tier: "experto",
    category: "altered",
  },
  "C/Eb": {
    name: "C/Eb",
    frets: [-1, -1, 2, 0, 1, 0],
    fingers: [null, null, 2, 0, 1, 0],
    tier: "experto",
    category: "slash",
    tip: "C amb baix Eb (4a corda).",
  },
};

/** Resolve a chord name to its definition, returning undefined if unknown. */
export function getChord(name: string): ChordShape | undefined {
  return CHORD_LIBRARY[name];
}

/** Pretty-print an unknown chord for display. */
export function normalizeChordName(name: string): string {
  return name.replace(/♯/g, "#").replace(/♭/g, "b").trim();
}

/** All chord entries sorted by tier then name. */
export function listChords(): { name: string; chord: ChordShape }[] {
  return Object.entries(CHORD_LIBRARY)
    .map(([name, chord]) => ({ name, chord }))
    .sort((a, b) => {
      const ta = TIER_ORDER.indexOf(a.chord.tier ?? "principiante");
      const tb = TIER_ORDER.indexOf(b.chord.tier ?? "principiante");
      if (ta !== tb) return ta - tb;
      return a.name.localeCompare(b.name);
    });
}

/** Group chord entries by tier (preserves TIER_ORDER). */
export function groupByTier(
  entries: { name: string; chord: ChordShape }[],
): Record<Tier, { name: string; chord: ChordShape }[]> {
  const groups = Object.fromEntries(
    TIER_ORDER.map((t) => [t, [] as { name: string; chord: ChordShape }[]]),
  ) as Record<Tier, { name: string; chord: ChordShape }[]>;
  for (const e of entries) {
    const t = e.chord.tier ?? "principiante";
    groups[t].push(e);
  }
  return groups;
}

/* ──────────── Note helpers ──────────── */

const STRING_TUNING = ["E", "A", "D", "G", "B", "E"] as const;
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

/** Return the note name (with ♯/♭ preference) for a string+fret. */
export function getNoteAt(stringIdx: number, fret: number): string | null {
  if (stringIdx < 0 || stringIdx > 5) return null;
  const openIdx = NOTE_INDEX[STRING_TUNING[stringIdx]];
  if (fret < 0) return null; // muted
  const idx = (openIdx + fret) % 12;
  return NOTE_NAMES[idx];
}

/** All sounding notes for a chord shape, lowest to highest. */
export function getChordNotes(chord: ChordShape): string[] {
  const notes: string[] = [];
  for (let i = 0; i < chord.frets.length; i++) {
    const f = chord.frets[i];
    if (f >= 0) {
      const n = getNoteAt(i, f);
      if (n) notes.push(n);
    }
  }
  return notes;
}
