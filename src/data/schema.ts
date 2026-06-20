/**
 * Zod schema for validating a song JSON file before it lands in the registry.
 * Optional at runtime (we can ship without it), but catches mistakes early when
 * the import script writes new data.
 */
import { z } from "zod";

const resourceTypeSchema = z.enum([
  "youtube",
  "spotify",
  "apple_music",
  "tidal",
  "youtube_music",
  "bandcamp",
  "soundcloud",
  "lyrics",
  "wikipedia",
  "official",
  "musicbrainz",
  "discogs",
  "other",
]);

const resourceSchema = z.object({
  type: resourceTypeSchema,
  label: z.string().optional(),
  url: z.string().url(),
});

const sectionKindSchema = z.enum([
  "intro",
  "verse",
  "chorus",
  "pre-chorus",
  "bridge",
  "solo",
  "outro",
  "interlude",
  "spoken",
]);

const chordPlacementSchema = z.object({
  name: z.string().min(1),
  at: z.number().int().min(0),
});

const songLineSchema = z.object({
  text: z.string(),
  chords: z.array(chordPlacementSchema),
  repeat: z.string().optional(),
});

const songSectionSchema = z.object({
  kind: sectionKindSchema,
  label: z.string().optional(),
  lines: z.array(songLineSchema).min(1),
});

const personalSchema = z.object({
  added_at: z.string().optional(),
  last_played: z.string().optional(),
  times_played: z.number().int().min(0).optional(),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  status: z.enum(["wishlist", "learning", "mastered", "dropped"]).optional(),
  notes: z.array(z.string()).optional(),
});

const originalSourceSchema = z.object({
  artist: z.string().optional(),
  title: z.string().optional(),
  year: z.number().int().optional(),
});

const tabSourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  contributor: z.string().optional(),
  date: z.string().optional(),
});

export const songSchema = z.object({
  id: z.string().min(1),

  title: z.string().min(1),
  artist: z.string().min(1),

  album: z.string().optional(),
  year: z.number().int().optional(),
  language: z.string().optional(),
  genre: z.array(z.string()).optional(),
  decade: z.number().int().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),

  type: z.enum(["original", "cover", "live", "acoustic", "remix"]).optional(),
  original: originalSourceSchema.optional(),
  key: z.string().optional(),
  capo: z.number().int().min(0).optional(),
  tuning: z.string().optional(),
  tempo_bpm: z.number().int().optional(),
  time_signature: z.string().optional(),

  chords_used: z.array(z.string().min(1)),
  sections: z.array(songSectionSchema).min(1),

  source: tabSourceSchema,
  resources: z.array(resourceSchema).optional(),

  personal: personalSchema.optional(),
});

export type SongInput = z.infer<typeof songSchema>;
