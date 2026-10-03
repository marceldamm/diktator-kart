---
name: diktator-projektstart
description: Synchronisiere beim Diktator-Kart-Projektstart Marcels oder Sarahs lokale Arbeit mit dem gemeinsamen Babylon-main, sichere Altstaende und integriere parallele Aenderungen. Verwenden bei Projektstart, Arbeitsbeginn oder Team-Synchronisierung dieses Repositorys.
---

# Diktator Kart: Projektstart

Lies AGENTS.md und docs/21-team-workflow.md im Repository-Hauptordner. Der Hauptordner wird mit git rev-parse --show-toplevel ermittelt; kein fest verdrahteter PC- oder Claude-Worktree-Pfad. Ursprung ist marceldamm/diktator-kart; aktive Quelle nur Babylon src/public/art-source mit project-state.json.

1. Pruefe Branch, Worktrees, dirty Status, origin und laufende Merge/Rebase-Operationen. Hole origin/main. Fuehre scripts/team-workflow.ps1 -Action Status aus, sofern vorhanden. Ohne neue Skripte lies nach fetch erst origin/main:AGENTS.md und origin/main:docs/21-team-workflow.md.
2. Sichere uncommittete Dateien vor jedem Branchwechsel auf einem benannten lokalen Sicherungsbranch/Commit. Pruefe die Dateien einzeln: keine Geheimnisse, Tools oder Worktrees blind hinzufuegen. Keine reset --hard/clean/pauschale Stash-Anwendung. Ein existierender Altcheckout bleibt historisches Archiv.
3. Pruefe project-state.json und Abstammung von minimumSourceCommit. Alte Engine-/Archivbranches niemals weiterentwickeln oder automatisch in die neue Basis migrieren. Erhalte dortige Arbeit als Archiv; beginne neuen Babylon-Branch auf origin/main. Inhaltliche Ideen koennen als Herkunft-markierte Vorschlaege erhalten werden.
4. Fuer aktuelle Babylon-Arbeit vergleiche seit merge-base geaenderte Dateien auf beiden Seiten einschliesslich lokaler uncommitteter Dateien. Nutze -Action Start (gegebenenfalls -Owner Sarah/Marcel aus dem bekannten Nutzerkontext). Erhalte beide Intentionen bei Konflikten; keine globalen ours/theirs. Binaere Modelle anhand editierbarer Quellen auswaehlen/neu exportieren; echte Kreativentscheidungen abklaeren. Netz-/Loginfehler melden, keine Aktualitaet behaupten.
5. Pruefe nach Zusammenfuehrung relevante Tests sowie Abhaengigkeits-, Asset- und Settingsmigration. Lies START-HERE.md, README.md, docs/00-project-framework.md, docs/16-production-blueprint.md und den letzten Fortschrittseintrag. Arbeite nur auf der neuen Babylon-Basis. Danach die mitgelieferte Aufgabe ausfuehren; ohne Aufgabe kurz Stand/naechsten Schritt nennen.

Ergebnis: aktueller Hauptstand integriert, eigene Arbeit erhalten, eigener Arbeitsbranch, nachvollziehbare Ueberschneidungen und offene Konflikte. Diese Startinvokation autorisiert Abruf und sichere lokale Zusammenfuehrung, keinen ungefragten externen Push. Der ausdrueckliche Projektabschluss ist der Veroeffentlichungsauftrag.
