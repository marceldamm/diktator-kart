import type { TrackId } from './track-layout';

/** Original fictional course pieces; the existing march stays available as a loading fallback. */
export const MUSIC_THEMES: Record<TrackId, { title: string; bpm: number; file: string }> = {
  stadionring: { title: 'Stempelparade', bpm: 112, file: 'music-berlin.wav' },
  'duce-drom': { title: 'Belvedere-Fanfare', bpm: 116, file: 'music-rome.wav' },
  havanna: { title: 'Malecón-Marsch', bpm: 118, file: 'music-havana.wav' },
  pyongyang: { title: 'Parade der Planerfüllung', bpm: 108, file: 'music-pyongyang.wav' },
  moscow: { title: 'Granithymne der Eitelkeit', bpm: 110, file: 'music-moscow.wav' },
  beijing: { title: 'Hutong der Stempel', bpm: 120, file: 'music-beijing.wav' },
};
