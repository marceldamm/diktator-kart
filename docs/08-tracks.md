# Strecken – Größenwahn Grand Prix

## Aktueller Kurs

Der Standard ist ein breiter Hauptstadt-Rundkurs mit langer oberer und unterer Geraden sowie großzügigen Außenkurven. Eine gemeinsame Kollisionsfläche unter Asphalt und Gras hält den RaycastVehicle-Kontakt stabil.

Fünf lesbare Bereiche rahmen die Runde: Palastplatz, Boulevard der einstimmigen Begeisterung, Staatsdruckerei, Fünfjahresplan-Monument und Palastgärten mit goldenem Entenbrunnen. Rote Begrenzungen, gelbe Curbs, Startbogen und sichtbare Checkpoint-Markierungen halten die Wegführung klar.

## Boostgeraden und Slalommarken

Auf den breiten Nord- und Südgeraden liegen vier flache, türkis-gelbe Booststreifen. Beim Überfahren gewähren sie vier Sekunden deutlich verstärkten Schub und haben pro Kart eine kurze Eintrittsabklingzeit, damit ein Kart nicht mehrfach pro Frame ausgelöst wird. Die Streifen besitzen keine eigene Kollision und können niemanden festsetzen. Kleine gelbe Pylonen markieren zusätzlich einen leichten Slalom. Ihre kleinen Kollisionskörper haben niedrige Reibung; eine separate Eintrittsreaktion berücksichtigt die Kartmasse und gibt bei einem Treffer einen klaren seitlich-rückwärts gerichteten Impuls. Eine kurze Hütchen-Abklingzeit verhindert dabei Dauerstöße, während mehrere Fahrlinien offen bleiben.

## Staatsdruckerei-Abkürzung

Die sichere Außenroute der Ostkurve bleibt unverändert. Eine Papierbahn bei `x = 178` schneidet die Kurve deutlich kürzer. Zwei flache Rampen markieren Ein- und Ausfahrt; ihre bodenbündigen Enden zeigen jeweils zur Anfahrt beziehungsweise zur anschließenden Geraden. Die Kollisionsflächen steigen in zwölf Segmenten unter einer durchgehenden Papieroberfläche an; dadurch gibt es weder eine hohe Einstiegskante noch einen Spalt unter der Rampe. Drei große Stempel arbeiten in versetzten, jeweils 4,2 Sekunden langen Zyklen. Ihre Köpfe bleiben lange oben und schlagen erst nach einer sichtbaren Abwärtsphase zu. Ein Treffer reduziert die Motorleistung 2,1 Sekunden; Gas und Lenkung bleiben nutzbar.

Der geometrische Zeitvorteil ist integriert. Der messende Fahrvergleich und die sichtbare Prüfung der Vorwarnzeit stehen wegen der vorübergehend gesperrten Browsersteuerung noch aus.

## Rundenabhängige Kulisse

Der führende Rundenstand steuert drei rein dekorative, globale Veränderungen: Der Pappapplaus verliert ab Runde zwei seine Synchronität, das Palastbanner wird zunehmend überzogen und das Gerüst am Monument kippt beziehungsweise wird verstärkt. Diese Zustände verändern keine Kollisionsgeometrie und werden beim Neustart vollständig zurückgesetzt.

## Rennablauf

`RaceController` verwaltet 3-2-1-LOS, drei Runden, aktuelle Rennzeit, Rundenzeit und beste Runde. Drei Checkpoints müssen vor der Ziellinie in der richtigen Reihenfolge passiert werden; Start/Ziel-Hin-und-Her zählt nicht als Runde.

Die Ziellinie liegt in der westlichen Verbindung zwischen Süd- und Nordgerade. Nach allen drei Checkpoints muss sie dort in Fahrtrichtung von Süden nach Norden durchquert werden. Außenbegrenzung und westliche Inselbarriere schließen die Durchfahrt seitlich, ohne die südliche Gerade zu blockieren. Die sichtbare Zielflagge deckt den vollständigen Korridor ab. Das Startgrid steht auf der südlichen Anfahrt und ist nach Norden ausgerichtet.

Die frühere große Physik-Testfläche bleibt als `createPhysicsTestTrack` für spätere isolierte Controllerexperimente erhalten.
