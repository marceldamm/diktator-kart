# AGENTS.md

## Zweck

Dieses Repository enthält das Projekt **Diktator Kart**, ein browserbasiertes 3D-Kart-Rennspiel mit satirischem, stark schwarzhumorigem Stil und bewusst N64-inspirierter Optik.

Codex und andere KI-Agenten dürfen aktiv am Projekt mitarbeiten, sollen aber die bestehende Architektur und Dokumentation respektieren.

## Grundregeln

1. Bestehende Architekturentscheidungen dürfen nicht stillschweigend geändert werden.
2. Größere technische Änderungen müssen in `/docs` dokumentiert werden.
3. Neue Systeme sollen modular aufgebaut werden.
4. Client, Server und gemeinsame Logik sollen klar getrennt bleiben.
5. Keine unnötigen Abhängigkeiten hinzufügen.
6. Browser-Kompatibilität hat hohe Priorität.
7. Performance ist wichtiger als maximale Grafikqualität.
8. Der N64-inspirierte Stil ist eine bewusste Designentscheidung.
9. Code soll verständlich, wartbar und möglichst einfach bleiben.
10. Vor größeren Umbauten zuerst bestehende Dokumentation lesen.

## Technische Grundausrichtung

* Sprache: TypeScript
* Client: PlayCanvas Engine
* Entwicklungsserver: Vite
* Multiplayer: Colyseus
* Server: Node.js
* 3D-Assets: Blender
* Austauschformat: GLB / glTF
* Versionsverwaltung: Git / GitHub
* Zielplattform: moderner Webbrowser

## Dokumentationspflicht

Wenn eine Änderung grundlegende Auswirkungen auf Architektur, Gameplay, Netzwerk, Bots, Physik, Grafikstil oder Projektstruktur hat, muss die entsprechende Datei in `/docs` angepasst werden.

Dokumentation gilt als Teil des Projekts und nicht als optionale Zusatzarbeit.

## Entwicklungsprinzip

Zuerst soll immer die einfachste funktionierende Version gebaut werden.

Beispiel:

* zuerst ein fahrbarer Platzhalter
* dann Fahrphysik
* dann Rundensystem
* dann Bots
* dann Items
* dann Multiplayer
* danach Grafik, Charaktere und umfangreicher Content

Funktionsfähigkeit geht vor Perfektion.
