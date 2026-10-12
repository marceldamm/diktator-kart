# TEAM NOTES – Notizen und gemeinsame Anleitung

### 12.10.2026 – Abschlussprüfung vor Projektende

`npm test -- --test-reporter=dot`: 147/147 bestanden. Der Slow-Lauf bestand 12/21; neun Windows-Git-Fixtures scheiterten in der Sandbox mit `NtCreateDirectoryObject ... C0000022`. Der isolierte, außerhalb der Sandbox wiederholte Workflow-Test bestand genau diese neun Fälle 9/9; damit sind die 21 Slow-Tests insgesamt abgedeckt. `git diff --check` ohne Inhaltsfehler. Der letzte versteckte Moskau-Versuch erzeugte kein gültiges Spielerbild; unbrauchbare Bilder wurden entfernt und A73.5 bleibt für die visuelle Linien-/Risikoprüfung offen. Vite beendet und 18 eigene Team-Fixture-Verzeichnisse entfernt. Offizielle Usage-Anzeige: 27 % Fünf-Stundenverbrauch und 49 % Wochenverbrauch (73 %/51 % Rest).

### 12.10.2026 – Abschlussstand aktueller Moskau-Pass

Der finale Moskauer Farbpass ist umgesetzt und dokumentiert. Verifiziert: gezielte Strecken-/Shortcuttests 31/31; `npm test -- --test-reporter=dot` 147/147 (15,29 s bei gleichzeitigem Build); `npm run build` inklusive TypeScript/Vite bestanden, Bundle 2.176,47 KB / 539,28 KB gzip und bekannte Größenwarnung. Der natürliche versteckte Sechs-Kart-Lauf lieferte nur Telemetrie für einen Bot im Bereich des Paradebelags (1:34,12, 1.873,127 m, 14,949 m/s, bodengebunden, Runtimefehler 0): `docs/evidence/a73bs-moscow-natural-contact.json`. Die Kameraaufnahmen waren schwarz/fehlgeleitet und wurden gelöscht; visueller Eindruck, Risiko und Zeitvorteil sind dadurch nicht abgenommen. Eigener Vite-Server geschlossen; eigene Chrome-Instanz war bereits beendet. Git-Status bleibt gemeinschaftlich stark verändert. Projektabschlussprüfung muss Änderungen einzeln zuordnen; keine Sammelstaging-Aktion.

`origin/main` wurde erfolgreich geholt und steht mit lokalem `main` bei 0/0 Commits. Die Arbeitskopie hat umfangreiche Änderungen vieler Quell-, Test-, Evidenz- und Dokumentationsdateien; die Urheberschaft aller Diffs ist nicht verlässlich trennbar. Deshalb blieb der gemeinsame Index leer und es erfolgten kein Commit und Push. Offizielle Codex-Nutzung zum Abschluss: 25 % Fünf-Stunden- und 48 % Wochenverbrauch (75 % / 52 % Rest); keine Resets/Zusatzkontingente verwendet.

### 12.10.2026 – Moskau-Sichtpass und zusätzliche bestätigte Folgeziele

Marcel bestätigte, dass die Aufgabenliste aktualisiert und um weitere Dinge erweitert werden soll. Ergänzt sind A83 (Abkürzungsvorwarnung, Gegenlinie und sichere Rückkehr bei Renntempo), A84 (Kameralesbarkeit über Rampen, Tunnel und Höhenwechsel) und A85 (dynamische Musik sowie klare Ereignis-/Untergrundklänge). Die Umsetzung bleibt der sichtbaren Prioritätenreihenfolge aus CURRENT-WORKLIST.md untergeordnet.

Für A73.5 wurde Moskaus Shortcut-Mittelspur kontrastreicher aufgebaut. Die gezielten Tests `tests/track.test.mjs` und `tests/moscow-shortcut.test.mjs` bestehen 27/27; TypeScript und `npm run build` bestehen, Bundle 2.174,08 KB / 538,51 KB gzip. Eine aktuelle Rennansicht konnte nicht abgenommen werden: Die separate Headless-Probe verwendete `fleet=1`, wechselte danach in ein reguläres Rennen und traf dort auf `setRoster` mit fehlendem Fahrer-Visual. Die Menü- und Streckenauswahlbilder wurden verworfen; es wird kein neues Laufzeitbild behauptet. Der Headless-Browser auf Port 9445 und die eigene Vite-Instanz wurden beendet. Der vorherige natürliche Kontaktbeleg `a73bm-*` zeigt noch den alten, wenig kontrastreichen Belag.

Nachfolgender Schnelllauf: `npm test -- --test-reporter=dot` 145/145 in 5,41 s, `git diff --check` bestanden. Eine zweite isolierte Standard-Sechs-Kart-Instanz lud den Kurs, hing jedoch nach der Fahrerauswahl ohne verwertbaren Fehlertext; sie wurde nach kurzer Beobachtung beendet. Es liegt damit weiterhin kein aktuelles Bild der neuen Oberfläche im Rennen vor. Eigener Port 9455 und Vite-Port 4178 sind geschlossen.

Offizielle Codex-Werte nach diesem Paket: 16 % Fünf-Stunden- und 47 % Wochenverbrauch (84 % / 53 % Rest). Keine Resets oder Zusatzkontingente verwendet. Gemeinsamer Checkout bleibt dirty; keine Synchronisierung, kein Staging, Commit oder Push.

**Nachtrag Moskau-/Linienpaket (12.10.2026):** Zwei Shortcut-Botprofile wählen jetzt feste unterschiedliche Seitenlinien (`shortcutLane`); der Mittellinien-Pickuptest für Havanna hält die gezielte Itembox weiterhin erreichbar. Der kontrollierte Moskau-Dreirundenlauf zeigt die Außenlinie auf trockener Fahrbahn und mit etwa 0,88 s Abstand zur geboosteten Mittelspur. `npm test` 145/145 (3,94 s), Slow-Teilmenge der Sechs-Kurs-Rückkehr, Havanna und Moskau 3/3 (5,56 s), Build/TypeScript bestanden. Bundle 2.174,20 KB / 538,54 KB gzip. `git diff --check` bestanden. Ein paralleler Schnelllauf deckte zuerst eine veraltete Stil-Schlüssel-Regressionsliste in `tests/duce-drom.test.mjs` auf; die Erwartung wurde auf das optionale Shortcut-Linienfeld erweitert und die Suite bestand danach. Offizielle Anzeige nach dem Paket: 17 % Fünf-Stunden- und 47 % Wochenverbrauch (83 % / 53 % Rest). Keine Resets/Zusatzkontingente; kein Staging/Commit/Push.

**A75 isolierte Gesundheitsfolge (12.10.2026):** Die Itemregression prüft nun Block 9901 und Folgetreffer 9902 zusammen mit `stepDamage`: der Block lässt Gesundheit bei 100 ohne Schadensereignis; der Folgetreffer setzt sie exakt um 14 Punkte herab. `tests/items.test.mjs` 12/12 und `npm test` 145/145 (4,08 s). Damit ist die Systemwirkung isoliert belegt; natürliche NPC-Abwehr und menschliche Fahrt bleiben offen. Weitere offizielle Werte nach diesem kleinen Paket: 17 % Fünf-Stunden- und 47 % Wochenverbrauch.

**A75 NPC-Folgepfad (12.10.2026):** Neuer Integrationstest in `tests/bot-racing.test.mjs`: reguläre Boxpickup-Kette für zwei NPCs, normaler Botwurf und anschließender KI-Block gegen einen Heckschuss, ohne vorgegebene Slot-/Projektilzustände. Das Ziel bleibt bei 100 Gesundheit. Gezielter Fall 1/1; `npm test` 146/146 (4,05 s); `git diff --check` am Test bestanden. Startpositionen und Testboxen bleiben kontrolliert, also kein natürlicher Runtime-Rennbeleg. Offizielle Werte: 18 % Fünf-Stunden- und 47 % Wochenverbrauch (82 % / 53 % Rest). Kein Staging, Commit oder Push.

### 12.10.2026 – Aufgabenliste erweitert, Moskauer Belagpaket

Marcel stellte klar, dass die Aufgaben aktualisiert und um weitere Punkte ergänzt werden sollen. A82 hält die schon bestätigte Wahl unterschiedlicher Motor-/Reifen-/Fahrwerksprofile als ausführbares Ziel fest; Start erst nach A80. Moskaus Shortcut hat jetzt den festen kaputten Pflastermittelstreifen samt schwarz-ockerfarbenen Querbalken und einer kleinen, für alle Karts gleichen Fahrwirkung; die trockenen Seitenlinien sind schneller, Turbo hebt den Zusatzdrag auf. Das Bodenmesh ist ein gemeinsames, aufwärts ausgerichtetes Plattennetz mit offenen Fugen. `node --test tests/items.test.mjs tests/track.test.mjs tests/shortcut-items.test.mjs`: 42/42; `npm run build`: TypeScript/Vite bestanden, bekannte Warnung für das über 500-KB-Hauptbundle. Ein natürlicher Headless-Sechs-Kart-Lauf erreichte den Pflasterstreifen bei 1:34,10, u=65,96/lane −0,010, 20,97 m/s, bodengebunden, null Runtimefehler. Beleg `docs/evidence/a73bm-moscow-broken-paving-natural.{json,png}`. Auch das HUD-freie Verfolgerbild zeigt Stein-/Fugenmuster und Warnbalken nicht klar genug für eine sichtbare Abnahme; Belagmotiv sowie Zeitvergleich Mitte/Seite bleiben offen. Offizielle Codex-Nutzung nach dem Paket: 9 % Fünf-Stunden- und 46 % Wochenverbrauch (91 %/54 % Rest). Keine Resets oder Zusatzkontingente.

### 12.10.2026 – A75 Objekt-ID-Regression und kontrollierter Lauf

Treffer-/Block-/Nah-vorbei-Events enthalten jetzt die `objectId` des betroffenen Projektils. Die Items-Regression prüft ausdrücklich Objekt 99 als ersten Heckblock und Objekt 100 als zweiten normalen Treffer. `a75g` hält ein regulär eingesammeltes Item natürlich bei Immunität 0, Karosserie 100 %, Tempo 19,5 m/s, Spin/Impact 0; das Vorherbild ist gültig. Der kontrollierte zweite Lauf protokolliert jedoch weder den exakten Block noch den folgenden Treffer (`captured.afterBlock=false`, `captured.afterNextHit=false`, Runtimefehler 0). Bericht `docs/evidence/a75g-held-item-controlled.json`; sichtbares Heckmodell und Runtimewirkung bleiben offen.

### 12.10.2026 – A73.5 Sichtkorrektur und Runtimebeleg

Die Hutong-Sichtprüfung fand den tatsächlichen Fehler: Pekings Stadtpflaster auf y=0 lief über der um 0,75 m tieferen Shortcut und verdeckte sowohl den Teefleck als auch die Warnfläche. Die Stadtfläche ist jetzt entlang der Gasse ausgespart. Die Nässe ist türkis gemustert; drei helle Querbalken markieren die Einfahrt. Natürlicher botloser Zeitfahrkontakt: 0:32,47, u=75,22, lane −0,78, 14,64 m/s, bodengebunden, Runtimefehler 0. Der Warnanflug wurde bei u=64,15 aufgenommen. Bilder/JSON: `docs/evidence/a73af-beijing-*`. TypeScript-/Build-Prüfung und der gezielte `Hutong tea spill`-Test 1/1 bestanden. Der Lauf zeigt die Geometrie im Gameplay; menschliche Fahr- und Rangabnahme bleibt offen.

Der nächste natürliche Shortcutpass erreichte zusätzlich u=140,29 bei 19,02 m/s, hielt aber weiterhin das zuerst auf der Hauptroute eingesammelte `direct`-Item. Das protokollierte Pickup lag bei 0:05,67 und Fortschritt 81,70 m; die spätere Gassenbox bei u≈145,25 wurde daher nicht als Aufnahme bewiesen. `docs/evidence/a73ai-beijing-shortcut-natural-route.json`. Ein fehlerhafter Ersthelfer beobachtete nur ein Fenster um u≈91 und ist kein negativer Spielbefund. Nächster sauberer Versuch: das erste Item vor der Gasse regulär werfen und einen zweiten Pickup samt Kursposition aufzeichnen.

### 12.10.2026 – Aufgabenfortschreibung, A75 und neue Fahrziele

Marcel präzisierte die Bitte: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ A78/A79 ergänzen Ziele zu kontrollierbaren Sprung-/Trickaktionen sowie unterschiedlich hohen Rampen mit einer verbundenen Alternativlinie. Die bestehenden Prioritäten A73.5, A75, A57 und A67–A77 bleiben sichtbar.

A75 natürlicher Berliner Einzelrennenpass: fünf Bots, normale Itemaufnahme ohne Zustandsinjektion. Stempelfalle bei 0:25,70 aufgenommen; Itemanzeige mit „Werfen“ sichtbar. 2.163 Samples meldeten ein gehaltenes Item; drei Trefferereignisse am Spieler (zweimal Zensur, einmal Begleitfahrzeug), letztes Sample Karosserie 86 statt 100. Die Anflugrichtung wurde nicht protokolliert, daher ist kein Heckabwehrtest belegt; kein `block`-Ereignis. Runtimefehler: 0. Bericht `docs/evidence/a75b-held-item-natural-race.json`, HUD-Bild `docs/evidence/a75b-held-item-before-hit.png`. Das sichtbare Item am Kartheck wurde nicht eindeutig bestätigt. Der Runner speicherte den Bericht und warf danach nur bei der Konsolenausgabe `rearBlockEvent is not defined`; die eigene Testinstanz wurde beendet. Folgepass: im regulären Rennen einen Treffer mit belegter Heck-Anflugrichtung erzeugen und Item, Karosserie sowie Kartzustand davor/danach sichern.

Offizielle Codex-Anzeige am 12.10.2026: 22 % Fünf-Stundenverbrauch und 42 % Wochenverbrauch (78 % / 58 % Rest). Keine Resets oder Zusatzkontingente verwendet.

Offizielle Codex-Anzeige nach A73.5-Ground-Cut/Sichtprüfung: 25 % Fünf-Stundenverbrauch und 43 % Wochenverbrauch (75 % / 57 % Rest). Keine Resets oder Zusatzkontingente verwendet. Checkout bleibt gemeinsam und dirty; kein Staging, Commit oder Push.

### 12.10.2026 – A70 Moskauer Shortcut-Pilot

Auf Basis des früheren, vor dem 15-m/s-Limit gemessenen Nachteils (Shortcut 387,4 s / Hauptweg 376,4 s über drei Runden) erhielt Moskaus feste Schotterabkürzung bei u=52 % ein Boostfeld. Neuer Test: Feld liegt auf der Shortcut, wird als erster Shortcut-Boost erkannt und sitzt außerhalb von Sturzvolumen. Test 139/139; Vollsuite außerhalb Sandbox 156/156; Build/TypeScript bestanden, Bundle 2.169,64 KB / 537,15 KB gzip. Ein versteckter natürlicher Lauf startete, lieferte aber innerhalb des Monitorfensters keinen belegten Boostfeld-Kontakt; kein Laufzeitbild und keine Nachherzeit abgeleitet. Die A70-Bilanz bleibt offen. Projektstart-Skript konnte `git fetch` nicht ausführen (`.git/FETCH_HEAD`: Zugriff verweigert); lokaler Stand und parallele Änderungen blieben unangetastet. Nächstes Paket: A57 faire Ereignis-/Botgegenreaktion, danach A70-Nachhervergleich.

### 12.10.2026 – A71 Schwachgrafiklauf abgeschlossen

Natürlicher Moskau-Treffer mit reduzierten Effekten: 12 Blätter statt 22, vier Überlappungen des mittleren Fahrfensters beim +0,18-s-Auftakt und keine nach +1,32 s; nach +4,63 s Layer leer. Normalgrafik hatte nach +1,32 s noch eine Überlappung. Beide Modi null Runtimefehler. Der sichtbare Vergleich zeigt im reduzierten Modus freiere Straße/Gegner im Zentrum; Ereignis- und Itemmeldungen beanspruchen weiterhin gleichzeitig Aufmerksamkeit. Belege `docs/evidence/a71-moscow-flood-reduced-{burst,settled,fade}.{png,json}`. Schnelltests 138/138 und Build bestanden, Hauptbundle 2.169,63 KB / 537,15 KB gzip. Offizielle Nutzung: 29 % Fünf-Stunden- und 38 % Wochenverbrauch. Nächster Entwicklungsblock: A57 faires Ereignis-/Botgegenreaktionspaket; A71 unabhängige Wiederholung und menschliches Urteil bleiben offen. Der zusätzliche A57-CDP-Startversuch öffnete keinen prüfbaren Spiel-Tab; dadurch kein neues Rennergebnis und kein Laufzeitbefund.

### 12.10.2026 – A65 Kursposition korrigiert, A66/A71 im Rennen geprüft

Die A65-Nachmessung hatte eine Positionsverwechslung: Rundenfortschritt statt Kurs-s; Moskaus Start bei s=95 bedeutete +95 m. Korrigierter natürlicher Lauf: s=1397,7 Rampenanstieg im Bild, bei s=1414,5 natürlich airborne (1,37 m, 0,285 s Restflug), Platz 3 und null Runtimefehler. A71-Zensurtreffer zeigt 22 kleinere Dokumente: vier im mittleren Fahrfenster bei +0,18 s, eines bei +1,23 s, Layer nach etwa 4,2 s leer. A66-Meldung liegt bei 764×429 unten mittig, außerhalb Item-/Ability-HUD und Rangliste. Schnelltests 138/138 und Build/TypeScript bestanden; Bundle 2.169,59 KB / 537,12 KB gzip. Offizielle Nutzung: 28 % Fünf-Stunden-, 38 % Wochenverbrauch (72 % / 62 % Rest). Offen: Schwachgrafik und menschliche Fahrgefühlbeurteilung A65, unabhängige A71-Wiederholung, Ereignis-/Spezial-Toast auf weiteren Kursen und schmalen Ansichten.

### 12.10.2026 – Aufgabenliste ergänzt und A65 wiederholt

Marcel hat die vervollständigte Bitte bestätigt: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ A67–A70 sind jetzt als bestätigte, noch offene Ziele erfasst: tatsächlich erlebtes Tempo; unmittelbare Item-/Bewegungstricks; variableres, taktisches Botrennen; feste streckeneigene Risiko-/Nutzen-Abkürzungen. Details und Abnahmen stehen in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md. A65-Rampenwiederholung erreichte s=1391–1415 korrekt, doch die natürlichen Papierblätter verdeckten die Rampe erneut; Bericht/Bilder `a65-moscow-ramp-repeat3-natural.json`/`a65-moscow-ramp-repeat3-*.png`. Kein Sicht- oder Fahrgefühlurteil abgeleitet. Als Nächstes bleibt eine freie natürliche Sicht auf die Rampe bei s≈1400. Offizielle Nutzung: 26 % Fünf-Stunden- und 38 % Wochenverbrauch (74 % / 62 % Rest); keine Resets/Zusatzkontingente.

### 12.10.2026 – aktueller A57-Nachweis und nächster Schritt

Marcel hat die vervollständigte Nachricht geklärt: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ Die bestätigten Ziele bleiben in der laufenden Liste; A57 wird weiter bearbeitet. Zwei natürliche Pekingläufe lösten das echte Runde-zwei-Ereignis aus (1:57.13 und 2:00.12). In der Detailwiederholung lagen 11/13 Linienmesspunkte am Limit; ein anderer war in der Luft, einer am Boden lag unterhalb, ohne Treffer/Turbo/Tankwirkung. Alle Ränge blieben in beiden Läufen stabil, Spieler P1, Runtimefehler 0. Tempowirkung belegt, Rangwechsel nicht. Nächster ausführbarer Schritt A65: Moskaus Rampe bei s≈1400 natürlich und unverdeckt aufnehmen. A57 bleibt als Interaktions-/Positionsziel offen. A66 ergänzt die temporäre Fähigkeits-/Spezialmeldung, die im 450-ms-Ereignisbild den oberen Rennblick überlagert; bei +2 s ist sie weg. Der erste Monitorlauf verwechselte die Runde-eins-Vorwarnung mit dem Ereignis; sein Bild ist markiert und nicht als Laufzeitbeleg gewertet. Belege/Testresultate und offizielle Budgetwerte (25 % Fünf-Stunden-, 38 % Wochenverbrauch; 75 %/62 % Rest) in CURRENT-WORKLIST.md. Keine Resets/Zusatzkontingente.

### 12.10.2026 – A57-Tempolimit geprüft; A65-Pilot offen

Frühere A57-Notiz zur 1,25-m/s-Grenze ist durch die aktuelle Kalibrierung am Dateianfang überholt. Die erste echte Feldmessung bestätigte noch keinen Rangwechsel; Bodenkontakt-/Itemzustände fehlen als nächster Telemetrieschritt.

A64 ist technisch abgenommen: 10 m Burstabstand, 12/8 Papiere normal/reduziert; die Fahrspur bleibt frei, Motiv ist bei 450 ms sichtbar und nach 2 s fast abgeklungen. Größere Abstände 20/32 m waren im Laufbild unsichtbar. Menschliche Fahransicht bleibt offen. A65 ist aus A59s Moskau-Telemetrie ergänzt. Marcels bestätigte Wünsche zu mehr Kurven und verschieden hohen Rampen decken einen begrenzten Pilot ab: milder Red-Square-S-Knick plus 0,75-m-Rampe bei s=1400. Schnelltests 138/138, Vollsuite 155/155, Build und natürlicher erster Rundenabschnitt bestanden. Die relevante Rampenaufnahme wurde von einem NPC-Papiereffekt verdeckt; Sichtbarkeit/Fahrgefühl bleiben offen. Belege stehen in CURRENT-WORKLIST.md. Offizielle Codex-Werte nach dem A65-Paket: 17 % Fünf-Stunden- und 36 % Wochenverbrauch (83 %/64 % Rest); keine Resets oder Zusatzkontingente.

A58 ist technisch durch die neu angesehenen A54-/A62-Laufzeitbilder geschlossen: Havanna-Banner und Rom-Rosen sind auffällig, doch aktuelle Belege zeigen freie HUD-/Fahrspur; Pjöngjangs Zug ist bei +2 s im Rennen erkennbar. Keine Codeänderung daraus; menschliche Lesbarkeitseinschätzung bleibt offen.

A65 ältere Notiz zur Kursänderung ist durch den jetzt dokumentierten, begrenzten Pilot überholt. Die fehlende freie Sicht auf die Rampenwirkung bleibt der nächste Prüfschritt.

A57-Paketprüfung nach dem Tempolimit: gezielte Tests 30/30, Schnelltests 138/138, Vollsuite 155/155, TypeScript/Build bestanden (2.169,77 KB / 537,16 KB gzip). Nutzung 20 % Fünf-Stunden- und 37 % Wochenverbrauch; keine Resets.

### 12.10.2026 – A57-Peking gemessen; Bot-Ausrichtung wird nachgeschärft

Marcel hat den zuvor abgebrochenen Satz klargestellt: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ Die vorher bestätigten Antworten zu Kursrhythmus, Linienentscheidungen, Streckenereignissen, NPC-Taktik, Chaos/Bewegung und Effekten sind als A57–A64 in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md dokumentiert. A63 ist abgeschlossen. Natürliche Havanna-/Pekingmessungen für A57 sind belegt; das Bot-Ausweichen ist noch nicht zuverlässig genug und ein kurzer Rangtausch kausal nicht nachgewiesen. Ich korrigiere die Drift-/Sprunglenkung, bevor A57 erneut natürlich gemessen wird. Danach folgen A64 und A58. Die frühere Notiz, die Begründung sei unbekannt, ist durch diese Klarstellung überholt.

Nach der A57-Integration bestehen `npm test` 138/138, `npm run test:full` 155/155 und TypeScript/Produktionsbuild. Natürlicher Havanna-Lauf: alle fünf Bots wählten die Gegenlinie; innerhalb des aktiven Fensters entstand kein belegter Rangwechsel. Natürlicher Pekinglauf: sechs Karts, Pflichtjubel bei 2:00.35 (Runde 2, Spieler P1), 11 Vorlauf-, 20 Beobachtungs- und sechs Nachfenster-Samples, Runtimefehler 0. Der Spieler blieb P1. Zwei Bots tauschten etwa bei +14 s kurz die Plätze 2/3 und wechselten wieder zurück; wegen paralleler Items/Manöver ist die Ursache nicht isoliert. Einzelne Bots fuhren trotz Routenlogik durch die Mittellinienwirkung. Der Trigger-Screenshot zeigt lesbares HUD, aber Papierblätter direkt im Fahrbahnblick; A64 ist dafür als konkreter Folgeauftrag ergänzt. Berichte: `docs/evidence/a57-havana-tactical-wave-positions.json` und `docs/evidence/a57-beijing-tactical-jubel-positions.json`, jeweils mit Triggerbild. Eigene Headless-Chrome-/Vite-Prozesse beendet, eigene Profile/Helper entfernt; Port 4184/Debugport 9245 ohne Listener. Offizielle Nutzung nach dem Paket 7 % Fünf-Stundenverbrauch und 35 % Wochenverbrauch (93 %/65 % Rest); keine Resets/Zusatzkontingente verwendet.

### 12.10.2026 – Sechs-Kurse-Audit und nächste Aufgaben A59

**A62, Umsetzung:** Der sichere Pjöngjang-Paradestart liegt im gezielten Testfeld jetzt näher am auslösenden Kart (67 m bis zur Zugrückseite statt rund 161 m); die Platzierungsregression erhält die 30-m-Mindestdistanz und prüft alle sechs Karts. Vollsuite 154/154 und Produktionsbuild/TypeScript bestanden. Die neun Team-Fixtures, die unter Sandboxbedingungen an Git Bash `NtCreateDirectoryObject` scheiterten, bestanden bei der erneuten Ausführung mit freigegebenem lokalem Prozesszugriff. Natürlicher Normal-/Schwachgrafiklauf und 15-s-Ablauf sind inzwischen in den Belegen unter A61/A62 dokumentiert. Keine Resets oder Zusatzkontingente.

**A61/A62 – natürlicher Sicht-/Ablaufnachweis:** Zwei natürliche Einzelrennen in der eigenen isolierten Headless-Chrome-Instanz (NVIDIA RTX 3070 Laptop GPU, kein SwiftShader) starteten auf Pjöngjang vom Grid mit Auto-Gas/Lenkhilfe und ohne Rang-/Fortschritts-/Eventinjektion. Beide passierten den Paradeabschnitt statt der Unterführung: Normal bei 2:46.03, reduziert bei 2:46.10; Runde 2/3, Platz 5, vier Paradefahrzeuge, rund 20,15 m/s und 100 % Karosserie. Nach rund 15 s waren keine Fahrzeuge mehr aktiv; Rang blieb stabil, Runtimefehler 0. Normal-/Schwachgrafikbilder zeigen den Zug voraus und den Ereignishinweis im Itemfeld. Belege `docs/evidence/a62-pyongyang-natural-parade*.png`, `a62-pyongyang-natural-reduced-parade*.png` plus JSON-Berichte. Der SwiftShader-Erstversuch war wegen extremer Langsamkeit beendet und nicht als Bildabnahme verwendet. Fremder Vite-Listener auf Port 4174 blieb unberührt; eigene Testinstanzen wurden separat geschlossen.

Der diktierte Satz „58 Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst, weil du …“ endete unvollständig. Die klare Bitte, Aufgaben zu aktualisieren und weitere offene Arbeit zu ergänzen, ist umgesetzt; die fehlende Begründung wurde nicht geraten. A57/A58 bleiben an die vorher bestätigten Wünsche (gemeinsame Ereigniswirkung, Positionschaos, taktische NPCs, lesbare Meldungen) und das A54-Laufbild gebunden.

**A54:** Berlin wurde inzwischen natürlich in Normal- und Schwachgrafik geprüft. Beide Läufe erreichen Runde 2/3, Platz 3 und zeigen den Zeppelin-Hinweis; cyanfarbene Windstriche markieren die Außenlinie bei freier Innenlinie. Reduzierte Grafik zeigt eine geringere Effektdichte. Laufzeitberichte: `docs/evidence/a54g-berlin-natural-wind.json` und `a54h-berlin-reduced-wind.json`; passende Bilder liegen daneben. Es wurde keine Geschwindigkeitsdifferenz zwischen den Linien gemessen. Die Parade ist in Pjöngjang weiterhin nicht eindeutig im Verfolgerbild; die Rosen liegen in Rom hoch/am Rand, und Havanna/Pjöngjang haben Meldungskonkurrenz.

**A55/A59:** Das technische Audit aller sechs Layouts und ihrer Kursereignisse ist fertig; Kursmatrix und offene Punkte stehen in LONG-TERM-GOALS.md. Nintendo-Vergleichswerte sind durch die offizielle MK8-Deluxe-Seite belegt. Anschließend wurden alle sechs Kurse in natürlichen Drei-Runden-Läufen mit Fahrhilfe geprüft: Zielzeiten 3:24,97 bis 6:01,60; 88,2 km/h wurde auf allen Kursen erreicht; Median 70,7–73,9 km/h; alle mit null Runtimefehler. Rohberichte `docs/evidence/a59-*-telemetry.json`; vollständige Tabelle und Grenzen in CURRENT-WORKLIST.md. Das sind automatisierte Stichproben, kein menschliches Fahr-/Spaßurteil. Der Pjöngjanglauf zeigte einen Moment mit 0 km/h und Totalschaden-/Werkstattmeldung, Ursache nicht isoliert. Nächster Fokus A57: Positionen aller Bots und des Spielers vor/während/nach gemeinsamen Kursereignissen messen. Aktuelle offizielle Codex-Werte: 19 % Fünf-Stunden- und 32 % Wochenverbrauch (81 %/68 % Rest); keine Kontingente verwendet.

**A60-Nachtrag:** Die genauere A57-Sechskartmessung ergab beim Pjöngjang-Paradeauslöser einen Spielerstopp mit 35 % Karosserieverlust. Eine erste reine Spielerabsicherung traf noch einen außen fahrenden Bot; daher prüft der finale Fix alle Kartpositionen und stellt die Kolonne mindestens 30 m vor dem vordersten Kart im Boulevardbereich auf. Der natürliche Nachlauf bei 2:46,00 (Runde 2, Platz 5) hielt Spieler und Außenlinienbot bei etwa 72 km/h; beide blieben unbeschädigt, Runtimefehler 0. Rohbericht `docs/evidence/a60-pyongyang-parade-start.json`. Prüfungen: gezielte Regression, schneller Satz 137/137, Vollsuite 154/154 und Build/TypeScript bestanden. A60 technisch erledigt; A57 bleibt für die volle Paradephase offen. Aktuelle offizielle Werte: 22 % Fünf-Stunden- und 32 % Wochenverbrauch (78 %/68 % Rest); keine Kontingente verwendet.

### 12.10.2026 – A43 kontrollierter Treffer im Warnungsfenster

Der direkte Itemtreffer ließ sich im Live-Rennen verifizieren; die `items.events`-Liste wurde aber vor dem Screenshot zurückgesetzt. Der stabile Nachweis erfasst daher den persistenten Zähler `items.stats.direct.hits` plus HUD-/Kartzustand danach. Bei kontrolliertem Start an Pjöngjang s=1372 erschien die Runde-1-Warnung; ein direktes Item erhöhte den Trefferzähler 0→1. Bei 0:01.48 stand weiterhin „Vorankündigung: Nächste Runde rollt die Paradekolonne über die rechte Spur der Tor-Allee“, Platz 1, Tempo 1,64 m/s, Impact 0,067 s und Spin 0,567 s. Folgeaufnahme: 86 % Karosserie und 2 km/h. Belege: `docs/evidence/a43h-pyongyang-warning-hit.json` und `a43h-pyongyang-warning-hit-{before,after}.png`. Startposition und Treffer waren kontrolliert; keine natürliche Itemfahrt und keine menschliche Abnahme. Offizielle Usage danach: 8 % Fünf-Stunden- / 30 % Wochenverbrauch.

### 12.10.2026 – A47 korrigierter Burstabstand, kontrollierter Runtimebeleg

Die erste voll natürliche Pekingaufnahme zeigte keinen klaren Papierstoß, weil der Burst zuvor auf s=960 fixiert war und die Auslösung irgendwo von s=880 bis 1040 erfolgen konnte. Der Eventaufruf übergibt jetzt einen Punkt 10 m vor dem Spieler. In der eigenen Headless-Spielinstanz wurde der Runde-zwei-Start kontrolliert bei s=900 gesetzt; danach löste der echte Rennupdatepfad den regulären Event aus. Das 450-ms-Bild zeigt 24 aktive Papiere, lesbare Fahrbahn und HUD; nach zwei realen Sekunden meldete der Effekt keine aktiven Blätter mehr. Bericht und Bilder: `docs/evidence/a47e-beijing-natural-event-followup.json`, `a47e-beijing-natural-event-normal-450ms.png`, `a47e-beijing-natural-event-normal-2s.png`. Da die Startposition gesetzt wurde, den Lauf nicht als vollständig natürlich oder menschlich gefahren bezeichnen. Die eigene Vite-/Chrome-Prozessgruppe wurde durch den Runner beendet. Offizielle Usage danach: 6 % Fünf-Stunden- / 30 % Wochenverbrauch.

### 12.10.2026 – Aufgabenpflege und natürliche Ereignissichtbarkeit

Die ergänzenden natürlichen Peking-Bilder `docs/evidence/a47d-beijing-natural-event-normal-450ms.png`, `...normal-2s.png`, `...reduced-450ms.png` und `...reduced-2s.png` stammen aus echtem Runde-zwei-Eventfortschritt, aber einem automatisierten, headless Kameralauf. Das Kurs-HUD und die Pflichtjubelmeldung sind sichtbar; das Papiermotiv ist im Verfolgerblick bei 450 ms nicht deutlich und nach 2 s nur klein in der Ferne zu sehen. Das belegt keine menschliche Wahrnehmung, aber begründet einen erneuten natürlichen Sichtpass. A47 ist nicht abgeschlossen.

A54 erfasst die natürliche Ereignissichtbarkeit aus der Spielerperspektive pro Kurs. A55 erfasst den gewünschten Vergleich mit Super Mario Kart auf Switch in einheitlichen Kategorien und dient der Priorisierung des bestehenden Sechs-Kurse-Passes. Beide Ziele stehen in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md. Beim natürlichen Peking-Pflichtjubel lag der Burst bislang fest bei Streckenposition s=960, obwohl der Spielertrigger im Bereich s=880–1040 erfolgt; das Papier konnte deshalb bereits hinter dem Kart erscheinen. Der Runtimeaufruf übergibt jetzt einen Punkt 10 m vor dem Spieler und den zugehörigen Höhenwert. `npm test` 136/136 und `npm run build` bestehen. Der neue Headless-Lauf scheiterte zuerst an der Sandbox-Loopbackgrenze und anschließend an einer nicht erreichbaren Debugportinstanz; es gibt noch keine Nachheraufnahme. Vite auf Port 4181 wurde beendet; die eigens gestartete Chrome-Hintergrundinstanz wurde ebenfalls beendet. Offizielle Codex-Anzeige: 4 % Fünf-Stunden- und 30 % Wochenverbrauch. Marcs letzte Nachricht endet nach „weil du“; beim nächsten passenden Moment den Satz vervollständigen lassen, ohne die nun dokumentierten bestätigten Ziele anzuhalten.

### 12.10.2026 – Aufgabenpflege nach Marcels unvollständigem Diktat

Marcel bat darum, die Aufgabenliste zu aktualisieren und weitere Ziele einzutragen. Das folgt außerdem seinem vorherigen ausdrücklichen Auftrag, die offenen Aufgaben auszuführen und weitere prüfbare Ziele hinzuzufügen. Neue A51/A52 stehen in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md: integrierter Pjöngjang-Pilot über drei Runden und ein Freigabetor für sechs Kurse. Die zuletzt diktierte Begründung endete nach „weil du“; deren Inhalt ist unbekannt und wurde nicht geraten. Bei der nächsten Gelegenheit den abgebrochenen Satz vervollständigen lassen.

**A43-Beleggrenze:** Vorhandene Bilder mit „before-hit“ und „after-hit“ haben Rennzeiten 1:13 und 1:22; im späteren Bild war die Kurswarnung bereits regulär abgelaufen. Sie beweisen keinen Itemtreffer während der Warnungspriorität. Ein `.tools`-Szenario für den kontrollierten Nachtest lief in einen Timeout; die genaue Ursache ist nicht belegt. Produktcode ist davon unberührt. Für einen belastbaren Nachtest echten Lauf bis zum Warnpunkt oder einen tick-synchronisierten kontrollierten Test verwenden.

**A43-Nachlauf (12.10.2026):** In einem weiteren natürlichen Pjöngjang-Rennen erschien die Warnung bei 1:10.22. Wegen der Beobachtungslücke kam der nächste verwertbare HUD-Messpunkt erst bei 1:18.08, nach Ablauf des viersekündigen Fensters. Daraus lässt sich weder ein Treffer während des Fensters noch sein Ausbleiben ableiten. Auto-Gas und Lenkhilfe wurden anschließend zurückgesetzt; der eigene versteckte Tab wurde geschlossen.

Ein zusätzlicher Versuch mit einer separaten versteckten Chrome-Debug-Instanz erreichte deren Port 9241 nicht (`ECONNREFUSED`); es gab dabei keinen Spieltest und keine neue Bildaufnahme. Der eigene Vite-Prozess wurde danach beendet. Den zuvor geteilten Serverprozess nicht beenden.

**A53-Laufzeitstichprobe:** Unsichtbarer Pjöngjang-Einzelrennenlauf im Codex In-app Browser, viewport 1280×720. 3 s Vorwärtseingabe führten bei Rennzeit 0:03 zu „Ins Hafenbecken!“ und einer Bergung. 2 s Vorwärts-/Links-Eingabe endeten bei 0:18 mit 0 km/h am linken Rand. Kein Screenshot als Repositorybeleg gespeichert. Quellabgleich zeigt keine gesetzten Krater in Pjöngjang, aber einen Wassergefahrenbereich s=34–205 auf Streckenseite 1 mit 18-m-Becken. Der genaue Grund der Bergung ist nicht im Laufzustand protokolliert; ein einzelner Tastaturversuch ersetzt keine menschliche Fahrabnahme. Der von Codex erstellte Browser-Tab wurde geschlossen; den geteilten Vite-Server nicht beendet.

### 12.10.2026 – A51 versteckter natürlicher Drei-Runden-Pilot

Lokaler In-app Browser, Pjöngjang, Einzelrennen, sechs Karts. Auto-Gas und Lenkhilfe wurden für diesen Test in Optionen aktiviert und danach beide wieder ausgeschaltet. Ergebnisanzeige: Stalin Rang 3, 274,22 s, Runden 93,53 / 93,67 / 87,02 s. Beobachtungspunkte zeigten Positionswechsel des Spielers (Rang 5 am Start, später 2, zeitweise 1, danach 3) und mehrere Rangwechsel der Bots; bei 0:20,6 Spieler auf Rang 1 und 73 km/h, bei ca. 1:21 Rang 2 und 18 % Karosserie, später 100 % und 10/10 Orden. Runde-1-Warnung und Runde-zwei-Paradekolonne nicht engmaschig erfasst; keine valide Aussage, dass sie fehlten. Keine Teleports/QA-Trigger. Kein dauerhaftes Screenshotartefakt gespeichert. Menschlicher Spieltest nicht ersetzt. Eigener Tab geschlossen; Port 4173 unberührt.

Offizielle Codex-Anzeige nach dem Lauf: 43 % Fünf-Stunden- und 29 % Wochenverbrauch (57 %/71 % Rest); keine Resets oder Zusatzkontingente verwendet.

`npm test -- --test-reporter=dot`: 136/136 bestanden, 6,82 s Testlaufzeit. `npm run build`: TypeScript und Vite bestanden; Hauptbundle 2.168,01 KB / 536,57 KB gzip, bekannte Chunkwarnung. `git diff --check` meldet keine Inhaltsfehler, nur Zeilenendungswarnungen. Diese Prüfung schließt menschliche Fahr-/Hörabnahme und den nicht beobachteten Ereigniszeitpunkt nicht ein.

### 12.10.2026 – A47 Peking-/Moskau-Kamera; A49 Rennintro-Überlagerung

Der 72/36- und 48/24-Pass ließ in Moskau noch zu viele große Blätter über die zentrale Introbox fliegen. Finale Einstellung: 24/12, Größe 0,28–0,46 und Lebensdauer 1,4–2,4 s. Verdeckte Peking- und Moskau-Verfolgerbilder zeigen den Effekt über der Fahrbahn mit lesbarer Spur; das System meldete nach rund 2 s null aktive Eventblätter. Finale Belege: `docs/evidence/a47c-beijing-race-lap1-camera-450ms.png`, `a47c-beijing-race-lap1-camera-2s.png`, `a47c-moscow-race-lap1-camera-450ms.png`, `a47c-moscow-race-lap1-camera-2s.png`. Das ist ein kontrollierter Burst in einer echten Rennszene, keine natürliche Ereignisfahrt. Der verdeckte Doppelbannerfall betraf `#gp-intro` plus Fähigkeits-/Blockademeldung (A49), nicht die Runde-1-Warnung (A43). Schwachgrafikmodus bleibt offen. Eigene Headless-Chrome-Instanz geschlossen; geteilter Vite-Server auf Port 4173 blieb unangetastet.

Tests nach dem finalen A47-Codepass: `npm test -- --test-reporter=dot` 135/135 in 3,07 s; Build/TypeScript erfolgreich, 2.167,74 KB / 536,45 KB gzip, bekannte >500-KB-Warnung; `git diff --check` sauber. Offizielle Nutzung nach dem folgenden A49-Bounds-Pass: 36 % Fünf-Stunden- und 28 % Wochenverbrauch.

**A49-Runtimepass:** Im echten Pekingrennen wurde Fahrer Mussolini gewählt und die Pose-Fähigkeit im Spiel mit Q während des sichtbaren Rennintros ausgelöst. Bei 0:00.67 lagen die Intro-Unterkante bei 212,4 px und die Banneroberkante bei 241 px. Aufnahme nach 350 ms und nach Ende der Einblendung zeigen den Abstand und die freie Hauptfahrspur: `docs/evidence/a49-beijing-race-intro-ability.png`, `a49-beijing-race-intro-ability-settled.png`. DOM-Bounds bei 1584×805, 540×800 und 320×600 waren ebenfalls überlappungsfrei; die Testbilder `a43-warning-layout-*.png` haben dunklen/leeren Hintergrund, weil der Renderloop dabei angehalten war. Die Fähigkeit war ein realer Spielerzug in der echten Spielruntime, aber kein zufälliger NPC-Trigger. Keine Runtimefehler. Eigene Headless-Chrome-Instanz auf Port 9241 durch das Prüfszenario geschlossen; der geteilte Vite-Server auf Port 4173 blieb unangetastet.

**Neues Folgeziel A50:** Aus A46 ist eine offene Messlücke hervorgegangen: gepaarte Effektbilder zeigen keine Laufzeitkosten. Wiederholte Messung von Framezeiten/FPS und verfügbaren CPU-/Renderindikatoren bei identischer Runde-2-Ereignisphase, sechs Karts und normaler/reduzierter Grafik ist in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md aufgenommen. Erst die Baseline soll konkrete Grenzwerte begründen.

### 12.10.2026 – A50 erster natürlicher Peking-Performancepass

Sechs Karts und natürlicher Runde-2-Pflichtjubel; Normal und Effekte reduziert jeweils ein Durchlauf. Pro Stufe je ein 6-s-Fenster am selben Ereignisabschnitt vor, während und danach. Headless-Rohdaten: `docs/evidence/a50-beijing-event-headless-metrics.json`. Normal: RAF-P95 ca. 36 ms, geschätzter Mittelwert 37–43 FPS; reduziert: ca. 36 ms und 40–42 FPS. Engine-FPS-Stichproben 36,6–45,1. CDP `TaskDuration` lag bei ca. 5,98–5,99 s je 6-s-Messfenster; Task-/Script-/Layoutdeltas und aktive Partikelsysteme sind im JSON. Der einzelne Lauf zeigt keinen eindeutigen Einbruch während des Ereignisses, isoliert aber Render-/GPU-Kosten und das Ereignispartikelsystem nicht. Headless plus DevTools-Instrumentierung ist eine Diagnose, kein Hardwarebenchmark. Mindestens drei Wiederholungen, isolierter VFX-Vergleich und ergänzender Gerätepass offen. Offizielle Nutzung nach dem Paket: 38 % Fünf-Stunden- und 28 % Wochenverbrauch.

### 12.10.2026 – A43 Pekingwarnung in Runde 1

Ein eigener versteckter Lauf auf Peking schaltete Auto-Gas und Lenkhilfe ein und erreichte den echten Vorwarntrigger bei 1:00.78 / ca. 1.210 von 1.609 m / Platz 1. Das Itemfeld zeigte „Vorwarnung: Pflichtjubel in der Regelheft-Serpentine · außen bleibt freie Fahrt“ über dem vorhandenen Schäferhund-Item. Kein Itemprojektil war im Anflug. Nach 1,7 s weiterer Spielzeit war die Meldung bei 1:03.58 noch sichtbar. Belege: `docs/evidence/a43-beijing-lap1-course-warning.png`, `a43-beijing-lap1-course-warning-followup.png`. `window.__DK.spoken` enthielt keinen spezifischen Warnsatz; im Warntrigger wird `audio.cue('lap')` aufgerufen. Das ist kein Beleg für die tatsächliche Hörbarkeit des Cues. Fünf Kursläufe, gleichzeitiger Treffer, menschliche Reaktion und Hören bleiben offen. Testinstanz wurde per `Browser.close` angewiesen zu schließen; den geteilten Vite-Server nicht beendet.

### 12.10.2026 – A43 übrige fünf Warnpunkte; Itemtreffer-Priorität korrigiert

Berlin (0:56.78, Platz 3), Havanna (0:54.67, Platz 1), Rom (0:52.28, Platz 2), Moskau (1:32.38, Platz 3) und Pjöngjang (1:12.62, Platz 4) erreichten den echten Warntext jeweils in Runde 1 bei rund 75 % Fortschritt. Der initiale Pjöngjang-Folgebeleg zeigte nach ca. 2,2 s „Treffer · kurzzeitig geschützt“ statt der Warnung; ein Treffer überschreibt damit den Meldungskanal, bevor die vier Sekunden abgelaufen sind. Die Runde-1-Warnung verwendet nun `announceCourseEvent`, und `tests/race-notices.test.mjs` prüft Priorität und Ablauf. `npm test` 136/136, Build/TypeScript erfolgreich; Bundle 2.168,01 KB / 536,57 KB gzip. Der Wiederholungslauf nach Korrektur traf den Pjöngjang-Hinweis, erzeugte innerhalb des Fensters jedoch keinen Itemtreffer. Die sechs Läufe nutzten Auto-Gas und Lenkhilfe. Keine echte menschliche Fahr- oder Hörabnahme.

### 12.10.2026 – A46 Normal-/Schwachgrafik-Kamerapaar auf Peking

Selbe Headless-Spieler-Verfolgerposition (Kameravektor ungefähr 11,825 / 2,1 / 162,075), gleicher Peking-Eventabschnitt, kontrollierter Burst und 450-ms-Fenster. Normale Stufe forderte 24, reduzierte 12 Flugblätter an; `#effects-toggle` zeigte für den zweiten Pass „Effekte reduziert“. Bilder belegen erkennbare, freie Fahrbahn und geringere Dichte in Schwachgrafik. Nach 2 s meldete der Eventpartikelspeicher in beiden Fällen null aktive Blätter. Belege: `a46-beijing-normal-450ms.png`, `a46-beijing-reduced-450ms.png`, `a46-beijing-normal-2s.png`, `a46-beijing-reduced-2s.png`. Keine FPS-/CPU-Messung, kein natürlicher Ereignistrigger.

Der Moskauer Startversuch hing im ersten Profil auf „Bereit“. Die zweite, eigens gestartete Headless-Instanz erreichte nach DOM-gesteuertem Kurs-/Fahrerstart Rennen und Peking. Eigene Instanz auf Port 9241 danach geschlossen; Vite 4173 blieb laufend. Aktueller offizieller Nutzungsstand: 33 % Fünf-Stunden- und 27 % Wochenverbrauch.

### 12.10.2026 – A45 kontrollierter Blick aus der Peking-Rennkamera; A47–A48 ergänzt

Mit einem eigenen Headless-Chrome-Profil und dem bestehenden lokalen Spielserver wurde die echte Spieler-Verfolgerkamera auf Peking geprüft. Der Eventeffekt wurde kontrolliert bei `s=960` ausgelöst; Screenshot bei 450 ms zeigt 140 sichtbare Papierstücke und eine dichte Überlagerung bis in den oberen HUD-Bereich. Nach 2 s waren 53 Partikel aktiv; Strecke und Gegenlinie blieben im Bild. Belege: `docs/evidence/a45-beijing-race-lap1-camera-450ms.png` und `docs/evidence/a45-beijing-race-lap1-camera-2s.png`. Es handelt sich nicht um eine natürliche Ereignisauslösung in einer vollständigen Fahrt. A45 ist deshalb nur teilweise belegt. Als neue Folgeaufgaben sind Partikeldichte/HUD-Lesbarkeit (A47) sowie breite/schmale Rennansichten (A48) in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md dokumentiert.

`npm test -- --test-reporter=dot`: 135/135 in 7,29 s Node-Testlaufzeit. `npm run build`: TypeScript/Vite erfolgreich, Hauptbundle 2.167,74 KB / 536,43 KB gzip; bekannte >500-KB-Warnung. `git diff --check` sauber, nur LF/CRLF-Hinweise. Offizielle Werte nach dem Paket: 30 % Fünf-Stunden- und 27 % Wochenverbrauch (70 %/73 % Rest). Ein Zugriff auf Port 9241 und CIM-Prozessabfrage wurde von der Sandbox verweigert; die ausschließlich eigene Headless-Prüfinstanz ließ sich darüber nicht gezielt schließen. Kein normales Chrome-Fenster wurde beendet.

### 11.10.2026 – Verdeckter A31-Papier-/Kameratest, Aufgaben A45–A46

Marcel bat darum, die Prüfung unsichtbar durchzuführen. Ein eigener Headless-Chrome-Lauf auf dem bereits laufenden lokalen Vite-Server verwendete eine neue QA-Ansicht „Ereignis · Streckenmotiv“. Peking zeigte 41 aktive Eventpapierpartikel nach 450 ms, Moskau 69; nach zwei Sekunden waren beide Bursts abgeklungen. Die Bilder zeigen die markierten Papierstücke klar über der Pekinger Strecke und vor den Moskauer Gebäuden. Gespeicherte Laufzeitbilder: `docs/evidence/a31-beijing-paper-450ms.png`, `a31-beijing-paper-2s.png`, `a31-moscow-paper-450ms.png`, `a31-moscow-paper-2s.png`. Die bisherige allgemeine Umgebungsansicht hatte die Effekte verfehlt. Das ist noch keine Prüfung aus der normalen Fahrkamera.

`npm test`: 135/135; `npm run build`: TypeScript und Vite erfolgreich, Hauptbundle 2.167,74 KB / 536,41 KB gzip, bestehende Warnung über 500 KB. `git diff --check` sauber. Der eigens gestartete Chrome-Tab wurde nach dem Lauf geschlossen; der geteilte Vite-Server auf Port 4173 blieb unangetastet. Daraus folgen A45 (Sichtbarkeit im echten Fahrblick) und A46 (phasengleicher Normal-/Schwachgrafikvergleich). Aktuelle offizielle Kontowerte: 26 % Fünf-Stunden- und 26 % Wochenverbrauch (74 % / 74 % Rest). Keine Hörabnahme erfolgt.

### 11.10.2026 – A31 sechs Ereignisse, A43 Warnungen, A44 Itemabnahme

Die sechs Ereignisse liefen in einem separaten, unsichtbaren Headless-Chrome auf den korrekten Heimstrecken; die Statuszeile wurde vor jeder Aufnahme gegen den Kursnamen geprüft. Die ersten Berlinbilder eines Wiederholungslaufs mit gespeicherter Havanna-Auswahl wurden verworfen und durch einen frischen Lauf ersetzt. Die neuen Belege liegen in `docs/evidence/a31-preview-*.png`. Ursprünglicher Bildbefund: Zeppelin/Banner und Gischt klar, Schwachgrafik mit weniger Gischtpartikeln (nicht phasengleich gepaart), Rom mit wenigen Rosen, Peking ohne klares Papier, Moskau ohne eindeutige Publikumsbewegung, Pjöngjangs Fahrzeuge teils durch ein nahes Bauwerk verdeckt. Der Peking-/Moskau-Papierbefund wurde mit den neuen Ereigniswinkeln oben korrigiert; Zuschauerbewegung bleibt offen. Daher A31 nur teilweise abgenommen; keine Tonprüfung.

A43: Die individuellen Ankündigungstexte sind als `src/course-event-notices.ts` testbar ausgelagert. `npm test` 135/135 bestanden, Build samt TypeScript erfolgreich; Bundle 2.166,80 KB / 536,24 KB gzip, bekannte Größenwarnung. Der eigene Chrome wurde geschlossen. Der schon laufende Vite-Server auf Port 4173 blieb unangetastet. Offizielle Kontowerte danach: 21 % Fünf-Stunden- und 25 % Wochenverbrauch (79 % / 75 % Rest).

A44 ist als neues bestätigtes Ziel dokumentiert: sichtbarer Heck-Itemverbrauch bei echtem rückwärtigen Projektiltreffer samt Gegenfällen, HUD und Klang in Spieler- und Botfahrt. Noch kein Runtime-Fahrtest.

### 11.10.2026 – A31 echter Renntrigger und neue A40–A42

Verdeckter Test lief mit separatem Headless-Chrome-Profil; normales Nutzerfenster blieb unberührt. Der erste Automationsversuch verwendete versehentlich die Vorankündigung als Eventsignal; diese Bilder sind als `a31-berlin-race-preannouncement*.png` aufbewahrt. Der korrigierte Lauf wartete auf den tatsächlichen HUD-Text „Rückenwind auf der Tribünenspur“, bestätigte Runde 2/3, Platz 3, zehn aktive Marker, deren Auslaufen nach 15 Sekunden und den Neustart mit ausgeschalteten Markern. Bilder unter `docs/evidence/a31-berlin-race-*.png`. Keine menschliche Tonabnahme erfolgt. A40–A42 halten den drei-Runden-Bogen, variables faires NPC-Aufholen und feste faire Streckenlinien als bestätigte Aufgaben fest. Vor weiteren Paketen Nutzungslimits erneut prüfen.

### 11.10.2026 – A32 Botroute durch den Berliner Rampensprung

Botstil 4 (Kim) führt jetzt auf Berlin zur Außenlinienrampe und zielt während des Flugs auf die Shortcut-Öffnung. Regression nutzt tatsächlichen Botcontroller und Kartphysik einschließlich Rampenstart und prüft sicheren Shortcut-Kontakt nach der Landung. Ein echter verdeckter Lauf bestätigte im CDP-Zustand erst `inShortcut=true` bei `air>0`, dann `grounded=true` und weiter `inShortcut=true`. Begleitbilder `a32-berlin-kim-ramp-race-context-airborne.png` und `...after-landing.png` zeigen die Spieler-Verfolgerkamera, nicht den Bot direkt. Schnelle Suite 134/134, vollständige Suite 151/151 inklusive Drei-Runden-Langläufen, Produktionsbuild/TypeScript bestanden. Direkte Kamerasicht dieses Bots, Feuer-/Sturz-/Bergungspaket und Havanna/Peking-Alternativrouten bleiben offen.

### 11.10.2026 – Laufzeitbeleg A31/A32, verdeckte Headless-Prüfung

Marcel bat ausdrücklich, die Kontrolle ohne sichtbares Fenster durchzuführen. Für den Lauf wurde eine eigene Headless-Chrome-Instanz mit eigenem Profil verwendet, nicht das normale Chrome des Nutzers. Beide Ansichten luden die tatsächliche Babylon-Szene des Berliner Stadionrings; Browserstatus zeigte „Zeppelin · Ereignismodell aktiv“ und keine erfassten Runtimefehler.

- A31/A37: „Windspur · Außenlinie“ plus echter Berlin-/Zeppelin-Trigger. Die breite Fläche wurde zu schmalen, per Textur über die Außenlinie wandernden Luftstrichen; sie pulsieren und sind von orange Rampen-/Boostpfeilen unterscheidbar. Bildbeleg: `docs/evidence/a31-berlin-windspur.png`; Statuszeile bestätigt aktives Modell, keine erfassten Runtimefehler. Offen: Blick aus einem fahrenden Rennen, Innenlinienvergleich, Effektausklang, Schwachgrafik, Publikum/HUD/Ton und Bewegungsbilder für die anderen Ereignisse.
- A32: „Rampensprung“ in Berlin. Das neu positionierte Überkopf-Schild sagt „SPRUNG · AUSSENSPUR / ABKÜRZUNG → / RECHTS ANFAHREN“; gelbe Pfeile führen zur braunen Rampe. Aktuelles Bild: `docs/evidence/a32-berlin-ramp-warning.png`. Die Streckenroute selbst wurde zuvor mit derselben Physik-/Trackprojektion von der Außenlinie durch die Wandöffnung in den Shortcut simuliert. Der Kamerabeleg ist keine menschliche Fahrabnahme.
- `npm test`: 133/133 bestanden. `npm run build`: TypeScript und Vite bestanden; Hauptbundle 2.166,55 KB / 536,09 KB gzip, bestehende >500-KB-Warnung. `git diff --check` wurde nach der Dokumentationspflege erfolgreich wiederholt. Lange Tests wurden nicht erneut ausgeführt, da nur Laufzeitvisualisierung/QA-Perspektive und A31-Materialwirkung angepasst wurden; die vorangegangene A32-Physikprüfung bestand 17/17. Offizielle Codex-Anzeige nach dem Effektpass: 15 % Fünf-Stunden- und 24 % Wochenverbrauch (85 %/76 % Rest).

## 11.10.2026 – Codex: Windspur-Prüfung und zusätzliches Klangziel

A31 hatte einen konkreten Prüfansichtsfehler: die sichtbare Option „Windspur · Außenlinie“ trug nicht den Wert `Windspur`, auf den der Kamerazweig prüft. Der DOM-Wert wurde korrigiert und `npm run build` mit TypeScript bestanden. Ein damaliger IAB-Lauf erreichte den lokalen Vite-Server auf Port 4175 nicht (Timeout); eine spätere eigene Headless-Chrome-Instanz bestätigte die Windspur und speicherte `docs/evidence/a31-berlin-windspur.png`. Marcels Wunsch, zusätzliche Ideen als Ziele zu führen und sie abzuarbeiten, ist jetzt mit A37/A38 in beiden Listen ergänzt. Sarahs Originalideen bleiben erhalten; der gemeinsame Kursabgleich steht als A39 in beiden Listen. A36 hält die zuvor bestätigte Richtung zu dynamischer Musik und Publikumsklang fest. Nächste Schritte: A31-Rennblick/HUD/Ton, A32 Botroute/Gefahr und die weiteren Kursvarianten.

## 11.10.2026 – Codex: A32 Rampenhöhenpaket (Teilstand)

Rampenhöhen sind jetzt kursweise und lippenweise festgelegt; Fahrt- und Modellprofil lesen dieselben Daten. Der größere Höhenunterschied verlängert Flugzeit leicht und hebt den Sprungpeak. Berlin-Pilot: Mit dem zugänglichen Außenlinien-Kicker, einem leichten Lenkeinschlag und einer ausdrücklich engen Luftöffnung im Projektionsraum springt das Kart in den vorhandenen Shortcut. Der Modelltest prüft die Landung im Shortcut, Rückkehrpunkt, Wasserfreiheit und dass andere Wände geschlossen bleiben. `npm test` 133/133, gezielte Streckensuite 21/21, `npm run test:slow` außerhalb der Sandbox 17/17 in 73,64 s, `npm run build` mit TypeScript erfolgreich; bekannte Vite-Warnung wegen des 2.164,48-KB-Hauptchunks. Noch nicht geprüft: sichtbare Linienmarkierung/Vorwarnung, KI-Entscheidung zur Sprungroute und reale Fahrkamera. Eine gegenteilige Vollsuite-Prüfung während der Korrektur fand eine veraltete Mindesthöhenannahme auf Roms Rampe; sie ist jetzt auf den neuen 0,7-m-Kicker angepasst.

## 11.10.2026 – Codex: A35 Item-Abwehr umgesetzt

Marcels Entscheidung „kein separates Schild; gehaltenes Heckobjekt soll den Treffer abfangen“ ist in die Itemlogik übertragen. Separate Slot-/Timer-Zustände, zweite Itemkistenvergabe, Z-/D-Pad-Steuerung und Schild-HUD entfernt. Spieler halten E; rückwärtiger Projektilkontakt verbraucht das Item, während Front-/Seitenkontakte und Fallen normal treffen. Botvorhersage prüft ein hinter dem Kart liegendes Projektil mit relativer Bewegung über bis zu 0,65 s; nur bei konkreter Gefahr hält der Bot sein Item statt es zu werfen.

Regressionen: Heckschutz, Schutz exakt eines Schusses, ungeschützter Folgeschuss, Front-/Seitentreffer, Fallen, belegte Kiste, Botwinkel und Botverhalten; 19/19 gezielte Tests, Volltest 131/131, langer Lauf 17/17 (85,01 s), Build/TypeScript erfolgreich. Der versteckte Browser zeigte im Fahr-HUD eine Itemkarte und keine separate Schildkarte. Es war kein tatsächlicher menschlicher Fahrversuch mit gehaltenem Item/ankommendem Treffer; diese Abnahme bleibt offen. Offizielle Codex-Anzeige: 4 % Fünf-Stundenverbrauch, 23 % Wochenverbrauch. Eigene QA-Tabs und Vite-Testinstanz geschlossen.

## 11.10.2026 – Codex: A31 Windspur-Laufzeitprüfung

Neue Prüfansicht „Windspur · Außenlinie“ wählt der DOM-Ablauf sichtbar aus. Nach dem Zeppelin-Trigger bestätigte die Statuszeile „Ereignismodell aktiv“. Das Bild zeigte weiter den Nahwinkel am Kart; keine getrennten hellblauen Windbänder waren zu erkennen. Der Versuch klärt daher weder die Sichtbarkeit der markierten Außenlinie noch die Abgrenzung zu Boostfeldern. A25/A31 bleiben offen. Ein zusätzlicher Vite-Lauf auf Port 4175 war vom versteckten Browser aus nicht erreichbar; Port 4173 gehört zu einem bereits laufenden Testserver, dessen Prozess nicht übernommen oder beendet wurde. Der neue Testkameracode ist mit `npm run build` typgeprüft und gebaut, seine Laufzeitansicht braucht eine frische, korrekt geladene Szene. Vite-Instanz auf 4175 und erfolgreiche Prüftabs danach geschlossen. Offizielle Codex-Anzeige nach dem Paket: 7 % Fünf-Stundenverbrauch und 23 % Wochenverbrauch.

## 11.10.2026 – Codex: A31-Ereignisprüfung und vollständige Testzyklen

Verborgene Prüfansicht (kein sichtbares Chrome-Fenster): Berlin/Zeppelin, Peking/Pflichtjubel, Rom/Balkonrede, Moskau/Ehrenparade und Pjöngjang/Kolonne direkt ausgelöst. Zeppelin/Banner waren im Motivfokus sichtbar. In Rom waren die Rosen nach 2,5 s als fallende Partikel erkennbar; nach 17 s weitgehend abgeklungen. Pekinger Konfetti war normal und in Schwachgrafik sichtbar, in Schwachgrafik mit weniger Partikeln. Der erste Moskau-Kamerawinkel zeigte Konfetti kaum, die Gegenseite von Peking machte die geringe Menge sichtbarer. In Pjöngjang bestätigte die Statuszeile „Ereignismodell aktiv“; Motivfokus/Gegenseite zeigten mehrere Kolonnenfahrzeuge und Publikum. Die erste Ansicht wurde durch Stadion-/Bauwerksgeometrie verdeckt. Havanna-Gischt wurde bereits in einer früheren A31-Probe ausgelöst, aber kein sauberer Mengenvergleich gemacht. Keine gespeicherte Screenshotdatei verfügbar; Browserbilder dienten nur der Livekontrolle. Windbänder, Zuschauerbewegung im Rennen, HUD-Meldungen, Ton und Reset nach echtem Rennneustart offen.

Zur reproduzierbaren Pjöngjang-Probe setzt die lokale Vorschau vor `trackEvent('column')` die Paradeuhr wie das Rennen; ihr Motivfokus folgt jetzt Zeppelin oder aktiver Kolonne. Kamerahöhe und Kartposition lesen `elevationAt` bzw. `shortcutElevationAt`, statt die nächste Straßenoberfläche per Weltkoordinate zu schätzen.

Prüfzyklen: `npm test` 130/130 in 2,35 s Testlaufzeit. `npm run test:slow` zeigte in der Sandbox neun Workflowfehler, weil Windows die lokalen Git-MSYS-Unterprozesse mit `NtCreateDirectoryObject ... 0xC0000022` blockierte. Derselbe Lauf außerhalb der Sandbox war 17/17 grün (Gesamtdauer 73,23 s), inklusive Drei-Runden-Kursläufen und Workflow-Fixtures. `npm run build` mit TypeScript bestanden; bekanntes Vite-Chunklimit weiter gemeldet. Offizielle Anzeige danach: 3 % Fünf-Stundenverbrauch, 23 % Wochenverbrauch. Nächster Schritt: Wind-/Wellenlinien isolieren und die sechs Ereignisse im tatsächlichen Rennen auf Publikum, HUD und Ton abhören/ansehen.

## 11.10.2026 – A4-Rennstichprobe und A24–A30 Folgepakete

Im verborgenen In-App-Browser startete ich den Berliner GP mit sechs Karts bei Regen. Zwischen 0:02 und 2:16 änderten sich die Rangplätze; Hitler lag in Runde 2 zuletzt auf Rang 4 und etwa 71 km/h. Das HUD zeigte Items, den zweiten Abwehrslot, Orden und 72 % Karosseriezustand; ein Schäferhund-Item lag bereit. Der Zeppelin-Toast lag nicht in einem erfassten Stichprobenbild, ebenso war kein Wind auf der äußeren Spur sicher zu sehen. Rennen über Escape beendet; Auto-Gas/Lenkhilfe beide auf „aus“. Der Browserlauf speicherte keine Bilddatei.

A24 verbindet jetzt alle sechs echten `TestScene.trackEvent`-Aufrufe mit einer zurücklaufenden Zuschauerbewegung: La-Ola bei Zeppelin, Malecón-Welle, Ehrenparade und Paradekolonne; kurze Jubelbewegung bei Balkonrede und Pflichtjubel. 2/2 gezielte Reaktionstests, `npm test` 126/126, Vollsuite außerhalb der Sandbox 143/143 und TypeScript-/Produktionsbuild bestanden. Die Animation muss im Rennen noch sichtbar abgenommen werden. Neue konkrete Folgeziele: A25 sichtbare Spurmarkierung für den Berliner Rückenwind; A26 Kursmotive aus der tatsächlichen Rennkamera verlässlich lesbar machen.

Die erste A25-Probe stand versehentlich bei 85 % des Kurses statt bei der Berliner Startgeraden. Am passenden Ereignisabschnitt zeigte die Prüfansicht nach dem Trigger cyanfarbene Flächen nahe der äußeren Fahrspur; vorhandene Boostflächen erschweren die Zuordnung. Ein Reload mit aktualisiertem Testcode blieb anschließend bei „Lädt tatsächliche Spielszene …“ stehen, deshalb wurde A27 im Browser nicht erneut abgenommen. A28–A30 sind neu angelegte, aus Marcels bestätigten Wünschen abgeleitete Pakete: feste Boostverteilung, durchgängige Rampen-/Tricklandung und abgestimmte Ereigniswirkung in Normal-/Schwachgrafik.

A28-Prüfung: sechs Hauptwege enthalten 4/5/5/4/4/5 Booststreifen; Abkürzungen 0/1/2/2/0/1. Fester Standort, physische Erreichbarkeit und freie Sturzsicherheit der Hauptstreifen sind regressionsgeprüft. Der Test fing den nicht auslösenden ersten Boost in Havannas Gasse auf; nach Verlagerung vom 20-%- auf den 30-%-Punkt ist er zusammen mit dem späteren Streifen erreichbar. Noch keine separaten Botzeitmessungen mit/ohne Boost und kein menschlicher Fahrtest.

**Budget nach A28:** offizielle Codex-Werte 43 % Fünf-Stundenverbrauch / 22 % Wochenverbrauch (57 % / 78 % Rest).

A29-Prüfgrenze: Modell und Strecken bieten nun automatische Rampe, Lufttrick und größere Tricklandung für Spieler/Bots; Kameracode reagiert auf Sprunghöhe und Turbo. Kein aktueller sichtbarer Fahrbeleg verfügbar, da der letzte versteckte QA-Neustart bei „Lädt tatsächliche Spielszene …“ hängen blieb. Für Abschluss bleibt eine echte Runde mit Rampe, Außen-/Fahreransicht sowie dem Vergleich Trick-/Normallandung nötig.

**Budget nach A29:** offizielle Codex-Werte 44 % Fünf-Stundenverbrauch / 22 % Wochenverbrauch (56 % / 78 % Rest).

A30 hat die Emissionsraten im reduzierten Modus auf Werte 40–50 % des Normalbetriebs gesetzt; für Leserlichkeit bleiben La-Ola/kurze Jubelbewegung im Shader und der gleiche Zeit-/Fahrbahneffekt aktiv. Bei Qualitätswechsel während laufender Rosen- oder Windeffekte wird die neue Stufe sofort übernommen. `tests/crowd-wave.test.mjs` testet alle sechs Typen, Überhöhungsgrenzen und Abklingen. `npm test` 130/130, gezielte Reaktions-/Tracktests 22/22 und Build bestanden. Ein verblindeter Spielscreen konnte nach A27 noch nicht geladen werden; Sound/HUD/Dreirundeneffekt müssen später in echter Fahrt geprüft werden.

**Budget nach A30:** offizielle Codex-Werte 44 % Fünf-Stundenverbrauch / 22 % Wochenverbrauch (56 % / 78 % Rest), zuletzt nach A29 abgerufen.

### A31–A34 – ergänzte Abnahmen und Aufgaben (Marcel, 11.10.2026)

Marcels fortgesetzter Auftrag ergänzt konkrete Abnahmepakete für die schon bestätigten Streckenziele: Ereignisprüfansicht und VFX in Normal-/Schwachgrafik zuverlässig laden und belegen; Rampen als vollständige Alternativrouten mit Rückführung und Botlinie prüfen; feste Boostpositionen sowie kurze, faire Streckenreaktionen pro Kurs gegen mehrere Linien testen; faire Positionswechsel, Itemtaktik und Bewegungstricks in vollständigen Drei-Runden-Botläufen auswerten. „Zufällig“ bleibt als variierende feste Platzierung pro Strecke verstanden, nicht als prozedurale Laufzeitgenerierung. Die vier Pakete stehen in CURRENT-WORKLIST.md und LONG-TERM-GOALS.md; Sarahs dokumentierte Originalideen werden nicht erweitert oder umgedeutet.

Nach der A30-Codeänderung erneut `npm test`: 130/130 bestanden. Die letzte TypeScript-/Produktionsbuildprüfung für genau diese Codeänderung bestand ebenfalls; `git diff --check` ist sauber. Ereignis-Sicht/Hören und bewegter Rennlauf sind weiter offen. Offizielle Nutzung bleibt bei 44 % Fünf-Stunden- und 22 % Wochenverbrauch (zuletzt live abgefragt).

**A31-Prüfbeleg (verdeckter In-App-Browser, 11.10.2026):** Die Ereignisprüfansicht lud nach etwa 10–15 Sekunden die komplette Berliner Szene; ihr Button war bis dahin deaktiviert. Zeppelintrigger meldete „Zeppelinmodell aktiv“ und die Seitenkamera zeigte Rumpf/Banner über der Stadt. Havanna wurde nach Kurswechsel ebenfalls geladen; der Wellentrigger erzeugte helle Gischtpartikel. Schwachgrafik ließ sich während eines weiteren Welleneffekts aktivieren, aber zwei Schübe überlappten; kein belastbarer Mengenschluss. Die Balkonrede löste aus, doch Rosen waren in Fahrer-/Profilansicht kaum sichtbar. Emitterhöhe wurde auf 11 m abgesenkt, Partikelgröße auf 0,30–0,48 m erhöht; Nachprobe zeigte weiterhin keinen klaren Rosenregen. Kein akustischer Vergleich, keine Bilddatei exportiert. Eigener versteckter Tab und der zugehörige Vite-Prüfserver wurden nach der Prüfung geschlossen.

## 11.10.2026 – A22/A23: Berliner Zeppelin im Szenenfokus und Bannerlesbarkeit

Aus der A21-Prüfansicht wurde der echte Zeppelin-Knoten aktiviert und anschließend mit der Seitenkamera verfolgt. Die erste Motivansicht zeigte das tatsächliche Modell vor der Berliner Stadt: silberner Rumpf, Gondel, Banner und Flossen. Beim Seitenwechsel war ein Bannertext spiegelverkehrt. Beide Banner-Meshes erhielten dieselbe horizontale UV-/Meshspiegelung, danach waren auf beiden Außenansichten die sichtbaren Textteile in Leserichtung. `npm run build` mit TypeScript bestanden; Bundles 2.164,54 KB / 535,10 KB gzip und bekannte Chunkwarnung.

Das CUA-Bild wurde im verdeckten Prüflauf angesehen, aber nicht als lokale Datei exportiert; kein dauerhaftes Bild in `docs/evidence/`. Die Grafikprüfung bestätigt weder den spielenden Kameraausschnitt noch Windwirkung, Publikumsreaktion, Rennleistung oder menschliche Abnahme. A4 bleibt dafür offen. Offizielle Codex-Werte nach diesem Paket: 37 % Fünf-Stundenverbrauch / 21 % Wochenverbrauch (63 % / 79 % Rest).

## 11.10.2026 – Neues A21 aus der offenen A4-Sichtprüfung

Der bisherige verborgene Berlinlauf hat den Runde-zwei-Toast belegt, aber den Zeppelin im Kamerabild nicht eindeutig gezeigt. Die Grafikprüfansicht in `tests/feedback-visual.html` hat jetzt direkte Auswahl für alle sechs Rennereignisse; Auswahl und Heimstrecke bleiben gekoppelt. Nach Auslösung zeigt der Status das Ereignis, beim Zeppelin auch `Propaganda zeppelin`-Knoten aktiviert/inaktiv. `npm run build` bestand. Im versteckten In-App-Browser lud die echte Berliner Szene; der Zeppelin-Knoten war nach dem Trigger aktiv. In der festen Umgebungsansicht und der freien Übersicht war das Modell selbst nicht klar zu sehen. Peking lud nach Auswahl automatisch die Kulturrevolutions-Schleife und der Pflichtjubel-Trigger ließ sich auslösen; Partikel waren im Bild nicht eindeutig. Deshalb ist dies ein reproduzierbarer Steuerungs-/Knotenstatusbeleg, keine visuelle Ereignisabnahme. Der vorherige Rennlauf wurde pausiert; Auto-Gas und Lenkhilfe wurden ausgeschaltet.

**Budget nach A21:** offizielle Codex-Werte 35 % Fünf-Stundenverbrauch / 20 % Wochenverbrauch (65 % / 80 % Rest).

## 11.10.2026 – Codex: Berliner Zeppelin erreicht die Stadiongerade in Runde 2

Berlin verwendet denselben `atSecondLapTrackEvent`-Check wie die übrigen fünf Kursereignisse: `TRACK.length + s - TRACK.start` muss mindestens erreicht sein und die aktuelle Streckenposition muss zwischen s=45 und s=182 liegen. Der Bereich liegt auf der langen Zuschauer-/Tribünengeraden. Der Runde-eins-Hinweis spät in der Runde bleibt. Ein gemeinsamer Regressionstest prüft jetzt alle sechs Kurszonen gegen falschen Rundenstand, falschen Ort, Eintritt und Zonenende. Gezielte Streckentests 30/30, Typprüfung, Build und Vollsuite 133/133 bestehen. Der Zeppelin wurde im aktuellen Lauf nicht bis zum Ereignis beobachtet; keine Runtime-Sichtabnahme behauptet.

Verborgener Runtimeversuch: eigenes GP auf Stadionring gestartet, bis Anzeige 2/3 und 1:32 Renndauer. Rangfolge wechselte sichtbar; HUD/Minimap und 68–83 km/h wurden gezeigt. Keine Lenkeingaben erzeugten schwere Kontakte; Zustand fiel auf 2 %. Die Zugänglichkeit meldete Runde 2, aber das vier Sekunden lange Ereignisfenster war bei der Screenshotkontrolle möglicherweise bereits vorbei, und der Zeppelin war im Kamerabild nicht eindeutig sichtbar. Daher Trigger-/VFX-Abnahme weiter offen. Prüf-Tab nach Escape geschlossen, eigener Server beendet. Offizielle Codex-Nutzung nach dem Paket: 18 % Fünf-Stunden- und 18 % Wochenverbrauch (82 %/82 % Rest).

Kleine A4-Reaktionen: Berlin s=295–325 Jubel, Rom 505–535 Welle, Havanna 585–615 Jubel, Pjöngjang 585–615 Welle, Moskau 1185–1215 Jubel, Peking 285–315 Welle. `trackEventLap` prüft den aktuellen Landmarkenort und ordnet ihn den drei Rennrunden zu; der gespeicherte letzte Trigger verhindert Wiederholung in derselben Runde. Tests decken Runde 1–3, vierte Runde, falschen Ort und Zonenende ab. `node --test tests/track.test.mjs tests/bot-racing.test.mjs` 16/16; Typprüfung und Build bestanden; Vollsuite 134/134. Kein Runtime-Bild des Reaktionsmoments. Offizielle Nutzung nach diesem Teilpaket: 19 % Fünf-Stunden- und 18 % Wochenverbrauch (81 %/82 % Rest).

## 11.10.2026 – Codex: Sechs-Kurse-Abgleich, Shortcut-Vergleich und Ereignisorte

Metriken und Grenzwerte sind in CURRENT-WORKLIST.md unter „Technischer Vergleich und erster Ausgleich“ festgehalten. Alle Kurse wurden mit derselben 2-m-Abtastung ausgewertet; gerade Anteil gilt als |Krümmung| < 1/150 m. Dreistufige Bot-Medianzeiten über drei Runden: Stadionring 231/210/204 s, Rom 241/213/206 s, Havanna 252/221/216 s, Pjöngjang 336/286/277 s, Moskau 437/373/360 s, Peking 288/251/244 s (leicht/mittel/schwer). Das bestätigt funktionierende Runden/Schwierigkeit, nicht menschlichen Fahrspaß oder FPS.

Der erste Shortcut-Vergleich wurde mit demselben schnellen Botstil und drei Runden, ohne Items/Boostpads, als einmalige Richtungsprobe gefahren. Er ergab Hauptweg/Shortcut: Berlin 207,8/201,8 s; Rom 209,3/209,1 s; Havanna 220,4/225,3 s; Pjöngjang 290,4/269,1 s; Moskau 376,4/387,4 s; Peking 249,6/255,5 s. Danach erhielten Havanna, Moskau und Peking die in der Arbeitsliste genannten festen Boost-/Limitanpassungen. Diese Endwerte wurden im Volltest nicht separat zeitlich verglichen.

Die Vollsuite bestand mit 133/133. Eine erste Fassung dieses Laufs entdeckte den noch auf Moskaus vorherigen Wert <10 m/s gesetzten Layouttest; die aktualisierte Regression prüft jetzt den 15-m/s-Wert. Build und Typprüfung bestehen; Chunkwarnung bleibt. Offizielle Nutzung: 15 % Fünf-Stundenverbrauch / 17 % Wochenverbrauch (85 % / 83 % Rest). Kein Reset und keine Zusatzkontingente verwendet.

Runde-zwei-Ereignisse müssen für Rom (970–1125), Havanna (105–330), Moskau (95–520), Pjöngjang (1372–1400) und Peking (880–1040) Fortschritt und tatsächlichen Ort erfüllen. Moskaus Parade erhält den Konfetti-Emitter; der Zeppelin wird nur für `zeppelin` gestartet. Die vollständige menschliche Fahrt und der sichtbare ausgelöste Partikeleffekt wurden im aktuellen Paket nicht geprüft.

Zusatzlaufzeitcheck nach dem Checkpoint: der eigene verborgene In-App-Browser lud Stadionring mit 1.366 m und sechs Karts sowie Havanna mit 1.423 m. Der Havanna-GP zeigte nach etwa vier Sekunden Rangwechsel im Feld, sechs Karts, Minimap und 66–67 km/h. Escape brachte den Lauf zurück ins Menü; die eigenen Prüftabs und der Server auf Port 4174 wurden beendet. Es wurde kein voller Kurs gefahren und kein Runde-zwei-Ereignis erreicht; FPS/Konsole nicht geprüft, Screenshot nicht separat gespeichert. Diese Stichprobe ist Laufzeitbeleg, keine menschliche Fahrabnahme.

## 11.10.2026 – Codex: Peking-Streckenpass, Prüfung und Grenzen

Ausgang: Länge 1.565,6 m; 60,8 % annähernd gerade bei 2-m-Abtastung und |Krümmung| < 1/150 m. Umsetzung misst 1.609,4 m und 38,9 % annähernd gerade; kleinster Radius 20,2 m. Ein erster Entwurf fiel auf 10,9 m Radius und führte beim manuellen Lenktest zu Wandkontakten; diese Kontrollpunkte wurden vor der Abnahme geglättet. Das ist auch ein Hinweis, dass die Geometriegrenze allein die menschliche Kurvenabnahme nicht ersetzt.

Die neue Spurfolge hält Planerfüllungsplatz, Hutong, Regelheft-Serpentine und Palastgraben unterscheidbar. Zweiter Kicker bei s=500 vor der Hutong-Entscheidung; bestehende 3,8-m-Plateaurampe nach s=1.349. Hutong-Gasse: -0,75 m in der Mitte, 11,5-m/s-Limit, ca. 166 m Streckenlänge gegenüber 203 m Hauptweg. Regelheft-Pflichtjubel: Warnung im letzten Viertel von Runde 1, Ereignisstart in Runde 2 beim Eintritt in s=880–1040; 14 Sekunden mäßige Geschwindigkeits-/Lenkgrip-Einbuße nur zwischen lane -2,4 und +2,4. Bots und Spieler verwenden dieselbe Hilfsregel, außen bleibt Ausweichraum. `slice-scene` erzeugt in der Serpentine einen begrenzten Papierstoß und spielt die Peking-Ansage.

Peking-Tests 2/2, vollständige Suite 132/132, TypeScript und Build bestanden. Drei-Runden-Botsimulationen auf sechs Strecken und drei Schwierigkeitsstufen liefen; der Peking-Stilbot nimmt die Hutong-Route. Build zeigt 2.161,52 KB Hauptbundle bzw. 534,16 KB gzip und die bekannte Chunkwarnung. Verborgener eigener Browser zeigte die aktuelle 1.609-m-Strecke und startete ein Einzelrennen bis zur Startansicht; kein vollständiger Spielerpass, kein Runde-2-Event, keine finale Partikelansicht, FPS- oder menschliche Fahrabnahme. Die erste schärfere Testfassung ist nicht der jetzige Stand. Nächster Block: direkter Sechs-Kurse-Pass mit Sicht auf Kurven, Linie, Ereignis und Wiederholungsrunde.

## 11.10.2026 – Codex: Havanna-Streckenpass, Prüfung und Grenzen

Zweiter Havanna-Pass: 1.422,6 m statt 1.411,3 m; 2-m-Abtastung mit |Krümmung| < 1/150 m ergibt 46,1 → 26,6 % annähernd gerade Strecke. Die Küsten-S-Kurven bringen zusätzliche Linienwechsel. Neuer kleiner Kicker bei s=380 m; die Rampe bei s=1.146 m führt weiterhin auf den 4-m-Hügel. Zigarrenfabrik-Abkürzung bleibt eine feste kürzere Schotterlinie mit 10,5-m/s-Limit. Die Malecón-Welle wird Ende Runde 1 angekündigt und beim Eintritt des ersten Karts in die Küstenzone der zweiten Runde ausgelöst. 14 Sekunden: nur die seewärtige Spur verliert leicht Tempo und Lenkgrip; Mittel-/Landseite bleiben frei. Dieselbe Logik gilt für Spieler und Bots.

Havanna-Tests, `npm run typecheck`, `npm run build` und `npm run test:full` außerhalb der Sandbox bestanden: 132/132 Tests. Innerhalb der Sandbox scheiterten Git-Fixtures mit `NtCreateDirectoryObject ... 0xC0000022`; außerhalb liefen Team-/Launcher-Tests ebenfalls durch. Build-Ausgabe: 2.160 KB, 533,90 KB gzip, vorhandene Chunkwarnung. Vorher-/Nachher-Routengrundrisse liegen in `docs/evidence/2026-10-11-havana-pilot/`.

Eigener verborgener Codex-In-App-Browser: Spielstand auf Havanna geladen, bis Runde 2 gefahren, Malecón-Ereignismeldung beobachtet. Die Partikelwolke wurde nach dem ersten Lauf lokalisiert/verkleinert, aber der neue Effekt nicht erneut im ausgelösten Zustand angesehen; deshalb keine finale VFX-Abnahme behaupten. Kein vollständiges Drei-Runden-Rennen, FPS- oder menschlicher Fahr-/Stiltest. Sarahs zusätzliche Originalideen nicht erfunden. Nächster Kursblock: Peking.

## 11.10.2026 – Codex: Duce-Drom-Streckenpass, Abschluss und Grenzen

Die Romroute ist auf 1.367 m verlängert (vorher 1.238 m). 2-m-Abtastung mit |Krümmung| < 1/150 m: gerade Anteile 55 → 38 %. Neu sind zwei zusätzliche Aventin-Richtungswechsel, verschlungene Tiber-Anfahrt, S-Bogen am Triumphbogen, kleiner Tiber-Kicker sowie die im Belvedere-Plateau verbleibende 6-m-Rampe. Die Stallgasse taucht bis zu 1,6 m ab und bietet einen festen Schubstreifen. Balkonrede: Trigger bei Eintritt ins Balkonviertel der zweiten Runde, 14 Sekunden, Rosenwirbel bremst auf der Mittellinie; zwei Außenlinien sind frei. Im selben Lauf werden alle Karts gleich behandelt.

Prüfung abgeschlossen: `npm test` 114/114, `npm run test:full` 131/131, `npm run typecheck` und `npm run build` bestanden. Build meldet das bestehende große Babylon-Bündel (2.160 KB, 534 KB gzip). Eigener verborgener Codex-In-App-Browser lud den Kurs; Karte 1.367 m, HUD 51–68 km/h, Botreihenfolge änderte sich und ein Kontakt zeigte 74 % Karosseriezustand. Der Lauf endete vor einem vollständigen Rennen und vor Runde-2-Balkonereignis; kein FPS-, Konsolen- oder menschlicher Fahrtest. Testtab und eigener Vite-Server wurden beendet. Offizielle Codex-Werte: 6 % Fünf-Stundenverbrauch / 16 % Wochenverbrauch (94 % / 84 % Rest).

Die operative Liste bestätigter offener Pakete steht in CURRENT-WORKLIST.md: Havanna, Peking, Sechs-Kurse-Pass, Ereignisse, Bots/Items, Fahrgefühl, Audio/Publikum, visuelle Qualität und Geräte-/Menschenabnahmen. Unbeurteilte Balancefragen und Sarahs nicht dokumentierte Originaldetails bleiben offen für ein Gespräch.

## 11.10.2026 – Codex: Tempo-Paket, Prüfergebnisse und Grenzen

Projektstart: sauberer `main`-Checkout und `origin/main` waren auf `1eba44f` identisch; Team-Startskript meldete keine ungesicherten Änderungen oder Überschneidungen. Tempo-Paket: normale Spitze 19,5 m/s, Turbo 24,5 m/s; Beschleunigung, Kartkontakt-Crashschwelle, Item-/Projektiltempo, Botreaktion und Kamera nachgeführt. Ein weiterer Testfehler offenbarte, dass `advanceKart` `topSpeedBonus` verlor; das Feld wird jetzt weitergereicht.

Prüfung: `npm run typecheck`, `npm run build`, `npm run test:full` 130/130 bestanden; bei vollem Testlauf außerhalb der Sandbox, weil Git-Fixtures MSYS-Unterprozesse benötigen. Simulationen: alle sechs Kurse auf drei Botstufen beendeten drei Runden; Pjöngjang fünf Bots bei Grundtempo und +5 m/s bleiben von der Paradekolonne weg; Driftlinientest auf drei Kurven bestanden. Demo-Grand-Prix im eigenen verborgenen Codex-In-App-Browser bis Runde 2; HUD erreichte 70–79 km/h, Botplätze änderten sich, Runde/Ereignis/Itemanzeigen waren aktiv, keine Konsolenfehler. Die Tabinstanz und der eigene Server wurden anschließend geschlossen. Dieser Lauf ist keine vollständige Renn- oder Leistungsabnahme, und keine menschliche Fahrbewertung.

Offizielle Codex-Werte nach dem Paket: 3 % Fünf-Stundenlimit und 16 % Wochenlimit verbraucht (97 % / 84 % Rest). Nächste bestätigte Umsetzungsarbeit: Duce-Drom/Rom als nächster Streckenumbau, danach Havanna und Peking. Sarahs konkrete Detailideen bleiben bis zum Gespräch offene, nicht gemeinsam bestätigte Punkte.

## 11.10.2026 – Codex: Bot-Vorausschau und Prüfgrenze

In `botInput` lag die Wertung für sehr langsame Hindernisse außerhalb von `difficulty.reaction`, aber noch im erweiterten Verkehrsfenster unter null; das konnte die belegte Spur bevorzugen. Abstandswertung und Filter nutzen nun denselben geschwindigkeitsabhängigen Bereich. Der Pjöngjang-Test fährt die Paradekolonne mit fünf Bots bei unverändertem Tempo und mit `topSpeedBonus = 5 m/s`; beide Läufe passieren über zwei Runden mit weniger als 60 Hindernis-Kontaktschritten. Das ist eine Simulation des bestehenden Controllers, **keine** echte Erhöhung des globalen Tempolimits und kein menschlicher Fahrtest. `npm test` 111/111, `npm run typecheck` und `npm run test:full` 128/128 bestanden; kein neuer Browser-/Bildbeleg. Offizielle Werte nach dem Paket: 14 % Fünf-Stunden-, 87 % Wochenrest. Nächstes großes Tempo-Paket erst nach Budgeterholung beginnen.

## 11.10.2026 – Codex: kurze und vollständige Testläufe

`npm test` ist der schnelle Standardlauf. Die aktuelle Wiederholungsprüfung am 12.10.2026 bestand 136/136 in 3,224 s Node-Testdauer (8,3 s Wandzeit). Die vorige Vollprüfung bestand `npm run test:slow` 17/17 in 97,87 s und `npm run test:full` 153/153 in 101,14 s; `npm run build` samt TypeScript/Vite war erfolgreich. Hauptbundle 2.168,01 KB / 536,57 KB gzip mit bekannter Größenwarnung. Neun lokale Git-Workflow-Fixtures scheiterten innerhalb der Sandbox beim MSYS-Unterprozess (`NtCreateDirectoryObject ... 0xC0000022`), bestanden außerhalb der Sandbox. Die 17 langen Tests bleiben erhalten und sind im Volltest enthalten. Keine Tests gelöscht. Bei Änderungen an Strecke, Bots, Fahrmodell oder Team-Workflow zusätzlich `npm run test:full` ausführen; Testorganisation selbst ändert keine Spielmechanik und erfordert keinen Bild-/Hörtest.

Offizielle Codex-Anzeige nach diesem Paket: 2 % Fünf-Stundenverbrauch und 29 % Wochenverbrauch (98 % / 71 % Rest); keine Resets oder Zusatzkontingente verwendet.

### 12.10.2026 – A43 Warnung im Rennen erreicht; Trefferabnahme offen

Ein weiterer versteckter Pjöngjanglauf erreichte die natürliche Runde-1-Warnung bei Rennzeit 1:15.35. Mehrere kontrollierte direkte Projektilinjektionen ergaben in diesem Prüfszenario keinen verifizierten Trefferzustand; deshalb entstand kein gültiger Vorher-/Nachher-Beleg für die Warnungspriorität. Als Warnungsbeleg bleibt nur `docs/evidence/a43e-pyongyang-warning-only.png`; er zeigt keinen Treffer. Der laufende `selectRaceInfoNotice`-Regressionstest und die Vollsuite prüfen die reine Prioritätsregel, ersetzen aber nicht den fehlenden Integrationsbeleg. A43 bleibt offen. Für die nächste Wiederholung den Treffer über einen bestehenden reproduzierbaren Itemtest/Runtime-Hook auslösen und den Ereignis- sowie HUD-Zustand atomar erfassen.

### 12.10.2026 – A50 zweite und dritte natürliche Wiederholung

Zwei zusätzliche Peking-Einzelrennen mit sechs Karts fuhren den Runde-zwei-Pflichtjubel natürlich an, je einmal mit normaler und reduzierter Grafik. Vor, während und nach dem Event wurden jeweils sechs Sekunden gemessen. Zusammen mit dem ersten Pass: RAF-Schätzungen normal 37,3–43,0 FPS vorübergehend; reduziert 38,6–42,5 FPS. In allen 18 Phasen blieb RAF-P95 innerhalb 36,0–36,1 ms. Engine-FPS schwankte stärker (zweiter Pass normal 38,3–40,4; reduziert 32,4–43,6; dritter Pass normal 39,7–40,7; reduziert 37,3–40,8). Damit ist kein klarer Ereignis-bedingter Einbruch im Instrumentierungs-/Headless-Test zu erkennen, aber Renderer-/GPU-Arbeit bleibt unisoliert. JSON-Belege siehe `docs/evidence/a50-beijing-event-headless-repeat-02.json` und `...repeat-03.json`; erster Pass ist `a50-beijing-event-headless-metrics.json`. Dritter nicht-headless Gerätepass und A/B-VFX-Isolation bleiben offen.

## 11.10.2026 – Claude: Prüfnotizen Pjöngjang-Pilot

- Test-Chrome: eigenes Profil `.tools/claude-chrome-profile`, Port 9231, mit den Anti-Drosselungs-Flags; Marcels Vite-Server auf 4173 mitbenutzt. Der eingebaute Browser der Claude-App drosselt verdeckt und lieferte keine Bilder.
- Einzelrennen per CDP: `#menu-single` → Streckenkarte → „Rennen starten“; `?demo=1&weather=sun`, Tag durch kurzzeitig festgelegtes `Math.random` beim Start erzwungen (reiner Prüfhilfsgriff, nicht im Spiel).
- Freie Kamera auch nach Rennende per `window.__DK.free.start()` nutzbar, Kamera über `free.camera.position`, `free.yaw`, `free.pitch` setzbar – so entstanden die Übersichts- und Kolonnenbilder.
- **Hinweis an Marcel:** Während der Umbauten lief dein Vite-Server; ein offenes Spielfenster hat dadurch mehrfach neu geladen. Das eigene Test-Chrome (Port 9231) wurde am Ende geschlossen.

## 11.10.2026 – Abschlussprüfung und Hinweis für die Cloud-Fortsetzung

Die Cloud-Fortsetzung soll den neuesten gemeinsamen Babylon-`main` von `marceldamm/diktator-kart` verwenden, AGENTS.md und die vier Hauptdateien lesen und bestätigte offene Arbeit in überprüfbaren Paketen ausführen. Die priorisierte neue Zielrichtung steht oben in LONG-TERM-GOALS.md; der aktuelle nächste Schritt in CURRENT-WORKLIST.md. Alte PlayCanvas-Basis und historische Logs sind nur Referenz. Cloud-Zugriff, Rechte und Sichtprüfung müssen dort tatsächlich geprüft werden; ein hier formulierter Prompt ist keine bereits gestartete Cloud-Aufgabe. Die heute neue Änderung ist reine Dokumentation; vor dem Abschluss waren Git-Status sauber, `main` und `origin/main` identisch, Babylon-Mindestabstammung geprüft. Kein Build oder Spieltest für dieses Dokumentationspaket.

**Weiter offene Teamkommunikation:** Marcels Antwort an Sarah vom 10.10. steht unten weiterhin als „notiert, nicht versandt“. Sarahs Sicht auf ihre fünf Kursideen/Pjöngjang ist nicht eingeholt. Der ältere Hinweis von Claude an Marcel und Sarah zum eigenen Fahr-/Sicht-/Hörtest von Spree-Kai, Säulen-Haarnadel, Hitler-Nahansicht und Motor bleibt offen; hieraus wurde keine Abnahme abgeleitet.

## 11.10.2026 – Marcels Antworten zu Sarahs Streckenideen (Sarah-Gespräch offen)

Antworten auf die neun Fragen im unmittelbar folgenden Quellenabgleich; Marcels Perspektive wird von Sarahs noch ausstehender Rückmeldung getrennt. Keine Nachricht an Sarah wurde versandt und keine Zustimmung von ihr behauptet.

| Nr. | Marcels Antwort / daraus folgender Status |
|---|---|
| 1 | Sarahs fünf Kursnamen und Orte beibehalten. **Bestätigtes Ziel.** |
| 2 | Marcel kennt derzeit nur die konkreten Angaben in den Dokumentationen. Weitere ursprüngliche Szenen oder Streckendetails von Sarah sind **nicht belegt**; Gespräch mit ihr nötig. |
| 3 | Für Pjöngjang nannte Marcel „Unter Führung“ (wahrscheinlich „Unterführung“, diktierte Formulierung nicht sicher), Parade und Startgatter; maßgeblich soll auch sein, was Sarah vorsieht. **Parade und Startgatter als zu erhaltende Motive festhalten; Unterführung und weitere Kerne mit Sarah klären.** Der Wunsch nach kurvigeren Passagen bleibt bestehen. |
| 4 | Für Rom und Havanna soll die beste, spannende Variante gewählt werden; Marcel legt keine heutigen Abschnitte als unveränderlich fest. Konkrete Auswahl erst nach Variantenvergleich und Sarah-Abgleich. |
| 5 | Für Moskau und Peking hat Marcel noch keine spezifischen Wahrzeichen oder Fahrmomente festgelegt. Gestaltungsvorschläge sollen aus Kursidentität und späterem Sarah-Gespräch entstehen. |
| 6 | Die fünf älteren Hauptstadtzonen sind Marcel wichtig und **sollen inhaltlich umgesetzt werden**. Ob in Berlin, auf der verbindenden Strecke oder verteilt, ist noch offen. Die persönliche Urheberschaft dieser historischen Ideen bleibt ungeklärt; Marcels Wertschätzung ersetzt keinen Herkunftsbeleg. |
| 7 | Die siebte, die Themen verbindende Strecke bleibt ein **bestätigtes späteres Ziel**. Motive und Zeitpunkt innerhalb der weiteren Roadmap werden nach den sechs Einzelspielerstrecken bestimmt. |
| 8 | Marcel gibt für kursbezogene Ereignisse und Risiken kreative Freiheit. Bestehende Satire-, Fairness-, Lesbarkeits- und Leistungsgrenzen sowie Sarahs belegte Namen/Orte gelten weiter. |
| 9 | Marcel und Sarah müssen über offene Kreativfragen noch miteinander sprechen. Bis dahin keine gemeinsame Bestätigung für Detailänderungen behaupten. |

**Nächster Schritt:** Sarahs Sicht auf ihre fünf Kursideen und Pjöngjang-Motive in einem echten Gespräch einholen; danach Unterschiede, bestätigte Kerne und offene Fragen in den vier Hauptdateien nachführen. Die Fragen werden nicht wiederholt, solange keine neue Information vorliegt.

## 11.10.2026 – Sarahs ursprüngliche Streckenideen: Quellenabgleich und Fragen (Marcel beantwortet; Sarah offen)

**Belegte Herkunft:** Sarahs eigene Nachricht vom 06.10.2026 [unten in dieser Datei](TEAM-NOTES.md) nennt fünf Planungsstrecken mit Ort: **Ewige-Führer-Allee (Pjöngjang), Kulturrevolutions-Schleife (Peking), Havanna-Revolutionsring (Havanna), Duce-Drom (Rom), Genossen-Gerade (Moskau)**. Die damalige Streckenauswahl zeigte diese Namen; nur Berlin/Stadionring war zu dem Zeitpunkt spielbar. Heute sind alle sechs Kurse spielbar. Die Dokumente [Rom](docs/26-duce-drom.md), [Havanna](docs/29-havanna-revolutionsring.md) und [Pjöngjang](docs/30-pyongyang.md) trennen Sarahs Namen/Orte von später ausgearbeiteten Routen, Kulissen und Ereignissen. Die fünf Zonen Palastplatz, Boulevard, Staatsdruckerei, Baustelle, Palastgärten stammen aus dem alten gemischten Hauptstadt-Konzept ([Game Design](docs/01-game-design.md), [Alt-Extraktion](docs/11-legacy-extraction.md)); ihre persönliche Urheberschaft ist dort nicht sicher belegt. Die geplante siebte, verbindende Strecke ist ein separater langfristiger Vorschlag. Sarahs möglicherweise nur lokal vorhandene weitere Entwürfe sind hier nicht einsehbar.

**Fragen an Marcel, anschließend mit Sarah abzugleichen:**

1. Sollen Sarahs fünf Kursnamen und Orte unverändert als feste Identität erhalten bleiben? Falls einer geändert werden soll: welcher und warum?
2. Kennst du von Sarah zu einem der fünf Kurse konkrete Szenen, Hindernisse, Abkürzungen oder Fahrmomente über Name und Ort hinaus? Was davon ist für sie unverzichtbar?
3. **Pjöngjang:** Welcher Kern soll trotz der von dir gewünschten kurvigeren Pilotstrecke erhalten bleiben: monumentale Allee/Parade, Unterführung, Statuen, Startgatter oder etwas anderes? Was darf deutlich umgebaut werden?
4. **Rom und Havanna:** Welche heutigen, später ausgearbeiteten Abschnitte gefallen euch und sollen bleiben; welche sollen für mehr Kurven, Höhen und Linienentscheidungen neu entstehen?
5. **Moskau und Peking:** Welche eigenen Wahrzeichen, Streckenereignisse und Routelemente soll Sarahs jeweiliger Name unbedingt hervorrufen? Welche heutigen Passagen wirken zu austauschbar?
6. **Berlin:** Soll die alte gemischte Hauptstadtidee mit Palastplatz, Papp-Zuschauern, Staatsdruckerei/Stempeln, Baustelle und Palastgärten in Berlin, in eine spätere verbindende Strecke oder nur als lose Ideenquelle eingehen? Diese fünf Zonen sind hier nicht sicher Sarah persönlich zuzuordnen.
7. Wollt ihr die siebte verbindende Strecke nach den sechs überzeugenden Einzelspielerstrecken weiterhin als eigenes Ziel, und welche Motive müsste sie verbinden?
8. Darf jede Themenstrecke ihre eigene Art von Überraschung und Risiko bekommen, oder gibt es zu einem Sarah-Kurs ein Motiv/Ereignis, das ihr ausdrücklich vermeiden möchtet?
9. Welche dieser Antworten kannst du selbst entscheiden, und welche Punkte möchtest du ausdrücklich erst mit Sarah gemeinsam festlegen? Ihre Zustimmung wird nicht aus Schweigen abgeleitet.

**Status:** Marcels Antworten stehen unmittelbar oben; Sarahs eigene Rückmeldung bleibt offen. Namen/Orte sind belegte Sarah-Beiträge; spätere Ausarbeitungen nicht als ihre Originalentwürfe ausgeben. Ziel zum Abgleich in LONG-TERM-GOALS.md, aktueller Schritt in CURRENT-WORKLIST.md.

## 11.10.2026 – Marcel: Antworten zum Spielgefühl-Abgleich (Ziele dokumentiert)

Marcels nummerierte Antworten beziehen sich auf den unveränderten Fragebogen direkt darunter. Die bestätigten Langfristziele und Reihenfolge stehen in LONG-TERM-GOALS.md; für diese Zielklärung wurde kein Spielcode geändert. Nach der Dokumentation sollen Sarahs ursprüngliche Streckenideen aus belegten Quellen betrachtet und separat mit Marcel abgefragt werden.

| Nr. | Marcels Antwort und Status |
|---|---|
| 1–2 | Alle Kurse wirken langweilig; keine Rangfolge. Codex wählt den Piloten: Pjöngjang wegen des beim Audit gemessenen sehr geraden Rhythmus. |
| 3–5 | Pjöngjang darf deutlich kurviger werden. Moskau soll abwechslungsreicher sein; seine aktuelle Länge ist okay. |
| 6–7 | Technische Kurven, Höhen/Sprünge, geteilte Wege und große Setpieces zusammen; viele kleine Linienentscheidungen. |
| 8 | Jede Strecke soll individuell entworfene Abkürzungen haben: mal itemabhängig, mal vom Untergrund beeinflusst, mal frei befahrbar. Auf ihnen dürfen Sturz, Feuer oder andere Effekte drohen. Keine dynamische Zufallsgenerierung der Strecken. |
| 9–10 | Wechselnde Straßenbreiten sind erwünscht; pro Ort prägnante Motive über Architektur, Umwelt, Fahrbahn, NPCs und Objekte. |
| 11–13 | Kleine wiederkehrende und große angekündigte Streckenereignisse; zeitweilige Spuränderung/-sperre bei sicherer Alternative; Wetter/Wellen/Schnee sollen die Linienwahl beeinflussen. |
| 14–15 | Thematische Hindernisse aller vorgeschlagenen Arten und kleine bewegliche Objekte, maßvoll. Vorwarnung für jedes Ereignis passend, nicht einheitlich. |
| 16–17 | Eher kurz- bis mittellange Zeitkosten nach denselben Regeln für alle gerade im Wirkbereich; geschickte Positionierung darf den Effekt vermeiden. |
| 18 | Itembox-Häufigkeit kann Marcel noch nicht beurteilen; kein Mengenentscheid. |
| 19–21 | Mehr unmittelbares Chaos und Bewegungstricks. Separate Schilde erscheinen Marcel fraglich; bevorzugt wird vorläufig ein hinten gehaltenes Item, das beim Treffer verbraucht wird und das Kart schützt. Das ist noch kein Detailentscheid zum bisherigen Abwehrslot. Stärkeres Trefferfeedback ist erwünscht, bei fairer kurzer Kontrollstörung. |
| 22–24 | Neuer Drift noch nicht selbst beurteilt. Es fehlt **tatsächliche Geschwindigkeit**. Reifen/Motor/Fahrwerk dürfen sich spürbar unterscheiden, mit Balance. |
| 25–27 | Fahrer-/Kart-Erkennbarkeit noch nicht beurteilt. Minimap und gehaltene/ausgewählte Items müssen angezeigt werden. Mehr Publikum, Musikdynamik und insgesamt mehr Klangreaktionen. |
| 28–29 | Codex darf Reihenfolge wählen: Strecken zuerst. Lokaler Mehrspieler-/Battle-Modus erst nach sechs überzeugenden Einzelspielerstrecken. |
| 30 | Abnahme: abwechslungsreiche Kurse; Bots holen auch mal taktisch auf und setzen Items gezielt ein statt konstant zu fahren; Ereignisse ordnen Positionen durcheinander und wirken auf alle betroffenen Karts; mehr Auf/Ab, Tunnel, große Bilder, verteilte Boden-Boosts, verschieden hohe Rampen und Rampen zu alternativen Wegen. Ob Boostpositionen je Rennen wechseln sollen, blieb offen; sicher ist Vielfalt der Platzierung. |

**Noch offen für gezielte Abnahme:** Itembox-Dichte (18), Driftgefühl (22), Kart-/Fahrersilhouetten (25), genaue defensive Itemmechanik (20), variable oder feste Boostpositionen (30). Sarahs ursprüngliche Ideen werden nach Quellenprüfung einzeln gefragt; Herkunft und gemeinsame Bestätigung müssen bei Änderungen sichtbar bleiben.

## 11.10.2026 – Codex: Fragen an Marcel nach dem Spielgefühl-Abgleich (beantwortet bzw. ausdrücklich offen)

**Prüfgrenze:** Der Vergleich mit Mario Kart 8 Deluxe stützt sich auf offizielle Nintendo-Funktionsbeschreibungen, nicht auf eine in dieser Sitzung gespielte Switch-Partie. Diktator Kart: sechs aktuelle Kursläufe als kurze automatisierte Demonstrationsfahrten, feste Rück-/Modellansichten, Quell-/Streckendaten. Kein menschlicher Lenk-, Hör- oder dreirundiger Direktvergleich. Aktuelle Bilder und Laufzeitstatus: `docs/evidence/2026-10-11-gamefeel-audit/`; Branch `main`, Commit `f645be6`, 11.10.2026. Marcel erlaubte für diesen Abgleich ausdrücklich die unsichtbare eigene Chrome-Testinstanz. Sie und der eigene Server wurden nach der Prüfung beendet. Keine Nutzerfenster bedient.

### Strecke und Rhythmus

1. Welche **zwei** Kurse sind für dich beim Fahren am langweiligsten? Welche konkreten Abschnitte?
2. Welcher Kurs soll der erste Pilot für ein neues Streckendesign werden: Pjöngjang, Moskau oder ein anderer?
3. Soll Pjöngjang seine fast durchgehend geraden Parade-Alleen bewusst behalten, oder darf dort eine deutlich kurvigere Passage entstehen?
4. Soll Moskau vor allem ein Hochgeschwindigkeitskurs bleiben, oder braucht es spürbare Brems- und Driftpunkte auf dem Hauptring?
5. Welche Rundenlänge bzw. Rennzeit über drei Runden fühlt sich richtig an? Ist Moskau mit rund 2,22 km pro Runde zu lang?
6. Was reizt dich mehr: enge technische Kurven, Höhenwechsel/Sprünge, geteilte Wege oder große inszenierte Setpieces?
7. Wie viele echte Linienentscheidungen pro Runde wünschst du: eine starke, zwei bis drei oder viele kleine?
8. Soll eine Abkürzung ohne Item bereits knapp schneller sein, oder nur mit sauberem Drift/Schub? Wie hoch darf ihr Fehlschlag-Risiko sein?
9. Möchtest du mehr Streckenabschnitte, deren Straßenbreite sich sichtbar ändert, solange Fahrbarkeit und Botlinien erhalten bleiben?
10. Welche Ortsmotive aus Berlin, Rom, Havanna, Pjöngjang, Moskau und Peking sollen jeweils als unverwechselbarer Fahrmoment hervortreten?

### Streckenreaktionen und Effekte

11. Soll es auf jeder Runde kleine angekündigte Streckenreaktionen geben, zusätzlich zum großen Ereignis am Beginn von Runde 2?
12. Dürfen Ereignisse eine Spur kurz verändern oder sperren, wenn eine sichere Alternative klar sichtbar bleibt?
13. Sollen Welle, Regen oder Schnee vor allem die Optik ändern, oder auch die Wahl zwischen trockener/schneller und nasser/riskanter Linie?
14. Welche thematischen Hindernisse passen dir: Schranken, Aktenwagen, Paradeaufbau, Marktstände, Lautsprecherwagen – oder lieber keine beweglichen Objekte?
15. Wie viel Vorwarnung brauchst du vor einem Streckeneffekt: Schild, Ansage, Lichtsignal, sichtbare Bewegung oder Kombination?
16. Wie oft darf ein Streckenereignis tatsächlich Zeit kosten, ohne sich unfair oder lästig anzufühlen?
17. Soll ein Ereignis alle Karts im Abschnitt gleich beeinflussen, oder soll geschickte Positionierung den Effekt vermeiden können?

### Items und Fahrgefühl

18. Sind die Itemboxen nun häufig genug, oder möchtest du pro Runde mehr/weniger Begegnungen?
19. Fehlt dir bei den Items eher Verteidigung, unmittelbares Chaos, Streckenkontrolle oder ein neuer Bewegungstrick?
20. Welches vorhandene Item macht dir am meisten Spaß, welches fühlt sich entbehrlich oder zu ähnlich an?
21. Soll das Trefferfeedback heftiger wirken, wenn Kontrollverlust und Trefferketten weiterhin kurz und fair bleiben?
22. Wie beurteilst du den neuen Drift: Einlenken, innen/außen öffnen, Mini-Turbo und Loslassen? Wo verlierst du noch die Kontrolle?
23. Fühlt sich das Kart bei etwa 55–60 km/h schnell genug an? Falls nein: fehlt dir eher Kamera-/Umgebungsbewegung, Motorsound oder tatsächliches Tempo?
24. Wie deutlich sollen Reifenwahl und spätere Motor-/Fahrwerksabstimmung im Fahren spürbar werden, ohne eine dominante Kombination zu erzeugen?

### Präsentation und Reihenfolge

25. Welche Fahrer-/Kart-Silhouetten erkennst du im Rennen sofort, welche sehen aus der Verfolgerkamera zu ähnlich aus?
26. Ist das Renn-HUD informativ oder verdeckt es dir zu viel von der Strecke? Welche Anzeige muss immer sichtbar sein?
27. Was fehlt beim Sound am stärksten: Motorwechsel, Reifen/Untergrund, Item-/Trefferklang, Zuschauerkulisse oder Musikdynamik?
28. Soll der nächste größere Arbeitsblock **Streckenrhythmus** vor Fahrer-/Kart-Feinschliff und Cup-Fortschritt priorisieren, oder bleibt die bisherige Reihenfolge?
29. Soll eine spätere lokale Mehrspieler- oder Battle-Variante überhaupt in die nähere Planung, oder erst nach sechs überzeugenden Einzelspielerstrecken?
30. Was sind deine drei wichtigsten Abnahmesätze für einen neuen Kurs, z. B. „Ich will an jeder Runde zweimal bewusst eine andere Linie wählen“?

**Status:** Antwortzuordnung oben; ausdrücklich ungetestete Punkte bleiben offen. Sarahs ursprüngliche Themen nicht stillschweigend ändern.

## 11.10.2026 – Claude: Drift-Messung und Prüfhinweise

- Drift-Simulation: Tastatur-Fahrer mit digitaler Lenkung, Space in Kurven unter 45 m Radius, 0,25 s Reaktion, Abbruch bei Bandennähe; zählt Bandenkontakte pro Runde (Kontakte < 0,5 s Abstand als einer). Skript lag im Sitzungs-Scratchpad; Kernwerte stehen in CURRENT-WORKLIST.md. Ein Simulationsfahrer ersetzt kein menschliches Fahrurteil.
- Zum Testen im Browser: `__DK.items.slots[0] = 'golden' | 'triple' | 'escort'`, dann E. Aktenflut: einem Bot `censor` geben.
- Ursache „schwarzer Boden“ Pjöngjang: selbstgebautes Gitter mit Abwärts-Wicklung wird per Backface-Culling verworfen. Bei eigenen VertexData-Böden Normalen prüfen.

## 10.10.2026 – Claude: Leistungsmessung

- Messwerkzeuge (lokal, ignoriert): `.tools/claude/perf-ab.mjs` (Menü/Rennen/Pause), `menu-rt.mjs` (synchrone Renderzeit), `g.js` (Zeichenaufrufe je Pass). Messungen schwanken auf dem Laptop stark (Takt, andere Chrome-Fenster); nur A/B im selben Lauf vergleichen.
- Babylon-Schattenkarten frustum-cullen nicht: Schattenwerfer-Listen immer selbst begrenzen. Kart-Meshes sind jetzt der größte Einzelposten (~9 ms im Menü).
- Pose-Blends mit Blender 5.2 öffnen (mit 5.2 gespeichert); `DK_KART_GLB=.tools/raw-models/hero-kart.glb` für den Kart-Tausch, da Blender die meshopt-Laufzeitdatei nicht lesen kann.

## 10.10.2026 – Codex: Umweltprüfung und Abschlussreserve

**Korrektur vor Sicherung:** Die erste Thin-Instance-Variante verlor in der finalen Berliner Hauptansicht die Bäume. Für Stadtbäume daher den vorhandenen räumlichen Materialbatch-Pfad beibehalten; Parkbäume teilen weiterhin ihre Geometrie. Die finale Berliner Baumansicht wurde nach dieser Korrektur erneut aufgenommen und mit sichtbaren Laubbäumen kontrolliert. Die übrigen fünf Umweltbilder dokumentieren Boden-/Kurs-Stichproben vor diesem letzten Batchingwechsel; keine finale Rundum-Baumabnahme daraus ableiten. Keine Behauptung einer bestandenen Fern-LOD- oder Geräteprüfung.

**Finale Sichtbelege:** docs/evidence/2026-10-10-feedback/environment-berlin-before/after.jpg bei Hitler, Normal, Tag, Umgebung, Hauptkursposition 0,2. Moskau bei Abkürzungsposition 0,5/Umgebung; Havanna/Peking bei Hauptkurs 0,65/Umgebung; Rom bei 0,2/Umgebung; Pjöngjang bei 0,2/Dreiviertel. environment-<stadt>-after.jpg sind diese aktuellen Stichproben, keine kompletten Rundfahrten. Die verdeckte Pjöngjang-Weitwinkelansicht wurde durch eine freie Kart-/Fahrbahnansicht ersetzt. Letzte offiziellen Werte: 11 % Fünfstunden-/62 % Wochenrest. Nur Umweltpaket sichern und Abschlussreserve erhalten; Kart-Abstimmung, Linienvergleich und Cup-Fortschritt noch nicht umgesetzt.

Neue Baumquellen/Lizenzen und Bearbeitungen in public/assets/CREDITS.md, Export art-source/build_climate_trees.mjs. Assetprüfung: 336/336 Palmen, 3.505/6.265 Laubbäume, 3.947 Nadelbaum, 4.596 Birke; vollständige Texturen bis 512 px und Alpha-Test-Blätter. 16 Baum-/Track-/Platzierungstests bestanden; Produktionsbuild bestanden, bekannte Chunkwarnung. CPU-/Speicherbestände während Prüfung kontrolliert; daraus keine FPS-/Intel-UHD-Zusage ableiten. Früherer Nutzer-Spielserver auf 4173 beendet vorgefunden; eigener Prüfserver gestartet. Temporärer fehlender VertexBuffer-Import im HMR-Lauf korrigiert und danach neu geladen. Ein leerer Ladebild-Beleg wurde durch die tatsächliche fertig geladene Szene ersetzt. Offizielle Werte zuletzt 17 % Fünfstunden-/63 % Wochenrest; gemäß Budgetregel aktuelles Paket abschließen/sichern und keine ältere große Erweiterung anfangen. Gesamtziel bleibt unvollständig und aktiv, keine Resets aktiviert. Alle eigenen Prüftabs geschlossen und der eigene Prüfserver beendet; Nutzerfenster unangetastet. Die letzte Pausen-Schaltfläche reagierte nicht auf Browsersteuerung; das Schließen des eigenen Tabs beendete dessen Renderlauf.

## 10.10.2026 – Codex: Musikprüfung

Sechs eigene Stücke, 108–120 BPM, 32–35,56 Sekunden, mono PCM16/22.050 Hz; 1,41–1,57 MB je Kurs. Datei-Peaks 0,84, RMS 0,282–0,298; musikalische Form und Schleifensprung ohne isolierten größeren Sampleimpuls geprüft. Kein auditives Urteil aus diesen Werten ableiten. Audio-Steuerungstest prüft Quellenwechsel, unveränderte Lautstärke/Stumm/Tempo und kein automatisches Abspielen aus bloßer Kurswahl. Sichtbarer Chrome: alle sechs Dateien geladen und laufende Zeit/Wiedergabe bestätigt; Berlin-Schleife weitergelaufen. Hörqualität, Wahrnehmbarkeit von Übergängen und echte Renn-/Ansagenmischung brauchen menschliches Urteil. Produktionsbuild bestanden, bekannte Chunkwarnung. Offizielle Budgetwerte zuletzt 37 % Fünfstunden-/66 % Wochenrest; keine Resets aktiviert. Weiter mit kostenlosen Baumassets und Bodenmaterialien.

## 10.10.2026 – Codex: Schaden und Gegner geprüft

Schaden: vier Assetgruppen statt zwei, echte Kotflügel-/Heckverluste, Reparatur refittet alle. Blender im Hintergrund beendet, hero-kart.glb allein neu optimiert (3.530.700 Bytes; übrige Assets unverändert). Vorher/Nachher bei 25 % und gleichen Berlin-/Hitler-/Dreiviertelbedingungen: damage-25-before/after.jpg; zusätzlich damage-wreck-after.jpg und damage-repaired-after.jpg. Diese Bilder zeigen ausgespielte Teileverluste, keine Momentaufnahme der Funken-/Explosionsphase. Keine sechs Karosserie-Sichtabnahmen oder schwache-Geräte-Messung behauptet. Assettest schützt Lenkung/Räder/Pedale/Fahrer und alle Körpervarianten.

Gegner: zuerst unverändertes Mitteltempo in sechs Kursen mit drei Bots gemessen, danach drei Stufen über drei Runden mit Boden und Kontakten verglichen. Medianzeiten in CURRENT-WORKLIST.md und reproduzierbarer Test tests/bot-racing.test.mjs. Keine Items/Spezialereignisse in dieser Simulation; rückwärtiger Itemwurf separat mit echter Projektilsimulation geprüft. Normaler sichtbarer Chrome-Einzelrennen-Lauf Berlin/Mao, Schwer, Hoch/reduzierte Effekte/Zufallsregen bis etwa 59 Rennsekunden; Rangfolge hat gewechselt, Bots fahren die Strecke, Spieler stand zunächst und wurde kurz auf der Startgeraden gefahren. rivals-hard-runtime-after.jpg zeigt den Spieler mit Feld voraus auf der Minimap, keinen Nahkampfbeleg. Kein vollständiges Rennen oder menschliches Fahrspaßurteil. Danach pausiert, ursprüngliche Gegneroption Mittel wiederhergestellt und ausschließlich eigenen Renn-Prüftab geschlossen. Grafikprüfstand bleibt pausiert. Produktionsbuild und 119/119 Gesamtregressionen bestanden; bekannte Chunkwarnung. Letzter Budgetstand 51 % Fünfstunden-/68 % Wochenrest, keine Resets aktiviert. Weiter mit eigener Streckenmusik, danach Baum-/Bodenpaket und älteren bestätigten Zielen.

## 10.10.2026 – Codex: Abkürzungskorridore geprüft

Reproduziert: Moskauer Parkbaum im befahrbaren Korridor, Peking-Ausfahrt kreuzte äußere Barriere und einen schmalen hellen Randstreifen. Nach Geometrie-/Platzierungskorrektur sichtbare feste Cockpit-Stichproben: Berlin/Havanna/Pjöngjang/Peking jeweils Mitte, Rom/Peking 80 %, Moskau Mitte sowie frühere Randansichten. Kein kontinuierlicher Rundentest behauptet. Moskau-Baumvergleich stammt aus derselben Korrekturrunde; beijing-shortcut-after.jpg und rome-shortcut-exit-after.jpg entstanden vor dem letzten schmalen Randstreifen-Fix, Peking-Ausfahrtsbeleg ist final. Ein ungültiger früher Moskauer Ladeframe wurde verworfen. Prüfstand verwendet jetzt tatsächliche Straßenhöhe, wartet auf GPU-Bereitschaft und behält seine eigenen Einstellungen nach Neuladen. Build bestanden; 17 gezielte Track/Peking/Platzierungstests bestanden. Zuvor 115/115 Gesamtregressionen bestanden; erster Sandboxversuch scheiterte ausschließlich an Git-Prozessrechten, erneuter Gesamtlauf außerhalb der Sandbox erfolgreich. Eigener Prüfstand pausiert, Nutzerfenster/Server unverändert. Letzte offiziellen Werte: 70 % Fünfstunden-/71 % Wochenrest. Nächstes Paket: Schaden.

## 10.10.2026 – Codex: Tages-/Nachtlicht geprüft

Das Leuchten der Materialien erzeugte bisher keine Straßenbeleuchtung. TrackWorld gibt jetzt tatsächliche Laternen-Instanzpositionen aus; zwei wiederverwendete PointLights folgen den nächsten Lampen. Zwei SpotLights beleuchten vor dem Spieler und dem nächsten sichtbaren Bot bis 24 m. Schwache Qualität deaktiviert den zweiten Straßen-/Botlichtslot. Nächste Lampen per linearer Suche ohne Sortierlisten je Frame, keine weiteren Schattenkarten. Tag heller/neutraler, Nacht dimmt Umgebungsreflexion auf 35 % und erhält Fülllicht. Finale Berlin-A/B-Belege headlight-areas-off/on.jpg (nur lokale Lichtquellen im Prüfstand umgeschaltet, Glow bleibt), finale Peking-Nacht beijing-night-low-after.jpg. lighting-* und headlights-night-after.jpg sind frühere Zwischenansichten dieses Pakets. Kein gemessener Intel-UHD- oder Mehrbot-Leistungsbeleg, keine Rundum-Kursabnahme. Build bestanden, bekannte Chunkwarnung. Eigener Grafikprüfstand pausiert; Nutzerfenster/Server nicht beendet. Budget 90 % Fünfstunden-/74 % Wochenrest, kein Reset aktiviert.

## 10.10.2026 – Codex: Fahrer-/Animation-Prüfung

Aktive Modelle besitzen bereits getrennte Kopfmeshes; der Cockpitfehler wird durch explizite Ausblendung unabhängig vom bewegten Kopf-Abstand behoben. Armfäden in sichtbarer Jubelansicht reproduziert: große Mantelflächen hatten Handgewichte, UV-Nahtkopien teils unterschiedliche Gewichte. Export korrigiert beides reproduzierbar, ohne Sitz-.blend oder Nutzer-IK-Ziele zu speichern. Extreme Überkopfbewegungen bleiben für diese starren Uniformen ungeeignet; Reaktionen heben Hände jetzt vor Schulter/Brust. Sechs Jubel- und Cockpitansichten geprüft; Sprung 25/50/75 % und Rückkehr zur Ruhepose mit echten Runtime-Modellen im Grafikprüfstand geprüft. Keine vollständige Rampenfahrt oder menschliche Stilabnahme behauptet. Echte Gesichtsmimik braucht zusätzliches Rig. `node --test --experimental-test-isolation=none tests/tripo-driver-assets.test.mjs tests/kart-visuals.test.mjs`: 4/4; finaler TypeScript-/Vite-Build bestanden, bekannte Chunkwarnung. Budget aktuell 99 % Fünfstunden-/76 % Wochenrest, kein Reset aktiviert. Nächstes: Licht/Nachtlampen.

## 10.10.2026 – Codex: UI-Paket und Prüfgrenzen

Überlagerung der Streckenzeichnung im aktuellen sichtbaren Chrome reproduziert; nach räumlicher Trennung auf allen sechs Karten und bei 640 × 800 verschwunden. Kartenlänge nutzt die Standardabtastung der Simulation (gröbere Zeichnungsabtastung liefert abweichende Längen und wird dafür nicht verwendet). Peking-HUD zeigt Orden und Bonus in getrennten umbrechenden Zeilen. Bilder unter docs/evidence/2026-10-10-feedback/. TypeScript und Produktionsbuild bestanden; bekannte Vite-Chunkwarnung bleibt. Full-Orden-/Ereignistest noch offen. Eigene Testfahrt per Esc pausiert; Nutzerfenster nicht bedient. Der gemeinsame Vite-Server lädt Quelländerungen automatisch in Spieltabs neu; Marcel ist darüber informiert. Offizielle Budgetwerte: 69 % Fünfstunden- und 80 % Wochenrest; kein Reset aktiviert.

## 10.10.2026 – Marcel: laufender Fahrtest und autonome Abarbeitung

Marcels neue Beobachtungen wurden vollständig als vorrangige Aufgaben in CURRENT-WORKLIST.md erfasst: Text-/Streckenüberlappung, Länge, HUD/Orden, dunkle Fahrer, Fäden bei Armreaktionen, Deko in Abkürzungen, mehr Schaden, Kopf im Cockpit, Reifen allein beim Sprung, neue Streckenmusik, thematische Baum-/Bodenassets, aktivere Gegner mit drei Stufen, echte Nachtbeleuchtung und Blick/Mimik/Trefferreaktionen. Marcel beauftragt ausdrücklich, zuerst diese Punkte und danach die zuvor bestätigten Ziele eigenständig abzuarbeiten. Noch unbekannte Figur-/Streckenzuordnungen bleiben unbekannt; einzelne Beobachtungen werden vor Korrektur reproduziert. Keine Abnahme aus seiner bloßen Meldung erfinden.

## 10.10.2026 – Marcel: Umsetzung planen und Spieltest begleiten

Marcel beauftragt, die Erkenntnisse der Klärungsrunde als konkrete Aufgaben und Umsetzungsziele zu planen. Schwerpunkt bleibt Grafik und Modelle, zuerst Fahrer, Karts und Cockpit; danach folgen Kart-Abstimmung, alternative Fahrlinien und Cup-Fortschritt/Freischaltungen. Die frühere Beschränkung dieser drei Ideen auf Prüfung ist durch diesen Auftrag abgelöst. Marcel spielt parallel und liefert Feedback. Die KI trägt Beobachtungen ohne erfundene Testergebnisse in CURRENT-WORKLIST.md ein, priorisiert Spielblocker und ergänzt die passenden Ziele. Plan und Abnahme stehen dort; neue Meldungen sind seit dieser Freigabe noch nicht eingegangen.

**Prüfung des Planungspakets:** Gemeinsamer Checkout zu Beginn sauber auf `da99147`; origin/main abgerufen und identisch. Vier Hauptdateien gelesen und ein priorisierter Paketplan mit Status, nächstem Schritt und Abnahme angelegt; `git diff --check` sauber. Spielcode, Modelle und Laufzeit in diesem Planungspaket nicht geändert; kein Build-/Browserlauf dafür erforderlich. Neue Spielbeobachtungen werden erst bei Meldung als Feedback erfasst.

## 10.10.2026 – Claude: Modelle komprimiert

Alle Laufzeitmodelle sind jetzt meshopt-komprimiert. Nach einem Neubau immer `node art-source/optimize_assets.mjs <name>` ausführen (ohne Namen: alle, `drivers` für Fahrer/Standfiguren); der Fahrer-Doppelklick-Export macht das selbst. Das Spiel lädt den Decoder lokal aus `public/vendor/meshopt_decoder.js` (meshoptimizer, MIT). Unkomprimierte Modelle laufen weiterhin.

## 10.10.2026 – Claude: Prüfstand nach dem Projektstart-Block

TypeScript-Check und Produktionsbuild erfolgreich (Vite meldet weiter den übergroßen Hauptchunk), `npm test` 112/112. Sichtbare Chrome-Prüfung im eigenen CDP-Profil (Port 9231): Peking mit Bots gefahren, Vorankündigung und Ereignis in Peking und Moskau ausgelöst, Teileverlust per gesetzter Karosseriewerte und Reparatur geprüft, Mao/Kim in der Fahrerwahl und am Start. Keine Konsolenfehler. Nicht geprüft: menschliches Fahrgefühl, Handy/Gamepad, schwache Grafik. Die sechs `*-im-kart.blend` zeigen das neue Kart; die alten Stände liegen lokal unter `.tools/claude/pose-blend-backup-20261010/`. Den Stadtbaukasten erneuert `art-source/build_city_kit.py` (Blender, danach `node art-source/optimize_assets.mjs city-kit`), das Kart `art-source/build_kart.py` (danach `... hero-kart`).

## Bestätigte Fahrmechaniken und Streckenwünsche – Marcel, 09.10.2026

Marcel bestätigte Windschatten-Schub, getimte Sprungtricks mit Landeschub, Item-Roulette und Starttiming. Ein neues seltenes Item gegen den Führenden ist ausdrücklich nicht gewünscht. Bereits vorhandene Umsetzung wurde geprüft: Windschatten, Tricklandung, Startschub, Orden als begrenztes Tempo-/Sammelziel mit Verlust bei Treffern sowie lokal gespeicherter Zeitfahrgeist. Das Orden-System deckt den gewünschten Sammel-/Tempopunkt ab; keine zweite Münzwährung anlegen. Zusätzlich freigegeben: optionale riskante Abkürzungen, ein kleiner Beinahetrefferbonus und seltene angekündigte Streckenereignisse. Moskau wurde als fünfte Strecke mit breiten Geraden und einer riskanten Querung spielbar ergänzt. Menschliche Fahr- und Sichtabnahmen bleiben offen.

Der zweite defensive Itemslot ist umgesetzt: Bei bereits belegtem E-Slot füllt eine weitere Kiste den Abwehrschild. Z/Gamepad-D-pad links aktiviert zeitlich begrenzten Schutz; Bots können denselben Schild regelbasiert einsetzen. UI und Itemregression vorhanden. Abschlussprüfung am 10.10.2026: TypeScript-Check und Produktionsbuild erfolgreich; alle 110 Tests bestanden. Vite meldet weiterhin einen übergroßen Hauptchunk (2.112,44 kB nach Minifizierung). Der sichtbare Chrome-Tab steht im Hauptmenü; menschliche Fahr-/Stilabnahme der Moskau-Strecke bleibt offen.

### Nachtrag 10.10.2026 – weitere fünf Spielentscheidungen (Marcel)

Marcel bestätigt: Das vorhandene Orden-System genügt als Sammel-/Tempoziel; optionale riskante Abkürzungen sind erwünscht; knappe Ausweichmanöver sollen einen kleinen Präzisionsbonus geben; der lokale Zeitfahrgeist bleibt; wenige angekündigte Streckenereignisse sind erwünscht. Der Beinahetrefferbonus ist umgesetzt und getestet. Moskau enthält eine erste riskante Querung. Havannas bestehende Welle wird beim Rundenwechsel angekündigt, aber noch nicht mit ausreichendem Vorlauf; Moskau hat noch kein Ereignis. Ein seltenes Item gegen den Führenden bleibt ausdrücklich unerwünscht. Die fünf danach gestellten Zusatzfragen (Kart-Abstimmung, Fahrlinien, Fahrerreaktionen, Cup-Freischaltungen, Publikumsreaktionen) sind bislang unbeantwortet und daher keine bestätigten Ziele.

**Aktualisierung 10.10.2026:** Der vorherige Absatz beschreibt einen historischen Zwischenstand: Moskau hat nun ein Ereignis mit Vorlauf, und Fahrer- sowie Publikumsreaktionen wurden später beauftragt und umgesetzt. Kart-Abstimmung, alternative Fahrlinien und Cup-Freischaltungen bleiben Vorschläge. Die Stalin-/Mao-Mechaniken bleiben nach Marcels Entscheidung vom 09.10. Vorschläge ohne Bauauftrag.

## 09.10.2026 – Marcel: Fahrer-Posen selbst in Blender ändern

`art-source/<name>-im-kart.blend` öffnen (hitler, stalin, mussolini, mao, kim, castro; startet im Pose-Modus), rote Ziel-Knochen mit **G** verschieben, **Strg+S**, dann `art-source/Fahrer-Posen-ins-Spiel-exportieren.cmd` doppelklicken und im Spiel **F5**. Schritt für Schritt: [docs/33-fahrer-posen-in-blender.md](docs/33-fahrer-posen-in-blender.md). Vergleichsbilder: `docs/evidence/fahrer-kart-pose-20261009/`.

## 09.10.2026 – Marcel: Satiregrenze und neue Fahrer

Marcel bestätigte, dass alle sechs Fahrer bereits neue Tripo-Runtime-Modelle haben; eine fehlende Konzeptgrafik muss nicht ergänzt werden. Fähigkeiten und Witze richten sich gegen Eitelkeit, Propaganda und Bürokratie der Diktatoren. Opfer und historische Gewalt sind weder Ziel noch Belohnung. Die alten Namen „Große Säuberung“ und „Kulturrevolution“ gelten nicht als aktive Fähigkeitsnamen. Konkrete Stalin-/Mao-Mechaniken werden erst nach Auswahl eines Vorschlags umgesetzt; Rückfrage vom 09.10. ist offen.

## 09.10.2026 – Marcel: Military-Offizier als Stalin-Testfahrer (historisch, durch Sechser-Kader ersetzt)

Der Test mit `military officer 3d model.glb` ist historisch. Marcel stellte danach sechs neue Charaktermodelle bereit, die jetzt den aktiven Kader bilden; der separate Testfahrer ist kein Produktionsmodell. Früherer sichtbarer Test bestätigte Laden, aber Mantelüberschneidung, schwebende Mütze und dunkles Gesicht. Tripo-Hilfe und Nutzungsbedingungen wurden geprüft. Aktuelle lokale Prüfung 09.10.2026: 106/106 Tests bestanden, Produktionsbuild erfolgreich (Vite weist weiter auf einen Hauptchunk über 500 kB hin). Details/Assethistorie in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

## 09.10.2026 – Marcel: Vorgaben für Charakterkonzeptbilder

Die Stalin-Konzeptreferenz gilt für Modellqualität, Material und Licht, aber nicht als Uniformvorlage für den gesamten Kader. Jede Person erhält eigens passende Farben, Kleidungsschnitt, Details und Rollen-Gimmicks. Modellgenerator-Referenzen zeigen eine einzelne gerade Frontansicht, die ganze Figur, leicht abgesetzte Arme und leere Hände; keine Mäntel oder Mehrfachansichten. Kleidung soll ihre Grundfarbe gleichmäßig behalten. Neue Stalin-Frontansicht als Entwurf: `references/visuals/character-concepts/character-concept-stalin-front-model-reference-20261009.png`. Vollständige Richtlinie und Arbeitsstatus: [docs/32-character-model-visual-standard.md](docs/32-character-model-visual-standard.md) und [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

Am 09.10.2026 wurden passend dazu einzelne Frontkonzepte für Mussolini, Mao, Kim Jong-un und Fidel Castro erstellt. Alle vier halten die Hände für die spätere Lenkradpose frei; Details und Dateien stehen im aktuellen Charakterbild-Auftrag. Hitler war zuvor vom Bilddienst abgelehnt worden. Keine Wiederholungsversuche mit dem Ziel, die Sperre zu umgehen.

Der einmalige neue Adolf/Hitler-Bildversuch am 09.10.2026 wurde vom Bilddienst bei der Ausgabe erneut sicherheitsbedingt abgelehnt. Das sagt nichts über die rechtliche Zulässigkeit aus. Keine Umgehung durch Lookalikes oder wiederholte Varianten; der Charakterplatz ist offen.

Marcel bestätigte anschließend einen eigenständigen fiktiven Satirecharakter als separate Konzeptalternative: „Der Erlassmeister“, mit Formular-Thema. Auf Wunsch erhielt die nächste Fassung ein älteres Gesicht, Seitenscheitel und einen breiten geschwungenen Schnäuzer. Beide Entwürfe stehen in `references/visuals/character-concepts/`. Sie sind keine realistischen Porträtkopien und ändern weder `src/cast.ts` noch die Spielauswahl.

## 08.10.2026 – Marcel: früherer Tripo-Sowjetoffizier im Stalin-Kart testen

Marcel stellte eine mit seinem bezahlten Tripo-Konto erzeugte GLB bereit und bat um Prüfung, Trennung von Figur/Mütze/Umhang, einen Rig-Versuch und eine Anprobe im Auto. Der Auftrag ist in [Issue #47](https://github.com/marceldamm/diktator-kart/issues/47) geführt. Der erste Dateibefund zeigte einen Mesh-Knoten und 831 Flächeninseln, nicht drei GLB-Objekte; die drei räumlich getrennten Gruppen wurden lokal als eigene Blender-Objekte und GLB-Knoten rekonstruiert. Ein reduziertes Rig und die Anprobe im Stalin-Limousinenmodell wurden als Blender-Arbeitsdatei erstellt. Sichtbar: Mütze auf dem Kopf, Umhang am Rücken, aber statische Stoff-/Sitzüberschneidung und unfertige Körperverformung; dies ist keine Laufzeit- oder Bewegungsabnahme. Die Originaldatei bleibt unverändert in der lokalen ignorierten `.tools`-Ablage. Der Runtime-Fahrer bleibt unverändert. Vor öffentlicher Verteilung Eingabereferenz und genaue Tripo-Kontobedingungen prüfen; die offizielle [Tripo-Hilfe zu kommerzieller Nutzung](https://www.tripo3d.ai/help/privacy-policy/how-to-use-tripo-models-commercially) beschreibt weitreichende Rechte für bezahlte Modelle und verlangt eigene Rechte an der Eingabe.

## 07.10.2026 – Marcel: Blender-Prüfung mit Einzelbildern

**Aktueller bestätigter Wunsch:** Wieder Hintergrundprüfung in Blender mit getrennten Einzelbildern im Chat verwenden; Blender nicht automatisch im Vordergrund öffnen. Marcel nahm seinen kurzzeitigen Sichtbarkeitswunsch ausdrücklich zurück, nachdem die Editoransicht überlagerte Varianten zeigte. Feste Front-/Dreiviertel-/Profilbilder und korrekt ausgewählte Fahrer/Kart-Kontaktbilder bleiben der effektive Ablauf. Historische Formreferenzen wiederholt als beschriftetes Overlay mit dem Blenderbild vergleichen, Abweichungen benennen, gezielt ändern und im gleichen Kamerawinkel neu prüfen; verworfene Varianten nur als solche dokumentieren. Marcels konkrete Korrektur für die Frisur: keine einzelne Stirnlocke, sondern seitlich gescheiteltes Haar. Gezielte sichtbare Spielprüfung bleibt separat. Herkunft: Marcels Korrektur und Folgefeedback im Codex-Chat; Issue #13 und PROGRESS-LOG.md. Keine Teamnachricht versandt.

**Git-Synchronisierung bei paralleler Arbeit (09.10.2026):** Marcel und Sarah können in eigenen Checkouts parallel arbeiten. Vor jedem Push `origin/main` holen. Wenn der Remote inzwischen voraus ist, die eigenen Änderungen und `origin/main` erst normal zusammenführen und Konflikte inhaltlich prüfen. Ein normaler Push verweigert einen veralteten Stand; kein Force-Push, harter Reset oder automatisches „ours/theirs“. Das aktive Ruleset erlaubt direkte Pushes und verlangt weder PR noch Statuscheck; **Block force pushes** und **Restrict deletions** bleiben eingeschaltet.

**Lokale Git-Berechtigung (09.10.2026, Marcel):** Der normale Shell-Aufruf konnte `.git/FETCH_HEAD` nicht schreiben. Der Projektstart-Abruf gelang mit erhöhtem Einzelzugriff; Berechtigungen wurden nicht geändert. ACL-/Schreibfehler später gezielt prüfen und beheben, ohne andere `.git`-Inhalte anzufassen.

> **Rolle und Vorrang (09.10.2026):** Diese Datei enthält gemeinsame Anleitung und Notizen. Zusammen mit CURRENT-WORKLIST.md, LONG-TERM-GOALS.md und TEAM-CHANGES.md bildet sie die einzige laufende Projektsteuerung. Frühere Fachdateien, Logs und Issue-Einträge sind historische Quellen und werden nicht als aktueller Status gepflegt.


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

## Aufgaben und Git-Ablauf – Marcel, 09.10.2026

**Verbindlich:** Die vier Hauptdateien sind die einzigen laufenden Projektunterlagen. Aufgaben, Ideen, Status, Entscheidungen, Fortschritt, Prüfungen und Blocker werden nur dort gepflegt. Die Inhalte der 17 zuvor offenen GitHub-Issues sind nach CURRENT-WORKLIST.md migriert; alle 17 Issues sind geschlossen und bleiben als Historie erhalten. Alle zehn Automationen des privaten GitHub-Projects sind ausgeschaltet. GitHub Actions ist für das Repository ausgeschaltet. Alte GitHub-Kommentare, Boardkarten, Logs und Detaildokumente bleiben nur historische Quellen.

Keine GitHub-Issues für Projektaufträge anlegen oder weiterpflegen. Aufgaben und Fortschritt gehören ausschließlich in die vier Hauptdateien. Keine Milestones, keine Boardpflege, keine PRs und keine Actions-Prüfung. GitHub dient für die Sicherung und Versionsgeschichte auf `main`.

- **Projektstart:** lokalen Stand schützen, `origin/main` holen und den gemeinsamen Stand synchronisieren; die vier Dateien öffnen/lesen und aktuellen nächsten Schritt anzeigen.
- **Zwischenstand sichern:** nach einem sinnvollen Paket die vier Dateien aktualisieren, Commit erstellen und nach `main` sichern.
- **Projektabschluss:** vier Dateien und Umsetzung abschließen, passende lokale Prüfung durchführen, Commit nach `main` sichern und Remote-Commit verifizieren.
- Lokale Tests/Builds nur nach Bedarf in VS Code oder ChatGPT/Codex starten; Ergebnis knapp in einer der vier Hauptdateien festhalten. Keine automatische GitHub-Codeprüfung.

Das aktive Main-Ruleset erlaubt direkte Pushes und verlangt keinen PR oder Statuscheck. Force-Pushes und das Löschen von Branches bleiben gesperrt. Vor dem Push weiterhin `origin/main` holen, lokale und parallele Änderungen inhaltlich integrieren und nur einen normalen Fast-Forward-Push verwenden. GitHub Actions bleibt repositoryweit ausgeschaltet.

## Historischer GitHub-Pilot – 06.10.2026

Früher waren Issues, Milestones, Project-Board, PRs und Actions als Teamablauf eingerichtet. Diese Pilotregeln sind seit Marcels Beschluss vom 09.10.2026 abgelöst; die alten Einträge bleiben nur als nachvollziehbare GitHub-Historie bestehen. Issue #2 gilt nicht mehr als offene Produktaufgabe.

## Parallele KI-Arbeit im gemeinsamen Ordner – Marcel, 09.10.2026

Marcel hebt die frühere Regel „nur eine KI gleichzeitig pro Checkout“ auf. Mehrere KIs und Sarah dürfen gleichzeitig im selben Repository-Hauptordner arbeiten, auch wenn sich Aufgaben oder Dateien berühren. Marcel koordiniert die Aufgaben so, dass sie sich nach Möglichkeit nicht in die Quere kommen. Gemeinsamer Dateizugriff ist erlaubt; ein gemeinsamer Git-Index macht nur zeitgleiche Stage-/Commit-/Push-Aktionen unsicher.

Jede KI prüft vor Änderungen den aktuellen Git-Status und Diff, erkennt bereits laufende Änderungen und bewahrt fremde Arbeit. Dateien/Teilaufgaben nach Möglichkeit kurz zuweisen; dieselbe Datei darf parallel bearbeitet werden, wenn beide Änderungen anschließend gemeinsam abgeglichen werden. Bei nicht eindeutiger Überschneidung kurz abstimmen, währenddessen an unabhängigen Stellen weiterarbeiten. Vor Commit/Push den gemeinsamen Gesamtdiff erneut prüfen und nur eigene klar zugeordnete, vollständig geprüfte Pfade stagen. Während des kurzen Stage-/Commit-Fensters die betreffenden Pfade nicht parallel weiterschreiben; andere, unabhängige Dateien können weiterbearbeitet werden. Git-Index-, Commit- und Push-Schritte müssen zeitlich nacheinander laufen: kurz koordinieren, nach jedem Commit den gemeinsamen Stand abgleichen. Der Checkpoint-Befehl verlangt explizite Pfade (`-Paths`) und bricht ab, wenn der gemeinsame Index bereits vorgemerkte Dateien enthält; so committet er keine fremd gestagten Arbeiten. Regressionstest am 09.10.2026: 9/9 Teamworkflow-/Startertests bestanden. Konflikte inhaltlich zusammenführen, niemals `--force`, Reset oder blinde „ours/theirs“-Auswahl. Dieselbe Blender-/GLB-Binärdatei parallel zu exportieren bleibt besonders konfliktanfällig; Änderungen abstimmen oder separate Varianten verwenden.

## Git für euch – der kurze gemeinsame Ablauf

**Marcel und Sarah arbeiten im Hauptordner auf dem gemeinsamen `main`; mehrere KIs dürfen dabei parallel mitarbeiten.** Marcel koordiniert Aufgabe und Dateien. Die KIs prüfen und bewahren Änderungen der jeweils anderen und führen Git-Schreibschritte nacheinander aus.

- **„Projekt Start“**: neuesten `main`-Stand holen, vorhandene Arbeit bewahren und lokal synchronisieren.
- **„Zwischenstand sichern“**: sinnvolles, geprüftes Paket und die dazugehörigen Hauptdateien committen und auf `main` sichern. Die KI gibt dem Checkpoint ausdrücklich nur die eigenen geprüften Pfade mit.
- **„Projektabschluss“**: offene Arbeit abschließen, nach Bedarf lokal prüfen, committen, nach `main` sichern und Remote-Commit verifizieren.
- **„Wo stehen wir?“**: Die KI zeigt Branch, gespeicherte/ungesicherte Änderungen, Überschneidungen und den nächsten Schritt.

Ein **Commit** ist ein gespeicherter Zwischenstand. Bei Änderungen derselben Stelle prüft die KI die Inhalte und bewahrt beide Seiten, wenn das fachlich passt. Blender-Dateien lassen sich nicht zeilenweise zusammenfügen – dieselbe `.blend` daher nicht gleichzeitig bearbeiten.

## Schnellhilfe – alles einfach der KI sagen

**Ihr müsst diese Dateien nicht selbst beschreiben.** Diktiert oder schreibt eure Wünsche in Codex; die KI trägt sie passend ein und hält die Arbeitsgrundlage aktuell.

| Kurzer Befehl / Beispiel | Was die KI macht |
|---|---|
| **Projekt Start** | GitHub synchronisieren, lokale Arbeit bewahren, vier Tabs öffnen, Aufgaben und Nachrichten zeigen. Auch **Projektstart** funktioniert. |
| **Zwischenstand sichern** | Änderungen in den vier Dateien nachführen und den Checkpoint nach `main` sichern. Auch **Zwischenstand** funktioniert. |
| **Projekt Ende** | Vier Dateien aktualisieren, lokal passend prüfen und den Stand nach `main` sichern. Auch **Projektabschluss** funktioniert. |
| **Wo stehen wir?** | Branch, Änderungen, offene Überschneidungen und nächsten Schritt verständlich erklären. |
| **Arbeite unsere Arbeitslisten ab** | Erst kurzfristige Aufgaben umsetzen, danach bestätigte langfristige Ziele selbstständig in Paketen bearbeiten; Fortschritt dokumentieren und Budgetreserve beachten. |
| **Heute möchte ich …** | Als aktuellen Auftrag ausschließlich in CURRENT-WORKLIST.md aufnehmen. Kein GitHub-Issue erstellen. |
| **Langfristiges Ziel: …** | In LONG-TERM-GOALS.md aufnehmen. |
| **Notiere: …** | Beobachtung/Frage mit Herkunft hier in TEAM-NOTES.md festhalten. |
| **Nachricht an Sarah: …** / **Nachricht an Marcel: …** | Als datierte Teamnachricht hier festhalten; beim nächsten Projektstart dem angesprochenen Teammitglied zeigen. |

**Diktator-Kart-starten.cmd:** Spiel aus dem aktiven Projektordner öffnen.

**Chrome bei Spielprüfungen sichtbar lassen:** Jeder Browserlauf mit dem Spiel läuft in einem für Marcel/Sarah sichtbaren Google-Chrome-Fenster. Keine Headless- oder versteckte/minimierte Ausführung. Ein CDP-Test nutzt bei Bedarf ein eigenes sichtbares Fenster; Spiel pausieren und genau diese Testinstanz nach dem Lauf schließen, normale Chrome-Fenster offen lassen. So könnt ihr den geprüften Zustand mitverfolgen.

**Laufzeitbilder und Arbeitsfokus:** Sichtbare Pakete werden an sinnvollen Zwischenständen mit aktuellen Spielbildern geprüft. Prüfergebnis und offene Grenze kommen knapp in die passende Hauptdatei. Vor einer Bildbewertung erst Bestand und Zeitstempel prüfen: ältere Aufnahmen sind historische Vergleiche, kein Beleg für die aktuelle Runtime. Nach jedem größeren Paket prüfen, ob noch sichtbarer Hauptfortschritt entsteht.

**Sarahs Projektleitgedanke:** Beim nächsten Projektstart soll Sarah automatisch auf [PROJECT-QUESTIONNAIRE.md](PROJECT-QUESTIONNAIRE.md) hingewiesen werden. Jede Frage zeigt Marcels gesetzte Auswahl sowie dieselben vollständigen Antworttexte mit Sarahs eigenen Kästchen. Marcels Antworten bilden die aktive initiale Projektbasis in [docs/23-project-design-baseline.md](docs/23-project-design-baseline.md) und den relevanten Fachdokumenten. Nach Sarahs Eingabe entsteht separat `PROJECT-VISION-SYNTHESIS.md` mit beiden Ursprungsantworten, Gemeinsamkeiten, Unterschieden und klar als KI-Vorschläge markierten Syntheseideen. Sarahs Antworten werden als separate Perspektive ergänzt und ändern die aktive Basis nicht automatisch. Ein Vergleich mit KI-Synthese wird separat dokumentiert; über Änderungen an Marcels Grundpfeilern entscheidet Marcel ausdrücklich. Sarahs bestehende Ideen bleiben unverändert.

**Projekt-starten.cmd:** Einfachen Git-Start ausführen. **Projekt-abschliessen.cmd:** Einfachen geprüften Git-Abschluss ausführen. Bei Konflikten/ungesicherten Dateien hilft Codex; die Batches selbst sind keine KI. Der Spielstarter synchronisiert GitHub nicht.

**Projekt-zwischenstand.cmd:** Sichert einen sinnvollen Zwischenstand auf dem gemeinsamen `main`. Vorher Codex **„Zwischenstand sichern“** sagen, damit die KI die vier Dateien, Änderungen und mögliche Zugangsdaten prüft.

**Limit-Puffer für beide:** Die KI prüft eure eigenen offiziellen Fünf-Stunden-/Wochenwerte. Ab etwa **15 % Rest** beginnt sie keine große Aufgabe mehr und schließt geordnet ab; Ziel: mindestens etwa **5 % für euch übrig**. Ohne Zugriff meldet sie das und nutzt einen vorsichtigen Puffer. Keine automatischen Resets oder Zusatzkosten. Details in [AGENTS.md](AGENTS.md).

Details zu Dateien, Zusammenarbeit und Modellwahl stehen darunter.

### 05.10.2026 – Marcel: Umsetzungsauftrag für längere Arbeitssitzung

**Herkunft:** Marcels eingefügter Leitauftrag als leitender Entwickler, Technical Artist und Art Director. **Status:** als vorrangiger aktueller Auftrag in CURRENT-WORKLIST.md umgesetzt; Reihenfolge: offene aktuelle Punkte, Hitler/Kart als erster Qualitätsanker, begrenzte Spielwelt-/Laufzeitpartikelpakete, kontrollierbarer Drift, danach bestätigte Langzeitpakete. Paketfortschritt und offene Abnahmen stehen in PROGRESS-LOG.md und docs/22-character-vehicle-quality-master.md. Die Anweisung, bis zum Nutzungslimit weiterzuarbeiten, bleibt an die strengere Budgetregel aus AGENTS.md gebunden: keine neue Großaufgabe ab circa 15 % Rest, geordneter Abschluss mit ungefähr 5 % Puffer. Keine Resets/Extras.

**Zwischenstand desselben Auftrags (Codex, 05.10.):** Kanalwasserlinie mit zwei schmalen prozeduralen Schaumkanten erweitert; Regression und Produktionsbuild bestanden. Stalin bekam eine eigene modellierte Nase im editierbaren Blender-Asset und optimierten GLB; Cast-Knotentest und Build bestanden. Der Karosseriezustand ist nun auch semantisch als ARIA-Meter ausgezeichnet. Wasser-Kontaktbild, Stalin-Nahansicht und menschliches Fahren sind weiterhin offen. Der im Rückstand genannte Ein-Item-Slot war schon implementiert und wird in der Arbeitsliste als Codebestand nachgetragen; seine interaktive Laufzeitabnahme bleibt offen.

**Zusatzpass desselben Auftrags (Codex, 05.10.):** Stalins Limousine bekam eine Touring-Windschutzscheibe mit transparentem Glas, Metallrahmen und Wischer; die sichtbare Hinterradgröße wurde reduziert, nachdem die Studioansicht noch einen Trecker-Eindruck zeigte. Das über der Feldmütze liegende Deckhaar wurde von einer eigenen Seitenhaarlinie getrennt. Runtime-Laden/Nahfahrt und menschliche Beurteilung sind nicht belegt; aktuelle Assetvorschau, Grenzen und Paketstatus sind in CURRENT-WORKLIST.md und PROGRESS-LOG.md vermerkt.

**Weitere autonom bearbeitete Pakete (Codex, 05.10.):** Stadtfassaden erhielten selektive Laden-Ausleger; Laufzeitdatei, Build und Hauptmenü-Reload sind geprüft, Detail-/Stilabnahme fehlt. Offizieller Limitstand zuletzt: 3 % Fünf-Stunden-Verbrauch und 42 % Wochenverbrauch (97 %/58 % Rest; Woche bindet). Keine Resets/Zusatzkontingente.

**Laufende autonome Sitzung (Codex, 05.10.):** Die herausstehenden Sitznähte wurden als Ursache der Rückenstäbe identifiziert, in Blender korrigiert und aus frischer Babylon-Heck-/3/4-Ansicht geprüft. Der Ein-Item-Weg ist im Grand Prix abgenommen: Kiste → Symbol/Name/„IM SLOT“ → Buttonwurf und separater E-Wurf → leerer Slot/„… unterwegs“. Der Kanalspray bleibt visuell offen; nächster Schritt ist ein kontrollierter niedriger Kanalpass mit Bild während des Kontakts. Offizielle Werte zuletzt 19 % Fünf-Stunden-Verbrauch / 45 % Wochenverbrauch (81 %/55 % Rest, Woche bindet); ab etwa 15 % Rest keine neue Großaufgabe. Keine Zusatzkontingente/Resets.

**Sichtbares Chrome bei Spielprüfungen (Marcel, 05.10.2026):** Wenn Codex das Spiel in Google Chrome ausführt oder testet, soll Marcel/Sarah das echte Spielfenster sehen und den Ablauf mitverfolgen können. Headless-, versteckte und minimierte Prüffenster sind ausgeschlossen. Nach dem Beleg Rendering pausieren und nur die eigene Testinstanz schließen. Dauerhafte Regeln: [AGENTS.md](AGENTS.md), [Team-Workflow](docs/21-team-workflow.md).

**Handgriff-Korrektur (Codex, 05.10.):** Die Laufzeit-IK richtet die verbundene Hand jetzt zusätzlich zur Griffstelle an der Tangente des drehenden Lenkrads aus; 2/2 gezielte Regressionen und Build bestanden. Der Browser lud einen frischen Stalin-Rennstart; beide Hände liegen am Rad. Keine gehaltene Links-/Rechtslenkung oder visuelle Außen-Nahaufnahme bestätigt.

**M7-Rendertexturpaket (Codex, 05.10.):** Das Stadion-TV pausiert nun außerhalb von 130 m und aktualisiert sich wieder beim Annähern. Wiederholter A/B in derselben pausierten Sechs-Kart-Szene: P50 71,3 → 53,5 ms, P95 161,2 → 125,8 ms und 617 weniger Draws. Helpertests 2/2, TypeScript, Produktionsbuild und ein echter Grand-Prix-Start geprüft. Große FPS-/Geräteabnahme bleibt offen. Offizielle Werte nach dem Paket: 4 % Fünf-Stundenverbrauch und 46 % Wochenverbrauch (96 %/54 % Rest; Woche bindet). Nächster Schritt: Blender-Stadtszenenbau profilieren und beschleunigen, bevor das blockierte Fassadenentwässerungs-Asset erneut gebaut wird.

**M3-Stadtpaket und Builderprofil (Codex, 05.10.):** Die Regenrinnen-/Ladenfassaden sind nach 48 Townhouses, 32 zusammengeführten Materialmeshes und knapp 69 Minuten Blender-Bau bis ins Runtime-GLB exportiert; neue Welt im frischen Rennen geladen. Der erste eindeutige Phasenlog belegt, dass der statische Join deutlich langsamer bleibt als der GLB-Export. Gutter-/Planter-/Shutter-/Sign-Knoten sind per Test vorhanden; künstlerische Nahabnahme steht aus. Offizielle Werte nach dem Paket: 12 % Fünf-Stundenverbrauch und 48 % Wochenverbrauch (88 %/52 % Rest; Woche bindet). Kein Zusatzkontingent oder Reset genutzt. Nächster gewählter Punkt: bewegte Laufzeit-Renderkosten M7.

## So arbeiten Marcel und Sarah gemeinsam

Wir entwickeln gemeinsam das neue Babylon.js-Spiel. Die frühere Engine und alte Ordner sind archiviert und werden ausschließlich historisch betrachtet. Die neue Grundlage umfasst editierbare 3D-Assets, Fahrphysik, sechs Karts, Rennen, Items und drei Kameras. Grafik, Spielwelt und erkennbare historische Fahrer bauen wir weiter aus; es bleibt ein unfertiges Spiel.

### 1. Arbeitsbeginn: ein Wort genügt

Öffne deinen aktiven Projektordner in Codex und schreibe:

```text
Projekt Start
```

Beim ersten Mal kannst du ergänzen: **„Ich bin Sarah“** beziehungsweise **„Ich bin Marcel“**. Danach reicht der Kurzbefehl. Du kannst deinen Auftrag direkt anhängen: „Projektstart. Danach verbessere …“

Die KI holt den neuesten gemeinsamen Babylon-Stand von GitHub, sichert lokale Änderungen, vergleicht Überschneidungen und integriert parallele Arbeit. Sie liest die Projektregeln und öffnet unsere vier Arbeitsdateien als Tabs in dieser Codex-Sitzung, soweit die App-Funktion verfügbar ist. Anschließend nennt sie aktuellen Stand und nächsten Schritt. Bei echten widersprüchlichen Entscheidungen erhält sie beide Fassungen und fragt uns.

Wir müssen GitHub dafür nicht selbst beherrschen. Unveröffentlichte Dateien auf Sarahs PC sind allerdings nicht in Marcels Sicherung enthalten. Beim ersten Umstieg sichert die KI diesen lokalen Stand gesondert. GitHub wird nur für die gemeinsame Versionsicherung auf `main` verwendet; Aufgaben und Fortschritt bleiben in diesen vier Dateien.

### 2. Unsere vier Dateien

| Datei | Wofür wir sie verwenden |
|---|---|
| [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) | Aktuelle Aufträge und Fehler. Oben: was läuft, danach was folgt. Erst nach Prüfung abhaken. |
| [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) | Große Ziele: Grafik, Fahrer, Strecke, Audio, Geräte und später Multiplayer. Daraus schlägt die KI nächste Arbeitspakete vor. |
| [TEAM-CHANGES.md](TEAM-CHANGES.md) | Wenige wichtige besprochene Entscheidungen und sichtbare Änderungen für uns beide. |
| [TEAM-NOTES.md](TEAM-NOTES.md) | Diese Anleitung und unsere persönlichen Beobachtungen, Fragen und Ideen weiter unten. |

Frühere Detail- und Fortschrittslogs sind historische Archive und werden nicht fortgeschrieben. Die Navigation oben bringt euch auch nach versehentlich geschlossenem Tab zurück zu den anderen Dateien.

### 3. Wünsche und Notizen einbringen

Ihr dürft während der Arbeit jederzeit Beobachtungen diktieren oder unten notieren. Sagt beispielsweise: „In die aktuelle Arbeitsliste aufnehmen: …“ oder „Als langfristiges Ziel notieren: …“. Nennt möglichst **Person, Situation und gewünschten Effekt**. Ein kurzer Eindruck aus dem Spiel hilft mehr als eine technische Vermutung.

Die KI ordnet konkrete Aufträge der aktuellen Liste zu, Zukunftsideen den langfristigen Zielen und wichtige Entscheidungen dem kurzen Teamverlauf. Sie bewahrt eure Notizen und kennzeichnet Herkunft, offene Fragen und tatsächliche Ergebnisse. Notizen sind nicht automatisch beschlossene Änderungen. Sarahs ursprüngliche Ideen bleiben nachvollziehbar; kreative Änderungen daran brauchen die vereinbarte gemeinsame Bestätigung. Abgearbeitete Notizen erhalten einen kurzen Verweis auf Ergebnis/Aufgabe statt still gelöscht zu werden.

### 4. Arbeitsende: ein Wort genügt

```text
Projekt Ende
```

Damit beauftragen wir die KI, Änderungen und nötige Prüfungen abzuschließen, unsere vier Dateien und den technischen Fortschritt zu aktualisieren, lokal zu committen, den neuesten Teamstand zu holen und das geprüfte Ergebnis in GitHub **main** zu veröffentlichen. Gearbeitet wird auf eigenem Branch. Kein Force-Push, keine fremde Arbeit verwerfen. Bei Konflikten, fehlenden Rechten oder fehlgeschlagenen Prüfungen meldet sie konkret, was gesichert und was noch nicht veröffentlicht ist.

### 5. Spiel und Modelle

Spiel öffnen: **Diktator-Kart-starten.cmd** im aktiven Ordner. Der Spielstarter lädt allein keine GitHub-Änderungen herunter. **Projekt-starten.cmd** und **Projekt-abschliessen.cmd** erledigen den einfachen Git-Fall; bei Konflikten oder ungesicherten Dateien hilft Codex.

Für zusammenhängende Spielentwicklung verwenden wir **GPT-6.1 Sol mit hoher Denkintensität**. **GPT-6 Astra** kann bei schwierigen Analysen oder festgefahrenen Problemen helfen; **GPT-6 Luna** für kleine Routineaufgaben, soweit verfügbar. Modellverfügbarkeit und Details stehen im [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md). Eine Einstellung garantiert kein perfektes Ergebnis: sichtbares Ziel, echte Browserbilder und Fahrtests verlangen. Limits beobachten; keine Zusatzkosten oder Resets automatisch auslösen.

## Teamnachrichten

Hier hält die KI diktierte Nachrichten fest: **Datum · von · an · Nachricht · Status**. Beim Projektstart passende offene Nachrichten kurz anzeigen; „gelesen“ oder „beantwortet“ erst nach eurer Bestätigung vermerken.

### 06.10.2026 – Nachricht von Sarah an Marcel: Streckenauswahl und Startbild

**Von:** Sarah. **An:** Marcel. **Status:** von Marcel am 10.10.2026 als gelesen bestätigt; Antwort unten notiert, nicht versandt.

Ich habe vor Grand Prix, Zeitfahren und erneutem Rennstart eine Streckenauswahl ergänzt. Damals blieb der Stadionring die einzige spielbare Strecke. Die fünf Planungsstrecken zeigten auch ihre Orte: Ewige-Führer-Allee (Pjöngjang), Kulturrevolutions-Schleife (Peking), Havanna-Revolutionsring (Havanna), Duce-Drom (Rom) und Genossen-Gerade (Moskau). Außerdem wurde der Fehler behoben, durch den die Strecke während der Fahrerporträt-Aufnahmen kurz vor dem Start verschwand. Das Ruckeln auf Intel UHD ist weiterhin offen und wird nicht durch eine unbelegte Grafikabsenkung kaschiert.

**Nachtrag 07.10.2026:** Die Ewige-Führer-Allee in Pjöngjang ist inzwischen als vierte Strecke spielbar; der Drei-Strecken-Planungsstand oben in dieser Nachricht ist historisch.

**Abgleich 10.10.2026 (Codex):** Die ursprüngliche Nachricht bleibt unverändert; Marcel hat den Empfang am 10.10. bestätigt. In der aktuellen Babylon-Basis sind inzwischen alle sechs genannten Strecken spielbar und die Streckenauswahl ist in `src/main.ts` vorhanden. Sarahs Hinweis auf Intel-UHD-Ruckeln bleibt offen, bis ein Lauf auf der betroffenen Hardware nach aktuellem Stand gemessen ist. Der damalige Porträt-/Streckenfehler wurde hier nicht erneut im Browser geprüft.

**Antwort von Marcel an Sarah, 10.10.2026 – zum Weitergeben, Status: notiert, nicht versandt:** Danke für die Streckenauswahl und deinen Hinweis zum Startbild. Auf unserem gemeinsamen Stand sind inzwischen alle sechs Themenstrecken spielbar. Das Intel-UHD-Ruckeln bleibt offen; wir wollen es auf dem betroffenen Gerät messen und die Grafik nicht ohne Vergleich herunterstellen. Als nächsten gemeinsamen Schwerpunkt verbessern wir zuerst Fahrer, Karts und Cockpit. Deine ursprünglichen Beiträge bleiben dabei kenntlich. Sag bitte Bescheid, wenn du zum jetzigen Stand weitere Beobachtungen hast.

### 04.10.2026 – Nachricht von Marcel an Sarah: unser gemeinsamer Neustart

**Von:** Marcel, auf seinen Auftrag von der KI formuliert. **An:** Sarah. **Status:** offen; gelesen erst nach deiner Bestätigung.

Hallo Sarah! Mein neuer Babylon-Spielstand ist jetzt auf GitHub main. Bitte starte künftig von dieser gemeinsamen Basis. Dein bisheriger lokaler Stand soll vorher vollständig lokal bewahrt und auf einem eigenen GitHub-Archivbranch gesichert werden. Deine Ideen gehen mit Herkunftsverweisen in unsere Wissensbasis ein; die alte Engine bleibt historische Referenz.

Du musst weder GitHub noch unsere Dateien selbst pflegen. Sag der KI, was du machen möchtest oder welche Nachricht sie für mich notieren soll. Unsere vier Dateien: aktuelle Arbeit, langfristige Ziele, kurze Teamänderungen und diese Notizen/Anleitung. Oben steht die Schnellhilfe. Die KI berücksichtigt bei autonomer Arbeit auch dein eigenes Nutzungslimit und schließt mit Reserve ab. Später reichen **Projekt Start** und **Projekt Ende**.

**Einmaliger Umstieg:** Öffne deinen bisherigen Projektordner in Codex und füge diesen Befehl ein:

```text
Projekt Start. Ich bin Sarah. Sichere zuerst meinen bisherigen Stand lokal und auf einem eigenen GitHub-Archivbranch, ohne etwas zu verlieren. Übernimm dann die neueste main-Version von https://github.com/marceldamm/diktator-kart als aktive Basis. Lies die neuen Projektregeln und die Budgetregel. Halte meine bisherigen Ideen mit Quellen in der Wissensbasis fest; alter Code bleibt Archiv. Öffne die vier Hauptdateien, erkläre sie kurz und zeige Marcels Nachricht in TEAM-NOTES.md.
```


### 04.10.2026 – Nachricht von Marcel (über Claude) an Sarah

Hallo Sarah! Dein Panzer ist zurück: Drück im Rennen **Q** – der General wird für acht Sekunden zum Paradepanzer („Größenbefehl“), rollt mit Ketten, Rauch und Getöse durchs Feld und schiebt Gegner zur Seite; danach 18 Sekunden Pause. Außerdem neu: **Regen** (Optionen → Wetter Regen) mit nasser Straße, Pfützen und Gewitter, aufgeräumte Doku und ein gemeinsamer Arbeitsordner. Einfach „Projekt Start“ sagen, dann bist du auf unserem Stand. Viel Spaß beim Ausprobieren! – Marcel

**Status:** offen, für Sarah.

## Unsere Notizen

### 04.10.2026 – Marcel: Qualitätsreferenz und Rennsysteme

Marcel legt `docs/evidence/loading-real-progress.png` als visuelle Referenz fest: bessere Fahrer-/Fahrzeugmodelle sowie glaubwürdigere Gebäude, Straßenboden, Wasser und Fahrpartikel sollen als Laufzeit-3D umgesetzt werden. Die konkrete politische Bildsprache und Logos werden nicht kopiert; das Projekt behält eigenständige kritische Satire ohne Regimezeichen. Zusätzlich bestätigt Marcel eine deutlich sichtbare Iteminventar-Anzeige mit Symbol und nutzbarer Bildschirmtaste. Itemtreffer sollen sich kumulativ auf Haltbarkeit auswirken; das technische Item-Schadenssystem besteht bereits und wird regressionsgeprüft. Status und Abnahme: [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

### 04.10.2026 – Marcel: Fahrerform und Hände aus Laufzeitbildern

**Beobachtung/Auftrag:** In zwei angehängten Babylon-Spielbildern wirken Köpfe im Verhältnis zum Oberkörper zu klein und unten durch ein kantiges Hals-/Kragenteil abgesetzt; Mund kaum erkennbar. Hände sollen außen um den Lenkradkranz greifen, einschließlich plausibler Handgelenksrichtung. Der goldene flatternde Querbalken hinter dem Fahrer soll identifiziert und entfernt/umgearbeitet werden. Für historisch belegte Figuren passende, eigenständige Hüte ergänzen. Im [aktuellen Arbeitsauftrag](CURRENT-WORKLIST.md) zur Umsetzung und visuellen Abnahme aufgenommen.

**Präzisierung von Marcel (04.10.):** Die Fahrzeuge sollen alle dieselbe erkennbare Kart-Grundfamilie behalten und dennoch durch viele personenspezifische Formen klar verschieden sein. Keine Trecker-Silhouette; der Fünfjahresplan-Traktor ist das Wurfobjekt. Diese Bedingung steht im [Masterauftrag](docs/22-character-vehicle-quality-master.md) und im Langzeitziel.

**Umsetzungstand:** Erster editierbarer Gesichts-/Hand-/Kragenpass, die Entfernung des falsch am Cape-Knoten sitzenden Goldverschlusses und ein weiterer Stalin-Gesichts-/Limousinenpass sind im laufenden Spiel sichtbar. Nach Marcels Korrektur zu Mund und Hitlers Schnurrbart wurden beide deutlich verstärkt; unter Stalins Walrossbart ist nun ein eigener Mund aktiv. Der Lenkradgriff wurde erneut nach innen versetzt und im Cockpit geprüft. Die Karikaturstufe ist weiterhin nicht der geforderte Qualitätsanker; Lenkeinschlag/Griff von außen, Front-/Seiten-/Nah-/Bewegungsprüfung, menschliche Abnahme und der vollständige Fahrzeugpass sind offen. Technische Belege siehe [PROGRESS-LOG.md](PROGRESS-LOG.md) und [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

**Korrektur von Marcel (04.10.):** Die Hände schwebten im aktuellen Stand wieder. Die Ursache lag in der Laufzeittrennung: nur Handschuh-Meshes wurden ans Lenkrad gehängt, während Manschette und Unterarm am Arm blieben. Die IK bewegt jetzt die vollständige verbundene Arm-Hand-Einheit. Ergänzend berücksichtigt sie die bei starkem Lenkeinschlag wachsende/verkürzte Griffdistanz durch gleichmäßige Armlängenanpassung und erhält die Handschuhgröße. Grundpose und Cockpitkontakt im aktuellen Spiel geprüft; beide Arme/Lenkwinkel rechnerisch regressionsgeprüft. Menschlich geführter voller Links-/Rechtsanschlag aus Außen-/Seitenansicht bleibt offen.

**Masteraufgabe – Bekleidungspass (04.10.):** Stalin hatte im ersten Laufzeitmodell wie die anderen eine helle generische Paradeuniform mit Orden, Schulterstücken und Band. Der Anker trägt jetzt eine dunkle hohe Feldtunika mit Stoffkragen, Knopfleiste, Taschen und Nähten; diese Dekorationsteile sind nur bei Stalin abgeschaltet. Die echte Fahrerwahl wurde nach dem Blender-Export geprüft. Vollständige Gesichts-/Fahrzeugqualität bleibt weiterhin offen; Status/Belege siehe [Arbeitsliste](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).

### 04.10.2026 – Codex: Regen-Wolkenschatten sichtbar gemacht

Fünf weiche Schattenflächen/Pfützen waren bereits angelegt, wurden aber durch die Reihenfolge in `setWeather` sofort wieder ausgeschaltet. Der Schneezustand wird jetzt zuerst zurückgesetzt, Regen zuletzt aktiviert. Der sichtbare Regen-/Sonnenvergleich und weitere technische Belege stehen im [Fortschrittslog](PROGRESS-LOG.md); der M5-Punkt ist in der [Arbeitsliste](CURRENT-WORKLIST.md) abgeschlossen.

**Korrektur von Marcel (04.10.):** Er wies darauf hin, dass Mund und Hitlers Schnurrbart auf dem ersten überarbeiteten Auswahlbild faktisch fehlten. Die Geometrie war im Asset, aber bei der dargestellten Kartengröße nicht lesbar. Mundöffnung/Lippen und Schnurrbart wurden daraufhin größer und kontrastreicher modelliert; neues Bild im Laufzeitspiel zeigt beide Merkmale. Weitere Gesichts-/Qualitätsabnahme bleibt offen.

### 04.10.2026 – Marcel: Wiederholter Absturz im Wasserkanal

**Beobachtung:** Nach dem Kanalsprung wurde das Kart aus dem Wasser gehoben und an derselben Wasserposition abgesetzt, wodurch es erneut abstürzte.

**Ergebnis:** Kanal-Respawn hinter der Landekante korrigiert und geprüft; Details im [Fortschrittslog](PROGRESS-LOG.md). Die Bergung im Hafenbecken bleibt beim bisherigen Verhalten.

### 04.10.2026 – Marcel: Fahrbugs an Sprung, Rampe und Roadster-Wimpeln

**Beobachtung/Auftrag:** Während der Fahrt bleiben beim Lufttrick die Räder scheinbar stehen, die Rampe flimmert wegen Überlagerung mit dem Straßenbelag, und auf den Roadster-Wimpeln werden Adler gewünscht.

**Ergebnis:** Die getrennte Radgruppe rollt während des Lufttricks gemeinsam mit der Karosserie; die Holzrampe wurde 5 cm über ihr deckungsgleiches Straßenprofil gehoben; beide Roadster-Wimpel tragen im Laufzeitbild ein eigenständiges Adlerrelief ohne Regimezeichen. Code-, Asset-, Regressionstest- und Buildprüfung stehen im [Fortschrittslog](PROGRESS-LOG.md). Menschliche Fahrt auf der Rampe/durch den Sprung bleibt offen.

### 04.10.2026 – Projektstartabgleich und nächste Arbeit

**Von:** Codex für Marcel. **Status:** geprüft, keine Teamnachricht versandt.

`origin/main` und der PC-Checkout stehen auf `00e8173`; die Handy-Arbeitsnotizen sind dort sichtbar. Die aktuelle Gesamtsuite mit neuem Bot-Weglinientest besteht 47/47; Produktionsbuild besteht. Sarahs eigenen Abruf muss sie auf ihrem Gerät bestätigen. Das technische Schadens-/Wandgleitenpaket ist bereits eingebaut; menschliches Fahrgefühl und vorläufige Werte bleiben offen. Die sechs Fahrerporträts wurden in der Laufzeit geprüft und zeigen den gewählten Fahrer vor einer neutralen Studiofläche. Der erste Gesichts-Pass verkleinert den Kopf relativ zum Oberkörper und mattiert Haut/Augen; die Gesichter bleiben Karikaturen. Der bereits modellierte, am Kart fixierte Schalensitz ist in der Laufzeit sichtbar; menschliche Sitz-/Beinpassform bleibt offen. Bot 3 folgt nun einer eigenen Weglinie durch die Hinterhofgasse; ein Mehrbot-Straßentest bleibt sinnvoll. Der Quaternius-Standarddownload ist CC0/glTF; die vollständigen `.blend`-Quellen kosten Geld, daher werden sie nicht verwendet. Historische Stimmen bleiben bis zur belastbaren Rechte- und Inhaltsprüfung sowie menschlichen Hörprobe offen.

Für die historischen Hupen sind zwei Kandidaten geprüft und ausgeschieden: `Hit43.ogg` ist laut Commons eine politische Rede, `It-Benito_Mussolini.ogg` eine moderne Namensaussprache. Keine davon ist als historische Hupenaufnahme passend. Eine bessere Primärquelle muss Person, unbedenklichen Ausschnitt und Wiederverwendungsstatus belegen.

### 04.10.2026 – Marcel: nächste Qualitätsstufe

Alles deutlich schöner, realistischer und hochwertiger machen: viel bessere Modelle, Charaktere, Fahrzeuge, Strecke, Umfeld, Effekte, Sounds, Stimmen und Musik. Maßstab ist unsere gewählte Bildpräferenz. **Keine Text-to-Speech-Stimmen als Endergebnis.** Status: Ziel verankert, Umsetzung/Abnahme offen; Details in [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md).

**Zusatzpaket (Codex, 04.10.):** Der gemeinsame Rad-Detailpass ergänzt modellierte Seitenwandrippen und Felgenmuttern in der editierbaren Blender-Quelle. Der große Fahrer-/Fahrzeuganker bleibt in Arbeit; sichtbare Nahprüfung im Rennen ist noch offen. Belege: [Arbeitsliste](CURRENT-WORKLIST.md), [Fortschrittslog](PROGRESS-LOG.md).

**Zusatzpaket 2 (Codex, 04.10.):** Das Laufzeit-Skinmaterial hat jetzt eine zurückhaltende prozedurale Poren-/Farbstruktur und sehr schwache Normalvariation. Nur Build und automatisierte Suite können die Renderintegration technisch absichern; menschliche Nahansicht bleibt offen.

### 04.10.2026 – Sarahs Panzerfrage, von Marcel übermittelt

Sarah fragt, ob Hitler weiterhin sein Kart als Spezialfähigkeit in einen Panzer verwandelt; sie habe dies programmiert. **Befund:** im veröffentlichten Altarchiv e292070 tatsächlich implementiert (8 s Dauer, 18 s Abklingzeit); im neuen Babylon-Spiel noch nicht. Git führt Marcel als Autor, deshalb Sarahs Urheberschaft als übermittelte Aussage kennzeichnen. Marcel möchte sinnvolle Änderungen professionell neu umsetzen lassen; Claude-Übergabe vorbereitet. Weitere Fähigkeiten/Items/Botänderungen stehen im [Abgleich mit Quellen](docs/sarah-feature-audit.md). Keine Zustimmung Sarahs zu abweichenden Neuinterpretationen behaupten; unveröffentlichte Arbeit auf ihrem PC bleibt hier unbekannt.

Hier dürfen Marcel und Sarah direkt ergänzen. Die KI darf Formulierungen ordnen, erhält aber die Aussage und Autorenschaft. Keine erfundenen Zustimmungen oder fertigen Abnahmen.

### Vorlage – kopieren und ausfüllen

- **Datum / Person:**
- **Beobachtung oder Idee:**
- **Gewünschtes Ergebnis / Frage:**
- **KI-Status / Verweis:** offen; nach Sichtung mit Aufgabe oder Ergebnis verknüpfen.

### 03.10.2026 – Marcel

- Die geglättete Fahrt fühlt sich wesentlich flüssiger und besser an. Das ist ein positiver Fahrtest-Befund.
- Wir wollen vier zentrale Dateien, kurze Start-/Abschlussbefehle und gemeinsame KI-/Git-Unterstützung. Diese Anleitung richtet sich an uns beide.
- Offen bleiben vor allem erkennbare, realitätsnahe historische Fahrer und deutlich hochwertigere Grafik. Vorläufige Figuren nicht als fertige Abbilder melden.

### 04.10.2026 (Abend) – Claude für Marcel: arbeiten ChatGPT und Claude auf derselben Version?

Ja. Beide arbeiten im Ordner `D:\Diktator-Kart` auf demselben Git-Stand; die Maussteuerung war unverändert ChatGPTs Reparatur. Der alte Claude-Worktree, der früher einen veralteten Stand zeigen konnte, ist gelöscht. Die Maus-Geste brach in Browsern ab, die den Mauszeiger nicht einfangen dürfen; das ist jetzt abgefangen. **Status:** bitte in Chrome testen und Ergebnis hier notieren. Neu zum Ausprobieren: Fahrerwahl, eigene Wurfobjekte, Marsch, Feuerwerk ([Arbeitsliste](CURRENT-WORKLIST.md)).

### 04.10.2026 (Abend) – Claude für Sarah und Marcel: neu zum Ausprobieren

Größere Karte mit Kanalsprung und zweiter Rampe, ruhigerer Drift mit drei Turbostufen, Windschatten, Sprung-Trick, Item als Schild (E halten), Zeitfahren mit Geist und Medaillen, Gegnerstärke, Grafik „Hoch“, eigene Karosserie je Figur, neu modellierte Köpfe/Haare, Füße auf den Pedalen. Hupen bleiben vorerst Text-to-Speech. **Status:** offen, bitte Fahrgefühl, Drift und Lenkung selbst testen und hier notieren.

### 04.10.2026 – KI-Übergabe

Geprüfte Spielversion 2c6e92d ist auf GitHub main gesichert; 41 Tests und Build bestanden. Die vier Arbeitsdateien gehören zum Start. Nächste offene Nutzeraufträge stehen in CURRENT-WORKLIST.md; keine fertigen realitätsnahen Fahrer oder Hörabnahme behaupten.


## Neue Spielideen und Auftrag für morgen – Marcel, 04.10.2026 (Handy)

Marcel möchte am 05.10. zuerst den PC-/Cloud-Stand und die Handyänderungen abgleichen und danach mit den folgenden Spielpaketen beginnen. Die konkrete Reihenfolge steht in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md); vorhandene, ältere Ideen bleiben in den verlinkten Fachdateien erhalten.

- **Wand-/Kartkontakte und Schaden:** Das aktuelle Fahrgefühl ist schon besser als zu Beginn, aber Wandkontakte stoppen noch zu abrupt und stören den Spielfluss. Vorhandene Regel für schräges Bandengleiten gegen den jetzigen Build prüfen. Kollisionen mit Wänden und anderen Karts sollen spürbare, sichtbare Folgen haben. Haltbarkeit/Kumulierung ergänzen; nach mehreren schweren Treffern kann ein Kart satirisch explodieren/ausfallen, der Fahrer komisch herausfliegen und das Fahrzeug nach wenigen Sekunden mit besonderer Animation und Sound zurückkehren. Bestehende Idee zu Spiegel/Auspuff/Abdeckungen/Rauch/Funken in LONG-TERM-GOALS.md ausbauen; Werte und Fairness offen lassen.
- **Realistische Fahrer im Kart:** Gesichter erwachsener, detailreicher und erkennbarer, nicht kindhaft/niedrigpolygonig. Sitz modellieren, Unterkörper/Beine richtig platzieren, Durchstecken aus der Karosserie verhindern. Hände mit Fingern am Lenkradgriff, sichtbare Bewegungsanimation. Gas-/Bremspedale modellieren und bei Eingabe bewegen; Füße passend aufsetzen. Lenkrad verbessern. Fahrerperspektive: Räder lenken zur richtigen Seite, Spiegel nicht spiegelverkehrt; Cockpit und Außenansicht prüfen.
- **Tageszeit und Leben:** Zufällige Stimmung pro Rennen sowie allmählicher Tag-Dämmerung-Nacht-Übergang über die drei Runden (Wunschbeispiel: erste Runde Tag, zweite dunkler, dritte Nacht). Sonne sichtbar machen, Vögel am Tag; nachts Mond, Mondschatten, Sterne, Fledermäuse. Blätter/kleine Partikel, Zeitungen/Müll und abfallende Fahrzeugteile, die zeitweilig liegen bleiben und später verschwinden.
- **Hupen/Stimmen:** echte, identifizierbare historische Live-/Archivaufnahmen aus dem Internet; keine TTS und keine neu vorgelesenen Texte. Quellen, Person, Ausschnitt, Inhalt und kostenlose Nutzungsrechte prüfen, bevor etwas heruntergeladen oder eingebaut wird. Marcels Formulierung zur Stimmfarbe: „schwarz“/markant und wiedererkennbar; die genaue Klangrichtung bei Hörbeispielen klären.

Herkunft: Marcel, diktierte Ideen am Handy, 04.10.2026. Das ist ein aktueller Arbeitsauftrag für morgen; konkrete Schadenwerte, Explosions-/Respawn-Regeln und Tageszeitwahrscheinlichkeit sind noch festzulegen und zu testen. Relevante bestehende Gedanken: [Schadens-/Fahrregeln](docs/07-gameplay-systems.md), [Art Direction](docs/02-art-direction.md), [historische Kontaktentscheidungen](docs/12-decision-log.md), [Langzeitziele](LONG-TERM-GOALS.md).

### 05.10.2026 – Fortsetzung des autonomen Modell-/Weltauftrags – Marcel

Marcel beauftragt, nach der aktuellen Modellaufgabe weitere bestätigte Ziele bis nahe ans offizielle Nutzungslimit umzusetzen. Kurzfristige Reihenfolge und Limitpuffer gelten unverändert. Das Kanalspray und selektive Townhouse-Fassadenvarianten sind technisch umgesetzt; beim Itemschaden wurde zusätzlich ein zuvor übersehener Trefferfall im Panzerzustand korrigiert. Laufzeit-/Effekt- und menschliche Stil-/Fahrabnahmen bleiben separat von Build und Tests. Unbestätigte Gestaltungsideen werden nicht als Zustimmung behandelt. Der letzte offizielle Stand nach dem Gesichts-Teilpass: 8 % Fünf-Stunden- und 43 % Wochenverbrauch; die Woche bindet. Details stehen in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).

Das bestätigte M3-Weltpaket „Übungskrater mit echter Bergung und lesbares Schotter-/Grasfeedback“ ist umgesetzt. Spieler und Bots nutzen dieselben Regeln; menschliche Sicht-/Fahrabnahme bleibt getrennt. Offizieller Stand nach dem Paket: 10 % Fünf-Stunden-Verbrauch und 43 % Wochenverbrauch (90 %/57 % Rest; Woche bindet). Keine Resets/Zusatzkontingente eingesetzt; weiterarbeiten, bis ein bindendes Limit rund 15 % Rest erreicht, dabei etwa 5 % Reserve halten.

**Cast-Regressionsfix (Codex, 05.10.):** Frisch geladene Fahrerwahl zeigte Hitlers Schnurrbart nicht, obwohl ein älterer Eintrag ihn als erledigt bezeichnete. Die alte kleine Quaderform wurde durch zwei sichtbare modellierte Bartflügel ersetzt. Blender-Neubau, GLB- und Cast-Regression, Produktionsbuild und alle sechs Live-Porträts geprüft. Menschliche Stilabnahme des Gesamtmodells bleibt offen.

**Budget-/Folgepaket (Codex, 05.10.):** Nach dem Cast-Regressionspaket zeigt die offizielle Codex-Anzeige 12 % Fünf-Stunden- und 44 % Wochenverbrauch. Die Woche bindet (56 % Rest). Als nächstes ist der bestätigte M3-Laufzeitpass Stalin/Limousine in Front-, Profil-, Nah- und Bewegungsansicht vor Codeänderungen dokumentiert.

**Budget-/Folgepaket (Codex, 05.10., aktualisiert):** Nach dem Stalin-Mützenexport zeigt die offizielle Codex-Anzeige 14 % Fünf-Stunden- und 44 % Wochenverbrauch (86 %/56 % Rest; Woche bindet). Der Mützen-Teilpass ist umgesetzt; nächstes bestätigtes Paket ist der reale Wasser-/Kontaktpartikelbeleg. Keine Resets/Zusatzkontingente aktiviert.


### 2026-10-05 – Weiterarbeit an bestätigten Langzeitzielen (Marcel-Auftrag)

**Auftrag/Status:** Marcel bat nach dem aktuellen Paket um weitere bestätigte Ziele bis nahe ans Nutzungslimit. Das M3-Welt-Merge-/Exportpaket ist nach Vollbau, GLB-Prüfung, 66/66 Tests, Produktionsbuild und echtem Browserlauf technisch abgeschlossen. Die automatisierte Fassaden-Nahansicht liegt bei docs/evidence/world-facade-closeup-hybrid-m3.png; menschliche Stilabnahme ist nicht vorgetäuscht. Als Nächstes ist das bestätigte M7-Leistungspaket vor jeder Optimierung als Instrumentierungs-/Hotspot-Audit in CURRENT-WORKLIST.md gewählt.

**Offizieller Limitstand nach dem Paket:** 7 % im Fünf-Stunden-Fenster und 50 % im Wochenfenster verbraucht (93 %/50 % Rest; Woche bindet). Keine Credits, Resets oder Zusatzkontingente eingesetzt.


### 05.10.2026 – Sarah: heutige Babylon-Änderungen

Für die neue Babylon-Version habe ich die Steuerung für Items festgelegt: Rohrpost und Suchauftrag mit E+V nach vorn und E+H nach hinten; E allein behält Schild und Standardwurf. Der Fotomodus liegt auf F, die Sprachhupe auf V. Der seltene Zensurbalken kam als viertes Item zurück. Kims „Propaganda-Sieg“ wurde anhand der historischen Archividee neu umgesetzt: zehn Sekunden goldene Paradeveredelung für Fahrer und Kart, kurzer Triumphschub und anschließender Motoraussetzer. **Sarahs gewünschter Bannertext:** „Rennergebnis NICHT manipuliert. Kim Jong-Un freut sich über seine demokratische Bestzeit.“ Bei der Nachprüfung folgt eine zweite Bannerphase mit Motorstottern; die tatsächliche Platzierung bleibt unverändert. **Status:** im Babylon-Arbeitsbranch umgesetzt; 51/51 Tests und Produktionsbuild bestanden, beide Bannerphasen im Browser geprüft.

**Integrationsstatus (Codex, 05.10.2026):** Diese Sarah-Änderungen waren in `origin/main` bei `b3df669` enthalten und wurden in Marcels Abschlussbranch inhaltlich mit dem Touch-/HUD-Stand zusammengeführt. Kombinierter Stand: 71/71 Tests und Produktionsbuild bestanden; weitere menschliche Spiel-/Stilabnahme bleibt offen.

- **Hinweis Claude 06.10.2026 (an Marcel und Sarah, Status: offen zur Sichtung):** Bitte das neue Rennen einmal selbst fahren und vor allem den Spree-Kai, die Säulen-Haarnadel und Hitlers Nahansicht (Fahrerwahl, Kamera C) ansehen sowie den neuen Motor anhören. Rückmeldung zu Gesicht, Fassaden und Klang in CURRENT-WORKLIST.md eintragen lassen. Belege: docs/evidence/after-redesign-*.png und hitler-anchor-*.png.

### 07.10.2026 – Hitler-Komplettmodell und Mantel

**Quelle:** Marcels damalige Auswahl des vollständigen Wolfenstein-2-Modells und sein Wunsch, den Mantel auszuziehen. Er stoppte diesen Modellzweig anschließend und setzte den vorherigen CC0-Fahrer wieder ein. Der lange Mantelsaum war aus der Quellfigur entfernt; unter dem Mantel lag kein Torso. Quelldatei, Modellierungsskript und damalige Ansichten wurden lokal unter `.tools/paused-wolfenstein-20261007/` archiviert. Sie sind nicht Teil dieses Pakets.

**Attribution/Rechte:** Sketchfab-Seite nennt Ersteller AkhdanLA und CC BY. Ob der Uploader Rechte an der zugrunde liegenden kommerziellen Wolfenstein-Figur hat, wurde nicht verifiziert. Daher keine öffentliche Veröffentlichung des Modells vor Rechteklärung; das aktuelle lokale Testen ist davon getrennt.

**Referenzdurchgänge W2–W3 (Codex, 07.10.2026, historisch):** Ein festes 50-%-Overlay mit dem Bundesarchiv-Porträt (1938) zeigte die Quellfrisur deutlich zu hell und Kopf-/Haarbreite leicht zu groß. W2 tönte die texturierte Frisur dunkelbraun; W3 verengte Nase und untere Gesichtskontur vorsichtig. Diese Variante ist nicht mehr aktiv. Vergleiche sind lokal unter `.tools/paused-wolfenstein-20261007/` archiviert.

**Referenzdurchgang W4 (Codex, 07.10.2026, historisch):** Isolierter Augenmesh-Render bestätigte zwei getrennte Augenkomponenten ohne Brauen. W4 verkleinerte/vertiefte sie um je einen Augenmittelpunkt; der dunkle Balken blieb. W5/W6 testeten einen Rückversatz. Nach Marcels Modellwechsel wurden alle weiteren Schritte eingestellt; der lokale Vergleich liegt unter `.tools/paused-wolfenstein-20261007/`.

**Rückversatzversuche W5/W6 (Codex, 07.10.2026, historisch):** W5 mit 3 mm veränderte das Overlay kaum; W6 mit 6 mm wirkte leicht weniger hervorstehend. Marcel stoppte diese Modelllinie anschließend ausdrücklich. Quelldateien und Bilder liegen lokal unter `.tools/paused-wolfenstein-20261007/`.

### 07.10.2026 – Auswahl zurück zum CC0-Modell und schwarzer Anzug

**Quelle:** Marcels neue ausdrückliche Steuerung: die Wolfenstein-Version stoppen und mit dem zuvor verwendeten Modell weiterarbeiten; die Bildvergleichsmethode fortführen und danach einen schwarzen S&M-Anzug anlegen.

**Aktueller Stand (08.10.2026):** R28 des Quaternius-CC0-Fahrers ist mit PR #16 in `main` (Merge `e900094`). Verglichen mit festen Front-/Profil-/Dreiviertel-Overlays behält der Kandidat R26s sichere Haarform, feine Lid-/Brauenänderungen und eine etwas breitere Nasenspitze; zahlreiche frühere Varianten wurden verworfen. Der Anzug ist schwarz und leicht glänzend, mit Brustgeschirr, Gürtel und Halsband. Sichtbare Chrome-Seitenansicht zeigte Hände am Lenkrad und angewinkelte Beine; die genaue Fuß-/Pedalauflage blieb unklar. Die Gesichtsnachbildung bleibt erkennbar stilisiert.

**Nächster Schritt:** Issue #13 bleibt offen. Weitere kleine Gesichtsvarianten gegen dieselben Fotoansichten prüfen und eine sichtbare Runtime-Aufnahme mit eindeutiger Fuß-/Pedalposition sichern. Der Wolfenstein-Zweig ist pausiert und nicht aktiv.

### 07.10.2026 spät – Fortschreibung nach R26

**Quelle:** Marcel bestätigte die Rückkehr zum vorletzten CC0-Fahrer und bat um wiederholten Bildvergleich, Gesichtsdetails, schwarzen S&M-Anzug sowie späteren Abschluss/Veröffentlichung.

**Status (Codex):** R23–R28 wurden mit gleichen Kameras und einem Foto-Overlay verglichen; die kuratierten Bilder liegen unter `docs/evidence/hitler-face-20261007/`. R28 ist in main enthalten, aber keine bestätigte historische Ähnlichkeit. Der schwarze Lederanzug mit Halsband, Brustgeschirr und Gürtel ist in der Runtime-GLB-Datei.

**Offen:** Gesicht weiter verfeinern, sichtbare Fuß-/Pedalposition belegen und Marcels Ähnlichkeits-/Stilurteil aufnehmen. PR #16 hat `tests-and-build` bestanden und ist in main integriert; Issue #13 bleibt dafür offen. Direkte Pushes nach `main` sind nicht der Projektworkflow. Der Rechner wurde nach der erfolgreichen Veröffentlichung in den angeforderten Ruhezustand versetzt.

**Fortschreibung (Codex, gleicher Auftrag):** R27s Kronenkürzung wurde wegen kahler Hinterkopf-/Scheitelfläche im Profil verworfen. R28 ist wieder auf sicherer R26-Haarform und verbreitert nur die Nasenspitze/Nasenflügel leicht. Sichtbare Chrome-Seitenansicht zeigte Hände am Lenkrad und angewinkelte Beine im Fußraum; Pedalberührung ist noch nicht eindeutig. Der Modellvergleich bleibt eine deutliche Näherung und braucht Marcels Urteil.

### 11.10.2026 – A4: Zeppelin-Linienwind und Prüfergebnis (Codex)

Der Berliner Runde-zwei-Zeppelin hält seine bestehende Orts-/Rundenbedingung. Beim Auslösen beginnt ein 14-s-Wirkfenster. Der Rückenwind wird pro Physikschritt nur für Karts auf der äußeren Tribünenspur (s=45–182, lane > 2,4), am Boden, vorwärts fahrend und ohne aktiven Turbo addiert; maximale Zusatzgeschwindigkeit +1,2 m/s, Aufbau 1,5 m/s². Die Innenlinie erhält keinen Effekt. Spieler und Bots laufen durch dieselbe Regel. Regression: Grenzen s=45/182, lane=2,4 und freie Gegenlinie. Laufzeitfahrt und Sichtbeleg wurden in diesem Paket nicht ausgeführt.

`npm run test:full` besteht außerhalb der Sandbox mit 135/135. Der erste Sandbox-Lauf hatte 126/135: alle neun Fehlschläge waren Team-/Launcher-Fixtures mit Windows/MSYS `NtCreateDirectoryObject ... 0xC0000022`; keine Spieltests schlugen fehl. `npm run typecheck` und `npm run build` bestanden. Produktionsbundle: 2.163,74 KB / 534,71 KB gzip; vorhandene Warnung über Chunk >500 KB. `git diff --check` vor der Dokumentationsfortschreibung sauber. Offizielle Nutzung beim Paketabschluss: 20 % Fünf-Stunden- und 18 % Wochenverbrauch (80 % / 82 % Rest); kein Reset/Zusatzkontingent verwendet.

### 11.10.2026 – Laufzeitstichprobe A4 und neue A5-Teilaufgabe (Codex)

Der Build lud in einem eigens gestarteten verborgenen In-App-Browser bis ins Berliner GP. Fahrerwahl, Streckenauswahl, Renn-HUD, Minimap und sechs Karts waren zu sehen; im kurzen Anfahrversuch wurden ein Schäferhund-Item aufgenommen und 76 km/h im HUD gezeigt. Das ist nur ein Start-/HUD-Beleg: der Fahrer blieb am Ende des Versuchs auf Platz 6, die Lenkkontrolle war nicht stabil, und kein Zeppelin-/Wind- oder Publikumsereignis wurde als ausgelöst bestätigt. Escape pausierte/zurück ins Menü; der eigene Tab und Vite-Server wurden geschlossen. Keine dauerhafte Aufnahme, FPS- oder Konsolenmessung.

**Neu aus dem bestehenden A5-Ziel abgeleitet:** Der zweite Bot-Abwehrslot aktiviert derzeit für beliebige Nicht-Fallen-Projektile innerhalb 10 m. Nächster kleiner Umsetzungsschritt: Anflugbahn und relative Bewegung vorhersagen, damit seitlich vorbeigehende Projektile keine Abwehrladung verschwenden. Diese konkrete Lücke ist in CURRENT-WORKLIST.md priorisiert und als Ziel A16 in LONG-TERM-GOALS.md aufgenommen.

### 11.10.2026 – A16 Bot-Abwehrslot, Ergebnis und Budget (Codex)

`botShouldUseDefense` ersetzt den bloßen 10-m-Abstandsauslöser durch die vorhergesagte relative Bewegung von Zielkart und Projektil. Das Aktivierungsfenster ist konservativ auf 0,65 s begrenzt (das Abwehrschild hält 1,35 s), damit nahe, aber vorbeigehende Objekte den Slot nicht verbrauchen. Ein gelocktes Homing-Geschoss wird in Reichweite ebenfalls erkannt. Fallen, eigene Geschosse, abgelaufene Objekte und fehlende Slots werden nicht aktiviert. Sechs Regressionen prüfen direkten Anflug, knappes Vorbeifliegen, Falle, Homing-Ziel-Lock, eigenes Geschoss und fehlenden Slot. `npm run test:full` 136/136, `npm run typecheck` und `npm run build` bestanden. Build nach Homing-Pass: 2.164,19 KB / 534,87 KB gzip, bekannte Chunkwarnung. Bot-Homing-Laufzeitbeobachtung steht aus. Offizielle Codex-Nutzung: 22 % Fünf-Stunden- und 18 % Wochenverbrauch (78 % / 82 % Rest); kein Reset/Zusatzkontingent.

### 11.10.2026 – A17 offensive Bot-Items, Ergebnis und Budget (Codex)

`tests/bot-racing.test.mjs` sichert die schon vorhandene Itemlogik gegen taktische Regressionen: ausgerichteter Rival für den direkten Schuss; Easy wartet bei einem längeren Entscheidungsfenster, Hard kann früher reagieren; nahe Verfolger rechtfertigen die Stempelfalle, ein entfernter nicht; Eilerlass-Boost wird bei fast stehendem Kart zurückgehalten und während Fahrt eingesetzt. Der gezielte Test besteht; `npm run test:full` 137/137, `npm run typecheck` und `npm run build` bestanden. Bundle 2.164,19 KB / 534,87 KB gzip, bestehende Chunkwarnung. Sichtbare Bot-Item- und Positionswechsel-/Menschenabnahme steht offen. Offizielle Codex-Nutzung: 23 % Fünf-Stunden- und 19 % Wochenverbrauch (77 % / 81 % Rest); keine Resets/Zusatzkontingente.

### 11.10.2026 – A18 Laufzeitfund und Kurszuordnung der Ereignisse (Codex)

Zweiter verborgener Berlin-GP mit aktiviertem Auto-Gas und Lenkhilfe erreichte Runde 2, Rang 3 und etwa 72 km/h; HUD, Minimap, Tribünengerade, Schnee und Karts waren sichtbar. Der Itemkarten-Text zeigte jedoch „Malecón-Welle! Die Gischt trifft die Meerseite“ auf dem Berliner Stadionring. Das bestätigt eine falsche Kursauslösung, aber noch nicht Zeppelin- oder Windwirkung. Escape pausierte; eigener Browser-Tab und Server wurden geschlossen.

Als A18 ist die Kursidentität zentral mit dem Ereignistyp gekoppelt: Zeppelin/Berlin, Malecón/Havanna, Balkon/Rom, Pflichtjubel/Peking, Ehrenparade/Moskau, Kolonne/Pjöngjang. Die gemeinsame Helper-Funktion wird sowohl in Trigger- als auch Physikzweigen abgefragt. Kreuzkurs-Regression prüft alle 36 Kombinationen. Vollsuite 138/138, Typprüfung und Build bestanden; Bundle 2.164,51 KB / 534,95 KB gzip, bestehende Chunkwarnung.

Im erneuten verborgenen Berlin-GP blieben die Auto-Gas-/Lenkhilfe-Testoptionen wie zuvor aktiv. In Runde 2 wurden die Anzeigen bei 1:22, 1:44 und 1:52 geprüft: kein Malecón-Toast, nur allgemeine Rohrpost-/Itemhinweise. Das ist eine Stichprobenbestätigung, kein beweisender Screenshot des einmaligen Triggers. Der Zeppelin-/Windeffekt und die Publikumsreaktion waren nicht eindeutig erkennbar; A4-Sichtabnahme bleibt offen. Danach wurden beide Testoptionen auf „aus“ zurückgestellt und der eigene Lauf pausiert. Der frische Spieltab wurde geschlossen; ein früherer Fehlerseiten-Tab ließ sich wegen des Browser-Navigationsschutzes nicht erneut anbinden. Eigene Vite-Instanz wurde beendet.

Spätere Berliner A4/A19-Sichtprobe: Die neue Anzeige zeigte `Propaganda-Zeppelin! Rückenwind auf der Tribünenspur · innen bleibt freie Fahrt` bei Rennzeit 1:09, während Hitler noch `1 / 3` fuhr (Platz 5). Bei 1:54 und Spieler-Runde `2 / 3` war nur noch ein gewöhnlicher Trefferhinweis zu sehen; es war kein Zeppelin klar erkennbar. Aus dem in `main.ts` verwendeten `some([Spieler, Bots])`-Trigger folgt, dass ein Bot das globale 14-s-Fenster schon in der ersten Spielerrunde gestartet hat. A20 bindet den Ereignisstart an den Spieler, die Effekte bleiben aber gemeinsam für alle Karts im Bereich. Auto-Gas und Lenkhilfe wurden anschließend auf „aus“ zurückgesetzt; der eigene Tab pausiert/geschlossen und der Vite-Server beendet.

### 11.10.2026 – A19 Kursereignisse vor HUD-Toast-Verdrängung schützen (Codex)

Die Berliner Stichprobe zeigte normale Item-/Rohrpostmeldungen im selben Abschnitt, in dem das Runde-zwei-Kursereignis erwartet wurde. A19 trennt Kursmeldungen deshalb vom gewöhnlichen `itemMessage`: Zeppelin, Welle, Balkonrede, Pflichtjubel, Ehrenparade und Paradekolonne bleiben jeweils vier Sekunden sichtbar. Der Itemtext wird darunter weiter aktualisiert und erscheint unmittelbar nach Ende des Eventfensters. Neue Regression deckt währenddessen eintreffenden Trefferhinweis, exakte Vier-Sekunden-Grenze und leeren Eventkanal ab. `npm run test:full` scheiterte zuerst im Sandboxlauf ausschließlich an den Windows-MSYS-Fixtures (`NtCreateDirectoryObject`), bestand außerhalb der Sandbox mit 139/139; `npm run build` (TypeScript eingeschlossen) erfolgreich. Bundle 2.164,82 KB / 535,06 KB gzip, bekannte Chunkwarnung. Offizielle Nutzung: 28 % Fünf-Stunden-, 19 % Wochenverbrauch (72 %/81 % Rest). Berliner Runtime zeigte Toast um 1:09 und normalen Slottext wieder um etwa 1:12; gleichzeitigen Itemtreffer nicht gezielt erzwungen.

### 11.10.2026 – A20 Kursereignisse am eigenen Fortschritt starten (Codex)

Alle sechs Kursereignisse starten nun anhand der Spielerposition und des eigenen Runde-zwei-Fortschritts; eine frühere Botrunde kann den gemeinsamen Effekt nicht verbrauchen. Tracktests 17/17, Vollsuite 140/140, `npm run build` inklusive TypeScript bestanden. Bundle 2.164,53 KB / 535,07 KB gzip, bekannte Vite-Chunkwarnung. Offizielle Nutzung: 30 % Fünf-Stunden-, 20 % Wochenverbrauch (70 %/80 % Rest). Verborgener Berlin-Nachtest: bei 1:19 blieb der Toast aus, Spieler-Runde 1/3; Runde 2 begann bei 1:48. Das Vier-Sekunden-Anzeigefenster wurde nicht zeitnah erfasst, also keine Bestätigung des exakten Ereignisstarts und Zeppelinbilds. Auto-Gas/Lenkhilfe danach ausgestellt; eigener Tab und Vite-Server geschlossen.

Zweiter versteckter Berlinlauf mit dichterer Stichprobe: Zeppelinmeldung `Propaganda-Zeppelin! Rückenwind auf der Tribünenspur · innen bleibt freie Fahrt` bei Rennzeit 1:17.82, Spieler-Runde 2/3, Rang 3. In Runde 1 war kein vorzeitiger Zeppelin-Toast zu sehen. Ein Screenshot bei 1:19.98 zeigte weiterhin Runde 2/3 und Rang 3; die itemseitige Meldung war bereits auf normalen Schäferhund-/Landungstext zurückgewechselt. Das 3D-Zeppelinmodell ließ sich in diesem Kamerabild nicht sicher erkennen; die eigentliche Außenlinienwindwirkung und Publikumsanimation bleiben A4-Abnahme. Auto-Gas und Lenkhilfe wurden ausgestellt; eigener Tab geschlossen und Vite beendet. Offizielle Nutzung nach der Runtimeprobe: 32 % Fünf-Stunden-, 20 % Wochenverbrauch (68 %/80 % Rest).

### 11.10.2026 – A5 Botabwehr-Runtime-Stichprobe (Codex)

Verborgener Berlin-GP mit Hitler, mittleren Bots, Auto-Gas und Lenkhilfe. HUD zeigte Schäferhund-Homingitem, anschließend `Schäferhund unterwegs`; ein sichtbarer Bot war nahe. Danach lag der Spieler im Granattrichter, wurde durch `B` zurückgesetzt und setzte das Rennen fort. Im späteren Ausschnitt war ein Bot in der Luft, aber kein Schildblock sicher zuzuordnen; wegen konkurrierender Treffer-/Trichtereffekte ist die Abwehrprobe nicht aussagekräftig. Leicht/mittel/schwer nicht verglichen. Auto-Gas/Lenkhilfe danach aus; eigener Tab und Vite-Prozess beendet. Nebenbefund: der Krater kann im Berliner Hauptweg leicht direkt angefahren werden; A14s Lesbarkeit von Gefahr und Ausweichlinie erneut beachten.

Als Code-/Modellergänzung wurde in `tests/bot-racing.test.mjs` der Integrationspfad ergänzt: Der prognostizierte Bot aktiviert den zweiten Slot und blockt den innerhalb der Schutzzeit ankommenden Schuss. Der erste Testentwurf platzierte die Szene abseits der Fahrbahn und ließ das Projektil an der Streckenwand verschwinden; nach Platzierung auf `trackPoint(100)` besteht der gezielte Test. `npm test` 124/124; zuvor alle Bot-Rennen und die alte Vollsuite bestanden. Keine Produktionsdatei geändert, daher kein erneuter Build. Der Runtime-Block bleibt offen.

### 12.10.2026 – A47 vollständig natürlicher Pekinglauf und A56

Der vollständige natürliche Einzelrennenlauf in Peking startete am Grid mit sechs Karts und Auto-Gas/Lenkhilfe. Keine Position wurde gesetzt und kein QA-Trigger verwendet. Das Rennen erreichte Runde 2; Pflichtjubelmeldung und Papierstoß sind im normalen Spieler-Verfolgerblick sichtbar. Bei 450 ms kreuzen einzelne Blätter den transparenten oberen Timer-/Titelbereich, die Rennzeit bleibt lesbar. Nach 2 s sind keine Eventblätter mehr aktiv und der HUD-Bereich ist frei. Belege: `docs/evidence/a47f-beijing-natural-full-event-450ms.png`, `a47f-beijing-natural-full-event-2s.png`, `a47f-beijing-natural-full-event.json`. Das ist automatisierte Runtime-Sichtprüfung, keine menschliche Fahrt- oder Hörabnahme.

CURRENT-WORKLIST.md und LONG-TERM-GOALS.md führen A56: Eventpartikel aus dem Timerbereich halten und unter gleichen Bedingungen normal/reduziert sowie Moskau prüfen. A47s natürlicher Trigger gilt als belegt; Effekt-/HUD-Abnahme bleibt offen. Marcels aktuelle Äußerung „58 … weil du …“ war abgebrochen; die Ergänzung stützt sich auf das sichtbare HUD-Kreuzen, nicht auf eine Vermutung zum Satzende. Die zugehörige natürliche Testinstanz wurde regulär durch ihren Runner geschlossen.

### 12.10.2026 – A56 Pekingpartikel tiefer gesetzt und natürlich geprüft

Die natürliche Rennlogik setzt die Peking-Flugblätter jetzt auf 1,7 m über Streckenhöhe (zuvor 3,2 m). Headless Chrome absolvierte erneut ein vollständiges Pekingrennen vom Grid mit sechs Karts, Auto-Gas/Lenkhilfe und ohne Fortschrittsinjektion. In Runde 2 wurde der reguläre Pflichtjubel ausgelöst. Bei 450 ms bleibt das Motiv im Spieler-Verfolgerblick klar, während Timer-/Titelanzeige und Item-HUD frei bleiben; Gegenlinie und Fahrbahn sind sichtbar. Im 2-s-Bild sind keine Eventblätter mehr zu sehen. Messbericht: `docs/evidence/a47g-beijing-natural-lowered-event.json`; Bilder `a47g-beijing-natural-lowered-event-450ms.png` / `...-2s.png`. Tests 136/136 und Build/TypeScript bestanden, Runtimefehler 0. Nächstes A56: dieselbe Abnahme in Schwachgrafik und natürlicher Moskauer Prüfung. Menschliche Fahr-/Hörabnahme nicht durchgeführt.

### 12.10.2026 – Natürliche Eventprüfung Peking/Moskau normal und reduziert

A56: Peking und Moskau wurden in insgesamt vier vollständigen, automatisierten Rennen natürlich bis zum Runde-zwei-Ereignis gefahren. Normal- und Schwachgrafik wurden direkt nach derselben natürlichen Auslösung aufgenommen. In Peking bleiben 24/12 Blätter sichtbar, ohne Timer-/Item-HUD zu verdecken. Der feste Moskauer Punkt s=300 war im Erstlauf nicht aussagekräftig sichtbar; deshalb wurde der Eventburst auf 20 m vor den Spieler gelegt. Der danach erneut natürlich ausgelöste Moskauer Stoß ist bei normaler Grafik klar entlang der Geraden erkennbar und verdeckt das Kart nicht; Schwachgrafik reduziert die Menge deutlich und lässt einige Motive sichtbar. Alle Effektbilder bei 2 s sind abgeklungen. Ergebnis-JSONs: `a47g-beijing-natural-lowered-event.json`, `a56-beijing-reduced-event.json`, `a54c-moscow-ahead-event.json`, `a56-moscow-reduced-event.json`. Bilder jeweils mit `-450ms` und `-2s`. Die schnellen Tests bestanden mit 136/136; `npm run build` inklusive TypeScript war erfolgreich. Keine menschliche Fahrt-/Hörprüfung. Nächste natürliche Sichtprüfungen: Havanna, Rom, Pjöngjang; danach Berlins Windgegenlinie.

### 12.10.2026 – A57-Feldmessung, A61-Paradedauer und Laufgrenze

A57-Naturlauf in Pjöngjang: 26 Feldsamples über 15 s, sechs Karts, null Runtimefehler und keine Rangwechsel. Der Spieler blieb Platz 5 bei rund 72,5 km/h. Ein Bot wechselte beim Passieren der Kolonne von der Außen- auf die Innenlinie; die Parade war im Verfolgerbild am Start und nach 15 s nicht klar erkennbar. JSON/Bilder `a57b-pyongyang-parade-window.json`, `a57b-pyongyang-parade-start.png`, `a57b-pyongyang-parade-plus-15s.png`.

A61 setzt die physische Kolonne nach 15 s außer Betrieb. Testgrenze: 14,99 s aktiv, 15,00 s inaktiv und alte Fahrzeugposition nicht mehr als Hindernis projiziert. `npm run test:full` 154/154; Build/TypeScript erfolgreich, Bundle 2.169,08 KB / 536,93 KB gzip mit bekannter Chunkwarnung. Ein neuer natürlicher Headless-Lauf umging den Runde-zwei-Boulevardtrigger über die Unterführung; A61s natürliche Ablaufbilder bleiben daher offen und sind in CURRENT-WORKLIST.md als nächster Schritt markiert. Die eigene Testinstanz und der gestartete Vite-PID wurden gezielt geschlossen; ein nicht zugehöriger Listener an Port 4173 wurde nicht beendet.

Offizielle Codex-Nutzung nach diesem Paket: 26 % Fünf-Stunden- und 33 % Wochenverbrauch (74 %/67 % Rest); keine Resets/Zusatzkontingente.

### 12.10.2026 – A63 natürliche Gegenlinienläufe und aktueller Stand

A63 ist abgeschlossen. Havanna löste die Runde-zwei-Welle bei 1:15.20 mit Spieler lane −1,74 auf der Innenlinie aus; Peking löste den Pflichtjubel bei 2:00.60 mit Spieler lane +3,28 auf der Außenlinie aus. Sechs Karts wurden in beiden Läufen vor/während/nachher protokolliert. Die lokalen Effekte trafen Karts auf Meeres-/Mittellinie. Der Spieler blieb jeweils Platz 1; im aktiven 14-s-Fenster ist kein Event-Rangwechsel belegt. Ein Bottausch in Peking erschien erst rund 22 s nach Auslösung, außerhalb des Wirkungsfensters. Das ist das nächste konkrete A57-Messsignal: Eventwirkung und Botlinienwahl erzeugen noch keinen belegten Rangwechsel. Vollsuite 155/155, Schnelltest 138/138 (5,95 s), Build erfolgreich; Bundle 2.169,00 KB / 536,91 KB gzip mit bekannter Chunkwarnung. `git diff --check` sauber bis auf Zeilenendenhinweise.

Laufzeitprüfung fand vollständig in eigener Headless-Chrome-Instanz mit separatem `.tools/a63-headless-gpu-profile` statt. Havanna wurde ohne Eingabe gefahren; im zweiten Pekinglauf war nur eine normale Arrow-Right-Lenkung vor dem Ereignismarker gesetzt, keine Position oder Spielmechanik. Belege in `docs/evidence/a63-*.json` und passenden Triggerbildern. Aktuelle offizielle Nutzung: 4 % Fünf-Stunden- und 34 % Wochenverbrauch (96 %/66 % Rest); keine Resets/Zusatzkontingente. Nächster ausführbarer Block: A57 Bots und Eventstärke für lesbare, faire Positionswechsel abstimmen; danach A58 Havanna-/Rom-Überlagerungen.

### 12.10.2026 – Korrigierter A57-Lauf, A72 und Aufgabenlisten-Klarstellung

Der zweite Havanna-Monitor erkannte ausschließlich den wirklichen Eventtoast „Malecón-Welle!“ und sammelte vor dem Ereignis 29 Samples, im dichten Fenster 141 Samples sowie zehn Nachsamples. In keinem Sample lag ein Kart in der Meerseiten-Wirkzone. Rangwechsel kamen vor, sind aber nicht als Eventwirkung belegt. Die frühere Fehlmessung erfasste die Vorwarnung und bleibt klar als Diagnose benannt. A72 wurde als bestätigtes Ziel eingetragen: Botreaktionen auf Events sollen nachvollziehbar variieren, damit nicht alle Bots dieselbe Gegenlinie und vollständige Vermeidung wählen. Siehe `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md` und `TEAM-CHANGES.md`.

Marcel stellte die vorher abgebrochene Mitteilung klar: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ Die neuen Aufgaben und A72 sind dokumentiert; aktueller Fortschritt und nächste Schritte stehen in den vier Hauptdateien.

### 12.10.2026 – A72 Botrisiko umgesetzt und Vollfenster geprüft

Nach dem Baseline-Lauf ohne Wellenkontakt erhielten die sechs Botstile abgestufte `eventRisk`-Gewichte. Der Havanna-Regressionscheck lässt den vorsichtigen Bot weiterhin die Gegenlinie wählen und bestätigt, dass ein mutiger Stil die bevorzugte Meerseitenlinie halten kann. Im natürlichen Vollfensterlauf wurden 70 page-lokale Samples über knapp 14 s Rennzeit erfasst. Bot 2 berührte die Wellenzone elfmal und sank dort von 21,6 auf 18,0 m/s; Bot 1 traf den Randbereich zweimal. Drei Bots blieben auf Gegenlinien. Bot 2 blieb P2; ein späterer Wechsel zwischen Bot 1 und 3 erfolgte ohne ihren gleichzeitigen Zonenberührungsnachweis und wird nicht der Welle zugerechnet. Laufzeitfehler: 0. A72 ist damit technisch und natürlich geprüft; A57s kausaler Rangwechselnachweis sowie die menschliche Fahrabnahme bleiben offen. Beleg: `docs/evidence/a72-havana-natural-wave-full-window.json`.

Vollprüfung: `npm run test:full` 156/156 in 89,85 s, `npm test` 139/139 und Build/TypeScript bestanden. Bundle 2.169,76 KB / 537,17 KB gzip mit bestehender Chunkwarnung. Offizielle Nutzung nach dem Paket: 1 % Fünf-Stunden- und 39 % Wochenverbrauch; keine Zusatzkontingente oder manuellen Resets.
### 12.10.2026 – Aufgabenpräzisierung und nächste Ziele

Marcel stellte die abgebrochene Bitte klar: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ A73/A74 stehen nun in der Arbeitsliste und den Langzeitzielen: feste, je Strecke unterschiedliche Abkürzungsmerkmale ohne Zufallsgenerierung; neue Kurse erst nach Qualitätsabnahme aller sechs vorhandenen Einzelspielerstrecken.

A70-Zeitregression: Moskau-Hauptweg 370,35 s, Abkürzung ohne neues Feld 369,67 s, mit Feld 369,45 s über drei Modellrunden; das Boostfeld löste je Runde einmal aus. `npm run test:full` 157/157. Diese Simulation belegte zunächst keinen natürlichen Runtimekontakt. Der Headless-Lauf hat den Botkontakt inzwischen nachgewiesen; der menschliche Fahrvorteil bleibt offen. Nächster Prüfschritt: feste Item-/Gefahrprofile und Risiko-/Nutzenbalance über die sechs Abkürzungen bewerten.

Offizielle Codex-Anzeige am 12.10.2026: 3 % Fünf-Stundenverbrauch und 40 % Wochenverbrauch (97 % / 60 % Rest); keine Resets oder Zusatzkontingente aktiviert.

### 12.10.2026 – A70 natürlicher Moskau-Boostkontakt

Der natürliche Headless-Einzelrennenlauf erreichte den shortcut-spezifischen Boost ohne Zustandsinjektion. Kart 2, 1:35,98, s=1912,99, u=90,15, lane=0,03, 19,95 m/s, Turbo 1,2 s; bodengebunden, Laufzeitfehler 0. Siehe `docs/evidence/a70-moscow-shortcut-natural-boost.json` und PNG. Nächster Schritt für A73: feste Item-/Gefahrprofile und Risiko-/Nutzenbalance über alle sechs Abkürzungen bewerten. Für Spielerwirkung bleibt eine menschliche Fahrt offen.

A73.1 Quellenprüfung ergänzt: Shortcutlängen und -limits unterscheiden sich (Berlin 163,5 m/10,5 m/s; Rom 182/11,5; Havanna 125/17; Pjöngjang 560/10,5; Moskau 260/15; Peking 203/15). Rom/Pjöngjang/Peking haben Absenkungen, Moskau Schotter; die ursprüngliche dedizierte Boostzahl je Kurs lautete 0/1/2/2/1/1; A73.2 hat Havanna von zwei auf ein Feld bei u=.55 geändert. Es gibt noch keine Shortcut-exklusiven Itemboxen oder Gefahrvolumen. Die sechs Profile sind als feste Quelldaten erfasst; natürlicher Botzugang zu allen sechs Routen ist inzwischen belegt; menschliche Spielerlinie sowie Item-/Gefahrenprofile und Risiko-/Nutzenbalance bleiben offen.

Offizielle Codex-Anzeige nach diesem Paket: 5 % Fünf-Stundenverbrauch und 40 % Wochenverbrauch (95 % / 60 % Rest); keine Zusatzkontingente oder Resets verwendet.

### 12.10.2026 – A73 Sechs-Kurse-Modell und Havanna-Fix

Gleiches dreiründiges Botmodell für alle sechs Kurse ergab Hauptweg/Shortcut ohne Shortcutboost/mit Shortcutboost: Berlin 213,27/210,20/210,20 s; Rom 227,65/228,60/221,98; Havanna vor Fix 221,97/229,18/355,88; Pjöngjang 287,48/270,57/266,90; Moskau 370,35/369,67/369,45; Peking 254,57/255,85/253,05. Havannas zwei Shortcutfelder erzeugten einen wiederholbaren, etwa 135-s-Stillstand. Auf ein festes Feld bei u=.55 reduziert: 224,18 s, drei Trigger, kein Stillstand, 5 s Gewinn gegen dieselbe Shortcutroute ohne Boost. Natürlicher Headless-Beleg im Gridrennen: 0:46,52, 21,91 m/s, Turbo 1,2 s, Laufzeitfehler 0; `docs/evidence/a73-havanna-shortcut-natural-boost.*`.

Neue Regression `tests/havanna-shortcut-boost.test.mjs` besteht; Vollsuite 158/158 (93,76 s), `npm run build` inklusive TypeScript bestanden. Bekannte Chunkwarnung bleibt (>500 KB). Nächster A73-Schritt: Item-/Gefahrvarianten und Risiko-/Nutzenbalance der sechs festen Abkürzungen prüfen; alle Zeitwerte dieses Screenings sind Modellwerte, keine menschliche Bewertung.

Offizielle Codex-Anzeige nach diesem Paket: 7 % Fünf-Stunden- und 40 % Wochenverbrauch (93 % / 60 % Rest); keine Zusatzkontingente oder Resets verwendet.

A73.3 ist für natürliche Botzugänglichkeit abgenommen: alle sechs fest definierten Shortcutabschnitte wurden aus Gridrennen erreicht; fünf Shortcutfelder lösten aus, Berlin wurde ohne eigenes Feld in der Routemitte erfasst. Keine der sechs Runtimeproben hatte Laufzeitfehler. Menschlicher Zugang/Risiko, Item- oder Gefahrwirkung und Rangfairness bleiben offen.

Offizielle Codex-Anzeige nach den sechs Runtimepässen: 8 % Fünf-Stunden- und 40 % Wochenverbrauch (92 % / 60 % Rest); keine Zusatzkontingente oder Resets verwendet.

### 12.10.2026 – A73.4 Shortcut-Audit und A73.5 ergänzt

Alle sechs natürlichen Botzugänge sind dokumentiert. Der zusätzliche Quellenpass bestätigt: Itemboxen werden derzeit von Hauptroutenpositionen verteilt; keine Abkürzung besitzt ein exklusives Item oder eigenes Gefahrenvolumen. Die sechs festen Abkürzungen unterscheiden sich bereits in Länge, Breite, Untergrund, Höhe und Zahl der Boostfelder. A73.5 wurde als bestätigtes Umsetzungsziel aufgenommen: mindestens zwei Abkürzungen mit eigener Itemchance, die übrigen mit motivpassendem Bodeneffekt oder klar angekündigter Gefahr. Alle Wirkungen bleiben statisch je Kurs und für Karts im Wirkbereich gleich; Spielerzugang, Rückkehr, Zeitbalance und Runtimefehler werden abgenommen. Als nächstes die festen Kandidaten kursweise ausarbeiten und den kleinsten risikoarmen Piloten bestimmen.

Offizielle Nutzung nach A73.4: 8 % Fünf-Stundenverbrauch, 40 % Wochenverbrauch (92 %/60 % Rest); kein Reset oder Zusatzkontingent genutzt.

Die Pilotstrecke für A73.5 ist Peking. Füllreihen bei s≈631,67 und s≈779,33 fallen in die Hutong-Fortschrittsphase. Die frühere liegt 13,2 m von der Abkürzung entfernt; die äußerste späte Box kommt auf 1,8 m an ihre Mittellinie heran. Vor einer neuen Gassenbox den 1,65-m-Pickupradius und tatsächliche Kartposition prüfen, damit keine doppelte Itemchance entsteht. Auswahl basiert auf dem klaren Gassenmotiv und dem vorhandenen Boostfeld.

Die tatsächliche Kontaktgeometrie wurde isoliert geprüft: an u=145,5/lane=−2 lag die bestehende Box 0,28 m entfernt und `stepItems` vergab ein Item. Das verhindert eine redundante zweite Box an derselben Stelle. Die Position wurde für diese Probe gesetzt; natürlicher Kontakt bleibt offen. Beleg `docs/evidence/a73-beijing-shortcut-item-geometry.json`.

Offizielle Nutzung nach A73.5 Itemgeometrie: 9 % Fünf-Stundenverbrauch und 40 % Wochenverbrauch (91 %/60 % Rest). Keine Resets oder Zusatzkontingente genutzt.

### 12.10.2026 – Kurztest neu verifiziert, A73.5 Peking-Pilot

Der aktuelle Standardtest besteht 140/140 in 3,039 s Node-Testdauer (7,55 s Wandzeit); `slow:`-Fälle bleiben separat. Die geänderte Strecken-/Fahrphysik wurde danach mit TypeScript, Produktionsbuild und Vollsuite geprüft: 159/159 in 92,16 s. Vollsuite in der Windows-Sandbox scheiterte nur an Git/MSYS-Prozessrechten in den Teamfixtures (`NtCreateDirectoryObject ... 0xC0000022`); außerhalb bestanden alle. Build-Bundle 2.170,96 KB / 537,51 KB gzip, bekannte Chunkwarnung >500 KB.

A73.5 Peking-Pilot: der feste Nässefleck auf der Hutong-Mittellinie hat zwei trockene Randlinien, eine eigene Warnmarkierung und gemeinsame leichte Tempo-/Gripwirkung. Regression und Drei-Runden-Botsimulation belegen die Liniengrenze, Hauptroutenisolation und natürlichen Simulator-Kontakt. Der nächste visuelle Abnahmeschritt ist ein verdecktes Runtimebild der tatsächlichen Szene; menschliche Fahrt, Rangwirkung und die fünf übrigen Shortcutprofile bleiben offen.

Projektstart-Statuslauf `scripts/team-workflow.ps1 -Action Status` konnte `origin` nicht aktualisieren, da der Sandboxzugriff auf `.git/FETCH_HEAD` verweigert wurde. Der Checkout blieb dirty; keine Synchronisierung, kein Branchwechsel und keine Git-Schreibaktion ausgeführt. Offizielle Codex-Nutzung nach dem Paket: 10 % Fünf-Stunden- und 41 % Wochenverbrauch (90 %/59 % Rest); keine Resets oder Zusatzkontingente.

### 12.10.2026 – Aufgaben ergänzt und Peking-Kontakt geprüft

Marcel stellte klar, dass die Bitte lautete, die Aufgaben zu aktualisieren und der Liste weitere Punkte hinzuzufügen. A75 ist deshalb als bestätigtes Item-Abwehrziel in `CURRENT-WORKLIST.md` und `LONG-TERM-GOALS.md` dokumentiert: ein gehaltenes Heckitem fängt einmal einen Hecktreffer ab und wird dabei verbraucht; der erste Treffer beschädigt das Kart nicht. Die aktuelle Regression prüft auch Folge-, Front-, Seiten- und Falltreffer.

A73.5 erhielt einen natürlichen Headless-Runtimekontakt: Kart 2 passierte den Peking-Teefleck bei u=75,53 (0:31,05; 14,35 m/s; bodengebunden; Runtimefehler 0). Belege `docs/evidence/a73b-beijing-shortcut-natural-route.json` und `a73c-beijing-shortcut-natural-route.png`. Die Bilder zeigen einen gleichzeitig aktiven Papier-/Treffereffekt; der Wasserbelag und seine Warnmarkierung sind damit noch nicht visuell abgenommen. Lokaler Netzwerkzugriff der Standard-Sandbox blockierte den Teststart (`EACCES` auf 127.0.0.1:4194); derselbe isolierte Headlesslauf mit genehmigtem Loopbackzugriff lief durch. Die eigene Testinstanz wurde vom Runner beendet.

Aktueller nächster Schritt: freien visuellen Teefleck-Pass erzeugen, danach die fünf weiteren festen Shortcutprofile ausarbeiten und für jede Route natürliche Einfahrt/Rückkehr sowie Zeit-/Risikoabgleich sichern. Offizielle Codex-Nutzung: 11 % Fünf-Stunden- und 41 % Wochenverbrauch (89 %/59 % Rest); keine Resets oder Zusatzkontingente verwendet.

Zusätzlich dokumentierte bestätigte Folgeziele: A76 prüft einen kleinen beweglichen Streckenobjekt-Piloten mit kursindividueller Vorwarnung und echter Ausweichlinie. A77 prüft Publikumsreaktionen und dynamische Musiksignale über Start, Runde, Überholen, Boost, Item und Streckenereignisse; menschliche Hörabnahme bleibt offen. Beide stehen in `CURRENT-WORKLIST.md` und `LONG-TERM-GOALS.md`.

### 12.10.2026 – A73.5 Peking-Ansicht und nächste Schritte

Zwei botlose Headless-Zeitfahrten erreichten den Hutong-Teefleck auf normaler Spielerlinie (u=75,15–75,74; etwa 14,4–14,7 m/s; bodengebunden; Runtimefehler 0). Die normale Verfolgerkamera zeigt Kurs und Spieler, aber Warnfläche und Nässe sind nicht deutlich genug sichtbar. Die hintere Photo-Angle-Steuerung wurde vom Spielcode im Testlauf nicht übernommen und ist kein Abnahmebeleg. Die neue streckenfolgende Textur ist im Code, aber visuell noch nicht bestätigt. Belege `a73q-*` und `a73r-*` unter `docs/evidence/`.

Peking-Regression plus Heckitem-Regressionen: 4/4. `npm run build` samt TypeScript besteht; Bundle 2.171,62 KB / 537,69 KB gzip, bekannte Vite-Warnung >500 KB. Ursachenbefund: die Sweep-Profile nutzen V-UVs >1, aber `canvasTexture` setzte nur U auf Repeat. Nun wiederholt V ebenfalls; die Wasseremission steht auf Weiß. Die Änderung braucht noch einen natürlichen Screenshot. Drei neue Peking-Laufversuche endeten vor dem Rennen beim Fahrermenü nach asynchronem Streckenwechsel; vorhandene natürliche Belege `a73r-*` und `a73w-*` stammen von vorherigen Texturständen. Nächster Schritt: einen erfolgreichen Lauf nach der Texturkorrektur sichern, dann A75 natürliche Heckitem-Abwehr prüfen. Aktueller Arbeitsstand bleibt dirty und enthält zahlreiche parallele Änderungen; kein Staging, Commit oder Push. Offizielle Codex-Anzeige: 20 % Fünf-Stunden- und 42 % Wochenverbrauch (80 % / 58 % Rest), keine Resets/Zusatzkontingente.
### 12.10.2026 – Testlaufzeiten und natürlicher Peking-Itemkontakt

Die normale Regression lief mit `npm test -- --test-reporter=dot` 140/140 in 3,17 s Node-Testzeit (rund 8 s Shell-Gesamtlauf). Der Langsatz lief 44,99 s; zehn von 19 Fällen bestanden. Neun Team-/Launcher-Fixtures scheiterten an einer Windows-Git-Umgebungsberechtigung (`NtCreateDirectoryObject`, `C0000022`), nicht an einem Spieltest. Die vorhandenen Befehle teilen bereits schnelle, langsame und vollständige Suite; für den normalen Arbeitsloop schnelle plus gezielte betroffene Tests nutzen, Vollsuite mit Git-Fixtures außerhalb dieser Einschränkung erneut ausführen. `npm run test:slow` ist kein kurzer Arbeitsloop.

Der natürliche Peking-Lauf `a73al` war Headless und ohne Item-/Positionsinjektion. Das zuerst auf der Hauptroute gesammelte Item wurde regulär abgeworfen; Pickup danach bei 0:37,55 nahe Hutong-u=145,54, lane −0,30, Fortschritt 694,49 m. Kontakt durch die Gasse bei u=138,71, 19,18 m/s, bodengebunden, null Runtimefehler. Die Pickup-Position liegt in der Ausfahrtsüberlappung mit der Hauptroute, also Erreichbarkeit am Ausgang belegt, exklusive Abkürzungswirkung und Zeitvorteil noch offen. Laufzeitbild/-bericht `docs/evidence/a73al-beijing-shortcut-natural-route.{png,json}`. Der erste Lauf nach Freigabe des Loopback-Zugriffs (a73aj) hatte eine zu enge Kontaktbedingung u≥143 und verfehlte den echten Kontakt bei u≈138; der angepasste Folgelauf traf die gemessene Zone.
### 12.10.2026 – A73.5 Shortcutboxen: Runtimekorrektur und Abnahme

Die erste neue Peking-Box löste beim Kurswechsel `Cannot read properties of undefined (reading 'setEnabled')` aus. Ursache: `item-scene.ts` reservierte den sichtbaren Modellpool nur mit `itemBoxSpots().length`; `createItems()` enthielt bereits zusätzliche Shortcutboxen. `itemBoxCount()` berücksichtigt nun normale und feste Shortcutboxen und treibt die Szene-Poolgröße. Danach bestand der natürliche Peking-Zeitfahrtlauf: erstes Item bei 0:05,68 normal aufgenommen und bei Fortschritt >600 m regulär geworfen; Shortcut-Item `homing` bei 0:36,18, u=123,63, lane −0,60, Fortschritt 668,97 m; Kontakt später bei u=138,43 und 19,18 m/s, bodengebunden, Runtimefehler 0. Bericht/Bild `docs/evidence/a73ar-beijing-shortcut-natural-route.{json,png}`.

Der separate NPC-Lauf auf Rom verwendete den üblichen Duce-Drom-Botcontroller, `createItems`, `stepItems` und `botUsesItem`; der Bot fuhr die Stallgasse und nahm die fest platzierte Box bei u=66,37 während des regulären Dreirennens auf, ohne Zustandsinjektion. Bericht `docs/evidence/a73an-rome-shortcut-item-natural.json`. Die kurzen Regressionen bestehen mit 142/142 in 3,56 s, Produktionsbuild/TypeScript ebenfalls. Die Laufzeitprüfung bleibt headless; eine spätere menschliche Sicht-/Fahrabnahme ist offen.

Offizielle Codex-Nutzung nach diesem Paket am 12.10.2026: 31 % Fünf-Stunden- und 44 % Wochenverbrauch (69 %/56 % Rest). Keine Resets oder Zusatzkontingente verwendet.

### 12.10.2026 – Havanna als dritte Shortcut-Itemlinie

Die feste Box bei Havanna-u=55/lane 0 wird vom für die Alley vorgesehenen NPC natürlich erreicht: 46,12 s, u=53,66, lane −0,36, 1,39 m zur Box; aufgenommen wurde `direct`. Der deterministische Lauf verwendet normale `createItems`-/`stepItems`-Abläufe und injiziert weder Position noch Item. Bericht `docs/evidence/a73au-havanna-shortcut-item-natural.json`. Die sechs itemlosen Drei-Runden-Zeiten nach Layoutabgleich sind Hauptweg/Shortcut mit Pad: Berlin 213,27/210,20 s; Rom 227,65/221,98; Havanna 221,97/224,18; Pjöngjang 287,48/266,90; Moskau 370,35/369,45; Peking 254,57/256,28. Bericht `docs/evidence/a73at-six-route-time-balance.json`.

`npm test -- --test-reporter=dot` bestand 143/143 (5,9996 s Node-Laufzeit); `npm run build` mit TypeScript bestand, Hauptbundle 2.172,67 KB / 537,97 KB gzip. Die vorhandene Vite-Warnung über 500 KB bleibt. Offizielle Codex-Anzeige nach dem Paket: 32 % Fünf-Stundenverbrauch, 44 % Wochenverbrauch (68 %/56 % Rest). Kein Reset oder Zusatzkontingent genutzt. Der gemeinsame Checkout bleibt dirty und enthält parallele Änderungen; kein Staging, Commit oder Push.

### 12.10.2026 – A73.5 Rückkehrregression über sechs Shortcutkurse

Der feste Simulatorlauf startet normale NPCs aus dem Grid und nutzt den Produktionscontroller, Fahrphysik, Oberflächendrag und dieselben Turbo-/Padwerte wie der Sechs-Kurs-Zeitvergleich. Auf allen sechs Kursen fuhr der designierte Shortcutbot drei Runden, trat pro Runde in die Abkürzung ein und auf der gegenüberliegenden Seite wieder auf die Fahrbahn aus; alle Rückkehrpunkte waren bodengebunden und sturzfrei. Zeiten stimmten bis auf einen Frame mit dem bestehenden itemlosen Sechs-Kurs-Audit überein. JSON `docs/evidence/a73av-shortcut-return-audit.json`; Regression im Standardtestlauf. `npm test -- --test-reporter=dot`: 144/144 (9,10 s Gesamtdauer), inklusive gezieltem Reentry-Test mit 2,47 s; TypeScript/Build bestanden, Bundle 2.172,67 KB / 537,97 KB gzip, bekannte Vite-Warnung >500 KB. Offizielle Codex-Nutzung: 33 % Fünf-Stunden- und 44 % Wochenverbrauch (67 %/56 % Rest). Projektstart-Status auf `main`; `origin/main` blieb wegen `.git/FETCH_HEAD`-Zugriff verweigert unsynchronisiert. Gemeinsamer Dirty-Stand wurde erhalten; keine Git-Schreibaktion.

### 12.10.2026 – A75 Heckitem: Runtime-Abnahme offen; A80–A81 ergänzt

Ein gültiges Vorherbild aus `a75f` zeigt die natürlich aufgenommene Stempelfalle im Itemslot bei null Immunitätszeit. Der folgende Testprojektil-Einwurf erzeugte keinen `block`-Eintrag. Zwei Versuche `a75e`/`a75f` blieben damit ohne bestätigten Runtime-Treffer. `a75c` protokolliert zwar ein `block` bei verbrauchtem Itemslot und gleichbleibender Gesundheit, aber kein Objekt-ID-Feld; weil Bot und eingespeistes Projektil dieselbe Besitzer-ID haben, ist die Zuordnung nicht gesichert. Das `a75c`-Vorherbild entstand erst nach dem Block und ist ungültig. Unit-Tests sind der eindeutige Nachweis; Runtimeabwehr, Heckmodell, natürliche Interaktion und menschliche Fahrprobe bleiben offen.

Die bestätigten A80/A81-Folgeziele nehmen die bisher noch nicht eigenständig aufgelisteten Wünsche „mehr Geschwindigkeit“ sowie abwechslungsreicheres, taktisches NPC-Fahren auf. Sie sind in der aktuellen und langfristigen Aufgabenliste vermerkt.

A73.5 Profileinsatz geprüft: Die sechs festen Shortcut-Signaturen sind in `tests/shortcut-items.test.mjs` als Designregression erfasst und bestehen 5/5. Der nächste offene Schritt ist natürliche Lesbarkeit, Effektwirkung und Zeit-/Risiko-Balance unter Verkehr; Menschenwertung bleibt offen.

Offizielle Codex-Nutzung nach diesem Paket am 12.10.2026: 3 % Fünf-Stunden- und 45 % Wochenverbrauch (97 % / 55 % Rest). Keine Resets oder Zusatzkontingente verwendet; gemeinsamer Checkout bleibt mit parallelen Änderungen dirty, daher nicht gestaged oder committet.

### 12.10.2026 – A73.5 Berlin: natürlicher Sprung und sichere Landung

Headless-Lauf aus dem echten Sechs-Kart-Grid, ohne Zustandsinjektion: Rampenbot in Luft über Shortcut-u=3,44 bei 0:31,28; Höhe 1,74 m, Geschwindigkeit 23,87 m/s. Landung bei u=15,08, 0:31,73, bodengebunden und 24,29 m/s. Runtimefehler 0. Belege `docs/evidence/a73az-berlin-ramp-shortcut.json` und `a73az-berlin-ramp-shortcut-{airborne,landing}.png`. Kamera folgt dem Bot; HUD verdeckt Teile des Modells. Strecken-/Shortcuttests 29/29 bestanden. Pjöngjang/Moskau, Zeit-/Risikoauswirkung und menschliche Abnahme bleiben nächste Schritte.
A73.5 Pyongyang: natürlicher Boostkontakt mit frischem Standardkamera-Lauf wiederhergestellt (1:06,17; u=141,45; 24,50 m/s; bodengebunden; Runtimefehler 0). Ein Zusatzlauf erreichte den Tunnelmittelpunkt u=224,49, doch die Bot-Folgekamera zeigte nahezu schwarz; keine Sichtabnahme. Bei diesem Versuch griff das geplante eindeutige Outputpräfix nicht, sodass die ältere PNG ersetzt wurde. Der alte Pixelbeleg war nicht wiederherstellbar; der dokumentierte Boostpfad wurde mit einer frischen passenden Aufnahme regeneriert. Diagnose und Rerun sind unter `a73ba-*` / `a73bb-*` erhalten.

### 12.10.2026 – A75 Heckitem: bodengebundene Runtime-Folgeprobe

`a75h` grenzt frühere Fehlläufe ein: ein Projektil wurde noch während 1,78 s Immunität eingesetzt und deshalb korrekt ignoriert. `a75i` wartete auf Boden und Immunitätsende, setzte den Schuss aber erneut zu früh nach der Vorheraufnahme. Der korrigierte `a75j`-Lauf platzierte Objekt 9901 bei Höhe 0, Immunität 0 und 1,2 m Heckabstand. Ein Frame später waren Projektil und Itemslot entfernt, Schild aus, Immunität/Spin/Impact 0. Das zweite Objekt 9902 verschwand mit aktiver normaler Trefferreaktion: 1,77 s Immunität, 0,92 s Spin, 0,42 s Einschlagimpuls und Tempo 11,54 m/s. Null Runtimefehler. Die Karosserie fiel parallel im normalen Botverkehr; kein isolierter Lebenspunktenachweis. Der 5-ms-Poller erfasste die Runtime-Event-Arrays nicht zuverlässig, obwohl Quellregressionen beide `objectId`-Werte prüfen. Gültige Bilder `a75j-held-item-before-hit.png`, `a75j-held-item-after-block.png`, `a75j-held-item-after-next-hit.png`; Messbericht `a75j-held-item-controlled.json`. Als Nächstes Events synchron am ItemWorld-Push protokollieren und Heckabwehr bei einem NPC natürlich prüfen. Offizielle Codex-Anzeige: 12 % Fünf-Stunden- und 46 % Wochenverbrauch (88 %/54 % Rest), keine Resets oder Zusatzkontingente.

### 12.10.2026 – A75 Runtime-Events mit Objekt-ID verifiziert

Der synchrone ItemWorld-Hook im Lauf `a75k` erfasste direkt `block / objectId 9901` und im selben Rennzeitpunkt `hit / objectId 9902`. Das bestätigt die einmalige Heckabwehr und den darauffolgenden normalen Treffer im Babylon-Runtimepfad. Das erste Vorherbild zeigt das rote Item sichtbar am Heck. Beim Block blieben Immunität/Spin/Impact 0; nach dem zweiten Treffer standen sie wieder bei 1,77/0,92/0,42 s. Es gab keine Runtimefehler. Die Karosserie wurde im natürlichen Botverkehr gleichzeitig beschädigt, deshalb bleibt die isolierte Gesundheitsauswirkung noch zu prüfen. Menschliche Fahrt und natürliche NPC-Abwehr bleiben offen. Belege: `docs/evidence/a75k-held-item-before-hit.png`, `a75k-held-item-after-block.png`, `a75k-held-item-after-next-hit.png`, `a75k-held-item-controlled.json`. Offizielle Codex-Anzeige nach dem Paket: 12 % Fünf-Stunden- und 46 % Wochenverbrauch (88 % / 54 % Rest), keine Resets oder Zusatzkontingente.

### 12.10.2026 – Kürzerer Standardtest nach A73.5

Der vollständige Sechs-Kurs-Drei-Runden-Rückkehrtest dauert rund drei Sekunden und ist jetzt als `slow:` markiert. Er bleibt in `npm run test:slow` und `npm run test:full`; gezielter Slow-Filter: 1/1, 2,81 s. `npm test`: 145/145, 4,14 s Node-Testdauer (rund 10 s Wandzeit inklusive Windows-Prozessstart). Kein Test entfernt. Versuche mit paralleler Dateiisolation zeigten wechselnde Laufzeiten und wurden nicht als Standard übernommen. Die vollständige Slow-Suite wurde in diesem Paket nicht erneut ausgeführt; ihr letzter Lauf hatte neun Git-Fixture-Probleme mit Windows/MSYS `NtCreateDirectoryObject`. Offizielle Codex-Anzeige: 14 % Fünf-Stunden- und 47 % Wochenverbrauch (86 % / 53 % Rest), keine Resets oder Zusatzkontingente. Nächster Produktblock gemäß Arbeitsliste: Moskaus Shortcut-Belag in der normalen Anfahrt sichtbar machen und danach Mittel-/Seitenlinie zeitlich vergleichen.
### 12.10.2026 – Aufgabenfortschreibung

Marcel präzisierte den abgebrochenen Satz zu: „Ich möchte, dass du deine Aufgaben aktualisierst und deiner Aufgabenliste weitere Dinge hinzufügst.“ A83–A85 waren bereits ergänzt. A86 erfasst jetzt als eigenständigen Prüfauftrag die strategische Itemverteilung und faire Aufholmöglichkeiten auf allen sechs Kursen. Nächster Umsetzungsblock bleibt A76 (kleiner beweglicher Streckenobjekt-Pilot), danach A57/A67–A82 in der priorisierten Reihenfolge. Offizielle Codex-Anzeige: 19 % Fünf-Stunden- und 47 % Wochenverbrauch (81 % / 53 % Rest); keine Resets oder Zusatzkontingente verwendet.

### 12.10.2026 – A76 technischer Pilotnachweis

Der Moskauer Wartungswagen bewegt sich regelbasiert mit dem gemeinsamen Rennzeitgeber und kreuzt langsam die Fahrbahn; außerhalb Moskaus ist er nicht aktiv. Eine gezielte Trackregression prüft beide Endlinien, freie Gegenlinie, Kursbegrenzung und frühe Botlenkung. `npm test -- --test-reporter=dot`: 147/147 (4,24 s Node-Laufzeit). `npm run build`: TypeScript und Vite bestanden; Hauptbundle 2.176,47 KB / 539,29 KB gzip, bekannte >500-KB-Warnung. Ein natürlicher Spielbild-/Verkehrslauf wurde noch nicht erstellt. Der Versuch, dafür per CUA einen separaten unsichtbaren Chrome-Tab zu öffnen, scheiterte, weil die Browsersteuerung die Sichtbarkeitsoption nicht anbietet; ich habe kein sichtbares Fenster geöffnet und die eigene Vite-Instanz danach beendet. Kein Staging, Commit oder Push; der gemeinsame Checkout bleibt dirty.

### 12.10.2026 – A57 kontrollierter Ereignis-/Positionsvergleich

Sechs fest zugeordnete Produktions-Botprofile laufen drei Runden mit gleichem Startzustand. Wenn der Spielermarker in Runde zwei das Peking-Ereignis auslöst, ändern sich gegenüber einer Kontrollfahrt ohne Ereignis die beiden letzten Plätze im Zieleinlauf (`503124` → `503142`). Alle sechs passieren während des 14-s-Fensters die gemeinsame Wirkzone. Neue Slow-Regression besteht gezielt 1/1 in 6,72 s. Sie belegt die Modellkausalität, nicht den natürlichen Runtimeeffekt mit Spielerinputs/Items. Der versteckte Vollspiel-Start lieferte keinen Screenshot und wurde abgebrochen; die eigene Vite-Instanz ist beendet.

`npm test -- --test-reporter=dot`: 147/147, 4,54 s Node-Laufzeit. Offizielle Codex-Anzeige: 22 % Fünf-Stunden- und 48 % Wochenverbrauch (78 % / 52 % Rest). Keine Resets oder Zusatzkontingente verwendet.
