# Produktionsstatus – erweiterte Version 1

Stand: 12. September 2026, Branch `astra/full-game`

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
| Fünf Bots / drei Persönlichkeiten | ja      | fünf physische Gegner, gemeinsame Inputs, drei Datenprofile und Platzberechnung | Start, 20–22 Einheiten/s, Position 1/6→6/6, alle Checkpoints und Rundenwechsel aller fünf sichtbar geprüft; Zieleinlauf offen | Multi-RayCastVehicle mit aktuellem Ammo instabil; stabile Rigidbody-Variante aktiv |
| Itemsystem / acht Items           | ja      | acht Kisten-Items, HUD, Einsatz, Projektile, Bot-Effekte und gemeinsame Schutzlogik | Typprüfung, Lint und Build erfolgreich; Laufzeit-/Sichtprüfung offen                                                        | Browsersteuerung bis zum App-Limit-Reset gesperrt                                  |
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
