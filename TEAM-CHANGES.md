# Gemeinsamer Änderungsverlauf

- **07.10.2026 – Zweite Strecke, Live-Rangliste und Grand-Prix-Meisterschaft (Marcel-Auftrag, Claude):** Sarahs „Duce-Drom (Rom)“ ist als zweite Strecke spielbar (Route und Details sind Claudes Ausarbeitung, [docs/26-duce-drom.md](docs/26-duce-drom.md)). Das Hauptmenü bietet Grand Prix (Stadionring → Duce-Drom mit Punkten 10/7/5/3/2/1, Zwischen- und Gesamtwertung), Einzelrennen und Zeitfahren mit Streckenauswahl. Rechts im Rennen zeigt eine Live-Rangliste alle sechs Fahrer aus der echten Rennrangfolge. Bestzeit, beste Runde und Geist gelten je Strecke; bisherige Stadionring-Bestzeiten bleiben erhalten. Die anderen vier Strecken bleiben in Planung.

- **06.10.2026 – Öffentliche Pilotdokumentation bereinigt (Marcel):** Account-Zuordnung und Rollenangaben zum privaten Project wurden aus Issue #2, den Statuskommentaren, PR #8 und den öffentlichen Teamtexten entfernt. Die echten GitHub-Berechtigungen wurden dabei nicht geändert; der gemeinsame Praxistest bleibt offen.

- **06.10.2026 – Review-Änderungen automatisch ins Board übernehmen (Marcel):** Die GitHub-Project-Regel `Code changes requested` ist aktiviert und setzt PRs mit angeforderten Änderungen automatisch auf `In progress`. Neue PRs landen zunächst im `Backlog`; PR #8 wurde für die tatsächliche Prüfung auf `In review` gesetzt. Die Regel ist unter Workflows im privaten Project sichtbar.

- **06.10.2026 – Stadion-TV-Ruckeln vorläufig behoben (Marcel):** PR #6 integrierte den entfernten zweiten vollständigen Szenen-Renderpass samt statischem Stadionmotiv und Rennstand-Leiste in `main` (Merge `1d015da`). Sichtbarer Grand-Prix-Lauf, 72/72 Tests, Produktionsbuild und GitHub Actions sind bestanden. Issue #4 bleibt für den abschließenden Framezeitvergleich und Intel-UHD-Lauf offen.

- **06.10.2026 – GitHub-Pilot sichtbar abgeschlossen (Marcel):** PR #5 dokumentierte den tatsächlichen Pilotstand und wurde mit bestandenem `validate / tests-and-build`-Check in `main` zusammengeführt. Das private Teamboard zeigt den PR automatisch unter `Done`; der Teamzugriff für den Pilot ist eingerichtet. Issue #2 bleibt für den gemeinsamen Praxistest offen. START-HERE erklärt in Alltagssprache: Marcel nennt nur sein Ziel, Codex führt Issue/Board/PR/Checks passend dazu.

- **06.10.2026 – GitHub-Aufgabenfluss eingerichtet (Marcel; damaliger Stand):** Vier Markdown-Hauptdateien bleiben kanonisch; Issue #2, Milestone `GitHub-Workflow-Pilot`, PR #1 und privates Board `Diktator Kart – Teamarbeit` bilden den Pilot. PR #1 ist nach erfolgreichem Pflichtcheck in `main` zusammengeführt; Teil-Issue #3 wurde automatisch geschlossen. Neue Issues/PRs werden vom Board-Workflow automatisch aufgenommen. `main` verlangt PR und grünen `tests-and-build`-Check; Force-Push/Löschen sind gesperrt, keine zusätzliche Review-Stimme vorgeschrieben. Issue #4 und Milestone `Redesign-Performance-Abnahme` verfolgen die Abnahme; die damalige offene Variantenfrage wurde inzwischen mit der statischen TV-Variante beantwortet. Copilot Cloud Agent ist nicht verfügbar. Der Teamzugriff auf das private Project-Board ist vorbereitet; der gemeinsame Praxistest steht noch aus.

- **06.10.2026 – TV-Feed nur bei sichtbarem Bildschirm (Marcel):** Ein sichtbares Sechs-Kart-A/B bestätigte, dass das Stadion-TV-RenderTarget in seiner 130-m-Zone mit 2.365 Meshes jeden dritten Frame rendert und P95 von 16,8 auf 83,2–83,4 ms hebt. `src/slice-scene.ts` aktualisiert den Feed jetzt nur, wenn seine Fläche zusätzlich im Hauptkamera-Frustum liegt. Gleicher Offscreen-Punkt nach Fix: `feedRefresh=0`, Drawcalls P95 1.493 und rAF P95 16,8 ms. Gezielt 3/3 Feed-Regressionen und TypeScript-/Produktionsbuild bestanden. Menschliche Live-TV-Sichtprüfung sowie Intel-UHD-Abnahme bleiben offen; Belege/Details: [PROGRESS-LOG.md](PROGRESS-LOG.md).
- **06.10.2026 – Live-TV-Kamera deaktiviert (Marcel):** Marcel bestätigte Ruckeln beim Umdrehen zur Stadionwand; die Frustum-Schranke war dafür nicht ausreichend. TV-Zweitkamera, Szenen-RenderTarget und Kameraführung sind entfernt. Statt eines schwarzen Bildes nutzt die Wand das vorhandene statische Stadionmotiv; die aktuelle Rennstand-Leiste bleibt erhalten und lautet „DATEN“. Sichtbarer Grand-Prix-Lauf zeigte das Motiv. Produktionsbuild bestanden; Vollsuite 71/72 wegen eines separaten Teamworkflow-PR-Tests. Framezeitvergleich nach vollständiger Entfernung und Intel-UHD-Lauf stehen noch aus.

- **06.10.2026 – Streckenstart und unsichtbare Strecke (Sarah):** Die Fahrerporträtaufnahme blendete während sechs Offscreen-Renderings die Welt-Meshes aus, während der Hauptloop diesen Zwischenstand renderte. Der Hauptframe bleibt nun währenddessen stehen und der Start wartet auf die fertigen Porträts. Im sichtbaren Browser waren Strecke und alle 271 Stadt-Meshes beim Countdown wieder sichtbar. Intel-UHD-Ruckeln bleibt separat offen.

- **06.10.2026 – Streckenauswahl (Sarah):** Vor Grand Prix, Zeitfahren und erneutem Rennstart steht jetzt eine Streckenauswahl. Nur der bestehende Stadionring ist spielbar; fünf Zukunftsstrecken sind als „In Planung · nicht spielbar“ mit Orten markiert: Ewige-Führer-Alee (Pjöngjang), Kulturrevolutions-Schleife (Peking), Havanna-Revolutionsring (Havanna), Duce-Drom (Rom), Genossen-Gerade (Moskau).

- **06.10.2026 – Aktives Projektgrundgerüst aus Marcels Antworten:** Der Fragebogen ist die initiale Produktbasis; Hitler samt Kart ist der erste Qualitätsanker. Sarahs Originalideen bleiben erhalten und ihre Antwort ändert die Basis nicht automatisch. Prioritätswidersprüche in Roadmap, Arbeitsliste, Frage-/Art-/Produktionsdokumenten sind zugunsten des neuesten Auftrags als historische Vorgaben markiert. Claude-Ist-/Soll-Analyse und gestaffelter Nachtauftrag: [docs/24-claude-overnight-master-prompt.md](docs/24-claude-overnight-master-prompt.md). Sarahs Inhalte wurden nicht umgeschrieben.


- **05.10.2026 – Hitler-Schnurrbartregression:** Die im Runtime-Porträt unsichtbare kleine Quaderform in `art-source/build_kart.py` durch zwei klar lesbare Bartflügel vor der Gesichtsebene ersetzt; editierbare Blender-Datei sowie optimiertes GLB neu exportiert. Regression prüft Hitlers Castteil und reale GLB-Geometrie; 2/2 Tests, Produktionsbuild und frische sechs Live-Porträts geprüft. Gesamtmodell bleibt nicht als Qualitätsanker abgenommen.
- **05.10.2026 – Stalin-Feldmützenkrone:** Ein echter Runtime-Dreiviertelblick zeigte die Krone wie eine aufrechte Scheibe; Ursache waren vertikale statt horizontale Kronquerschnitte im Blender-Bau. Die Feldmütze nutzt jetzt waagerechte, kuppelförmige Kronringe (Exporttiefe ca. 56 cm statt 4,4 cm). GLB-/Cast-Regression, Build, sechs Live-Porträts und neue Runtime-Dreiviertelansicht geprüft. Gesamtanker bleibt offen.
- **05.10.2026 – Lid-/Mundlesbarkeit:** Lidellipsoide weichen oberen/unteren Lidkanten; Stalins Mund sitzt körpernah unter dem Walrossbart. Asset, gezielter Casttest, Build und sechs Live-Porträts geprüft. Gesamtanker und menschlicher Nah-/Profilpass bleiben offen; Details im [Fortschrittslog](PROGRESS-LOG.md).
- **05.10.2026 – Übungskrater und Untergrundfeedback:** Fallzone plus sichere gleiche-Fortschritt-Bergung an den drei Übungskratern; prozeduraler Schotter in der Abkürzung und befahrbarer Grasrand mit eigener Lenk-/Tempo-/Staubreaktion. Vollsuite 62/62 und Build bestanden; gezielte Sicht-/Fahrabnahme steht noch aus.
- **05.10.2026 – M7-Live-TV effizienter gerendert:** Das zusätzliche Stadion-TV rendert nur noch in Spielernähe (130 m). Im wiederholten A/B der gleichen Sechs-Kart-Szene sanken P50/P95-Framezeit und 617 Draws; Grafikqualität und Rennen blieben unverändert. Produktionsbuild und gezielte Regression bestanden; das Gesamtziel niedriger Laufzeit-FPS bleibt offen. Beleg im [Fortschrittslog](PROGRESS-LOG.md).
- **05.10.2026 – Regenrinnen und Ladenfronten exportiert:** Die 48 Townhouses erhielten selektive Fallrohre/Regenrinnen, verwitterte Fensterläden, Pflanzkästen und individuelle Emaille-Ausleger. Blender erzeugte das neue Runtime-GLB nach phasenweiser Instrumentierung und direkter Mesh-Erzeugung; 32 Materialgruppen halten die statische Stadt zusammen. Runtime-GLB 16,4 MB, frischer Grand-Prix-Start mit neuer Welt geprüft. Fassaden-Nah-/Stilabnahme bleibt offen; Details und 69-Minuten-Bauwerte im [Fortschrittslog](PROGRESS-LOG.md).

- **05.10.2026 – Itemschaden für Panzerform geschlossen:** Ein Item-Aufprall während der Transformation zählte mangels Spin zuvor nicht zur Haltbarkeit. Derselbe begrenzte Itemschaden wird jetzt einmal pro Treffer gezählt; normale Item-, Wand- und Kartschäden bleiben auf dem bisherigen Pfad. Regression geprüft; menschliche Balancefahrt bleibt offen. Belege im [Fortschrittslog](PROGRESS-LOG.md).
- **05.10.2026 – Stadtfassaden:** Verwitterte Fensterläden und wenige bepflanzte Ladenfenster bringen selektive Varianten in den Townhouse-Block. Der neue Blender-Export und die optimierte Weltdatei sind kleiner als der vorherige Runtime-GLB; In-Game-Nahabnahme bleibt offen. Technische Belege im [Fortschrittslog](PROGRESS-LOG.md).
- **05.10.2026 – Laden-Ausleger:** Sieben gezielt gewählte Häuser erhielten dreifach variierte Emaille-Ausleger mit Messinghalter, Ladenpiktogramm und KAFFEE/BROT/POST-Schriftzug. Laufzeitasset und Build sind geprüft; Nah-/Stilabnahme bleibt offen. Technische Grenzen im [Fortschrittslog](PROGRESS-LOG.md).
- **05.10.2026 – Handorientierung am Lenkrad:** Die Arm-IK bindet jetzt neben der Griffposition auch die Hand-/Fingertangente an das drehende Lenkrad. Beide Hände bestehen die Fünf-Winkel-Regression; im frisch geladenen Cockpitbild liegen sie am Kranz. Eine menschliche Einschlag-/Außenansicht bleibt offen.
- **05.10.2026 – Git-Ablauf für zwei Personen:** TEAM-NOTES.md erklärt oben `main`, persönlichen Arbeitsbranch und Commit in Alltagssprache. **Projekt Start** synchronisiert und bereitet einen persönlichen Branch vor; **Zwischenstand sichern** lädt nur diesen Branch hoch; **Projektabschluss** integriert, testet und veröffentlicht nach `main`. Konflikte werden fachlich zusammengeführt; dieselbe `.blend` nicht parallel bearbeiten.

- **05.10.2026 – Stalin-Limousine und Feldmütze:** eigene transparente Touring-Windschutzscheibe mit Rahmen/Wischer ergänzt; die sichtbar zu großen Hinterräder wurden auf Vorderradgröße gebracht, um die Straßenlimousine klarer vom Trecker-Look zu lösen. Deckhaar und unter der Mütze sichtbare Seitenhaarlinie sind getrennt. Modell, GLB, Blender-Quellvorschau und Cast-/Glasregression aktualisiert; echte In-Game-Profil- und Fahrtabnahme bleibt offen.
- **05.10.2026 – Kanalwasserlinie verfeinert:** Zwei dezente prozedurale Schaumkanten markieren die Wassergrenzen. Sie verändern weder Fahrfläche noch Kollision/Partikelbudget. Regression und Produktionsbuild bestanden; visuelle Nahabnahme im Rennen bleibt offen.
- **05.10.2026 – Item-HUD-Bestand abgeglichen:** Die offene Arbeitsliste war veraltet: Ein-Item-Slot, Symbol/Name, leerer/belegter Zustand, Bildschirm-Wurfbutton und die vorhandene E-Schild-/Loslasslogik sind bereits im Spielcode. Die echte Aufnahme-/Wurf-/Touch-Abnahme bleibt noch offen.
- **06.10.2026 – M7-Schattenlistenarbeit:** Dynamische nahe Baum-/Kartschatten sowie aktivierte Itemschatten werden höchstens mit 10 Hz neu gesammelt, statt bei jedem Präsentationsframe neu gefiltert/allokiert zu werden. Schattenqualität und Reichweite bleiben erhalten. Zwei gezielte Regressionen, 74/74 Suite und Build bestanden; Laufzeit-A/B und FPS-Wirkung bleiben unbestätigt.
- **05.10.2026 – Stalin-Gesicht weiter individualisiert:** Eigene loftmodellierte Nase samt Nasenflügeln und zurückhaltenden Nasenlöchern ergänzt und ausschließlich Stalin zugeordnet. Blender-Quelle, optimiertes Runtime-GLB, Cast-Regression und Build sind aktualisiert; In-Game-Nahabnahme bleibt ausstehend.
- **05.10.2026 – Schadensanzeige zugänglicher:** Der Karosseriezustand meldet seinen Wert jetzt als semantischen Meter mit 0–100-Wert; bei null steht zusätzlich „Totalschaden“. Der sichtbare Balken und das bisherige Gameplay bleiben gleich.

- **05.10.2026 – Qualitätsauftrag konkret umgesetzt:** Alle Köpfe wurden relativ zu den Oberkörpern wieder um rund 10 % vergrößert. Stalin hat im editierbaren Blender-Asset eine eigene schlichte Feldmütze ohne Abzeichen und eine individuell detaillierte Limousine mit vier mitdrehenden Art-déco-Radkappen erhalten. Technische Driftregression deckt drei Kurven bei drei Geschwindigkeiten ab. Vollständige menschliche Fahrer-/Fahrzeug- und Fahrgefühlabnahme bleibt offen; Details und Einschränkungen stehen in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).
- **05.10.2026 – Sichtbare Chrome-Prüfungen:** Marcel möchte Browser-Spieltests mitverfolgen. AGENTS.md, TEAM-NOTES.md und docs/21-team-workflow.md verlangen jetzt ein sichtbares Chrome-Fenster, kein Headless-/Hintergrundfenster sowie das anschließende Pausieren und Beenden nur der eigens gestarteten Testinstanz.

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Chronologischer Kurzverlauf bestätigter Änderungen. Neuere ausdrückliche Nutzerentscheidungen gehen älteren Einträgen vor; ältere Einträge bleiben als Verlauf erhalten und werden bei Bedarf als überholt gekennzeichnet. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Für Marcel und Sarah: nur wichtige besprochene Entscheidungen und sichtbare Änderungen, jeweils wenige Zeilen. Kein Werkzeug-/Testprotokoll. Technische Belege und offene Annahmen stehen in [PROGRESS-LOG.md](PROGRESS-LOG.md), laufende Aufgaben in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md), Zukunftsziele in [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md).

## 05.10.2026 – Ergänzung

- **Laufzeitbilder und Fokusprüfung als verbindlicher Workflow:** Sichtbare Pakete erhalten aktuelle Laufzeitbelege und bei sinnvollen Paketgrenzen knappe Vorher-/Nachher-Vergleiche. Bildalter, Szene und geladener Branch/Commit werden vor der Bewertung geprüft. Selbstprüfung gegen Detaildrift und Beobachtung eigener Browser-/Buildlast sind jetzt in der Anleitung verankert; Details: [Team-Workflow](docs/21-team-workflow.md).

## 06.10.2026

- **Historischer Eintrag, am 06.10.2026 überholt:** Die Formulierung, Marcels Basis müsse erst durch beidseitigen Abgleich aktiv werden, war falsch. Marcels Antworten sind jetzt unabhängig die aktive Grundlage. Sarahs Originalbeiträge bleiben erhalten; ihr Feedback ist optional und ändert die Basis nicht automatisch. Siehe den aktuellen Eintrag am Dateianfang und docs/23 sowie docs/24.
- **Marcels Einzelentwurf dokumentiert:** [docs/23-project-design-baseline.md](docs/23-project-design-baseline.md) fasst seine Antworten als persönliche Zielvorstellung zusammen. Relevante Fachdateien verweisen mit gesonderten, unbestätigten Abschnitten darauf; vorhandene Sarah-Beiträge wurden nicht ersetzt oder geändert. Der Vorschlag für den ersten Hitler/Kart-Konzeptanker bleibt vom früher geführten Stalin-Produktionsanker unterscheidbar, bis Teamabgleich und Priorisierung erfolgt sind.

- **Steuerung erweitert Sarah:** Rohrpost/Suchauftrag mit E+V vorwärts oder E+H rückwärts; E allein bleibt unverändert. Foto liegt auf F, Hupe auf V.
- **Zensurbalken wieder aufgenommen Sarah:** Seltenes viertes Item, kurzes satirisches Banner und begrenzte Lenkeinschränkung für Gegner; Schutzzeiten bleiben wirksam.
- **Kims „Propaganda-Sieg“ umgesetzt Sarah:** Zehn Sekunden goldene Paradeveredelung, kurzer Triumphschub und anschließender Motoraussetzer. Zweite Bannerphase zeigt die Nachprüfung; echter Rang bleibt unverändert.

## 04.10.2026

- **Bildbasierte Qualitätsrichtung ergänzt:** Marcels lokale Ladebild-Referenz setzt den Anspruch für echte Laufzeitmodelle, Karts, Gebäude, Boden/Wasser und Fahrpartikel. Umsetzung als eigenständiges Berlin/Stadiondesign ohne konkrete Referenzmodelle oder politische Zeichen. Bestätigte Slot-Anzeige/Bedienung und kumulativer Itemtreffer-Schaden sind in der Arbeitsliste aufgenommen.

- **Fahrerbild nach Marcels Laufzeitbildern erneut öffnen:** Kopfgröße/-ansatz, Hals/Kragen, Mund, Handgelenkgriff am Lenkrad und flatternder Rückenstab entsprechen noch nicht dem Ziel. Schlichte historische Hüte nur mit belegter Zuordnung und ohne Regimezeichen; Umsetzung/Abnahme offen, Arbeitsauftrag in CURRENT-WORKLIST.md.
- **Fahrzeugstil präzisiert:** gemeinsame glaubwürdige Kart-Grundarchitektur plus viele personenspezifische Silhouetten- und Karosserieabweichungen. Kein Trecker-Look; Marcel bestätigt den Fünfjahresplan-Traktor als Wurfobjekt. In der [Master-Aufgabe](docs/22-character-vehicle-quality-master.md), LONG-TERM-GOALS.md und im Itemkatalog nachgeführt.
- **Stalin-Qualitätsanker – Teilpass:** Gesichtsebenen und Staatslimousinen-Front/Heck wurden weiter geformt und in Fahrerwahl/Rennen geladen. Der Masterauftrag bleibt offen; Front-/Seiten-/Nah-/Bewegungsabnahme und weitere anatomische Arbeit stehen aus.
- **Regen-Wolkenschatten:** eine Reihenfolge in der Wetterumschaltung deaktivierte die Regenflächen unmittelbar nach dem Einschalten. Fünf weiche Asphaltflächen und Pfützen sind jetzt nur bei Regen sichtbar; Browserbilder für Regen und Sonne verglichen.
- **Stalin-Tunika:** die helle generische Paradeuniform wurde im Qualitätsanker durch eine dunkel-olivgraue, hochgeschlossene Tunika mit modelliertem Kragen, Knopfleiste, Brusttaschen und feinen Stoffnähten ersetzt. Paradeband, Orden und Schulterstücke sind für Stalin deaktiviert; das eigens gebaute Laufzeitporträt ist geprüft. Die historische Frontporträtaufnahme der Library of Congress diente nur als Formreferenz, nicht als übernommenes Bild/Asset.

- **Fahrpolitur:** Der Lufttrick rollt die Räder zusammen mit der Karosserie; die Holzrampen liegen leicht über dem deckungsgleichen Straßenverlauf; beide Roadster-Wimpel zeigen im Laufzeitbild ein eigenständiges Adlerrelief ohne Regimezeichen. Menschliche Sprung-/Nahprüfung bleibt offen.

- **Rad-Detailpass:** Die gemeinsamen Räder haben beidseitig feine Seitenwandrippen und metallische Felgenmuttern bekommen. Das animierte Fahrwerk bleibt unverändert; der vollständige individuelle Fahrzeugpass ist weiterhin offen.

- **Fahrer-Hautmaterial:** Dezente, generierte Farb- und Normalvariationen wurden dem gemeinsamen Laufzeit-Skinmaterial zugeordnet. Die Gesichtsgeometrie ist davon unberührt; Sichtprüfung in Nahansicht steht aus.

- **Projektstart-Abgleich:** PC-Stand, `origin/main` und Handy-Notizen stimmen auf `00e8173` überein; aktuelle Gesamtsuite 47/47, Produktionsbuild bestanden. Sarahs tatsächlicher Abruf bleibt ihr eigener Gerätecheck. Fahrerporträts zeigen jeweils nur den gewählten Fahrer vor neutraler Studiofläche. Erste Anpassung von Kopf-/Oberkörper-Proportion, Hautton und Augen in der editierbaren Modellquelle und im Laufzeitmodell; vorhandener statischer Schalensitz im Rennbild geprüft. Bot 3 nutzt die Hinterhofgasse mit eigener Weglinie. Quaternius-Basisfigur ist CC0; kostenlose glTF-Variante von kostenpflichtigem `.blend`-Source-Paket getrennt.
- **Hupen-Quellenprüfung:** zwei Wikimedia-Commons-Dateien geprüft; eine ist eine politische Rede und die andere eine neu aufgenommene Namensaussprache, daher keine historischen Hupen eingebaut. Details und Quellen in CURRENT-WORKLIST.md/PROGRESS-LOG.md.
- **Wasserkanal-Bergung:** ein fehlgeschlagener Sprung setzt Fahrer und Bots jetzt sicher hinter der Wasserfläche ab. Der Rücksetzabstand gibt keinen Rundenfortschritt; das Hafenbecken bleibt unverändert.

- **Morgenpaket Marcel (05.10.):** Wand-/Kartkontakte und kumulative Schäden mit Fahrzeugausfall/komischem Respawn angehen; realitätsnähere Fahrer/Cockpit-Animation, Tag-Nacht-Streckenleben und echte historische Sprachhupen prüfen. Detailwünsche und offene Werte in TEAM-NOTES.md und CURRENT-WORKLIST.md; Stimmen erst nach Quellen-/Rechteprüfung verwenden.

- **Dokuordnung:** Die vier Hauptdateien sind jetzt die gemeinsame aktuelle Steuerung; aktive Fachdateien verweisen auf Vorrang, Statusabgleich und Erhalt historischer Ideen. Veraltete Aussagen zum neutralen Slice und zur festen Großkopf-Karikatur wurden als damaliger Stand markiert/korrigiert. Frühere Ideen, Gründe und Prüfbelege bleiben erhalten.

- **Beide Listen abarbeiten:** Der Auftrag „Arbeitslisten abarbeiten“ umfasst zuerst kurzfristige Aufgaben und danach die selbstständige Umsetzung bestätigter Langzeitziele in sichtbaren Paketen. Keine erneute Freigabe für gewöhnliche Paketwahl; echte offene Entscheidungen und Budgetreserve beachten.

- **Höheres Qualitätsziel:** Marcel verlangt deutlich bessere, realitätsnähere Modelle, Fahrer, Fahrzeuge, Strecke, Umgebung, Effekte und Audio anhand der gewählten Bildpräferenz. Fertige Stimmen ohne Text-to-Speech; aktuelle synthetische Clips sind Zwischenstand. Maßnahmen in LONG-TERM-GOALS.md.

- **Sarahs Panzeridee wiedergefunden:** Die Verwandlung existiert im alten veröffentlichten Code, fehlt aber im Babylon-Spiel. Wiederherstellung in CURRENT-WORKLIST.md aufgenommen; weitere alte Fähigkeiten/Items und Unterschiede mit Quellen im [Abgleich](docs/sarah-feature-audit.md). Keine Altengine übernommen, keine neue Fähigkeit als fertig gemeldet.

## 03.10.2026

- **Gemeinsame neue Basis:** Claudes Babylon-Stadionstand wurde zur neuen GitHub-Hauptversion. Frühere Hauptstände sind archiviert; alte Engine und Altordner werden nur historisch gelesen.
- **Einfach zusammenarbeiten:** „Projektstart“ holt den neuesten gemeinsamen Stand und erhält lokale Arbeit; „Projektabschluss“ dokumentiert, prüft, integriert und veröffentlicht sicher nach main. Die KI hilft bei Überschneidungen und Konflikten.
- **Spielstart:** Batch startet den aktiven neuen Checkout; statt ungestalteter Startseite erscheint eine Konzeptillustration mit echtem Ladefortschritt.
- **Fahrt:** Darstellung zwischen Physikschritten geglättet. Marcel meldet wesentlich flüssigeres, besseres Fahrgefühl.
- **Kamera/Fahrzeug:** links halten frei umsehen, rechts halten Rückblick, E Items. Cursor nur beim Halten gebunden. Kurzen Rücksprung korrigiert; Karosserie beruhigt, dezente Haubenhebung mit Bodenkontakt der Räder.
- **Drift:** Gegenlenken lädt ebenfalls, weitet die Kurve und behält die Driftrichtung. Staubwolke deutlicher.
- **Gestaltungsziel präzisiert:** realitätsnahe, erkennbare Abbilder echter historischer Fahrer und glaubwürdige Spielwelt gewünscht. Vorhandene neutralen Figuren sind Zwischenstand, kein Endziel.
- **Neue Wünsche:** Schäferhund als Spieler-Item; verständlichere, lebendigere Sprache; F als individuelle Sprachhupe mit geprüften historischen Mitschnitten, soweit nutzbar.
- **Arbeitsorganisation:** Vier zentrale Dateien für aktuelle Arbeit, Langfristziele, Teamänderungen und persönliche Notizen/Anleitung. Navigation oben verbindet sie; Projektstart öffnet vier Tabs.

- **Ein Wort genügt:** Projektstart synchronisiert und öffnet unsere Arbeitsdateien; Projektabschluss sichert, prüft und veröffentlicht. TEAM-NOTES.md erklärt den Ablauf für uns beide. Der technische Verlauf heißt jetzt PROGRESS-LOG.md.

- **Schäferhund:** Spieler-Projektil und Verfolger sind jetzt ein laufender eigener Hund mit synthetischem Bellen und Comic-Trefferwolke; gemeinsame Trefferregeln bleiben erhalten.

- **Straßenbild:** Litfaßsäulen mit satirischen Plakaten, Haltestellen und Bänke ergänzen die Strecke; ein eigenständiges Adlerornament ohne Regimezeichen.

- **Sprachhupe:** F spielt einen individuellen vorläufigen Parodieclip mit Abklingzeit. Sprechertexte freundlicher/kürzer, Hall und Verzerrung reduziert; echte historische Mitschnitte und Hörabnahme bleiben offen.

- **Diktieren genügt:** Wünsche, Langfristziele und Nachrichten füreinander trägt die KI ein. Schnellhilfe oben in TEAM-NOTES.md; auch „Projekt Start“ und „Projekt Ende“ sind gültige Kurzbefehle.

## 04.10.2026

- **Gemeinsam gesichert:** Geprüfter neuer Spielstand und vier Arbeitsdateien auf GitHub main veröffentlicht. Der nächste Abend beginnt mit „Projekt Start“. Historische Fahrer und weitere Grafikarbeit bleiben nächste Aufgaben.

- **Limitregel für beide:** Offizielle eigene Kontowerte prüfen, ab etwa 15 % geordnet abschließen, mindestens etwa 5 % Reserve anstreben. Marcels Nachricht und einmaliger Sarah-Umstiegsbefehl stehen in TEAM-NOTES.md; ihr lokaler Stand wird erst bei ihr wirklich gesichert.

- **Panzer ist zurück:** Sarahs „Größenbefehl“ auf Q – acht Sekunden Paradepanzer mit Ketten, Rauch und Klang, schiebt Gegner kontrolliert weg; danach 18 Sekunden Abklingzeit. Im HUD links unten sichtbar.

- **Doku entschlackt:** Alte Logeinträge und frühere Einstiege liegen jetzt unter `docs/history/`; die Hauptdateien sind kürzer.

- **Regen:** In den Optionen „Wetter Regen“ wählen: nasse, glänzende Straße, Pfützen, Blitz und Donner.

- **Ein Ordner für alles:** Spiel, ChatGPT-App und Claude-App immer im Hauptordner; Claude ohne Worktree starten.

- **Fahrerwahl und echter Startkader (historischer Stand):** Vor jedem Grand Prix wählt man aus Hitler, Stalin, Mussolini, Mao, Kim Jong-un und Castro (Karikaturen mit Porträts). Der damalige Eintrag nannte Stalins Traktor noch unbestätigt; Marcels neuere Präzisierung vom 04.10.2026 bestätigt ihn als Wurfobjekt. Aktuelle Regel steht oben in diesem Änderungsverlauf.
- **Musik und Ziel:** Statt Klavier läuft ein eigener strammer deutscher Marsch. Im Ziel gibt es Feuerwerk und eine Siegerkarte mit Porträts.
- **Strenger Marsch, Zufallswetter mit Schnee:** Neue preußische Spielmannszug-Musik; das Wetter wird beim Laden ausgewürfelt (Sonne, Regen oder neu Schnee). Panzerräder repariert, Gesichter feiner (eigene Nasen, Wangen, Frisuren).
- **Weniger Zwischen-Commits:** Die KI committet und dokumentiert gesammelt, Pflicht ist es beim Projektabschluss; zwischendurch nur, wenn wirklich nötig.
- **Maus-Kamera repariert:** Halten links/rechts funktioniert jetzt auch, wenn der Browser den Mauszeiger nicht einfangen darf. Der alte Claude-Worktree ist gelöscht.

- **Größere Karte mit Kanalsprung:** Die Strecke ist 1,5× so groß. Vor den Tribünen springt man jetzt über einen Kanal (Boost, Rampe, Landeschub, sonst Bergung). Lenkung direkter. Außerdem heute: Schadensmodell mit Totalschaden, Gefahrenzonen mit Bergungsamt, Tag-Nacht, feste Hände am Lenkrad, Boostflächen, Startschub.

- **Großer Qualitäts- und Mechanikschub (04.10. Nachmittag/Abend):** Drift kontrollierter mit 3 Turbostufen, Windschatten, Tricks, Item-Schild, Zeitfahren mit Geist und Medaillen, Gegnerstärke, Auto-Gas/Lenkhilfe, Grafik Hoch, eigene Karosserien, realistischere Köpfe/Haare, zweite Rampe. Echte Hupen-Stimmen später.

- **Lenkradgriff (04.10.):** Hände schwebten wegen außerhalb des Kranzes platzierter Modellkoordinaten. Unterarme und Handschuh-Anker nach innen gesetzt, optimiertes Modell im Rennen einschließlich Fahrerperspektive geprüft. Details und nächste Abnahme: CURRENT-WORKLIST.md / PROGRESS-LOG.md.
- **Lenkradgriff erneut stabilisiert (04.10.):** Handschuhe bleiben mit Manschette und Unterarm verbunden; die Laufzeit-IK bewegt die ganze Arm-Hand-Einheit an den Kranz. Grundpose außen und Fahreransicht geprüft; Lenkeinschlag bleibt offen.
- **Lenkradgriff für vollen Einschlag (04.10.):** Die komplette Arm-Hand-Einheit folgt dem rotierenden Griffanker mit angepasster Armlänge; inverse Handskalierung erhält die natürliche Handschuhgröße. Live-Grundpose und mathematische Prüfung beider Arme bei fünf Lenkwinkeln sind dokumentiert. Außenansicht unter menschlich gehaltenem Volleinschlag bleibt Teil der Abnahme.
- **Stalin-Gesicht (04.10.):** Ein eigener, klar gesetzter Mund ist jetzt unter dem Walrossbart sichtbar und nur bei diesem Fahrer aktiv. Laufzeitporträt und 50 Regressionstests geprüft; das Gesicht bleibt eine offene Karikatur-Zwischenstufe.
- **Bildreferenz – Weltpaket 1 (04.10.):** Häusergenerator mit schmalem Granitsockel, lesbarer Ladendoppeltür und gegliederten Fenstern ergänzt; animierte Wasser-Normalen leicht verstärkt. Regenpfützen und flacher Kanalkontakt werfen je Kart eigene, gedeckelte Sprühfahnen. Frischer Blender-Bau 22,08 → 15,63 MB optimiert (−29,2 % gegenüber Roh-GLB; +25,2 % Runtime-Größe zum Vorgänger); Build, 53/53 Tests und Regenwelt im Browser geprüft. Nahabnahme und Sichtprüfung der Effekttrigger bleiben offen; die Bildreferenz bleibt ein Langzeitziel.
- **Item-HUD Pointerbedienung (05.10.):** Bildschirmbutton teilt Maus-/Touch-Halten, Schild und Wurf beim Loslassen jetzt mit der Tastatur. Ein kurzer Tap zwischen Physikframes bleibt sichtbar; Pointer-Abbruch lässt keinen hängenden Schildzustand zurück. Build und Vollsuite 56/56 bestanden; die interaktive Aufnahme-/Touchfahrt bleibt offen.
- **Stalin-Gesichtspass 2 (05.10.):** Kiefer-/Wangenform als kontinuierliche Schädeloberfläche geschärft und zwei anliegende Schläfenlocken in Stalins zurückgekämmtem Haar ergänzt. Blender-Laufzeitasset optimiert (+2.568 Byte); Casttest, Build, 56/56 Tests und echte Fahrerwahlporträts bestanden. Der Charakter-/Kartqualitätsanker bleibt wegen fehlender Nah-/Seiten-/Bewegungs- und menschlicher Stilprüfung offen.
- **Stalin-Limousine (05.10.):** Körpernahe Zierlinie, Türgriffe und eingelassene Haubenlüfter ergänzt; Physik-/Fahrwerksverträge unverändert. Runtime-GLB 5.084.136 → 5.230.312 Byte (+2,9 %); Vollsuite 56/56, Build und Runtime-Reload bestanden. Sicht-Nahabnahme fehlt.
- **Kanalspray (05.10.):** Wasserfahne beim flachen Kontakt auf 30 Partikel/s (Sparmodus 14) und .48 s maximale Lebensdauer abgestimmt; 28 Teilchen je Kart bleiben die Poolgrenze. Regression 2/2 und Build bestanden. Sichtprüfung während einer echten Wasserquerung bleibt offen.
- **Rückenpolster statt „Stangen“ (05.10.):** Die Ursache waren drei 8-mm-Goldröhren als Sitznähte, 2 cm hinter der Polsteroberfläche; Stalins Cast hatte keinen Umhang aktiviert. Sie wurden durch matte, bündige Fadennähte mit 1,8-mm Radius plus zwei dezente Quernähte ersetzt. Blender-/GLB-Neubau, Cast-/GLB-Prüfung 3/3, TypeScript, Produktionsbuild und echte Babylon-Heck-/3/4-Ansicht bestanden. Laufender nächster Punkt: Itemaufnahme, HUD und Wurf im echten Rennen abnehmen.
- **Item-Pickup bis Wurf (05.10.):** Echte Rennkiste aufgenommen; Symbol, Name, „IM SLOT“ und Buttonzustand gesehen. Der Wurf über Button und separat per E-Tastendruck leerte den Slot und meldete „Fünfjahresplan-Traktor unterwegs“. E-/Touch-Schildhalten und Rückwärtswurf bleiben offene Abnahmen. Als Nächstes: langsamen Kanalsprayeinsatz live sichtbar belegen.

- **Stadtwelt-Export und Produktionsmessung (05.10.):** Voller 48-Häuser/32-Material-Blender-Neubau und optimierter Runtime-GLB. Der synthetische Bulk-Join-Vorteil überträgt sich nicht auf Produktionsmeshes; die Standard-Schwelle liegt jetzt oberhalb aller aktuellen Gruppen. GLB-/Build-/Suite-/Browserlauf bestanden. Menschliche Stilabnahme bleibt offen.
- **M7-Fahrmessung aktualisiert (05.10.):** Echter Sechs-Kart-Lauf in drei Kameras; Meshpool stabil bei 1.871, P95 142–179 ms. Als Nächstes werden Drawcalls, Schatten und Sichtbarkeit pro Kamera gemessen, bevor Grafik-/Rennlogik angefasst wird.

## 06.10.2026 – Redesign umgesetzt (Claude)

- **Neue, größere Strecke:** 1366 m mit Spree-Kai, Prachtallee, Säulen-Haarnadel, Tiergarten und Zielkurve; alte Abschnitte und Regeln unverändert.
- **Neue Welt aus einem Baukasten:** wiederverwendbare Blender-Module (Häuser, Tribünen, Palast, Dom, Tor, Brücke, Möbel, Bäume) mit gemeinsamer Farb- und Materialfamilie ersetzen die alte Einzelwelt. Neue Gebäude lassen sich in Sekunden neu bauen.
- **Hitler-Anker als Zwischenstufe:** eigener Grand-Prix-Wagen, Jacke mit Krawatte, kompakter Bart, ohne Mütze und Abzeichen. Realitätsnahes Gesicht bleibt nächster Schritt.
- **Atmosphäre:** wärmeres Licht, Fluss, Konfetti, neuer Motorklang (noch nicht angehört).
- **Detailpass (Claude, zweiter Lauf):** Prachtallee steigt jetzt als Kuppe an, Ladenschilder mit satirischen Namen, Hitler-Kopf und Anzug verfeinert, Reifen klingen je nach Untergrund, Wasser platscht. Zwei alte Testfehler behoben.
