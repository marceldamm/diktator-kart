# Gesamtgerüst und zentrale Arbeitsgrundlage

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
7. **Performance:** browserfähig auf normalen PCs; Qualität wird skalierbar geplant und gemessen, nicht behauptet.
8. **Arbeitsfähigkeit:** Jede längere KI-Arbeit hinterlässt einen nachvollziehbaren Stand, ein Ergebnis, offene Probleme und den nächsten Schritt.
9. **Gemeinsame Versionsbasis:** GitHub synchronisiert den Entwicklungsstand zwischen dir, Sarah und Codex; stabile Stände und laufende Arbeiten werden getrennt gehalten.

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
- Altideen: Fahrer, Karts, Items, Bots, Drift, Audio und Streckenideen extrahiert
- Babylon.js: festgelegt, aber noch kein technischer Neustart implementiert
- Itemumsetzung: konzeptionell machbar, technische Produktionsmatrix folgt in `15-item-feasibility-and-production.md`
- Bauplan: in `16-production-blueprint.md`
- Laufende Historie: in `17-progress-log.md`
- Nächster echter Meilenstein: Grundsatzfragen schließen und einen kleinen Babylon.js-Technik-/Fahrprototyp bauen

## Definition eines „fertigen“ Arbeitsstands

Ein Abschnitt ist erst fertig, wenn:

- die Entscheidung oder Änderung dokumentiert ist,
- die abhängigen Dokumente geprüft und gegebenenfalls angepasst sind,
- die Umsetzung oder Nichtumsetzung klar gekennzeichnet ist,
- eine angemessene Prüfung stattgefunden hat,
- offene Probleme und der nächste Schritt im Fortschrittslog stehen.
