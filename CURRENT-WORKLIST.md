# CURRENT WORKLIST – laufende Arbeit

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Aktuelle Aufträge, Reihenfolge, Status, Blocker und nächste Schritte. Fachdateien liefern Umsetzungseinzelheiten; sie dürfen einen neueren Auftrag hier nicht still überstimmen. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsame kurzfristige Aufgaben für Marcel und Sarah. Nur die neue Babylon-Basis bearbeiten. Die KI aktualisiert Status während der Arbeit; Prüfdetails stehen im [technischen Fortschritt](PROGRESS-LOG.md). Neue Notizen aus TEAM-NOTES.md hier zuordnen, Zukunftsziele nach LONG-TERM-GOALS.md.

**Dokuordnung geprüft (04.10.2026):** Die vier Hauptdateien führen aktuelle Aufträge, Ziele, bestätigte Änderungen und offene Notizen. Aktive Fachdateien verweisen nun auf diese Rangfolge; alte Vorgaben bleiben mit historischem Status erhalten. Die ausdrücklich überholte Großkopf-/Neutral-Slice-Festlegung wurde in den betroffenen Zusammenfassungen korrigiert. Technische Historie bleibt im PROGRESS-LOG.md.

## Qualitätssprung + Mechanik-Vergleich – 04.10.2026 (Nachmittag, Claude)

**Vergleich mit Mario Kart World / 8 Deluxe (Prinzipien, keine Kopie; Referenz: nintendo.com, mariokart8.nintendo.com):**

| Bereich | Vorhanden und geprüft | Verbesserungswürdig | Fehlt, sinnvoll | Derzeit nicht sinnvoll |
|---|---|---|---|---|
| Fahrgefühl/Drift | Drift mit Gegenlenken, **3 Mini-Turbo-Stufen (neu)**, ruhigerer Driftbogen (neu) | menschliche Feinabstimmung | – | – |
| Sprünge/Boost | Rampe+Kanal, Landeschub, **Trick in der Luft (neu)**, Boostflächen, Startschub | weitere Rampen | Gleitflug-Abschnitt | Anti-Schwerkraft |
| Strecke/Abkürzungen/Oberflächen | Hinterhof-Abkürzung, Krater, Hafen/Lava/Abgrund, Pfützen/Schnee | Gefahren stärker in Ideallinie | Schotter-/Gras-Oberfläche mit Grip | Open World |
| Bots/Überholen | gleiche Physik, Drift, Panzer-Bot, **Windschatten (neu, für alle)** | Überholmanöver/Linienwahl | Schwierigkeitsstufen | – |
| Items/Gegenmaßnahmen | 3 Archetypen, Figurenwurfobjekte, Schutzzeit, Warnung | Item hinten halten als Schild | Gegenmaßnahme gegen Verfolger | Kampfmodus/Arena |
| Rennen/Modi | Grand Prix 3 Runden, Fahrerwahl, **Zeitfahren mit Geist (neu)**, Schnellneustart | Siegerehrung | Cup aus mehreren Rennen (erst mit 2. Strecke) | Online, Knockout |
| Zugänglichkeit | **Auto-Gas, Lenkhilfe (neu)**, ruhige Kamera, reduzierte Effekte | Tastenbelegung ändern | – | – |
| Rücksetzung | B, Steckenbleiben, Bergungsamt, Werkstatt | – | – | – |
| Fortschritt/Wiederspielwert | Bestzeiten, Geist, Zufallswetter/Tag-Nacht | – | Medaillen-Zeiten pro Strecke | Freischalt-Shop |

- [x] **Drift entschärft:** Grundbogen ~22 m statt ~12 m, Gegenlenken öffnet bis fast geradeaus, Einlenken bis ~10 m; Simulation auf echter Strecke (10/13/16 m/s, je 150 s): 0 Wandkontakte, Turbos aller Stufen. Menschlicher Fahrtest offen.
- [x] **Mechanik-Paket:** 3 Driftstufen (Funken silberblau/gold/rot), Windschatten (1 s hinter Rivale → Schub, Spieler+Bots), Sprung-Trick (Space in der Luft → größerer Landeschub, Bots teils), Auto-Gas + Lenkhilfe (Optionen).
- [x] **Zeitfahren mit Geist:** Menü „Zeitfahren mit Geist“, allein ohne Items/Bots, Bestfahrt als halbtransparenter Geist (lokal gespeichert); geprüft: Speichern (304 Punkte) und Wiedergabe.
- [x] **Grafik Hoch:** SSAO2-Umgebungsverdeckung + volumetrische Sonnenstrahlen (Optionen → Grafik Basis/Standard/Hoch); Bilder `docs/evidence/2026-10-04-high-*.jpg`.
- [x] **Item-Gegenmaßnahme:** E halten = Item hinten als Schild (fängt ein Geschoss von hinten ab, wird verbraucht), loslassen = werfen; Bots schirmen beim Warten ab. Unit-Test.
- [x] **Eigene Karosserie je Figur:** Roadster (Hitler), Staatslimousine (Stalin), Rennwagen mit Heckflosse (Mussolini), rundliche Limousine (Mao), Rakete mit Leitwerk (Kim), Geländewagen mit Überrollbügel (Castro). Bild `docs/evidence/2026-10-04-individual-bodies.jpg`.
- [x] **Realistischere Fahrer:** menschliche Kopfproportionen (Kopf 70 %, tiefer auf dem Kragen), Haut mit Lichtstreuung, glänzende Augen. Weiter offen: echte Modellierung/Sculpting realistischer Gesichter (z. B. freie CC0-Basisköpfe, in Blender angepasst).
- [x] **Bots überholen gezielt:** fünf Spuren, Spuren mit langsamerem Vordermann werden gemieden, Abbremsen nur bei blockierter Überholspur; Simulation 3 Runden: 9 → 16 Platzwechsel, alle im Ziel.
- [x] **Erste echte Stimme:** Mussolini-Sprachhupe = Originalton „Bivacco“-Rede 16.11.1922 (Redebeginn, Wikimedia Commons, gemeinfrei), Schnitt `art-source/cut_real_voices.mjs`. Hitler-Kandidat „Speech in 1935“ (gemeinfrei) **nicht eingebaut**, weil Inhalt erst menschlich angehört werden muss (Ausschluss verbotener Parolen). Stalin/Mao/Kim/Castro: Rechte ungeklärt, weiter Platzhalter.
- [x] **Hupen wieder TTS (Marcel):** Mussolini-Originalton zurückgestellt; Quelle/Schnittskript bleiben für später (`art-source/cut_real_voices.mjs`, Ausgabe nur noch nach `.tools/`). **Merken:** echte historische Hupen später erneut angehen.
- [x] **Charaktermodell überarbeitet (Blender):** Kopf als durchgehend modellierte Oberfläche (Brauenwulst, Augenhöhlen, Wangenknochen, Kiefer, Kinn) statt aufgesetzter Kugeln; Keilnasen; geformte Stiefel statt Kugeln; Taille statt Kugelbauch. Bild `docs/evidence/2026-10-04-sculpted-head.jpg`.
- [x] **Beine/Füße/Pedale:** Armaturenbrett nach vorn/oben, Knie darunter, Schienbein zum Pedal, Stiefelsohle auf Gas/Bremse (bewegen sich mit Eingabe).
- [x] **Haare als Schale am Schädel** je Frisur (keine Helmkugeln mehr), geformte Schultern/Handflächen; **Parade-Front nur am Roadster**, andere Karosserien zeigen eigene Nasen. Bilder `docs/evidence/2026-10-04-portraits-hair-shells.jpg`, `…-grid-distinct-fronts.jpg`.
- [x] **Gegnerstärke leicht/mittel/schwer** (Optionen; nur Grundtempo, gleiche Physik; Simulation Siegerzeit 190/175/164 s) und **Zeitfahr-Medaillen** Bronze/Silber/Gold (≤ 206/184/169 s).
- [x] **Zweite Sprungrampe** auf dem Boulevard zwischen Tor und Abkürzung (Rampen verallgemeinert `RAMP_LIPS`; Trick/Landeschub gelten dort ebenso).
- [ ] **Nächster Grafikschritt:** freie CC0-Basisfiguren prüfen (gefunden: Quaternius „Universal Base Characters“, CC0, glTF/.blend, stilisiert, Download über itch.io) und in Blender sitzend anpassen; Schultern/Arme weiter verfeinern.
- [ ] Offen: individuelle Kart-Karosserien je Figur, weitere Strecke.

## Stand 04.10.2026 (Mittag, Claude) – Marcels neue Aufträge

- [x] **Lenkung direkter:** schnelleres Zurückstellen beim Loslassen (Rate 18/s statt 6/s), straffere Gierreaktion, Lenkwirkung sanft ~12 % höher. Fahrgefühl-Abnahme durch Marcel offen.
- [x] **Karte 1,5× größer** (`MAP_SCALE` in `src/track-layout.ts`, ~890 m statt 593 m); Welt, Landmarken, Gefahren, Boostflächen, Items und Tests mitskaliert, Blender-Welt neu gebaut.
- [x] **Kanalsprung als echter Streckenabschnitt:** Wasserkanal quer über die Start-/Tribünengerade, Boostfläche → Holzrampe → Sprung; saubere Landung gibt Schub, zu langsam = ins Wasser, Staatliches Bergungsamt holt zurück. Gleiche Regeln für Bots.
- [ ] **Echte historische Sprachhupen (freigegeben, Download erlaubt, Claude entscheidet):** noch nicht begonnen. Plan: nur rechtlich klare Aufnahmen (Hitler/Mussolini-Reden gemeinfrei, Quelle z. B. Wikimedia Commons mit Lizenzangabe), kurze unverfängliche Anrede-Ausschnitte (keine verbotenen Parolen nach § 86a StGB), Schnitt mit portablem ffmpeg unter `.tools/`; Stalin/Mao/Kim/Castro bleiben wegen Urheberrecht vorerst Platzhalter. Quelle/Lizenz in CREDITS.md.
- [ ] Weitere Ideen: Gefahrenzonen noch stärker in die Ideallinie ziehen (z. B. Lava-Abkürzung), weitere Rampen, Gesichter weiter verfeinern, Fahrtest aller Werte.

## Stand 04.10.2026 (Vormittag, Claude) – Arbeitslisten abgearbeitet

- [x] PC-/Handy-Abgleich geprüft: Abend-Upload `3bfe3a2` in main, Handy-Doku sichtbar, keine Konflikte.
- [x] **Wand/Schaden (P1):** Banden gleiten statt kleben (Nase dreht zur Wand, Frontaleinschlag bleibt hart); Haltbarkeit pro Kart, Qualm/Ruß, Totalschaden mit Explosion, herausgeschleudertem Fahrer und 3-s-„Staatliche Werkstatt“; HUD „Karosserie“. Werte vorläufig, Fahrtest offen.
- [x] **Fahrer/Cockpit (P2, Teil):** Finger am Lenkrad (Handschuhe sitzen fest am Kranz, Arme folgen), Pedale bewegen sich, Rückspiegel im Fahrerblick, Vorderrad-Einschlag korrigiert (war spiegelverkehrt), erwachsenere Gesichter. Offen: Beine/Sitz-Feinschliff, noch realistischere Gesichter.
- [x] **Tag-Nacht (P3):** zufällig pro Rennen Tag→Dämmerung→Nacht über drei Runden, Sterne, Mond, Mondlicht, Vögel/Fledermäuse, wehende Zeitungen, liegenbleibende Wrackteile; Lichter scheinen nicht mehr durch Figuren.
- [x] **Gefahren + Bergung:** Hafenbecken (Westkurve), Staatsofen-Lavagrube (Nordostkurve), abstraktes Übungsgelände mit Granattrichtern; Abgrund/Klippe (Westgerade); Kran des „Staatlichen Bergungsamts“ setzt nach ~3 s an gleicher Position zurück, gleiche Regeln für Bots.
- [x] **Mechaniken:** Boostflächen (3), Startschub zum „LOS!“, Schnellneustart T, pulsierende Itemwarnung, Zeppelin-Ereignis in Runde 2.
- [x] Live-Videowand zeigt wieder alle Fahrer (vorher nur Schatten außerhalb des Blickfelds).
- [ ] Offen: echte historische Sprachhupen (Quellen-/Lizenzprüfung, Download nur mit Freigabe), Landeschub (braucht erst eine echte Rampe, sonst per Hop ausnutzbar), weitere Oberflächen.

## Morgen prüfen – 05.10.2026

- [ ] **PC-/Cloud-Lauf und Veröffentlichung verifizieren:** Commits und Branches prüfen, den vom PC gemeldeten Arbeitsstand mit GitHub `main` vergleichen, tatsächliche Tests/Build-Belege lesen und prüfen, ob Sarah den veröffentlichten Stand abrufen kann. Kommentar „98 % fertig“ allein gilt nicht als Nachweis.
- [ ] **Handyänderungen im PC-Stand prüfen:** Die heute per Handy/GitHub eingetragenen Dokuänderungen und Notizen auf `main` prüfen und nach dem nächsten Projektstart mit dem PC-Arbeitsstand vergleichen. Bestätigen, dass sie dort sichtbar sind und beim Abgleich nichts verloren ging oder kollidierte.

## Morgen arbeiten – 05.10.2026

Nach der Git-/PC-Abgleichprüfung die folgenden Nutzeraufträge als priorisierte Arbeitspakete beginnen. Frühere Ideen und Kollisionstests in `docs/07-gameplay-systems.md`, `docs/02-art-direction.md`, `docs/12-decision-log.md` und [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) mitprüfen. Ein nicht vollständig umgesetztes Paket mit echtem Zwischenstand und nächstem Schritt stehen lassen.

- [ ] **Wand- und Fahrzeugkontakte / Schadensmodell – Priorität 1:** Das noch abrupte Stehenbleiben an Wänden erneut fahren und die bestehende Regel für schrägen Bandenkontakt (Gleiten/Tempoverlust) gegen den aktuellen Stand prüfen. Typische Wandkontakte sollen spürbar abbremsen und lesbar reagieren, aber nicht unnötig den Spielfluss durch Vollstopp zerstören; harte frontale Einschläge dürfen deutlich sein. Kartrempler sichtbar und nachvollziehbar machen. Aufbauend auf dem vorhandenen optischen Schaden eine Haltbarkeit pro Fahrzeug und kumulative Schäden untersuchen; bei wiederholten schweren Treffern darf ein Kart satirisch explodieren/ausfallen, der Fahrer komisch herausgeschleudert werden und das Kart nach wenigen Sekunden mit eigener Animation und Sound zurückkehren. Fairness, Schutz vor Trefferketten, Botgleichheit und Spielbarkeit prüfen; Zahlenwerte erst nach Fahrtest festlegen. Keine Gore-Darstellung.
- [ ] **Historische Fahrer und Cockpit – Priorität 2:** Gesichter erwachsener, detailreicher und realitätsnäher ausarbeiten (nicht kindhaft/niedrigpolygonig, darf stilisiert überhöht bleiben); Fahrer richtig in einen modellierten Sitz setzen. Unterkörper/Beine dürfen nicht in der Karosserie stecken. Hände mit Fingern greifen sichtbar das Lenkrad und bewegen sich mit; Füße stehen passend auf modellierten Gas-/Bremspedalen, die sich bei Beschleunigen/Bremsen bewegen. Lenkrad verbessern. Fahrerperspektive, Außenspiegel und Vorderräder prüfen; in First Person müssen Vorderräder entsprechend der Lenkrichtung einschlagen und Spiegel korrekt ausgerichtet sein.
- [ ] **Zufälliger Tag-Nacht-Lauf und Streckenleben – Priorität 3:** Wetter/Zeitstimmung pro Rennen variieren; einen ruhigen Übergang von Tag über Dämmerung bis Nacht während der drei Runden bauen (mögliche Dramaturgie: Runde 1 Tag, Runde 2 zunehmend Dämmerung, Runde 3 Nacht; keine plötzliche Abdunklung). Tag: sichtbare Sonne und Vögel. Nacht: Mond, Sterne, Mondschatten und Fledermäuse. Blätter/leichte Partikel und Müll/Zeitungen als Streckenleben; von Fahrzeugen verlorene Teile können eine Weile liegenbleiben und danach verschwinden. Lesbarkeit, Performance und sinnvolle Effektbudgets prüfen.
- [ ] **Strecke erweitern: Absturzgefahren und Bergung – verbindlicher Auftrag:** Die aktuelle Stadion-/Berlin-Strecke um mehrere klar erkennbare, thematisch passende Gefahrenzonen erweitern, mit sicherer Hauptroute und optionalen riskanten Passagen: ein Kanal-/Hafenbecken zum Hineinfallen ins Wasser, eine hohe Steinbruch- oder Stadtkulissenklippe mit Absturz ins Leere, sowie ein surreal-satirischer Ofen-/Lavaabschnitt als übertriebene Kulisse. Eine zusätzliche kriegsbezogene Gefahr als abstrakten, klar markierten Granattrichter/zerbombten Übungsparcours inszenieren, ohne reale Opferorte oder Leiden als Witz zu verwenden. Unterschiedliche Fallreaktionen mit nicht-grafischen Effekten umsetzen (Wasserspritzer/Blasen, kurzer Comic-Rauch/Glühen, Staub/kurzes Verschwinden); anschließend wird das Kart durch das satirische **Staatliche Bergungsamt** mit einem überdimensionierten Abschleppkran oder einer absurden Bergungswinde zurück auf die Strecke gesetzt. Kurze, charaktervolle Bergungsanimation und Sound, fairer Zeitverlust, keine übersprungenen Checkpoints/Runden; dieselbe Regel für Spieler und Bots. Streckengeometrie, Hinweisschilder, Rückkehrpunkt, Kameras, Performance und wiederholte Abstürze testen. Zuerst einen repräsentativen Gefahrenabschnitt samt Rückholung sauber fertigstellen, dann die weiteren Gefahrenstellen ergänzen; keine gore-Darstellung.
- [ ] **Echte Fahrer-Sprachhupen – Quellenprüfung:** Statt TTS oder neu eingesprochener Texte echte, wiedererkennbare historische Live-/Archivaufnahmen aus belegten Quellen recherchieren. Person, genauer Ausschnitt, Inhalt, kostenlose Nutzungsrechte und Eignung für die Satire prüfen; erst bei geklärter Herkunft und Lizenz herunterladen/in das Spiel übernehmen. Keine erfundenen Originalzitate.


- [ ] **Wow-/Feel-Good-Mechaniken umsetzen:** Nach den drei priorisierten Hauptpaketen die vorhandenen Fahr-/Streckensysteme erweitern und im Spiel testen: auf einem vorhandenen Streckenstück eine klar lesbare Boostfläche einbauen (eigener Bodenlook, kurzer Sound/Partikelimpuls, kurzer Temposchub) und eine saubere Landung nach Rampe/Hop mit kurzem Schub belohnen. Beide Regeln für Bots und Spieler fair halten. Erst klein integrieren, dann Balance und Lesbarkeit prüfen.
- [ ] **Zusätzliche Rennmechaniken und Quality-of-Life umsetzen:** Nach dem Abgleich mit vorhandenen Systemen nacheinander einbauen und jeweils testen: (1) klares Startsignal mit fair lesbarem Timingfenster für einen Startschub, (2) sofort erkennbare Oberflächenrückmeldung für mindestens eine weitere Oberfläche (z. B. Pfütze mit Spritzer/kurzem Gripverlust oder Schotter mit Staub), (3) ein angekündigtes Streckenereignis mit dekorativer oder klar angekündigter Routenwirkung, (4) humorvolle Rückholung nach echtem Sturz aus der Strecke mit fairer Zeitstrafe, (5) deutlichere Item-/Trefferwarnungen und schneller Rennneustart. Den Projektbestand zuerst prüfen, vorhandene Mechaniken sinnvoll erweitern statt duplizieren, alle Effekte sparsam und verständlich gestalten und Mensch/Bots gleich behandeln, wo es um Rennregeln geht.
- [ ] **Mario-Kart-Prinzipien eigenständig übertragen und spielbar machen:** Vorhandene Risiko-Abkürzung/Rückführung, Rampen/Landezonen, Hop/Drift/Mini-Turbo, Itemwarnung/Comeback und dekorative Rundenveränderung als zusammenhängendes Spielgefühl prüfen und fertig integrieren, soweit im aktuellen Projektumfang sinnvoll. Nintendo beschreibt in *Mario Kart World* verbundene Strecken, wechselndes Wetter und Tag/Nacht, Checkpoint-Eliminierung, freies Erkunden sowie Rails/Wandsprünge/Wasserfahrten. Für unser Spiel nur passende eigene Varianten übernehmen und praktisch umsetzen; keine Open World oder Knockout-Modus anfangen. Referenz: [Nintendo – Mario Kart World](https://www.nintendo.com/us/store/products/mario-kart-world-switch-2/). Drift/Funken/Mini-Turbo ist im Projekt bereits als eigenes System enthalten; dort Qualität und Abstimmung umsetzen, keine 1:1-Kopie: [Nintendo – Drift-Tutorial](https://www.nintendo.com/jp/ichikara/aabpa/index_en.html).

**Aktuell (04.10. Abend, Claude):** Kamera-Maus repariert, historischer Startkader auf Karikaturstufe, Fahrerwahl mit Porträts, figurenspezifische Wurfobjekte, Panzer nur für Hitler (auch als Bot), eigener deutscher Marsch statt Klaviermusik, Ziel-Feuerwerk und Siegerporträts. Alles im Browser geprüft; Hör-/Spielabnahme durch Marcel und Sarah offen.
**Danach:** Gesichter/Haare weiter verfeinern (Marcel: „noch Optimierungsbedarf“), Marsch menschlich anhören und ggf. nachschärfen, eigene Fähigkeiten für Stalin/Mussolini/Mao/Kim/Castro nach gemeinsamer Bestätigung, Wolkenschatten im Regen, Bot-Ideallinie Hinterhofgasse.
**Arbeitsbranch:** codex/team-marcel-20261003-232302-374 (Projektstart 04.10., Claude, auf main f784078). Abschluss nach main am 04.10. nachts; Details in PROGRESS-LOG.md.

## Ganz oben – Marcel, 04.10.2026 (Abend)

- [x] **Kamera-Maus reparieren (Priorität 1):** Linke Maustaste halten = umsehen, rechte = zurückschauen. **Befund:** `src/mouse-camera.ts` war unverändert ChatGPTs Stand `e5152ab`; ChatGPT und Claude arbeiten im selben Ordner `D:\Diktator-Kart` auf demselben Stand (Server-Kennung zeigt Ordner/Branch/Commit). Ursache: Die Geste brach ab, sobald ein Browser den Pointer Lock verweigert (z. B. eingebauter App-Browser, Chrome kurz nach Esc). **Fix:** Geste läuft dann über Pointer Capture weiter. Im Browser per Ereignistest geprüft; **Marcels eigener Test in Chrome steht aus.**
- [x] **Charakterauswahl vor dem Rennen:** „Grand Prix starten“/Enter öffnet die Fahrerwahl mit sechs live aus den Rennmodellen gerenderten Porträts (Studiolicht, ohne Sonnenschatten), Name, Kartname, Titel/Beschreibung und Fähigkeit/Wurfobjekt aus dem Fahrerkatalog. ←/→ wählen, Enter/Klick startet, Auswahl wird gespeichert; das Kart im Menü wechselt live. Revanche behält die Figur.
- [x] **Historischer Startkader (Karikaturstufe):** Hitler (Seitenscheitel, Stirnlocke, Zweifingerbart), Stalin (zurückgekämmtes graues Haar, Walrossbart, Pfeife), Mussolini (Glatze, Kinn), Mao (hohe Stirn, Muttermal, grauer Anzug), Kim Jong-un (Undercut), Castro (Feldmütze, Bart, Zigarre). Keine Regimezeichen. **Noch Optimierungsbedarf** an Gesichtern/Haaren.
- [x] **Schäferhund nur für Hitler, eigene Wurfobjekte aus unseren Ideen:** Mussolini Balkon-Megafon (Altdetail „Mini-Lautsprecher“), Mao rotes Regelheft („flatterndes Regelheft“), Kim Mini-Propaganda-Rakete (Kartname), Castro aufklappender Aktenkoffer (Altdetail), Stalin Fünfjahresplan-Traktor (aus Kartname/Alt-Item „Fünfjahresplan“ abgeleitet – **bitte bestätigen**). Gleiche Trefferregeln für alle.
- [x] **Klaviermusik ersetzt:** eigener „Stadionmarsch der Eitelkeit“ (strammer deutscher Parademarsch, 118 bpm, punktierte Rhythmen, Tuba/Hörner, Trompeten, große Trommel mit Becken, Trio als Grandioso), synthetisiert mit `art-source/build_march.mjs`. Marcels erster Eindruck („lustig, aber nicht wirklich deutsch“) führte zur strammeren Fassung; **erneute Hörprobe offen.** Echte Blasmusikaufnahme wäre später besser (nur mit Freigabe/geklärter Lizenz).
- [x] **Panzer „Größenbefehl“ nur für Hitler:** als Spieler auf Q; fährt man eine andere Figur, setzt der Hitler-Bot den Panzer ein, sobald Gegner nah sind. Andere Figuren zeigen auf Q „eigene Fähigkeit folgt“.
- [x] **Wow-Pakete:** Ziel-Feuerwerk vor der Kamera; Siegerkarte mit Siegerporträt und Mini-Porträts.
- [x] Alter Claude-Worktree entfernt (leerer, von der App gesperrter Ordner `.claude/worktrees/…` kann bleiben; von Git ignoriert). Regel „ein Arbeitsordner für ChatGPT und Claude“ bleibt.

## Zweite Runde – Marcel, 04.10.2026 (spät)

- [x] **Musik strenger und deutscher:** Marsch komplett neu im Stil eines preußischen Spielmannszugs (Trommelmarsch-Intro, Querpfeifen über Trommlerkorps, Posaunen/Trompeten in Oktaven mit Tuba, strenger Moll-Teil, Trio, Grandioso; 112 bpm, wenig Hall). **Hörprobe durch Marcel offen.**
- [x] **Zufallswetter + neuer Effekt:** Beim Laden würfelt das Spiel Sonne (50 %), Regen oder **Schnee** (neu: Flocken, kühles Licht, heller Dunst, frostige Straße, weißer Reifenstaub). Optionen: Wetter Zufall/Sonne/Regen/Schnee; Staatsfernsehen meldet das Wetter.
- [x] **Gesichter/Haare Feinschliff:** Nasenvarianten (Hitler schmal/gerade, Mao/Kim breit/flach, übrige groß), runde Wangen für Mao/Kim, deutlichere Stirnlocke bei Hitler, Kims Undercut mit Hinterkopf. Weitere Verfeinerung bleibt sinnvoll.
- [x] **Panzerräder repariert:** Die Laufrollen standen hochkant und taumelten (Namensfilter erwischte die Rad-Meshes mit). Jetzt korrekt seitlich und drehen um ihre Achse.
- [x] Minikarte zeigt die Gegner in ihren Kartfarben.
- [x] Fahrerwahl: Button „Zufällig 🎲“; Nicht-Hitler-Figuren rufen beim Werfen ihren Spruch (vorläufige TTS-Platzhalter). Siegender Bot ruft seinen Siegerspruch; Rennanzeige nennt die gewählte Figur. Fahrerwahl auch mit Tasten 1–6; gewähltes Porträt „atmet“ leicht. Karten zeigen das Wurfobjekt-Symbol; Hitler-Bot bellt in Spielernähe beim Werfen.

## Offen und als Nächstes

**Abarbeitungsfolge:** Bei „Arbeitslisten abarbeiten“ zuerst die ausführbaren offenen Aufgaben hier umsetzen, anschließend bestätigte Ziele aus [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) selbstständig in diese Liste übernehmen und bearbeiten. Status und nächsten Schritt sichtbar halten; blockierte Aufgaben bewahren, unabhängige fortsetzen. Budget-/Entscheidungsregeln beachten.

- [ ] Historische Fahrer: erkennbare, realitätsnahe Abbilder, insbesondere Hitler; vorhandene neutralen Figuren ersetzen. Satirische Inszenierung, keine Regimezeichen. Kein fertiges 1:1-Modell behaupten.
- [ ] Sprachausgabe menschlich anhören: Verständlichkeit jedes Textes, freundlichere lebendige Sprecherin. Kürzere Texte und klarere Mischung umgesetzt; Hörabnahme steht aus.
- [ ] Historische Sprachhupen: echte unproblematische Mitschnitte mit belegter Person/Quelle und geklärten kostenlosen Nutzungsrechten. Aktuelle sechs Clips sind eigene synthetische Parodien.
- [x] Abschließender Teamabschluss (41 Tests und Build bestanden, GitHub main 2c6e92d verifiziert): Tests/Build, echte Spielbelege, vier Arbeitsdateien/PROGRESS-LOG.md aktualisieren, neuesten Teamstand integrieren, geprüft nach main veröffentlichen.

- [ ] Fünf weitere archivierte Fähigkeiten (Stalin, Mussolini, Mao, Kim, Castro) nach gemeinsamer Bestätigung umsetzen; heute bewusst nicht, da es keine Fahrerwahl gibt und die Wirkungen von den Katalogideen abweichen (siehe Abgleich).
- [ ] Bots: saubere Ideallinie durch die Hinterhofgasse. (Panzer für den Hitler-Bot erledigt am 04.10.)

- [x] 04.10., Claude: Wetter „Regen“ (Optionen → Wetter, auch `?weather=rain`): nasse glänzende Fahrbahn, Pfützen mit Spritzern und Wasserbremse, Blitz mit Donner, Regengeräusch. Im Batch-Server geprüft (Rennen, 2 365 Regenpartikel, Bild). Offen: Wolkenschatten, Hörprobe, Feinabstimmung der Spritzer.
- [x] 04.10., Claude: Einheitlicher Arbeitsordner festgelegt (Worktree-Server zeigte wegen `.claude/`-Ignorierregel alten Stand). Hauptordner auf den neuesten Stand gezogen.

## Heute umgesetzt und geprüft

- [x] Fahrt/Kamera zwischen Physikschritten geglättet. **Marcel:** wesentlich flüssiger, fühlt sich sehr gut an. Uneinheitliche GPU-Bildzeiten sind eine separate Grenze.
- [x] Links halten: frei umsehen; rechts halten/X: Rückblick; E: Item. Temporärer Pointer Lock verhindert Cursorwanderung. Sofortigen Rücksprung beim Lock korrigiert; alle drei Kameras geprüft. Eigener Nutzercheck zur nativen Cursorwiederherstellung noch sinnvoll.
- [x] Karosserie-/Motorwackeln reduziert, dezente Haubenhebung; Räder behalten Terrainkontakt.
- [x] Gegenlenken lädt Drift ebenfalls, weitet Kurve und erhält ursprüngliche Richtung; begrenzter Schlupf, mehr Reifenstaub. Eigenständige vorläufige Werte, noch keine menschliche Mario-Kart-Fahrgefühlabnahme.
- [x] Schäferhund als Spieler-Projektil/Verfolger, laufende Beine/Schwanz, synthetisches Bellen, Comic-Trefferwolke. Gemeinsame Treffer-/Fairnessregeln erhalten.
- [x] Erste Atmosphäre-Ergänzung: vier Litfaßsäulen mit eigenen satirischen Plakaten, Haltestellen/Bänke und eigenständiges Adlerornament. Keine historische Rekonstruktion/G–L-Abnahme.
- [x] F als Sprachhupe, einmal pro Tastendruck mit Abklingzeit; sechs vorläufige individuelle Parodieclips. Browser: Halten/Wiederholen begrenzt, danach erneut möglich, Pause still, alle Clips dekodierbar.
- [x] Vier zentrale Dateien im Hauptordner, gemeinsame Navigation, Notizen/Anleitung für euch beide; Kurzbefehle Projektstart/Projektabschluss verankert. Taböffnung angefordert (App meldet queued).
- [x] Sichtbaren Test-Chrome zum Mitverfolgen geöffnet; eigenen früheren Headless-Testbrowser beendet.

## Neue Aufträge

- [x] 04.10., Marcel: umfassend höhere Qualität für Modelle, Charaktere, Fahrzeuge, Strecke, Umgebung, Effekte, Sounds, Stimmen und Musik in LONG-TERM-GOALS.md verankert. Gewählte Bildpräferenz G–L; ausdrücklich kein TTS für fertige Stimmen. **Ziel dokumentiert, Umsetzung offen.**

Hier ergänzt die KI neue konkrete Nutzerwünsche mit Herkunft und Status. Vorhandene Notizen nicht als Zustimmung oder erledigten Auftrag ausgeben.

- [x] 04.10.: Auf Marcels Auftrag Sarahs gemeldete letzte Git-Änderungen prüfen und Claude-Übergabe vorbereiten. Panzer im Archiv e292070 belegt; persönliche Urheberschaft aus Sarahs übermittelter Aussage, Git-Autor Marcel. Weitere Fähigkeiten/Items und Botänderungen mit Quellen dokumentiert.
- [x] 04.10., Claude: Hitlers Panzerverwandlung als „Größenbefehl“ auf Q wiederhergestellt (8 s/18 s, editierbares Modell `art-source/build_tank.py`, Ketten, Verwandlung, Ton, Staub, HUD, Überrollen mit Schutzregeln). Browser mit sechs Karts, allen Kameras, Rückverwandlung und Neustart geprüft; Belege `docs/evidence/slice-tank-*-q3`. Spielerfigur noch neutraler Platzhalter. Ursprünglicher Auftrag: Q, zunächst 8 s Dauer/18 s Cooldown als vorläufige Altwerte, editierbares Modell, Animation/HUD, gemeinsame Treffer-/Schutzregeln, Rückverwandlung/Reset und alle Kameras prüfen. Alte „Endlose Rede“ nicht als aktuelle Panzerumsetzung behandeln. Details im [Abgleich](docs/sarah-feature-audit.md).

- [x] Gemeinsame Budgetregel in Projekt-/Skill-Einstieg verankert; offene Nachricht von Marcel und einmaligen Sarah-Archiv-/Umstiegsbefehl in TEAM-NOTES.md aufgenommen.
- [ ] Sarahs tatsächlicher erster Umstieg auf ihrem PC: lokale Arbeit erhalten, neues GitHub-Archiv verifizieren, Ideen/Herkunft dokumentieren und neue main-Basis öffnen. Hier nicht als bereits erfolgt melden.
