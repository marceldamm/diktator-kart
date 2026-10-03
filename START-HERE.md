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

Ziel des nächsten Arbeitspakets M2f-Fahrprüfung: Die neue Randreaktion,
Hop, Drift, Mini-Turbo, Federung und alle drei Kameras bei einer
längeren Fahrt auf verfügbarer echter Hardware prüfen. Dokumentiere
Gerät, Browser, Grafikpfad, Bildrate/Frame-Pacing und Beobachtungen
getrennt vom bisherigen Headless-Vergleich. Prüfe Pause und Neustart
erneut. Wenn menschliches Fahrgefühl nicht selbst beurteilt werden kann,
halte dies offen und bereite einen kurzen reproduzierbaren Fahrtest für
den Nutzer vor. Die fünf automatisch bewegten Lastkarts sind noch
keine Rennbots; allgemeine Streckenkollision und Zielhardware-Abnahme
bleiben weitere M2-Themen. Übernimm keinen PlayCanvas-/Ammo-Code.
Halte START-HERE.md und docs/17-progress-log.md aktuell und berichte
verifiziert, nicht verifiziert, offen und nächsten Schritt.
```

## Wo stehen wir?

**Heute:** M1 geprüft; M2a–e und der M2f-Randstoß liefern ein steuerbares Test-Kart mit Hop, Drift, Mini-Turbo, Federung, drei Kameras und fünf bewegten Lastkarts. Ein vollständiges Rennen existiert noch nicht.

**Aktueller Meilenstein:** M2 – Fahrprototyp.

**Direktes Ziel:** M2f-Fahrprüfung auf echter Hardware; bisherige Chrome-Messung war Headless.

**M1-Abnahme:** Build erfolgreich; Testszene in Chrome sichtbar; WebGL2, Pause, Eingabeaktionen, Neustart, Fehler und Wiederherstellung geprüft. Ein-Klick-Starter startet Vite und öffnet Chrome.

**M2a-Zwischenstand:** Beschleunigung, Bremse, Rückwärtsfahrt, Lenkung und Ausrollen funktionieren als vorläufiges Modell. Chrome zeigt Kart und Testfläche; Browserinteraktionen, Pause und Neustart wurden geprüft. Drei echte Kameras, sechs Fahrzeuge und Lastmessung fehlen weiterhin.

**M2b-Zwischenstand:** Space-Hop, aufladbarer Drift und befristeter Mini-Turbo sind in Chrome sichtbar und mit Modell-/Browsertests geprüft. Die Werte sind vorläufig; M2 insgesamt ist noch nicht abgenommen.

**M2c–e-Zwischenstand:** Zwei markierte Bodenwellen, vier Radkontakte und eine gedämpfte Karosseriereaktion sind im Fahrmodell. Chrome zeigte nahe/ferne Verfolger- und Fahrerperspektive; letztere mit einfachen Händen, Lenkrad, Armaturen und Vorderrädern. Sechs einfache Karts fahren im Techniktest. Ein Headless-Vergleich von einem und sechs Fahrzeugen ergab 42/87 Meshes und in beiden Fällen 60 FPS bei 1280 × 800; das ist keine Zielhardware-Abnahme. Neun Modell-/Eingabetests, Build und Browserprobe bestanden.

**M2f-Teilstand:** Der Rand gibt nun einen kurzen Rückstoß, stoppt Drift/Turbo und lässt danach die Steuerung wieder frei. Zehn Modell-/Eingabetests, Build und Chrome-Randprobe bestanden. Fahrgefühl und echte Hardwareleistung sind offen.

## Kurzer menschlicher M2-Fahrcheck

Diese Beobachtungen ergänzen die automatischen Tests; ein angenehmes Fahrgefühl kann nur ein Mensch beurteilen:

1. Starter öffnen, **F3** für die Diagnose drücken und Browser/Gerät sowie ungefähr stabile FPS notieren. Die bisherige Headless-Probe lief auf der RTX 3070 Laptop GPU; ein normaler oder schwächerer PC ist als Vergleich besonders hilfreich.
2. Von der Mitte mit **W** geradeaus über die türkise und orange Bodenwelle fahren. Auf Rad- und Karosseriebewegung sowie störendes Springen achten.
3. Mit **W + A/D + Space** nach dem Hop driften, Space bei geladener Anzeige loslassen und Bremsen ausprobieren. Rückmeldung zu Lenkbarkeit, Tempo und Turbo geben.
4. Mit **C** durch nahe, ferne und Fahrerperspektive wechseln; während Kurve, Hop und Drift auf Sichtbarkeit und Kameraruhe achten.
5. Gerade gegen den gelben Rand fahren, Rückstoß und erneute Steuerbarkeit prüfen. Danach **P** für Pause und **R** für Neustart verwenden.

Bitte nur tatsächlich beobachtete Punkte als bestanden markieren. Komfort, Zielhardware und Cockpitqualität sind noch nicht abgenommen.

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
