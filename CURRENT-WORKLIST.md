# CURRENT WORKLIST – laufende Arbeit

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Aktuelle Aufträge, Reihenfolge, Status, Blocker und nächste Schritte. Fachdateien liefern Umsetzungseinzelheiten; sie dürfen einen neueren Auftrag hier nicht still überstimmen. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsame kurzfristige Aufgaben für Marcel und Sarah. Nur die neue Babylon-Basis bearbeiten. Die KI aktualisiert Status während der Arbeit; Prüfdetails stehen im [technischen Fortschritt](PROGRESS-LOG.md). Neue Notizen aus TEAM-NOTES.md hier zuordnen, Zukunftsziele nach LONG-TERM-GOALS.md.

**Dokuordnung geprüft (04.10.2026):** Die vier Hauptdateien führen aktuelle Aufträge, Ziele, bestätigte Änderungen und offene Notizen. Aktive Fachdateien verweisen nun auf diese Rangfolge; alte Vorgaben bleiben mit historischem Status erhalten. Die ausdrücklich überholte Großkopf-/Neutral-Slice-Festlegung wurde in den betroffenen Zusammenfassungen korrigiert. Technische Historie bleibt im PROGRESS-LOG.md.

## Umsetzungsauftrag: Qualitätsanker, Spielwelt und Fahrgefühl – 05.10.2026 (Marcel)

**Quelle/Vorrang:** Marcels heute eingefügter Leitauftrag „Arbeite als leitender Entwickler, Technical Artist und Art Director …“ erweitert die bestehende Bild-/Masteraufgabe. Umgesetzt wird in der bestätigten Reihenfolge: (1) Stalin samt eigenständigem Kart als echter Runtime-Qualitätsanker, (2) sichtbare Stadion-/Berlinwelt und begrenzte Material-/Kontaktpartikel, (3) kontrollierbarer Drift mit Kurven-, Gegenlenk-, Geschwindigkeits-, Turbo- und Kontaktprüfung. Danach folgen die übrigen ausführbaren aktuellen Punkte und anschließend bestätigte Langzeitpakete. Die Arbeitsreihenfolge ist keine Abnahme: Tests, Spielbilder und menschliche Fahr-/Stilprüfung bleiben getrennte Belege.

- [x] Leitauftrag gelesen und auf aktive Babylon-Quellen, bisherige Teilstände, vorhandene Fahr-/Effektpfade und verbindliche Budget-/Git-Regeln bezogen.
- [ ] Laufzeitansichten/Steuerablauf robust prüfen: drei Kameras, echte Fahrerauswahl, Rennen, Bewegung, Pause und Neustart. Headless-Eingabe/Taktprobleme als Testgrenze oder Harness-Fehler vom Spielverhalten unterscheiden.
- [x] Erster weiterer Fahrer-/Stalin-Modellpass: Köpfe sind wieder sichtbar größer relativ zum Oberkörper skaliert; Stalin erhält eine eigens geschnittene, genähte Feldmütze ohne Insignien sowie vier Art-déco-Radkappen der Limousine. Die Radkappen folgen den drehenden Radknoten und bleiben bei allen anderen Karosserien verborgen.
- [x] Stalin-Nase von der gemeinsamen generischen Variante gelöst: eigene loftmodellierte Brücke mit breiteren Nasenflügeln und zurückhaltend modellierten Nasenlöchern; nur im Stalin-Cast aktiv und im GLB-Knotentest nachgewiesen.
- [ ] Stalin-Qualitätsanker und Limousinen-Silhouette in Front/Seite/Nähe/Bewegung weiterentwickeln; nach jedem Asset-Neubau in der Laufzeit prüfen. Nah-/Seiten-/Bewegungsprüfung mit eindeutig ausgewähltem Stalin fehlt noch.
- [ ] Fassaden-, Wasser-, Straßen- und Partikeleffekte anhand echter Spielkontakte sichtbar abnehmen und auf klare Fahrspur/Performance achten; die neuen Schaumkanten sind technisch, aber noch nicht visuell abgenommen.
- [x] Kanal-Wasserlinie dezent lesbarer gemacht: zwei prozedural texturierte Schaumstreifen sitzen innerhalb der Wassergrenzen, ohne Fahrbahn-/Kollisions- oder Partikeländerung; Breite und Lage regressiongeprüft.
- [x] Technische Driftmatrix für drei Streckenbögen bei 9/12/15 m/s ergänzt: Bot-Drift bleibt mindestens 0,35 s aktiv, löst vor dem inneren Sperrband und fährt in der Regression ohne Grenzkontakt durch; Gegenlenk-Schlupf wird auf höchstens 0,081 rad begrenzt.
- [ ] Drift weniger aggressiv und enger abstimmen; menschliche Eingabe, Turboauslösung und Wandkontakt noch im normalen Browser/Fahrtest beurteilen. Eine technische Diagnose ersetzt kein menschliches Fahrurteil.
- [ ] Erst nach Paketprüfungen Status in den älteren Einzelaufgaben und bestätigten M2–M7-Zielen fortschreiben; nicht geprüfte menschliche oder Geräteabnahmen sichtbar offen lassen.

**Gewähltes Langzeitpaket M3-Welt (05.10., umgesetzt):** Den schon vorhandenen niedrigen Kanalspray bei flachem Überfahren in normaler und reduzierter Grafik lesbarer gemacht: 30/14 Partikel/s, 28er-Pool je Kart, unveränderte Kanal-/Höhengrenzen und Physik. Gezielt 2/2 Tests sowie Build bestanden; ein echter Wasser-/Partikelkontakt ist noch nicht visuell abgenommen.

**M3-Stadtwelt-Paket (05.10., technisch umgesetzt):** An ausgewählten wiederkehrenden Häusern sind verwitterte Fensterläden und bepflanzte Ladenfenster ergänzt. Blender-Neubau umfasst 48 Townhouses; Roh-GLB 21.890.552 Byte, optimierte Laufzeitdatei 15.528.128 Byte (104.600 Byte kleiner als zuvor). Strukturknoten/Material, bytegleiche Buildkopie und Produktionsbuild geprüft. Fassaden-Nahsicht und künstlerische Abnahme im Spiel bleiben offen.

**Aktuell/Nächster Schritt:** Handrichtung und Kontakt am Lenkrad sind technisch korrigiert und im frisch geladenen Cockpit aus der Fahrerperspektive statisch geprüft; die volle Links-/Rechtslenkung bleibt ein menschlicher Sichtcheck. Als nächstes Stalin samt Kart in Front/Seite/Nähe/Bewegung sowie echten Wasser-/Partikelkontakt visuell abnehmen. Die isolierte Headless-Fahrprobe empfing `W`, aber innerhalb 21 s keinen weiteren gerenderten Physikschritt; sie ist deshalb kein Fahrbeleg. Die Kanal-Wasserlinie hat zwei schmale Schaumkanten und der flache Oberflächenspray ist technisch klarer und pro Kart gedeckelt.

**M3-Teilpaket (05.10., erledigt):** Stalin-Kiefer/Wangen sind als kontinuierliche Schädelverformung statt aufgesetzter Wangenkugeln modelliert; zwei anliegende Schläfensträhnen führen die swept-back-Frisur seitlich. Blender-Quelle, optimierter Cast-Knoten, Build, Vollsuite und echte Fahrerwahlporträts geprüft. Das ist sichtbarer Teilfortschritt, aber keine vollständige Gesichts-/Profil-/Bewegungsabnahme.

**Lenkradpass (05.10., technische Korrektur umgesetzt):** Die Schulter-IK verwendet jetzt neben dem bewegten Griffpunkt auch die Lenkrad-Tangente, damit sie den Arm nicht nur zum Rad führt, sondern die Finger-/Handachse während der Lenkung mitdreht. Die Regression prüft beide Seiten bei fünf Winkeln; 2/2 Tests und Produktionsbuild bestanden. Frischer Browser-Reload und statische Fahrerperspektive geprüft: beide Handschuhe liegen am Kranz, keine Runtime-Ladefehler gesehen. Gehaltene Lenkbewegung und Außen-/Seiten-Nahansicht konnten nicht verlässlich abgenommen werden.

**Aktuell/Nächster Schritt:** Das M3-Weltpaket zu Kraterbergung und Schotter-/Grasfeedback ist technisch umgesetzt und vollständig geprüft. Als nächstes folgt der weiterhin priorisierte Stalin-/Limousinen-Qualitätsanker in gezielten Front-/Seiten-/Nah-/Bewegungsansichten; danach echte Wasser-/Partikelkontakte, kontrollierter Drift und eine reproduzierbare Browserroute für das Item-HUD. Menschliche Stil-/Fahrabnahme bleibt getrennt von Techniktests.

**Ausgewählter Cast-Regressionsfix (05.10., behoben):** Die einzelne kleine Quaderform für Hitlers Schnurrbart war zwar im GLB und Cast aktiv, las sich im frisch geladenen Fahrerwahlporträt aber nicht. Sie ist jetzt durch zwei volumetrisch ausgeformte, kompakt verbundene Bartflügel ersetzt, die vor der Gesichtsebene liegen. Blender-Quelldatei, `.blend`, Roh- und optimiertes Laufzeit-GLB erneuert; Cast-Regression 2/2 und Produktionsbuild bestanden. Frische echte Fahrerwahl zeigt den Schnurrbart sichtbar an Hitler; sechs Porträts wurden auf Nebenwirkungen verglichen. Keine politischen Regimezeichen hinzugefügt. Weitere frontale/seitliche Nah- und Bewegungsabnahme des Gesamtmodells bleibt Teil des Qualitätsankers.

**M3-Gesichtsteilpass (05.10., technisch umgesetzt):** Die gemeinsamen überdeckenden Lidellipsoide sind durch obere/untere Lidkanten ersetzt, damit Iris und Augenweiß nicht halb verdeckt werden. Stalins Mundöffnung und Lippen sitzen tiefer und näher an der Gesichtsebene unter dem Walrossbart. Blender-Quelle, `.blend`, optimiertes GLB und sechs Fahrerwahlporträts geprüft; gezielter Casttest 2/2 sowie Produktionsbuild bestanden. Im kleinen Stalin-Porträt sind Augen klarer, der Mund bleibt subtil. Keine menschliche Stilabnahme oder Front-/Seiten-/Bewegungsprüfung behauptet. Der M3-Qualitätsanker bleibt offen.

**M5-Schadenspaket (05.10., technische Lücke behoben):** Itemtreffer zogen beim normalen Kart bereits 14 Haltbarkeit ab; der Panzerfall war ausgenommen, weil er nur einen Item-Aufprall statt Spin erzeugt. `stepDamage` zählt jetzt auch diesen neuen Item-Aufprall einmalig. Schadensregression 4/4, Vollsuite 58/58 und Produktionsbuild bestanden; bestehende Kollisionsregeln, Trefferimmunität und Panzerwirkung außerhalb des Schadens bleiben erhalten. Menschliche Balance-/Fahrabnahme bleibt offen.

**M3-Weltpaket (05.10., technisch umgesetzt):** Die drei abstrakten Übungskrater haben eine innere Fallzone mit 3,2-s-Absturz/Bergung. Der Kartkörper sinkt in die Senke und kommt ohne Kranseil zurück; die Rücksetzung wählt auf gleichem Streckenfortschritt eine freie, kraterfreie Spur. Die Hinterhofabkürzung verwendet jetzt eine eigenständige, prozedural strukturierte Schotterfläche und gedämpften Grip/Tempo; ein klar markierter, befahrbarer Grasrand ergänzt weichere Lenkung, eigenen Staub und HUD-Flächenname. Spieler und Bots teilen Physik/Effektregeln; Effekte sind im Sparmodus begrenzt. Gesamt-Suite 62/62 und Build (1.296 Module) bestanden; Runtime frisch bis zum Hauptmenü geladen. Eine gezielte Fahrt in Krater/Gras und visuelle Effektabnahme steht noch aus.

**M3-Stadtwelt-Paket (05.10., technisch umgesetzt):** An sieben von 48 Townhouses (jede siebte Position) wurden individuell variierte Laden-Ausleger mit Emaille, Messingrahmen/-halter, Piktogrammen und KAFFEE/BROT/POST-Schriftzügen ergänzt. Blender-Quelle, 31-Mesh-GLB mit drei neuen Emaille-Meshes/Materialien, optimiertes Laufzeitasset (16.135.400 Byte; +607.272 Byte/+3,91 %), Produktionsbuild und bytegleiche Buildkopie geprüft. Das frisch geladene Spiel erreicht das Hauptmenü; Schilder sind dort zu weit entfernt für eine Nah-/Stilabnahme. Details/Grenzen siehe PROGRESS-LOG.md.

**M3-Fahrzeug-/Kopfbedeckungspaket (05.10., umgesetzt):** Stalins `body-limousine` erhält eine flach geneigte Touring-Windschutzscheibe aus eigenem transparentem Laufzeitglas mit Metallrahmen, Mittelsteg, Scharnieren und aufliegendem Wischer. Der gemeinsame sichtbare Hinterradradius wurde an die Vorderräder angeglichen, die Hinterreifen bleiben etwas breiter; Radstand und Fahrphysik bleiben unverändert. Für Stalins Feldmütze sind die seitlichen Haarsträhnen nun ein eigenes Castteil und überschneiden sich nicht mit dem zurückgekämmten Deckhaar. Blender-Quelle/GLB, Transparenz-/Knotentest und Quellbild sind geprüft. Noch offen: echte Runtime-Nah-/Seiten-/Bewegungsabnahme; sichere isolierte Browsersteuerung fehlt.

**M3-Fahrzeugteilpaket (05.10., erledigt):** Stalins Limousine hat eine körpernahe seitliche Coachline, zwei Metalltürgriffe und beidseitige eingelassene Haubenlüfter mit Lamellen. Blender-Quelle/GLB/Optimizer, Cast-/Karosserieknoten, Build, Vollsuite und frischen echten Runtime-Reload geprüft. Runtime-Zuwachs: 146.176 Byte (+2,9 %). Nahsicht/Seiten-/Fahrtabnahme bleibt offen.

**M3-Limousinen-/Mützenpass (05.10., erledigt):** Die Staatslimousine hat eine nur in `body-limousine` aktive Touring-Scheibe mit glTF-BLEND-Glas (Alpha .24), poliertem Außenrahmen, Mittelsteg, Scharnieren und flach anliegendem Wischer. Der hintere sichtbare Reifenradius wurde 0,43 → 0,36 m und die Breite 0,44 → 0,39 m geändert; gemeinsamer Radstand/Physik bleiben gleich. Stalins Feldmütze zeigt eigenes Seitenhaar, während die Deckhaarform nicht mehr über die Krone läuft. Roh-GLB 7.365.372 Byte; optimiertes GLB 5.283.004 Byte (+52.692 Byte/+1,0 % zum vorherigen Fahrzeugasset). Gezielte Cast-/Glasprüfung bestanden. Das Studio-Renderbild ist eine Blender-Quellvorschau und kein Babylon-Laufzeitbeleg; dort geladene Auswahl, Profil, Bewegung und menschliche Qualitätsabnahme bleiben offen.

**M3-Kanalspray-Pass (05.10., technisch umgesetzt):** Die Heckfahne beim flachen Wasserübertritt steigt auf 30 Partikel/s (14 im Sparmodus); Sprites sind leicht größer und leben höchstens 0,48 s. Der Pool bleibt bei 28 Partikeln je Kart / maximal 168 für sechs Karts. Auslöser, Kanalgrenzen, Physik, Rettung, hohe Sprünge und separater Absturz-Splash sind unverändert. Regression 2/2 und Produktionsbuild bestanden. Fahrerwahl und Startaufstellung wurden im In-App-Browser angesehen; der Effekt konnte ohne gehaltene Fahrzeuggabe nicht beim Kanaldurchgang gesehen werden. Laufzeit-Wasserbild und visuelle Wirkung bleiben offen.

**Nächster Schritt:** Karosserie und Modellanker in echter Nah-/Seiten-/Fahrtansicht beurteilen; danach Welt-/Wassereffekte bei Kontakt sowie kontrollierte Driftfahrt weiter abnehmen. Laufender Bildqualitätsauftrag bleibt insgesamt offen.

## Wasserkanal-Bergung – 04.10.2026 (Marcel)

**Aktuell:** beheben, dass ein Kart nach dem Herausziehen aus dem quer über die Strecke laufenden Wasserkanal wieder im selben Wasserbereich abgesetzt wird und erneut abstürzt.

- [x] Bergung setzt das Kart auf die sichere Fahrbahn hinter den Kanal; gleicher `recoverKart`-Pfad für Spieler und Bots. Der Teleportabstand liegt über der Rennfortschritts-Toleranz und gibt keine Meter/Runde.
- [x] Regressionstest: Kanaleintritt → Bergungsposition außerhalb des Wassers und jenseits der Landekante; volle Suite und Build bestanden.

**Ergebnis:** wiederholtes unmittelbares Einsinken nach der Bergung ist technisch verhindert. Das Hafenbecken bleibt beim bisherigen progressgleichen Respawn. Weiterer menschlicher Fahrcheck ist bei der nächsten Spielprobe willkommen.

## Sprung-, Rampen- und Fahrzeugwimpel-Bugs – 04.10.2026 (Marcel)

**Aktuell:** drei bei der Fahrt beobachtete Punkte beheben: Räder sollen beim Lufttrick mit der Karosserie rollen; auf der Rampe flimmert/überlagert sich die Textur mit dem Straßenbelag; die Wimpel am Roadster des Hitler-Fahrers sollen eigenständige Adler zeigen.

- [x] Lufttrick: eine gemeinsame Rollkurve für Karosserie und Radgruppe; Regressionstest deckt Anfang/Mitte/Ende und deaktivierten Trick ab.
- [x] Rampe: Holzfläche samt Stirnseite 5 cm über dem identisch geneigten Straßenprofil; der koplanare Z-Flimmerpfad ist damit beseitigt.
- [x] Roadster-Wimpel: Adlerrelief in editierbarer Blender-Quelle gebaut, neu exportiert/optimiert und im laufenden Spiel auf beiden roten Wimpeln sichtbar.
- [ ] Menschliche Fahrprobe während eines echten Sprungtricks sowie direkte Nahansicht der Rampe; die Browsersteuerung konnte hier keine Taste gehalten fahren.

**Nächster Schritt:** beim nächsten echten Fahrtest prüfen, dass Räder und Karosserie während des Tricks gemeinsam rollen und die Rampentextur in Bewegung ruhig bleibt.

## Fahrer- und Fahrzeugmodelle: verbindlicher Qualitätsanker – 04.10.2026 (Marcel)

**Aktuell (Priorität 1):** Marcels vollständige [Master-Aufgabe](docs/22-character-vehicle-quality-master.md) als konkreten Auftrag mit dem langfristigen Qualitätsziel verbinden und um die heute präzisierte Fahrzeugform ergänzen. Die zwei Laufzeitbilder dienen als Befund: Kopf-/Halsansatz, Mund und Handgriff sind mangelhaft; der flatternde Rückenstab ist zu identifizieren. Die Arbeit folgt dem Masterablauf: ein vollständiger Qualitätsanker zuerst, dann Übertragung auf übrigen Kader und individuelle Karts; kein bloßer Minimalfix.

- [x] Relevante Charakter-/Art-Dokumente und `art-source/build_kart.py` geprüft; sichtbarer goldener Rückenstab ist der steife Cape-Verschluss auf dem animierten Knoten `scarfFlap`, der für Figuren ohne Cape nicht ausgeblendet wird.
- [x] Unpassenden Goldverschluss entfernt; im tatsächlichen Rennen aus rückwärtiger Kamera kontrolliert, kein Stab ragt mehr aus Nacken/Rücken.
- [x] Erster Formpass integriert: getrennte Kopf-/Kieferprofile, größerer Kopf, verlängerter Hals mit weichem Kragen, klarere Lippen, korrigierte äußere Hand-/Arm-Griffseiten und angepasste Hüte. Im Laufzeit-Fahrerwahlbild geprüft; bleibt eine Karikatur-Zwischenstufe, Qualitätsanker nicht abgenommen.
- [x] **05.10. Regression behoben:** Hitlers zuvor im Porträt nicht lesbarer Quaderbart wurde zu zwei breiteren modellierten Bartflügeln vor der Gesichtsebene umgebaut. Fahrerwahl nach Blender-Rebuild frisch geladen: dunkler Schnurrbart in Kartenmaßstab sichtbar; alle sechs Porträts ohne unerwartete Änderung verglichen. Technischer Beleg und Grenze im [Fortschrittslog](PROGRESS-LOG.md).
- [x] Grobe Gold-Schulterplatten aus dem Rückbild durch weiche Stoffepauletten mit schmaler Paspel ersetzt; Blender-Quelle, optimiertes GLB und Fahrerauswahl aktualisiert.
- [x] Lenkradgriff erneut korrigiert (04.10., nach Marcels Laufzeitbefund): Ursache waren nach außen gerichtete Arm-/Handkoordinaten; das Parenting auf den Lenkradkranz konservierte genau diesen Abstand. Unterarme und Handschuh-Anker liegen jetzt innerhalb des Kranzradius. In der Fahrerperspektive stehen beide Handschuhe sichtbar am unteren linken/rechten Lenkradkranz; gemeinsame Geometrie gilt für alle sechs Fahrer.
- [x] Lenkradgriff erneut korrigiert (04.10., nach erneutem Schweben): Die Handschuhe bleiben jetzt in der Arm-/Manschetten-Hierarchie. Die Schulter-IK führt die vollständige, verbundene Arm-Hand-Silhouette zum Lenkrad; die Handschuhe werden nicht mehr als einzelne Meshes vom Handgelenk gelöst. Im aktuellen Spielbild außen und in der Fahrerperspektive geprüft.
- [x] Lenkradgriff bei Bewegung stabilisiert: Der bewegte Griffanker konnte am vollen Lenkeinschlag mit einem starr langen Arm unerreichbar werden. Die Runtime-IK dreht und streckt/verkürzt daher die gesamte Arm-Hand-Einheit gleichmäßig zum Radgriff und kompensiert die Hand-Skalierung, damit der Handschuh seine Modellgröße behält. Babylon-Regressionstest prüft beide Arme bei fünf Lenkwinkeln.
- [x] Stalin-Mund ergänzt (04.10.): Der Walrossbart verdeckte auf der kleinen Live-Karte die gemeinsame Mundöffnung. Eigenständige, nur bei Stalin aktivierte Mundöffnung mit Ober-/Unterlippe unterhalb des Schnurrbarts modelliert; aktuelles Laufzeitporträt zeigt Bart und Mund getrennt.
- [x] Sechs bestehende Fahrer-Karosserien samt gemeinsamer Fahrwerksbasis geprüft; Stalin nutzt die niedrige Straßenlimousine, der Traktor bleibt das bestätigte Wurfobjekt.
- [x] **Rad-Detailpass (04.10.):** alle vier Reifen erhielten zwei dezente umlaufende Seitenwandrippen; auf jeder Felgenseite sitzen acht kleine Radmuttern. Auf der gemeinsamen Felgen-/Radspin-Hierarchie gebaut, ohne Fahrwerk oder Radvertrag zu ändern; die optimierte GLB-Datei wurde trotz Details um 8.184 Bytes kleiner.
- [x] **Hautmaterial-Pass (04.10.):** das gemeinsame Laufzeitmaterial „Warm skin“ nutzt jetzt eine dezente prozedurale Farb-/Normalstruktur mit niedriger Reliefstärke. Die Geometrie, Gesichtsformen und Kleidung bleiben unverändert; die Nahansicht ist noch nicht visuell abgenommen.
- [x] Stalin-Pass erweitert: breiterer, quadratischer Kiefer; zusätzliche Brauen-, Wangen-, Nasolabial- und Unteraugenformen. Limousine erhielt einen eigenen vertikalen Kühlergrill, Haubenmittelsteg und gestuftes Heck. Blender 4.5.3, GLB-Optimierung, Fahrerwahl und Rennen mit Rück-/Fahrerperspektive geprüft.
- [x] **Stalin-Tunika:** das frühere helle Paradeoutfit mit Bändern, Orden und Schulterstücken durch eine dunkle, hochgeschlossene, individuelle Tunika ersetzt: passender Stehkragen, mittige Knopfleiste, zwei Brusttaschen und dezente Stoffnähte, ohne politische Insignien. Die übrigen fünf Fahrer behalten ihre eigenen Outfitteile; Studio-Porträt nach Blender-Export/Optimierung frisch im Spiel geprüft.
- [ ] Einen Fahrer vollständig als Qualitätsanker überarbeiten (Gesichtsvolumen/-anatomie, Hals, Haare, Kopfgröße, Uniform, Hand-/Arm-Griff und historisch belegte Kopfbedeckung ohne Regimezeichen).
- [ ] Fahrzeug-Grundmodell vereinheitlichen, aber jedes Kart mit vielen personenspezifischen Karosserie-, Front-, Heck-, Kotflügel-, Rad-, Cockpit- und Materialabweichungen klar unterscheidbar machen. Keine Trecker-Silhouette; Stalins Traktor bleibt Wurfobjekt.
- [ ] Den Qualitätsanker im tatsächlich laufenden Spiel von hinten, vorn, seitlich, nah und in Bewegung prüfen; dann Gesicht-/Körperpass auf übrige Fahrer übertragen und alle sechs Laufzeitmodelle kontrollieren.
- [ ] Quellen-/Blender-Pipeline reproduzieren; Mesh-/Rig-Qualität, Runtime-Funktion, Regressionen und Produktionsbuild prüfen. Konkrete Leistungsänderungen dokumentieren.

**Nächster Schritt:** Hautmaterial- und Rad-Details in der Nahansicht sowie menschliche Außen-/Seitenprüfung bei vollem Links-/Rechtslenkeinschlag. Die Laufzeitansicht bestätigt Grundpose und Cockpitkontakt, der Regressionstest belegt mathematisch den Griffanker über beide Seiten und fünf Lenkwinkel, aber keine menschlich gehaltene Fahrt. Danach Stalin-Anker in Front-, Seiten-, Nah- und Bewegungsansicht weiter modellieren und prüfen. Hals-/Kragenübergang und Haaransatz bleiben offen. Die Fahrerwahl bleibt trotz klarerer Merkmale und eigener Tunika sichtbar stilisiert und nicht als Qualitätsanker abgenommen. Danach übrige fünf Fahrer/Karts auf denselben Kriterienpass bringen.

**Statusfortschreibung (04.10.2026):** Ursachen-/Formpass, Schulterkorrektur, Hitlers sichtbarer Mund/Schnurrbart und der erste Stalin-Gesichts-/Limousinenpass sind geprüft und im Spiel. Der vollständige Qualitätsanker ist weiterhin offen; die zuletzt geprüfte Fahrt zeigt Rück- und Cockpitkamera, aber keinen vollständigen Front-/Seiten-/Nah-/Bewegungspass. Danach dieselben Kriterien auf alle Figuren/Karts anwenden.

## Neue Spielziele und Bildreferenz – 04.10.2026 (Marcel)

**Aktuell:** Die lokale Referenz [loading-real-progress.png](docs/evidence/loading-real-progress.png) legt den visuellen Maßstab für echte 3D-Laufzeitgrafik fest: ausdrucksstarke Fahrer, individuell konstruierte Karts, räumliche Architektur, glaubwürdiger Boden/Wasser und lesbare Fahrpartikel. Das Bild ist Art-Direction, keine Anweisung, konkrete Figuren, Schriftzüge oder politische Zeichen zu kopieren. Kritische Satire und das Verbot von Regimezeichen bleiben bestehen.

**Welt-Paket 1 (04.10., Codex):** Fassaden-/Wasser-/Kontaktpass ist im Laufzeitstand gebaut. Der Blender-Häuserblock hat jetzt schmale Granitsockel statt einer geschlossenen Wand vor den Ladenfronten, einen gegliederten Doppeltüreingang und geteilte Fensterrahmen. Kanal und weitere Wasserflächen teilen eine schwache, animiert versetzte Normalstruktur. Bei Regen erzeugt jedes Kart an einer Pfütze mit Fahrt über 6 m/s einen eigenen, auf 44 lebende Partikel begrenzten Heck-Sprühnebel; sechs gleichzeitig sichtbare Karts bleiben damit bei maximal 264 Sprühpartikeln. Der frische vollständige Blender-Bau und GLB-Optimierung sind abgeschlossen: 22.076.572 → 15.632.728 Bytes (−29,2 %). Build und Volltests sind grün; die Regenwelt ist live geprüft. Der Spraytrigger wurde technisch integriert, aber noch nicht im menschlich sichtbaren Pfützenübertritt abgenommen.

**Welt-Paket 1a (04.10., Codex):** Zusätzlich reagiert die Kanaloberfläche jetzt bei einem schnellen, flachen Wasserkontakt mit einer hellen Heckfahne. Ein hoher, sauberer Sprung löst sie nicht aus; pro Kart stehen höchstens 28 Partikel bereit (max. 168 für sechs Karts). Regressionstest deckt Kanal-/Höhen-/Tempo-Schwelle und den reduzierten Effektmodus ab. `npm test`: 53/53 und Produktionsbuild: 1.296 Module erfolgreich. Frischer Regenstart mit neuer Welt bleibt stabil. **Offen:** den Sprühnebel gezielt beim echten Kanaldurchgang/Pfützenkontakt im Spiel sehen und die Wasseroberfläche aus nächster Entfernung beurteilen.

**Wasser-Pass 1b (04.10., Codex):** Die gemeinsame Wasser-Normalkarte bleibt dezent, aber ihr Relief ist von `.16` auf `.27` und der Flussversatz auf `.035/.009` pro Sekunde erhöht. TypeScript/Vite-Build erfolgreich. Der Kanal war im letzten Spielbild noch nicht in Nahaufnahme; die sichtbare Stärke ist nicht abgenommen.

**Fahrzeug-Pass 1 (04.10., Codex):** Die vier gemeinsam genutzten Radmodelle enthalten jetzt feine Seitenwandrippen und je Felgenseite acht metallische Befestiger. Der 6.542.240-Byte-Roh-GLB wurde zu 4.843.924 Bytes optimiert; das sind 8.184 Bytes weniger als der vorige Runtime-Export. Die vier Rad-Pivot-/Spin-Namen sind beim Export erhalten. Produktionsbuild und Vollsuite bestanden. Wegen fehlender unabhängiger CDP-Fahrtaufnahme bleibt die Nahsicht auf die neue Geometrie visuell unbestätigt.

- [x] Fassadengeometrie neu bauen und optimieren; Runtime-GLB von 22.076.572 auf 15.632.728 Bytes reduziert (−29,2 %). Ladenfront/Sockelkorrektur ist im Generator und frischen Blend-/GLB-Build enthalten; gegenüber dem vorherigen Runtime-Modell wächst die Weltdatei um 3.146.048 Bytes (+25,2 %).
- [x] Wasser bekommt dezente animierte Oberflächenstruktur; Regen bekommt begrenzten, pro Fahrzeugen getrennten Reifen-Sprühnebel.
- [x] Regen-Laufzeitansicht im In-App-Browser: nasser Straßenbelag, Regen, HUD/Item-Slot und sechs Karts sichtbar; kein Lade-/WebGL-Ausfall.
- [x] Kanal-Heckfahne als begrenzter, flacher Oberflächenkontakt-Effekt ergänzt; hohe Sprünge und langsame Karts lösen ihn nicht aus, reduzierte Grafik halbiert die Rate grob.
- [ ] Nahansicht von Häuserfront und bewegter Wasserfläche sowie sichtbare Reifenfahne bei gezieltem Pfützen-/Kanalkontakt im Spiel aufnehmen/prüfen.

- [ ] Stalin-Kopf/Körper/Kart als ersten hochwertigen, animierbaren Laufzeitanker sichtbar weiterentwickeln; klar menschliche Gesichtsvolumen, sauberer Hals-/Kragenübergang, erkennbare Augen/Mund/Frisur und glaubwürdige Handform am Lenkrad. Front, Seite, Nahansicht und Fahrt prüfen; danach Maßstab auf übrige Fahrer übertragen.
- [ ] Karts mit Blender-Geometrie und gemeinsamen Fahrwerks-/Steuerverträgen zu sechs klaren Silhouetten ausbauen: echte Karosserievolumen, modellierte Front/Heck/Kotflügel/Räder/Cockpit, sichtbare Materialien und personenspezifische Details. Keine Trecker-Silhouette; der Traktor bleibt Wurfobjekt.
- [x] Gemeinsame Felgen bekamen einen schlanken Geometrie-Detailpass (Seitenwandrippen, Felgenmuttern); der größere personenspezifische Silhouetten- und Gesamtfahrzeugpass bleibt offen.
- [ ] Streckenwelt aus realitätsnäheren Gebäudefassaden, Dächern, Fensterlaibungen, Eingängen, Laternen, Tribünen und Straßenmöbeln aufbauen. Erster Fassadenpass (Sockel, Eingang, geteilte Fenster) ist gebaut; Detail-/Runtime-Nahabnahme und weitere Architektur bleiben offen. Fahrspur, Sichtlinien und Performancebudget erhalten.
- [ ] Pflaster/Asphalt mit lesbarer Maßstäblichkeit, Fugen/Abnutzung, Randübergängen und passenden Kontakt-/Spritz-/Staubeffekten verbessern. Wasser bekam subtile bewegte Normalen und Regen einen gedeckelten Reifenspray-Pfad; Pfützenübertritt visuell abnehmen und Wasserreaktion an der Kanalquerung/Uferkante ergänzen.
- [x] Ein-Item-HUD: projektil-/fahrerabhängiges Symbol, Name, leerer/„IM SLOT“-Status, zugänglicher Status-/Buttontext. E, Maus und Touch teilen jetzt denselben Haltepfad: halten zeigt das Schild, loslassen wirft; ein schneller Tap wird nicht zwischen Physikframes verschluckt. Aufnahme-/Itemregeln sowie Pointer-Halten, Loslassen, Tap und Abbruch sind automatisiert regressionsgeprüft.
- [ ] **Laufzeitabnahme offen (05.10.):** Im Browser wurde freie Fahrt gestartet; Itemkisten waren sichtbar. Das Kart fuhr ins Hafenbecken, worauf die Wasserrettung einsetzte. Es wurde kein Item aufgenommen, der Slot blieb leer und E-Halten/Loslassen wurde nicht geprüft. Wiederholen mit kontrollierter Linie oder reproduzierbarer Teststrecke; Tastatur, dann Bildschirmbutton/Maus-/Touch prüfen. Quellpfad und Pointer-Regression ersetzen die Fahrt nicht.
- [x] **Itemtreffer-Schaden ist in `src/damage.ts` bereits umgesetzt:** jeder frische Projektil-/Fallen-Treffer zieht Haltbarkeit ab; Mensch und Bots teilen dieselbe Logik. Wiederholte Treffer bis Totalschaden und Reparaturpfad werden zusätzlich regressionsgeprüft.
- [x] Der 0–100-Karosseriezustand ist auch als zugänglicher ARIA-Meter mit aktuellem Prozentwert und verständlichem Totalschaden-Text ausgezeichnet.
- [ ] Bildreferenz in Paketen auf Laufzeitmodelle übertragen: echtes Spielbild, Winkel/Bewegung, Lesbarkeit und begrenzte Geometrie-/Partikelkosten abnehmen. Konzeptillustrationen ersetzen keine 3D-Laufzeitprüfung.

**Nächster Schritt:** Sichtbar nahe Fassadenfront, Wasserstruktur, Rad-Detailpass und ausgelösten Regen-/Kanalspray bei einer kontrollierten Fahrt belegen. Danach den Fahrer-/Kartanker mit Nah-, Seiten- und Bewegungsbildern fortsetzen. Item-Slot und kumulativer Schaden sind umgesetzt und regressionsgeprüft; Maus-/Touch-Halten ist jetzt ebenfalls im gemeinsamen Inputpfad, die interaktive HUD-Fahrt bleibt offen.

## Regen-Wolkenschatten – 04.10.2026 (Codex)

**Aktuell:** bestätigtes M5-Atmosphärenziel aus LONG-TERM-GOALS.md; fünf kleine weiche Laufzeitschatten nur im Regen sichtbar machen.

- [x] Fünf wandernde Asphaltflecken mit einer festen 512×512-Alpha-Textur umgesetzt; Alpha-Blending ausdrücklich aktiviert. Regenmenge bleibt auf fünf Meshes und eine Textur begrenzt.
- [x] Ursache der unsichtbaren Flecken/Pfützen behoben: `setWeather` rief `setRain(true)` vor `setSnow(false)` auf, wodurch der Schneerückfallpfad `setWet(false)` sofort alle Regenflächen deaktivierte. Reset jetzt vor dem Regenaufruf.
- [x] Browservergleich bei `?weather=rain` und `?weather=sun`: weicher, klar erkennbarer Schatten und Pfützen bei Regen; beide fehlen bei Sonne. Full suite und Produktionsbuild geprüft.

**Ergebnis:** M5-Schattenpunkt abgeschlossen. Wetterumschaltung erneut prüfen, falls die separate Schnee-/Eisoberfläche ausgebaut wird.

## Projektstart und Arbeitslistenabgleich – 04.10.2026 (Codex, Marcel)

**Aktuell:** PC-Checkout sauber, nach `origin`-Fetch auf dem gemeinsamen Commit `00e8173`; Team-Workflow meldet neue Babylon-Basis, keine ungesicherten Dateien und keine Überschneidungen. Der Arbeitsbranch ist `codex/team-marcel-20261004-132611-615`.

- [x] **PC-/Cloud-Stand geprüft:** Projektstart hat `origin/main` von `00e8173` auf `babd984` aktualisiert; die zwei Remote-Dokumentänderungen wurden mit den lokalen Inhalten zusammengeführt. Die alten 47/47-Test- und Buildbelege beziehen sich auf den früheren Stand `00e8173`; nach dem aktuellen Merge sind Tests/Build erneut auszuführen. Bekannte Warnung zum großen Hauptchunk bleibt bestehen.
- [x] **Handyänderungen abgeglichen:** die aktuelle Arbeitsliste und Marcels neue Spielideen/Abnahmepunkte liegen bereits auf `origin/main`; keine lokale Abweichung oder Kollision.
- [ ] **Sarahs tatsächlichen Abruf prüfen:** ihre Geräte-/Kontoseite ist in diesem Checkout nicht sichtbar. GitHub-Remote ist erreichbar; Sarahs erfolgreichen Fetch nicht behaupten.
- [x] **Vorhandenes Kontakt-/Schadenspaket technisch geprüft:** Wandgleiten, kumulativer Schaden, dreisekündige Werkstattpause und Schutz nach Reparatur sind bereits im gemeinsamen Stand. Modelltests decken flache Wandkontakte, Kartkontakte, Schaden und Ausfall ab. Die echte menschliche Fahrgefühl-Abnahme bleibt offen; deshalb in diesem Paket keine Balancewerte geändert.
- [ ] **Nächster Grafikschritt:** Quaternius bestätigt CC0; das kostenlose Standardpaket ist 122 MB und enthält glTF. Die vollständigen `.blend`-Quellen gehören zum kostenpflichtigen Source-Paket (19,99 USD), das nicht verwendet wird. Der Browserdownload des Standardpakets lieferte keinen abrufbaren lokalen Dateipfad; glTF-Import/Blender-Anpassung ist noch offen. Quelle und Lizenz: [Quaternius](https://quaternius.com/packs/universalbasecharacters.html), [itch.io](https://quaternius.itch.io/universal-base-characters).

**Nächster Schritt:** den P2-Fahrer-/Cockpitpass mit dem editierbaren eigenen Modell fortsetzen; einen kostenlosen glTF-Zugang können wir ergänzen, sobald itch.io die Datei zuverlässig ausliefert. Nutzer-Fahrtest für Wandkontakte und Sarahs PC-Abruf später ergänzen.

- [x] **P2-Porträts isoliert:** andere Karts sind während jeder Portraitaufnahme verborgen und werden danach wiederhergestellt. Die sechs Live-Porträts wurden im aktuellen Browser geprüft; keine Nebenfahrer mehr im Bildhintergrund.
- [x] **P2-Porträts als Studioaufnahme:** neutrale dunkle Studiofläche, engerer Gesicht-/Schulterausschnitt, übrige Szene/Karts ausgeblendet und Partikel während der Einzelaufnahmen pausiert. Alle sechs Karten in der Laufzeit geprüft; Spielszene wird danach wiederhergestellt.
- [ ] **P2-Gesichter/Cockpit:** erster Proportions-/Material-/Detailpass in `art-source/build_kart.py` (kleinerer Kopf zum Oberkörper, matterer Hautton, braune Augen, kleines Munddetail) wurde neu gebaut und in den Laufzeitkarten gesehen. Modelle bleiben Karikaturen. Weiter offen: erkennbare Gesichtsformen sowie Sitz-/Bein-Feinschliff.
- [x] **P2-Cockpit-Sitz – Bestandsprüfung:** Sitzfläche, Rückenschale und Ziernähte sind in `art-source/build_kart.py` bereits vorhanden und am Kart-Root befestigt; die Oberschenkel beginnen auf Sitzhöhe. Im aktuellen Rennen aus Verfolgeransicht sichtbar geprüft. Die weitergehende menschliche Sitz-/Beinpassform bleibt Teil des offenen P2-Abnahmepunkts.
- [ ] **Hupen-Quellenprüfung (04.10.):** Commons führt `Hit43.ogg` als 25-s-Aufnahme einer anonymen 1943er Rede, in der Hitler die alliierten Bedingungen zurückweist; das ist kein neutraler kurzer Gruß und wird nicht übernommen. `It-Benito_Mussolini.ogg` ist eine 2,2-s-Namensaussprache einer Commons-Nutzerin unter CC BY-SA 3.0/GFDL, keine historische Mussolini-Aufnahme. Beide Kandidaten erfüllen den Auftrag nicht; geeignete historische Kurzaufnahme mit belegter Person, geeignetem Inhalt und klar dokumentierbarer Lizenz bleibt offen. Quellen: [Hit43](https://commons.wikimedia.org/wiki/File:Hit43.ogg), [It-Benito Mussolini](https://commons.wikimedia.org/wiki/File:It-Benito_Mussolini.ogg).
- [x] **Bot-Ideallinie durch die Hinterhofgasse:** Bot 3 bindet früh an den Abkürzungs-Eingang und folgt dort einer eigenen Kurvenlinie. Zielkorridor ist auf einen Bot begrenzt, damit das Feld die schmale Passage nicht gleichzeitig blockiert. Ein-Szenario-Test belegt Abkürzungsnutzung und drei abgeschlossene Runden; Mehrbot-Rennen beendet ebenfalls alle drei Runden.

## Qualitätssprung + Mechanik-Vergleich – 04.10.2026 (Nachmittag, Claude)

**Vergleich mit Mario Kart World / 8 Deluxe (Prinzipien, keine Kopie; Referenz: nintendo.com, mariokart8.nintendo.com):**

| Bereich | Vorhanden und geprüft | Verbesserungswürdig | Fehlt, sinnvoll | Derzeit nicht sinnvoll |
|---|---|---|---|---|
| Fahrgefühl/Drift | Drift mit Gegenlenken, **3 Mini-Turbo-Stufen (neu)**, ruhigerer Driftbogen (neu) | menschliche Feinabstimmung | – | – |
| Sprünge/Boost | Rampe+Kanal, Landeschub, **Trick in der Luft (neu)**, Boostflächen, Startschub | weitere Rampen | Gleitflug-Abschnitt | Anti-Schwerkraft |
| Strecke/Abkürzungen/Oberflächen | Hinterhof-Abkürzung, Krater, Hafen/Lava/Abgrund, Pfützen/Schnee | Gefahren stärker in Ideallinie | Schotter-/Gras-Oberfläche mit Grip | Open World |
| Bots/Überholen | gleiche Physik, Drift, Panzer-Bot, **Windschatten (neu, für alle)** | Überholmanöver/Linienwahl | Schwierigkeitsstufen | – |
| Items/Gegenmaßnahmen | 3 Archetypen, Figurenwurfobjekte, Schutzzeit, Warnung | Item hinten halten als Schild | Gegenmaßnahme gegen Verfolger | Kampfmodus/Arena |
| Rennen/Modi | Grand Prix 3 Runden, Fahrerwahl, **Zeitfahren mit Geist (neu)**, Schnellneustart | Siegerehrung | Cup aus mehreren Rennen (erst mit 2. Strecke) | Online, Knockout |
| Zugänglichkeit | **Auto-Gas, Lenkhilfe (neu)**, ruhige Kamera, reduzierte Effekte | Tastenbelegung ändern | – | – |
| Rücksetzung | B, Steckenbleiben, Bergungsamt, Werkstatt | – | – | – |
| Fortschritt/Wiederspielwert | Bestzeiten, Geist, Zufallswetter/Tag-Nacht | – | Medaillen-Zeiten pro Strecke | Freischalt-Shop |

- [x] **Drift entschärft:** Grundbogen ~22 m statt ~12 m, Gegenlenken öffnet bis fast geradeaus, Einlenken bis ~10 m; Simulation auf echter Strecke (10/13/16 m/s, je 150 s): 0 Wandkontakte, Turbos aller Stufen. Menschlicher Fahrtest offen.
- [x] **Mechanik-Paket:** 3 Driftstufen (Funken silberblau/gold/rot), Windschatten (1 s hinter Rivale → Schub, Spieler+Bots), Sprung-Trick (Space in der Luft → größerer Landeschub, Bots teils), Auto-Gas + Lenkhilfe (Optionen).
- [x] **Zeitfahren mit Geist:** Menü „Zeitfahren mit Geist“, allein ohne Items/Bots, Bestfahrt als halbtransparenter Geist (lokal gespeichert); geprüft: Speichern (304 Punkte) und Wiedergabe.
- [x] **Grafik Hoch:** SSAO2-Umgebungsverdeckung + volumetrische Sonnenstrahlen (Optionen → Grafik Basis/Standard/Hoch); Bilder `docs/evidence/2026-10-04-high-*.jpg`.
- [x] **Item-Gegenmaßnahme:** E halten = Item hinten als Schild (fängt ein Geschoss von hinten ab, wird verbraucht), loslassen = werfen; Bots schirmen beim Warten ab. Unit-Test.
- [x] **Eigene Karosserie je Figur:** Roadster (Hitler), Staatslimousine (Stalin), Rennwagen mit Heckflosse (Mussolini), rundliche Limousine (Mao), Rakete mit Leitwerk (Kim), Geländewagen mit Überrollbügel (Castro). Bild `docs/evidence/2026-10-04-individual-bodies.jpg`.
- [x] **Realistischere Fahrer:** menschliche Kopfproportionen (Kopf 70 %, tiefer auf dem Kragen), Haut mit Lichtstreuung, glänzende Augen. Weiter offen: echte Modellierung/Sculpting realistischer Gesichter (z. B. freie CC0-Basisköpfe, in Blender angepasst).
- [x] **Bots überholen gezielt:** fünf Spuren, Spuren mit langsamerem Vordermann werden gemieden, Abbremsen nur bei blockierter Überholspur; Simulation 3 Runden: 9 → 16 Platzwechsel, alle im Ziel.
- [x] **Erste echte Stimme:** Mussolini-Sprachhupe = Originalton „Bivacco“-Rede 16.11.1922 (Redebeginn, Wikimedia Commons, gemeinfrei), Schnitt `art-source/cut_real_voices.mjs`. Hitler-Kandidat „Speech in 1935“ (gemeinfrei) **nicht eingebaut**, weil Inhalt erst menschlich angehört werden muss (Ausschluss verbotener Parolen). Stalin/Mao/Kim/Castro: Rechte ungeklärt, weiter Platzhalter.
- [x] **Hupen wieder TTS (Marcel):** Mussolini-Originalton zurückgestellt; Quelle/Schnittskript bleiben für später (`art-source/cut_real_voices.mjs`, Ausgabe nur noch nach `.tools/`). **Merken:** echte historische Hupen später erneut angehen.
- [x] **Charaktermodell überarbeitet (Blender):** Kopf als durchgehend modellierte Oberfläche (Brauenwulst, Augenhöhlen, Wangenknochen, Kiefer, Kinn) statt aufgesetzter Kugeln; Keilnasen; geformte Stiefel statt Kugeln; Taille statt Kugelbauch. Bild `docs/evidence/2026-10-04-sculpted-head.jpg`.
- [x] **Beine/Füße/Pedale:** Armaturenbrett nach vorn/oben, Knie darunter, Schienbein zum Pedal, Stiefelsohle auf Gas/Bremse (bewegen sich mit Eingabe).
- [x] **Haare als Schale am Schädel** je Frisur (keine Helmkugeln mehr), geformte Schultern/Handflächen; **Parade-Front nur am Roadster**, andere Karosserien zeigen eigene Nasen. Bilder `docs/evidence/2026-10-04-portraits-hair-shells.jpg`, `…-grid-distinct-fronts.jpg`.
- [x] **Gegnerstärke leicht/mittel/schwer** (Optionen; nur Grundtempo, gleiche Physik; Simulation Siegerzeit 190/175/164 s) und **Zeitfahr-Medaillen** Bronze/Silber/Gold (≤ 206/184/169 s).
- [x] **Zweite Sprungrampe** auf dem Boulevard zwischen Tor und Abkürzung (Rampen verallgemeinert `RAMP_LIPS`; Trick/Landeschub gelten dort ebenso).
- [ ] **Nächster Grafikschritt:** freie CC0-Basisfigur in glTF-Form sichern und in Blender sitzend anpassen; Schultern/Arme weiter verfeinern. Quaternius-Lizenz-/Downloadbefund und Zugriffsblockade stehen im Projektstart-Eintrag oben.
- [ ] Offen: individuelle Kart-Karosserien je Figur, weitere Strecke.

## Stand 04.10.2026 (Mittag, Claude) – Marcels neue Aufträge

- [x] **Lenkung direkter:** schnelleres Zurückstellen beim Loslassen (Rate 18/s statt 6/s), straffere Gierreaktion, Lenkwirkung sanft ~12 % höher. Fahrgefühl-Abnahme durch Marcel offen.
- [x] **Karte 1,5× größer** (`MAP_SCALE` in `src/track-layout.ts`, ~890 m statt 593 m); Welt, Landmarken, Gefahren, Boostflächen, Items und Tests mitskaliert, Blender-Welt neu gebaut.
- [x] **Kanalsprung als echter Streckenabschnitt:** Wasserkanal quer über die Start-/Tribünengerade, Boostfläche → Holzrampe → Sprung; saubere Landung gibt Schub, zu langsam = ins Wasser, Staatliches Bergungsamt holt zurück. Gleiche Regeln für Bots.
- [ ] **Echte historische Sprachhupen (freigegeben, Download erlaubt, Claude entscheidet):** noch nicht begonnen. Plan: nur rechtlich klare Aufnahmen (Hitler/Mussolini-Reden gemeinfrei, Quelle z. B. Wikimedia Commons mit Lizenzangabe), kurze unverfängliche Anrede-Ausschnitte (keine verbotenen Parolen nach § 86a StGB), Schnitt mit portablem ffmpeg unter `.tools/`; Stalin/Mao/Kim/Castro bleiben wegen Urheberrecht vorerst Platzhalter. Quelle/Lizenz in CREDITS.md.
- [ ] Weitere Ideen: Gefahrenzonen noch stärker in die Ideallinie ziehen (z. B. Lava-Abkürzung), weitere Rampen, Gesichter weiter verfeinern, Fahrtest aller Werte.

## Stand 04.10.2026 (Vormittag, Claude) – Arbeitslisten abgearbeitet

- [x] PC-/Handy-Abgleich geprüft: Abend-Upload `3bfe3a2` in main, Handy-Doku sichtbar, keine Konflikte.
- [x] **Wand/Schaden (P1):** Banden gleiten statt kleben (Nase dreht zur Wand, Frontaleinschlag bleibt hart); Haltbarkeit pro Kart, Qualm/Ruß, Totalschaden mit Explosion, herausgeschleudertem Fahrer und 3-s-„Staatliche Werkstatt“; HUD „Karosserie“. Werte vorläufig, Fahrtest offen.
- [x] **Fahrer/Cockpit (P2, Teil):** Finger am Lenkrad (Handschuhe sitzen fest am Kranz, Arme folgen), Pedale bewegen sich, Rückspiegel im Fahrerblick, Vorderrad-Einschlag korrigiert (war spiegelverkehrt), erwachsenere Gesichter. Offen: Beine/Sitz-Feinschliff, noch realistischere Gesichter.
- [x] **Tag-Nacht (P3):** zufällig pro Rennen Tag→Dämmerung→Nacht über drei Runden, Sterne, Mond, Mondlicht, Vögel/Fledermäuse, wehende Zeitungen, liegenbleibende Wrackteile; Lichter scheinen nicht mehr durch Figuren.
- [x] **Gefahren + Bergung:** Hafenbecken (Westkurve), Staatsofen-Lavagrube (Nordostkurve), abstraktes Übungsgelände mit Granattrichtern; Abgrund/Klippe (Westgerade); Kran des „Staatlichen Bergungsamts“ setzt nach ~3 s an gleicher Position zurück, gleiche Regeln für Bots.
- [x] **Mechaniken:** Boostflächen (3), Startschub zum „LOS!“, Schnellneustart T, pulsierende Itemwarnung, Zeppelin-Ereignis in Runde 2.
- [x] Live-Videowand zeigt wieder alle Fahrer (vorher nur Schatten außerhalb des Blickfelds).
- [ ] Offen: echte historische Sprachhupen (Quellen-/Lizenzprüfung, Download nur mit Freigabe), Landeschub (braucht erst eine echte Rampe, sonst per Hop ausnutzbar), weitere Oberflächen.

## GitHub-Abgleich und Arbeitsstand – 05.10.2026

- [x] **Remote-PC-Branch gegen damaliges main geprüft:** `codex/team-marcel-20261004-110953-055` war bei `00e8173` mit main identisch; der ältere Branch `codex/team-marcel-20261004-094440-433` lag 16 Commits zurück und hatte keine exklusiven Commits. Die Handy-Dokumentcommits `6efbc49`, `afdd515` und `76234f0` sind Vorfahren dieses main-Stands.
- [x] **Lokaler Projektstart und Synchronisierung:** `git fetch origin` fand `00e8173..babd984`; das Startskript verglich die beiden Seiten. Die Überlappung lag in `CURRENT-WORKLIST.md` und `PROGRESS-LOG.md`; beide Seiten wurden inhaltlich zusammengeführt. Die zwei verifizierten Remote-Notizcommits bleiben in der Historie; lokale Babylon-Arbeit blieb erhalten.
- [ ] **Geräteabnahme:** Sarahs tatsächlichen Abruf und Marcels separate Handy-App können hier nicht verifiziert werden.
- [x] **Bereits implementierte Mechaniken nicht doppelt bauen:** Wandgleiten, kumulative Schäden/Werkstatt, Kanal/Hafen/Lava/Klippe/Kran, Tag-Nacht/Partikel, Cockpit-Grundfunktionen, Boostflächen, Start-/Landeschub, Zeppelinereignis, Item-Schild/-Warnung und Neustart sind laut Code/Tests bereits vorhanden. Die gezielten visuellen und menschlichen Abnahmen bleiben einzeln offen.
- [ ] **Bestätigte Restziele:** persönliche Wand-/Schadensfahrt; Gesichts-/Sitz-/Beinpass und Qualitätsanker; abstrakte Übungsgrube mit echter Absturz-/Bergungsreaktion; Schotter-/Grasfeedback; echte historische Sprachhupen nur nach Quellen-, Inhalts-, Rechte- und Hörprüfung.
- [ ] **Arbeitsreihenfolge:** zuerst laufender Stalin-/Limousinen-Qualitätsanker, dann Welt-/Wasserkontakte und Drift nach dem priorisierten Leitauftrag. Danach geeignete Restziele aus M4/M5 in prüfbaren Paketen.

## Morgen arbeiten – 05.10.2026

Nach der Git-/PC-Abgleichprüfung die folgenden Nutzeraufträge als priorisierte Arbeitspakete beginnen. Frühere Ideen und Kollisionstests in `docs/07-gameplay-systems.md`, `docs/02-art-direction.md`, `docs/12-decision-log.md` und [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) mitprüfen. Ein nicht vollständig umgesetztes Paket mit echtem Zwischenstand und nächstem Schritt stehen lassen.

- [x] **Wand- und Fahrzeugkontakte / Schadensmodell – Priorität 1, technischer Stand:** schräges Bandengleiten, Kartrempler, kumulative Haltbarkeit, sichtbarer Totalschaden und dreisekündige Werkstattpause sind implementiert und die bestehenden Modellchecks bestehen. Vorläufige Werte bleiben unangetastet.
  - [ ] **Menschliche Fahrgefühl-Abnahme:** typische schräge Wandkontakte, harte frontale Treffer und Kartrempler selbst im Rennen beurteilen; erst danach Balancewerte ändern.
- [ ] **Historische Fahrer und Cockpit – Priorität 2:** Gesichter erwachsener, detailreicher und realitätsnäher ausarbeiten (nicht kindhaft/niedrigpolygonig, darf stilisiert überhöht bleiben); Fahrer richtig in einen modellierten Sitz setzen. Unterkörper/Beine dürfen nicht in der Karosserie stecken. Hände mit Fingern greifen sichtbar das Lenkrad und bewegen sich mit; Füße stehen passend auf modellierten Gas-/Bremspedalen, die sich bei Beschleunigen/Bremsen bewegen. Lenkrad verbessern. Fahrerperspektive, Außenspiegel und Vorderräder prüfen; in First Person müssen Vorderräder entsprechend der Lenkrichtung einschlagen und Spiegel korrekt ausgerichtet sein.
- [x] **Zufälliger Tag-Nacht-Lauf und Streckenleben – technische Umsetzung:** Übergang, Wettervarianten und begrenzte Streckenreaktionen sind im aktuellen Spielstand vorhanden; frühere Browser-/Laufzeitbelege stehen im Fortschrittslog. Gemeinsame menschliche Lesbarkeits-/Leistungsabnahme bleibt offen.
- [x] **Strecke erweitern: Absturzgefahren und Bergung – technische Umsetzung:** Hafen/Kanal, Klippe, Ofen-/Lavaabschnitt, abstrakter Übungsparcours und Staatliches Bergungsamt sind umgesetzt. Botgleichheit und Streckenlogik sind Teil der bestehenden Modellprüfungen; menschliche Fahrabnahme bleibt offen.
- [ ] **Echte Fahrer-Sprachhupen – Quellenprüfung:** Statt TTS oder neu eingesprochener Texte echte, wiedererkennbare historische Live-/Archivaufnahmen aus belegten Quellen recherchieren. Person, genauer Ausschnitt, Inhalt, kostenlose Nutzungsrechte und Eignung für die Satire prüfen; erst bei geklärter Herkunft und Lizenz herunterladen/in das Spiel übernehmen. Keine erfundenen Originalzitate.


- [x] **Wow-/Feel-Good-Mechaniken:** Boostflächen und saubere Landungen belohnen Spieler und Bots bereits; technische Umsetzung steht in der Vergleichstabelle und im Fortschrittslog. Menschliche Balance-/Lesbarkeitsabnahme bleibt offen.
- [x] **Zusätzliche Rennmechaniken und Quality-of-Life:** Startsignal/-schub, Oberflächenrückmeldung, Streckenereignis, Bergung, Trefferwarnung und Schnellneustart sind vorhanden; nicht nochmals parallel bauen.
- [x] **Eigenständige Kart-Prinzipien:** Risiko-Abkürzung, Rampen/Landezonen, Hop/Drift/Mini-Turbo, Warnungen/Comeback und Rundenveränderungen sind als Projektmechaniken vorhanden. Keine 1:1-Kopie und kein Open-World-/Knockout-Paket begonnen.

**Aktuell (04.10. Abend, Claude):** Kamera-Maus repariert, historischer Startkader auf Karikaturstufe, Fahrerwahl mit Porträts, figurenspezifische Wurfobjekte, Panzer nur für Hitler (auch als Bot), eigener deutscher Marsch statt Klaviermusik, Ziel-Feuerwerk und Siegerporträts. Alles im Browser geprüft; Hör-/Spielabnahme durch Marcel und Sarah offen.
**Danach:** Gesichter/Haare weiter verfeinern (Marcel: „noch Optimierungsbedarf“), Marsch menschlich anhören und ggf. nachschärfen, eigene Fähigkeiten für Stalin/Mussolini/Mao/Kim/Castro nach gemeinsamer Bestätigung, Wolkenschatten im Regen, Bot-Ideallinie Hinterhofgasse.
**Arbeitsbranch:** codex/team-marcel-20261003-232302-374 (Projektstart 04.10., Claude, auf main f784078). Abschluss nach main am 04.10. nachts; Details in PROGRESS-LOG.md.

## Ganz oben – Marcel, 04.10.2026 (Abend)

- [x] **Kamera-Maus reparieren (Priorität 1):** Linke Maustaste halten = umsehen, rechte = zurückschauen. **Befund:** `src/mouse-camera.ts` war unverändert ChatGPTs Stand `e5152ab`; ChatGPT und Claude arbeiten im selben Ordner `D:\Diktator-Kart` auf demselben Stand (Server-Kennung zeigt Ordner/Branch/Commit). Ursache: Die Geste brach ab, sobald ein Browser den Pointer Lock verweigert (z. B. eingebauter App-Browser, Chrome kurz nach Esc). **Fix:** Geste läuft dann über Pointer Capture weiter. Im Browser per Ereignistest geprüft; **Marcels eigener Test in Chrome steht aus.**
- [x] **Charakterauswahl vor dem Rennen:** „Grand Prix starten“/Enter öffnet die Fahrerwahl mit sechs live aus den Rennmodellen gerenderten Porträts (Studiolicht, ohne Sonnenschatten), Name, Kartname, Titel/Beschreibung und Fähigkeit/Wurfobjekt aus dem Fahrerkatalog. ←/→ wählen, Enter/Klick startet, Auswahl wird gespeichert; das Kart im Menü wechselt live. Revanche behält die Figur.
- [x] **Historischer Startkader (Karikaturstufe):** Hitler (Seitenscheitel, Stirnlocke, Zweifingerbart), Stalin (zurückgekämmtes graues Haar, Walrossbart, Pfeife), Mussolini (Glatze, Kinn), Mao (hohe Stirn, Muttermal, grauer Anzug), Kim Jong-un (Undercut), Castro (Feldmütze, Bart, Zigarre). Keine Regimezeichen. **Noch Optimierungsbedarf** an Gesichtern/Haaren.
- [x] **Schäferhund nur für Hitler, eigene Wurfobjekte aus unseren Ideen:** Mussolini Balkon-Megafon (Altdetail „Mini-Lautsprecher“), Mao rotes Regelheft („flatterndes Regelheft“), Kim Mini-Propaganda-Rakete (Kartname), Castro aufklappender Aktenkoffer (Altdetail), Stalin Fünfjahresplan-Traktor (aus Kartname/Alt-Item „Fünfjahresplan“ abgeleitet; von Marcel am 04.10.2026 bestätigt). Gleiche Trefferregeln für alle.
- [x] **Klaviermusik ersetzt:** eigener „Stadionmarsch der Eitelkeit“ (strammer deutscher Parademarsch, 118 bpm, punktierte Rhythmen, Tuba/Hörner, Trompeten, große Trommel mit Becken, Trio als Grandioso), synthetisiert mit `art-source/build_march.mjs`. Marcels erster Eindruck („lustig, aber nicht wirklich deutsch“) führte zur strammeren Fassung; **erneute Hörprobe offen.** Echte Blasmusikaufnahme wäre später besser (nur mit Freigabe/geklärter Lizenz).
- [x] **Panzer „Größenbefehl“ nur für Hitler:** als Spieler auf Q; fährt man eine andere Figur, setzt der Hitler-Bot den Panzer ein, sobald Gegner nah sind. Andere Figuren zeigen auf Q „eigene Fähigkeit folgt“.
- [x] **Wow-Pakete:** Ziel-Feuerwerk vor der Kamera; Siegerkarte mit Siegerporträt und Mini-Porträts.
- [x] Alter Claude-Worktree entfernt (leerer, von der App gesperrter Ordner `.claude/worktrees/…` kann bleiben; von Git ignoriert). Regel „ein Arbeitsordner für ChatGPT und Claude“ bleibt.

## Zweite Runde – Marcel, 04.10.2026 (spät)

- [x] **Musik strenger und deutscher:** Marsch komplett neu im Stil eines preußischen Spielmannszugs (Trommelmarsch-Intro, Querpfeifen über Trommlerkorps, Posaunen/Trompeten in Oktaven mit Tuba, strenger Moll-Teil, Trio, Grandioso; 112 bpm, wenig Hall). **Hörprobe durch Marcel offen.**
- [x] **Zufallswetter + neuer Effekt:** Beim Laden würfelt das Spiel Sonne (50 %), Regen oder **Schnee** (neu: Flocken, kühles Licht, heller Dunst, frostige Straße, weißer Reifenstaub). Optionen: Wetter Zufall/Sonne/Regen/Schnee; Staatsfernsehen meldet das Wetter.
- [x] **Gesichter/Haare Feinschliff:** Nasenvarianten (Hitler schmal/gerade, Mao/Kim breit/flach, übrige groß), runde Wangen für Mao/Kim, deutlichere Stirnlocke bei Hitler, Kims Undercut mit Hinterkopf. Weitere Verfeinerung bleibt sinnvoll.
- [x] **Panzerräder repariert:** Die Laufrollen standen hochkant und taumelten (Namensfilter erwischte die Rad-Meshes mit). Jetzt korrekt seitlich und drehen um ihre Achse.
- [x] Minikarte zeigt die Gegner in ihren Kartfarben.
- [x] Fahrerwahl: Button „Zufällig 🎲“; Nicht-Hitler-Figuren rufen beim Werfen ihren Spruch (vorläufige TTS-Platzhalter). Siegender Bot ruft seinen Siegerspruch; Rennanzeige nennt die gewählte Figur. Fahrerwahl auch mit Tasten 1–6; gewähltes Porträt „atmet“ leicht. Karten zeigen das Wurfobjekt-Symbol; Hitler-Bot bellt in Spielernähe beim Werfen.

## Offen und als Nächstes

**Abarbeitungsfolge:** Bei „Arbeitslisten abarbeiten“ zuerst die ausführbaren offenen Aufgaben hier umsetzen, anschließend bestätigte Ziele aus [LONG-TERM-GOALS.md](LONG-TERM-GOALS.md) selbstständig in diese Liste übernehmen und bearbeiten. Status und nächsten Schritt sichtbar halten; blockierte Aufgaben bewahren, unabhängige fortsetzen. Budget-/Entscheidungsregeln beachten.

- [ ] Historische Fahrer: erkennbare, realitätsnahe Abbilder, insbesondere Hitler; vorhandene neutralen Figuren ersetzen. Satirische Inszenierung, keine Regimezeichen. Kein fertiges 1:1-Modell behaupten.
- [x] Fahrerporträts: sechs tatsächliche Runtime-Aufnahmen jetzt ohne die übrigen Fahrer im Hintergrund; Gesichter bleiben Karikaturstufe.
- [ ] Sprachausgabe menschlich anhören: Verständlichkeit jedes Textes, freundlichere lebendige Sprecherin. Kürzere Texte und klarere Mischung umgesetzt; Hörabnahme steht aus.
- [ ] Historische Sprachhupen: echte unproblematische Mitschnitte mit belegter Person/Quelle und geklärten kostenlosen Nutzungsrechten. Aktuelle sechs Clips sind eigene synthetische Parodien.
- [x] Abschließender Teamabschluss (41 Tests und Build bestanden, GitHub main 2c6e92d verifiziert): Tests/Build, echte Spielbelege, vier Arbeitsdateien/PROGRESS-LOG.md aktualisieren, neuesten Teamstand integrieren, geprüft nach main veröffentlichen.

- [ ] Fünf weitere archivierte Fähigkeiten (Stalin, Mussolini, Mao, Kim, Castro) nach gemeinsamer Bestätigung umsetzen; heute bewusst nicht, da es keine Fahrerwahl gibt und die Wirkungen von den Katalogideen abweichen (siehe Abgleich).
- [x] Bots: saubere Ideallinie durch die Hinterhofgasse; Bot 3 nimmt die Abkürzung mit separater Kurvenvorschau. (Panzer für den Hitler-Bot erledigt am 04.10.; Simulationstest ergänzt.)

- [x] 04.10., Claude: Wetter „Regen“ (Optionen → Wetter, auch `?weather=rain`): nasse glänzende Fahrbahn, Pfützen mit Spritzern und Wasserbremse, Blitz mit Donner, Regengeräusch. Im Batch-Server geprüft (Rennen, 2 365 Regenpartikel, Bild). Offen: Wolkenschatten, Hörprobe, Feinabstimmung der Spritzer.
- [x] 04.10., Claude: Einheitlicher Arbeitsordner festgelegt (Worktree-Server zeigte wegen `.claude/`-Ignorierregel alten Stand). Hauptordner auf den neuesten Stand gezogen.

## Heute umgesetzt und geprüft

- [x] Fahrt/Kamera zwischen Physikschritten geglättet. **Marcel:** wesentlich flüssiger, fühlt sich sehr gut an. Uneinheitliche GPU-Bildzeiten sind eine separate Grenze.
- [x] Links halten: frei umsehen; rechts halten/X: Rückblick; E: Item. Temporärer Pointer Lock verhindert Cursorwanderung. Sofortigen Rücksprung beim Lock korrigiert; alle drei Kameras geprüft. Eigener Nutzercheck zur nativen Cursorwiederherstellung noch sinnvoll.
- [x] Karosserie-/Motorwackeln reduziert, dezente Haubenhebung; Räder behalten Terrainkontakt.
- [x] Gegenlenken lädt Drift ebenfalls, weitet Kurve und erhält ursprüngliche Richtung; begrenzter Schlupf, mehr Reifenstaub. Eigenständige vorläufige Werte, noch keine menschliche Mario-Kart-Fahrgefühlabnahme.
- [x] Schäferhund als Spieler-Projektil/Verfolger, laufende Beine/Schwanz, synthetisches Bellen, Comic-Trefferwolke. Gemeinsame Treffer-/Fairnessregeln erhalten.
- [x] Erste Atmosphäre-Ergänzung: vier Litfaßsäulen mit eigenen satirischen Plakaten, Haltestellen/Bänke und eigenständiges Adlerornament. Keine historische Rekonstruktion/G–L-Abnahme.
- [x] F als Sprachhupe, einmal pro Tastendruck mit Abklingzeit; sechs vorläufige individuelle Parodieclips. Browser: Halten/Wiederholen begrenzt, danach erneut möglich, Pause still, alle Clips dekodierbar.
- [x] Vier zentrale Dateien im Hauptordner, gemeinsame Navigation, Notizen/Anleitung für euch beide; Kurzbefehle Projektstart/Projektabschluss verankert. Taböffnung angefordert (App meldet queued).
- [x] Sichtbaren Test-Chrome zum Mitverfolgen geöffnet; eigenen früheren Headless-Testbrowser beendet.

## Neue Aufträge

- [x] 04.10., Marcel: umfassend höhere Qualität für Modelle, Charaktere, Fahrzeuge, Strecke, Umgebung, Effekte, Sounds, Stimmen und Musik in LONG-TERM-GOALS.md verankert. Gewählte Bildpräferenz G–L; ausdrücklich kein TTS für fertige Stimmen. **Ziel dokumentiert, Umsetzung offen.**

Hier ergänzt die KI neue konkrete Nutzerwünsche mit Herkunft und Status. Vorhandene Notizen nicht als Zustimmung oder erledigten Auftrag ausgeben.

- [x] 04.10.: Auf Marcels Auftrag Sarahs gemeldete letzte Git-Änderungen prüfen und Claude-Übergabe vorbereiten. Panzer im Archiv e292070 belegt; persönliche Urheberschaft aus Sarahs übermittelter Aussage, Git-Autor Marcel. Weitere Fähigkeiten/Items und Botänderungen mit Quellen dokumentiert.
- [x] 04.10., Claude: Hitlers Panzerverwandlung als „Größenbefehl“ auf Q wiederhergestellt (8 s/18 s, editierbares Modell `art-source/build_tank.py`, Ketten, Verwandlung, Ton, Staub, HUD, Überrollen mit Schutzregeln). Browser mit sechs Karts, allen Kameras, Rückverwandlung und Neustart geprüft; Belege `docs/evidence/slice-tank-*-q3`. Spielerfigur noch neutraler Platzhalter. Ursprünglicher Auftrag: Q, zunächst 8 s Dauer/18 s Cooldown als vorläufige Altwerte, editierbares Modell, Animation/HUD, gemeinsame Treffer-/Schutzregeln, Rückverwandlung/Reset und alle Kameras prüfen. Alte „Endlose Rede“ nicht als aktuelle Panzerumsetzung behandeln. Details im [Abgleich](docs/sarah-feature-audit.md).

- [x] Gemeinsame Budgetregel in Projekt-/Skill-Einstieg verankert; offene Nachricht von Marcel und einmaligen Sarah-Archiv-/Umstiegsbefehl in TEAM-NOTES.md aufgenommen.
- [ ] Sarahs tatsächlicher erster Umstieg auf ihrem PC: lokale Arbeit erhalten, neues GitHub-Archiv verifizieren, Ideen/Herkunft dokumentieren und neue main-Basis öffnen. Hier nicht als bereits erfolgt melden.
