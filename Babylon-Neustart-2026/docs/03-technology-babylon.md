# Technik: Babylon.js-Neuentwicklung

## Festlegung

Babylon.js ist die gesetzte Engine für den Neustart. Die alte PlayCanvas-/TypeScript-/Ammo-Struktur wird nicht migriert. TypeScript und ein moderner Browser-Build sind naheliegende Arbeitshypothesen, aber Buildtool, Physikpaket, Datenformate und Asset-Ladeverfahren werden im Technikprototyp bewusst bestätigt statt vorausgesetzt.

Zielplattformen der ersten Produktplanung sind Google Chrome unter Windows und moderne mobile Browser. Tastatur kommt zuerst, Touch-Steuerung folgt; die Architektur muss Eingaben über eine gemeinsame Spielschnittstelle annehmen.

## Architekturziele

Die neue Architektur soll Zuständigkeiten sauber trennen:

- **App-/Szenenlebenszyklus:** Menü, Laden, Rennen, Pause, Ergebnis.
- **Rennsimulation:** Zeit, Runden, Checkpoints, Platzierung, Regeln.
- **Fahrmodell:** Spieler- und Botsteuerung über gemeinsame, testbare Eingaben.
- **Strecke:** Fahrroute, Abkürzung, Kollisionszonen, Dekozonen und Weltzustände.
- **Items und Fähigkeiten:** Daten, Trigger, Treffer, Schutz, Abklingzeiten und Feedback.
- **Bots:** Persönlichkeiten, Linienwahl, Wahrnehmung und Recovery ohne geheime Physikvorteile.
- **Presentation:** Modelle, Animation, Partikel, Audio und UI reagieren auf Simulationsereignisse.
- **UI und Einstellungen:** Menüs, HUD, Grafik-/Audiooptionen, Steuerung und lokale Speicherung sind eigene, testbare Systeme.
- **Betrieb:** Ein-Klick-Start beziehungsweise eindeutige Verknüpfung und ein verständlicher Fehler-/Beendigungsweg gehören zum Produkt.
- **Assets:** versionierbare Manifestdaten, Ladegruppen, Fallbacks und klare Lizenz-/Herkunftsinformationen.

## Grundsätze

1. Eine Simulation darf nicht von zufälligen Render- oder UI-Zuständen abhängen.
2. Spielregeln müssen ohne sichtbare Effekte testbar sein.
3. Physik, Kamera und Präsentation bleiben getrennt, damit Art-Pässe das Fahrgefühl nicht heimlich verändern.
4. Strecke und Botroute beziehen sich auf dieselben überprüfbaren Daten.
5. Jede Szene hat einen kontrollierten Lebenszyklus; Timer, Listener und temporäre Objekte werden beim Neustart sauber beendet.
6. Ein Ladefehler darf nicht stillschweigend ein unspielbares Rennen erzeugen; es gibt Fallbacks und eine sichtbare Diagnose.
7. Fahrphysik und Animation berücksichtigen kleine Untergrundereignisse: Federung, Räder, Reifen und Kartkörper reagieren sichtbar, ohne eine Vollsimulation zu erzwingen.
8. Wetter und Atmosphäreneffekte werden als austauschbare, budgetierte Systeme geplant und dürfen die Spielbarkeit nicht verdecken.

## Babylon.js-Fragen für den Prototyp

- Welche Babylon-Version und welches Rendering-Fallback werden unterstützt?
- Welche Physik wird für den Kart-Racer benötigt, und reicht ein eigenes Arcade-Fahrmodell mit begrenzter Kollisionsphysik?
- Welche Shader-, Schatten-, Partikel- und Postprocessing-Funktionen sind im Zielbrowser zuverlässig?
- Wie werden GLB/GLTF-Assets, Animationen, Audio und Ladegruppen versioniert?
- Welche Debug-/Telemetry-Ansichten helfen bei normalem Browserbetrieb?

## Nicht übernehmen

Nicht automatisch übernehmen: PlayCanvas-Szenenaufbau, Ammo-Ladepfade, alte Controllerklassen, alte Renderbudgets, alte Assetnamen, bestehende Buildannahmen oder angeblich stabile Workarounds. Sie dürfen als historische Hinweise gelesen und im neuen Prototyp unabhängig bewertet werden.
