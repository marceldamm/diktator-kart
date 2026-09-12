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
| Druckerei-Abkürzung               | ja      | nein                                                                            | nein                                                                                                                          | nein                                                                               |
| Drei Weltveränderungen            | ja      | nein                                                                            | nein                                                                                                                          | nein                                                                               |
| Fünf Bots / drei Persönlichkeiten | ja      | fünf physische Gegner, gemeinsame Inputs, drei Datenprofile und Platzberechnung | Start, 20–22 Einheiten/s, Position 1/6→6/6, alle Checkpoints und Rundenwechsel aller fünf sichtbar geprüft; Zieleinlauf offen | Multi-RayCastVehicle mit aktuellem Ammo instabil; stabile Rigidbody-Variante aktiv |
| Itemsystem / acht Items           | ja      | nein                                                                            | nein                                                                                                                          | nein                                                                               |
| Sprecher, mindestens 20 Zeilen    | ja      | nein                                                                            | nein                                                                                                                          | lokale Vertonung noch zu erzeugen                                                  |
| Fahrzeugdetails / Reaktionen      | ja      | je Fahrer ein benanntes Detail im Datenmodell; erstes sichtbares Detail am Kart | Farb-/Fahrerwechsel sichtbar geprüft                                                                                          | Animationen offen                                                                  |
| Reduzierte Effekte/Kamera         | ja      | flachere lesbare Kamera; Einstellungsoption offen                               | sichtbar geprüft                                                                                                              | nein                                                                               |
| Drei vollständige Rennen          | ja      | nein                                                                            | nein                                                                                                                          | erst nach Bots/Items sinnvoll                                                      |

## Nächste Produktionsschritte

1. Bot-Input, Wegpunkte, fünf Gegner und gemeinsame Platzierungslogik.
2. Itemboxen, Inventar und gemeinsame Treffer-/Schutzlogik.
3. Druckerei-Abkürzung und sektorweise Fahrtests.
4. Fahreranimationen, Effekte und Audiofeedback.
5. Sprecher, Siegerehrung, Rennbericht und kombinierte Abnahme.

Technische Messwerte und subjektive Spielspaßbewertung werden in der Abnahme getrennt dokumentiert.
