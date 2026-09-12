# Bots

## Architektur

Fünf Gegner verwenden wie der Spieler `KartInput` und dynamische Ammo-Rigidbodies. Die Botlogik setzt ausschließlich Lenkung, Gas/Bremse, Hop und Drift; sie teleportiert während eines laufenden Rennens nicht und erhält innerhalb des Botfelds keine abweichenden Motor- oder Physikwerte.

Der Spieler nutzt weiterhin den `RaycastKartController`. Mehrere gleichzeitig registrierte `btRaycastVehicle`-Actions verursachten mit dem eingebundenen Ammo-WASM reproduzierbar Speicherzugriffsfehler. Die Bots nutzen deshalb vorerst den vorhandenen physikalischen `KartController`. Das ist eine dokumentierte Stabilitätsentscheidung, kein geheimer Botvorteil; eine gemeinsame Multi-Vehicle-RayCast-Lösung bleibt offen.

`BotRaceManager` verwaltet Startaufstellung, Controller, individuelle `RaceController` und die Platzberechnung. Die Rangfolge basiert auf abgeschlossenen Runden, geordneten Checkpoints und Distanz zum nächsten Tor.

## Persönlichkeiten

- **Paraderacer:** breite, vorsichtige Linie; reduziert in Kurven früher das Gas und wird später defensive Items bevorzugen.
- **Größenwahnsinniger:** aggressiveres Gas, spätere Kurvenreaktion, hohe Drift- und Abkürzungsbereitschaft.
- **Bürokrat:** gleichmäßige mittlere Linie und kontrollierte Entscheidungen; wird später Itemboxen priorisieren.

Die fünf Startgegner verwenden diese drei Profile in der Verteilung 2/2/1. `shortcutRisk` ist bereits Teil der Daten, die tatsächliche Druckerei-Abkürzung folgt mit dem Streckenausbau.

Der gemeinsame Botcontroller ist auf 22 Einheiten/s begrenzt. Bei der aktuellen Streckenlänge zielt das auf etwa 60–100 Sekunden pro Runde; die reale Zeit wird über vollständige Browserrennen weiter kalibriert.

## Noch zu verifizieren

- drei komplette Rennen mit Zieleinlauf aller fünf Bots
- Recovery, wenn ein Bot entgegen der Fahrtrichtung oder an einer Barriere steht
- angemessene Wirkung von Sicht-/Täuschungsitems auf die Vorausschau
- Itemwahl und Spezialfähigkeiten pro Persönlichkeit

## Verifizierter Zwischenstand

- fünf Bots verlassen die Startaufstellung unter eigener Physik
- alle drei Profile halten die Strecke und passieren die geordneten Checkpoints
- alle fünf Bots wechselten im sichtbaren Browser-Langzeitlauf gemeinsam in Runde 2
- gemessene Geradeausgeschwindigkeit nach dem Balancing: rund 20–22 Einheiten/s
- Spielerposition reagiert auf Botfortschritt (sichtbar 1/6 zu 6/6)
- separater Controller-Test und Bot-Smoke-Test ohne Browserausnahme
