# Verbindlicher Einstieg fuer Claude Code

Lies vor jeder Aenderung `AGENTS.md`, `START-HERE.md`, `PROGRESS-LOG.md` und fuer Git-Abgleich `docs/21-team-workflow.md`. Diese Dateien gelten auch fuer Claude.

Das aktive Spiel ist ausschliesslich der Babylon-Neustart im Repository-Hauptverzeichnis (`src/`, `public/`, `art-source/`, `project-state.json`). Der Stand vor der gemeinsamen Babylon-Hauptbasis sowie `Diktator-Kart-Legacy/`, `Legacy/`, `archive/*` und alte PlayCanvas-Checkouts sind unveraenderliche historische Referenzen. Dort nicht entwickeln, starten oder deren Engine-Code in das neue Spiel migrieren.

Bei `Projektstart` fuehre den dort dokumentierten Team-Startablauf aus. Bei `Projektabschluss` pruefe, dokumentiere und publiziere nach demselben Ablauf. Explizite Nutzeranweisungen haben Vorrang. Kein pauschales Ueberschreiben von Konflikten, kein Force-Push, keine automatische Altcode-Migration.
## Ein Arbeitsordner, ein Stand – gilt für ChatGPT/Codex und Claude

1. Gearbeitet, gestartet, committet und gepusht wird nur im Hauptordner des Repositorys (Marcel: `D:\Diktator-Kart`). Die Batch `Diktator-Kart-starten.cmd` startet genau diesen Ordner.
2. Vor jeder Änderung: `git status` und `git log -1` prüfen; mit `git fetch origin` und dem Projektstart-Ablauf auf den neuesten gemeinsamen Stand bringen. Nie auf älteren Dateien weiterarbeiten.
3. Nach jeder abgeschlossenen Teilaufgabe committen, damit die nächste App denselben Stand sieht. Uncommittete fremde Änderungen nicht überschreiben, sondern zuerst sichern/committen.
4. Immer nur eine KI arbeitet gleichzeitig im Ordner. Die nächste beginnt erst, wenn die vorige committet hat.
5. Claude ohne Worktree starten. Läuft eine Sitzung doch in `.claude/worktrees/…`, zuerst `git merge --ff-only` auf den Branch des Hauptordners, danach nach jedem Commit den Hauptordner per `git -C <Hauptordner> merge --ff-only <worktree-branch>` nachziehen und nur gegen den Batch-Server testen (Vite ignoriert `.claude/`).

