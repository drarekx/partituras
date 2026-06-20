/** Song registry. Loads each *.json file from this directory and validates it. */

import { songSchema } from "../schema";
import type { Song } from "../../lib/song";

const modules = import.meta.glob<Song>("./*.json", { eager: true });

function loadAll(): Song[] {
  const songs: Song[] = [];
  for (const [file, raw] of Object.entries(modules)) {
    const parsed = songSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn(`[songs] ${file} failed validation:`, parsed.error.flatten().fieldErrors);
      continue;
    }
    songs.push(parsed.data as Song);
  }
  // Stable order: by year, then by title.
  songs.sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || a.title.localeCompare(b.title));
  return songs;
}

export const songs: Song[] = loadAll();

export function getSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}
