# Performance-Ziele für normale PCs im Browser

## Leitgedanke

Das Spiel soll auf normalen PCs im Browser gut laufen, nicht nur auf High-End-Hardware. „Schön“ bedeutet daher nicht maximal viele Polygone, sondern gute Priorisierung: Kameraqualität, Silhouetten, Lichtstimmung, Materialkontrast, sichtbare Reaktionen und stabile Eingabe.

Die erste Zielkombination ist Google Chrome unter Windows. Mobile Browser sind ein echtes Anschlussziel und werden schon bei Eingabe, UI, Ladegruppen, Auflösung und Qualitätsstufen berücksichtigt.

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

Der persönliche Entwicklungs-PC ist eine RTX-3070-Laptop-Referenz, nicht die Mindestanforderung. Die Mindestanforderung wird separat mit integrierter oder vergleichbarer schwächerer Grafik bestimmt.

## Performance-Sicherheitsregeln

- Keine unbounded Listen oder Timer in Rennen, Pause, Neustart und Menürückkehr.
- Wiederverwendbare Effekte poolen, wenn Messung dies rechtfertigt.
- Dekoration ohne Gameplaykollision halten, sofern sie nicht ausdrücklich ein Hindernis ist.
- Abkürzungen und Landmarken priorisieren; unwichtige Fernobjekte zuerst reduzieren.
- Fallback auf einfachere Schatten, Effekte und Auflösung bereitstellen.
- Wettereffekte lokal begrenzen und zeitlich sauber beenden; Regen, Schnee, Eis und Laub dürfen keine unkontrolliert wachsenden Partikel- oder Kollisionsmengen erzeugen.
- Schadensmodelle bevorzugen wenige austauschbare Zustände und Animationen gegenüber echter Geometriezerstörung.
