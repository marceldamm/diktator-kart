# Extraktion aus dem Altprojekt

## Quellenlage

Aus dem vorhandenen Projektspiegel wurden `Diktator-Kart-Projektindex.md`, die kreativen Produktionsaufträge und die sichtbaren Dateien unter `game-review/` ausgewertet. `sources/` war leer. Der eigentliche alte Checkout ist im Spiegel nicht vollständig vorhanden; der Index beschreibt ihn, ersetzt aber keinen erneuten Live-Test.

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

## Belegte alte Bestandteile

Der Index beschreibt PlayCanvas, TypeScript, Vite und Ammo, einen Raycast-Kartcontroller, sechs Fahrerprofile, fünf Bots, Drift/Boost, Items, HUD, lokale Speicherung, Audiovarianten und ein erstes GLB-Asset. Die Bilder unter `game-review/` zeigen den prototypischen Stand mit vereinfachten Fahrer-/Kartformen und Renn-HUD.

## Bewusst nicht übernommen

Nicht übernommen werden alte Quellklassen, Szenen, Buildkonfiguration, PlayCanvas-Assets, Ammo-Ladepfade, alte Render-/Performancewerte und Workarounds. Babylon.js wird unabhängig aufgebaut. Ein altes Verhalten darf nur übernommen werden, wenn es als gewünschtes Spieldesign bestätigt und im neuen System neu implementiert wird.

Der vollständige extrahierte Fahrer-, Kart- und Itemkatalog steht in [14-character-and-item-catalog.md](14-character-and-item-catalog.md). Damit sind die kreativen Altideen in der neuen Wissensbasis gesichert; der alte Spielcheckout muss für die weitere Konzeptarbeit nicht weiter verändert werden.

## Widersprüche und Vorsicht

Der Index nennt abweichende Dokumentationsstände bei Driftstufen und veraltete README-Aussagen. Deshalb gilt: Nutzerentscheidung und neue Abnahme vor Alttext; Alttext vor Annahme; Code-/Livebeleg vor Behauptung. Die alte Headless-Messung von ungefähr 4 FPS ist kein normaler-PC-Benchmark.
