# Teststrecke – Prototyp

## Status

Die erste Teststrecke ist umgesetzt und dient ausschließlich dem Erproben von Fahrgefühl und Kollisionen.

## Aufbau

Die Strecke besteht aus:

- einer flachen rechteckigen Asphaltfläche (36 × 26 Einheiten),
- vier statischen, zwei Einheiten dicken Begrenzungswänden,
- zwei niedrigen gelben Randmarkierungen als visuelle Orientierung.

Boden und Wände besitzen PlayCanvas-Kollisionen. Es gibt noch kein Rundensystem, keine Checkpoints und keine Streckenassets aus Blender.

## Aktueller Stand

Die Testfläche ist 72 × 260 Einheiten groß. Die Breite wurde damit gegenüber dem vorherigen 72 × 52-Aufbau verfünffacht. Das Kart startet am linken Ende der langen Seite, mittig in der Breite, und zeigt entlang der langen Fahrtrichtung.

Zur Orientierung gibt es zwei farbige Startmarkierungen. Diese Elemente sind rein visuell und besitzen keine Kollision.

Die große Testfläche besitzt außerdem ein dezentes Raster aus visuellen Linien, damit Bewegung und Kurven auch ohne die Wände besser eingeschätzt werden können.

## Erweiterung

Weitere Strecken sollen zunächst ebenfalls als klar getrennte statische Geometrie erstellt werden. Rundensystem, Hindernisse und Streckenmechaniken folgen erst nach der Validierung des grundlegenden Fahrgefühls.
