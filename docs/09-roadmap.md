# Roadmap und Abnahmen

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Qualitätsziel präzisiert – 04.10.2026

M3–M6 sollen Modelle, historische Fahrer, Fahrzeuge, Strecke/Umfeld, Effekte und gesamtes Audio deutlich hochwertiger und realitätsnäher machen, gemessen an der gewählten Bildpräferenz G–L im laufenden Spiel. Fertige Stimmen ohne Text-to-Speech; synthetische Clips bleiben Zwischenstand. Menschliche Aufnahmen oder geeignete echte Mitschnitte mit geklärten Rechten. Konkrete Pakete/Abnahmen: [LONG-TERM-GOALS.md](../LONG-TERM-GOALS.md). Bestehende Geräte-/Performanceziele bleiben erhalten.

## Unsere vier Arbeitsdateien

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Präzisiertes Ziel für Figuren und Welt – 03.10.2026

Marcel präzisiert das Ziel: erkennbare und realitätsnahe Abbilder der echten historischen Fahrer, insbesondere Hitler; keine erfundenen Ersatzpersonen als Endergebnis. Satire entsteht durch Inszenierung und Spielhandlungen; Gesichter, Frisuren, Kleidung, Anatomie und Materialien sollen die jeweilige Person glaubwürdig erkennen lassen. Auch die Berlin-/Stadionwelt soll deutlich realitätsnäher werden. Die vorhandenen neutralen Modelle beschreiben nur den aktuellen Zwischenstand. Frühere neutrale Produktionsaufträge sind keine dauernde Beschränkung dieses Ziels. Die bisherige Verpflichtung auf große Köpfe/deutlich überzeichnete Körper wird durch diesen neuen Nutzerwunsch ersetzt. Kein Regimezeichen oder verherrlichende Inszenierung. Sarahs ursprüngliche Ideen werden nicht stillschweigend umbenannt; die Präzisierung ist als aktueller Nutzerauftrag nachvollziehbar.

## Gemeinsame Hauptbasis – 03.10.2026

Aktiv ist ausschließlich der neue Babylon-main auf GitHub, initial aus Claude Q2d c13d47e. Alte Engine-/Archivstände dienen nur historischen Zwecken und werden nicht verändert oder als Spiel gestartet. Projektstart sichert lokale Arbeit, holt main und integriert aktuelle Babylon-Änderungen; Projektabschluss prüft, dokumentiert und veröffentlicht mit normalem Fast-Forward. Konkreter Ablauf: [21-team-workflow.md](21-team-workflow.md). Frühere „main unverändert/kein Push“-Sitzungsangaben unten sind historische Zwischenstände, keine aktuellen Arbeitsregeln.


## Laufender großer Slice – 03.10.2026

Der große Nutzerauftrag zieht neutrale M3-Produktion und Teile von M4 ausdrücklich vor: editierbare Artassets und kompletter fiktiver Stadionring mit fünf echten Bots, drei Runden, Platzierung, Ergebnis/Revanche. Browserrennen und Revanche geprüft. Das bestätigte Start-Itemset ist mit gemeinsamen Regeln, neutralen GLBs, festem Pool, HUD und Audio integriert; Modelltest und echte Rennen prüfen Aufnahme/Einsatz/Treffer/Pause/Revanche. Die M2-Abnahmelücken bleiben sichtbar und verhindern keine ausdrücklich autorisierte neutrale Umsetzung. M3/M4 werden nicht pauschal als abgenommen markiert.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](../PROGRESS-LOG.md).

Diese Übersicht verwendet dieselben Meilensteine wie [16-production-blueprint.md](16-production-blueprint.md) und START-HERE.md. Die Nutzerantworten stehen in [10-open-questions.md](10-open-questions.md).

## M0 – Wissensbasis und Vorbereitung

Grundsatzentscheidungen dokumentieren, restliche Altideen sichern, technische Startentscheidung und Messplan vorbereiten. M0c organisiert GitHub-Zusammenarbeit, getrennte Branches und gemeinsamen Freigabeweg.

**Abnahme:** bestätigte Antworten und echte Restfragen getrennt, eindeutiger Arbeitsordner, konkreter M1-Auftrag. Kein Anspruch, alle späteren Balancewerte bereits zu kennen.

## M1 – Startbarer Babylon-Grundstand

Browserprojekt, Lade-/Fehlerzustände, Eingabeschnittstelle, Diagnose, kontrollierter Neustart und Ein-Klick-Start. Eigene Aktionen für Kamerawechsel, Item und Spezialfähigkeit vorsehen.

**Abnahme:** neuer Stand startet über den vorgesehenen einfachen Einstieg; keine alte Engine übernommen.

**Stand 03.10.2026:** lokal erfüllt: TypeScript/Vite/Babylon-Grundstand, sichtbare Szene in Chrome, Status/Fehler, Eingabeaktionen, Debug, Pause/Neustart und Ein-Klick-Starter. WebGL2 im Entwicklungsbrowser belegt; weitere Geräte und das Fahrmodell gehören zu M2/M7.

## M2 – Fahrbarer Technikprototyp

Fahrmodell, Federung, Sprung, Drift, Mini-Turbo und Teststrecke; nahe/ferne Verfolgerkamera und erste Cockpit-Sichtprobe. Isolierte Ein-Kart-Tests sind Entwicklungsschritte, nicht der abgenommene Sechs-Fahrer-Prototyp.

**Abnahme:** Fahr- und Kameraverhalten geprüft, erste Lastmessungen mit sechs Fahrzeugen.

**M2-Abnahmeprotokoll:** Die folgenden Punkte werden getrennt bewertet. Ein bestandener Modell- oder Headless-Test ersetzt kein menschliches Fahrgefühlurteil und keine Messung auf normaler Zielhardware.

| Prüffeld | Konkreter Nachweis | Stand |
|---|---|---|
| Start und Grundregeln | Ein-Klick-Start, Build, Eingaben, Pause/Neustart; Modell- und Browserchecks für Fahren, Hop, Drift, Turbo, Federung und Kontakte | technisch geprüft |
| Stabilität mit sechs Karts | mindestens 60 s Simulationslauf ohne ungültigen Zustand; Browser-Neustart ohne Meshwachstum; Kamerawechsel und Kontaktfälle sichtbar | auf RTX-Entwicklungsgerät geprüft |
| Fahrgefühl und Kontakt | Mensch fährt geradeaus, Kurven, Hop/Drift/Turbo sowie Rand-, Block- und Fahrzeugkontakt; beurteilt Lenkbarkeit, Rückmeldung und Wiederanfahrt in eigenen Worten | teilweise: flüssige Fahrt, gute Bodenwellen-/Radreaktion, Kontaktanimation, Bremse/Rückwärtsgang gemeldet; Hop/Drift/Turbo funktionieren nach erstem Nutzerurteil, ihre Animationen brauchen Arbeit; einzelne Kontaktarten offen |
| Alle drei Kameras | Mensch prüft nahe/ferne Verfolger- und Fahrerperspektive bei Kurve, Hop, Drift und Kontakt auf Sicht, Ruhe und störende Verdeckung | teilweise: Kamera grundsätzlich funktionsfähig; Fahrerperspektive wirkt noch unfertig, Komfort in allen drei Modi offen |
| Normale/schwächere PC-Hardware | Gerät/GPU, Chrome-Version, Auflösung, Grafikmodus, 1/6 Karts und drei Kameras protokollieren; F3-Framefenster nach mindestens fünf Sekunden sichtbarer Fahrt ablesen; vorläufiges Ziel aus Dokument 04: 60 FPS Standard, stabil 30 FPS auf schwächerer Hardware | offen; RTX-Headless ersetzt dies nicht |
| Mobile Frühprobe | Android/iPhone im Querformat mit Start, Sichtbarkeit und Eingabe prüfen, sobald Testgeräte/Touchsteuerung vorhanden sind; vollständige mobile Abnahme bleibt M7 | offen |

Für eine M2-Gesamtabnahme müssen mindestens Fahrgefühl, alle drei Kameras und eine erste Messung auf einem normalen PC tatsächlich beurteilt sein. Fehlende schwächere/Mobilgeräte bleiben ausdrücklich offen; ihre Leistungsziele werden dadurch nicht abgesenkt. Gerät, Datum, Beobachtung und Beleg gehören in `PROGRESS-LOG.md`; daraus folgende Änderungen werden als einzelne M2-Korrekturen geplant.

**Zwischenstand M2a, 03.10.2026:** Steuerbares Test-Kart, begrenzte Fläche, getrennte Fahrzustands-/Darstellungs-/Kamerabausteine, Browserprüfung und gezielte Modelltests vorhanden. Hop, Drift und Mini-Turbo waren zu diesem Zeitpunkt noch offen und wurden in M2b ergänzt. Federung, drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen weiterhin.

**Zwischenstand M2b, 03.10.2026:** Hop, aufladbarer Drift und befristeter Mini-Turbo sind im Fahrmodell und Browser-Test sichtbar. Sieben Modell-/Eingabetests sowie ein Chrome-Test mit gehaltenen Tasten prüfen die Übergänge, Pause und Neustart. Federung, Untergründe, drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen für die M2-Gesamtabnahme.

**Zwischenstand M2c–e, 03.10.2026:** Vier Radkontakte und gedämpfte Karosseriereaktion über zwei markierte Bodenwellen, drei umschaltbare Kameras mit einfacher Fahrerperspektive sowie fünf bewegte Lastfahrzeuge ergänzt. Neun Modell-/Eingabetests, Build und Chrome-Browsertest bestanden. Die vergleichende Headless-Probe zeigte 42 Meshes für ein und 87 für sechs Fahrzeuge; beide Proben 60 FPS bei 1280 × 800. Fahrgefühl, Rand-/Kollisionsreaktion, Cockpitqualität und Leistung auf echter Zielhardware sind noch nicht abgenommen. Die fünf Lastfahrzeuge sind keine Rennbots.

**Zwischenstand M2f, 03.10.2026:** Kurzer begrenzter Rückstoß am Testflächenrand und Abbruch von Drift/Turbo modelliert; zehn Modell-/Eingabetests und Chrome-Randkontaktprobe bestanden. Die allgemeine Kollisionslogik, subjektive Fahrprüfung und Zielhardware-Leistung bleiben für die M2-Gesamtabnahme offen.

**M2f-GPU-Prüfung, 03.10.2026:** Je 300 Frames in drei Kameras mit einem und sechs Karts auf der RTX 3070 Laptop GPU: 16,7 ms Median, 16,8 ms P95 und 16,9 ms P99 in allen sechs Messfenstern, ohne Frame über 25 ms; Meshzahl nach Neustart stabil. Dieses starke Entwicklungsgerät ersetzt keine Messung auf normalem/schwachem PC und keine menschliche Fahrgefühlabnahme. M2 bleibt offen.

**Zwischenstand M2g, 03.10.2026:** Ein markierter Seitenblock nutzt eine eigene, unabhängig testbare Kreis-/Rechteck-Kollision und den begrenzten Rückstoß. Elf Modell-/Eingabetests und Chrome-Kontaktprobe bestanden; die gerade Linie bleibt frei. Eine neue 1-/6-Kart-Messung mit je drei Kameras ergab 44/89 Meshes, P95 16,8 ms und einen einzelnen 33,5-ms-Ausreißer in 1.800 Frames auf der RTX 3070. Fahrzeugkontakt, schwache Zielhardware und menschlicher Fahrcheck fehlen weiterhin für die M2-Gesamtabnahme.

**Zwischenstand M2h, 03.10.2026:** Gleicher vorläufiger Kreis-Kontakt für Spieler und Lastkarts; gezielter Gegenverkehrsfall in Chrome geprüft. 14 Modell-/Eingabetests einschließlich einer 60-s-Sechs-Kart-Simulation, Build und Browserprobe bestanden. Die erneute 1-/6-Kart-Probe zeigte 44/89 Meshes und P95 16,8 ms in allen sechs RTX-Fenstern; ein Sechs-Kart-Fenster endete durch Kontakt bei 0 km/h. Menschliches Fahrgefühl, normale/schwache PCs, Mobile sowie repräsentative Strecken- und Mehrfachkollision bleiben offen. M2 ist nicht insgesamt abgenommen.

**Zwischenstand M2i, 03.10.2026:** Der WebGL1-Pfad startete erzwungen in Chrome auf der RTX 3070 GPU mit sichtbarer Fahrt und 44 Meshes. Echtes Fallback-Verhalten nach WebGL2-Fehler und Leistung auf älterem PC bleiben ungeprüft; M2-Gesamtabnahme unverändert offen.

**Zwischenstand M2j, 03.10.2026:** Der Sechs-Kart-Stresstest fand bis zu 5,7 cm Blockeindringen nach Fahrzeugkontakt. Eine gemeinsame, wiederholte Positionskorrektur senkte dies im gleichen 60-s-Pfad auf null und die Kart-Restüberlappung auf höchstens 1,6 cm. 14 Modell-/Eingabetests, Build, Browserprobe und erneute RTX-Probe bestanden. M2 bleibt wegen menschlichem Fahrgefühl, normaler/schwacher Hardware und repräsentativer Streckenkollision offen.

**Zwischenstand M2k, 03.10.2026:** Gegenverkehrskontakt wurde zusätzlich in ferner Verfolger- und Fahrerperspektive in Chrome festgehalten. Die Standbilder zeigen die Szene und Cockpitteile bei Kontakt; sie belegen weder Kameraruhe während der Bewegung noch menschlichen Komfort. Die entsprechenden Abnahmefelder bleiben offen.

**Zwischenstand M2l, 03.10.2026:** F3 zeigt ein rollendes 300-Frame-Fenster, Perzentile/Langframes, Auflösung und verfügbaren Grafikpfad. Ein-/Sechs-Kart-Browserprobe, Bildkontrolle, Build und 14 Modell-/Eingabetests bestanden. Die Anzeige erleichtert die noch offene normale-PC-Messung; sie selbst ist keine Zielhardware-Abnahme.

**Erster menschlicher Fahrbericht, 03.10.2026:** Der Nutzer beschreibt das Fahren als flüssig und gegenüber dem alten Prototyp deutlich verbessert, besonders die sichtbare Radbewegung auf Bodenwellen. Bremsen, Rückwärtsfahren und Kontaktreaktionen wurden beobachtet. Hop, Drift und Turbo funktionieren nach erstem Eindruck, die Animationen sind noch nicht ausgereift. Die Fahrerperspektive wirkte unfertig; der visuelle Gesamtstand liegt nach Nutzerurteil weit unter G–L. Ein Screenshot der laufenden Sechs-Kart-Szene zeigt auf der RTX 3070 Laptop GPU bei 1849 × 1263 Pixel 60 FPS, P95 16,9 ms und P99 17,2 ms im 300-Frame-Fenster, ohne Frame über 25 ms. Der Screenshot entstand bei 0 km/h nach Fahrzeugkontakt; er ist keine kontrollierte Fahrtmessung und ersetzt keine normale-PC-Probe. Jede Kamera unter Bewegung und die einzelnen Kontaktarten sind noch nicht vollständig durch Menschen beurteilt. Rückwärtsgeschwindigkeit als späteren Balancewunsch vormerken, vorerst nicht ändern.

## M3 – Erster ausgearbeiteter Spielabschnitt

Ein Fahrer/Kart vollständig ausgearbeitet, fünf weitere einfacher dargestellt und als Bots fahrend; ein Abschnitt der historischen Berlin-/Stadionwelt, Materialien, Licht, Atmosphäre und Audio. Alle drei Kameras prüfen, einschließlich Hände/Lenkrad/Armaturen/Vorderräder. Das Item-Dreierset kann hier begonnen werden und wird in M4 vollständig integriert.

**Aktueller Fahrer-/Fahrzeugauftrag, 04.10.2026:** Stalin ist der erste zu bauende Qualitätsanker (siehe [Masterauftrag](22-character-vehicle-quality-master.md) und [CURRENT-WORKLIST.md](../CURRENT-WORKLIST.md)). Alle Karts teilen die lesbare, fahrbare Grundarchitektur und bleiben durch zahlreiche personenspezifische Karosserie-/Silhouettenabweichungen unterscheidbar. Die Silhouette muss ohne Farbe lesbar bleiben; kein Traktor-Look, Stalins Traktor bleibt ein Item. Das ist eine bestätigte Art-Richtung, keine neue offene Grundsatzfrage.

**Historische Vorbereitung, noch keine M3-Abnahme:** Dokument 14 enthielt Mussolini/Il Duce GT als frühen Art-Piloten-Vorschlag; der neuere Auftrag bestimmt Stalin zuerst. Eine neutrale, vorgezogene Babylon-Stilskizze für Kulisse und Testkart dient zur Sicht- und Lastprüfung; sie ist kein ausgearbeiteter Fahrer, kein bestätigter Stil und kein fertiger M3-Abschnitt.

Dokument 01 skizziert zusätzlich eine fiktive Stadion-/Boulevardroute mit belegten historischen Landmarken als **Vorschlag**. M3 umfasst davon nur einen zusammenhängenden Abschnitt für Stil- und Lastprobe; vollständiger Rundkurs und Rennregeln bleiben M4. Landmarken, Zeitbild und Zeichen werden vor Assetproduktion gemeinsam geprüft.

**Abnahme:** Stalin-Benchmark aus tatsächlichen Spielkameras (vorn/hinten/seitlich/nah und in Bewegung), anatomischer Sitz-/Hand-/Kopfcheck, getrennte Fahreridentität und Kart-Silhouette; anschließend sechs sichtbare Teilnehmer und erste Messwerte. Fahrzeuge bleiben als Kartfamilie erkennbar und sind als Schwarzsilhouetten klar unterscheidbar. Noch keine fertige Gesamtstrecke behaupten.

## M4 – Kernrennen

Vollständiger Rundkurs, drei Runden, fünf Bots, Platzierung, Ziel, Revanche, sichere Abkürzung und faire Rücksetzung. Drei Start-Items mit identischen Grundwirkungen je Fahrer, maßvolle positionsabhängige Verteilung und Schutz vor Trefferketten.

**Abnahme:** vollständige wiederholbare Rennen mit korrektem Ergebnis und zuverlässigem Bot-Zieleinlauf.

## M5 – Fähigkeiten und Weltreaktionen

Persönliche Fähigkeiten mit eigener Eingabe/festen Abklingzeiten, HUD/Touch-Konzept, gestufte Schäden, lokales Wetter und Weltreaktionen. Vorproduzierte Fahrer-Parodiestimmen, Stadionsprecherin und historisch geprägte Musik. Weitere Altitems nach gesonderter Umfangsentscheidung.

**Abnahme:** Wirkungen enden korrekt, Pause/Neustart funktionieren, Menschen und Bots folgen denselben Regeln; Änderungen an Sarahs Ideen gemeinsam bestätigt.

## M6 – Singleplayer-Version 1

Alle sechs Fahrer auf den abgenommenen Stil ausbauen, vollständige historische Strecke, Menü/HUD, Audio, Siegerehrung und Rennbericht ausarbeiten. Die alten fünf Hauptstadtzonen sind keine Pflichtliste für diesen Kurs.

**Abnahme:** vollständiger Spielablauf mit gemeinsam geprüfter Darstellung und Audioqualität.

## M7 – Geräte- und Auslieferungsabnahme

Frühe Messungen laufend ergänzen, dann PC/Android/iPhone, Querformat-Touch, Qualitätstufen, drei Kameras, lokale Einstellungen, Lade-/Speicherverhalten und mehrere Rennen zusammen prüfen.

**Abnahme:** belegte Ergebnisse auf benannten Geräten; fehlende Geräteprüfungen bleiben offen. Das iPhone 15 Pro ist benannt, Android und schwacher PC noch zu organisieren.

## M8 – Online und weitere Inhalte

Private Online-Lobbys per Einladung mit Crossplay sind das nächste große Produktziel nach stabilem Singleplayer. Kostenlos tragfähigen Betrieb prüfen. Zusätzliche Strecken, Fahrer, Geist, Orden und Fotomodus werden separat priorisiert und sind keine pauschalen Vorbedingungen für Multiplayer. Spätere öffentliche Veröffentlichung bleibt kostenlos.
