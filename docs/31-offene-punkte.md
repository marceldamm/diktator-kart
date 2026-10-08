# Offene Probleme und Features – Stand 08.10.2026

Auftrag: Marcel im Projekt-Thread (08.10.2026, 18:14): „Erstelle eine Liste mit offenen Problemen und offenen Features auf Git, damit diese nach und nach abgearbeitet werden können. Lege danach los.“
Quellen: CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, docs/27-questionnaire-status.md, bestehende Issues (#2, #4, #13, #14) und eine eigene Prüfung im laufenden Spiel am 08.10.2026.
Der Cloud-Thread „Stand auf main bringen“ hat die GitHub-Issues angelegt (Spalte Issue).

**Status:** offen · in Arbeit · erledigt (mit Commit) · Entscheidung nötig · nur menschlich prüfbar · gestoppt (Modellarbeit, Marcel 08.10.2026)

## Probleme (bug)

| Nr. | Issue | Titel | Beschreibung | Status |
|---|---|---|---|---|
| B1 | [#26](https://github.com/marceldamm/diktator-kart/issues/26) | Lenksäule kreist beim Lenken mit | Die Lenksäule hängt am Lenkrad, liegt aber außerhalb seiner Drehachse; bei Einschlag schwenkt sie sichtbar um die Nabe (Spielbilder `hands-*-20261008.png`). Sie soll fest stehen, nur das Rad dreht. | erledigt (Säule hängt am Lenkradträger, Beleg `docs/evidence/b1-left-20261008.png`) |
| B2 | [#27](https://github.com/marceldamm/diktator-kart/issues/27) | Zu viele Draw Calls pro Kart | Jedes Kart besteht im Rennen aus ~45 Meshes, jeder Fahrer aus ~14; zusammen etwa die Hälfte aller Draw Calls. Statische Teile gleichen Materials zur Laufzeit zusammenfassen. | analysiert: Karts teilen Meshes mit Lackwechsel, Panzer-Ausblendung, Schatten-, Glow- und Cockpitlisten; Zusammenfassen braucht einen größeren Umbau. Erst nach Messung auf schwacher Hardware (B3) angehen |
| B3 | [#28](https://github.com/marceldamm/diktator-kart/issues/28) | Schwache Grafik ungemessen | Intel UHD lief früher mit ca. 14 FPS (Standard). Nach den Leistungspässen vom 08.10. fehlt eine neue Messung auf einem Rechner mit integrierter Grafik (Issue #4). | nur menschlich prüfbar |
| B4 | [#29](https://github.com/marceldamm/diktator-kart/issues/29) | ~1.950 deaktivierte Meshes je Bild durchlaufen | Alle Karosserie-, Rad- und alten Fahrervarianten bleiben in der Szene und werden jedes Bild geprüft (≈7 % CPU in `_evaluateActiveMeshes`/`getActiveMeshCandidates`). | analysiert: rund 400 davon sind alte Code-Fahrer, die übrigen Karosserie-/Radvarianten werden beim Fahrertausch gebraucht. Zusammen mit B2 nach B3-Messung |
| B5 | [#30](https://github.com/marceldamm/diktator-kart/issues/30) | Fahrerkarten: Haut wirkt orange | In den Porträts der Fahrerwahl sind alle Gesichter rot-orange; neutraleres Studiolicht änderte nichts. Ursache (Hauttextur, Umgebungslicht oder Bildverarbeitung) suchen. | Ursache eingegrenzt: Hauttextur/-material der CC0-Fahrer (Umgebungslicht aus, Bildverarbeitung aus und neutrales Studiolicht ändern den Ton kaum). Korrektur wäre Modellarbeit → ruht |
| B6 | [#31](https://github.com/marceldamm/diktator-kart/issues/31) | Fehlendes favicon (404) | Jeder Seitenaufruf erzeugt einen 404-Fehler für `/favicon.ico` in der Konsole. | erledigt (`public/favicon.svg`, DK-Monogramm) |
| B7 | [#32](https://github.com/marceldamm/diktator-kart/issues/32) | Hauptbundle 2,1 MB | Der Build warnt bei jedem Lauf vor dem großen Hauptchunk; Babylon-Teile könnten nachgeladen werden, um den Start zu beschleunigen. | versucht und verworfen: Babylon als eigener Chunk zieht nachgeladene Shader in einen 4-MB-Startdownload; ohne bessere Aufteilung kein Gewinn |
| B8 | [#33](https://github.com/marceldamm/diktator-kart/issues/33) | Pjöngjang: Deckübergänge und Tunnel ungeprüft | Nahansicht der Brückendecks und der Tunnelinnenraum der Ewige-Führer-Allee sind noch nicht im Spiel abgenommen (Issue #14). | erledigt: Deckübergänge an beiden Querungen sauber (`b8-crossing-west/east`). Fehler im Tunnel: die Decke war beidseitig sichtbar, aber nur von oben beleuchtet und wirkte von innen wie offener Himmel (`b8-tunnel-before`); jetzt beidseitig beleuchtet, dunkle Betondecke (`b8-tunnel-after`) |
| B9 | [#13](https://github.com/marceldamm/diktator-kart/issues/13) | Fuß-/Pedalkontakt nicht belegt | Füße der CC0-Fahrer sind im Spiel verdeckt; Kontakt mit den Pedalen ist nicht nachgewiesen (Issue #13). | gestoppt |
| B10 | [#13](https://github.com/marceldamm/diktator-kart/issues/13) | Hitler-Modell: Haarlücke, heller Scheitelpunkt, glasige Augen | Kleine Lücke an der Stirnsträhne, heller Punkt am Scheitel (schon R67), Augen wirken hell-glasig (Issue #13). | gestoppt |

## Features (feature)

| Nr. | Issue | Titel | Beschreibung | Status |
|---|---|---|---|---|
| F1 | [#34](https://github.com/marceldamm/diktator-kart/issues/34) | Fähigkeiten „Große Säuberung“ (Stalin) und „Kulturrevolution“ (Mao) | Beide Namen benennen reale Massenverbrechen. Vor dem Bau muss Marcel festlegen, ob und wie die Satire die Täter trifft und nicht die Opfer. | Entscheidung nötig |
| F2 | [#35](https://github.com/marceldamm/diktator-kart/issues/35) | Gamepad mit echtem Controller prüfen | Die Standardbelegung (Stick, RT/LT, A/X/Y/RB, Menüs) ist gebaut, aber nie mit einem echten Controller getestet. | nur menschlich prüfbar |
| F3 | [#36](https://github.com/marceldamm/diktator-kart/issues/36) | Touch/Handy im Querformat | Android und iPhone mit Touchsteuerung prüfen; iPhone 15 Pro benannt, Android-Gerät offen. | nur menschlich prüfbar |
| F4 | [#37](https://github.com/marceldamm/diktator-kart/issues/37) | Zwei geplante Strecken | Kulturrevolutions-Schleife (Peking) und Genossen-Gerade (Moskau) stehen in der Streckenwahl als „In Planung“. | offen (Umfang mit Marcel/Sarah klären) |
| F5 | [#38](https://github.com/marceldamm/diktator-kart/issues/38) | Echte historische Sprachhupen | Statt synthetischer Parodien rechtlich klare Archivaufnahmen mit Quelle/Lizenz; Download nur mit Freigabe. | Entscheidung nötig |
| F6 | [#39](https://github.com/marceldamm/diktator-kart/issues/39) | Tageszeitverlauf im Rennen | Tag → Dämmerung → Nacht über drei Runden ist im Code angelegt (`setTimeOfDay`), aber nicht als zufällige Option im Rennen abgenommen. | bereits umgesetzt: jedes zweite Rennen läuft von Tag in die Nacht (`dayToNight`, `?night=1` zum Testen); Nachtbild geprüft `docs/evidence/f6-night-grid-20261008.png` |
| F7 | [#40](https://github.com/marceldamm/diktator-kart/issues/40) | Streckenleben | Herumliegende Zeitungen/Müll und kurz liegenbleibende Kartteile nach Treffern, mit Zeitlimit und Performance-Budget. | bereits umgesetzt: wehende Zeitungen am Spieler, echte Fahrzeugteile (Kenney CC0) fliegen bei Totalschaden, liegen 9 s und verschwinden dann |
| F8 | [#41](https://github.com/marceldamm/diktator-kart/issues/41) | Rückwärtsgeschwindigkeit | Vorgemerkter Balancewunsch: Rückwärtsfahrt prüfen und ggf. anpassen. | Entscheidung nötig: heute max. 5 m/s (18 km/h) rückwärts. Schneller oder langsamer? |
| F9 | [#42](https://github.com/marceldamm/diktator-kart/issues/42) | Online-Mehrspieler | Private Lobbys per Einladung, erst nach stabilem Einzelspieler. | später |
| F10 | [#2](https://github.com/marceldamm/diktator-kart/issues/2) [#13](https://github.com/marceldamm/diktator-kart/issues/13) | Menschliche Abnahmen | Fahr-, Stil- und Hörprobe aller vier Strecken, Team-Praxistest (Issue #2), Ähnlichkeit der Fahrer (Issue #13). | nur menschlich prüfbar |
| F11 | [#43](https://github.com/marceldamm/diktator-kart/issues/43) | Bessere Modelle (Fahrer, Karts, Gebäude) | Langzeitziel aus LONG-TERM-GOALS.md; von Marcel am 08.10.2026 gestoppt. | gestoppt |

## Arbeitsreihenfolge (Claude, selbstständig)

B1 → B6 → B2 → B4 → B5 → B7 → F6 → F8 → F7 (Stand 08.10. abends: B1, B6 erledigt; F6, F7 waren schon gebaut; B2/B4 warten auf B3; B5 ist Modellarbeit; B7 verworfen; F8 wartet auf Marcel). Entscheidungen (F1, F5) und menschliche Prüfungen bleiben bei Marcel/Sarah; Modellarbeit (B9, B10, F11) ruht.
