# Diktator Kart – Babylon-Neustart 2026

> **Dokumentvorrang (04.10.2026):** Diese README ist die kurze Projektübersicht. Für aktuelle Aufträge und Status gelten die vier [Hauptdateien](CURRENT-WORKLIST.md): [Aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](PROGRESS-LOG.md).


## Unsere vier Arbeitsdateien

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Präzisiertes Ziel für Figuren und Welt – 03.10.2026

Marcel präzisiert das Ziel: erkennbare und realitätsnahe Abbilder der echten historischen Fahrer, insbesondere Hitler; keine erfundenen Ersatzpersonen als Endergebnis. Satire entsteht durch Inszenierung und Spielhandlungen; Gesichter, Frisuren, Kleidung, Anatomie und Materialien sollen die jeweilige Person glaubwürdig erkennen lassen. Auch die Berlin-/Stadionwelt soll deutlich realitätsnäher werden. Die vorhandenen neutralen Modelle beschreiben nur den aktuellen Zwischenstand. Frühere neutrale Produktionsaufträge sind keine dauernde Beschränkung dieses Ziels. Die bisherige Verpflichtung auf große Köpfe/deutlich überzeichnete Körper wird durch diesen neuen Nutzerwunsch ersetzt. Kein Regimezeichen oder verherrlichende Inszenierung. Sarahs ursprüngliche Ideen werden nicht stillschweigend umbenannt; die Präzisierung ist als aktueller Nutzerauftrag nachvollziehbar.

Gemeinsame aktive Basis ist jetzt **main** in **marceldamm/diktator-kart**: Claudes Q2d-Spielstand plus Teamablauf. Marcels Arbeitsordner ist D:\Diktator-Kart; Sarah verwendet ihren eigenen Checkout. **Alte Stände/Engine und Altarchive sind nur historische Referenzen, werden nicht mehr bearbeitet oder als Spiel gestartet.** Der neue Stand umfasst den 593-m-Kurs, sechs historische Fahrer in vorläufiger Karikaturstufe, Fahrerwahl, Stimmen, verbesserte Kontakte/Lenkträgheit, Hinterhof-Abkürzung und Live-Videowand. Historische Gestaltung, Sarah-Ideen, Stil-/Geräteabnahme bleiben gesondert zu bestätigen.

**Abends in Codex:** „Projektstart. Danach: [Aufgabe].“ **Am Ende:** „Projektabschluss. Prüfe, dokumentiere und veröffentliche meine Änderungen im gemeinsamen main.“ Ausführbarer Einstieg: Projekt-starten.cmd / Projekt-abschliessen.cmd; Details und Sarahs einmaliger Umstieg in [Teamablauf](docs/21-team-workflow.md).

Für den täglichen Überblick zuerst [START-HERE.md](START-HERE.md) öffnen. Die gemeinsame Bedienungsanleitung für dich und Sarah steht in [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md).

## Kurzfassung

Diktator Kart wird als eigenständiger satirischer 3D-Arcade-Kart-Racer für den Browser neu konzipiert. Die neue technische Basis ist **Babylon.js**. Das Spiel soll vom Gefühl klassischer Kart-Racer wie Mario Kart 64 und vom Politur-Niveau modernerer Mario-Kart-Spiele auf der Switch inspiriert sein, aber eine eigene Welt, eigene Figuren und eine eigene Satire besitzen: etwas realistischer, schöner und effektvoller, ohne auf High-End-PCs angewiesen zu sein.

Dieser Ordner enthält die Planungs- und Wissensbasis sowie seit M1 einen startbaren Babylon.js-Technikgrundstand. Er übernimmt aus dem Altprojekt Ideen und belegte Designentscheidungen, aber keine alte Engine-Implementierung.

**Spiel starten:** [`Diktator-Kart-starten.cmd`](Diktator-Kart-starten.cmd) doppelklicken und das Fenster offen lassen. Chrome öffnet die im Starter angezeigte URL (gewöhnlich http://127.0.0.1:4173/; bei anderem Server ein freier Port). Nur exakt derselbe Checkout wird wiederverwendet. Technisch: `npm ci`, `npm run dev`. Enter startet ein Drei-Runden-Rennen. W/S fahren, A/D lenken, Space Hop/Drift/Turbo, C Kamera, F Foto, V Sprachhupe, B Rücksetzung bei niedrigem Tempo, P Pause, R kompletter Neustart, F3 Diagnose. Linke Maustaste halten: frei umsehen. Rechte Maustaste oder X halten: Rückblick. E halten: Item als Schild; loslassen: werfen. Bei Rohrpost und Suchauftrag: E+V nach vorn, E+H nach hinten. Der Cursor wird nur während der Mausgeste unsichtbar und an seiner ursprünglichen Position festgehalten (temporärer nativer Pointer Lock); Loslassen zeigt ihn dort wieder. Loslassen/Fokusverlust/Menü/Pause/Neustart/Kamerawechsel beenden die Geste. Freiere Rundumsicht und vertikaler Blick; nach Loslassen weich nach vorn. Esc öffnet das Menü. Grafik-/Effektstufen, Kameraruhe, Ton und Musiklautstärke werden lokal gespeichert. `?world=lab` bleibt der reproduzierbare Fahrtechniktest, `?demo=1` fährt den Spieler über denselben Botcontroller.

## Grundpfeiler

**Qualitätspräzisierung 04.10.2026 (Marcel):** Modelle, historische Charaktere, Fahrzeuge, Strecke, Umfeld, Licht/Effekte, Sounds, Stimmen und Musik deutlich hochwertiger und realitätsnäher ausarbeiten, gemessen an der gewählten Bildpräferenz G–L im fahrenden Spiel. Fertige Stimmen ausdrücklich **ohne Text-to-Speech**, auch ohne offline erzeugtes TTS; aktuelle synthetische Clips sind Zwischenstand. Aufgaben/Abnahmen: [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md). Bestehende Performance-, Kosten- und Fairnessziele gelten weiter.

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

Der bestätigte Startkader umfasst Hitler, Stalin, Mussolini, Mao, Kim Jong-un und Castro. Im aktuellen Babylon-Spiel sind sie als erkennbare Karikaturen mit Fahrerwahl umgesetzt – eine Zwischenstufe, keine realitätsnahen Porträts. Das geltende Ziel vom 03./04.10.2026 verlangt realitätsnähere, wiedererkennbare Fahrer und eine glaubwürdigere Berlin-/Stadionwelt; es ersetzt die frühere feste Vorgabe großer Köpfe und deutlich überzeichneter Körper. Ein Fahrer/Kart wird zuerst als Qualitätsanker ausgearbeitet, die übrigen folgen. Konkrete Streckenroute und historische Darstellungen bleiben gemäß den Hauptdateien und den Inhaltsgrenzen prüfpflichtig.

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
| Globale Projekthistorie | [PROGRESS-LOG.md](PROGRESS-LOG.md) |
| Arbeitsumgebung und Betriebsregeln | [18-work-environment-and-operations.md](docs/18-work-environment-and-operations.md) |
| UI, Einstellungen und lokale Speicherung | [19-ui-settings-and-save.md](docs/19-ui-settings-and-save.md) |
| Runbook für den ersten Babylon.js-Abend | [20-first-evening-runbook.md](docs/history/20-first-evening-runbook.md) |

Visuelle Referenzen werden künftig in [`references/visuals/`](references/visuals/) abgelegt. Dort kann der Nutzer Screenshots, Fotos, Farbideen, Fahrzeugformen, Architektur und gewünschte Stimmungen ergänzen.

## Aktueller Status

- Planung und Wissensbasis: **für den technischen Start ausreichend geklärt**
- Babylon.js-Neuentwicklung: **M1 geprüft; M2a–l mit Fahrkern, Federung, drei Kameras, Sechs-Fahrzeug-Technikprobe, vorläufigen Kontakten und F3-Diagnose lokal umgesetzt und geprüft**
- Sichtbare Babylon-Stilskizze: **neutraler 593-m-Rundkurs (Qualitätsstufe 2) mit editierbaren Blender-Karts, sechs fiktiven Figuren, streckenbezogener Architektur und echten PBR-Oberflächen; `?world=lab` hält den reproduzierbaren Techniktest bereit. G–L bleibt das deutlich höhere Ziel, keine Stilfreigabe.**
- Grundsatzentscheidungen: **Babylon.js und erster Spielumfang gesetzt; spätere Inhalts- und Messfragen sichtbar offen**
- M3-Vorbereitung: **Vorschlag für den ersten Art-Piloten in [Dokument 14](docs/14-character-and-item-catalog.md); Auswahl und Stilprobe bleiben gemeinsam zu bestätigen**
- Erste Strecke: **historische Berlin-/Stadionwelt bleibt gesetzt; ein quellenbasierter Routenvorschlag in [Dokument 01](docs/01-game-design.md) ist noch gemeinsam zu prüfen**
- Alte technische Implementierung: **nicht übernommen**
- Nächster Schritt: Den aktuellen Stand schrittweise an das Qualitätsziel aus LONG-TERM-GOALS.md heranführen: zuerst erkennbare historische Fahrer und Grafikpass; Hör-/Spielabnahmen sowie Zielgeräte bleiben offen. Auftrag in [START-HERE.md](START-HERE.md).
- Arbeitsmodus für längere Sitzungen: [16-production-blueprint.md](docs/16-production-blueprint.md) lesen und [PROGRESS-LOG.md](PROGRESS-LOG.md) fortschreiben.
- Zielplattformen: Google Chrome unter Windows zuerst; mobile Browser werden von Anfang an berücksichtigt.
- Startbarkeit: Jeder spielbare Stand braucht einen einfachen Startbutton, Launcher oder eine eindeutige Verknüpfung ohne Entwicklerkonsole.
