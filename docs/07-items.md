# Items

## Integrierter Stand

Das Rennen besitzt neun einsammelbare Items. Gold-türkise Versorgungskisten stehen entlang der vollständigen Runde, verschwinden nach der Aufnahme und erscheinen nach sieben Sekunden erneut. Spieler und Bots halten jeweils höchstens ein Item; der Spieler setzt es mit `E` ein, Bots wählen den Einsatz nach Itemtyp, Distanz, Ausrichtung und Haltezeit. Die Spieler-Itemverteilung berücksichtigt außerdem die Platzierung: Führende erhalten häufiger defensive oder kontrollierende Items, Rückliegende häufiger offensive Aufholhilfen. Die Gewichtung ist begrenzt und ersetzt keine Kiste durch ein garantiertes Item.

| Item | Integrierte Wirkung |
| --- | --- |
| **Propaganda-Flut** | Beeinträchtigt die Bot-Lenkvorausschau 3,2 Sekunden und legt bei betroffenen lokalen Spielern mehrere animierte Flugblätter ins Sichtfeld; der Auslöser bleibt vom Overlay verschont. |
| **Rote Akte** | Trifft einen zufällig ausgewählten Gegner und verlangsamt ihn 3,2 Sekunden. |
| **Heldenstatue** | Stellt eine mehrteilige Diktatorenstatue mit Uniform, Schirmmütze, Schärpe und Schnurrbart als Hindernis für neun Sekunden auf. |
| **Zensurbalken** | Beeinträchtigt Gegner 4,5 Sekunden; beim Spieler wird zusätzlich ein breiter schwarzer Sichtbalken eingeblendet. |
| **Geheimpolizei** | Zielsuchendes Geschoss; jeder getroffene Gegner, auch der Spieler, dreht sich einmal und wird danach etwa 4 Sekunden verlangsamt. |
| **Fünfjahresplan** | Gewährt 3,8 Sekunden einen deutlichen Boost; danach ist die Motorleistung weitere 3,8 Sekunden reduziert. |
| **Dienstweg-Rakete** | Sucht automatisch den aktuell führenden Gegner und verfolgt ihn als Geschoss. |
| **Diplomatische Immunität** | Hält acht Sekunden oder bis zum ersten abgefangenen Angriff. Ein sichtbares Siegel zeigt den Schutz an. |
| **Gefälschtes Wahlergebnis** | Gewährt dem Auslöser 8 Sekunden starken Boost und Schutz vor Angriffen. |

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
- Sicht- und Balanceprüfung der Bot-Aufnahme sowie ihrer taktischen Einsätze im Browser
- kombinierte Abnahme aller acht Items im echten Rennen
