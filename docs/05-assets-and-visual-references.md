# Assets und visuelle Referenzen

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
