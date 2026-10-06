# Redesign 06.10.2026 – Strecke, Stadtbaukasten und Art-System

**Stand:** 06.10.2026 (Claude-Nachtlauf, Arbeitsbranch `claude/team-marcel-redesign-20261006-012236`) · **Auftrag:** [Claude-Masterauftrag](24-claude-overnight-master-prompt.md) · **Basis:** [aktives Projektgrundgerüst](23-project-design-baseline.md)

Dieses Dokument beschreibt, was im Redesign tatsächlich gebaut und im laufenden Spiel geprüft wurde, und wie die neuen Quellen weiterbearbeitet werden. Offene und nicht verifizierte Punkte stehen am Ende.

## Neues Streckenbild (1366 m statt 891 m)

Alle bestehenden Abschnitte, Regeln und Positionen (Kanalsprung, Hafenkai, Ofengrube, Klippe, Krater, Grasrand, Hinterhof-Abkürzung, Boostfelder, Start/Ziel) bleiben unverändert. Der frühere Schlussbogen über das Archiv wurde durch einen neuen **Ostbogen** ersetzt:

| Fortschritt (m) | Abschnitt | Charakter |
|---|---|---|
| 0–182 | Stadiongerade | Tribünenreihen beidseitig, Zielportal mit Uhr, Staatsfernsehen-Wand, Blütenkonfetti |
| 182–300 | Palastschwung | Palast mit Kuppel als Fernziel im Norden, Park innen |
| 300–445 | Park-Esses | Lindenhaine, Zypressen, Statuen/Brunnen |
| 445–545 | Westboulevard | geschlossene Gründerzeitfassaden, Triumphtor über der Fahrbahn |
| 545–842 | Brunnenhaarnadel, Ministerium, Archiv | Stadtquartier, zweite Reihe als höhere Blöcke |
| **842–990** | **Spree-Kai (neu)** | langer Linksschwung, offene Wasserkante rechts (neue Gefahr wie der Hafenkai), Ufermauer, Brücken, Dom jenseits des Flusses |
| **990–1112** | **Prachtallee (neu)** | breite Allee mit Linden und großen Attikahäusern, Boostfeld |
| **1112–1188** | **Säulen-Haarnadel (neu)** | Haarnadel um die „Säule der Eitelkeit“ (vergoldete Allegorie mit Handspiegel), Eckturmhäuser außen |
| **1188–1302** | **Tiergarten-Esses (neu)** | Parkschikanen, Boostfeld am Ausgang |
| **1302–1366** | **Zielkurve (neu)** | enge Kurve auf die Stadiongerade, Tribünen |

Engster Radius ca. 10 m (alt: 10,9 m). Mindestabstand zwischen getrennten Streckenteilen 28 m. Bot-Simulation: fünf Bots beenden drei Runden ohne Teleport; Driftbot-Test auf der Tiergarten-Kurve (s = 1210).

## Stadtbaukasten statt Einzelwelt

- **Quelle:** `art-source/build_city_kit.py` → `art-source/city-kit.blend` → `.tools/raw-models/city-kit.glb` → `node art-source/optimize_assets.mjs city-kit` → `public/assets/models/city-kit.glb`. Bauzeit ca. 2 s statt ca. 70 min für die alte `stadium-world`.
- **28 Module:** vier Gründerzeit-Häusertypen (Mansarde/Gauben, Erker mit geschwungenem Giebel, schmales Giebelhaus mit Läden, Attika mit Kolossalpilastern), Eckturm mit Kupferhaube, Palast mit Portikus und Kuppel, Dom, Säule der Eitelkeit, Tribünenmodul mit Publikum, Triumphtor mit Quadriga-Allegorie, Zielportal mit Uhr und Schachbrettband, Bogenbrücke, Kaimauer, drei Blocktypen für die zweite Reihe, Laterne, Bank, Litfaßsäule, Fahne, Kiosk, Urne, Hecke, Linde, Zypresse, Brunnen, Reiterallegorie, Poller.
- **Art-System:** gemeinsame Palette und 20 Kit-Materialien (Kalkputz pro Gebäude eingefärbt, Sandstein/Kalkstein/Rustika, Schiefer, Kupferpatina, Zink, Fensterglas, Sprossen, grünes Eisen, Messing/Gold, Stoff, Bannerstoff, Holz, Laub, Rinde, Laternenglas, Wasser, Publikum). Vertexfarben tragen Sockelverschmutzung, Markisenstreifen, Plakate und Tonvariation; die Laufzeit legt gemeinsame Stein-, Putz-, Stoff- und Laubstrukturen darüber. Keine historischen Hoheitszeichen; Banner zeigen das eigene Paragraph-Lorbeer-Emblem.
- **Laufzeit:** `src/city-world.ts` setzt die Module deterministisch nach Bezirken entlang der Mittellinie, prüft Fahrkorridor, Promenade, Gefahrenbecken, Abkürzung, Videowand, Tor und bereits belegte Flächen und fasst alles pro Material und 260-m-Kachel zu statischen Meshes zusammen (246 Meshes, ca. 1,5 Mio. Dreiecke). Die Spree liegt als Wasserfläche mit Bett, Ufermauern und Brücken südlich des Kai-Schwungs; der Stadtboden lässt dafür eine Lücke.
- Die alte `public/assets/models/stadium-world.glb` wird nicht mehr geladen und wurde aus dem Laufzeitordner entfernt (in der Git-Historie und als `stadium-world.blend`/`build_world.py` weiter vorhanden, historisch).

## Hitler samt Kart (erster Qualitätsanker, Zwischenstufe)

`art-source/build_kart.py` (Abschnitt „Redesign 06.10.2026: Hitler quality anchor“) ergänzt im gemeinsamen Rig:

- `body-grandprix`: individueller Grand-Prix-Wagen der 1930er – langer Bug mit Lamellen und Lederriemen, hoher schmaler Kühler mit Goldlamellen, Kühlerverschluss und Lorbeer-Löwen-Plakette, Orgelpfeifen-Seitenauspuff, Windschott, Leder-Cockpitrand, Kopfstützenverkleidung, Bootsheck mit Nieten, Goldzierlinien, leere Elfenbein-Startnummernscheiben. Räder, Kotflügel, Sitz, Lenkung und alle Laufzeitknoten bleiben der gemeinsame Vertrag.
- Fahrer: zivile Jacke mit Revers, Hemd und Krawatte (`cast-hitler-jacket`), kompakter nasenbreiter Zweifingerbart direkt unter der Nase (`cast-hitler-tache`), längere gerade Nase (`cast-hitler-nose`), schwere gerade Brauen und Lidfalte (`cast-hitler-brows`), schmalerer Kiefer, tiefere Augenhöhlen. Keine Mütze (Seitenscheitel und Stirnlocke tragen die Erkennung), keine Paradewimpel, keine Armbinde, keine Abzeichen. Kopfskala 0,7 statt 0,82 (erwachsenere Proportion, nur dieser Anker).

Laufzeit geprüft in Fahrerwahl, Rennen und Nahansicht (siehe Belege). Das ist eine erkennbare stilisierte Karikatur, **noch kein realitätsnahes Porträt** im Sinne der Grundpfeiler.

## Licht, Effekte, Ton

- Wärmeres Spätnachmittagslicht (Sonne 3,9, Farbe 1/0,77/0,5), goldener Dunst (Exp2 0,0024), wärmeres Bodenlicht, Fluss mit animierter Wellennormalen.
- Blütenkonfetti in Rot und Gold über der Stadiongeraden (max. 260 Partikel).
- Motor: neuer synthetischer Achtzylinder-Rennmotor (`art-source/build_engine.mjs` → `public/assets/audio/motor.wav`), phasengekoppelte Zündimpulse durch zwei Auspuffresonatoren, Kurbelwellen-Brummen, Ventiltrieb und Ansaugrauschen; nahtlose 2-s-Schleife, Pegel an den alten Loop angeglichen (RMS 0,25 statt 0,27), Drehzahl/Gangwechsel weiter aus `src/audio.ts`. **Nicht menschlich angehört.**

## Offen und nächste Schritte

1. Hitler-Gesicht wirklich realitätsnah: höher aufgelöster Kopf (eigene Skulptur oder frei lizenzierte Basismesh mit dokumentierter Lizenz), Hautshading, Augenpartie; Hände/Arme weniger kantig. Danach gleicher Pass für die übrigen fünf Fahrer.
2. Seitenwände der Reihenhäuser an Reihenenden (Brandwände) mit Gliederung, Bäume weiter verfeinern oder Instanzen des CC0-Parkbaums nutzen, Laternen des Track-World-Systems an den Kit-Stil angleichen.
3. Höhenprofil (z. B. Brückenbuckel am Spree-Kai) ist nicht umgesetzt: Fahrbahn, Physik und Welt sind weiterhin eben bis auf Rampen/Bodenwelle.
4. Hörabnahme Motor/Mix; materialabhängige Reifen-/Wasser-/Publikumsklänge sind unverändert.
5. Performance nur auf Marcels RTX-3070-Laptop gemessen (siehe PROGRESS-LOG); schwache Geräte offen.
