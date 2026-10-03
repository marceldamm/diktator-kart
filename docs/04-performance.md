# Performance-Ziele für normale PCs im Browser

## Qualitätsstufe 2 – 03.10.2026

RTX 3070 Laptop, 1600 × 1000, sechs Karts, echtes Drei-Runden-Rennen ([slice-production-race-rtx-q2.json](evidence/slice-production-race-rtx-q2.json)): Standard P50/P95/P99 16,7/16,8/16,9 ms in naher, ferner und Fahrerkamera; im fernen Fenster zwei Intervalle über 33 ms. 371–483 Drawcalls, 0,84–1,03 Mio. aktive Dreiecke, CPU-/GPU-Stichproben 10–15 / 7–9 ms. Basis (Fahrerkamera): 181 Drawcalls, 0,34 Mio. Dreiecke, ein Intervall über 33 ms. Ein Vorlauf vor dem Pflasterpass ergab gleiche Perzentile. Produktionsbuild: Hauptchunk 2.173 kB (543 kB gzip) statt 1.713 kB, vor allem durch die Rendering-Pipeline; Größenwarnung offen.

Reduziert wurden Welt 619k → 202k, Kart 115k → 44k und Baum 135k → 45k Dreiecke. Die Drawcalls stiegen durch neue Streckenteile, Pipeline und Kartmaterialien; für schwache Geräte ist das zu hoch. Nächste Hebel: Kartteile pro Material zusammenfassen bzw. Atlas, Instancing der Kartvarianten, LOD für Publikum und Häuser. Keine Messung auf normalen/schwachen PCs oder Mobilgeräten; 60-/30-FPS-Ziele unverändert.

## Geprüfter Slice-Abschluss – 03.10.2026

Produktionspreview, RTX 3070 Laptop GPU, 1600 × 1000, sechs Karts. Der kontrollierte Drei-Runden-Lauf ohne gleichzeitige Screenshots oder Asset-Builds umfasst 14 Framefenster (meist 300 Intervalle, letztes 115). Erste Standardfenster: P95 37,4 / 66,7 / 33,5 ms; spätere überwiegend 16,8–19,2 ms. Drei Basisfenster nach Revanche: 18,2–18,4 ms. Rohdaten: [slice-controlled-pacing.json](evidence/slice-controlled-pacing.json). Stabile 60 FPS ab Start sind nicht abgenommen. CPU-/GPU-/Drawcallwerte sind Frame-Stichproben, keine Fenster-Mediane.

Korrekturen: undurchsichtiges Laub, sechs statt zehn Bäume, begrenzte Schattenwerfer, mittlere PCF-Filterung, geteilte Materialien, eingefrorene statische Weltmatrizen und begrenzter Glow. Der Messlauf liegt vor dem zuletzt ergänzten initialen Scene-Ready-Gate; Start/Kameras/Neustart danach bestanden, ein verbesserter vollständiger Kaltlauf ist nicht belegt. Der separate Produktions-Rennlauf wurde teilweise durch Blender-Export belastet und zählt nur als Funktionsbeleg. Historische kumulierte Drawcallwerte in slice-full-race-rtx.json sind keine Werte pro Frame.

Build und 23 Modelltests bestanden; Hauptchunk weiterhin 1.713 kB (405 kB gzip), Größenwarnung offen. WebGL1 und automatischer Fallback mit sechs GLB-Karts funktionierten auf diesem RTX-Gerät. Das ist keine Abnahme schwacher PCs oder Mobilgeräte. 60-/30-FPS-Ziele bleiben unverändert. Vollständige Belegübersicht: [Laufzeitbelege](evidence/README.md).

## Leitgedanke

Das Spiel soll auf normalen PCs im Browser gut laufen, nicht nur auf High-End-Hardware. „Schön“ bedeutet daher nicht maximal viele Polygone, sondern gute Priorisierung: Kameraqualität, Silhouetten, Lichtstimmung, Materialkontrast, sichtbare Reaktionen und stabile Eingabe.

Die erste Zielkombination ist Google Chrome unter Windows. Android und iPhone im Querformat sind verbindliche Anschlussplattformen, mit identischen Rennregeln und reduzierbarer Grafik. Sie werden schon bei Eingabe, UI, Ladegruppen, Auflösung und Qualitätsstufen berücksichtigt. Ein iPhone 15 Pro steht laut Nutzer als Testgerät zur Verfügung; Android-Testgerät und schwacher PC mit integrierter Grafik sind noch nicht benannt. Es liegen noch keine Babylon-Messungen auf diesen Geräten vor.

Eine lesende Windows-Geräteabfrage am 03.10.2026 meldete auf dem Entwicklungsrechner nur die NVIDIA GeForce RTX 3070 Laptop GPU. Eine integrierte oder ältere GPU ist dort nicht als separater Grafikcontroller verfügbar; die offene normale/schwache PC-Messung braucht daher einen anderen Testplatz.

## Vorläufige Zielwerte

Diese Werte sind Planungsziele, keine bereits verifizierten Messwerte:

| Bereich | Ziel |
|---|---|
| Bildrate | Standardziel 60 FPS; auf schwächerer Hardware stabile 30 FPS statt starkem Schwanken |
| Auflösung | dynamisch oder skalierbar, ohne UI-Unlesbarkeit |
| Start | Kernszene und erstes Rennen ohne unnötiges Komplettladen aller Inhalte |
| Speicher | Ladegruppen und Freigabe temporärer Rennobjekte; keine wachsenden Leaks über Neustarts |
| Rendering | Instancing für Wiederholungen, LOD für Weltobjekte, begrenzte Schatten-/Postprocessing-Kosten |
| Partikel | harte Obergrenze und Qualitätsstufen; keine dauerhafte Partikelakkumulation |
| Netzwerk | keine Multiplayerlast im Singleplayerkern |

## Historischer Messwert, nicht als Ziel missverstehen

Der alte Projektindex nennt für einen Headless-/SwiftShader-Lauf ungefähr 4 FPS, 228 Drawcalls und 95.904 Dreiecke. Das war ausdrücklich kein normaler-PC-Leistungstest. Der Wert ist ein Warnsignal für die Notwendigkeit echter Hardwaremessungen, aber kein Beweis für die spätere Babylon.js-Leistung.

## Vorgehen

1. Früh eine kleine Babylon-Szene mit Kart, Strecke, Kamera, Schatten und einem repräsentativen Weltsegment bauen.
2. Auf mindestens einer normalen integrierten oder älteren GPU und einem stärkeren PC messen.
3. CPU, GPU, Drawcalls, sichtbare Dreiecke, Speicher, Ladezeit und Frame-Pacing getrennt betrachten.
4. Erst danach Detailbudgets für Figuren, Karts, Strecke, Schatten und Effekte festschreiben.
5. Jede Qualitätsstufe mit demselben spielerischen Feedback prüfen.
6. Alle drei Kameramodi messen: First Person verlangt Cockpitdetails aus nächster Nähe; die entfernte Verfolgerkamera kann mehr Umgebung zeigen. Einen ausgearbeiteten Fahrer plus fünf einfachere Karts schon in die frühen Lasttests einbeziehen.

Der persönliche Entwicklungs-PC ist eine RTX-3070-Laptop-Referenz, nicht die Mindestanforderung. Die Mindestanforderung wird separat mit integrierter oder vergleichbarer schwächerer Grafik bestimmt.

## Frühe M2e-Technikprobe, 03.10.2026

Ein isolierter Headless-Chrome-Lauf bei 1280 × 800 verglich dieselbe einfache Testszene mit einem und sechs bewegten Karts. `WEBGL_debug_renderer_info` meldete ANGLE/D3D11 auf der NVIDIA GeForce RTX 3070 Laptop GPU des Entwicklungsgeräts. Die Diagnose zeigte 42 beziehungsweise 87 Meshes und jeweils 60 FPS; 120 `requestAnimationFrame`-Intervalle ergaben in beiden Fällen 16,7 ms Median und 16,8 ms P95. Die fünf zusätzlichen Karts benutzen das gleiche einfache Fahrmodell, aber weder Renn-KI noch ausgearbeitete Figuren/Materialien. Dieser Lauf ist ein wiederholbarer Frühvergleich auf starker Hardware, kein Nachweis der Zielwerte auf normalem/schwachem PC, Android oder iPhone. GPU-Zeit, Drawcalls, Speicher und Ladezeit wurden dabei nicht gemessen. Das rund 1,022 MB große minifizierte Hauptskript bleibt über der Vite-Warngrenze und braucht später eine gezielte Ladezeitprüfung.

Eine längere M2f-Probe ergänzte sechs Messfenster mit jeweils 300 Frames: ein und sechs Karts in jeder der drei Kameras, 1280 × 800, W+A gehalten. Auf derselben RTX-3070-GPU lagen Median/P95/P99 in allen Fenstern bei 16,7/16,8/16,9 ms; kein Frame überschritt 25 ms. Die Meshzahl blieb nach den Neustarts stabil bei 42 beziehungsweise 87. Die Rohdaten stehen in `docs/evidence/m2f-rtx-endurance.json`. Das 60-Hz-Limit deckelt die Aussage: Die Probe misst weder Leistungsreserven noch die Kosten fertiger Fahrer, Strecke, Licht- und Wettereffekte.

Nach Ergänzung des M2g-Hindernisses ergab die gleiche Probe 44/89 Meshes. Median/P95/P99 blieben in allen sechs Fenstern bei 16,7/16,8/16,9 ms; ein einziges der 1.800 Intervalle dauerte 33,5 ms (erstes Fenster mit einem Kart), alle anderen blieben unter 25 ms. Rohdaten: `docs/evidence/m2g-rtx-endurance.json`. Der einzelne Ausreißer wird nicht als dauerhafte Verschlechterung oder als bestandene Zielhardware-Abnahme gedeutet.

Mit M2h-Fahrzeugkontakt blieb die Szene bei 44/89 Meshes. In sechs Fenstern zu je 300 Frames auf derselben RTX 3070 Laptop GPU lagen Median/P95/P99 zwischen 16,7/16,8/16,8 und 16,7/16,8/16,9 ms; kein Intervall überschritt 25 ms und es gab keine Browserausnahme. In der fernen Sechs-Kart-Ansicht endete die Fahrt bei 0 km/h nach einem Kontakt, sodass dieses Fenster nicht dieselbe freie Trajektorie wie die übrigen misst. Rohdaten: `docs/evidence/m2h-rtx-endurance.json`. Die Werte erlauben keine Aussage zu normalen/schwachen Zielgeräten oder fertiger Spielgrafik.

Der mit `?webgl=1` erzwungene WebGL1-Start gelang im kurzen M2i-Browsercheck auf derselben RTX 3070 GPU mit 44 Meshes und sichtbarer Fahrt. Das ist eine Kompatibilitätsprobe des Renderpfads, kein Lastvergleich für ältere Grafikhardware.

Nach der M2j-Kontaktkorrektur blieben 44/89 Meshes. Die erneute RTX-Probe mit sechs 300-Frame-Fenstern zeigte 16,8 ms P95 in jedem Fenster, kein Intervall über 25 ms und keine Browserausnahme. Ein Sechs-Kart-Fenster endete nach Kontakt bei 0 km/h. Rohdaten: `docs/evidence/m2j-rtx-endurance.json`. Die zusätzliche Positionskorrektur ist damit in dieser kleinen Szene nicht als Frame-Pacing-Verschlechterung sichtbar; Zielhardware bleibt ungemessen.

**M2l-Diagnose für Geräteprüfung:** F3 zeigt in der laufenden sichtbaren Testszene ein gleitendes Fenster bis 300 Frameintervalle mit P50/P95/P99 und Zählern über 25/33 ms, zusätzlich Canvas-Pixelauflösung, Geräte-Pixelverhältnis und den Grafikpfad, sofern `WEBGL_debug_renderer_info` verfügbar ist. Pause, Neustart und ausgeblendete Browser-Tabs leeren das Fenster. Diese Zahlen sind Render-Loop-Intervalle unter Browser/VSync-Einfluss, keine isolierte GPU-Zeit oder fertige Spielperformance. Der Chrome-Test prüfte die Anzeige mit einem und sechs Karts; der Screenshot `docs/evidence/m2l-f3-diagnose-chrome.png` belegt Lesbarkeit/Scrollen. Auf normalem/schwachem PC erst nach mindestens fünf Sekunden sichtbarer Fahrt notieren und Gerät, Chrome-Version, Auflösung, Kameramodus sowie Fahrzeugzahl dazuschreiben.

**Erster menschlicher F3-Blick, 03.10.2026:** Der vom Nutzer gesendete Screenshot `docs/evidence/m2-human-f3-rtx-2026-10-03.png` zeigt WebGL2/ANGLE/D3D11 auf der RTX 3070 Laptop GPU, 1849 × 1263 Canvas-Pixel bei DPR 1, sechs Karts und 89 Meshes. Im rollenden 300-Frame-Fenster stehen 60 FPS, P50/P95/P99 16,7/16,9/17,2 ms sowie null Frames über 25 oder 33 ms. Im Aufnahmezeitpunkt stand das Kart nach Fahrzeugkontakt bei 0 km/h. Das belegt die ablesbare Diagnose im sichtbaren Browser und ein ruhiges Fenster dieser einfachen Szene auf diesem Gerät; keine kontrollierte Dauerfahrt, GPU-Lastreserve oder normale/schwache Zielhardware.

**Frühe Stilskizzenlast, 03.10.2026:** Die erste unzusammengefasste Vorplatzkulisse zeigte mit sechs Karts 473 Meshes und in einem kurzen F3-Fenster P95/P99 20,8/42,7 ms sowie acht Intervalle über 25 ms auf derselben RTX. Das Zusammenfügen statischer Bauteile nach Material senkte die sichtbare Meshzahl auf 174–175. Vier kurze Wiederholungen der zusammengefassten Szene zeigten P95 von 18,3 bis 39,0 ms und P99 von 20,2 bis 47,4 ms; in einer Wiederholung lagen 23 Intervalle über 25 ms, in den anderen keine. Die Streuung erlaubt noch keine belastbare Aussage zur Verbesserung der Framezeiten. Kulisse, Kamera und Testfahrer bleiben einfache Platzhalter; GPU-Zeit, Drawcalls, Speicher, längere Fahrfenster und normale/schwächere Hardware sind offen. Die 60-/30-FPS-Ziele werden nicht geändert.

Eine kontrolliertere Nachprobe nutzte denselben Headless-Chrome-Pfad wie M2f mit je 300 Frames für ein/sechs Karts und alle drei Kameras bei 1280 × 800, W+A gehalten und Neustartprüfung. Die Stilskizze zeigte 50/175 Meshes, P95 16,8–16,9 ms und keinen Frame über 25 ms in 1.800 Intervallen; die Laboransicht 61/186 Meshes, fünf Fenster mit P95 16,8 ms und ein erstes Fenster mit P95 20,4 ms sowie einem 107,4-ms-Ausreißer. Ein Sechs-Kart-Fenster endete durch Kontakt bei 0 km/h. Rohdaten: `docs/evidence/m3a-showcase-rtx-endurance.json` und `m3a-lab-rtx-endurance.json`. Dieser einzelne RTX-Lauf erklärt die schwankenden kurzen F3-Fenster nicht und misst weder GPU-Reserve noch spätere G–L-Assets oder normale PCs.

## Performance-Sicherheitsregeln

- Keine unbounded Listen oder Timer in Rennen, Pause, Neustart und Menürückkehr.
- Wiederverwendbare Effekte poolen, wenn Messung dies rechtfertigt.
- Dekoration ohne Gameplaykollision halten, sofern sie nicht ausdrücklich ein Hindernis ist.
- Abkürzungen und Landmarken priorisieren; unwichtige Fernobjekte zuerst reduzieren.
- Fallback auf einfachere Schatten, Effekte und Auflösung bereitstellen.
- Wettereffekte lokal begrenzen und zeitlich sauber beenden; Regen, Schnee, Eis und Laub dürfen keine unkontrolliert wachsenden Partikel- oder Kollisionsmengen erzeugen.
- Schadensmodelle bevorzugen wenige austauschbare Zustände und Animationen gegenüber echter Geometriezerstörung.
