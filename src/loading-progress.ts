/** Completed work sections, not download bytes or an estimated timer. */
export type LoadingPhase = 'engine' | 'world' | 'trees' | 'karts' | 'items' | 'ready';
export type LoadingReporter = (phase: LoadingPhase) => void;
const NEXT: Record<LoadingPhase, string> = {
  engine: 'Stadion und Rennstrecke aufbauen …',
  world: 'Park und Promenaden vorbereiten …',
  trees: 'Sechs Fahrer nehmen Platz …',
  karts: 'Items und Streckendetails vorbereiten …',
  items: 'Materialien, Schatten und erstes Bild vorbereiten …',
  ready: 'Das Stadion ist bereit.',
};
export class LoadingProgress {
  private readonly phases: LoadingPhase[];
  private readonly completed = new Set<LoadingPhase>();
  constructor(showcase = true) {
    this.phases = showcase ? ['engine', 'world', 'trees', 'karts', 'items', 'ready'] : ['engine', 'ready'];
  }
  complete(phase: LoadingPhase) {
    if (!this.phases.includes(phase)) throw new Error(`Unexpected loading phase: ${phase}`);
    this.completed.add(phase);
    return { completed: this.completed.size, total: this.phases.length, message: NEXT[phase] };
  }
  initial() {
    return { completed: 0, total: this.phases.length, message: 'Spielmodule und Grafik-Engine starten …' };
  }
}
