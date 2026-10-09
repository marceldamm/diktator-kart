# Echte Laufzeitbelege des Stadion-Slices

## 08.10.2026 – Tripo-Sowjetoffizier: lokaler Blender-Assettest

`soviet-officer-inspection/front.png`, `threequarter.png` und `side.png` zeigen den unveränderten Import vor dem Auftrennen. `kart-front.png`, `kart-threequarter.png` und `kart-profile.png` zeigen den lokalen statischen Rig-/Sitzversuch neben dem tatsächlichen Stalin-Limousinen-Kartmodell. Alle sechs Dateien sind Blender-Assetvorschauen, **keine** Babylon-Laufzeit- oder Bewegungsbelege.

Das GLB enthielt einen Mesh-Knoten mit 831 getrennten Flächeninseln und ohne Skin/Animation. Daraus wurden drei benannte Teile exportiert. Der lokale Sitzprototyp nutzt ein abgespecktes Rigify-Metarig mit manuell berechneten Knochengewichten, weil Blenders automatische Gewichte bei dieser Geometrie scheiterten. Mütze und Umhang sind im Bild platziert; der starre Umhang überschneidet noch Sitz/Unterboden und braucht eine spätere Stoff-/Kollisionslösung. Gesichts-/Körperdeformation, Hände/Füße, Bewegung und Laufzeitintegration sind nicht abgenommen. Der aktive Fahrer bleibt unverändert.

Die Quelle und die 3D-Arbeitsdateien liegen lokal in der ignorierten `.tools`-Ablage und werden hier nicht verteilt. Marcel gab einen bezahlten Tripo-Tarif an; Tripo beschreibt für bezahlte Ausgaben Nutzungs-/Änderungs-/Verteilungsrechte, verlangt aber eigene Rechte an verwendeten Eingabereferenzen: [Tripo-Hilfe zu kommerzieller Nutzung](https://www.tripo3d.ai/help/privacy-policy/how-to-use-tripo-models-commercially). Vor öffentlicher Asset-Verteilung bleiben der konkrete Kontostatus und die Eingabereferenz zu belegen.

## 08.10.2026 – Hände, Gesichter, Fahrerwahl (Claude)

Branch `claude/project-thread-93qjup`, Dev-Server `127.0.0.1:4173`, sichtbares CDP-Chrome (Port 9231). `hands-straight/left/right-20261008.png`: feste QA-Kamera vor dem Spielerkart, Hände folgen dem Lenkrad; `hands-bot3-straight-20261008.png` Mao-Bot; `hands-chase-race-20261008.png` normale Rennansicht. `faces-blender-before/after-20261008.png`: Blender-Porträts aller sechs vor/nach `driver_faces.py` (Hitler unverändert). `faces-select-20261008.png` und `r74-game-select-20261008.png`: Fahrerwahl mit echten Porträts. Grenzen: Kartenlicht färbt Haut orange; keine Ähnlichkeitsabnahme.

## 07.10.2026 – CC0-Hitler-Gesichtspass (Codex)

[Belegordner und Quellen](hitler-face-20261007/README.md): feste Blender-Front-/Dreiviertel-/Profilbilder als **Assetvergleich**, tatsächliches Grand-Prix-Kart als Sitzdiagnose und kurze sichtbare Chrome-Spielprobe. Historische Ähnlichkeit, Kleidung und Kontakte bleiben offen. Runtimebild stammt vor der letzten Hautfarben-Exportkorrektur; finaler Tint technisch geprüft, nicht visuell auf diesem Runtimebild bestätigt. Blender-Vordergrundwunsch ausdrücklich zurückgenommen, Hintergrund-Einzelbilder bleiben bevorzugt.

## Belegregeln für künftige Pakete

- Laufzeitbilder müssen aus dem tatsächlichen Babylon-Spiel in einem sichtbaren Chrome-Fenster stammen. Studio-, Konzept-, Headless- oder abweichende Testszene-Bilder sind keine Runtime-Abnahme.
- Vor Änderungen nur dann eine Ausgangsaufnahme anlegen, wenn sie den sichtbaren Unterschied eines größeren Pakets nachvollziehbar macht. Danach eine gezielte Nachheraufnahme bzw. kurze Bewegungsfolge sichern; nicht jede Kleinigkeit bebildern.
- Für einen brauchbaren Vergleich Szene, Fahrer, Kamera/Abstand, Wetter, Viewport und Grafikstufe möglichst gleich halten. Beschreibe Abweichungen und Grenzen.
- Zu jedem neuen Beleg Datum/Uhrzeit, Datei, Zweck, Runtime-URL und wenn verfügbar Branch/Commit aus `/__diktator/status` angeben. Erst prüfen, was vorhandene Bilder zeigen und wie alt sie sind; das zuletzt gespeicherte Bild muss nicht zum neuesten Code gehören. Historische und Vorher-Bilder entsprechend kennzeichnen.
- Bei fehlendem Runtime-/Commitnachweis keine aktuelle visuelle Abnahme behaupten. Technische Tests, sichtbare Wirkung, menschliches Qualitätsurteil und Leistungsmessung getrennt bewerten.

Der Prozess für Selbstprüfung gegen Detaildrift und für das Beobachten eigener Browser-/Buildlast steht in [docs/21-team-workflow.md](../21-team-workflow.md).

## 07.10.2026 (Folgelauf) – Themen, Havanna, Gesichter (Claude)

Gleiche Bedingungen wie unten (eigenes sichtbares Chrome, CDP 9231, 1600×1000). `rome2-*`: neuer Duce-Drom (Fotomodus, Kart per Diagnose versetzt). `hav-*`: Havanna-Ansichten. `medals-duce-drom-*`: Orden im Rennen. `drivers-before/after/compare-*`: Fahrerwahl vor/nach dem Gesichtspass. `timetrial-ghost-*`: echtes Zeitfahren mit Geist. `gp-*-gp3-*`: Grand Prix über drei Strecken.

## 07.10.2026 – Duce-Drom, Live-Rangliste, Grand Prix (Claude)

Sichtbares, eigens gestartetes Chrome-Fenster (CDP 9231, 1600×1000, RTX-3070-Laptop von Marcel), Vite-Dev-Server `http://127.0.0.1:4173/`, Branch `codex/team-marcel-20261006-214551-132` auf Basis `110fa15` mit den ungesicherten Änderungen dieses Laufs. `demo=1` lässt den Spielerkart vom gemeinsamen Bot-Regler fahren (keine menschliche Fahrprobe); Wetter Sonne.

- `rome-first-load-20261007.png`: erster Start auf dem Duce-Drom (Circus-Gerade, Startportal, Tribünen, Pinien).
- `rome-countdown-20261007.png`: Einzelrennen-Countdown mit Einleitungskarte und Live-Rangliste rechts.
- `rome-race-0…7-20261007.png`: Rennverlauf alle 15 s (u. a. Abfahrt zum Tiber-Kai `rome-race-2`, Balkonrede-Meldung und Rangliste `rome-race-5`).
- `rome-finish-20261007.png`: Ziel mit vollständiger Ergebnisliste, Rangliste mit Zielhäkchen.
- `gp-*-20261007.png`: Grand Prix über beide Strecken – Fahrerwahl, Countdown, Rennen und Zwischen-/Gesamtwertung je Runde.
- `gp-*-final-20261007.png`: Schluss-Regression nach Rivalenstilen, Tastenbelegung, Ansagen, Pose/Blockade und Grafik-Startwert (Commit `d8f7337`).
- `rome-view-*-20261007.png`: gezielte Ansichten (Triumphbogen, Balkonpalast, Belvedere, Tiber-Kai, Meta-Kehre) im freien Training, teils Fotomodus.
- `options-keymap-20261007.png`, `ability-pose-20261007.png`, `ability-blockade-20261007.png`: Tastenbelegung und neue Fähigkeiten.

**Archivhinweis zum folgenden Bestand:** Die nachfolgenden datierten Einträge beschreiben frühere Aufnahmen und Prüfläufe, keine pauschal aktuelle Sicht des Spiels. Zum Beispiel ist `slice-first-inspection-quality-1005f.png` eine ältere Browseraufnahme; ihr Dateidatum liegt vor dem später erneuerten `hero-kart.glb`. Verwende sie nur als historischen Vergleich. Für Aussagen über den aktuellen Fahrer-/Fahrzeugstand ist ein frischer sichtbarer Lauf mit bestätigtem Runtime-Commit erforderlich.

## 05.10.2026 – aktueller Runtime-/Modellpass

| Datei | Aussage / Grenze |
|---|---|
| `slice-first-inspection-quality-1005f.png` | Echter Spielstart im headless Chrome nach GLB-Neubau und größerer gemeinsamer Kopfskalierung. Belegt, dass Szene und Modell laufen; zeigt Stalin nicht nah/seitlich und nimmt weder seine Radkappen noch Fahrverhalten visuell ab. |
| `slice-stadium-near-quality-1005d.png`, `slice-stadium-far-quality-1005d.png`, `slice-stadium-cockpit-quality-1005d.png` | Drei statische Browseransichten der vorherigen Assetrevision: Nähe, Verfolger fern und Fahrerperspektive. Sie prüfen grob Umgebung/Kamera, keine echte menschlich gefahrene Bewegung. |
| `slice-hero-photo-quality-1005b.png` | Fotoansicht der vorherigen Assetrevision bei dunkler Lichtstimmung; Umgebungs-/Fahrzeugkomposition, keine fertige Charakterabnahme. |

Es gibt **keinen** verwendbaren Laufzeit-Nahbeleg für Stalins am 05.10. erneuerte Mütze und Radkappen: der Software-Renderer zeigte nach dem langsamen Porträtlauf eine leere Fläche. Das wird nicht als Spielbild geführt.

Der neuere 05.10.-Pass ergänzt `cast-stalin-nose` als eigenen Nasenbaustein und enthält ihn im optimierten Runtime-GLB. `tests/cast.test.mjs` bestätigt die Knoten-/Cast-Zuordnung; ein aktuelles In-Game-Nahbild für Feldmütze, Nase und Radkappen fehlt noch. Ein isolierter Blender-Render wird nicht als Laufzeitbeleg verwendet, weil er die Cast-/Materialaktivierung des Babylon-Rigs nicht abbildete.

`stalin-limousine-windscreen-asset-preview.png` ist eine getrennte Blender-Studioansicht des Stalin-Casts und seiner Limousinenvariante. Sie dient der Quelldetailkontrolle und ist ausdrücklich keine Babylon-Laufzeitaufnahme. Die Echtzeit-Profil-/Nah-/Bewegungsansicht bleibt offen.

## Früher Konzeptbild-Ladebildschirm – 03.10.2026

loading-early-desktop.png / loading-early-mobile.png zeigen den tatsächlich geöffneten Ladebildschirm bei pausiertem Spielmodul (Konzeptillustration, nicht Spielgrafik). loading-real-progress.png zeigt echte 3/6 abgeschlossene Ladeabschnitte bei pausiertem Hero-Download. loading-module-error.png / loading-asset-error.png zeigen echte abgebrochene Requests und bedienbare Fehleranzeige. loading-to-real-menu.png zeigt danach die gerenderte Babylon-Szene. Rohdaten: loading-browser-check.json; reproduzierbare Probe tests/loading-browser.mjs gegen Produktionspreview 4174 mit isoliertem Chrome 9226, CDP_PORT/SLICE_URL konfigurierbar. Desktop 1600 × 900, schmale Ansicht 390 × 844 emuliert; keine Handy-/Performanceabnahme.

03.10.2026. Die PNGs stammen aus dem lokal laufenden Babylon-Spiel in isoliertem Chrome. Keine Konzeptbilder als Spielaufnahmen. Modell-, Fahrer-, Zuschauer- und Stilstände sind weiterhin vorläufig.

## Team-/Starterumstellung – erneute Laufzeitprobe

Suffix -team: aktueller Hauptordner mit vollständig übernommenem Claude-Q2d. Menü, drei Kameras, Foto, Fahrt, Countdown und Neustart erneut geprüft; keine Browserausnahme. slice-main-menu-team.png und slice-boulevard-driving-team.png zeigen diesen Stand. slice-six-kart-diagnostics-team.png enthält das kurze F3-Fenster (49 FPS, P95 32,5 ms auf RTX); keine Endurance-/Zielgeräteabnahme. Team-/Portfälle wurden zusätzlich mit lokalen Test-Repositories geprüft; Details docs/17 und docs/21.

## Qualitätsstufe 2 (03.10.2026) – Claude-Belege

Alle Bilder aus dem laufenden Spiel (isolierter Chrome, RTX 3070 Laptop, 1600 × 1000), Suffix `-q2`.

| Bild | Inhalt |
|---|---|
| `slice-main-menu-q2.png` | Menü vor der echten Szene: General mit Schirmmütze, Epauletten, Umhang; neues Kart. |
| `slice-race-midway-q2.png`, `slice-boulevard-driving-q2.png` | Laufendes Sechs-Kart-Rennen, nahe Verfolgerkamera. |
| `slice-race-far-q2.png`, `slice-stadium-far-q2.png` | Ferne Verfolgerkamera mit Strecke und Welt. |
| `slice-race-cockpit-q2.png`, `slice-stadium-cockpit-q2.png` | Fahrerperspektive (nach Kamerakorrektur siehe `slice-stadium-cockpit-q2.png`). |
| `slice-drift-feedback-q2.png`, `slice-turbo-feedback-q2.png`, `slice-hop-feedback-q2.png`, `slice-boundary-feedback-q2.png` | Echte Tastatureingaben: Drift mit Reifenspuren, Turbo, Hop, Bande. |
| `slice-items-in-race-q2.png`, `slice-item-race-result-q2.png` | Items im Rennen und Ergebnis. |
| `slice-race-finish-q2.png` | Echter Drei-Runden-Zielstand mit sechs Zeiten. |
| `slice-forced-webgl1-q2.png`, `slice-automatic-webgl1-q2.png`, `slice-touch-landscape-q2.png` | WebGL1-Pfad und Touch-Emulation (kein echtes Gerät). |

JSON: `slice-production-race-rtx-q2.json` (Rennen, Revanche, Framefenster), `slice-item-race-q2.json`, `slice-feedback-q2.json`, `slice-compatibility-q2.json`, `slice-touch-emulation-q2.json`. Menü-, Kamera-, Feedback-, Renn-, Item- und WebGL1-Bilder wurden mit dem finalen Kart (Heckverkleidung, Commit nach `dd7a1f2`) neu erzeugt; nur das Touch-Bild stammt aus einem früheren Lauf derselben Sitzung.

## Vorheriger Slice – Aktuell ansehen (historisch)

| Bild | Inhalt |
|---|---|
| `slice-main-menu-v18.png` | Menü vor der echten 3D-Szene: Hero-Kart, neutraler Fahrer und Kartvarianten. |
| `slice-race-stadium-v18.png` | Tatsächlich laufendes Sechs-Kart-Rennen, nahe Verfolgerkamera; unmodifizierter Demo-Controller. |
| `slice-stadium-cockpit-v18.png` | Reales Kart mit sichtbaren Händen, Lenkrad und Vorderrädern. |
| `slice-stadium-far-v18.png` | Ferne Verfolgerkamera, Strecke und Teilnehmer. |
| `slice-race-finish-v16.png` | Echter Drei-Runden-Zielstand mit sechs Zeiten und korrigiertem gleichen Rang in HUD/Ergebnis. |
| `slice-hop-feedback-v15.png`, `slice-drift-feedback-v15.png`, `slice-drift-cockpit-v15.png`, `slice-turbo-feedback-v15.png`, `slice-boundary-feedback-v15.png` | Tatsächliche Tastatureingaben auf dem Stadionring mit einem Kart. Nur zum lesbaren Bild festgehalten/pausiert, keine eingespritzten Physikzustände. |
| `slice-touch-landscape-v17.png` | Chrome-Touch-Emulation 932 × 430. Kein echtes Handy. |
| `slice-forced-webgl1-v17.png`, `slice-automatic-webgl1-v17.png` | Sechs GLB-Karts auf WebGL1, erzwungen bzw. nach gesperrtem WebGL2. Gleiches RTX-Gerät. |

`slice-final-capture.json` dokumentiert den finalen Rennbildzustand. `slice-feedback.json`, `slice-compatibility.json`, `slice-touch-emulation.json` enthalten die jeweiligen Funktionsbelege.

## Leistung richtig lesen

### 06.10.2026 – Stadion-TV-Zweitkamera als Ruckelursache

Der sichtbare kontrollierte [Feed-an/aus-Vergleich](performance-broadcast-feed-ab-20261006.json) maß bei identischer Sechs-Kart-Szene in der Startzone P95 rAF 83,2–83,4 ms und 2.385 Drawcalls mit TV-RenderTarget gegenüber 16,8 ms und konstant 1.494 Drawcalls ohne den Zusatzpass. Weitere Effekte, Route, Regen und Audio sind in den zugehörigen `performance-*-20261006.json` belegt. Der spätere [Frustum-Lauf](performance-broadcast-feed-frustum-fix-20261006.json) pausierte den Feed nur offscreen. Nachdem Marcel Ruckeln beim Umdrehen bestätigte, wurde die TV-Zweitkamera vollständig entfernt. Ein sichtbarer Grand-Prix-Lauf bestätigte das statische Motiv auf dem Bildschirm; ein neuer Framezeitvergleich und Intel-UHD-Abnahme sind offen.

`slice-controlled-pacing.json`: Produktionspreview, RTX 3070 Laptop, 1600 × 1000, sechs Karts, normales Drei-Runden-Rennen. 14 Fenster, gewöhnlich 300 requestAnimationFrame-Intervalle; letztes Fenster 115 bis Ziel. Kamerawechsel mit 1,5 s Abstand. Keine Screenshots und kein Asset-Build während dieses Laufs. Erste Standardfenster P95 37,4 / 66,7 / 33,5 ms; spätere überwiegend 16,8–19,2 ms. Basisfenster nach Revanche 18,2–18,4 ms. Stabiler 60-FPS-Start ist damit nicht abgenommen. CPU/GPU/Drawcalls sind einzelne Frame-Stichproben, keine Fenster-Mediane. Dieser Messlauf liegt vor dem anschließend ergänzten initialen Scene-Ready-Gate; dessen Start-/Kamerafunktion wurde mit v18 geprüft, eine Verbesserung der vollständigen Kaltlauf-Perzentile ist nicht belegt.

`slice-production-race-rtx.json`: funktionierender echter Produktions-Rennlauf mit Ergebnis/Revanche. Blender lief während eines Teils dieses Laufs; seine FPS-/Endurancewerte sind verfälscht und gelten nicht als abschließende Leistungsmessung.

`slice-final-race-rtx.json`: früherer Architekturpass v11 mit korrekten Drawcalls, aber noch vor letzter Schatten-/Ready-Korrektur. `slice-full-race-rtx.json`: älterer Lauf; damalige Drawcalls waren kumuliert und dürfen nicht als pro-Frame-Werte verwendet werden. Diese historischen Dateien bleiben erhalten.

Ein 60-FPS-F3-Standbild ersetzt keinen Kaltlauf. RTX, Headless und Touch-Emulation ersetzen keine normale/schwache PC-, Android-, iPhone-, Hör- oder menschliche Komfortabnahme. G–L bleibt ein wesentlich höheres Qualitätsziel.

## Fahrtest-Ergänzungen und Teamablauf – 03.10.2026

Aktueller technischer Nachweis in [PROGRESS-LOG.md](../../PROGRESS-LOG.md). mouse-camera-final-check.json und drive-polish-check.json belegen Maus/Drift/Radkontakt; shepherd-browser-check.json die bestehenden Itemtreffer mit Hundendarstellung. shepherd-art-inspection-v1.png zeigt das eigene stilisierte Hundemodell in der tatsächlichen pausierten Sechskart-Welt mit QA-Platzierung/Inspektionskamera. period-boulevard-v1.png/period-eagle-v1.png sind entsprechende Artinspektionen der zusätzlichen Straßenmöbel. voice-horn-check.json belegt F-Abklingzeit/Clipdekodierung, keine Hörabnahme oder historische Mitschnitte. Keine schwache-PC-/Mobil-Abnahme.

*-drive-polish.png: aktuelle normale Kameras, Menü, Fahr-/Countdown-/Neustartregression (slice-browser PASS). final-six-kart-load.json: bewegter aktueller dev-Sechskart-Lastlauf über drei kurze Kamerafenster, konstante 967 Meshes; keine Drei-Runden-/Kaltlauf-/Geräteabnahme.

## Redesign 06.10.2026 (Claude-Nachtlauf)

Gleiche Bedingungen für Vorher/Nachher: sichtbares Chrome 154 (eigenes CDP-Profil), 1600 × 1000 CSS-Pixel, `?demo=1&weather=sun`, Fahrerwahl Hitler, Verfolger nah, Bilder 9 s nach Rennstart und dann alle 9 s.

- **Vorher (Commit `8e3a6e9`, vor jeder Änderung):** `before-redesign-race-start/-a/-b/-c/-d-20261006.png`, Übersicht `before-redesign-contact-20261006.png`, Fahrerwahl `before-redesign-menu-20261006.png`, Metadaten `before-redesign-20261006.json`.
- **Nachher (Redesign-Stand, Commit siehe PROGRESS-LOG):** `after-redesign-race-start/-a/-b/-c/-d-20261006.png`, Übersicht `after-redesign-contact-20261006.png`, Fahrerwahl `after-redesign-menu-20261006.png`, Metadaten `after-redesign-20261006.json`.
- **Neue Abschnitte im Rennen:** `after-redesign-tour-0…6-20261006.png` (s ≈ 193, 399, 599, 802 Spree-Kai, 1007 Prachtallee, 1215 Tiergarten, 1437 zweite Runde); Säulen-Haarnadel nur in der Fahrt, nicht als Einzelbild.
- **Hitler-Anker in der Laufzeitszene:** `hitler-anchor-face/-faceside/-threequarter/-profile/-rear-20261006.png` (Nahkamera im laufenden Babylon-Rennen, kein Blender-Render).
- Die Aufnahmen entstanden nachts bei gesperrtem/abgeschaltetem Bildschirm: Das Testfenster war geöffnet, aber für niemanden sichtbar; Chrome lief deshalb mit abgeschalteter Hintergrund-/Verdeckungsdrosselung. FPS-Angaben sind Momentwerte dieses Laufs, keine Dauermessung.
- **Detailpass (zweiter Lauf, 06.10.2026 vormittags):** `redesign2-crest-*-20261006.png` (Prachtallee-Kuppe in Fahrt), `redesign2-sign-20261006.png` (Ladenschild-Nahkamera), `redesign2-hitler-*-20261006.png` (pausiertes Rennen, Nahkamera), gleiche Chrome-Bedingungen wie oben.
## 08.10.2026 – Tripo-Offizier im Babylon-Rennen (lokaler Test)

Die laufende, sichtbare Chrome-Szene auf `http://127.0.0.1:4173/` zeigte im Einzelrennen „Ewige-Führer-Allee“ den neuen Tripo-Offizier als Stalin im roten Limousinen-Kart. Die Sichtprüfung erfolgte nach Build und Vollsuite; die Fotokamera zeigte Front-/Seitenkontakt im Rennen. **Es wurde keine Laufzeitaufnahme dauerhaft gespeichert.** Die vorhandenen sechs Dateien unter `soviet-officer-inspection/` bleiben Blender-Assetvorschauen und belegen keine Babylon-Laufzeitwirkung. Offen sichtbar: statischer Umhang-/Sitzkontakt und keine dynamische Arm-/Lenkrad-IK.
