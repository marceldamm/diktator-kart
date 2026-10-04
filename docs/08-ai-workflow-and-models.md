# KI-Arbeitsweise und Modellstrategie

> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).


## Gemeinsame Hauptbasis – 03.10.2026

Aktiv ist ausschließlich der neue Babylon-main auf GitHub, initial aus Claude Q2d c13d47e. Alte Engine-/Archivstände dienen nur historischen Zwecken und werden nicht verändert oder als Spiel gestartet. Projektstart sichert lokale Arbeit, holt main und integriert aktuelle Babylon-Änderungen; Projektabschluss prüft, dokumentiert und veröffentlicht mit normalem Fast-Forward. Konkreter Ablauf: [21-team-workflow.md](21-team-workflow.md). Frühere „main unverändert/kein Push“-Sitzungsangaben unten sind historische Zwischenstände, keine aktuellen Arbeitsregeln.


## Grundhaltung

Die KI ist nicht nur Codegenerator. Sie hilft beim Denken, indem sie Annahmen offenlegt, Abhängigkeiten erkennt, fehlende Fragen ergänzt, Widersprüche markiert und Dokumentation aktuell hält. Sie muss zwischen verifiziertem Befund, geplanter Entscheidung, Vorschlag und offener Frage unterscheiden.

## Praktische Verteilung

| Modell | Einsatz in diesem Projekt |
|---|---|
| **Luna** | einfache oder umfangreiche Routinearbeit: Dateien lesen, Listen pflegen, kleine Dokumentationsänderungen, klar abgegrenzte kleine Edits, wiederholbare Prüfungen und strukturierte Extraktion |
| **Sol / GPT-6.1 Sol** | anspruchsvolle Architektur, Kernsysteme, zusammenhängende technische Änderungen, Konfliktauflösung zwischen mehreren Dokumenten und Reviews mit Kosten-/Qualitätsabwägung |
| **Astra** | gezielt für besonders schwierige Gesamtanalysen, widersprüchliche Anforderungen, festgefahrene Probleme, große Architekturentscheidungen oder eine abschließende Qualitätsprüfung |

Die Zuordnung ist eine pragmatische Arbeitsregel, kein Qualitätsversprechen. Die konkrete Verfügbarkeit und die Fähigkeiten können je nach ChatGPT-/Codex-Oberfläche und Konto abweichen und werden vor einer speziellen Modellentscheidung geprüft.

## Eskalationsregel

Mit Luna beginnen, wenn Aufgabe und Abnahme klar sind. Sol einsetzen, wenn mehrere Systeme oder Architekturentscheidungen zusammenhängen. Astra nur dann einsetzen, wenn die zusätzliche Gesamtanalyse einen echten Mehrwert erwarten lässt. Nach einem Astra- oder Sol-Ergebnis kann Luna Routinefolgen und Dokumentationssynchronisierung übernehmen.

## Arbeitsprotokoll für jede größere Aufgabe

1. Grundpfeiler und betroffene Detaildokumente lesen.
2. Ziel, Nicht-Ziel, Abhängigkeiten und Abnahmekriterien formulieren.
3. Bestehende Dateien und Nutzerreferenzen prüfen.
4. Kleinsten überprüfbaren Schritt umsetzen.
5. Mit realen Ergebnissen testen oder die fehlende Verifikation klar markieren.
6. Hauptdatei, Details, Roadmap und offene Fragen synchronisieren.
7. Entscheidung im Log festhalten, wenn sie dauerhaft den Kurs ändert.

## Quellenhinweis

Die offizielle OpenAI-Dokumentation beschreibt Astra als Modell für besonders anspruchsvolle Arbeit, GPT-6.1 Sol als Balance aus Qualität und Kosten und Luna als effizientes Modell für fokussierte, häufige Aufgaben. Für die konkrete ChatGPT-/Codex-Verfügbarkeit gilt immer die aktuelle Produktansicht: [OpenAI Models](https://developers.openai.com/api/docs/models) und [Model selection](https://developers.openai.com/api/docs/guides/model-selection).
