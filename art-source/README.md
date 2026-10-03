# Editierbare Art-Pipeline des Stadion-Slices

Stand 03.10.2026. Alle Kart-, Gebäude-, Requisiten- und Itemmodelle sind originale Projektgeometrie. Der Parkbaum stammt von Poly Haven (CC0); Herkunft, Audio und Texturen stehen in `../public/assets/CREDITS.md`.

## Quellen und Laufzeit

- `hero-kart.blend`: neutraler Fahrer, Kart und fünf optionale Anbauten. Benannte Pivots für Räder, Lenkrad, Kopf und Schal; im Spiel animiert.
- `stadium-world.blend`: fiktives Stadion, Boulevard, Tor, Brunnen und Zypressen.
- `stadium-props.blend`: Tribünen, neutrale Zuschauersilhouetten, Kassen, Zielbrücke, Ladenfassaden, Parkbeete und fiktiver Bahnhof/Stadthintergrund.
- `items.blend`: vier benannte Eltern `direct`, `homing`, `trap`, `pickup`; drei gemeinsame Spielregeln plus Aufnahmekiste.
- `park-tree.blend`: reduzierter CC0-Baum mit gepackten Texturen; kann ohne Downloadcache bearbeitet werden.
- `public/assets/models/*.glb`: optimierte Spielmodelle. Kein Blender zum Spielen erforderlich.

Blender 4.5.3 LTS wurde kostenlos und portabel unter `.tools/blender-4.5.3-windows-x64` installiert. Das Programm und heruntergeladene Originale sind ignoriert und werden nicht per Git verteilt. Ein neuer Rechner benötigt Blender von https://www.blender.org/download/lts/4-5/ .

## Reproduktion mit PowerShell aus dem Projektordner

```powershell
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background --python art-source/build_slice.py
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background --python art-source/build_props.py
& .\.tools\blender-4.5.3-windows-x64\blender.exe --background --python art-source/build_items.py
node art-source/build_audio.mjs
npm run assets:optimize
npm run build
```

Generatoren überschreiben die jeweiligen `.blend`-Dateien. Manuelle Blenderänderungen deshalb zuerst separat sichern und direkt als GLB nach `.tools/raw-models/<name>.glb` exportieren, danach nur `assets:optimize` ausführen. GLB-Export mit Y-Up und angewendeten Modifikatoren; benannte Eltern erhalten.

Die Optimierung liest den Rohcache, dedupliziert/weldet und quantisiert Positionen mit 16 Bit, Normalen mit 12 Bit und passende UVs mit 14 Bit. JPEG88 wird nur für geeignete Karten verwendet; Laub mit Alphakanal bleibt erhalten. Quantisierung und JPEG sind nicht verlustfrei. Rohdateien und Werkzeugcache sind ignoriert, editierbare Quellen und optimierte Modelle werden lokal committed. Größen stehen in `../docs/evidence/slice-asset-optimization.json`.

## Externe Quelldaten

`prepare_tree.py` erwartet den offiziellen Tree-Small-02-glTF-Download mit 1K-Karten unter `.tools/tree-source/tree.gltf` samt Binärdatei/Texturen. Ein neuer Download ist nur bei erneuter Reduktion erforderlich; die gespeicherte `.blend` enthält bereits die reduzierte Geometrie und gepackte Karten. Ursprünglich 2.062.487, reduziert 134.998 Dreiecke. Getrennte Laub-/Holzbearbeitung erhält die Baumkrone.

Der aktuelle Himmel verwendet die offizielle Tonemapped-JPG-Variante von Poly Haven als 4K/2K-Panorama. Die frühere Imagegen-Datei wird nicht mehr geladen. Beide Varianten sind Texturen innerhalb der tatsächlichen 3D-Szene; G–L wurde nicht als Textur übernommen.

## Prüfung

Artassets im laufenden Spiel mit C (nah/fern/Fahrer) und V (Foto) prüfen. V pausiert die Simulation, zeigt aber dieselbe Babylon-Szene; keine externe Konzeptdarstellung. `tests/slice-browser.mjs`, `slice-race.mjs`, `slice-items.mjs` und `slice-touch.mjs` nutzen einen isolierten Chrome-CDP-Testbrowser auf Port 9223; Vite auf 4173. Nicht gleichzeitig auf dieselbe Browserseite ausführen. Der normale Launcher braucht diese Testwerkzeuge nicht.

Die neutralen Gesichter, Zubehörvarianten und Zuschauersilhouetten sind vorläufige Artassets. Historische Charakterwahl, Sarahs Ideen, Hörqualität und G–L-Stilabnahme bleiben gesondert zu prüfen.
