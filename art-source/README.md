# Editierbare Art-Pipeline des Stadion-Slices

## Schäferhund reproduzieren

Mit vorhandenem Blender: --background --python art-source/build_shepherd.py; danach node art-source/optimize_assets.mjs shepherd. .blend behält bewegliche Gelenke. node art-source/build_shepherd_audio.mjs erzeugt den eigenen Doppelbelllaut. GlTF-Optimierung mit Einzelmodellaufruf erhält jetzt vorhandene andere Modellmessungen statt sie zu überschreiben.

Stand 03.10.2026. Alle Kart-, Gebäude-, Requisiten- und Itemmodelle sind originale Projektgeometrie. Der Parkbaum stammt von Poly Haven (CC0); Herkunft, Audio und Texturen stehen in `../public/assets/CREDITS.md`.

## Quellen und Laufzeit (Qualitätsstufe 2)

- Früher Ladebildschirm: `loading-stadium-v1.png` → `public/assets/textures/loading-stadium-v1.webp`. Eigenständige Imagegen-Konzeptillustration in G/J-Richtung; Motivauftrag und Nutzungsgrundlage in `loading-stadium-v1.md`. Nur Ladehintergrund, keine 3D-Spielgrafik. HTML-UI separat editierbar in `index.html`.

- `build_kart.py` → `hero-kart.blend`/GLB: Kart, Fahrer und Varianten. Laufzeitvertrag: `wheelPivot-0..3`, `wheelSpin-0..3`, `steeringWheel`, `driverPose`, `headPose`, `scarfFlap` (Umhang), `variant-*` (Anbauten), `cast-*` (Mützen, Frisuren, Gesichter). Umgefärbte Materialien: `Petrol enamel`, `Uniform racing suit`, `Cape cloth`, `Hat cloth`. Besetzung in `src/cast.ts`.
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

Weitere editierbare Straßenmöbel/Adler und eigene Plakatgrafiken: src/period-details.ts; fünf nach Material zusammengefasste Laufzeitmeshes.

**04.10.2026:** `node art-source/build_march.mjs` erzeugt den eigenen Stadionmarsch (`public/assets/audio/march.wav`). `build_kart.py` enthält die schaltbaren Karikaturteile des Startkaders (`cast-sidepart`, `cast-toothbrush`, `cast-swept`, `cast-walrus`, `cast-pipe`, `cast-chin`, `cast-maohair`, `cast-undercut`, `cast-patrol`, `cast-cigar`, `cast-shorthair`, `cast-medals`, `cast-epaulettes`, `cast-collartabs`); danach `node art-source/optimize_assets.mjs hero-kart`.
