# Art Direction

## Laufender großer Slice – 03.10.2026

Die Standardansicht verwendet editierbare Blender-/GLB-Assets statt Quaderkarts: geformter Retro-Roadster, neutraler Fahrerplatzhalter, bewegte Räder/Lenkrad/Schal, echtes CC0-Pflaster, Stein/Stoff, gerichtetes Licht, Schatten und Wolkenhimmel. `docs/evidence/slice-*.png` sind Spielaufnahmen. Der Fahrer ist keine fertige historische Figur. G–L wird noch nicht erreicht; individuelle historische Silhouetten, Gesichts-/Materialpolitur und gemeinsame Stilfreigabe fehlen.

Historische Zwischenstände und langfristige Abnahmen bleiben erhalten. Aktuelle Ergebnisse: [Fortschrittslog](17-progress-log.md).

## Visuelles Ziel

Die Bildsprache verbindet die sofortige Lesbarkeit und das Fahrgefühl von Mario Kart 64 mit deutlich höherer Detailtreue und modernerer Material-, Licht-, Animations- und Effektqualität. Die Switch-Mario-Kart-Spiele sind ein technischer Inspirationspunkt, aber das Ergebnis soll weniger kindlich, erwachsener, eigenständiger und stellenweise realistischer wirken: mehr glaubwürdiges Gewicht, Bodenhaftung und Materialwirkung, aber weiterhin überzeichnet und humorvoll.

Wichtig: Ein generiertes Konzeptbild ist ein Zielbild für Stimmung und Komposition, kein Versprechen, das die Engine automatisch erzeugt. Die Qualität kommt aus Modellen, Materialien, Licht, Animation, Effekten, Kamera und Leveldesign zusammen.

## Stilregeln

- Silhouetten müssen aus der Fahrkamera schnell unterscheidbar sein.
- Architektur darf monumental wirken, braucht aber erkennbare satirische Brüche: Kulissen, Stempel, Akten, übertriebene Ordnung.
- Farben werden klar und kontrastreich eingesetzt; wichtige Fahrbahn-, Item- und Warnsignale dürfen nicht in Dekoration verschwinden.
- Materialien haben einfache, nachvollziehbare Eigenschaften: lackiertes Metall, Stein/Marmor, Papier, Stoff, Holz/Kulisse, Goldanstrich, Asphalt/Pflaster.
- Details bevorzugen wiederverwendbare Module und sichtbare Reaktionen gegenüber vielen kleinen Einmalobjekten.
- Figuren und Karts erhalten individuelle Formen, nicht nur unterschiedliche Farben.
- Attraktive, sinnliche und gegebenenfalls freizügigere erwachsene Gestaltung ist erlaubt, bleibt aber stilvoll, charakterbezogen und oberhalb der vom Nutzer gezogenen Grenze.
- Historische Anspielungen werden nicht als heroische Rekonstruktion inszeniert; die visuelle Dramaturgie muss die Satire und Kritik erkennbar halten.

## Kamera und Animation

Beschlossen sind drei umschaltbare Ansichten: nahe Verfolgerkamera, weiter entfernte Verfolgerkamera und First Person aus Augenhöhe des Fahrers. Die Verfolgerkameras bleiben übersichtlich und erhalten maßvolle Dynamik sowie eine ruhige Einstellung. Die Fahrerperspektive zeigt Hände am bewegten Lenkrad, Armaturen und die Vorderräder. Sichtbarkeit und Lesbarkeit sind aus dem tatsächlichen Augenpunkt zu prüfen.

Cockpit, Hände, Lenkrad und Vorderräder sind deshalb frühe Modell-/Animationsanforderungen. Kameranachführung und visuelle Federung dürfen die Fahrerperspektive nicht unkontrolliert erschüttern. Kameramodi werden bei Drift, Sprung, Landung, Wandkontakt und Rücksetzung geprüft.

**M2d-Sichtprobe, 03.10.2026:** Drei Perspektiven sind mit prozeduralen Testformen in Chrome umschaltbar. Die Fahrerperspektive zeigt einfache Armaturen, Hände, bewegtes Lenkrad und Vorderräder auch während eines geladenen Drifts. Das ist ein Funktionsbeleg für Sichtbarkeit, noch keine Abnahme von Materialqualität, Fahrkomfort, Kamera bei Wandkontakt oder Touch-Bedienung. Die entsprechende offene Aufgabe in Dokument 10 bleibt bestehen.

**M2k-Kontaktbilder, 03.10.2026:** Der reproduzierbare Gegenverkehrsfall wurde zusätzlich in ferner Verfolger- und Fahrerperspektive bei angezeigtem Fahrzeugkontakt aufgenommen. In den Standbildern bleiben Test-Karts beziehungsweise Cockpitteile und Gegenkart sichtbar; die Kamera zeigt keine leere oder vollständig verdeckte Szene. Belege: `docs/evidence/m2k-fahrzeugkontakt-fern-chrome.png` und `m2k-fahrzeugkontakt-fahrer-chrome.png`. Bewegungsruhe, Komfort, echte Wandkontakte und fertige Cockpitqualität sind damit nicht beurteilt.

**Frühe Babylon-Stilskizze, 03.10.2026:** Auf Wunsch nach schnellerem sichtbarem Fortschritt ist die normale Testansicht nun ein fiktiver Vorplatz/Boulevard mit wiederholbaren Fassaden, Lampen, Stein-/Metallkontrast und neutralem Fahrerplatzhalter. Die Laboransicht bleibt unter `?world=lab` für reproduzierbare Fahrtests. Aus drei Spielkameras aufgenommene Bilder stehen in `docs/evidence/m3d-stadium-style-chrome.png`, `m3d-stadium-far-chrome.png` und `m3f-stadium-driver-chrome.png`. Die zuerst doppelt sichtbare Außenkarosse wurde aus der Fahrerperspektive ausgeblendet; Instrumente, Reifen und Haube wurden neu positioniert. Diese prozedurale Blockout-Grafik liegt noch deutlich unter der gemeinsam bestätigten Zielrichtung G–L; sie ist weder Stilfreigabe noch ein fertiges Figuren-/Cockpitasset.

Figuren behalten große Köpfe und überzeichnete Körper mit erkennbaren historischen Gesichtszügen. Zuerst erhält ein Fahrer samt Kart den vollständigen Stilpass; fünf weitere bleiben zunächst einfacher dargestellt. Die Abnahme erfolgt auch aus beiden Verfolgeransichten und der Fahrerperspektive, nicht allein anhand der Konzeptbilder.

Die Verfolgerkamera muss das Kart hinterherführen, Kurven und Drift lesen lassen und bei Sprüngen genügend Strecke zeigen. Kamerabewegung darf spektakulär sein, aber nicht die Fahrbarkeit opfern. Eine Option für reduzierte Kamerabewegung und reduzierte Effekte ist Pflicht für Zugänglichkeit und schwächere Hardware.

Fahrer reagieren sichtbar auf starkes Bremsen, Boost und Drift. Fahrzeugdetails wackeln, federn oder vibrieren lokal; solche Animationen verändern nicht den Physikcontroller.

Schäden werden als gestufte, lesbare Animationen gestaltet: Ein Spiegel knickt ein und kann abbrechen, ein Auspuff verbiegt sich und kann am Boden mitschleifen, eine Abdeckung klappt auf oder fällt ab. Rauch, Funken, Pflaster und Ruß sind möglich; explizite Blut- oder Gore-Darstellung ist nicht das Ziel.

## Effekte

Partikel und Postprocessing unterstützen Ursache und Wirkung: Papier, Stempelstaub, Tinte, Konfetti, Funken, Staub und Boost. Effekte müssen begrenzt, skalierbar und temporär sein. Keine reine Farb- oder Tonabhängigkeit bei wichtigen Warnungen.

Atmosphäre ist ein wichtiger Qualitätshebel: Nebel, lokaler Regen, Schnee, Eis, fallende Blätter, Luftfeuchtigkeit, Schattenwurf durch Bäume und Materialreaktionen sollen später als thematische Varianten geprüft werden. Regen, Schnee und Eis dürfen das Fahrverhalten begrenzt beeinflussen; Wind bleibt zunächst eine sichtbare Reaktion der Kulisse. Diese Effekte werden nicht alle gleichzeitig in den Prototyp gezwungen.

## Akustische Identität

Beschlossen: eigene vorproduzierte Parodiestimmen für die Fahrer und eine weibliche Stadionsprecherin mit sparsamen Ansagen. Namen werden in ihrer üblichen deutschen Form geführt. Historisch geprägte Musik ist gewünscht, elektronische Musik als Stilrichtung ausgeschlossen. Sprachqualität wird durch Hörproben abgenommen; das vorerst kostenlose Produktionsbudget ist eine reale Qualitäts-/Aufwandsgrenze, keine Zusage professioneller Ergebnisse ohne Iteration.

Audio ist ein gleichwertiger Teil der Art Direction. Jede Themenstrecke erhält eine eigene musikalische Identität, die kulturelle und historische Anklänge stilisiert und respektvoll behandelt: beispielsweise deutsche, chinesische oder russische Klangfarben, ohne in bloße Klischee-Parodie zu verfallen. Orchestrale Satire, Propaganda-Anmutung, Fahrzeugklänge, Untergrund, Wetter und Itemreaktionen müssen als zusammenhängende Klangwelt gestaltet werden.

## Qualitätsstufen

Die Art Direction wird als skalierbares Set geplant:

- **Basis:** klare Materialien, einfache Schatten, lesbare Silhouetten, geringe Partikelzahl.
- **Standard:** bessere Schatten, reflektierende Akzente, mehr Weltreaktionen, moderates Postprocessing.
- **Hoch:** zusätzliche Licht-/Effektqualität, aber kein exklusiver Content und keine spielrelevanten Informationen nur auf Hoch.

Die genauen Werte werden nach einem Babylon.js-Prototyp auf echter Hardware vermessen.

## Aktuelle visuelle Präferenz

Die erste Vergleichsgrafik wurde gemeinsam bewertet. Panel C ist die bevorzugte Basis: detailreich, farbig, erwachsen, klar lesbar und hochwertig. Panel A darf als realistischere Material- und Lichtreferenz einfließen. Panel B liefert höchstens eine abgeschwächte dunklere Stimmung; die Effektdichte und Dunkelheit werden ausdrücklich reduziert. Panel E bleibt eine Nebenreferenz. Die Richtungen aus D und F werden nicht weiterverfolgt.

Die nächste Stilprüfung soll gezielt C + A verbinden, nicht sechs neue zufällige Stilrichtungen erzeugen.

## Festgelegte Hauptzielrichtung

Die zweite Vergleichsrunde G–L wird als gemeinsamer Hauptstil des Projekts angenommen. Das Zielbild ist eine farbige, detailreiche, erwachsene 3D-Welt mit hochwertigen Materialien, charaktervollen Karts, klaren Silhouetten, atmosphärischem Licht und sichtbaren, aber kontrollierten Effekten. Die Varianten G–L sind dabei ein Stilraum und kein Zwang, jede dargestellte Einzelwirkung vollständig gleichzeitig zu bauen.

Die Machbarkeit wird über einen Vertical Slice geprüft. Nicht jedes Konzeptbilddetail muss in Echtzeit, auf jeder Qualitätsstufe oder auf schwacher Hardware identisch erscheinen. Priorität haben Fahrbarkeit, Lesbarkeit, Materialwirkung, Lichtstimmung und wenige starke Effekte vor einer Überladung der Szene.
