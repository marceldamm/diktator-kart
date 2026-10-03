# Extraktion aus dem Altprojekt

## Gemeinsame Hauptbasis – 03.10.2026

Aktiv ist ausschließlich der neue Babylon-main auf GitHub, initial aus Claude Q2d c13d47e. Alte Engine-/Archivstände dienen nur historischen Zwecken und werden nicht verändert oder als Spiel gestartet. Projektstart sichert lokale Arbeit, holt main und integriert aktuelle Babylon-Änderungen; Projektabschluss prüft, dokumentiert und veröffentlicht mit normalem Fast-Forward. Konkreter Ablauf: [21-team-workflow.md](21-team-workflow.md). Frühere „main unverändert/kein Push“-Sitzungsangaben unten sind historische Zwischenstände, keine aktuellen Arbeitsregeln.


## Quellenlage

Zunächst wurden Projektindex, kreative Produktionsaufträge und Dateien unter `game-review/` im Projektspiegel ausgewertet; `sources/` war leer. Bei der Gesamtprüfung am 03.10.2026 wurden zusätzlich die Dokumente und Fahrerdefinitionen des alten Checkouts auf D: gelesen. Nach der Trennung liegen sie unter `Diktator-Kart-Legacy/`. Die frühere Sicherung bleibt unter `Diktator-Kart-Legacy/Sicherung-vor-Umzug-2026-10-03/` erhalten. Diese Lektüre ist kein erneuter Live-Test.

## Übernommene Ideen und Entscheidungen

- eigenständiger satirischer Browser-3D-Kart-Racer
- Macht-, Diktator-, Bürokratie- und Propagandasatire
- Hauptstrecke „Größenwahn Grand Prix – Hauptstadt auf Bewährung“
- fünf Streckenzonen: Palastplatz, Boulevard, Staatsdruckerei, Baustelle, Palastgärten
- drei Runden mit dekorativen Weltveränderungen
- sichtbare Items mit Gegenmaßnahmen
- deutsche, ereignisgesteuerte Sprecherin
- Fahrer mit individuellen Details und erkennbaren Reaktionen
- fünf Gegner mit drei Fahrstilen als Designidee
- Siegerehrung und satirischer Rennbericht
- Priorität: Spielbarkeit, Fahrgefühl, vollständiges Rennen, Bots, Items, Lesbarkeit, Charakter, Audio, Politur, Extras
- spätere Ziele: Geist, Orden, Fotomodus, weitere Fahrer und Multiplayer
- konkreter Fahrerpool aus zwölf historischen Diktatorfiguren mit individuellen Kartnamen und satirischen Spezialfähigkeiten
- Gewichtsklassen leicht / mittel / schwer plus ein Spezialfahrer
- Itempool aus Propaganda-Plakat, rotem Aktenordner, Personenkult-Statue, Zensurstempel, Geheimpolizei und Wirtschaftsplan
- ergänzende Dienstweg-Rakete und Diplomatische Immunität
- gemeinsame Fähigkeitssysteme mit Cooldowns und ironischen Eigennachteilen
- Bots über gemeinsame Eingabeschnittstelle mit Waypoints, Vorausschau, Recovery, Drift, Überholen und Itementscheidungen
- zwölf benannte spätere Kostümideen und vier vorgeschlagene Multiplayer-Teams mit alten Zahlenwerten
- Farbwerte, satirische Titel und bewegliche Fahrzeugdetails der sechs bisherigen Fahrer aus der alten Fahrerauswahl

## Belegte alte Bestandteile

Der Index beschreibt PlayCanvas, TypeScript, Vite und Ammo, einen Raycast-Kartcontroller, sechs Fahrerprofile, fünf Bots, Drift/Boost, Items, HUD, lokale Speicherung, Audiovarianten und ein erstes GLB-Asset. Die Bilder unter `game-review/` zeigen den prototypischen Stand mit vereinfachten Fahrer-/Kartformen und Renn-HUD.

## Bewusst nicht übernommen

Nicht übernommen werden alte Quellklassen, Szenen, Buildkonfiguration, PlayCanvas-Assets, Ammo-Ladepfade, alte Render-/Performancewerte und Workarounds. Babylon.js wird unabhängig aufgebaut. Ein altes Verhalten darf nur übernommen werden, wenn es als gewünschtes Spieldesign bestätigt und im neuen System neu implementiert wird.

Der Fahrer-, Kart- und Itemkatalog einschließlich Kostümvarianten, Team-Boni, Farbwerten und beweglichen Details steht in [14-character-and-item-catalog.md](14-character-and-item-catalog.md). Die konkret bei der Gesamtprüfung entdeckten Lücken sind damit geschlossen. Der Katalog ist keine Garantie, dass jede beliebige alte Notiz schon vollständig übertragen wurde; das Altarchiv bleibt vollständig lesbar. Die genaue persönliche Urheberschaft einzelner bearbeiteter Altideen ist nicht durchgängig belegt. Die alte technische Implementierung wird nicht weiterentwickelt oder übernommen.

## Widersprüche und Vorsicht

Der Index nennt abweichende Dokumentationsstände bei Driftstufen und veraltete README-Aussagen. Deshalb gilt: Nutzerentscheidung und neue Abnahme vor Alttext; Alttext vor Annahme; Code-/Livebeleg vor Behauptung. Die alte Headless-Messung von ungefähr 4 FPS ist kein normaler-PC-Benchmark.
