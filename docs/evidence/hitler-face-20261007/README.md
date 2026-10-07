# CC0-Hitler: erster Gesichtspass, 07.10.2026

Auftrag: Marcel im Codex-Chat; [Issue #13](https://github.com/marceldamm/diktator-kart/issues/13).
Basis: Branch `codex/team-marcel-20261007-183328-214`, Ausgangscommit `90cc6d0`, lokale Modelländerung.

## Formreferenzen (angesehen, nicht als Spieltexturen übernommen)

- Front: [Bundesarchiv Bild 183-H1216-0500-002, Porträt von 1938](https://commons.wikimedia.org/wiki/File:1938_portrait_photograph_of_Adolf_Hitler.jpg). Zuschreibung Bundesarchiv, CC BY-SA 3.0 DE. Keine Bildkopie im Repository oder fotografische Textur im Modell.
- Profil: [Narodowe Archiwum Cyfrowe / Szukaj w Archiwach, Objekt 472371](https://www.szukajwarchiwach.gov.pl/jednostka/-/jednostka/6217943/obiekty/472371), Profilbild visuell im Browser angesehen. Die Suchmetadaten nennen 1933–1937; genauer Aufnahmezeitpunkt nicht unabhängig verifiziert. Nur Formreferenz, keine Bildkopie im Repository.

Beobachtete Formziele: schwerere Lider, weniger heroisch zugespitzte Kieferkontur, vollere untere Gesichtshälfte, längere Nase und flacherer Seitenscheitel. Offsets sind künstlerische Entscheidungen, keine Vermessung/Photogrammetrie. Schwarzweißbilder belegen keine exakte Haut-/Augenfarbe.

## Blender-Assetbilder

`before-front.png`, `before-threequarter.png`, `before-profile.png`: ursprünglicher CC0-Kopf. `after-*`: erster Gesichtspass. Feste orthografische Kamera, 640×720, Ziel `(0, -0.43945324, 1.88709569)`, Maßstab 0,66 m, Winkel 0°/35°/90°, identische drei Studioleuchten, AgX/EEVEE. `comparison-front.jpg` zeigt die Frontansichten nebeneinander. Kein Spielbild und keine menschliche Ähnlichkeitsabnahme.

`after-seating.png`, `after-seating-profile.png`: neuer Fahrer mit tatsächlicher Grand-Prix-Karosserie; alte Fahrer und Varianten im Render ausgeblendet. 1000×720, Maßstab 4,5 m. Die `before-seating*`-Bilder verwendeten noch irrtümlich die Roadster-Variante und sind nur historische Sitzdiagnose, kein kontrollierter Fahrzeug-A/B-Vergleich. Die Editoransicht zeigte anfangs Varianten übereinander, weil nur Render-Sichtbarkeit gesetzt war; spätere Skriptkorrektur blendet auch den Viewport entsprechend aus. Marcel nahm den Vordergrundablauf zurück; künftig Hintergrundbilder verwenden.

Quelle: `art-source/build_cc0_driver.py`, `art-source/hitler_face.py`, `art-source/preview_cc0_driver.py`. Editierbare lokale Exportquelle unter `.tools/raw-models/cc0-driver-hitler.blend`, separate QA-Szene `qa-hitler-seated.blend`. Runtime-GLB `public/assets/models/cc0-driver-hitler.glb`.

## Kurze sichtbare Spielintegration

`runtime-seated.jpg`: echtes sichtbares Chrome-Fenster, `http://127.0.0.1:4173/`, identifiziert über `/__diktator/status`: Root `D:\Diktator-Kart`, obiger Branch/Commit, Modus dev. Havanna-Grand-Prix-Countdown, Hitler im Grand-Prix-Kart, Fotomodus, 1718×1270. Das Bild zeigt die neue Gesichtsgeometrie; aufgenommen vor der letzten Korrektur des Hautfarbexports. Der endgültige `COLOR_0`-Tint ist zusätzlich technisch im GLB geprüft, nicht auf diesem Laufzeitbild abgenommen. Keine Konsolenfehler beim Abschlussabgleich. Eigener Tab anschließend geschlossen; keine Nutzerfenster/Server beendet.

Alle sechs Fahrerwahlporträts waren in diesem Lauf einfarbig leer, während die Figuren im Rennen sichtbar waren. Separater Integrationsbefund, keine durch den Gesichtspass bewiesene Ursache. Kleidung, Hände/Füße/Pedale und vollständige historische Ähnlichkeit bleiben offen.
