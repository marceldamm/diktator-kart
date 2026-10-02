# Diktator Kart – Babylon-Neustart 2026

Für den täglichen Überblick zuerst [START-HERE.md](START-HERE.md) öffnen. Die gemeinsame Bedienungsanleitung für dich und Sarah steht in [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md).

Für den täglichen Überblick zuerst [START-HERE.md](START-HERE.md) öffnen. Dort stehen aktueller Stand, nächster Schritt, Meilensteine und die Startvorlage für Codex.

## Kurzfassung

Diktator Kart wird als eigenständiger satirischer 3D-Arcade-Kart-Racer für den Browser neu konzipiert. Die neue technische Basis ist **Babylon.js**. Das Spiel soll vom Gefühl klassischer Kart-Racer wie Mario Kart 64 und vom Politur-Niveau modernerer Mario-Kart-Spiele auf der Switch inspiriert sein, aber eine eigene Welt, eigene Figuren und eine eigene Satire besitzen: etwas realistischer, schöner und effektvoller, ohne auf High-End-PCs angewiesen zu sein.

Dieser Ordner ist zunächst eine Planungs- und Wissensbasis. Er übernimmt aus dem Altprojekt Ideen und belegte Designentscheidungen, aber keine alte Engine-Implementierung.

## Grundpfeiler

1. **Direktes Fahrgefühl vor Umfang:** Ein Rennen muss sich früh gut steuern, lesen und beenden lassen; Ziel ist etwa 6/10 Realismus zwischen Arcade und Simulation.
2. **Satirische Erwachsenenwelt mit Ursache und Wirkung:** Bissiger, schwarzer, düsterer und provokanter Humor wird durch Strecke, Fahrer, Items, Audio und sichtbare Reaktionen erzählt.
3. **Historische Anspielung ohne Verherrlichung:** Reale Diktatoren, Gebäude und Regime dürfen kritisch-satirisch erkennbar sein; rechtsextreme Inhalte, Verherrlichung, Holocaust-/Genozid-Szenarien und menschenverachtende Grenzüberschreitungen sind ausgeschlossen.
4. **Eigenständige visuelle Identität:** N64-inspirierte Lesbarkeit trifft auf deutlich höhere Detailtreue, erwachsenere Formen, Materialien, Lichtstimmung, Animationen und Effekte; keine Kopie von Nintendo.
5. **Themenbasierte Fahrzeuge und Strecken:** Jeder Diktator erhält ein einzigartiges Fahrzeug mit Grundsilhouette, charakteristischen Umbauten, Farben, Kleidung und beweglichen Details. Geplant sind sechs Themenstrecken plus eine verbindende Strecke.
6. **Browser und normale PCs als harte Leitplanke:** Qualität wird über Skalierung, LOD, Instancing, reduzierte Effekte und messbare Budgets erreicht.
7. **Babylon.js als Fundament, nicht als Selbstzweck:** Engine-Funktionen werden nur eingesetzt, wenn sie Spielgefühl, Lesbarkeit oder Produktionssicherheit verbessern.
8. **Singleplayer-Kern zuerst:** Strecke, Physik, Gegner, Items, Audio, UI und vollständige Rennschleife kommen vor Multiplayer und Komfort-Erweiterungen.
9. **Dokumentierte Entscheidungen:** Jede tragende Entscheidung hat einen Ort, eine Begründung und ein Abnahmekriterium.

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

- Planung und Wissensbasis: **angelegt**
- Babylon.js-Neuentwicklung: **noch nicht begonnen**
- Grundsatzentscheidungen: **Babylon.js gesetzt; weitere Fragen priorisiert offen**
- Alte technische Implementierung: **nicht übernommen**
- Nächster sinnvoller Schritt: die Fragen der Priorität 0 in [10-open-questions.md](docs/10-open-questions.md) gemeinsam entscheiden.
- Arbeitsmodus für längere Sitzungen: [16-production-blueprint.md](docs/16-production-blueprint.md) lesen und [17-progress-log.md](docs/17-progress-log.md) fortschreiben.
- Zielplattformen: Google Chrome unter Windows zuerst; mobile Browser werden von Anfang an berücksichtigt.
- Startbarkeit: Jeder spielbare Stand braucht einen einfachen Startbutton, Launcher oder eine eindeutige Verknüpfung ohne Entwicklerkonsole.
