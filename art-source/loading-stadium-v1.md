# Konzeptillustration für den frühen Ladebildschirm

Erstellt am 03.10.2026 mit dem integrierten OpenAI-Imagegen, ausdrücklich vom Nutzer freigegeben. `references/visuals/style-comparison-02-c-a-refined.png` wurde als Stilreferenz mitgegeben (helle G/J-Richtung), nicht als Spieltextur kopiert.

Original: `loading-stadium-v1.png`, 1672 × 941, 2.734.128 Bytes. Laufzeit: `../public/assets/textures/loading-stadium-v1.webp`, gleiche Pixelgröße, WebP Qualität 86, 376.504 Bytes. Nur Dateiformat/Kompression geändert. Die Illustration enthält keine eingebrannten UI-Texte; Überschrift, Ladebalken und Fehlermeldungen bleiben editierbares HTML.

Motivauftrag: breite 16:9-Komposition; helle satirische Berlin-/Stadionwelt, detailreiche rote und goldene Karts, eigenständiger fiktiver erwachsener Fahrer mit Uniform, Umhang und Sonnenbrille, Rivalen, neoklassische Architektur mit Kupferkuppeln, warmer Nachmittag. Hauptfigur rechts; links ruhiger Platz für UI. Keine historischen Personen oder politischen Symbole, keine kopierte Referenzkomposition, keine Schrift oder UI im Bild.

Nutzungsgrundlage: für dieses Projekt erzeugtes KI-Bild, kein heruntergeladenes Fremdasset; keine CC0- oder exklusive Urheberschaftszusage. Kein zusätzlicher Kauf/Assetdienst. Die Quelle bleibt als PNG editierbar. Dies ist **Konzeptkunst für die Ladephase**, keine Laufzeit-3D-Geometrie und kein Beleg dafür, dass G–L im Spiel erreicht wird. Der Ladebildschirm kennzeichnet das ausdrücklich. Nach tatsächlicher Szenenbereitschaft und erstem Renderbild übernimmt das Babylon-Menü.

Reproduktion der Dateiformatkonvertierung:

```powershell
node --input-type=module -e "import sharp from 'sharp'; await sharp('art-source/loading-stadium-v1.png').webp({quality:86}).toFile('public/assets/textures/loading-stadium-v1.webp');"
```

Das erzeugte Motiv selbst ist nicht deterministisch aus dem Prompt reproduzierbar; die gespeicherte PNG ist die verbindliche Rasterquelle. Keine Änderungen an der 3D-Assetpipeline.
