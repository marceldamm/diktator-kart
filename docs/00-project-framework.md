# Gesamtgerüst und zentrale Arbeitsgrundlage

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Unsere vier Arbeitsdateien

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Gemeinsame Hauptbasis – 03.10.2026

Aktiv ist ausschließlich der neue Babylon-main auf GitHub, initial aus Claude Q2d c13d47e. Alte Engine-/Archivstände dienen nur historischen Zwecken und werden nicht verändert oder als Spiel gestartet. Projektstart sichert lokale Arbeit, holt main und integriert aktuelle Babylon-Änderungen; Projektabschluss prüft, dokumentiert und veröffentlicht mit normalem Fast-Forward. Konkreter Ablauf: [21-team-workflow.md](21-team-workflow.md). Frühere „main unverändert/kein Push“-Sitzungsangaben unten sind historische Zwischenstände, keine aktuellen Arbeitsregeln.


## Historischer Produktionsstand – 03.10.2026 (nicht mehr aktueller Arbeitsauftrag)

Dieser Abschnitt hält den damaligen Auftrag und Arbeitsstand fest: neutraler Vertical Slice auf `codex/stadium-vertical-slice`, 441-m-Kurs und lokale Arbeit ohne Push. Er ist historische Projektgeschichte und beschreibt weder den heutigen Branch noch den aktuellen Figuren-/Qualitätsauftrag. Der aktuelle Stand und nächste Schritt stehen in CURRENT-WORKLIST.md und PROGRESS-LOG.md.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](../PROGRESS-LOG.md).

## Zweck

Dieses Dokument verbindet die Grundpfeiler, Detaildokumente, offene Entscheidungen und den späteren Bauplan. Es ist die erste Datei, die bei einer neuen Arbeitsphase gelesen wird. Die kurze öffentliche Zusammenfassung bleibt in `README.md`; dieses Dokument ist die ausführlichere interne Leitplanke.

## Projektbild in einem Absatz

Diktator Kart wird ein eigenständiger, erwachsener Browser-3D-Kart-Racer mit Babylon.js. Der Spieler steuert historische Diktatoren in satirisch dargestellten, themenbasierten Karts durch unterschiedliche politische Machtwelten. Das Fahrgefühl liegt zwischen Arcade und Simulation: ungefähr 6/10 Realismus, mit Federung, Reifen-, Untergrund-, Wetter- und Schadensreaktionen, ohne zur Fahrsimulation zu werden. Die Spielwelt ist schwarz, bissig und provokant, aber nicht rechtsextrem, nicht verherrlichend und nicht auf Kosten von Opfern oder Minderheiten. Die Referenzqualität reicht von der unmittelbaren Lesbarkeit klassischer Kart-Racer bis zu deutlich detailreicherer, erwachsenerer und effektvollerer Browsergrafik auf normalen PCs.

## Verbindliche Säulen

1. **Fahrgefühl:** direkte, angenehme Steuerung; Drift, Hop, Mini-Turbo, Federung, Untergrund und begrenzte Schäden reagieren glaubwürdig.
2. **Charaktere und Karts:** historische Diktatoren als erkennbare Satirefiguren; jedes Kart hat eigene Silhouette, Farben, bewegliche Teile, Fahrprofil und Spezialfähigkeit.
3. **Satirische Welt:** Propaganda, Personenkult, Bürokratie, Größenwahn und autoritäre Selbstinszenierung sind als spielbare, sichtbare Ursache-Wirkungs-Ketten gestaltet.
4. **Historische Grenze:** Anspielungen sind erlaubt, aber kritisch; keine Verherrlichung, keine rechtsextreme Botschaft, keine Holocaust-/Genozid-Szenarien und keine Herabwürdigung von Opfern oder Minderheiten.
5. **Audio und Atmosphäre:** professionelle Klangwelt, streckenspezifische Musik, Sprecherdramaturgie, Wetter, Nebel, Schatten, Partikel und Materialreaktionen.
6. **Faire Systeme:** Bots fahren wirklich, machen Fehler, analysieren Strecke und Items, erhalten aber keine geheimen Vorteile.
7. **Performance und Plattformen:** Chrome/Windows zuerst, Android und iPhone im Querformat als verbindliche Anschlussplattformen; gleiche Rennregeln und skalierbare Grafik. Auf normalen PCs und echten Mobilgeräten messen.
8. **Arbeitsfähigkeit:** Jede längere KI-Arbeit hinterlässt einen nachvollziehbaren Stand, ein Ergebnis, offene Probleme und den nächsten Schritt.
9. **Gemeinsame Versionsbasis:** GitHub synchronisiert den Entwicklungsstand zwischen dir, Sarah und Codex; stabile Stände und laufende Arbeiten werden getrennt gehalten.
10. **Veröffentlichung und Budget:** erst privat für das Team und Freunde, später öffentlich kostenlos. Produktion mit vorhandenen und kostenlosen Werkzeugen/Assets; zusätzliches Budget ist nicht freigegeben.
11. **Gemeinsame Kreativentscheidungen:** Änderungen an Sarahs ursprünglichen Ideen werden gemeinsam bestätigt. Original, Umsetzungsvorschlag und bestätigte Entscheidung bleiben unterscheidbar.

## Bestätigte Konkretisierung vom 03.10.2026

- Sechs bisherige Fahrer bleiben der Startkader: Hitler, Stalin, Mussolini, Mao, Kim Jong-un, Castro. Ein Fahrer/Kart erhält zuerst den vollständigen Art-Pass; die übrigen fünf fahren in einfacherer Darstellung mit.
- Große Köpfe, karikierte Körper und erkennbare historische Gesichtszüge; historische Berlin-/Stadionwelt als erster Kurs. Der alte gemischte Hauptstadt-Kurs bleibt Ideenquelle, kein verbindlicher erster Streckenplan.
- Drei Kameramodi: Verfolger nah/fern und Fahrerperspektive. Cockpit, Hände, Lenkrad, Armaturen und Vorderräder werden von Anfang an im Assetplan berücksichtigt.
- Drift, Sprung und Mini-Turbo; maßvolle Aufholhilfe über positionsabhängige Itemchancen, keine geheimen Tempovorteile.
- Drei Start-Itemregeln für alle Fahrer identisch; nur Modell, Sound und Animation wechseln. Spezialfähigkeiten sind ein eigenes System mit eigener Eingabe und festen Abklingzeiten. Konkrete Tasten und Zeiten sind noch abzustimmen.
- Kurze Trefferfolgen, Schutz vor Trefferketten, kosmetische Schäden bis Rennende und kurzzeitige Lenkbeeinträchtigung; faire Rücksetzung mit Zeitverlust für Mensch und Bot.
- Vorproduzierte individuelle Parodiestimmen plus Stadionsprecherin, deutsche Namensdarstellung, historisch geprägte Musik ohne elektronische Musikrichtung.
- Nach Singleplayer: private Online-Lobbys per Einladung, getrennte Geräte, Crossplay. iPhone 15 Pro ist als Testgerät benannt; Android- und schwacher PC-Testplatz fehlen noch.

Die visuelle Hauptzielrichtung ist der Stilraum aus der zweiten Vergleichsgrafik G–L: farbig, detailreich, erwachsen, materialbetont und atmosphärisch. Die Bilder definieren die gewünschte Richtung, nicht bereits ein garantiertes Echtzeitniveau.

## Systemabhängigkeiten

```text
Inhaltsgrenzen + Zielgruppe
        ↓
Game Design / Fahrer / Items / Strecken
        ↓
Fahrmodell + Rennsimulation + Botentscheidungen
        ↓
Präsentation: Modelle + Animation + Audio + UI + Effekte
        ↓
Performance + Tests + Abnahme
        ↓
weitere Strecken, Komfortfunktionen, Multiplayer
```

Eine Änderung an einer oberen Ebene muss alle darunterliegenden Ebenen prüfen. Beispiel: Ein stärkerer Schaden beeinflusst Fahrmodell, Animation, Audio, UI, Bots, Balance und Performance.

## Quellenhierarchie

1. aktuelle Nutzerentscheidung in diesem Projektchat
2. `README.md` und dieses Gesamtgerüst
3. aktuelle Detaildokumente und Entscheidungslog
4. extrahierte Altideen in `docs/11-legacy-extraction.md` und `docs/14-character-and-item-catalog.md`
5. alter Checkout und alte Screenshots als Beleg- und Inspirationsmaterial

Alte Technik ist keine Autorität für die neue Architektur.

## Aktueller Stand am 03.10.2026

- Wissensbasis: angelegt und quergeprüft
- Altideen: Fahrer, Karts, Items, Bots, Drift, Audio, Streckenideen sowie Kostümvarianten, Team-Boni und individuelle Details aus den bekannten Altquellen extrahiert; Altarchiv bleibt für spätere Rückfragen erhalten
- Babylon.js: M1-Technikgrundstand und M2a–j-Test-Kart mit Beschleunigung, Bremse, Rückwärtsfahrt, Lenkung, Hop, Drift, Mini-Turbo, Federung, drei Test-Kameramodi, fünf bewegten Lastfahrzeugen und vorläufigem Rand-, Hindernis- und Fahrzeugkontakt im Projektroot implementiert; Rennbots, vollständige Streckenkollision und Rennregeln folgen
- Itemumsetzung: konzeptionelle Produktionsmatrix in `15-item-feasibility-and-production.md`; technische Machbarkeit und Balance noch nicht praktisch verifiziert
- Bauplan: in `16-production-blueprint.md`
- M3-Vorbereitung: Mussolini/Il Duce GT ist in Dokument 14 als erster Art-Pilot vorgeschlagen, nicht ausgewählt; M2-Abnahme und gemeinsame Stilprüfung bleiben vorgelagert
- Sichtbarer Zwischenstand: eine neutrale Babylon-Vorplatz-Stilskizze nutzt den bestätigten G–L-Stilraum als Ziel, erfüllt ihn aber noch nicht; `?world=lab` erhält die reproduzierbare M2-Testumgebung. Fahrer-/Streckenwahl und M2-Abnahme bleiben offen
- Erste Strecke: Dokument 01 enthält einen quellenbasierten Vorschlag für eine fiktive Stadion-/Boulevardroute; Landmarken, Zeitbild, Zeichen und Layout sind nicht beschlossen
- Laufende Historie: in `PROGRESS-LOG.md`
- Nächster Arbeitsschritt innerhalb M2: Fahrgefühl, Kamerakomfort und Kontaktreaktionen durch einen Menschen sowie Leistung auf normalem/schwachem PC und Mobilgeräten prüfen; die Headless-RTX-Probe ist keine Zielhardware-Abnahme

## Definition eines „fertigen“ Arbeitsstands

Ein Abschnitt ist erst fertig, wenn:

- die Entscheidung oder Änderung dokumentiert ist,
- die abhängigen Dokumente geprüft und gegebenenfalls angepasst sind,
- die Umsetzung oder Nichtumsetzung klar gekennzeichnet ist,
- eine angemessene Prüfung stattgefunden hat,
- offene Probleme und der nächste Schritt im Fortschrittslog stehen.
