# Diktator Kart – Babylon-Neustart 2026

Aktives Hauptverzeichnis: `D:\Diktator-Kart`. Das Altspiel liegt unter `Diktator-Kart-Legacy/`, zusammen mit Kopien der bisherigen Sicherungen. Die ältere Sicherung `Legacy/` bleibt wegen einer Windows-Verschiebesperre zusätzlich im Hauptverzeichnis erhalten und wird nicht bearbeitet. Die aktive Git-Verwaltung bleibt im Hauptverzeichnis. Seit M2e gibt es hier einen steuerbaren Kart-Techniktest mit Hop, Drift, Mini-Turbo, Federung, drei Kameras und fünf bewegten Lastfahrzeugen, noch kein Rennen.

Für den täglichen Überblick zuerst [START-HERE.md](START-HERE.md) öffnen. Die gemeinsame Bedienungsanleitung für dich und Sarah steht in [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md).

## Kurzfassung

Diktator Kart wird als eigenständiger satirischer 3D-Arcade-Kart-Racer für den Browser neu konzipiert. Die neue technische Basis ist **Babylon.js**. Das Spiel soll vom Gefühl klassischer Kart-Racer wie Mario Kart 64 und vom Politur-Niveau modernerer Mario-Kart-Spiele auf der Switch inspiriert sein, aber eine eigene Welt, eigene Figuren und eine eigene Satire besitzen: etwas realistischer, schöner und effektvoller, ohne auf High-End-PCs angewiesen zu sein.

Dieser Ordner enthält die Planungs- und Wissensbasis sowie seit M1 einen startbaren Babylon.js-Technikgrundstand. Er übernimmt aus dem Altprojekt Ideen und belegte Designentscheidungen, aber keine alte Engine-Implementierung.

**Techniktest starten:** Unter Windows [`Diktator-Kart-starten.cmd`](Diktator-Kart-starten.cmd) doppelklicken. Das Fenster offen lassen; Chrome öffnet `http://127.0.0.1:4173/`. Beim ersten Start installiert der Launcher die im Lockfile festgelegten kostenlosen npm-Pakete. Technischer Weg: `npm ci`, dann `npm run dev`. W/S beziehungsweise Pfeil hoch/runter fahren, A/D beziehungsweise Pfeil links/rechts lenken. Space löst einen Hop aus; Space nach der Landung mit Lenkung halten und bei geladenem Drift loslassen, um Mini-Turbo zu aktivieren. Zwei markierte Bodenwellen zeigen die Federung. C wechselt zwischen naher/ferner Verfolger- und Fahrerperspektive, P pausiert und R startet neu. `?fleet=1` reduziert die Lastprobe auf ein Fahrzeug.

## Grundpfeiler

1. **Direktes Fahrgefühl vor Umfang:** Ein Rennen muss sich früh gut steuern, lesen und beenden lassen; Ziel ist etwa 6/10 Realismus zwischen Arcade und Simulation.
2. **Satirische Erwachsenenwelt mit Ursache und Wirkung:** Bissiger, schwarzer, düsterer und provokanter Humor wird durch Strecke, Fahrer, Items, Audio und sichtbare Reaktionen erzählt.
3. **Historische Anspielung ohne Verherrlichung:** Reale Diktatoren, Gebäude und Regime dürfen kritisch-satirisch erkennbar sein; rechtsextreme Inhalte, Verherrlichung, Holocaust-/Genozid-Szenarien und menschenverachtende Grenzüberschreitungen sind ausgeschlossen.
4. **Eigenständige visuelle Identität:** N64-inspirierte Lesbarkeit trifft auf deutlich höhere Detailtreue, erwachsenere Formen, Materialien, Lichtstimmung, Animationen und Effekte; keine Kopie von Nintendo.
5. **Themenbasierte Fahrzeuge und Strecken:** Jeder Diktator erhält ein einzigartiges Fahrzeug mit Grundsilhouette, charakteristischen Umbauten, Farben, Kleidung und beweglichen Details. Geplant sind sechs Themenstrecken plus eine verbindende Strecke.
6. **Browser auf PC und Handy:** Chrome unter Windows zuerst, anschließend Android und iPhone im Querformat mit identischen Rennregeln und skalierbarer Grafik. Normale PCs bleiben die Leistungsleitplanke.
7. **Babylon.js als Fundament, nicht als Selbstzweck:** Engine-Funktionen werden nur eingesetzt, wenn sie Spielgefühl, Lesbarkeit oder Produktionssicherheit verbessern.
8. **Singleplayer-Kern zuerst:** Strecke, Physik, Gegner, Items, Audio, UI und vollständige Rennschleife kommen vor Multiplayer und Komfort-Erweiterungen.
9. **Dokumentierte Entscheidungen:** Jede tragende Entscheidung hat einen Ort, eine Begründung und ein Abnahmekriterium.
10. **Kostenlose gemeinsame Produktion:** zunächst privat für uns und Freunde, später öffentlich kostenlos; vorhandene und kostenlose Werkzeuge/Assets, derzeit kein zusätzliches Produktionsbudget. Änderungen an Sarahs ursprünglichen Ideen werden gemeinsam bestätigt.

## Bestätigter erster Spielumfang

Sechs Fahrer: Hitler, Stalin, Mussolini, Mao, Kim Jong-un und Castro. Zuerst wird ein Fahrer samt Kart vollständig ausgearbeitet, während die fünf anderen einfacher dargestellt werden. Große Köpfe und überzeichnete Körper bleiben; historische Gesichtszüge machen die Figuren wiedererkennbar. Erste Strecke: eine frei zusammengestellte historische Berlin-/Stadionwelt mit satirischen Details.

Drift, Sprung und Mini-Turbo bleiben zentral. Drei Kameras sind vorgesehen: nahe und entfernte Verfolgerkamera sowie Fahrerperspektive mit Händen, Lenkrad, Armaturen und Vorderrädern. Drei Start-Items (geradliniges Projektil, zielsuchendes Projektil, Falle) wirken bei allen Fahrern gleich; Modelle, Sounds und Animationen unterscheiden sich. Persönliche Spezialfähigkeiten nutzen eine eigene Eingabe und feste Abklingzeiten; Zahlenwerte werden im Prototyp abgestimmt.

Individuelle Parodiestimmen und eine Stadionsprecherin verwenden vorproduziertes Audio; Musik ist historisch geprägt, nicht elektronisch. Nach dem Singleplayer folgen private Online-Lobbys mit Einladung und Crossplay auf getrennten Geräten. Details und verbleibende Entscheidungen: [10-open-questions.md](docs/10-open-questions.md).

## Detailkarten

| Thema | Dokument |
|---|---|
| Spielregeln, Figuren, Strecke, Satire | [01-game-design.md](docs/01-game-design.md) |
| Visuelles Ziel, Stil, Kamera, Effekte | [02-art-direction.md](docs/02-art-direction.md) |
| Babylon.js-Architektur und technische Leitplanken | [03-technology-babylon.md](docs/03-technology-babylon.md) |
| Budgets und Ziele für normale PCs | [04-performance.md](docs/04-performance.md) |
| Assetpipeline und Bildreferenzen | [05-assets-and-visual-references.md](docs/05-assets-and-visual-references.md) |
| Multiplayer als späterer Bereich | [06-multiplayer.md](docs/06-multiplayer.md) |
| Gameplay-Systeme und Zuständigkeiten | [07-gameplay-systems.md](docs/07-gameplay-systems.md) |
| KI-Arbeitsweise und Modellwahl | [08-ai-workflow-and-models.md](docs/08-ai-workflow-and-models.md) |
| Phasen und Abnahmen | [09-roadmap.md](docs/09-roadmap.md) |
| Priorisierte offene Fragen | [10-open-questions.md](docs/10-open-questions.md) |
| Extraktion aus dem Altprojekt | [11-legacy-extraction.md](docs/11-legacy-extraction.md) |
| Änderungs- und Entscheidungsverlauf | [12-decision-log.md](docs/12-decision-log.md) |
| Historische und inhaltliche Grenzen | [13-world-and-content-boundaries.md](docs/13-world-and-content-boundaries.md) |
| Fahrer-, Kart- und Itemkatalog | [14-character-and-item-catalog.md](docs/14-character-and-item-catalog.md) |
| Gesamtgerüst und Abhängigkeiten | [00-project-framework.md](docs/00-project-framework.md) |
| Machbare Itemproduktion | [15-item-feasibility-and-production.md](docs/15-item-feasibility-and-production.md) |
| Bauplan und täglicher Fahrplan | [16-production-blueprint.md](docs/16-production-blueprint.md) |
| Globale Projekthistorie | [17-progress-log.md](docs/17-progress-log.md) |
| Arbeitsumgebung und Betriebsregeln | [18-work-environment-and-operations.md](docs/18-work-environment-and-operations.md) |
| UI, Einstellungen und lokale Speicherung | [19-ui-settings-and-save.md](docs/19-ui-settings-and-save.md) |
| Runbook für den ersten Babylon.js-Abend | [20-first-evening-runbook.md](docs/20-first-evening-runbook.md) |

Visuelle Referenzen werden künftig in [`references/visuals/`](references/visuals/) abgelegt. Dort kann der Nutzer Screenshots, Fotos, Farbideen, Fahrzeugformen, Architektur und gewünschte Stimmungen ergänzen.

## Aktueller Status

- Planung und Wissensbasis: **für den technischen Start ausreichend geklärt**
- Babylon.js-Neuentwicklung: **M1 geprüft; M2a–l mit Fahrkern, Federung, drei Kameras, Sechs-Fahrzeug-Technikprobe, vorläufigen Kontakten und F3-Diagnose lokal umgesetzt und geprüft**
- Grundsatzentscheidungen: **Babylon.js und erster Spielumfang gesetzt; spätere Inhalts- und Messfragen sichtbar offen**
- M3-Vorbereitung: **Vorschlag für den ersten Art-Piloten in [Dokument 14](docs/14-character-and-item-catalog.md); Auswahl und Stilprobe bleiben gemeinsam zu bestätigen**
- Erste Strecke: **historische Berlin-/Stadionwelt bleibt gesetzt; ein quellenbasierter Routenvorschlag in [Dokument 01](docs/01-game-design.md) ist noch gemeinsam zu prüfen**
- Alte technische Implementierung: **nicht übernommen**
- Nächster Schritt: M2-Abnahmelücken mit menschlichem Fahrcheck, normalem/schwächerem PC und Mobilgeräten prüfen; die vorläufigen Kollisionsformen und Kameras dabei bewerten. Auftrag in [START-HERE.md](START-HERE.md).
- Arbeitsmodus für längere Sitzungen: [16-production-blueprint.md](docs/16-production-blueprint.md) lesen und [17-progress-log.md](docs/17-progress-log.md) fortschreiben.
- Zielplattformen: Google Chrome unter Windows zuerst; mobile Browser werden von Anfang an berücksichtigt.
- Startbarkeit: Jeder spielbare Stand braucht einen einfachen Startbutton, Launcher oder eine eindeutige Verknüpfung ohne Entwicklerkonsole.
