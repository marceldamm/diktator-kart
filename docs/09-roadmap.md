# Roadmap und Abnahmen

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

**Zwischenstand M2a, 03.10.2026:** Steuerbares Test-Kart, begrenzte Fläche, getrennte Fahrzustands-/Darstellungs-/Kamerabausteine, Browserprüfung und gezielte Modelltests vorhanden. Hop, Drift und Mini-Turbo waren zu diesem Zeitpunkt noch offen und wurden in M2b ergänzt. Federung, drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen weiterhin.

**Zwischenstand M2b, 03.10.2026:** Hop, aufladbarer Drift und befristeter Mini-Turbo sind im Fahrmodell und Browser-Test sichtbar. Sieben Modell-/Eingabetests sowie ein Chrome-Test mit gehaltenen Tasten prüfen die Übergänge, Pause und Neustart. Federung, Untergründe, drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen für die M2-Gesamtabnahme.

**Zwischenstand M2c–e, 03.10.2026:** Vier Radkontakte und gedämpfte Karosseriereaktion über zwei markierte Bodenwellen, drei umschaltbare Kameras mit einfacher Fahrerperspektive sowie fünf bewegte Lastfahrzeuge ergänzt. Neun Modell-/Eingabetests, Build und Chrome-Browsertest bestanden. Die vergleichende Headless-Probe zeigte 42 Meshes für ein und 87 für sechs Fahrzeuge; beide Proben 60 FPS bei 1280 × 800. Fahrgefühl, Rand-/Kollisionsreaktion, Cockpitqualität und Leistung auf echter Zielhardware sind noch nicht abgenommen. Die fünf Lastfahrzeuge sind keine Rennbots.

**Zwischenstand M2f, 03.10.2026:** Kurzer begrenzter Rückstoß am Testflächenrand und Abbruch von Drift/Turbo modelliert; zehn Modell-/Eingabetests und Chrome-Randkontaktprobe bestanden. Die allgemeine Kollisionslogik, subjektive Fahrprüfung und Zielhardware-Leistung bleiben für die M2-Gesamtabnahme offen.

**M2f-GPU-Prüfung, 03.10.2026:** Je 300 Frames in drei Kameras mit einem und sechs Karts auf der RTX 3070 Laptop GPU: 16,7 ms Median, 16,8 ms P95 und 16,9 ms P99 in allen sechs Messfenstern, ohne Frame über 25 ms; Meshzahl nach Neustart stabil. Dieses starke Entwicklungsgerät ersetzt keine Messung auf normalem/schwachem PC und keine menschliche Fahrgefühlabnahme. M2 bleibt offen.

**Zwischenstand M2g, 03.10.2026:** Ein markierter Seitenblock nutzt eine eigene, unabhängig testbare Kreis-/Rechteck-Kollision und den begrenzten Rückstoß. Elf Modell-/Eingabetests und Chrome-Kontaktprobe bestanden; die gerade Linie bleibt frei. Eine neue 1-/6-Kart-Messung mit je drei Kameras ergab 44/89 Meshes, P95 16,8 ms und einen einzelnen 33,5-ms-Ausreißer in 1.800 Frames auf der RTX 3070. Fahrzeugkontakt, schwache Zielhardware und menschlicher Fahrcheck fehlen weiterhin für die M2-Gesamtabnahme.

**Zwischenstand M2h, 03.10.2026:** Gleicher vorläufiger Kreis-Kontakt für Spieler und Lastkarts; gezielter Gegenverkehrsfall in Chrome geprüft. 14 Modell-/Eingabetests einschließlich einer 60-s-Sechs-Kart-Simulation, Build und Browserprobe bestanden. Die erneute 1-/6-Kart-Probe zeigte 44/89 Meshes und P95 16,8 ms in allen sechs RTX-Fenstern; ein Sechs-Kart-Fenster endete durch Kontakt bei 0 km/h. Menschliches Fahrgefühl, normale/schwache PCs, Mobile sowie repräsentative Strecken- und Mehrfachkollision bleiben offen. M2 ist nicht insgesamt abgenommen.

**Zwischenstand M2i, 03.10.2026:** Der WebGL1-Pfad startete erzwungen in Chrome auf der RTX 3070 GPU mit sichtbarer Fahrt und 44 Meshes. Echtes Fallback-Verhalten nach WebGL2-Fehler und Leistung auf älterem PC bleiben ungeprüft; M2-Gesamtabnahme unverändert offen.

## M3 – Erster ausgearbeiteter Spielabschnitt

Ein Fahrer/Kart vollständig ausgearbeitet, fünf weitere einfacher dargestellt und als Bots fahrend; ein Abschnitt der historischen Berlin-/Stadionwelt, Materialien, Licht, Atmosphäre und Audio. Alle drei Kameras prüfen, einschließlich Hände/Lenkrad/Armaturen/Vorderräder. Das Item-Dreierset kann hier begonnen werden und wird in M4 vollständig integriert.

**Abnahme:** Stil aus tatsächlichen Spielkameras gemeinsam geprüft; sechs sichtbare Teilnehmer und erste Messwerte. Noch keine fertige Gesamtstrecke behaupten.

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
