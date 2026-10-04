# Assetherkunft – Stadion der Eitelkeit

## Schäferhund – 03.10.2026

models/shepherd.glb und art-source/shepherd.blend: eigene originale Geometrie mit vier getrennten Beinpivots, Schwanz/Kopf, schwarz-brauner Schäferhundsilhouette; keine fremden Meshes/Fotos kopiert. Quelle art-source/build_shepherd.py, Blender 4.5.3 LTS, optimiertes Runtime-GLB 208.808 Bytes. audio/shepherd-bark.wav: eigener deterministischer synthetischer Doppelbelllaut, art-source/build_shepherd_audio.mjs, kein historischer Mitschnitt. Klang-/Realismusabnahme noch offen.

Stand: 03.10.2026. Keine gekauften Modelle, Texturen oder Sounds.

| Dateien | Herkunft / Nutzungsgrundlage | Bearbeitung |
|---|---|---|
| `textures/loading-stadium-v1.webp`, Quelle `art-source/loading-stadium-v1.png` | Für dieses Projekt mit OpenAI-Imagegen erzeugte Konzeptillustration, vom Nutzer beauftragt. G/J-Projektbild als Stilreferenz; keine Referenztextur kopiert, kein heruntergeladenes Fremdasset. Keine CC0-/Exklusivitätszusage. | PNG in WebP Qualität 86 konvertiert, gleiche Pixelgröße. Nur frühe Ladephase, ausdrücklich als Konzeptillustration gekennzeichnet; ersetzt nicht die Spielgrafik. Motivauftrag und Quelldatei in `art-source/loading-stadium-v1.md`. |
| `models/hero-kart.glb`, `models/stadium-world.glb` | Originale, in dieser Projektsitzung erzeugte Geometrie. Kein fremdes Mesh oder Referenzbild kopiert. Editierbare Quellen in `art-source/*.blend`, reproduzierbarer Erzeuger `art-source/build_slice.py`. | Blender 4.5.3 LTS, glTF-Export; neutrale fiktive Gestaltung. Historische Fahrer-/Landmarkenauswahl weiterhin offen. |
| `textures/golden-sky.png` | Mit dem eingebauten OpenAI-Imagegen für dieses Projekt erzeugt, ohne Bildvorlage. | Frühere Himmelvariante; im aktuellen Slice nicht verwendet. Kein Beleg für die Qualität der 3D-Modelle. |
| `textures/sky-afternoon-4k.jpg`, `sky-afternoon-2k.jpg` | Poly Haven, Table Mountain 2 (Pure Sky), https://polyhaven.com/a/table_mountain_2_puresky . CC0 https://polyhaven.com/license . Offizielle Tonemapped-JPG-Variante über https://api.polyhaven.com/files/table_mountain_2_puresky . | Panorama auf 4096 × 2048 (JPEG90) und 2048 × 1024 (JPEG88) verkleinert; Standard/Basis. Ersetzt seit 03.10.2026 (Qualitätsstufe 2) den Kloofendal-Mittagshimmel. |
| `models/park-tree.glb`, `art-source/park-tree.blend` | Poly Haven, Tree Small 02, https://polyhaven.com/a/tree_small_02 . CC0: https://polyhaven.com/license . Download über offiziellen API-Katalog – Powered by Poly Haven. | 1K-Texturen, Geometrie für Browser reduziert und als GLB exportiert. Reproduzierbar mit `art-source/prepare_tree.py`; editierbare Quelldatei mit gepackten Texturen. |
| `textures/studio.env` | Babylon.js Assets / BabylonJS-Mitwirkende. Download: https://assets.babylonjs.com/environments/environmentSpecular.env . Repository: https://github.com/BabylonJS/Assets . Repository-Lizenz: Creative Commons Attribution 4.0, https://github.com/BabylonJS/Assets/blob/master/LICENSE und https://creativecommons.org/licenses/by/4.0/ . | Unveränderte Datei, lokal anders benannt; als Beleuchtungs-/Reflexionsumgebung eingebunden. |
| `audio/motor.wav`, `tire.wav`, `impact.wav`, `boost.wav` | Originale deterministisch erzeugte Audioeffekte; Quellcode `art-source/build_audio.mjs`. | Vorgefertigte WAVs für Motor, Reifen, Kontakt und Turbo. Keine Stimmen oder Musik. Hörqualität noch durch Menschen zu beurteilen. |
| `audio/march.wav` | „Stadionmarsch der Eitelkeit“: eigene Marschkomposition im preußischen Spielmannszug-/Militärmusikstil (Trommelkorps, Querpfeifen, Posaunen/Trompeten, Tuba), offline synthetisiert mit `art-source/build_march.mjs`. Keine fremde Aufnahme, kein Sample, keine bestehende Komposition. | Ersetzt am 04.10.2026 auf Marcels Wunsch die frühere Klavieraufnahme. Synthetischer Zwischenstand; menschliche Hörabnahme und später echte Blasmusikaufnahme offen. |
| `textures/cobble-color.jpg`, `cobble-normal.jpg`, `cobble-arm.jpg` | Poly Haven, Cobblestone Floor 08, https://polyhaven.com/a/cobblestone_floor_08 , CC0 https://polyhaven.com/license . Powered by Poly Haven. | Offizielle 1K-JPG-Farb-/Normal-/ARM-Karten; gekachelt auf der Fahrbahn. |
| `textures/herringbone-diff.jpg`, `herringbone-nor_gl.jpg`, `herringbone-arm.jpg` | Poly Haven, Herringbone Pavement (Charlotte Baglioni), https://polyhaven.com/a/herringbone_pavement , CC0 https://polyhaven.com/license . Powered by Poly Haven. | Offizielle 1K-JPG-Farb-/Normal(GL)-/ARM-Karten, unverändert; Promenaden entlang der Strecke. |
| Stein-, Stoff-, Laub- und Rasenatlanten | Originale deterministische Laufzeittexturen in `src/surface-textures.ts`. | Kleine gekachelte Farb- und Normaltexturen; keine externen Fotos. |

Blender selbst: https://www.blender.org/ , freie Software, GNU GPL. Das lokale portable Werkzeug liegt unter `.tools/` und wird nicht mit Git verteilt. Die Lizenz des Werkzeugs wird dadurch nicht auf selbst erstellte Modelle übertragen; siehe https://www.blender.org/about/license/ .

Babylon.js / glTF-Loader: Apache-2.0; Paketlizenzen liegen in `node_modules/@babylonjs/*` und werden vom Lockfile festgelegt.

## Erweiterung des neutralen Slices

`models/items.glb`, `models/stadium-props.glb` und zugehörige `.blend`: originale Projektgeometrie aus `art-source/build_items.py` und `build_props.py`. Neutrale Darstellungen der drei bestätigten Item-Archetypen, keine Umbenennung von Sarahs Originalideen und keine historische Figurenfreigabe. Zuschauer sind vereinfachte neutrale Silhouetten.

`audio/pickup.wav`, `launch.wav`, `countdown.wav`, `start.wav`, `lap.wav`, `finish.wav`, `hop.wav`, `land.wav`: originale deterministische WAV-Effekte aus `build_audio.mjs`, vorproduziert und im Spiel abgespielt. Hörqualität nicht abgenommen.

GLB-Optimierung: glTF Transform SDK 4.5.1 (MIT, https://gltf-transform.dev/ ) und Sharp 0.35.5 (Apache-2.0), nur lokale Entwicklung. Originale `.blend` bleiben editierbar; `npm run assets:optimize` verarbeitet den Rohcache. Kein externer Optimierungsdienst.

## Qualitätsstufe 2 – Stimmen und Klang (03.10.2026)

| Dateien | Herkunft / Nutzungsgrundlage | Bearbeitung |
|---|---|---|
| `audio/voice/*.wav`, `audio/voice/lines.json` | Offline mit Piper TTS 2023.11.14-2 (https://github.com/rhasspy/piper , MIT) synthetisiert. Stimmen aus https://huggingface.co/rhasspy/piper-voices (Repository MIT): `de_DE-kerstin-low` (Datensatz CC0, https://github.com/rhasspy/dataset-voice-kerstin), `de_DE-thorsten_emotional-medium` (Thorsten-Voice, CC0, https://github.com/thorstenMueller/Thorsten-Voice). | Eigene satirische Texte, keine historischen Zitate oder Personen. Reproduzierbar mit `art-source/build_voices.mjs`. Im Spiel: Stadion-Lautsprecherkette (Band, Sättigung, Hall) für die Sprecherin; Tonhöhe je Figur. Hörqualität nicht menschlich abgenommen. |
| `audio/crowd.wav`, `audio/scrape.wav` | Originale deterministische Klänge aus `art-source/build_audio.mjs`. | Publikumsteppich (Schleife) und metallisches Bandenschleifen. |


## Neue Straßenmöbel

Litfaßsäulen, Plakattexte/-grafiken, Bänke, Haltestellen und eigenständiger Adler: originale editierbare Projektgeometrie und Canvas-Typografie in src/period-details.ts. Keine historischen Embleme oder fremden Bilder verwendet.

Sprachupdate: eigene freundliche kurze Sprechertexte und sechs eigene Parodie-Sprachhupen, offline Piper, unveränderte Nutzungsgrundlagen oben. WAV-Peak .8, reduzierter Lautsprecherhall/Drive. Keine historischen Mitschnitte übernommen; Yle-/NARA-Recherche ohne festgestellte freie Spielfreigabe, siehe PROGRESS-LOG.md.
