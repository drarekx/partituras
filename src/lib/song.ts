/** Schema for a song stored as JSON in src/data/songs/*.json. */

export type ResourceType =
  | "youtube"
  | "spotify"
  | "apple_music"
  | "tidal"
  | "youtube_music"
  | "bandcamp"
  | "soundcloud"
  | "lyrics"
  | "wikipedia"
  | "official"
  | "musicbrainz"
  | "discogs"
  | "other";

export interface Resource {
  type: ResourceType;
  /** Optional human label, useful when there are several links of the same type. */
  label?: string;
  url: string;
}

export type SectionKind =
  | "intro"
  | "verse"
  | "chorus"
  | "pre-chorus"
  | "bridge"
  | "solo"
  | "outro"
  | "interlude"
  | "spoken";

export interface ChordPlacement {
  /** Chord name, e.g. "G", "Am", "F#m". Must exist in the chord library. */
  name: string;
  /** Character index in the lyric text where this chord change falls. */
  at: number;
}

export interface SongLine {
  text: string;
  chords: ChordPlacement[];
  /** Optional repeat marker, e.g. "2×". */
  repeat?: string;
}

export interface SongSection {
  kind: SectionKind;
  label?: string;
  lines: SongLine[];
}

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type SongType = "original" | "cover" | "live" | "acoustic" | "remix";
export type PersonalStatus = "wishlist" | "learning" | "mastered" | "dropped";

export interface Personal {
  added_at?: string;
  last_played?: string;
  times_played?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  status?: PersonalStatus;
  notes?: string[];
}

export interface OriginalSource {
  artist?: string;
  title?: string;
  year?: number;
}

export interface TabSource {
  label: string;
  url: string;
  contributor?: string;
  date?: string;
}

export interface Song {
  id: string;

  // --- Identity ---
  title: string;
  artist: string;

  // --- Release / metadata for browsing & filtering ---
  album?: string;
  year?: number;
  /** ISO 639-1: "ca", "es", "en", "fr"... */
  language?: string;
  genre?: string[];
  /** First year of the decade, e.g. 1970, 2010. */
  decade?: number;
  difficulty?: Difficulty;
  tags?: string[];

  // --- Music / arrangement ---
  type?: SongType;
  original?: OriginalSource;
  key?: string;
  capo?: number;
  tuning?: string;
  tempo_bpm?: number;
  time_signature?: string;

  // --- Chord chart ---
  /** Names of all chords used; cross-referenced with src/lib/chords.ts. */
  chords_used: string[];
  sections: SongSection[];

  // --- Source attribution ---
  source: TabSource;

  // --- External resources (YouTube, Spotify, lyrics, Wikipedia...) ---
  resources?: Resource[];

  // --- Personal tracking ---
  personal?: Personal;
}
