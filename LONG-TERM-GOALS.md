# Langfristige Arbeitsliste – Diktator Kart

**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

Gemeinsamer Überblick für Marcel, Sarah und jede KI-Sitzung. Die kurzfristige [Aktuelle Arbeitsliste](CURRENT-WORKLIST.md) führt die laufende Umsetzung; diese Liste hält das Gesamtziel und die nächste sinnvolle Ausbaustufe sichtbar. Verbindliche Detailentscheidungen stehen in den verlinkten Fachdateien. Historische Zwischeneinträge sind keine aktuellen Arbeitsaufträge.

## So arbeiten wir damit

- Bei Projektstart nach Git-Synchronisierung CURRENT-WORKLIST.md, diese Liste, den kurzen [Änderungsverlauf](TEAM-CHANGES.md) und offene [Teamnotizen](TEAM-NOTES.md) lesen.
- Neue Beobachtungen und konkrete Fehler zuerst in CURRENT-WORKLIST.md aufnehmen. Größere Zukunftsideen hier als Ziel oder Vorschlag festhalten.
- Nach Abschluss der aktuellen Liste zwei oder drei passende nächste Pakete aus dieser Liste vorschlagen; ausdrücklich bereits beauftragte Ziele selbstständig fortsetzen. Neue Produktziele brauchen eine bewusste Priorisierung, keine heimliche Umfangserweiterung.
- Ein gewähltes Paket mit sichtbarem Ergebnis und prüfbarer Abnahme nach CURRENT-WORKLIST.md übernehmen. Erst nach tatsächlicher Prüfung abhaken. Teilumsetzung, Nutzerabnahme und Geräteabnahme auseinanderhalten.
- Details nicht mehrfach pflegen: Roadmap = Meilenstein-/Abnahmevertrag; diese Datei = gemeinsame Aufgabenübersicht; PROGRESS-LOG.md = technische Belege; TEAM-CHANGES.md = wenige wichtige Änderungen für uns beide.

## Leitbild und feste Grundlage

- [x] Babylon.js als aktive Engine; gemeinsamer neuer Hauptstand und sichere Git-Start-/Abschlussbefehle vorhanden.
- [ ] Ein überzeugendes, tatsächlich spielbares satirisches Kartspiel mit deutlich höherer Grafikqualität erreichen. Maßstab: Projektbilder G–L, insbesondere echte Fahrt statt Konzeptillustrationen.
- [ ] Realitätsnahe, eindeutig erkennbare Modelle echter historischer Fahrer und glaubwürdige Berlin-/Stadionwelt ausarbeiten. Neue Präzisierung vom 03.10.2026 ersetzt erfundene Ersatzpersonen als Endziel.
- [ ] Macht, Personenkult, Bürokratie und Diktatoren kritisch und humorvoll inszenieren; keine verherrlichenden Regimezeichen.
- [ ] Ausschließlich kostenlose/vorhandene Werkzeuge und rechtlich nachvollziehbare Assets einsetzen; editierbare Modell-/Audio-/Texturquellen und Herkunft erhalten.
- [ ] Sarahs ursprüngliche Ideen nachvollziehbar bewahren; ihre Änderungen als Vorschlag mit Begründung, gemeinsame Bestätigung vor dauernder Umdeutung.
- [ ] Zunächst privat für uns/Freunde, spätere öffentliche Version kostenlos; keine Käufe, Zusatzabonnements oder automatisch aktivierten Kontingente.

## M2 – Fahrgefühl und technische Grundlage vollständig abnehmen

Vorhanden: sechs Karts, Federung, Hop/Drift/Turbo, Kontakte und drei Kameras. Neu: Renderinterpolation; Marcel meldet deutlich flüssigere Fahrt. Details: [03](docs/03-technology-babylon.md), [04](docs/04-performance.md), [07](docs/07-gameplay-systems.md).

- [ ] Menschlichen Fahrcheck nach allen aktuellen Korrekturen abschließen: Lenkung, enger/weiter Drift, Gegenlenken, Turbo, Bremsen/Rückwärtsfahrt, Hop/Landung, Wand-/Kartkontakte.
- [ ] Nah-/Fernkamera und Fahrerperspektive unter Fahrt, Sprüngen und Kontakten komfortabel abstimmen; Maus nur bei bewusster Geste, Cursorfreigabe zuverlässig.
- [ ] Rückwärtsgeschwindigkeit als vorgemerkten Balancewunsch später prüfen.
- [ ] Verbleibende GPU-/Bildzeitruckler getrennt von behobener Positionsquantisierung untersuchen; keine RTX-Messung als schwache-PC-Abnahme.
- [ ] Modell-/Browserregressionen für gemeinsame Fahrregeln und verlässliche Pause/Neustarts erhalten.

## M3 – Sichtbarer Qualitätssprung im fahrenden Spiel

Vorhanden: editierbare Retro-Karts, vollständiger Stadionring, Materialien, Architektur, Licht und vorläufige Fahrer. Ziel deutlich höher. Details: [02](docs/02-art-direction.md), [05](docs/05-assets-and-visual-references.md), [14](docs/14-character-and-item-catalog.md), [16](docs/16-production-blueprint.md).

- [ ] Zuerst einen Fahrer samt Kart als ausgearbeiteten Qualitätsanker liefern; aktuelle Priorität aus Marcels Auftrag: erkennbarer Hitler. Mussolini-Pilot war ein früherer Vorschlag, keine Pflicht vor dieser Präzisierung.
- [ ] Gesicht, Anatomie, Haare, Augen, Kleidung und Stoff-/Hautmaterialien realitätsnah ausarbeiten; benannte reale Person erkennbar, kein bloß umbenannter Platzhalter.
- [ ] Fünf weitere Startfahrer: Stalin, Mussolini, Mao, Kim Jong-un und Castro. Anfangs einfacher, aber individuell erkennbar; anschließend auf denselben Qualitätsmaßstab bringen.
- [ ] Kartformen individuell gestalten, sichtbare Bauteile/Federung/Räder und differenzierte Materialien verbessern; Artmodelle bleiben editierbar.
- [ ] Fahreranimation: Hände/Lenkrad, Kopf/Blick, Bremsen, Drift, Hop/Landung, Turbo, Kontakt und Rennenende; kleine Reaktionen statt unruhigem Dauerschütteln.
- [ ] Fahrerperspektive mit plausibler Augenhöhe, Händen, Instrumenten, Haube und Vorderrädern ausarbeiten; keine störende doppelte Außenkarosse.
- [ ] Berlin-/Stadionwelt glaubwürdiger gestalten: abwechslungsreiche Fassaden, Dächer, Straßendetails, räumliche Tiefe, erkennbare Blickpunkte und historische Atmosphäre.
- [ ] Weniger repetitive Module; gealterte Materialien, Fenster/Innenraumtiefe, Straßenmöbel und lesbare Straßenschilder.
- [ ] Mehr thematische, kritische Satire und wiedererkennbare Alltagsdetails; eigenständiger Adler ohne verbotene Regimesymbolik als aktueller Auftrag in CURRENT-WORKLIST.md.
- [ ] Licht/Schatten/Reflexionen und zurückhaltende Effekte anhand Laufzeitbildern gegen G–L abstimmen; Bildqualität bei Fahrt bewerten.
- [ ] Staub, Driftfunken, Turbofeuer, Reifenspuren, Treffer-/Landungswolken begrenzt und skalierbar verbessern.
- [ ] Zuschauer, Streckenleben und Siegesreaktionen lebendiger gestalten; Pool-/LOD-Budget einhalten.
- [ ] Gemeinsame visuelle Abnahme durch Marcel/Sarah anhand aller drei Spielkameras; Konzeptbilder ergänzen diese Prüfung nur.

## M4 – Zuverlässiges Kernrennen

Vorhanden: 593-m-Rundkurs, fünf Bots, drei Runden, Rang, Ziel, Revanche, Rücksetzung und drei Start-Items. Details: [01](docs/01-game-design.md), [07](docs/07-gameplay-systems.md), [09](docs/09-roadmap.md), [15](docs/15-item-feasibility-and-production.md).

- [ ] Streckenführung abwechslungsreicher und lesbarer machen, Kurven-/Bremsrhythmus, Abkürzungen und Risk/Reward ausarbeiten.
- [ ] Botlinien, Überholen, Hindernis-/Kontaktverhalten, Drift und Recovery verbessern; leicht/mittel/schwer und Persönlichkeiten sichtbar unterscheiden.
- [ ] Vollständige Rennen wiederholt prüfen: faire Rang-/Rundenlogik, alle Zieleinläufe, Resultate, Revanche und Reset ohne Ressourcenwachstum.
- [ ] Items gleich fair für Mensch/Bot: Projektil, Verfolger und Falle mit gleicher Grundwirkung; individuelle Modelle/Sounds je Fahrer.
- [ ] Schäferhund als Spieler-Projektil-/Verfolgerdarstellung mit Laufanimation, Bellen und Comic-Trefferwolke – aktuelles Paket in CURRENT-WORKLIST.md.
- [ ] Aufholhilfe nur über nachvollziehbare Itemchancen; keine heimlichen Geschwindigkeitsboni.
- [ ] Trefferketten vermeiden, kurze lesbare Tempoverluste statt langer Kontrollentziehung; Rücksetzung mit gemeinsamen Regeln/Zeitverlust.

## M5 – Fähigkeiten, Audio, Schäden und Atmosphäre

Details: [07](docs/07-gameplay-systems.md), [13](docs/13-world-and-content-boundaries.md), [14](docs/14-character-and-item-catalog.md), [15](docs/15-item-feasibility-and-production.md).

- [ ] Persönliche Fähigkeiten mit eigener Eingabe und festen Abklingzeiten; keine fahrleistungsabhängige Pflicht-Aufladung. Konkrete Balance noch abstimmen.
- [ ] Sarahs gemeldete Panzerverwandlung und weitere belegte Alt-Fähigkeiten/Itemideen bewahren und in neuer Engine ausarbeiten; Panzer zuerst laut CURRENT-WORKLIST.md. Keine alten Bot-Tempoprämien übernehmen. Quellen und Abweichungen: [Altstand-Abgleich](docs/sarah-feature-audit.md).
- [ ] Gestufte sichtbare Schäden: Spiegel, Auspuff, Abdeckungen, Ruß/Rauch/Funken; keine explizite Gore-Darstellung, Fahrbeeinträchtigungen zeitlich begrenzen.
- [ ] Lokale Weltreaktionen und thematische Wettervarianten prüfen: Regen/nasse Fahrbahn zuerst als Produktionswunsch, später Schnee/Eis/Blätter nach Priorisierung.
- [ ] Aussprache aller gesprochenen Texte überprüfen, merkwürdige Wörter beheben; freundlichere lebendigere Stadionsprecherin, weniger mechanische Wirkung.
- [ ] F als individuelle Sprachhupe; kurze Clips/Abklingzeit. Echte unproblematische historische Mitschnitte nur mit belegter Quelle/Identität/Nutzungsrecht.
- [ ] Eigenständige Parodiestimmen und historische Musik mit nachvollziehbaren Quellen; keine ungekennzeichneten erfundenen „Originalzitate“.
- [ ] Motor-/Getriebe-/Reifen-/Kontakt-/Umgebungsgeräusche und Mix hörbar abstimmen; Ansagen priorisieren, Lärm/Dopplungen begrenzen.
- [ ] Weitere Altitems/Fähigkeiten aus dem Katalog nur nach Umfangsentscheidung übernehmen; Herkunft und Sarah-Freigaben erhalten.

## M6 – Vollständiger Singleplayer

- [ ] Fahrer-/Kartwahl, Menü, HUD, Optionen, Tutorial und Startablauf auf einen gemeinsamen Qualitätsstand bringen.
- [ ] Verständliche deutsche Bedienung und Statusmeldungen; Diagnose bleibt optional, keine technischen Interna als normaler Spielerablauf.
- [ ] Alle sechs Fahrer und erste historische Strecke mit Material-/Animations-/Audioqualität fertigstellen.
- [ ] Siegerehrung, Ergebnis-/Rennbericht und Revanche ausarbeiten.
- [ ] Lokale Einstellungen, Kameraruhe, reduzierte Effekte, Ton/Musik und Lade-/Fehlerzustände zuverlässig erhalten.
- [ ] Wiederholbare Rennen und Kaltstarts; gemeinsame Inhalts-/Stil-/Hörabnahme dokumentieren.

## M7 – Geräte, Leistung und Auslieferung

Details: [04](docs/04-performance.md), [19](docs/19-ui-settings-and-save.md).

- [ ] Normale/schwache PCs benennen und messen: vorläufig Standard 60 FPS, schwächer stabile 30 FPS; Ziele nicht stillschweigend senken.
- [ ] Android und iPhone im Querformat mit Touch prüfen; iPhone 15 Pro benannt, Sarahs/Android-Gerät noch offen.
- [ ] LOD, Instancing, Drawcalls, Schatten, Textur-/Modellgrößen, Ladegruppen und Speicher nach echten Engpässen optimieren.
- [ ] Wiederholte Neustarts/Rennen, Tabwechsel/Fokusverlust, Browserfallback und Fehlerwiederherstellung prüfen.
- [ ] Qualitätstufen bei gleichen Rennregeln; Warnungen/Items nicht nur über Farbe oder Ton erklären.
- [ ] Ein-Klick-Start auf beiden Rechnern und Git-Synchronisierung verlässlich erhalten; lokale Tooldownloads bleiben aus Git ausgeschlossen.

## M8 – Gemeinsam spielen und spätere Inhalte

Details: [06](docs/06-multiplayer.md), [09](docs/09-roadmap.md).

- [ ] Nach stabilem Singleplayer private Online-Lobbys per Einladung und Crossplay auf getrennten Geräten entwickeln.
- [ ] Kostenlos tragfähigen Betrieb, Synchronisierung, Reconnect, faire Regeln und Schutz vor Manipulation prüfen.
- [ ] Sechs Themenstrecken plus verbindende Strecke als langfristigen Umfang schrittweise priorisieren; keine pauschale Pflicht vor Multiplayer.
- [ ] Weitere historische Fahrer aus dem Zwölf-Figuren-Katalog erst nach Besetzungs-/Produktionspriorisierung.
- [ ] Geist/Ghost, Orden/Achievements und ausgebauter Fotomodus als spätere Vorschläge bewerten.
- [ ] Öffentliche kostenlose Veröffentlichung erst nach Geräte-, Inhalts-, Rechte- und Qualitätsprüfung vorbereiten.

## Zusammenarbeit dauerhaft verbessern

- [ ] Start-/Abschlussbefehle auf Sarahs realem Checkout einmal gemeinsam prüfen; ihre lokalen unveröffentlichten Dateien erhalten.
- [ ] Aufgabenpakete zwischen Marcel und Sarah absprechen; bei denselben Dateien Überschneidungen bewusst integrieren.
- [ ] Aktuelle CURRENT-WORKLIST.md, LONG-TERM-GOALS.md und kurzer TEAM-CHANGES.md an jedem Start/Abschluss pflegen; keine alte Enginearbeit.
- [ ] Offizielle Fünf-Stunden-/Wochenlimits nach großen Paketen prüfen; bei ca. 15 % Rest geordnet abschließen, ca. 5 % für Nutzer übriglassen. Keine erfundenen Prozentwerte.
- [ ] Funktionierende lokale Checkpoints und geprüfter Teamabschluss nach main; kein Force-Push und kein blindes Verwerfen fremder Änderungen.
