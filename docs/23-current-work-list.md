# Laufende Nutzeraufträge – 03.10.2026

Diese Liste bewahrt die während des Fahrtests ergänzten Aufträge von Marcel. Aktive Grundlage ist ausschließlich der gemeinsame neue Babylon-Stand; keine Altengine-/Archivarbeit. Ergebnisse erst nach Prüfung abhaken.

- [x] Dauerndes Umschauen durch freie Mausbewegung abstellen; ursprüngliche Drag-Lösung in allen drei Kameras geprüft, lokal 063febc.
- [x] Ruckeln bei gerader Fahrt/Kamera: gemeinsame interpolierte Renderposition eingebaut, Physik unverändert. Drei Tests (30/60/90/144 Hz, variable Frames, Teleport/Anglewrap/Unveränderlichkeit) und Build bestanden. Echter Browservergleich: bei konstant 16 m/s mittlere Abweichung der sichtbaren Bewegung bezogen auf Engine-Bildzeit von 2,50 m/s auf numerisch ~0; ungleichmäßige GPU-/Bildzeiten bleiben eine separate Grenze. Kein 60-FPS-Versprechen.
- [ ] Danach endgültige Mausbelegung gemäß letzter Präzisierung: links halten freies Umschauen, rechts halten Rückblick, E Items. Cursor während der Geste unsichtbar und unbewegt; bei Loslassen am ursprünglichen Ort sichtbar. Temporärer Pointer Lock, keine dauernde Bindung; Freigabe bei Escape/Fokusverlust/Menü/Neustart. Freieres Umschauen.
- [ ] Übertriebene Karosserie-/Motorvibration reduzieren. Dezentes Aufrichten beim Beschleunigen/hohem Tempo, sichtbares Einsinken hinten; Vorderräder behalten Bodenkontakt.
- [ ] Drift: auch beim Gegenlenken laden, ursprüngliche Driftrichtung erhalten, enger/weiter korrigieren statt sofortiger Umkehr oder starkem Rutschen. Kart-Racer-Vorbild Mario Kart als Orientierung; eigenständige vorläufige Werte, keine behauptete exakte Nintendo-Physik.
- [ ] Begrenzte Staubwolke hinter den Rädern, lesbares Drift-/Turbo-Feedback ohne unbeschränkte Partikel.
- [ ] Mehr historische Berlin-/Deutschland-Atmosphäre, Architektur/Requisiten und kritische Satire über Macht/Personenkult. Nutzer erlaubt Adler ohne Nationalsozialismus-/Hakenkreuzsymbolik; eigenständige Adlerform ohne Regimeabzeichen. Historische Figur-/Ideenfreigaben aus Projektregeln nicht stillschweigend als erledigt behandeln.
- [ ] Neues Nutzer-Item: Schäferhund für den Spieler als sichtbares Verfolger-Item statt Projektil; laufende Animation, Bellen, comicartige Trefferwolke. Silhouette/Modell editierbar; identische gemeinsame Treffer-/Fairnessregeln. Herkunft dieser Ergänzung: Marcel, keine belegte Sarah-Idee. Aktuelle Fahrermodelle bleiben vorläufige fiktive Karikaturen; kein fertiger historischer Adolf behaupten.
- [ ] Abschließend Build, erforderliche Modell-/Browserregression, echte Spielbelege, Quellen/Grundpfeiler/Progress aktualisieren und sicheren Teamabschluss nach main ausführen. Budget beobachten und geordnet sichern.

Der unvollständige Diktatsatz „Um bleiben. Weil die brauchen ja eigentlich gar nicht“ wurde auf ausdrücklichen Nutzerwunsch ignoriert; keine Aufgaben dadurch geändert.
