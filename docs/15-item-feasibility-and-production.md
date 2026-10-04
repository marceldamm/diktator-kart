# Sarahs Itemideen – machbare Produktionsfassung

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Integrierte gemeinsame Startregeln – 03.10.2026

Im aktuellen neutralen Slice: ein Slot je Fahrer, neun regenerierende Postkisten, direkte Rohrpost, begrenzt nachführender Suchauftrag und Stempelfalle. Gemeinsame Trefferregeln für Mensch/Bots: Projektilverbrauch, kurzzeitige Verlangsamung, Drift-/Boostabbruch, 1,8 s Schutz; ausreichend hoher Hop vermeidet den Treffer. Je Typ höchstens sechs aktive Objekte, feste Meshpools, TTL und Warnanzeige. Neutrale Original-GLBs/WAVs mit editierbaren Quellen; keine fahrerspezifische historische Darstellung und keine persönliche Spezialfähigkeit. Verifiziert durch Modelltests und echte Drei-Runden-Browserläufe. Direkte Botprojektile verfehlten in den beobachteten Rennen; das wird nicht als Trefferabnahme dargestellt. Balancewerte sind vorläufig.

## Ziel

Die ursprünglichen Itemideen bleiben erhalten. Sie werden so übersetzt, dass Effekte und Animationen sichtbar und charaktervoll sind, ohne jedes Item zu einer komplizierten Physiksimulation zu machen. Ein Item besteht grundsätzlich aus Daten, Auslöser, Wirkung, Gegenmaßnahme, Präsentation, Audio, UI und sauberem Ende.

## Umsetzungsstufen

- **Stufe A – sofort machbar:** UI, Materialwechsel, einfache Partikel, Audio und kurze Zustandsänderung.
- **Stufe B – machbar mit begrenztem Gameplay:** Projektil, Zielauswahl, Kollision, Schutzzeit oder eine einfache Streckeninstanz.
- **Stufe C – später / risikoreich:** mehrere dynamische Hindernisse, komplexe Sichtmanipulation, echte Zerstörung oder viele gleichzeitige Weltreaktionen.

## Produktionsmatrix

| Idee | Machbarkeit | Babylon-Umsetzung | sichtbare Wirkung | Grenze / Fallback |
|---|---|---|---|---|
| Propaganda-Plakat | A/B | kurzer Screen-/World-Space-Overlay mit animiertem Plakat, optional ein vorbeiziehendes Kartonpanel | Sicht wird satirisch gestört, Warnrahmen bleibt sichtbar | nie die gesamte Fahrbahn verdecken; bei schwacher Hardware nur Overlay + Audio |
| Roter Aktenordner | A | entfernt das gegnerische Item oder setzt dessen Zustand zurück | Ordner klappt auf, Papierstempel und kurzer Ton | keine komplexe Item-Manipulation; Fallback ist „gegnerisches Item verbraucht“ |
| Personenkult-Statue | B | vorgefertigte, gepoolte Hindernis-Instanz an erlaubter Spawnzone | Statue wächst/klappt auf, Schatten und kurzer Bodenimpuls | keine zufällige Vollsperrung; sichere Linie und Ablauf-Timer |
| Zensurstempel | A | HUD-/Minimap-Maske mit Stempelanimation | Stempel schlägt ein, UI-Teil wird kurz unlesbar | Rennstrecke, Warnungen und tatsächliche Rangliste bleiben zugänglich |
| Geheimpolizei | B | begrenztes Zielgeschoss mit einfacher Zielverfolgung | klar erkennbare Annäherung, Trefferfunken/Rauch, kurzer Fahrnachteil | keine endlose Verfolgung; Schutzzeit und maximal ein Treffer |
| Wirtschaftsplan | A/B | kurzer Boost, Leistungsbalken, danach begrenzter Motoraussetzer | Auspuff hustet, Rauch und Propagandabalken übererfüllen sich | Gas/Lenkung bleiben aktiv; Nachteil hat feste Obergrenze |
| Dienstweg-Rakete | B | geradliniges Rohrpost-Projektil mit Lebensdauer und einem Treffer | Papierzettel, Aktenflügel, Stempelstaub, akustische Warnung | kein komplexes Raketensuchen; verfehlt sicher nach Ablauf |
| Diplomatische Immunität | A/B | transparenter Schildzustand mit rotierenden Pass-/Stempel-Elementen | Siegel zeigt Restdauer, Angriff prallt sichtbar ab, Papierkonfetti beim Ende | keine Wanddurchfahrt; nur definierte Angriffe werden abgefangen |

## Erstes Item-Dreierset für den Prototyp

Zusätzlich zu Sarahs thematischen Ideen braucht der erste spielbare Rennenkern drei leicht verständliche Archetypen:

1. **Geradliniges Projektil:** ein fahrerspezifisches Objekt fliegt nach vorn und trifft höchstens ein Ziel.
2. **Zielsuchendes Projektil:** eine begrenzte, klar angekündigte Verfolgung mit Schutz- und Ablaufregeln.
3. **Falle:** bleibt kurz auf der Strecke liegen und löst beim Überfahren eine kontrollierte Rutsch-/Störreaktion aus.

Diese drei Archetypen werden nicht als Nintendo-Objekte kopiert. Jeder Diktator erhält eigene Modelle, Materialien, Geräusche und Animationen. Grundwirkung, Trefferregeln und Balance bleiben zunächst identisch; Varianten verändern nicht Reichweite, Treffergröße oder Wirkdauer. Hintere Plätze erhalten maßvoll bessere Chancen auf hilfreiche Items, für Menschen und Bots nach derselben Verteilungsregel.

Treffer verursachen kurze Rutscher/Tempoverluste mit Warnung und Schutz gegen Trefferketten. Vollständige Kontrollentziehung bleibt sehr sparsam. Persönliche Fähigkeiten sind vom Itempool getrennt: eigene Eingabe und feste Abklingzeit, keine Aufladung durch Fahrleistung. Konkrete Werte sind offen. Änderungen an Sarahs Originalideen oder Namen benötigen gemeinsame Bestätigung.

## Gemeinsame technische Regeln

1. Items verändern zuerst einen klaren Simulationszustand; Effekte lesen diesen Zustand nur aus.
2. Jeder temporäre Effekt hat Start, aktive Phase, Ende und Aufräumvorgang.
3. Treffer, Schutz und Immunität nutzen eine gemeinsame Interaktionslogik.
4. Alle wichtigen Wirkungen sind zusätzlich über Icon, kurze Textmeldung oder Formsignal verständlich.
5. Bots erhalten dieselbe Itemwirkung in übersetzter Form, nicht eine geheime Sonderregel.
6. Partikel, Plakate, Papier und Staub werden begrenzt oder gepoolt.
7. Bei schlechter Performance wird zuerst Präsentation reduziert, nicht die zugrunde liegende faire Regel.

## Reihenfolge

1. Gemeinsame Treffer-, Lebensdauer- und kurzzeitige Schutzlogik vorbereiten.
2. Geradliniges Projektil, zielsuchendes Projektil und Falle als Start-Dreierset integrieren; Dienstweg-Rakete und Geheimpolizei können passende Themenvorlagen liefern.
3. Fahrerspezifische Darstellung und positionsabhängige Verteilung prüfen.
4. Eigenes Fähigkeitssystem mit fester Abklingzeit integrieren und gemeinsam bestätigte Fahrerideen umsetzen.
5. Weitere Altitems einschließlich Diplomatischer Immunität, Wirtschaftsplan, Aktenordner, Zensurstempel, Plakat und Statue nach Umfangsentscheidung ausarbeiten. Sie verdrängen nicht das bestätigte Start-Dreierset.

## Abnahme pro Item

Ein Item gilt erst als integriert, wenn es im normalen Rennen, bei Pause, nach Neustart, in einer reduzierten Qualitätsstufe, gegen einen Bot und mit mindestens einer Gegenmaßnahme geprüft wurde. Ein schöner Effekt ohne faire Wirkung ist nicht fertig.
