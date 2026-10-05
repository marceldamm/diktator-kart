# TEAM NOTES – Notizen und gemeinsame Anleitung

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Anleitung, persönliche Notizen und Teamnachrichten. Notizen/Vorschläge sind keine Zustimmung oder Umsetzung. Erledigte Notizen erhalten einen Ergebnisverweis statt kommentarlos gelöscht zu werden. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

## Schnellhilfe – alles einfach der KI sagen

**Ihr müsst diese Dateien nicht selbst beschreiben.** Diktiert oder schreibt eure Wünsche in Codex; die KI trägt sie passend ein und hält die Arbeitsgrundlage aktuell.

| Kurzer Befehl / Beispiel | Was die KI macht |
|---|---|
| **Projekt Start** | GitHub synchronisieren, lokale Arbeit bewahren, vier Tabs öffnen, Aufgaben und Nachrichten zeigen. Auch **Projektstart** funktioniert. |
| **Projekt Ende** | Arbeit sichern, dokumentieren, prüfen und den geprüften Teamstand nach GitHub main hochladen. Auch **Projektabschluss** funktioniert. |
| **Arbeite unsere Arbeitslisten ab** | Erst kurzfristige Aufgaben umsetzen, danach bestätigte langfristige Ziele selbstständig in Paketen bearbeiten; Fortschritt dokumentieren und Budgetreserve beachten. |
| **Heute möchte ich …** | Als aktuellen Auftrag in CURRENT-WORKLIST.md aufnehmen und bearbeiten. |
| **Langfristiges Ziel: …** | In LONG-TERM-GOALS.md aufnehmen. |
| **Notiere: …** | Beobachtung/Frage mit Herkunft hier in TEAM-NOTES.md festhalten. |
| **Nachricht an Sarah: …** / **Nachricht an Marcel: …** | Als datierte Teamnachricht hier festhalten; beim nächsten Projektstart dem angesprochenen Teammitglied zeigen. |

**Diktator-Kart-starten.cmd:** Spiel aus dem aktiven Projektordner öffnen.

**Projekt-starten.cmd:** Einfachen Git-Start ausführen. **Projekt-abschliessen.cmd:** Einfachen geprüften Git-Abschluss ausführen. Bei Konflikten/ungesicherten Dateien hilft Codex; die Batches selbst sind keine KI. Der Spielstarter synchronisiert GitHub nicht.

**Limit-Puffer für beide:** Die KI prüft eure eigenen offiziellen Fünf-Stunden-/Wochenwerte. Ab etwa **15 % Rest** beginnt sie keine große Aufgabe mehr und schließt geordnet ab; Ziel: mindestens etwa **5 % für euch übrig**. Ohne Zugriff meldet sie das und nutzt einen vorsichtigen Puffer. Keine automatischen Resets oder Zusatzkosten. Details in [AGENTS.md](AGENTS.md).

Details zu Dateien, Zusammenarbeit und Modellwahl stehen darunter.

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

### 04.10.2026 – Marcel: nächste Qualitätsstufe

Alles deutlich schöner, realistischer und hochwertiger machen: viel bessere Modelle, Charaktere, Fahrzeuge, Strecke, Umfeld, Effekte, Sounds, Stimmen und Musik. Maßstab ist unsere gewählte Bildpräferenz. **Keine Text-to-Speech-Stimmen als Endergebnis.** Status: Ziel verankert, Umsetzung/Abnahme offen; Details in [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md).

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

### 05.10.2026 – Sarah: heutige Babylon-Änderungen

Für die neue Babylon-Version habe ich die Steuerung für Items festgelegt: Rohrpost und Suchauftrag mit E+V nach vorn und E+H nach hinten; E allein behält Schild und Standardwurf. Der Fotomodus liegt auf F, die Sprachhupe auf V. Der seltene Zensurbalken kam als viertes Item zurück. Kims „Propaganda-Sieg“ wurde anhand der historischen Archividee neu umgesetzt: zehn Sekunden goldene Paradeveredelung für Fahrer und Kart, kurzer Triumphschub und anschließender Motoraussetzer. **Sarahs gewünschter Bannertext:** „Rennergebnis NICHT manipuliert. Kim Jong-Un freut sich über seine demokratische Bestzeit.“ Bei der Nachprüfung folgt eine zweite Bannerphase mit Motorstottern; die tatsächliche Platzierung bleibt unverändert. **Status:** im Babylon-Arbeitsbranch umgesetzt; 51/51 Tests und Produktionsbuild bestanden, beide Bannerphasen im Browser geprüft.
