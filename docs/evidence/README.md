# Echte Laufzeitbelege des Stadion-Slices

## Belegregeln für künftige Pakete

- Laufzeitbilder müssen aus dem tatsächlichen Babylon-Spiel in einem sichtbaren Chrome-Fenster stammen. Studio-, Konzept-, Headless- oder abweichende Testszene-Bilder sind keine Runtime-Abnahme.
- Vor Änderungen nur dann eine Ausgangsaufnahme anlegen, wenn sie den sichtbaren Unterschied eines größeren Pakets nachvollziehbar macht. Danach eine gezielte Nachheraufnahme bzw. kurze Bewegungsfolge sichern; nicht jede Kleinigkeit bebildern.
- Für einen brauchbaren Vergleich Szene, Fahrer, Kamera/Abstand, Wetter, Viewport und Grafikstufe möglichst gleich halten. Beschreibe Abweichungen und Grenzen.
- Zu jedem neuen Beleg Datum/Uhrzeit, Datei, Zweck, Runtime-URL und wenn verfügbar Branch/Commit aus `/__diktator/status` angeben. Erst prüfen, was vorhandene Bilder zeigen und wie alt sie sind; das zuletzt gespeicherte Bild muss nicht zum neuesten Code gehören. Historische und Vorher-Bilder entsprechend kennzeichnen.
- Bei fehlendem Runtime-/Commitnachweis keine aktuelle visuelle Abnahme behaupten. Technische Tests, sichtbare Wirkung, menschliches Qualitätsurteil und Leistungsmessung getrennt bewerten.

Der Prozess für Selbstprüfung gegen Detaildrift und für das Beobachten eigener Browser-/Buildlast steht in [docs/21-team-workflow.md](../21-team-workflow.md).

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
