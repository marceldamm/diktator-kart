# Kart-Physik – Prototyp

## Status

Die erste fahrbare Version ist umgesetzt. Sie verwendet den vorhandenen PlayCanvas-Rigidbody-Stack mit Ammo als Kollisions- und Bewegungssystem.

## Arcade-Modell

Das Kart ist ein dynamischer Box-Rigidbody. Die Bewegung wird über Kräfte und ein begrenztes Y-Drehmoment gesteuert:

- W/Pfeil hoch beschleunigt vorwärts.
- S/Pfeil runter bremst bzw. fährt rückwärts.
- A/D und die Pfeiltasten lenken links/rechts.
- Seitliches Rutschen wird mit einer einfachen Arcade-Grip-Kraft reduziert.
- X- und Z-Rotation sind gesperrt, damit der Platzhalter nicht umkippt.
- Die Geschwindigkeit ist auf einen festen, bewusst moderaten Prototypwert von 3,5 Einheiten/Sekunde begrenzt.

Es gibt bewusst keine Räder-, Federungs- oder realistische Fahrzeug-Simulation. Die Box-Kollision des Karts und statische Box-Kollisionen der Strecke werden von PlayCanvas/Ammo behandelt.

## Aktueller Controller

Der Lenkwert wird intern geglättet und bei losgelassener Taste weich auf null zurückgeführt. Daraus entsteht eine geschwindigkeitsabhängige Ziel-Drehgeschwindigkeit: bei höherem Tempo wird sie reduziert, beim Rückwärtsfahren gespiegelt. Im Neutralzustand wird die Y-Drehgeschwindigkeit aktiv beruhigt; seitlicher Grip bleibt in Kurven teilweise erhalten und wird ohne Lenkeingabe verstärkt.

Die vorläufigen Kernwerte sind: Vorwärtskraft 18, Rückwärtskraft 8, Höchstgeschwindigkeit 12 und Rückwärtslimit 5 Einheiten/Sekunde.

## GTA-inspirierte Arcade-Basis

Der Controller trennt Beschleunigen, Ausrollen, Bremsen und Rückwärtsgang. Die Lenkung erzeugt eine geschwindigkeitsabhängige Ziel-Gierrate statt einer sofortigen Drehung auf der Stelle. Der Lenkwert wird geglättet; ohne Lenkeingabe wird die Gierrate ausgeregelt. Seitlicher Grip ist in Kurven reduziert, bleibt im Geradeauslauf aber stärker, sodass ein kleines Maß an Trägheit erhalten bleibt.

Beim Wechsel von Vorwärtsfahrt zu S wird zunächst nur gebremst. Der Rückwärtsantrieb setzt erst nahe dem Stillstand ein. Physik-generierte Restrotation wird nicht in den nächsten Frame übernommen; die geglättete Lenkung bestimmt ausschließlich die aktuelle Ziel-Gierrate.

Seitliche Restgeschwindigkeit wird bei neutraler Lenkung vollständig entfernt. Größeres seitliches Rutschen bleibt bei aktiver Lenkung sichtbar und wird weiterhin durch den Arcade-Grip abgebaut.

Die Neutral-Lenkung arbeitet strikt planar: X/Z-Geschwindigkeit wird auf den normalisierten planaren Forward-Vektor projiziert, während die vertikale Y-Geschwindigkeit unverändert bleibt. Bei `input.x === 0` wird damit jede seitliche X/Z-Komponente entfernt und die Yaw-Geschwindigkeit auf null gesetzt.

Die Y-Rotation des Rigidbody ist vollständig gesperrt (`angularFactor = (0, 0, 0)`). Der Controller verwaltet den Heading-Winkel selbst und synchronisiert ihn als Rotation an den Physikkörper. Ammo bleibt damit für Position, Kollisionen und Boden zuständig, kann aber keinen eigenen Yaw mehr erzeugen.

Das aktuelle Geschwindigkeitstuning nutzt `linearDamping = 0.05` und `coastingDrag = 1.1`. Die Vorwärtskraft bleibt bei 20; `maxSpeed = 16` bleibt als harte Sicherheitsgrenze bestehen. Dadurch wird die reale Vollgasgeschwindigkeit erhöht, ohne die Beschleunigung unverhältnismäßig hoch zu setzen.

## Legacy-Status

Der bisherige Custom-KartController war ein experimenteller Eigenbau. Er bleibt als Legacy- und Vergleichsmodell erhalten. Neue Fahrphysik wird ab jetzt auf einer bestehenden Vehicle-Physics-Basis aufgebaut. Am alten Controller wird nicht weiter optimiert, außer dies wird ausdrücklich gewünscht.

## Architektur

- `client/src/game/input.ts`: Tastaturinput als austauschbare Inputquelle.
- `client/src/game/kart.ts`: Kart-Platzhalter und Arcade-Fahrlogik.
- `client/src/game/raycast-kart.ts`: separate RaycastVehicle-Basis auf Ammo-`btRaycastVehicle`.
- `client/src/game/follow-camera.ts`: einfache geglättete Verfolgerkamera.
- `client/src/game/track.ts`: flache Strecke, Boden und Begrenzungswände.

## RaycastVehicle-Vergleichsbasis

Der experimentelle Eigenbau in `kart.ts` bleibt unverändert als Legacy- und Vergleichsmodell erhalten. Die neue technische Basis liegt separat in `raycast-kart.ts` und verwendet das PlayCanvas-/Ammo-Muster aus dem offiziellen Vehicle-Physics-Beispiel:

- dynamischer Chassis-Rigidbody als Fahrzeugkörper,
- `btRaycastVehicle` mit vier Raycast-Rädern,
- vordere Räder für Steering,
- hintere Räder für Motorforce,
- Brakeforce auf allen vier Rädern,
- zentrale Werte für Motor, Bremse, Lenkung, Federung, Reifenreibung und Geschwindigkeitslimits.

Die Konfiguration ist bewusst arcade-orientiert: niedriger Roll-Einfluss, hohe Reifenreibung, kurze stabile Federung und gesperrte Kippachsen verhindern Umkippen, während die Yaw-Reaktion vom RaycastVehicle kommt. Es gibt weiterhin keine Drift-, Reifen-, Item-, Bot- oder Multiplayer-Logik.

Im Browser kann über `Alter Controller` und `RaycastVehicle` umgeschaltet werden. Der Wechsel setzt Kart, Controller und Telemetrie zurück. Neue Fahrphysik soll künftig auf dieser Vehicle-Physics-Basis entstehen; am Legacy-Controller wird nur noch auf ausdrücklichen Wunsch gearbeitet.

Bots und Netzwerkinput können später dieselbe `KartInput`-Form wie die Tastatur liefern.
