# CURRENT WORKLIST – laufende Arbeit

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Aktuelle Aufträge, Reihenfolge, Status, Blocker und nächste Schritte. Fachdateien liefern Umsetzungseinzelheiten; sie dürfen einen neueren Auftrag hier nicht still überstimmen. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsame kurzfristige Aufgaben für Marcel und Sarah. Nur die neue Babylon-Basis bearbeiten. Die KI aktualisiert Status während der Arbeit; Prüfdetails stehen im [technischen Fortschritt](PROGRESS-LOG.md). Neue Notizen aus TEAM-NOTES.md hier zuordnen, Zukunftsziele nach LONG-TERM-GOALS.md.

**Dokuordnung geprüft (04.10.2026):** Die vier Hauptdateien führen aktuelle Aufträge, Ziele, bestätigte Änderungen und offene Notizen. Aktive Fachdateien verweisen nun auf diese Rangfolge; alte Vorgaben bleiben mit historischem Status erhalten. Die ausdrücklich überholte Großkopf-/Neutral-Slice-Festlegung wurde in den betroffenen Zusammenfassungen korrigiert. Technische Historie bleibt im PROGRESS-LOG.md.

## Morgen prüfen – 05.10.2026

- [ ] **PC-/Cloud-Lauf und Veröffentlichung verifizieren:** Commits und Branches prüfen, den vom PC gemeldeten Arbeitsstand mit GitHub `main` vergleichen, tatsächliche Tests/Build-Belege lesen und prüfen, ob Sarah den veröffentlichten Stand abrufen kann. Kommentar „98 % fertig“ allein gilt nicht als Nachweis.
- [ ] **Handyänderungen im PC-Stand prüfen:** Die heute per Handy/GitHub eingetragenen Dokuänderungen und Notizen auf `main` prüfen und nach dem nächsten Projektstart mit dem PC-Arbeitsstand vergleichen. Bestätigen, dass sie dort sichtbar sind und beim Abgleich nichts verloren ging oder kollidierte.

## Morgen arbeiten – 05.10.2026

Nach der Git-/PC-Abgleichprüfung die folgenden Nutzeraufträge als priorisierte Arbeitspakete beginnen. Frühere Ideen und Kollisionstests in `docs/07-gameplay-systems.md`, `docs/02-art-direction.md`, `docs/12-decision-log.md` und [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) mitprüfen. Ein nicht vollständig umgesetztes Paket mit echtem Zwischenstand und nächstem Schritt stehen lassen.

- [ ] **Wand- und Fahrzeugkontakte / Schadensmodell – Priorität 1:** Das noch abrupte Stehenbleiben an Wänden erneut fahren und die bestehende Regel für schrägen Bandenkontakt (Gleiten/Tempoverlust) gegen den aktuellen Stand prüfen. Typische Wandkontakte sollen spürbar abbremsen und lesbar reagieren, aber nicht unnötig den Spielfluss durch Vollstopp zerstören; harte frontale Einschläge dürfen deutlich sein. Kartrempler sichtbar und nachvollziehbar machen. Aufbauend auf dem vorhandenen optischen Schaden eine Haltbarkeit pro Fahrzeug und kumulative Schäden untersuchen; bei wiederholten schweren Treffern darf ein Kart satirisch explodieren/ausfallen, der Fahrer komisch herausgeschleudert werden und das Kart nach wenigen Sekunden mit eigener Animation und Sound zurückkehren. Fairness, Schutz vor Trefferketten, Botgleichheit und Spielbarkeit prüfen; Zahlenwerte erst nach Fahrtest festlegen. Keine Gore-Darstellung.
- [ ] **Historische Fahrer und Cockpit – Priorität 2:** Gesichter erwachsener, detailreicher und realitätsnäher ausarbeiten (nicht kindhaft/niedrigpolygonig, darf stilisiert überhöht bleiben); Fahrer richtig in einen modellierten Sitz setzen. Unterkörper/Beine dürfen nicht in der Karosserie stecken. Hände mit Fingern greifen sichtbar das Lenkrad und bewegen sich mit; Füße stehen passend auf modellierten Gas-/Bremspedalen, die sich bei Beschleunigen/Bremsen bewegen. Lenkrad verbessern. Fahrerperspektive, Außenspiegel und Vorderräder prüfen; in First Person müssen Vorderräder entsprechend der Lenkrichtung einschlagen und Spiegel korrekt ausgerichtet sein.
- [ ] **Zufälliger Tag-Nacht-Lauf und Streckenleben – Priorität 3:** Wetter/Zeitstimmung pro Rennen variieren; einen ruhigen Übergang von Tag über Dämmerung bis Nacht während der drei Runden bauen (mögliche Dramaturgie: Runde 1 Tag, Runde 2 zunehmend Dämmerung, Runde 3 Nacht; keine plötzliche Abdunklung). Tag: sichtbare Sonne und Vögel. Nacht: Mond, Sterne, Mondschatten und Fledermäuse. Blätter/leichte Partikel und Müll/Zeitungen als Streckenleben; von Fahrzeugen verlorene Teile können eine Weile liegenbleiben und danach verschwinden. Lesbarkeit, Performance und sinnvolle Effektbudgets prüfen.
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
