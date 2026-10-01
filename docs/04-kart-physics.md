# Kart-Physik

## Aktueller Stand

`RaycastKartController` ist der Standardcontroller und basiert auf Ammo `btRaycastVehicle`. Der frühere `KartController` bleibt als Legacy- und Vergleichsmodell erhalten.

Ammo verwaltet Chassis, vier Raycast-Räder, Federung, Kontakt und Kollisionen. Die kleine Arcade-Schicht steuert Kraftaufbau, Lenkwinkel, Gripzustand und Dämpfung; sie setzt niemals Heading oder Position künstlich.

## Geometrie und Normalfahrt

- PlayCanvas-Forward ist lokales `-Z`; Ammo verwendet `setCoordinateSystem(0, 1, 2)`.
- Vorderräder 0/1 lenken, Hinterräder 2/3 erhalten Motorforce.
- Der Radstand beträgt 1,64, Spurbreite 1,56; alle Connection Points sind symmetrisch.
- X/Z-Rotation bleibt gesperrt, Yaw ist physikalisch frei.
- `RAYCAST_KART_TUNING` gruppiert `chassis`, `engine`, `braking`, `steering`, `suspension`, `grip`, `hop`, `drift` und `wheels`.

Motorleistung fällt vor der Höchstgeschwindigkeit weich ab; nur deutliches Überschreiten aktiviert eine physikalische Schutzbremse. Normaler Grip ist bewusst stabil und leicht untersteuernd. S bremst bei Vorwärtsfahrt zuerst und fährt erst nahe Stillstand rückwärts.

## Hop, Drift und Mini-Turbo

`KartInput` ist eingabequellenunabhängig und enthält `steering`, `throttle`, `hop` (einmaliges Druckereignis) und `drift` (gehaltene Aktion). Damit bleiben Human-, Bot- und Netzwerkinput später austauschbar.

- W/oben beschleunigt, S/unten bremst bzw. fährt rückwärts, A/D lenken.
- Space kurz gibt beim Bodenkontakt einen kleinen vertikalen Physikimpuls. Cooldown und Bodenprüfung verhindern Spam.
- Space während des Hops halten und gleichzeitig A/D drücken startet Drift.
- Im Drift sinkt der Hinterachsgrip kontrolliert, vorne bleibt mehr Seitenführung, der effektive Lenkwinkel steigt leicht und die Yaw-Dämpfung wird weicher. Beim Loslassen blendet Normalgrip wieder ein.
- Nach mindestens 0,7 Sekunden Drift gibt das Loslassen einen kurzen, moderaten Mini-Turbo. Es gibt noch keine Mehrstufen-Funken.

## Telemetrie und Tests

HUD und Browser-Log zeigen Hop/Drift/Mini-Turbo, Wheel-Steering, EngineForce, BrakeForce, Forward-/Lateral-/Planar-Speed, `angularY` und Heading.

`npm run test:kart` startet bei Bedarf Vite und steuert lokales Chrome per CDP ohne neue Browserdependency. Die Suite testet Geradeausfahrt, Links/Rechts, Bremsen, Reverse, Hop, Drift links/rechts mit Ausklang und Ausrollen.

## Architektur

- `input.ts`: gemeinsames Eingabemodell
- `kart.ts`: Platzhalter und Legacy-Controller
- `raycast-kart.ts`: aktueller Arcade-RayCast-Controller
- `telemetry-log.ts` / `debug-hud.ts`: technische Messung
- `tools/cdp-kart-test.mjs`: lokale Browserautomation

Drift ist jetzt Teil des Prototyps. Items, Bots und Multiplayer bleiben außerhalb dieser Phase.
