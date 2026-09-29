# Items

## Integrierter Stand

Das Rennen besitzt acht einsammelbare Items. Gold-türkise Versorgungskisten stehen entlang der vollständigen Runde, verschwinden nach der Aufnahme und erscheinen nach sieben Sekunden erneut. Spieler und Bots halten jeweils höchstens ein Item; der Spieler setzt es mit `E` ein, Bots wählen den Einsatz nach Itemtyp, Distanz, Ausrichtung und Haltezeit.

| Item | Integrierte Wirkung |
| --- | --- |
| **Propaganda-Flut** | Verkürzt für 3,2 Sekunden die wirksame Lenkvorausschau aller Bots. |
| **Rote Akte** | Verlangsamt den nächsten Bot für 3,2 Sekunden durch eine „Sonderprüfung“. |
| **Heldenstatue** | Stellt hinter dem Spieler für neun Sekunden ein kollidierendes Hindernis auf. |
| **Zensurbalken** | Beeinträchtigt die Bot-Vorausschau stärker für 4,5 Sekunden, ohne die Straße des Spielers zu verdecken. |
| **Geheimpolizei** | Verfolgt als zielsuchendes Geschoss den nächsten Gegner und verlangsamt ihn bei Treffer. |
| **Fünfjahresplan** | Gewährt zuerst einen kurzen Boost; danach bleibt Gas nutzbar, leistet aber 3,8 Sekunden weniger. |
| **Dienstweg-Rakete** | Fliegt geradlinig, lebt höchstens fünf Sekunden und trifft höchstens einen Bot. |
| **Diplomatische Immunität** | Hält acht Sekunden oder bis zum ersten abgefangenen Angriff. Ein sichtbares Siegel zeigt den Schutz an. |

## Gemeinsame Trefferlogik

Geradlinige und zielsuchende Geschosse laufen durch dieselbe Projektilaktualisierung und werden nach einem Treffer unmittelbar entfernt. Bots erhalten denselben zeitlich begrenzten Verlangsamungszustand und können Treffer während aktiver Diplomatischer Immunität abwehren. Gegnerische Angriffe entstehen aus tatsächlich aufgenommenen Items statt aus einem festen globalen Raketen-Timer. Streckenwände und Begrenzungen bleiben davon unberührt.

## Bedienung und Rückmeldung

- `E`: gehaltenes Item einsetzen
- obere rechte Anzeige: Itemname, Symbol und Bedienhinweis
- mittige Meldung: Aufnahme, Einsatz, Warnung, Treffer oder Abwehr
- separates Siegel: aktive Diplomatische Immunität

## Verifiziert

- TypeScript-Prüfung, ESLint und Produktions-Build sind erfolgreich.
- Laufzeit- und Sichtprüfung dieses neuen Systems steht aus, solange die Browsersteuerung durch das App-Nutzungslimit gesperrt ist.

## Noch offen

- Partikel aus Papierzetteln, Stempelstaub und Papierkonfetti
- akustische Ankündigungen und Einsatzgeräusche
- positionsabhängige statt deterministisch rotierende Itemverteilung
- Sicht- und Balanceprüfung der Bot-Aufnahme sowie ihrer taktischen Einsätze im Browser
- kombinierte Abnahme aller acht Items im echten Rennen
