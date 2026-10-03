/**
 * Confirmed start roster as satirical caricatures (docs/14-character-and-item-catalog.md): Hitler, Stalin,
 * Mussolini, Mao, Kim Jong-un and Castro. Recognition comes from silhouette cues (hair, moustache, cap, pipe,
 * cigar, uniform colour); no insignia or regime symbol is modelled. Caricature stage, not a realistic likeness.
 * Paint colours follow the legacy driver list (Diktator-Kart-Legacy/client/src/game/drivers.ts).
 */
export interface CastMember {
  name: string;
  /** Kart nickname from the legacy production brief. */
  kartName: string;
  paint: string;
  uniform: string;
  cape: string | null;
  hat: string;
  /** Hat cloth colour for recolourable caps (also the shaved-side stubble tone). */
  hatColor: string;
  /** Hair, brows and moustache colour. */
  hair: string;
  face: string[];
  kit: 'radio' | 'spare' | 'luggage' | 'fin' | 'parade' | 'none';
  /** Voice line prefix (art-source/build_voices.mjs) and playback rate for the caricature register. */
  voice: string;
  voiceRate: number;
}

export const CAST: CastMember[] = [
  { name: 'Hitler', kartName: 'Größenwahn-Mobil', paint: '#8e2635', uniform: '#7a6a4f', cape: null, hat: 'none', hatColor: '#1d2326', hair: '#16110d',
    face: ['sidepart', 'shorthair', 'toothbrush', 'medals', 'collartabs'], kit: 'parade', voice: 'general', voiceRate: .97 },
  { name: 'Stalin', kartName: 'Fünfjahresplan 3000', paint: '#6f2424', uniform: '#e2dccb', cape: null, hat: 'none', hatColor: '#2b2b2b', hair: '#6a645d',
    face: ['swept', 'shorthair', 'walrus', 'pipe', 'epaulettes', 'medals', 'collartabs'], kit: 'spare', voice: 'marschall', voiceRate: .9 },
  { name: 'Mussolini', kartName: 'Il Duce GT', paint: '#31557a', uniform: '#1d1e22', cape: '#31557a', hat: 'none', hatColor: '#000000', hair: '#1a1410',
    face: ['chin', 'epaulettes', 'medals', 'collartabs'], kit: 'radio', voice: 'imperator', voiceRate: 1.04 },
  { name: 'Mao', kartName: 'Kultur-Kart', paint: '#b72f2b', uniform: '#8a8c7e', cape: null, hat: 'none', hatColor: '#000000', hair: '#14110f',
    face: ['maohair', 'shorthair'], kit: 'none', voice: 'kommandant', voiceRate: .98 },
  { name: 'Kim Jong-un', kartName: 'Propaganda-Rakete', paint: '#263f70', uniform: '#1f2125', cape: null, hat: 'none', hatColor: '#6e5444', hair: '#0f0d0c',
    face: ['undercut'], kit: 'fin', voice: 'kim', voiceRate: 1.02 },
  { name: 'Castro', kartName: 'Revolutions-Cabrio', paint: '#315d42', uniform: '#55603e', cape: null, hat: 'patrol', hatColor: '#4c5536', hair: '#17120e',
    face: ['beard', 'shorthair', 'cigar'], kit: 'luggage', voice: 'castro', voiceRate: .96 },
];

export const CAST_PARTS = ['peaked', 'naval', 'fur', 'crown', 'beret', 'diva', 'moustache', 'beard', 'glasses', 'furcollar',
  'shorthair', 'medals', 'epaulettes', 'collartabs', 'sidepart', 'toothbrush', 'swept', 'walrus', 'pipe', 'chin', 'maohair',
  'undercut', 'patrol', 'cigar'];
