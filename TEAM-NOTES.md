# TEAM NOTES – Notizen und gemeinsame Anleitung

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Anleitung, persönliche Notizen und Teamnachrichten. Notizen/Vorschläge sind keine Zustimmung oder Umsetzung. Erledigte Notizen erhalten einen Ergebnisverweis statt kommentarlos gelöscht zu werden. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

## GitHub als Ergänzung zum Teamablauf – 06.10.2026 (Marcel)

**Herkunft/Status:** Marcel möchte GitHub-Funktionen automatisch in den laufenden Arbeitsablauf einbeziehen, ohne selbst Issue-, PR- oder Boardbegriffe bedienen zu müssen. Er nennt im Codex-Projekt einfach sein Ziel; Codex hält die vier Hauptdateien aktuell, ordnet konkrete bestätigte Aufgaben als Issues ein, bündelt größere Vorhaben in Milestones und reicht Änderungen als PR mit automatischen Actions-Checks ein. Das private Project-Board nimmt offene Issues und PRs automatisch auf. Die GitHub-Wiki bleibt aus, damit kein zweiter Dokumentationsort entsteht. Das `diktator-kart`-Repository ist öffentlich, das Board privat.

Copilot Cloud Agent ist im angemeldeten Konto laut GitHub nicht verfügbar („access unavailable for plan“); kein Upgrade/Testzeitraum wurde aktiviert. PR #1 und der Statusabgleich PR #5 sind mit erfolgreichen Pflichtchecks in `main` zusammengeführt; PR #5 steht auf `Done`. Issue #3 wurde durch PR #1 automatisch geschlossen; Issue #2 bleibt `In progress`, bis der gemeinsame Test mit Sarah abgeschlossen ist. Sarahs Konto `@Castessa` hat Zugriff mit Rolle `Write` auf das private Project-Board. Issue #4 und der Meilenstein `Redesign-Performance-Abnahme` halten TV-Performance und sichtbare Geräteabnahme fest. GitHub Pages kann öffentlich sein, selbst wenn sein Quell-Repository privat ist.

**Issue #4 – Abschlussstand (06.10.2026):** Marcel entschied, die Live-TV-Zweitkamera zu deaktivieren. PR #6 integrierte die Umsetzung samt statischem Stadionmotiv in `main` (Merge `1d015da`); Actions und lokaler Abschlusslauf bestanden. Das Issue bleibt für den Framezeitvergleich des finalen Stands und den Intel-UHD-Lauf offen. Ein früherer Feed-A/B belegt den Renderpass als Übeltäter, ersetzt jedoch nicht die Messung nach dem Entfernen.

Offizielle Doku: [Issues](https://docs.github.com/en/issues), [Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects), [Copilot Cloud Agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github), [Status Checks](https://docs.github.com/en/pull-requests/reference/status-checks), [Actions-Abrechnung](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Git für euch – der kurze gemeinsame Ablauf

**Jede Person arbeitet auf einem eigenen Arbeitsbranch; `main` ist der gemeinsame, geprüfte Spielstand.** Die KI kümmert sich um Abgleich, Sicherung, Konfliktlösung und Veröffentlichung – ihr müsst keine Git-Befehle kennen.

- **„Projekt Start“**: neuesten Stand holen, vorhandene Arbeit bewahren und einen persönlichen Arbeitsbranch vorbereiten.
- **„Zwischenstand sichern“**: Änderungen prüfen und als wiederherstellbaren Commit auf den eigenen Branch bei GitHub sichern; `main` bleibt dabei unverändert.
- **„Projektabschluss“**: beide Branch-Stände zusammenführen, Konflikte inhaltlich klären, Tests/Build ausführen und den geprüften Stand nach `main` veröffentlichen.
- **„Wo stehen wir?“**: Die KI zeigt Branch, gespeicherte/ungesicherte Änderungen, Überschneidungen und den nächsten Schritt.

Ein **Branch** ist eure getrennte Arbeitslinie, ein **Commit** ein gespeicherter Zwischenstand. Erst der geprüfte Abschluss macht daraus den gemeinsamen `main`-Stand. Wenn Änderungen dieselbe Stelle betreffen, stoppt Git zum Abgleich; die KI verbindet beides, wenn es fachlich zusammenpasst. Blender-Dateien lassen sich nicht zeilenweise zusammenfügen – dieselbe `.blend` daher nicht gleichzeitig bearbeiten.

## Schnellhilfe – alles einfach der KI sagen

**Ihr müsst diese Dateien nicht selbst beschreiben.** Diktiert oder schreibt eure Wünsche in Codex; die KI trägt sie passend ein und hält die Arbeitsgrundlage aktuell.

| Kurzer Befehl / Beispiel | Was die KI macht |
|---|---|
| **Projekt Start** | GitHub synchronisieren, lokale Arbeit bewahren, vier Tabs öffnen, Aufgaben und Nachrichten zeigen. Auch **Projektstart** funktioniert. |
| **Zwischenstand sichern** | Diff prüfen, dokumentierten Checkpoint committen und nur den persönlichen Arbeitsbranch zu GitHub hochladen. `main` bleibt unberührt. Auch **Zwischenstand** funktioniert. |
| **Projekt Ende** | Arbeit sichern, dokumentieren, prüfen und den geprüften Teamstand nach GitHub main hochladen. Auch **Projektabschluss** funktioniert. |
| **Wo stehen wir?** | Branch, Änderungen, offene Überschneidungen und nächsten Schritt verständlich erklären. |
| **Arbeite unsere Arbeitslisten ab** | Erst kurzfristige Aufgaben umsetzen, danach bestätigte langfristige Ziele selbstständig in Paketen bearbeiten; Fortschritt dokumentieren und Budgetreserve beachten. |
| **Heute möchte ich …** | Als aktuellen Auftrag in CURRENT-WORKLIST.md und – wenn konkret und bestätigt – als GitHub-Issue aufnehmen, auf dem Board verfolgen und bearbeiten. |
| **Langfristiges Ziel: …** | In LONG-TERM-GOALS.md aufnehmen. |
| **Notiere: …** | Beobachtung/Frage mit Herkunft hier in TEAM-NOTES.md festhalten. |
| **Nachricht an Sarah: …** / **Nachricht an Marcel: …** | Als datierte Teamnachricht hier festhalten; beim nächsten Projektstart dem angesprochenen Teammitglied zeigen. |

**Diktator-Kart-starten.cmd:** Spiel aus dem aktiven Projektordner öffnen.

**Chrome bei Spielprüfungen sichtbar lassen:** Jeder Browserlauf mit dem Spiel läuft in einem für Marcel/Sarah sichtbaren Google-Chrome-Fenster. Keine Headless- oder versteckte/minimierte Ausführung. Ein CDP-Test nutzt bei Bedarf ein eigenes sichtbares Fenster; Spiel pausieren und genau diese Testinstanz nach dem Lauf schließen, normale Chrome-Fenster offen lassen. So könnt ihr den geprüften Zustand mitverfolgen.

**Laufzeitbilder und Arbeitsfokus:** Sichtbare Pakete werden an sinnvollen Zwischenständen mit aktuellen Spielbildern geprüft. Wo es passt, hält ein Vorher-/Nachher-Paar dieselbe Szene und Kamera fest; Screenshots nicht für jede Kleinigkeit erstellen. Vor einer Bildbewertung erst Bestand und Zeitstempel prüfen: ältere Aufnahmen sind historische Vergleiche, kein Beleg für die aktuelle Runtime. In längeren Browser-/Build-/Blender-Läufen CPU und Speicher in Abständen prüfen, die Last dem eigenen Tab/Prozess zuordnen und nur eigene, nicht mehr benötigte Testläufe pausieren oder schließen. Nach jedem größeren Paket fragt sich die KI, ob sie noch sichtbaren Hauptfortschritt erzielt oder in unnötige Detailarbeit abdriftet. Ablauf: [Team-Workflow](docs/21-team-workflow.md), [Laufzeitbelege](docs/evidence/README.md).

**Sarahs Projektleitgedanke:** Beim nächsten Projektstart soll Sarah automatisch auf [PROJECT-QUESTIONNAIRE.md](PROJECT-QUESTIONNAIRE.md) hingewiesen werden. Jede Frage zeigt Marcels gesetzte Auswahl sowie dieselben vollständigen Antworttexte mit Sarahs eigenen Kästchen. Marcels Antworten bilden die aktive initiale Projektbasis in [docs/23-project-design-baseline.md](docs/23-project-design-baseline.md) und den relevanten Fachdokumenten. Nach Sarahs Eingabe entsteht separat `PROJECT-VISION-SYNTHESIS.md` mit beiden Ursprungsantworten, Gemeinsamkeiten, Unterschieden und klar als KI-Vorschläge markierten Syntheseideen. Sarahs Antworten werden als separate Perspektive ergänzt und ändern die aktive Basis nicht automatisch. Ein Vergleich mit KI-Synthese wird separat dokumentiert; über Änderungen an Marcels Grundpfeilern entscheidet Marcel ausdrücklich. Sarahs bestehende Ideen bleiben unverändert.

**Projekt-starten.cmd:** Einfachen Git-Start ausführen. **Projekt-abschliessen.cmd:** Einfachen geprüften Git-Abschluss ausführen. Bei Konflikten/ungesicherten Dateien hilft Codex; die Batches selbst sind keine KI. Der Spielstarter synchronisiert GitHub nicht.

**Projekt-zwischenstand.cmd:** Sichert einen geprüften Zwischenstand auf dem eigenen Branch und lädt nur diesen Branch hoch. Es ändert `main` nicht. Vorher Codex **„Zwischenstand sichern“** sagen; die KI prüft Diff und Geheimnisse und startet dann den Checkpoint.

**Limit-Puffer für beide:** Die KI prüft eure eigenen offiziellen Fünf-Stunden-/Wochenwerte. Ab etwa **15 % Rest** beginnt sie keine große Aufgabe mehr und schließt geordnet ab; Ziel: mindestens etwa **5 % für euch übrig**. Ohne Zugriff meldet sie das und nutzt einen vorsichtigen Puffer. Keine automatischen Resets oder Zusatzkosten. Details in [AGENTS.md](AGENTS.md).

Details zu Dateien, Zusammenarbeit und Modellwahl stehen darunter.

### 05.10.2026 – Marcel: Umsetzungsauftrag für längere Arbeitssitzung

**Herkunft:** Marcels eingefügter Leitauftrag als leitender Entwickler, Technical Artist und Art Director. **Status:** als vorrangiger aktueller Auftrag in CURRENT-WORKLIST.md umgesetzt; Reihenfolge: offene aktuelle Punkte, Hitler/Kart als erster Qualitätsanker, begrenzte Spielwelt-/Laufzeitpartikelpakete, kontrollierbarer Drift, danach bestätigte Langzeitpakete. Paketfortschritt und offene Abnahmen stehen in PROGRESS-LOG.md und docs/22-character-vehicle-quality-master.md. Die Anweisung, bis zum Nutzungslimit weiterzuarbeiten, bleibt an die strengere Budgetregel aus AGENTS.md gebunden: keine neue Großaufgabe ab circa 15 % Rest, geordneter Abschluss mit ungefähr 5 % Puffer. Keine Resets/Extras.

**Zwischenstand desselben Auftrags (Codex, 05.10.):** Kanalwasserlinie mit zwei schmalen prozeduralen Schaumkanten erweitert; Regression und Produktionsbuild bestanden. Stalin bekam eine eigene modellierte Nase im editierbaren Blender-Asset und optimierten GLB; Cast-Knotentest und Build bestanden. Der Karosseriezustand ist nun auch semantisch als ARIA-Meter ausgezeichnet. Wasser-Kontaktbild, Stalin-Nahansicht und menschliches Fahren sind weiterhin offen. Der im Rückstand genannte Ein-Item-Slot war schon implementiert und wird in der Arbeitsliste als Codebestand nachgetragen; seine interaktive Laufzeitabnahme bleibt offen.

**Zusatzpass desselben Auftrags (Codex, 05.10.):** Stalins Limousine bekam eine Touring-Windschutzscheibe mit transparentem Glas, Metallrahmen und Wischer; die sichtbare Hinterradgröße wurde reduziert, nachdem die Studioansicht noch einen Trecker-Eindruck zeigte. Das über der Feldmütze liegende Deckhaar wurde von einer eigenen Seitenhaarlinie getrennt. Runtime-Laden/Nahfahrt und menschliche Beurteilung sind nicht belegt; aktuelle Assetvorschau, Grenzen und Paketstatus sind in CURRENT-WORKLIST.md und PROGRESS-LOG.md vermerkt.

**Weitere autonom bearbeitete Pakete (Codex, 05.10.):** Stadtfassaden erhielten selektive Laden-Ausleger; Laufzeitdatei, Build und Hauptmenü-Reload sind geprüft, Detail-/Stilabnahme fehlt. Offizieller Limitstand zuletzt: 3 % Fünf-Stunden-Verbrauch und 42 % Wochenverbrauch (97 %/58 % Rest; Woche bindet). Keine Resets/Zusatzkontingente.

**Laufende autonome Sitzung (Codex, 05.10.):** Die herausstehenden Sitznähte wurden als Ursache der Rückenstäbe identifiziert, in Blender korrigiert und aus frischer Babylon-Heck-/3/4-Ansicht geprüft. Der Ein-Item-Weg ist im Grand Prix abgenommen: Kiste → Symbol/Name/„IM SLOT“ → Buttonwurf und separater E-Wurf → leerer Slot/„… unterwegs“. Der Kanalspray bleibt visuell offen; nächster Schritt ist ein kontrollierter niedriger Kanalpass mit Bild während des Kontakts. Offizielle Werte zuletzt 19 % Fünf-Stunden-Verbrauch / 45 % Wochenverbrauch (81 %/55 % Rest, Woche bindet); ab etwa 15 % Rest keine neue Großaufgabe. Keine Zusatzkontingente/Resets.

**Sichtbares Chrome bei Spielprüfungen (Marcel, 05.10.2026):** Wenn Codex das Spiel in Google Chrome ausführt oder testet, soll Marcel/Sarah das echte Spielfenster sehen und den Ablauf mitverfolgen können. Headless-, versteckte und minimierte Prüffenster sind ausgeschlossen. Nach dem Beleg Rendering pausieren und nur die eigene Testinstanz schließen. Dauerhafte Regeln: [AGENTS.md](AGENTS.md), [Team-Workflow](docs/21-team-workflow.md).

**Handgriff-Korrektur (Codex, 05.10.):** Die Laufzeit-IK richtet die verbundene Hand jetzt zusätzlich zur Griffstelle an der Tangente des drehenden Lenkrads aus; 2/2 gezielte Regressionen und Build bestanden. Der Browser lud einen frischen Stalin-Rennstart; beide Hände liegen am Rad. Keine gehaltene Links-/Rechtslenkung oder visuelle Außen-Nahaufnahme bestätigt.

**M7-Rendertexturpaket (Codex, 05.10.):** Das Stadion-TV pausiert nun außerhalb von 130 m und aktualisiert sich wieder beim Annähern. Wiederholter A/B in derselben pausierten Sechs-Kart-Szene: P50 71,3 → 53,5 ms, P95 161,2 → 125,8 ms und 617 weniger Draws. Helpertests 2/2, TypeScript, Produktionsbuild und ein echter Grand-Prix-Start geprüft. Große FPS-/Geräteabnahme bleibt offen. Offizielle Werte nach dem Paket: 4 % Fünf-Stundenverbrauch und 46 % Wochenverbrauch (96 %/54 % Rest; Woche bindet). Nächster Schritt: Blender-Stadtszenenbau profilieren und beschleunigen, bevor das blockierte Fassadenentwässerungs-Asset erneut gebaut wird.

**M3-Stadtpaket und Builderprofil (Codex, 05.10.):** Die Regenrinnen-/Ladenfassaden sind nach 48 Townhouses, 32 zusammengeführten Materialmeshes und knapp 69 Minuten Blender-Bau bis ins Runtime-GLB exportiert; neue Welt im frischen Rennen geladen. Der erste eindeutige Phasenlog belegt, dass der statische Join deutlich langsamer bleibt als der GLB-Export. Gutter-/Planter-/Shutter-/Sign-Knoten sind per Test vorhanden; künstlerische Nahabnahme steht aus. Offizielle Werte nach dem Paket: 12 % Fünf-Stundenverbrauch und 48 % Wochenverbrauch (88 %/52 % Rest; Woche bindet). Kein Zusatzkontingent oder Reset genutzt. Nächster gewählter Punkt: bewegte Laufzeit-Renderkosten M7.

## So arbeiten Marcel und Sarah gemeinsam

Wir entwickeln gemeinsam das neue Babylon.js-Spiel. Die frühere Engine und alte Ordner sind archiviert und werden ausschließlich historisch betrachtet. Die neue Grundlage umfasst editierbare 3D-Assets, Fahrphysik, sechs Karts, Rennen, Items und drei Kameras. Grafik, Spielwelt und erkennbare historische Fahrer bauen wir weiter aus; es bleibt ein unfertiges Spiel.

### 1. Arbeitsbeginn: ein Wort genügt

Öffne deinen aktiven Projektordner in Codex und schreibe:

```text
Projekt Start
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
Projekt Ende
```

Damit beauftragen wir die KI, Änderungen und nötige Prüfungen abzuschließen, unsere vier Dateien und den technischen Fortschritt zu aktualisieren, lokal zu committen, den neuesten Teamstand zu holen und das geprüfte Ergebnis in GitHub **main** zu veröffentlichen. Gearbeitet wird auf eigenem Branch. Kein Force-Push, keine fremde Arbeit verwerfen. Bei Konflikten, fehlenden Rechten oder fehlgeschlagenen Prüfungen meldet sie konkret, was gesichert und was noch nicht veröffentlicht ist.

### 5. Spiel und Modelle

Spiel öffnen: **Diktator-Kart-starten.cmd** im aktiven Ordner. Der Spielstarter lädt allein keine GitHub-Änderungen herunter. **Projekt-starten.cmd** und **Projekt-abschliessen.cmd** erledigen den einfachen Git-Fall; bei Konflikten oder ungesicherten Dateien hilft Codex.

Für zusammenhängende Spielentwicklung verwenden wir **GPT-6.1 Sol mit hoher Denkintensität**. **GPT-6 Astra** kann bei schwierigen Analysen oder festgefahrenen Problemen helfen; **GPT-6 Luna** für kleine Routineaufgaben, soweit verfügbar. Modellverfügbarkeit und Details stehen im [TEAM-HANDBOOK.md](TEAM-HANDBOOK.md). Eine Einstellung garantiert kein perfektes Ergebnis: sichtbares Ziel, echte Browserbilder und Fahrtests verlangen. Limits beobachten; keine Zusatzkosten oder Resets automatisch auslösen.

## Teamnachrichten

Hier hält die KI diktierte Nachrichten fest: **Datum · von · an · Nachricht · Status**. Beim Projektstart passende offene Nachrichten kurz anzeigen; „gelesen“ oder „beantwortet“ erst nach eurer Bestätigung vermerken.

### 06.10.2026 – Nachricht von Sarah an Marcel: Streckenauswahl und Startbild

**Von:** Sarah. **An:** Marcel. **Status:**

Ich habe vor Grand Prix, Zeitfahren und erneutem Rennstart eine Streckenauswahl ergänzt. Der Stadionring bleibt als einzige Strecke spielbar. Die fünf Planungsstrecken zeigen jetzt auch ihre Orte: Ewige-Führer-Alee (Pjöngjang), Kulturrevolutions-Schleife (Peking), Havanna-Revolutionsring (Havanna), Duce-Drom (Rom) und Genossen-Gerade (Moskau). Außerdem wurde der Fehler behoben, durch den die Strecke während der Fahrerporträt-Aufnahmen kurz vor dem Start verschwand. Das Ruckeln auf Intel UHD ist weiterhin offen und wird nicht durch eine unbelegte Grafikabsenkung kaschiert.

### 04.10.2026 – Nachricht von Marcel an Sarah: unser gemeinsamer Neustart

**Von:** Marcel, auf seinen Auftrag von der KI formuliert. **An:** Sarah. **Status:** offen; gelesen erst nach deiner Bestätigung.

Hallo Sarah! Mein neuer Babylon-Spielstand ist jetzt auf GitHub main. Bitte starte künftig von dieser gemeinsamen Basis. Dein bisheriger lokaler Stand soll vorher vollständig lokal bewahrt und auf einem eigenen GitHub-Archivbranch gesichert werden. Deine Ideen gehen mit Herkunftsverweisen in unsere Wissensbasis ein; die alte Engine bleibt historische Referenz.

Du musst weder GitHub noch unsere Dateien selbst pflegen. Sag der KI, was du machen möchtest oder welche Nachricht sie für mich notieren soll. Unsere vier Dateien: aktuelle Arbeit, langfristige Ziele, kurze Teamänderungen und diese Notizen/Anleitung. Oben steht die Schnellhilfe. Die KI berücksichtigt bei autonomer Arbeit auch dein eigenes Nutzungslimit und schließt mit Reserve ab. Später reichen **Projekt Start** und **Projekt Ende**.

**Einmaliger Umstieg:** Öffne deinen bisherigen Projektordner in Codex und füge diesen Befehl ein:

```text
Projekt Start. Ich bin Sarah. Sichere zuerst meinen bisherigen Stand lokal und auf einem eigenen GitHub-Archivbranch, ohne etwas zu verlieren. Übernimm dann die neueste main-Version von https://github.com/marceldamm/diktator-kart als aktive Basis. Lies die neuen Projektregeln und die Budgetregel. Halte meine bisherigen Ideen mit Quellen in der Wissensbasis fest; alter Code bleibt Archiv. Öffne die vier Hauptdateien, erkläre sie kurz und zeige Marcels Nachricht in TEAM-NOTES.md.
```


### 04.10.2026 – Nachricht von Marcel (über Claude) an Sarah

Hallo Sarah! Dein Panzer ist zurück: Drück im Rennen **Q** – der General wird für acht Sekunden zum Paradepanzer („Größenbefehl“), rollt mit Ketten, Rauch und Getöse durchs Feld und schiebt Gegner zur Seite; danach 18 Sekunden Pause. Außerdem neu: **Regen** (Optionen → Wetter Regen) mit nasser Straße, Pfützen und Gewitter, aufgeräumte Doku und ein gemeinsamer Arbeitsordner. Einfach „Projekt Start“ sagen, dann bist du auf unserem Stand. Viel Spaß beim Ausprobieren! – Marcel

**Status:** offen, für Sarah.

## Unsere Notizen

### 04.10.2026 – Marcel: Qualitätsreferenz und Rennsysteme

Marcel legt `docs/evidence/loading-real-progress.png` als visuelle Referenz fest: bessere Fahrer-/Fahrzeugmodelle sowie glaubwürdigere Gebäude, Straßenboden, Wasser und Fahrpartikel sollen als Laufzeit-3D umgesetzt werden. Die konkrete politische Bildsprache und Logos werden nicht kopiert; das Projekt behält eigenständige kritische Satire ohne Regimezeichen. Zusätzlich bestätigt Marcel eine deutlich sichtbare Iteminventar-Anzeige mit Symbol und nutzbarer Bildschirmtaste. Itemtreffer sollen sich kumulativ auf Haltbarkeit auswirken; das technische Item-Schadenssystem besteht bereits und wird regressionsgeprüft. Status und Abnahme: [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

### 04.10.2026 – Marcel: Fahrerform und Hände aus Laufzeitbildern

**Beobachtung/Auftrag:** In zwei angehängten Babylon-Spielbildern wirken Köpfe im Verhältnis zum Oberkörper zu klein und unten durch ein kantiges Hals-/Kragenteil abgesetzt; Mund kaum erkennbar. Hände sollen außen um den Lenkradkranz greifen, einschließlich plausibler Handgelenksrichtung. Der goldene flatternde Querbalken hinter dem Fahrer soll identifiziert und entfernt/umgearbeitet werden. Für historisch belegte Figuren passende, eigenständige Hüte ergänzen. Im [aktuellen Arbeitsauftrag](CURRENT-WORKLIST.md) zur Umsetzung und visuellen Abnahme aufgenommen.

**Präzisierung von Marcel (04.10.):** Die Fahrzeuge sollen alle dieselbe erkennbare Kart-Grundfamilie behalten und dennoch durch viele personenspezifische Formen klar verschieden sein. Keine Trecker-Silhouette; der Fünfjahresplan-Traktor ist das Wurfobjekt. Diese Bedingung steht im [Masterauftrag](docs/22-character-vehicle-quality-master.md) und im Langzeitziel.

**Umsetzungstand:** Erster editierbarer Gesichts-/Hand-/Kragenpass, die Entfernung des falsch am Cape-Knoten sitzenden Goldverschlusses und ein weiterer Stalin-Gesichts-/Limousinenpass sind im laufenden Spiel sichtbar. Nach Marcels Korrektur zu Mund und Hitlers Schnurrbart wurden beide deutlich verstärkt; unter Stalins Walrossbart ist nun ein eigener Mund aktiv. Der Lenkradgriff wurde erneut nach innen versetzt und im Cockpit geprüft. Die Karikaturstufe ist weiterhin nicht der geforderte Qualitätsanker; Lenkeinschlag/Griff von außen, Front-/Seiten-/Nah-/Bewegungsprüfung, menschliche Abnahme und der vollständige Fahrzeugpass sind offen. Technische Belege siehe [PROGRESS-LOG.md](PROGRESS-LOG.md) und [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

**Korrektur von Marcel (04.10.):** Die Hände schwebten im aktuellen Stand wieder. Die Ursache lag in der Laufzeittrennung: nur Handschuh-Meshes wurden ans Lenkrad gehängt, während Manschette und Unterarm am Arm blieben. Die IK bewegt jetzt die vollständige verbundene Arm-Hand-Einheit. Ergänzend berücksichtigt sie die bei starkem Lenkeinschlag wachsende/verkürzte Griffdistanz durch gleichmäßige Armlängenanpassung und erhält die Handschuhgröße. Grundpose und Cockpitkontakt im aktuellen Spiel geprüft; beide Arme/Lenkwinkel rechnerisch regressionsgeprüft. Menschlich geführter voller Links-/Rechtsanschlag aus Außen-/Seitenansicht bleibt offen.

**Masteraufgabe – Bekleidungspass (04.10.):** Stalin hatte im ersten Laufzeitmodell wie die anderen eine helle generische Paradeuniform mit Orden, Schulterstücken und Band. Der Anker trägt jetzt eine dunkle hohe Feldtunika mit Stoffkragen, Knopfleiste, Taschen und Nähten; diese Dekorationsteile sind nur bei Stalin abgeschaltet. Die echte Fahrerwahl wurde nach dem Blender-Export geprüft. Vollständige Gesichts-/Fahrzeugqualität bleibt weiterhin offen; Status/Belege siehe [Arbeitsliste](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).

### 04.10.2026 – Codex: Regen-Wolkenschatten sichtbar gemacht

Fünf weiche Schattenflächen/Pfützen waren bereits angelegt, wurden aber durch die Reihenfolge in `setWeather` sofort wieder ausgeschaltet. Der Schneezustand wird jetzt zuerst zurückgesetzt, Regen zuletzt aktiviert. Der sichtbare Regen-/Sonnenvergleich und weitere technische Belege stehen im [Fortschrittslog](PROGRESS-LOG.md); der M5-Punkt ist in der [Arbeitsliste](CURRENT-WORKLIST.md) abgeschlossen.

**Korrektur von Marcel (04.10.):** Er wies darauf hin, dass Mund und Hitlers Schnurrbart auf dem ersten überarbeiteten Auswahlbild faktisch fehlten. Die Geometrie war im Asset, aber bei der dargestellten Kartengröße nicht lesbar. Mundöffnung/Lippen und Schnurrbart wurden daraufhin größer und kontrastreicher modelliert; neues Bild im Laufzeitspiel zeigt beide Merkmale. Weitere Gesichts-/Qualitätsabnahme bleibt offen.

### 04.10.2026 – Marcel: Wiederholter Absturz im Wasserkanal

**Beobachtung:** Nach dem Kanalsprung wurde das Kart aus dem Wasser gehoben und an derselben Wasserposition abgesetzt, wodurch es erneut abstürzte.

**Ergebnis:** Kanal-Respawn hinter der Landekante korrigiert und geprüft; Details im [Fortschrittslog](PROGRESS-LOG.md). Die Bergung im Hafenbecken bleibt beim bisherigen Verhalten.

### 04.10.2026 – Marcel: Fahrbugs an Sprung, Rampe und Roadster-Wimpeln

**Beobachtung/Auftrag:** Während der Fahrt bleiben beim Lufttrick die Räder scheinbar stehen, die Rampe flimmert wegen Überlagerung mit dem Straßenbelag, und auf den Roadster-Wimpeln werden Adler gewünscht.

**Ergebnis:** Die getrennte Radgruppe rollt während des Lufttricks gemeinsam mit der Karosserie; die Holzrampe wurde 5 cm über ihr deckungsgleiches Straßenprofil gehoben; beide Roadster-Wimpel tragen im Laufzeitbild ein eigenständiges Adlerrelief ohne Regimezeichen. Code-, Asset-, Regressionstest- und Buildprüfung stehen im [Fortschrittslog](PROGRESS-LOG.md). Menschliche Fahrt auf der Rampe/durch den Sprung bleibt offen.

### 04.10.2026 – Projektstartabgleich und nächste Arbeit

**Von:** Codex für Marcel. **Status:** geprüft, keine Teamnachricht versandt.

`origin/main` und der PC-Checkout stehen auf `00e8173`; die Handy-Arbeitsnotizen sind dort sichtbar. Die aktuelle Gesamtsuite mit neuem Bot-Weglinientest besteht 47/47; Produktionsbuild besteht. Sarahs eigenen Abruf muss sie auf ihrem Gerät bestätigen. Das technische Schadens-/Wandgleitenpaket ist bereits eingebaut; menschliches Fahrgefühl und vorläufige Werte bleiben offen. Die sechs Fahrerporträts wurden in der Laufzeit geprüft und zeigen den gewählten Fahrer vor einer neutralen Studiofläche. Der erste Gesichts-Pass verkleinert den Kopf relativ zum Oberkörper und mattiert Haut/Augen; die Gesichter bleiben Karikaturen. Der bereits modellierte, am Kart fixierte Schalensitz ist in der Laufzeit sichtbar; menschliche Sitz-/Beinpassform bleibt offen. Bot 3 folgt nun einer eigenen Weglinie durch die Hinterhofgasse; ein Mehrbot-Straßentest bleibt sinnvoll. Der Quaternius-Standarddownload ist CC0/glTF; die vollständigen `.blend`-Quellen kosten Geld, daher werden sie nicht verwendet. Historische Stimmen bleiben bis zur belastbaren Rechte- und Inhaltsprüfung sowie menschlichen Hörprobe offen.

Für die historischen Hupen sind zwei Kandidaten geprüft und ausgeschieden: `Hit43.ogg` ist laut Commons eine politische Rede, `It-Benito_Mussolini.ogg` eine moderne Namensaussprache. Keine davon ist als historische Hupenaufnahme passend. Eine bessere Primärquelle muss Person, unbedenklichen Ausschnitt und Wiederverwendungsstatus belegen.

### 04.10.2026 – Marcel: nächste Qualitätsstufe

Alles deutlich schöner, realistischer und hochwertiger machen: viel bessere Modelle, Charaktere, Fahrzeuge, Strecke, Umfeld, Effekte, Sounds, Stimmen und Musik. Maßstab ist unsere gewählte Bildpräferenz. **Keine Text-to-Speech-Stimmen als Endergebnis.** Status: Ziel verankert, Umsetzung/Abnahme offen; Details in [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md).

**Zusatzpaket (Codex, 04.10.):** Der gemeinsame Rad-Detailpass ergänzt modellierte Seitenwandrippen und Felgenmuttern in der editierbaren Blender-Quelle. Der große Fahrer-/Fahrzeuganker bleibt in Arbeit; sichtbare Nahprüfung im Rennen ist noch offen. Belege: [Arbeitsliste](CURRENT-WORKLIST.md), [Fortschrittslog](PROGRESS-LOG.md).

**Zusatzpaket 2 (Codex, 04.10.):** Das Laufzeit-Skinmaterial hat jetzt eine zurückhaltende prozedurale Poren-/Farbstruktur und sehr schwache Normalvariation. Nur Build und automatisierte Suite können die Renderintegration technisch absichern; menschliche Nahansicht bleibt offen.

### 04.10.2026 – Sarahs Panzerfrage, von Marcel übermittelt

Sarah fragt, ob Hitler weiterhin sein Kart als Spezialfähigkeit in einen Panzer verwandelt; sie habe dies programmiert. **Befund:** im veröffentlichten Altarchiv e292070 tatsächlich implementiert (8 s Dauer, 18 s Abklingzeit); im neuen Babylon-Spiel noch nicht. Git führt Marcel als Autor, deshalb Sarahs Urheberschaft als übermittelte Aussage kennzeichnen. Marcel möchte sinnvolle Änderungen professionell neu umsetzen lassen; Claude-Übergabe vorbereitet. Weitere Fähigkeiten/Items/Botänderungen stehen im [Abgleich mit Quellen](docs/sarah-feature-audit.md). Keine Zustimmung Sarahs zu abweichenden Neuinterpretationen behaupten; unveröffentlichte Arbeit auf ihrem PC bleibt hier unbekannt.

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

### 04.10.2026 (Abend) – Claude für Marcel: arbeiten ChatGPT und Claude auf derselben Version?

Ja. Beide arbeiten im Ordner `D:\Diktator-Kart` auf demselben Git-Stand; die Maussteuerung war unverändert ChatGPTs Reparatur. Der alte Claude-Worktree, der früher einen veralteten Stand zeigen konnte, ist gelöscht. Die Maus-Geste brach in Browsern ab, die den Mauszeiger nicht einfangen dürfen; das ist jetzt abgefangen. **Status:** bitte in Chrome testen und Ergebnis hier notieren. Neu zum Ausprobieren: Fahrerwahl, eigene Wurfobjekte, Marsch, Feuerwerk ([Arbeitsliste](CURRENT-WORKLIST.md)).

### 04.10.2026 (Abend) – Claude für Sarah und Marcel: neu zum Ausprobieren

Größere Karte mit Kanalsprung und zweiter Rampe, ruhigerer Drift mit drei Turbostufen, Windschatten, Sprung-Trick, Item als Schild (E halten), Zeitfahren mit Geist und Medaillen, Gegnerstärke, Grafik „Hoch“, eigene Karosserie je Figur, neu modellierte Köpfe/Haare, Füße auf den Pedalen. Hupen bleiben vorerst Text-to-Speech. **Status:** offen, bitte Fahrgefühl, Drift und Lenkung selbst testen und hier notieren.

### 04.10.2026 – KI-Übergabe

Geprüfte Spielversion 2c6e92d ist auf GitHub main gesichert; 41 Tests und Build bestanden. Die vier Arbeitsdateien gehören zum Start. Nächste offene Nutzeraufträge stehen in CURRENT-WORKLIST.md; keine fertigen realitätsnahen Fahrer oder Hörabnahme behaupten.


## Neue Spielideen und Auftrag für morgen – Marcel, 04.10.2026 (Handy)

Marcel möchte am 05.10. zuerst den PC-/Cloud-Stand und die Handyänderungen abgleichen und danach mit den folgenden Spielpaketen beginnen. Die konkrete Reihenfolge steht in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md); vorhandene, ältere Ideen bleiben in den verlinkten Fachdateien erhalten.

- **Wand-/Kartkontakte und Schaden:** Das aktuelle Fahrgefühl ist schon besser als zu Beginn, aber Wandkontakte stoppen noch zu abrupt und stören den Spielfluss. Vorhandene Regel für schräges Bandengleiten gegen den jetzigen Build prüfen. Kollisionen mit Wänden und anderen Karts sollen spürbare, sichtbare Folgen haben. Haltbarkeit/Kumulierung ergänzen; nach mehreren schweren Treffern kann ein Kart satirisch explodieren/ausfallen, der Fahrer komisch herausfliegen und das Fahrzeug nach wenigen Sekunden mit besonderer Animation und Sound zurückkehren. Bestehende Idee zu Spiegel/Auspuff/Abdeckungen/Rauch/Funken in LONG-TERM-GOALS.md ausbauen; Werte und Fairness offen lassen.
- **Realistische Fahrer im Kart:** Gesichter erwachsener, detailreicher und erkennbarer, nicht kindhaft/niedrigpolygonig. Sitz modellieren, Unterkörper/Beine richtig platzieren, Durchstecken aus der Karosserie verhindern. Hände mit Fingern am Lenkradgriff, sichtbare Bewegungsanimation. Gas-/Bremspedale modellieren und bei Eingabe bewegen; Füße passend aufsetzen. Lenkrad verbessern. Fahrerperspektive: Räder lenken zur richtigen Seite, Spiegel nicht spiegelverkehrt; Cockpit und Außenansicht prüfen.
- **Tageszeit und Leben:** Zufällige Stimmung pro Rennen sowie allmählicher Tag-Dämmerung-Nacht-Übergang über die drei Runden (Wunschbeispiel: erste Runde Tag, zweite dunkler, dritte Nacht). Sonne sichtbar machen, Vögel am Tag; nachts Mond, Mondschatten, Sterne, Fledermäuse. Blätter/kleine Partikel, Zeitungen/Müll und abfallende Fahrzeugteile, die zeitweilig liegen bleiben und später verschwinden.
- **Hupen/Stimmen:** echte, identifizierbare historische Live-/Archivaufnahmen aus dem Internet; keine TTS und keine neu vorgelesenen Texte. Quellen, Person, Ausschnitt, Inhalt und kostenlose Nutzungsrechte prüfen, bevor etwas heruntergeladen oder eingebaut wird. Marcels Formulierung zur Stimmfarbe: „schwarz“/markant und wiedererkennbar; die genaue Klangrichtung bei Hörbeispielen klären.

Herkunft: Marcel, diktierte Ideen am Handy, 04.10.2026. Das ist ein aktueller Arbeitsauftrag für morgen; konkrete Schadenwerte, Explosions-/Respawn-Regeln und Tageszeitwahrscheinlichkeit sind noch festzulegen und zu testen. Relevante bestehende Gedanken: [Schadens-/Fahrregeln](docs/07-gameplay-systems.md), [Art Direction](docs/02-art-direction.md), [historische Kontaktentscheidungen](docs/12-decision-log.md), [Langzeitziele](LONG-TERM-GOALS.md).

### 05.10.2026 – Fortsetzung des autonomen Modell-/Weltauftrags – Marcel

Marcel beauftragt, nach der aktuellen Modellaufgabe weitere bestätigte Ziele bis nahe ans offizielle Nutzungslimit umzusetzen. Kurzfristige Reihenfolge und Limitpuffer gelten unverändert. Das Kanalspray und selektive Townhouse-Fassadenvarianten sind technisch umgesetzt; beim Itemschaden wurde zusätzlich ein zuvor übersehener Trefferfall im Panzerzustand korrigiert. Laufzeit-/Effekt- und menschliche Stil-/Fahrabnahmen bleiben separat von Build und Tests. Unbestätigte Gestaltungsideen werden nicht als Zustimmung behandelt. Der letzte offizielle Stand nach dem Gesichts-Teilpass: 8 % Fünf-Stunden- und 43 % Wochenverbrauch; die Woche bindet. Details stehen in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).

Das bestätigte M3-Weltpaket „Übungskrater mit echter Bergung und lesbares Schotter-/Grasfeedback“ ist umgesetzt. Spieler und Bots nutzen dieselben Regeln; menschliche Sicht-/Fahrabnahme bleibt getrennt. Offizieller Stand nach dem Paket: 10 % Fünf-Stunden-Verbrauch und 43 % Wochenverbrauch (90 %/57 % Rest; Woche bindet). Keine Resets/Zusatzkontingente eingesetzt; weiterarbeiten, bis ein bindendes Limit rund 15 % Rest erreicht, dabei etwa 5 % Reserve halten.

**Cast-Regressionsfix (Codex, 05.10.):** Frisch geladene Fahrerwahl zeigte Hitlers Schnurrbart nicht, obwohl ein älterer Eintrag ihn als erledigt bezeichnete. Die alte kleine Quaderform wurde durch zwei sichtbare modellierte Bartflügel ersetzt. Blender-Neubau, GLB- und Cast-Regression, Produktionsbuild und alle sechs Live-Porträts geprüft. Menschliche Stilabnahme des Gesamtmodells bleibt offen.

**Budget-/Folgepaket (Codex, 05.10.):** Nach dem Cast-Regressionspaket zeigt die offizielle Codex-Anzeige 12 % Fünf-Stunden- und 44 % Wochenverbrauch. Die Woche bindet (56 % Rest). Als nächstes ist der bestätigte M3-Laufzeitpass Stalin/Limousine in Front-, Profil-, Nah- und Bewegungsansicht vor Codeänderungen dokumentiert.

**Budget-/Folgepaket (Codex, 05.10., aktualisiert):** Nach dem Stalin-Mützenexport zeigt die offizielle Codex-Anzeige 14 % Fünf-Stunden- und 44 % Wochenverbrauch (86 %/56 % Rest; Woche bindet). Der Mützen-Teilpass ist umgesetzt; nächstes bestätigtes Paket ist der reale Wasser-/Kontaktpartikelbeleg. Keine Resets/Zusatzkontingente aktiviert.


### 2026-10-05 – Weiterarbeit an bestätigten Langzeitzielen (Marcel-Auftrag)

**Auftrag/Status:** Marcel bat nach dem aktuellen Paket um weitere bestätigte Ziele bis nahe ans Nutzungslimit. Das M3-Welt-Merge-/Exportpaket ist nach Vollbau, GLB-Prüfung, 66/66 Tests, Produktionsbuild und echtem Browserlauf technisch abgeschlossen. Die automatisierte Fassaden-Nahansicht liegt bei docs/evidence/world-facade-closeup-hybrid-m3.png; menschliche Stilabnahme ist nicht vorgetäuscht. Als Nächstes ist das bestätigte M7-Leistungspaket vor jeder Optimierung als Instrumentierungs-/Hotspot-Audit in CURRENT-WORKLIST.md gewählt.

**Offizieller Limitstand nach dem Paket:** 7 % im Fünf-Stunden-Fenster und 50 % im Wochenfenster verbraucht (93 %/50 % Rest; Woche bindet). Keine Credits, Resets oder Zusatzkontingente eingesetzt.


### 05.10.2026 – Sarah: heutige Babylon-Änderungen

Für die neue Babylon-Version habe ich die Steuerung für Items festgelegt: Rohrpost und Suchauftrag mit E+V nach vorn und E+H nach hinten; E allein behält Schild und Standardwurf. Der Fotomodus liegt auf F, die Sprachhupe auf V. Der seltene Zensurbalken kam als viertes Item zurück. Kims „Propaganda-Sieg“ wurde anhand der historischen Archividee neu umgesetzt: zehn Sekunden goldene Paradeveredelung für Fahrer und Kart, kurzer Triumphschub und anschließender Motoraussetzer. **Sarahs gewünschter Bannertext:** „Rennergebnis NICHT manipuliert. Kim Jong-Un freut sich über seine demokratische Bestzeit.“ Bei der Nachprüfung folgt eine zweite Bannerphase mit Motorstottern; die tatsächliche Platzierung bleibt unverändert. **Status:** im Babylon-Arbeitsbranch umgesetzt; 51/51 Tests und Produktionsbuild bestanden, beide Bannerphasen im Browser geprüft.

**Integrationsstatus (Codex, 05.10.2026):** Diese Sarah-Änderungen waren in `origin/main` bei `b3df669` enthalten und wurden in Marcels Abschlussbranch inhaltlich mit dem Touch-/HUD-Stand zusammengeführt. Kombinierter Stand: 71/71 Tests und Produktionsbuild bestanden; weitere menschliche Spiel-/Stilabnahme bleibt offen.

- **Hinweis Claude 06.10.2026 (an Marcel und Sarah, Status: offen zur Sichtung):** Bitte das neue Rennen einmal selbst fahren und vor allem den Spree-Kai, die Säulen-Haarnadel und Hitlers Nahansicht (Fahrerwahl, Kamera C) ansehen sowie den neuen Motor anhören. Rückmeldung zu Gesicht, Fassaden und Klang in CURRENT-WORKLIST.md eintragen lassen. Belege: docs/evidence/after-redesign-*.png und hitler-anchor-*.png.
