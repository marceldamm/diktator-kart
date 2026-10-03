# Benutzeroberfläche, Einstellungen und lokale Speicherung

## Grundsatz

Das Spiel muss vom Start bis zum Rennen ohne Entwicklerkonsole verständlich bedienbar sein. UI ist kein nachträglicher Aufsatz, sondern Teil der Spielbarkeit und der satirischen Präsentation.

## Pflichtablauf

Start/Launcher → Hauptmenü → Spielmodus → Fahrer/Kart → Strecke → Ladephase → Countdown → Rennen → Ergebnis/Siegerehrung → Revanche oder Menü.

M1 enthält davon nur den lokalen Launcher, die Lade-/Fehleranzeige, Pause, Neustart und Diagnose der Technikszene. Menü, Einstellungen, Speicherung und Renn-HUD sind noch nicht implementiert; die Pflichtliste bleibt bestehen.

M2l ergänzt die F3-Technikdiagnose um scrollbare Frame-Perzentile/Langframes, Auflösung und verfügbaren Renderer für Geräteproben. Das ist ein Entwickler-/Fahrtestpanel, noch kein Einstellungsmenü oder fertiges Renn-HUD.

Während des Rennens: Pause, Neustart, Audio-/Grafikzugriff, Steuerungshinweis und verständliche Rückkehrwege.

## Einstellungsbereiche

- Masterlautstärke
- Musiklautstärke
- Effektlautstärke
- Sprecher-/Stimmenlautstärke
- Grafikqualität: niedrig, mittel, hoch; später optional benutzerdefiniert
- Auflösung oder dynamische Auflösung, sofern sinnvoll
- reduzierte Effekte
- reduzierte Kamerabewegung
- Steuerungsübersicht und Tastaturbelegung
- Kameraauswahl: Verfolger nah, Verfolger fern, Fahrerperspektive; separate Umschaltaktion und gespeicherte Präferenz
- separate Eingabe für die persönliche Spezialfähigkeit und HUD für Bereitschaft, aktive Wirkung und verbleibende feste Abklingzeit
- später Gamepad- und Mobile-Steuerung

Grafikeinstellungen sind für den Prototyp nicht wichtiger als das Fahrgefühl, aber sie gehören in das Grundgerüst, weil normale PCs und Mobilgeräte unterschiedliche Budgets haben.

## Lokale Speicherung

Pro Gerät/Browser werden mindestens gespeichert:

- Audio- und Grafikpräferenzen
- Steuerungspräferenzen
- reduzierte-Effekte- und Kameraoptionen
- Bestzeiten und freigeschaltete lokale Auszeichnungen, sobald vorhanden
- kompatible Versionskennung für gespeicherte Daten

Speicherfehler dürfen das Rennen nicht unspielbar machen. Es gibt Standardwerte, eine sichtbare Diagnose und eine Möglichkeit zum Zurücksetzen. Es werden keine unnötigen persönlichen Daten gespeichert.

## Mobile UI

Android und iPhone verwenden Querformat mit einer eigenen Eingabeebene: große Touchflächen für Gas, Bremse/Rückwärtsfahrt, Lenkung, Hop/Drift, Item, Spezialfähigkeit und Kamerawechsel. UI-Elemente berücksichtigen Notch und kleine Displays. Die endgültige Touch-Anordnung wird nach dem Tastaturprototyp getestet; Rennregeln bleiben identisch, Grafik wird reduziert beziehungsweise skaliert. Das benannte iPhone 15 Pro ist ein Testgerät, kein bereits geprüfter Mindeststandard.
