# Diktator Kart – Team-Handbuch für dich und Sarah

## Praktischer Modelltipp für unseren aktuellen Spielausbau

Für unsere längere technische Umsetzung verwenden wir GPT-6.1 Sol mit hoher Denkintensität als praktische Ausgangswahl. GPT-6 Astra eignet sich für schwierige Gesamtanalysen, festgefahrene Probleme oder Architekturprüfungen; Luna für fokussierte Routine. Das ist eine Aufgabenempfehlung, keine allgemeine Rangliste oder Garantie perfekter Ergebnisse. Höhere Denkintensität kostet mehr Zeit/Nutzung; Modellverfügbarkeit und Planlimits im eigenen Konto prüfen. Quellen (03.10.2026): [OpenAI-Modellwahl](https://developers.openai.com/api/docs/guides/model-selection), [Work/Codex-Nutzung](https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex).

Guter Arbeitsauftrag: ein sichtbares Ziel, die aktuelle Liste und ein prüfbares Ergebnis nennen. Beispiel: „Projektstart. Arbeite an [Paket aus CURRENT-WORKLIST.md]. Ziel: [im Spiel sichtbare Verbesserung]. Prüfe Fahrt und Kameras im Browser, sichere lokale Checkpoints und aktualisiere unsere vier Arbeitsdateien. Gewöhnliche technische Entscheidungen triff selbstständig.“ Keine perfekte Grafik versprechen lassen; echte Spielbilder und Tests verlangen.

## Unsere vier Arbeitsdateien

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

Dieses Dokument ist die gemeinsame Bedienungsanleitung für die Arbeit am Projekt. Es erklärt, wie ihr beide denselben Wissensstand nutzt, Codex/ChatGPT richtig einsetzt und Änderungen über GitHub synchronisiert.

## 1. Welche Datei zuerst öffnen?

Auf diesem PC ist `D:\Diktator-Kart` das Hauptverzeichnis des neuen Projekts. Das Altspiel liegt unter `Diktator-Kart-Legacy/`; es ist Referenzmaterial und kein aktiver Entwicklungsbereich. Sarah darf einen anderen lokalen Pfad verwenden; maßgeblich sind Repository und Branch.

1. `START-HERE.md` – aktueller Status und nächster Schritt
2. `TEAM-HANDBOOK.md` – dieses Arbeits- und Modellhandbuch
3. `PROGRESS-LOG.md` – vollständige Projekthistorie
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

**Sichtprüfungen und Rechnerlast:** Sichtbare Spieländerungen werden in aktuellen, sichtbaren Chrome-Laufzeitbildern abgenommen. Vorher/Nachher-Aufnahmen entstehen an sinnvollen Paketgrenzen und unter vergleichbaren Bedingungen, nicht nach jedem Detail. Vor Nutzung älterer Screenshots prüft Codex Datum, dargestellte Szene und geladenen Commit. Bei langen Prüf- oder Assetläufen behält Codex CPU, Speicher und eigene Chrome-/Build-Prozesse im Blick und pausiert/stoppt nur eindeutig selbst gestartete, gerade unnötige Prüfinstanzen. Ablauf und Grenzen: [Team-Workflow](docs/21-team-workflow.md).

## 6. GitHub als gemeinsame Arbeitsbasis

**Jetzt verbindlich:** main im Repository marceldamm/diktator-kart enthält ausschließlich das neue Babylon-Spiel. Der frühere Stand ist separat archiviert und nur historische Referenz. Dort keine Änderungen und keinen Spielstart. Die tägliche Git-Hilfe steht in [docs/21-team-workflow.md](docs/21-team-workflow.md).

Auf beiden PCs im eigenen Checkout arbeiten. Vor jeder Sitzung neuesten main holen und eigene Änderungen sichern/integrieren. Größere Arbeit auf eigenem Branch; Tests, echte Belege und Dokumentation vor Veröffentlichung. Der ausdrückliche Projektabschluss autorisiert den geprüften PR-Merge nach `main`; Branchregeln verlangen den grünen CI-Check. Kein Direkt-Push und keine Regelumgehung.

**GitHub-Funktionen (Marcel, 06.10.2026):** Konkrete bestätigte Aufträge werden automatisch als Issue verlinkt; mehrteilige Ziele als Milestone gebündelt. Das Project-Board ordnet offene Issues und PRs automatisch ein. Jede Änderung geht als PR; GitHub Actions führt Tests und Build aus. `main` akzeptiert nur PRs mit grünem `tests-and-build`-Check. Die vier Teamdateien bleiben die kanonische Wahrheit. Das Pilotboard ist privat; Sarah (`@Castessa`) hat Zugriff mit Rolle `Write`. Copilot Cloud Agent ist im aktuellen Konto nicht verfügbar. Details: [GitHub-Team-Workflow](docs/21-team-workflow.md).

## 7. Euer täglicher Ablauf

**Beginn:** „Projektstart. Synchronisiere unseren gemeinsamen Babylon-Stand und sichere lokale Arbeit. Danach: [Aufgabe].“

**Ende:** „Projektabschluss. Prüfe, dokumentiere und veröffentliche meine Änderungen im gemeinsamen main.“

Die Repo-Skills $diktator-projektstart und $diktator-projektabschluss werden mit Git verteilt. Alternativ die Batches Projekt-starten.cmd und Projekt-abschliessen.cmd nutzen; Konflikte und uncommittete Arbeit dann von der KI prüfen lassen.

Sarahs erster Umstieg: lokalen bisherigen Stand inklusive ungesicherter Dateien archivieren, origin/main holen, neue Regeln aus dem Remote lesen und auf einem neuen Babylon-Arbeitsbranch fortsetzen. Der kopierbare Initialbefehl steht in Dokument 21. Alte Änderungen werden nicht blind migriert; Ideen können als Herkunft-markierte Vorschläge übernommen werden.

## 8. Gemeinsame Wahrheit

Der Chat ist der Ort für Ideen und Entscheidungen. Die Dateien sind die dauerhafte gemeinsame Erinnerung. Eine Entscheidung gilt erst als langfristig übernommen, wenn sie in der passenden Datei und bei Bedarf im Entscheidungslog steht.

Wenn du oder Sarah eine Grundidee ändert, muss Codex prüfen:

- `START-HERE.md`
- `README.md`
- `docs/00-project-framework.md`
- betroffene Detaildokumente
- `docs/09-roadmap.md`
- `docs/10-open-questions.md`
- `PROGRESS-LOG.md`

## 9. GitHub-Meilenstein

Die gemeinsame Babylon-Hauptbasis wurde vom Nutzer am 03.10.2026 ausdrücklich beauftragt. main wird aus Claudes Stand c13d47e aufgebaut; bisheriger GitHub-main e292070, lokaler main 2d95e8a und Claude-Stand sind auf separaten archive/*-Branches gesichert. Herkunft und Prüfergebnisse im Fortschrittslog und Dokument 21. Unveröffentlichte Dateien auf Sarahs PC sind nicht in dieser Sicherung enthalten und müssen beim ersten Projektstart dort erhalten werden.

Repository: https://github.com/marceldamm/diktator-kart . Keine zweite aktive Engine oder Projektbasis.

## 10. Bestätigte Zusammenarbeit und Produktionsgrenzen

- Zunächst privates Spiel für uns und Freunde, später öffentlich kostenlos; kein verkaufbares Produkt geplant.
- Vorerst vorhandene und kostenlose Werkzeuge/Assets; kein Zusatzbudget für Musik oder Stimmen.
- Änderungen an Sarahs ursprünglichen Ideen brauchen eure gemeinsame Bestätigung. Die KI bewahrt die Originalidee und formuliert Änderungen als Vorschlag, bevor sie als beschlossen gelten.
- Online-Rennen folgen dem Singleplayer: private Lobbys per Einladung auf getrennten Geräten mit Crossplay.
- Die 15 bestätigten Designentscheidungen stehen in `docs/10-open-questions.md`. Technische Detailfragen bearbeitet die KI selbstständig innerhalb dieser Grenzen.
- Der aktive Git-Ordner bleibt im Hauptverzeichnis. Die frühere Legacy-Kopie bleibt als lokale Sicherung im Archiv; dort enthaltene Git-Metadaten sind keine zweite aktive Arbeitsbasis. Der Archivinhalt wird nicht pauschal per „git add .“ veröffentlicht.
- Vor Übernahme nach main müssen auch ältere Unterschiede der Branchhistorie geprüft werden. Ein veröffentlichter Planungsbranch ist noch keine Freigabe zum Zusammenführen.

## Gemeinsame Budgetregel für autonome Arbeit

Gilt für Marcel und Sarah automatisch beim Projektstart und während ausdrücklich beauftragter autonomer Arbeit. Zu Beginn und nach jedem größeren Paket die offiziellen Codex-Werte des aktuellen Kontos für Fünf-Stunden- und Wochenlimit prüfen, sofern verfügbar (get_usage_limits oder tatsächliche Usage-Anzeige). Maßgeblich ist der kleinere Restwert. Es gelten Sarahs eigene Kontowerte, nicht Marcels letzte Zahlen. Kontextgröße und geschätzte Tokens sind kein Planlimit; keine Prozentwerte erfinden.

Bei ungefähr **15 % Rest** in einem der beiden Limits keine neue große Aufgabe anfangen. Laufende Änderung fertigstellen, wichtigste Prüfungen/Spielbelege sichern, vier Arbeitsdateien und PROGRESS-LOG.md aktualisieren und lokalen Git-Checkpoint erstellen. Einen bereits autorisierten Teamabschluss rechtzeitig durchführen; Upload nur mit entsprechender Freigabe, keine Budgetregel als zusätzliche Push-Erlaubnis auslegen. Mit dem Ziel stoppen, **mindestens etwa 5 % Rest** für eigene Nutzernachrichten zu lassen. Checkpoints regelmäßig bereits während der Arbeit sichern.

Wenn echte Werte nicht abrufbar sind, dies früh sagen, höchstens einmal nach den angezeigten Werten fragen und vorsichtigen Abschluss-Puffer nutzen. Keine Zusatzkontingente aktivieren, keine Resets oder kostenpflichtigen Dienste auslösen. Bei unerwarteter Sperre beim nächsten Kontakt ehrlich gesicherten und ungesicherten Stand nennen. Diese Regel garantiert keinen exakten Restwert; Prüfung und Abschluss brauchen selbst Kontingent.
