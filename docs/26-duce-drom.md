# Duce-Drom (Rom) – zweite spielbare Strecke

**Stand:** 07.10.2026 · **Herkunft:** Streckenname und Ort stammen unverändert aus Sarahs Streckenauswahl („Duce-Drom (Rom)“). Route, Abschnittsnamen, Wahrzeichen, Ereignis und Satiredetails sind **Claudes eigene Ausarbeitung auf Grundlage von Marcels Auftrag vom 06./07.10.2026**, keine bestätigten Ideen Sarahs.

## Warum diese Strecke zuerst

- **Projektumfang:** Mussolini gehört bereits zum Kader; die vorhandene Weltpipeline (Kopfsteinpflaster, Stadionmodule, Fluss/Kai, Rampen, Abkürzung) lässt sich mit eigenen römischen Modulen glaubwürdig umdeuten.
- **Referenzlage:** Rom bietet gut belegte, allgemein bekannte Bautypen (Circus-Rennbahn mit Obelisk, Triumphbögen, Aquädukte, Forum-Ruinen, Schirmpinien, ockerfarbene Palazzi, Tiber-Kai, Kuppelkirche). Machtinszenierung („Balkonreden“, Prunkstraßen, Marmorpathos) lässt sich satirisch zeigen, ohne Regimezeichen zu verwenden.
- **Streckenpotenzial:** Rennbahn-Gerade, enge Meta-Kehre, Hügel mit Serpentine und Plateau, Abfahrt zum Wasser und eine lange Prunkstraße ergeben einen deutlich anderen Rhythmus als der Stadionring.

## Route, zweiter Fahrpass (gegen den Uhrzeigersinn, ca. 1 367 m)

| Abschnitt | Fortschritt | Inhalt |
|---|---|---|
| Circus-Gerade | 0–262 m | Start/Ziel bei 52 m, Tribünen beidseitig, Schubfeld und Itemreihe bei 150 m; bleibt der schnelle Auftakt |
| Meta-Kehre | 262–455 m | engerer Richtungswechsel um den Obelisken; innen die **Stallgasse** als feste Abkürzung |
| Aventin-Switchbacks | 455–665 m | wechselnde Links-/Rechtslinien auf den Hügel, kurzer Zwischensattel und zweiter Anstieg |
| Belvedere | 665–720 m | 6-m-Plateau mit dem großen **Belvedere-Sprung** (Rampenkante 700 m) |
| Abfahrt / Tiber-Anfahrt | 720–835 m | schnelle Abfahrt und Folge enger werdender Bögen |
| Tiber-Kai | 835–960 m | offene Kaikante rechts, Bootsbecken und Kuppelkirche; kleiner zweiter Rampenkicker bei 850 m, sichere Innenlinie neben dem Wasser |
| Forum-Bogen | 960–1 100 m | Ruinen, Statuen, Insulae, wechselnde Bögen; Balkonpalast beginnt am Abschnittseingang |
| Prunkstraße | 1 100–1 260 m | S-Kurve unter dem Triumphbogen, Bodenwelle und Itemreihe; Rosenwirbel-Ereignis in der zweiten Runde |
| Kolosseumskehre | 1 260–1 367 m | enger Einlenkbogen zurück auf die Circus-Geraden |

**Kurvenaudit:** Annähernd gerade Anteile sinken mit der bisherigen 2-m-Messregel (|Krümmung| < 1/150 m) von 55 % auf 38 %. Die Runde wächst um rund 10 %; die genaue Zielfahrt und Balance müssen noch menschlich beurteilt werden.

**Risiko-/Abkürzungsentscheidung:** Die abgesenkte Stallgasse (Schotter, 3,2 m halbe Breite) verbindet 270 m mit 452 m auf deutlich kürzerem Weg und deckelt das Tempo ohne Turbo auf 11,5 m/s. Ein Booststreifen liegt im Tunnel; Fahrer entscheiden zwischen risikoreicherem Schub und freier Hauptlinie. Bot 4 nutzt den Weg wie zuvor.

**Streckenereignis:** Die Balkonrede wird vor Runde 2 angekündigt und startet, sobald ein Kart das Balkonviertel der zweiten Runde erreicht. Für 14 Sekunden bremst der Rosenwirbel die Mittellinie; beide Außenlinien bleiben frei. HUD, Jubel und sichtbarer Blütenregen begleiten dieselbe Wirkung für Spieler und Bots. Das Ereignis ist jetzt spielwirksam und zeitlich an den Streckenabschnitt gebunden.

## Welt

Neue editierbare Blender-Module in `art-source/rome_kit_modules.py` (gebaut über `build_city_kit.py`, gemeinsame Materialien, gleiche Laufzeitdatei `city-kit.glb`): drei Insula-Typen (Arkaden-Erdgeschoss, Loggia, Palazzo mit Bossenecken, Terrakotta-Walmdach, Fensterläden), Balkonpalast (leeres Rednerpult, Lautsprechertrichter, leeres Tuch), Triumphbogen (eine Öffnung, Säulenpaare, Attika mit satirischer Inschrift „SENATVS POPVLVSQVE APPLAVDENS“), Obelisk, zwei Schirmpinien, Aquädukt-Segment, Forum-Ruine. Laufzeitplatzierung in `src/city-world.ts` über die Bezirke der Streckendefinition (`src/track-layout.ts`). Keine Rutenbündel, Staatsadler oder sonstigen Regimezeichen; Embleme sind die vorhandenen fiktiven Lorbeer-/Paragraphenmotive.

## Technik

- Beide Strecken sind Daten in `src/track-layout.ts`; `selectTrack()` in `src/track.ts` schaltet Mittellinie, Abkürzung, Gefahren, Höhenprofil, Items und Weltbezirke um. Beim Wechsel baut das Spiel die Szene neu (Ladebildschirm mit Streckenname).
- Höhenprofil ist jetzt eine allgemeine Keyframe-Liste (Stadionring: unveränderte Prachtallee-Kuppe).
- Bestzeit, beste Runde und Geist werden pro Strecke gespeichert; die Stadionring-Schlüssel bleiben gleich, vorhandene Bestzeiten bleiben erhalten.

## Offen

Der zweite Fahrpass wurde technisch, automatisiert und mit einer kurzen Runtime-Stichprobe geprüft. Offen bleiben Marcels menschlicher Fahr- und Stilabnahme, ein vollständiger Lauf bis zur Balkonrede der zweiten Runde, Messung auf Intel UHD, ein eigener Ton für die Balkonrede (derzeit Jubel) und eine eigene Bodentextur jenseits des gemeinsamen Kopfsteinpflasters. Die kurze Stichprobe belegt weder vollständige Rennbalance noch FPS oder menschliches Fahrgefühl.

## Themenpass 07.10.2026 (Marcels Rückmeldung „mehr themenbasiert“)

Der Duce-Drom ist jetzt die selbstgebaute Rennbahn eines eitlen Diktators: Travertinplatten statt Berliner Kopfsteinpflaster, ein Marmorstadion mit Zuschauerterrassen an Start/Ziel und rund um die Meta-Kehre, auf den Terrassen identische übergroße Athleten (alle mit demselben kahlen Kopf und Kinn), ein Würfel-Arkadenpalast mit Pathos-Inschrift („Ein Volk von Poseuren · Balkonrednern · Bauherren · Beifallspflichtigen“ – freie Satire, kein Originalzitat), eine Bürofassade mit Kolossalkopf, rationalistische Travertinblöcke und Kolonnaden an der Prunkstraße, schwarz-weiße Randsteine und Travertinbrüstungen mit Bronzeband, Banner „MEHR MARMOR BITTE“. Quellen: `art-source/rome_monuments.py`; Belege `docs/evidence/rome2-*-20261007.png`. Die Route blieb gleich, weil sie bereits eine eigene Streckenführung ist (siehe Tabelle oben).
