# AGENTS.md – Arbeitsregeln für Diktator Kart: Babylon-Neustart

## Ein Arbeitsordner, ein Stand – gilt für ChatGPT/Codex und Claude

1. Gearbeitet, gestartet, committet und gepusht wird nur im Hauptordner des Repositorys (Marcel: `D:\Diktator-Kart`). Die Batch `Diktator-Kart-starten.cmd` startet genau diesen Ordner.
2. Vor jeder Änderung: `git status` und `git log -1` prüfen; mit `git fetch origin` und dem Projektstart-Ablauf auf den neuesten gemeinsamen Stand bringen. Nie auf älteren Dateien weiterarbeiten.
3. Commits gestaffelt: nicht nach jeder kleinen Änderung committen. Nach sinnvollen Paketen, „Zwischenstand sichern“ und Projektabschluss die vier Hauptdateien aktualisieren, lokal committen und den gemeinsamen Stand nach `main` sichern. Vor Branchwechseln und riskanten Schritten ungesicherte Arbeit erhalten. GitHub-PR-, Review-, Board- und Actions-Dokumentation ist kein Arbeitsablauf.
4. Pro lokalem Checkout arbeitet nur eine KI gleichzeitig. Marcel und Sarah dürfen in eigenen Checkouts parallel arbeiten. Vor jedem Push neuesten `origin/main` holen und prüfen. Ist der lokale Commit dahinter, Änderungen durch Merge zusammenführen und Konflikte inhaltlich lösen; erst danach normal pushen. Ein abgewiesener Push bedeutet: neu synchronisieren und erneut zusammenführen. Niemals `--force`, Reset oder blinde Überschreibung zum Auflösen verwenden.
5. Auch Claude arbeitet direkt im Hauptordner, ohne Worktree. Der frühere Claude-Worktree wurde am 04.10.2026 entfernt.

## Kurzbefehle

**Arbeitslisten abarbeiten:** Dieser Auftrag autorisiert die Umsetzung beider Listen: zuerst ausführbare offene Aufgaben aus CURRENT-WORKLIST.md, danach selbstständig bestätigte Ziele aus LONG-TERM-GOALS.md in priorisierten, prüfbaren Paketen. Gewähltes Langzeitpaket vor Beginn in CURRENT-WORKLIST.md aufnehmen, Status/Nächster Schritt sichtbar halten, prüfen und dokumentieren. Nicht nach der kurzen Liste bei bloßen Vorschlägen stoppen. Blockierte Aufgaben kennzeichnen und an unabhängigen Punkten weiterarbeiten; nur bei echter Nutzerentscheidung fragen. Unbestätigte Vorschläge/Sarah-Änderungen bleiben bestätigungspflichtig. Budgetregel, aktueller Nutzerauftrag und Umfangsbeschränkungen gelten weiter. Projektstart allein startet keinen unbegrenzten Arbeitslauf.

Die Kurzbefehle **Projektstart/Projekt Start**, **Zwischenstand sichern** und **Projektabschluss/Projekt Ende** rufen Synchronisierung, Checkpoint bzw. geprüfte Sicherung des gemeinsamen Stands auf `main` auf. Eine angehängte Aufgabe nach der Synchronisierung ausführen; ohne Auftrag Stand/Nächstes anzeigen. Maßgebliche Kurzhilfe: [TEAM-NOTES.md](TEAM-NOTES.md).

Diktierte Wünsche selbstständig in die passende Arbeitsdatei eintragen: „Heute möchte ich …“ in CURRENT-WORKLIST.md, „Langfristiges Ziel: …“ in LONG-TERM-GOALS.md, „Notiere: …“ und „Nachricht an Sarah/Marcel: …“ in TEAM-NOTES.md (Datum, Autor, Zielperson, Status). Nutzer müssen Dateien nicht selbst schreiben. Beim Projektstart offene Notizen und für den Nutzer bestimmte Teamnachrichten kurz anzeigen; Empfang/Antwort nicht erfinden.

## Aufgaben, Markdown-Dokumentation und GitHub-Sicherung

- CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md sind die einzigen laufend gepflegten Projekt-, Aufgaben-, Ideen-, Entscheidungs- und Fortschrittsdokumente. Kein separates Fortschrittslog, Issue-Protokoll, Milestone oder Project-Board pflegen. Frühere Issues/Logs bleiben historische Quellen; relevante offene Inhalte daraus gehören in diese vier Dateien.
- Jeder klare, bestätigte Auftrag wird als Markdown-Arbeitseintrag in CURRENT-WORKLIST.md geführt; Zukunftsziele und unbestätigte Ideen gehören in LONG-TERM-GOALS.md. Keine neuen GitHub-Issues anlegen oder bestehende dort fortschreiben. Alte Issue-Nummern dienen ausschließlich als historische Herkunftsverweise.
- GitHub dient der Versionsicherung des Babylon-Projekts. Projektstart synchronisiert `origin/main`; Zwischenstand und Projektabschluss sichern sinnvolle Commits nach `main`. Das aktive Ruleset verlangt keinen PR und keinen Pflicht-Statuscheck; Force-Push- und Löschschutz bleiben an. Keine PRs, Reviews, Milestones, Projects oder GitHub Actions als Arbeitsablauf verwenden.
- Lokale Prüfungen in VS Code oder ChatGPT/Codex nur passend zur Änderung ausführen. Resultate, nicht ausgeführte Prüfungen und Grenzen knapp in einer der vier Hauptdateien festhalten. Keine automatischen GitHub-Workflows für Codeprüfung oder Build.
- Niemals Zugangsdaten oder private Informationen in öffentliche Commits aufnehmen.

## Gemeinsame Budgetregel für autonome Arbeit

Gilt für Marcel und Sarah automatisch beim Projektstart und während ausdrücklich beauftragter autonomer Arbeit. Zu Beginn und nach jedem größeren Paket die offiziellen Codex-Werte des aktuellen Kontos für Fünf-Stunden- und Wochenlimit prüfen, sofern verfügbar (get_usage_limits oder tatsächliche Usage-Anzeige). Maßgeblich ist der kleinere Restwert. Es gelten Sarahs eigene Kontowerte, nicht Marcels letzte Zahlen. Kontextgröße und geschätzte Tokens sind kein Planlimit; keine Prozentwerte erfinden.

Bei ungefähr **15 % Rest** in einem der beiden Limits keine neue große Aufgabe anfangen. Laufende Änderung fertigstellen, wichtigste Prüfungen/Spielbelege sichern, vier Hauptdateien aktualisieren und lokalen Git-Checkpoint erstellen. Einen bereits autorisierten Projektabschluss rechtzeitig durchführen. Mit dem Ziel stoppen, **mindestens etwa 5 % Rest** für eigene Nutzernachrichten zu lassen. Checkpoints regelmäßig bereits während der Arbeit sichern.

Wenn echte Werte nicht abrufbar sind, dies früh sagen, höchstens einmal nach den angezeigten Werten fragen und vorsichtigen Abschluss-Puffer nutzen. Keine Zusatzkontingente aktivieren, keine Resets oder kostenpflichtigen Dienste auslösen. Bei unerwarteter Sperre beim nächsten Kontakt ehrlich gesicherten und ungesicherten Stand nennen. Diese Regel garantiert keinen exakten Restwert; Prüfung und Abschluss brauchen selbst Kontingent.

## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Die vier gemeinsamen Arbeitsdateien sind die einzigen laufenden Projektprotokolle: CURRENT-WORKLIST.md für Aufträge, Status und Nächstes; LONG-TERM-GOALS.md für Ziele und Ideen; TEAM-CHANGES.md für wichtige bestätigte Änderungen; TEAM-NOTES.md für Anleitung, Notizen und kurze Prüfergebnisse. Fortschritte, Entscheidungen und Blocker gehören dorthin. PROGRESS-LOG.md und weitere Detailprotokolle bleiben historisch und werden nicht fortgeschrieben. Nach leerer aktueller Liste passende bestätigte Langzeitpakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Zweck

Dieser Ordner ist die neue Projekt- und Wissensbasis für die Babylon.js-Neuentwicklung von Diktator Kart. Er enthält jetzt den aktiven Babylon-Spiel-Checkout samt Produktionsquellen. Die Dokumente sollen Entscheidungen verständlich, prüfbar und über mehrere Arbeitssitzungen hinweg konsistent halten.

## Verbindliche aktive Basis und Teamablauf (03.10.2026)

- Ausschließlich die neue Babylon-Hauptbasis von origin/main in marceldamm/diktator-kart entwickeln. Aktive Verzeichnisse: src/, public/, art-source/; Kennzeichnung und Mindestabstammung in project-state.json.
- Alte PlayCanvas-Checkouts, Diktator-Kart-Legacy/, Legacy/, archive/* und Stände vor der gemeinsamen Babylon-Basis sind unveränderliche historische Referenzen. Dort nicht entwickeln, starten oder veröffentlichen. Änderungen ausschließlich am neuen Projekt. Keine automatische Übernahme alten Engine-Codes.
- Vor Arbeitsbeginn Projektstart: neuesten `origin/main` holen, lokale Arbeit sichern und aktuelle Babylon-Änderungen integrieren. Altcode zuerst archivieren, anschließend auf neuer Basis arbeiten. Die vier Hauptdateien und Repo-Skills enthalten den aktuellen Ablauf; docs/21-team-workflow.md ist historische Anleitung.
- Projektabschluss autorisiert die Sicherung des geprüften gemeinsamen Stands auf `main`; keine parallelen Arbeitsbranches. Bis die Main-Branch-Einstellung geändert ist, bei einer Ablehnung nichts umgehen und den lokalen Commit erhalten.
- Fehlende Zugänge, echte widersprüchliche Kreativentscheidungen und ungelöste Konflikte konkret melden; Arbeit erhalten. Keine Aktualität oder Veröffentlichung behaupten, die nicht geprüft wurde.

## Umgang mit dem Altprojekt

- Das alte Projekt außerhalb dieses Ordners bleibt unverändert und wird nur als Referenz gelesen.
- Aus dem Altprojekt dürfen Ideen, Figuren, Items, Satire-Konzepte, Streckenideen, Designentscheidungen und belegte Beobachtungen übernommen werden.
- Alte Engine-, Szenen-, Physik-, Build- und Codeentscheidungen dürfen nicht blind übernommen werden.
- Babylon.js ist für die Neuentwicklung gesetzt. Eine Rückkehr zu PlayCanvas oder eine technische Migration des alten Codes ist nicht das Ziel.
- Aussagen über den alten Stand müssen als „belegt“, „aus Dokumentation übernommen“ oder „noch zu prüfen“ erkennbar bleiben.

## Proaktive Arbeitsweise der KI

**Blender-Modellprüfung (Marcel, 07.10.2026, korrigierter Wunsch):** Modelländerungen bevorzugt im Hintergrund mit festen Front-, Dreiviertel-, Profil- und bei Bedarf Fahrer/Kart-Kontaktbildern prüfen und die einzelnen Bilder im Chat zeigen. Blender nicht automatisch im Vordergrund öffnen; Marcel hat diesen kurzzeitig gewünschten Ablauf ausdrücklich zurückgenommen. Fahrer und tatsächliches Fahrzeug für Kontaktbelege passend getrennt auswählen. Blender-Bilder sind Assetbelege; eine gezielte sichtbare Chrome-Prüfung bleibt für Runtime-Materialien, Animation und Integration nötig.

**Sichtbare Browserprüfung:** Wenn das Spiel in Google Chrome gestartet oder automatisiert geprüft wird, muss das Chrome-Fenster für Marcel/Sarah sichtbar bleiben, damit sie den geprüften Spielstand beobachten können. Keine Headless-Ausführung und kein verstecktes/minimiertes Testfenster. Ein eigenes CDP-Testprofil darf in einem separaten, sichtbaren Chrome-Fenster laufen. Nach der Prüfung den Spiel-Renderloop pausieren und ausschließlich die eigens gestartete Testinstanz schließen; normale Nutzerfenster nicht beenden. Prüfbilder und den tatsächlich sichtbaren Zustand dokumentieren.

Die KI soll nicht nur direkte Anweisungen ausführen, sondern aktiv mitdenken:

1. Sie prüft vor jeder größeren Änderung zuerst die vier Hauptdateien: CURRENT-WORKLIST.md (aktuelle Arbeit), LONG-TERM-GOALS.md (Ziele), TEAM-CHANGES.md (bestätigte Änderungen), TEAM-NOTES.md (Notizen/offene Punkte). Weitere Dokumente werden nicht als zusätzliche Aufgaben- oder Fortschrittssteuerung verwendet; Quellcode und technische Dateien liest sie nur, soweit die konkrete Umsetzung es erfordert.
2. Sie erkennt Widersprüche, fehlende Entscheidungen, unrealistische Annahmen und fehlende Abnahmekriterien selbstständig.
3. Sie ergänzt wichtige Fragen, wenn eine Entscheidung für Qualität, Performance, Umfang oder Machbarkeit fehlt.
4. Sie hält die vier Hauptdateien synchron. Der aktuelle Auftrag und Status werden ausschließlich dort nachgeführt. Technische Detaildokumente werden nur geändert, wenn der Auftrag eine konkrete technische Anleitung oder Referenz betrifft.
5. Sie trennt verbindliche Entscheidungen, Vorschläge, offene Fragen und verifizierte Ergebnisse klar.
6. Sie senkt Qualitäts- oder Performanceziele nicht stillschweigend ab. Ein Ziel darf nur nach bewusster Entscheidung geändert werden.
7. Sie benennt Blocker konkret, arbeitet an unabhängigen Punkten weiter und fragt nur dann nach, wenn eine echte Nutzerentscheidung nötig ist.
8. Sie behauptet niemals, etwas getestet, gesehen, gehört oder umgesetzt zu haben, wenn dafür kein Beleg vorliegt.
9. Sie prüft nach jedem größeren Paket den Fokus: Arbeitet sie noch am benannten sichtbaren/mechanischen Hauptziel oder verliert sie sich in einer Detailkorrektur? Detailarbeit wird nur fortgesetzt, wenn sie für Funktion, Lesbarkeit, Qualität oder Abnahme des Hauptziels nötig ist. Andernfalls wird sie notiert und das Hauptziel weitergeführt.
10. Sichtbare Laufzeitziele werden in sinnvollen Paket-Zwischenständen mit aktuellen Spielbildern belegt. Für einen Paketvergleich möglichst eine passende Vorher- und Nachher-Ansicht unter gleichen Spiel-/Kamerabedingungen sichern; nicht für jede Kleinigkeit einen Screenshot erzeugen. Tests/Build allein sind keine visuelle Abnahme.
11. Vor einer Bildbewertung vorhandene Belege sichten und zeitlich einordnen: Änderungsdatum, Dateiname/Eintrag, dargestellte Szene und zugehörigen Branch-/Commit-/Runtime-Stand prüfen. Ältere Bilder bleiben historische Vergleiche und dürfen nicht als aktueller Spielstand ausgegeben werden. Bei Unsicherheit einen neuen Laufzeitbeleg aus der tatsächlich aktuellen sichtbaren Chrome-Sitzung erstellen oder die Bildaussage als ungeprüft kennzeichnen.
12. Bei längeren Browser-, Blender- oder Build-Arbeiten Auslastung in sinnvollen Abständen und nach auffälligen Verzögerungen kontrollieren. Hohe CPU-/Speicherlast einem Prozess/Tab und der eigenen Prüfinstanz zuordnen, bevor gehandelt wird. Eigene Prüfläufe pausieren/beenden, wenn sie nicht gebraucht werden; Nutzerfenster, fremde Prozesse und Server ohne eindeutige Eigentümerschaft nicht schließen.
13. Die historischen Fragebögen und das Projektgrundgerüst können bei einer konkreten Rückfrage als Referenz dienen. Sie sind keine zusätzlichen Starttabs oder laufenden Aufgabenlisten. Sarahs ursprüngliche Ideen werden bei Bedarf kenntlich erhalten; ausdrückliche aktuelle Nutzerentscheidungen haben Vorrang.

## Dokumentationspflege

- Verbindlicher Arbeitsordner auf diesem PC ist `D:\Diktator-Kart`. Das neue Projekt liegt direkt dort; `Diktator-Kart-Legacy/` ist ausschließlich Altarchiv. Der ChatGPT-Projektspiegel ist keine zweite aktive Projektbasis.
- Für die aktuelle Zusammenarbeit gilt ausschließlich der vereinfachte Ablauf in den vier Hauptdateien und den Repo-Skills: nacheinander auf dem gemeinsamen `main`, mit geprüftem Commit und Sicherung. Ältere Branch-/PR-Anweisungen in Detaildokumenten sind historisch.
- Derzeit nur vorhandene oder kostenlose Werkzeuge und Assets einsetzen; keine Käufe, kostenpflichtigen Dienste oder zusätzlichen Abonnements voraussetzen.
- Änderungen an Sarahs ursprünglichen Ideen als Vorschlag mit Originalidee und Begründung in den vier Hauptdateien dokumentieren; erst nach gemeinsamer Bestätigung durch beide als beschlossen behandeln. Unklare Herkunft ehrlich kennzeichnen.

- Die vier Hauptdateien sind die einzige laufend gepflegte Steuerung für Aufträge, Ziele, bestätigte Änderungen und Notizen. Ältere Fach- und Fortschrittsdokumente bleiben historische Referenzen.
- `references/visuals/` enthält künftige Nutzerbilder für die Art Direction; Bilder werden nicht automatisch als technische Anforderungen interpretiert.
- Bei Änderungen an einem Grundpfeiler werden die vier Hauptdateien aktualisiert. Ältere Detaildokumente werden nur bei konkretem Bedarf geändert und gelten nicht als laufende Projektlisten.
- Neue Entscheidungen und ihre Begründung kommen mit Datum in die passende der vier Hauptdateien.
- Laufzeitbilder und Vergleichsbedingungen werden bei passenden Aufgaben als Belege gesichert; ältere Prozessdokumente sind dafür keine aktive Arbeitsanweisung.

## Reihenfolge vor der eigentlichen Entwicklung

Die aktuelle Arbeitsreihenfolge ergibt sich aus CURRENT-WORKLIST.md und den bestätigten Zielen in LONG-TERM-GOALS.md. Ältere Checklisten und Roadmaps sind historische Quellen und blockieren ausdrücklich beauftragte Arbeit nicht.

## Beginn und Ende längerer Arbeitssitzungen

- `START-HERE.md` ist die operative Einstiegsdatei für den Nutzer und jede neue Arbeitssitzung.
- `TEAM-HANDBOOK.md` ist ein historischer Leitfaden; bei Widersprüchen gelten die vier Hauptdateien und Repo-Skills.
- Zu Beginn die vier Hauptdateien lesen; weitere Dateien nur öffnen, wenn die konkrete Aufgabe sie benötigt.
- Eine Sitzung arbeitet auf einen benannten Meilenstein oder eine klar abgegrenzte Aufgabe hin.
- Am Ende müssen verifizierte Ergebnisse, offene Punkte und der nächste Schritt in den vier Hauptdateien stehen. `PROGRESS-LOG.md` bleibt historisch.
- Das empfohlene Modell wird nach Aufgabenrisiko gewählt: Luna für Routine, Sol für zusammenhängende Architektur/Kernsysteme, Astra für schwierige Gesamtanalysen und festgefahrene Probleme.
- Längere autonome Arbeit darf nicht stillschweigend den Umfang erweitern. Neue Ideen kommen zunächst in die Wissensbasis und werden erst nach Abgleich mit den Grundpfeilern geplant.
