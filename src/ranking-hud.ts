/**
 * Live ranking on the right of the race screen (07.10.2026). It only displays the order it is given
 * (rankRace in main.ts, the same ranking that decides the finish); rows slide to their slot with a CSS
 * transform and the DOM is refreshed at most every 150 ms, so close battles stay calm without
 * inventing a second, HUD-only order.
 */
export interface RankingEntry { name: string; paint: string; portrait?: string; finished: boolean }

export class RankingBoard {
  private rows: HTMLLIElement[] = [];
  private lastOrder = '';
  private lastUpdate = -Infinity;
  constructor(private readonly root: HTMLOListElement) {}

  reset(): void { this.lastOrder = ''; this.lastUpdate = -Infinity; this.root.replaceChildren(); this.rows = []; }

  /** order: kart slots from first to last place; slot 0 is the player. */
  update(order: number[], entry: (slot: number) => RankingEntry, final: boolean, now: number): void {
    if (now - this.lastUpdate < 150 && !final) return;
    this.lastUpdate = now;
    if (this.rows.length !== order.length) {
      this.root.replaceChildren();
      this.rows = order.map((_, slot) => {
        const li = document.createElement('li'); li.dataset.slot = String(slot);
        li.innerHTML = '<b></b><i></i><span class="ranking-face"></span><span class="ranking-name"></span><small></small>';
        li.classList.toggle('me', slot === 0);
        this.root.append(li); return li;
      });
    }
    const key = order.join(',') + (final ? 'f' : '');
    order.forEach((slot, place) => {
      const li = this.rows[slot], e = entry(slot);
      li.style.setProperty('--place', String(place));
      li.classList.toggle('leader', place === 0);
      li.classList.toggle('done', e.finished);
      li.querySelector('b')!.textContent = String(place + 1);
      (li.querySelector('i') as HTMLElement).style.background = e.paint;
      const face = li.querySelector<HTMLElement>('.ranking-face')!;
      if (e.portrait && face.dataset.src !== e.portrait) { face.dataset.src = e.portrait; face.style.backgroundImage = `url("${e.portrait}")`; }
      li.querySelector('.ranking-name')!.textContent = e.name;
      li.querySelector('small')!.textContent = slot === 0 ? (e.finished ? 'DU · ZIEL' : 'DU') : e.finished ? 'ZIEL' : '';
    });
    if (key !== this.lastOrder) {
      this.lastOrder = key;
      this.root.setAttribute('aria-label', `Live-Rangliste: ${order.map((slot, place) => `${place + 1}. ${entry(slot).name}`).join(', ')}`);
    }
  }
}
