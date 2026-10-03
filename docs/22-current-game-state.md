# Aktueller Spielstand und Produktionsgrundlage

Stand 03.10.2026 nach Claude Q2d und anschliessender Team-/Starterumstellung. Gemeinsame Quelle ist jetzt der **neue Babylon-main**, keine alte Engine-Version. Git-Ablauf in [21-team-workflow.md](21-team-workflow.md).

## Uebernommener Claude-Stand

Vollstaendiger Quellbaum von `c13d47e`, Branch `claude/diktator-kart-quality-level-f851c0`. Der Nutzer hat die Verbesserungen gespielt und positiv bewertet. Die folgenden Implementierungen sind im Code/Assets und Claudes Fortschrittslog belegt; unterschiedliche Pruefquellen werden unten getrennt.

- 593-m-Spline-Rundkurs mit Palastbogen, S-Kurven, Boulevard und Haarnadeln; gemeinsame Mittellinie fuer Fahren, Bots, Welt und Minikarte. Hinterhof-Abkuerzung (Bots dort noch ohne Ideallinie).
- Neues Kart, sechs fiktive Karikaturfiguren mit ganzen Beinen/Uniformdetails, sichtbare Vorderrad-/Lenkrad-/Armanimation, Faustgeste bei Turbo.
- Gleitende Bandenkontakte mit einmaligem Anprallverlust und laufender Reibung; weichere Rempler; Lenkträgheit, gefederte Karosserie, Kopfsteinpflaster-/Randsteinreaktion, sichtbarer Dreher bei Itemtreffer.
- Drei Kameras, Umsehen nur mit gehaltener rechter Maustaste und Ziehen; Loslassen zentriert weich. X halten fuer Rueckblick, Mausradzoom, Linksklick-Item. Freier sichtbarer Cursor, keine permanente Mausbindung.
- Bot-Drift/Turbo, drei gleiche Itemregeln, kompletter Rennablauf mit Countdown/drei Runden/Ziel/Revanche und freier Fahrt.
- Warmes Nachmittagslicht, Bloom/Farbkurven, Begrenzung fuer Basisgrafik, Reifenspuren, Turbo-Feuer, Papier-/Staub-/Konfettieffekte. Architektur entlang der Strecke, Publikum, Banner und fiktive Statuen.
- Originale Motor-/Publikums-/Kontaktklaenge, Sprecherin und Figurenrufe (offline synthetisierte eigene Texte; keine menschliche Hoerabnahme).
- **Staatsfernsehen LIVE:** zweite Kamera mit drei Einstellungen folgt dem Rennfuehrer auf der Videowand. Bereits implementiert; nicht erneut als fehlendes naechstes Feature planen. Kostet einen weiteren Renderpass und erhoeht Drawcalls.

## Dateien und editierbare Quellen

| Bereich | Aktive Quelle |
|---|---|
| Fahrmodell/Kontakte/Lenkung | `src/kart-model.ts` |
| Streckenkurve und Regeln | `src/track-layout.ts`, `track.ts` |
| Welt entlang der Strecke | `src/track-world.ts`, `slice-scene.ts` |
| Figurenbesetzung/Kameras/Effekte/Audio | `src/cast.ts`, `camera.ts`, `effects.ts`, `audio.ts` |
| Kart und Figuren | `art-source/build_kart.py`, `hero-kart.blend`, `public/assets/models/hero-kart.glb` |
| Welt | `export_track.mjs` → `track-layout.json` → `build_world.py`, `stadium-world.blend`/GLB |
| Baum | editierbares `park-tree.blend`, `decimate_tree.py`, optimiertes GLB |
| Stimmen/Klaenge | `build_voices.mjs`, `build_audio.mjs`, lokale WAVs; Texte in `audio/voice/lines.json` |
| Lizenznachweise | `public/assets/CREDITS.md`, sichtbare Credits im Spiel |
| Team/Start | `project-state.json`, `scripts/start-local.ps1`, `team-workflow.ps1`, Repo-Skills |

`build_slice.py` dokumentiert die fruehere Pipeline; nicht zur Neuproduktion der aktuellen Q2-Welt aufrufen. `build_props.py`/stadium-props sind im Claude-Stand abgeloest. Keine alten GLBs aus Archivbranches als vermeintlich neuere Version einsetzen.

## Programme und neuer PC

**Zum Spielen/Codebauen erforderlich:** Git, Node.js mit npm; Projektpakete werden mit `npm ci` aus package-lock.json installiert (Babylon.js 9.28.0, Vite 8.3.2, TypeScript 7.0.2). Google Chrome bevorzugt, Starter kann sonst den Standardbrowser oeffnen. Laufzeit-GLBs/Texturen/WAVs sind enthalten: Sarah braucht zum Spielstart weder Blender noch Piper.

**Fuer Assetproduktion:** Blender 4.5.3 LTS, kostenlos/portabel. Pipeline und Befehle in `art-source/README.md`. glTF Transform 4.5.1 und Sharp 0.35.5 sind npm-Entwicklungsabhaengigkeiten. Fuer neue Stimmen Piper TTS 2023.11.14-2 plus die dokumentierten Kerstin-/Thorsten-Modelle lokal installieren; konkrete Herkunft/Lizenzen in Credits. Die Tools/Sprachmodelle unter `.tools/` werden nicht auf GitHub hochgeladen. Blender/Piper sind nur bei entsprechenden Assetaufgaben notwendig.

Arbeitsordner auf jedem PC frei waehlen; keine Cloud-Projektkopie als zweite aktive Wahrheit. Code und Programme in einem neuen Checkout anhand dieser Dokumente erkennen/installieren. Kostenpflichtige Modelle/Dienste sind nicht freigegeben.

## Was wann geprueft wurde

- **Von Claude dokumentiert:** Q2 bis Q2c umfassende Browser-/Renn-/Item-/WebGL1-/Touchproben, 25 Modelltests nach Q2c/Q2d, Bot-Dauer-Simulationen; Details/Rohdaten im Fortschrittslog und Evidence-Index. Diese Herkunft ist kein erneuter Test durch Codex.
- **Bei Teamumstellung erneut durch Codex:** 25 aktuelle Modelltests; Produktionsbuild; tatsaechlicher Start aus dem Hauptordner, Menue/Fahrt/drei Kameras/Foto/Pause/Countdown/vollstaendiger Neustart mit sechs Teilnehmern. Neue echte Bilder mit Suffix `-team`.
- **Neuer Team-/Starterablauf:** sieben isolierte Git-/Porttests fuer ungesicherte Dateien, parallele nichtkonfligierende Aenderungen, echten Konflikt, Altstand-Archivierung, parallelen Upload waehrend Build, fehlgeschlagene Tests sowie fremden/eigenen Spielserver. Beide Repo-Skills mit offiziellem Validator geprueft.

Keine neue schwache-PC-/Mobil-, Hoer-, menschliche Komfort- oder G–L-Abnahme. Kurzes F3-Fenster der erneuten Teamprobe: RTX 3070 Laptop, 1600 × 1000, 49 FPS / P95 32,5 ms; kein kontrollierter Dauerlauf. Fruehere Claude-Messungen von 16,8 ms gelten nicht als Garantie fuer diesen Start-/Videowandstand. Bundlewarnung weiterhin offen (Hauptchunk ca. 2,19 MB / 549 kB gzip).

## Offene Produktion

Regen/nasse Strasse/Pfuetzen/Blitz/Wolkenschatten und echtere Fahrer sind Nutzerwuensche, bislang **nicht implementiert**. Bots auf die Abkuerzung, Schadensstufen, Drawcall-/Ladeoptimierung sowie normale/schwache PC-/Mobilpruefung bleiben offen. Historische Gestaltung, Sarahs Ideen und gemeinsame Stilfreigabe weiterhin gesondert behandeln.

Nach erfolgreicher Teamumstellung auf main 845c0bf umgesetzt: frueher Konzeptbild-Ladebildschirm mit kritischem Inline-CSS, originalem Imagegen-Motiv (376,5 kB WebP), echtem Fortschritt in sechs Abschnitten und Fehlerhilfe/Wiederholen. Das 3D-Menue folgt erst nach whenReadyAsync und erstem Renderbild. Quellen: art-source/loading-stadium-v1.md; Log/Browserbilder: docs/evidence/loading-*. Kein Ersatz fuer 3D-Spielgrafik oder neue G–L-Abnahme.
