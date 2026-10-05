# Claude-Arbeitsauftrag: Sichtbarer Qualitätssprung für Diktator Kart

**Stand:** 06.10.2026
**Verwendung:** Diesen Auftrag in Claude mit Zugriff auf den gemeinsamen Projektordner geben.
**Aktive Leitbasis:** [Marcels Projektfragebogen](../PROJECT-QUESTIONNAIRE.md) und [aktives Projektgrundgerüst](23-project-design-baseline.md). Sarahs bestehende Ideen und Antworten bleiben unverändert; ihre Rückmeldung ist kein Start- oder Freigabegate.

## Auftrag

Arbeite im vorhandenen Babylon.js-Projekt auf einen klar sichtbaren, belegten Qualitätsfortschritt hin. Priorisiere wenige zusammenhängende, große Pakete, die im echten Rennen erkennbar sind. Kein langes Verzetteln in Kleinstkorrekturen, kein umfangreicher Ist-Bericht ohne anschließende Umsetzung und keine Behauptung, dass Konzeptbilder bereits Laufzeitqualität beweisen.

Das gewünschte Erlebnis: ein zugängliches, übbares und chaotisch-komisches Arcade-Rennspiel mit schwarzem Humor über die Selbstdarstellung historischer Diktatoren. Darstellung möglichst faktennah und erkennbar; reale Opfer sind kein Ziel des Spotts. Art Direction: hochwertig stilisiert, glaubwürdig erwachsen, filmisch, keine Chibi-/Spielzeug-/Trecker-Anmutung. Gemeinsame Kart-Grundarchitektur, aber personenspezifische Silhouetten. Erster vollständiger Qualitätsanker: **Hitler samt individuellem Kart**. Der Startkader bleibt die bestehende Sechsergruppe.

## Zuerst: sichere Bestandsaufnahme und ehrliches Vorher

1. Lies `AGENTS.md`, die vier Arbeitsdateien, `README.md`, `docs/23-project-design-baseline.md`, `docs/22-current-game-state.md`, `docs/22-character-vehicle-quality-master.md`, `docs/evidence/README.md` und die betroffenen Produktionsanleitungen. Bei Konflikten haben Marcels aktive Basis und der jüngste Auftrag Vorrang. Sarahs Beiträge nicht umschreiben.
2. Prüfe `git status`, `git log -1` und den Projektstart-/Teamworkflow. Arbeite nur im Hauptordner und aktuellen persönlichen Branch gemäß Projektregeln. Bewahre sämtliche vorhandenen Änderungen; sichere vor riskanten Eingriffen einen nachvollziehbaren Checkpoint. Kein Force-Push und kein ungeprüftes direktes Schreiben auf `main`.
3. Prüfe Evidence anhand Datum, Szene und Commit. Viele ältere Bilder sind frühere Zwischenstände. Ein Studio-Render oder Blender-Preview ist kein Runtime-Beleg. Es ist bislang **kein frischer, verifizierter normaler Renn-Render des aktuellen Heads** nachgewiesen; eine alte `?world=lab`-Aufnahme zeigt ausdrücklich nur eine Testszene.
4. Starte das normale Spiel in einem **sichtbaren Google-Chrome-Fenster**. Nimm ein knappes Vorher-Paket auf: Gesamtfahrt/Sechs-Kart-Szene, ausgewählter Fahrer samt Kart in spielnaher Ansicht und einen relevanten Welt-/Wassermoment. Dateinamen, Commit, Browserfenstergröße, Kamera, Szene und Datum notieren. Falls ein Moment nicht zuverlässig erreicht wird, als offen kennzeichnen statt ein ähnliches Bild als Beleg auszugeben.
5. Prüfe offizielle verfügbare Budgetwerte. Bei ungefähr 15 % Rest im bindenden Fenster keine neue Großaufgabe beginnen; laufendes Paket sauber beenden, Belege/Dokumente/Checkpoint sichern und mindestens etwa 5 % für den Nutzer übrig lassen. Keine zusätzlichen Kontingente oder Resets aktivieren. In längeren Blender-, Browser- oder Buildläufen CPU/RAM und selbst gestartete Prozesse gelegentlich prüfen. Nur eigene, eindeutig identifizierte Testinstanzen schließen.

## Umsetzung: nacheinander priorisieren

### Paket A – Konzeptblatt und erster Fahrer-/Kart-Anker

Erstelle zuerst ein **eigenständiges Konzeptblatt** für Hitler und sein individuelles Kart. Ansichten: Hero-Dreiviertel, Front, Seite, Heck, wichtige Details und eine kleine Rennwelt-Einordnung; neutrale Bühne für sauberes Lesen der Formen. Das Konzept soll die aktive Art Direction erfüllen und als nachvollziehbare Modellierungsreferenz dienen. Keine Kopie konkreter Logos, Regimezeichen oder Bildkompositionen der Ladebild-Referenz. Quellenbasierte historische Details dokumentieren.

Danach die editierbaren Blender-Quellen und optimierten Laufzeitmodelle wirklich überarbeiten und integrieren. Verbindliche Prüfpunkte: erwachsene Kopf-/Gesichtsanatomie und klare erkennbare Merkmale einschließlich Schnurrbart und Mund; plausible Augen, Nase, Hals/Kragen und Sitzpose; Hände mit richtig ausgerichteten Handgelenken sichtbar am Lenkrad; historisch begründete Kopfbedeckung nur, wenn belegt; individuell geformtes, niedriges Straßenrenn-Kart der 1920er/30er mit eigener Silhouette, guten Materialien und Gebrauchsspuren. Alle Räder müssen während Sprung/Rotation konsistent mitdrehen und mit der Karosserie zusammen glaubwürdig wirken. Keine aufgesetzten Detailteile, die im Front-/Profilbild anatomisch schweben.

### Paket B – ein starker, begrenzter Weltabschnitt

Wähle den Abschnitt mit dem größten im echten Rennen sichtbaren Gewinn und baue ihn als zusammenhängendes Paket: glaubwürdige historische Berlin-/Stadionfassaden mit räumlicher Tiefe, lesbarer Straße/Pflaster und klarer Streckenführung. Bevorzuge eine erkennbare Hero-Fassade oder Stadionfront statt vieler gleichförmiger Kleinobjekte. Wasser braucht eine erkennbare bewegte Oberfläche und einen sichtbaren, zuverlässig auslösenden Kontakt-/Spritzmoment beim Überfahren. Staub, Wasser oder Funken müssen in Bewegung gut lesbar sein und rasch verschwinden. Keine große Welt neu behaupten, wenn nur ein Abschnitt fertig und abgenommen ist.

### Paket C – klare Spiel-/Audio-Rückmeldung

Nur soweit A/B abgeschlossen und Budget verbleibt: einen vertikalen Audio-Pass mit eigenständigem orchestralen Rennmarsch, nach Drehzahl reagierendem Motor, kurzen materialabhängigen Reifentönen sowie unterscheidbaren Item-/Trefferlauten. Publikum/Sprecherin dezent bei voller Fahrt. Keine Archivstimmen ohne überprüfte Nutzungsrechte. Vorhandene kostenlose Quellen und Lizenzen dokumentieren; Audio nicht übersteuern.

### Paket D – nutzbarer Systemfortschritt

Arbeite nur konkrete, schon dokumentierte oder im echten Spiel belegte offene Funktionslücken ab: Iteminventar sichtbar und auswählbar; Treffer durch Items verursachen in nachvollziehbaren Stufen Fahrzeugschaden bis zum Ausfall; vorhandene Kollision-/Schadensregeln erhalten. Vor dem Ändern Ist-Verhalten prüfen, in einer echten Runde testen und dieselbe Funktion aus Fahrersicht abnehmen. Keine neuen Features erfinden, die den Qualitätsanker unterbrechen.

## Laufende Selbststeuerung

- Nach jedem Paket kurz prüfen: Hat sich für den Spieler sichtbar etwas Großes verbessert? Bin ich an Feindetails, während Anker, Weltabschnitt oder Abnahme fehlen? Wenn ja, auf das größte offene Paket wechseln.
- Nicht parallel dieselbe Projektdatei bearbeiten lassen. Worker-Ergebnisse nur als getrennte Analyse nutzen; Code-/Assetänderungen bleiben in einem klaren Branch-/Dateiverantwortungsfluss.
- Keine ganzen Nächte oder Erfolgsmengen versprechen. Das Zeitfenster dient als Arbeitsbudget; technische, Modellierungs- und Abnahmerisiken bestimmen, welche Pakete tatsächlich fertig werden.
- Erst nach einer klaren, prüfbaren Abnahme ein weiteres Paket anfangen. Zwischenstände bei einem KI-/Toolwechsel, vor riskanten Produktionsasset-Neubauten oder nahe Budgetgrenze sichern.

## Abnahme je sichtbarem Paket

1. Gleichartige aktuelle Vorher-/Nachherbilder aus sichtbarem Chrome, idealerweise gleiche Szene, Kameraposition, Fenstergröße, Wetter und Grafikoption.
2. Fahrer/Kart zusätzlich aus Front, Dreiviertel, Profil und echter Rennfahrt; beim Weltpaket eine Nahansicht plus Fahrt/Kontakt. Konzept- und Runtimebilder getrennt kennzeichnen.
3. Build und passende Regressionen ausführen, soweit die Projektregeln/der Auftrag Tests verlangen; Fehler beheben oder klar dokumentieren. Screenshot ersetzt weder Funktionstest noch menschliche Stilbeurteilung.
4. Technische Belege mit aktuellem Commit und Gerät. 60 FPS auf älteren/integrated GPUs bleibt Ziel, bis eine dokumentierte Messszene es belegt; keine RTX- oder Menüaufnahme als Low-end-Nachweis ausgeben.
5. Vier Hauptdateien, betroffene Fachdateien und `PROGRESS-LOG.md` aktualisieren: Erledigt, offen, Blocker, Belege, nächste priorisierte Aufgabe. Alte Einträge als Historie erhalten.
6. Am Ende kurz berichten: Was ist im Spiel sichtbar anders? Welche Quelle/Exports wurden geändert? Was wurde tatsächlich geprüft? Was blieb offen? Kein Push auf `main`, sofern der Nutzer keinen Projektabschluss mit Veröffentlichung beauftragt hat.

## Nachtziel / realistischer Umfang

Der wertvollste Zielzustand ist **ein wirklich überzeugender Hitler-/Kart-Anker samt sichtbarem, spielbarem Weltmoment und belegtem Vorher/Nachher**. Danach den Wasser-/Umgebungsabschnitt oder den Audio-/Itemschritt fertigstellen – abhängig davon, was technisch gerade am weitesten trägt. Wenn nicht alles in einer Sitzung fertig wird, keine Attrappen abhaken: den letzten vollständigen Paketstand dokumentieren, sichern und mit dem nächsten konkreten, sichtbaren Schritt enden. Die ganze Strecke, alle sechs vollwertigen Modelle und sämtliche Audio-/Systemziele bleiben mehrere Qualitätsmeilensteine, kein glaubwürdiges Ein-Nacht-Versprechen.
