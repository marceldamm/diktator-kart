# Fortschrittslog und globale Projekthistorie

**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

## Neueste Übergabe – 04.10.2026 (Abend, Claude)

Projektstart auf `codex/team-marcel-20261003-232302-374` (Basis main `f784078`), danach autonome Arbeit auf Marcels Auftrag bis zur 95-%-Budgetgrenze und Teamabschluss nach main. Ergebnis: Maus-Kamera-Fix, historischer Startkader (Karikaturstufe), Fahrerwahl mit Live-Porträts, figurenspezifische Wurfobjekte, Panzer nur für Hitler (auch Bot), eigener Marsch statt Klavier, Ziel-Feuerwerk und Siegerporträts. 43/43 Unit-Tests, TypeScript und Produktionsbuild bestanden; Browserbelege im eingebauten Browser der Claude-App gegen den Batch-Server (Port 4173, gleicher Ordner/Branch/Commit laut `/__diktator/status`). Zweite Runde: preußischer Marsch, Zufallswetter mit Schnee, Panzerrad-Fix, Nasen/Wangen. Offen: Marcels Maus-Test in Chrome, Hörprobe des Marsches, Feinschliff der Gesichter, eigene Fähigkeiten der fünf anderen Figuren. Details im Eintrag unten.

## Vorherige Übergabe – 04.10.2026

**Listenfolge verankert (04.10., Marcel):** „Arbeitslisten abarbeiten“ autorisiert kurzfristige Aufgaben und anschließend bestätigte Langzeitziele; Pakete in CURRENT-WORKLIST.md übernehmen, selbstständig umsetzen, verifizieren und dokumentieren. Blockierte Aufgaben erhalten und unabhängig weiterarbeiten; echte Entscheidungen/unbestätigte Vorschläge nicht automatisch freigeben. AGENTS/START-HERE, beide Listen, TEAM-NOTES/TEAM-CHANGES aktualisiert. Nur Dokumentation, keine Spieländerung. Offiziell zu Beginn 6 % Fünf-Stunden-Rest / 71 % Wochenrest; Abschluss dieses kleinen Auftrags, danach keine autonome Großaufgabe. Lokaler Checkpoint, nicht gepusht.

**Qualitätsziel ergänzt (Marcel):** deutlich bessere und realitätsnähere Modelle, historische Charaktere, Fahrzeuge, Strecke, Umgebung, Effekte, Sounds, Stimmen und Musik anhand der gewählten Bildpräferenz G–L. Fertige Stimmen ohne TTS; vorhandene synthetische Clips sind Zwischenstand. Ziel/Aufgaben in LONG-TERM-GOALS.md, Herkunft in TEAM-NOTES.md, Aufnahme in CURRENT-WORKLIST.md und Kurzverlauf in TEAM-CHANGES.md. Abhängige Vorgaben in README, docs/02/05/07/09/10/12/16 konsistent ergänzt. Spielcode/Assets unverändert, keine neue Sicht-/Hörabnahme. Nächster Schritt: laufende Panzeraufgabe und sichtbare Qualitätspakete ausarbeiten. Offizielle Werte zu Beginn dieses kleinen Dokumentationsauftrags: 9 % Fünf-Stunden-Rest, 71 % Wochenrest; lokale Sicherung, keine große Umsetzung begonnen.

Prüfung dieses Qualitätsziel-Eintrags: git diff --check ohne Fehler; zentrale Dateinavigation, lokale Links, Projektmarker und Logmigration bestanden. Nur Markdown geändert, kein erneuter Spielbuild erforderlich. Lokaler Checkpoint; nicht nach GitHub veröffentlicht.

**Zusatzauftrag: Sarahs Altänderungen prüfen.** Frisches `git fetch origin --prune`: kein neuer Sarah-Archivbranch, letzter veröffentlichter Bezug e292070 vom 01.10.2026. Panzer in `client/src/game/abilities.ts` und Überfahrreaktion in `bots.ts` belegt; bereits in 6f6c09d vorhanden. Im aktiven `src/main.ts` Q nur Diagnose, keine Fähigkeit. Katalog aus älterem Kreativauftrag widerspricht letzter Altimplementierung; Quellenunterschied statt stiller Ersetzung ergänzt. Weitere fünf Fähigkeiten, neun Itemtypen sowie d5d3c15/d407079-Bot-/Streckenänderungen im neuen [Abgleich](docs/sarah-feature-audit.md) festgehalten. Persönliche Sarah-Urheberschaft durch übermittelte Aussage, nicht Git-Autor belegt; lokale unveröffentlichte Dateien unbekannt. Keine alte Laufzeitabnahme und keine Panzer-Neuimplementierung behauptet.

Geändert: CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md, TEAM-NOTES.md, dieser Log, docs/14-character-and-item-catalog.md und neuer Abgleich. Nächster Schritt: Claude baut Panzerfähigkeit im Babylon-Spiel; übrige Altideen mit Herkunft priorisieren. Nur Dokumentationsänderung; Spielcode unverändert. Geprüft: git diff --check ohne Fehler, zentrale Links/Navigation/Projektmarker bestanden. Offizielles Limit beim Abgleich: 11 % Fünf-Stunden-Rest / 72 % Wochenrest; keine große Aufgabe begonnen, geordneter lokaler Checkpoint. Dieser Auftrag veröffentlicht keine neuen Änderungen nach main.

Die geprüfte Spielversion **2c6e92d** wurde über den sicheren Team-Finish auf Arbeitsbranch und GitHub main veröffentlicht und durch erneutes Fetch bestätigt. 41 Tests / 41 bestanden, TypeScript und Produktionsbuild bestanden. Abschließender Dokumentationsnachweis ändert anschließend keine Spiel-/Asset-/Skriptdateien. Die vier zentralen Rootdateien und Kurzbefehle sind die tägliche Arbeitsgrundlage; die frühere Gesamtübersicht darunter ist historisch.

Aktuell: Fahrglättung, gehaltene Mausgesten, ruhigere Karosserie/Radkontakt, gegenlenkbarer Drift, Staub, eigener stilisierter Hund, Straßenmöbel und F-Sprachhupe mit eigener Parodie. Offen: echte historische Fahrer, weitere Grafikqualität, menschliche Hör-/Driftabnahme, frei nutzbare authentische Sprachclips und echte schwache-PC-/Mobil-Abnahme. Details/Belege in den datierten letzten Einträgen und CURRENT-WORKLIST.md. Kein Zurückgehen zur Altengine.

## Historische Gesamtübersicht – 03.10.2026

### Verifiziert

- Aktive neue Projektbasis nach der Verzeichnistrennung: `D:\Diktator-Kart`; Altspiel unter `Diktator-Kart-Legacy/`. Die alte Legacy-Kopie und der bisherige Babylon-Planungsordner werden dort als Sicherungen erhalten. Frühere Pfad-/Statusangaben unten sind historische Einträge.
- Alle 15 Antworten auf die Gesamtprüfung sind dokumentiert, einschließlich der ausdrücklich bestätigten Fähigkeitsauslösung über eigene Eingabe und feste Abklingzeit.

- Die neue Babylon-Wissensbasis liegt direkt in `D:\Diktator-Kart`; der frühere separate Planungsordner ist als Sicherung im Altarchiv erhalten.
- Die Wissensbasis enthält Grundpfeiler, Game Design, Art Direction, Babylon.js-Ziele, Performance, Assets, Multiplayer, Gameplay, KI-Modellstrategie, Roadmap, offene Fragen, Altprojekt-Extraktion, Inhaltsgrenzen und Fahrer-/Itemkatalog.
- Die alten Produktionsdokumente enthalten zwölf Fahrerideen, Kartnamen, Spezialfähigkeiten, Itemideen, Botanforderungen, Drift-/Turboideen und Audioideen.
- Die Itemideen wurden in eine machbare Produktionsmatrix mit Aufwandstufen, Fallbacks und Abnahmeregeln übersetzt.
- M1-Babylon-Technikgrundstand ist implementiert. M2a/b ergänzt ein steuerbares Test-Kart mit Gas, Bremse, Rückwärtsfahrt, Lenkung, Hop, Drift und Mini-Turbo; ein vollständiges Rennen existiert noch nicht.

### Nicht verifiziert

- Fahrgefühl des vorläufigen Modells unter realer längerer Nutzung sowie spätere Kollisions- und Federungsphysik
- reale Performance auf Zielhardware
- endgültige historische Inhaltsauswahl und Symbolik
- Qualität der zukünftigen Sprachaufnahmen und Musik
- tatsächliche Machbarkeit aller historischen Fahrer als veröffentlichbare Figuren

### Offene Hauptprobleme

1. Schwachen PC und Android-Testgerät festlegen und Messplan bestätigen; Windows/Chrome sowie Android/iPhone sind entschieden, iPhone 15 Pro ist benannt.
2. Konkrete Landmarken und Symbolgestaltung der beschlossenen Berlin-/Stadionwelt ausarbeiten.
3. M2-Fahrmodell um Federung, Untergründe und echte Kameras ergänzen sowie mit sechs Fahrzeugen und weiterer Zielhardware messen.
4. Exakte Inhalte und Grenzen der Fahrer-/Itemdarstellung gemeinsam abnehmen.
5. Bestätigten Stil G–L mit einem Fahrer/Kart in drei tatsächlichen Kameras prüfen; kostenlose Asset-/Audioqualität praktisch erproben.
6. Bei neuen Altideen den Katalog ergänzen; frühere pauschale Vollständigkeitsansprüche bleiben zu vermeiden.

## Einträge

### 2026-10-04 (später Nachmittag) – Claude: Karosserien, Proportionen, Bot-Überholen, echte Stimme

`build_kart.py`: sechs `body-<name>`-Varianten (gemeinsame Räder/Kotflügel/Cockpit), Kopf `scale .7` bei z 1.75; `cast.ts` Feld `body`. Haut-PBR mit Translucency/Sheen, Augen mit Clear-Coat. `botInput`: fünf Spuren, Gewichtung langsamer Vordermänner ×3,2, Bremsen nur bei blockierter Zielspur; Vergleichssimulation alt/neu 9/16 Platzwechsel. Echte Stimme: Commons-Datei (PD) nach `.tools/voice-sources/`, Redebeginn 1,11–4,38 s, `build_voices.mjs` schützt `imperator-horn` (REAL-Eintrag). Bilder `docs/evidence/2026-10-04-{individual-bodies,grid-realistic-heads,portraits-realistic}.jpg`. Tests 46/46. Nicht nach main veröffentlicht.

### 2026-10-04 (Nachmittag) – Claude: Drift, Mechaniken, Zeitfahren, Grafik Hoch

Branch `codex/team-marcel-20261004-110953-055`. Drift: `turn = dir·(.38 + .32·steer·dir)`, `driftYawMultiplier 1.05`, Stufen `driftTiers [.6, 1.1, 1.6]` (Turbo 50/75/100 %). Simulation `botInput`-Lenkung mit erzwungenem Drift (Krümmung > .035): 0 Wandkontakte bei 10/13/16 m/s. Windschatten, Trick, Auto-Gas/Lenkhilfe in `main.ts`; Zeitfahren (`mode`, Geist `dk-ghost-v2`, Bestzeit-Schlüssel v2 wegen größerer Karte); Fix: Itemringe bei < 6 Karts. Grafik Hoch: `SSAO2RenderingPipeline` (ratio .5, 16 Samples) + `VolumetricLightScatteringPostProcess` (Sonnenscheibe, nur Tag/trocken). Laufzeitbilder Rennen 6 Karts/fern/Fahrer in `docs/evidence/2026-10-04-*.jpg`; Pane-FPS ~45 (gedrosselter Testbrowser, keine Zielhardware-Messung). Tests 45/45. Nicht nach main veröffentlicht.

### 2026-10-04 (Mittag) – Claude: größere Karte, Kanalsprung, Lenkung

`MAP_SCALE = 1.5` in `src/track-layout.ts` (Kontrollpunkte, Start, Bodenwelle, Abkürzung, Landmarken, Gefahren, Boostflächen, Krater, Itemkisten, Videowand, Tribünen/Park in `build_world.py`); Strecke 890,9 m statt 593,4 m. `stadium-world.blend/.glb` neu gebaut (Blender-Hintergrundlauf ~14 min, ein Kern). Kanalsprung: `CANAL_FROM = 85 × S` vor den Tribünen, Rampe 9 m/1 m (`trackHeightAt`), Flug `.45 + v·.034` s, Landeschub bei sauberer Landung (`landedClean`), sonst Wasser + Bergung. Beleg: Flughöhe 1,77–2,22 m, „Saubere Landung · Schub!“, Screenshot über dem Kanal. Lenkung: `steerRate 9`, `steerReturnRate 18`, `yawResponse 11`, `steeringPerMetre .134`, `maxYawRate 1.68`. Tests 45/45 (Bot-Rundenzeitlimit ×1,5). Hinweis: eingebauter Testbrowser lief stark gedrosselt; Fahrgefühl nicht menschlich abgenommen. Offen: echte Sprachhupen (Plan in CURRENT-WORKLIST.md).

### 2026-10-04 (Vormittag) – Claude: Arbeitslisten abgearbeitet

Projektstart auf `codex/team-marcel-20261004-094440-433` (main `76234f0`). Umgesetzt: `src/damage.ts` (Haltbarkeit/Wrack, Tests `tests/damage.test.mjs`), Wandgleiten in `kart-model.ts`, Finger/Pedale/Spiegel in `build_kart.py`, feste Hände (Handschuhe am Lenkrad, Arm-Ausrichtung) und Vorderrad-Vorzeichen in `slice-scene.ts`, Tag-Nacht/Sterne/Mond/Vögel/Zeitungen/Wrackteile, Glow-Verdeckung (alle Meshes als Occluder), Gefahren `HAZARDS`/`CRATERS` mit Bergung, Boostflächen, Startschub, Zeppelin, Schnellneustart, Videowand-Renderliste (`renderList = scene.meshes`, refresh 3). Belege im eingebauten Browser (Werte/Bilder), 45 Tests + TypeScript grün. Grenzen: Werte vorläufig, kein echter Fahrtest/schwacher PC; Startschub-Timing nur teilweise geprüft (gedrosselter Testbrowser). Nicht veröffentlicht (kein Projektabschluss beauftragt).

### 2026-10-04 (Abend) – Claude: Kader, Fahrerwahl, Maus-Fix, Marsch

**Auftrag (Marcel):** Projektstart; alten Claude-Worktree löschen (Regel „ein Arbeitsordner“ bleibt); offene Punkte selbstständig mit Wow-Effekten abarbeiten bis 95 % Nutzungslimit, dann dokumentieren und veröffentlichen, damit Sarah per Projektstart nahtlos weitermacht. Während der Arbeit nachgereicht: Maus-Kamera reparieren und Versionsgleichheit ChatGPT/Claude klären, Charakterauswahl mit Porträts, Klaviermusik durch strammen deutschen Marsch ersetzen, Porträts weiter herausgezoomt und ohne Schatten, Schäferhund nur bei Hitler und figurenspezifische Wurfobjekte aus unseren Ideen.

**Versionsklärung:** `src/mouse-camera.ts` war seit ChatGPTs Fix `e5152ab` unverändert; `git diff d2e2e41 f784078` zeigte nur Panzeränderungen an `camera.ts`/`main.ts`. Beide Apps arbeiten im selben Ordner `D:\Diktator-Kart`; der Batch-Server meldet Ordner, Branch und Commit. Wahrscheinliche frühere Abweichung: der inzwischen gelöschte Claude-Worktree-Server (Port 4176) zeigte wegen der `.claude/`-Ignorierregel einen alten Stand.

**Maus-Fix:** Die gehaltene Geste brach ab, wenn `requestPointerLock` abgelehnt wird (eingebettete App-Browser, Chrome-Sperre kurz nach Esc). Jetzt läuft sie über Pointer Capture (`pointermove`/`movementX`) weiter; Lock bleibt die bevorzugte Variante. Beleg: synthetische Pointer-Ereignisse ohne Lock drehen die Kamera (Position 60.51/-52.05 → 55.51/-43.92), Rechtsklick schaltet Rückblick, Loslassen stellt zurück. Nicht belegt: echter Test mit Maus in Marcels Chrome.

**Startkader:** `art-source/build_kart.py` erhält Teile `sidepart`, `toothbrush`, `swept`, `walrus`, `pipe`, `chin`, `maohair`, `undercut`, `patrol`, `cigar`; bisherige Haare/Orden/Epauletten/Kragenspiegel als schaltbare Teile (`shorthair`, `medals`, `epaulettes`, `collartabs`). `src/cast.ts`: sechs Figuren mit Altfarben, Kartnamen, Titeln aus docs/14, Haarfarbe, Wurfobjekt. Haarmaterial mit leichtem Glanz. Keine Regimezeichen. Stimmen: Kim/Castro neue männliche Piper-Platzhalter (`kim-*`, `castro-*`), Diva/Admiralin entfernt; übrige Stimmdateien unverändert.

**Fahrerwahl:** `#driver-select` in `index.html`, Logik in `main.ts` (`openSelection`/`pick`/`confirmSelection`, `localStorage dk-driver`), Kader-Umkleidung `setRoster` und Live-Porträts `portraits` (Render-Target-Screenshots mit Studiolicht, Sonnenschatten aus) in `slice-scene.ts`. Revanche behält die Figur. Einmal beobachtet: erste Auswahl startete mit falscher Figur (Kim statt Castro); in zwei Wiederholungen nicht reproduzierbar – bei erneutem Auftreten melden.

**Wurfobjekte:** `item-scene.ts` baut zur Laufzeit einfache Modelle (Traktor, Megafon, Regelheft, Rakete, Aktenkoffer); Schäferhund nur für Hitlers Kart; Fallen bleiben der neutrale Stempel. Quellen: bewegliche Altdetails in docs/14 (Lautsprecher, Regelheft, Aktenkoffer), Kartnamen (Rakete, Fünfjahresplan), Marcels Hund. Stalins Traktor ist abgeleitet und bestätigungspflichtig. Beleg: Castro wirft „Aufklappender Aktenkoffer“ (HUD/Objekt), Kim „Mini-Propaganda-Rakete“.

**Panzer:** Nur Hitler besitzt „Größenbefehl“. `botWantsAbility` lässt den Hitler-Bot bei Gegnern unter 9 m verwandeln; der Panzer hängt am jeweiligen Hitler-Kart. Beleg: als Castro `transform: 1`, Bot-Slot 1 `tankRemaining 7.5`, Q zeigt „eigene Fähigkeit folgt“.

**Musik:** `fig-leaf-rag.mp3` entfernt (Credits/Manifest angepasst). Neu `public/assets/audio/march.wav` (4,5 MB, 103 s, 22 kHz mono) aus `art-source/build_march.mjs`: eigene Komposition, kein Sample. Marcels erster Höreindruck: „lustig, aber nicht wirklich deutsch“ → zweite Fassung strammer (118 bpm, punktierte Rhythmen, große Trommel auf jedem Schlag). Zweite Fassung nicht menschlich abgenommen.

**Wow:** Ziel-Feuerwerk (Partikelpool 1200, vor der Spielerkamera, reduziert bei „Effekte reduziert“), Siegerkarte mit Siegerporträt und Mini-Porträts. Beleg: Screenshots mit sichtbaren Bursts und Porträts.

**Worktree:** `.claude/worktrees/diktator-kart-quality-level-f851c0` aus Git ausgetragen, lokaler Branch gelöscht (war identisch mit main), `parade-tank.glb`-Rohdatei nach `.tools/raw-models` übernommen. Der leere Ordner ist von der Claude-App gesperrt und bleibt (ignoriert). Remote-Branch unverändert.

**Prüfung:** `npm test` 43/43, `tsc --noEmit`, `npm run build` bestanden. Browserproben siehe oben (eingebauter Browser, RTX-Laptop; keine schwache-PC-/Mobilmessung).

**Nachtrag nach Veröffentlichung 253f44e:** Marcels neue Teamregel (gestaffelte Commits/Doku, Pflicht beim Projektabschluss) in AGENTS.md/CLAUDE.md Regel 3 und TEAM-CHANGES.md; keine Spieländerung.

**Zweite Runde (Marcels Auftrag bis 98 % Budget):** (1) `build_march.mjs` neu: preußischer Spielmannszug-Stil, eigene Komposition (Intro Trommelmarsch, A mit Querpfeifen, A/B mit Blech in Oktaven, Trio, Grandioso), 108,6 s, 4,8 MB; Hörprobe offen. (2) Wetter: `weatherChoice` random/sun/rain/snow (`localStorage dk-weather-choice`, URL `?weather=`), Zufall beim Laden 50/25/25; neuer Schnee in `slice-scene.ts` (`setWeather`, 2200 Flocken, Licht/Nebel, `trackWorld.setSnow` mit Emissive-Aufhellung, weißer Reifen-/Landestaub); keine Grip-Änderung. Beleg: Screenshot mit Flocken und frostiger Straße, 2200 aktive Partikel, keine Konsolenfehler. (3) Panzer: `tankWheels` filterte per `/tankWheel-/` auch die gejointen Rad-Meshes und löschte deren Achsrotation → jetzt nur `/tankWheel-[LR]-\d+$/`; Beleg Seitenansicht mit runden Laufrollen. (4) Gesichter: Teile `bignose`, `straightnose`, `flatnose`, `chubby`, Undercut-Hinterkopf, breitere Stirnlocke; Beleg Fahrerwahl-Porträts. (5) Minikarte in Kartfarben. (6) Fahrerwahl-Button „Zufällig“ (wählt stets eine andere Figur; Beleg Hitler→Mussolini→Hitler) und Wurf-Spruch für Nicht-Hitler-Figuren mit 6 s Sprecherpause. (7) Siegerspruch auch für siegende Bots, Rennlabel mit Figurennamen (Beleg „STADION GRAND PRIX · HITLER“, Zielkarte Platz 2 hinter Bot). (8) Tasten 1–6 in der Fahrerwahl (Beleg: 4 → Mao) und Atemanimation des gewählten Porträts (abschaltbar über reduzierte Bewegung). (9) Wurfobjekt-Symbole auf den Fahrerkarten (Beleg 🐕/🚜/📢/📕/🚀/💼) und Bellen des Hitler-Bots in Spielernähe (nicht hörbar geprüft); Rennen ohne Konsolenfehler. 43/43 Tests, TypeScript bestanden.

**Nächster Schritt:** Marcel/Sarah: Maus in Chrome, Marsch anhören, Fahrerwahl und Karikaturen beurteilen, Stalins Traktor bestätigen; danach Gesichter verfeinern und eigene Fähigkeiten der fünf Figuren nach gemeinsamer Entscheidung. ab gemeinsamer Hauptbasis

Ältere Einträge (Planung, M1–M2, Vertical Slice, Qualitätsstufen 2–2d): [Archiv](docs/history/progress-log-2026-10-02-bis-q2d.md).

### 2026-10-03 – Claudes Q2d als gemeinsame Hauptbasis, Starter und Team-Git

**Nutzerauftrag:** Claudes aktuelles Spiel statt altem Starterstand nutzen; bisherigen GitHub-main als Sarah-Stand sichern, ohne alte Inhalte zu übernehmen; neuen main publizieren und einfachen KI-Start-/Abschlussablauf für beide PCs bereitstellen. Zusätzlich ausdrücklich: alte Engine/Altstände nur historische Referenzen, nicht mehr bearbeiten. Konzeptbild-Ladebildschirm als nachgelagerter Auftrag, erst nach dieser Umstellung.

**Ausgang / Sicherung:** Root auf 5f14a2d, Claude-Worktree auf c13d47e; Claude-Spieldateien committet, lediglich lokale .claude/launch.json untracked. Origin https://github.com/marceldamm/diktator-kart.git nach fetch: main e292070; lokales main 2d95e8a divergiert. Vor Umstellung auf GitHub publizierte Archive: archive/sarah-main-vor-babylon-2026-10-03 → e292070, archive/lokaler-main-vor-babylon-2026-10-03 → 2d95e8a, archive/claude-quality-2026-10-03 → c13d47e. „Sarah“ bezeichnet den vom Nutzer genannten bisherigen gemeinsamen Stand; Commitautoren belegen nicht jeden Beitrag als Sarah. Private ungesicherte Dateien auf ihrem PC sind nicht zugänglich und beim ersten lokalen Projektstart dort zu sichern.

**Umgesetzt:** Vollständigen Claude-Baum in codex/team-baseline-2026-10-03 übernommen. Einmaliger ours-Merge 13a123a verbindet origin/main-Historie, ohne dessen alte Spielinhalte zu übernehmen; keine Historie gelöscht/erzwungen. project-state.json kennzeichnet Babylon/mainline und Mindestabstammung c13d47e. Starter arbeitet vom eigenen Hauptordner; HTTP-Identität prüft exakten Root/Edition/Commit statt nur Titel/Manifest. Fremde/alte Server bleiben bestehen, freier Port wird angezeigt. Aktueller Devserver wieder auf 4173 mit neuem Q2d-Spiel. Vite beobachtet ignorierte Tools/Browserprofile/Worktrees nicht mehr. Node-Pakete aus unverändertem Lockfile installiert; npm-Audit 0 Schwachstellen. Ein von Codex stammender alter Preview auf 4174 wurde gezielt beendet, weil er den npm-Bindingtausch blockierte; keine Benutzer-Chrome-Sitzung beendet.

**Teamablauf:** Projektstart/Projektabschluss als zwei Repo-Skills und Batches. Start fetch/Status/Überschneidungen, Sicherung, eigener Arbeitsbranch; alte Arbeit archivieren statt Engine-Code migrieren. Abschluss dokumentierter Commit, normaler Merge, Tests/Build, Branch-Push und Fast-Forward-main mit erneuter Remoteprüfung. Uncommittete Dateien, Konflikte, Testfehler und concurrent main stoppen ohne Datenverlust. Netzwerk/Branchschutz nicht umgehen. Dauerregeln in AGENTS/CLAUDE/README/START-HERE/TEAM-HANDBOOK; Details docs/21, Spiel-/Toolübersicht docs/22. Grundpfeiler 00/08/09/10/11/12/16/18 geprüft und aktuellen Einstieg ergänzt; historische Logs erhalten.

**Erneut verifiziert:** 25 Modelltests und Produktionsbuild bestanden. Sieben isolierte lokale Git-/Startertests bestanden (keine echten GitHub-Testmutationen): Dirty-Schutz, parallele Integration/FF-Publikation, echter Konflikt, Altstand-Archivierung ohne Kopie, concurrent main während Build, Testfehler, Port-/Root-Unterscheidung. Beide Skills bestehen offiziellen quick_validate.py. Starter -CheckOnly erkennt aktuellen Root auf 4173 als denselben Checkout. Browser auf isoliertem Chrome 9226: Menü/Fahrt/drei Kameras/Foto/Pause/Countdown/Szenenneustart mit sechs Karts bestanden, keine Ausnahme. Neue Spielbilder *-team.png. Claudes ausführliche Renn-/Item-/WebGL-/Touchbelege bleiben als dort dokumentierte Ergebnisse erhalten; in dieser Teamumstellung nicht erneut alle wiederholt.

**Messgrenzen:** RTX 3070 Laptop, 1600 × 1000; kurzer F3-Stand 49 FPS/P95 32,5 ms/P99 40,3 ms (kein kontrollierter Dauerlauf). Keine Garantie stabiler 60 FPS. Build-Hauptchunk 2,19 MB/549 kB gzip, Größenwarnung bleibt. Schwache PCs/echte Mobilgeräte, Audiohörqualität, menschlicher Komfort und G–L offen. Videowand kostet Zusatzrenderpass; kein neues Performanceziel beschlossen.

**Geänderte Dateien:** Team-/Startskripte/Batches; project-state.json, vite.config.ts, .gitignore, tests/team-workflow.test.mjs und konfigurierbarer CDP-Port; Repo-Skills; AGENTS/CLAUDE/README/START-HERE/TEAM-HANDBOOK und betroffene Dokumente/Belege. Spielmodelle und Fahrkern aus Claude unverändert übernommen. Der aktive historische Kader ist nicht endgültig produziert; fiktive Figuren bleiben Platzhalter.

**Publikation:** Initiale main-Übernahme vom Nutzer ausdrücklich freigegeben; nach diesem verifizierten Checkpoint normaler Push und Rückprüfung, Basistag babylon-team-baseline-2026-10-03. Keine pauschale zukünftige Altcode-Migration; reguläre aktuelle Teamänderungen werden inhaltlich integriert. GitHub-Erfolg erst nach Rücklesen im Ergebnisbericht bestätigen.

**Nächster Schritt:** Nach bestätigter Hauptumstellung den gewünschten frühen Konzeptbild-Ladebildschirm samt ehrlicher Fortschrittsanzeige bauen. Sarah einmal Initialumstieg aus docs/21 ausführen lassen; danach täglicher Projektstart/Projektabschluss. Regen/echtere Fahrer/Abkürzungsbots bleiben anschließende Produktionswünsche, keine bereits fertigen Features.

**Budget:** Letzte offizielle Abfrage: 12 % Fünf-Stunden-/16 % Wochenverbrauch, kein Reset/Zusatzkontingent. Kein Ruhezustand.

### 2026-10-03 – Konzeptbild-Ladephase nach abgeschlossener Teamumstellung

**Auftrag / Reihenfolge:** Erst Starter/Git/teamfähigen neuen Hauptstand abschließen, anschließend den ungestalteten weißen HTML-Start durch Konzeptmotiv und Ladeanzeige ersetzen. Initiale Hauptumstellung 845c0bf tatsächlich nach GitHub main gepusht, zurückgelesen und babylon-team-baseline-2026-10-03 gesetzt; drei Archive unverändert gesichert. Danach echten Projektstart -Owner Marcel ausgeführt: eigener Branch codex/team-marcel-20261003-195001-659 auf aktuellem origin/main. Keine Claude-Worktree-/Legacy-Änderung.

**Umgesetzt:** Eigenständiges helles G/J-inspiriertes Imagegen-Motiv, PNG-Rasterquelle und Motivauftrag erhalten; nur WebP-Konvertierung, 376.504 Bytes statt 2.734.128 Bytes bei gleicher 1672 × 941 Pixelgröße. Keine kopierte Referenztextur; Konzeptkunst klar beschriftet, keine 3D-Qualitätsbehauptung. Kritisches Inline-CSS sowie vom Babylon-Modul unabhängige Fehler-/Wiederholenhilfe in index.html verhindern den weißen/unformatierten Start. Echte sechs Ladeabschnitte über LoadingProgress und optionale Szenenreporter, keine Timerprozente; Techniklabor zwei Abschnitte. Abschluss erst nach whenReadyAsync und erfolgreichem ersten scene.render; danach wirkliches 3D-Menü. Neustart erzeugt frischen Fortschritt. Modul-/Modellfehler behalten Ladeoberfläche samt freundlicher Meldung, optionalen Fehlerdetails und Reload; langer Start bietet nach 45 s Wiederholen, ohne ihn abzubrechen. Artwork-Fehler belässt lesbaren dunklen Hintergrund.

**Verifiziert:** Zwei neue Unit-Tests für Mehrfachmeldungen/Neustart und Labor ohne importierte Artassets bestanden. Produktionsbuild/TypeScript bestanden, bisherige Größenwarnung unverändert (Hauptchunk 2.192,25 kB / 549 kB gzip). Isolierter Chrome 9226 gegen echten Produktionspreview 4174: initiales Bild bereits bei angehaltenem Spielmodul, übriges HTML unsichtbar, 390 × 844 Layout ohne Überbreite und reduced-motion; Moduldownload unterbrochen → Fehlermeldung → erfolgreicher Retry; echte Fortschrittsfolge 0..6, sechs Fahrzeuge und gerendertes Menü; Hero-GLB unterbrochen → Fortschritt stoppt bei 3/6 → Retry lädt; vollständiger Szenenneustart wieder 0..6; Labor 0..2. Test erzeugt keinen künstlichen Produktions-Ladestopp, sondern pausiert nur Browserrequests für Belege. Rohdaten und tatsächliche Browserscreenshots in docs/evidence/loading-*. Vorherige Teamprobe mit Fahren/drei Kameras/Countdown/Pause bleibt getrennt dokumentiert. Der reale Projektabschluss hat 34/34 Tests einschließlich des erweiterten Startertests und den Produktionsbuild bestanden. 78cf363 anschließend auf Arbeitsbranch und GitHub main normal gepusht und durch fetch/ls-remote zurückgeprüft; Archive und Basistag unverändert. Vollständiger Gatebeleg: docs/evidence/team-final-publication.txt. Der folgende reine Dokumentationscheckpoint ergänzt diese Ergebnisse; Spielcode und Assets entsprechen unverändert dem geprüften 78cf363.

**Zusätzliche Starterkorrektur:** HTTP-Identität unterscheidet jetzt mode=dev/preview; die Batch akzeptiert nur denselben aktiven Entwicklungscheckout, niemals eine möglicherweise veraltete dist-Vorschau, auch nicht mit passendem Root. Der vorhandene Startertest deckt beide Fälle sowie fehlende mode-Kennung ab. Eigene vorherige Dev-/Preview-Testprozesse nach genauer PID-/Elternprozess-Zuordnung geschlossen; kein fremder Server oder Benutzerbrowser beendet. npm ci mit aktuellem Lockfile erfolgreich (38 Pakete, Audit 0), finaler Entwicklungsserver auf 4173. Kein Lockfile geändert.

**Nicht verifiziert / Grenzen:** 390-Pixel-Ansicht ist Chrome-Emulation, keine mobile Geräteabnahme. Keine schwache-PC-/neue FPS-/Audiohör-/G–L-Abnahme. Ladeabschnitte sind unterschiedlich groß und keine Byte-/Zeitprozente. Kunst bleibt Raster-Konzeptillustration, nicht editierbare 3D-Geometrie. Kein absichtlicher Mindest-Ladeaufenthalt; mit warmem Cache kann sie kurz erscheinen. Historische Besetzung und Sarahs kreative Freigaben bleiben offen.

**Geänderte Dateien:** index.html, src/style.css, src/main.ts, scene.ts, slice-scene.ts, neue loading-progress.ts; tests/loading-progress.test.mjs und loading-browser.mjs; art-source/loading-stadium-v1.png/.md und README; public/assets/textures/loading-stadium-v1.webp, manifest/CREDITS; START-HERE und docs/02/19/22/17/evidence. Zusätzlich vite.config.ts/scripts/start-local.ps1 und Starter-Gittest für sichere Dev-/Preview-Unterscheidung. Fahrmodell, Kurs, 3D-Modelle und Audio unverändert.

**Nächster Schritt:** Sarahs einmaliger geschützter Umstieg gemäß docs/21; anschließend täglicher Projektstart/Projektabschluss. Für die nächste Spielproduktion Drawcalls/Ladegruppen und Zielhardware prüfen oder sichtbare Charakter-/Wetterpolitur planen; keine bereits fertigen Wetter-/Charakterfeatures behaupten. Kein Ruhezustand.

**Budget:** Letzte offizielle Abfrage 22 % Fünf-Stunden- und 18 % Wochenverbrauch; mindestens 78 % Rest im maßgeblichen Limit. Kein Reset oder Zusatzkontingent.

### 2026-10-03 – Maussteuerung bewusst per Ziehen

**Auftrag:** Nutzer beanstandet dauernde Kamerabewegung bei freier Maus; erlaubt passendere Belegung statt Linkstaste. Anschließend zusätzlich Fahrt-/Kameraruckeln untersuchen (separates folgendes Arbeitspaket).

**Umgesetzt:** Projektstart auf aktuellem main 3c3ec5f, eigener Branch codex/team-marcel-20261003-202647-623. Rechte Taste halten + ziehen dreht die Kamera, freie Mausbewegung wirkt nicht mehr. Linksklick/E weiterhin Item; X halten Rückblick; Wheel Zoom. Sichtbarer freier Cursor, kein Pointer Lock, Grabbing-Cursor nur während der Geste. Pointer Capture und vollständiges Loslassen bei Release/Blur/Hidden/Menu/Pause/Restart/Viewwechsel. Kamera hält die Richtung während des Haltens, zentriert danach weich statt erst nach zwei Sekunden. Kamera-/Rennneustart löscht alte Look-Offsets.

**Verifiziert:** Produktionsbuild/TypeScript bestanden. Eigener Chrome 9227, 1280 × 800, normale Spielwelt mit einem Kart: alle drei Ansichten ohne Hover-Bewegung, gezielter Drag, mehr als zwei Sekunden stabiles Halten, weiches Zentrieren, X-Rückblick samt Release; Menü und simuliertes Blur lösen Capture; Linksklick erzeugt ausschließlich Item-Eingabe, Maus bleibt ohne Pointer Lock. Keine Runtimeausnahme. Rohdaten docs/evidence/mouse-camera-check.json, Tests tests/mouse-camera-browser.mjs. Kein menschlicher Komforttest oder Hardware-Performancebeleg.

**Geändert:** src/mouse-camera.ts, main.ts/camera.ts/input.ts/style.css, index.html, Browsertest/Beleg, README/START-HERE/docs19/22/17/12. Keine Fahrphysikänderung in diesem Paket.

**Nächster Schritt:** Das vom Nutzer beschriebene kurzzeitige Zurückbleiben/Aufholen bei gerader Fahrt anhand Simulationsschritten, Renderposition und Kamerazeit messen und beheben. Mausarbeit lokal sichern; gemeinsamer Abschluss nach beiden Paketen.

### 2026-10-03 – Darstellung zwischen Physikschritten statt Positionsruckeln

**Auftrag / Ursache:** Nutzer beschreibt minimales periodisches Stehenbleiben/Zurückbleiben von Kart und Kamera bei gerader Fahrt. Belegt im Code: feste 60-Hz-Simulation, Darstellung jeweils des zuletzt fertigen Schrittes; Restzeit ungenutzt. Nicht jede Millisekundenbeschreibung beweist eine einzelne GPU-Ursache.

**Umgesetzt:** src/render-state.ts interpoliert ausschließlich Darstellungswerte (Pose, Lenkeinschlag, Tempo/Federung) zwischen zwei vollständigen Zuständen. main speichert vorherigen Zustand pro Fixschritt, zeichnet Kart/Bots und Kamera aus derselben Pose; Items bleiben auf derselben autoritativen Simulation. Event-/Treffertimer unverändert, große Teleports direkt statt Wandsweep. Neustart/Rennstart setzen Snapshots zurück. __DK.render zeigt alpha/Schrittanzahl/Renderpose. Physikgleichungen/Rennregeln unverändert; bis zu 16,7 ms Darstellungsverzögerung.

**Verifiziert:** Drei neue Modelltests bestehen: konstante Bewegung bei 30/60/90/144 Hz und ungleichmäßigen Zeiten; Anglewrap, Zustand unverändert und diskrete Treffer; Recovery-Sprung. Produktionsbuild/TypeScript bestanden. Eigener Chrome 9227, 1280 × 800, echte Welt/sechs Karts, kurzer freier Geradeauslauf bei 16 m/s: bezogen auf Engine-Schrittdauer sichtbare Geschwindigkeitsabweichung vorher durchschnittlich 2,50 m/s (8,71–19,83 m/s), nachher numerisch ~0 (16,00–16,00). Autoritative Position darf weiterhin in festen Schritten laufen. Rohdaten docs/evidence/drive-pacing-before.json und drive-pacing-after-interpolation.json; Probe tests/drive-pacing-browser.mjs. Zeitstempel nach Renderende sind keine perfekte Display-/VSync-Messung; Enginezeit und Wandzeit bewusst getrennt ausgewertet.

**Grenzen:** Kurze Frame-Wandzeitstichproben weiterhin P95 47 / 42,7 ms bei möglicher gleichzeitig offener Nutzersitzung. Keine kontrollierte FPS-Abnahme, keine Behauptung völlig ruckelfreier GPU-Bildausgabe. Keine menschliche Komfort-/schwache-PC-/Handyabnahme. 60-FPS-Ziel unverändert. Fahrzeugvibrationen werden auf zusätzlichen ausdrücklichen Wunsch als nächstes reduziert.

**Dateien / nächster Schritt:** render-state.ts/main.ts, tests/render-state.test.mjs/drive-pacing-browser.mjs, Browserrohwerte, docs03/04/17/23. Nutzerergänzungen vollständig in CURRENT-WORKLIST.md: endgültige linke Look-/rechte Rückblick-Geste mit temporärer Cursorbindung, weniger Wackeln/Acceleration-Pose, beidseitiges Driftladen und Staub, historische Atmosphären-/Satiredetails, Schäferhund-Verfolger. Danach gezielter Gesamttest/Teamabschluss.

### 2026-10-03 – Aktueller menschlicher Fahrbefund und präzisiertes Modellziel

**Nutzerbefund:** Nach Renderinterpolation wesentlich flüssiger, deutlich besseres Fahrgefühl. Das ist eine menschliche Rückmeldung, keine GPU-/Geräteabnahme. Neuer konkreter Mausfehler: rechter Rückblick bricht sofort ab; links noch kein Umschauen. Aktive Korrektur und Browserregression folgen.

**Zieländerung:** Erkennbare, realitätsnahe Abbilder echter historischer Personen und glaubwürdige Spielwelt gewünscht, insbesondere Hitler statt erfundener Ersatzperson. Die missverständliche Formulierung in der laufenden Liste entfernt; Modellqualität wird nicht als bereits erreicht ausgegeben. README, Art Direction, Roadmap, Fragen/Katalog geprüft und mit ausdrücklicher Präzisierung versehen. Aktueller Stand und Ziel getrennt; Sarahs ursprüngliche Ideen bleiben nachvollziehbar.

**Nächster Schritt:** Mausfehler abschließen, Fahrzeugpose/Drift/Staub, historische Umgebungsdetails, Schäferhund und realitätsnaher Fahrerpass im Rahmen des offiziellen Restbudgets.

### 2026-10-03 – Endgültige Mausbelegung und abgebrochenen Rückblick korrigiert

**Umgesetzt:** Linke Taste frei umsehen, rechte Taste/X Rückblick, E Items. Temporärer nativer Pointer Lock während Halten; Cursor unsichtbar, native Rückkehr an Ursprungsposition. Freiere Rundumsicht/vertikaler Blick; weiche Rückzentrierung, Freigabe an Menü/Blur/Neustart. W3C-belegter Fehler: Lock beendet Pointer Capture; lostpointercapture darf dabei nicht die laufende Geste beenden. Das erklärt und korrigiert den vom Nutzer gemeldeten sofortigen Rücksprung.

**Verifiziert:** tests/mouse-camera-browser.mjs besteht in eigenem fokussierten Chrome 9227: alle drei Kameras, Hover unverändert, linke Geste stabil >2 Sekunden, rechte Rücksicht stabil, Loslassen zentriert; Menü/Fokusverlust lösen Bindung, E bleibt Item. Keine Runtimefehler. Rohdaten docs/evidence/mouse-camera-final-check.json. Nicht behauptet: sichtbare OS-Cursorpixel per Headless überprüft; Wiederherstellung durch native Browser-API, noch Nutzercheck im eigenen Browser.

**Dateien / nächster Schritt:** mouse-camera/camera/main/style, index, Browserregression, README/START-HERE/docs19/22/23/17. Danach Karosserie/Drift/Staub.

### 2026-10-03 – Ergänzung aus laufendem Fahrtest: Sprache und F-Hupe

**Neue Nutzeraufträge:** Unverständliche Wörter/komische Aussprache der gesprochenen Texte überprüfen; weniger statisch/mechanisch, freundlichere Stadionsprecherin. F soll eine individuelle Sprachhupe je Fahrer auslösen. Echte unproblematische historische Mitschnitte erwünscht; Quelle, Identität und Nutzungsrechte vor Verwendung prüfen, keine falsche Authentizität.

**Status:** In CURRENT-WORKLIST.md aufgenommen; nach laufender Fahrzeug-/Driftarbeit bearbeiten. Noch keine Hörprüfung oder Mitschnittfreigabe behauptet.

### 2026-10-03 – Fahrzeug beruhigt, Gegenlenk-Drift und Staub

**Umgesetzt:** Ungefederten Radrahmen von Karosseriepose getrennt. Weniger Roll/Vibration, stabile exponentielle Rückkehr statt unterdämpfter Federschwingung; dezente Beschleunigungs-/Tempo-Haubenhebung, Räder unabhängig auf Terrain. Drift bleibt in Initiierungsrichtung, Gegenlenken öffnet Radius und lädt ebenfalls; Neutral lädt langsamer, Reiseausrichtung/Schlupf begrenzt. Größerer begrenzter Reifenstaub, 150er Pool/reduzierte Effekte.

**Verifiziert:** Produktionsbuild besteht. 16 gezielte Fahrmodell-/Drifttests bestehen, einschließlich beider Richtungen, Gegenlenk-Ladung, Kurvenweite, Turbo-/Bremsfreigabe, Federung und Langlaufkontakte. Near-head-on-Test berücksichtigt bewusst die kleine neue tangentiale Driftbewegung und verlangt >95% Geschwindigkeitsverlust samt Drift/Turbo-Abbruch. Browser, normale Welt/sechs Karts: Radzentren entsprechen Terrain+Radius während Haubenpose; Staub emittiert; echtes W/D/Space/A-Gegenlenken lädt, Richtung bleibt, Release gibt Turbo; Neustart setzt zurück. Rohdaten docs/evidence/drive-polish-check.json, Screenshot drive-polish-turbo-v1.png aus tatsächlicher Szene während Pause nach Turboauslösung. QA-Kart zu Beginn auf klare Gerade positioniert, danach reale Eingabe. Frühere QA-Starts fuhren während Screenshotwartezeit an die Bande; Prüffahrt korrigiert, kein falscher Turbo-Erfolg behauptet.

**Grenzen / nächste Arbeit:** Noch keine menschliche Drift-/Animationsabnahme, keine schwache-PC-Abnahme. Nächster Schritt Schäferhund, Umgebungsdetails, realitätsnaher Figurenpass, Sprache/F-Hupe. Maus bereits e5152ab lokal gesichert.

### 2026-10-03 – Drei verbindliche Team-Arbeitsdateien

**Auftrag / Umsetzung:** Marcel will eine aktuelle Liste, große Langzeitliste und kurzen elementaren Änderungsverlauf statt technischer Überdokumentation. docs23 weitergeführt, docs24 aus Roadmap/Grundpfeilern/Katalog und Nutzerwünschen erstellt, docs25 wenige Teamänderungen. Nachricht an Sarah mit beiden KI-Befehlen/Umstieg/Modellwahl direkt in docs23. Kein Versand.

**Verankert:** AGENTS/START-HERE/README/Handbuch/Framework/Roadmap/Blueprint/Teamablauf und beide Repo-Skills. project-state nennt die drei Dateien; Git-Start/Finish zeigen sie an und prüfen beim neuen Marker ihre Existenz. KI liest/aktualisiert sie inhaltlich; Batch behauptet keine autonome kreative Konfliktlösung. PROGRESS-LOG.md bleibt technische Belegquelle, TEAM-CHANGES.md kurz.

**Verifiziert / Grenzen:** Modellhinweise mit offiziellen OpenAI-Seiten abgeglichen; Sol für qualitäts-/zeitbewusste Arbeit, Astra für schwierige Aufgaben, keine Ranglistengarantie. Beide Repo-Skills mit quick_validate validiert; neue Skriptregression besteht: fehlender Teamverlauf stoppt Veröffentlichung und erhält Remote-main. Die drei Dateien anschließend ohne Nummer in den Hauptordner verschoben, alle aktiven Verweise/Marker/Tests migriert. Öffnen als App-Tabs dreimal angefordert; Tool meldete queued, Anzeige beim Zurückkehren in diese Sitzung. Sarahs tatsächlicher PC/Account noch nicht getestet.

### 2026-10-03 – Editierbarer Schäferhund als Spieler-Item

**Umgesetzt:** Eigener schwarz-brauner Schäferhund in Blender mit spitzer Ohr-/Schnauzensilhouette, Fellflächen, Augen, Halsband, vier Beinpivots und Schwanz. Editierbare .blend, reproduzierbarer Erzeuger, optimiertes GLB 208.808 Bytes. Spieler direct/homing laufen mit Hundedarstellung am Boden; identische unveränderte Itemsimulation, Bots bisherige postalische Formen. Eigener .68-s-Doppelbelllaut, HUD/Hinweise, begrenzte Comic-Trefferwolke. Zwei feste Hundepools, keine Meshallocation beim Fahren.

**Verifiziert:** TypeScript/Produktionsbuild bestanden. Eigener Chrome 9227, normale Welt/sechs Karts, kontrollierte Slots/Positionen: echtes E startet direct/homing, Hundeknoten laufen, bestehende Trefferlogik trifft gezielt auf Pfad positionierten Gegner, Meshzahl konstant; WAV per AudioContext dekodiert, Peak <1. Browserbeleg shepherd-browser-check.json. Keine angebliche menschliche Hör-/Modellrealismusabnahme. Früher direkter Test ohne kontrolliertes Ziel verfehlte bewegten Bot; das beweist keine garantierte Trefferquote. Screenshots stammen aus Spiel, normale Kameras zeigen Hund teils verdeckt/kurz; Nahprüfung ergänzt: shepherd-art-inspection-v1.png zeigt den tatsächlichen laufzeitgerenderten eigenen Hund, pausierte normale Sechskart-Szene mit gezielter Prüfplatzierung/Inspektionskamera. Klar stilisierte Form; kein realitätsnahes Tiermodell behauptet.

**Nutzerwunsch Sichtbarkeit:** Unsichtbaren eigenen Headless-Test-Chrome beendet, sichtbaren isolierten Chrome 9228 geöffnet. Nutzer kann nächste Tests dort verfolgen; bisheriger Nutzerspieltab unverändert.

**Dateien / nächste Arbeit:** build_shepherd.py/blend/glb, Bell-Erzeuger/WAV, item-scene/audio/main, Manifest/Quellen/Browserbelege. Nächste Pakete: historische Atmosphäre/Adler, realistischer Fahrerpass, Sprache/F-Hupe.

### 2026-10-03 – Straßenmöbel und zentrale Startdateien

**Umgesetzt:** Zusätzliche editierbare Litfaßsäulen, originale Plakattypografie/Satire, Haltestellen, Bänke, eigenständiger Adler ohne Regimezeichen; fünf zusammengefasste Materialmeshes. Unveränderte Physikgrenzen. Nutzers Ergänzungen zur Sarah-Nachricht sprachlich geordnet; technischer Detailablauf bleibt docs/21-team-workflow.md, drei zentrale Arbeitslisten liegen im Hauptordner.

**Verifiziert:** Sichtbarer Chrome 9228, normale Welt/sechs Karts; fünf neue Meshes mit Geometrie, keine Browserexceptions. Pausierte tatsächliche Spielszene mit gezielt positionierter Inspektionskamera fotografiert. Erste Bildprüfung zeigte spiegelverkehrte Plakate/verdeckt stehenden Adler; UV-Offset und Platzierung korrigiert, neue Bilder geprüft. Belege period-browser-check.json, period-boulevard-v1.png, period-eagle-v1.png. Build folgt mit Sprachpaket. Keine historische-/Geräteabnahme.

**Offen / nächster Schritt:** Verständlichere Sprachmischung, F-Sprachhupe; realitätsnahe Fahrer bleiben offen.

### 2026-10-03 – Vier-Dateien-Teamablauf und Sprachhupe

**Nutzerauftrag:** Gemeinsame Anleitung/Notizen statt separater Sarah-Nachricht, vier zentrale Tabs, kurze KI-Befehle und Navigation, technische Fortschrittsdatei ohne Nummer. TEAM-NOTES.md enthält geordnete Anleitung für Marcel/Sarah und datierte Notizvorlage. CURRENT-WORKLIST.md auf lesbare Aufgaben/Status gekürzt; technische Belege bleiben hier. PROGRESS-LOG.md aus docs verschoben; aktive Markdownlinks, Skriptgates/Testfixtures und Skills migriert. Vier-Dateien-Pflicht in project-state/AGENTS/START-HERE/Framework/Roadmap/Blueprint/Teamablauf. Legacy unverändert.

**Audio umgesetzt:** F-Eingabekante, 2,5-s-Abklingzeit plus vorhandene Sprachkanalbelegung, kein Hupen in Pause/Menü/Foto. Sechs kurze individuelle eigene synthetische Parodien. Kürzere/freundliche Sprechertexte; weniger Hall/Slap/Drive, größeres Sprachfrequenzband. Piper-WAVs auf .8 Peak normalisiert, damit Browser-Resampling/Mix Puffer behält. Windows-Dateizugriff kurz wiederholbar; erste Regeneration wurde dadurch ordentlich abgeschlossen.

**Verifiziert:** Sichtbarer Chrome 9228: 38 Stimmen geladen; F-Halten/Keyrepeat/schnelle neue Betätigung ergibt einen Clip, nach Abklingzeit zweiten, Pause keinen. Alle sechs Hupeclips dekodiert, 1,66–2,86 s, Peak nach Resampling .80–.82. voice-horn-check.json. Erste Messung hatte durch Resampling Spitzen >1; Quelldateien mit Puffer neu generiert und Test wiederholt, keine Schwelle gelockert. Menschliche Hörabnahme bleibt offen; keine historische Authentizität behauptet. Produktionsbuild bestanden. Beide aktualisierten Repo-Skills mit quick_validate validiert. Alle vier Navigationsheader, lokale Links, Marker und Fortschrittsmigration geprüft. Teamgates folgen beim Abschluss.

**Mitschnitt-Recherche:** Yle belegt das Hitler/Mannerheim-Gespräch 1942 (https://yle.fi/a/20-270673); die betrachtete Archivseite erteilt keine freie Spiellizenz. NARA weist bei Spezialmedien auf unterschiedliche Rechte und Nutzung außerhalb USA hin (https://www.archives.gov/research/motion-pictures/permissions). Keine fremden Tondateien importiert. Authentische harmlose Sprachhupen bleiben ein offener Quellen-/Rechteauftrag.

**Dateien / Grenzen:** root TEAM-NOTES/PROGRESS-LOG und drei Arbeitsdateien, aktive Fachverweise, Skript/Skill/Testverträge; input/main/audio/voice-Erzeuger/WAVs/Index/Credits/Browsertest. Keine PC-Geräteabnahme, keine realitätsnahen Fahrer gebaut. Nächster Schritt Figuren-/Grafikpass nach geordnetem Abschluss.

### 2026-10-04 – Schnellhilfe und diktierte Teamnachrichten

**Marcel ergänzt:** Dateien müssen nicht manuell beschrieben werden. Oben in TEAM-NOTES.md kurze Befehle für Start/Ende, Tagesaufträge, Langfristziele, Notizen und Teamnachrichten sowie Erklärung der drei Batches ergänzt. Projekt Start und Projekt Ende/Projektende als gleichwertige KI-Auslöser in AGENTS/START-HERE und Skills verankert. Nachrichten werden hier für das andere Teammitglied gespeichert und beim nächsten Start gezeigt; gelesen/beantwortet nur nach Bestätigung. Keine automatische externe Zustellung behauptet.

**Verifiziert:** Vier-Dateien-Teamworkflow bestand zuvor alle neun isolierten Git-/Launcherregressionen, einschließlich fehlendem TEAM-NOTES und TEAM-CHANGES. Produktionsbuild und Linkmigration bestanden; Tabs wurden als queued angefordert. Geprüfter lokaler Checkpoint 9d849cb bewahrt vorherige Pakete. Neue Kurzbefehle sind KI-Instruktionen, keine Shellkommandos; tatsächlicher Sarah-PC noch nicht getestet.

### 2026-10-04 – Aktuelle Spiel-/Teamregression vor Veröffentlichung

**Verifiziert:** Neun Team-/Launcherregressionen bestehen: parallele getrennte Arbeit normal zusammenführen, echte Konflikte erhalten, unsichere/alte Arbeit nicht veröffentlichen, fehlende TEAM-NOTES/TEAM-CHANGES stoppen den Push, Remoteänderung während Build stoppen, alter/fremder Previewserver nicht wiederverwenden. Beide aktualisierten Skills validiert; Navigation/lokale Links aller fünf Rootdateien und Marker/Umbenennung geprüft.

**Laufzeit:** slice-browser.mjs auf aktuellem dev-Stand bestanden: normales Menü, nahe/ferne/Fahrerkamera, Fotomodus, echte W-Fahrt, Renncountdown, Pause und kompletter Szenenneustart. Acht neue tatsächliche Screenshots *-drive-polish.png, kein Konzeptbild. final-six-kart-browser.mjs: sechs tatsächliche bewegte Demo-Rennteilnehmer, 1600x1000, je 300 rAF-Bilder nach 1,5-s-Aufwärmen in allen drei Kameras; 967 Meshes konstant, alle Positionen/Geschwindigkeiten endlich, Spieler legt >250 m zurück. Verfolger nah: P50/P95/P99 16.7/16.8/33.4 ms; Verfolger fern: P50/P95/P99 16.7/16.8/16.8 ms; Fahrerperspektive: P50/P95/P99 16.7/16.8/16.9 ms. Raw final-six-kart-load.json. Kurzer Lastlauf, keine volle Drei-Runden-/Kaltlauf-/schwache-PC-/Mobil-Abnahme. Keine Screenshots oder Builds während der Messfenster. Chrome-Fokusemulation hält die Tests bei verdecktem Fenster aktiv; deshalb keine unbedingte menschliche FPS-Abnahme.

**Artprüfung:** Eigenen sichtbaren Chrome wiederhergestellt; erste Nahprüfung bei verdecktem Fenster zeigte nur die alte Szene, nicht den injizierten Hund. Nach bestätigter laufender Rennphase/Fokusverwaltung neu aufgenommen: shepherd-art-inspection-v1.png zeigt tatsächlich den stilisierten Schäferhund. Nicht als realitätsnahes Tiermodell bezeichnet. Straßenmöbelbilder und normaler Fahrerblick nochmals angesehen; reale historische Fahrer und G–L-Qualität bleiben unerreicht.

**Abschluss:** Funktionierender Checkpoint 9d849cb; aktuelle Schnellhilfe/Belege werden zusätzlich lokal gesichert. Team-Finish holt vor Veröffentlichung aktuellen main und führt die volle Test-/Build-Prüfung aus. Ergebnis erst nach tatsächlichem Remotevergleich als veröffentlicht melden. Nächste Aufgabe: erkennbare historische Fahrer, höherwertige Welt/Materialien; Stimme menschlich anhören, Quellen für echte Sprachhupen klären.

### 2026-10-04 – Geprüfter Teamabschluss veröffentlicht

**Tatsächlich gesichert:** scripts/team-workflow.ps1 -Action Finish -Owner Marcel beendet mit Exit 0. 41 Tests bestanden, 0 Fehler; tsc/Vite-Produktionsbuild bestanden. Aktueller Remote-main vor dem Abschluss war 3c3ec5f, keine parallele Änderung erkannt. Arbeitsbranch und main regulär (kein Force-Push) auf **2c6e92d0e9afa25b8ff979bc5c7b5ac724fb0ead** veröffentlicht; erneutes Fetch bestätigt HEAD = origin/main. Reproduzierbarer Konsolenbeleg lokal .tools/team-finish-20261004.log (nicht ins Repository hochgeladen).

**Erhalten:** Sarahs angeforderter Alt-Hauptstand e292070, lokaler Alt-main 2d95e8a und Claude-Qualitätsstand c13d47e bleiben auf ihren unveränderten GitHub-Archivbranches. Das beweist keine Sicherung von Sarahs nur lokal/unveröffentlichten Dateien. Legacy-Verzeichnisse unverändert. Arbeitsbranch bleibt erhalten; lokales main wird nur per Fast-Forward aktualisiert, sofern nicht anderswo aktiv.

**Rest / Grenze:** Benutzer-/Geräte-/Hörabnahmen bleiben offen; G–L und realitätsnahe historische Fahrer sind noch nicht erreicht. Build meldet weiterhin großen ~2,2-MB-Hauptchunk, keine stillschweigende Performance-Abnahme. Vier App-Tabs angefordert, Toolstatus queued; Öffnung beim Zurückkehren zur betreffenden Codex-Sitzung, keine sofortige Anzeige behauptet. Offizieller Limitstand zuletzt 82% Fünf-Stunden / 27% Woche verbraucht, Abschluss-Puffer genutzt; keine Resets/Zusatzkontingente.

**Nächster Schritt:** Projekt Start. Danach erste erkennbare historische Fahrerproduktion und nächster Grafikpass; Sprecherin/F-Parodie im Fahrtest anhören, konkrete Aussprachefehler notieren. Abschließende Arbeitslisten-/Veröffentlichungsnotiz als dokumentationsreiner Folgcommit, Spiel-/Asset-/Skriptstand bleibt der oben geprüfte.

### 2026-10-04 – Dauerhafte Budgetregel und Sarahs Erstumstieg

**Befund:** 15-/5-Prozent-Regel war lediglich in älterem START-HERE-Sitzungsabschnitt enthalten, nicht eindeutig allgemeiner Startvertrag. Auf Marcels Auftrag nun für beide in AGENTS/START-HERE/Handbuch/Skills und kurz oben in TEAM-NOTES verankert: aktuelle eigene offizielle Kontowerte, kleinerer Rest, Checkpoints und Abschlussreserve, fehlende Werte einmal erfragen, keine Resets/Zusatzkosten.

**Erstumstieg:** Marcels ausdrücklich beauftragte Nachricht und kurzer selbsttragender Prompt mit Repositoryadresse in TEAM-NOTES. Lokales Bewahren plus einmalig ausdrücklich autorisierter neuer GitHub-Archivbranch; Archivverifikation, Herkunftsdokumentation der Ideen, keine Altengine-Integration; vier Tabs/Zweckerklärung/Nachricht anzeigen. Skills/Teamablauf zwischen gewöhnlichem lokalem Projektstart und diesem expliziten Archiv-Push unterschieden. Sarahs PC/Dateien nicht zugänglich; nicht als migriert oder gesichert behauptet.

**Prüfung / Veröffentlichung:** Reine Markdown-/Skill-Instruktionsänderung, Spiel/Skripte/Tests unverändert zum geprüften 41-Test-Stand. Alle vier Navigationsheader/lokalen Links und der Marker geprüft; beide angepassten Skills mit quick_validate bestanden. GitHub-Publikation dieser Anleitung erfolgt als regulärer Dokumentationscommit mit Remotevergleich; aktuelles main bleibt einzige aktive Spielbasis.

### 2026-10-04 – Sarahs Panzerfähigkeit „Größenbefehl“ wiederhergestellt (Claude)

**Auftrag:** Marcel: Sarahs belegte Hitler-Panzerverwandlung professionell im Babylon-Spiel wiederherstellen (Q, vorläufig 8 s Dauer, 18 s Abklingzeit), editierbares Modell, Ketten, Verwandlung, Ton, Staub, HUD, kontrolliertes Wegstoßen mit Schutzregeln; Rückverwandlung, Neustart, sechs Karts, alle Kameras im Browser prüfen.

**Umgesetzt:** `src/abilities.ts` (gemeinsame, testbare Regeln; Name, 8 s/18 s und 2,4 s Verlangsamung aus Archiv e292070; Abstände/Impulse neu für die Babylon-Welt), neue Zustandsfelder `tankRemaining`/`slowRemaining`, Item-Treffer auf den Panzer nur mit leichter Bremsung, Q im Training und Rennen (nicht im Countdown/Menü/Foto). Editierbares Modell `art-source/build_tank.py` → `parade-tank.blend/.glb` (Rumpf, Schürzen, 7 Laufräder je Seite, UV-Kettenbänder, Turm mit Luke, Rohr, Messingtrichter, fiktives Lorbeer-§-Emblem, keine Regimezeichen). Laufzeit: Rauchstoß, federndes Aufpoppen, Fahrer steigt in die Luke, laufende Ketten/Räder, Kettenstaub, Überroll-Staub, weitere Kamera, Lukenblick in der Fahrerperspektive; HUD-Karte mit Zustand/Leiste; Original-WAVs für Verwandlung, Überrollen, Motor.

**Verifiziert:** 43 Modelltests (2 neue Fähigkeitstests). Echter Browser mit sechs Karts (`tests/slice-tank.mjs`, headless und sichtbares Chrome): Q verwandelt, ein Gegner überrollt, Rückverwandlung nach 8 s mit wieder sichtbarem Kart, zweites Q während Abklingzeit blockiert, Neustart setzt „Panzer bereit“; Bilder nah/fern/Fahrer/zurückverwandelt `docs/evidence/slice-tank-*-q3.png`.

**Nicht verifiziert:** menschliches Fahrgefühl des Panzers, Hörprobe der neuen Klänge, Bots mit Fähigkeiten (noch keine), Balance. Spielerfigur ist weiterhin der neutrale „General“-Platzhalter; erkennbarer historischer Fahrer bleibt offen.

### 2026-10-04 – Regen und einheitlicher Arbeitsordner (Claude)

**Umgesetzt:** Wetteroption Sonne/Regen (persistiert, `?weather=rain`): gedämpfte Sonne, graublaue Himmelsaufhellung, dichter Dunst, nasse Pflaster/Promenaden (dunkler, Rauigkeit 0,32/0,4), zehn Pfützen auf der Fahrlinie mit Spritzern sowie Wasserbremse und Grip-Verlust, Regenschlieren um die Kamera, Blitze alle 9–23 s mit verzögertem Donner, Regenschleife (originale WAVs aus `build_audio.mjs`). Arbeitsordnerregel in `docs/21-team-workflow.md`.

**Verifiziert:** 43 Modelltests, Typecheck. Batch-Server (Hauptordner, Port 4173) mit `?demo=1&weather=rain`: Option „Wetter Regen“, Rennen läuft, 2 365 aktive Regenpartikel, Spielbild betrachtet. Ursache früherer Standabweichung gefunden: `vite.config.ts` ignoriert `.claude/`; Worktree-Server lieferte alte Dateien.

**Nicht verifiziert:** Hörprobe Regen/Donner, menschliches Fahrgefühl in Pfützen, Leistung auf schwachen Geräten mit 3 600 Regenpartikeln/s. Wolkenschatten noch nicht gebaut.

### [JJJJ-MM-TT] – [Sitzungstitel]

**Ziel:**

**Modell / Arbeitsmodus:**

**Erledigt:**

**Verifiziert:**

**Nicht verifiziert:**

**Geänderte Dateien:**

**Neue Entscheidungen:**

**Offene Probleme:**

**Nächster Schritt:**

**Empfohlenes Modell:**
