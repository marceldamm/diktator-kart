# Duce-Drom (Rom) – zweite spielbare Strecke

**Stand:** 07.10.2026 · **Herkunft:** Streckenname und Ort stammen unverändert aus Sarahs Streckenauswahl („Duce-Drom (Rom)“). Route, Abschnittsnamen, Wahrzeichen, Ereignis und Satiredetails sind **Claudes eigene Ausarbeitung auf Grundlage von Marcels Auftrag vom 06./07.10.2026**, keine bestätigten Ideen Sarahs.

## Warum diese Strecke zuerst

- **Projektumfang:** Mussolini gehört bereits zum Kader; die vorhandene Weltpipeline (Kopfsteinpflaster, Stadionmodule, Fluss/Kai, Rampen, Abkürzung) lässt sich mit eigenen römischen Modulen glaubwürdig umdeuten.
- **Referenzlage:** Rom bietet gut belegte, allgemein bekannte Bautypen (Circus-Rennbahn mit Obelisk, Triumphbögen, Aquädukte, Forum-Ruinen, Schirmpinien, ockerfarbene Palazzi, Tiber-Kai, Kuppelkirche). Machtinszenierung („Balkonreden“, Prunkstraßen, Marmorpathos) lässt sich satirisch zeigen, ohne Regimezeichen zu verwenden.
- **Streckenpotenzial:** Rennbahn-Gerade, enge Meta-Kehre, Hügel mit Serpentine und Plateau, Abfahrt zum Wasser und eine lange Prunkstraße ergeben einen deutlich anderen Rhythmus als der Stadionring.

## Route (gegen den Uhrzeigersinn, 1 238 m)

| Abschnitt | Fortschritt | Inhalt |
|---|---|---|
| Circus-Gerade | 0–262 m | Start/Ziel bei 52 m, Tribünen beidseitig, Schubfeld, Itemreihe bei 150 m |
| Meta-Kehre | 262–455 m | weiter Linksbogen um den Obelisken (eigenes Modul); innen die **Stallgasse** als Abkürzung |
| Aventin-Serpentine | 455–600 m | engste Kurven der Strecke, Anstieg auf 6 m mit Stützmauern und Brüstung |
| Belvedere | 600–652 m | Plateau mit Schubfeld und **Belvedere-Sprung** (Rampenkante 646 m) |
| Abfahrt | 652–737 m | Gefälle zurück auf Straßenniveau, Itemreihe bei 705 m |
| Tiber-Kai | 748–830 m | offene Kaikante rechts (Wasserbecken, Bergungsamt), Tiber und Kuppelkirche dahinter |
| Forum-Bogen | 838–1 000 m | Ruinen, Statuen, Insulae; Schubfeld 860 m links |
| Prunkstraße | 1 000–1 180 m | Balkonpalast (rechts), Triumphbogen bei 1 050 m, Bodenwelle 1 120 m, Itemreihe 1 005 m |
| Kolosseumskehre | 1 180–1 238 m | enge Linkskehre zurück auf die Circus-Gerade |

**Risiko-/Abkürzungsentscheidung:** Die Stallgasse (Schotter, 3 m halbe Breite) verbindet 270 m mit 452 m auf deutlich kürzerem Weg, deckelt das Tempo aber ohne Mini-Turbo auf 10,5 m/s. Mit Turbo lohnt sie sich, ohne Turbo ist sie knapp. Bot 4 nimmt sie wie auf dem Stadionring nach denselben Regeln.

**Streckenereignis:** In Runde 2 hält der leere Balkon seine „Rede“: Ansage im HUD, Publikumsjubel und ein dichter Rosenblätterregen über der Prunkstraße. Rein visuell, für alle gleich, verdeckt Fahrbahn und Rangliste nicht.

## Welt

Neue editierbare Blender-Module in `art-source/rome_kit_modules.py` (gebaut über `build_city_kit.py`, gemeinsame Materialien, gleiche Laufzeitdatei `city-kit.glb`): drei Insula-Typen (Arkaden-Erdgeschoss, Loggia, Palazzo mit Bossenecken, Terrakotta-Walmdach, Fensterläden), Balkonpalast (leeres Rednerpult, Lautsprechertrichter, leeres Tuch), Triumphbogen (eine Öffnung, Säulenpaare, Attika mit satirischer Inschrift „SENATVS POPVLVSQVE APPLAVDENS“), Obelisk, zwei Schirmpinien, Aquädukt-Segment, Forum-Ruine. Laufzeitplatzierung in `src/city-world.ts` über die Bezirke der Streckendefinition (`src/track-layout.ts`). Keine Rutenbündel, Staatsadler oder sonstigen Regimezeichen; Embleme sind die vorhandenen fiktiven Lorbeer-/Paragraphenmotive.

## Technik

- Beide Strecken sind Daten in `src/track-layout.ts`; `selectTrack()` in `src/track.ts` schaltet Mittellinie, Abkürzung, Gefahren, Höhenprofil, Items und Weltbezirke um. Beim Wechsel baut das Spiel die Szene neu (Ladebildschirm mit Streckenname).
- Höhenprofil ist jetzt eine allgemeine Keyframe-Liste (Stadionring: unveränderte Prachtallee-Kuppe).
- Bestzeit, beste Runde und Geist werden pro Strecke gespeichert; die Stadionring-Schlüssel bleiben gleich, vorhandene Bestzeiten bleiben erhalten.

## Offen

Menschliche Fahr- und Stilabnahme, Messung auf Intel UHD, eigener Ton für die Balkonrede (derzeit Jubel), eigene Bodentextur jenseits des gemeinsamen Kopfsteinpflasters.

## Themenpass 07.10.2026 (Marcels Rückmeldung „mehr themenbasiert“)

Der Duce-Drom ist jetzt die selbstgebaute Rennbahn eines eitlen Diktators: Travertinplatten statt Berliner Kopfsteinpflaster, ein Marmorstadion mit Zuschauerterrassen an Start/Ziel und rund um die Meta-Kehre, auf den Terrassen identische übergroße Athleten (alle mit demselben kahlen Kopf und Kinn), ein Würfel-Arkadenpalast mit Pathos-Inschrift („Ein Volk von Poseuren · Balkonrednern · Bauherren · Beifallspflichtigen“ – freie Satire, kein Originalzitat), eine Bürofassade mit Kolossalkopf, rationalistische Travertinblöcke und Kolonnaden an der Prunkstraße, schwarz-weiße Randsteine und Travertinbrüstungen mit Bronzeband, Banner „MEHR MARMOR BITTE“. Quellen: `art-source/rome_monuments.py`; Belege `docs/evidence/rome2-*-20261007.png`. Die Route blieb gleich, weil sie bereits eine eigene Streckenführung ist (siehe Tabelle oben).
