# Bots

## Architektur

Fünf Gegner verwenden wie der Spieler `KartInput` und dynamische Ammo-Rigidbodies. Die Botlogik setzt ausschließlich Lenkung, Gas/Bremse, Hop und Drift; sie teleportiert während eines laufenden Rennens nicht. Der Bot-`KartController` nutzt stark erhöhte Antriebskraft, ein Grundlimit von 140 Einheiten/s und stärkere Lenkung; bei Rückstand steigt das Limit progressiv um bis zu 50 Einheiten/s. Die Lenkvorausschau wächst begrenzt mit dem Tempo, damit schnelle Bots Kurven früher anfahren, ohne Wegpunkte zu überspringen. Das Spielerkart bleibt unverändert. Nahe vorausfahrende Spieler werden mit größerem Reaktionsradius und seitlich versetztem Ziel angegriffen, damit Bots aktiv überholen statt nur ihrer Linie zu folgen.

Der Spieler nutzt weiterhin den `RaycastKartController`. Mehrere gleichzeitig registrierte `btRaycastVehicle`-Actions verursachten mit dem eingebundenen Ammo-WASM reproduzierbar Speicherzugriffsfehler. Die Bots nutzen deshalb vorerst den vorhandenen physikalischen `KartController`. Das ist eine dokumentierte Stabilitätsentscheidung, kein geheimer Botvorteil; eine gemeinsame Multi-Vehicle-RayCast-Lösung bleibt offen.

`BotRaceManager` verwaltet Startaufstellung, Controller, individuelle `RaceController` und die Platzberechnung. Die Rangfolge basiert auf abgeschlossenen Runden, geordneten Checkpoints und Distanz zum nächsten Tor.

## Persönlichkeiten

- **Paraderacer:** breite Linie und maßvolle Kurvenkorrektur.
- **Größenwahnsinniger:** aggressiveres Gas, spätere Kurvenreaktion und hohe Driftbereitschaft.
- **Bürokrat:** gleichmäßige mittlere Linie und kontrollierte Entscheidungen.

Die fünf Startgegner verwenden diese drei Profile in der Verteilung 2/2/1. `laneOffset` ist nur eine leichte Linienpräferenz; die dynamische Physik lässt Abweichungen zu. Mehrere Wegpunkte führen die schnelle Botroute außen um die Ostseite der Mittelinsel; die Nordgeradenpunkte halten nördlich der kollidierenden Einfahrrampe ausreichend Abstand für die Kartbreite. Die mit dem Tempo wachsende Vorausschau ist begrenzt, damit Bots keine Kurvenpunkte überspringen. Die Startaufstellung hält mehr Abstand. Bei engem Botkontakt lenken die Gegner auseinander. Erkennt die Fortschrittskontrolle weniger als 3,5 Einheiten Streckenbewegung pro Sekunde, lösen sie sich zeitbegrenzt durch Rückwärtsfahren mit Lenkeinschlag, ohne Teleport während des Rennens. `shortcutRisk` beeinflusst die Driftbereitschaft. Bots nehmen Versorgungskisten auf und setzen Items abhängig von Abstand, Ausrichtung und Haltezeit ein.

Die reale Rundenzeit und die Item-Balance werden über vollständige Browserrennen weiter kalibriert.

## Noch zu verifizieren

- drei komplette Rennen mit Zieleinlauf aller fünf Bots
- Recovery, wenn ein Bot entgegen der Fahrtrichtung oder an einer Barriere steht
- angemessene Wirkung von Sicht-/Täuschungsitems auf die Vorausschau
- Itemverhalten und Tempo-Balance über vollständige Rennen

## Verifizierter Zwischenstand

- fünf Bots verlassen die Startaufstellung unter eigener Physik
- alle drei Profile halten die Strecke und passieren die geordneten Checkpoints
- alle fünf Bots wechselten im sichtbaren Browser-Langzeitlauf gemeinsam in Runde 2
- Bot-Tempolimit auf 44 Einheiten/s angehoben; längere Laufzeitmessung ausstehend
- freie Physikbewegung mit Bot-Ausweichlenkung und Stillstand-Recovery ergänzt; Laufzeitprüfung im Browser ausstehend
- Spielerposition reagiert auf Botfortschritt (sichtbar 1/6 zu 6/6)
- separater Controller-Test und Bot-Smoke-Test ohne Browserausnahme
