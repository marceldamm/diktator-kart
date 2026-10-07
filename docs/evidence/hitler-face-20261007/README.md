# CC0-Hitler: referenzgeführte Gesichtsiterationen, 07.10.2026

**Aktive Modellwahl:** Marcel wechselte nach dem kurzen Wolfenstein-Test ausdrücklich zurück auf den zuvor verwendeten Quaternius-CC0-Fahrer. Dieser ist die aktive Runtimefigur. Der pausierte Wolfenstein-Versuch wurde samt Quelldateien lokal unter `.tools/paused-wolfenstein-20261007/` archiviert; er ist nicht Teil dieses Pakets.

Auftrag: Marcel im Codex-Chat; [Issue #13](https://github.com/marceldamm/diktator-kart/issues/13).
Basis: Branch `codex/team-marcel-20261007-183328-214`, Ausgangscommit `90cc6d0`, lokale Modelländerung.

## Formreferenzen (angesehen, nicht als Spieltexturen übernommen)

- Front: [Bundesarchiv Bild 183-H1216-0500-002, Porträt von 1938](https://commons.wikimedia.org/wiki/File:1938_portrait_photograph_of_Adolf_Hitler.jpg). Zuschreibung Bundesarchiv, CC BY-SA 3.0 DE. Das Originalfoto ist weder als separate Quelldatei noch als Spieltextur im Repository; beschriftete, zugeschnittene Vergleichstafeln enthalten einen Fotoausschnitt als Entwicklungsbeleg.
- Profil: [Narodowe Archiwum Cyfrowe / Szukaj w Archiwach, Objekt 472371](https://www.szukajwarchiwach.gov.pl/jednostka/-/jednostka/6217943/obiekty/472371), Profilbild visuell im Browser angesehen. Die Suchmetadaten nennen 1933–1937; genauer Aufnahmezeitpunkt nicht unabhängig verifiziert. Nur Formreferenz, keine Bildkopie im Repository.

Beobachtete Formziele: schwerere Lider, weniger heroisch zugespitzte Kieferkontur, vollere untere Gesichtshälfte, längere Nase und flacherer Seitenscheitel. Offsets sind künstlerische Entscheidungen, keine Vermessung/Photogrammetrie. Schwarzweißbilder belegen keine exakte Haut-/Augenfarbe.

## Iterative Blender-Assetbilder

Ab R2 wurden Formänderungen als einzelne, nummerierte Durchgänge mit denselben orthografischen Kameras geprüft: 640×720, Ziel `(0, -0.43945324, 1.88709569)`, Maßstab 0,66 m, Winkel 0°/35°/90°, gleiche drei Studioleuchten, AgX/EEVEE. Die beschrifteten `overlay-r*-front.jpg` legen den Fotoausschnitt mit 48 % über das Render und zeigen beide außerdem einzeln; Quelle, Zuschreibung und Lizenz stehen oben. Die übrigen lokalen Rohbilder liegen unter `.tools/face-iteration-archive-20261007/`; eingecheckt sind die Overlays als Iterationsspur sowie R26/R28-Endansichten und R27s abgelehnter Profilversuch. Das ist ein Formvergleich, keine Vermessung/Photogrammetrie.

Aktueller lokaler Arbeitsstand **R28**: [Front-Overlay](overlay-r28-front.jpg), [Dreiviertelansicht](r28-threequarter.png), [Profil](r28-profile.png), [Sitzansicht](r28-seating.png) und [Sitzprofil](r28-seating-profile.png). Zum direkten Formvergleich sind außerdem [R26 Front](r26-front.png), [R26 Profil](r26-profile.png), [R26 Dreiviertel](r26-threequarter.png) und [R27 Profil](r27-profile.png) gespeichert. Die Vergleichsreihe R16–R28 hält jeweils dieselbe Renderkamera und Beleuchtung. R16/R22 mit stärker abgeflachter Krone zeigten kahle Kopfhaut und wurden verworfen. R19s kontrastreiche Falten wirkten wie Narben; R20s dunkle und lange Nasolabiallinien wie die zuvor entfernten „Barteln“; auch sie wurden verworfen. R23 war ein brauchbarer Zwischenstand. R24 verschlankte und bog die Brauen; R25 brachte schmalere Lider und vollere Wangen, kippte die Brauen aber zu stark und ließ den verkleinerten Kragen ausfransen. R26 behielt die ruhigere Brauenlinie, schmalere Lider und sichere Kragenform. R27s wenige Millimeter Kronenkürzung legten im Profil kahle Kopfhaut frei und wurden verworfen. R28 stellt den sicheren R26-Haaransatz wieder her und verbreitert Nasenspitze/Nasenflügel leicht. Der Overlayvergleich zeigt weiterhin klare Abweichungen bei Haarvolumen, Mundausdruck, Nase und Gesichtstextur. R28 ist ein lokaler Arbeitskandidat, keine fotogenaue oder menschlich abgenommene Nachbildung.

`after-seating.png`, `after-seating-profile.png`: neuer Fahrer mit tatsächlicher Grand-Prix-Karosserie; alte Fahrer und Varianten im Render ausgeblendet. 1000×720, Maßstab 4,5 m. Die `before-seating*`-Bilder verwendeten noch irrtümlich die Roadster-Variante und sind nur historische Sitzdiagnose, kein kontrollierter Fahrzeug-A/B-Vergleich. Die Editoransicht zeigte anfangs Varianten übereinander, weil nur Render-Sichtbarkeit gesetzt war; spätere Skriptkorrektur blendet auch den Viewport entsprechend aus. Marcel nahm den Vordergrundablauf zurück; künftig Hintergrundbilder verwenden.

Quelle: `art-source/build_cc0_driver.py`, `art-source/hitler_face.py`, `art-source/preview_cc0_driver.py`, Overlaygenerator `art-source/overlay_historical_reference.py`. Editierbare lokale Exportquelle unter `.tools/raw-models/cc0-driver-hitler.blend`, separate QA-Szene `qa-hitler-seated.blend`. Runtime-GLB `public/assets/models/cc0-driver-hitler.glb`.

## Kurze sichtbare Spielintegration

`runtime-seated.jpg`: älterer sichtbarer Chrome-Beleg auf `http://127.0.0.1:4173/`, aufgenommen vor R11–R13. Er belegt nicht den aktuellen Gesichtsexport. R28 wurde lokal mit Blender 4.5.3 gebaut, optimiert und in Front/Profil/Dreiviertel sowie im Grand-Prix-Kart gerendert. In der sichtbaren Chrome-Rennansicht war Hitlers schwarzer Suit im Runtime-GLB geladen; die Seitenansicht zeigte beide Arme am Lenkrad und angewinkelte Beine im Fußraum. Der genaue Pedalkontakt ist nicht sicher bestätigt. Die Blender-Kartansicht enthält falsch positionierte/fremde Teile und ist nur Assetvorschau. Der gezielte GLB-Test prüft Kopf, variable `COLOR_0`-Haut, Bart, Abwesenheit der Stirnlocke, Falten und schwarzen Anzug.

Alle sechs Fahrerwahlporträts waren in diesem Lauf einfarbig leer, während die Figuren im Rennen sichtbar waren. Separater Integrationsbefund, keine durch den Gesichtspass bewiesene Ursache. Kleidung, Hände/Füße/Pedale und vollständige historische Ähnlichkeit bleiben offen.
