# Editierbare Art-Pipeline des Stadion-Slices

## Schäferhund reproduzieren

Mit vorhandenem Blender: --background --python art-source/build_shepherd.py; danach node art-source/optimize_assets.mjs shepherd. .blend behält bewegliche Gelenke. node art-source/build_shepherd_audio.mjs erzeugt den eigenen Doppelbelllaut. GlTF-Optimierung mit Einzelmodellaufruf erhält jetzt vorhandene andere Modellmessungen statt sie zu überschreiben.

Stand 03.10.2026. Alle Kart-, Gebäude-, Requisiten- und Itemmodelle sind originale Projektgeometrie. Der Parkbaum stammt von Poly Haven (CC0); Herkunft, Audio und Texturen stehen in `../public/assets/CREDITS.md`.

## Quellen und Laufzeit (Qualitätsstufe 2)

- Früher Ladebildschirm: `loading-stadium-v1.png` → `public/assets/textures/loading-stadium-v1.webp`. Eigenständige Imagegen-Konzeptillustration in G/J-Richtung; Motivauftrag und Nutzungsgrundlage in `loading-stadium-v1.md`. Nur Ladehintergrund, keine 3D-Spielgrafik. HTML-UI separat editierbar in `index.html`.

- `build_kart.py` → `hero-kart.blend`/GLB: Kart, Fahrer und Varianten. Laufzeitvertrag: `wheelPivot-0..3`, `wheelSpin-0..3`, `steeringWheel`, `driverPose`, `headPose`, `scarfFlap` (Umhang), `variant-*` (Anbauten), `cast-*` (Mützen, Frisuren, Gesichter). Die beiden `variant-parade`-Wimpel tragen ein originales eigenständiges Adlerrelief. Umgefärbte Materialien: `Petrol enamel`, `Uniform racing suit`, `Cape cloth`, `Hat cloth`. Besetzung in `src/cast.ts`.
- `build_world.py` → `stadium-world.blend`/GLB: Palast, Tor, Zielbrücke, Tribünen, Häuser, Park, Bahnhof, Stadtring. Liest `track-layout.json`.
- `export_track.mjs` → `track-layout.json`: Mittellinie aus `src/track-layout.ts`. Nach jeder Streckenänderung zuerst ausführen, dann `build_world.py`.
- `decimate_tree.py`: leichtere Laufzeitkopie des CC0-Baums aus `park-tree.blend` (Quelle unverändert).
- `build_voices.mjs` → `public/assets/audio/voice/*.wav`: Sprecherin und Fahrerstimmen mit Piper TTS (MIT; Windows-Binary und Stimmen unter `.tools/piper/`, nicht in Git; Download: https://github.com/rhasspy/piper/releases/tag/2023.11.14-2 und https://huggingface.co/rhasspy/piper-voices). Texte im Skript.
- `build_audio.mjs`: um Publikum und Bandenschleifen ergänzt. `build_items.py`: unverändert. Der frühere Weltteil von `build_slice.py` und `build_props.py` sind abgelöst (Git-Historie bis `5f14a2d`).
- Streckenmöbel (Fahrbahn, Randsteine, Banden, Promenaden, Laternen, Banner, Wimpel) entstehen zur Laufzeit in `src/track-world.ts` aus derselben Mittellinie.

Blender 4.5.3 LTS (kostenlos, portabel unter `.tools/`, nicht in Git).

## Reproduktion mit PowerShell aus dem Projektordner

```powershell
node art-source/export_track.mjs
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background --python art-source/build_world.py
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background --python art-source/build_kart.py
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background art-source/park-tree.blend --python art-source/decimate_tree.py
node art-source/optimize_assets.mjs
npm run build
```

`optimize_assets.mjs` akzeptiert optional Modellnamen (z. B. `node art-source/optimize_assets.mjs hero-kart`). Unter Windows darf kein Browser die GLB gerade geöffnet halten, sonst schlägt das Schreiben fehl.

## Externe Quelldaten

`prepare_tree.py` erwartet den offiziellen Tree-Small-02-glTF-Download mit 1K-Karten unter `.tools/tree-source/tree.gltf` samt Binärdatei/Texturen. Ein neuer Download ist nur bei erneuter Reduktion erforderlich; die gespeicherte `.blend` enthält bereits die reduzierte Geometrie und gepackte Karten. Ursprünglich 2.062.487, reduziert 134.998 Dreiecke. Getrennte Laub-/Holzbearbeitung erhält die Baumkrone.

Der aktuelle Himmel verwendet die offizielle Tonemapped-JPG-Variante von Poly Haven als 4K/2K-Panorama. Die frühere Imagegen-Datei wird nicht mehr geladen. Beide Varianten sind Texturen innerhalb der tatsächlichen 3D-Szene; G–L wurde nicht als Textur übernommen.

## Prüfung

Artassets im laufenden Spiel mit C (nah/fern/Fahrer) und V (Foto) prüfen. V pausiert die Simulation, zeigt aber dieselbe Babylon-Szene; keine externe Konzeptdarstellung. `tests/slice-browser.mjs`, `slice-race.mjs`, `slice-items.mjs` und `slice-touch.mjs` nutzen einen isolierten Chrome-CDP-Testbrowser auf Port 9223; Vite auf 4173. Nicht gleichzeitig auf dieselbe Browserseite ausführen. Der normale Launcher braucht diese Testwerkzeuge nicht.

Die neutralen Gesichter, Zubehörvarianten und Zuschauersilhouetten sind vorläufige Artassets. Historische Charakterwahl, Sarahs Ideen, Hörqualität und G–L-Stilabnahme bleiben gesondert zu prüfen.

**Bildziel (Marcel, 04.10.2026):** [Ladebildreferenz](../docs/evidence/loading-real-progress.png) ist ein Qualitätsmaßstab für modellierte Fahrer/Karts, räumliche Stadionarchitektur, Boden- und Wasserreaktion, Partikel sowie Licht. Sie wird eigenständig in echten Rennassets umgesetzt; keine Bildkomposition, konkreten Figuren oder Regimezeichen kopieren. Aktuelle Einzelpakete und Status stehen in [CURRENT-WORKLIST.md](../CURRENT-WORKLIST.md).

Weitere editierbare Straßenmöbel/Adler und eigene Plakatgrafiken: src/period-details.ts; fünf nach Material zusammengefasste Laufzeitmeshes.

**04.10.2026:** `node art-source/build_march.mjs` erzeugt den eigenen Stadionmarsch (`public/assets/audio/march.wav`). `build_kart.py` enthält die schaltbaren Karikaturteile des Startkaders (`cast-sidepart`, `cast-toothbrush`, `cast-swept`, `cast-walrus`, `cast-pipe`, `cast-chin`, `cast-maohair`, `cast-undercut`, `cast-patrol`, `cast-cigar`, `cast-shorthair`, `cast-medals`, `cast-epaulettes`, `cast-collartabs`); danach `node art-source/optimize_assets.mjs hero-kart`.

**04.10.2026 (Fahrer-/Fahrzeug-Masterpass, erste Zwischenstufe):** `build_kart.py` enthält sechs unterschiedlich geformte Schädelprofile am gemeinsamen animierten Gesichtsrig, einen verlängerten Hals/ovalen Kragen, sichtbare Lippen, körperseitig gehaltene Lenkradgriffe, angepasste Kappen und sechs individuelle Karosserieprofile auf gemeinsamer Radbasis. Stalins Variante ist eine Straßenlimousine; die Traktorsilhouette bleibt dem Wurfobjekt vorbehalten. Die Ursache des wobbelnden Rückenstabs war der Goldverschluss auf dem animierten Cape-Knoten; der unpassende Verschluss ist entfernt. Reproduktion mit Blender und anschließend `node art-source/optimize_assets.mjs hero-kart`. Das ist im laufenden Spiel sichtbar, aber noch kein realitätsnahes Porträt, kein abgenommener Gesamtanker und kein vollständiger Profil-/Bewegungspass; Status/Abnahme siehe [Masterauftrag](../docs/22-character-vehicle-quality-master.md) und [Arbeitsliste](../CURRENT-WORKLIST.md).

**04.10.2026 (Stalin-Teilpass):** Das Stalin-Profil erhält zusätzlich einen breiteren Kiefer und auf demselben animierten Gesichtsrig modellierte Brauen-, Wangen-, Nasolabial- und Unteraugenformen. Das Limousinen-Frontend bekam eine eigene hohe Grillstruktur und Haubenlinie, das Heck eine gestufte Kontur. `hero-kart.blend` und optimiertes GLB sind reproduziert; Gesicht und Karosserie bleiben gestalterisch unfertig und brauchen Front-/Seiten-/Nah-/Bewegungsprüfung. Der Laufzeitdatei-Zuwachs ist in `docs/evidence/slice-asset-optimization.json` dokumentiert.

**04.10.2026 (Lenkradgriff korrigiert):** Die Faust-/Handmeshes wurden zur Laufzeit korrekt an `steeringWheel` geparentet, lagen in der Modellquelle aber etwa 0,45 m außerhalb des Kranzes. Arm und Hand wiesen nach außen; Parenting erhielt diesen Fehler. `build_kart.py` führt die Unterarme jetzt nach innen und setzt Handfläche/Finger auf die linke und rechte Lenkradseite. Derselbe Aufbau versorgt den ganzen Kader. Export, Optimierung und Fahrerperspektive im Babylon-Rennen geprüft; beide Handschuhe liegen am unteren Kranz an. Lenkeinschlag-/Außenansicht bleibt als feinere Abnahme offen.

**04.10.2026 (Griffreichweite):** Bei stark gedrehtem Lenkrad wandert der bewegte Griffanker; reine Armrotation reichte nicht für die Ruhe-Armlänge. `src/slice-scene.ts` richtet den gesamten Arm mit `armGripReach` zum Anker aus und skaliert die Handschuh-Untergruppe gegenläufig, sodass die Griffgröße stabil bleibt. Das ist ein Laufzeit-Rigschritt; das GLB-Skelett/Handmesh wird dafür nicht getrennt oder umgebaut. Sichtprüfung des vollen Einschlags aus menschlich gesteuerter Außen-/Seitenansicht bleibt offen.

**04.10.2026 (Munddetail Stalin):** Der Stalin-Walrossbart verdeckte die gemeinsame Mundgeometrie auf der Fahrerkarte. `cast-stalinmouth` ist nun ein eigener Gesichtsbaustein mit sichtbarer dunkler Mundöffnung und Ober-/Unterlippe unterhalb des Bartes; `src/cast.ts` aktiviert ihn ausschließlich für Stalin. Der echte Laufzeitporträt-Renderer zeigt jetzt beide Merkmale getrennt.

**04.10.2026 (Stalin-Tunika):** Der Fahrer besitzt jetzt eine separat aktivierte, hochgeschlossene Tunika mit passendem Stehkragen, gefalteter Knopfleiste, Knöpfen, Brusttaschen und feinen Nahtlinien. Paradeband, Medaillen, Schulterstücke und generische Goldknöpfe bleiben bei Stalin aus; die anderen Fahrer behalten ihre eigenen Details. Farb- und Formrichtung orientieren sich an einem Frontporträt der [Library of Congress](https://loc.gov/pictures/resource/cph.3b41212/) (nur visuelle Recherche; keine Fremdtextur/-geometrie übernommen). Neu gebaut mit Blender 4.5.3 und `node art-source/optimize_assets.mjs hero-kart`; Studio-Laufzeitporträt geprüft.

**05.10.2026 (Stalin-Gesicht):** Eine Stalin-eigene loftmodellierte Nasenbrücke mit breiteren Nasenflügeln und zurückhaltenden Nasenlöchern ersetzt bei ihm das gemeinsame Naselement. `cast-stalin-nose` wird im Runtime-Cast allein für Stalin aktiviert. Blender-Quelle, GLB und Optimierung sind reproduziert; die Runtime-Datei wuchs gegenüber dem vorigen Modell um 35.468 Byte (ca. 0,7 %). Cast-Knotentest und Build bestanden; In-Game-Nahaufnahme weiterhin offen.

**04.10.2026 (Rad-Detailpass):** `build_kart.py` ergänzt zwei umlaufende Reifen-Seitenwandrippen je Reifen und acht Felgenmuttern je Felgenseite. Mit Blender 5.2.1 neu gebaut und mit `node art-source/optimize_assets.mjs hero-kart` exportiert/optimiert. Die vier `wheelPivot-*`-/`wheelSpin-*`-Verträge sowie je Rad die Materialmeshes für Reifen und Metall bleiben im GLB vorhanden. Nahsicht/Bewegung im Browser ist noch nicht abgenommen.

**04.10.2026 (Hautmaterial, Laufzeit):** `src/surface-textures.ts` erzeugt eine wiederverwendete 512²-Skin-Farb-/Normalvariation; `src/slice-scene.ts` weist sie dem vorhandenen Material `Warm skin` zu. Die Mesh-/UV-Quelle wird nicht umgebaut. Build und Vollsuite bestanden; menschliche Nahansicht/Anpassung bleibt offen.
