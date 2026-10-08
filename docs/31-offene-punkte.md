# Offene Probleme und Features – Stand 08.10.2026

Auftrag: Marcel im Projekt-Thread (08.10.2026, 18:14): „Erstelle eine Liste mit offenen Problemen und offenen Features auf Git, damit diese nach und nach abgearbeitet werden können. Lege danach los.“
Quellen: CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, docs/27-questionnaire-status.md, bestehende Issues (#2, #4, #13, #14) und eine eigene Prüfung im laufenden Spiel am 08.10.2026.
Der Cloud-Thread „Stand auf main bringen“ legt zu jedem Eintrag ein GitHub-Issue an; die Nummern werden hier nachgetragen.

**Status:** offen · in Arbeit · erledigt (mit Commit) · Entscheidung nötig · nur menschlich prüfbar · gestoppt (Modellarbeit, Marcel 08.10.2026)

## Probleme (bug)

| Nr. | Titel | Beschreibung | Status |
|---|---|---|---|
| B1 | Lenksäule kreist beim Lenken mit | Die Lenksäule hängt am Lenkrad, liegt aber außerhalb seiner Drehachse; bei Einschlag schwenkt sie sichtbar um die Nabe (Spielbilder `hands-*-20261008.png`). Sie soll fest stehen, nur das Rad dreht. | erledigt (Säule hängt am Lenkradträger, Beleg `docs/evidence/b1-left-20261008.png`) |
| B2 | Zu viele Draw Calls pro Kart | Jedes Kart besteht im Rennen aus ~45 Meshes, jeder Fahrer aus ~14; zusammen etwa die Hälfte aller Draw Calls. Statische Teile gleichen Materials zur Laufzeit zusammenfassen. | offen |
| B3 | Schwache Grafik ungemessen | Intel UHD lief früher mit ca. 14 FPS (Standard). Nach den Leistungspässen vom 08.10. fehlt eine neue Messung auf einem Rechner mit integrierter Grafik (Issue #4). | nur menschlich prüfbar |
| B4 | ~1.950 deaktivierte Meshes je Bild durchlaufen | Alle Karosserie-, Rad- und alten Fahrervarianten bleiben in der Szene und werden jedes Bild geprüft (≈7 % CPU in `_evaluateActiveMeshes`/`getActiveMeshCandidates`). | offen |
| B5 | Fahrerkarten: Haut wirkt orange | In den Porträts der Fahrerwahl sind alle Gesichter rot-orange; neutraleres Studiolicht änderte nichts. Ursache (Hauttextur, Umgebungslicht oder Bildverarbeitung) suchen. | offen |
| B6 | Fehlendes favicon (404) | Jeder Seitenaufruf erzeugt einen 404-Fehler für `/favicon.ico` in der Konsole. | erledigt (`public/favicon.svg`, DK-Monogramm) |
| B7 | Hauptbundle 2,1 MB | Der Build warnt bei jedem Lauf vor dem großen Hauptchunk; Babylon-Teile könnten nachgeladen werden, um den Start zu beschleunigen. | offen |
| B8 | Pjöngjang: Deckübergänge und Tunnel ungeprüft | Nahansicht der Brückendecks und der Tunnelinnenraum der Ewige-Führer-Allee sind noch nicht im Spiel abgenommen (Issue #14). | offen |
| B9 | Fuß-/Pedalkontakt nicht belegt | Füße der CC0-Fahrer sind im Spiel verdeckt; Kontakt mit den Pedalen ist nicht nachgewiesen (Issue #13). | gestoppt |
| B10 | Hitler-Modell: Haarlücke, heller Scheitelpunkt, glasige Augen | Kleine Lücke an der Stirnsträhne, heller Punkt am Scheitel (schon R67), Augen wirken hell-glasig (Issue #13). | gestoppt |

## Features (feature)

| Nr. | Titel | Beschreibung | Status |
|---|---|---|---|
| F1 | Fähigkeiten „Große Säuberung“ (Stalin) und „Kulturrevolution“ (Mao) | Beide Namen benennen reale Massenverbrechen. Vor dem Bau muss Marcel festlegen, ob und wie die Satire die Täter trifft und nicht die Opfer. | Entscheidung nötig |
| F2 | Gamepad mit echtem Controller prüfen | Die Standardbelegung (Stick, RT/LT, A/X/Y/RB, Menüs) ist gebaut, aber nie mit einem echten Controller getestet. | nur menschlich prüfbar |
| F3 | Touch/Handy im Querformat | Android und iPhone mit Touchsteuerung prüfen; iPhone 15 Pro benannt, Android-Gerät offen. | nur menschlich prüfbar |
| F4 | Zwei geplante Strecken | Kulturrevolutions-Schleife (Peking) und Genossen-Gerade (Moskau) stehen in der Streckenwahl als „In Planung“. | offen (Umfang mit Marcel/Sarah klären) |
| F5 | Echte historische Sprachhupen | Statt synthetischer Parodien rechtlich klare Archivaufnahmen mit Quelle/Lizenz; Download nur mit Freigabe. | Entscheidung nötig |
| F6 | Tageszeitverlauf im Rennen | Tag → Dämmerung → Nacht über drei Runden ist im Code angelegt (`setTimeOfDay`), aber nicht als zufällige Option im Rennen abgenommen. | offen |
| F7 | Streckenleben | Herumliegende Zeitungen/Müll und kurz liegenbleibende Kartteile nach Treffern, mit Zeitlimit und Performance-Budget. | offen |
| F8 | Rückwärtsgeschwindigkeit | Vorgemerkter Balancewunsch: Rückwärtsfahrt prüfen und ggf. anpassen. | offen |
| F9 | Online-Mehrspieler | Private Lobbys per Einladung, erst nach stabilem Einzelspieler. | später |
| F10 | Menschliche Abnahmen | Fahr-, Stil- und Hörprobe aller vier Strecken, Team-Praxistest (Issue #2), Ähnlichkeit der Fahrer (Issue #13). | nur menschlich prüfbar |
| F11 | Bessere Modelle (Fahrer, Karts, Gebäude) | Langzeitziel aus LONG-TERM-GOALS.md; von Marcel am 08.10.2026 gestoppt. | gestoppt |

## Arbeitsreihenfolge (Claude, selbstständig)

B1 → B6 → B2 → B4 → B5 → B7 → F6 → F8 → F7. Entscheidungen (F1, F5) und menschliche Prüfungen bleiben bei Marcel/Sarah; Modellarbeit (B9, B10, F11) ruht.
