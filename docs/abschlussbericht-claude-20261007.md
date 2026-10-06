# Abschlussbericht Claude-Masterauftrag (06./07.10.2026)

**Branch:** `codex/team-marcel-20261006-214551-132` (gepusht, letzter Commit `ed56e24`, enthält `origin/main` `110fa15`). **PR:** nicht geöffnet – in dieser Umgebung gibt es weder GitHub-CLI noch einen Connector. Fertiger PR-Text: `docs/pr-duce-drom-grand-prix.md`. Vergleich: https://github.com/marceldamm/diktator-kart/compare/main...codex/team-marcel-20261006-214551-132

**Prüfung:** `npm test` 87/87, `npm run build` erfolgreich. Sichtbares, eigenes Chrome-Fenster (RTX-3070-Laptop, 1600×1000): Einzelrennen Duce-Drom und zwei komplette Grand Prix über beide Strecken. Dabei fuhr der Demo-Autopilot den Spielerkart (keine menschliche Fahrprobe). Keine Seitenfehler. Testfenster danach pausiert und geschlossen.

| Paket | Status | Beleg / Grenze |
|---|---|---|
| 1 Zweite Strecke **Duce-Drom (Rom)** | **umgesetzt** | 1 238 m eigene Route (Circus-Gerade, Meta-Kehre mit Obelisk, Stallgasse-Abkürzung, Serpentine auf 6 m, Belvedere-Sprung, Tiber-Kai, Forum, Prunkstraße mit Triumphbogen und Balkonpalast); zehn neue Blender-Module; 8 Streckentests; `rome-*`, `rome-view-*`. Menschliche Fahr-/Stilprobe offen |
| 2 Live-Rangliste rechts | **umgesetzt** | Nur `rankRace`, Porträts, Führender/Spieler markiert, ruhige Gleitwechsel, Ziel-Häkchen; im Rennen und Zieleinlauf geprüft |
| 3 Grand Prix als Meisterschaft | **umgesetzt** | Stadionring → Duce-Drom, Punkte 10/7/5/3/2/1, Zwischen-/Gesamtwertung, Siegerehrung, Gleichstandsregel (zweimal korrekt im Lauf), Einleitungen und Ansagen; ca. 10 min Fahrzeit |
| 4 Zeitfahren und Lernschleife | **teilweise** | Bestzeit, beste Runde und Geist je Strecke, nur vollständige Läufe, Geist-Abstand im HUD; Speichern im echten Zeitfahren ungeprüft (Demo speichert absichtlich nicht) |
| 5 Rivalen und Streckenereignis | **umgesetzt (ungeprüft menschlich)** | Rivalenstile ohne Tempobonus; Balkonrede mit Rosenregen und Ansage in Runde 2 |
| Fragebogen-Abgleich | **umgesetzt** | `docs/27-questionnaire-status.md` mit Status und Reihenfolge |
| Zusätzlich aus dem Fragebogen | **umgesetzt** | Tastenbelegung (geprüft), Gamepad (ohne echten Controller ungeprüft), Grafik-Startwert, Fähigkeiten „Große Pose“ (Mussolini) und „Blockade“ (Castro) |
| Leistung 60 FPS / Intel UHD | **offen** | Nur Momentwerte 34–57 FPS auf RTX 3070; Issue #4 bleibt offen |

**Entscheidung nötig:** Die geplanten Fähigkeiten „Große Säuberung“ (Stalin) und „Kulturrevolution“ (Mao) benennen reale Massenverbrechen. Ich habe sie nicht gebaut; bitte festlegen, wie die Satire die Täter trifft und nicht die Opfer.

**Beobachtung:** Mussolini gewann alle drei Demo-Grands-Prix (sein Rivalenstil nimmt die Abkürzung, dazu kommt das bestehende Startplatz-Grundtempo). Bitte selbst fahren; danach ggf. Grundtempo vereinheitlichen.

**Nächste Schritte:** M7-Messung beider Strecken inkl. Intel UHD, Gamepad-Praxistest, dritte Strecke aus Sarahs Liste, Reifenauswahl.
