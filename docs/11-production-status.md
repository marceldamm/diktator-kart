# Produktionsstatus – erweiterte Version 1

Stand: 12. September 2026, Branch `astra/full-game`

## Nachtrag: 29. September 2026, Branch `main`

- Menü-Key-Art, Strecken-Beacons und Sektor-Schilder ergänzen die primitive Streckenkulisse.
- Minikarte, Tempometer, dynamischer FOV/Kameraroll und reduzierte HiDPI-Auflösung sind integriert.
- Asphalt, Druckerei-Papier und Gras verwenden getrennte Reifengripwerte; der Regressionstest prüft diese Oberflächenwerte.
- Die 24 Sprechertexte haben emotionale Piper-Neuralclips erhalten. Die vorhandenen WAVs bleiben Fallback; Piper und sein Modell werden nicht im Browser ausgeliefert.
- TypeScript, ESLint, Produktions-Build sowie Renn-, Speicher-, Wheel- und Oberflächen-Regressionen bestanden.
- Die vollständige Browser-Fahrserie mit zehn Fahrfällen, Driftlinks/rechts, Botstart und ohne Browserausnahme ist nach dem letzten Controller-Änderungslauf bestanden.

## Nachtrag: 30. September 2026

- Stadionkurs mit synchronisierten Checkpoints, Minikarte, Botroute, Oberflächengriff und Itemlinien; Bot-Recovery ohne geschenkten Checkpoint-Fortschritt.
- Separater prozeduraler Rennscore, über den Musikregler steuerbar; Schlussrunden-Tonfolge sowie Ergebnis-Karte mit Platzierung, Runden-Splits und Itemzähler.
- Stahl-Gripsektoren plus fester Driftspuren-Pool.
- Eigenes 100-KB-GLB-Zielportal; erfolgreicher Container-Load im Browser verifiziert.
- Controller-Regression läuft auf dem flachen Physik-Testfeld; separate Browserfahrt startet fünf Bots auf dem echten Kurs und prüft mindestens eine abgeschlossene Runde.
- Build-Warnung bleibt: Haupt-JavaScript-Chunk rund 1,23 MB minifiziert / 330 KB gzip; Rendering-/VRAM-Werte werden mit der aktuellen CDP-Serie erstmals aufgezeichnet.

## Verifizierte Ausgangslage

- Produktions-Build: erfolgreich
- TypeScript-Prüfung: erfolgreich
- zehn automatisierte Fahrfälle: erfolgreich ausgeführt; keine Browser-Ausnahme
- sichtbar im Browser geprüft: Prototyp war technisch fahrbar, aber Strecke und Horizont zunächst kaum lesbar
- bestehender Arbeitsbaum vor Produktionsbeginn: sauber

## Statusmatrix

| Bereich                           | Geplant | Integriert                                                                      | Getestet                                                                                                                      | Blockiert                                                                          |
| --------------------------------- | ------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Hauptmenü / Fahrerauswahl         | ja      | erster vollständiger Menüfluss, sechs Fahrer                                    | Auswahl und Rennstart sichtbar geprüft                                                                                        | nein                                                                               |
| Pause / Neustart / Menü           | ja      | ja                                                                              | Pause sichtbar geprüft                                                                                                        | nein                                                                               |
| Ergebnis / Revanche               | ja      | ja, an echtes Rennergebnis gekoppelt                                            | Build/Typprüfung; vollständiger Zieleinlauf offen                                                                             | nein                                                                               |
| Fünf Streckenbereiche             | ja      | erste räumliche Art-Pass-Silhouetten                                            | Startblick sichtbar geprüft                                                                                                   | Fahrprüfung aller Sektoren offen                                                   |
| Druckerei-Abkürzung               | ja      | kürzere Papierlinie, zwei feste Rampen, drei lesbar getaktete Stempel und Trefferstrafe | Typprüfung, Lint und Build erfolgreich; Fahr-/Zeitvergleich offen                                                          | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Drei Weltveränderungen            | ja      | Applaus verliert Synchronität, Banner kippt/wächst, Monument-Gerüst verändert sich | Typprüfung, Lint und Build erfolgreich; sichtbare Rundenabnahme offen                                                      | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Fünf Bots / drei Persönlichkeiten | ja      | fünf physische Gegner, individuelle Linien, höheres Tempolimit, Botitems und Platzberechnung | Start, Position 1/6→6/6, alle Checkpoints und Rundenwechsel aller fünf sichtbar geprüft; neue Tempo-/Itembalance und Zieleinlauf offen | Multi-RayCastVehicle mit aktuellem Ammo instabil; stabile Rigidbody-Variante aktiv |
| Itemsystem / acht Items           | ja      | acht Kisten-Items, Spieler- und Botinventar, taktischer Einsatz, Projektile und Schutzlogik | Typprüfung und Lint erfolgreich; neue Botaufnahme/-einsätze und Laufzeit-/Sichtprüfung offen                               | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Sprecher, mindestens 20 Zeilen    | ja      | 24 lokal vorproduzierte deutsche WAV-Zeilen, Untertitel, Priorität und Wiederholungsschutz | Dateien erzeugt; Typprüfung, Lint und Build erfolgreich; Hörprüfung offen                                                | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Fahrzeugdetails / Reaktionen      | ja      | sechs unterschiedliche Detailbewegungen sowie Brems-, Boost- und Driftpose      | Typprüfung, Lint und Build erfolgreich; sichtbare Bewegungsprüfung offen                                                       | Browser-Tab antwortet bei UI-Verbindung nicht                                      |
| Reduzierte Effekte/Kamera         | ja      | flachere Kamera plus umschaltbare reduzierte Kamera- und Effektbewegung          | Typprüfung, Lint und Build erfolgreich; sichtbare Optionsprüfung offen                                                        | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Einstellungen                     | ja      | Gesamt-, Musik-, Effekt- und Stimmenregler sowie Steuerungshilfe                 | Typprüfung, Lint und Build erfolgreich; Bedienprüfung offen                                                                   | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Zeitfahren / lokale Bestzeit      | ja      | bot- und itemfreie 3-Runden-Fahrt, Bestzeit pro Fahrer und Rekordanzeige         | Typprüfung, Lint und Build erfolgreich; Persistenzprüfung im Browser offen                                                    | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
| Sechs Spezialfähigkeiten          | ja      | je Fahrer eigener Effekt auf Q, sichtbares HUD und 18 Sekunden Abklingzeit       | Typprüfung, Lint und Build erfolgreich; Laufzeit-/Balanceprüfung offen                                                        | Browser-Tab antwortet bei UI-Verbindung nicht                                      |
| Drei vollständige Rennen          | ja      | nein                                                                            | nein                                                                                                                          | erst nach Bots/Items sinnvoll                                                      |

## Nächste Produktionsschritte

1. Laufzeitabnahme aller acht Items und der Schutz-Wechselwirkung nach Freigabe der Browsersteuerung.
2. Druckerei-Abkürzung, Weltveränderungen und Sprecher sichtbar beziehungsweise hörbar abnehmen.
3. Individuelle Fahreranimationen und Fahr-Effekte.
4. Einstellungen, Zeitfahren, lokale Bestzeiten und Spezialfähigkeiten.
5. Siegerehrung, Rennbericht und kombinierte Abnahme.

Technische Messwerte und subjektive Spielspaßbewertung werden in der Abnahme getrennt dokumentiert.

## Browser- und Renderabnahme (30. September 2026)

- Automatisierter Browserlauf: zehn Steuer-/Driftfälle bestanden, fünf Bots innerhalb der Stadiongrenzen, mindestens ein Bot überquert die Ziellinie in die Folgerunde, Zielportal geladen und keine JavaScript-Ausnahme.
- Das statische Strecken-Batching hält bewegliche Zuschauerarme, Banner, Stempel und Gerüst separat. Im gleichen Headless-Chrome-Lauf sanken die Strecken-Draw-Calls von 119 auf 66 (−45 %).
- Einzel-Snapshot mit Batching: 25 FPS, 33,4 ms Framezeit, 1,5 ms Renderzeit, 1,3 ms Updatezeit, 0,3 ms Physikzeit, 40.244 Dreiecke und rund 9,0 MiB gemeldeter VRAM.
- Wichtige Einordnung: SwiftShader/Headless limitiert Bildrate und Framezeit. Das ist ein technischer Vergleichslauf, kein Leistungsversprechen für reale Zielgeräte; Mehr-Rennen- und Hardwaremessung bleiben offen.
- Production-Preview mit separatem PlayCanvas-Engine-Chunk und rund 90-kB-Game-Entry besteht den vollständigen Browserlauf. Transfergröße praktisch unverändert: 1.155 kB Engine (305 kB gzip) plus 90 kB Game (30 kB gzip); der Engine-Chunk löst weiter Vites 500-kB-Hinweis aus. Keine aggressivere Zerlegung, solange sie Codeausführungsrisiken und Transfermehrkosten mitbringt.
