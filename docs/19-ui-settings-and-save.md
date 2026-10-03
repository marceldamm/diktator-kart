# Benutzeroberfläche, Einstellungen und lokale Speicherung

## Früher Start ohne weißen HTML-Blitz – 03.10.2026

Die Ladeoberfläche und deren Grundlayout stehen direkt in index.html, vor dem Babylon-Modul und dessen CSS. Andere Spiel-HTML wird bis zur Szenenbereitschaft verborgen. Konzeptmotiv mit dunklem Verlauf und editierbarer HTML-Typografie, responsiv und mit reduzierter Bewegung. Balken zählt sechs tatsächlich abgeschlossene Abschnitte (Engine/Manifest, Welt, Bäume, Karts, Items, Szenenbereitschaft/erstes Bild), keine geschätzten Downloadprozente. Techniklabor besitzt nur zwei Abschnitte. Bei Modul-/Assetstartfehlern bleiben Fehlermeldung, optionale Fehlerdetails und Erneut laden verfügbar; bei längerem Start nach 45 s Hinweis/Wiederholen, ohne künstlichen Abbruch oder gefälschten Fortschritt. Browserprobe des Produktionsbuilds einschließlich Neustart und Rückkehr zum echten 3D-Menü in docs/evidence/loading-browser-check.json.

## Aktueller Slice-Ablauf – 03.10.2026

Die Standardansicht hat einen echten 3D-Menühintergrund, Rennen/freie Fahrt, Ladephase, Countdown, drei Runden, HUD/Minikarte/Itemslot, Pause, Ergebnis mit Rundenzeiten/Zielstand und Revanche/Menü. Esc pausiert ein laufendes Rennen im Menü. Ton, Musiklautstärke, Basis-/Standardgrafik, reduzierte Effekte und ruhige Kamera werden lokal gespeichert; echte menschliche Zielzeiten als Streckenbestzeit. Demonstrationsfahrten schreiben keine Bestzeit. Mehrfinger-Touch ist in Chrome emuliert geprüft, nicht auf Handy abgenommen. Fahrer-/Streckenauswahl, vollständige Lautstärkemixer, persönliche Fähigkeiten, Stimmen, Gamepad und Siegertheater fehlen weiterhin. Historische M1/M2-Einträge darunter beschreiben ihre damaligen Stände.

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
