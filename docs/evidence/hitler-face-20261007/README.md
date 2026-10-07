# CC0-Hitler: referenzgeführte Gesichtsiterationen, 07.10.2026

**Aktive Modellwahl:** Marcel wechselte nach dem kurzen Wolfenstein-Test ausdruecklich zurueck auf den zuvor verwendeten Quaternius-CC0-Fahrer. Dieser ist die aktive Runtimefigur. Der pausierte Wolfenstein-Versuch wurde samt Quelldateien lokal unter `.tools/paused-wolfenstein-20261007/` archiviert; er ist nicht Teil dieses Pakets.

Auftrag: Marcel im Codex-Chat; [Issue #13](https://github.com/marceldamm/diktator-kart/issues/13).
Basis: Branch `codex/team-marcel-20261007-183328-214`, Ausgangscommit `90cc6d0`, lokale Modelländerung.

## Formreferenzen (angesehen, nicht als Spieltexturen übernommen)

- Front: [Bundesarchiv Bild 183-H1216-0500-002, Portraet von 1938](https://commons.wikimedia.org/wiki/File:1938_portrait_photograph_of_Adolf_Hitler.jpg). Zuschreibung Bundesarchiv, CC BY-SA 3.0 DE. Das Originalfoto ist weder als separate Quelldatei noch als Spieltextur im Repository; beschriftete, zugeschnittene Vergleichstafeln enthalten einen Fotoausschnitt als Entwicklungsbeleg.
- Profil: [Narodowe Archiwum Cyfrowe / Szukaj w Archiwach, Objekt 472371](https://www.szukajwarchiwach.gov.pl/jednostka/-/jednostka/6217943/obiekty/472371), Profilbild visuell im Browser angesehen. Die Suchmetadaten nennen 1933-1937; genauer Aufnahmezeitpunkt nicht unabhaengig verifiziert. Nur Formreferenz, keine Bildkopie im Repository.

Beobachtete Formziele: schwerere Lider, weniger heroisch zugespitzte Kieferkontur, vollere untere Gesichtshälfte, längere Nase und flacherer Seitenscheitel. Offsets sind künstlerische Entscheidungen, keine Vermessung/Photogrammetrie. Schwarzweißbilder belegen keine exakte Haut-/Augenfarbe.

## Iterative Blender-Assetbilder

Ab R2 wurden Formaenderungen als einzelne, nummerierte Durchgaenge mit denselben orthografischen Kameras geprueft: 640x720, Ziel `(0, -0.43945324, 1.88709569)`, Massstab 0,66 m, Winkel 0/35/90 Grad, gleiche drei Studioleuchten, AgX/EEVEE. Die beschrifteten `overlay-r*-front.jpg` legen den Fotoausschnitt mit 48 % ueber das Render und zeigen beide ausserdem einzeln; Quelle, Zuschreibung und Lizenz stehen oben. Am 08.10. wurde der Blender-Crop an Haaransatz/Augenreihe angepasst und die vorhandene Overlayserie R10-R28 einheitlich neu gerechnet. Ausgewaehlte neuere Overlays bleiben in diesem Ordner; rohe Zwischenrenders liegen lokal unter `.tools/face-iteration-archive-20261008/`. Das ist ein Formvergleich, keine Vermessung/Photogrammetrie.

Vorheriger veroeffentlichter Stand **R28**: [Front-Overlay](overlay-r28-front.jpg), [Dreiviertelansicht](r28-threequarter.png), [Profil](r28-profile.png), [Sitzansicht](r28-seating.png) und [Sitzprofil](r28-seating-profile.png). Seit PR #18 (Merge `1697827`) veroeffentlichter Stand **R67**: [Front-Overlay](overlay-r67-test-front.jpg), [Front](r67-test-front.png), [Dreiviertelansicht](r67-test-threequarter.png), [Profil](r67-test-profile.png), [Sitzansicht](r67-test-seating.png) und [Sitzprofil](r67-test-seating-profile.png). Ausgewaehlte Vergleichsoverlays: [R56](overlay-r56-front.jpg) Ausgangspunkt, [R60](overlay-r60-test-front.jpg) moderatere Mundwinkel, [R61](overlay-r61-test-front.jpg) verworfene Kopfhautfreilegung, [R63](overlay-r63-test-front.jpg) vollere untere Gesichtskontur, [R65](overlay-r65-test-front.jpg) klarere flache Falten und [R66](overlay-r66-test-front.jpg) flachere Brauen. R67 verlaengert/senkt die Nase gegenueber R66 um 2 mm; die Profilansicht rueckt leicht naeher an die Archivform. Runtime-GLB: 1.078.420 Byte. R67 bleibt stilisiert und nicht menschlich abgenommen; Haarvolumen, Augen, Mund und Hautdetails weichen sichtbar von der Referenz ab.

`after-seating.png`, `after-seating-profile.png`: neuer Fahrer mit tatsaechlicher Grand-Prix-Karosserie; alte Fahrer und Varianten im Render ausgeblendet. 1000x720, Massstab 4,5 m. Die `before-seating*`-Bilder verwendeten noch irrtuemlich die Roadster-Variante und sind nur historische Sitzdiagnose, kein kontrollierter Fahrzeug-A/B-Vergleich. Die Editoransicht zeigte anfangs Varianten uebereinander, weil nur Render-Sichtbarkeit gesetzt war; spaetere Skriptkorrektur blendet auch den Viewport entsprechend aus. Marcel nahm den Vordergrundablauf zurueck; kuenftig Hintergrundbilder verwenden.

Quelle: `art-source/build_cc0_driver.py`, `art-source/hitler_face.py`, `art-source/preview_cc0_driver.py`, Overlaygenerator `art-source/overlay_historical_reference.py`. Editierbare lokale Exportquelle unter `.tools/raw-models/cc0-driver-hitler.blend`, separate QA-Szene `qa-hitler-seated.blend`. Runtime-GLB `public/assets/models/cc0-driver-hitler.glb`.

## Kurze sichtbare Spielintegration

`runtime-seated.jpg` ist ein aelterer sichtbarer Chrome-Beleg vor R11-R13 und belegt R67 nicht. Fuer R67 wurde am 08.10.2026 die bestehende sichtbare Chrome-Sitzung auf `http://127.0.0.1:4173/` im Grand Prix geprueft: schwarzer Anzug geladen, Haende am Lenkrad, Beine angewinkelt; Fuesse/Pedale waren verdeckt. Danach per Escape ins Menue zurueckgekehrt. Diese Laufzeitpruefung wurde nicht als Bilddatei gesichert; daher ist sie nur als in-session Beobachtung dokumentiert. R67 wurde mit Blender 4.5.3 in Front/Profil/Dreiviertel/Sitzansichten gerendert. Die Blender-Kartansicht enthaelt falsch positionierte/fremde Teile und ist nur Assetvorschau. Der gezielte GLB-Test prueft Kopf, variable `COLOR_0`-Haut, Bart, Abwesenheit der Stirnlocke, Falten und schwarzen Anzug.

Alle sechs Fahrerwahlporträts waren in diesem Lauf einfarbig leer, während die Figuren im Rennen sichtbar waren. Separater Integrationsbefund, keine durch den Gesichtspass bewiesene Ursache. Kleidung, Hände/Füße/Pedale und vollständige historische Ähnlichkeit bleiben offen.
