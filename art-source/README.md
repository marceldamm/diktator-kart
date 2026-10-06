# Editierbare Art-Pipeline des Stadion-Slices

## Schäferhund reproduzieren

Mit vorhandenem Blender: --background --python art-source/build_shepherd.py; danach node art-source/optimize_assets.mjs shepherd. .blend behält bewegliche Gelenke. node art-source/build_shepherd_audio.mjs erzeugt den eigenen Doppelbelllaut. GlTF-Optimierung mit Einzelmodellaufruf erhält jetzt vorhandene andere Modellmessungen statt sie zu überschreiben.

Stand 03.10.2026. Alle Kart-, Gebäude-, Requisiten- und Itemmodelle sind originale Projektgeometrie. Der Parkbaum stammt von Poly Haven (CC0); Herkunft, Audio und Texturen stehen in `../public/assets/CREDITS.md`.

## Redesign 06.10.2026: Stadtbaukasten, Hitler-Anker, Motor

- `build_city_kit.py` → `city-kit.blend` und `.tools/raw-models/city-kit.glb`; danach `node art-source/optimize_assets.mjs city-kit`. 28 Module mit gemeinsamer Palette, eine Meshgruppe pro Kit-Material (`kit-<modul>|<material>`), Vertexfarben für Verschmutzung/Streifen. Bauzeit ca. 2 s. Platzierung und Zusammenfassung zur Laufzeit in `src/city-world.ts`; neue Module dort in `DIMS` und den Bezirksfamilien eintragen. Art-System und Streckenabschnitte: [docs/25](../docs/25-redesign-art-system.md).
- `build_world.py`/`stadium-world.blend` sind ab jetzt historisch; `stadium-world.glb` wird nicht mehr geladen.
- `build_kart.py`, Abschnitt „Hitler quality anchor“: `body-grandprix`, `cast-hitler-jacket`, `cast-hitler-tache`, `cast-hitler-nose`, `cast-hitler-brows`; danach `node art-source/optimize_assets.mjs hero-kart`.
- `build_engine.mjs` erzeugt nur `public/assets/audio/motor.wav` (eigene Synthese, eigener Zufallsstrom; `build_audio.mjs` würde den Motor wieder überschreiben – danach `build_engine.mjs` erneut ausführen).

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

**05.10.2026 (Townhouse-Fassaden):** `build_world.py` setzt verwitterte Holzläden an zwei oberen Fenstern jedes vierten Hauses sowie einzelne bepflanzte Ladenfenster an jedem dritten Block. Die Varianten bleiben durch Material und Mesh-Namen identifizierbar. Welt neu bauen und anschließend `node art-source/optimize_assets.mjs stadium-world` ausführen.

**05.10.2026 (Laden-Ausleger):** Selektive Häuser (Townhouse-Index `% 7 == 2`) erhalten eine von drei Emaillefarben, Messingrahmen und -halter, ein zum Laden passendes Cup-/Brot-/Briefrelief und den Namen KAFFEE/BROT/POST. So bleibt die Straße abwechslungsreich, ohne alle Fassaden mit demselben Schild zu belegen. Reproduktion: Blender-Weltgenerator, dann `node art-source/optimize_assets.mjs stadium-world` und `npm run build`; für Lesbarkeit die Ladenfront im Spiel aus der Nähe prüfen.

**04.10.2026:** `node art-source/build_march.mjs` erzeugt den eigenen Stadionmarsch (`public/assets/audio/march.wav`). `build_kart.py` enthält die schaltbaren Karikaturteile des Startkaders (`cast-sidepart`, `cast-toothbrush`, `cast-swept`, `cast-walrus`, `cast-pipe`, `cast-chin`, `cast-maohair`, `cast-undercut`, `cast-patrol`, `cast-cigar`, `cast-shorthair`, `cast-medals`, `cast-epaulettes`, `cast-collartabs`); danach `node art-source/optimize_assets.mjs hero-kart`.

**04.10.2026 (Fahrer-/Fahrzeug-Masterpass, erste Zwischenstufe):** `build_kart.py` enthält sechs unterschiedlich geformte Schädelprofile am gemeinsamen animierten Gesichtsrig, einen verlängerten Hals/ovalen Kragen, sichtbare Lippen, körperseitig gehaltene Lenkradgriffe, angepasste Kappen und sechs individuelle Karosserieprofile auf gemeinsamer Radbasis. Stalins Variante ist eine Straßenlimousine; die Traktorsilhouette bleibt dem Wurfobjekt vorbehalten. Die Ursache des wobbelnden Rückenstabs war der Goldverschluss auf dem animierten Cape-Knoten; der unpassende Verschluss ist entfernt. Reproduktion mit Blender und anschließend `node art-source/optimize_assets.mjs hero-kart`. Das ist im laufenden Spiel sichtbar, aber noch kein realitätsnahes Porträt, kein abgenommener Gesamtanker und kein vollständiger Profil-/Bewegungspass; Status/Abnahme siehe [Masterauftrag](../docs/22-character-vehicle-quality-master.md) und [Arbeitsliste](../CURRENT-WORKLIST.md).

**04.10.2026 (Stalin-Teilpass):** Das Stalin-Profil erhält zusätzlich einen breiteren Kiefer und auf demselben animierten Gesichtsrig modellierte Brauen-, Wangen-, Nasolabial- und Unteraugenformen. Das Limousinen-Frontend bekam eine eigene hohe Grillstruktur und Haubenlinie, das Heck eine gestufte Kontur. `hero-kart.blend` und optimiertes GLB sind reproduziert; Gesicht und Karosserie bleiben gestalterisch unfertig und brauchen Front-/Seiten-/Nah-/Bewegungsprüfung. Der Laufzeitdatei-Zuwachs ist in `docs/evidence/slice-asset-optimization.json` dokumentiert.

**04.10.2026 (Lenkradgriff korrigiert):** Die Faust-/Handmeshes wurden zur Laufzeit korrekt an `steeringWheel` geparentet, lagen in der Modellquelle aber etwa 0,45 m außerhalb des Kranzes. Arm und Hand wiesen nach außen; Parenting erhielt diesen Fehler. `build_kart.py` führt die Unterarme jetzt nach innen und setzt Handfläche/Finger auf die linke und rechte Lenkradseite. Derselbe Aufbau versorgt den ganzen Kader. Export, Optimierung und Fahrerperspektive im Babylon-Rennen geprüft; beide Handschuhe liegen am unteren Kranz an. Lenkeinschlag-/Außenansicht bleibt als feinere Abnahme offen.

**04.10.2026 (Griffreichweite):** Bei stark gedrehtem Lenkrad wandert der bewegte Griffanker; reine Armrotation reichte nicht für die Ruhe-Armlänge. `src/slice-scene.ts` richtet den gesamten Arm mit `armGripReach` zum Anker aus und skaliert die Handschuh-Untergruppe gegenläufig, sodass die Griffgröße stabil bleibt. Das ist ein Laufzeit-Rigschritt; das GLB-Skelett/Handmesh wird dafür nicht getrennt oder umgebaut. Sichtprüfung des vollen Einschlags aus menschlich gesteuerter Außen-/Seitenansicht bleibt offen.

**04.10.2026 (Munddetail Stalin):** Der Stalin-Walrossbart verdeckte die gemeinsame Mundgeometrie auf der Fahrerkarte. `cast-stalinmouth` ist nun ein eigener Gesichtsbaustein mit sichtbarer dunkler Mundöffnung und Ober-/Unterlippe unterhalb des Bartes; `src/cast.ts` aktiviert ihn ausschließlich für Stalin. Der echte Laufzeitporträt-Renderer zeigt jetzt beide Merkmale getrennt.

**04.10.2026 (Stalin-Tunika):** Der Fahrer besitzt jetzt eine separat aktivierte, hochgeschlossene Tunika mit passendem Stehkragen, gefalteter Knopfleiste, Knöpfen, Brusttaschen und feinen Nahtlinien. Paradeband, Medaillen, Schulterstücke und generische Goldknöpfe bleiben bei Stalin aus; die anderen Fahrer behalten ihre eigenen Details. Farb- und Formrichtung orientieren sich an einem Frontporträt der [Library of Congress](https://loc.gov/pictures/resource/cph.3b41212/) (nur visuelle Recherche; keine Fremdtextur/-geometrie übernommen). Neu gebaut mit Blender 4.5.3 und `node art-source/optimize_assets.mjs hero-kart`; Studio-Laufzeitporträt geprüft.

**05.10.2026 (Stalin-Gesicht):** Eine Stalin-eigene loftmodellierte Nasenbrücke mit breiteren Nasenflügeln und zurückhaltenden Nasenlöchern ersetzt bei ihm das gemeinsame Naselement. `cast-stalin-nose` wird im Runtime-Cast allein für Stalin aktiviert. Blender-Quelle, GLB und Optimierung sind reproduziert; die Runtime-Datei wuchs gegenüber dem vorigen Modell um 35.468 Byte (ca. 0,7 %). Cast-Knotentest und Build bestanden; In-Game-Nahaufnahme weiterhin offen.

**05.10.2026 (Stalin-Gesichtspass 2):** `build_kart.py` formt die Wangen, den Masseter, die Kieferwinkel und das Kinn in Stalins individueller Schädelvariante als zusammenhängende Oberfläche; zwei dünne, konturfolgende Haarlocks führen das zurückgekämmte Haar an den Schläfen weiter. Blender 4.5.3 baute `.blend` und GLB; `node art-source/optimize_assets.mjs hero-kart` erzeugte den Runtime-Export (Roh-GLB 7.099.272 Byte, Runtime 5.084.136 Byte; +2.568 Byte zum vorherigen Runtime-GLB). Im echten Fahrerwahl-Renderer sind die aktualisierten Stalin-Merkmale sichtbar. Exportknoten, Cast, Vollsuite und Produktionsbuild bestanden. Seiten-/Nah-/Bewegungsqualität bleibt offen.

**05.10.2026 (Stalin-Limousine-Coachwork):** `build_kart.py` ergänzt nur unter `body-limousine` zwei körpernah sitzende Türgriffe, seitliche Coachlines und sechs eingelassene Haubenlüfter (drei je Seite) samt Metalllamellen. Blender 4.5.3 und `node art-source/optimize_assets.mjs hero-kart` bauten Quelle/Runtime neu (Roh-GLB 7.315.132 Byte, optimiert 5.230.312 Byte; +146.176 Byte bzw. +2,9 % zum vorherigen Runtime-Modell). Fahrwerk, Räder, Castzuordnung und Physik blieben unverändert. Fahrerwahl und Stadionszene mit neuem Asset geladen; 56/56 Tests und Build erfolgreich. Kleinere Details sind im Menübild zu klein für Einzelabnahme.

**05.10.2026 (Stalin-Limousine und Feldmütze):** `body-limousine` bekommt eine flach geneigte Touring-Windschutzscheibe aus `Limousine touring glass` mit glTF-BLEND-Transparenz, Metallrahmen, Mittelsteg, Scharnieren und anliegendem Wischer. Das sichtbare Hinterrad wird von Radius .43 m/Breite .44 m auf .36 m/.39 m verkleinert; Frontgröße .36 m und Radstand/Physik bleiben gleich. Zwei Stalin-Schläfensträhnen werden unter `cast-stalin-hairline` geführt; der Cast aktiviert bei der Feldmütze nicht mehr das darüber ragende swept Deckhaar. Blender 4.5.3 und glTF Transform erzeugen 7.365.372 Byte Rohquelle / 5.283.004 Byte Runtime (+52.692/+1,0 %). `tests/cast.test.mjs` prüft AlphaMode, Materialknoten und Elternvarianten. Das Studio-Renderbild ist als Blender-Assetvorschau in `docs/evidence/` hinterlegt, kein Laufzeitnachweis. Runtime-Nah-/Seiten-/Fahrtabnahme bleibt offen.

**05.10.2026 (Lid- und Stalin-Mundpass):** Die gemeinsamen Gesichter verwenden jetzt schmale modellierte obere und untere Lidkanten anstelle deckender Lidellipsoide. Stalins eigene Mundöffnung samt Lippen wurde auf die Gesichtsebene unter dem Walrossbart gesetzt. Blender-Quelle/`.blend`, optimierter Runtime-Export, gezielter Casttest (2/2), Produktionsbuild und sechs echte Fahrerwahlporträts sind geprüft. Die Augen sind im kleinen Porträt klarer; Stalins Mund bleibt dort subtil. Keine vollständige anatomische/stilistische Abnahme.

**05.10.2026 (Streckenuntergrund und Übungskrater):** Tracklayout und Babylon-Laufzeit ergänzen drei Fallmulden mit innerer Absturzzone, begrenzter Sink-/Bergungsanimation und kraterfreier Rücksetzung auf gleicher Rennposition. Schotter der Hinterhofabkürzung ist prozedural eigenständig texturiert; ein befahrbarer Grasrand zeigt abweichende Grip-/Tempo- und Staubreaktion. Keine Blender-Datei geändert: diese Trackgeometrie entsteht prozedural in `src/track-world.ts`. Technische Grenzen und Abnahme siehe [CURRENT-WORKLIST.md](../CURRENT-WORKLIST.md) und [Fortschrittslog](../PROGRESS-LOG.md).

**05.10.2026 (Rückenpolster):** In `build_kart.py` schwebten drei goldene „Seat stitching“-Röhren 2 cm hinter dem Rückenpolster. Sie wurden durch matte, bündige Polsternähte (1,8-mm Radius) und zwei flache Quernähte ersetzt. Cast/Umhang, Sitzrig und Physik bleiben unverändert. Blender 5.2.1 erzeugte 7.238.676 Byte Roh-GLB; glTF Transform optimierte auf 5.317.764 Byte. Die 3D-Laufzeitprüfung in Babylon-Fotomodus bestätigte die Heck- und 3/4-Silhouette ohne hervorstehende Stangen.

**05.10.2026 (Stadtbau-Pipeline und Fassadenentwässerung, früher Zwischenstand):** `build_world.py` baut 48 Townhouses mit selektiven verwitterten Fensterläden, Ladenpflanzkästen, KAFFEE/BROT/POST-Auslegern sowie gealterten Zink-Regenrinnen/Fallrohren. Weltbau-Sphären entstehen im `BUILD_WORLD`-Pfad direkt als Low-Poly-UV-Mesh statt über einzelne Blender-Operatoren; `bake()` berechnet die unveränderten Platzierungsframes anhand der Objekt-Matrixkette statt die wachsende Gesamtszene nach jedem Frame neu zu evaluieren. Materialgruppen bleiben statisch gebatcht. Ein früher Vollbau erzeugte 12.500 prozedurale Mesh-Aufrufe, 13.338 Objekte vor dem Join und 32 Materialmeshes. Seine damaligen Assetgrößen sind durch die spätere Produktionsmessung unten abgelöst. Reproduktion: Blender-Aufruf oben, danach Assetoptimierer. Phasen-/100-Mesh-Zähler und Join-Gruppenzeiten zeigen den langen statischen Join transparent; Nahsicht und Stilabnahme im Rennen bleiben notwendig.

**05.10.2026 (World-Merge-Bulkprobe):** `merge_static()` liest statische Gruppenmesh-, Loop-, UV- und Polygonattribute mit NumPy/Blender-`foreach_get`, transformiert Vertices in den Weltraum und erzeugt gruppierte Laufzeitmeshattribute per `foreach_set`. Ein vollständiger synthetischer Test mit den echten Objekt-/Gruppenzahlen (13.338 Objekte, 32 Materialien, 426.816 Vertices/240.084 Flächen) benötigte 320,57 s mit dem alten Operator und 230,53 s mit der Bulkvariante (1,39×). Die vereinfachten 16-segmentigen Wiederholkörper unterschätzen/ändern reale Geometrie; der produktive Vollbau muss den Effekt erst bestätigen. Exaktes Blender-Fixture: `test_world_merge.py`; reproduzierbarer Timingvergleich: `benchmark_world_merge.py`.

**05.10.2026 (Hybrid-Schwelle, Produktionsmessung abgeschlossen):** Der echte 1.219-Objekt-Sandstone-Shadow-Join brauchte mit dem Operator 131,3 s; die bekannte Operatorreferenz lag bei 138,4 s. Die 5.047-Objekt-Carved-Ivory-Stone-Gruppe brauchte im Bulkpfad 444,8 s gegenüber 438,7 s mit dem Operator. Deshalb ist `merge_static(prefix, direct_min_objects=6000)` so eingestellt, dass alle derzeitigen Produktionsgruppen den Operator verwenden. Das Fixture setzt `direct_min_objects=0`, um Bulk-/Spiegelungslogik weiter gezielt zu testen; ein künftiger Einsatz braucht einen realistischen Produktionsvorteil.

**04.10.2026 (Rad-Detailpass):** `build_kart.py` ergänzt zwei umlaufende Reifen-Seitenwandrippen je Reifen und acht Felgenmuttern je Felgenseite. Mit Blender 5.2.1 neu gebaut und mit `node art-source/optimize_assets.mjs hero-kart` exportiert/optimiert. Die vier `wheelPivot-*`-/`wheelSpin-*`-Verträge sowie je Rad die Materialmeshes für Reifen und Metall bleiben im GLB vorhanden. Nahsicht/Bewegung im Browser ist noch nicht abgenommen.

**04.10.2026 (Hautmaterial, Laufzeit):** `src/surface-textures.ts` erzeugt eine wiederverwendete 512²-Skin-Farb-/Normalvariation; `src/slice-scene.ts` weist sie dem vorhandenen Material `Warm skin` zu. Die Mesh-/UV-Quelle wird nicht umgebaut. Build und Vollsuite bestanden; menschliche Nahansicht/Anpassung bleibt offen.

**05.10.2026 (Produktionsvermessung abgeschlossen):** Blender 4.5.3 baute die 48 Häuser in 3.203 s Geometrie, 32 Mergegruppen in 940,6 s, Blend in 11,9 s und Roh-GLB/Runtimekopie in insgesamt 25,6 s. Die Produktionsmessung ergab keinen Vorteil des Bulkpfads: 5.047 reale Steingruppenobjekte brauchten 444,8 s statt 438,7 s historisch. Standardthreshold 6.000 hält alle aktuellen Gruppen im Operatorpfad. Der dokumentierte Build umfasst eine `.blend`-Quelle von 24.211.767 Byte, Raw-GLB von 22.586.788 Byte und optimierten Runtime-GLB von 16.232.868 Byte; diese Größen sind mit den aktuellen Dateien/Buildbelegen abgeglichen. In-Engine-Fassaden-Nahansicht: [Screenshot](../docs/evidence/world-facade-closeup-hybrid-m3.png); Art-Direction-Abnahme bleibt menschlich offen.
