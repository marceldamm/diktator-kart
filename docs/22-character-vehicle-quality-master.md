MASTER-AUFGABE: HOCHWERTIGE ÜBERARBEITUNG DER FAHRER- UND FAHRZEUGMODELLE VON „DIKTATOR KART“

## Ergänzung von Marcel, 04.10.2026 – verbindliche Fahrzeugrichtung

Die sechs Fahrerfahrzeuge behalten eine gemeinsame, klar erkennbare Kart-Grundarchitektur (Fahrerplatz, Lenkrad, vier Räder, Fahrwerk und vergleichbare spielbare Proportionen). Jedes Fahrzeug wird durch viele gezielte Abweichungen der jeweiligen Person zugeordnet: eigenständige Karosserie-Silhouette, Front, Kotflügel, Haube, Heck, Cockpit, Rad-/Felgenform, Auspuff, Material und satirische Details. Die Unterschiede müssen schon als schwarze Silhouetten lesbar sein, ohne die Familie der Karts auseinanderfallen zu lassen. „Schwer“ oder „militärisch“ bedeutet repräsentativ/robust und darf nicht in einen landwirtschaftlichen Trecker-Look kippen. Marcel bestätigt am 04.10.2026, dass Stalins Fünfjahresplan-Traktor sein Wurfobjekt/Item bleibt; er ist kein Formmodell für sein Kart. Keine Symbole oder Abzeichen von Regimen ergänzen.

## Ergänzung von Marcel, 04.10.2026 – Laufzeit-Bildreferenz

`docs/evidence/loading-real-progress.png` ist eine verbindliche visuelle Qualitätsreferenz für die echte 3D-Laufzeit: hochwertige menschliche Fahrer, eigens geformte Fahrzeuge, tiefe und detaillierte Architektur, glaubwürdig strukturierter Boden sowie klar lesbare Staub-/Wasserpartikel und warme Lichtführung. Diese Merkmale werden eigenständig für Berlin/Stadion modelliert und im fahrenden Spiel statt nur auf dem Ladebild abgenommen. Das Bild ist keine Vorlage zum Kopieren seiner konkreten Figuren, Komposition, Logos oder politischen Zeichen; die Spielwelt bleibt kritische Satire ohne Regimezeichen. Wasser/Ufer, Fassaden/Bauten und Kontaktpartikel werden als sichtbare Produktionspakete ergänzt.

Arbeite direkt im bestehenden Projekt und verbessere die vorhandenen 3D-Assets. Diese Aufgabe ist keine reine Analyse- oder Konzeptaufgabe. Das Ziel ist eine sichtbare qualitative Verbesserung im tatsächlich laufenden Spiel.

WICHTIG:
- Lies zuerst nur die relevanten Markdown-Dateien des Projekts, insbesondere Dokumentation zu Fahrern, Charakteren, Fahrzeugen, Artstyle und geplanten Figuren.
- Verschwende keine lange Session mit einer Vollanalyse des gesamten Codes.
- Ermittle anhand der vorhandenen Dokumentation, welche Fahrer aktuell vorgesehen sind und welche gestalterischen Merkmale sie haben sollen.
- Danach direkt an den Assets und der Darstellung arbeiten.
- Bestehende Funktionalität des Spiels darf nicht beschädigt werden.
- Nutze Blender, Python-Blender-Skripte, Three.js/GLTF-Tools oder andere lokal verfügbare Werkzeuge, wenn dies zu einem deutlich besseren Ergebnis führt.
- Nicht bei einem Prototyp oder einer Beschreibung stehen bleiben. Modelle tatsächlich überarbeiten und ins Spiel integrieren.
- Arbeite selbstständig durch, ohne mich für gestalterische Kleinigkeiten ständig zu fragen.

==================================================
1. GRUNDPROBLEM
==================================================

Die aktuellen Charaktermodelle wirken zu stark wie einfache Spielzeug-, Holz-, Papp- oder Low-Poly-Figuren.

Das ist NICHT der gewünschte Stil.

Das Spiel darf stilisiert und satirisch bleiben, aber die Figuren sollen wirken wie:

„hochwertige stilisierte 3D-Karikaturen realer historischer Personen“

und NICHT wie:

- Roblox-Figuren
- Playmobil
- Holzpuppen
- Pappfiguren
- primitive Low-Poly-Figuren
- einfache Capsule-/Sphere-Körper
- Figuren ohne Gesichtsanatomie

Gewünschter Qualitätsbereich als Orientierung:

- moderne hochwertige Indie-3D-Spiele
- stilisierte Charaktere mit glaubwürdiger Anatomie
- leicht überzeichnete Karikaturen
- klare Wiedererkennbarkeit aus Entfernung
- hochwertige Materialien
- saubere Silhouetten
- glaubwürdige menschliche Gesichter
- technisch sauber riggbar und animierbar

NICHT fotorealistisch.

Die Personen dürfen und sollen satirisch überzeichnet sein, aber sie müssen klar menschlich und hochwertig modelliert aussehen.

==================================================
2. PRIORITÄT 1 – KÖPFE UND GESICHTER
==================================================

Die Köpfe sind derzeit der größte Qualitätsmangel.

Überarbeite die Köpfe aller aktuell verwendeten Fahrer systematisch.

Jeder Kopf benötigt mindestens:

- erkennbare Schädel-/Kopfform
- Stirn
- Augenhöhlen
- Augen
- Augenlider oder zumindest klar geformte Augenregion
- Nase mit Nasenrücken und Nasenspitze
- Nasenflügel, soweit sinnvoll
- Wangen
- Mund
- Oberlippe
- Unterlippe
- klar definierte Mundöffnung
- Kinn
- Kieferlinie
- Übergang Kiefer → Hals
- Ohren
- nachvollziehbaren Haaransatz
- tatsächliche Frisur statt aufgesetzter schwarzer Halbkugel

Die aktuellen Köpfe wirken teilweise wie:
Kugel + Nase + Haarblock.

Das ist nicht ausreichend.

Besonders kontrollieren:

- Mund darf nicht optisch fehlen.
- Kinn und Kiefer müssen sichtbar sein.
- Hals darf nicht einfach als Zylinder oder Kugel aus dem Kopf kommen.
- Der Hinterkopf muss anatomisch sinnvoll modelliert sein.
- Der Übergang von Kopf zu Nacken muss sauber sein.
- Keine Geometrie darf sichtbar durch Kopf oder Hals clippen.
- Keine Körperteile dürfen aussehen, als seien sie nur zusammengesteckte Primitive.

Die Gesichter sollen aus 5–20 Metern Spielentfernung immer noch klar unterscheidbar sein.

==================================================
3. KARIKATUR STATT KINDERFIGUR
==================================================

Die Fahrer dürfen überzeichnet sein.

Nutze pro Figur bewusst charakteristische Merkmale wie:

- Kopfform
- Frisur
- Haaransatz
- Schnurrbart/Bart
- Augenbrauen
- Nase
- Wangen
- Kiefer
- Körperhaltung
- Uniform
- Kopfbedeckung

Aber übertreibe gezielt.

Beispiel:

Nicht:
riesiger runder Kopf + winziger Körper + zwei Punkte als Augen.

Sondern:
realistisch nachvollziehbare Gesichtsstruktur, deren markante Merkmale gezielt karikiert werden.

Die Proportionen können ungefähr in Richtung

1:4,5 bis 1:6 Kopf-Körper-Verhältnis

gehen.

Also stilisiert, aber nicht Chibi.

==================================================
4. HALS-/NACKEN-FEHLER ZWINGEND FINDEN
==================================================

Bei mehreren Fahrern befindet sich aktuell hinter bzw. am Nacken eine sichtbare Stange / ein langer dünner Gegenstand / ein bewegliches Teil.

Dieses Objekt bewegt sich mit dem Fahrer.

Untersuche exakt, was das ist.

Mögliche Ursachen:

- falsch gewichtetes Mesh
- Cape-/Mantel-Bone
- Accessoire
- Flaggenhalter
- Rig-Bone mit sichtbarer Debug-Geometrie
- falsch transformiertes Mesh
- Parenting-Fehler
- falsch positionierter Umhang
- nicht korrekt initialisierte Geometrie
- Überbleibsel eines Character-Attachments

Nicht einfach verstecken, bevor die Ursache verstanden wurde.

Danach:

- Fehler vollständig beseitigen
- prüfen, ob das Objekt eigentlich Bestandteil eines Mantels/Umhangs/Accessoires sein soll
- falls ja: korrekt modellieren und darstellen
- falls nein: vollständig entfernen

Besonders prüfen:

- Startaufstellung
- normales Rennen
- Charakterauswahl
- Titelbildschirm / Präsentationsszene
- Kamera von hinten
- Kamera seitlich

Es darf nirgendwo mehr eine undefinierte Stange aus Nacken oder Rücken ragen.

==================================================
5. KÖRPER
==================================================

Die Körper wirken momentan ebenfalls zu stark aus einzelnen primitiven Formen zusammengesetzt.

Verbessere:

- Schultern
- Oberkörper
- Hüfte
- Arme
- Hände
- Übergänge der Körperteile
- Stoffformen
- Uniformen
- Kragen
- Ärmel
- Jacken
- Mäntel
- Abzeichen

Uniformen sollen nicht wie ein eingefärbter Körper aussehen.

Sie brauchen mindestens angedeutete:

- Kragen
- Nähte
- Knopfleisten
- Taschen
- Gürtel
- Schulterpartien
- Stofffalten bzw. modellierte Form

Der Stalin-Qualitätsanker trägt statt des generischen hellen Paradeaufzugs eine eigene dunkle, hochgeschlossene Tunika. Kragen, mittige Knopfleiste, Brusttaschen und dezente Nähte sind modelliert; Paradeband, Orden und Schulterstücke gehören nicht zu dieser Variante. Andere Fahrerbezüge bleiben im gemeinsamen Katalog individuell schaltbar.

Nicht übermäßig hochpoly, aber visuell glaubwürdig.

==================================================
6. HÄNDE
==================================================

Die weißen bzw. simplifizierten Hände wirken aktuell teilweise wie Handschuhe aus einem alten Cartoon.

Überarbeiten.

Ziel:

- stilisierte Hände
- klare Handfläche
- Daumen
- vereinfachte Fingerform
- sinnvolle Griffposition am Lenkrad
- Hand, Handschuh, Manschette und Unterarm bleiben als zusammenhängende Silhouette verbunden; der Griff darf die Hände nicht als abgelöste Meshes am Lenkrad fixieren.
- Beim Lenkeinschlag muss der komplette verbundene Arm den rotierenden Griff erreichen; eine gleichmäßige Laufzeit-Reichweitenanpassung darf den Handschuh nicht sichtbar vergrößern/verkleinern.
- Links-/Rechtslenkeinschlag und Außenansicht gehören zur Abnahme, nicht nur die gerade Fahrerperspektive.

Keine Kugeln oder undefinierte Klumpen.

==================================================
7. MATERIALIEN
==================================================

Verbessere die Materialwirkung der Charaktere.

Haut:
- leicht unterschiedliche Roughness
- keine Plastikoberfläche
- kein völlig flaches Material

Haare:
- leicht glänzend, aber nicht wie schwarzer Kunststoff

Uniform:
- Stoffcharakter
- höhere Roughness
- subtile Materialvariation

Metall:
- echte metallische Materialwerte

Leder:
- leicht andere Roughness als Stoff

Nutze PBR soweit die vorhandene Pipeline dies unterstützt.

==================================================
8. FAHRZEUGE ÜBERARBEITEN
==================================================

Die Fahrzeuge sind bereits besser als die Fahrer, sollen aber ebenfalls einen Qualitätspass bekommen.

Ziel:

Jeder Fahrer soll langfristig ein eigenes, klar erkennbares Fahrzeug bekommen, das thematisch zu ihm passt.

Nicht einfach dasselbe Kart mit anderer Farbe.

Überarbeite vorhandene Fahrzeuge hinsichtlich:

- Karosserie
- Kotflügel
- Motorhaube
- Kühlergrill
- Scheinwerfer
- Stoßstangen
- Auspuff
- Räder
- Reifen
- Felgen
- Cockpit
- Lenkrad
- Sitz
- Armaturen
- historische Designelemente
- fahrerspezifische Details

Die Fahrzeuge dürfen stilisiert und überzeichnet sein.

Aber:
Sie sollen aussehen wie kleine hochwertige historische Renn-/Staats-/Militärfahrzeuge.

Nicht wie generische Cartoon-Karts.

==================================================
9. HISTORISCHE FAHRZEUGREFERENZEN
==================================================

Nutze online frei zugängliche Bildreferenzen realer historischer Fahrzeuge.

WICHTIG:

Keine fremden 3D-Modelle einfach übernehmen.

Keine urheberrechtlich problematischen Meshes kopieren.

Verwende Referenzen nur als visuelle Inspiration für:

- Fahrzeugformen
- Kühlergrills
- Kotflügel
- Lampen
- Reifen
- Proportionen
- Karosserielinien
- Innenräume
- Militärfahrzeuge
- Limousinen
- Propagandafahrzeuge
- Staatsfahrzeuge

Danach eigene stilisierte Modelle bauen.

Recherche bevorzugt nach:
- Public-Domain-Bildmaterial
- Wikimedia Commons
- Museumsarchiven
- historischen Fotografien
- frei zugänglichen Fahrzeugdokumentationen

==================================================
10. FAHRZEUGE MÜSSEN FAHRERCHARAKTER HABEN
==================================================

Beispiele für die gestalterische Richtung:

Stalin:
- schweres sowjetisches Staats-/Militärfahrzeug
- massive Formen
- robuste Kotflügel
- dunkler/bedrohlicher Charakter
- sowjetische Designelemente

Mussolini:
- italienischer 1930er-Jahre-Rennwagen-/Roadster-Einfluss
- eleganter
- stromlinienförmiger
- übertrieben pompös

Mao:
- Mischung aus chinesischer Staatslimousine und stilisiertem Propagandafahrzeug

Castro:
- kubanisch/amerikanisch beeinflusster 1950er-Jahre-Wagen
- kräftige Chromdetails
- leicht improvisierter/revolutionärer Charakter

Gaddafi:
- exzentrisch
- luxuriös
- nordafrikanische / militärische Details
- bewusst auffälliger

Kim:
- übertrieben repräsentatives Staatsfahrzeug
- pompös
- massiv
- Propaganda-Inszenierung

Hitler:
- 1930er/40er deutscher Staatswagen-/Militärfahrzeug-Einfluss
- lange Haube
- massive Kühlerfront
- schwere repräsentative Formen

Das sind Designrichtungen, keine Verpflichtung zu exakten realen Modellen.

==================================================
11. KEINE GENERISCHEN KLONE
==================================================

Aktuell wirken Fahrzeuge teilweise wie Farbvarianten derselben Konstruktion.

Das soll sich ändern.

Jeder Fahrer benötigt langfristig eine andere:

- Silhouette
- Front
- Heckform
- Radposition
- Kühlerform
- Cockpitform
- Auspufflösung
- Motorhaube

Wenn alle Fahrzeuge schwarz gerendert würden, soll man sie trotzdem anhand der Silhouette unterscheiden können.

==================================================
12. TECHNISCHE QUALITÄT
==================================================

Bei allen neuen oder überarbeiteten Assets:

- saubere Meshes
- keine unnötige extrem hohe Polygonzahl
- keine offenen Geometrien, wenn vermeidbar
- keine invertierten Normalen
- keine Z-Fighting-Flächen
- keine sichtbaren Mesh-Intersections
- keine schwebenden Teile
- saubere Pivot Points
- korrekte Skalierung
- saubere Parent-/Rig-Struktur
- sinnvolle Objektbezeichnungen
- keine unnötigen Duplikate
- Materialien konsolidieren
- sinnvolle LOD-/Performance-Überlegungen

Desktop-Browser ist Zielplattform.

Lieber:
ein sauber modelliertes Objekt mit 20–80k Polygonen

als:
fünf Primitive mit schlechtem Ergebnis.

Aber keine völlig unnötigen Millionen-Polygon-Modelle.

==================================================
13. BLENDER DARF UND SOLL VERWENDET WERDEN
==================================================

Wenn Blender verfügbar ist, nutze ihn aktiv.

Du darfst:

- Blender-Python-Skripte erstellen
- Meshes prozedural generieren
- bestehende GLTF/GLB-Dateien importieren
- bearbeiten
- retopologisieren
- Materialien erzeugen
- UVs anlegen
- Modelle exportieren
- GLB/GLTF automatisch erzeugen
- eigene Asset-Pipeline bauen

Wenn ein Charakter heute aus JavaScript-Primitives erzeugt wird und diese Technik die Qualität limitiert:

Nicht daran festhalten.

Dann darfst du die Figur durch echte GLB/GLTF-Assets ersetzen.

==================================================
14. EXISTIERENDE GAMEPLAY-LOGIK NICHT ZERSTÖREN
==================================================

Beibehalten:

- Fahrzeugphysik
- Kollisionslogik
- Spawn
- Fahrerzuordnung
- Steuerung
- Powerups
- Kameralogik
- Rennlogik

Falls Asset-Skalierung geändert wird:

Collision- und Spawn-System entsprechend sauber anpassen.

Optisches Modell und physisches Collision-Modell dürfen getrennt sein.

Das ist sogar bevorzugt.

==================================================
15. REFERENZ: AKTUELLER BILDEINDRUCK
==================================================

Die aktuellen Screenshots zeigen:

- Fahrzeuge relativ ordentlich
- Strecke und Umgebung deutlich hochwertiger als die Fahrer
- Fahrer mit sehr runden Köpfen
- schwache bzw. fehlende Gesichtsdetails
- kaum sichtbare Kiefer
- kaum sichtbare Münder
- Haar teilweise wie schwarze Halbkugel
- Hals teilweise undefiniert
- Körper wie zusammengesetzte Primitive
- mysteriöse Stange hinter dem Nacken
- Fahrer wirken visuell mehrere Qualitätsstufen unter Fahrzeug und Umgebung

Das muss korrigiert werden.

==================================================
16. QUALITÄTSZIEL
==================================================

Wenn ich nach dem Umbau direkt hinter einem Fahrer stehe, möchte ich:

1. sofort erkennen, welche Figur das ist
2. ein richtig modelliertes Gesicht sehen
3. Mund, Nase, Augen, Kiefer und Hals erkennen
4. eine hochwertige stilisierte Uniform sehen
5. keine sichtbaren technischen Artefakte sehen
6. nicht das Gefühl haben, eine Papp- oder Holzfigur anzusehen
7. ein Fahrzeug sehen, das eindeutig zu diesem Fahrer gehört

==================================================
17. ARBEITSWEISE
==================================================

Arbeite in dieser Reihenfolge:

PHASE A
Markdown-Dokumentation lesen.

PHASE B
aktuelle Character-Asset-Pipeline lokalisieren.

PHASE C
Ursache der Nacken-Stange finden und beseitigen.

PHASE D
einen Fahrer als Quality Benchmark vollständig überarbeiten.

Nicht sieben halbherzig gleichzeitig.

Wähle eine gut sichtbare Figur, idealerweise Stalin oder einen aktuell prominent verwendeten Fahrer.

PHASE E
Spiel starten.

Benchmark-Figur aus:
- hinten
- vorne
- seitlich
- Nahaufnahme
- während Fahrt
kontrollieren.

PHASE F
Qualität der Benchmark-Figur auf die übrigen Fahrer übertragen.

PHASE G
Fahrzeuge individuell überarbeiten.

PHASE H
Gesamtes Startfeld visuell kontrollieren.

==================================================
18. KEIN „MINIMUM VIABLE FIX“
==================================================

Diese Aufgabe soll ausdrücklich KEIN Minimalfix sein.

Nicht:

„Mund als kleine Linie hinzugefügt.“
„Kinn um 5 % skaliert.“
„Stange ausgeblendet.“
„Fahrzeuge etwas runder gemacht.“

Sondern eine erkennbare Überarbeitung des kompletten Character-/Vehicle-Art-Levels.

Der Qualitätsunterschied soll auf Screenshots sofort sichtbar sein.

==================================================
19. NICHT EWIG PLANEN
==================================================

Maximal kurze Bestandsaufnahme.

Dann implementieren.

Du darfst Entscheidungen selbst treffen, sofern sie diesem Ziel entsprechen.

Kein langes philosophisches Abwägen zwischen zehn Alternativen.

Wenn zwei technische Lösungen ähnlich sinnvoll sind:

Nimm die robustere und setze sie um.

==================================================
20. ENDE DER AUFGABE
==================================================

Die Aufgabe gilt erst als abgeschlossen, wenn:

- Fahrer sichtbar hochwertiger aussehen
- mindestens die Gesichter grundlegend neu aufgebaut wurden
- Kiefer und Mund klar vorhanden sind
- Hals/Nacken anatomisch nachvollziehbar sind
- die mysteriöse Nacken-Stange vollständig erklärt und korrigiert wurde
- Haare nicht mehr wie einfache Halbkugeln wirken
- Körper und Uniformen deutlich hochwertiger wirken
- Fahrzeuge einen sichtbaren Quality Pass erhalten haben
- Fahrzeuge stärker voneinander unterscheidbar sind
- alle überarbeiteten Assets im tatsächlichen Spiel funktionieren
- keine offensichtlichen neuen Grafikfehler entstanden sind
- das Spiel nach den Änderungen getestet wurde

Dokumentiere am Ende knapp:

- Ursache der Nacken-Stange
- welche Charaktere überarbeitet wurden
- welche Fahrzeuge überarbeitet wurden
- welche Asset-Pipeline verwendet wurde
- neu hinzugefügte GLB/GLTF/Blender-Dateien
- Performance-Auswirkungen
- eventuell noch verbleibende konkrete Baustellen

WICHTIGSTER SATZ DER AUFGABE:

Diktator Kart soll optisch nicht wie ein schnell zusammengesetztes Browser-Spiel mit Primitive-Figuren wirken. Die Fahrer und Fahrzeuge sollen eigenständige, professionell gestaltete 3D-Assets werden, die den visuellen Anspruch des gesamten Spiels deutlich anheben.

## Laufender Zusatzpass – Räder, 04.10.2026

Die vier gemeinsam genutzten Radmodelle erhielten in `art-source/build_kart.py` je Seite zwei feine Seitenwandrippen sowie acht kleine metallische Felgenmuttern. Die Ergänzung sitzt in den vorhandenen Rad-Spin-Knoten und verändert weder Fahrwerksmaße noch Fahrverhalten. Blender 5.2.1 erzeugte die editierbare `.blend`-Quelle und das GLB; GlTF Transform optimierte den Runtime-Export. Die Rohdatei ist 6.542.240 Bytes, das Runtime-GLB 4.843.924 Bytes – 8.184 Bytes weniger als der vorherige optimierte Export. Die vier Pivot-/Spin-Knoten und je Rad Reifen-/Metall-Meshes wurden im GLB ausgelesen. Das ist ein begrenzter Fahrzeugdetail-Pass; Silhouette, Front-/Heckvarianten und vollständige Laufzeit-Nah-/Bewegungsabnahme aller Fahrzeuge bleiben offen.

## Laufzeit-Hautmaterial, 04.10.2026

Das gemeinsame `Warm skin`-Material erhält eine wiederverwendete 512×512-Textur mit zurückhaltender Poren-/Farbvariation und Normalmap auf Stärke `.05`. `src/surface-textures.ts` erzeugt sie deterministisch, `src/slice-scene.ts` weist sie bei der Materialinitialisierung zu; Gesichtsmesh, Kopfvarianten und Materialgrundfarbe bleiben erhalten. Ein erster Headless-In-Game-Blick zeigte zu punktige Haut; Farbkontrast, Dichte und Relief sind deshalb reduziert. Build und Vollsuite bestanden, aber eine helle menschlich beurteilte Nahbild-Abnahme ist weiterhin offen.

## Stalin-Limousine und Kopfbedeckung, 05.10.2026

Der bestätigte Qualitätsanker bekommt einen weiteren editierbaren Blender-Pass: `art-source/build_kart.py` erzeugt eine nur für Stalin aktivierte, schlichte Feldmütze mit gewölbter Krone, Schweißband, Schirm und Nähten; sie trägt bewusst kein Abzeichen. Die Limousine erhält vier Art-déco-Radkappen mit emaillierter Fläche, hellem Metallrand, acht radialen Fächern und gewölbter Nabe. Jede Radkappe sitzt unter `wheelSpin-*`, dreht also mit dem jeweiligen Rad, während Fahrwerks-/Pivotvertrag und gemeinsame Grundräder bleiben. `src/cast.ts` aktiviert Mütze und Radpaket ausschließlich über Stalins Hut-/Limousinenauswahl; `src/slice-scene.ts` schaltet die vier Raddetails anhand der Karosserie. Als Reaktion auf Marcels wiederholten Proportionsbefund werden die sechs Köpfe in der Laufzeit wieder größer skaliert (X/Y/Z: `.74/.72/.70` → `.82/.79/.77`, jeweils rund 10 %); diese Änderung ist keine Abnahme von Anatomie oder Sitzpassform.

Blender 4.5.3 hat die Quelle neu gebaut, glTF-Transform exportiert/optimiert das Asset. Optimiertes GLB: 5.046.100 Byte gegenüber vorher 4.843.924 Byte (+202.176 Byte, +4,2 %); Roh-GLB: 7.047.324 Byte. GLB-Knoten- und Fahrer-Konfiguration sind regressiongeprüft. `npm test`: 54/54; `npm run build`: 1.296 Module. Die aktuelle echte Laufzeit-Hauptmenüaufnahme steht in `docs/evidence/slice-first-inspection-quality-1005f.png`; sie zeigt nach Modell- und Kopfgrößenpass die geladene Spielszene, aber keine hinreichende eindeutige Stalin-Nahabnahme. Die spezielle Fahrerwahlaufnahme blieb im überlasteten Headless-Renderer leer. Stalin von vorn/seitlich/nah, Radrotation in Fahrt, menschlicher Lenkradgriff und Gesamtqualität sind daher weiter offen; dies ist ein sichtbarer Teilpass, kein fertiger Qualitätsanker.

## Stalin-Kiefer und Schläfenhaar, 05.10.2026

Die nächste editierbare Iteration ersetzt die bloß breite Stalin-Untergesichtsform durch eine weich gerundete, aber erkennbare zusammenhängende Kiefer-/Wangenform: Masseter und Kieferwinkel werden innerhalb seiner eigenen Schädelvariante nach außen modelliert, die Wangen erhalten einen sanften Vorsprung und ein flacheres, nach vorn geführtes Kinn. Zwei eng anliegende Strähnen führen das zurückgekämmte Haar zu den Schläfen, statt den Haarsaum als glatte Helmkurve enden zu lassen. Die aufgesetzten Wangenkugeln werden bewusst vermieden. Kopf-/Fahrzeugmaße, Driver-Rig und Lenkradbindung bleiben erhalten.

Blender 4.5.3 erzeugte die editierbare Quelle und GLB; glTF Transform konsolidierte die Strähnen im schaltbaren `cast-swept`-Knoten. Optimierter Runtime-Export: 5.084.136 Byte gegenüber 5.081.568 Byte zuvor (+2.568 Byte, ca. +0,05 %). Cast-/Knotentest, Produktionsbuild und Vollsuite 56/56 bestanden. Das echte Fahrerwahlporträt zeigt die neue Stalin-Variante geladen; Front-/Seiten-Nahfahrt, Profil, Bewegung und menschliche Qualitätsabnahme bleiben offen.

## Stalin-Limousine: Coachwork-Pass, 05.10.2026

Die bestehende lange Limousinenhaube und tiefe Staatswagenkarosserie erhält körpernahe Türgriffe, seitliche Zierlinien und dunkle Haubenlüfter mit Metalllamellen. Die Teile liegen unter `body-limousine`; übrige fünf Karosserien sowie gemeinsames Rad-/Physik-/Lenkverhalten bleiben unverändert. Blender 4.5.3 und glTF Transform erzeugten editierbares Modell und Runtime-GLB (5.230.312 Byte; +146.176 Byte/+2,9 % gegenüber vorher). Die frische Runtime lädt Auswahl und Stadionszene mit neuem Asset; Vollsuite 56/56 und Produktionsbuild sind erfolgreich. Einzelne Tür-/Lüfterdetails sind im Menübild zu klein für visuelle Nahabnahme; Fahrzeug-Front, Seite, Heck und Bewegung bleiben offene Prüfansichten.

## Stalin-Limousine: Touring-Scheibe, Straßenwagen-Proportionen und Mützenhaarlinie, 05.10.2026

Die Limousine erhält nur im Cast-Zweig `body-limousine` eine flach geneigte Touring-Scheibe mit einem eigenen `Limousine touring glass`-Material. Im Runtime-GLB ist die Fläche `alphaMode: BLEND`, doppelseitig und auf .24 Alpha gesetzt. Ein verchromter Außenrahmen, Mittelsteg, Scharniere sowie ein direkt auf dem Glas liegender Metallwischer mit Gummilippe machen die Scheibe als Fahrzeugteil lesbar. Sie sitzt vor Lenkrad/Dashboard und lässt den Kopf frei. Die anderen fünf Karosseriezweige sowie Fahrer-/Radstand-/Physikverträge bleiben gleich.

Eine nach der ersten Studioansicht geprüfte Proportionskorrektur nahm die ungewöhnlich großen Hinterreifen zurück: sichtbarer Radius jetzt .36 m wie vorn, nur die Breite bleibt mit .39 m gegenüber .34 m leicht gestaffelt. Der hintere Kotflügelbogen folgt demselben Radius. Damit bleibt der gemeinsame Achsabstand unverändert, während die Limousine weniger nach landwirtschaftlichem Fahrzeug aussieht.

Die Feldmütze hatte gleichzeitig ein Deckhaar, das optisch über die Krone ragte. Zwei anliegende Schläfensträhnen sitzen deshalb nun unter `cast-stalin-hairline`; Stalins Cast wählt diesen Knoten statt `cast-swept`. Das allgemeine `cast-shorthair`, Mund/Bart, Nase und Körper-Rig bleiben gesondert zugeordnet.

Blender 4.5.3 regeneriert `hero-kart.blend` und GLB; glTF Transform erzeugt 5.283.004 Byte Runtime aus 7.365.372 Byte Rohquelle. Gegenüber 5.230.312 Byte zuvor: +52.692 Byte (+1,0 %). Die gezielte GLB-/Cast-Prüfung bestätigt die transparente Materialdefinition, den Windschutzscheiben-Knoten unter `body-limousine` und die eigene Haarlinien-Zuordnung. [Stalin-Limousinen-Assetvorschau](evidence/stalin-limousine-windscreen-asset-preview.png) ist ein Blender-Studio-Render, **keine** echte Babylon-Laufzeitaufnahme. Drei-Rundumansichten, In-Game-Nah-/Seiten-/Fahrtbilder und menschliche Abnahme bleiben offen.
