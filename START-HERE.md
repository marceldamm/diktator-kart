# Diktator Kart – gemeinsamer Einstieg

## Kurzbefehle

**Arbeitslisten abarbeiten:** Erst offene kurzfristige Aufgaben aus CURRENT-WORKLIST.md umsetzen, anschließend selbstständig bestätigte Ziele aus LONG-TERM-GOALS.md in prüfbaren Paketen fortsetzen. Langzeitpaket jeweils in die aktuelle Liste übernehmen; Fortschritt, Blocker und nächsten Schritt zeigen. Budget-/Freigaberegeln bleiben gültig. Beispiel: **„Projektstart. Danach arbeite unsere Arbeitslisten ab: zuerst kurzfristig, dann langfristig.“** Projektstart allein synchronisiert und zeigt den Stand.

Die Kurzbefehle **Projektstart** oder **Projekt Start** rufen den sicheren Startablauf auf; **Projektabschluss**, **Projektende** oder **Projekt Ende** den geprüften Abschluss mit Veröffentlichung. Keine langen Prompts nötig. Die vier zentralen Tabs gehören zum Start. Eine angehängte Aufgabe nach der Synchronisierung ausführen; ohne Auftrag Stand/Naechstes anzeigen. Maßgebliche Anleitung: [TEAM-NOTES.md](TEAM-NOTES.md).

Diktierte Wünsche selbstständig in die passende Arbeitsdatei eintragen: „Heute möchte ich …“ in CURRENT-WORKLIST.md, „Langfristiges Ziel: …“ in LONG-TERM-GOALS.md, „Notiere: …“ und „Nachricht an Sarah/Marcel: …“ in TEAM-NOTES.md (Datum, Autor, Zielperson, Status). Nutzer müssen Dateien nicht selbst schreiben. Beim Projektstart offene Notizen und für den Nutzer bestimmte Teamnachrichten kurz anzeigen; Empfang/Antwort nicht erfinden.

## Gemeinsame Budgetregel für autonome Arbeit

Gilt für Marcel und Sarah automatisch beim Projektstart und während ausdrücklich beauftragter autonomer Arbeit. Zu Beginn und nach jedem größeren Paket die offiziellen Codex-Werte des aktuellen Kontos für Fünf-Stunden- und Wochenlimit prüfen, sofern verfügbar (get_usage_limits oder tatsächliche Usage-Anzeige). Maßgeblich ist der kleinere Restwert. Es gelten Sarahs eigene Kontowerte, nicht Marcels letzte Zahlen. Kontextgröße und geschätzte Tokens sind kein Planlimit; keine Prozentwerte erfinden.

Bei ungefähr **15 % Rest** in einem der beiden Limits keine neue große Aufgabe anfangen. Laufende Änderung fertigstellen, wichtigste Prüfungen/Spielbelege sichern, vier Arbeitsdateien und PROGRESS-LOG.md aktualisieren und lokalen Git-Checkpoint erstellen. Einen bereits autorisierten Teamabschluss rechtzeitig durchführen; Upload nur mit entsprechender Freigabe, keine Budgetregel als zusätzliche Push-Erlaubnis auslegen. Mit dem Ziel stoppen, **mindestens etwa 5 % Rest** für eigene Nutzernachrichten zu lassen. Checkpoints regelmäßig bereits während der Arbeit sichern.

Wenn echte Werte nicht abrufbar sind, dies früh sagen, höchstens einmal nach den angezeigten Werten fragen und vorsichtigen Abschluss-Puffer nutzen. Keine Zusatzkontingente aktivieren, keine Resets oder kostenpflichtigen Dienste auslösen. Bei unerwarteter Sperre beim nächsten Kontakt ehrlich gesicherten und ungesicherten Stand nennen. Diese Regel garantiert keinen exakten Restwert; Prüfung und Abschluss brauchen selbst Kontingent.

## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Jetzt verbindlich

**Ein Arbeitsordner:** Alles (Batch, ChatGPT-App, Claude-App, Git) im Hauptordner; Claude ohne Worktree starten. Details: [docs/21-team-workflow.md](docs/21-team-workflow.md).

**Aktiver Stand:** neuer Babylon-Q2d-Stand auf GitHub main, Ursprung Claude c13d47e. Das bisherige Hauptspiel und alle Altarchive sind ausschließlich historische Referenzen: nicht bearbeiten, nicht starten, nicht automatisch migrieren. Technische Kennzeichnung in project-state.json.

**Arbeitsbeginn in Codex:**

    Projektstart. Synchronisiere unseren gemeinsamen Babylon-Stand und sichere lokale Arbeit. Danach: [Aufgabe].

**Arbeitsende in Codex:**

    Projektabschluss. Prüfe, dokumentiere und veröffentliche meine Änderungen im gemeinsamen main.

Die Repo-Skills heißen $diktator-projektstart und $diktator-projektabschluss. Alternativ: Projekt-starten.cmd / Projekt-abschliessen.cmd. Bei Konflikten oder ungesicherten Dateien hilft die KI; die Batches überschreiben nichts blind. Regeln, GitHub-Sicherungen und Sarahs einmaliger Umstieg: [docs/21-team-workflow.md](docs/21-team-workflow.md).

**Spiel starten:** Diktator-Kart-starten.cmd im aktiven Hauptordner. Es öffnet den ausgecheckten neuen Stand, keinen fest eingetragenen Worktree. Root-/Versionsprüfung verhindert die Wiederverwendung eines fremden/alten Servers; angezeigte URL verwenden. Abhängigkeiten werden aus dem Lockfile installiert. Fenster offen lassen.

**Bedienung:** Enter Fahrerwahl/Rennen (←/→ Figur wählen); W/S Gas/Bremse/Rückwärts, A/D Lenken, Space Hop/Drift/Turbo, E Item, Q Fähigkeit (Panzer „Größenbefehl“), Optionen → Wetter Sonne/Regen, F Sprachhupe, C drei Kameras, linke Maustaste halten zum Umsehen, rechte Maustaste/X halten Rückblick, E Items, Mausrad Zoom; V Foto, B langsame Rücksetzung, P Pause, R Szenenneustart, Esc Menü, F3 Diagnose.

**Claude-Stand:** 593-m-Kurs, neue Welt/Karts/sechs fiktive Fahrer, Bot-Drift, Hinterhof-Abkürzung, Stimmen/Publikum, Lenkträgheit und gefederte Karosserie, Rüttelrandsteine, Live-Videowand. Vorliegende Tests und verbleibende Qualitäts-/Gerätegrenzen: [Fortschrittslog](PROGRESS-LOG.md). Kein fertiger historischer Kader und keine G–L-Abnahme. Regen/nasse Straße/echtere Fahrer sind nächste Produktionswünsche, keine bereits gebauten Features. Seit 04.10.: Sarahs Panzerfähigkeit „Größenbefehl“ auf Q (nur Hitler, auch als Bot). Seit 04.10. abends: Fahrerwahl vor jedem Grand Prix mit den sechs Karikaturen (Hitler, Stalin, Mussolini, Mao, Kim Jong-un, Castro), eigene Wurfobjekte je Figur, eigener deutscher Marsch, Ziel-Feuerwerk.

**Früher Ladebildschirm umgesetzt:** Eigenständiges G/J-inspiriertes Konzeptmotiv erscheint bereits vor dem Spielmodul, mit echten Ladeabschnitten und Wiederholen bei Startfehlern. Danach übernimmt das gerenderte 3D-Menü. Die Illustration ist ausdrücklich keine Spielgrafik-Abnahme; Quellen/Belege in art-source/loading-stadium-v1.md und docs/evidence/.

## Historie

Frühere Einstiege, Meilensteintabellen und M2-Fahrcheck: [docs/history/start-here-bis-teamumstellung.md](docs/history/start-here-bis-teamumstellung.md).
