# Game Design

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

Bestätigt ist eine frei zusammengestellte historische Berlin-/Stadionstrecke mit wiedererkennbaren Gebäuden und eigenen satirischen Details. Sie muss keine geografisch exakte Rekonstruktion sein. Konkrete Landmarken und die genaue Zeitdarstellung sind noch auszuarbeiten; die Grenzen aus Dokument 13 gelten.

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
