# AGENTS.md – Arbeitsregeln für Diktator Kart: Babylon-Neustart

## Zweck

Dieser Ordner ist die neue Projekt- und Wissensbasis für die Babylon.js-Neuentwicklung von Diktator Kart. Er ist zunächst kein fertiger Spiel-Checkout. Die Dokumente sollen Entscheidungen verständlich, prüfbar und über mehrere Arbeitssitzungen hinweg konsistent halten.

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
- Für den Babylon-Neustart gelten Branch-Arbeit und getrennte Freigabe der Übernahme nach `main`. Die alte Regel „push direkt nach main“ im übergeordneten Altprojekt gilt hier nicht.
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
- Zu Beginn `README.md`, `docs/00-project-framework.md`, `docs/16-production-blueprint.md` und `docs/17-progress-log.md` lesen.
- Eine Sitzung arbeitet auf einen benannten Meilenstein oder eine klar abgegrenzte Aufgabe hin.
- Am Ende müssen verifizierte Ergebnisse, nicht verifizierte Annahmen, geänderte Dateien, offene Probleme und der nächste Schritt in `docs/17-progress-log.md` stehen.
- Das empfohlene Modell wird nach Aufgabenrisiko gewählt: Luna für Routine, Sol für zusammenhängende Architektur/Kernsysteme, Astra für schwierige Gesamtanalysen und festgefahrene Probleme.
- Längere autonome Arbeit darf nicht stillschweigend den Umfang erweitern. Neue Ideen kommen zunächst in die Wissensbasis und werden erst nach Abgleich mit den Grundpfeilern geplant.
