# AGENTS.md – Arbeitsregeln für Diktator Kart: Babylon-Neustart

## Ein Arbeitsordner, ein Stand – gilt für ChatGPT/Codex und Claude

1. Gearbeitet, gestartet, committet und gepusht wird nur im Hauptordner des Repositorys (Marcel: `D:\Diktator-Kart`). Die Batch `Diktator-Kart-starten.cmd` startet genau diesen Ordner.
2. Vor jeder Änderung: `git status` und `git log -1` prüfen; mit `git fetch origin` und dem Projektstart-Ablauf auf den neuesten gemeinsamen Stand bringen. Nie auf älteren Dateien weiterarbeiten.
3. Nach jeder abgeschlossenen Teilaufgabe committen, damit die nächste App denselben Stand sieht. Uncommittete fremde Änderungen nicht überschreiben, sondern zuerst sichern/committen.
4. Immer nur eine KI arbeitet gleichzeitig im Ordner. Die nächste beginnt erst, wenn die vorige committet hat.
5. Auch Claude arbeitet direkt im Hauptordner, ohne Worktree. Der frühere Claude-Worktree wurde am 04.10.2026 entfernt.

## Kurzbefehle

**Arbeitslisten abarbeiten:** Dieser Auftrag autorisiert die Umsetzung beider Listen: zuerst ausführbare offene Aufgaben aus CURRENT-WORKLIST.md, danach selbstständig bestätigte Ziele aus LONG-TERM-GOALS.md in priorisierten, prüfbaren Paketen. Gewähltes Langzeitpaket vor Beginn in CURRENT-WORKLIST.md aufnehmen, Status/Nächster Schritt sichtbar halten, prüfen und dokumentieren. Nicht nach der kurzen Liste bei bloßen Vorschlägen stoppen. Blockierte Aufgaben kennzeichnen und an unabhängigen Punkten weiterarbeiten; nur bei echter Nutzerentscheidung fragen. Unbestätigte Vorschläge/Sarah-Änderungen bleiben bestätigungspflichtig. Budgetregel, aktueller Nutzerauftrag und Umfangsbeschränkungen gelten weiter. Projektstart allein startet keinen unbegrenzten Arbeitslauf.

Die Kurzbefehle **Projektstart** oder **Projekt Start** rufen den sicheren Startablauf auf; **Projektabschluss**, **Projektende** oder **Projekt Ende** den geprüften Abschluss mit Veröffentlichung. Keine langen Prompts nötig. Die vier zentralen Tabs gehören zum Start. Eine angehängte Aufgabe nach der Synchronisierung ausführen; ohne Auftrag Stand/Naechstes anzeigen. Maßgebliche Anleitung: [TEAM-NOTES.md](TEAM-NOTES.md).

Diktierte Wünsche selbstständig in die passende Arbeitsdatei eintragen: „Heute möchte ich …“ in CURRENT-WORKLIST.md, „Langfristiges Ziel: …“ in LONG-TERM-GOALS.md, „Notiere: …“ und „Nachricht an Sarah/Marcel: …“ in TEAM-NOTES.md (Datum, Autor, Zielperson, Status). Nutzer müssen Dateien nicht selbst schreiben. Beim Projektstart offene Notizen und für den Nutzer bestimmte Teamnachrichten kurz anzeigen; Empfang/Antwort nicht erfinden.

## Gemeinsame Budgetregel für autonome Arbeit

Gilt für Marcel und Sarah automatisch beim Projektstart und während ausdrücklich beauftragter autonomer Arbeit. Zu Beginn und nach jedem größeren Paket die offiziellen Codex-Werte des aktuellen Kontos für Fünf-Stunden- und Wochenlimit prüfen, sofern verfügbar (get_usage_limits oder tatsächliche Usage-Anzeige). Maßgeblich ist der kleinere Restwert. Es gelten Sarahs eigene Kontowerte, nicht Marcels letzte Zahlen. Kontextgröße und geschätzte Tokens sind kein Planlimit; keine Prozentwerte erfinden.

Bei ungefähr **15 % Rest** in einem der beiden Limits keine neue große Aufgabe anfangen. Laufende Änderung fertigstellen, wichtigste Prüfungen/Spielbelege sichern, vier Arbeitsdateien und PROGRESS-LOG.md aktualisieren und lokalen Git-Checkpoint erstellen. Einen bereits autorisierten Teamabschluss rechtzeitig durchführen; Upload nur mit entsprechender Freigabe, keine Budgetregel als zusätzliche Push-Erlaubnis auslegen. Mit dem Ziel stoppen, **mindestens etwa 5 % Rest** für eigene Nutzernachrichten zu lassen. Checkpoints regelmäßig bereits während der Arbeit sichern.

Wenn echte Werte nicht abrufbar sind, dies früh sagen, höchstens einmal nach den angezeigten Werten fragen und vorsichtigen Abschluss-Puffer nutzen. Keine Zusatzkontingente aktivieren, keine Resets oder kostenpflichtigen Dienste auslösen. Bei unerwarteter Sperre beim nächsten Kontakt ehrlich gesicherten und ungesicherten Stand nennen. Diese Regel garantiert keinen exakten Restwert; Prüfung und Abschluss brauchen selbst Kontingent.

## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

## Zweck

Dieser Ordner ist die neue Projekt- und Wissensbasis für die Babylon.js-Neuentwicklung von Diktator Kart. Er enthält jetzt den aktiven Babylon-Spiel-Checkout samt Produktionsquellen. Die Dokumente sollen Entscheidungen verständlich, prüfbar und über mehrere Arbeitssitzungen hinweg konsistent halten.

## Verbindliche aktive Basis und Teamablauf (03.10.2026)

- Ausschließlich die neue Babylon-Hauptbasis von origin/main in marceldamm/diktator-kart entwickeln. Aktive Verzeichnisse: src/, public/, art-source/; Kennzeichnung und Mindestabstammung in project-state.json.
- Alte PlayCanvas-Checkouts, Diktator-Kart-Legacy/, Legacy/, archive/* und Stände vor der gemeinsamen Babylon-Basis sind unveränderliche historische Referenzen. Dort nicht entwickeln, starten oder veröffentlichen. Änderungen ausschließlich am neuen Projekt. Keine automatische Übernahme alten Engine-Codes.
- Vor Arbeitsbeginn Projektstart: neuesten GitHub-Stand holen, lokale Arbeit sichern, Überschneidungen vergleichen und aktuelle Babylon-Änderungen integrieren. Altcode zuerst archivieren, anschließend auf neuer Basis arbeiten. Details: docs/21-team-workflow.md.
- Projektabschluss autorisiert nach Dokumentation/Prüfung die sichere Veröffentlichung des Arbeitsbranches und des zusammengeführten neuen main. Kein erneutes Nachfragen für diesen ausdrücklich beauftragten Ablauf. Kein Force-Push, keine Umgehung von Branchschutz, keine blinde Konfliktauswahl. Alte pauschale „kein Push/Merge“-Sitzungsregeln sind für diesen neuen Teamabschluss überholt.
- Fehlende Zugänge, echte widersprüchliche Kreativentscheidungen und ungelöste Konflikte konkret melden; Arbeit erhalten. Keine Aktualität oder Veröffentlichung behaupten, die nicht geprüft wurde.

## Umgang mit dem Altprojekt

- Das alte Projekt außerhalb dieses Ordners bleibt unverändert und wird nur als Referenz gelesen.
- Aus dem Altprojekt dürfen Ideen, Figuren, Items, Satire-Konzepte, Streckenideen, Designentscheidungen und belegte Beobachtungen übernommen werden.
- Alte Engine-, Szenen-, Physik-, Build- und Codeentscheidungen dürfen nicht blind übernommen werden.
- Babylon.js ist für die Neuentwicklung gesetzt. Eine Rückkehr zu PlayCanvas oder eine technische Migration des alten Codes ist nicht das Ziel.
- Aussagen über den alten Stand müssen als „belegt“, „aus Dokumentation übernommen“ oder „noch zu prüfen“ erkennbar bleiben.

## Proaktive Arbeitsweise der KI

Die KI soll nicht nur direkte Anweisungen ausführen, sondern aktiv mitdenken:

1. Sie prüft vor jeder größeren Änderung die Grundpfeiler in `README.md` und die betroffenen Detaildokumente.
2. Sie erkennt Widersprüche, fehlende Entscheidungen, unrealistische Annahmen und fehlende Abnahmekriterien selbstständig.
3. Sie ergänzt wichtige Fragen, wenn eine Entscheidung für Qualität, Performance, Umfang oder Machbarkeit fehlt.
4. Sie hält die zentrale Hauptdatei und die Detaildateien synchron. Änderungen an einem Grundpfeiler lösen eine Prüfung aller abhängigen Dokumente aus.
5. Sie trennt verbindliche Entscheidungen, Vorschläge, offene Fragen und verifizierte Ergebnisse klar.
6. Sie senkt Qualitäts- oder Performanceziele nicht stillschweigend ab. Ein Ziel darf nur nach bewusster Entscheidung geändert werden.
7. Sie benennt Blocker konkret, arbeitet an unabhängigen Punkten weiter und fragt nur dann nach, wenn eine echte Nutzerentscheidung nötig ist.
8. Sie behauptet niemals, etwas getestet, gesehen, gehört oder umgesetzt zu haben, wenn dafür kein Beleg vorliegt.

## Dokumentationspflege

- Verbindlicher Arbeitsordner auf diesem PC ist `D:\Diktator-Kart`. Das neue Projekt liegt direkt dort; `Diktator-Kart-Legacy/` ist ausschließlich Altarchiv. Der ChatGPT-Projektspiegel ist keine zweite aktive Projektbasis.
- Für den Babylon-Neustart gelten eigene Arbeitsbranches und der geprüfte Teamabschluss aus docs/21-team-workflow.md. Die ausdrückliche Abschlussanweisung autorisiert die Übernahme; keine ungeprüften direkten Änderungen an main.
- Derzeit nur vorhandene oder kostenlose Werkzeuge und Assets einsetzen; keine Käufe, kostenpflichtigen Dienste oder zusätzlichen Abonnements voraussetzen.
- Änderungen an Sarahs ursprünglichen Ideen als Vorschlag mit Originalidee und Begründung dokumentieren; erst nach gemeinsamer Bestätigung durch beide als beschlossen behandeln. Unklare Herkunft ehrlich kennzeichnen.
- Die bestätigten 15 Designentscheidungen aus `docs/10-open-questions.md` nicht erneut als unbeantwortete Grundsatzfragen stellen. Technische Detailentscheidungen und vorläufige Balancewerte selbstständig begründet treffen.

- `README.md` ist die kurze Quelle der Grundpfeiler und verweist auf Details.
- `docs/` enthält die ausformulierten Fachentscheidungen.
- `references/visuals/` enthält künftige Nutzerbilder für die Art Direction; Bilder werden nicht automatisch als technische Anforderungen interpretiert.
- Bei jeder Änderung eines Grundpfeilers sind mindestens `docs/09-roadmap.md`, `docs/10-open-questions.md` und alle im Grundpfeiler genannten abhängigen Dokumente zu prüfen.
- Neue Entscheidungen kommen in `docs/12-decision-log.md` mit Datum, Begründung und betroffenen Dokumenten.

## Reihenfolge vor der eigentlichen Entwicklung

Zuerst die priorisierte Checkliste in `docs/10-open-questions.md` gemeinsam bearbeiten. Erst danach technische Prototypen, Assetproduktion und eigentliche Spielentwicklung beginnen. Die Roadmap in `docs/09-roadmap.md` ist die Arbeitsreihenfolge, kein Freibrief, offene Grundsatzfragen zu überspringen.

## Beginn und Ende längerer Arbeitssitzungen

- `START-HERE.md` ist die operative Einstiegsdatei für den Nutzer und jede neue Arbeitssitzung.
- `TEAM-HANDBOOK.md` erklärt dir und Sarah Modellwahl, Work/Codex-Nutzung, Berechtigungen und GitHub-Zusammenarbeit.
- Zu Beginn `README.md`, `docs/00-project-framework.md`, `docs/16-production-blueprint.md` und `PROGRESS-LOG.md` lesen.
- Eine Sitzung arbeitet auf einen benannten Meilenstein oder eine klar abgegrenzte Aufgabe hin.
- Am Ende müssen verifizierte Ergebnisse, nicht verifizierte Annahmen, geänderte Dateien, offene Probleme und der nächste Schritt in `PROGRESS-LOG.md` stehen.
- Das empfohlene Modell wird nach Aufgabenrisiko gewählt: Luna für Routine, Sol für zusammenhängende Architektur/Kernsysteme, Astra für schwierige Gesamtanalysen und festgefahrene Probleme.
- Längere autonome Arbeit darf nicht stillschweigend den Umfang erweitern. Neue Ideen kommen zunächst in die Wissensbasis und werden erst nach Abgleich mit den Grundpfeilern geplant.
