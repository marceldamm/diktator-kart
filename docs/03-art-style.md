# Art Style

## Leitbild

Die Produktion verwendet einen kontrastreichen „Modern N64“-Stil: große, klare Silhouetten, wenige Materialien pro Objekt, bewusst kantige Formen und kräftige Propagandafarben. Dunkles Asphaltgrau, verblichenes Papier, Staatsrot und übertriebenes Gold bilden die gemeinsame Palette.

## Umgesetzt

- Produktionsmenü mit plakatartiger Typografie und sechs farblich unterscheidbaren Fahrer-Kacheln
- primitives, aber klar lesbares Fahrer-/Kartmodell mit Körper, Kopf, Hut und individuellem Detail
- erste Strecken-Silhouetten für Palast, Papptribüne, Druckerei, Monument und Springbrunnen
- hellere Weltbeleuchtung und flachere Rennkamera für eine lesbare Horizontlinie

Die aktuellen Streckengebäude sind bewusst eine erste In-Engine-Art-Pass-Stufe. Materialvariation, Beschilderung, Animationen, Partikel und endgültige Modellproportionen folgen iterativ.

## Art-Pass September 2026

- Menü-Key-Art `client/public/art/capital-grand-prix.png` als breiter Hintergrund mit abgedunkelter Titelzone.
- Fahrbahnmarkierungen auf beiden langen Geraden, vier farblich markierte Sektor-Schilder und sechs Strecken-Beacons je Außenseite.
- Das neue HUD enthält eine schematische Minikarte mit Spieler- und Botpositionen sowie ein Tempometer.
- Alle sechs Karts besitzen jetzt Stoßfänger, Kühlergrill, Seitenschweller, Heckflügel sowie leuchtende Lichtleisten.
- Ein selbst generiertes GLB-Zielportal ersetzt den einfachen Startbogen; sechs PBR-Materialgruppen bündeln Säulen, Dach und Siegel.
- Ein kurzer Stahlsektor und gepoolte, auslaufende Drift-Reifenspuren ergänzen Streckenoberflächen und Fahrfeedback.
- Der Grafikdevice ist auf maximal 1,5 Geräte-Pixel pro CSS-Pixel begrenzt, um unnötige Renderlast auf hochauflösenden Displays zu vermeiden.

Die neuen Landmarken verwenden weiterhin günstige Primitive und ändern weder Kollisionsflächen noch Checkpoints. Individuelle GLB-Fahrzeuge, wiederverwendbare Mesh-Instanzen und detaillierte Sektor-Modelle bleiben der nächste Art-Schritt.
