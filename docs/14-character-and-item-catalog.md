# Übernommener Fahrer-, Kart- und Itemkatalog

## Neutraler Slice-Pass – 03.10.2026

Der ausdrückliche aktuelle Nutzerauftrag erlaubt einen eigenständigen neutralen Fahrerplatzhalter. Sechs Karts teilen das Original-Roadsterasset, mit sechs Farben und fünf optionalen Anbauten (Radiohörner, Ersatzrad, Gepäck, hohe Auspuffe, neutrale Wimpel). Kopf, Schal, Hände/Lenkrad und vier Räder sind getrennt animiert. Das ersetzt keine historische Charakterwahl und benennt Sarahs Katalog nicht um. Die im Spiel verwendeten Rohrpost-/Suchauftrag-/Stempelfallenformen stellen die drei bestätigten gemeinsamen Archetypen vorläufig dar.

## Herkunft und Status

Dieser Katalog extrahiert die verwertbaren Ideen aus dem alten Produktionsauftrag. Er ist die kreative Quelle für die Babylon.js-Neuentwicklung, keine Aufforderung, alte Klassen oder alte Balancewerte zu kopieren. Alle Fähigkeiten müssen neu bewertet, fair umgesetzt, historisch verantwortbar gestaltet und mit dem neuen Fahrgefühl abgestimmt werden.

Die zwölf Figuren sind historische Diktatoren als satirische Fahrerfiguren. Namen, konkrete Symbole, Kleidung und historische Schauplätze brauchen vor Veröffentlichung eine eigene Inhalts- und Rechtsprüfung. Die Satire richtet sich gegen Diktatoren, Machtstrukturen, Personenkult, Propaganda, Bürokratie und autoritäre Systeme.

## Fahrer und Fahrzeuge

Bestätigter Startkader aus `client/src/game/drivers.ts` des Altprojekts: Hitler, Stalin, Mussolini, Mao, Kim Jong-un und Castro. Zunächst ein vollständig ausgearbeiteter Fahrer/Kart und fünf einfachere Darstellungen. Große Köpfe und karikierte Körper mit historischen Gesichtszügen bleiben verbindlich.

Die folgende Zwölferliste bewahrt Originalideen. Namen und Wirkungen sind keine pauschal freigegebene Implementierung. Änderungen an Sarahs ursprünglichen Ideen, einschließlich Umbenennungen, werden gemeinsam bestätigt.

| Fahrer | Arbeitstitel-Kart | Kreativer Kern | Spezialfähigkeit / ironischer Nachteil |
|---|---|---|---|
| Adolf Hitler | Größenwahn-Mobil | schwer, pompös, hohe Endgeschwindigkeit, schwache Beschleunigung und Handhabung | **Endlose Rede:** Gegner werden kurz durch eine Ansprache behindert; die eigene Figur redet zu lange weiter und verliert kurz Geschwindigkeit. |
| Josef Stalin | Fünfjahresplan 3000 | massiv, industriell, schwer | **Große Säuberung:** Mehrere Hindernisse oder Items verschwinden; als Eigennachteil verschwindet auch etwas Eigenes. |
| Benito Mussolini | Il Duce GT | sportlich, elegant, selbstgefällig | **Große Pose:** starker kurzer Turbo nach einer übertriebenen dramatischen Pose. |
| Mao Zedong | Kultur-Kart | leicht, gute Beschleunigung und Handhabung | **Kulturrevolution:** gegnerische Steuerung wird kurz beeinflusst oder vertauscht; danach trifft ein kürzerer Nachteil den eigenen Fahrer. |
| Kim Jong-un | Propaganda-Rakete | Raketen-/Paradeästhetik | **Propaganda-Sieg:** Die Platzierungsanzeige zeigt kurz fälschlich Platz 1; danach kehrt die echte Rangliste zurück. |
| Muammar al-Gaddafi | Wüstenkreuzer | Wüstenfahrzeug, staubige Silhouette | **Wüstensturm:** Sand und Staub erschweren Sicht oder Strecke; die eigene Figur bleibt nicht vollständig verschont. |
| Fidel Castro | Revolutions-Cabrio | leichtes, gut lenkbares Cabrio | **Blockade:** Eine Streckenbarriere entsteht und kann auch den eigenen Fahrer behindern. |
| Saddam Hussein | Goldpalast GT | schwer, übertrieben luxuriös und golden | **Goldener Palast:** Ein goldenes Hindernis entsteht und kann die eigene Ideallinie blockieren. |
| Nicolae Ceaușescu | Monument Express | schwer, monumental, staatsrepräsentativ | **Monumentbau:** Ein absurdes Monument taucht auf; die Baukosten erzeugen einen eigenen Geschwindigkeitsnachteil. |
| Idi Amin | Chaos-Mobil | bewusst unberechenbare Werte, zusammengewürfelte Form | **Unberechenbarer Befehl:** zufälliger positiver oder negativer Renneffekt; auch der Spieler kann verlieren. |
| Augusto Pinochet | Ordnungs-Kart | militärisch geordnet, karikiert | **Ausgangssperre:** Andere Fahrer können kurz keine Items nutzen; der eigene Itemzugriff wird ebenfalls eingeschränkt. |
| Francisco Franco | Traditions-Tourer | altmodisch, schwerfällig | **Stillstand der Tradition:** Alle Fahrer werden vorübergehend verlangsamt. |

## Details der sechs bisherigen Fahrer

Quelle: `Diktator-Kart-Legacy/client/src/game/drivers.ts`. Farben und Details sind belegter Altstand, keine bereits beschlossene Farbpalette für Babylon.js. Die alten Profiltexte und Titel sind Wortlautideen, keine Balancevorgaben.

| Fahrer | Primärfarbe | Akzent | Bewegliches Detail | Alter Titel |
|---|---|---|---|---|
| Hitler | `#8e2635` | `#e2c35b` | wackelnde Blechorden | Selbsternannter Streckenbesitzer |
| Stalin | `#6f2424` | `#f0b83f` | federnder Sitzungsthron | Vorsitzender der Kurvenkommission |
| Mussolini | `#31557a` | `#e9dfc4` | vibrierende Mini-Lautsprecher | Balkonfahrer ohne Balkon |
| Mao | `#b72f2b` | `#f4d44d` | flatterndes Regelheft | Großer Lenker, mittelgroße Lenkung |
| Kim Jong-un | `#263f70` | `#e63f44` | überlanger Auspuff | Sieger vor Rennbeginn |
| Castro | `#315d42` | `#d7c99a` | aufklappender Aktenkoffer | Dienstältester Boxengassenredner |

## Vorschlag für den ersten M3-Art-Piloten – noch kein Beschluss

**Vorgeschlagen:** Benito Mussolini mit dem überlieferten Arbeitstitel **Il Duce GT**. Die Auswahl des ersten vollständig ausgearbeiteten Fahrers ist noch gemeinsam zu bestätigen; alle sechs bestätigten Fahrer bleiben im geplanten Kader. Die persönliche Herkunft einzelner Altideen von Sarah ist nicht belegt. Deshalb werden die folgenden Ausführungen als Produktionsvorschlag geführt und ändern weder Fahrzeugkonzept noch Fähigkeit.

| Bestandteil | Übernommene Idee und Quelle | Vorschlag für die spätere Stilprobe |
|---|---|---|
| Fahrer/Kart | mittelgroßer, sportlich-eleganter, selbstgefälliger Il Duce GT aus dem alten Produktionsauftrag; großer karikierter Kopf und erkennbare Gesichtszüge als bestätigte allgemeine Regel | ein editiertes Fahrer- und Kartmodell als erster Qualitätsmaßstab für Silhouette, Material, Körperhaltung und Animation in allen drei Kameras |
| Farbe/Detail | Blau `#31557a`, Creme `#e9dfc4` und vibrierende Mini-Lautsprecher sind belegter Altstand in `Diktator-Kart-Legacy/client/src/game/drivers.ts` | diese Farben nur als Ausgangsreferenz testen; Lautsprecher als **ein** bewegliches Detail für Federung/Drift/Boost prüfen, ohne die Farbpalette bereits zu beschließen |
| Fähigkeit | „Große Pose“ mit kurzem Turbo nach dramatischer Pose ist überlieferte Kreatividee | im Art-Piloten nur lesbare Pose/Bewegung als Möglichkeit skizzieren; Regel, Dauer, Balance und Name bleiben für die spätere gemeinsame Entscheidung offen |

**Warum dieser Pilot:** Die mittlere Kartgröße erlaubt denselben Test für nahe/ferne Verfolger- und Fahrerperspektive, ohne die erste technische Vorlage auf ein besonders schweres oder sehr leichtes Kart zuzuschneiden. Die vorhandenen Lautsprecher liefern einen klar abgrenzbaren Animationstest. Die eigenständige Farb- und Materialwirkung lässt sich im bestätigten Stilraum G–L aus den Spielkameras prüfen. Diese Auswahl begründet Produktionsreihenfolge, keine Rangfolge der Figuren oder Strecken.

**Prüfbare Liefergrenze für M3, nach M2-Abnahme:** editierbare Quelldatei und GLB/GLTF, ein Fahrer/Kart mit einem beweglichen Detail, sichtbare Hände/Lenkrad/Armaturen/Vorderräder aus Fahreraugenhöhe, lesbare Silhouette in beiden Verfolgerkameras, Basis- und Standardmaterialstufe sowie eine kurze Drift-/Hop-/Kontaktprobe in der tatsächlichen Testszene. Kostenlose vorhandene Werkzeuge und dokumentierte Referenz-/Assetherkunft bleiben Pflicht. Die Stilfreigabe erfolgt gemeinsam anhand dieses Piloten; kein Konzeptbild gilt als Nachweis von Echtzeitqualität.

**Inhaltsgrenze:** Die Satire richtet sich gegen Selbstinszenierung und Machtpose. Historische Symbole werden für den Art-Piloten nicht als bloßer Schmuck vorausgesetzt; konkrete Zeichen, Kostümteile, Sprache und Veröffentlichung brauchen die Prüfung aus Dokument 13 und gegebenenfalls gemeinsame Bestätigung bei Sarah-Ideen.

## Kostümvarianten und spätere Team-Boni aus dem Altprojekt

Quelle: `Diktator-Kart-Legacy/docs/02-gameplay.md`. Diese Ideen bleiben für später bewahrt; Freischaltbedingungen, Gestaltung und tatsächliche Verwendung sind nicht entschieden. Kostüme oder Team-Boni gehören nicht automatisch zum ersten Singleplayer-Umfang.

| Fahrer | Alte Kostümidee |
|---|---|
| Hitler | Bunker-Version |
| Stalin | Generalissimus |
| Mussolini | Balkon-Rede |
| Mao | Roter Vorsitzender |
| Kim Jong-un | Marschall-Ausführung |
| Castro | Revolutionär 1959 |
| Gaddafi | Beduinenzelt-Version |
| Saddam Hussein | Goldpalast-Version |
| Ceaușescu | Staatsbesuch-Version |
| Idi Amin | Feldmarschall-Version |
| Pinochet | Paradeuniform |
| Franco | Staatschef-Version |

| Alter Teamname | Fahrer | Alter Vorschlag |
|---|---|---|
| Achsen der Eitelkeit | Hitler, Mussolini, Franco | +5 % Höchstgeschwindigkeit, −10 % Handling |
| Personenkult-Allianz | Stalin, Mao, Kim Jong-un | +10 % Item-Chance |
| Revolutionäre Fraktion | Castro, Gaddafi | +10 % Beschleunigung |
| Chaosfraktion | Idi Amin, Saddam Hussein | zufälliger positiver Effekt pro Runde |

Die alten Prozentwerte sind **nicht beschlossen**. Vor einer Online-Umsetzung müssen Fairness, Modus und historische Darstellung gemeinsam geprüft werden. Ob die Teams nur in Teamrennen oder allgemein gelten, war bereits im Altdokument offen.

## Gewichtsklassen als Ausgangspunkt

- **Leicht:** Mao, Fidel Castro, Kim Jong-un
- **Mittel:** Mussolini, Pinochet, Gaddafi, Franco
- **Schwer:** Hitler, Stalin, Saddam Hussein, Ceaușescu
- **Spezial:** Idi Amin

Die Klassen dürfen Beschleunigung, Höchstgeschwindigkeit, Lenkung, Drift, Gewicht und Stoßresistenz beeinflussen. Unterschiede bleiben klein genug, damit jeder Fahrer konkurrenzfähig bleibt. Die neue Babylon-Balance wird nicht aus dem Altprojekt übernommen, sondern im Fahrprototyp gemessen.

## Gemeinsame Fahrzeugregeln

Jedes Kart braucht eine eigene Silhouette und mindestens ein charakteristisches bewegliches Detail. Farbe allein reicht nicht. Mögliche Details sind übergroße Frontpartien, Wimpel, Orden, Lautsprecher, Auspuffe, Waffenattrappen, Spiegel, Fahnen, Thronsitze, Aktenkoffer oder Monumentelemente.

Die Fahrer reagieren sichtbar auf Bremsen, Boost, Drift, Sprünge, Kollisionen und Schaden. Die Figur bleibt dabei stilisiert und nicht fotorealistisch; Wiedererkennbarkeit und Satire sind wichtiger als exakte historische Nachbildung.

## Itemkatalog aus dem Altprojekt

| Item | Grundwirkung | Neue Prüfregeln |
|---|---|---|
| Propaganda-Plakat | stört oder verdeckt kurz die Sicht anderer Fahrer | Straße bleibt ausreichend sichtbar; Bots erhalten eine begrenzte spielerische Übersetzung. |
| Roter Aktenordner | entfernt oder manipuliert ein Item | Gegenwirkung muss verständlich und nicht frustrierend sein. |
| Personenkult-Statue | erzeugt ein übertriebenes Hindernis | sichere Ausweichmöglichkeit, klare Vorwarnung, kein permanentes Blockieren. |
| Zensurstempel | blendet Teile von UI oder Minimap kurz aus | wichtige Fahrbahn- und Trefferwarnungen bleiben zugänglich. |
| Geheimpolizei | zielsuchendes Angriffsitem gegen einen vorausfahrenden Fahrer | gemeinsame Treffer-, Schutz- und Immunitätslogik. |
| Wirtschaftsplan | starker Turbo mit anschließendem satirischem Leistungsverlust | Gas und Lenkung bleiben nutzbar; Nachteil hebt den Gewinn nicht regelmäßig auf. |
| Dienstweg-Rakete | geradliniges Rohrpostgeschoss mit Aktenflügeln | begrenzte Lebensdauer, höchstens ein Ziel, Papier-/Stempelstaub, hörbare Ankündigung. |
| Diplomatische Immunität | transparenter Schutz aus Pässen und Stempeln | fängt definierte Angriffe ab, zeigt Restdauer, endet mit Papierkonfetti, erlaubt kein Wanddurchfahren. |

Der Pool muss mindestens direkte Projektile, zielsuchende Projektile, Fallen, Turbo, Schutz, UI-/Sichtstörung und Streckenmanipulation abdecken. Jedes Item braucht Modell, Icon, Sound, Effekt, Kollision, klare Wirkung, sauberes Ende und Balancing. Nach Treffern sind kurze Schutzzeiten vorzusehen, damit keine endlosen Trefferketten entstehen.

## Spezialfähigkeiten als System

Fahrerfähigkeiten unterscheiden Diktator Kart von gewöhnlichen Kart-Racern. Beschlossen ist eine eigene Taste/Eingabe und eine feste Abklingzeit vor erneutem Einsatz; keine Aufladung durch Fahrleistung im Startkonzept. Konkrete Zeiten und Tasten werden später abgestimmt. Jede Fähigkeit soll satirisch, unmittelbar verständlich und visuell auffällig sein und kann einen ironischen Eigennachteil enthalten. Die Fähigkeit ist eine übertriebene politische Maßnahme, die auf die eigene Figur zurückschlagen kann. Menschen und Bots nutzen dieselben Regeln; HUD und später Touch zeigen Bereitschaft und Restzeit.

## Übernommene Fahr- und Audioideen

- stabile Arcade-Normalfahrt mit geschwindigkeitsabhängiger Lenkung, Bremse, Rückwärtsgang, Federung, Kollisionen und sichtbarer Bodenhaftung
- Hop als Einleitung für einen kontrollierten Drift
- Drift mit kontrollierbarem Heck, Gegenlenken, weichem Übergang zurück zur Haftung und vergleichbarem Verhalten links/rechts
- mindestens zweistufiger Mini-Turbo: kurzer Drift erzeugt kleinen Boost, längerer sauberer Drift einen stärkeren Boost
- sichtbare Aufladung über Funken an den Hinterrädern, Funkenfarben, Rauch, Reifenpartikel und Driftspur
- vollständig bedienbarer Ablauf von Hauptmenü über Modus, Fahrer, Kart und Strecke bis Ergebnis, Revanche und Menü
- Audiofamilie aus Motor, Reifen, Drift, Funken, Turbo, Sprung, Landung, Kollision, Itembox, Roulette, Treffer, Countdown, Start, Runde, Zieleinlauf und Menü
- schleifenfähige Menü- und Rennmusik sowie kurze Fahrer-/Ereignisreaktionen

## Bots und gemeinsame Schnittstelle

Das alte Konzept fordert mindestens einen Menschen plus fünf tatsächlich fahrende Bots. Die neue Architektur übernimmt die Designanforderung, nicht die alte Implementierung: HumanInput, BotInput und später NetworkInput sollen dieselbe Kart-Schnittstelle bedienen. Bots nutzen Streckenwissen, Waypoints/Racing Line, Kurvenvorausschau, Geschwindigkeitsanpassung, Recovery, Itementscheidungen, Drift und Überholverhalten. Schwierigkeit entsteht durch Fahrqualität und Entscheidungen, nicht durch Teleportation oder geheime Werte.

## Abnahmestatus

| Bereich | Status |
|---|---|
| Fahrerideen und Spezialfähigkeiten | aus Altprojekt extrahiert, Babylon-Neubewertung offen |
| Kart-Silhouetten und Charakterdetails | als Grundpfeiler übernommen, konkrete Entwürfe offen |
| Itemkategorien | übernommen, Balance und Wirkung offen |
| fünf Bots plus Spieler | sechs Teilnehmer beschlossen; ein ausgearbeiteter Fahrer/Kart, fünf zunächst einfachere Darstellungen |
| historische Namen/Symbole | kreative Quelle, Inhalts- und Rechtsprüfung erforderlich |
