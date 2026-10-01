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

## Routinebefehl „push“

Wenn der Benutzer den Befehl **„push“** gibt, ist dies ein schneller, sparsamer Checkpoint-Vorgang:

1. Git-Status kurz prüfen.
2. Änderungen nur so weit prüfen, wie es für eine sinnvolle kurze Commit-Nachricht nötig ist.
3. Keine ausführliche Codeanalyse, unnötigen Prüfungen oder erneute Dokumentationslektüre durchführen, sofern sie für den Commit nicht erforderlich sind.
4. Selbstständig eine kurze Commit-Nachricht wählen.
5. Sinnvolle Projektänderungen stagen und committen.
6. Direkt auf den Branch `main` pushen.
7. Keine Rückfragen stellen.
8. Danach nur Commit-Titel und Push-Ergebnis kurz mitteilen.
9. Falls nichts geändert wurde, dies kurz mitteilen und nichts weiter tun.

Secrets, Zugangsdaten, temporäre Dateien und offensichtlich ungeeignete Dateien dürfen nicht committed werden.
