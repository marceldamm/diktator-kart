# Codex Autonomous Session Report

## Zusammenfassung

Der bestehende Diktator-Kart-Prototyp wurde in mehreren Passes erweitert und kritisch nachgeprüft: lesbarer Stadionkurs, stärkere Kart-/HUD-/Welt-Rückmeldung, erneuerte lokale Audioansagen, stabilisierte Kamera, Spieler-Recovery sowie Tests für Fahrverhalten und Checkpoint-Recovery. Der konkrete bekannte 180°-Kamerafehler ließ sich im automatisierten Versuch nicht als vollständiger Überschlag reproduzieren; die Quaternion-/Up-/Blickrichtungsmessungen deckten aber einen echten problematischen Kameraübergang beim Respawn auf, der behoben wurde.

Die abschließende Production-Browserfahrt bestand zehn Steuer- und Kamerafälle, einschließlich schneller Richtungswechsel und eines absichtlichen 600-m-Teleports. Es gab keine Browserausnahmen. Der Produktions-Build, TypeScript, ESLint sowie Fahr-, Rad- und Speicherregressionen sind erfolgreich. Eine weibliche deutsche Piper-Stimme ist mit vollständigem Clipset lokal verfügbar; ihre subjektive Klangqualität wurde mangels hörbarer Zielgerät-Abnahme nicht bewertet.

Abschlusszeit: 30. September 2026, ca. 01:32 Uhr CEST. Eine genaue aktive Arbeitsdauer ist aus den verfügbaren Zeitdaten nicht zuverlässig ableitbar.

## Ausgangszustand

- Der Kurs und die bisherigen Systeme waren fahrbar, wirkten visuell jedoch noch prototypisch: wenig räumliche Orientierung und ein überschaubares Strecken-/Umgebungsbild.
- Die Follow-Kamera setzte nach Teleports keine robuste Historie zurück. Sie mischte `lookAt` mit anschließendem Euler-Überschreiben/Roll, eine anfällige Kombination nahe großer Yaw-Winkel.
- Bots besaßen bereits einen Strecken-Recovery-Pfad; der Spieler hatte keinen gleichwertigen sicheren Rücksetzpunkt.
- Es gab 24 neural erzeugte deutsche männliche Sprecherclips mit älteren WAVs als Fallback. Eine weibliche Rolle fehlte.
- Die Projekt-Buildpipeline erzeugte einen sehr großen PlayCanvas-Engine-Chunk; frühere aggressivere Chunking-Versuche waren laufzeitunsicher und wurden bereits verworfen.
- Der Arbeitsbaum enthielt zu Beginn der vorherigen Arbeitsphase keine fremden ungesicherten Änderungen. Die hier aufgeführten Änderungen sind nicht committet; Sarahs oder andere Teamänderungen wurden nicht zurückgesetzt.

## Durchgeführte Arbeiten

- Bereits im vorherigen Ausbaupass: thematischer Stadionkurs mit Streckenführung, Checkpoints, Sektor-Landmarken, Start/Ziel-Portal, Minikarte und besser lesbarer Streckenorientierung.
- Kart-Modelle, Animationen, Oberflächen-/Gripreaktionen, Driftspuren, Item-/Trefferpartikel, Resultatkarte und HUD-Feedback ausgebaut.
- Fünf Bots samt Streckenrouting, Rundenfortschritt und Recovery innerhalb der Stadiongrenzen integriert bzw. nachgeprüft.
- Prozeduraler Motor-/Reifen-/Wind-Sound, Effektsignale und separat regelbare, lokale Rennmusik weiterentwickelt.
- Player-Recovery und stabile Kameraübergänge im aktuellen kritischen Pass ergänzt.
- 24 zusätzliche weibliche deutsche Sprachclips erzeugt; Sprecherwechsel im Announcer eingebaut und dokumentiert.
- Git-Arbeitsbaum, Build, Browserlauf, Regressionen, Stimme-Dateien und Screenshot geprüft. Nichts committet.

## Kamera

### Untersuchung und Änderungen

`FollowCameraController` verwendet nun eine explizite Welt-Up-Achse, Quaternionen für den dezenten kamerarelativ komponierten Roll und eine normalisierte kürzeste Yaw-Interpolation. Position, Blickziel und Yaw werden exponentiell geglättet; Geschwindigkeit/Boost beeinflussen Abstand und FOV subtil. Ein expliziter Reset initialisiert die Kamera bei Rennneustart. Bei einer Recovery wird die Kamera-Historie mit Kart und Blickziel verschoben, statt die Weltorientierung hart auf einen neuen Winkel zu setzen.

Das Symptom war nicht bloß ein einzelner falscher Euler-Wert: Nach einem abrupten Kart-Teleport konnten vorherige Kamera-/Kart-Position, Blickziel und neue Rennpose für einen Frame auseinanderlaufen. Der Euler-Roll-Override machte die Orientierung zusätzlich mehrdeutig. Das wurde durch Quaternion-Roll, Welt-Up-`lookAt`, Teleport-Rebase und eine dedizierte Kamera-Rebase beim Spieler-Respawn ersetzt.

### Messungen

Der finale Production-CDP-Lauf erfasste 10 Fahrfälle. Über alle Kamera-Samples: minimale Up-Ausrichtung 0,9715, minimale Blickausrichtung zum Kart 0,9724, größter Rotationsschritt 8,80° pro 50-ms-Messintervall. Im `camera-spin`-Fall allein: min. Up 0,9731, min. Blickausrichtung 0,9726, max. Rotationsschritt 8,80°. Der absichtliche Teleport wurde auf eine sichere Streckenposition zurückgesetzt (`x=-190, z=65`), ohne Out-of-Bounds-Zustand.

Zwei Zwischenläufe waren diagnostisch nützlich: Zunächst blieb die Rotation weich, aber die Blickausrichtung sank während Recovery kurz auf 0,295. Ein harter Kamera-Snap reparierte den Blick, verursachte jedoch einen 73°-Sprung pro Intervall. Der anschließende gemeinsame Positions-Rebase behob beide Regressionen; der finale Lauf bestand. Der ursprüngliche vom Nutzer beobachtete 180°-Flip wurde nicht deterministisch reproduziert und sollte zusätzlich auf echter Hardware geprüft werden.

## Fahrgefühl und Physik

- Vorwärts-/Rückwärtsfahrt, Bremsen, Lenken, Drift, Hop und Boost wurden in tatsächlicher Kart-Testfahrt abgedeckt.
- Die getestete Gerade erreicht im Headless-Test rund 30 Geschwindigkeitseinheiten; die 90-%-Schwelle lag ungefähr bei 1,30–1,33 s. Drift links/rechts und anschließendes Ausrollen blieben steuerbar.
- Asphalt, Papier-Abkürzung, Stahlsektor, Gras und Auslauf haben differenzierte Grip-Skalare; Werte werden regressionsgeprüft.
- Driftladung/-stufen und kürzere, zeitlich gepoolte Reifenspuren geben unmittelbare Rückmeldung.
- Keine umfangreiche Neuabstimmung der gesamten Fahrzeugparameter vorgenommen: Die Browsermessung ersetzt keine subjektive Arcade-Fahrprobe. In langen Kurven können große seitliche Auslenkungen entstehen; diese Werte und das Kartgefühl sollten Marcel/Sarah live beurteilen.

## Strecke und Leveldesign

- Das Layout ist ein Stadionkurs mit zwei Geraden und gerundeten Haarnadelenden. Checkpoints, Botroute, Minikarte, Oberflächenzonen und Itemlinien folgen demselben Streckenplan.
- Sektor-Schilder, Beacons, Rhythmusmarkierungen, thematische Druckerei-Abkürzung, Auslauf-/Grasflächen und Zielportal geben mehr Orientierung.
- Die Strecke wurde im Browser gestartet und visuell betrachtet. Im Startbereich sind Ziellinie und Spur gut erkennbar; die Umgebung bleibt stilisiert und aus Headless-Perspektive recht flach. Vollständige Fahrabnahme aller Sektoren und Abkürzungslinien bleibt offen.

## Grafik und Effekte

- Eigenes Menü-Key-Art, sechs verfeinerte Kart-Silhouetten, Sektor-Landmarken, Minikarte, dynamisches FOV, Reifen-/Treffer-/Itemeffekte sowie ein eigenes GLB-Zielportal wurden in den vorausgehenden Ausbaupasses angelegt.
- Statische Streckenbestandteile werden über PlayCanvas-Batchgruppen zusammengefasst; dynamische Banner, Zuschauerarme, Stempel und Gerüstteile bleiben separat.
- Renderauflösung ist auf maximal 1,5 Geräte-Pixel pro CSS-Pixel begrenzt. Reduzierte Effekte und reduzierte Kamerabewegung bleiben verfügbar.
- Im eingesehenen Produktionsbild (Headless-Chrome-Screenshot, 764×485) waren Kart, Streckenmitte, Start/Zielmarkierung, Minikarte, Platz/Runde, Item-/Fähigkeits-HUD und Menüsteuerung sichtbar. Das Bild ist lesbar, aber bewusst Low-Poly und nicht mit handgebauter Hochglanz-Art gleichzusetzen.

## Audio und Sprachausgabe

- Motorgrundton mit Oberwelle, gefiltertes Reifen-/Driftrauschen, Fahrtwind, kurze Item-/Schild-/Treffersignale und ein separater prozeduraler Rennscore laufen lokal via Web Audio.
- Es existieren 24 bisherige neuronale deutsche Männerclips und jetzt 24 zusätzliche Kerstin-Frauenclips. Die Announcer-Rolle wechselt zwischen den Stimmen. Bei fehlendem Frauenclip greift die vorhandene Thorsten-Neuralstimme; beim Männerclip bleibt der ältere WAV-Fallback.
- Die Frauenclips sind lokal gespeicherte 16-kHz-Mono-/16-Bit-WAVs. Beide Startdateien wurden vom Produktionsserver mit HTTP 200 ausgeliefert; RIFF/WAVE-Header geprüft. Modellkarte: Piper `de_DE-kerstin-low`, Datensatzlizenz CC0. Modell und Synthesizer sind nicht Teil des Browserpakets. Generator: `tools/generate-announcer-kerstin.mjs`; Erläuterung: `docs/19-female-announcer.md`.
- Die Sprachdateien sind technisch erzeugt und abrufbar, aber es gab keine Möglichkeit, die Audioausgabe auf Lautsprechern/Kopfhörern tatsächlich anzuhören. Kerstin ist das als „low“ ausgewiesene Modell; Klangqualität und Mischung müssen mit Marcel/Sarah abgenommen werden.
- Kein Browser-`speechSynthesis` als Primärstimme hinzugefügt; dadurch bleiben Wiedergabe und Sprecherauswahl unabhängig von Windows-/Browser-Stimmen und offline reproduzierbar.

## Bots und Gameplay

- Fünf Gegner verlassen den Startblock, bleiben im getesteten Lauf innerhalb der Stadiongrenzen und mindestens einer durchquert Checkpoints und Rundenwechsel.
- Bot-Recovery bleibt ohne geschenkten Checkpoint-Fortschritt. Das Ergebnis wird aus Rennprogression bestimmt, nicht allein aus aktueller Bildschirmposition.
- Die neue Spieler-Recovery speichert nach gültigen Checkpoints eine sichere Pose, setzt das Kart bei Out-of-Bounds zurück und synchronisiert nur die physische Position. Fortschritt und Checkpoint-Reihenfolge werden nicht übersprungen.

## Powerups

- Das bestehende Itemset, Inventar, Projektile/Schutzlogik und Bot-Itemverhalten blieben erhalten; Treffer-/Kisten-Partikel und Audio geben zusätzliche Rückmeldung.
- Diese Session hat nicht jede Item-Wechselwirkung manuell im kompletten Rennen einzeln abgenommen. Insbesondere Schutz gegen jeden Projektil-/Welt-Event-Fall sowie Balancing brauchen noch Spieltests.

## Performance

- Statische Strecken-Batches reduzierten in einem früheren vergleichbaren Headless-Snapshot die Draw Calls der Strecke von 119 auf 66 (rund 45 %). Der aktuelle Browserlauf meldete je nach Testszene 55 bis 231 Draw Calls.
- PlayCanvas liegt in einem separaten stabilen Chunk bei rund 1.155 kB minifiziert / 305 kB gzip; Spieleinstieg rund 92,5 kB / 30,5 kB gzip. Gesamt rund 335 kB gzip. Eine aggressive weitere Aufteilung verursachte in früheren Versuchen Ausführungsrisiken und wurde verworfen.
- Der Headless-Lauf verwendete SwiftShader. Finale Render-/Dreiecksmesswerte waren teilweise offensichtlich inkonsistent (u. a. null Dreiecke und stark schwankende Renderzeit); sie sind keine Hardware-Benchmark-Aussage. VRAM-/FPS-Werte daraus werden nicht als Leistungsversprechen dargestellt.
- Das kleine Minikarten-Canvas ist gedrosselt; Driftspuren und Trefferpartikel sind gepoolt. Ein echter Hardware-/Speicherlanglauf über mehrere komplette Rennen steht aus.

## Architektur / Refactoring

- `FollowCameraController` kapselt Kamera-Reset, geglättete Verfolgung und Teleport-Rebase.
- `RaceController` kapselt die letzte sichere Spielerposition und die Recovery-Yaw.
- Announcer lädt Dateien lokal, alterniert die Voice-Packs und fällt bei fehlenden Dateien gestaffelt zurück.
- `vite.config.ts` hält die stabile PlayCanvas-/Game-Bundlegrenze. Frühere riskantere Split-Experimente wurden nicht beibehalten.

## Gefundene Fehler

- Kamera-Recovery: ein Messlauf zeigte nach Teleport kurz eine schlechte Blickausrichtung trotz stabiler Up-Achse.
- Harte Kameraneuinitialisierung behob Blickausrichtung, führte aber zu einem einmaligen 73°-Schritt.
- Ein neu hinzugefügter Recovery-Regressionstest verglich zuerst Checkpoint-Höhe 0 m mit Fahrbahnhöhe 0,65 m; nach Korrektur der Erwartung deckte ein separater Zeitassert die zusätzliche Testdauer auf. Test isoliert und repariert.
- `npm.cmd run fmt` ist im gesamten Client aktuell nicht grün: Prettier meldet 15 nicht angefasste Bestandsdateien (u. a. Projektkonfiguration, `abilities.ts`, `debug-hud.ts`, `input.ts`, `settings.ts`). Sie wurden nicht automatisch massenhaft umformatiert, da das unnötig in bestehende bzw. fremde Arbeit eingreifen würde.
- Vite meldet externe `node:worker_threads`-Imports in PlayCanvas-Workerparsern sowie den Engine-Chunk über 500 kB. Der Build funktioniert; diese Warnungen bleiben sichtbar.

## Behobene Fehler

- Kamera verwendet keine mehrdeutige Euler-Roll-Überschreibung mehr. Welt-Up, quaternionale Rollkomposition, geglättete kürzeste Yaw-Drehung und Teleport-Historien-Rebase sind aktiv.
- Spieler erhält nach gültigen Checkpoints eine stabile, fahrbahnnah platzierte Respawnposition. Respawn zählt keinen Checkpoint doppelt und überspringt keinen Fortschritt.
- Kamerahistorie wird beim Spieler-Respawn mit dem Kart verschoben; der finale Kameratest besteht Blick- und Rotationsgrenzen.
- Recovery-Regression berücksichtigt Fahrbahnhöhe korrekt; Countdown-Assertion wurde von der zeitlich fortgeschrittenen Recovery-Probe isoliert.

## Durchgeführte Tests

Tatsächlich ausgeführte Abschlussbefehle und Ergebnisse:

- `npm.cmd run typecheck` — bestanden.
- `npm.cmd run lint` — bestanden.
- `npm.cmd run build` — bestanden; Vite-Worker- und Chunkgrößenwarnungen bleiben (oben dokumentiert).
- `npm.cmd run fmt` — nicht bestanden: 15 unveränderte Bestandsdateien sind nicht Prettier-formatiert. Geänderte Dateien wurden nicht per globalem Formatter umgeschrieben.
- `node tools/race-regression.mjs` — bestanden: Oberflächengrip, Drei-Runden-Zieleinlauf, Platzierung, Restart, Checkpoint-Reihenfolge, tatsächliche Gate-Breite und Player-Recovery-Pose/Progress.
- `node tools/wheel-lifetime-regression.mjs` — bestanden: Wheel-Handles nach finaler Radeinfügung.
- `node tools/storage-regression.mjs` — bestanden: Speicherverweigerung ist nicht fatal, Sessionrecord bleibt erhalten, ungültige Zeiten werden verworfen.
- `git diff --check` — bestanden; Git zeigte lediglich Zeilenendungs-Hinweise (LF wird bei späterem Git-Schreibvorgang gegebenenfalls CRLF).
- `node tools/cdp-kart-test.mjs http://127.0.0.1:5177 <temporärer Screenshotpfad>` — finale Production-Prüfung bestanden. Fälle: Gerade, kurzer und langer Linksbogen, langer Rechtsbogen, Bremsen, Rückwärtsfahrt, Hop, Drift links/rechts, Ausrollen, schnelle Kamerawendung und Recovery nach absichtlichem 600-m-Teleport. Fünf Bots, mindestens ein Rundenwechsel, geladenes Zielportal, Messung ohne Browserausnahme.
- Zwei vorausgehende vollständige CDP-Kameraläufe scheiterten an den oben dokumentierten Zwischenproblemen; sie wurden repariert und der finale identische Test bestand.
- `Invoke-WebRequest` auf männlichen und weiblichen Startclip — jeweils HTTP 200. WAV-Header des Kerstin-Clips: RIFF/WAVE, 16 kHz, Mono, 16 Bit.
- `powercfg /a` — Windows-Ruhezustand verfügbar.

## Visuelle Tests

Das Spiel wurde als Production-Build über Vite Preview in einem separaten Headless-Chrome/SwiftShader-Profil gestartet. Der automatisierte Lauf steuerte echte Browser-Tastenereignisse. Ein Production-Screenshot wurde erzeugt und mit einem Bildbetrachter tatsächlich visuell inspiziert; sichtbar waren HUD/Minikarte, Kart, Start-/Zielmarkierung, Streckenbegrenzung und ein HUD-Toast. Der Screenshot zeigte einen stilisierten, gut lesbaren, aber noch relativ flachen Low-Poly-Stadionkurs.

Keine native bzw. interaktive GUI auf dem Ziel-PC stand zur Verfügung. Keine echte Bildschirmauflösung, Fullscreen-Umschaltung, physische Tastatur-/Controllerbedienung, Hardware-GPU oder Lautsprecher-Hörprobe geprüft. Die visuelle Aussage ist daher nur für den Headless-Production-Frame belastbar.

## Build-/Lint-/Runtime-Ergebnisse

- TypeScript, ESLint, Produktionsbuild und finale CDP-Runtime: bestanden.
- Browser-Konsole des finalen Testlaufs: keine Ausnahme/Exception.
- Asset-HTTP-Zugriffe der beiden Sprecherpakete: erfolgreich.
- Format-Check des gesamten Clients: wegen 15 unveränderter Dateien nicht sauber; kein Runtimefehler.
- Engine-Chunk >500 kB und Vite `node:worker_threads`-Externalisierung bleiben Buildwarnungen.

## Wichtige selbstständige Entscheidungen

- Eine offline verfügbare lokale Kerstin-WAV-Stimme statt Windows-/Browser-System-TTS als Frauenrolle, damit Sprachwahl und Wiedergabe reproduzierbar bleiben.
- Alle 24 Cues auch für die weibliche Stimme erzeugt, nicht nur wenige Demo-Clips; stufenweiser Fallback bewahrt jede Ansage.
- Auf harten Kamera-Snap nach Respawn verzichtet, nachdem Messung einen 73°-Sprung zeigte; gemeinsames Kamera-/Kart-Rebase erwies sich im Wiederholungstest als stabil.
- Globale Prettier-Reparatur unveränderter Dateien unterlassen und Warnung im Bericht offengelegt.
- Keine aggressivere Bundle-Aufteilung und kein Hardware-Performanceversprechen aus inkonsistenten SwiftShader-Messwerten.
- Keine Commits, Resets oder Verwerfungen bestehender Änderungen.

## Bewusst nicht geänderte Dinge

- Sämtliche 15 von `npm run fmt` bemängelten, in dieser Arbeit unberührten Projektdateien.
- Weiteres aggressives Aufsplitten des PlayCanvas-Enginechunks.
- Gesamtheitliche Neuabstimmung der Kartphysik ohne subjektive Spielprobe.
- Vollständige Änderungen am Itembalancing, Bot-Schwierigkeitsgrad oder allen Welt-Event-Kollisionen ohne manuelle Testabnahme.
- Neue Produktiv-Abhängigkeit für TTS, Modellruntime oder Online-Audio.

## Bekannte verbleibende Probleme

- Hörqualität und Lautheitsbalance männlicher/weiblicher Stimme sowie Musik/Motor/Items auf echten Lautsprechern/Kopfhörern abhören. `kerstin-low` ist als Low-Qualitätsmodell gekennzeichnet.
- Der Nutzer beobachtete Kamera-Flip wurde in diesem Lauf nicht exakt reproduziert; der harte Teleport/Respawn und starke Lenkwinkel wurden jedoch mehrfach simuliert.
- Physikgefühl, Wandkontakte, sämtliche Items, Vollfullscreen, Resize und mehrere vollständige Menschenrennen sind nicht manuell auf echter Hardware abgenommen.
- Die Umgebung ist noch nicht auf durchgehend art-directed Qualität; Screenshot zeigt trotz neuer Landmarken flache Low-Poly-Flächen.
- Vollständige Formatierung des Bestands, Vite-Chunkwarnung, Hardware-FPS/VRAM und Mehr-Rennen-Speicherverhalten sind offen.
- Keine Änderungen committet. Arbeitsbaum enthält die Session-Änderungen zur gemeinsamen Prüfung.

## Mögliche nächste Verbesserungen

- Marcel und Sarah lassen ein komplettes Rennen fahren und nehmen Kamera, Abkürzung, Botkollisionen und Itembalancing subjektiv ab.
- Frauen-/Männerstimme, Motor, Drift, Musik und Treffer auf Zielgeräten hören und Lautstärkeautomation abstimmen.
- Flache Kursabschnitte mit gezielten Höhenwechseln, Kurvenpfeilen, thematischen Silhouetten und Landmarken weiter individualisieren.
- Fullscreen/Resize, Controller, Kollisionen und alle acht Itemwechselwirkungen in einer interaktiven Abnahme prüfen.
- Hardwareprofiling mit echter GPU durchführen; Render-/Speichermetriken über mindestens drei vollständige Rennen aufzeichnen.
- Formatierungsabweichungen separat mit Sarah abstimmen, bevor Bestandsdateien massenhaft formatiert werden.

## Wichtigste Änderungen auf einen Blick

1. Kamera folgt mit Quaternion-/Welt-Up-Logik und bleibt bei erzwungener Recovery in der finalen Messung aufrecht und auf das Kart ausgerichtet.
2. Spieler-Recovery setzt an den letzten gültigen Checkpoint zurück, ohne Rundenvorteil.
3. Zehn echte Browser-Steuerfälle, fünf Bots, Rundenwechsel und kein Console-Exception im finalen Produktionslauf.
4. 24 weibliche lokale Kerstin-WAVs ergänzen 24 Männerclips; offline und mit Fallback.
5. Getrenntes PlayCanvas-Bundle und statische Strecken-Batches begrenzen unnötige Draw Calls, ohne riskantes Chunking.
6. Verbleibende Abnahme-/Build-/Formatierungsgrenzen werden transparent dokumentiert.

## Was Marcel als Erstes testen sollte

1. Neues Rennen starten; schnelle Links-Rechts-Wendung und Rückwärtsfahrt fahren, besonders auf die Kamera-Up-Achse achten.
2. Mit Absicht die Stadionbegrenzung verlassen und prüfen, ob Kart und Kamera sauber am letzten gültigen Checkpoint zurückkehren.
3. Drei Runden fahren, Checkpoints abfahren, Bots überholen und mindestens ein Item einsetzen.
4. Druckerei-Abkürzung, Stahl-/Papier-/Grassektor, Sprünge und Wandkontakt ansehen.
5. Announcer, Musik, Motor und Drift mit getrennten Lautstärkereglern hören; Frauen-/Männerwechsel bewerten.
6. Kartgefühl und Botverhalten auf dem echten Gerät beurteilen; die Headless-Zahlen sind kein Hardwarebenchmark.
7. Resize und Fullscreen auf dem Zielsetup prüfen.

## Geänderte wichtige Dateien

- `client/src/game/follow-camera.ts`, `client/src/main.ts`: Kamera, Teleport-Rebase, Player-Recovery und Debughooks.
- `client/src/game/race.ts`, `client/src/game/race-layout.ts`: Checkpoint-/Recovery-Pose und Layout.
- `client/src/game/announcer.ts`: abwechselnde Stimmen und Fallback.
- `client/src/game/raycast-kart.ts`, `client/src/game/kart.ts`, `client/src/game/bots.ts`: Oberflächen, Fahr-/Driftreaktionen und Bot-Recovery.
- `client/src/game/track.ts`, `client/src/game/items.ts`, `client/src/game/drift-effects.ts`, `client/src/game/race-hud.ts`, `client/src/game/game-ui.ts`, `client/src/starter.css`: Strecke, Items, Effekte und UI.
- `client/src/game/driving-audio.ts`: Motor-, Reifen-, Wind-, Ereignis- und Musik-Audio.
- `client/public/art/`, `client/public/models/`, `client/public/audio/announcer-neural/`, `client/public/audio/announcer-female/`: Art-/Zielportal- und Sprachassets.
- `client/vite.config.ts`: stabile Produktions-Chunkgrenze.
- `tools/cdp-kart-test.mjs`, `tools/race-regression.mjs`, `tools/generate-announcer-kerstin.mjs`: Browser-/Regressionsprüfungen und reproduzierbare Spracherzeugung.
- `docs/11-production-status.md`, `docs/16-driving-audio.md`, `docs/18-next-level-roadmap.md`, `docs/19-female-announcer.md`: Produktions-, Audio- und Assetnotizen.

## Abschlussstatus

- Build: erfolgreich.
- TypeScript/Lint: erfolgreich.
- Fahr-/Wheel-/Storage-Regressionen: erfolgreich.
- Finaler Production-Browserlauf: erfolgreich; 10 Fahrfälle, fünf Bots, Kameragrundwerte innerhalb der Testgrenzen, keine Runtime-Exceptions.
- `npm run fmt`: nicht vollständig erfolgreich wegen 15 unveränderten Bestandsdateien.
- Bekannt/offen: Hörprobe, echte Hardware-/Fullscreen-/Mehr-Rennen-Abnahme, genaue Reproduktion des ursprünglichen 180°-Kamera-Fehlers, Bundle-/SwiftShaderwarnungen.
- Projektzustand: Änderungen gespeichert, Build stabil, keine Git-Operation/Commit ausgeführt.
- Windows-Ruhezustand: `powercfg /a` bestätigt, dass Hibernate verfügbar ist. Nach diesem Bericht und den finalen Schreib-/Testarbeiten wird `shutdown.exe /h` als letzte Arbeitsaktion ausgelöst.

## Fortsetzung am 30. September 2026

- Den tatsächlichen Checkout unter `D:\Diktator-Kart` gefunden und den Working Tree, die Session-Änderungen, Git-Historie, AGENTS.md und TODO-Suche geprüft. Der Projektspiegel unter dem ChatGPT-Projekt enthielt dagegen keine Quellen.
- Produktions-Build, TypeScript, ESLint, `race-regression.mjs`, `wheel-lifetime-regression.mjs`, `storage-regression.mjs` und `git diff --check` erneut ausgeführt; alle relevanten Prüfungen bestanden. Die bekannten Vite-/Prettier-Hinweise bleiben unverändert dokumentiert.
- Den lokalen Production-Server im Browser geöffnet, Hauptmenü und Renn-HUD visuell geprüft und den vollständigen CDP-Fahrtest wiederholt: Geradeausfahrt, Kurven, Bremsen, Rückwärtsfahrt, Hop, Drift links/rechts mit Boost, Kamera-Recovery, fünf Bots, Rundenfortschritt, Finish-GLB und Browserkonsole ohne Ausnahme.
- Die Follow-Kamera minimal weiter/höher gesetzt (`13` statt `12` Einheiten Abstand, `4.35` statt `3.8` Einheiten Höhe), damit die lange Stadionstrecke und ihre Landmarken früher lesbar werden. Die Quaternion-/Welt-Up-/Teleport-Rebase-Logik blieb unverändert.
- Nach der Kameraänderung: Produktions-Build, TypeScript, ESLint und kompletter Browser-Fahrtest erneut bestanden. Im Headless-SwiftShader bleibt die Messung kein Hardware-Benchmark; die getesteten Kamera-Grenzwerte blieben stabil.
