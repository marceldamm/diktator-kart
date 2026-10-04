# Assets und visuelle Referenzen

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Laufender großer Slice – 03.10.2026

Kostenlose lokale Pipeline: portable Blender 4.5.3 LTS unter ignoriertem `.tools/`, originale Generatoren und editierbare `.blend` unter `art-source/`, Laufzeit-GLB unter `public/assets/models/`. Poly-Haven-CC0-Baum und Pflaster sind anhand offizieller Quellen dokumentiert. Audio-WAVs original; vorläufige Pianoaufnahme mit CC-BY-4.0-Attribution. `public/assets/CREDITS.md` enthält Herkunft/Bearbeitung. G–L bleibt Bildreferenz und wird nicht als Spieltextur kopiert. Der aktuelle Himmel nutzt ein offizielles Poly-Haven-CC0-Panorama in 4K/2K; die frühere Imagegen-Textur wird nicht mehr geladen. Reproduktions- und Bearbeitungshinweise in `art-source/README.md`; lokale GLB-Optimierung mit glTF Transform SDK/Sharp, keine externe Produktionsplattform.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](../PROGRESS-LOG.md).

## Verbindliches Stimmenziel – 04.10.2026

Fertige Fahrer-/Sprecherstimmen laut Marcel **ohne Text-to-Speech**, auch ohne offline erzeugte TTS-Clips. Menschliche Aufnahmen oder geeignete echte Mitschnitte mit nachvollziehbaren kostenlosen Nutzungsrechten beschaffen/produzieren; Quellen und Bearbeitung erhalten. Vorhandene Piper-Clips sind Zwischenstand und erfüllen das Endziel nicht. Umfassender Qualitätspass für alle Modelle, Charaktere, Fahrzeuge, Strecke, Umgebung, Effekte, Sounds und Musik anhand der gewählten Bildpräferenz: [LONG-TERM-GOALS.md](../LONG-TERM-GOALS.md).

## Ziel

Die neue Produktion braucht eine klare Kette von Idee → Referenz → Entwurf → Asset → Integration → Abnahme. Ein Bild im Referenzordner ist eine Stilhilfe, keine automatisch zu kopierende Vorlage und keine Lizenzfreigabe.

## Referenzordner

Der Nutzer kann künftig Bilder in [`../references/visuals/`](../references/visuals/) ablegen. Geeignet sind:

- gewünschte Kart- und Figurenformen
- Gebäude, Plätze, Monumente und Landschaften
- Farbpaletten, Materialien und Lichtstimmungen
- Beispiele für Kamerawinkel, UI, Partikel und Animationen
- Bilder, die ausdrücklich „so nicht“ gemeint sind

Zu jedem wichtigen Bild sollte später kurz notiert werden: Was gefällt daran? Was soll nicht kopiert werden? Welche Eigenschaft ist spielrelevant? Gibt es eine Lizenz- oder Herkunftsinformation?

## Assetklassen

- **Kernmodelle:** Fahrer, Karts, Itemobjekte, Streckenmodule, zentrale Landmarken.
- **Wiederholer:** Absperrungen, Lautsprecher, Pappfiguren, Banner, Papier, Pokale, Lampen.
- **Materialien:** Asphalt, Pflaster, Marmor, Goldanstrich, Holz/Kulisse, Papier, Metall, Stoff.
- **Animationen:** Fahrerreaktionen, Kartdetails, Applausmaschine, Stempel, Banner, Statue, Zielehrung.
- **Audio:** Sprecherin, Motor, Reifen, Oberfläche, Items, Weltreaktionen, UI.
- **UI:** HUD, Itemanzeige, Minikarte, Untertitel, Pause, Ergebnis, Rennbericht, Einstellungen.

## Produktionsregeln

- Vorerst ausschließlich vorhandene oder kostenlose Werkzeuge und Assets; kein zusätzliches Budget für Modelle, Musik oder Stimmen. Kostenloser Download ersetzt keine passende Nutzungslizenz für die spätere öffentliche Veröffentlichung.
- Ein Fahrer samt Kart wird zuerst vollständig ausgearbeitet, fünf weitere werden zunächst einfacher dargestellt. Der erste Art-Pass wird mit dem Nutzer geprüft, bevor die Qualität auf den restlichen Kader übertragen wird.
- Große Köpfe, karikierte Körper, historische Gesichtszüge; Cockpit, Hände, Lenkrad, Armaturen und Vorderräder für die Fahrerperspektive mitplanen. Editierbare Quelldateien und eine echte Fahrkamera-Prüfung gehören zur Abnahme.
- Drei gemeinsame Start-Itemregeln erhalten fahrerspezifische Modelle, Sounds und Animationen. Varianten dürfen nicht unbemerkt Reichweite, Treffergröße oder Warnbarkeit verändern.
- Individuelle Parodiestimmen und Stadionsprecherin vorproduzieren, Herkunft/Lizenz dokumentieren und Hörproben gemeinsam abnehmen. Historisch geprägte Musik ohne elektronische Stilrichtung; derzeit nur kostenlose Produktionsmittel.

- GLB/GLTF als bevorzugtes Laufzeitformat prüfen; Quelldateien bleiben editierbar und erhalten Herkunftshinweise.
- Modelle nach Fahrkamera und Silhouette abnehmen, nicht nur in einer freien Editoransicht.
- Materialien so anlegen, dass Basis- und Standardqualität dieselbe Lesbarkeit behalten.
- Ein Asset ist erst „integriert“, wenn Ladepfad, Fallback, Animation, Performance und Neustartverhalten geprüft wurden.
- Nutzerbilder niemals ungeprüft in ein veröffentlichtes Produkt kopieren.

## Altprojekt als Bildreferenz

Die Bilder unter `game-review/` zeigen den bisherigen Prototypenstand mit vereinfachten Karts/Fahrern, HUD und Startaufstellung. Sie sind Ist-Stand und Lernmaterial. Das im alten Index erwähnte Key-Art dient als Farb- und Stimmungshinweis, nicht als Beweis, dass die neue Engine dieselbe Darstellung automatisch erreicht.
