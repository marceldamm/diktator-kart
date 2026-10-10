/**
 * Confirmed start roster as satirical caricatures (docs/14-character-and-item-catalog.md): Hitler, Stalin,
 * Mussolini, Mao, Kim Jong-un and Castro. Recognition comes from silhouette cues (hair, moustache, cap, pipe,
 * cigar, uniform colour); no insignia or regime symbol is modelled. Caricature stage, not a realistic likeness.
 * Paint colours follow the legacy driver list (Diktator-Kart-Legacy/client/src/game/drivers.ts).
 */
export type ProjectileStyle = 'dog' | 'tractor' | 'megaphone' | 'book' | 'rocket' | 'briefcase';

/** Shared, slightly enlarged head scale keeps the driver portrait readable over the broad kart bodies. */
export const DRIVER_HEAD_SCALE = [0.75, 0.74, 0.74] as const;

export interface CastMember {
  name: string;
  /** Kart nickname from the legacy production brief. */
  kartName: string;
  /** Legacy title and creative core (docs/14-character-and-item-catalog.md); flavour text, not balance. */
  title: string;
  flavour: string;
  /** Catalogued ability idea; only Hitler's 'Größenbefehl' is built so far. */
  abilityIdea: string;
  /** Character projectile look for the shared direct/homing item rules (same effect for everyone). Sources: legacy
   *  moving details in docs/14 (loudspeakers, rulebook, briefcase), kart names (rocket, five-year plan) and Marcel's dog. */
  projectile: ProjectileStyle;
  projectileName: string;
  projectileIcon: string;
  paint: string;
  uniform: string;
  cape: string | null;
  hat: string;
  /** Hat cloth colour for recolourable caps (also the shaved-side stubble tone). */
  hatColor: string;
  /** Hair, brows and moustache colour. */
  hair: string;
  /** Independently sculpted skull/jaw silhouette in the shared animated head rig. */
  faceStyle: 'hitler' | 'stalin' | 'mussolini' | 'mao' | 'kim' | 'castro';
  face: string[];
  kit: 'radio' | 'spare' | 'luggage' | 'fin' | 'parade' | 'none';
  /** Individual kart body (art-source/build_kart.py body-<name>). */
  body: 'roadster' | 'limousine' | 'racer' | 'rounded' | 'rocket' | 'jeep' | 'grandprix';
  /** Optional per-driver head scale; quality anchors use adult proportions instead of the shared caricature scale. */
  headScale?: readonly [number, number, number];
  /** Civilian suit: hides the shared gilt sleeve cuffs and trouser stripes. */
  plainSuit?: boolean;
  /** Voice line prefix (art-source/build_voices.mjs) and playback rate for the caricature register. */
  voice: string;
  voiceRate: number;
}

export const CAST: CastMember[] = [
  { name: 'Hitler', kartName: 'Größenwahn-Mobil', title: 'Selbsternannter Streckenbesitzer', flavour: 'Schwer, pompös und überzeugt, dass ihm die Ideallinie gehört.', abilityIdea: 'Größenbefehl: acht Sekunden Paradepanzer (Sarahs Idee)', paint: '#8e2635', uniform: '#7a6a4f', cape: null, hat: 'none', hatColor: '#25292b', hair: '#16110d', faceStyle: 'hitler',
    face: ['sidepart', 'hitler-sides', 'hitler-tache', 'hitler-brows', 'hitler-nose', 'hitler-jacket'], projectile: 'dog', projectileName: 'Schäferhund', projectileIcon: '🐕', body: 'grandprix', kit: 'none', headScale: [0.7, 0.69, 0.7], plainSuit: true, voice: 'general', voiceRate: .97 },
  { name: 'Stalin', kartName: 'Fünfjahresplan 3000', title: 'Vorsitzender der Kurvenkommission', flavour: 'Massiv, industriell, plant jede Kurve fünf Jahre im Voraus.', abilityIdea: 'Fünfjahresplan-Korrektur – Vorschlag, noch nicht gebaut', paint: '#6f2424', uniform: '#74796d', cape: null, hat: 'stalin-cap', hatColor: '#383834', hair: '#6a645d', faceStyle: 'stalin',
    face: ['stalin-hairline', 'shorthair', 'walrus', 'stalinmouth', 'stalin-nose', 'pipe', 'stalin-tunic'], projectile: 'tractor', projectileName: 'Fünfjahresplan-Traktor', projectileIcon: '🚜', body: 'limousine', kit: 'none', voice: 'marschall', voiceRate: .9 },
  { name: 'Mussolini', kartName: 'Il Duce GT', title: 'Balkonfahrer ohne Balkon', flavour: 'Sportlich, elegant und vor allem mit sich selbst zufrieden.', abilityIdea: 'Große Pose: 1,3 s Kinn hoch bei halbem Gas, dann Pflichtapplaus-Schub und kurzer Itemschutz', paint: '#31557a', uniform: '#1d1e22', cape: '#31557a', hat: 'peaked', hatColor: '#292724', hair: '#1a1410', faceStyle: 'mussolini',
    face: ['chin', 'bignose', 'epaulettes', 'medals', 'collartabs', 'sash', 'uniformbuttons', 'uniformcollar'], projectile: 'megaphone', projectileName: 'Balkon-Megafon', projectileIcon: '📢', body: 'racer', kit: 'radio', voice: 'imperator', voiceRate: 1.04 },
  { name: 'Mao', kartName: 'Kultur-Kart', title: 'Großer Lenker, mittelgroße Lenkung', flavour: 'Leicht und wendig, mit einem flatternden Regelheft für alles.', abilityIdea: 'Einheitslenkung – Vorschlag, noch nicht gebaut', paint: '#b72f2b', uniform: '#8a8c7e', cape: null, hat: 'octagonal', hatColor: '#5e665c', hair: '#14110f', faceStyle: 'mao',
    face: ['maohair', 'shorthair', 'flatnose', 'chubby', 'sash', 'uniformbuttons', 'uniformcollar'], projectile: 'book', projectileName: 'Rotes Regelheft', projectileIcon: '📕', body: 'rounded', kit: 'none', voice: 'kommandant', voiceRate: .98 },
  { name: 'Kim Jong-un', kartName: 'Propaganda-Rakete', title: 'Sieger vor Rennbeginn', flavour: 'Raketen-Parade auf Rädern; das Ergebnis steht schon in der Zeitung.', abilityIdea: 'Propaganda-Sieg: amtlicher Platz 1, Triumphschub und Nachprüfung', paint: '#263f70', uniform: '#1f2125', cape: null, hat: 'none', hatColor: '#6e5444', hair: '#0f0d0c', faceStyle: 'kim',
    face: ['undercut', 'flatnose', 'chubby', 'sash', 'uniformbuttons', 'uniformcollar'], projectile: 'rocket', projectileName: 'Mini-Propaganda-Rakete', projectileIcon: '🚀', body: 'rocket', kit: 'none', voice: 'kim', voiceRate: 1.02 },
  { name: 'Castro', kartName: 'Revolutions-Cabrio', title: 'Dienstältester Boxengassenredner', flavour: 'Leichtes Cabrio, lange Reden, immer eine Zigarre zur Hand.', abilityIdea: 'Blockade: zwei Paragraphenschranken hinter dem Cabrio (Item-Fallenregeln)', paint: '#315d42', uniform: '#55603e', cape: null, hat: 'patrol', hatColor: '#4c5536', hair: '#17120e', faceStyle: 'castro',
    face: ['beard', 'shorthair', 'cigar', 'bignose', 'sash', 'uniformbuttons', 'uniformcollar'], projectile: 'briefcase', projectileName: 'Aufklappender Aktenkoffer', projectileIcon: '💼', body: 'jeep', kit: 'none', voice: 'castro', voiceRate: .96 },
];

export const CAST_PARTS = ['peaked', 'naval', 'fur', 'crown', 'beret', 'octagonal', 'diva', 'moustache', 'beard', 'glasses', 'furcollar',
  'shorthair', 'medals', 'epaulettes', 'collartabs', 'sidepart', 'toothbrush', 'swept', 'walrus', 'pipe', 'chin', 'maohair',
  'undercut', 'patrol', 'cigar', 'bignose', 'straightnose', 'flatnose', 'chubby', 'stalinmouth', 'stalin-nose', 'stalin-tunic', 'stalin-cap', 'stalin-hairline', 'sash', 'uniformbuttons', 'uniformcollar', 'hitler-tache', 'hitler-brows', 'hitler-jacket', 'hitler-nose', 'hitler-sides'];

/** Kart slots → CAST index: the chosen driver takes kart 0 (player), the others keep catalogue order. */
export function rosterOrder(chosen: number): number[] {
  return [chosen, ...CAST.map((_, i) => i).filter((i) => i !== chosen)];
}

/** Tyre sets (07.10.2026): each caricature's own wheel design; any set fits any kart (chosen in the driver selection). */
export const TIRE_SETS = [
  { id: 'parade', name: 'Paradeweißwand', owner: 'Hitler' }, { id: 'limousine', name: 'Staatsradkappe', owner: 'Stalin' },
  { id: 'corsa', name: 'Corsa-Speiche', owner: 'Mussolini' }, { id: 'volk', name: 'Volksstahlscheibe', owner: 'Mao' },
  { id: 'rakete', name: 'Raketennabe', owner: 'Kim Jong-un' }, { id: 'gelaende', name: 'Guerilla-Stollen', owner: 'Castro' },
] as const;
export type TireSetId = typeof TIRE_SETS[number]['id'];
/** Default tyre set per roster index (CAST order). */
export const DEFAULT_TIRES: readonly TireSetId[] = ['parade', 'limousine', 'corsa', 'volk', 'rakete', 'gelaende'];
