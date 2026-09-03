# Strecken – Prototyp

## Aktueller Kurs

Der Standard ist ein breiter, flacher Rechteck-Rundkurs mit langer oberer und unterer Geraden sowie sehr großzügigen Kurven. Eine gemeinsame Kollisionsfläche unter Asphalt und Gras hält den RaycastVehicle-Kontakt stabil.

Der Kurs enthält rote Begrenzungen, gelbe Curbs, ein zentrales Gras-Infield, Start/Ziel-Schachbrettlinie, Startbogen, drei sichtbare Checkpoint-Markierungen und einfache Low-Poly-Bäume. Er ist absichtlich noch kein finaler Art-Track, soll aber sofort als Kart-Rennspiel lesbar sein.

## Rennablauf

`RaceController` verwaltet 3-2-1-LOS, drei Runden, aktuelle Rennzeit, Rundenzeit und beste Runde. Drei Checkpoints müssen vor der Ziellinie in der richtigen Reihenfolge passiert werden; Start/Ziel-Hin-und-Her zählt nicht als Runde.

Die frühere große Physik-Testfläche bleibt als `createPhysicsTestTrack` für spätere isolierte Controllerexperimente erhalten.
