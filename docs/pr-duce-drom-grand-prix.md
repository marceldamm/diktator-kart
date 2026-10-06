<!-- ccr-projects-attribution -->
_Requested by **Marcel**_

## Zugehörige Aufgabe

Claude-Masterauftrag „Diktator Kart als vollständiges Rennspiel weiterentwickeln“ (Marcel, 06.10.2026). Kein GitHub-Issue angelegt: in dieser Claude-Umgebung gab es weder GitHub-CLI noch -Connector. Status in CURRENT-WORKLIST.md.

## Änderung

Vorher: Ein spielbarer Stadionring, „Grand Prix“ war ein einzelnes Rennen, Zeitfahren mit einem globalen Geist, Platzierung nur als Zahl.

Nachher: Zweite spielbare Strecke Duce-Drom (Rom) mit eigener Route, Hügel, Sprung, Tiber-Kai, Abkürzung und römischen Blender-Modulen; Grand Prix über beide Strecken mit Punkten, Zwischen- und Gesamtwertung; Einzelrennen und Zeitfahren mit Streckenauswahl; Live-Rangliste rechts; Bestzeit/Runde/Geist je Strecke; Rivalenstile; Balkonrede als Streckenereignis.

So: Streckendaten in `src/track-layout.ts`, Umschalten mit `selectTrack()`; Welt aus gemeinsamen Kit-Modulen je Thema; Wertung in `src/grand-prix.ts`, Anzeige in `src/ranking-hud.ts`. Details: `docs/26-duce-drom.md`, `PROGRESS-LOG.md` (07.10.2026), Fragebogen-Abgleich `docs/27-questionnaire-status.md`.

## Prüfung

- [x] `npm test` (81/81)
- [x] `npm run build`
- [x] Sichtbares Chrome mit Demo-Autopilot: Einzelrennen Duce-Drom und kompletter Grand Prix über beide Strecken; Belege `docs/evidence/rome-*-20261007.png`, `docs/evidence/gp-*-20261007.png`
- [x] Vier Teamdateien und `PROGRESS-LOG.md` aktualisiert
- [x] Offen: menschliche Fahr-/Stil-/Hörprobe, Zeitfahr-Speicherung im echten Lauf, Intel-UHD-Messung (Issue #4)

## Menschliche Review-Punkte

- Duce-Drom einmal selbst fahren: Serpentine, Belvedere-Sprung, Tiber-Kai, Stallgasse.
- Rangliste rechts bei Überholmanövern ruhig genug?
- Grand-Prix-Texte und Satire-Ton passend?

🤖 Generated with [Claude Code](https://claude.com/claude-code)
