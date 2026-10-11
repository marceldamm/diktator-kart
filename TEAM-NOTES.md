# TEAM NOTES – Notizen und gemeinsame Anleitung

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

`npm test` ist der schnelle Standardlauf (111/111, 6,4 s Wandzeit auf diesem Rechner). `npm run test:full` prüft alle Fälle (aktueller Stand 130/130, 85 s Node-Testdauer); nach Änderungen an Strecken, Bots, Fahrmodell oder Team-Workflow zusätzlich ausführen. `npm run test:slow` wurde am 11.10.2026 separat mit 17/17 bestanden (78,6 s). Keine Testfälle gelöscht; nur die drei Fünf-Bot-Rennen in Rom, Havanna und Pjöngjang beenden ihre Simulation nach dem Zieleinlauf aller Bots. Vorheriger ungeteilter `npm test`: 47 s Node-Testdauer, neun Git-Fixture-Fehler wegen Sandbox-Sperre `NtCreateDirectoryObject` im MSYS-Git-Unterprozess. Volltest und Langtest bestanden außerhalb dieser Sperre; kein Produktfehler aus den Sandbox-Fehlern ableiten. Kein Browser- oder Hörtest nötig, da die Testorganisation selbst keine Spielmechanik änderte.

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
