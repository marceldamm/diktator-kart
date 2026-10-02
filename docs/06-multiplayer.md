# Multiplayer – bewusst später

## Entscheidung

Multiplayer ist ein verbindliches nachgelagertes Ziel: private Online-Rennen in Lobbys per Einladung auf getrennten Geräten, mit Crossplay zwischen PC, Android und iPhone. Zuerst entsteht der vollständige Singleplayerkern. Splitscreen und öffentliches Matchmaking sind damit nicht beschlossen.

Darstellungsqualität darf sich je Gerät unterscheiden, Rennregeln und Item-/Fähigkeitswirkungen bleiben gleich. Lobbygröße, Einladungsverfahren, Verbindungsabbruch und Hosting werden vor dem Multiplayer-Meilenstein konkretisiert. Das aktuelle Nullbudget gilt auch hier; ein kostenloser tragfähiger Betriebsweg ist noch nicht verifiziert. Kostenpflichtiges Hosting wird nicht vorausgesetzt.

## Warum später

Netzwerkregeln würden schon früh Entscheidungen über Autorität, Tickrate, Reconnect, Synchronisation, Cheatschutz, Lobby, Matchmaking und Serverkosten erzwingen. Diese Komplexität soll nicht die Kernfragen von Fahrgefühl, Strecke und visueller Identität überdecken.

## Vorbereitungen ohne Vorziehen

- Simulationsdaten von Darstellung und UI trennen.
- Zufallsquellen und Rennereignisse nachvollziehbar machen.
- Eingaben als klare Befehle modellieren.
- Fahrer-, Item- und Streckendaten datengetrieben halten.
- Keine Singleplayerlogik an lokale UI-Ereignisse koppeln.

## Startkriterien

Multiplayer beginnt erst, wenn ein vollständiges Singleplayerrennen mit Bots, Items, Audio, Pause, Neustart, Ergebnis und Performance-Abnahme stabil ist. Dann werden Architektur und Technologie neu bewertet; keine alte Netzwerkimplementierung wird vorausgesetzt.
