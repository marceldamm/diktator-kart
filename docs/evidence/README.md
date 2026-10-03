# Echte Laufzeitbelege des Stadion-Slices

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
