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

Die Testfläche wurde auf 72 × 52 Einheiten vergrößert; die vier Wände und die beiden Randmarkierungen wurden entsprechend nach außen versetzt.

Zur Orientierung gibt es zwei farbige Startmarkierungen. Diese Elemente sind rein visuell und besitzen keine Kollision.

Die große Testfläche besitzt außerdem ein dezentes Raster aus visuellen Linien, damit Bewegung und Kurven auch ohne die Wände besser eingeschätzt werden können.

## Erweiterung

Weitere Strecken sollen zunächst ebenfalls als klar getrennte statische Geometrie erstellt werden. Rundensystem, Hindernisse und Streckenmechaniken folgen erst nach der Validierung des grundlegenden Fahrgefühls.
