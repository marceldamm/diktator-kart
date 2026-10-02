# Gameplay-Systeme und Zuständigkeiten

## Rennzustände

Vorgesehene Zustände: Menü, Laden, Einführung, Countdown, Rennen, Pause, Zieleinlauf, Siegerehrung, Rennbericht. Jeder Zustand hat klare Ein-/Austrittsregeln und räumt temporäre Ressourcen auf.

## Fahrmodell

Das Fahrmodell soll Arcade-Charakter behalten, aber Gewicht, Grip, Federung, Drift, Sprung und Kontakt zum Boden glaubwürdig spürbar machen. Ziel ist ungefähr 6/10 Realismus. Kleine Steine, Bordsteinkanten und unterschiedliche Untergründe dürfen Räder und Kartkörper sichtbar reagieren lassen. Spieler und Bots verwenden dieselben grundlegenden Fahrregeln. Bot-Persönlichkeit beeinflusst Entscheidungen, nicht heimliche Beschleunigungs- oder Gripvorteile.

Fahrprofile dürfen sich leicht unterscheiden. Drift, Hop/Sprung und Mini-Turbo sind verbindlich; Federung, Bodenhaftung und Untergründe liefern den glaubwürdigen Eindruck. Optische Schäden können bis Rennende bleiben; betroffene Reifen oder bestimmte Kollisionen können die Lenkung kurzzeitig beeinträchtigen. Spielwirksame Nachteile enden zuverlässig, auch wenn das beschädigte Bauteil sichtbar bleibt.

Bei Festfahren ist eine Rücksetzung mit Zeitverlust erlaubt. Mensch und Bot nutzen dieselben Regeln; es gibt keinen geschenkten Checkpoint-Fortschritt. Rücksetzung ist eine offen erkennbare Hilfsfunktion, kein verdeckter Botvorteil.

## Strecke

Streckendaten beschreiben mindestens:

- Rennroute und Checkpoints
- sichere Route und Abkürzung
- Fahrbahnrand und Recovery-Zonen
- Kollisionskörper und reine Dekoration
- Landmarken und Sichtachsen
- Rundenereignisse und Zustandswechsel

## Items und Feedback

Jedes Item erhält eine Datenbeschreibung mit Auslöser, Ziel, Dauer, Begrenzung, Gegenmaßnahme, visueller Wirkung, Audio, UI und Botübersetzung. Das erste Set umfasst geradliniges Projektil, zielsuchendes Projektil und Falle. Die Wirkungen sind bei allen Fahrern gleich; Modelle, Sounds und Animationen wechseln. Weitere Altideen bleiben im Katalog erhalten.

Hintere Plätze erhalten maßvoll bessere Chancen auf hilfreiche Items; diese positionsabhängige Verteilung gilt für Menschen und Bots gleichermaßen. Keine heimlichen Geschwindigkeitsvorteile. Treffer verursachen kurze Rutscher/Tempoverluste mit Warnungen und Schutz gegen Trefferketten; vollständige Kontrollentziehung bleibt sparsam.

## Persönliche Spezialfähigkeiten – Entscheidung Punkt 10

- Eigene Taste beziehungsweise separate Eingabeaktion, unabhängig vom gehaltenen Item.
- Erneut verfügbar nach fester Abklingzeit; keine durch Fahrleistung aufzuladende Anzeige für den Start.
- Dauer und Wirkung sind je Fähigkeit fest definierbare Balancewerte. Konkrete Sekunden und Tastenbelegung sind noch offen; keine automatische Übernahme alter Werte.
- HUD zeigt bereit / aktiv / verbleibende Abklingzeit. Touch erhält eine eigene Schaltfläche; Bots verwenden dieselben Zustände und Zeiten.
- Abgeleitete Abnahme: kein erneuter Einsatz während der Sperre, korrekte Pause und Rücksetzung beim Rennneustart, lesbares Feedback in allen Kameramodi.
- Änderungen an Sarahs ursprünglichen Fähigkeiten oder Namen werden als Vorschlag dokumentiert und gemeinsam bestätigt.

## Bots

Bots brauchen eine begrenzte Vorausschau, Streckenwissen, Recovery und nachvollziehbare Entscheidungen. Täuschungs- und Sichtitems dürfen Bots kurz beeinflussen, aber keine absichtlichen Dauerkollisionen erzeugen. Jeder Bot muss ein Rennen beenden können.

## Audio und Sprecherin

Audio reagiert auf Geschwindigkeit, Belastung, Untergrund, Drift, Item, Schaden, Wetter und Weltreaktion. Jede Strecke erhält eine eigene Musikidentität. Die Sprecherin ist ereignisgesteuert und präsentiert die Diktatoren nicht als Selbstkritiker; sie verkauft den Rennsieg im Stil einer übertriebenen offiziellen Erfolgsmeldung. Satire entsteht aus Überhöhung, Widerspruch und propagandistischer Sprache, nicht aus einem dauernden Verspotten der Fahrer. Untertitel und separate Lautstärkeeinstellungen bleiben erforderlich.

## UI und Datenwahrheit

Das HUD zeigt Runde, Position, Zeit, Item, Warnungen und gegebenenfalls Untertitel. Satirische Anzeigen dürfen den Ton des Spiels verfremden, aber niemals das tatsächliche Ranking oder Ergebnis ersetzen.

## Abnahme eines Systems

Ein System gilt erst als bereit, wenn es im normalen Rennen, bei Pause, nach Neustart, nach Menü-Rückkehr und in einer reduzierten Qualitätsstufe geprüft wurde. Code allein und ein Dokumenteintrag reichen nicht.
