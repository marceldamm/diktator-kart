# Benutzeroberfläche, Einstellungen und lokale Speicherung

## Grundsatz

Das Spiel muss vom Start bis zum Rennen ohne Entwicklerkonsole verständlich bedienbar sein. UI ist kein nachträglicher Aufsatz, sondern Teil der Spielbarkeit und der satirischen Präsentation.

## Pflichtablauf

Start/Launcher → Hauptmenü → Spielmodus → Fahrer/Kart → Strecke → Ladephase → Countdown → Rennen → Ergebnis/Siegerehrung → Revanche oder Menü.

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

Mobile Geräte bekommen keine verkleinerte Desktop-Bedienung, sondern eine eigene Eingabeebene: große Touchflächen für Gas, Bremse/Rückwärtsfahrt, Lenkung, Hop/Drift und Item. UI-Elemente müssen Notch, Hoch-/Querformatentscheidung und kleine Displays berücksichtigen. Die endgültige Mobile-Steuerung wird nach dem Tastaturprototyp getestet, aber die Architektur darf sie nicht verbauen.
