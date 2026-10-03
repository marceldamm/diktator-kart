# Diktator Kart – Hier starten

## Was du jetzt tun musst

1. Für den aktuellen Fahrtest unter Windows **`Diktator-Kart-starten.cmd` doppelklicken**. Beim ersten Mal benötigt `npm ci` Internetzugang. Das Konsolenfenster offen lassen; Google Chrome öffnet die Testszene automatisch. Zum Beenden **Strg+C** im Konsolenfenster drücken und die Windows-Rückfrage mit **J** beantworten.
2. Für die Weiterentwicklung das Projekt `D:\Diktator-Kart` in **Codex** öffnen und Branch **`babylon-neustart-2026`** prüfen.
3. Für M2 ein Sol-Modell mit hoher Denkintensität wählen und den Auftrag unten verwenden.

## Auftrag für den nächsten Arbeitslauf

```text
Arbeite im lokalen Projekt D:\Diktator-Kart auf dem Branch
babylon-neustart-2026. Lies AGENTS.md, README.md, docs/00-project-framework.md,
docs/16-production-blueprint.md, docs/17-progress-log.md und die für M2
benötigten Detaildokumente.

Ziel des nächsten Arbeitspakets M2-Abnahme: Fahre den unten beschriebenen
menschlichen Fahrcheck für Rand-, Hindernis- und Fahrzeugkontakt, Hop,
Drift, Mini-Turbo, Federung und alle drei Kameras, sobald ein Mensch am
Gerät steuern kann; erfinde kein Fahrgefühlurteil. Miss auf einem
normalen oder schwächeren PC beziehungsweise Mobilgerät, wenn eines
zugänglich ist. Bewerte danach die vorläufigen Kollisionsformen und
Kamerabewegungen; dokumentiere nötige Korrekturen als klar abgegrenzte
M2-Pakete. Die fünf automatisch bewegten Lastkarts sind noch keine
Rennbots. Übernimm keinen PlayCanvas-/Ammo-Code. Halte START-HERE.md und
docs/17-progress-log.md aktuell und berichte verifiziert, nicht
verifiziert, offen und nächsten Schritt.
```

## Wo stehen wir?

**Heute:** M1 geprüft; M2a–j liefern ein steuerbares Test-Kart mit Hop, Drift, Mini-Turbo, Federung, drei Kameras, fünf bewegten Lastkarts und vorläufigem Rand-, Hindernis- und Fahrzeugkontakt. Ein vollständiges Rennen existiert noch nicht.

**Aktueller Meilenstein:** M2 – Fahrprototyp.

**Direktes Ziel:** M2-Abnahmelücken: menschliches Fahrgefühl, Kamerakomfort, Kontaktreaktionen und normale/schwächere Hardware.

**M1-Abnahme:** Build erfolgreich; Testszene in Chrome sichtbar; WebGL2, Pause, Eingabeaktionen, Neustart, Fehler und Wiederherstellung geprüft. Ein-Klick-Starter startet Vite und öffnet Chrome.

**M2a-Zwischenstand:** Beschleunigung, Bremse, Rückwärtsfahrt, Lenkung und Ausrollen funktionieren als vorläufiges Modell. Chrome zeigt Kart und Testfläche; Browserinteraktionen, Pause und Neustart wurden geprüft. Drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen weiterhin.

**M2b-Zwischenstand:** Space-Hop, aufladbarer Drift und befristeter Mini-Turbo sind in Chrome sichtbar und mit Modell-/Browsertests geprüft. Die Werte sind vorläufig; M2 insgesamt ist noch nicht abgenommen.

**M2c–e-Zwischenstand:** Zwei markierte Bodenwellen, vier Radkontakte und eine gedämpfte Karosseriereaktion sind im Fahrmodell. Chrome zeigte nahe/ferne Verfolger- und Fahrerperspektive; letztere mit einfachen Händen, Lenkrad, Armaturen und Vorderrädern. Sechs einfache Karts fahren im Techniktest. Ein Headless-Vergleich von einem und sechs Fahrzeugen ergab 42/87 Meshes und in beiden Fällen 60 FPS bei 1280 × 800; das ist keine Zielhardware-Abnahme. Neun Modell-/Eingabetests, Build und Browserprobe bestanden.

**M2f-Teilstand:** Der Rand gibt nun einen kurzen Rückstoß, stoppt Drift/Turbo und lässt danach die Steuerung wieder frei. Zehn Modell-/Eingabetests, Build und Chrome-Randprobe bestanden. Fahrgefühl und echte Hardwareleistung sind offen.

**M2f-Messung:** Ein längerer automatisierter Headless-Chrome-Lauf auf der RTX 3070 Laptop GPU prüfte ein und sechs Karts in allen drei Kameras. Je 300 Frames: 16,7 ms Median, 16,8 ms P95, 16,9 ms P99; keine Browserausnahme und stabile Meshzahl nach Neustarts. Das ist ein Befund für das starke Entwicklungsgerät, kein Urteil zum Fahrgefühl oder zur Leistung auf normalem/schwachem PC und Mobilgeräten. Rohdaten: `docs/evidence/m2f-rtx-endurance.json`.

**M2g/h-Teilstand:** Ein markierter Block rechts der Geraden und Fahrzeug-zu-Fahrzeug-Kontakt verwenden vorläufige, reine Fahrmodellregeln. 14 Modell-/Eingabetests einschließlich einer 60-s-Sechs-Kart-Simulation, Build und Chrome-Probe mit getrennten Hindernis- und Gegenverkehrsfällen bestanden. Die erneute RTX-Lastprobe mit 44/89 Meshes für ein/sechs Karts ergab in allen sechs Fenstern 16,8 ms P95; ein Sechs-Kart-Fenster endete nach Kontakt bei 0 km/h. Das sind Technikbelege, keine Abnahme von Fahrgefühl, normaler/schwacher Hardware oder fertiger Kollisionsphysik. Rohdaten: `docs/evidence/m2g-rtx-endurance.json` und `docs/evidence/m2h-rtx-endurance.json`.

**M2i-Kompatibilitätsprobe:** `?fleet=1&webgl=1` startet die Testszene absichtlich mit WebGL1. Chrome zeigte auf derselben RTX 3070 GPU eine sichtbare Szene, 44 Meshes und eine fahrende Runde im kurzen Browsercheck. Das belegt den Engine-Pfad, nicht die Leistung oder Kompatibilität eines älteren Zielgeräts. Beleg: `docs/evidence/m2i-webgl1-chrome.png`.

**M2j-Kontaktkorrektur:** Eine 60-s-Sechs-Kart-Simulation deckte nach Fahrzeugstößen bis zu 5,7 cm Eindringen in den markierten Block auf. Die gemeinsame Positionskorrektur läuft nun mehrmals nach Fahrzeugkontakten. Im selben Test: kein Blockeindringen, höchstens 1,6 cm Restüberlappung zwischen Karts. Modelltests, Chrome-Browserprobe und RTX-Langprobe bestanden; M2 bleibt wegen Fahrgefühl und Zielhardware offen.

**M2k-Kamerasichtprobe:** Ferne Verfolger- und Fahrerperspektive wurden bei Fahrzeugkontakt als Chrome-Standbilder festgehalten. Die Szene bleibt sichtbar; Kameraruhe und Komfort während echter Bedienung sind weiter offen.

**M2l-Diagnose:** F3 zeigt jetzt ein rollendes Fenster aus bis zu 300 sichtbaren Frames mit P50/P95/P99, langen Frames, Canvas-Auflösung und erkanntem Grafikpfad (falls vom Browser freigegeben). Der Browsercheck prüfte die Anzeige mit einem und sechs Karts. Das scrollbare Panel wurde im Bild `docs/evidence/m2l-f3-diagnose-chrome.png` geprüft; die angezeigten RTX-Werte sind keine Zielhardwaremessung.

**M3-Vorbereitung ohne Produktionsstart:** [Dokument 14](docs/14-character-and-item-catalog.md) schlägt Mussolini/Il Duce GT als ersten Art-Piloten vor. Auswahl, M2-Abnahme und spätere Stilprobe bleiben offen.

**Git-Stand:** M1–M2f sind lokal im Commit `51e22ff` auf `babylon-neustart-2026` gesichert; M2g/h liegen ebenfalls lokal auf diesem Branch. Der Upload zu GitHub wurde von der automatischen Freigabeprüfung wegen ungeklärter Freigabe des externen Ziels abgelehnt; ohne ausdrückliche Freigabe kein erneuter Push. `main` ist unverändert.

## Kurzer menschlicher M2-Fahrcheck

Diese Beobachtungen ergänzen die automatischen Tests; ein angenehmes Fahrgefühl kann nur ein Mensch beurteilen:

1. Starter öffnen, **F3** für die Diagnose drücken und Gerät/GPU, Chrome-Version, Auflösung, FPS, Frame-P95/P99 und Zahl der Frames über 25/33 ms nach mindestens fünf Sekunden Fahrt notieren. Das Panel kann gescrollt werden. Die bisherige Headless-Probe lief auf der RTX 3070 Laptop GPU; ein normaler oder schwächerer PC ist als Vergleich besonders hilfreich.
2. Von der Mitte mit **W** geradeaus über die türkise und orange Bodenwelle fahren. Auf Rad- und Karosseriebewegung sowie störendes Springen achten.
3. Mit **W + A/D + Space** nach dem Hop driften, Space bei geladener Anzeige loslassen und Bremsen ausprobieren. Rückmeldung zu Lenkbarkeit, Tempo und Turbo geben.
4. Mit **C** durch nahe, ferne und Fahrerperspektive wechseln; während Kurve, Hop und Drift auf Sichtbarkeit und Kameraruhe achten.
5. Gerade gegen den gelben Rand fahren, Rückstoß und erneute Steuerbarkeit prüfen. Den rot-gelben Block rechts der Geraden gezielt anfahren und Kontaktreaktion bewerten. Für einen reproduzierbaren Gegenverkehrsfall `http://127.0.0.1:4173/?scenario=contact` öffnen und geradeaus fahren; das zweite Kart ist ein Testfahrzeug.
6. **P** für Pause und **R** für Neustart verwenden. Komfort, Sicht und unfaire Blockaden konkret notieren.

Bitte nur tatsächlich beobachtete Punkte als bestanden markieren. Komfort, Zielhardware und Cockpitqualität sind noch nicht abgenommen.

Die getrennten technischen und menschlichen M2-Abnahmepunkte stehen in [docs/09-roadmap.md](docs/09-roadmap.md). Für Rückmeldungen bitte Gerät/GPU, Chrome-Version, Auflösung und die konkrete Beobachtung nennen; fehlende Geräte bleiben offen.

**Modell jetzt:** Sol, hohe Denkintensität.

**Astra wieder verwenden:** bei einer schwierigen Gesamtentscheidung, einem festgefahrenen Kernproblem oder vor einer großen Meilensteinabnahme.

**Luna verwenden:** für kleine Korrekturen, Listen, Dokumentationspflege und klar begrenzte Routinearbeiten.

## Gesamtprojekt

| Status | Meilenstein | Ergebnis |
|---|---|---|
| ✅ | M0 Planung | Ziele, Stil, Altideen, Grenzen und Arbeitsweise dokumentiert |
| ✅ | M1 Grundstand | Babylon.js startet in Chrome, Diagnose und Ein-Klick-Start |
| ▶️ | M2 Fahren | Kart, Federung, Sprung, Drift, Mini-Turbo, drei Kameras |
| ⬜ | M3 Stilprobe | ein fertiger Fahrer/Kart, fünf einfache Bots, erster Streckenabschnitt |
| ⬜ | M4 Kernrennen | drei Runden, fünf Bots, drei Start-Items, Ergebnis und Revanche |
| ⬜ | M5 Spielsysteme | Fähigkeiten, Schäden, Wetter, Stimmen, Musik und Weltreaktionen |
| ⬜ | M6 Singleplayer | vollständige Strecke, sechs ausgearbeitete Fahrer, UI und Audio |
| ⬜ | M7 Abnahme | normale PCs, Android, iPhone, Performance und Fehlerprüfung |
| ⬜ | M8 Online | private Lobbys per Einladung und Crossplay |

## Die drei Dateien für den Alltag

- **Diese Datei:** aktueller Stand und der nächste kopierfertige Auftrag.
- **[README.md](README.md):** Grundidee und verbindliche Spielziele.
- **[docs/17-progress-log.md](docs/17-progress-log.md):** vollständige Historie und Übergabe zwischen Arbeitssitzungen.

Weitere Detaildateien öffnet Codex selbst, wenn sie für die aktuelle Aufgabe gebraucht werden.

## Noch wichtig

Das neue Projekt liegt direkt in `D:\Diktator-Kart`. Das alte Spiel liegt im Ordner `Diktator-Kart-Legacy` und dient nur als Ideenquelle. Der stabile GitHub-Stand bleibt auf dem Branch `babylon-neustart-2026`, bis ihr später gemeinsam über die Übernahme nach `main` entscheidet.
