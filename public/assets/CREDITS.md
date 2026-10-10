# Assetherkunft – Stadion der Eitelkeit

## Klima-Bäume und Boden – 10.10.2026

- tree-broadleaf.glb, tree-broadleafB.glb und tree-pine.glb: Quaternius, Stylized Nature MegaKit Standard, CommonTree_1/CommonTree_3/Pine_1. Offizielle Quelle https://quaternius.com/packs/stylizednaturemegakit.html ; vom Autor veröffentlichtes Gratisarchiv https://opengameart.org/content/stylized-nature-megakit . CC0 1.0 laut beiliegender License_Standard.txt.
- tree-birch.glb: Quaternius, Ultimate Stylized Nature Pack, BirchTree_1. Offizielle Quelle https://quaternius.com/packs/ultimatestylizednature.html und dort verlinkter öffentlicher Google-Drive-Ordner. CC0 1.0 laut Assetseite und mitgelieferter License.txt. Die unveränderte Lizenzdatei trägt versehentlich die Überschrift „Ultimate Platformer Pack“; die Naturpack-Seite bestätigt die Nutzungsgrundlage separat.
- tree-palm.glb und tree-palmB.glb: Kenney Nature Kit, tree_palmDetailedTall/tree_palmDetailedShort, https://kenney.nl/assets/nature-kit ; CC0 laut Original-Lizenz. Vorhandene mediterrane Schirmkiefern/Zypressen in Rom bleiben die originalen Projektmodelle.
- Ausgewählte Original-glTF/GLB, Binärdaten, Texturen und Lizenztexte unter art-source/climate-trees/. Reproduzierbarer Export art-source/build_climate_trees.mjs: Meshopt, PNG mit höchstens 512 px und erhaltenem Blattalpha; transparente Blattflächen als beidseitiger Alpha-Test statt Alpha-Blending. Keine fremden Shader übernommen.
- Kenney-Palmen: originales türkisfarbenes Unlit-Laub auf natürliches Grün und braune Rinde abgestimmt; Unlit entfernt, damit Tag-/Nachtlicht tatsächlich wirkt. Originaldownload unverändert erhalten.
- Eigene streckenbezogene Pflasterpaletten/Fugen/Normalatlanten in src/course-ground.ts. Berlin Ziegelhof, Rom Travertin, Havanna Korallenkalkstein, Pjöngjang kühler Granit, Moskau rötlicher Granit, Peking blaugrauer Ziegel. Keine heruntergeladenen Bodentexturen in diesem Paket.

## Streckenmusik – 10.10.2026

audio/music-berlin.wav, music-rome.wav, music-havana.wav, music-pyongyang.wav, music-moscow.wav und music-beijing.wav: eigene originale synthetische Kompositionen für dieses Projekt, keine Fremdaufnahmen/Samples oder Hymnenzitate. Reproduzierbare Partituren/Synthese: art-source/build_track_music.mjs; Titel/Tempo in src/music-themes.ts. 32 Takte 2/4 je Schleife, PCM16/22.050 Hz mono. An den Klang der bisherigen eigenen march.wav angelehnt; menschliche Hörabnahme offen.

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

| `audio/voice/imperator-horn.wav` | **Echter historischer Mitschnitt:** Benito Mussolini, „Bivacco“-Rede vor der Abgeordnetenkammer, 16.11.1922, Redebeginn (ca. 3,3 s ab 1,1 s). Quelle: Wikimedia Commons, „Discorso di Benito Mussolini del 16 novembre 1922.wav“ (https://commons.wikimedia.org/wiki/File:Discorso_di_Benito_Mussolini_del_16_novembre_1922.wav), Lizenz laut Commons: Public domain (Credit MyFreeMP3.eu). | Schnitt reproduzierbar mit `art-source/cut_real_voices.mjs` (Quelle lokal unter `.tools/voice-sources/`, nicht in Git). Nur der dokumentierte Redebeginn, keine Parolen. Menschliche Hörprüfung offen. Kandidat, nicht eingebaut (Inhalt erst anhören): „Adolf Hitler Speech in 1935.ogg“ (Commons, Public domain). |

## Redesign 06.10.2026

- `models/city-kit.glb` (Stadtbaukasten) und die neuen Hitler-/Grand-Prix-Teile in `models/hero-kart.glb`: originale prozedurale Projektgeometrie aus `art-source/build_city_kit.py` bzw. `art-source/build_kart.py`. Keine externen Modelle, Texturen oder Logos.
- `audio/motor.wav`: originale Synthese aus `art-source/build_engine.mjs`, keine Samples.
- `audio/roll-cobble.wav`, `roll-gravel.wav`, `roll-grass.wav`, `splash.wav`: originale Synthese aus `art-source/build_surface_audio.mjs`, keine Samples.

| `models/cc0-debris.glb`, `art-source/cc0-debris.blend` | Kenney, Car Kit 3.1 (debris-bumper, debris-door, debris-door-window, debris-tire, debris-spoiler-a, debris-plate-a, debris-drivetrain), https://kenney.nl/assets/car-kit . Lizenz CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/), laut beiliegender License.txt; Nennung freiwillig, Änderungen erlaubt. Über `art-source/import_cc0_pack.py` zusammengeführt, als Totalschaden-Trümmer verwendet (07.10.2026). |

| `models/cc0-driver-hitler.glb`, `art-source/build_cc0_driver.py`, `art-source/hitler_face.py` | Quaternius, Universal Base Characters (Standard/Free), Superhero_Male_FullBody + Hair_SimpleParted, https://quaternius.itch.io/universal-base-characters . Lizenz CC0 1.0 laut beiliegender License_Standard.txt. In Sitzpose gebracht, Gesicht iteriert und schwarzer Ledersuit ergänzt (07.10.2026). |

Lizenztexte der Klima-Bäume: nur Zeilenenden und abschließende Leerzeichen für die Git-Prüfung normalisiert; Lizenzinhalt erhalten.
