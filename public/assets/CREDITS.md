# Assetherkunft – Stadion der Eitelkeit

Stand: 03.10.2026. Keine gekauften Modelle, Texturen oder Sounds.

| Dateien | Herkunft / Nutzungsgrundlage | Bearbeitung |
|---|---|---|
| `models/hero-kart.glb`, `models/stadium-world.glb` | Originale, in dieser Projektsitzung erzeugte Geometrie. Kein fremdes Mesh oder Referenzbild kopiert. Editierbare Quellen in `art-source/*.blend`, reproduzierbarer Erzeuger `art-source/build_slice.py`. | Blender 4.5.3 LTS, glTF-Export; neutrale fiktive Gestaltung. Historische Fahrer-/Landmarkenauswahl weiterhin offen. |
| `textures/golden-sky.png` | Mit dem eingebauten OpenAI-Imagegen für dieses Projekt erzeugt, ohne Bildvorlage. | Frühere Himmelvariante; im aktuellen Slice nicht verwendet. Kein Beleg für die Qualität der 3D-Modelle. |
| `textures/sky-afternoon-4k.jpg`, `sky-afternoon-2k.jpg` | Poly Haven, Table Mountain 2 (Pure Sky), https://polyhaven.com/a/table_mountain_2_puresky . CC0 https://polyhaven.com/license . Offizielle Tonemapped-JPG-Variante über https://api.polyhaven.com/files/table_mountain_2_puresky . | Panorama auf 4096 × 2048 (JPEG90) und 2048 × 1024 (JPEG88) verkleinert; Standard/Basis. Ersetzt seit 03.10.2026 (Qualitätsstufe 2) den Kloofendal-Mittagshimmel. |
| `models/park-tree.glb`, `art-source/park-tree.blend` | Poly Haven, Tree Small 02, https://polyhaven.com/a/tree_small_02 . CC0: https://polyhaven.com/license . Download über offiziellen API-Katalog – Powered by Poly Haven. | 1K-Texturen, Geometrie für Browser reduziert und als GLB exportiert. Reproduzierbar mit `art-source/prepare_tree.py`; editierbare Quelldatei mit gepackten Texturen. |
| `textures/studio.env` | Babylon.js Assets / BabylonJS-Mitwirkende. Download: https://assets.babylonjs.com/environments/environmentSpecular.env . Repository: https://github.com/BabylonJS/Assets . Repository-Lizenz: Creative Commons Attribution 4.0, https://github.com/BabylonJS/Assets/blob/master/LICENSE und https://creativecommons.org/licenses/by/4.0/ . | Unveränderte Datei, lokal anders benannt; als Beleuchtungs-/Reflexionsumgebung eingebunden. |
| `audio/motor.wav`, `tire.wav`, `impact.wav`, `boost.wav` | Originale deterministisch erzeugte Audioeffekte; Quellcode `art-source/build_audio.mjs`. | Vorgefertigte WAVs für Motor, Reifen, Kontakt und Turbo. Keine Stimmen oder Musik. Hörqualität noch durch Menschen zu beurteilen. |
| `audio/fig-leaf-rag.mp3` | „Fig Leaf Rag“ – Kevin MacLeod (incompetech.com), ISRC USUAN1100701, Creative Commons Attribution 4.0. Quelle: https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100701 ; Lizenz: https://creativecommons.org/licenses/by/4.0/ . | Unveränderte Pianoaufnahme, als vorläufige historische Musik wiederholt. Lautstärke im Spiel abgesenkt; sichtbare Attribution im Credits-Menü. Künstlerische Passung ist ein Vorschlag, keine Audioabnahme. |
| `textures/cobble-color.jpg`, `cobble-normal.jpg`, `cobble-arm.jpg` | Poly Haven, Cobblestone Floor 08, https://polyhaven.com/a/cobblestone_floor_08 , CC0 https://polyhaven.com/license . Powered by Poly Haven. | Offizielle 1K-JPG-Farb-/Normal-/ARM-Karten; gekachelt auf der Fahrbahn. |
| `textures/herringbone-diff.jpg`, `herringbone-nor_gl.jpg`, `herringbone-arm.jpg` | Poly Haven, Herringbone Pavement (Charlotte Baglioni), https://polyhaven.com/a/herringbone_pavement , CC0 https://polyhaven.com/license . Powered by Poly Haven. | Offizielle 1K-JPG-Farb-/Normal(GL)-/ARM-Karten, unverändert; Promenaden entlang der Strecke. |
| Stein-, Stoff-, Laub- und Rasenatlanten | Originale deterministische Laufzeittexturen in `src/surface-textures.ts`. | Kleine gekachelte Farb- und Normaltexturen; keine externen Fotos. |

Blender selbst: https://www.blender.org/ , freie Software, GNU GPL. Das lokale portable Werkzeug liegt unter `.tools/` und wird nicht mit Git verteilt. Die Lizenz des Werkzeugs wird dadurch nicht auf selbst erstellte Modelle übertragen; siehe https://www.blender.org/about/license/ .

Babylon.js / glTF-Loader: Apache-2.0; Paketlizenzen liegen in `node_modules/@babylonjs/*` und werden vom Lockfile festgelegt.

## Erweiterung des neutralen Slices

`models/items.glb`, `models/stadium-props.glb` und zugehörige `.blend`: originale Projektgeometrie aus `art-source/build_items.py` und `build_props.py`. Neutrale Darstellungen der drei bestätigten Item-Archetypen, keine Umbenennung von Sarahs Originalideen und keine historische Figurenfreigabe. Zuschauer sind vereinfachte neutrale Silhouetten.

`audio/pickup.wav`, `launch.wav`, `countdown.wav`, `start.wav`, `lap.wav`, `finish.wav`, `hop.wav`, `land.wav`: originale deterministische WAV-Effekte aus `build_audio.mjs`, vorproduziert und im Spiel abgespielt. Hörqualität nicht abgenommen.

GLB-Optimierung: glTF Transform SDK 4.5.1 (MIT, https://gltf-transform.dev/ ) und Sharp 0.35.5 (Apache-2.0), nur lokale Entwicklung. Originale `.blend` bleiben editierbar; `npm run assets:optimize` verarbeitet den Rohcache. Kein externer Optimierungsdienst.
