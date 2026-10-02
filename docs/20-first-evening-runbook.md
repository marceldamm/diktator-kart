# Runbook für den ersten richtigen Babylon.js-Abend

## Ziel des Abends

Am Ende des ersten Abends soll noch kein fertiges Spiel entstehen. Das Ziel ist ein überprüfter, startbarer Babylon.js-Grundstand mit sauberem Übergabepunkt für eine lange autonome Arbeit: Browserstart, Projektstruktur, Renderfläche, Eingabegrundlage, Diagnose, Dokumentationsstatus und klarer nächster Meilenstein.

## Vorbereitungsstatus

| Werkzeug | Status am 03.10.2026 | Maßnahme |
|---|---|---|
| Windows 11 Pro 64-Bit | vorhanden | Zielplattform dokumentiert |
| Google Chrome | vorhanden unter `C:\Program Files\Google\Chrome\Application\chrome.exe` | für Browser- und Computer-Tests verwenden |
| Node.js 24.19.0 | vorhanden | für lokalen Build prüfen |
| npm 11.17.0 | vorhanden | Babylon-Projekt lokal verwalten |
| Git 2.55.0 | vorhanden | Versionsstände und Wiederherstellung nutzen |
| Python 3.14.4 | vorhanden | nur für Hilfs-/Assettools, nicht als Spielruntime voraussetzen |
| VS Code 1.140.0 | vorhanden | optionaler Editor, nicht einzige Startmöglichkeit |
| Blender 5.2 | vorhanden unter `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` | für editierbare 3D-Assets verwenden |
| Babylon.js | noch nicht als neues Projekt installiert | im Projekt lokal einrichten |
| zusätzliche Audio-/Bildtools | nicht als Pflicht installiert | erst bei konkretem Bedarf auswählen |

Globale Installationen werden vermieden, wenn eine projektlokale npm-Abhängigkeit oder ein vorhandenes Werkzeug genügt.

## Ablauf in Zeitblöcken

### Block 1 – 30 Minuten: Kontextaufnahme

Lesen: `README.md`, `AGENTS.md`, `docs/00-project-framework.md`, `docs/16-production-blueprint.md`, `docs/17-progress-log.md`, `docs/10-open-questions.md`, `docs/14-character-and-item-catalog.md`, `docs/15-item-feasibility-and-production.md`.

Ergebnis: Das Modell schreibt eine kurze Liste aus verbindlich, offen, blockiert und heute nicht relevant. Es darf keine neue Technikentscheidung stillschweigend aus Gewohnheit treffen.

### Block 2 – 30–45 Minuten: PC- und Werkzeugprüfung

Chrome, Node/npm, Git, Blender, VS Code, Audio-/Bildpfade und Schreibrechte prüfen. Falls eine Installation nötig ist, zuerst Zweck, Version, Speicherort und Rückfallmöglichkeit dokumentieren. Keine unnötigen Programme installieren.

### Block 3 – 45–60 Minuten: M0-Entscheidungen

Bestätigte Antworten in `10-open-questions.md` übernehmen: Berlin-/Stadionwelt, sechs bisherige Fahrer, drei Start-Items, drei Kameras und Spezialfähigkeit über eigene Eingabe mit fester Abklingzeit. Diese Fragen sind bereits beantwortet. Technische Auswahl zu Launcher, Babylon-Version und Physikversuch begründet treffen; fehlende Messgeräte und Inhaltsdetails als offene Aufgaben führen.

### Block 4 – 60–120 Minuten: neues Projektgerüst

Babylon.js-Projekt direkt in `D:\Diktator-Kart` aufbauen, vorhandene neue Wissensbasis und aktive Git-Verwaltung verwenden. Lokale Abhängigkeiten, TypeScript/Build, HTML-Einstieg, Canvas, Ladezustand, Fehleranzeige, Debuganzeige und Ein-Klick-Start vorbereiten. `Diktator-Kart-Legacy/` ist Altarchiv und wird nicht als neuer Spielcode importiert.

### Block 5 – 60–90 Minuten: erster Start

Chrome öffnet die neue Szene über den vorgesehenen Startbutton/Launcher. Ein sauberer Beenden-/Neustartweg wird geprüft. Der Start muss für den Nutzer verständlich sein, auch wenn Codex intern weiterhin ein Terminal verwendet.

### Block 6 – 3–8 Stunden: lange autonome Session

Empfohlenes Ziel: M1 abschließen und höchstens den Anfang von M2 beginnen. Der Auftrag muss ausdrücklich enthalten: keine Ausweitung auf Multiplayer, keine vollständige Art-Produktion, keine blinde Migration alter Technik. Nach jedem größeren Teilabschnitt werden Build, Start, Fehler und Fortschrittslog geprüft.

### Block 7 – 20–30 Minuten: Übergabe

`17-progress-log.md` aktualisieren, geänderte Dateien nennen, Tests und Nicht-Tests trennen, offene Probleme notieren, nächsten Auftrag formulieren. Erst dann gilt der Abend als sauber abgeschlossen.

## Modellwahl für den ersten Abend

**Empfehlung:** Zuerst GPT-6 Astra mit hoher oder sehr hoher Denkintensität für die vollständige Kontextaufnahme, M0-Entscheidungen und Architekturprüfung. Danach GPT-6.1 Sol mit hoher Denkintensität für die lange Implementierungsphase.

Begründung: Astra ist für besonders anspruchsvolle, mehrdeutige Gesamtanalysen und komplexe Coding-Aufgaben geeignet. Sol ist für komplexe technische Arbeit mit besserem Kosten-/Zeitverhältnis geeignet. Luna übernimmt anschließend Routine, kleine Korrekturen, Dokumentation und Inventare. Diese Einordnung entspricht der offiziellen OpenAI-Modellwahl, die Verfügbarkeit in Codex kann je nach Konto und Oberfläche abweichen.

## Realität einer Nacht-Session

Eine lange autonome Session kann mehrere Stunden arbeiten, aber „die ganze Nacht ohne Unterbrechung“ ist kein sicher garantierbarer Betriebszustand. Pausen können durch Nutzerentscheidungen, Installationsdialoge, Berechtigungen, Browser-/Serverfehler, fehlende Assets, Limits oder einen echten Blocker entstehen. Der Auftrag muss deshalb checkpointsicher sein: Jede abgeschlossene Teilaufgabe wird gespeichert und dokumentiert, sodass die nächste Sitzung sicher fortsetzen kann.

## Startauftrag für den ersten langen Lauf

```text
Arbeite im Projekt Diktator Kart – Babylon-Neustart 2026.
Lies zuerst README.md, AGENTS.md, docs/00-project-framework.md,
docs/16-production-blueprint.md und docs/17-progress-log.md.

Ziel: M0 abschließen und M1 beginnen.
Erstelle einen eigenständigen, startbaren Babylon.js-Grundstand.
Übernimm keine alte PlayCanvas-/Ammo-Implementierung.
Bereite Browserstart, Fehleranzeige, Debugstatus, Eingabegrundlage,
Dokumentationssynchronisierung und einen Ein-Klick-Start vor.

Arbeite selbstständig in klaren Teilabschnitten. Teste jeden Abschnitt.
Wenn etwas blockiert, dokumentiere den Blocker und arbeite an unabhängigen
Aufgaben weiter. Erweitere den Umfang nicht auf eigene Initiative.

Am Ende berichte: erledigt, verifiziert, nicht verifiziert, geänderte Dateien,
offene Probleme, Installationen, Messwerte und nächster Schritt.
```
