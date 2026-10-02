# Multiplayer – bewusst später

## Entscheidung

Multiplayer ist ein mögliches wichtiges Ziel, aber keine Grundlage der ersten Babylon.js-Entwicklung. Der Singleplayerkern muss zuerst vollständig, fair, performant und testbar sein.

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
