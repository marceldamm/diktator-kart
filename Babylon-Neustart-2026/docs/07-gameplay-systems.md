# Gameplay-Systeme und Zuständigkeiten

## Rennzustände

Vorgesehene Zustände: Menü, Laden, Einführung, Countdown, Rennen, Pause, Zieleinlauf, Siegerehrung, Rennbericht. Jeder Zustand hat klare Ein-/Austrittsregeln und räumt temporäre Ressourcen auf.

## Fahrmodell

Das Fahrmodell soll Arcade-Charakter behalten, aber Gewicht, Grip, Federung, Drift, Sprung und Kontakt zum Boden glaubwürdig spürbar machen. Ziel ist ungefähr 6/10 Realismus. Kleine Steine, Bordsteinkanten und unterschiedliche Untergründe dürfen Räder und Kartkörper sichtbar reagieren lassen. Spieler und Bots verwenden dieselben grundlegenden Fahrregeln. Bot-Persönlichkeit beeinflusst Entscheidungen, nicht heimliche Beschleunigungs- oder Gripvorteile.

Fahrprofile dürfen sich leicht unterscheiden. Schäden sind überwiegend kosmetisch, können aber bei betroffenen Reifen oder bestimmten Kollisionen kurzzeitig die Lenkung verändern. Die Schadenslogik braucht Stufen, Limits und klare Rückmeldung statt dauerhafter Zerstörung.

## Strecke

Streckendaten beschreiben mindestens:

- Rennroute und Checkpoints
- sichere Route und Abkürzung
- Fahrbahnrand und Recovery-Zonen
- Kollisionskörper und reine Dekoration
- Landmarken und Sichtachsen
- Rundenereignisse und Zustandswechsel

## Items und Feedback

Jedes Item erhält eine Datenbeschreibung mit Auslöser, Ziel, Dauer, Begrenzung, Gegenmaßnahme, visueller Wirkung, Audio, UI und Botübersetzung. Dienstweg-Rakete und Diplomatische Immunität sind die ersten verbindlichen Kandidaten aus dem Altbrief. Schutzlogik und Trefferlogik werden gemeinsam entworfen, damit Gegenmaßnahmen konsistent bleiben.

## Bots

Bots brauchen eine begrenzte Vorausschau, Streckenwissen, Recovery und nachvollziehbare Entscheidungen. Täuschungs- und Sichtitems dürfen Bots kurz beeinflussen, aber keine absichtlichen Dauerkollisionen erzeugen. Jeder Bot muss ein Rennen beenden können.

## Audio und Sprecherin

Audio reagiert auf Geschwindigkeit, Belastung, Untergrund, Drift, Item, Schaden, Wetter und Weltreaktion. Jede Strecke erhält eine eigene Musikidentität. Die Sprecherin ist ereignisgesteuert und präsentiert die Diktatoren nicht als Selbstkritiker; sie verkauft den Rennsieg im Stil einer übertriebenen offiziellen Erfolgsmeldung. Satire entsteht aus Überhöhung, Widerspruch und propagandistischer Sprache, nicht aus einem dauernden Verspotten der Fahrer. Untertitel und separate Lautstärkeeinstellungen bleiben erforderlich.

## UI und Datenwahrheit

Das HUD zeigt Runde, Position, Zeit, Item, Warnungen und gegebenenfalls Untertitel. Satirische Anzeigen dürfen den Ton des Spiels verfremden, aber niemals das tatsächliche Ranking oder Ergebnis ersetzen.

## Abnahme eines Systems

Ein System gilt erst als bereit, wenn es im normalen Rennen, bei Pause, nach Neustart, nach Menü-Rückkehr und in einer reduzierten Qualitätsstufe geprüft wurde. Code allein und ein Dokumenteintrag reichen nicht.
