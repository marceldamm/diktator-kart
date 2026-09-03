# Kart-Physik

## Aktueller Stand

Der Standardcontroller ist `RaycastKartController` auf Basis von Ammo `btRaycastVehicle`. Der frühere `KartController` bleibt unverändert als Legacy- und Vergleichsmodell erhalten und kann im Browser weiterhin ausgewählt werden.

Das Ziel ist ein stabiles Arcade-Kart, keine realistische Fahrzeugsimulation. Ammo übernimmt Chassis, vier Raycast-Räder, Federung, Reifenkontakt und Kollisionen. Eine kleine kontinuierliche Arcade-Schicht steuert Motoraufbau, geschwindigkeitsabhängigen Lenkwinkel und Yaw-Dämpfung.

## Geometrie und Achsen

- PlayCanvas-Forward des Karts ist lokales `-Z`.
- Ammo verwendet `setCoordinateSystem(0, 1, 2)` mit X rechts, Y oben und Z als Fahrzeugachse.
- Deshalb ist positive Vorwärtseingabe als negative Ammo-Motorforce abgebildet.
- Räder 0/1 bilden die Vorderachse und erhalten Steering.
- Räder 2/3 bilden die Hinterachse und erhalten Motorforce.
- Der Radstand beträgt 1,64 Einheiten, die Spurbreite 1,56 Einheiten.
- Die Connection Points sind links/rechts und vorne/hinten symmetrisch.
- X/Z-Rotation des Chassis ist gesperrt; Yaw bleibt physikalisch frei.

## Arcade-Fahrmodell

Die zentralen Werte liegen gruppiert in `RAYCAST_KART_TUNING`:

- `chassis`: Masse sowie lineare und winkelbezogene Dämpfung
- `engine`: Vorwärts-/Rückwärtskraft, Kraftaufbau und Geschwindigkeitsbereich
- `braking`: Betriebsbremse, Handbremse und Richtungswechsel
- `steering`: Lenkwinkel, Aufbau, Rücklauf und High-Speed-Reduktion
- `suspension`: Radius, Federweg, Steifigkeit und Dämpfung
- `grip`: Vorder-/Hinterachsgrip und Roll-Einfluss
- `wheels`: gemeinsame Radgeometrie

Die Chassismasse und Motorforce verwenden eine fahrzeugtypische gemeinsame Größenordnung. Der alte Zustand mit Masse 1,2 und bis zu 360 Motorforce pro Hinterrad führte zu extremen Beschleunigungs- und Yaw-Spitzen.

Die Höchstgeschwindigkeit wird nicht mehr durch permanentes hartes Überschreiben der linearen Geschwindigkeit erzwungen. Stattdessen fällt die Motorleistung vor dem Zieltempo weich ab; nur deutliches Überschreiten aktiviert eine zusätzliche physikalische Bremswirkung.

Der tatsächliche Vorderrad-Lenkwinkel wird geglättet und bei höherem Tempo progressiv reduziert. Die Yaw-Dämpfung geht kontinuierlich zwischen Geradeaus- und Kurvenzustand über. Es gibt keinen Teleport, kein manuell gesetztes Heading und kein hartes Nullsetzen der Winkelgeschwindigkeit während normaler Fahrt.

Die Hinterachse besitzt etwas mehr Seitenführung als die Vorderachse. Dadurch tendiert das Kart bei normaler Fahrt leicht zum stabilen Untersteuern statt zum spontanen Übersteuern. Ein echtes Drift-System ist noch nicht implementiert.

## Eingabe

`KartInput` ist unabhängig von der Eingabequelle und enthält:

- `steering`: -1 bis +1
- `throttle`: -1 bis +1
- `handbrake`: boolean

Die Tastaturbelegung lautet:

- W/Pfeil hoch: beschleunigen
- S/Pfeil runter: zunächst bremsen, nahe Stillstand rückwärts
- A/Pfeil links und D/Pfeil rechts: lenken
- Space: Handbremse/Festbremse

Die Handbremse unterdrückt Motorleistung, bremst alle vier Räder stark und hält das Kart im Stillstand. Sie ist noch kein Driftbutton.

## Telemetrie und Tests

HUD und Browser-Log zeigen reale Controller- und Physikwerte, darunter Handbremse, tatsächlichen Wheel-Steering-Wert, EngineForce, BrakeForce, Forward-/Lateral-/Planar-Speed, `angularY`, Heading und Driftindikator.

`tools/cdp-kart-test.mjs` startet bei Bedarf Vite und steuert einen lokal installierten Chrome ohne zusätzliche Browserdependency über Chrome DevTools Protocol. Die reproduzierbare Suite umfasst Geradeausfahrt, kurze und gehaltene Links-/Rechtskurven, Kurvenausgang, Betriebsbremse, Reverse, Handbremse, W+Space und Ausrollen.

Start aus `client/`:

```bash
npm run test:kart
```

Temporäre Chrome-Profile werden außerhalb des Repositorys erzeugt und nach dem Test entfernt. Testlogs und Browserprofile werden nicht committed.

## Architektur

- `client/src/game/input.ts`: gemeinsames Inputmodell und Tastaturquelle
- `client/src/game/kart.ts`: Kart-Platzhalter und Legacy-Controller
- `client/src/game/raycast-kart.ts`: aktueller Arcade-RayCast-Controller
- `client/src/game/debug-hud.ts`: Live-Debuganzeige
- `client/src/game/telemetry-log.ts`: Telemetrieaufzeichnung
- `client/src/game/follow-camera.ts`: geglättete Verfolgerkamera
- `tools/cdp-kart-test.mjs`: lokale Browser-Testautomation

Bots und Netzwerkinput sollen später dieselbe `KartInput`-Struktur liefern. Drift, Items, Bots und Multiplayer sind noch nicht Bestandteil der Fahrphysik.
