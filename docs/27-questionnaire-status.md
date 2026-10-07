# Fragebogen-Ziele: Ist-Abgleich und Priorität

**Stand:** 07.10.2026 (Claude, nach dem Masterauftrag vom 06.10.2026). Grundlage: Marcels gesetzte Antworten in [PROJECT-QUESTIONNAIRE.md](../PROJECT-QUESTIONNAIRE.md), zusammengefasst in [docs/23](23-project-design-baseline.md) und im Masterauftrag. Der Fragebogen beweist keinen fertigen Stand; maßgeblich sind Code und Laufzeitbelege. Sarahs leere Antwortkästchen bleiben unbeantwortet.

Status: **umgesetzt** (im Spiel und geprüft) · **teilweise** · **ungeprüft** (gebaut, ohne passende Abnahme) · **offen** · **blockiert**.

| Ziel (Fragebogen/Basis) | Status | Beleg / Lücke | Nächster prüfbarer Schritt |
|---|---|---|---|
| Einzelspieler-Grand-Prix zuerst, 10–15 min, zusammenhängende Veranstaltung | **umgesetzt** (zwei Strecken) | Großer Preis der Eitelkeit: Stadionring → Duce-Drom, Punkte, Zwischen-/Gesamtwertung, Einleitungen; Demo-Lauf ca. 5 + 4,5 min Fahrzeit (`docs/evidence/gp-*-20261007.png`) | Menschlicher GP-Durchlauf; dritte Strecke ergänzt die Dauer |
| Zeitfahren und freies Üben danach | **umgesetzt (07.10. im echten Lauf geprüft)** | Zeitfahren je Strecke mit Bestzeit, bester Runde, Geist und Geist-Abstand; freie Fahrt auf geladener Strecke | Menschlicher Zeitfahrtest mit gespeichertem Geist |
| Inhalte von Beginn an verfügbar | **umgesetzt** | Keine Freischaltungen; beide Strecken, alle Fahrer sofort | – |
| Bots fahren persönlich und aktiv nach fairen Regeln | **teilweise** | Rivalenstile (Linie, Drift/Haftung, Abkürzung, Überholdrang, Item-Geduld) ohne Tempobonus; Grundtempo unterscheidet sich weiter leicht nach Startplatz (Altbestand) | Grundtempo bewusst entscheiden; Reaktionen/Sprüche je Stil |
| Fahrfehler: kurzer lesbarer Nachteil mit Comeback | **teilweise** | Bergungsamt, Krater, Schaden/Werkstatt, Windschatten, Rang-abhängige Items | Menschliche Balanceprobe |
| Eigene Eitelkeit/Reaktionen je Figur | **teilweise** | Rufe, Hupe, Rivalenstil; Fähigkeiten für Hitler, Kim und neu Castro („Blockade“: zwei Paragraphenschranken mit den Item-Fallenregeln, Bot nur bei Gegner dicht dahinter) und Mussolini („Große Pose“: Kinn hoch bei halbem Gas, dann Pflichtapplaus-Schub und kurzer Itemschutz, gleiche Regel für Bots) | Stalin („Große Säuberung“) und Mao („Kulturrevolution“) beziehen sich auf reale Massenverbrechen: vor dem Bau gemeinsam entscheiden, wie die Satire Täter statt Opfer trifft |
| Realitätsnahe, erwachsene Figuren; Hitler-Anker zuerst | **teilweise** | Prozedurale Karikatur-Zwischenstufe (siehe CURRENT-WORKLIST) | Skulptur/lizenzierte Basismesh, dann übrige fünf |
| Karts: gemeinsame Basis, klassische 1920/30er-Silhouetten | **teilweise** | Sieben Karosserievarianten im Kit | Silhouetten je Fahrer schärfen |
| Reifen je Kart, frei zwischen Karts wählbar | **umgesetzt** | Sechs Radsätze (Paradeweißwand, Staatsradkappe, Corsa-Speiche, Volksstahlscheibe, Raketennabe, Guerilla-Stollen) in `build_kart.py`; Wahl in der Fahrerwahl (◀ ▶, lokal gespeichert), im Chrome umgeschaltet | Nahansicht/Stilprobe |
| Schaden gestuft bis Teileverlust/Ausfall/Reparatur | **teilweise** | Haltbarkeit, Totalschaden, Werkstatt; sichtbare Teileverluste fehlen | Teileverlust an Kotflügel/Scheinwerfer |
| Welt: eigenständiges Berlin + eigene Ortsidentität je Strecke | **umgesetzt** (drei Orte: Berlin, Rom-Marmorstadion, Havanna) | Stadionring Berlin; Duce-Drom Rom mit eigenen Modulen | Menschliche Stilabnahme; Innenräume/Fenstertiefe |
| Warme Spätnachmittagsstimmung | **umgesetzt** (Standard) | Wetter/Tageszeit-Optionen vorhanden | – |
| Pflaster detailliert, aber ruhig | **ungeprüft** | Gemeinsame Kopfsteinpflastertextur | Menschliche Bewegungsabnahme |
| Partikel im Moment sichtbar, rasch weg | **ungeprüft** | Staub/Wasser/Funken begrenzt | Gezielte Kontaktaufnahmen |
| Konzeptblätter (Hero, Front, Seite, Heck, Detail) | **offen** | Nur Ladebild-Konzept | Konzeptblatt Hitler-Kart |
| Audio: Motor/Reifen/Untergrund/Treffer klar, ohne Übersteuerung | **ungeprüft** | Synthetischer Motor, Untergrundklänge | Hörabnahme durch Marcel |
| Professionelle Stadionsprecherin, Marsch | **teilweise** | Piper-Sprecherin, eigener Marsch | Hörabnahme; Ansagen für Grand-Prix-Wertung |
| Figurenstimmen nur aus geklärten Aufnahmen | **blockiert** | Keine Aufnahmen mit geklärten Rechten | Rechteklärung durch Marcel |
| Desktop/Laptop inkl. integrierter Grafik, stabile 60 FPS | **offen** | RTX-3070-Demo ca. 50–57 FPS im Rennen (Duce-Drom), Intel UHD ca. 14 FPS (Issue #4) | Kontrollierte M7-Messung beider Strecken |
| Automatische Grafikabstimmung + manueller Regler | **umgesetzt (Startwert)** | Ohne gespeicherte Wahl wählt der Median der ersten Menüsekunden Basis/Standard/Hoch (`src/auto-quality.ts`); RTX 3070: „Standard (Median 18,1 ms)“. Manueller Regler bleibt maßgeblich | Auf Intel UHD prüfen, ob „Basis“ greift |
| Tastatur + Gamepad, Tasten neu belegbar | **teilweise** | Zehn Fahraktionen in den Optionen neu belegbar (lokal gespeichert, im Chrome geprüft, `docs/evidence/options-keymap-20261007.png`); Gamepad-Standardbelegung mit analoger Lenkung/Gas eingebaut, aber **ohne echtes Gamepad ungeprüft** | Test mit einem echten Xbox-/PlayStation-Controller |
| Offline, lokale Einstellungen/Bestzeiten/Fortschritt | **umgesetzt** | localStorage, je Strecke | – |
| Skalierbare UI, Untertitel, Kontraste, reduzierte Bewegung | **teilweise** | Reduzierte Bewegung, Kontraste; Untertitel fehlen | Untertitel für Ansagen |
| Verständliche Fehler mit Wiederholung/Diagnose | **umgesetzt** | Ladefehler mit Wiederholen, Diagnosepanel | – |
| Blender-Quellen und Laufzeitmodelle gemeinsam versioniert | **umgesetzt** | Rom-Module als Python-Quelle + `.blend` + GLB | – |
| Mehrspieler später | **offen (bewusst später)** | – | – |

**Empfohlene Reihenfolge danach:** (1) M7-Messung beider Strecken inkl. Intel UHD, (2) Gamepad-Praxistest, (3) Fähigkeiten der übrigen vier Fahrer, (4) dritte Strecke aus Sarahs Liste, (5) Reifenauswahl.
