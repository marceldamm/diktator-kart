# Bauplan und Fahrplan für die Entwicklung

## Qualitätsauftrag – 04.10.2026

M3–M6 erhalten den umfassenden Qualitätspass aus [LONG-TERM-GOALS.md](../LONG-TERM-GOALS.md): wesentlich bessere, realitätsnähere Modelle, Charaktere, Fahrzeuge, Strecke/Umgebung, Effekte, Sounds, Stimmen und Musik anhand der gewählten G–L-Bildpräferenz. Für fertige Stimmen kein TTS; menschliche Aufnahmen oder geeignete echte Mitschnitte mit geklärten kostenlosen Nutzungsrechten. Vorhandene synthetische Clips sind Zwischenstand. In sichtbaren Paketen umsetzen, mit echter Fahrt/Spielbildern und menschlicher Hörabnahme prüfen; das flüssige Fahrgefühl und bestehende Leistungsziele bewahren.

## Unsere vier Arbeitsdateien

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Gemeinsame Hauptbasis – 03.10.2026

Aktiv ist ausschließlich der neue Babylon-main auf GitHub, initial aus Claude Q2d c13d47e. Alte Engine-/Archivstände dienen nur historischen Zwecken und werden nicht verändert oder als Spiel gestartet. Projektstart sichert lokale Arbeit, holt main und integriert aktuelle Babylon-Änderungen; Projektabschluss prüft, dokumentiert und veröffentlicht mit normalem Fast-Forward. Konkreter Ablauf: [21-team-workflow.md](21-team-workflow.md). Frühere „main unverändert/kein Push“-Sitzungsangaben unten sind historische Zwischenstände, keine aktuellen Arbeitsregeln.


## Laufender großer Slice – 03.10.2026

Auf ausdrücklichen Nutzerauftrag läuft der große neutrale Slice auf `codex/stadium-vertical-slice`, mit editierbaren Blender-/GLB-Assets und vorgezogener Drei-Runden-Rennschleife. Nach jedem größeren Paket: echte Browserprobe, relevante Tests/Build, Laufzeitbilder, offizielles Nutzungslimit und lokaler Git-Checkpoint. Bei etwa 15 % kleinerem Rest keine große neue Aufgabe; Abschluss mit ungefähr 5 % Puffer. Kein Reset, keine Zusatzkosten, kein Push/Merge.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](../PROGRESS-LOG.md).

## Zweck

Dieser Fahrplan beschreibt, was in welcher Reihenfolge passieren muss, damit eine längere autonome ChatGPT-/Codex-Arbeit möglich wird. Er enthält keine unrealistische Zusage eines fertigen Spiels in einer festen Zeit. Zeitangaben sind grobe Arbeitsfenster und hängen von Assets, Hardware, Browser, Fehlern und Nutzerfeedback ab.

Der konkrete Ablauf für den ersten Abend steht in [history/20-first-evening-runbook.md](history/20-first-evening-runbook.md).

## Meilensteine

### M0 – Grundgerüst eingefroren

**Aufgaben:** bestätigte Antworten aus Dokument 10 konsistent halten, restliche Altideen sichern, kostenlose Assetpipeline und Messplan vorbereiten, technische Startentscheidungen begründen. Berlin-/Stadionwelt, sechs Fahrer, drei Kameras und die Fähigkeitsauslösung sind bereits entschieden.

**Ergebnis:** alle Entscheidungen mit hoher Folgewirkung stehen in `README.md`, `00-project-framework.md`, `10-open-questions.md` und `12-decision-log.md`.

**Grobe Dauer:** 1–3 Arbeitssitzungen.

### M0c – Team- und GitHub-Grundlage

**Aufgaben:** bestehendes Repository und veröffentlichten Branch `babylon-neustart-2026` weiterverwenden, Sarahs Zugriff prüfen, `main` schützen, Branch-/Pull-Request-Regel festhalten, Umgang mit großen Assets entscheiden und beide Arbeitsplätze dokumentieren. Die alte Regel „push direkt nach main“ wird für den Neustart abgelöst. Vor späterer Übernahme die abweichende alte Branchhistorie gesondert prüfen.

**Ergebnis:** Du und Sarah können unabhängig arbeiten, Änderungen nachvollziehen und kontrolliert zusammenführen.

**Grobe Dauer:** 1–2 Arbeitssitzungen.

### M1 – Babylon.js-Technikschicht

**Aufgaben:** neues Browserprojekt direkt im Hauptverzeichnis, Engine-Start, Rendering-Fallback, Input, Debug-HUD, Asset-Laden, Szenenlebenszyklus, Messung und Ein-Klick-Start. Separate Aktionen für Kamerawechsel, Item und Spezialfähigkeit vorsehen.

**Ergebnis:** leere Babylon-Szene mit kontrolliertem Start, Pause, Neustart und Diagnose.

**M1-Stand 03.10.2026:** Die prozedurale Testszene und der lokale Startweg sind umgesetzt und geprüft. Das ist ein technischer Grundstand ohne Fahrphysik oder Renninhalt. Nach M1 beginnt M2 gemäß eigener Abnahme, einschließlich erster Lastmessung mit sechs Fahrzeugen.

**Grobe Dauer:** 2–5 Arbeitssitzungen.

### M2 – Fahrbarer Technikprototyp

**Aufgaben:** Kart, nahe/ferne Verfolgerkamera und First-Person-Sichtprobe, Beschleunigung, Bremse, Rückwärtsfahrt, Federung, Räder, Kollision, Hop, Drift, Mini-Turbo, einfache Strecke. Erste Lastmessung mit sechs Fahrzeugen; isolierte Ein-Kart-Tests bleiben interne Zwischenschritte.

**Ergebnis:** eine Runde fühlt sich stabil und angenehm an; keine alten PlayCanvas-/Ammo-Klassen wurden übernommen.

**Zwischenstand M2a, 03.10.2026:** Beschleunigung, Bremsen, Rückwärtsfahrt und Lenkung als erster Fahrkern umgesetzt. Die M2-Gesamtabnahme bleibt an die weiteren Fahrfunktionen, echte Kameras und sechs Fahrzeuge mit Lastmessung gebunden.

**Zwischenstand M2b, 03.10.2026:** Hop, Driftladung und Mini-Turbo mit Browserfeedback und Zustandsprüfungen ergänzt. Nächster Bauabschnitt: Federung/Bodenkontakt und kleine Untergrundereignisse. Echte Kameras und sechs Fahrzeuge bleiben danach weiterhin Teil der M2-Abnahme.

**Zwischenstand M2c–e, 03.10.2026:** Markierte Bodenwellen, vier Radkontakte, Federung, drei Kameramodi und fünf bewegte Lastfahrzeuge ergänzt. Browserprobe mit sechs einfachen Fahrzeugen liegt vor; die Werte sind nicht auf Zielhardware übertragbar. M2 benötigt noch gezielte Rand-/Kollisionsreaktion, längere Fahrgefühlprüfung und belastbare Kamera-/Leistungsmessung; die fünf Zusatzfahrzeuge werden erst in M3 zu Rennbots mit eigener Linie und Recovery.

**M2f-Teilstand, 03.10.2026:** Eine begrenzte Randstoßreaktion ist implementiert und im Modell/Browser geprüft. Der echte Fahr-/Hardwaretest und allgemeine Streckenkollision stehen aus; daher keine M2-Gesamtabnahme.

**M2f-Messstand, 03.10.2026:** Eine längere Headless-Probe auf der RTX 3070 Laptop GPU verglich alle drei Kameras mit einem und sechs Karts; Frame-Pacing und Meshzahlen blieben in diesem prozeduralen Test stabil. Menschlicher Fahrkomfort, normaler/schwacher PC, Mobile und allgemeine Streckenkollision bleiben offene M2-Abnahmen.

**M2g-Teilstand, 03.10.2026:** Ein einzelner Seitenblock belegt allgemeine statische Hinderniskollision im Fahrkern und Browser. Fahrzeug-zu-Fahrzeug-Kontakt, repräsentativere Streckenwände und menschliche/hardwareseitige Abnahme bleiben vor M2-Abschluss zu prüfen. Die fünf Lastkarts sind noch keine Rennbots.

**M2h-Teilstand, 03.10.2026:** Ein vorläufiger Kreis-zu-Kreis-Kontakt stoppt und trennt Spieler/Lastkart nach derselben Regel; Gegenverkehr, Build und Browser sind geprüft. Dies ersetzt keine vollständige Streckenkollision oder Mehrfachkontaktphysik. Menschlicher Fahrtest, Kamerakomfort und Messung auf normalem/schwachem PC sowie Mobile bleiben M2-Abnahmelücken. Die fünf Lastkarts sind weiterhin keine Rennbots.

**M2i-Kompatibilitätsprobe, 03.10.2026:** WebGL1 wurde im Chrome-Test auf dem starken Entwicklungsgerät absichtlich erzwungen und zeigte eine fahrende Szene. Ein echter älterer PC, normaler/schwacher Ziel-PC und Mobilgeräte bleiben ungeprüft; M2 wird dadurch nicht abgenommen.

**M2j-Korrektur, 03.10.2026:** Der Sechs-Kart-Stresstest fand und beseitigte im geprüften Pfad das Eindringen in den markierten Block nach Fahrzeugstößen. Wiederholte Positionskorrektur ist weiter nur eine Arcade-Näherung; menschlicher Fahrcheck, echte Zielgeräte und repräsentative Strecke bleiben vor M2-Abschluss offen.

**Abnahmeführung:** Das getrennte M2-Prüfprotokoll in `09-roadmap.md` hält technische Belege, menschliches Fahr-/Kameraurteil und Gerätewerte auseinander. Ohne praktische Beurteilung und erste normale-PC-Messung wird M2 nicht als abgeschlossen markiert; fehlende schwächere/Mobilgeräte bleiben als offene Zielplattformprüfung sichtbar.

**M2k-Sichtprobe, 03.10.2026:** Statische Browserbilder der fernen Verfolger- und Fahrerperspektive beim Fahrzeugkontakt ergänzen die technische Kameraabdeckung. Eine menschliche Fahrt mit Beobachtung von Kameraruhe, Sicht und Komfort bleibt für die M2-Abnahme nötig.

**M2l-Messhilfe, 03.10.2026:** Die scrollbare F3-Diagnose liefert ein gleitendes 300-Frame-Fenster sowie Auflösung und verfügbaren GPU-Pfad. Sie bereitet die normale-PC-Prüfung aus Dokument 09 vor, ersetzt sie aber nicht.

**Nutzerfahrt und vorgezogene Stilskizze, 03.10.2026:** Das erste menschliche Urteil bestätigt die technische Fahrgrundlage einschließlich Hop/Drift/Turbo als funktionierend, benennt aber unfertige Animationen, Fahrerperspektive und einen großen Abstand zu G–L. Deshalb zeigt die normale Babylon-Ansicht jetzt einen neutralen Stadionvorplatz-Blockout; `?world=lab` hält die reine M2-Testfläche für wiederholbare Prüfungen bereit. M2-Gesamtabnahme und die gemeinsame M3-Auswahl bleiben offen. Der Blockout ist kein fertiger M3-Abschnitt.

**Grobe Dauer:** 4–10 Arbeitssitzungen.

### M3 – Erster Vertical Slice

**Vorlaufender Vorschlag:** Dokument 14 empfiehlt Mussolini/Il Duce GT als ersten vollständig auszuarbeitenden Fahrer/Kart und trennt Altideen von möglichen Produktionsausführungen. Die neutrale Stilskizze legt diese Auswahl nicht fest; M2-Abnahme und gemeinsame Stilprüfung bleiben nötig.

Dokument 01 hält einen quellenbasierten, fiktiven Berlin-/Stadion-Routenvorschlag mit Inhaltsprüfung fest. Für M3 genügt der dort abgegrenzte erste Abschnitt; die Route wird erst nach gemeinsamer Auswahl und M2-Abnahme produziert. Historische Fotos/Schilder und konkrete Zeichen brauchen vor Nutzung eigene Freigabe und Lizenzprüfung.

**Aufgaben:** ein Diktator/Kart vollständig ausgearbeitet, fünf weitere in einfacherer Darstellung als Bots, ein historischer Berlin-/Stadionabschnitt, Beleuchtung, Materialpass, Atmosphäre und Audio. Drei Kameras einschließlich Cockpit mit Händen, Lenkrad, Armaturen und Vorderrädern prüfen. Start-Items beginnen, vollständiges Dreierset in M4.

**Ergebnis:** ein kleiner Abschnitt mit sechs Teilnehmern vermittelt die Zielrichtung. Stil gemeinsam prüfen, bevor die übrigen fünf Modelle vollständig ausgearbeitet werden.

**Grobe Dauer:** 5–12 Arbeitssitzungen.

### M4 – Kernrennen

**Aufgaben:** Checkpoints, drei Runden, Platzierung, Ziel, Ergebnis, Revanche, fünf Bots, drei Bot-Persönlichkeiten, Strecke mit sicherer Linie und Abkürzung. Drei Start-Items, gemeinsame Grundwirkungen, positionsabhängige Itemchancen und Schutz vor Trefferketten integrieren.

**Ergebnis:** vollständiges, wiederholbares Singleplayerrennen ohne geheime Vorteile. Sichtbare Rücksetzung bei Festfahren mit Zeitverlust ist für Menschen und Bots nach derselben Regel erlaubt; kein geschenkter Checkpoint-Fortschritt.

**Grobe Dauer:** 6–15 Arbeitssitzungen.

### M5 – Items, Fahrerfähigkeiten und Weltreaktionen

**Aufgaben:** Spezialfähigkeiten mit eigener Eingabe und festen Abklingzeiten, HUD/Touch-Konzept, begrenzter Schaden, lokale Wettereffekte und Weltveränderungen. Vorproduzierte Fahrer-Parodiestimmen, Stadionsprecherin, historisch geprägte Musik ohne elektronische Stilrichtung. Erweiterung des Itempools erst nach Umfangsentscheidung; Änderungen an Sarahs Ideen gemeinsam bestätigen.

**Ergebnis:** Satire und Ursache-Wirkung sind im Rennen sichtbar, hörbar und fair spielbar.

**Grobe Dauer:** 10–25 Arbeitssitzungen.

### M6 – Kunst-, Audio- und Inhaltsausbau

**Aufgaben:** alle sechs Fahrer/Karts auf den abgenommenen Stil ausbauen, Zuschauer, vollständige Berlin-/Stadionstrecke, Siegerehrung, Rennbericht, UI, Untertitel, Audio-Mix, historische Inhaltsprüfung. Alte Hauptstadtzonen bleiben optionale Ideenquelle.

**Ergebnis:** Version-1-Singleplayer wirkt wie ein bewusst gestaltetes Spiel und nicht wie ein Prototyp.

**Grobe Dauer:** 15–35 Arbeitssitzungen.

### M7 – Performance und Abnahme

**Aufgaben:** frühe Messungen abschließend zusammenführen: normale PCs, Android und iPhone im Querformat, Touch, alle drei Kameras, Qualitätstufen, Ladezeiten, Speicher, Neustart/Pause, Barriereoptionen, fehlende Assets und Audio. iPhone 15 Pro ist benannt; schwacher PC und Android-Testgerät fehlen noch.

**Ergebnis:** belastbare Aussage zu Zielhardware und bekannten Grenzen.

**Grobe Dauer:** 5–12 Arbeitssitzungen.

## Zeithorizont und Sitzungsgrößen

Die folgenden Angaben sind Planungsfenster, keine Garantie:

- **Kurzsession, etwa 20–60 Minuten:** Dokumente synchronisieren, kleine Fehler, eine klar begrenzte Analyse oder ein kleiner Test.
- **Mittlere Session, etwa 1–3 Stunden:** ein zusammenhängendes Teilfeature, ein Item, ein kleiner Asset-/UI-Pass oder mehrere verwandte Dokumentänderungen.
- **Lange Session, etwa 3–8 Stunden:** ein klar abgegrenzter Meilenstein mit Implementierung, Tests und Dokumentationsabschluss. Vorher muss der Auftrag vollständig formuliert sein; währenddessen darf der Umfang nicht beliebig wachsen.
- **Mehrere Tage:** nur für größere Meilensteine wie Fahrprototyp, Vertical Slice oder Kernrennen. Jeder Tag endet mit einem Fortschrittslog-Eintrag, damit eine neue Sitzung sicher übernehmen kann.

Für lange Sessions eignet sich Sol für Kernarchitektur und zusammenhängende Spielsysteme. Luna kann anschließend Inventar, Tests, Dokumentation und kleine Korrekturen übernehmen. Astra sollte am Anfang oder Ende eines großen Meilensteins für Gesamtprüfung und festgefahrene Probleme eingesetzt werden.

### M8 – Erweiterungen

Nach stabilem Singleplayer sind private Online-Lobbys per Einladung mit Crossplay das nächste große Produktziel. Kostenlos tragfähigen Betrieb prüfen. Weitere Strecken, Fahrer, Geist, Orden und Fotomodus werden separat priorisiert und sind keine pauschale Voraussetzung für Multiplayer. Zunächst private Veröffentlichung für Team/Freunde, später öffentlich kostenlos.

## Produktionsrahmen

Vorerst vorhandene und kostenlose Werkzeuge/Assets, kein Zusatzbudget für Musik oder Stimmen. Die bisherigen Sitzungszahlen sind unkalibrierte Planungsfenster; sie berücksichtigen keine gemessene Produktionsgeschwindigkeit und sind nach dem ersten Art-/Audio-Pilot neu zu schätzen. Cockpitdetails und sechs individuelle Figuren erhöhen den Aufwand. Änderungen an Sarahs ursprünglichen Ideen brauchen gemeinsame Bestätigung.

## Lange autonome Sitzungen

Eine lange Sitzung braucht immer einen klaren Auftrag mit:

- Ziel und Nicht-Ziel
- betroffenen Dateien
- Definition of Done
- erlaubten Annahmen
- Test-/Prüfplan
- gewünschtem Abschlussbericht

Geeignete lange Aufgaben sind zum Beispiel: „Baue M2 bis zum ersten fahrbaren Test und aktualisiere danach Fortschrittslog, offene Probleme und Messwerte.“ Ungeeignet ist: „Mach das Spiel schöner.“

## Modellverwendung

- **Luna:** Dokumentationssynchronisierung, Inventare, kleine klar umrissene Edits, einfache Tests, Assetlisten, Fortschrittsberichte.
- **Sol / GPT-6.1 Sol:** Architektur, Fahrmodell, Rennsimulation, Bot- und Itemsysteme, zusammenhängende Änderungen über mehrere Dateien.
- **Astra:** Gesamtprüfung vor einem Meilenstein, widersprüchliche Anforderungen, schwierige Performance-/Architekturprobleme, festgefahrene Fehler und finale Qualitätsanalyse.

Das Modell wird nach Aufgabenrisiko gewählt, nicht pauschal für das ganze Projekt. Nach einer Astra-/Sol-Entscheidung kann Luna die Routinepflege übernehmen.

## Täglicher Arbeitsablauf

1. `README.md`, `00-project-framework.md`, `PROGRESS-LOG.md` und das betroffene Detaildokument lesen.
2. Eine konkrete Aufgabe mit Ziel, Nicht-Ziel und Abnahmekriterium auswählen.
3. Vorhandenen Stand prüfen; keine alte Technik blind kopieren.
4. Kleinsten sinnvollen Schritt umsetzen.
5. Angemessen testen und zwischen verifiziert, angenommen und offen unterscheiden.
6. Hauptdatei, Detaildateien, offene Fragen und Entscheidungslog synchronisieren.
7. Fortschrittslog mit Ergebnis, Problemen, Messwerten und nächstem Schritt aktualisieren.

## Was der Nutzer in einer neuen Sitzung diktieren kann

```text
Projekt: Diktator Kart – Babylon-Neustart 2026
Heute ist: [Datum]
Letzter Stand: [kurzer Eintrag aus PROGRESS-LOG.md]
Aufgabe: [eine konkrete Aufgabe]
Nicht-Ziel: [was heute nicht angefasst wird]
Modellwunsch: Luna / Sol / Astra / nach eigener Einschätzung
Abnahme: [woran erkennen wir, dass die Aufgabe fertig ist?]
Arbeite selbstständig, halte die Dokumentation synchron und melde am Ende verifiziert, offen, blockiert und nächsten Schritt.
```

## Abschlussbericht jeder längeren Sitzung

```text
Erledigt:
Verifiziert:
Nicht verifiziert:
Geänderte Dateien:
Neue Entscheidungen:
Offene Probleme:
Nächster sinnvoller Schritt:
Empfohlenes Modell für den nächsten Schritt:
```
