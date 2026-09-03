# Technische Grundlage

## Zielplattform

Primäre Zielplattform ist der moderne Webbrowser.

Das Spiel soll ohne vorherige Installation gestartet werden können.

Unterstützt werden sollen vor allem aktuelle Versionen von:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox

Weitere Browser können später getestet werden.

## Engine

Als primäre Engine ist **PlayCanvas Engine** vorgesehen.

Gründe:

* browsernative Ausrichtung
* WebGL-Unterstützung
* WebGPU-Unterstützung
* TypeScript-Kompatibilität
* Open Source
* visuelle Bearbeitung über den PlayCanvas Editor
* gute Eignung für leichte 3D-Spiele
* gute Zusammenarbeit mit KI-gestützter Entwicklung

## Programmiersprache

Primäre Sprache:

**TypeScript**

TypeScript wird sowohl für den Client als auch für den späteren Server verwendet.

Dadurch bleibt die technische Basis möglichst einheitlich.

## Entwicklungsumgebung

Primäre Entwicklungsumgebung:

**Visual Studio Code**

Verwendung für:

* Quellcode
* Markdown-Dokumentation
* Git
* GitHub
* Codex
* Terminal
* Projektverwaltung

## Lokale Entwicklung

Die Entwicklung erfolgt zunächst vollständig lokal.

Geplant:

```text
Client:
Vite + PlayCanvas
localhost:5173

Server:
Node.js + Colyseus
localhost:2567
```

Für den ersten Prototyp ist noch kein Multiplayer-Server erforderlich.

## Versionsverwaltung

Versionsverwaltung:

**Git**

Remote Repository:

**GitHub**

Repository:

`marceldamm/diktator-kart`

Primärer Branch:

`main`

## Projektstruktur

Geplante Grundstruktur:

```text
diktator-kart/
├── client/
├── server/
├── shared/
├── assets-source/
├── docs/
├── AGENTS.md
└── README.md
```

### client

Enthält das eigentliche Browser-Spiel.

Geplant:

* PlayCanvas
* TypeScript
* Vite
* Rendering
* Eingaben
* Kamera
* Audio
* Benutzeroberfläche

### server

Enthält später den Multiplayer-Server.

Geplant:

* Node.js
* Colyseus
* Lobby-System
* Rennzustand
* Bots
* Synchronisation

### shared

Enthält gemeinsame Datenstrukturen und Logik.

Beispiele:

* Netzwerktypen
* Itemdefinitionen
* Fahrerdefinitionen
* Streckendaten
* gemeinsame Konstanten

### assets-source

Enthält Quelldateien für Spielassets.

Beispiele:

* Blender-Dateien
* Originaltexturen
* Audiodateien
* Arbeitsdateien

### docs

Enthält die vollständige Projektdokumentation.

## Grafik

Geplanter Grafikstil:

**Modern N64 / Low Poly**

Ziele:

* geringe Ladezeiten
* geringe GPU-Belastung
* kleine Assets
* charakteristischer Stil
* gute Browser-Performance

## 3D-Assets

Geplante Software:

**Blender**

Primäres Austauschformat:

* GLB
* glTF

Blender ist für die erste Entwicklungsphase noch nicht zwingend erforderlich.

## Physik

Die Fahrphysik soll bewusst arcadeorientiert sein.

Keine realistische Fahrzeugsimulation.

Geplant:

* eigene Kart-Steuerung
* einfache Kollisionsphysik
* Raycasts
* Trigger
* Untergrundtypen
* Drift
* Boost
* Sprung
* Rückstoß

Physikbibliotheken sollen nur dort verwendet werden, wo sie sinnvoll sind.

## Bots

Bots sollen nicht direkt an eine spezielle Kart-Implementierung gekoppelt werden.

Jedes Kart soll über ein gemeinsames Eingabesystem gesteuert werden können.

Geplante Eingabequellen:

* HumanInput
* BotInput
* NetworkInput

Dadurch sollen Menschen, Bots und Netzwerkspieler technisch möglichst gleich behandelt werden.

## Multiplayer

Multiplayer ist ein späteres Kernziel.

Geplante Servertechnologie:

**Colyseus**

Geplant ist ein autoritativer Server.

Der Server entscheidet später unter anderem über:

* Rennzustand
* Platzierungen
* Items
* Treffer
* Bots
* Runden
* Spielerzustände

## Hosting

Für die frühe Entwicklungsphase ist kein externer Server erforderlich.

Später möglich:

Client:

* Cloudflare Pages

Multiplayer:

* kleiner VPS
* Node.js
* Colyseus

Die Serverhardware benötigt keine GPU.

## Entwicklungspriorität

Reihenfolge:

1. Projekt startet im Browser
2. einfache Szene
3. fahrbarer Platzhalter
4. Kamera
5. grundlegende Kart-Physik
6. Rundensystem
7. Bots
8. Items
9. Multiplayer
10. Content und optischer Ausbau
