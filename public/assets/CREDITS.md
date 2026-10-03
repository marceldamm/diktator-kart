# Assetherkunft – Stadion der Eitelkeit

Stand: 03.10.2026. Keine gekauften Modelle, Texturen oder Sounds.

| Dateien | Herkunft / Nutzungsgrundlage | Bearbeitung |
|---|---|---|
| `models/hero-kart.glb`, `models/stadium-world.glb` | Originale, in dieser Projektsitzung erzeugte Geometrie. Kein fremdes Mesh oder Referenzbild kopiert. Editierbare Quellen in `art-source/*.blend`, reproduzierbarer Erzeuger `art-source/build_slice.py`. | Blender 4.5.3 LTS, glTF-Export; neutrale fiktive Gestaltung. Historische Fahrer-/Landmarkenauswahl weiterhin offen. |
| `textures/golden-sky.png` | Mit dem eingebauten OpenAI-Imagegen für dieses Projekt erzeugt, ohne Bildvorlage. | Panoramischer Himmel als Laufzeittextur. Kein Beleg für die Qualität der 3D-Modelle. |
| `textures/studio.env` | Babylon.js Assets / BabylonJS-Mitwirkende. Download: https://assets.babylonjs.com/environments/environmentSpecular.env . Repository: https://github.com/BabylonJS/Assets . Repository-Lizenz: Creative Commons Attribution 4.0, https://github.com/BabylonJS/Assets/blob/master/LICENSE und https://creativecommons.org/licenses/by/4.0/ . | Unveränderte Datei, lokal anders benannt; als Beleuchtungs-/Reflexionsumgebung eingebunden. |
| `audio/motor.wav`, `tire.wav`, `impact.wav`, `boost.wav` | Originale deterministisch erzeugte Audioeffekte; Quellcode `art-source/build_audio.mjs`. | Vorgefertigte WAVs für Motor, Reifen, Kontakt und Turbo. Keine Stimmen oder Musik. Hörqualität noch durch Menschen zu beurteilen. |
| Pflaster-, Stein-, Stoff-, Laub- und Rasenatlanten | Originale deterministische Laufzeittexturen in `src/surface-textures.ts` und `src/slice-scene.ts`. | Kleine gekachelte Farb- und Normaltexturen; keine externen Fotos. |

Blender selbst: https://www.blender.org/ , freie Software, GNU GPL. Das lokale portable Werkzeug liegt unter `.tools/` und wird nicht mit Git verteilt. Die Lizenz des Werkzeugs wird dadurch nicht auf selbst erstellte Modelle übertragen; siehe https://www.blender.org/about/license/ .

Babylon.js / glTF-Loader: Apache-2.0; Paketlizenzen liegen in `node_modules/@babylonjs/*` und werden vom Lockfile festgelegt.
