# Strecken – Größenwahn Grand Prix

## Aktueller Kurs

Der Standard ist ein breiter Hauptstadt-Rundkurs mit langer oberer und unterer Geraden sowie großzügigen Außenkurven. Eine gemeinsame Kollisionsfläche unter Asphalt und Gras hält den RaycastVehicle-Kontakt stabil.

Fünf lesbare Bereiche rahmen die Runde: Palastplatz, Boulevard der einstimmigen Begeisterung, Staatsdruckerei, Fünfjahresplan-Monument und Palastgärten mit goldenem Entenbrunnen. Rote Begrenzungen, gelbe Curbs, Startbogen und sichtbare Checkpoint-Markierungen halten die Wegführung klar.

## Staatsdruckerei-Abkürzung

Die sichere Außenroute der Ostkurve bleibt unverändert. Eine Papierbahn bei `x = 178` schneidet die Kurve deutlich kürzer. Zwei feste Rampen markieren Ein- und Ausfahrt. Drei große Stempel arbeiten in versetzten, jeweils 4,2 Sekunden langen Zyklen. Ihre Köpfe bleiben lange oben und schlagen erst nach einer sichtbaren Abwärtsphase zu. Ein Treffer reduziert die Motorleistung 2,1 Sekunden; Gas und Lenkung bleiben nutzbar.

Der geometrische Zeitvorteil ist integriert. Der messende Fahrvergleich und die sichtbare Prüfung der Vorwarnzeit stehen wegen der vorübergehend gesperrten Browsersteuerung noch aus.

## Rundenabhängige Kulisse

Der führende Rundenstand steuert drei rein dekorative, globale Veränderungen: Der Pappapplaus verliert ab Runde zwei seine Synchronität, das Palastbanner wird zunehmend überzogen und das Gerüst am Monument kippt beziehungsweise wird verstärkt. Diese Zustände verändern keine Kollisionsgeometrie und werden beim Neustart vollständig zurückgesetzt.

## Rennablauf

`RaceController` verwaltet 3-2-1-LOS, drei Runden, aktuelle Rennzeit, Rundenzeit und beste Runde. Drei Checkpoints müssen vor der Ziellinie in der richtigen Reihenfolge passiert werden; Start/Ziel-Hin-und-Her zählt nicht als Runde.

Die frühere große Physik-Testfläche bleibt als `createPhysicsTestTrack` für spätere isolierte Controllerexperimente erhalten.
