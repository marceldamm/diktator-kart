---
name: diktator-projektabschluss
description: Pruefe und dokumentiere Diktator-Kart-Aenderungen, integriere den neuesten Teamstand und veroeffentliche den getesteten Babylon-Stand nach GitHub main. Verwenden beim ausdruecklichen Projektabschluss oder Auftrag zum Hochladen und Zusammenfuehren dieses Projekts.
---

# Diktator Kart: Projektabschluss

Schon der alleinstehende entsprechende Kurzbefehl startet diesen Ablauf. TEAM-NOTES.md ist die gemeinsame Anleitung; offene Nutzer-Notizen lesen, Herkunft bewahren und der passenden Arbeitsliste zuordnen.

Vor dem Commit CURRENT-WORKLIST.md mit erledigten/geprueften und offenen Aufgaben samt naechstem Schritt aktualisieren; erreichte/geaenderte langfristige Ziele in LONG-TERM-GOALS.md abgleichen. Nur elementare Nutzerentscheidungen und sichtbare Funktionsaenderungen kurz in TEAM-CHANGES.md aufnehmen. TEAM-NOTES.md erhaelt die Nutzer-Notizen; zugeordnete/abgeschlossene Notizen mit Verweisen kennzeichnen, nicht mit Technikprotokollen fuellen. Technische Belege bleiben in PROGRESS-LOG.md. Alle vier Dateien zusammen mit dem getesteten Spielstand synchronisieren und veroeffentlichen.

Lies AGENTS.md und docs/21-team-workflow.md. Ein ausdrueckliches Projektabschluss / veroeffentliche meinen Stand autorisiert lokalen Commit, Branch-Push und getestete Integration nach main in marceldamm/diktator-kart. Bestehende Nutzerfreigabe nicht erneut erfragen; die Invokation erweitert keine Berechtigung auf andere Repositories, Force-Push, alte Engine-Migration oder Verwerfen fremder Arbeit.

1. Pruefe Repository/Branch/Abstammung mit project-state.json und git. Archive/Legacy/alte Hauptbasis niemals veroeffentlichen. Bei Arbeit versehentlich auf main erst eigenen Babylon-Arbeitsbranch anlegen.
2. Pruefe den Diff und relevante Aenderungen. Aktualisiere PROGRESS-LOG.md mit wirklich verifizierten Ergebnissen, Annahmen, Dateien, Problemen und naechstem Schritt. Halte betroffene Grundpfeiler und Quellen/Lizenzen konsistent. Fuehre erforderliche Browserprobe bei Spiel-/Starteraenderungen aus; keine erfundene Abnahme. Bestaetige, dass Laufzeitassets und editierbare Quellen enthalten, Tools/Worktrees/Geheimnisse ausgeschlossen sind.
3. Committe funktionierende Arbeit lokal. Hole neuesten origin/main, vergleiche Aenderungen und integriere beide Seiten normal. Bei Konflikten loese deren Ursache; kein pauschales ours/theirs. Modelle brauchen Quellenvergleich/Neu-Export. Forsche nicht im Altprojekt nach Ersatzcode. Bei echter widerspruechlicher Nutzer-/Kreativentscheidung beide Staende sichern und Entscheidung erfragen.
4. Fuehre scripts/team-workflow.ps1 -Action Finish aus. Es sichert, integriert, prueft Unit-Tests/Build, pusht den Arbeitsbranch und main nur als Fast-Forward. Falls main waehrenddessen fortschreitet, erneut integrieren und pruefen; maximal drei automatische Integrationsversuche, danach beide Staende sichern und den konkreten Parallelkonflikt melden. Kein Force-Push. Bei Branchschutz PR statt Umgehung; erstellte PR in Codex anhaengen, sofern das Werkzeug verfuegbar ist.
5. Pruefe durch erneutes Abrufen, dass der eigene Commit auf main enthalten ist. Aktualisiere lokales main nur per Fast-Forward, falls es nicht in einem anderen Worktree aktiv ist; erhalte den Arbeitsbranch. Berichte klar: Commit, Branch, GitHub-Ergebnis, Tests, offene Punkte, Startweg. Bei Sperre/Netzfehler lokales Gesichertes und Nicht-Hochgeladenes unterscheiden.

Keinen fertigen Teamabschluss behaupten, wenn nur der lokale Commit oder der Arbeitsbranch hochgeladen wurde. Keine alten Archivbranches bearbeiten. Der naechste Arbeitsabend beginnt wieder mit Projektstart.
