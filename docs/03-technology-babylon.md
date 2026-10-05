# Technik: Babylon.js-Neuentwicklung

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Renderinterpolation – 03.10.2026

Physik/Items/Rennen bleiben bei festem 1/60-s-Schritt. Darstellung von Kart/Bots/Federung und Kamera nutzt dieselbe zwischen letztem und aktuellem Zustand interpolierte Pose; alpha=Restzeit/FIXED_STEP. Kein extrapoliertes Kollisions-/Rennverhalten. Große Recovery-Sprünge snapen statt durch die Strecke zu gleiten. Neustart/Rennstart setzen vorherige/angezeigte Snapshots zurück. Renderlatenz maximal ein Physikschritt (~16,7 ms), keine Physik-/Balanceänderung. Debugschnittstelle __DK.render ergänzt Pose/alpha/Schrittanzahl für prüfbare Diagnosen.

## Laufender großer Slice – 03.10.2026

Runtime lädt GLB mit exakt passendem Babylon-glTF-Loader 9.28.0. Ursprüngliche M2-Physik bleibt im Labor; der Slice nutzt dieselbe Eingabe/Integration mit eigener Streckenprojektion und Bodenhöhen. Rennfortschritt und Itemregeln sind unabhängig vom Renderer. Assetpivots werden im Spiel animiert; statische Kulisse nach Material gebündelt. Scene-/Engine-Instrumentierung erfasst CPU-, GPU- und echte Drawcall-Stichproben; temporäre Effekte haben feste Grenzen.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](../PROGRESS-LOG.md).

## Festlegung

Babylon.js ist die gesetzte Engine für den Neustart. Die alte PlayCanvas-/TypeScript-/Ammo-Struktur wird nicht migriert. TypeScript und ein moderner Browser-Build sind naheliegende Arbeitshypothesen, aber Buildtool, Physikpaket, Datenformate und Asset-Ladeverfahren werden im Technikprototyp bewusst bestätigt statt vorausgesetzt.

Zielplattform ist zuerst Google Chrome unter Windows; Android und iPhone im Querformat sind verbindliche Anschlussplattformen. Tastatur kommt zuerst, Touch-Steuerung folgt; die Architektur muss Eingaben über eine gemeinsame Spielschnittstelle annehmen. Auf allen Plattformen gelten identische Rennregeln, während die Darstellung skalierbar bleibt.

Kameramodi nah/fern/First Person greifen auf denselben Rennzustand zu. Kamerawechsel ist eine eigene Eingabeaktion; die Spezialfähigkeit erhält eine separate Aktion mit fester Abklingzeit. Abklingzeiten folgen der Rennsimulation, pausieren im Singleplayer mit dem Rennen und werden beim Neustart zurückgesetzt. Dies sind abgeleitete technische Anforderungen, noch keine Implementierung.

Online-Lobbys mit Einladung und Crossplay sind nachgelagerter Pflichtumfang. Eingaben, Rennregeln, Itemchancen und Fähigkeiten müssen bereits jetzt von lokalem HUD und Renderbild getrennt bleiben. Die konkrete Netzwerktechnik wird später unabhängig gewählt.

## Architekturziele

Die neue Architektur soll Zuständigkeiten sauber trennen:

- **App-/Szenenlebenszyklus:** Menü, Laden, Rennen, Pause, Ergebnis.
- **Rennsimulation:** Zeit, Runden, Checkpoints, Platzierung, Regeln.
- **Fahrmodell:** Spieler- und Botsteuerung über gemeinsame, testbare Eingaben.
- **Strecke:** Fahrroute, Abkürzung, Kollisionszonen, Dekozonen und Weltzustände.
- **Items und Fähigkeiten:** Daten, Trigger, Treffer, Schutz, Abklingzeiten und Feedback.
- **Bots:** Persönlichkeiten, Linienwahl, Wahrnehmung und Recovery ohne geheime Physikvorteile.
- **Presentation:** Modelle, Animation, Partikel, Audio und UI reagieren auf Simulationsereignisse.
- **UI und Einstellungen:** Menüs, HUD, Grafik-/Audiooptionen, Steuerung und lokale Speicherung sind eigene, testbare Systeme.
- **Betrieb:** Ein-Klick-Start beziehungsweise eindeutige Verknüpfung und ein verständlicher Fehler-/Beendigungsweg gehören zum Produkt.
- **Assets:** versionierbare Manifestdaten, Ladegruppen, Fallbacks und klare Lizenz-/Herkunftsinformationen.

## Grundsätze

1. Eine Simulation darf nicht von zufälligen Render- oder UI-Zuständen abhängen.
2. Spielregeln müssen ohne sichtbare Effekte testbar sein.
3. Physik, Kamera und Präsentation bleiben getrennt, damit Art-Pässe das Fahrgefühl nicht heimlich verändern.
4. Strecke und Botroute beziehen sich auf dieselben überprüfbaren Daten.
5. Jede Szene hat einen kontrollierten Lebenszyklus; Timer, Listener und temporäre Objekte werden beim Neustart sauber beendet.
6. Ein Ladefehler darf nicht stillschweigend ein unspielbares Rennen erzeugen; es gibt Fallbacks und eine sichtbare Diagnose.
7. Fahrphysik und Animation berücksichtigen kleine Untergrundereignisse: Federung, Räder, Reifen und Kartkörper reagieren sichtbar, ohne eine Vollsimulation zu erzwingen.
8. Wetter und Atmosphäreneffekte werden als austauschbare, budgetierte Systeme geplant und dürfen die Spielbarkeit nicht verdecken.

## Babylon.js-Fragen für den Prototyp

- Welche Babylon-Version und welches Rendering-Fallback werden unterstützt?
- Welche Physik wird für den Kart-Racer benötigt, und reicht ein eigenes Arcade-Fahrmodell mit begrenzter Kollisionsphysik?
- Welche Shader-, Schatten-, Partikel- und Postprocessing-Funktionen sind im Zielbrowser zuverlässig?
- Wie werden GLB/GLTF-Assets, Animationen, Audio und Ladegruppen versioniert?
- Welche Debug-/Telemetry-Ansichten helfen bei normalem Browserbetrieb?

## M1 – getroffene technische Startentscheidungen (03.10.2026)

- Babylon.js `@babylonjs/core` 9.28.0, TypeScript 7.0.2 und Vite 8.3.2 sind projektlokal mit exakten Versionen und `package-lock.json` installiert. Modulare Babylon-Importe senkten den gebauten Haupteinstieg von etwa 6,7 MB auf etwa 1,06 MB (minifiziert); weitere Größen- und Ladezeitoptimierung bleibt für M2/M7 offen.
- WebGL2 ist der bevorzugte Renderpfad; wenn die Engine-Erzeugung fehlschlägt, wird WebGL1 versucht. Im interaktiven In-App-Browser wurde WebGL2 diagnostiziert; Google Chrome zeigte die Szene im Headless-Test sichtbar. Android, iPhone, schwacher PC und WebGL1-Fallback sind noch nicht geprüft.
- M1 enthält bewusst keine Physikbibliothek. Für M2 wird zunächst ein eigenes, deterministisch testbares Arcade-Fahrmodell mit begrenzter Kollision erprobt; die Physikentscheidung fällt nach Fahrtests, nicht durch Übernahme von Ammo.
- `InputHub` verbindet Eingabequellen über Aktionen und liefert pro Frame Achsen/Zustände sowie einmalige Tastendrücke. Tastatur ist angeschlossen; Touch erhält später eine eigene Quelle. Kamera, Item und Spezialfähigkeit haben getrennte Aktionen. Die Belegung C/E/Q ist ein vorläufiger technischer Standard, keine endgültige Nutzerentscheidung.
- Die Testszene besitzt einen kontrollierten Szene-Neustart mit `dispose`, Pause, Lade-/Fehleranzeige, ein versioniertes Asset-Manifest und eine FPS-/WebGL-/Eingabe-Diagnose. Das Manifest lädt in M1 noch keine externen Spielassets.
- Ein lokaler Windows-Starter startet Vite und öffnet Google Chrome. Der Browser-Client bindet nur an `127.0.0.1`; das ist der M1-Entwicklungsweg, keine Veröffentlichung.

## M2a – erster Fahrkern (03.10.2026)

Das Test-Kart nutzt vorläufig ein eigenes kinematisches Arcade-Modell mit festem Simulationsschritt von 1/60 Sekunde. `src/kart-model.ts` berechnet Position, Richtung und Tempo ohne Babylon-Szene; `src/scene.ts` stellt den Zustand dar; `src/camera.ts` folgt ihm mit einer geglätteten Testkamera. Die Eingaben kommen weiterhin über `InputHub`. Zwei umschaltbare Verfolgerabstände dienen nur dem Fahrtest und erfüllen noch nicht die beschlossenen drei Spielkameras.

Vorläufige Modellwerte: 10 m/s² Beschleunigung, 16 m/s² Bremsung, 6 m/s² rückwärts, 16 m/s maximale Vorwärts- und 5 m/s maximale Rückwärtsgeschwindigkeit, maximal 1,5 rad/s Drehrate. Diese Werte sind technische Startwerte, keine bestätigte Spielbalance. Die 48 × 48 m große Testfläche begrenzt die Kartmitte auf ±22,5 m; eine Berührung stoppt das Kart. Kollisionen, Reifen, Untergründe und Federung werden in M2 weiter erprobt. Die Tests belegen Regelverhalten; Fahrgefühl und Performance auf Zielhardware sind noch offen.

## M2b – Hop, Drift und Mini-Turbo (03.10.2026)

`KartState` hält Hop-Höhe, Driftladung, Fahrtrichtung und verbleibende Turbozeit als Simulationszustand; Babylon stellt sie nur dar. Ein kurzer Space-Druck startet einen 0,42-s-Hop bis 0,6 m Höhe. Bei mindestens 5 m/s Vorwärtsfahrt beginnt nach der Landung mit gehaltenem Space und Lenkung ein Drift. Gleichgerichtetes Lenken lädt in mindestens 0,7 s auf; Gegenlenken reduziert die Ladung. Der Fahrvektor folgt der Kartrichtung im Drift langsamer, was eine sichtbare seitliche Trajektorie statt bloßer Dekoration ergibt. Loslassen nach voller Ladung gibt 1,2 s Mini-Turbo mit zunächst 4 m/s Tempobonus, Zusatzbeschleunigung und 20 m/s Obergrenze; Bremsen oder ein Randkontakt beenden ihn. Die Werte sind vorläufig und keine Abnahme des endgültigen Fahrgefühls.

Die Space-Flanke wird bis zum nächsten festen Simulationsschritt vorgemerkt, damit kurze Tastendrücke nicht verloren gehen. Pause friert Hop, Driftladung und Turbozeit ein; Neustart erstellt den Anfangszustand. Gezielte Modelltests und ein Chrome-Test mit gehaltenen Tasten prüften die Zustandsübergänge, UI-Anzeige und Leuchten. Federung, Untergründe, echte Rennkollisionen und Zielhardware-Messung bleiben offen.

## M2c–e – Radkontakt, Kameras und Sechs-Fahrzeug-Probe (03.10.2026)

**M2c, vorläufige Technikwerte:** Zwei quer zur Startrichtung liegende, farblich markierte Bodenwellen liegen bei z = 6 m und 13,5 m. Ihre Spitzen sind 0,12 m und 0,18 m hoch; die Höhenprofile sind dreieckig und 1,1 m beziehungsweise 1,4 m lang. Vier Radkontaktpunkte werden anhand von Position und Ausrichtung unabhängig abgetastet. Die mittlere Kontakthöhe treibt eine gedämpfte Federung (`k = 75 s⁻²`, `d = 17 s⁻¹`); Radkontakte bestimmen Nick- und Rollwinkel mit einer Annäherung von `10 s⁻¹`. Landung gibt −1,2 m/s Federungsgeschwindigkeit. Diese Werte sind für gut lesbare Reaktionen auf der Testfläche gewählt und keine reale Fahrzeugphysik. Der Hop hebt das ganze Kart ab; bei Bodenkontakt folgen die Räder einzeln dem Profil. Keine Reifen-/Grip- oder Tempoänderung durch den Untergrund ist bislang implementiert.

**M2d, Kameraprobe:** C schaltet zwischen naher Verfolgerkamera (6,8 m Abstand, 3,15 m Höhe), ferner Verfolgerkamera (12,5 m, 5,7 m) und Fahrerperspektive (1,55 m Augenhöhe). Die Verfolgerkamera glättet die Position; die Fahrerperspektive übernimmt nur 30 % der Federungshöhe und 75 % des Hops. Ein kameragebundenes prozedurales Cockpit zeigt Armaturen, Lenkrad, Hände und Vorderräder; die Lenkraddrehung folgt der Eingabe. Der Zustand wird von allen Kameras gelesen, nicht verändert. Das ist eine lesbare Technikprobe, noch kein fertiges Fahrer-/Cockpitasset oder Kamerakomfort-Abnahme.

**M2e, Lastprobe:** Fünf weitere einfache Karts fahren automatisch auf der Testfläche und verwenden denselben `advanceKart`-Regelsatz wie der Spieler. Sie besitzen noch keine Botroute oder Kollisionslogik. `?fleet=1` schaltet sie für einen vergleichenden Render-/Simulationslauf ab. Im isolierten Headless-Chrome-Test bei 1280 × 800 ergaben sich 42 Meshes/60 FPS für ein Fahrzeug und 87 Meshes/60 FPS für sechs Fahrzeuge; bei jeweils 120 `requestAnimationFrame`-Intervallen betrugen Median 16,7 ms und P95 16,8 ms. `WEBGL_debug_renderer_info` meldete in beiden Fällen ANGLE/D3D11 auf der NVIDIA GeForce RTX 3070 Laptop GPU. Diese gleichliegenden Werte belegen nur, dass die kleine Szene auf dem Entwicklungsgerät in diesem Headless-Lauf das 60-Hz-Limit hielt. Sie belegen keine Leistung auf normalen/schwächeren Zielgeräten, Drawcall-/GPU-Kosten oder spätere Assetqualität. Build-Haupteinstieg nach M2e: rund 1,021 MB minifiziert und 249 kB gzip; die Vite-Warnung bei >500 kB bleibt eine Optimierungsaufgabe.

**M2f, Randreaktion als Teilstand:** Bei einer Kollision mit der Testflächengrenze enden Drift und Turbo. Statt des alleinigen abrupten Stopps erhält das Kart einen auf höchstens 2,5 m/s begrenzten Rückstoß; positives Gas bleibt für 0,22 s gesperrt, Bremsen/Rückwärtsfahrt ist weiter möglich. Die Stoßgeschwindigkeit klingt mit Rate 10 s⁻¹ ab und erzeugt eine kleine visuelle Karosserieneigung. Modell- und Chrome-Test prüften Kontakt, Rückbewegung, Ende der Effekte und Neustart. Das ist weiterhin eine vereinfachte Testflächenbegrenzung, keine Strecken- oder Fahrzeugkollision. Fahrgefühl und Leistung auf echter Hardware stehen aus.

**M2f, längere GPU-Probe:** `npm run test:endurance` misst im isolierten Headless Chrome je 300 aufeinanderfolgende `requestAnimationFrame`-Intervalle für alle drei Kameras mit einem und sechs Karts bei 1280 × 800. Währenddessen werden W+A gehalten; zwischen den Ansichten wird neu gestartet und die Meshzahl geprüft. Am 03.10.2026 meldete WebGL2 über ANGLE/D3D11 die RTX 3070 Laptop GPU. Alle sechs Fenster hatten 16,7 ms Median, 16,8 ms P95, 16,9 ms P99; kein Intervall lag über 25 ms, die Meshzahl blieb bei 42/87 und es gab keine Browserausnahmen. Rohdaten: `docs/evidence/m2f-rtx-endurance.json`. Das belegt nur diese prozedurale Szene auf dem starken Entwicklungsgerät; interaktive Fahrqualität, GPU-Zeit, normale/schwache PCs und Mobilgeräte bleiben offen.

**M2g, erstes Streckenhindernis:** Ein roter, gelb markierter Block steht rechts der geraden Testlinie bei x = 4,3 m/z = 10,2 m. Sein sichtbarer Querschnitt ist 1,3 × 1,3 m, seine Höhe 1,2 m. Der reine Fahrkern prüft einen vorläufigen Kart-Umkreis von 1,25 m gegen die Rechteckfläche, berechnet eine Kontakt-Normale und trennt überlappende Positionen; der begrenzte Rückstoß aus M2f wird wiederverwendet. Der Block ist höher als der 0,6-m-Hop. Diese Kreis-/Rechteck-Näherung belegt eine unabhängige Hinderniskollision, noch keine vollständige Fahrzeugform, Kollisionsphysik oder Kollision zwischen Karts. Die gerade Linie bleibt frei. Browser-/Modelltest und `docs/evidence/m2g-hindernis-chrome.png` belegen Kontakt und Neustart.

**M2h, Fahrzeugkontakt:** Nach jedem festen 1/60-s-Schritt trennt `resolveKartContacts` überlappende Kart-Umkreise von je 1,25 m horizontal und gleichmäßig. Beide Karts verwenden denselben kurzen Rückstoß und dieselbe Unterbrechung von Gas, Drift und Turbo. `?scenario=contact` stellt für den Browsertest ein entgegenkommendes Lastkart auf die Gerade; das ist nur eine technische Versuchsanordnung, kein Bot- oder Rennmodus. Modelltests und der Chrome-Fall belegen Trennung, Stoßzustand und Neustart. Eine 60-s-Simulation mit sechs bewegten Karts blieb endlich und innerhalb der Testfläche; größte beobachtete Restüberlappung nach einem Schritt: 2,62 cm. Die Kreis-Näherung löst keine komplexen Mehrfachkontakte, Streckenwände, vertikale Überfahrten oder Schäden realistisch. Fahrgefühl und Zielhardwareleistung bleiben offen.

**M2i, WebGL1-Probe:** Der M1-Fallback-Pfad lässt sich mit `?webgl=1` absichtlich aufrufen. In Headless Chrome auf der RTX 3070 Laptop GPU startete die Szene sichtbar als WebGL1, meldete 44 Meshes mit einem Kart und reagierte auf Gas. Der automatische Browsercheck schreibt `docs/evidence/m2i-webgl1-chrome.png`. Das beweist weder einen echten Fallback nach einem WebGL2-Startfehler noch Kompatibilität/Leistung auf älterer Zielhardware; beides bleibt Geräteprüfung.

**M2j, Kontaktprojektion:** Die 60-s-Sechs-Kart-Simulation zeigte nach M2h bei Fahrzeugstößen bis zu 5,7 cm Eindringen in den markierten Block. `projectIntoTestArea` wird jetzt vom Einzelfahrzeugschritt und bis zu viermal nach paarweisen Fahrzeugtrennungen verwendet. Der gleiche Simulationspfad zeigte danach kein messbares Hinderniseindringen und höchstens 1,6 cm Kart-Restüberlappung. Das ist eine begrenzte Positionskorrektur, keine allgemeine Starrkörperphysik; überbestimmte Kontaktketten bleiben nur angenähert.

**M2l, lokale Messanzeige:** Die M1-Diagnose wurde um ein auf 300 sichtbare Render-Loop-Intervalle begrenztes Framefenster, Perzentile, Langframezähler, Canvas-Auflösung und verfügbaren WebGL-Renderer erweitert. Pause, Neustart und Tab-Ausblendung setzen das Fenster zurück. Das hilft beim späteren normalen-PC-Fahrcheck ohne Entwicklerkonsole; GPU-Zeit, Drawcalls und Speicher bleiben separate Messaufgaben.

**M2-Fallback-Nachprobe:** Der Browsertest blockierte vor dem Seitenstart `canvas.getContext('webgl2')` künstlich. Ein WebGL2-Aufruf wurde abgefangen; die Szene startete in WebGL1 und reagierte auf Gas. Das prüft die automatische Codeverzweigung zusätzlich zu `?webgl=1`, ersetzt aber keinen echten älteren Grafiktreiber oder einen realen GPU-Fehler.

**Vorgezogene Stilskizze:** Standardmäßig ergänzt `src/showcase-world.ts` die bestehende Fahr-/Kollisionsszene um rein dekorative, fiktive Vorplatzarchitektur. `?world=lab` erhält den bisherigen reproduzierbaren Testaufbau für Browserproben; beide Modi nutzen denselben Fahrkern. Statische Kulissenmeshes werden je Material zusammengefügt. Das äußere Spieler-Kart wird in der Fahrerperspektive verborgen, während das kameragebundene Testcockpit sichtbar bleibt. Weder Streckenkollision noch Botlinie oder fertige M3-Assets sind damit behauptet.

## Nicht übernehmen

Nicht automatisch übernehmen: PlayCanvas-Szenenaufbau, Ammo-Ladepfade, alte Controllerklassen, alte Renderbudgets, alte Assetnamen, bestehende Buildannahmen oder angeblich stabile Workarounds. Sie dürfen als historische Hinweise gelesen und im neuen Prototyp unabhängig bewertet werden.

## Aktive technische Zielvorgaben aus Marcels Initialantwort – 06.10.2026

Verbindliches Entwicklungsziel sind Desktop- und Laptop-Browser (Chrome/Edge zuerst, Firefox mitprüfen), Offline-Einzelspieler, Tastatur und Gamepad, freie Belegung der wichtigen Fahraktionen sowie ein bedienbares Menü in möglichst unter zehn Sekunden. Die normale Rennszene soll auf älteren Laptops mit integrierter Grafik stabil 60 FPS erreichen. Automatische Grafikabstimmung erhält einen manuellen Regler und kompatible Rückfälle; Kernmodelle und Lesbarkeit bleiben geschützt. Versionierte Blender-Quellen gehören zu optimierten Laufzeitmodellen. Vor Veröffentlichung sind Tests, Build und sichtbarer Laufzeitcheck erforderlich. Dies sind Zielwerte, keine behaupteten Messergebnisse. Details: [aktives Projektgrundgerüst](23-project-design-baseline.md), [Fragebogen](../PROJECT-QUESTIONNAIRE.md).
