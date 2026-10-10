# Gemeinsamer Arbeitsablauf fuer Marcel und Sarah

> **Historisch, durch Beschluss vom 09.10.2026 abgelöst:** Die folgenden Abschnitte beschreiben den früheren Issue-/Board-/PR-/Actions-Prozess und sind keine aktuellen Arbeitsanweisungen. Aktuell sind ausschließlich die vier Hauptdateien plus Repo-Skills: Aufgaben/Status/Fortschritt nur dort, GitHub nur zur Versionsicherung auf `main`. Issues dürfen höchstens Titel und einen Link zum Eintrag in CURRENT-WORKLIST.md enthalten. Keine Board-/Milestone-/PR-/Actions-Pflege. Zwischenstands- und Abschlussregeln siehe TEAM-NOTES.md.

## Blender-Modellprüfung mit Einzelbildern – 07.10.2026 (Marcel, korrigiert)

Feste Front-, Dreiviertel-, Profil- und bei Bedarf Sitzansichten unter gleichem Licht als Blender-Hintergrundrenderings erstellen und einzeln im Chat zeigen. Für Anatomie/Sitzkontakte den aktuellen Fahrer und das tatsächliche Runtime-Kart gemeinsam laden und übrige Varianten korrekt ausblenden. Blender nicht automatisch im Vordergrund öffnen: Marcel nahm den kurzzeitigen Vordergrundwunsch nach der überlagerten Editoransicht ausdrücklich zurück. Blender-Renderings als Assetbeleg kennzeichnen; eine gezielte sichtbare Chrome-Prüfung belegt anschließend Babylon-Materialien, Animation und Runtime-Integration. Eigene Prüfprozesse zuordnen; Nutzerfenster erhalten.

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Unsere vier Arbeitsdateien

Beim KI-Kurzbefehl Projektstart nach erfolgreicher Git-Synchronisierung CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md und TEAM-NOTES.md als vier Dateitabs in der Codex-Windows-App öffnen (open_in_codex, sofern verfügbar, absolute Pfade des aktiven Checkouts). Die Batch meldet die Dateien; das Öffnen übernimmt die KI. Fehlt das Werkzeug, anklickbare Links und diese Grenze nennen.

Die vier gemeinsamen Arbeitsdateien sind bei jedem Projektstart nach Git-Synchronisierung und beim Abschluss verbindlich: CURRENT-WORKLIST.md (laufende Aufträge, Aktuell/Nächster Schritt und Erledigt), LONG-TERM-GOALS.md (Gesamtziele und nächste Vorschläge), TEAM-CHANGES.md (wenige elementare Teamänderungen), TEAM-NOTES.md (gemeinsame Anleitung und persönliche Notizen mit Herkunft/Status). Neue konkrete Wünsche in CURRENT-WORKLIST.md, Zukunftsziele in LONG-TERM-GOALS.md; wichtige Änderungen kurz in TEAM-CHANGES.md. Notizen erhalten, offene Notizen zuordnen und Ergebnisse verlinken, keine Zustimmung erfinden. Technische Prüfbelege, Annahmen und Probleme bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem geprüften Spielstand pflegen und veröffentlichen. Nach leerer aktueller Liste passende langfristige Pakete vorschlagen; ausdrücklich beauftragte Ziele weiter umsetzen. Altes Projekt bleibt reine historische Referenz.

Verbindlich seit 03.10.2026, ausdruecklicher Nutzerauftrag. Ziel: dieselbe neue Babylon-Hauptbasis, sichere Zusammenarbeit und KI-Hilfe bei Git-Konflikten.

## Ein Arbeitsordner für alle – verbindlich seit 04.10.2026

Spiel, Batch, ChatGPT-/Codex-App und Claude-App arbeiten ausschließlich im Hauptordner des Repositorys (bei Marcel `D:\Diktator-Kart`, bei Sarah ihr eigener Repository-Ordner). Auch Claude arbeitet direkt in diesem Hauptordner (keine Worktrees; der frühere Claude-Worktree wurde am 04.10.2026 entfernt). Getestet wird gegen den Server von `Diktator-Kart-starten.cmd`.

**Parallel-KI-Regel (Marcel, 09.10.2026):** Die frühere Beschränkung auf eine KI pro Ordner ist aufgehoben. Mehrere KIs dürfen gleichzeitig im selben Checkout arbeiten; Marcel koordiniert ihre Aufgaben. Vor Änderungen Status/Diff prüfen und vorhandene Arbeit erhalten. Überlappende Dateien abstimmen, nur eigene Änderungen stagen und vor Veröffentlichung den Gesamtdiff prüfen. Index-, Commit- und Push-Schritte zeitlich nacheinander ausführen. Binäre Modellquellen nicht unbemerkt überschreiben; bei gleichzeitiger Bearbeitung Varianten getrennt halten.

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

Fuer eine Sicherung mitten in der Arbeit reicht **„Zwischenstand sichern.“** Die KI prueft den gemeinsamen Diff, dokumentiert den Stand und gibt dem Checkpoint nur die eigenen geprüften Pfade mit. Parallele Änderungen bleiben unstaged. Alle arbeiten im gemeinsamen Hauptordner und Checkout.

Alternativ `$diktator-projektabschluss`. Dieser ausdrueckliche Abschlussauftrag autorisiert Branch-Push und die getestete Zusammenfuehrung nach main in diesem Repository. Die KI braucht dafuer keine wiederholte Freigabe. Force-Push, fremde Repositories, kostenpflichtige Dienste oder bewusstes Verwerfen fremder Arbeit sind nicht umfasst.

## GitHub Issues, KI-Aufträge und Checks – 06.10.2026

Die vier Teamdateien bleiben die gemeinsame Quelle für Aufträge, bestätigte Ziele, Entscheidungen und Notizen. Bei jedem klaren, bestätigten konkreten Arbeitsauftrag wird automatisch ein Issue angelegt oder aktualisiert und in CURRENT-WORKLIST.md verlinkt. Die Formulare in `.github/ISSUE_TEMPLATE/` fragen Herkunft/Bestätigungsstatus, Ziel, Abnahmekriterien, Grenzen und Belegstatus ab. Mehrteilige bestätigte Vorhaben bekommen einen Milestone; offene Issues und PRs des Repositorys ergänzt das Project-Board automatisch. Neue Einträge starten im `Backlog`; PR-Karten werden für die Prüfung auf `In review` verschoben. Die aktive Board-Automation `Code changes requested` setzt PRs bei einer Review mit Änderungswünschen automatisch auf `In progress`. Unbestätigte Vorschläge kommen nicht als Coding-Agent-Auftrag hinein.

**Welche GitHub-Funktion wofür?** Ein **Issue** beschreibt einen konkreten Bug oder ein Arbeitspaket. Ein **Milestone** bündelt mehrere Issues und PRs zu einem überprüfbaren Lieferziel; ein Fälligkeitsdatum kommt nur hinein, wenn das Team eines festlegt. Ein **GitHub Project** bietet dazu eine gemeinsame Tabelle oder Tafel mit Status/Priorität über mehrere Issues hinweg. Ein **Pull Request (PR)** zeigt die tatsächliche Änderung als Diff zur Prüfung; er ändert `main` erst beim Zusammenführen. **Actions** führen die im Workflow festgelegten Befehle aus und zeigen Ergebnis/Fehler direkt am PR. Keine dieser Ansichten ersetzt die vier Markdown-Hauptdateien; sie verlinken auf sie.

Copilot Cloud Agent ist für das derzeit angemeldete Konto nicht verfügbar („access unavailable for plan“); keine automatische KI-Issuebearbeitung behaupten und kein Upgrade voraussetzen. Codex arbeitet die bestätigten Issues im angeschlossenen Repository weiter ab. Jede Änderung wird als PR verknüpft und von Actions sowie den nötigen menschlichen Spiel-/Stilabnahmen geprüft.

`.github/workflows/validate.yml` führt auf Pull Requests `npm ci`, `npm test` und `npm run build` aus; der zugehörige GitHub-Actions-Status heißt `tests-and-build` (PR-Anzeige `validate / tests-and-build`). Für Node 22 verwendet das Testskript `--experimental-test-isolation=none`. Ein fehlgeschlagener Check stoppt den Workflow; er belegt keine sichtbare oder menschliche Spiel-/Stilabnahme. Das aktive Ruleset `Require PR and passing CI on main` schützt den Default-Branch: Änderungen brauchen einen PR und grünes `tests-and-build`; Force-Push und Löschen sind gesperrt. Es ist keine zusätzliche Review-Stimme vorgeschrieben. Der PR bleibt bis zum ausdrücklichen Projektabschluss offen; Projektabschluss prüft den Diff, integriert den neuesten Stand und führt den grünen PR ohne Regelumgehung zusammen.

Der Pilot verwendet [Issue #2](https://github.com/marceldamm/diktator-kart/issues/2), [PR #1](https://github.com/marceldamm/diktator-kart/pull/1), [Milestone](https://github.com/marceldamm/diktator-kart/milestone/1) und das private [Project-Board](https://github.com/users/marceldamm/projects/1/views/1). PR #1 ist mit erfolgreichen Actions zusammengeführt. Das persönliche Repository ist öffentlich, das Project privat; der Teamzugriff für den Pilot ist eingerichtet. Der gemeinsame Praxistest ist noch offen. Konten- und Rollenangaben für das private Project gehören nicht in das öffentliche Repository.

## Aktueller Projektstart und parallele Arbeit – 09.10.2026

1. Mehrere Personen und KIs dürfen denselben Hauptordner und Checkout gleichzeitig bearbeiten. Vor Änderungen `git status`, `git diff` und laufende Git-Operationen prüfen. Bereits begonnene Arbeit bleibt erhalten.
2. Dateien/Teilaufgaben nach Möglichkeit kurz zuweisen. Auch dieselbe Datei darf parallel bearbeitet werden; vor dem Commit beide Änderungen im Gesamtdiff vergleichen. Bei echtem fachlichem Widerspruch Arbeit erhalten und nachfragen.
3. `origin/main` holen. Bei sauberer lokaler Arbeitskopie aktualisiert `Projektstart` ein lokales `main` per Fast-Forward. Bei uncommittierten Änderungen stoppt die Synchronisierung, ohne etwas zu wechseln oder zu überschreiben. Unabhängige Arbeit kann weiterlaufen; dieselbe Datei erst nach kurzem Abgleich bearbeiten und vor dem nächsten Sync die vorhandenen Änderungen mit den Beteiligten integrieren.
4. Alle Entwickler und KIs arbeiten im normalen Ablauf direkt auf `main`. Der Projektstart selbst committet oder pusht nicht. Kein Reset, Force-Push oder pauschales `ours/theirs`.
5. Gemeinsam auf dasselbe Git-Verzeichnis bedeutet: Stage-/Commit-/Push-Aktionen kurz abstimmen und nacheinander ausführen. Während ein Pfad gestaged/committet wird, diesen Pfad kurz nicht parallel verändern; unabhängige Dateien können weiterlaufen. Vor einem Commit nur eigene, vollständig geprüfte Pfade stagen. `Zwischenstand sichern` nutzt dafür `scripts/team-workflow.ps1 -Action Checkpoint -Paths <Datei> [weitere Dateien]`; ohne explizite Pfade oder bei bereits vorgemerkten Index-Dateien wird abgebrochen, statt fremde Änderungen mitzucommitten.
6. Bei neuen Remote-Commits Änderungen normal zusammenführen. Textkonflikte inhaltlich lösen und beide Intentionen erhalten. Blender-/GLB-/Audio-/Bilddateien können nicht textuell gemergt werden: Versionen/Quellen vergleichen und nötigenfalls als getrennte Varianten erhalten.

Die Batch `Projekt-starten.cmd` aktualisiert den sauberen lokalen Hauptstand. Bei parallelen uncommittierten Änderungen oder Konflikten stoppt sie mit erhaltenem Zustand; die KI gleicht die Inhalte ab und setzt danach fort.

## Aktueller Projektabschluss

1. Gesamtdiff prüfen, passende lokale Tests/Builds oder sichtbare Spielprobe ausführen und nur tatsächlich verifizierte Ergebnisse in den vier Hauptdateien festhalten. Quellen/Lizenzen für neue Assets dokumentieren.
2. Die eigene Änderung klar abgrenzen. Nur geprüfte und zugeordnete Dateien stagen; keine pauschale `git add -A`-Aktion bei paralleler Arbeit. Andere uncommittierte Änderungen bleiben erhalten.
3. Stage-/Commit-/Push-Schritte mit gleichzeitig arbeitenden KIs kurz koordinieren und nacheinander ausführen. Vor dem Push `origin/main` erneut holen, neue Commits normal integrieren und Konflikte inhaltlich lösen. Nach Konfliktlösung relevante Prüfungen wiederholen.
4. Auf `main` normal committen und pushen. Kein PR-/Actions-Prozess ist hierfür vorgesehen. Ein Push, der wegen neuer Remote-Arbeit abgelehnt wird, heißt: erneut holen, integrieren, prüfen und normal pushen.
5. Nach dem Push Remote-Commit abrufen und gegen lokalen Commit verifizieren. Bei Netzwerk-/Berechtigungsfehler den lokalen Commit erhalten und den Remote-Stand als noch nicht gesichert melden.

`Projekt-abschliessen.cmd` führt den dokumentierten Abschluss aus. `Projekt-zwischenstand.cmd` allein hat keine KI-gestützte Dateiauswahl; für parallele Änderungen zuerst die KI prüfen lassen und Checkpoint mit ausdrücklich benannten `-Paths` aufrufen.

### Git in drei einfachen Begriffen

- **`main`** ist die gemeinsame, getestete Version.
- Marcel, Sarah und KIs bearbeiten den gemeinsamen Checkout auf `main`; Dateien/Teilaufgaben werden nach Möglichkeit abgestimmt.
- Ein **Commit** ist ein gespeicherter Stand. „Zwischenstand sichern“ committet nur ausdrücklich geprüfte Pfade; der Abschluss integriert neue Remote-Commits, prüft passend und sichert normal nach `main`.

Git kombiniert unabhängige Änderungen automatisch. Bei Änderungen derselben Code-/Dokumentstelle stoppt der automatische Merge; die KI prüft beide Fassungen und führt sie zusammen, wenn die Absicht kompatibel ist. Eine unvereinbare Kreativentscheidung bleibt zur Klärung offen. `.blend`, GLB und andere Binärdateien kann Git nicht inhaltlich zusammensetzen: bei paralleler Bearbeitung Änderungen abstimmen oder getrennte Varianten erhalten und später vergleichen.

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
