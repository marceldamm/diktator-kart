# Entscheidungslog

| Datum | Entscheidung / Befund | Begründung | Betroffene Dokumente |
|---|---|---|---|
| 2026-10-02 | Neuer Ordner `diktator-kart-babylon-neustart-2026` wird neben der Altbasis angelegt. | Klare Trennung zwischen Referenz und Neuentwicklung; alte Dateien bleiben unangetastet. | README, AGENTS, 11 |
| 2026-10-02 | Babylon.js ist die gesetzte Engine. | Nutzerentscheidung aus der vorangegangenen Diskussion; keine blinde technische Migration. | README, 03, 09 |
| 2026-10-02 | Visuelles Ziel: klassisches Kart-Racer-Gefühl plus modernes, eigenständiges, etwas realistischeres und effektvolleres Bild. | Das Ziel soll ambitioniert sein, ohne ein generiertes Bild als automatische Engine-Garantie zu behandeln. | README, 01, 02 |
| 2026-10-02 | Normale-PC-Browserperformance ist harte Leitplanke. | Zielgruppe und Produktanspruch verlangen skalierbare Qualität statt High-End-Zwang. | README, 02, 04 |
| 2026-10-02 | Multiplayer bleibt nachgelagert. | Singleplayerkern, Fahrgefühl und Abnahme sollen nicht durch Netzwerksysteme verwässert werden. | 06, 09 |
| 2026-10-02 | KI-Modellstrategie: Luna Routine, Sol Kernarchitektur, Astra gezielte Gesamtanalyse. | Kosten-/Qualitätsbalance; konkrete Verfügbarkeit muss jeweils geprüft werden. | 08 |
| 2026-10-02 | Reale historische Anspielungen sind erlaubt, aber kritisch-satirisch begrenzt. | Nutzer möchte erkennbare Diktatoren und historische Umgebungen, schließt rechtsextreme Verherrlichung, Holocaust-/Genozid-Szenarien und Grenzüberschreitungen ausdrücklich aus. | README, 01, 02, 10, 13 |
| 2026-10-02 | Ziel-Fahrgefühl liegt bei etwa 6/10 Realismus. | Federung, Reifen, Bordsteine, kleine Untergrundreaktionen und Fahreranimationen sollen spürbar sein, ohne Simulation zu werden. | README, 01, 03, 10 |
| 2026-10-02 | Sechs thematische Strecken plus eine verbindende Strecke sind langfristiges Ziel; der Prototyp startet mit einer Strecke. | Jede Strecke darf eigene Abkürzungen, Ereignisse und Atmosphären haben. | README, 01, 09, 10 |
| 2026-10-02 | Der Spieler steuert historische Diktatoren; der Rennsieg wird propagandistisch und humorvoll überhöht. | Die politische Satire soll aus der offiziellen Erfolgserzählung entstehen, ohne die Fahrer zwingend selbst zu verspotten. | 01, 07 |
| 2026-10-02 | Fahrzeuge besitzen individuelle Themenformen, bewegliche Teile, begrenzte Schäden und leicht unterschiedliche Fahrprofile. | Charakter und Materialwirkung sollen sichtbar werden, ohne Simulation oder unfairen Wettbewerb. | 01, 02, 07 |
| 2026-10-02 | Lokales Wetter beeinflusst abschnittsweise das Fahrverhalten. | Regen, Schnee und Eis sollen spürbar sein; Wind bleibt zunächst atmosphärisch. | 01, 02, 04, 07 |
| 2026-10-02 | Alle Kernbereiche müssen im ersten spielbaren Prototyp gemeinsam überzeugen. | Der Nutzer möchte Fahrphysik, Atmosphäre, Audio, Bots und die übrigen Systeme nicht künstlich auf drei Einzelstärken reduzieren. | 09, 10 |
| 2026-10-02 | Fahrer-, Kart- und Itemideen aus dem alten Produktionsauftrag werden als eigenständiger Kreativkatalog in die Babylon-Wissensbasis übernommen. | Diese Inhalte gelten als wertvolle Ursprungs- und Sarah-Ideen; alte Engine-Implementierung und technische Struktur bleiben ausgeschlossen. | 11, 14, README |
| 2026-10-03 | Die Wissensbasis erhält ein Gesamtgerüst, eine machbare Itemproduktionsmatrix, einen Bauplan und ein Fortschrittslog. | Längere autonome Arbeitsphasen brauchen einen gemeinsamen Status, klare Abnahmen, Modellwahl, Zeitfenster und tägliche Übergaben. | 00, 15, 16, 17, README |
| 2026-10-03 | Chrome unter Windows ist die erste Zielplattform; Mobile Browser werden von Anfang an berücksichtigt. | Der Nutzer möchte ein startbares Browser-Spiel auf PC und Handy, zuerst mit Tastatur, später mit Touch. | 03, 04, 18, 19 |
| 2026-10-03 | Der erste Prototyp enthält sechs Fahrer: ein Spieler plus fünf Bots. | Bots und sechs sichtbare, thematische Karts sollen bereits im ersten spielbaren Rennen vorhanden sein. | 01, 09, 10, 14 |
| 2026-10-03 | Das erste Item-MVP verwendet geradliniges Projektil, zielsuchendes Projektil und Falle. | Die verständlichen Grundprinzipien werden mit fahrerspezifischen Modellen und Effekten verbunden. | 10, 15 |
| 2026-10-03 | UI, lokale Einstellungen, Speicherung und Ein-Klick-Start sind Produktbestandteile. | Das Spiel soll ohne Entwicklerkonsole startbar und dauerhaft benutzbar sein. | 18, 19, README |
| 2026-10-03 | Der erste Abend wird als kontrollierte M0/M1-Session vorbereitet: Astra für Gesamtanalyse, Sol für lange Implementierung, Luna für Routine. | Der gesamte Kontext soll zuerst verstanden werden, danach soll eine längere technische Arbeit checkpointsicher laufen. | 16, 17, 20 |
| 2026-10-03 | `TEAM-HANDBOOK.md` wird Sarahs Einstiegshandbuch; GitHub wird gemeinsamer Grundpfeiler und M0c-Meilenstein. | Beide sollen das Projekt gleichartig bedienen, Änderungen nachvollziehen und über Branches/Pull Requests synchronisieren können. | START-HERE, TEAM-HANDBOOK, 00, 16, 17 |
| 2026-10-03 | Babylon-Neustart-Wissensbasis wird zunächst auf eigenem Branch veröffentlicht, nicht direkt auf `main`. | Sarah soll den Stand nicht automatisch übernehmen; alte/Sarah-Änderungen bleiben geschützt, bis ein bewusster Pull Request oder späterer Main-Wechsel entschieden wird. | START-HERE, TEAM-HANDBOOK, 17 |
| 2026-10-03 | Panel C ist die visuelle Hauptbasis; A ergänzt mögliche realistischere Materialien/Licht; B nur abgeschwächt. D und F sind ausgeschlossen, E bleibt Nebenreferenz. | Nutzerfeedback zur ersten Vergleichsgrafik. | 02, visuals/README, 17 |
| 2026-10-03 | Das gesamte zweite Raster G–L wird als Hauptzielrichtung angenommen. | Nutzer bestätigt die gemeinsame farbige, detailreiche, erwachsene und atmosphärische Richtung; technische Machbarkeit wird separat über einen Vertical Slice geprüft. | 00, 02, 09, 17, visuals/README |

## Pflegehinweis

## Bestätigte Antworten und Projekttrennung – 03.10.2026

| Entscheidung | Bedeutung / betroffene Dokumente |
|---|---|
| Privat für Team/Freunde, später öffentlich kostenlos; vorerst nur vorhandene/kostenlose Produktionsmittel | README, 00, 01, 05, 06, 10, 16, 18, TEAM-HANDBOOK |
| Sechs bisherige Fahrer; ein Fahrer/Kart zuerst vollständig, fünf einfachere Darstellungen | 01, 02, 05, 09, 10, 14, 16, START-HERE |
| Große Köpfe und karikierte Körper mit historischen Gesichtszügen; erste Strecke Berlin-/Stadionwelt | README, 00, 01, 02, 10, 13 |
| Nahe/ferne Verfolgerkamera und Fahrerperspektive mit Händen, Lenkrad, Armaturen und Vorderrädern | README, 02, 03, 04, 05, 09, 16, 19 |
| Drift, Sprung und Mini-Turbo; maßvolle positionsabhängige Itemchancen ohne heimliche Tempovorteile | 01, 07, 10, 15 |
| Drei identische Start-Itemregeln je Fahrer mit eigenen Modellen/Sounds/Animationen | 01, 07, 09, 10, 15, 16 |
| Punkt 10 ausdrücklich bestätigt: Spezialfähigkeit über eigene Eingabe und feste Abklingzeit | 03, 07, 10, 14, 15, 16, 19; konkrete Sekunden/Tasten bleiben offen |
| Kurze Trefferfolgen, Schutz vor Trefferketten, kosmetische Schäden bis Rennende, kurze Lenkbeeinträchtigung, faire Rücksetzung mit Zeitverlust | 01, 07, 09, 10, 16 |
| Android/iPhone im Querformat mit gleichen Regeln und skalierbarer Grafik; iPhone 15 Pro als Testgerät | 03, 04, 09, 10, 18, 19 |
| Individuelle Parodiestimmen plus Stadionsprecherin, vorproduziert; deutsche Namen, historische Musik ohne elektronische Stilrichtung | 01, 02, 05, 10, 16 |
| Nach Singleplayer private Online-Lobbys per Einladung mit Crossplay; Änderungen an Sarahs Ideen gemeinsam bestätigen | AGENTS, 00, 06, 10, 14, 15, TEAM-HANDBOOK |
| Neues Projekt direkt in D:\Diktator-Kart, altes Spiel nach Diktator-Kart-Legacy | README, START-HERE, AGENTS, 11, 18, TEAM-HANDBOOK; aktive Git-Verwaltung bleibt im Hauptverzeichnis, Sicherungen bleiben erhalten |

Die Fähigkeitsentscheidung ist keine pauschale Zustimmung zur Änderung historischer Fähigkeitsnamen oder sämtlicher Altmechaniken. Entsprechende Vorschläge bleiben getrennt zur gemeinsamen Bestätigung offen.

Bei jeder Änderung eines Grundpfeilers: abhängige Dokumente prüfen, Widersprüche markieren, Roadmap und offene Fragen aktualisieren und einen neuen Eintrag mit Datum ergänzen.
