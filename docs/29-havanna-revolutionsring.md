# Havanna-Revolutionsring (Havanna) – dritte spielbare Strecke

**Stand:** 07.10.2026 · **Herkunft:** Name und Ort aus Sarahs Streckenauswahl, unverändert. Route, Abschnitte, Malecón-Welle, Bart-Ministerium, Rednertribüne und alle Satiredetails sind **Claudes Ausarbeitung auf Marcels Auftrag vom 07.10.2026** (keine bestätigten Ideen Sarahs).

**Thema:** Kult der endlosen Rede. Verblasste Pastell-Arkadenhäuser, Königspalmen, geparkte Straßenkreuzer von 1958 („Ersatzteile bestellt“), Hafenfestung mit Leuchtturm, ein Ministerium mit einer riesigen Drahtskulptur aus Bart und Zigarre, eine Rednertribüne mit absurd langem Mikrofonständer. Keine Flaggen, Porträts oder echten Parolen.

## Route (gegen den Uhrzeigersinn, 1 411 m)

| Abschnitt | Fortschritt | Inhalt |
|---|---|---|
| Malecón | 0–410 m | Start 40 m, lange Uferstraße am offenen Meer, offene Kaikante 150–215 m (Bergungsamt) |
| Prado | 410–585 m | Palmenallee, Schubfeld 500 m, Itemreihe 545 m |
| Kapitol-Kreisel | 585–790 m | ca. 270°-Schleife um die Revolutionssäule, engste Stelle der Strecke |
| Altstadtgassen | 790–1 040 m | Wechselkurven mit Senke; **Zigarrenfabrik-Abkürzung** (Schotter) 860→985 m |
| Redner-Hügel | 1 040–1 200 m | Anstieg auf 4 m, Plateau mit Sprungrampe (1 146 m), Bart-Ministerium und Tribüne |
| Rückweg | 1 200–1 411 m | Abfahrt zur Küste und zurück auf den Malecón |

**Streckenereignis (Runde 2):** „Malecón-Welle“ – angesagt per Meldung und Sprecherin, Gischtwand über dem Malecón; 14 s lang kostet das nasse Stück zwischen 95 und 330 m allen Karts gleich viel Tempo und etwas Grip.

## Technik

Module in `art-source/havana_modules.py` (gemeinsames Kit, keine neuen Materialien), Platzierung in `src/city-world.ts` (Thema `havana`), Asphalt/Kaimauer/Randsteine in `src/track-world.ts`. Grand Prix fährt jetzt Stadionring → Duce-Drom → Havanna. Tests: `tests/havanna.test.mjs`.

## Offen

Menschliche Fahr-/Stilprobe; eigener Meeresklang; Wellenereignis für Zeitfahren eventuell abschalten (derzeit gleiche Regeln).
