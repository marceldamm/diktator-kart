/**
 * Six neutral, fictional caricature drivers for the slice. They borrow the G–L costume language
 * (parade uniforms, capes, caps, gold) but depict no historical person; the confirmed historical
 * line-up stays open until it is approved together.
 */
export interface CastMember {
  name: string;
  paint: string;
  uniform: string;
  cape: string | null;
  hat: string;
  /** Hat cloth colour for recolourable caps. */
  hatColor: string;
  face: string[];
  kit: 'radio' | 'spare' | 'luggage' | 'fin' | 'parade' | 'none';
  /** Voice line prefix (art-source/build_voices.mjs) and playback rate for the caricature register. */
  voice: string;
  voiceRate: number;
}

export const CAST: CastMember[] = [
  { name: 'Der General', paint: '#8f1f27', uniform: '#ece5d3', cape: '#8f1f27', hat: 'peaked', hatColor: '#1d2326', face: ['moustache'], kit: 'fin', voice: 'general', voiceRate: .97 },
  { name: 'Der Marschall', paint: '#17424f', uniform: '#1e2328', cape: null, hat: 'fur', hatColor: '#2b2b2b', face: ['beard', 'furcollar'], kit: 'spare', voice: 'marschall', voiceRate: .9 },
  { name: 'Der Imperator', paint: '#e8dcc2', uniform: '#f1ece2', cape: '#a3262c', hat: 'crown', hatColor: '#000000', face: ['moustache'], kit: 'luggage', voice: 'imperator', voiceRate: 1.04 },
  { name: 'Der Kommandant', paint: '#3d5236', uniform: '#4d5a3c', cape: '#2a3624', hat: 'beret', hatColor: '#6a1820', face: ['glasses', 'moustache'], kit: 'radio', voice: 'kommandant', voiceRate: .98 },
  { name: 'Die Diva', paint: '#24357a', uniform: '#17191d', cape: '#4e1534', hat: 'diva', hatColor: '#000000', face: ['furcollar'], kit: 'parade', voice: 'diva', voiceRate: 1.07 },
  { name: 'Die Admiralin', paint: '#5b2d63', uniform: '#1f2733', cape: '#1a2232', hat: 'naval', hatColor: '#000000', face: ['glasses'], kit: 'none', voice: 'admiralin', voiceRate: .97 },
];

export const CAST_PARTS = ['peaked', 'naval', 'fur', 'crown', 'beret', 'diva', 'moustache', 'beard', 'glasses', 'furcollar'];
