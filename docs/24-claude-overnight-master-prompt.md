# Claude-Masterauftrag: Diktator Kart umfassend neu gestalten

**Stand:** 06.10.2026
**Verwendung:** Diesen Auftrag Claude mit Zugriff auf den gemeinsamen Repository-Hauptordner geben.
**Arbeitsbasis:** Aktuelle Babylon-Hauptbasis, aktive Grundpfeiler in [docs/23-project-design-baseline.md](23-project-design-baseline.md), Marcels [Projektfragebogen](../PROJECT-QUESTIONNAIRE.md) und Teamablauf in [docs/21-team-workflow.md](21-team-workflow.md).

## Dein Auftrag

Überarbeite Diktator Kart zu einem sichtbar neuen, zusammenhängenden Spiel. Die Strecke soll größer, abwechslungsreicher, historisch stimmiger und räumlich überzeugend werden. Die Umgebung soll wie eine bewusst entworfene Welt wirken, nicht wie eine Sammlung bisheriger Prototyp-Objekte. Baue Häuser, Bäume, Straßenmöbel, Schilder, Fahnen, Möbel, Tribünen, Dekoration, Oberflächen, Beleuchtung, Effekte und Klangwelt konsequent weiter. Überarbeite außerdem das erste vollständige Fahrer-/Kart-Paar – Hitler samt eigenständigem Kart – anhand des passenden Konzeptbildes.

Arbeite als Art Director, Umgebungsdesigner, Blender-Modellierer, Babylon.js-Entwickler und Sounddesigner. Denk in großen, zusammenhängenden Bildern und spielbaren Ergebnissen. Suche nach dem stärksten visuellen und akustischen Qualitätssprung; verliere den Auftrag nicht in einer langen Reihe kleiner Einzelkorrekturen. Setze innerhalb der verfügbaren Sitzung so viel des Redesigns wirklich in editierbaren Quellen und im laufenden Spiel um, wie du hochwertig integrieren und prüfen kannst.

Das vorhandene Rennen, die Steuerung, Items, Fahrer, Kameras, Menüs, Fortschritt und Kernregeln funktionieren und sollen erhalten bleiben. Der Schwerpunkt ist eine neue visuelle und akustische Identität; ändere etablierte Spielmechaniken nur, wenn eine konkrete Integrationsnotwendigkeit besteht. Senke weder Stil- noch Performanceziele stillschweigend ab.

## Verbindliches Gestaltungsziel

Das Spiel soll hochwertig stilisiert, erwachsen, filmisch und materialreich aussehen – historisch inspiriert und als Diktator-Kart-Welt klar erkennbar. Die Figuren sollen ihre realen historischen Gesichter und Silhouetten wiedererkennbar tragen. Die reale Geschichte und Opfer sind kein Ziel des Spotts; Humor entsteht durch groteske Selbstdarstellung, Kulisse, Situationen und Slapstick. Die Welt soll die gewählte Referenzfamilie G–L, besonders [style-comparison-02-c-a-refined.png](../references/visuals/style-comparison-02-c-a-refined.png), ernst nehmen und die Qualität des vorhandenen Konzept-Ladebildes in echte 3D-Laufzeitgrafik übersetzen. Keine Chibi-, Spielzeug- oder Trecker-Anmutung.

Ein einheitliches Art-System verbindet Strecke, Architektur, Fahrzeuge, Requisiten, Partikel, Licht und Sound: zusammengehörige Farbpalette, glaubwürdige Maßstäbe, klare Formhierarchien, hochwertige Materialien, abgestimmte Alterung, lesbare Kontraste und gezielt gesetzte Blickpunkte. Der Kurs bleibt in jeder Kamera verständlich und gut befahrbar.

## Arbeitsweise und Referenzen

1. Lies zuerst `AGENTS.md`, die vier Hauptdateien, `README.md`, `START-HERE.md`, `PROGRESS-LOG.md`, `docs/21-team-workflow.md`, `docs/23-project-design-baseline.md`, `docs/22-current-game-state.md`, `docs/22-character-vehicle-quality-master.md`, `docs/16-production-blueprint.md`, `docs/evidence/README.md` und die betroffenen Asset-/Streckenunterlagen.
2. Prüfe vor Änderungen `git status`, `git log -1`, Branch und Remote; führe den Projektstart mit `git fetch origin` aus, sichere vorhandene Arbeit und arbeite auf dem persönlichen Arbeitsbranch. Wenn Fetch, Zugang oder Konflikte blockieren, sichere nichts destruktiv und behaupte keine Aktualität. Arbeite ausschließlich im gemeinsamen Repository-Hauptordner; nie gleichzeitig mit einer anderen KI.
3. Sichte `references/visuals/`, `art-source/`, Ladebild und vorhandene Konzept-/Evidence-Bilder. Das gesuchte Sechs-Bilder-Blatt ist `references/visuals/style-comparison-02-c-a-refined.png`: eine 2×3-Collage der Richtungen G–L, aus derselben Konzeptfamilie wie `art-source/loading-stadium-v1.png`. Lies alle sechs Panels und die zugehörige `references/visuals/README.md`; nutze sie als starke Art-/Atmosphärenreferenz. Für Hitler/Kart sind besonders die beiden linken Panels (G und J) relevant. Übertrage deren Qualität, Licht, Materialfülle und Bildwirkung eigenständig in historisch stimmige, spielbare 3D-Modelle. Die Collage ist weder ein fertiges Modell noch eine exakte Vorlage für politische Zeichen. Konzept, Blender-Vorschau und alte Screenshots sind keine aktuelle Spielabnahme.
4. Prüfe vorhandene Blender-Quellen, GLB-Laufzeitassets, Szenenaufbau, Assetverträge, Streckenlayout, Performanceziele und aktive Systeme. Verstehe, welche Modelle modular, wiederverwendbar und in Blender editierbar bleiben müssen.
5. Erstelle eine kurze, priorisierte Redesign-Skizze mit dem neuen Streckenbild, Maßstabs-/Routenänderungen, visuellen Ankern, Assetfamilien, Audioidee und technischen Risiken. Beginne danach mit der Umsetzung; die Skizze ist kein Ersatz für ein sichtbares Ergebnis und kein Freigabegate.

## Redesign-Pakete – groß denken, sinnvoll bündeln

### 1. Die Strecke als neue, größere Welt

Gestalte den bestehenden Kurs als zusammenhängenden, deutlich aufgewerteten historischen Berlin-/Stadion-Rundkurs neu. Vergrößere und verändere die Strecke sichtbar: nutze die vorhandene Streckenarchitektur als Ausgangspunkt, entwickle abwechslungsreichere Abschnitte, stärkere Höhen-/Raumwirkung, sinnvoll gesetzte Kurven und glaubwürdige Randzonen. Entscheide die konkreten Änderungen selbst anhand des aktuellen Kurses und seiner Fahrbarkeit. Die Strecke muss in der Fahrt wirklich größer und anders wirken, nicht nur durch zusätzliche Kulissenobjekte.

Entwirf einen klaren visuellen Spannungsbogen mit unterschiedlichen Stadt- und Stadionmomenten, markanten Fernzielen, glaubwürdigen Übergängen, lesbarer Streckenführung und wiedererkennbaren Orientierungspunkten. Pflaster, Bordsteine, Gras, Erde, Wasser und Übergänge sollen maßstäblich, überzeugend und passend reagieren. Verbinde historische Architektur und satirische Rennveranstaltung stimmig, ohne beliebige Dekorfülle.

### 2. Umgebung und Blender-Modelle

Überarbeite wichtige Objektfamilien als hochwertige, wiederverwendbare Blender-Modelle mit stimmiger Geometrie, Proportion, Material, UVs, Texturen und Alterung. Dazu gehören insbesondere Gebäude/Fassaden, Dächer, Fenster, Türen, Bäume/Vegetation, Tribünen, Straßenmöbel, Bänke, Lampen, Absperrungen, Schilder, Fahnen, Banner, Markierungen, Möbel und kleine Rennwelt-Details. Nimm vorhandene Objekte in die neue Umgebung auf, wenn sie sich dadurch sinnvoller und lesbarer nutzen lassen; behalte sie nicht aus Gewohnheit in ihrer bisherigen Form.

Erzeuge lieber ein durchdachtes Set hochwertiger modularer Modelle und prägnanter Hero-Bauten als viele austauschbare Kleinobjekte. Modelle sollen aus echter Rennkamera funktionieren: gute Silhouette aus der Ferne, glaubwürdige Oberfläche in der Nähe, korrekte Maßstäbe und keine schwebenden, durchdringenden oder zufällig platzierten Details. Variiere wiederholte Assets kontrolliert.

Du darfst kostenlose, frei verfügbare Modelle, Texturen, Audio- oder andere Assets aus dem Internet beschaffen und in Blender bearbeiten, wenn das den Qualitätssprung unterstützt. Prüfe vor Integration Lizenz, erlaubte Bearbeitung/Weitergabe, Namensnennung und kommerzielle Einschränkungen; bevorzuge CC0 oder ähnlich klare freie Bedingungen. Halte Quelle, Lizenz, Urheber, Änderungen und nötige Credits in `public/assets/CREDITS.md` oder der passenden Assetdokumentation fest. Keine bezahlten Angebote, Abos, ungeklärten Rechte oder fremden Regime-/Markenlogos einbauen. Bevorzuge bearbeitbare Quellen, speichere neue Modelle in den vorgesehenen `art-source/`-Pipelines und exportiere optimierte Runtimeassets mit den bestehenden Verträgen.

### 3. Erster vollständiger Fahrer und Kart

Überarbeite Hitler samt individuellem Kart als geschlossenes, hochwertiges Qualitätsanker-Paar. Nutze das identifizierte Sechs-Bilder-Konzeptblatt als konkrete Modellierungsreferenz und vergleiche es mit dem Konzept-Ladebild und der festgelegten Art Direction. Übertrage die Formen und Qualitätsidee eigenständig in die Laufzeit; kopiere keine geschützte Bildkomposition, fremde Figuren oder politische Zeichen.

Der Fahrer braucht ein glaubwürdiges, wiedererkennbares Gesicht und einen anatomisch zusammenhängenden Kopf-/Hals-/Kragen-/Körperaufbau, passende historische Kleidung, natürliche Sitzhaltung, sichtbare Hände am Lenkrad sowie stimmige Proportionen in Menü, Nahansicht und Fahrt. Das Kart erhält eine eigene, klar erkennbare klassische Straßenrenn-Silhouette der 1920er/30er Jahre, hochwertige Karosserie, Räder, Fahrwerk, Materialien und Details. Es bleibt ein niedriges Rennkart und wird kein Traktor. Bewahre die gemeinsamen Animations-/Rad-/Fahrzeugverträge für den Kader und prüfe, dass das neue Asset im Babylon-Spiel korrekt lädt und sich bewegt.

### 4. Licht, Material, Effekte und Audio

Stimme Tageszeit, Himmel, Schatten, Nebel/Atmosphäre, Farbtemperatur, Oberflächen und Effekte über die ganze Strecke ab. Wasser, Staub, Gras, Funken, Reifen und Kontaktmomente sollen im Spiel sichtbar und verständlich reagieren, ohne die Fahrbahn oder Gegner zu verdecken. Setze Effekte gezielt und performant ein. Sound erhält ebenfalls einen zusammenhängenden Pass: Musik, Motor, Reifen, Untergrund, Wasser, Kollisionen, Items, Publikum und Ansagen sollen charaktervoll, dynamisch, räumlich passend und sauber gemischt sein. Bestehende Audio-/Sprachquellen nur mit geklärten Rechten verwenden; keine Archivstimmen ohne überprüfte Nutzungserlaubnis.

## Priorität und Autonomie

Arbeite selbstständig und ohne Rückfrage an normalen Modellierungs-, Stil-, Material-, Layout- und Integrationsentscheidungen. Marcels aktive Basis ist maßgeblich; Sarahs Originalideen bleiben unverändert und werden nicht als bestätigt umgeschrieben. Frage nur bei echter, nicht auflösbarer Kreativentscheidung, fehlendem Zugang oder rechtlicher/technischer Blockade. Setze keine neue Grundsatzentscheidung über die Produktpfeiler.

Beginne mit dem vollständigen Welt-/Streckenbild und dem Hitler-/Kart-Konzeptanker. Entwickle parallel dazu ein gemeinsames Modell-/Materialsystem, damit neue Objekte zueinander passen. Baue die Umgebung und den Kurs in großen zusammenhängenden Bereichen aus, integriere den ersten Fahrer/Kart-Anker, danach Licht, Effekte und Audio. Wenn ein Paket mehr Zeit braucht, liefere einen integrierten, sichtbar großen Abschnitt plus wiederverwendbare Grundlagen und führe die restlichen Bereiche mit einem präzisen nächsten Arbeitsschritt auf. Ersetze das Ziel eines umfassenden Redesigns nicht still durch ein kleines Detailpaket oder nur ein Konzeptbild.

Nach jedem großen Zwischenstand kurz prüfen: Ist die Strecke in Fahrt wirklich größer und eigenständiger? Wirken Modelle, Materialien und Licht wie ein Spiel aus einem Guss? Ist der erste Fahrer samt Kart deutlich überzeugender? Sind die bewahrten Systeme weiterhin intakt? Falls nicht, zum größten sichtbaren Problem zurückkehren.

## Budget, Sicherung und Veröffentlichung

Prüfe die offiziellen Claude-Limitanzeigen zu Beginn und regelmäßig während der langen Sitzung. Es gilt die gemeinsame Budgetregel aus `AGENTS.md`: Bei ungefähr **15 % Rest in einem der maßgeblichen Limits** keine neue Großaufgabe beginnen. Schließe die laufende sinnvolle Einheit ab, aktualisiere Spielbelege und Dokumentation, lege einen nachvollziehbaren lokalen Checkpoint an und bewahre mindestens etwa 5 % für den Abschluss und Marcels nächste Nachricht. **98 % Verbrauch ist eine absolute Notgrenze, kein Arbeitsziel.** Ist sie unerwartet erreicht, sofort neue Umsetzung stoppen und nur die unbedingt nötige Sicherung/Statusdokumentation versuchen. Keine Zusatzkontingente oder kostenpflichtigen Dienste aktivieren.

Sichere regelmäßig auf dem persönlichen Branch, insbesondere vor großen Binärasset-Neubauten, an Paketgrenzen und vor knappem Budget. Halte Blender-Quellen, Runtime-Exports, Lizenzen/Credits und Dokumentation zusammen. Überschreibe keine fremde Arbeit, nutze keinen Force-Push und löse Konflikte nie blind. Beende nach erfolgreicher Abnahme den ausdrücklich gewünschten Projektabschluss: Arbeitsbranch sichern, neuesten gemeinsamen `main` integrieren, betroffene Prüfungen wiederholen und nach dem verbindlichen Teamworkflow normal nach `main` veröffentlichen. Der Nutzer hat diesen Abschluss für diesen Auftrag ausdrücklich gewünscht. Wenn Schutz, Konflikt, Berechtigung oder Budget den sicheren Abschluss verhindert, erhalte den geprüften Stand auf dem Arbeitsbranch, benenne den konkreten Blocker und behaupte keinen Main-Push.

## Sichtbare Abnahme und Dokumentation

1. Vor der größeren Umsetzung eine aktuelle normale Rennansicht in **sichtbarem, nicht minimiertem Google Chrome** sichern und Szene, Kamera, Fenstergröße, Datum, Branch und Commit notieren. Erst vorhandene Bilder auf Aktualität prüfen; historische Aufnahmen klar als Vergleich markieren.
2. Nach großen Paketen passende Runtime-Ansichten unter möglichst gleichen Bedingungen aufnehmen: Gesamtstrecke/Fernblick, Fahrt durch neue Abschnitte, Nahansichten von Architektur/Objektfamilien, Fahrer/Kart aus Front, Dreiviertel, Profil und echter Fahrt sowie relevante Wasser-/Kontakt-/Effektmomente. Konzept- und Blender-Bilder separat kennzeichnen.
3. Das normale Spiel und bestehende Kernabläufe prüfen: Start, Fahrerwahl, Rennen, Bewegung/Kameras, Pause/Neustart und repräsentative Items. Geänderte Systeme und Assetverträge gezielt testen. Build und sinnvolle Regressionen prüfen; Messungen ehrlich benennen. Keine 60-FPS- oder Geräteleistung behaupten, die nicht gemessen wurde.
4. Nach der Prüfung Renderloop pausieren und ausschließlich die eindeutig selbst gestartete Testinstanz schließen. Keine normalen Nutzerfenster oder fremden Prozesse schließen.
5. `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `PROGRESS-LOG.md`, betroffene Fach-/Assetdokumente und `docs/evidence/README.md` aktualisieren. Erledigtes, offenes, nicht verifiziertes und blockiertes klar unterscheiden. Sarahs Originalbeiträge bewahren.
6. Zum Schluss knapp berichten: Was ist in der Strecke und im Spiel sichtbar neu? Was wurde am Fahrer/Kart und Klang verändert? Welche Blender-Quellen, Assets und Dateien sind betroffen? Welche Tests und Runtime-Belege sind tatsächlich erfolgt? Was blieb offen? Welcher Commit/Branch wurde gesichert und wurde `main` nach Rücklesen wirklich aktualisiert?

## Definition eines starken Ergebnisses

Ein starkes Ergebnis ist eine klar größere und abwechslungsreiche, spielbare historische Strecke mit durchgängiger Art Direction, deutlich hochwertigeren und wiederverwendbaren Blender-Objekten, einem überzeugenden Hitler-/Kart-Anker auf Basis des Sechs-Bilder-Konzepts, stimmiger Beleuchtung/Effekten und hörbar erneuerter Atmosphäre – sichtbar im echten Rennen und begleitet von editierbaren Quellen, gültigen Credits, Funktionsprüfungen und aktuellen Vorher-/Nachher-Belegen. Arbeite mit maximalem Qualitätsanspruch innerhalb des echten Budgets; melde Fortschritt nach gelieferten, geprüften Paketen und nie nach bloß investierter Zeit.
