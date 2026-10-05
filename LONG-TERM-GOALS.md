# Langfristige Arbeitsliste – Diktator Kart

> **Rolle und Vorrang (04.10.2026):** Diese Datei ist die gemeinsame Quelle für Bestätigte Langzeitziele und noch unbestätigte Vorschläge klar trennen. Bei einem neueren Nutzerwunsch Zielbeschreibung und Priorität aktualisieren; historische Ideen bleiben als solche erhalten. Die vier Hauptdateien sind [aktuelle Arbeit](CURRENT-WORKLIST.md), [Langzeitziele](LONG-TERM-GOALS.md), [bestätigte Teamänderungen](TEAM-CHANGES.md) und [Notizen/Anleitung](TEAM-NOTES.md). Fachdateien und Logs liefern Details/Belege, ändern diese Steuerung aber nicht stillschweigend. Bei Widersprüchen gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; danach werden Status und Fachtexte angepasst. Frühere Ideen, Entscheidungen und Prüfergebnisse bleiben nachvollziehbar und werden als historisch, offen oder überholt markiert – nicht gelöscht. Technische Belege und damalige Zwischenstände bleiben im [Fortschrittslog](PROGRESS-LOG.md).


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsamer Überblick für Marcel, Sarah und jede KI-Sitzung. Die kurzfristige [Aktuelle Arbeitsliste](CURRENT-WORKLIST.md) führt die laufende Umsetzung; diese Liste hält das Gesamtziel und die nächste sinnvolle Ausbaustufe sichtbar. Verbindliche Detailentscheidungen stehen in den verlinkten Fachdateien. Historische Zwischeneinträge sind keine aktuellen Arbeitsaufträge.

## Übergeordnetes Qualitätsziel – Marcel, 04.10.2026

Das gesamte Spiel auf eine deutlich höhere Qualitätsstufe bringen: wesentlich schöner, realistischer, detailreicher und professioneller. Maßstab bleibt die gewählte Bildpräferenz G–L, insbesondere `references/visuals/style-comparison-02-c-a-refined.png`. Das Maximum aus Babylon.js und verfügbaren kostenlosen Werkzeugen herausholen; Qualität in echter Fahrt beurteilen, bestehende Performanceziele erhalten.

**Nächste Ausbaustufe (04.10.2026):** Der neue Fahrer-/Fahrzeug-Masterauftrag hat Vorrang vor dem kleineren alten Charakterpass. Stalin ist der erste vollständige Benchmark: Kopf-/Halsübergang, Mund, Kleidung, Handgriff, rückwärtige Silhouette und eine eigene repräsentative Straßenlimousine auf gemeinsamem Kartfahrwerk. Im neuesten Teilpass ersetzte eine dunkle, hochgeschlossene, individuell modellierte Tunika den generischen hellen Paradeaufzug; das Studioporträt wurde neu im Spiel geprüft. Sie bildet noch keinen abgenommenen Qualitätsanker. Die Auswahlbilder zeigen sechs getrennte Köpfe und die Körper sind als sechs Karosserievarianten angelegt. Stil-/Anatomiequalität, Nah-/Seiten-/Bewegungsprüfung und die vielen Silhouettenabweichungen pro Kartfamilienmodell bleiben offen. Keine Treckerform; Stalins Traktor bleibt Wurfobjekt. Historische Kopfbedeckungen nur passend zur Person und ohne Regimeabzeichen; Unsicherheiten (Mao: geliehene Mütze auf einem bekannten Foto) nicht als dauerhafte Gewohnheit ausgeben. Aktueller Status: [Arbeitsliste](CURRENT-WORKLIST.md), volle Vorgabe: [Masterauftrag](docs/22-character-vehicle-quality-master.md), technische Belege: [Fortschrittslog](PROGRESS-LOG.md). Quaternius Universal Base Characters bleibt als kostenlose CC0-glTF-Option geprüft, aber lokal nicht abrufbar; kostenpflichtige `.blend`-Source-Variante nicht verwenden.

**Gesichts-Pass 05.10.2026:** Stalin nutzt jetzt eine eigene modellierte Nasenbrücke mit Flügeln/Nasenlöchern anstelle des gemeinsamen kleinen Naselements; Cast-Zuordnung und exportierter GLB-Knoten sind regressionsgeprüft. Das ist ein gezielter Gesichtsschritt, kein vollständiger Anatomie-/Realismus- oder Qualitätsanker-Abschluss. Eine aktuelle Stalin-Nahaufnahme im echten Spiel steht aus.

**Teilpass 05.10.2026:** Alle sechs Köpfe sind wieder rund 10 % größer relativ zu den Oberkörpern skaliert. Stalin trägt zusätzlich eine eigene, detaillierte Feldmütze ohne Insignien; vier fein modellierte Art-déco-Radkappen machen die Limousine erkennbarer und drehen im gemeinsamen Rad-Rig mit. Blender-Quelle und optimiertes Laufzeit-GLB sind aktualisiert; Modellkonfiguration und Scale sind in der Testsuite verankert. Gesamtqualität, menschliche Nah-/Seiten-/Bewegungsprüfung und Übertragung auf die übrigen Karts bleiben langfristige offene Abnahmen. Der zweite vom Nutzer priorisierte Bereich ist kontrollierbarer Drift: technische Simulation deckt drei Kurven und drei Geschwindigkeiten ab; die menschliche Fahrprobe bleibt offen.

**Fahrzeug-/Kappenpass 05.10.2026:** Die Limousine besitzt jetzt eine eigene, niedrig geneigte Touring-Windschutzscheibe mit transparentem GLB-Material, Rahmen, Mittelsteg, Scharnieren und Wischer. Eine Studioaufnahme zeigte die übergroßen Hinterreifen als Treckerhinweis; der gemeinsame sichtbare Hinterradradius ist auf den Vorderradradius angeglichen und bleibt nur etwas breiter. Stalins Seitenhaarlinie wurde vom Deckhaar getrennt, das für die Feldmütze nicht mehr über die Krone ragt. Assetvorschau und Cast-/Glasprüfung stehen in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) / [PROGRESS-LOG.md](PROGRESS-LOG.md). Es bleibt ein Teilpass: keine Nah-/Seiten-/Bewegungsabnahme im echten Babylon-Spiel und keine menschliche Qualitätsabnahme.

**Neue verbindliche Art-Direction (Marcel, 04.10.2026):** Die lokale Bildreferenz [loading-real-progress.png](docs/evidence/loading-real-progress.png) setzt den Qualitätsanspruch für echte Laufzeitgrafik: ausdrucksstarke Fahrer, maßgeschneiderte Karts, räumliche Gebäude, überzeugender Boden/Wasser und sichtbare Umgebungs-/Kontaktpartikel. Die Bildsprache wird eigenständig auf Berlin/Stadion und kritische Satire übertragen; Figuren, Layout, Logos und politische Zeichen des Bildes werden nicht übernommen. Laufzeitassets statt bloßem Ladebild sind das Abnahmekriterium. Gebäude-, Boden-, Wasser- und Partikelpakete werden mit dem Figuren-/Fahrzeuganker abgestimmt.

**Laufzeitpaket 1 (04.10.2026):** Häusergenerator um freigelegte Ladenfronten, schmale Granitsockel, Doppeltür und gegliederte Fenster ergänzt; der frische Stadt-GLB ist 22.076.572 Bytes Quelle / 15.632.728 Bytes Runtime (−29,2 % durch Optimierung, +25,2 % Runtime-Größe gegenüber der vorherigen Weltdatei). Wasser erhielt sanft bewegte Normalen; der Folgepass hebt die Normalstärke auf `.27` und den Flussversatz auf `.035/.009` an. Regen-Reifensprühnebel (44 Partikel je Kart) und flacher Kanalsurface-Spray (28 je Kart) sind begrenzt und nach Kontaktbedingungen geschaltet; sechs Karts ergeben höchstens 264 bzw. 168 Partikel in den einzelnen Effektlagen. Blender-Neubau, Produktionsbuild, Volltests und Regenstart im Spiel bestätigt. Der sichtbare Nah-/Pfützen-/Kanalkontaktbeleg, hochwertige Fahrer-/Fahrzeuge und weitere Umweltdetails sind weiterhin Qualitätsarbeit, keine abgeschlossenen Ziele. Details: [Arbeitsliste](CURRENT-WORKLIST.md) und [Fortschrittslog](PROGRESS-LOG.md).

**Laufzeitpaket 2 (05.10.2026):** Zwei nur 16 cm breite, prozedural texturierte Schaumkanten machen Ein- und Auslauf des querliegenden Kanals lesbarer. Sie liegen 8 mm über der Wasserfläche, vollständig innerhalb der Kanalgrenzen, berühren weder Kollision noch Fahrbahn und fügen keine dynamischen Partikel hinzu. Build und Regression der Geometriegrenzen bestanden; echte In-Game-Nahansicht noch offen.

**Fahrzeug-Paket 1 (04.10.2026):** Die gemeinsame Felge wurde in der editierbaren Kart-Quelle um feine Seitenwandrippen und acht kleine Befestiger pro Felgenseite ergänzt. Der Rad-/Spinvertrag bleibt erhalten; der optimierte GLB wuchs dadurch nicht. Das ist ein erster sichtbarer Detailbaustein, nicht die abgeschlossene individuelle Silhouetten- und Qualitätsüberarbeitung aller Karts. Laufzeitnahsicht und Fahrtprüfung stehen weiter aus.

**Fahrer-Paket 1 (04.10.2026):** Das gemeinsame Laufzeit-Skinmaterial bekommt eine subtil gekörnte Farb-/Normaltextur samt sehr niedriger Reliefstärke, damit Gesichter in Nahansichten mehr Oberflächenvariation haben. Es ersetzt keine anatomische Modellierung und ist ohne Browser-Nahprüfung noch nicht visuell abgenommen.

**Verbindliche Produktionsaufgabe:** [MASTER-AUFGABE Fahrer- und Fahrzeugmodelle](docs/22-character-vehicle-quality-master.md). Die professionell stilisierten, menschlich lesbaren Charaktere und sechs thematisch individuellen Fahrzeuge sind ein gemeinsames, langfristig nachzuverfolgendes Qualitätsziel. Fahrzeuge teilen eine erkennbare Kart-Grundarchitektur, erhalten aber je Fahrer viele silhouetteprägende Abweichungen an Karosserie, Front, Heck, Rädern, Cockpit und Material. Kein Fahrzeug soll wie ein landwirtschaftlicher Trecker aussehen; Stalins Traktor bleibt ein Wurfobjekt. Die aktuelle umsetzbare Benchmark-Phase wird in CURRENT-WORKLIST.md geführt und anschließend auf Kader und Fahrzeuge übertragen.

**Zusätzlicher rig-/abnahmebezogener Qualitätsmaßstab (04.10.2026):** Hand, Handschuh, Manschette und Unterarm bleiben als zusammenhängende Silhouette verbunden; keine vom Arm losgelösten Handschuh-Meshes am Lenkrad. Die Laufzeit-IK führt die komplette Arm-Hand-Einheit zur Griffstelle und passt die Armlänge an den bewegten Anker an; die Hand skaliert gegenläufig, damit die Griffgeometrie nicht mitwächst. Sichtkontakt im Ruhezustand reicht nicht: Links-/Rechtslenkeinschlag und Außenansicht gehören zur Abnahme. Technischer Stand und verbleibender menschlicher Fahrcheck stehen in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md).

- [ ] **Viel bessere Modelle und Charaktere:** glaubwürdige Proportionen, erkennbare historische Gesichter, Haare, Kleidung, Materialien und lebendige Animationen.
- [ ] **Viel bessere Fahrzeuge:** individuelle Formen, mechanische Bauteile, differenzierte Oberflächen und überzeugende, zurückhaltende Bewegung; editierbare Modellquellen.
- [ ] **Viel bessere Strecke und Umgebung:** abwechslungsreiche Streckenführung, realitätsnähere Architektur, Boden/Vegetation, räumliche Tiefe, historische Atmosphäre und markante Blickpunkte.
- [ ] **Viel bessere Effekte und Licht:** hochwertige Schatten/Materialwirkung, Atmosphäre, Staub, Drift, Turbo, Treffer und Wetter; unter Fahrt lesbar und skalierbar.
- [ ] **Viel bessere Sounds:** Motor, Reifen, Kontakte, Items und Umgebung mit räumlicher Wirkung, Charakter und sauberem Mix.
- [ ] **Viel bessere Stimmen – kein Text-to-Speech:** menschlich eingesprochene Aufnahmen oder geeignete echte Mitschnitte mit geklärten Nutzungsrechten. Lebendig, freundlich und verständlich. Auch offline erzeugtes TTS erfüllt das Endziel nicht; vorhandene synthetische Clips als Zwischenstand kennzeichnen und für die fertige Fassung ersetzen.
- [ ] **Viel bessere Musik:** hochwertige, historisch geprägte Musik mit Abwechslung, passenden Übergängen und ausgewogenem Mix; bisheriger Ausschluss elektronischer Stilrichtung bleibt bestehen.
- [ ] **Zusammenhängende Qualität:** alle Bereiche aufeinander abstimmen und mit der Bildpräferenz vergleichen; echte Laufzeitbilder aller drei Kameras und menschliche Hörabnahme. Platzhalter nicht als fertig abhaken.

Umsetzung in sichtbaren Paketen aus M3–M6. Laufender Panzerauftrag und flüssiges Fahrgefühl bleiben berücksichtigt. Herkunft: Marcel, keine neue Sarah-Idee behauptet. Ziel dokumentiert; nicht umgesetzt oder abgenommen.

## So arbeiten wir damit

- Bei Projektstart nach Git-Synchronisierung CURRENT-WORKLIST.md, diese Liste, den kurzen [Änderungsverlauf](TEAM-CHANGES.md) und offene [Teamnotizen](TEAM-NOTES.md) lesen.
- Neue Beobachtungen und konkrete Fehler zuerst in CURRENT-WORKLIST.md aufnehmen. Größere Zukunftsideen hier als Ziel oder Vorschlag festhalten.
- „Arbeitslisten abarbeiten“ beauftragt beide Listen: erst ausführbare kurzfristige Aufgaben, danach selbstständig bestätigte Langzeitziele in sinnvollen Paketen umsetzen. Nicht beim Vorschlagen stoppen. Blockierte Aufgaben erhalten und unabhängige Aufgaben fortsetzen; echte Entscheidungen/unbestätigte Vorschläge brauchen Klärung. Ohne diesen Umsetzungsauftrag zwei oder drei nächste Pakete vorschlagen. Budgetregel beachten.
- Ein gewähltes Paket mit sichtbarem Ergebnis und prüfbarer Abnahme nach CURRENT-WORKLIST.md übernehmen. Erst nach tatsächlicher Prüfung abhaken. Teilumsetzung, Nutzerabnahme und Geräteabnahme auseinanderhalten.
- Details nicht mehrfach pflegen: Roadmap = Meilenstein-/Abnahmevertrag; diese Datei = gemeinsame Aufgabenübersicht; PROGRESS-LOG.md = technische Belege; TEAM-CHANGES.md = wenige wichtige Änderungen für uns beide.

## Leitbild und feste Grundlage

- [x] Babylon.js als aktive Engine; gemeinsamer neuer Hauptstand und sichere Git-Start-/Abschlussbefehle vorhanden.
- [ ] Ein überzeugendes, tatsächlich spielbares satirisches Kartspiel mit deutlich höherer Grafikqualität erreichen. Maßstab: Projektbilder G–L, insbesondere echte Fahrt statt Konzeptillustrationen.
- [ ] Realitätsnahe, eindeutig erkennbare Modelle echter historischer Fahrer und glaubwürdige Berlin-/Stadionwelt ausarbeiten. Neue Präzisierung vom 03.10.2026 ersetzt erfundene Ersatzpersonen als Endziel.
- [ ] Macht, Personenkult, Bürokratie und Diktatoren kritisch und humorvoll inszenieren; keine verherrlichenden Regimezeichen.
- [ ] Ausschließlich kostenlose/vorhandene Werkzeuge und rechtlich nachvollziehbare Assets einsetzen; editierbare Modell-/Audio-/Texturquellen und Herkunft erhalten.
- [ ] Sarahs ursprüngliche Ideen nachvollziehbar bewahren; ihre Änderungen als Vorschlag mit Begründung, gemeinsame Bestätigung vor dauernder Umdeutung.
- [ ] Zunächst privat für uns/Freunde, spätere öffentliche Version kostenlos; keine Käufe, Zusatzabonnements oder automatisch aktivierten Kontingente.

## M2 – Fahrgefühl und technische Grundlage vollständig abnehmen

Vorhanden: sechs Karts, Federung, Hop/Drift/Turbo, Kontakte und drei Kameras. Neu: Renderinterpolation; Marcel meldet deutlich flüssigere Fahrt. Details: [03](docs/03-technology-babylon.md), [04](docs/04-performance.md), [07](docs/07-gameplay-systems.md).

- [ ] Menschlichen Fahrcheck nach allen aktuellen Korrekturen abschließen: Lenkung, enger/weiter Drift, Gegenlenken, Turbo, Bremsen/Rückwärtsfahrt, Hop/Landung, Wand-/Kartkontakte.
- [ ] Nah-/Fernkamera und Fahrerperspektive unter Fahrt, Sprüngen und Kontakten komfortabel abstimmen; Maus nur bei bewusster Geste, Cursorfreigabe zuverlässig.
- [ ] Rückwärtsgeschwindigkeit als vorgemerkten Balancewunsch später prüfen.
- [ ] Verbleibende GPU-/Bildzeitruckler getrennt von behobener Positionsquantisierung untersuchen; keine RTX-Messung als schwache-PC-Abnahme.
- [ ] Modell-/Browserregressionen für gemeinsame Fahrregeln und verlässliche Pause/Neustarts erhalten.

## M3 – Sichtbarer Qualitätssprung im fahrenden Spiel

Vorhanden: editierbare Retro-Karts, vollständiger Stadionring, Materialien, Architektur, Licht und vorläufige Fahrer. Ziel deutlich höher. Details: [02](docs/02-art-direction.md), [05](docs/05-assets-and-visual-references.md), [14](docs/14-character-and-item-catalog.md), [16](docs/16-production-blueprint.md).

- [ ] Zuerst Stalin samt Kart als vollständigen Qualitätsanker nach Marcels aktuellem Masterauftrag ausarbeiten; danach den gleichen Qualitätsmaßstab auf die übrigen fünf übertragen. Hitlers Erkennbarkeit bleibt Bestandteil des Gesamtziels, bestimmt aber nicht mehr den ersten Produktionsslot.
- **Teilfortschritt 04.10.:** Stalin hat einen breiteren Kiefer sowie modellierte Brauen-/Wangen-/Faltenebenen und einen gesonderten sichtbaren Mund unter dem Walrossbart erhalten; das Limousinen-Frontend und Heck wurden weiter individualisiert. Der sichtbare Laufzeitstand bleibt eine Karikatur-Zwischenstufe. Kein Qualitätsanker abgenommen.
- [ ] Gesicht, Anatomie, Haare, Augen, Kleidung und Stoff-/Hautmaterialien realitätsnah ausarbeiten; benannte reale Person erkennbar, kein bloß umbenannter Platzhalter.
- [ ] Fünf weitere Startfahrer: Stalin, Mussolini, Mao, Kim Jong-un und Castro. Anfangs einfacher, aber individuell erkennbar; anschließend auf denselben Qualitätsmaßstab bringen. **04.10.: alle sechs als Karikaturen mit erkennbaren Merkmalen im Spiel (Zwischenstufe, nicht realitätsnah).**
- [ ] Alle sechs Karts auf gemeinsamer glaubwürdiger Grundarchitektur halten und dennoch durch viele fahrerspezifische Silhouettenmerkmale, Front-/Heckformen, Hauben, Kotflügel, Räder, Cockpits und Materialien klar unterscheidbar machen; keine landwirtschaftlichen Treckerformen. Details/Abnahme im [Masterauftrag](docs/22-character-vehicle-quality-master.md), der Traktor bleibt ein Wurfobjekt.
- **Teilfortschritt 04.10.:** die zwei Roadster-Wimpel tragen in der editierbaren Quelle nun ein kontrastreiches eigenständiges Adlerrelief ohne Regimezeichen. Die vollständige Adler-/Satiregestaltung und gemeinsame Qualitätsabnahme bleiben offen.
- **Teilfortschritt 05.10.:** Die nächste Stalin-Blenderiteration modelliert Wangen, Masseter, Kieferwinkel und abgeflachtes Kinn als verformte gemeinsame Schädeloberfläche; zwei konturfolgende Schläfenlocken brechen die Helm-Silhouette der zurückgekämmten Haare. Die optimierte Geometrie ist im Live-Fahrerwahlporträt sichtbar. Front-/Seiten-Nahfahrt, Profil, Mimik und menschliche Stilabnahme fehlen; der Qualitätsanker bleibt offen.
- **Fahrzeugteilfortschritt 05.10.:** Die Stalin-Limousine ergänzt an ihrer Staatswagen-Silhouette Türgriffe, seitliche Coachline und beidseitige Haubenlüfter mit Metalllamellen. Blender 4.5.3/glTF Transform erzeugten Quelle/Runtime; GLB von 5.084.136 auf 5.230.312 Byte (+2,9 %). Vollsuite 56/56 und Produktionsbuild bestanden. Im echten Auswahl-/Stadiontab geladen, aber keine Nah-/Seiten-/Fahrtbewertung.
- [ ] Fahreranimation: Hände/Lenkrad, Kopf/Blick, Bremsen, Drift, Hop/Landung, Turbo, Kontakt und Rennenende; kleine Reaktionen statt unruhigem Dauerschütteln.
- [ ] Fahrer anatomisch korrekt ins Kart setzen: modellierter Sitz, passende Becken-/Beinposition ohne Durchstecken; Hände mit sichtbaren Fingern und Handgelenken von außen am Lenkradkranz, nicht von innen; Füße stehen auf beweglichen Gas-/Bremspedalen, die zur Eingabe passen. Kopfansatz, Hals/Kragen, Mund und überlieferte Kopfbedeckungen klar und erwachsen gestalten. Lenkrad, Spiegel und first-person Räder prüfen; Vorderräder schlagen im Cockpit passend zur Lenkung ein.
- [ ] Neue Laufzeit-Qualitätsreferenz umsetzen: detailreiche räumliche Fassaden/Tribünen/Straßenmöbel, überzeugendes Pflaster, sauber getrennte Wasserfläche/Ufer sowie passende und begrenzte Fahr-/Spritzpartikel; mit echten Spielbildern im Winkel und bei Bewegung abnehmen. Referenzbild nur als Licht-/Detail-/Kompositionsziel, ohne konkrete Modelle oder politische Zeichen zu kopieren.
- [ ] Fahrerperspektive mit plausibler Augenhöhe, Händen, Instrumenten, Haube und Vorderrädern ausarbeiten; keine störende doppelte Außenkarosse.
- [ ] Berlin-/Stadionwelt glaubwürdiger gestalten: abwechslungsreiche Fassaden, Dächer, Straßendetails, räumliche Tiefe, erkennbare Blickpunkte und historische Atmosphäre.
- [ ] Weniger repetitive Module; gealterte Materialien, Fenster/Innenraumtiefe, Straßenmöbel und lesbare Straßenschilder.
- [ ] Mehr thematische, kritische Satire und wiedererkennbare Alltagsdetails; eigenständiger Adler ohne verbotene Regimesymbolik als aktueller Auftrag in CURRENT-WORKLIST.md.
- [ ] Licht/Schatten/Reflexionen und zurückhaltende Effekte anhand Laufzeitbildern gegen G–L abstimmen; Bildqualität bei Fahrt bewerten.
- [ ] Staub, Driftfunken, Turbofeuer, Reifenspuren, Treffer-/Landungswolken begrenzt und skalierbar verbessern.
- [ ] Zuschauer, Streckenleben und Siegesreaktionen lebendiger gestalten; Pool-/LOD-Budget einhalten.
- [ ] Gemeinsame visuelle Abnahme durch Marcel/Sarah anhand aller drei Spielkameras; Konzeptbilder ergänzen diese Prüfung nur.

## M4 – Zuverlässiges Kernrennen

Vorhanden: 593-m-Rundkurs, fünf Bots, drei Runden, Rang, Ziel, Revanche, Rücksetzung und drei Start-Items. Details: [01](docs/01-game-design.md), [07](docs/07-gameplay-systems.md), [09](docs/09-roadmap.md), [15](docs/15-item-feasibility-and-production.md).

- [ ] Streckenführung abwechslungsreicher und lesbarer machen, Kurven-/Bremsrhythmus, Abkürzungen und Risk/Reward ausarbeiten.
- [ ] Botlinien, Überholen, Hindernis-/Kontaktverhalten, Drift und Recovery verbessern; leicht/mittel/schwer und Persönlichkeiten sichtbar unterscheiden.
- **Technischer Teilfortschritt 04.10.:** Kanalkart-Bergung landet jetzt hinter der Wasserfläche; Regressionstest und gemeinsamer Bergungspfad für Spieler/Bots geprüft. Gesamtziel bleibt offen für menschliche Fahr- und Streckenabnahme.
- [ ] Vollständige Rennen wiederholt prüfen: faire Rang-/Rundenlogik, alle Zieleinläufe, Resultate, Revanche und Reset ohne Ressourcenwachstum.
- [ ] Items gleich fair für Mensch/Bot: Projektil, Verfolger und Falle mit gleicher Grundwirkung; individuelle Modelle/Sounds je Fahrer.
- [ ] Schäferhund als Spieler-Projektil-/Verfolgerdarstellung mit Laufanimation, Bellen und Comic-Trefferwolke – aktuelles Paket in CURRENT-WORKLIST.md.
- [ ] Aufholhilfe nur über nachvollziehbare Itemchancen; keine heimlichen Geschwindigkeitsboni.
- [ ] Trefferketten vermeiden, kurze lesbare Tempoverluste statt langer Kontrollentziehung; Rücksetzung mit gemeinsamen Regeln/Zeitverlust.

## M5 – Fähigkeiten, Audio, Schäden und Atmosphäre

Details: [07](docs/07-gameplay-systems.md), [13](docs/13-world-and-content-boundaries.md), [14](docs/14-character-and-item-catalog.md), [15](docs/15-item-feasibility-and-production.md).

- [ ] Persönliche Fähigkeiten mit eigener Eingabe und festen Abklingzeiten; keine fahrleistungsabhängige Pflicht-Aufladung. Konkrete Balance noch abstimmen.
- [ ] Sarahs gemeldete Panzerverwandlung und weitere belegte Alt-Fähigkeiten/Itemideen bewahren und in neuer Engine ausarbeiten; Panzer zuerst laut CURRENT-WORKLIST.md. Keine alten Bot-Tempoprämien übernehmen. Quellen und Abweichungen: [Altstand-Abgleich](docs/sarah-feature-audit.md).
- [ ] Wand- und Kartkontakte weiter abstimmen: schräge Bandenkontakte gleiten mit nachvollziehbarem Tempoverlust; typische Kontakte sollen nicht abrupt zum Vollstopp führen, während harte frontale Einschläge deutlich bleiben.
- [ ] Kumulative Haltbarkeit und gestufte sichtbare Schäden ausarbeiten: Spiegel, Auspuff, Abdeckungen, Ruß/Rauch/Funken; bei wiederholten schweren Treffern ein satirischer Fahrzeugausfall/Explosion, komische Fahrerreaktion, dann nach wenigen Sekunden ein besonderer Respawn mit Animation und Sound. Trefferketten/Fairness/Botgleichheit prüfen; keine Gore-Darstellung und keine festgelegten Zahlen, bevor Fahrtests vorliegen.
- [ ] Lokale Weltreaktionen und thematische Wettervarianten prüfen: Regen/nasse Fahrbahn zuerst als Produktionswunsch, später Schnee/Eis/Blätter nach Priorisierung.
- [x] **Regen-Wolkenschatten (04.10.):** Fünf weiche, wandernde Schattenflächen und Pfützen erscheinen nur bei Regen; eine kleine Alpha-Textur und fünf feste Meshes begrenzen das Budget. Eine Aufrufreihenfolge, die `setWet(false)` nach dem Regenreset ausführte, wurde korrigiert. Regen-/Sonnenbild im Browser verglichen; Details in [CURRENT-WORKLIST.md](CURRENT-WORKLIST.md) und [PROGRESS-LOG.md](PROGRESS-LOG.md).
- [ ] Zufällige Tageszeit pro Rennen und dynamischer Lauf über drei Runden: Tag, allmähliche Dämmerung, Nacht; mögliche Wetter-/Zeitkombinationen variieren, Übergang langsam und gut lesbar. Sonne/Vögel am Tag; Mond, Sterne, Mondschatten und Fledermäuse nachts.
- [ ] Streckenleben mit begrenzten Blättern/Partikeln sowie herumliegenden Zeitungen, Müll und abfallenden Kartteilen ergänzen. Teile kurz sichtbar liegen lassen, dann zeitgesteuert entfernen; Performance und Sichtbarkeit während der Fahrt prüfen.
- [ ] Aussprache aller gesprochenen Texte überprüfen, merkwürdige Wörter beheben; freundlichere lebendigere Stadionsprecherin, weniger mechanische Wirkung.
- [ ] F als individuelle Sprachhupe; kurze Clips/Abklingzeit. Marcel wünscht echte, wiedererkennbare historische Live-/Archivaufnahmen statt TTS oder neuer Einsprache. Quelle, konkrete Person/Ausschnitt, Inhalt und kostenlose Nutzungsrechte vor Download/Integration nachweisen; keine erfundenen Originalzitate.
- [ ] Eigenständige Parodiestimmen und historische Musik mit nachvollziehbaren Quellen; keine ungekennzeichneten erfundenen „Originalzitate“.
- [ ] Motor-/Getriebe-/Reifen-/Kontakt-/Umgebungsgeräusche und Mix hörbar abstimmen; Ansagen priorisieren, Lärm/Dopplungen begrenzen.
- [ ] Weitere Altitems/Fähigkeiten aus dem Katalog nur nach Umfangsentscheidung übernehmen; Herkunft und Sarah-Freigaben erhalten.

## M6 – Vollständiger Singleplayer

- [ ] Fahrer-/Kartwahl, Menü, HUD, Optionen, Tutorial und Startablauf auf einen gemeinsamen Qualitätsstand bringen. **04.10.: Fahrerwahl mit Live-Porträts vorhanden; Siegerkarte mit Porträts und Ziel-Feuerwerk.**
- **Teilfortschritt 05.10.:** Das Ein-Item-HUD zeigt Symbol, Itemname, „IM SLOT“/„LEER“, barrierefreien Status und Buttonzustand; Tastatur, Maus und Touch teilen den Schild-Halte-/Loslass-Wurfpfad. Schnelle Taps zwischen Simulationsframes und Pointer-Abbruch sind regressionsgeprüft. Der Karosseriezustand ist als ARIA-Meter mit aktuellem Prozentwert ausgezeichnet. Die interaktive Aufnahme → Anzeige → Wurf-Abnahme im laufenden Browser bleibt offen. Keine Mehrfachslots ohne neue Umfangsentscheidung.
- [ ] Verständliche deutsche Bedienung und Statusmeldungen; Diagnose bleibt optional, keine technischen Interna als normaler Spielerablauf.
- [ ] Alle sechs Fahrer und erste historische Strecke mit Material-/Animations-/Audioqualität fertigstellen.
- [ ] Siegerehrung, Ergebnis-/Rennbericht und Revanche ausarbeiten.
- [ ] Lokale Einstellungen, Kameraruhe, reduzierte Effekte, Ton/Musik und Lade-/Fehlerzustände zuverlässig erhalten.
- [ ] Wiederholbare Rennen und Kaltstarts; gemeinsame Inhalts-/Stil-/Hörabnahme dokumentieren.

## M7 – Geräte, Leistung und Auslieferung

Details: [04](docs/04-performance.md), [19](docs/19-ui-settings-and-save.md).

- [ ] Normale/schwache PCs benennen und messen: vorläufig Standard 60 FPS, schwächer stabile 30 FPS; Ziele nicht stillschweigend senken.
- [ ] Android und iPhone im Querformat mit Touch prüfen; iPhone 15 Pro benannt, Sarahs/Android-Gerät noch offen.
- [ ] LOD, Instancing, Drawcalls, Schatten, Textur-/Modellgrößen, Ladegruppen und Speicher nach echten Engpässen optimieren.
- [ ] Wiederholte Neustarts/Rennen, Tabwechsel/Fokusverlust, Browserfallback und Fehlerwiederherstellung prüfen.
- [ ] Qualitätstufen bei gleichen Rennregeln; Warnungen/Items nicht nur über Farbe oder Ton erklären.
- [ ] Ein-Klick-Start auf beiden Rechnern und Git-Synchronisierung verlässlich erhalten; lokale Tooldownloads bleiben aus Git ausgeschlossen.

## M8 – Gemeinsam spielen und spätere Inhalte

Details: [06](docs/06-multiplayer.md), [09](docs/09-roadmap.md).

- [ ] Nach stabilem Singleplayer private Online-Lobbys per Einladung und Crossplay auf getrennten Geräten entwickeln.
- [ ] Kostenlos tragfähigen Betrieb, Synchronisierung, Reconnect, faire Regeln und Schutz vor Manipulation prüfen.
- [ ] Sechs Themenstrecken plus verbindende Strecke als langfristigen Umfang schrittweise priorisieren; keine pauschale Pflicht vor Multiplayer.
- [ ] Weitere historische Fahrer aus dem Zwölf-Figuren-Katalog erst nach Besetzungs-/Produktionspriorisierung.
- [ ] Geist/Ghost, Orden/Achievements und ausgebauter Fotomodus als spätere Vorschläge bewerten.
- [ ] Öffentliche kostenlose Veröffentlichung erst nach Geräte-, Inhalts-, Rechte- und Qualitätsprüfung vorbereiten.

## Zusammenarbeit dauerhaft verbessern

- [ ] Start-/Abschlussbefehle auf Sarahs realem Checkout einmal gemeinsam prüfen; ihre lokalen unveröffentlichten Dateien erhalten.
- [ ] Aufgabenpakete zwischen Marcel und Sarah absprechen; bei denselben Dateien Überschneidungen bewusst integrieren.
- [ ] Aktuelle CURRENT-WORKLIST.md, LONG-TERM-GOALS.md und kurzer TEAM-CHANGES.md an jedem Start/Abschluss pflegen; keine alte Enginearbeit.
- [ ] Offizielle Fünf-Stunden-/Wochenlimits nach großen Paketen prüfen; bei ca. 15 % Rest geordnet abschließen, ca. 5 % für Nutzer übriglassen. Keine erfundenen Prozentwerte.
- [ ] Funktionierende lokale Checkpoints und geprüfter Teamabschluss nach main; kein Force-Push und kein blindes Verwerfen fremder Änderungen.
