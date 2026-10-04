# Multiplayer – bewusst später

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


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
