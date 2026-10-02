# Übernommener Fahrer-, Kart- und Itemkatalog

## Herkunft und Status

Dieser Katalog extrahiert die verwertbaren Ideen aus dem alten Produktionsauftrag. Er ist die kreative Quelle für die Babylon.js-Neuentwicklung, keine Aufforderung, alte Klassen oder alte Balancewerte zu kopieren. Alle Fähigkeiten müssen neu bewertet, fair umgesetzt, historisch verantwortbar gestaltet und mit dem neuen Fahrgefühl abgestimmt werden.

Die zwölf Figuren sind historische Diktatoren als satirische Fahrerfiguren. Namen, konkrete Symbole, Kleidung und historische Schauplätze brauchen vor Veröffentlichung eine eigene Inhalts- und Rechtsprüfung. Die Satire richtet sich gegen Diktatoren, Machtstrukturen, Personenkult, Propaganda, Bürokratie und autoritäre Systeme.

## Fahrer und Fahrzeuge

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

Fahrerfähigkeiten unterscheiden Diktator Kart von gewöhnlichen Kart-Racern. Jede Fähigkeit soll satirisch, unmittelbar verständlich und visuell auffällig sein, einen Cooldown besitzen und häufig einen ironischen Eigennachteil enthalten. Die Fähigkeit ist keine geheimnisvolle Superkraft, sondern eine übertriebene politische Maßnahme, die auf die eigene Figur zurückschlagen kann.

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
| fünf Bots plus Spieler | als Ziel übernommen, konkrete Prototypgröße offen |
| historische Namen/Symbole | kreative Quelle, Inhalts- und Rechtsprüfung erforderlich |
