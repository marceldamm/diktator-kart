# Havanna-Revolutionsring (Havanna) – dritte spielbare Strecke

**Stand:** zweiter Streckenpass 11.10.2026 · **Herkunft:** Name und Ort aus Sarahs Streckenauswahl, unverändert. Route, Abschnitte, Malecón-Welle, Bart-Ministerium, Rednertribüne und Satiredetails sind **Claudes Ausarbeitung auf Marcels Auftrag vom 07.10.2026** (keine bestätigten Ideen Sarahs).

**Thema:** Kult der endlosen Rede. Verblasste Pastell-Arkadenhäuser, Königspalmen, geparkte Straßenkreuzer von 1958 („Ersatzteile bestellt“), Hafenfestung mit Leuchtturm, ein Ministerium mit einer riesigen Drahtskulptur aus Bart und Zigarre, eine Rednertribüne mit absurd langem Mikrofonständer. Keine Flaggen, Porträts oder echten Parolen.

## Route, zweiter Fahrpass (gegen den Uhrzeigersinn, ca. 1 423 m)

| Abschnitt | Fortschritt | Inhalt |
|---|---|---|
| Malecón | 0–410 m | Start 40 m; mehrere weite S-Bögen ersetzen die lange Gerade. Kleine Kaimauer-Rampe bei s=380; offene Kaikante 150–215 m (Bergungsamt) |
| Prado | 410–585 m | Palmenallee, Schubfeld 500 m, Itemreihe 545 m |
| Kapitol-Kreisel | 585–790 m | ca. 270°-Schleife um die Revolutionssäule, engste Stelle der Strecke |
| Altstadtgassen | 790–1 040 m | Wechselkurven mit Senke; **Zigarrenfabrik-Abkürzung** (Schotter) 860→985 m |
| Redner-Hügel | 1 040–1 200 m | Anstieg auf 4 m, Plateau mit Sprungrampe (1 146 m), Bart-Ministerium und Tribüne |
| Rückweg | 1 200–1 423 m | Abfahrt zur Küste und zurück auf den Malecón |

**Kurvenaudit:** Die Annähernd-gerade-Anteile sinken mit der 2-m-Messregel (|Krümmung| < 1/150 m) von 46,1 % auf 26,6 %. Die Rundenlänge steigt nur um rund 11 m. Die neue Küstenkurvenfolge bringt mehrere Richtungswechsel; der engste Radius bleibt mit etwa 14 m im Bereich der bisherigen engsten Stelle.

**Streckenereignis (Runde 2):** Die Malecón-Welle wird im letzten Viertel von Runde 1 angekündigt und startet, sobald das erste Kart auf Runde 2 die Küstenzone erreicht. Ein kurzer Sprühstoß sitzt an der äußeren Meerseite. Für 14 Sekunden verlieren nur geerdete Karts auf der exponierten Meerseiten-Linie etwas Tempo und Lenkgrip; die Mittellinie und die landeinwärts gerichtete Linie bleiben offen. Der maximale rechnerische Tempoverlust über das ganze Zeitfenster beträgt 3,08 m/s; der Lenkeinfluss bleibt begrenzt. Die Wirkung gilt für Spieler und Bots nach derselben Zonenregel.

**Abkürzung und Sprünge:** Die Zigarrenfabrik-Abkürzung bleibt eine feste, kürzere Schotterlinie mit 10,5-m/s-Limit. Neben dem 4-m-Hügel mit Rampe bei s=1.146 m gibt es jetzt einen kleinen flachen Kicker bei s=380 m. Beide behalten eine durchfahrbare Linie; die Hauptstrecke wird nicht dynamisch verändert.

## Technik

Module in `art-source/havana_modules.py` (gemeinsames Kit, keine neuen Materialien), Platzierung in `src/city-world.ts` (Thema `havana`), Asphalt/Kaimauer/Randsteine in `src/track-world.ts`. Grand Prix fährt jetzt Stadionring → Duce-Drom → Havanna. Der Vorher-/Nachher-Grundriss liegt unter `docs/evidence/2026-10-11-havana-pilot/`. Tests: `tests/havanna.test.mjs`.

## Offen

Menschliche Fahr-/Stilprobe; vollständige Zielabnahme der zweiten Rampe; eigener Meeresklang; prüfen, ob das Wellenereignis im Zeitfahren abgeschaltet werden soll (derzeit gleiche Regeln). Die verborgene Runtime-Stichprobe erreichte Runde 2 und zeigte die Eventmeldung; ein vollständiges Drei-Runden-Rennen oder eine menschliche Spielspaßabnahme ist damit nicht belegt.
