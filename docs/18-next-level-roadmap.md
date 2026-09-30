# Next-Level-Ausbau

Arbeitsstand: 29. September 2026. Diese Liste baut auf dem vorhandenen Singleplayer-Rennen auf und markiert erledigte Schritte, damit Grafik-, Audio- und Fahrgefühl-Arbeit überprüfbar bleibt.

## Produktionspass 1: klare Rückmeldung

- [x] Eigenes Hauptstadt-Key-Art im Hauptmenü.
- [x] Sechs Karts mit klarerer Silhouette, Heckflügel, Metallteilen und Front-/Rücklichtern.
- [x] Sektor-Schilder, Strecken-Beacons und Rhythmusmarkierungen auf den Geraden.
- [x] Minikarte mit Spieler und Bots, dazu Tempometer.
- [x] Kamera reagiert auf Tempo, Lenkeingabe und Boost.
- [x] Motorharmonie, Driftreifen, Fahrtwind und synthetische Item-Rückmeldungen.
- [x] 24 Sprecherclips mit emotionaler deutscher Neuralstimme und WAV-Fallback.
- [x] Renderauflösung auf maximal 1,5 Geräte-Pixel pro CSS-Pixel begrenzen.
- [ ] Laufende Hör- und Sichtabnahme mit Sarah auf Zielgeräten.

## Produktionspass 2: Spielwelt und Strecke

- [ ] Einen vollständigen Sektor mit eigens modellierten GLB-Assets als Qualitätsreferenz bauen.
- [x] Ein eigenes Zielportal als optimiertes GLB mit sechs PBR-Materialgruppen erzeugen und im Browser laden.
- [x] Die Hauptstadt-Runde als Stadionkurs mit zwei langen Geraden und gerundeten Haarnadel-Enden neu lesbar machen.
- [x] Botroute, Checkpoints, Minikarte, Itemlinien und Oberflächengriff auf denselben Streckenplan abstimmen.
- [x] Festgefahrene oder außerhalb der Stadiongrenzen liegende Bots ohne geschenkten Checkpoint-Fortschritt auf die bekannte Rennlinie zurückholen; fünf-Bot-Browserlanglauf prüft die Bounds.
- [ ] Kurvengeometrie, Abkürzung, Sprünge und alternative Linien in echten Fahrversuchen neu abstimmen.
- [x] Bewegliche Welt-Event-Objekte ausnehmen und den statischen Strecken-Renderbestand per PlayCanvas-Batchgruppe bündeln; Browserlauf bestätigt 66 statt 119 Draw Calls.
- [ ] Wiederholte Objekte instanzieren und Sichtweiten auf Zielgeräten abstimmen.
- [ ] Runde drei mit einer deutlich eskalierenden, aber kollisionssicheren Weltinszenierung versehen.

## Produktionspass 3: Fahrgefühl und Audio

- [x] Asphalt, Papier-Abkürzung und Gras mit unterschiedlichen Gripwerten ausstatten und per Regression absichern.
- [x] Sichtbare Stahlsektoren mit eigenem, per Regression geprüften Gripwert ergänzen.
- [x] Drift-Reifenspuren als zeitlich begrenzten, festen Effekt-Pool ergänzen.
- [x] Itemkisten und Item-/Raketen-Treffer mit einem gepoolten, per „Reduzierte Effekte“ abschaltbaren Gold-/Rot-/Schild-Partikelstoß versehen.
- [ ] Landung, Strecken-/Stempel-Kollisionen und sichtbare Raketenflugspur mit eigenen Effekten versehen.
- [x] Prozeduralen Rennscore mit separat regelbarer Lautstärke und energischer Schlussrunden-Variante ergänzen.
- [ ] Sprecher-Mischung, Lautstärke-Ducking und Auslöseprioritäten im vollständigen Rennen abnehmen.
- [ ] Kartwerte und Fahrverhalten der sechs Fahrer klar unterscheidbar und fair balancieren.
- [ ] Windschatten, Rempeln und Fehler-Recovery der Bots als Rennmechaniken testen.

## Produktionspass 4: Übersicht und Abschluss

- [ ] Rennpositionen, Angriffsrichtung, Driftladung und Rundenfortschritt in einer finalen HUD-Komposition zusammenführen.
- [x] Ergebnisbildschirm um Platzierungsmedaille, Rundenzeiten und eingesetzte Items erweitern.
- [ ] Replay- und Fotomodus als optionale spätere Spielmodi prüfen.
- [ ] Speicherverbrauch, Draw Calls, Renderzeit und Bundlegröße über mehrere vollständige Rennen messen.
- [ ] Drei vollständige Rennen, alle Items und Spezialfähigkeiten sowie schwächere Auflösungen sichtbar abnehmen.

## Qualitätsgrenze

Neue Kulisse bleibt zunächst rein dekorativ, bis Strecke, Checkpoints und Botroute gemeinsam angepasst und getestet sind. Spielrelevante Änderungen an Linien, Grip, Itembalance oder Gegnerverhalten brauchen jeweils einen messbaren Fahrvergleich und eine dokumentierte Browserabnahme.

## Messnotiz: Browserlauf mit statischem Strecken-Batching (30. September 2026)

- Gleicher headless Chrome-/SwiftShader-Lauf: Strecken-Draw-Calls von 119 auf 66 gesunken (rund 45 %).
- Mit Batchingszene: 40.244 Dreiecke, rund 9,0 MiB gemeldeter VRAM, 1,5 ms Renderzeit, 1,3 ms Updatezeit und 0,3 ms Physikzeit im Mess-Snapshot.
- Headless-Limitierung: 25 FPS bei 33,4 ms Framezeit; FPS-/Framewerte sind durch SwiftShader und Taktung begrenzt und nicht als Zielgeräte-Benchmark zu lesen.
- Regression: zehn Fahr-/Driftfälle, fünf Bots innerhalb der Stadiongrenzen, mindestens ein vollendeter Bot-Rundenwechsel, geladenes Zielportal, keine Browserausnahme.
- Folgeschritt: echte Hardware messen; Ergebnis unter mehreren kompletten Rennen stabilisieren. VRAM, GPU-Zeit und Bildrate bleiben vorläufige Einzelmesswerte.
- Bundle-Experiment: separater, hashbarer PlayCanvas-Chunk (1.155 kB / 305 kB gzip) und Game-Entry (90 kB / 30 kB gzip); zusammen 335 kB gzip, praktisch unverändert. Der echte Production-Preview besteht den gleichen Browserlauf. Der Engine-Einzelchunk liegt weiterhin über Vites 500-kB-Hinweis und muss nicht allein zur Warnungsunterdrückung weiter zerlegt werden.
