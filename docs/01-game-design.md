# Game Design

Marcels Antworten in [PROJECT-QUESTIONNAIRE.md](../PROJECT-QUESTIONNAIRE.md) und das [aktive Projektgrundgerüst](23-project-design-baseline.md) sind die aktuelle Produktbasis. Ältere Abschnitte bleiben Historie, soweit sie Satiregrenzen, Figurenpriorität, Umfang, Laufzeitabnahme oder Audiowünsche anders setzen. Sarahs Originalbeiträge werden nicht geändert; ihre Rückmeldung ist kein Freigabeschritt.


> **Dokumentvorrang (04.10.2026):** Diese Fachdatei erläutert Details und kann datierte frühere Zwischenstände oder Ideen enthalten. Für den aktuellen Auftrag und Status gelten die vier [Hauptdateien](../CURRENT-WORKLIST.md): [Aktuelle Arbeit](../CURRENT-WORKLIST.md), [Langzeitziele](../LONG-TERM-GOALS.md), [bestätigte Teamänderungen](../TEAM-CHANGES.md) und [Notizen/Anleitung](../TEAM-NOTES.md). Bei einem Widerspruch gilt der jüngste ausdrücklich bestätigte Nutzerwunsch; Status und Fachtext sind daran anzupassen. Frühere Ideen/Begründungen/Prüfergebnisse bleiben erhalten und werden als historisch, offen oder überholt markiert, nicht gelöscht. Technische Belege des damaligen Stands stehen im [Fortschrittslog](../PROGRESS-LOG.md).



## Tageszeitverlauf und Streckenleben – Marcel, 04.10.2026

Gewünscht ist eine variierende Tageszeit pro Rennen und die Möglichkeit, während der drei Runden allmählich von Tag über Dämmerung zu Nacht zu wechseln (Beispiel: Runde 1 Tag, Runde 2 dunkler, Runde 3 Nacht). Kein harter, plötzlicher Lichtwechsel; Wahrscheinlichkeiten und Übergangstempo werden im Spieltest festgelegt. Tageswelt: sichtbare Sonne und Vögel. Nachtwelt: Mond, Sterne, Mondschatten und Fledermäuse. Blätter/kleine Partikel sowie herumliegende Zeitungen, Müll oder nach Kollisionen verlorene Fahrzeugteile dürfen die Strecke beleben; liegengebliebene Objekte verschwinden nach begrenzter Zeit. Alles mit Performance- und Sichtbarkeitstests.

## Identität

Diktator Kart ist ein erwachsener, satirischer Arcade-Kart-Racer über autoritäre Macht, Propaganda und politische Selbstinszenierung. Reale historische Anspielungen dürfen vorkommen, werden aber kritisch und klar satirisch behandelt. Die inhaltlichen Grenzen stehen verbindlich in [13-world-and-content-boundaries.md](13-world-and-content-boundaries.md).

Die Grundidee ist auch eine Rückkehr zu einem Kindheitsgefühl: Das unmittelbare Kart-Racer-Erlebnis klassischer Spiele wird mit aktueller Browsertechnik, höherer Detailtreue, erwachsenerem Humor und einer eigenen Welt neu interpretiert.

Der Spieler übernimmt selbst die Rolle eines historischen Diktators. Die Darstellung soll realistisch genug sein, um die Person und ihre Inszenierung wiederzuerkennen, aber satirisch genug, um Macht, Größenwahn und Propaganda sichtbar zu entlarven. Der Spieler darf eine Figur unterhaltsam oder charismatisch finden, ohne dass das Spiel ihr politisches System positiv darstellen muss.

## Zielgefühl

Der Spieler soll innerhalb weniger Sekunden verstehen, wie beschleunigt, gelenkt, driftet, gesprungen und ein Item eingesetzt wird. Ziel ist ein Fahrgefühl von ungefähr 6/10 Realismus: spürbare Federung, Reifen- und Untergrundreaktionen, kleine Steine und Bordsteine, angedeutete Gewichtsverlagerung und sichtbare Fahrerreaktionen, aber weiterhin angenehm spielerisch. Ein Fehler darf lustig oder spektakulär sein, aber nicht unlesbar oder zufällig unfair. Die wichtigsten Rückmeldungen laufen zeitlich zusammen: Eingabe → Kartreaktion → Fahreranimation → Partikel → Ton → UI.

## Kernrennen

- Browserbasierter 3D-Racer, zunächst Singleplayer.
- Zielgröße der Hauptstrecke: ungefähr 60–120 Sekunden pro Runde, sobald die Strecke final gestaltet ist.
- Drei Runden als zentrale Rennform.
- Sichere Hauptroute plus riskante, aber erkennbare Abkürzungen.
- Fortschritt über Checkpoints und Runden; Ergebnisdaten bleiben korrekt, auch wenn Satire-UI das Ergebnis kommentiert.
- Der Rennsieg wird im Ergebnis und in der Sprecherdramaturgie als übertriebener politischer Propagandaerfolg verkauft; die eigentliche sportliche Leistung bleibt korrekt sichtbar.
- Revanche und Rückkehr ins Menü müssen sofort verständlich sein.

## Erste Strecke: historische Berlin-/Stadionwelt

Bestätigt ist eine frei zusammengestellte historische Berlin-/Stadionstrecke mit wiedererkennbaren Gebäuden und eigenen satirischen Details. Sie muss keine geografisch exakte Rekonstruktion sein. Landmarken und Zeitbild sind unten als Vorschlag ausgearbeitet, noch nicht beschlossen; die Grenzen aus Dokument 13 gelten.

### Vorschlag für Landmarken und erste Route – noch kein Beschluss

**Zeitbild:** Eine fiktive, verdichtete Berlin-Kulisse mit Bauformen und Selbstinszenierung der 1930er Jahre, ohne einen konkreten Tag, ein tatsächliches Rennen oder ein historisches Massenereignis nachzustellen. Die bestätigte historische Berlin-/Stadionrichtung bleibt bestehen; genaue Gebäudeformen, Symbole und Route werden erst nach gemeinsamer Prüfung beschlossen.

**Belegte historische Anker:** Das Berliner Olympiagelände umfasste bis 1936 unter anderem Olympischen Platz, Olympiastadion und Maifeld. Die Berliner Stadtbeschreibung ordnet die Anlage ausdrücklich der Inszenierung nationalsozialistischer Kulturpolitik zu. Das Brandenburger Tor ist ein älteres, eigenständiges Berliner Wahrzeichen mit fünf Durchfahrten. Diese Befunde stützen erkennbare Silhouetten und den kritischen Kontext, nicht die Übernahme von Fotos oder eine geographisch exakte Strecke. Quellen: [Berlin.de: Olympiagelände](https://www.berlin.de/sehenswuerdigkeiten/3560211-3558930-olympiagelaende.html), [Olympiastadion Berlin: Geschichte](https://olympiastadion.berlin/de/geschichte/), [Berliner Denkmaldatenbank: Brandenburger Tor](https://denkmaldatenbank.berlin.de/daobj.php?obj_dok_nr=09065019).

| Abschnitt | Vorgeschlagene Fahrfunktion | Landschaft und satirischer Blick |
|---|---|---|
| Stadionvorplatz / Start | breite, klare Startzone und erste gut lesbare Kurve | vereinfachte Stadion-Ovalfassade und Platzachse; Applausmaschinen laufen sichtbar asynchron und machen die Inszenierung als Mechanik erkennbar |
| Kulissenboulevard | mittellange Gerade für Tempo, Überholen und Sicht auf den folgenden Abzweig | fiktive Behördenfassaden und ein entferntes Brandenburger-Tor-Motiv als Orientierungspunkt; keine reale Parade oder originalgetreuen Regimesymbole |
| Hinterbühne / optionale Abkürzung | sichere Hauptroute plus kürzere, angekündigte Nebenroute mit klarer Rückführung | die prunkvolle Fassade zeigt dahinter Stützen, Akten und unpraktische Bürokratie; eine Druckerei-Idee aus der alten gemischten Hauptstadtstrecke bleibt hier nur eine mögliche satirische Ausstattung |
| Rückbogen / Ziel | breite Driftkurve mit freier Sicht auf Ziellinie und beide Kameradistanzen | Stadion- und Platzsilhouette kehren wieder; Kulissen reagieren über Runden dekorativ, ohne befahrbare Kollisionen zu verändern |

**Produktionsabfolge:** M3 baut zunächst nur einen zusammenhängenden Vorplatz-/Boulevard-Abschnitt als visuelle Stil- und Sechs-Fahrzeug-Lastprobe. Der vollständige Rundkurs, drei Runden, Checkpoints und die Abkürzungsregel gehören zu M4. Das langfristige 60–120-s-Rundenziel bleibt bestehen und wird erst mit Fahrtest und Botlinie bewertet. Materialien/Schilder entstehen neu; historische Fotos und Texte werden ohne geprüfte Nutzungsrechte nicht übernommen.

**Offen zur gemeinsamen Prüfung:** Wiedererkennbarkeit von Stadion und Tor in den drei Spielkameras, konkrete Zeit- und Zeichenwahl, Position des entfernten Tors in der fiktiven Topologie, satirische Lesbarkeit der Kulissen sowie sichere Abkürzungsgeometrie. Orte des Holocausts oder der Vernichtung und Humor auf Kosten von Opfern/Minderheiten bleiben ausgeschlossen; Dokument 13 ist die Inhaltsgrenze.

## Alte Streckenideen: „Größenwahn Grand Prix – Hauptstadt auf Bewährung“

Die folgenden fünf Zonen bleiben als kreative Quelle erhalten. Sie sind kein Pflichtlayout der ersten historischen Strecke und können später insbesondere die verbindende Strecke inspirieren:

1. **Palastplatz / Ministerium für Rennsiege:** pompöser Start, rote Teppiche, goldene Lautsprecher, eine Anzeigetafel mit widersprüchlicher Staatslogik.
2. **Boulevard der einstimmigen Begeisterung:** mechanische Papp-Zuschauer, zeitversetzter Applaus, sichtbare Reaktion auf vorbeifahrende Karts.
3. **Staatsdruckerei:** sichere Außenkurve oder kürzere Druckerei-Abkürzung mit Rampe, Stempeln und Papierbahn. Bewegliche Gefahren kündigen sich an.
4. **Fünfjahresplan-Baustelle:** monumentale Statue, die hinter der Kurve als hohle Sperrholzkulisse sichtbar wird; Sprung mit früh lesbarer Landezone.
5. **Palastgärten / Finale:** breite Driftkurve, absurder Brunnen, goldene Enten, übergroße Pokale, letzte Überholmöglichkeit und sichtbare Zielrahmung.

## Weltentwicklung über drei Runden

Mindestens drei dekorative Zustände verändern sich einmal pro Rennen, ausgelöst durch den führenden Fahrer. Beispiele: Applausmaschine verliert Synchronität, Statue zeigt mehr Kulisse, Banner wird umgedreht. Kollisionsgeometrie und befahrbarer Weg ändern sich dadurch nicht. Im Zeitfahren bleiben Strecke und Kollisionen stabil.

## Fahrer, Bots und Items

Jeder Diktator erhält ein einzigartiges, themenbasiertes Fahrzeug. Eine gemeinsame Grundlesbarkeit bleibt erhalten, aber Karosserie, Farben, Front, Spoiler, Spiegel, Auspuff, Sitz, Kleidung, Kopfbedeckung und bewegliche Details erzählen den jeweiligen Charakter. Individuelle Umbauten sollen später zusätzliche Varianten ermöglichen.

Fahrzeuge erhalten zusätzlich leicht unterschiedliche Fahrprofile, ohne dass daraus ein unfairer Vorteil entsteht. Während des Rennens dürfen Auspuff, Figuren, Waffen, Fahnen und Wimpel sichtbar reagieren. Kleine Schäden können gestuft auftreten: verbiegen/einknicken, lose hängen, abfallen oder am Fahrzeug mitschleifen. Reifenschäden dürfen vorübergehend die Lenkung beeinflussen; Schäden bleiben begrenzt und nicht gore-orientiert.

Der erste Spielprototyp enthält Hitler, Stalin, Mussolini, Mao, Kim Jong-un und Castro: einen Spieler und fünf Bots. Zunächst wird ein Fahrer samt Kart vollständig ausgearbeitet, die anderen fünf werden einfacher dargestellt. Danach wird der gemeinsam abgenommene Stil auf alle sechs übertragen. Bots sind faire Rennfahrer mit Fehlern, aber taktischen Entscheidungen: Sie analysieren Route, Abkürzungen, Hindernisse und Items, ohne unsichtbare Vorteile oder Cheats. Schwierigkeit leicht/mittel/schwer und Persönlichkeit werden getrennt abgestimmt. Drei Bot-Persönlichkeiten bleiben als Designidee erhalten:

- **Paraderacer:** sichere Linien, defensive Items.
- **Größenwahnsinniger:** riskante Überholmanöver und Abkürzungen.
- **Bürokrat:** gleichmäßige Fahrt, sammelt und nutzt Items kontrolliert.

Das erste Itemset besteht aus geradlinigem Projektil, zielsuchendem Projektil und Falle. Die Regeln sind für alle Fahrer identisch; Modell, Sound und Animation sind fahrerspezifisch. Hintere Plätze bekommen maßvoll bessere Chancen auf hilfreiche Items; dieselbe Regel gilt für Menschen und Bots. Der weitere Altpool bleibt erhalten und wird separat bewertet.

Persönliche Spezialfähigkeiten werden über eine eigene Taste beziehungsweise Eingabe ausgelöst und nach einer festen Abklingzeit wieder verfügbar. Keine Aufladung durch Fahrleistung ist für den Start vorgesehen. Konkrete Tasten und Abklingzeiten sind Balance-/Bedienungsdetails des Prototyps; alte Werte werden nicht automatisch übernommen.

Treffer verursachen kurze Rutscher und Tempoverluste mit Warnungen und Schutz vor Trefferketten. Vollständige Kontrollentziehung bleibt eine sparsame Ausnahme. Optische Schäden können bis Rennende sichtbar bleiben; Lenkbeeinträchtigungen enden nach kurzer Zeit. Eine notwendige Rücksetzung bei Festfahren kostet Zeit und folgt für Mensch und Bot denselben Regeln.

## Sprecher und Abschluss

Individuelle eigenständige Parodiestimmen der Fahrer und eine ereignisgesteuerte deutsche Stadionsprecherin sind beschlossen. Namen werden in ihrer üblichen deutschen Form verwendet. Audio wird vorproduziert; Ansagen bleiben sparsam, priorisiert und mit Untertiteln versehen. Historisch geprägte, streckenspezifische Musik ist gewünscht; elektronische Musik ist ausgeschlossen. Eine überspringbare Siegerehrung und ein datenbasierter satirischer Rennbericht gehören nach dem Kernrennen in die Produktionsplanung.

## Veröffentlichung und Zusammenarbeit

Zuerst privat für das Team und Freunde, später öffentlich kostenlos; kein verkaufbares Produkt geplant. Vorerst ausschließlich vorhandene und kostenlose Werkzeuge/Assets, kein zusätzliches Budget für Musik oder Stimmen. Änderungen an Sarahs ursprünglichen Ideen benötigen die gemeinsame Bestätigung.

## Nachgelagerter Umfang

Zeitfahrgeist, lokale Orden, Fotomodus, weitere Fahrer, weitere Strecken und Multiplayer kommen erst nach einer stabilen Singleplayer-Abnahme. Dokumentation allein zählt nicht als Umsetzung.

## Weltumfang

Geplant sind sechs unterschiedliche themenbasierte Strecken und eine verbindende Strecke, die Motive aller Themen zusammenführt. Jede Strecke darf eigene Abkürzungen, Wetter-/Atmosphärenzustände, bewegliche Objekte und Ereignisse besitzen. Der erste Prototyp konzentriert sich auf genau eine Strecke, damit Fahrgefühl, Bots, Items und Performance sauber geprüft werden können.

Die verbindende Strecke entsteht bewusst erst am Ende, wenn die einzelnen Themenwelten feststehen.

## Wetter und Atmosphäre

Wetter ist zunächst lokal und zeitlich begrenzt, nicht als globale Dauerbedingung. Wind beeinflusst hauptsächlich Kulissenobjekte wie Bäume, Fahnen und Blätter. Regen kann einzelne Streckenabschnitte zeitweise rutschiger machen. Schnee verändert Grip und Fahrwiderstand spürbar, Eis verstärkt Rutschen und verlängert Bremswege deutlich. Jede Wirkung bleibt arcade-tauglich und muss früh lesbar angekündigt werden.

## Publikum und Gegenspieler

Themenbezogene Zuschauer und Hintergrund-NPCs lockern die reine Diktatorenperspektive auf. Sie tragen passende Kleidung, führen kleine sichtbare Tätigkeiten aus und bleiben im Hintergrund glaubwürdige Kulisse. Sie werden nicht zu einer übertriebenen zweiten Spielmechanik.

## Aktive Spielrichtung aus Marcels Initialantwort – 06.10.2026

Der aktive Maßstab ist ein zugängliches Arcade-Rennen mit Übungstiefe, chaotisch-komischen Grand Prix von ungefähr 10–15 Minuten, stark überraschenden Items und aktiven, aber fair geregelten Bots. Fahrfehler schaden kurzfristig, ohne Comebacks zu verhindern. Der Einzelspieler-Grand-Prix kommt vor Zeitfahren, freiem Üben und späterem Multiplayer; alle Inhalte sind von Beginn an verfügbar. Humor entsteht regelmäßig durch Slapstick, Selbstdarstellung, Kulisse und Ansagen, mit ruhigen Phasen. Historische Figuren bleiben faktennah und erkennbar; der Humor darf provokant sein, macht aber reale Opfer nicht lächerlich. Sarahs Beiträge bleiben separat bewahrt; ihre Antworten ändern diesen Maßstab nicht automatisch. Einzelantworten: [Fragebogen](../PROJECT-QUESTIONNAIRE.md); geltende Ausgangsbasis: [Projektgrundgerüst](23-project-design-baseline.md).
