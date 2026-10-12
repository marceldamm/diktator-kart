/**
 * Aktenflut (Marcel 11.10.2026): a censorship hit no longer shows a small notice. Like the Mario Kart blooper, a
 * fountain of files, decrees, redacted reports and propaganda leaflets bursts over the screen, then scatters toward
 * the edges so the player can read the road while the temporary handling effect continues. Pure DOM overlay; the
 * race simulation owns the timing.
 */
const HEADLINES = [
  'AMTLICH GESCHWÄRZT', 'VERSCHLUSSSACHE', 'Erfolgsmeldung Nr. 4711', 'Planerfüllung: 312 %', 'Die Ernte war nie besser',
  'Wahlergebnis: 99,8 %', 'Alles in bester Ordnung', 'Bitte weiterfahren', 'Faktenlage: geprüft', 'Kein Stau. Offiziell.',
  'Durchschlag 3 von 7', 'Antrag abgelehnt', 'Sieg in allen Disziplinen', 'Die Strecke ist gerade', 'Nur zuständige Stellen',
] as const;
const STAMPS = ['ZENSIERT', 'GEHEIM', 'GENEHMIGT', 'VERBOTEN', 'GEPRÜFT'] as const;

export class DocumentFlood {
  private readonly root: HTMLElement;
  private active = false;
  private total = 1;

  constructor(parent: HTMLElement = document.body) {
    this.root = document.createElement('div');
    this.root.id = 'document-flood'; this.root.hidden = true; this.root.setAttribute('aria-hidden', 'true');
    parent.append(this.root);
  }

  /** Starts a fresh burst; `duration` is the full time the documents block the view. */
  start(duration: number, reduced = false): void {
    this.total = Math.max(.5, duration); this.active = true;
    this.root.replaceChildren();
    const count = reduced ? 12 : 22;
    for (let i = 0; i < count; i++) {
      const sheet = document.createElement('div'), kind = i % 5;
      sheet.className = `flood-sheet ${['flood-file', 'flood-report', 'flood-leaflet', 'flood-redacted', 'flood-decree'][kind]}`;
      const random = (a: number, b: number) => a + Math.random() * (b - a);
      // A short central burst sells the hit; most sheets settle at the sides, clear of the racing line.
      const edge = i % 4 !== 0, side = i % 2 === 0 ? 1 : -1;
      const x = edge ? random(24, 46) * side : random(-13, 13);
      const y = edge ? random(-82, -18) : (Math.random() < .5 ? random(-90, -74) : random(-25, -14));
      sheet.style.setProperty('--x', `${x.toFixed(1)}vw`);
      sheet.style.setProperty('--y', `${y.toFixed(1)}vh`);
      sheet.style.setProperty('--r', `${random(-38, 38).toFixed(0)}deg`);
      sheet.style.setProperty('--spin', `${random(-200, 200).toFixed(0)}deg`);
      sheet.style.setProperty('--w', `${random(reduced ? 6 : 7.5, reduced ? 10 : 13.5).toFixed(1)}vmin`);
      sheet.style.animationDelay = `${(i * .028).toFixed(3)}s, ${(.9 + Math.random() * .6).toFixed(2)}s`;
      const headline = document.createElement('strong'); headline.textContent = HEADLINES[(i * 7) % HEADLINES.length];
      sheet.append(headline);
      for (let line = 0; line < 4; line++) {
        const bar = document.createElement('i'); bar.style.width = `${Math.round(random(45, 96))}%`;
        if (kind === 3 || Math.random() < .35) bar.className = 'black';
        sheet.append(bar);
      }
      if (i % 3 === 0) { const stamp = document.createElement('b'); stamp.textContent = STAMPS[i % STAMPS.length]; sheet.append(stamp); }
      this.root.append(sheet);
    }
    this.root.style.opacity = '1'; this.root.hidden = false;
  }

  /** Called every frame with the seconds of blocked view left (0 hides). The last ~40 % thin out. */
  update(remaining: number, visible = true): void {
    if (!this.active) return;
    if (remaining <= 0) { this.active = false; this.root.hidden = true; this.root.replaceChildren(); return; }
    this.root.hidden = !visible;
    const fade = Math.min(1, remaining / (this.total * .4));
    this.root.style.opacity = fade.toFixed(3);
  }
}
