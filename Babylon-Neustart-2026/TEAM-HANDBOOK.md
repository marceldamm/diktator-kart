# Diktator Kart – Team-Handbuch für dich und Sarah

Dieses Dokument ist die gemeinsame Bedienungsanleitung für die Arbeit am Projekt. Es erklärt, wie ihr beide denselben Wissensstand nutzt, Codex/ChatGPT richtig einsetzt und Änderungen über GitHub synchronisiert.

## 1. Welche Datei zuerst öffnen?

1. `START-HERE.md` – aktueller Status und nächster Schritt
2. `TEAM-HANDBOOK.md` – dieses Arbeits- und Modellhandbuch
3. `docs/17-progress-log.md` – vollständige Projekthistorie
4. `docs/10-open-questions.md` – Entscheidungen, die noch fehlen

Sarah muss nicht alle Detaildateien auswendig lesen. Sie beginnt mit diesen vier Dateien und öffnet danach nur die Dokumente, die zur aktuellen Aufgabe gehören.

## 2. Welche ChatGPT-/Codex-Oberfläche verwenden?

### Work

Work ist für längere, mehrstufige Aufgaben, Planung, Dokumentation, Recherche, Bildreferenzen und fertige Arbeitsstände gedacht. Sarah verwendet Work, wenn sie sich in das Projekt einarbeitet, Ideen diktiert, Fragen beantwortet oder einen größeren Arbeitsauftrag formuliert.

### Codex lokal

Codex ist für echte Softwarearbeit im lokalen Projektordner gedacht: Dateien ändern, Babylon.js aufbauen, Tests ausführen, Browser öffnen, Assets prüfen und den lokalen Start testen. Für Änderungen am Spiel muss der richtige lokale Projektordner geöffnet sein.

### Normaler Chat

Normaler Chat ist für kurze Fragen oder Gespräche geeignet. Für Projektänderungen soll Sarah stattdessen Work oder Codex mit dem Projektkontext verwenden, damit Dateien und Arbeitsregeln erhalten bleiben.

Die sichtbaren Optionen können je nach Konto, Workspace und App-Version abweichen. Die offizielle Erklärung zu Work und Codex steht bei [OpenAI](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex).

## 3. Welches Modell verwenden?

| Aufgabe | Modell | Denkintensität |
|---|---|---|
| erster vollständiger Kontextcheck, Architektur, widersprüchliche Anforderungen | **GPT-6 Astra**, falls verfügbar | hoch oder sehr hoch |
| Babylon.js-Kernsysteme, Fahrmodell, Bots, Items, UI-Architektur | **GPT-6.1 Sol** | hoch |
| lange zusammenhängende Implementierung mit Kosten-/Zeitbewusstsein | **GPT-6.1 Sol** | hoch oder sehr hoch |
| Dokumentation, Inventare, kleine Korrekturen, Routineprüfungen | **GPT-6 Luna** | mittel oder hoch |
| festgefahrenes Kernproblem oder Gesamtprüfung vor Meilenstein | **GPT-6 Astra** | hoch oder sehr hoch |

### Erster großer Start

1. Astra liest den gesamten Kontext, prüft Widersprüche und erstellt den Arbeitsplan für M0/M1.
2. Sol übernimmt danach die lange technische Umsetzung.
3. Luna pflegt später Dokumentation, kleine Dateien und wiederholbare Prüfungen.

Wenn Astra in Sarahs Auswahl nicht sichtbar ist, verwendet sie GPT-6.1 Sol mit hoher Denkintensität. Modellverfügbarkeit und Einstellungen hängen vom Konto und Workspace ab. Die offizielle OpenAI-Modellwahl ordnet Astra komplexen Gesamtaufgaben, GPT-6.1 Sol anspruchsvoller Arbeit mit Kosten-/Zeitbalance und Luna fokussierten Routineaufgaben zu: [Model selection](https://developers.openai.com/api/docs/guides/model-selection).

## 4. Welche Einstellungen?

Für einen neuen Arbeitschat:

1. Projekt **Diktator Kart** öffnen.
2. Für Planung und lange Aufgaben **Work** wählen.
3. Für lokale Codearbeit **Codex** wählen und den Babylon-Projektordner öffnen.
4. Das Modell manuell wählen, wenn die Oberfläche es anbietet.
5. Für Architektur und Kernsysteme hohe Denkintensität auswählen.
6. Den Arbeitsauftrag, das Ziel, das Nicht-Ziel und die Abnahmekriterien aus `START-HERE.md` übernehmen.
7. Voice darf zum Diktieren verwendet werden; wichtige Entscheidungen müssen anschließend als Text in den Dateien landen.

Workspace-Administratoren können Startmodell, Denkintensität, Geschwindigkeit und neue Chat-Einstellungen zentral vorgeben. Diese Vorgaben ersetzen keine nicht vorhandene Modellberechtigung. [Offizielle Work-/Codex-Einstellungen](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)

## 5. Was darf Codex tun?

Im Rahmen dieses Projekts darf Codex:

- Dateien lesen, anlegen und ändern
- das lokale Projekt strukturieren
- Browser, Entwicklerwerkzeuge und lokale Tests verwenden
- notwendige Programme oder Bibliotheken begründet installieren
- Blender, Bild- und Audiowerkzeuge für Assets verwenden
- Builds und Tests ausführen
- Screenshots, Renderprüfungen und Performance-Messungen durchführen
- Dokumentation, Fortschrittslog und Entscheidungslog pflegen
- Git-Branches, Commits und Pull Requests vorbereiten

Codex darf keine Sicherheitskontrollen umgehen, keine fremden Konten verwenden, keine unklaren Daten löschen und keine alte technische Implementierung blind in den Babylon-Neustart kopieren. „Voller Zugriff“ bedeutet im Projektkontext selbstständiges Arbeiten mit begründeten, nachvollziehbaren Schritten.

## 6. GitHub als gemeinsame Arbeitsbasis

GitHub wird ein eigener Grundpfeiler und Meilenstein. Ziel ist, dass du und Sarah denselben Entwicklungsstand sicher teilen könnt.

### Vorgesehener Ablauf

1. Ein gemeinsames privates GitHub-Repository für den Babylon-Neustart anlegen.
2. Dich und Sarah mit passenden Rechten einladen.
3. `main` als stabilen Stand schützen.
4. Jede größere Arbeit in einem eigenen Branch beginnen, zum Beispiel `feature/babylon-foundation` oder `docs/item-system`.
5. Kleine, verständliche Commits mit beschreibenden Nachrichten erstellen.
6. Branch pushen und einen Pull Request öffnen.
7. Die andere Person prüft Beschreibung, Dateien, Tests und offene Punkte.
8. Erst danach in `main` zusammenführen.

### Zusammenarbeit ohne Konflikte

Nicht gleichzeitig dieselben Dateien im selben lokalen Checkout bearbeiten. Entweder arbeitet immer nur eine Person im gemeinsamen Ordner, oder ihr nutzt getrennte Klone/Worktrees und synchronisiert über Branches und Pull Requests.

Vor Arbeitsbeginn: Änderungen holen und Status prüfen. Nach Arbeitsende: committen, pushen, Fortschrittslog aktualisieren und den nächsten Schritt nennen. Große Binärdateien wie Referenzbilder, Audio und GLB-Dateien brauchen eine bewusste Repository-Entscheidung; sie dürfen nicht unkontrolliert anwachsen.

## 7. Sarahs täglicher Ablauf

Sarah kann sagen:

```text
Öffne das Projekt Diktator Kart – Babylon-Neustart.
Lies START-HERE.md, TEAM-HANDBOOK.md und docs/17-progress-log.md.
Erkläre mir kurz, wo wir stehen und welche Entscheidungen noch offen sind.
Danach möchte ich folgende Änderung besprechen: [Idee oder Aufgabe].
Übernimm meine Aussagen in die passenden Dokumente, markiere neue offene Fragen
und ändere keine Technik, ohne die Abhängigkeiten zu prüfen.
```

Für echte Codearbeit ergänzt sie:

```text
Arbeite im lokalen Babylon-Projekt.
Erstelle zuerst einen Arbeitsplan und nenne betroffene Dateien.
Arbeite danach selbstständig, teste die Änderung und aktualisiere
docs/17-progress-log.md. Melde am Ende verifiziert, offen, blockiert,
geänderte Dateien und nächsten Schritt.
```

## 8. Gemeinsame Wahrheit

Der Chat ist der Ort für Ideen und Entscheidungen. Die Dateien sind die dauerhafte gemeinsame Erinnerung. Eine Entscheidung gilt erst als langfristig übernommen, wenn sie in der passenden Datei und bei Bedarf im Entscheidungslog steht.

Wenn du oder Sarah eine Grundidee ändert, muss Codex prüfen:

- `START-HERE.md`
- `README.md`
- `docs/00-project-framework.md`
- betroffene Detaildokumente
- `docs/09-roadmap.md`
- `docs/10-open-questions.md`
- `docs/17-progress-log.md`

## 9. GitHub-Meilenstein

**Status:** geplant, noch nicht eingerichtet.  
**Voraussetzungen:** Repositoryname, privat/öffentlich, Konten von dir und Sarah, Branchstrategie und Umgang mit großen Assets festlegen.  
**Abnahme:** Beide können klonen, einen Branch erstellen, Änderungen pushen, einen Pull Request prüfen und den Fortschrittsstand nachvollziehen.
