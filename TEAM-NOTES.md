# TEAM NOTES – Notizen und gemeinsame Anleitung

**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

## So arbeiten Marcel und Sarah gemeinsam

Wir entwickeln gemeinsam das neue Babylon.js-Spiel. Die frühere Engine und alte Ordner sind archiviert und werden ausschließlich historisch betrachtet. Die neue Grundlage umfasst editierbare 3D-Assets, Fahrphysik, sechs Karts, Rennen, Items und drei Kameras. Grafik, Spielwelt und erkennbare historische Fahrer bauen wir weiter aus; es bleibt ein unfertiges Spiel.

### 1. Arbeitsbeginn: ein Wort genügt

Öffne deinen aktiven Projektordner in Codex und schreibe:

```text
Projektstart
```

Beim ersten Mal kannst du ergänzen: **„Ich bin Sarah“** beziehungsweise **„Ich bin Marcel“**. Danach reicht der Kurzbefehl. Du kannst deinen Auftrag direkt anhängen: „Projektstart. Danach verbessere …“

Die KI holt den neuesten gemeinsamen Babylon-Stand von GitHub, sichert lokale Änderungen, vergleicht Überschneidungen und integriert parallele Arbeit. Sie liest die Projektregeln und öffnet unsere vier Arbeitsdateien als Tabs in dieser Codex-Sitzung, soweit die App-Funktion verfügbar ist. Anschließend nennt sie aktuellen Stand und nächsten Schritt. Bei echten widersprüchlichen Entscheidungen erhält sie beide Fassungen und fragt uns.

Wir müssen GitHub dafür nicht selbst beherrschen. Unveröffentlichte Dateien auf Sarahs PC sind allerdings nicht in Marcels Sicherung enthalten. Beim ersten Umstieg sichert die KI diesen lokalen Stand gesondert. Der ausführliche technische Git-Ablauf steht in [Team-Zusammenarbeit](docs/21-team-workflow.md); für den Alltag reichen diese Anleitung und die Kurzbefehle.

### 2. Unsere vier Dateien

| Datei | Wofür wir sie verwenden |
|---|---|
| [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) | Aktuelle Aufträge und Fehler. Oben: was läuft, danach was folgt. Erst nach Prüfung abhaken. |
| [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) | Große Ziele: Grafik, Fahrer, Strecke, Audio, Geräte und später Multiplayer. Daraus schlägt die KI nächste Arbeitspakete vor. |
| [TEAM-CHANGES.md](TEAM-CHANGES.md) | Wenige wichtige besprochene Entscheidungen und sichtbare Änderungen für uns beide. |
| [TEAM-NOTES.md](TEAM-NOTES.md) | Diese Anleitung und unsere persönlichen Beobachtungen, Fragen und Ideen weiter unten. |

[PROGRESS-LOG.md](PROGRESS-LOG.md) enthält die ausführlichen technischen Ergebnisse, Tests, Grenzen und Übergaben. Die KI pflegt es; wir müssen es nicht jedes Mal komplett lesen. Es ist keine zusätzliche tägliche Aufgabenliste. Die Navigation oben bringt euch auch nach versehentlich geschlossenem Tab zurück zu den anderen Dateien.

### 3. Wünsche und Notizen einbringen

Ihr dürft während der Arbeit jederzeit Beobachtungen diktieren oder unten notieren. Sagt beispielsweise: „In die aktuelle Arbeitsliste aufnehmen: …“ oder „Als langfristiges Ziel notieren: …“. Nennt möglichst **Person, Situation und gewünschten Effekt**. Ein kurzer Eindruck aus dem Spiel hilft mehr als eine technische Vermutung.

Die KI ordnet konkrete Aufträge der aktuellen Liste zu, Zukunftsideen den langfristigen Zielen und wichtige Entscheidungen dem kurzen Teamverlauf. Sie bewahrt eure Notizen und kennzeichnet Herkunft, offene Fragen und tatsächliche Ergebnisse. Notizen sind nicht automatisch beschlossene Änderungen. Sarahs ursprüngliche Ideen bleiben nachvollziehbar; kreative Änderungen daran brauchen die vereinbarte gemeinsame Bestätigung. Abgearbeitete Notizen erhalten einen kurzen Verweis auf Ergebnis/Aufgabe statt still gelöscht zu werden.

### 4. Arbeitsende: ein Wort genügt

```text
Projektabschluss
```

Damit beauftragen wir die KI, Änderungen und nötige Prüfungen abzuschließen, unsere vier Dateien und den technischen Fortschritt zu aktualisieren, lokal zu committen, den neuesten Teamstand zu holen und das geprüfte Ergebnis in GitHub **main** zu veröffentlichen. Gearbeitet wird auf eigenem Branch. Kein Force-Push, keine fremde Arbeit verwerfen. Bei Konflikten, fehlenden Rechten oder fehlgeschlagenen Prüfungen meldet sie konkret, was gesichert und was noch nicht veröffentlicht ist.

### 5. Spiel und Modelle

Spiel öffnen: **Diktator-Kart-starten.cmd** im aktiven Ordner. Der Spielstarter lädt allein keine GitHub-Änderungen herunter. **Projekt-starten.cmd** und **Projekt-abschliessen.cmd** erledigen den einfachen Git-Fall; bei Konflikten oder ungesicherten Dateien hilft Codex.

Für zusammenhängende Spielentwicklung verwenden wir **GPT-6.1 Sol mit hoher Denkintensität**. **GPT-6 Astra** kann bei schwierigen Analysen oder festgefahrenen Problemen helfen; **GPT-6 Luna** für kleine Routineaufgaben, soweit verfügbar. Modellverfügbarkeit und Details stehen im [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md). Eine Einstellung garantiert kein perfektes Ergebnis: sichtbares Ziel, echte Browserbilder und Fahrtests verlangen. Limits beobachten; keine Zusatzkosten oder Resets automatisch auslösen.

## Unsere Notizen

Hier dürfen Marcel und Sarah direkt ergänzen. Die KI darf Formulierungen ordnen, erhält aber die Aussage und Autorenschaft. Keine erfundenen Zustimmungen oder fertigen Abnahmen.

### Vorlage – kopieren und ausfüllen

- **Datum / Person:**
- **Beobachtung oder Idee:**
- **Gewünschtes Ergebnis / Frage:**
- **KI-Status / Verweis:** offen; nach Sichtung mit Aufgabe oder Ergebnis verknüpfen.

### 03.10.2026 – Marcel

- Die geglättete Fahrt fühlt sich wesentlich flüssiger und besser an. Das ist ein positiver Fahrtest-Befund.
- Wir wollen vier zentrale Dateien, kurze Start-/Abschlussbefehle und gemeinsame KI-/Git-Unterstützung. Diese Anleitung richtet sich an uns beide.
- Offen bleiben vor allem erkennbare, realitätsnahe historische Fahrer und deutlich hochwertigere Grafik. Vorläufige Figuren nicht als fertige Abbilder melden.
