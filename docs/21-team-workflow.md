# Gemeinsamer Arbeitsablauf fuer Marcel und Sarah

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

Verbindlich seit 03.10.2026, ausdruecklicher Nutzerauftrag. Ziel: dieselbe neue Babylon-Hauptbasis, sichere Zusammenarbeit und KI-Hilfe bei Git-Konflikten.

## Ein Arbeitsordner für alle – verbindlich seit 04.10.2026

Spiel, Batch, ChatGPT-/Codex-App und Claude-App arbeiten ausschließlich im Hauptordner des Repositorys (bei Marcel `D:\Diktator-Kart`, bei Sarah ihr eigener Repository-Ordner). Auch Claude arbeitet direkt in diesem Hauptordner (keine Worktrees; der frühere Claude-Worktree wurde am 04.10.2026 entfernt). Getestet wird gegen den Server von `Diktator-Kart-starten.cmd`. Nie zwei KIs gleichzeitig im selben Ordner arbeiten lassen.

## Welche Version gilt?

- `origin/main` im Repository **marceldamm/diktator-kart** ist die gemeinsame, gepruefte Babylon-Version.
- Die initiale Hauptbasis uebernimmt Claudes vollstaendigen Q2d-Stand `c13d47e` (inklusive Q2/Q2b/Q2c) plus Starter/Teamablauf. Ausgangsbranch: `claude/diktator-kart-quality-level-f851c0`.
- `project-state.json` kennzeichnet das aktive Spiel; `minimumSourceCommit` sichert die Abstammung von diesem Claude-Stand. Keine zweite aktive Projektbasis.
- `Diktator-Kart-Legacy/`, `Legacy/`, alte PlayCanvas-Checkouts, `archive/*` und Stände vor der gemeinsamen Babylon-Basis sind **nur historische Referenzen**. Keine Entwicklung, kein Spielstart, kein Push als aktuelles Spiel. Keine automatische Uebernahme ihres Engine-Codes.
- Der lokale Ordner darf auf Sarahs PC einen anderen Pfad haben. Skripte beziehen sich auf ihren eigenen Repository-Hauptordner, niemals auf Marcels absoluten Pfad oder einen fest verdrahteten Claude-Worktree.

## Die zwei KI-Befehle

Im Codex-Projekt sagen oder tippen:

```text
Projektstart. Synchronisiere unseren gemeinsamen Babylon-Stand und sichere vorhandene lokale Arbeit. Danach: [meine Aufgabe].
```

Alternativ `$diktator-projektstart`, sofern die Repo-Skills in Codex geladen sind. Der Skill liegt in `.agents/skills/diktator-projektstart/` und kommt mit GitHub zu beiden PCs.

Am Ende:

```text
Projektabschluss. Pruefe, dokumentiere und veroeffentliche meine Aenderungen im gemeinsamen main.
```

Fuer eine Sicherung mitten in der Arbeit reicht **„Zwischenstand sichern.“** Alternativ `Projekt-zwischenstand.cmd` starten. Dieser Befehl legt einen Commit an und laedt ausschliesslich den persoenlichen Arbeitsbranch hoch; er veraendert `main` nicht. Die KI prueft vorher den Diff und dokumentiert den Zwischenstand.

Alternativ `$diktator-projektabschluss`. Dieser ausdrueckliche Abschlussauftrag autorisiert Branch-Push und die getestete Zusammenfuehrung nach main in diesem Repository. Die KI braucht dafuer keine wiederholte Freigabe. Force-Push, fremde Repositories, kostenpflichtige Dienste oder bewusstes Verwerfen fremder Arbeit sind nicht umfasst.

## Was beim Projektstart passiert

1. Repository, origin, Branch, Worktrees und ungesicherte Dateien pruefen. Keine parallelen Agenten im selben Checkout. Vorhandene aktive Git-Operationen zuerst klaeren.
2. `git fetch origin --prune`: aktuelle Daten holen, ohne lokale Arbeit zu ersetzen.
3. Gemeinsame Basis und seitdem geaenderte Dateien auf beiden Seiten vergleichen; Überschneidungen samt uncommitteten Dateien melden. Statusbericht in `.tools/team-status.json` (lokal/ignoriert).
4. Ungesicherte Arbeit **vor jedem Wechsel** bewahren: betroffene Dateien pruefen, insbesondere Geheimnisse/ignorierte Tools ausschliessen; benannten Sicherungsbranch/Checkpoint anlegen. Keine pauschalen Reset-/Clean-Befehle. Ein Stash ist nur mit eindeutiger Zuordnung und dokumentierter Rueckholung ausreichend; Altcode-Stashes nicht auf das neue Projekt anwenden.
5. Falls der lokale Stand vor der neuen Babylon-Basis liegt: vollstaendig als Archiv sichern; neuen Arbeitsbranch auf `origin/main` beginnen. Alte technische Aenderungen werden nicht automatisch migriert. Ideen/Inhalte bei Bedarf als Herkunft-markierten Vorschlag in den neuen Dokumenten bewahren.
6. Aktuelle Babylon-Arbeit: neuesten main normal zusammenfuehren. Bei Konflikten analysiert die KI beide Intentionen und integriert sie. Kein globales `ours/theirs`, keine blinde Auswahl einer Datei. Binaere .blend/GLB-/Audio-/Bildkonflikte brauchen Quellen-/Versionsvergleich; Assets nach Moeglichkeit aus der gewaelten Quelle neu exportieren. Bei echter Kreativentscheidung Nutzer fragen.
7. Auf eigenem `codex/team-<person>-<zeit>`-Branch arbeiten; Fortschrittslog und relevante Dokumente lesen. Veraenderte Abhaengigkeiten/Assetvertraege/Settings bewusst migrieren und pruefen. Dann erst neue Entwicklung.

Die Batch `Projekt-starten.cmd` erledigt den einfachen Fall. Bei ungesicherten Dateien oder Konflikten stoppt sie mit erhaltenem Zustand und verweist auf den KI-Befehl. Sie kann keine inhaltliche Konfliktloesung selbst erfinden.

## Was beim Projektabschluss passiert

1. Arbeitsdiff pruefen, notwendige Tests/Browserprobe machen, beobachtete Ergebnisse dokumentieren. `PROGRESS-LOG.md` muss Ergebnisse, Annahmen, betroffene Dateien, Probleme und naechsten Schritt enthalten. Neue Quellen/Lizenzen dokumentieren.
2. Funktionierenden lokalen Commit erstellen; alle benoetigten Laufzeitassets und editierbaren Quellen einschliessen, keine .tools/node_modules/Worktrees oder Zugangsdaten.
3. Aktuellen main erneut holen und Aenderungen der anderen Person integrieren. Nach Konfliktloesung Tests erneut pruefen. Der Hauptstand bleibt bis zum erfolgreichen Abschluss erhalten.
4. `scripts/team-workflow.ps1 -Action Finish`: Sicherungsbranch, normaler Merge, Unit-Tests und Produktionsbuild. Arbeitsbranch auf GitHub sichern; dann **normaler Fast-Forward-Push** nach main. Kein Force-Push.
5. Bei gleichzeitigem Upload wird der veraltete Push abgewiesen. Neu holen, integrieren, erneut testen; keine Umgehung. Bei Branchschutz stattdessen Pull Request erstellen und geltende Freigaben abwarten. Erfolg erst nach Ruecklesen des GitHub-main melden.

Die Batch `Projekt-abschliessen.cmd` kann einen bereits dokumentierten, committeten Stand pruefen und publizieren. Sie committed keine ungesicherten Dateien blind. Fuer eine bewusste Sicherung zwischendurch ist `Projekt-zwischenstand.cmd` da: Codex **„Zwischenstand sichern“** sagen, damit die KI Dateien/Geheimnisse prueft und erst dann den Checkpoint ausfuehrt. Der Befehl sichert nur auf dem persoenlichen Branch und pusht nie nach `main`. Bei einem Fehler beauftragt ihr Codex mit `Projektabschluss` beziehungsweise `Zwischenstand sichern`.

### Git in drei einfachen Begriffen

- **`main`** ist die gemeinsame, getestete Version.
- Ein **Arbeitsbranch** ist Marcels oder Sarahs getrennte Arbeitslinie. Beide beginnen nach `Projekt Start` auf dem aktuellen Stand und bearbeiten nicht gleichzeitig denselben Branch.
- Ein **Commit** ist ein gespeicherter Stand. **„Zwischenstand sichern“** legt ihn lokal an und sichert den Branch auf GitHub; **„Projektabschluss“** integriert beide Arbeitslinien, löst Konflikte fachlich, prüft Tests/Build und veröffentlicht nach `main`.

Git kombiniert unabhängige Änderungen automatisch. Bei Änderungen derselben Code-/Dokumentstelle stoppt der automatische Merge; die KI prüft beide Fassungen und führt sie zusammen, wenn die Absicht kompatibel ist. Eine unvereinbare Kreativentscheidung bleibt zur Klärung offen. `.blend`, GLB und andere Binärdateien kann Git nicht inhaltlich zusammensetzen: dieselbe Quelldatei nur nacheinander bearbeiten oder getrennte Varianten erhalten und später vergleichen.

## Spiel starten

`Diktator-Kart-starten.cmd` im **aktiven Repository-Hauptordner** doppelklicken. Es startet den dort ausgecheckten neuen Babylon-Stand; es synchronisiert Git nicht nebenbei.

### Browserprüfungen sichtbar durchführen

Wenn Codex das Spiel in Google Chrome startet oder per CDP prüft, bleibt ein echtes Chrome-Fenster sichtbar auf dem Spiel. Headless-, versteckte oder minimierte Fenster sind für diese Spielprüfungen ausgeschlossen. Für isolierte CDP-Läufe ein eigenes sichtbares Chrome-Fenster mit eigenem Debugging-Port/Profil nutzen und währenddessen offen lassen. Den Spiel-Renderloop nach dem Beleg pausieren; anschließend nur diese Testinstanz schließen, nie normale Nutzerfenster. Belegbilder müssen aus dem tatsächlich sichtbaren Lauf stammen.

Der Starter prueft Projektmarkierung/Abstammung und Archivbranch. Vite liefert unter `/__diktator/status` Root, Edition, Branch und Commit. Ein vorhandener Server wird nur fuer exakt denselben Checkout wiederverwendet. Ein alter oder fremder Server wird nicht beendet; der Starter waehlt einen freien lokalen Port (4173 bis 4192) und zeigt die richtige URL. Deshalb kann die URL von 4173 abweichen. Ein bereits laufender Produktionspreview muss nach Code-/Assetaenderungen neu gebaut/gestartet werden; fuer normale Arbeit den Dev-Starter verwenden.

## Laufzeitbilder als Abnahme und Arbeitssteuerung

Sichtbare Änderungen werden nicht nur anhand von Code, Tests oder Blender-Ansichten beurteilt. Wenn ein Paket die Darstellung oder das Spielgeschehen sichtbar ändern soll, gehört eine echte Aufnahme aus dem laufenden Babylon-Spiel zur Abnahme. Sie zeigt den relevanten Moment aus einer sichtbaren Chrome-Sitzung; Konzeptbilder, isolierte Blender-Render, Fahrerwahlkarten oder eine andere Testszene belegen diese Runtime-Wirkung nicht.

- **Paketstart:** Vor einer größeren sichtbaren Änderung eine passende aktuelle Ausgangsansicht sichern, falls sie die Wirkung später vergleichbar macht. Nicht eigens Screenshots für jede Kleinigkeit sammeln.
- **Zwischenstand/Abnahme:** Nach einem sinnvoll abgeschlossenen Paket den relevanten Spielzustand erneut aufnehmen. Für den Vergleich möglichst gleiche Fahrer, Strecke, Wetter, Kamera, Abstand, Viewport und Grafikeinstellung verwenden. Wenn Bewegung oder Kontakt das Ziel ist, einen Bildmoment bzw. eine kurze Folge aufnehmen, die genau diese Wirkung zeigt.
- **Aktualität belegen:** Vorhandene Bilder zunächst nach Dateidatum, Verzeichnis/README-Eintrag und Inhalt sichten. Dann den dazugehörigen Runtime-Stand über laufende URL und `/__diktator/status` (Checkout, Branch, Commit) oder einen gleichwertigen Buildnachweis prüfen. Das neueste Bild ist nicht automatisch der neueste Spielstand; Dateizeit allein ersetzt die Runtime-Identität nicht. Ältere Aufnahmen ausdrücklich als historisch/Vorher markieren. Ist keine aktuelle Aufnahme vorhanden, eine im aktuellen sichtbaren Spiel erstellen; andernfalls visuelle Abnahme offen lassen.
- **Knapp dokumentieren:** Pro Paket genügen normalerweise eine Vorher- und eine Nachheraufnahme oder ein kleiner, gezielter Satz von Ansichten. In `docs/evidence/README.md` je Aufnahme Zweck, Zeitpunkt/Stand, Szene und bekannte Grenzen eintragen; in `PROGRESS-LOG.md` die Abnahme, Vergleichsbedingungen und offene Einschränkungen nennen. Keine Ablage massenhafter ähnlicher Screenshots.
- **Selbstprüfung gegen Detaildrift:** Zu Beginn jedes Pakets ein sichtbares/spielbares Ergebnis und ein prüfbares Ende benennen. Nach jedem größeren Zwischenstand fragen: „Arbeite ich noch an diesem Ergebnis, und lässt sich der Fortschritt im Spiel sehen?“ Ein Detailpass ist nur gerechtfertigt, wenn er die Hauptwirkung, Bedienbarkeit, Funktion oder klare Abnahme ermöglicht. Sonst aufschreiben und zum priorisierten Ziel zurückkehren. Nach zwei erfolglosen Detailiterationen Aufwand begrenzen, Befund dokumentieren und die größere Wirkung oder einen anderen Engpass angehen.
- **Rechnerlast im Blick:** Bei langen Spiel-/CDP-/Blender-/Build-Läufen zu Beginn, nach langen Phasen und bei deutlicher Verlangsamung CPU, Arbeitsspeicher und relevante Prozesse/Chrome-Tabs prüfen. Hohe Gesamtauslastung ist noch kein Beweis, welcher Prozess sie verursacht. Wenn die eigene Testszene nicht betrachtet oder gemessen wird, Renderloop pausieren; nach Abschluss nur die eindeutig selbst gestartete Testinstanz schließen. Normale Nutzerfenster, fremde Prozesse und nicht eindeutig zugeordnete Server bleiben offen. Server nur beenden, wenn Checkout/Port/Prozess eindeutig zur eigenen Prüfinstanz gehören.

Das Belegverzeichnis führt aktuelle Aufnahmen und historische Vergleiche getrennt; maßgebliche Regeln und Beispiele stehen in [`docs/evidence/README.md`](evidence/README.md). Eine Laufzeitaufnahme bestätigt nur, was darauf tatsächlich sichtbar ist. Technische Tests, menschliche Qualitätsurteile und Geräteleistung bleiben getrennte Abnahmepunkte.

## Sarahs einmaliger Umstieg

Sarahs **auf GitHub vorhandener** bisheriger Hauptstand `e292070` ist als `archive/sarah-main-vor-babylon-2026-10-03` gesichert. Der Name folgt Marcels Auftrag; aus den Commitautoren kann nicht belegt werden, dass jeder Commit von Sarah stammt. Unveroeffentlichte Dateien auf Sarahs PC sind darin nicht enthalten.

Im vorhandenen Codex-Chat/Checkout einmal diesen Text verwenden (funktioniert auch, wenn die neuen Skills lokal noch fehlen):

```text
Stelle mein Diktator-Kart-Projekt auf den neuen gemeinsamen Babylon-main aus
https://github.com/marceldamm/diktator-kart.git um. Pruefe zuerst alle lokalen
Aenderungen und sichere sie samt bestehendem Commitstand auf einem benannten
Archivbranch. Ueberschreibe nichts. Hole origin/main und lies daraus zuerst
AGENTS.md, START-HERE.md und docs/21-team-workflow.md. Der bisherige Stand und
alte Engine-Code sind ab jetzt nur historische Referenzen und duerfen nicht
mehr bearbeitet oder automatisch migriert werden. Richte einen neuen
Arbeitsbranch auf dem aktuellen Babylon-main ein, installiere die
Lockfile-Abhaengigkeiten und pruefe den Spielstart. Danach fuehre Projektstart aus.
```

Alternativ einen neuen Klon in einem neuen Ordner anlegen und den alten Ordner unberuehrt archivieren. Erst GitHub-Synchronisierung/Startpruefung abschliessen, dann am neuen Spiel arbeiten. GitHub-Anmeldung und Schreibrecht fuer Sarah koennen nur auf ihrem PC/Konto bestaetigt werden.

## Initiale Umstellung und Archive

- `archive/sarah-main-vor-babylon-2026-10-03` → bisheriger GitHub-main `e292070`.
- `archive/lokaler-main-vor-babylon-2026-10-03` → Marcels abweichender lokaler main `2d95e8a`.
- `archive/claude-quality-2026-10-03` → Claudes letzter Stand `c13d47e`.

Die Archive wurden vor der Umstellung auf GitHub gesichert. Ein **einmaliger** Merge mit Strategie `ours` verknuepft die alte main-Historie mit Claudes vollstaendigem Baum; alte Spielinhalte werden dabei bewusst nicht uebernommen. Die Initialisierung loescht oder erzwingt keine Historie. Dieser Sonderfall gilt **nicht** fuer normale Team-Merges.

## Grenzen und Fehler

Netzwerk-/Loginfehler: lokalen Stand erhalten, fehlgeschlagene Synchronisierung melden, keinen aktuellen GitHub-Stand behaupten. Ungesicherte lokale Dateien: erst sichern. Konflikte: KI integrieren lassen. Alte Checkouts: Archiv und Umstieg, keine Entwicklung dort. Keine Behauptung, dass Markdown technisch jeden manuellen Eingriff verbietet; Regeln, Identitaetspruefung und Fast-Forward-Schutz sichern den vorgesehenen Ablauf.

Offizielle Repo-Skill-Einbindung: https://learn.chatgpt.com/docs/build-skills . Ein erneuter Codex-Start kann erforderlich sein, wenn neue Skills nicht erscheinen; der ausgeschriebene KI-Befehl bleibt nutzbar.

**Starter-Nachprüfung:** Die HTTP-Kennung enthält mode=dev/preview. Diktator-Kart-starten.cmd verwendet ausschließlich den aktuellen Entwicklungsserver desselben Checkouts; statische Produktionspreviews werden nicht wiederverwendet, weil dist älter als die Quellen sein kann. Alte Server ohne mode-Kennung bleiben unverändert und werden umgangen.

## Sarahs erster Umstieg mit Archiv-Push

Der einmalige Prompt in TEAM-NOTES.md autorisiert neben lokalem Erhalt auch die Veröffentlichung eines neu benannten Sarah-Archivbranches. Das normale Projektstart hat weiterhin keine allgemeine Push-Erlaubnis. Sarahs tatsächliche lokale Dateien müssen auf ihrem PC geprüft/gesichert werden; vorhandene Marcels Archivbranches ersetzen dies nicht. Geheimnisse/Tools/Abhängigkeiten nicht blind hochladen, benötigte ignorierte Dateien lokal bewahren. Archiv-SHA/Remote prüfen, anschließend origin/main als alleinige aktive neue Basis nutzen; alten Engine-Code nicht zusammenführen. Bisherige Ideen anhand belegter Quellen in die Wissensbasis aufnehmen, Archivverweis und Zusammenfassung in TEAM-NOTES.md. Bei Uploadgrenzen/fehlendem Zugang lokal erhalten und ehrlich berichten. Vor dem Start gilt die Budgetregel aus AGENTS.md für Sarahs eigenes Konto.
