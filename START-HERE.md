# Diktator Kart – gemeinsamer Einstieg

> **Aktueller Ablauf (09.10.2026):** Maßgeblich sind nur die vier Hauptdateien. Jeder Auftrag und sein Fortschritt werden als Markdown-Arbeitseintrag geführt. GitHub dient ausschließlich der Versionierung/Sicherung auf `main`; dort werden keine Aufgaben-Issues, Boards oder Status gepflegt. Frühere Hinweise in dieser Einstiegsdatei und in verlinkten Ablauf-/Fortschrittsdokumenten sind historisch.

> **Historische Hinweise:** Seit 09.10.2026 gelten Aufgaben, Status und Fortschritt ausschließlich in den vier Hauptdateien. Frühere Logs und Abschnittsverweise weiter unten sind historische Quellen und keine aktuellen Statusangaben.


## Kurzbefehle

**Sichtbare Pakete brauchen aktuelle Laufzeitbilder als Abnahme:** sinnvolle Vorher-/Nachher-Zwischenstände unter vergleichbaren Bedingungen, nicht ein Bild für jede Kleinigkeit. Vorhandene Aufnahmen erst zeitlich und anhand des geladenen Commit-Stands einordnen. Bei langen Tests die eigene Rechnerlast prüfen und nur eigene ungenutzte Prüfläufe stoppen. Ältere Ablaufdokumente sind historische Referenzen.

**Arbeitslisten abarbeiten:** Erst offene kurzfristige Aufgaben aus CURRENT-WORKLIST.md umsetzen, anschließend selbstständig bestätigte Ziele aus LONG-TERM-GOALS.md in prüfbaren Paketen fortsetzen. Langzeitpaket jeweils in die aktuelle Liste übernehmen; Fortschritt, Blocker und nächsten Schritt zeigen. Budget-/Freigaberegeln bleiben gültig. Beispiel: **„Projektstart. Danach arbeite unsere Arbeitslisten ab: zuerst kurzfristig, dann langfristig.“** Projektstart allein synchronisiert und zeigt den Stand.

Die Kurzbefehle **Projektstart** oder **Projekt Start** rufen den sicheren Startablauf auf; **Projektabschluss**, **Projektende** oder **Projekt Ende** den geprüften Abschluss mit Sicherung auf `main`. Keine langen Prompts nötig. Die vier zentralen Tabs gehören zum Start. Eine angehängte Aufgabe nach der Synchronisierung ausführen; ohne Auftrag Stand/Nächstes anzeigen. Maßgebliche Anleitung: [TEAM-NOTES.md](TEAM-NOTES.md).

**Git im Alltag:** Marcel und Sarah können in eigenen lokalen Checkouts auch parallel arbeiten. Vor jedem Push den neuesten `main` holen. Wenn jemand inzwischen voraus ist, zuerst beide Änderungen zusammenführen und Konflikte prüfen; ein normaler Push überschreibt nichts und wird bei veraltetem Stand abgewiesen. Dann erneut synchronisieren und mergen. Niemals Force-Push verwenden. Die aktuell aktive PR-/Statuscheck-Regel muss noch angepasst werden, bevor direkte Pushes auf `main` funktionieren.

**GitHub – nur für die Sicherung:** Die vier Markdown-Hauptdateien führen Aufgaben, Ideen und Fortschritt. Es werden keine neuen GitHub-Issues angelegt und keine bestehenden dort fortgeschrieben. Keine Boards, Pull-Request- oder Actions-Codeprüfung. Lokale Prüfung geschieht bei Bedarf in VS Code oder ChatGPT/Codex.

- **Projekt Start:** neuesten `main` holen und lokale Arbeit sicher synchronisieren.
- **Zwischenstand sichern:** vier Dateien aktualisieren, sinnvolles Paket committen und nach `main` sichern.
- **Projektabschluss:** Aufgaben abschließen, passend lokal prüfen und Stand nach `main` sichern.
- **Wo stehen wir?:** Status und nächsten Schritt anzeigen lassen.

Diktierte Wünsche selbstständig in die passende Arbeitsdatei eintragen: „Heute möchte ich …“ in CURRENT-WORKLIST.md, „Langfristiges Ziel: …“ in LONG-TERM-GOALS.md, „Notiere: …“ und „Nachricht an Sarah/Marcel: …“ in TEAM-NOTES.md (Datum, Autor, Zielperson, Status). Nutzer müssen Dateien nicht selbst schreiben. Beim Projektstart offene Notizen und für den Nutzer bestimmte Teamnachrichten kurz anzeigen; Empfang/Antwort nicht erfinden.

## Gemeinsame Budgetregel für autonome Arbeit

Gilt für Marcel und Sarah automatisch beim Projektstart und während ausdrücklich beauftragter autonomer Arbeit. Zu Beginn und nach jedem größeren Paket die offiziellen Codex-Werte des aktuellen Kontos für Fünf-Stunden- und Wochenlimit prüfen, sofern verfügbar (get_usage_limits oder tatsächliche Usage-Anzeige). Maßgeblich ist der kleinere Restwert. Es gelten Sarahs eigene Kontowerte, nicht Marcels letzte Zahlen. Kontextgröße und geschätzte Tokens sind kein Planlimit; keine Prozentwerte erfinden.

Bei ungefähr **15 % Rest** in einem der beiden Limits keine neue große Aufgabe anfangen. Laufende Änderung fertigstellen, wichtigste Prüfungen/Spielbelege sichern, vier Hauptdateien aktualisieren und lokalen Git-Checkpoint erstellen. Einen bereits autorisierten Projektabschluss rechtzeitig durchführen. Mit dem Ziel stoppen, **mindestens etwa 5 % Rest** für eigene Nutzernachrichten zu lassen. Checkpoints regelmäßig bereits während der Arbeit sichern.

Wenn echte Werte nicht abrufbar sind, dies früh sagen, höchstens einmal nach den angezeigten Werten fragen und vorsichtigen Abschluss-Puffer nutzen. Keine Zusatzkontingente aktivieren, keine Resets oder kostenpflichtigen Dienste auslösen. Bei unerwarteter Sperre beim nächsten Kontakt ehrlich gesicherten und ungesicherten Stand nennen. Diese Regel garantiert keinen exakten Restwert; Prüfung und Abschluss brauchen selbst Kontingent.

## Aktuelle Projektbasis – 06.10.2026

Marcels Fragebogen und [aktives Grundgerüst](docs/23-project-design-baseline.md) bestimmen die initiale Produktbasis; Sarahs eigene Antworten ergänzen sie separat und sind kein Blocker. Sarah beim Projektstart auf [ihren Fragebogen](PROJECT-QUESTIONNAIRE.md) hinweisen. Der aktuelle priorisierte Umsetzungsauftrag steht in [docs/24-claude-overnight-master-prompt.md](docs/24-claude-overnight-master-prompt.md).

## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Nur die vier Hauptdateien werden als laufende Projektsteuerung gepflegt. Ältere Fortschrittslogs und Detaildokumente bleiben historisch.

## Jetzt verbindlich

**Ein Arbeitsordner:** Alles (Batch, ChatGPT-App, Claude-App, Git) im Hauptordner; Claude ohne Worktree starten. Frühere Anleitungen zu Branches, Pull Requests und Reviews sind historisch.

**Aktiver Stand:** neuer Babylon-Q2d-Stand auf GitHub main, Ursprung Claude c13d47e. Das bisherige Hauptspiel und alle Altarchive sind ausschließlich historische Referenzen: nicht bearbeiten, nicht starten, nicht automatisch migrieren. Technische Kennzeichnung in project-state.json.

**Arbeitsbeginn in Codex:**

    Projektstart. Synchronisiere unseren gemeinsamen Babylon-Stand und sichere lokale Arbeit. Danach: [Aufgabe].

**Arbeitsende in Codex:**

    Projektabschluss. Prüfe, dokumentiere und veröffentliche meine Änderungen im gemeinsamen main.

Für eine sichere Zwischenablage während der Arbeit reicht **„Zwischenstand sichern.“** Die KI aktualisiert die vier Hauptdateien, prüft den Diff und sichert den Commit auf `main`, sofern GitHub dies zulässt.

Die Repo-Skills heißen $diktator-projektstart und $diktator-projektabschluss. Alternativ: Projekt-starten.cmd / Projekt-abschliessen.cmd. Bei Konflikten oder ungesicherten Dateien hilft die KI; die Batches überschreiben nichts blind.

**Spiel starten:** Diktator-Kart-starten.cmd im aktiven Hauptordner. Es öffnet den ausgecheckten neuen Stand, keinen fest eingetragenen Worktree. Root-/Versionsprüfung verhindert die Wiederverwendung eines fremden/alten Servers; angezeigte URL verwenden. Abhängigkeiten werden aus dem Lockfile installiert. Fenster offen lassen.

**Bedienung:** Enter Fahrerwahl/Rennen (←/→ oder 1–6 Figur wählen); Menü auch „Zeitfahren mit Geist“; E halten = Item als Schild, loslassen = werfen; bei Rohrpost und Suchauftrag: E+V nach vorn, E+H nach hinten; Space in der Luft = Trick; T = Rennen sofort neu; Optionen: Grafik Basis/Standard/Hoch, Auto-Gas, Lenkhilfe, Gegner leicht/mittel/schwer; W/S Gas/Bremse/Rückwärts, A/D Lenken, Space Hop/Drift/Turbo, E Item, Q Fähigkeit (Hitler: „Größenbefehl“, Kim: „Propaganda-Sieg“), Optionen → Wetter Zufall/Sonne/Regen/Schnee, F Foto, V Sprachhupe, C drei Kameras, linke Maustaste halten zum Umsehen, rechte Maustaste/X halten Rückblick, E Items, Mausrad Zoom; B langsame Rücksetzung, P Pause, R Szenenneustart, Esc Menü, F3 Diagnose.

**Historischer Stand (nicht laufend gepflegt):** Claude-Stand und frühere Abnahmen sind in alten Fortschrittsnotizen festgehalten. Neue Aufgaben, Status und Prüfergebnisse stehen ausschließlich in den vier Hauptdateien.

**Früher Ladebildschirm umgesetzt:** Eigenständiges G/J-inspiriertes Konzeptmotiv erscheint bereits vor dem Spielmodul, mit echten Ladeabschnitten und Wiederholen bei Startfehlern. Danach übernimmt das gerenderte 3D-Menü. Die Illustration ist ausdrücklich keine Spielgrafik-Abnahme; Quellen/Belege in art-source/loading-stadium-v1.md und docs/evidence/.

## Historie

Frühere Einstiege, Meilensteintabellen und M2-Fahrcheck: [docs/history/start-here-bis-teamumstellung.md](docs/history/start-here-bis-teamumstellung.md).
