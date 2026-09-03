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

## Architektur

- `client/src/game/input.ts`: Tastaturinput als austauschbare Inputquelle.
- `client/src/game/kart.ts`: Kart-Platzhalter und Arcade-Fahrlogik.
- `client/src/game/follow-camera.ts`: einfache geglättete Verfolgerkamera.
- `client/src/game/track.ts`: flache Strecke, Boden und Begrenzungswände.

Bots und Netzwerkinput können später dieselbe `KartInput`-Form wie die Tastatur liefern.
