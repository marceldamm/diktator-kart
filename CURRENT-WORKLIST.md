# CURRENT WORKLIST – laufende Arbeit

**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsame kurzfristige Aufgaben für Marcel und Sarah. Nur die neue Babylon-Basis bearbeiten. Die KI aktualisiert Status während der Arbeit; Prüfdetails stehen im [technischen Fortschritt](PROGRESS-LOG.md). Neue Notizen aus TEAM-NOTES.md hier zuordnen, Zukunftsziele nach LONG-TERM-GOALS.md.

**Aktuell:** Panzerfähigkeit fertig; Abgleich der übrigen Archivfunktionen dokumentiert ([Abgleich](docs/sarah-feature-audit.md)); Dokumentation aufgeräumt.
**Danach:** Erkennbare historische Fahrer (zuerst Hitler) und nächster Grafikpass (Regen/Pfützen/Wolkenschatten); Bots mit Fähigkeiten; weitere Sarah-Fähigkeiten nach gemeinsamer Bestätigung.
**Arbeitsbranch:** codex/team-marcel-20261003-202647-623. Geprüfte Spielversion 2c6e92d nach main veröffentlicht; Arbeitsbranch bleibt erhalten.

## Offen und als Nächstes

**Abarbeitungsfolge:** Bei „Arbeitslisten abarbeiten“ zuerst die ausführbaren offenen Aufgaben hier umsetzen, anschließend bestätigte Ziele aus [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) selbstständig in diese Liste übernehmen und bearbeiten. Status und nächsten Schritt sichtbar halten; blockierte Aufgaben bewahren, unabhängige fortsetzen. Budget-/Entscheidungsregeln beachten.

- [ ] Historische Fahrer: erkennbare, realitätsnahe Abbilder, insbesondere Hitler; vorhandene neutralen Figuren ersetzen. Satirische Inszenierung, keine Regimezeichen. Kein fertiges 1:1-Modell behaupten.
- [ ] Sprachausgabe menschlich anhören: Verständlichkeit jedes Textes, freundlichere lebendige Sprecherin. Kürzere Texte und klarere Mischung umgesetzt; Hörabnahme steht aus.
- [ ] Historische Sprachhupen: echte unproblematische Mitschnitte mit belegter Person/Quelle und geklärten kostenlosen Nutzungsrechten. Aktuelle sechs Clips sind eigene synthetische Parodien.
- [x] Abschließender Teamabschluss (41 Tests und Build bestanden, GitHub main 2c6e92d verifiziert): Tests/Build, echte Spielbelege, vier Arbeitsdateien/PROGRESS-LOG.md aktualisieren, neuesten Teamstand integrieren, geprüft nach main veröffentlichen.

- [ ] Fünf weitere archivierte Fähigkeiten (Stalin, Mussolini, Mao, Kim, Castro) nach gemeinsamer Bestätigung umsetzen; heute bewusst nicht, da es keine Fahrerwahl gibt und die Wirkungen von den Katalogideen abweichen (siehe Abgleich).
- [ ] Bots: Fähigkeiten (z. B. Panzer für eine Bot-Figur) und saubere Ideallinie durch die Hinterhofgasse.

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
