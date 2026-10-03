# CURRENT WORKLIST – laufende Arbeit

[Langfristige Ziele](LONG-TERM-GOALS.md) · [Kurzer Änderungsverlauf](TEAM-CHANGES.md)

Diese Liste bewahrt die während des Fahrtests ergänzten Aufträge von Marcel. Aktive Grundlage ist ausschließlich der gemeinsame neue Babylon-Stand; keine Altengine-/Archivarbeit. Ergebnisse erst nach Prüfung abhaken.

**Aktuell:** Streckenatmosphäre und historische Details. **Nächster Schritt:** Realitätsnaher Fahrerpass, Sprache/F-Hupe und abschließender Teamabschluss. **Arbeitsbranch:** codex/team-marcel-20261003-202647-623. Neue Maus-/Renderkorrekturen lokal gesichert; gemeinsamer GitHub-Abschluss nach den Paketen.

- [x] Dauerndes Umschauen durch freie Mausbewegung abstellen; ursprüngliche Drag-Lösung in allen drei Kameras geprüft, lokal 063febc.
- [x] Ruckeln bei gerader Fahrt/Kamera: gemeinsame interpolierte Renderposition eingebaut, Physik unverändert. Drei Tests (30/60/90/144 Hz, variable Frames, Teleport/Anglewrap/Unveränderlichkeit) und Build bestanden. Echter Browservergleich: bei konstant 16 m/s mittlere Abweichung der sichtbaren Bewegung bezogen auf Engine-Bildzeit von 2,50 m/s auf numerisch ~0; ungleichmäßige GPU-/Bildzeiten bleiben eine separate Grenze. Kein 60-FPS-Versprechen. **Nutzer-Fahrtest danach:** deutlich flüssiger, fühlt sich sehr viel besser an; positiver menschlicher Befund, keine Hardwaremessung.
- [x] Endgültige Mausbelegung gemäß letzter Präzisierung: links halten freies Umschauen, rechts halten Rückblick, E Items. Cursor während der Geste unsichtbar und unbewegt; bei Loslassen am ursprünglichen Ort sichtbar. Temporärer Pointer Lock, keine dauernde Bindung; Freigabe bei Escape/Fokusverlust/Menü/Neustart. Freieres Umschauen. **Nutzerfehler korrigiert:** sofortigen Rücksprung durch lostpointercapture beim Lock verhindert. Alle drei Kameras im Browser geprüft; eigener Nutzercheck für Cursorposition bleibt sinnvoll.
- [x] Übertriebene Karosserie-/Motorvibration reduzieren. Dezentes Aufrichten beim Beschleunigen/hohem Tempo, sichtbares Einsinken hinten; Vorderräder behalten Bodenkontakt.
- [x] Drift: auch beim Gegenlenken laden, ursprüngliche Driftrichtung erhalten, enger/weiter korrigieren statt sofortiger Umkehr oder starkem Rutschen. Kart-Racer-Vorbild Mario Kart als Orientierung; eigenständige vorläufige Werte, keine behauptete exakte Nintendo-Physik.
- [x] Begrenzte Staubwolke hinter den Rädern, lesbares Drift-/Turbo-Feedback ohne unbeschränkte Partikel.
- [ ] Mehr historische Berlin-/Deutschland-Atmosphäre, Architektur/Requisiten und kritische Satire über Macht/Personenkult. Nutzer erlaubt Adler ohne Nationalsozialismus-/Hakenkreuzsymbolik; eigenständige Adlerform ohne Regimeabzeichen. Historische Figur-/Ideenfreigaben aus Projektregeln nicht stillschweigend als erledigt behandeln.
- [x] Neues Nutzer-Item: Schäferhund für den Spieler als sichtbares Verfolger-Item statt Projektil; laufende Animation, Bellen, comicartige Trefferwolke. Silhouette/Modell editierbar; identische gemeinsame Treffer-/Fairnessregeln. 
- [ ] Präzisierung des Figurenziels: erkennbare, realitätsnahe 3D-Abbilder der tatsächlichen historischen Personen, insbesondere Hitler, statt erfundener Ersatzfiguren. Satirische Inszenierung, keine Regimesymbole. Glaubwürdige, realitätsnahe Spielwelt. Aktueller Modellstand noch nicht entsprechend ausgearbeitet; neue Modelle anhand wirklicher Laufzeitbilder bewerten.
- [ ] Sprachausgabe: alle verwendeten Texte und Aussprache prüfen, unverständliche/merkwürdige Wörter korrigieren, weniger mechanische Betonung und freundlichere, lebendige Stadionsprecherin. Gehört nur als geprüft melden, wenn tatsächlich angehört.
- [ ] F als Hupe: individueller kurzer Sprachclip je Fahrer mit Abklingzeit. Echte historische Mitschnitte/Zitate recherchieren, belegte Person/Quelle und kostenlose Nutzungsrechte dokumentieren, unproblematische Inhalte auswählen. Ohne geklärte Mitschnittrechte keine erfundene Authentizität behaupten; vorläufiges eigenes Parodieaudio klar kennzeichnen.
- [x] Drei zentrale Dateien im Hauptordner, langfristige Ziele, kurzer Teamverlauf und Sarah-Nachricht eingerichtet; Start-/Abschlussregeln verankert. App-Tabs angefordert (queued, öffnen beim Zurückkehren in diese Sitzung).
- [x] Sichtbaren Test-Chrome zum Mitverfolgen geöffnet; vorherigen eigenen Headless-Browser beendet.
- [ ] Abschließend Build, erforderliche Modell-/Browserregression, echte Spielbelege, Quellen/Grundpfeiler/Progress aktualisieren und sicheren Teamabschluss nach main ausführen. Budget beobachten und geordnet sichern.


## Nachricht an Sarah – zum Kopieren

Hallo Sarah, wir arbeiten ab jetzt gemeinsam am neuen Babylon.js-Spielstand. Die frühere Engine und alte Ordner sind archiviert und werden nicht weiterentwickelt. Die neue Grundlage hat echte 3D-Assetproduktion, Fahrphysik, sechs Karts, Rennen, Items und drei Kameras; die Grafik und realitätsnahen historischen Fahrer bauen wir weiter aus. Sie ist deutlich leistungsfähiger als unsere alte Ausgangsbasis, bleibt aber noch ein unfertiges Spiel.

Du musst GitHub nicht selbst beherrschen: Öffne unseren aktiven Projektordner in Codex und schreibe zu Beginn:

```text
Projektstart. Ich bin Sarah. Hole den neuesten gemeinsamen Babylon-Stand von GitHub, sichere meine lokalen Änderungen und integriere parallele Änderungen ohne etwas zu verlieren. Lies AGENTS.md, START-HERE.md und unsere drei Arbeitsdateien CURRENT-WORKLIST.md, LONG-TERM-GOALS.md und TEAM-CHANGES.md. Öffne sie nach der Synchronisierung als drei Tabs in der Codex-App. Zeige kurz, was aktuell bearbeitet wird und was als Nächstes ansteht. Danach: [dein Auftrag].
```

Für Marcel gilt derselbe Text mit seinem Namen. Codex prüft lokale/GitHub-Änderungen und Überschneidungen und hilft bei der Zusammenführung. Bei echten widersprüchlichen Entscheidungen erhält es beide Versionen und fragt uns. Gemeinsamer geprüfter Stand ist main; gearbeitet wird auf eigenem Arbeitsbranch. Unveröffentlichte Dateien auf deinem PC sind nicht in Marcels Sicherung enthalten und werden beim ersten Umstieg gesondert bewahrt; Anleitung dafür in docs/21-team-workflow.md.

Unsere Arbeitsgrundlage: **CURRENT-WORKLIST.md** = aktuelle Wünsche, Fehler und Aufgaben mit sichtbarem Status; **LONG-TERM-GOALS.md** = große Ziele/Meilensteine, Grafik, Fahrer, Strecke, Audio, Geräte und später Multiplayer; **TEAM-CHANGES.md** = kurzer gemeinsamer Änderungsverlauf. Neue Wünsche darfst du jederzeit diktieren und sagen: „In CURRENT-WORKLIST.md/24 aufnehmen.“ Nach Abschluss aktueller Arbeit schlägt die KI passende nächste Pakete aus LONG-TERM-GOALS.md vor. Der ausführliche technische Nachweis bleibt in 17 und muss nicht jedes Mal komplett gelesen werden.

Zum Arbeitsende:

```text
Projektabschluss. Prüfe meinen Stand, aktualisiere unsere CURRENT-WORKLIST.md, LONG-TERM-GOALS.md und TEAM-CHANGES.md sowie die notwendigen technischen Belege, sichere einen lokalen Commit, hole den neuesten Teamstand, integriere Änderungen und veröffentliche das geprüfte Ergebnis im gemeinsamen main. Kein Force-Push und keine fremde Arbeit verwerfen. Melde, was tatsächlich auf GitHub gesichert ist und was offen bleibt.
```

Spiel öffnen: **Diktator-Kart-starten.cmd** im aktiven Ordner. **Projekt-starten.cmd** und **Projekt-abschliessen.cmd** erledigen den einfachen Git-Fall; bei Konflikten oder ungesicherten Dateien Codex helfen lassen. Der Spielstarter allein lädt keine GitHub-Änderungen herunter.

Für Spielentwicklung nutzen wir **GPT-6.1 Sol mit hoher Denkintensität**; für besonders schwierige Analysen/Probleme kann **GPT-6 Astra** sinnvoll sein, für kleine Routineaufgaben **Luna**. Das ist eine praktische Aufgabenwahl, kein Versprechen, dass eine Einstellung automatisch perfekte Ergebnisse liefert. Ein guter Prompt nennt das sichtbare Ziel und verlangt echte Browserbilder/Fahrtests. Genaueres und offizielle Quellen im TEAM-HANDBOOK.md. Limits im Blick behalten; keine Zusatzkosten/Resets automatisch auslösen.

Wir nutzen die KI für Umsetzung, Dokumentation und Git-Hilfe. Je konkreter unsere Beobachtungen aus dem Spiel, desto besser kann sie verbessern. Wir stimmen gemeinsame Kreativentscheidungen ab und lassen neue Änderungen zuerst prüfen.
