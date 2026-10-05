# Fortschrittslog und globale Projekthistorie

### 2026-10-05 – Itemschaden bei Panzerform

**Befund:** Die Item-/Trefferlogik zog normalen Spieler- und Botkarts bereits 14 Haltbarkeit pro Treffer ab; Mehrfachtreffer, Totalschaden und gemeinsame Reparatur waren vorhanden. Während der Panzerverwandlung dämpft `stepItems` Itemtreffer in einen kurzen Aufprall (`impactKind: 'item'`) ohne `spinRemaining`. `stepDamage` erkannte Itemschaden ausschließlich an einem frischen Spin und ließ dadurch diesen Fall ungezählt.

**Umgesetzt:** `src/damage.ts` erkennt jetzt entweder einen frischen Item-Spin oder einen frischen Item-Aufprall. Beide Wege lösen denselben einzelnen, gedeckelten `DAMAGE_RULES.itemHit`-Abzug aus; ein unveränderter Zustand zählt im Folgeframe nicht erneut. Itemimmunität, Reparaturschutz, Panzerabschwächung des Tempos und normale Kollisionsschäden sind unberührt.

**Verifiziert:** `tests/damage.test.mjs`: 4/4 einschließlich schwerer Einschläge, kleiner Rempler, normaler Itemtreffer, Itemtreffer ohne Spin während des Panzers, Nicht-Doppelzählung, wiederholte Treffer bis Totalschaden und Reparatur für Spieler/Bot. Der erste sandboxierte Node-Test scheiterte mit `spawn EPERM`; die freigegebene Ausführung bestand. Vollsuite `npm test`: 58/58, 406,6 s. `npm run build`: TypeScript und Vite erfolgreich, 1.296 Module; bestehende Hauptchunkwarnung (2.022,75 kB) bleibt.

**Offen:** Keine menschliche Balance-/Fahrprüfung; die vorhandenen Zahlen bleiben vorläufig. Der Effekt ist während des nur acht Sekunden dauernden Panzerzustands einmal pro erfolgreichem Treffer, nicht pro Simulationsframe.

**Limitstand:** Nach dem Schadenspaket unverändert 18 % Fünf-Stunden- und 41 % Wochenverbrauch (82 %/59 % Rest; Woche bindet). Keine Resets oder Zusatzkontingente aktiviert.

### 2026-10-05 – Selektive Townhouse-Fassadenvarianten

**Auswahl/Auftrag:** Nach dem Kanalspray wurde ein bestätigtes M3-Weltziel vor Beginn in `CURRENT-WORKLIST.md` und `LONG-TERM-GOALS.md` aufgenommen: wiederkehrende Straßenhäuser durch wenige gezielte Fassadendetails variieren.

**Umgesetzt:** `art-source/build_world.py` ergänzt zwei verwitterte blaugrüne/burgunderrote Holzläden samt schlichter Querstrebe an den äußeren oberen Fenstern jedes vierten Townhouses. Jeder dritte Geschäftsblock erhält am mittleren Ladenfenster einen Terrakotta-Blumenkasten mit begrenztem Blattwerk und einer Blüte. Nicht alle Fassaden tragen dieselben Elemente. Nach Abbruch eines zu dichten, noch nicht exportierten Blender-Laufs wurde die Geometriedichte vor dem erfolgreichen vollständigen Neubau reduziert; die alte Runtime-Datei blieb bis zum abgeschlossenen Ersatz bestehen.

**Verifiziert:** Blender meldete 48 Townhouses und speicherte `art-source/stadium-world.blend` (24.077.009 Byte). Roh-GLB: 21.890.552 Byte; optimierte `public/assets/models/stadium-world.glb`: 15.528.128 Byte, 104.600 Byte (0,67 %) kleiner als der vorherige Runtime-Stand. glTF-Strukturprüfung bestätigte 28 Meshes sowie Fensterladen-/Blumenkasten-Knoten und neues Ladenmaterial. Produktionsbuild erfolgreich (1.296 Module); `dist/assets/models/stadium-world.glb` ist bytegleich zum öffentlichen GLB. `git diff --check` erfolgreich; nur übliche LF/CRLF-Hinweise.

**Laufzeitbeleg / offen:** Das Spiel lud nach frischem In-App-Browser-Reload bis zur freien Startaufstellung. Die Fassaden waren dort nicht nah genug für einen verlässlichen visuellen Abgleich; keine Sicht-/Stilabnahme oder Fahrbildwirkung behauptet. Ein früherer dichter Blender-Entwurf wurde vor dem Schreiben von Ergebnissen abgebrochen. Keine fremden Browserprofile wurden verwendet.

**Limitstand:** Offizielle Kontowerte nach diesem Paket: 18 % des Fünf-Stunden-Fensters und 41 % des Wochenfensters verbraucht (82 %/59 % Rest; Woche ist bindend). Keine Resets oder Zusatzkontingente aktiviert.

### 2026-10-05 – Stalin-Nase als eigener Gesichtsbaustein

**Umgesetzt:** In `art-source/build_kart.py` ersetzt `cast-stalin-nose` für Stalin die allgemeine Nase: eigene loftmodellierte Brücke (0,17 m), breitere Flügel und zurückhaltende Nasenlöcher. `src/cast.ts` aktiviert das Teil nur in Stalins Cast. `art-source/hero-kart.blend`, Roh-GLB und optimierter Export wurden mit Blender 4.5.3/glTF Transform reproduziert. Optimiertes Runtime-GLB: 5.081.568 Byte gegenüber 5.046.100 Byte vorher (+35.468 Byte, rund +0,7 %); die GLB-Knotenzuordnung wird von `tests/cast.test.mjs` geprüft.

**Sichtprüfung und Grenzen:** Ein isolierter Blender-Studio-Render war keine gültige Geometrieabnahme: der Quell-Scene-Aufbau lädt die Babylon-Cast-/Materialzustände nicht und zeigte mehrere Gesichtsteile isoliert. Diese Aufnahme wird nicht als Projektbeleg geführt. Es gibt noch keinen aktuellen Stalin-Nahblick im echten Spiel; die Form kann deshalb technisch exportiert, aber nicht als visuell überzeugend oder realistisch abgenommen gemeldet werden.

**Verifizierung:** Gezielter `tests/cast.test.mjs`: 1/1; `npm run build`: erfolgreich, 1.296 Module; bekannte ~2.022-kB-Babylon-Hauptchunkwarnung bleibt. `npm test`: Vollsuite 55/55 bestanden (219,8 s); `git diff --check` sauber. Erste Blender→Optimizer-Runde stieß kurz auf einen Schreibfehler beim Runtime-GLB; Wiederholung nach abgeschlossenem Export erfolgreich.

### 2026-10-05 – Stalin-Gesichtspass 2: Kiefer und Schläfenhaar

**Umgesetzt:** In `art-source/build_kart.py` wurden Stalins Wangen, Masseter, Kieferwinkel und flacheres Kinn als kontinuierliche Verformung der eigenen Schädelmeshvariante modelliert. Zwei konturfolgende Haarlocks erweitern seine zurückgekämmte Frisur zu den Schläfen, ohne die Kopfoberfläche mit getrennten Wangenkugeln zu belegen. Die individuellen Driver-Rigs, Gesichtsauswahl und Fahrphysik bleiben gleich.

**Assetpipeline:** Blender 4.5.3 erzeugte `art-source/hero-kart.blend` und den GLB; der Export lief mit den bestehenden `Keine Maschendaten zum verknüpfen`-Warnungen durch und endete mit `KART_COMPLETE`. GlTF Transform optimierte 7.099.272 Rohbytes auf 5.084.136 Runtimebytes (+2.568 Byte gegenüber 5.081.568 vorher; ca. +0,05 %). Die neue Haargeometrie ist in der bestehenden cast-swept-Materialgruppe konsolidiert und bleibt runtime-schaltbar.

**Verifiziert:** Cast-/GLB-Regressionsprüfung 1/1; `npm test` 56/56; `npm run build` erfolgreich mit 1.296 Modulen; echte Fahrerwahlansicht frisch nach Runtime-Reload geprüft, alle sechs Porträts inklusive Stalin geladen. Vite meldet weiter den bekannten 2.022,65-kB-Hauptchunk. `git diff --check` beim Checkpoint erneut ausführen.

**Nicht abgenommen:** Der Screenshot zeigte die Fahrerwahlfront in Porträtgröße; Profil, sehr nahe Gesichtsansicht, Mimik/Fahrt, Nutzerstilprüfung und ein verlässlicher echter In-Game-Screenshot aus Seiten-/Bewegungsperspektive fehlen. Stalin-/Fahrzeugqualitätsanker bleibt offen; dieser Pass ist kein Fertigstatus.

### 2026-10-05 – Stalin-Limousine: Coachwork-Pass

**Umgesetzt:** `art-source/build_kart.py` ergänzt in der nur bei Stalin aktiven `body-limousine`-Gruppe eine der Schale folgenden seitlichen Coachline, zwei Türgriffe mit Escutcheon sowie sechs dunkle, eingelassene Haubenlüfter samt je drei Metalllamellen. Keine neue Geometrie ist am gemeinsamen Rad-/Fahrwerkspivot oder an anderen Karosserien befestigt.

**Assetpipeline:** Blender 4.5.3 erzeugte `hero-kart.blend` und GLB; Warnungen `Keine Maschendaten zum verknüpfen` bleiben wie im bisherigen Generator bestehen, Export endet mit `KART_COMPLETE`. glTF Transform optimierte 7.315.132 Rohbytes auf 5.230.312 Runtimebytes (+146.176 Byte gegenüber 5.084.136; +2,9 %). Optimierungsmanifest ist aktualisiert.

**Verifiziert:** Cast-/Assettest 1/1; Vollsuite `npm test` 56/56 in 319,3 s; `npm run build` erfolgreich mit 1.296 Modulen, bekannte Vite-Warnung beim 2.022,65-kB-Hauptchunk. Eigener In-App-Prüftab frisch geladen; Fahrerwahlporträts und Stadionszene erscheinen ohne GLB/WebGL-Ladefehler. Im Auswahlbild ist die Limousine zu klein, um Coachline, Türgriffe und Lüfter einzeln zu bewerten.

**Nicht abgenommen:** Keine Fahrzeugnah-/Seiten-/Heck-/Fahrtansicht der neuen Teile, kein Performancevergleich. Keine Aussage über visuelle Fertigstellung oder menschliche Qualitätsabnahme.

### 2026-10-05 – Schadensmeter für Screenreader ausgezeichnet

`#health` benennt seinen Zustand jetzt als ARIA-Meter (0–100) und aktualisiert `aria-valuenow`/`aria-valuetext` mit dem aktuellen Karosseriezustand; Totalschaden wird zusätzlich verständlich benannt. Der sichtbare Balken und Schadenswert werden nicht verändert. `npm run build` erfolgreich (1.296 Module); Vite meldet den bestehenden ~2.022-kB-Hauptchunk.

### 2026-10-05 – Item-HUD: Maus-/Touch-Halten und kurze Taps

**Befund:** Der Screenbutton war bisher nur ein Click-Wurfknopf. Pointer-/Touch-Eingabe konnte das Item nicht wie `E` als Schild halten; zusätzlich konnte ein kurzes Loslassen zwischen zwei Physikframes verloren gehen.

**Umgesetzt:** `attachPointerHold` ordnet Pointer-IDs getrennte Inputquellen zu und gibt sie bei Loslassen, Abbruch, verlorenem Capture, Fensterfokusverlust und App-Abbau frei. Der Screenbutton reicht echte Pointerklicks nicht zusätzlich als zweiten Wurf weiter; Tastatur-/assistive synthetische Clicks bleiben nutzbar. Die Simulationsschleife wertet das einmalige `pressed`-Signal für den schnellen Tap aus, während ein gehaltener Button weiterhin den Schild aktiviert. Touch verhindert natives Scroll-/Zoomverhalten auf dem Aktionsknopf.

**Verifiziert:** `tests/input.test.mjs` deckt Halten, Loslassen, Tap zwischen Frames und Pointercancel ab (2/2). Vollsuite `npm test`: 56/56 bestanden, inklusive Teamworkflow- und Fahr-/Itemregressionen (208,5 s). `npm run build`: erfolgreich; TypeScript/Vite erzeugte 1.296 Module und meldet den bestehenden 2.022,65-kB-Hauptchunk. `git diff --check` sauber (nur Windows-Zeilenendenhinweise).

**Laufzeitbeobachtung:** Separater In-App-Prüftab (der offene Nutzer-Tab blieb unberührt) lud die echte Babylon-Szene, Fahrerwahl, Stalin-Kart, HUD und ein laufendes 6-Kart-Rennen. Kurze `W`-Eingaben änderten die angezeigte Geschwindigkeit; der Ein-Item-Slot zeigte initial korrekt „LEER“. Itemkästen waren im Streckenbild sichtbar, aber die begrenzte Eingabegeste erreichte keine bestätigte Aufnahme. Deshalb keine Aussage zu Itemaufnahme, Buttonwurf oder Touch-Haltepose im Live-Rennen.

**Nicht verifiziert:** Der Browser-Zyklus mit echter Itemaufnahme und Maus-/Touchgeste wurde nicht interaktiv abgenommen. Die Pointer-Logik ist automatisiert geprüft, die normale Spielinteraktion bleibt offen.

### 2026-10-05 – Kanal-Wasserlinie und HUD-Arbeitslistenabgleich

**Weltpass:** `src/track-world.ts` erzeugt zwei schwach sichtbare, prozedurale Schaumstreifen am Anfang und Ende der Kanalwasserfläche. Beide liegen bei y=.048 über Wasser y=.04, sind höchstens .16 m lang und vollständig innerhalb der Kanalgrenzen. Die Alpha-Textur nutzt gebrochene, variierte Wellen und kleine Schaumflecken. Das ist reine Darstellung: keine neue Kollisionsfläche und kein Partikelsystem. `canalFoamBands` ist gegen Grenzlage, Maximalbreite und Null-/Negativlänge getestet.

**HUD-Abgleich:** Bei der Prüfung der aktuellen Aufgabe zeigte sich, dass der offene Arbeitslistenpunkt Ein-Item-HUD veraltet war. `src/main.ts` zeigt bereits fahrerspezifisches Projektilsymbol/Name, `IM SLOT`/`LEER`, Screen-Wurfbutton, ARIA-Status und den Schild-beim-Halten-/Wurf-beim-Loslassen-Pfad. Die bestehende Item-Simulationssuite deckt Aufnahme und Verbrauch/Abwehr ab. Die tatsächliche UI-Sequenz Aufnahme → sichtbarer Slot → Bildschirm-/Tastatur-/Touchwurf wurde in diesem Paket nicht im interaktiven Rennen gefahren; sie bleibt offen und ist jetzt in den Arbeitslisten getrennt ausgewiesen.

**Verifiziert:** `node --test tests/environment-effects.test.mjs`: 2/2. `npm run build`: erfolgreich, 1.296 Module; Vite meldet weiter den bekannten 2.022-kB-Hauptchunk. `npm test`: vollständige Suite 55/55, einschließlich langsamer Git-Workflowtests, in 217,7 s. `git diff --check`: sauber. Erste sandboxierte Node/Vite-Aufrufe stießen auf `spawn EPERM`; Wiederholung mit nötigem Prozessstartzugriff erfolgreich.

**Nicht verifiziert:** keine neue Laufzeit-Nahaufnahme des Kanals, keine Spielerfahrt durch Sprühzone, keine Maus-/Touch-Itembedienung und keine Fahrer-Stilabnahme. Der vorhandene Software-Headlesslauf ist wegen zu langsamem Render-/Physiktakt kein Ersatz für einen normalen interaktiven Fahrtbeleg. `git fetch origin` war erfolgreich; `origin/main` blieb bei `00e8173`. Das nachgelagerte Team-Statusskript konnte `FETCH_HEAD` im nicht erhöhten Skriptaufruf nicht erneut öffnen; die bereits erfolgreiche direkte Fetch-Ausgabe und die unveränderte Remote-Referenz wurden separat geprüft.

### 2026-10-05 – Stalin-Limousine/Kopfbedeckung und Driftregression

**Auftrag/Prio:** Marcels eingefügter Leitauftrag für die autonome Arbeitssitzung gelesen; seine Reihenfolge lautet aktueller Rückstand, Stalin samt individuellem Kart, Laufzeitwelt/-partikel, kontrollierbarer Drift, dann bestätigte Langzeitziele. Budgetfreigabe nicht als unbegrenzt interpretiert; gemeinsamer Puffer aus `AGENTS.md` bleibt verbindlich.

**Modellpass:** `art-source/build_kart.py` ergänzt eine eigene, insignefreie Stalin-Feldmütze mit modellierter Krone, Schweißband, Schirm und Nähten. Vier Limousinen-Art-déco-Radkappen mit emaillierter Fläche, Metallrand, acht radialen Fächern und Nabe hängen je unter `wheelSpin-*`. `src/cast.ts` wählt die neue Mütze und Limousine; `src/slice-scene.ts` aktiviert die Radkappen ausschließlich an dieser Karosserie. Zusätzlich setzt die Laufzeit die sechs Köpfe rund 10 % größer als bisher (`DRIVER_HEAD_SCALE = [.82,.79,.77]`, vorher `.74/.72/.70`) als direkten Proportionspass. Blender 4.5.3 schrieb die editierbare Blend-Datei und Roh-GLB; der Optimierer erzeugte das Runtime-GLB. Rohquelle 7.047.324 Byte, Runtime 5.046.100 Byte; Runtime ist +202.176 Byte (+4,2 %) gegenüber dem vorherigen 4.843.924-Byte-Kartasset. Die Rad-/Fahrerhierarchie bleibt regressiongeprüft. Frischer Runtime-Hauptmenübeleg: [slice-first-inspection-quality-1005f.png](docs/evidence/slice-first-inspection-quality-1005f.png); er bestätigt den Start mit dem aktualisierten Modellpass, zeigt Stalin aber nicht eindeutig nah genug, um seine Details optisch abzunehmen.

**Driftpaket:** die Spielerdriftantwort begrenzt den seitlichen Winkel bei vollem Gegenlenken auf .08 rad plus einen kleinen verbleibenden Steueranteil; die maximale Inside-Gegensteuerung bleibt im Regressionstest bei höchstens .081 rad. Die Bot-Driftentscheidung löst zusätzlich aus, sobald das Fahrzeug mehr als 3,8 m in die innere Kurvenseite gerät. Regression für drei Kurven und 9, 12 und 15 m/s: Drifts bleiben mindestens .35 s aktiv, fahren vor der Innenbarriere aus und kollidieren in den Testläufen nicht mit der äußeren Grenze. `tests/drift-control.test.mjs` und `tests/track.test.mjs` decken Schlupf, Ladung, Gegengas/Lenkung und Kurvenpassagen ab.

**Verifiziert:** `npm test` vollständig 54/54 bestanden (einschließlich Teamworkflow-Fixtures; Laufzeit 248,2 s). `npm run build` erfolgreich, 1.296 Module; bekannte Warnung: ein minifizierter Babylon-Hauptchunk liegt bei circa 2.021 kB. `git diff --check` sauber, nur Windows-Hinweise zur LF→CRLF-Konvertierung. Die erste sandboxierte Vollsuite/Vite-Build scheiterte an `spawn EPERM`; Wiederholung mit Freigabe bestand.

**Browsergrenze:** `tests/drive-polish-browser.mjs` wartete 21 s auf eine echte neue Physikbewegung nach simuliertem Fahrinput und lief im lokalen headless/Software-Renderer aus. Die frühere Diagnose maß dort nur ca. 0,39 FPS und ca. 2,0 s pro Renderdelta. `tests/slice-browser.mjs inspect-driver` bestätigte die Stalin-Auswahl, aber sein abschließender Screenshot war eine leere Rendererfläche; dieser falsche Beleg wird nicht behalten. Keine menschliche Fahrt, Stalin-Nah-/Seitenansicht, Radrotation unter Fahrt, drei Kameras, Turbo/Wandkontakt oder Stilabnahme behaupten. Die automatische Fahr- und Effektvisualprüfung bleibt offen.

**Geänderte Dateien:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `src/cast.ts`, `src/slice-scene.ts`, `src/kart-model.ts`, `src/track.ts`, `tests/cast.test.mjs`, `tests/drift-control.test.mjs`, `tests/track.test.mjs`, `tests/drive-polish-browser.mjs`, `tests/slice-browser.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `docs/evidence/README.md`, `PROGRESS-LOG.md` sowie die gültige Laufzeitaufnahme.


**Arbeitsbereich:** [Aktuelle Arbeit](CURRENT-WORKLIST.md) · [Langfristige Ziele](LONG-TERM-GOALS.md) · [Teamänderungen](TEAM-CHANGES.md) · [Notizen & Anleitung](TEAM-NOTES.md)

[Technischer Fortschritt](PROGRESS-LOG.md) · [Projektstart](START-HERE.md)

### 2026-10-04 – Sprungtrick, Rampenoberfläche und Roadster-Wimpel

**Umgesetzt:** `airTrickRoll` liefert eine gemeinsame zeitabhängige Rollkurve für Karosserie und getrennte Radgruppe; am Ende setzt der volle Kreis auf die identische Vorwärtslage zurück. Ein Regressionstest deckt ausgeschalteten Trick, Start, Halbzeit, Abschluss und ungültige Dauer ab. Die Holzrampenfläche und Stirnseite liegen 5 cm über dem Straßenprofil, das dieselbe Rampe bereits nachzeichnet; dadurch werden die zuvor exakt koplanaren Oberflächen getrennt. `art-source/build_kart.py` ergänzt auf beiden Parade-Wimpeln ein beidseitig sichtbares eigenes Adlerrelief in Messing, ohne Regimezeichen.

**Verifiziert:** Blender 4.5.3 erzeugte die editierbare `art-source/hero-kart.blend` und das GLB; `node art-source/optimize_assets.mjs hero-kart` optimierte die Laufzeitdatei von 3,538,108 auf 2,582,704 Bytes. Der aktualisierte Browserstand zeigt das Adlerrelief auf beiden roten Fahrzeugwimpeln. `npm test`: 49/49; der Strecken-/Trickteiltest: 9/9; `npm run build`: TypeScript und Vite erfolgreich (1,295 Module). Bekannte Warnung zum 2,016-kB-Hauptchunk bleibt.

**Nicht verifiziert:** Die Browserbedienung hielt hier keine Fahrttaste; ein bewegter Sprungtrick und eine direkte Nahaufnahme der Rampe während der Fahrt fehlen. Die Regenszene zeigt Regen, aber die Sichtbarkeit und Deckkraft der begonnenen fünf Wolkenschatten ist noch nicht sauber gegen Sonne/Regen abgenommen. Keine Sarah-Geräteprüfung.

**Geänderte Dateien:** `src/kart-visuals.ts`, `src/slice-scene.ts`, `src/track-world.ts`, `tests/track.test.mjs`, `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `art-source/README.md`, vier Arbeitsdateien und dieser Log.

**Nächster Schritt:** menschliche Nah-/Fahrprobe für Rampen und Lufttrick; anschließend offene M5-Regen-Wolkenschatten mit sichtbarem Regen-/Sonnenvergleich fertig prüfen.

### 2026-10-04 – Bergung nach dem Kanalsprung

**Ziel:** Das Kart nach einem Fehlversuch im quer über die Fahrbahn laufenden Wasserkanal sicher aus dem Wasser bringen und unmittelbares erneutes Einsinken verhindern.

**Umgesetzt:** `recoverKart` erkennt den Kanal und setzt auf die Fahrbahn hinter der Landekante. Der Abstand liegt über der Fortschritts-Toleranz von `advanceRace`; die Bergung vergibt deshalb keine Strecke/Runde. Spieler und Bots nutzen unverändert dieselbe Routine. Hafenbecken-, Lava- und Klippenbergung bleiben unverändert.

**Verifiziert:** Neuer Track-Regressionstest stellt den Fehlerzustand her und belegt eine sichere Position außerhalb der Wasserfläche hinter der Landekante. `npm test`: 48/48 bestanden. `npm run build`: TypeScript und Vite erfolgreich; vorhandene Warnung zum großen Hauptchunk bleibt.

**Nicht verifiziert:** Menschlicher Spielversuch mit einem absichtlich verfehlten Sprung; kein Sarah-Gerätecheck.

**Geänderte Dateien:** `src/track.ts`, `tests/track.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`.

**Offene Probleme:** keine bekannte technische Regression des Kanal-Respawns.

**Nächster Schritt:** Bei der nächsten menschlichen Spielprobe den Sprung absichtlich verfehlen und die Bergung visuell bestätigen; anschließend an den nächsten ausführbaren bestätigten Zielen weiterarbeiten.

**Empfohlenes Modell:** Sol für weitere Gameplay-/Qualitätsarbeit.

## Projektstart und Arbeitslistenabgleich – 04.10.2026 (Codex, Marcel)

**Git / Remote:** Vor Änderungen `git status`, `git log -1`, Branches und Worktrees geprüft. Der ursprüngliche Checkout war sauber auf `00e8173`; `git fetch origin` und `scripts/team-workflow.ps1 -Action Status` bestätigten GitHub-`main` = `00e8173`, neue Babylon-Basis, keine ungesicherten Dateien und keine Überschneidungen. `-Action Start -Owner Marcel` legte `codex/team-marcel-20261004-132611-615` auf diesem Stand an. Kein Spielcode verändert; kein Commit oder Push.

**PC-/Handy-Abgleich:** Neue Spielideen/Abnahmepunkte sowie die vier Arbeitsdateien sind auf dem abgeglichenen Remote-Stand sichtbar. Tests/Build-Belege auf dem Checkout geprüft. Sarahs Abruf von ihrem eigenen Gerät/Konto ist hier nicht einsehbar und wird nicht behauptet. Codex-App meldete für die vier Dateitabs jeweils `queued`.

**Prüfungen:** `npm test` nach Wiederholung außerhalb der Sandbox: **46/46 bestanden** (inkl. Kontakt-/Schadensmodelle und Team-Workflow-Regressionen). `npm run build`: TypeScript und Produktionsbuild bestanden. Vite meldet weiterhin den großen Hauptchunk (2,013.82 kB) als Warnung. Ein erster Sandboxlauf blockierte Kindprozesse (`spawn EPERM`); der gleichartige Lauf außerhalb der Sandbox bestand. Lokaler Dev-Server auf 4173 und sichtbarer Browser: `?demo=1` lädt die laufende Sechs-Kart-Szene, Fahrerperspektive/Verfolgerkameras schalten um, Karosserie startet bei 100 %. Das ist keine menschliche Fahr- oder gezielte Wandkontakt-Abnahme.

**P1 Bestandsprüfung:** `src/kart-model.ts` enthält flaches Wandgleiten und Reaktionen für steilere/frontalere Kontakte; `src/damage.ts` enthält kumulativen Schaden, 35-Punkte-Maximum pro Treffer, Totalschaden, dreisekündige Reparatur und vier Sekunden Reparaturschutz. `tests/kart-model.test.mjs` und `tests/damage.test.mjs` bestehen. Werte wegen ausstehender menschlicher Fahrprobe nicht verändert.

**Quaternius-Basisfigur:** Offizielle Anbieter- und itch.io-Seiten bestätigen CC0, sechs humanoide Figuren und das 122-MB-Standardpaket; das kostenlose Paket bietet glTF, vollständige `.blend`-Quellen liegen im 19,99-USD-Source-Paket. Der Browser zeigte itch.io-CDN-Probleme und lieferte trotz ausgelöstem Gratisdownload keinen abrufbaren lokalen Dateipfad; Datei wurde nicht eingebunden. Blender 4.5.3 ist lokal unter `.tools/` vorhanden. Quellen: [Quaternius](https://quaternius.com/packs/universalbasecharacters.html), [itch.io-Paket/Lizenz/Dateien](https://quaternius.itch.io/universal-base-characters).

**P2-Porträts und erster Gesichtsdetailpass:** In der realen Fahrerwahl standen vor der Änderung die übrigen Karts sichtbar hinter den Head-and-Shoulders-Aufnahmen. `src/slice-scene.ts` zeigt während jeder Aufnahme nur den Fahrer-Zweig, stellt Mesh-Sichtbarkeit/Szenenfarbe/Kartwurzeln im `finally`-Block wieder her und pausiert Partikel bis zur Wiederaufnahme. Die Kamera ist näher auf Kopf und Schultern gerichtet; der Hintergrund ist eine neutrale Studiofarbe. Alle sechs Bilder wurden danach auf `http://127.0.0.1:4173/` geprüft. In `art-source/build_kart.py` wurden der Kopf zum Oberkörper verkleinert, Hautton matter/neutraler, Augen warmbraun und ein kleines Munddetail ergänzt; Blender 4.5.3 speicherte `art-source/hero-kart.blend` und exportierte `public/assets/models/hero-kart.glb`, danach optimiert (zuletzt `2,575,280` Bytes). Das Laufzeitbild wurde erneut geprüft. Es bleibt ausdrücklich Karikaturstufe; erkennbare Gesichtsformen und Cockpit bleiben offen. Späterer Gesamtstand: `npm test` 47/47 und Produktionsbuild bestanden.

**Historische Hupen – erste Quellenprüfung:** Wikimedia Commons listet `Hit43.ogg` als 25-s-Aufnahme mit anonymer Quelle/Urheber und Beschreibung einer 1943er Rede zur Zurückweisung alliierter Bedingungen; Inhalt ist für einen neutralen kurzen Gruß ungeeignet. `It-Benito_Mussolini.ogg` ist nur 2,2 s lange moderne italienische Namensaussprache von Sabine Cretella, lizenziert CC BY-SA 3.0/GFDL, also keine historische Stimme. Keine Datei heruntergeladen oder übernommen. Primärseiten: [Hit43.ogg](https://commons.wikimedia.org/wiki/File:Hit43.ogg), [It-Benito_Mussolini.ogg](https://commons.wikimedia.org/wiki/File:It-Benito_Mussolini.ogg). Suche nach geeigneten historischen Kurzaufnahmen bleibt offen.

**Bots durch die Hinterhofgasse:** `src/track.ts` erkennt den Abkürzungs-Einstieg für Bot-Index 3 vor dem Öffnen des Korridors, benutzt danach `shortcutLocate`/`shortcutPoint` und eine aus der Shortcut-Geometrie berechnete Kurvenvorschau. Nur dieser Bot wählt die schmale Route. Neuer Test simuliert ihn allein, bestätigt tatsächliche Korridornutzung und drei Runden mit fortlaufender Streckenwertung. Der vorhandene Fünf-Bot-Dreirundentest besteht ebenfalls. `npm test`: 47/47; `npm run build` bestanden. Echtes Mehrbot-Fahrgefühl bleibt eine Laufzeitabnahme.

**P2-Sitzprüfung:** Vor jeder neuen Geometrieänderung `art-source/build_kart.py` geprüft: `Seat cushion`, `Seat back shell` und Ziernähte existieren bereits als feste Kartgeometrie. Die Oberschenkel beginnen auf Höhe .9 m bei einer Sitzoberkante von .85 m. Sechs-Kart-Rennansicht aus Verfolgerperspektive zeigt den Fahrer auf dem Sitz; tatsächliche menschliche Sitz-/Beinabnahme bleibt offen.

**Aktueller Stand / nächste Schritte:** PC-/Remote-/Handy-Dokuabgleich abgeschlossen; tatsächlicher Sarah-Abruf offen. P1-Implementierung technisch bestätigt, menschliche Fahrgefühl-Abnahme offen. P2-Porträtisolierung und Studioaufnahme umgesetzt; erster Gesichts-Materialpass umgesetzt, erwachsene Modellierung/Anatomie bleiben offen. Bot 3 fährt die Gasse in der Simulation; sichtbarer Mehrbot-Fahrtest offen. Fahrer-/Cockpit-Qualitätsanker mit den eigenen editierbaren Quellen fortsetzen; freien glTF-Zugang später ergänzen. Historische Hupen: zwei unpassende Quellen ausgeschlossen; geeignete Primärquelle und menschliche Hörprobe offen.

## Neueste Übergabe – 04.10.2026 (Abend, Claude)

Projektstart auf `codex/team-marcel-20261003-232302-374` (Basis main `f784078`), danach autonome Arbeit auf Marcels Auftrag bis zur 95-%-Budgetgrenze und Teamabschluss nach main. Ergebnis: Maus-Kamera-Fix, historischer Startkader (Karikaturstufe), Fahrerwahl mit Live-Porträts, figurenspezifische Wurfobjekte, Panzer nur für Hitler (auch Bot), eigener Marsch statt Klavier, Ziel-Feuerwerk und Siegerporträts. 43/43 Unit-Tests, TypeScript und Produktionsbuild bestanden; Browserbelege im eingebauten Browser der Claude-App gegen den Batch-Server (Port 4173, gleicher Ordner/Branch/Commit laut `/__diktator/status`). Zweite Runde: preußischer Marsch, Zufallswetter mit Schnee, Panzerrad-Fix, Nasen/Wangen. Offen: Marcels Maus-Test in Chrome, Hörprobe des Marsches, Feinschliff der Gesichter, eigene Fähigkeiten der fünf anderen Figuren. Details im Eintrag unten.

## Vorherige Übergabe – 04.10.2026

**Listenfolge verankert (04.10., Marcel):** „Arbeitslisten abarbeiten“ autorisiert kurzfristige Aufgaben und anschließend bestätigte Langzeitziele; Pakete in CURRENT-WORKLIST.md übernehmen, selbstständig umsetzen, verifizieren und dokumentieren. Blockierte Aufgaben erhalten und unabhängig weiterarbeiten; echte Entscheidungen/unbestätigte Vorschläge nicht automatisch freigeben. AGENTS/START-HERE, beide Listen, TEAM-NOTES/TEAM-CHANGES aktualisiert. Nur Dokumentation, keine Spieländerung. Offiziell zu Beginn 6 % Fünf-Stunden-Rest / 71 % Wochenrest; Abschluss dieses kleinen Auftrags, danach keine autonome Großaufgabe. Lokaler Checkpoint, nicht gepusht.

**Qualitätsziel ergänzt (Marcel):** deutlich bessere und realitätsnähere Modelle, historische Charaktere, Fahrzeuge, Strecke, Umgebung, Effekte, Sounds, Stimmen und Musik anhand der gewählten Bildpräferenz G–L. Fertige Stimmen ohne TTS; vorhandene synthetische Clips sind Zwischenstand. Ziel/Aufgaben in LONG-TERM-GOALS.md, Herkunft in TEAM-NOTES.md, Aufnahme in CURRENT-WORKLIST.md und Kurzverlauf in TEAM-CHANGES.md. Abhängige Vorgaben in README, docs/02/05/07/09/10/12/16 konsistent ergänzt. Spielcode/Assets unverändert, keine neue Sicht-/Hörabnahme. Nächster Schritt: laufende Panzeraufgabe und sichtbare Qualitätspakete ausarbeiten. Offizielle Werte zu Beginn dieses kleinen Dokumentationsauftrags: 9 % Fünf-Stunden-Rest, 71 % Wochenrest; lokale Sicherung, keine große Umsetzung begonnen.

Prüfung dieses Qualitätsziel-Eintrags: git diff --check ohne Fehler; zentrale Dateinavigation, lokale Links, Projektmarker und Logmigration bestanden. Nur Markdown geändert, kein erneuter Spielbuild erforderlich. Lokaler Checkpoint; nicht nach GitHub veröffentlicht.

**Zusatzauftrag: Sarahs Altänderungen prüfen.** Frisches `git fetch origin --prune`: kein neuer Sarah-Archivbranch, letzter veröffentlichter Bezug e292070 vom 01.10.2026. Panzer in `client/src/game/abilities.ts` und Überfahrreaktion in `bots.ts` belegt; bereits in 6f6c09d vorhanden. Im aktiven `src/main.ts` Q nur Diagnose, keine Fähigkeit. Katalog aus älterem Kreativauftrag widerspricht letzter Altimplementierung; Quellenunterschied statt stiller Ersetzung ergänzt. Weitere fünf Fähigkeiten, neun Itemtypen sowie d5d3c15/d407079-Bot-/Streckenänderungen im neuen [Abgleich](docs/sarah-feature-audit.md) festgehalten. Persönliche Sarah-Urheberschaft durch übermittelte Aussage, nicht Git-Autor belegt; lokale unveröffentlichte Dateien unbekannt. Keine alte Laufzeitabnahme und keine Panzer-Neuimplementierung behauptet.

Geändert: CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md, TEAM-NOTES.md, dieser Log, docs/14-character-and-item-catalog.md und neuer Abgleich. Nächster Schritt: Claude baut Panzerfähigkeit im Babylon-Spiel; übrige Altideen mit Herkunft priorisieren. Nur Dokumentationsänderung; Spielcode unverändert. Geprüft: git diff --check ohne Fehler, zentrale Links/Navigation/Projektmarker bestanden. Offizielles Limit beim Abgleich: 11 % Fünf-Stunden-Rest / 72 % Wochenrest; keine große Aufgabe begonnen, geordneter lokaler Checkpoint. Dieser Auftrag veröffentlicht keine neuen Änderungen nach main.

Die geprüfte Spielversion **2c6e92d** wurde über den sicheren Team-Finish auf Arbeitsbranch und GitHub main veröffentlicht und durch erneutes Fetch bestätigt. 41 Tests / 41 bestanden, TypeScript und Produktionsbuild bestanden. Abschließender Dokumentationsnachweis ändert anschließend keine Spiel-/Asset-/Skriptdateien. Die vier zentralen Rootdateien und Kurzbefehle sind die tägliche Arbeitsgrundlage; die frühere Gesamtübersicht darunter ist historisch.

Aktuell: Fahrglättung, gehaltene Mausgesten, ruhigere Karosserie/Radkontakt, gegenlenkbarer Drift, Staub, eigener stilisierter Hund, Straßenmöbel und F-Sprachhupe mit eigener Parodie. Offen: echte historische Fahrer, weitere Grafikqualität, menschliche Hör-/Driftabnahme, frei nutzbare authentische Sprachclips und echte schwache-PC-/Mobil-Abnahme. Details/Belege in den datierten letzten Einträgen und CURRENT-WORKLIST.md. Kein Zurückgehen zur Altengine.

## Historische Gesamtübersicht – 03.10.2026

### Verifiziert

- Aktive neue Projektbasis nach der Verzeichnistrennung: `D:\Diktator-Kart`; Altspiel unter `Diktator-Kart-Legacy/`. Die alte Legacy-Kopie und der bisherige Babylon-Planungsordner werden dort als Sicherungen erhalten. Frühere Pfad-/Statusangaben unten sind historische Einträge.
- Alle 15 Antworten auf die Gesamtprüfung sind dokumentiert, einschließlich der ausdrücklich bestätigten Fähigkeitsauslösung über eigene Eingabe und feste Abklingzeit.

- Die neue Babylon-Wissensbasis liegt direkt in `D:\Diktator-Kart`; der frühere separate Planungsordner ist als Sicherung im Altarchiv erhalten.
- Die Wissensbasis enthält Grundpfeiler, Game Design, Art Direction, Babylon.js-Ziele, Performance, Assets, Multiplayer, Gameplay, KI-Modellstrategie, Roadmap, offene Fragen, Altprojekt-Extraktion, Inhaltsgrenzen und Fahrer-/Itemkatalog.
- Die alten Produktionsdokumente enthalten zwölf Fahrerideen, Kartnamen, Spezialfähigkeiten, Itemideen, Botanforderungen, Drift-/Turboideen und Audioideen.
- Die Itemideen wurden in eine machbare Produktionsmatrix mit Aufwandstufen, Fallbacks und Abnahmeregeln übersetzt.
- M1-Babylon-Technikgrundstand ist implementiert. M2a/b ergänzt ein steuerbares Test-Kart mit Gas, Bremse, Rückwärtsfahrt, Lenkung, Hop, Drift und Mini-Turbo; ein vollständiges Rennen existiert noch nicht.

### Nicht verifiziert

- Fahrgefühl des vorläufigen Modells unter realer längerer Nutzung sowie spätere Kollisions- und Federungsphysik
- reale Performance auf Zielhardware
- endgültige historische Inhaltsauswahl und Symbolik
- Qualität der zukünftigen Sprachaufnahmen und Musik
- tatsächliche Machbarkeit aller historischen Fahrer als veröffentlichbare Figuren

### Offene Hauptprobleme

1. Schwachen PC und Android-Testgerät festlegen und Messplan bestätigen; Windows/Chrome sowie Android/iPhone sind entschieden, iPhone 15 Pro ist benannt.
2. Konkrete Landmarken und Symbolgestaltung der beschlossenen Berlin-/Stadionwelt ausarbeiten.
3. M2-Fahrmodell um Federung, Untergründe und echte Kameras ergänzen sowie mit sechs Fahrzeugen und weiterer Zielhardware messen.
4. Exakte Inhalte und Grenzen der Fahrer-/Itemdarstellung gemeinsam abnehmen.
5. Bestätigten Stil G–L mit einem Fahrer/Kart in drei tatsächlichen Kameras prüfen; kostenlose Asset-/Audioqualität praktisch erproben.
6. Bei neuen Altideen den Katalog ergänzen; frühere pauschale Vollständigkeitsansprüche bleiben zu vermeiden.

## Einträge

### 2026-10-04 (Abend) – Claude: Charaktermodell ohne Kugeln, Beine/Pedale, TTS-Hupen

`build_kart.py`: Kopf-Mesh nach Unterteilung per Vertex-Verschiebung modelliert (Brauenwulst, Augenhöhlen, Wangenknochen/-mulden, Kinn, Kieferwinkel), Lofted-Nasen (`nose()`), `hair_shell()` (Kopiefläche mit Haarlinie, Solidify), Schulter-Lofts, Stiefel-Lofts auf den Pedalen, Armaturenbrett y .5/z 1.06, Parade-Front unter `body-roadster`. Mussolini-Hupe wieder TTS (Originalton-Schnitt nur noch nach `.tools/`). Quaternius „Universal Base Characters“ (CC0) als möglicher nächster Schritt notiert. Tests 46/46; Bilder `docs/evidence/2026-10-04-{sculpted-head,portraits-hair-shells,grid-distinct-fronts}.jpg`. Nicht nach main veröffentlicht.

### 2026-10-04 (später Nachmittag) – Claude: Karosserien, Proportionen, Bot-Überholen, echte Stimme

`build_kart.py`: sechs `body-<name>`-Varianten (gemeinsame Räder/Kotflügel/Cockpit), Kopf `scale .7` bei z 1.75; `cast.ts` Feld `body`. Haut-PBR mit Translucency/Sheen, Augen mit Clear-Coat. `botInput`: fünf Spuren, Gewichtung langsamer Vordermänner ×3,2, Bremsen nur bei blockierter Zielspur; Vergleichssimulation alt/neu 9/16 Platzwechsel. Echte Stimme: Commons-Datei (PD) nach `.tools/voice-sources/`, Redebeginn 1,11–4,38 s, `build_voices.mjs` schützt `imperator-horn` (REAL-Eintrag). Bilder `docs/evidence/2026-10-04-{individual-bodies,grid-realistic-heads,portraits-realistic}.jpg`. Tests 46/46. Nicht nach main veröffentlicht.

### 2026-10-04 (Nachmittag) – Claude: Drift, Mechaniken, Zeitfahren, Grafik Hoch

Branch `codex/team-marcel-20261004-110953-055`. Drift: `turn = dir·(.38 + .32·steer·dir)`, `driftYawMultiplier 1.05`, Stufen `driftTiers [.6, 1.1, 1.6]` (Turbo 50/75/100 %). Simulation `botInput`-Lenkung mit erzwungenem Drift (Krümmung > .035): 0 Wandkontakte bei 10/13/16 m/s. Windschatten, Trick, Auto-Gas/Lenkhilfe in `main.ts`; Zeitfahren (`mode`, Geist `dk-ghost-v2`, Bestzeit-Schlüssel v2 wegen größerer Karte); Fix: Itemringe bei < 6 Karts. Grafik Hoch: `SSAO2RenderingPipeline` (ratio .5, 16 Samples) + `VolumetricLightScatteringPostProcess` (Sonnenscheibe, nur Tag/trocken). Laufzeitbilder Rennen 6 Karts/fern/Fahrer in `docs/evidence/2026-10-04-*.jpg`; Pane-FPS ~45 (gedrosselter Testbrowser, keine Zielhardware-Messung). Tests 45/45. Nicht nach main veröffentlicht.

### 2026-10-04 (Mittag) – Claude: größere Karte, Kanalsprung, Lenkung

`MAP_SCALE = 1.5` in `src/track-layout.ts` (Kontrollpunkte, Start, Bodenwelle, Abkürzung, Landmarken, Gefahren, Boostflächen, Krater, Itemkisten, Videowand, Tribünen/Park in `build_world.py`); Strecke 890,9 m statt 593,4 m. `stadium-world.blend/.glb` neu gebaut (Blender-Hintergrundlauf ~14 min, ein Kern). Kanalsprung: `CANAL_FROM = 85 × S` vor den Tribünen, Rampe 9 m/1 m (`trackHeightAt`), Flug `.45 + v·.034` s, Landeschub bei sauberer Landung (`landedClean`), sonst Wasser + Bergung. Beleg: Flughöhe 1,77–2,22 m, „Saubere Landung · Schub!“, Screenshot über dem Kanal. Lenkung: `steerRate 9`, `steerReturnRate 18`, `yawResponse 11`, `steeringPerMetre .134`, `maxYawRate 1.68`. Tests 45/45 (Bot-Rundenzeitlimit ×1,5). Hinweis: eingebauter Testbrowser lief stark gedrosselt; Fahrgefühl nicht menschlich abgenommen. Offen: echte Sprachhupen (Plan in CURRENT-WORKLIST.md).

### 2026-10-04 (Vormittag) – Claude: Arbeitslisten abgearbeitet

Projektstart auf `codex/team-marcel-20261004-094440-433` (main `76234f0`). Umgesetzt: `src/damage.ts` (Haltbarkeit/Wrack, Tests `tests/damage.test.mjs`), Wandgleiten in `kart-model.ts`, Finger/Pedale/Spiegel in `build_kart.py`, feste Hände (Handschuhe am Lenkrad, Arm-Ausrichtung) und Vorderrad-Vorzeichen in `slice-scene.ts`, Tag-Nacht/Sterne/Mond/Vögel/Zeitungen/Wrackteile, Glow-Verdeckung (alle Meshes als Occluder), Gefahren `HAZARDS`/`CRATERS` mit Bergung, Boostflächen, Startschub, Zeppelin, Schnellneustart, Videowand-Renderliste (`renderList = scene.meshes`, refresh 3). Belege im eingebauten Browser (Werte/Bilder), 45 Tests + TypeScript grün. Grenzen: Werte vorläufig, kein echter Fahrtest/schwacher PC; Startschub-Timing nur teilweise geprüft (gedrosselter Testbrowser). Nicht veröffentlicht (kein Projektabschluss beauftragt).

### 2026-10-04 (Abend) – Claude: Kader, Fahrerwahl, Maus-Fix, Marsch

**Auftrag (Marcel):** Projektstart; alten Claude-Worktree löschen (Regel „ein Arbeitsordner“ bleibt); offene Punkte selbstständig mit Wow-Effekten abarbeiten bis 95 % Nutzungslimit, dann dokumentieren und veröffentlichen, damit Sarah per Projektstart nahtlos weitermacht. Während der Arbeit nachgereicht: Maus-Kamera reparieren und Versionsgleichheit ChatGPT/Claude klären, Charakterauswahl mit Porträts, Klaviermusik durch strammen deutschen Marsch ersetzen, Porträts weiter herausgezoomt und ohne Schatten, Schäferhund nur bei Hitler und figurenspezifische Wurfobjekte aus unseren Ideen.

**Versionsklärung:** `src/mouse-camera.ts` war seit ChatGPTs Fix `e5152ab` unverändert; `git diff d2e2e41 f784078` zeigte nur Panzeränderungen an `camera.ts`/`main.ts`. Beide Apps arbeiten im selben Ordner `D:\Diktator-Kart`; der Batch-Server meldet Ordner, Branch und Commit. Wahrscheinliche frühere Abweichung: der inzwischen gelöschte Claude-Worktree-Server (Port 4176) zeigte wegen der `.claude/`-Ignorierregel einen alten Stand.

**Maus-Fix:** Die gehaltene Geste brach ab, wenn `requestPointerLock` abgelehnt wird (eingebettete App-Browser, Chrome-Sperre kurz nach Esc). Jetzt läuft sie über Pointer Capture (`pointermove`/`movementX`) weiter; Lock bleibt die bevorzugte Variante. Beleg: synthetische Pointer-Ereignisse ohne Lock drehen die Kamera (Position 60.51/-52.05 → 55.51/-43.92), Rechtsklick schaltet Rückblick, Loslassen stellt zurück. Nicht belegt: echter Test mit Maus in Marcels Chrome.

**Startkader:** `art-source/build_kart.py` erhält Teile `sidepart`, `toothbrush`, `swept`, `walrus`, `pipe`, `chin`, `maohair`, `undercut`, `patrol`, `cigar`; bisherige Haare/Orden/Epauletten/Kragenspiegel als schaltbare Teile (`shorthair`, `medals`, `epaulettes`, `collartabs`). `src/cast.ts`: sechs Figuren mit Altfarben, Kartnamen, Titeln aus docs/14, Haarfarbe, Wurfobjekt. Haarmaterial mit leichtem Glanz. Keine Regimezeichen. Stimmen: Kim/Castro neue männliche Piper-Platzhalter (`kim-*`, `castro-*`), Diva/Admiralin entfernt; übrige Stimmdateien unverändert.

**Fahrerwahl:** `#driver-select` in `index.html`, Logik in `main.ts` (`openSelection`/`pick`/`confirmSelection`, `localStorage dk-driver`), Kader-Umkleidung `setRoster` und Live-Porträts `portraits` (Render-Target-Screenshots mit Studiolicht, Sonnenschatten aus) in `slice-scene.ts`. Revanche behält die Figur. Einmal beobachtet: erste Auswahl startete mit falscher Figur (Kim statt Castro); in zwei Wiederholungen nicht reproduzierbar – bei erneutem Auftreten melden.

**Wurfobjekte:** `item-scene.ts` baut zur Laufzeit einfache Modelle (Traktor, Megafon, Regelheft, Rakete, Aktenkoffer); Schäferhund nur für Hitlers Kart; Fallen bleiben der neutrale Stempel. Quellen: bewegliche Altdetails in docs/14 (Lautsprecher, Regelheft, Aktenkoffer), Kartnamen (Rakete, Fünfjahresplan), Marcels Hund. Stalins Traktor ist abgeleitet und bestätigungspflichtig. Beleg: Castro wirft „Aufklappender Aktenkoffer“ (HUD/Objekt), Kim „Mini-Propaganda-Rakete“.

**Panzer:** Nur Hitler besitzt „Größenbefehl“. `botWantsAbility` lässt den Hitler-Bot bei Gegnern unter 9 m verwandeln; der Panzer hängt am jeweiligen Hitler-Kart. Beleg: als Castro `transform: 1`, Bot-Slot 1 `tankRemaining 7.5`, Q zeigt „eigene Fähigkeit folgt“.

**Musik:** `fig-leaf-rag.mp3` entfernt (Credits/Manifest angepasst). Neu `public/assets/audio/march.wav` (4,5 MB, 103 s, 22 kHz mono) aus `art-source/build_march.mjs`: eigene Komposition, kein Sample. Marcels erster Höreindruck: „lustig, aber nicht wirklich deutsch“ → zweite Fassung strammer (118 bpm, punktierte Rhythmen, große Trommel auf jedem Schlag). Zweite Fassung nicht menschlich abgenommen.

**Wow:** Ziel-Feuerwerk (Partikelpool 1200, vor der Spielerkamera, reduziert bei „Effekte reduziert“), Siegerkarte mit Siegerporträt und Mini-Porträts. Beleg: Screenshots mit sichtbaren Bursts und Porträts.

**Worktree:** `.claude/worktrees/diktator-kart-quality-level-f851c0` aus Git ausgetragen, lokaler Branch gelöscht (war identisch mit main), `parade-tank.glb`-Rohdatei nach `.tools/raw-models` übernommen. Der leere Ordner ist von der Claude-App gesperrt und bleibt (ignoriert). Remote-Branch unverändert.

**Prüfung:** `npm test` 43/43, `tsc --noEmit`, `npm run build` bestanden. Browserproben siehe oben (eingebauter Browser, RTX-Laptop; keine schwache-PC-/Mobilmessung).

**Nachtrag nach Veröffentlichung 253f44e:** Marcels neue Teamregel (gestaffelte Commits/Doku, Pflicht beim Projektabschluss) in AGENTS.md/CLAUDE.md Regel 3 und TEAM-CHANGES.md; keine Spieländerung.

**Zweite Runde (Marcels Auftrag bis 98 % Budget):** (1) `build_march.mjs` neu: preußischer Spielmannszug-Stil, eigene Komposition (Intro Trommelmarsch, A mit Querpfeifen, A/B mit Blech in Oktaven, Trio, Grandioso), 108,6 s, 4,8 MB; Hörprobe offen. (2) Wetter: `weatherChoice` random/sun/rain/snow (`localStorage dk-weather-choice`, URL `?weather=`), Zufall beim Laden 50/25/25; neuer Schnee in `slice-scene.ts` (`setWeather`, 2200 Flocken, Licht/Nebel, `trackWorld.setSnow` mit Emissive-Aufhellung, weißer Reifen-/Landestaub); keine Grip-Änderung. Beleg: Screenshot mit Flocken und frostiger Straße, 2200 aktive Partikel, keine Konsolenfehler. (3) Panzer: `tankWheels` filterte per `/tankWheel-/` auch die gejointen Rad-Meshes und löschte deren Achsrotation → jetzt nur `/tankWheel-[LR]-\d+$/`; Beleg Seitenansicht mit runden Laufrollen. (4) Gesichter: Teile `bignose`, `straightnose`, `flatnose`, `chubby`, Undercut-Hinterkopf, breitere Stirnlocke; Beleg Fahrerwahl-Porträts. (5) Minikarte in Kartfarben. (6) Fahrerwahl-Button „Zufällig“ (wählt stets eine andere Figur; Beleg Hitler→Mussolini→Hitler) und Wurf-Spruch für Nicht-Hitler-Figuren mit 6 s Sprecherpause. (7) Siegerspruch auch für siegende Bots, Rennlabel mit Figurennamen (Beleg „STADION GRAND PRIX · HITLER“, Zielkarte Platz 2 hinter Bot). (8) Tasten 1–6 in der Fahrerwahl (Beleg: 4 → Mao) und Atemanimation des gewählten Porträts (abschaltbar über reduzierte Bewegung). (9) Wurfobjekt-Symbole auf den Fahrerkarten (Beleg 🐕/🚜/📢/📕/🚀/💼) und Bellen des Hitler-Bots in Spielernähe (nicht hörbar geprüft); Rennen ohne Konsolenfehler. 43/43 Tests, TypeScript bestanden.

**Nächster Schritt:** Marcel/Sarah: Maus in Chrome, Marsch anhören, Fahrerwahl und Karikaturen beurteilen, Stalins Traktor bestätigen; danach Gesichter verfeinern und eigene Fähigkeiten der fünf Figuren nach gemeinsamer Entscheidung. ab gemeinsamer Hauptbasis

Ältere Einträge (Planung, M1–M2, Vertical Slice, Qualitätsstufen 2–2d): [Archiv](docs/history/progress-log-2026-10-02-bis-q2d.md).

### 2026-10-03 – Claudes Q2d als gemeinsame Hauptbasis, Starter und Team-Git

**Nutzerauftrag:** Claudes aktuelles Spiel statt altem Starterstand nutzen; bisherigen GitHub-main als Sarah-Stand sichern, ohne alte Inhalte zu übernehmen; neuen main publizieren und einfachen KI-Start-/Abschlussablauf für beide PCs bereitstellen. Zusätzlich ausdrücklich: alte Engine/Altstände nur historische Referenzen, nicht mehr bearbeiten. Konzeptbild-Ladebildschirm als nachgelagerter Auftrag, erst nach dieser Umstellung.

**Ausgang / Sicherung:** Root auf 5f14a2d, Claude-Worktree auf c13d47e; Claude-Spieldateien committet, lediglich lokale .claude/launch.json untracked. Origin https://github.com/marceldamm/diktator-kart.git nach fetch: main e292070; lokales main 2d95e8a divergiert. Vor Umstellung auf GitHub publizierte Archive: archive/sarah-main-vor-babylon-2026-10-03 → e292070, archive/lokaler-main-vor-babylon-2026-10-03 → 2d95e8a, archive/claude-quality-2026-10-03 → c13d47e. „Sarah“ bezeichnet den vom Nutzer genannten bisherigen gemeinsamen Stand; Commitautoren belegen nicht jeden Beitrag als Sarah. Private ungesicherte Dateien auf ihrem PC sind nicht zugänglich und beim ersten lokalen Projektstart dort zu sichern.

**Umgesetzt:** Vollständigen Claude-Baum in codex/team-baseline-2026-10-03 übernommen. Einmaliger ours-Merge 13a123a verbindet origin/main-Historie, ohne dessen alte Spielinhalte zu übernehmen; keine Historie gelöscht/erzwungen. project-state.json kennzeichnet Babylon/mainline und Mindestabstammung c13d47e. Starter arbeitet vom eigenen Hauptordner; HTTP-Identität prüft exakten Root/Edition/Commit statt nur Titel/Manifest. Fremde/alte Server bleiben bestehen, freier Port wird angezeigt. Aktueller Devserver wieder auf 4173 mit neuem Q2d-Spiel. Vite beobachtet ignorierte Tools/Browserprofile/Worktrees nicht mehr. Node-Pakete aus unverändertem Lockfile installiert; npm-Audit 0 Schwachstellen. Ein von Codex stammender alter Preview auf 4174 wurde gezielt beendet, weil er den npm-Bindingtausch blockierte; keine Benutzer-Chrome-Sitzung beendet.

**Teamablauf:** Projektstart/Projektabschluss als zwei Repo-Skills und Batches. Start fetch/Status/Überschneidungen, Sicherung, eigener Arbeitsbranch; alte Arbeit archivieren statt Engine-Code migrieren. Abschluss dokumentierter Commit, normaler Merge, Tests/Build, Branch-Push und Fast-Forward-main mit erneuter Remoteprüfung. Uncommittete Dateien, Konflikte, Testfehler und concurrent main stoppen ohne Datenverlust. Netzwerk/Branchschutz nicht umgehen. Dauerregeln in AGENTS/CLAUDE/README/START-HERE/TEAM-HANDBOOK; Details docs/21, Spiel-/Toolübersicht docs/22. Grundpfeiler 00/08/09/10/11/12/16/18 geprüft und aktuellen Einstieg ergänzt; historische Logs erhalten.

**Erneut verifiziert:** 25 Modelltests und Produktionsbuild bestanden. Sieben isolierte lokale Git-/Startertests bestanden (keine echten GitHub-Testmutationen): Dirty-Schutz, parallele Integration/FF-Publikation, echter Konflikt, Altstand-Archivierung ohne Kopie, concurrent main während Build, Testfehler, Port-/Root-Unterscheidung. Beide Skills bestehen offiziellen quick_validate.py. Starter -CheckOnly erkennt aktuellen Root auf 4173 als denselben Checkout. Browser auf isoliertem Chrome 9226: Menü/Fahrt/drei Kameras/Foto/Pause/Countdown/Szenenneustart mit sechs Karts bestanden, keine Ausnahme. Neue Spielbilder *-team.png. Claudes ausführliche Renn-/Item-/WebGL-/Touchbelege bleiben als dort dokumentierte Ergebnisse erhalten; in dieser Teamumstellung nicht erneut alle wiederholt.

**Messgrenzen:** RTX 3070 Laptop, 1600 × 1000; kurzer F3-Stand 49 FPS/P95 32,5 ms/P99 40,3 ms (kein kontrollierter Dauerlauf). Keine Garantie stabiler 60 FPS. Build-Hauptchunk 2,19 MB/549 kB gzip, Größenwarnung bleibt. Schwache PCs/echte Mobilgeräte, Audiohörqualität, menschlicher Komfort und G–L offen. Videowand kostet Zusatzrenderpass; kein neues Performanceziel beschlossen.

**Geänderte Dateien:** Team-/Startskripte/Batches; project-state.json, vite.config.ts, .gitignore, tests/team-workflow.test.mjs und konfigurierbarer CDP-Port; Repo-Skills; AGENTS/CLAUDE/README/START-HERE/TEAM-HANDBOOK und betroffene Dokumente/Belege. Spielmodelle und Fahrkern aus Claude unverändert übernommen. Der aktive historische Kader ist nicht endgültig produziert; fiktive Figuren bleiben Platzhalter.

**Publikation:** Initiale main-Übernahme vom Nutzer ausdrücklich freigegeben; nach diesem verifizierten Checkpoint normaler Push und Rückprüfung, Basistag babylon-team-baseline-2026-10-03. Keine pauschale zukünftige Altcode-Migration; reguläre aktuelle Teamänderungen werden inhaltlich integriert. GitHub-Erfolg erst nach Rücklesen im Ergebnisbericht bestätigen.

**Nächster Schritt:** Nach bestätigter Hauptumstellung den gewünschten frühen Konzeptbild-Ladebildschirm samt ehrlicher Fortschrittsanzeige bauen. Sarah einmal Initialumstieg aus docs/21 ausführen lassen; danach täglicher Projektstart/Projektabschluss. Regen/echtere Fahrer/Abkürzungsbots bleiben anschließende Produktionswünsche, keine bereits fertigen Features.

**Budget:** Letzte offizielle Abfrage: 12 % Fünf-Stunden-/16 % Wochenverbrauch, kein Reset/Zusatzkontingent. Kein Ruhezustand.

### 2026-10-03 – Konzeptbild-Ladephase nach abgeschlossener Teamumstellung

**Auftrag / Reihenfolge:** Erst Starter/Git/teamfähigen neuen Hauptstand abschließen, anschließend den ungestalteten weißen HTML-Start durch Konzeptmotiv und Ladeanzeige ersetzen. Initiale Hauptumstellung 845c0bf tatsächlich nach GitHub main gepusht, zurückgelesen und babylon-team-baseline-2026-10-03 gesetzt; drei Archive unverändert gesichert. Danach echten Projektstart -Owner Marcel ausgeführt: eigener Branch codex/team-marcel-20261003-195001-659 auf aktuellem origin/main. Keine Claude-Worktree-/Legacy-Änderung.

**Umgesetzt:** Eigenständiges helles G/J-inspiriertes Imagegen-Motiv, PNG-Rasterquelle und Motivauftrag erhalten; nur WebP-Konvertierung, 376.504 Bytes statt 2.734.128 Bytes bei gleicher 1672 × 941 Pixelgröße. Keine kopierte Referenztextur; Konzeptkunst klar beschriftet, keine 3D-Qualitätsbehauptung. Kritisches Inline-CSS sowie vom Babylon-Modul unabhängige Fehler-/Wiederholenhilfe in index.html verhindern den weißen/unformatierten Start. Echte sechs Ladeabschnitte über LoadingProgress und optionale Szenenreporter, keine Timerprozente; Techniklabor zwei Abschnitte. Abschluss erst nach whenReadyAsync und erfolgreichem ersten scene.render; danach wirkliches 3D-Menü. Neustart erzeugt frischen Fortschritt. Modul-/Modellfehler behalten Ladeoberfläche samt freundlicher Meldung, optionalen Fehlerdetails und Reload; langer Start bietet nach 45 s Wiederholen, ohne ihn abzubrechen. Artwork-Fehler belässt lesbaren dunklen Hintergrund.

**Verifiziert:** Zwei neue Unit-Tests für Mehrfachmeldungen/Neustart und Labor ohne importierte Artassets bestanden. Produktionsbuild/TypeScript bestanden, bisherige Größenwarnung unverändert (Hauptchunk 2.192,25 kB / 549 kB gzip). Isolierter Chrome 9226 gegen echten Produktionspreview 4174: initiales Bild bereits bei angehaltenem Spielmodul, übriges HTML unsichtbar, 390 × 844 Layout ohne Überbreite und reduced-motion; Moduldownload unterbrochen → Fehlermeldung → erfolgreicher Retry; echte Fortschrittsfolge 0..6, sechs Fahrzeuge und gerendertes Menü; Hero-GLB unterbrochen → Fortschritt stoppt bei 3/6 → Retry lädt; vollständiger Szenenneustart wieder 0..6; Labor 0..2. Test erzeugt keinen künstlichen Produktions-Ladestopp, sondern pausiert nur Browserrequests für Belege. Rohdaten und tatsächliche Browserscreenshots in docs/evidence/loading-*. Vorherige Teamprobe mit Fahren/drei Kameras/Countdown/Pause bleibt getrennt dokumentiert. Der reale Projektabschluss hat 34/34 Tests einschließlich des erweiterten Startertests und den Produktionsbuild bestanden. 78cf363 anschließend auf Arbeitsbranch und GitHub main normal gepusht und durch fetch/ls-remote zurückgeprüft; Archive und Basistag unverändert. Vollständiger Gatebeleg: docs/evidence/team-final-publication.txt. Der folgende reine Dokumentationscheckpoint ergänzt diese Ergebnisse; Spielcode und Assets entsprechen unverändert dem geprüften 78cf363.

**Zusätzliche Starterkorrektur:** HTTP-Identität unterscheidet jetzt mode=dev/preview; die Batch akzeptiert nur denselben aktiven Entwicklungscheckout, niemals eine möglicherweise veraltete dist-Vorschau, auch nicht mit passendem Root. Der vorhandene Startertest deckt beide Fälle sowie fehlende mode-Kennung ab. Eigene vorherige Dev-/Preview-Testprozesse nach genauer PID-/Elternprozess-Zuordnung geschlossen; kein fremder Server oder Benutzerbrowser beendet. npm ci mit aktuellem Lockfile erfolgreich (38 Pakete, Audit 0), finaler Entwicklungsserver auf 4173. Kein Lockfile geändert.

**Nicht verifiziert / Grenzen:** 390-Pixel-Ansicht ist Chrome-Emulation, keine mobile Geräteabnahme. Keine schwache-PC-/neue FPS-/Audiohör-/G–L-Abnahme. Ladeabschnitte sind unterschiedlich groß und keine Byte-/Zeitprozente. Kunst bleibt Raster-Konzeptillustration, nicht editierbare 3D-Geometrie. Kein absichtlicher Mindest-Ladeaufenthalt; mit warmem Cache kann sie kurz erscheinen. Historische Besetzung und Sarahs kreative Freigaben bleiben offen.

**Geänderte Dateien:** index.html, src/style.css, src/main.ts, scene.ts, slice-scene.ts, neue loading-progress.ts; tests/loading-progress.test.mjs und loading-browser.mjs; art-source/loading-stadium-v1.png/.md und README; public/assets/textures/loading-stadium-v1.webp, manifest/CREDITS; START-HERE und docs/02/19/22/17/evidence. Zusätzlich vite.config.ts/scripts/start-local.ps1 und Starter-Gittest für sichere Dev-/Preview-Unterscheidung. Fahrmodell, Kurs, 3D-Modelle und Audio unverändert.

**Nächster Schritt:** Sarahs einmaliger geschützter Umstieg gemäß docs/21; anschließend täglicher Projektstart/Projektabschluss. Für die nächste Spielproduktion Drawcalls/Ladegruppen und Zielhardware prüfen oder sichtbare Charakter-/Wetterpolitur planen; keine bereits fertigen Wetter-/Charakterfeatures behaupten. Kein Ruhezustand.

**Budget:** Letzte offizielle Abfrage 22 % Fünf-Stunden- und 18 % Wochenverbrauch; mindestens 78 % Rest im maßgeblichen Limit. Kein Reset oder Zusatzkontingent.

### 2026-10-03 – Maussteuerung bewusst per Ziehen

**Auftrag:** Nutzer beanstandet dauernde Kamerabewegung bei freier Maus; erlaubt passendere Belegung statt Linkstaste. Anschließend zusätzlich Fahrt-/Kameraruckeln untersuchen (separates folgendes Arbeitspaket).

**Umgesetzt:** Projektstart auf aktuellem main 3c3ec5f, eigener Branch codex/team-marcel-20261003-202647-623. Rechte Taste halten + ziehen dreht die Kamera, freie Mausbewegung wirkt nicht mehr. Linksklick/E weiterhin Item; X halten Rückblick; Wheel Zoom. Sichtbarer freier Cursor, kein Pointer Lock, Grabbing-Cursor nur während der Geste. Pointer Capture und vollständiges Loslassen bei Release/Blur/Hidden/Menu/Pause/Restart/Viewwechsel. Kamera hält die Richtung während des Haltens, zentriert danach weich statt erst nach zwei Sekunden. Kamera-/Rennneustart löscht alte Look-Offsets.

**Verifiziert:** Produktionsbuild/TypeScript bestanden. Eigener Chrome 9227, 1280 × 800, normale Spielwelt mit einem Kart: alle drei Ansichten ohne Hover-Bewegung, gezielter Drag, mehr als zwei Sekunden stabiles Halten, weiches Zentrieren, X-Rückblick samt Release; Menü und simuliertes Blur lösen Capture; Linksklick erzeugt ausschließlich Item-Eingabe, Maus bleibt ohne Pointer Lock. Keine Runtimeausnahme. Rohdaten docs/evidence/mouse-camera-check.json, Tests tests/mouse-camera-browser.mjs. Kein menschlicher Komforttest oder Hardware-Performancebeleg.

**Geändert:** src/mouse-camera.ts, main.ts/camera.ts/input.ts/style.css, index.html, Browsertest/Beleg, README/START-HERE/docs19/22/17/12. Keine Fahrphysikänderung in diesem Paket.

**Nächster Schritt:** Das vom Nutzer beschriebene kurzzeitige Zurückbleiben/Aufholen bei gerader Fahrt anhand Simulationsschritten, Renderposition und Kamerazeit messen und beheben. Mausarbeit lokal sichern; gemeinsamer Abschluss nach beiden Paketen.

### 2026-10-03 – Darstellung zwischen Physikschritten statt Positionsruckeln

**Auftrag / Ursache:** Nutzer beschreibt minimales periodisches Stehenbleiben/Zurückbleiben von Kart und Kamera bei gerader Fahrt. Belegt im Code: feste 60-Hz-Simulation, Darstellung jeweils des zuletzt fertigen Schrittes; Restzeit ungenutzt. Nicht jede Millisekundenbeschreibung beweist eine einzelne GPU-Ursache.

**Umgesetzt:** src/render-state.ts interpoliert ausschließlich Darstellungswerte (Pose, Lenkeinschlag, Tempo/Federung) zwischen zwei vollständigen Zuständen. main speichert vorherigen Zustand pro Fixschritt, zeichnet Kart/Bots und Kamera aus derselben Pose; Items bleiben auf derselben autoritativen Simulation. Event-/Treffertimer unverändert, große Teleports direkt statt Wandsweep. Neustart/Rennstart setzen Snapshots zurück. __DK.render zeigt alpha/Schrittanzahl/Renderpose. Physikgleichungen/Rennregeln unverändert; bis zu 16,7 ms Darstellungsverzögerung.

**Verifiziert:** Drei neue Modelltests bestehen: konstante Bewegung bei 30/60/90/144 Hz und ungleichmäßigen Zeiten; Anglewrap, Zustand unverändert und diskrete Treffer; Recovery-Sprung. Produktionsbuild/TypeScript bestanden. Eigener Chrome 9227, 1280 × 800, echte Welt/sechs Karts, kurzer freier Geradeauslauf bei 16 m/s: bezogen auf Engine-Schrittdauer sichtbare Geschwindigkeitsabweichung vorher durchschnittlich 2,50 m/s (8,71–19,83 m/s), nachher numerisch ~0 (16,00–16,00). Autoritative Position darf weiterhin in festen Schritten laufen. Rohdaten docs/evidence/drive-pacing-before.json und drive-pacing-after-interpolation.json; Probe tests/drive-pacing-browser.mjs. Zeitstempel nach Renderende sind keine perfekte Display-/VSync-Messung; Enginezeit und Wandzeit bewusst getrennt ausgewertet.

**Grenzen:** Kurze Frame-Wandzeitstichproben weiterhin P95 47 / 42,7 ms bei möglicher gleichzeitig offener Nutzersitzung. Keine kontrollierte FPS-Abnahme, keine Behauptung völlig ruckelfreier GPU-Bildausgabe. Keine menschliche Komfort-/schwache-PC-/Handyabnahme. 60-FPS-Ziel unverändert. Fahrzeugvibrationen werden auf zusätzlichen ausdrücklichen Wunsch als nächstes reduziert.

**Dateien / nächster Schritt:** render-state.ts/main.ts, tests/render-state.test.mjs/drive-pacing-browser.mjs, Browserrohwerte, docs03/04/17/23. Nutzerergänzungen vollständig in CURRENT-WORKLIST.md: endgültige linke Look-/rechte Rückblick-Geste mit temporärer Cursorbindung, weniger Wackeln/Acceleration-Pose, beidseitiges Driftladen und Staub, historische Atmosphären-/Satiredetails, Schäferhund-Verfolger. Danach gezielter Gesamttest/Teamabschluss.

### 2026-10-03 – Aktueller menschlicher Fahrbefund und präzisiertes Modellziel

**Nutzerbefund:** Nach Renderinterpolation wesentlich flüssiger, deutlich besseres Fahrgefühl. Das ist eine menschliche Rückmeldung, keine GPU-/Geräteabnahme. Neuer konkreter Mausfehler: rechter Rückblick bricht sofort ab; links noch kein Umschauen. Aktive Korrektur und Browserregression folgen.

**Zieländerung:** Erkennbare, realitätsnahe Abbilder echter historischer Personen und glaubwürdige Spielwelt gewünscht, insbesondere Hitler statt erfundener Ersatzperson. Die missverständliche Formulierung in der laufenden Liste entfernt; Modellqualität wird nicht als bereits erreicht ausgegeben. README, Art Direction, Roadmap, Fragen/Katalog geprüft und mit ausdrücklicher Präzisierung versehen. Aktueller Stand und Ziel getrennt; Sarahs ursprüngliche Ideen bleiben nachvollziehbar.

**Nächster Schritt:** Mausfehler abschließen, Fahrzeugpose/Drift/Staub, historische Umgebungsdetails, Schäferhund und realitätsnaher Fahrerpass im Rahmen des offiziellen Restbudgets.

### 2026-10-03 – Endgültige Mausbelegung und abgebrochenen Rückblick korrigiert

**Umgesetzt:** Linke Taste frei umsehen, rechte Taste/X Rückblick, E Items. Temporärer nativer Pointer Lock während Halten; Cursor unsichtbar, native Rückkehr an Ursprungsposition. Freiere Rundumsicht/vertikaler Blick; weiche Rückzentrierung, Freigabe an Menü/Blur/Neustart. W3C-belegter Fehler: Lock beendet Pointer Capture; lostpointercapture darf dabei nicht die laufende Geste beenden. Das erklärt und korrigiert den vom Nutzer gemeldeten sofortigen Rücksprung.

**Verifiziert:** tests/mouse-camera-browser.mjs besteht in eigenem fokussierten Chrome 9227: alle drei Kameras, Hover unverändert, linke Geste stabil >2 Sekunden, rechte Rücksicht stabil, Loslassen zentriert; Menü/Fokusverlust lösen Bindung, E bleibt Item. Keine Runtimefehler. Rohdaten docs/evidence/mouse-camera-final-check.json. Nicht behauptet: sichtbare OS-Cursorpixel per Headless überprüft; Wiederherstellung durch native Browser-API, noch Nutzercheck im eigenen Browser.

**Dateien / nächster Schritt:** mouse-camera/camera/main/style, index, Browserregression, README/START-HERE/docs19/22/23/17. Danach Karosserie/Drift/Staub.

### 2026-10-03 – Ergänzung aus laufendem Fahrtest: Sprache und F-Hupe

**Neue Nutzeraufträge:** Unverständliche Wörter/komische Aussprache der gesprochenen Texte überprüfen; weniger statisch/mechanisch, freundlichere Stadionsprecherin. F soll eine individuelle Sprachhupe je Fahrer auslösen. Echte unproblematische historische Mitschnitte erwünscht; Quelle, Identität und Nutzungsrechte vor Verwendung prüfen, keine falsche Authentizität.

**Status:** In CURRENT-WORKLIST.md aufgenommen; nach laufender Fahrzeug-/Driftarbeit bearbeiten. Noch keine Hörprüfung oder Mitschnittfreigabe behauptet.

### 2026-10-03 – Fahrzeug beruhigt, Gegenlenk-Drift und Staub

**Umgesetzt:** Ungefederten Radrahmen von Karosseriepose getrennt. Weniger Roll/Vibration, stabile exponentielle Rückkehr statt unterdämpfter Federschwingung; dezente Beschleunigungs-/Tempo-Haubenhebung, Räder unabhängig auf Terrain. Drift bleibt in Initiierungsrichtung, Gegenlenken öffnet Radius und lädt ebenfalls; Neutral lädt langsamer, Reiseausrichtung/Schlupf begrenzt. Größerer begrenzter Reifenstaub, 150er Pool/reduzierte Effekte.

**Verifiziert:** Produktionsbuild besteht. 16 gezielte Fahrmodell-/Drifttests bestehen, einschließlich beider Richtungen, Gegenlenk-Ladung, Kurvenweite, Turbo-/Bremsfreigabe, Federung und Langlaufkontakte. Near-head-on-Test berücksichtigt bewusst die kleine neue tangentiale Driftbewegung und verlangt >95% Geschwindigkeitsverlust samt Drift/Turbo-Abbruch. Browser, normale Welt/sechs Karts: Radzentren entsprechen Terrain+Radius während Haubenpose; Staub emittiert; echtes W/D/Space/A-Gegenlenken lädt, Richtung bleibt, Release gibt Turbo; Neustart setzt zurück. Rohdaten docs/evidence/drive-polish-check.json, Screenshot drive-polish-turbo-v1.png aus tatsächlicher Szene während Pause nach Turboauslösung. QA-Kart zu Beginn auf klare Gerade positioniert, danach reale Eingabe. Frühere QA-Starts fuhren während Screenshotwartezeit an die Bande; Prüffahrt korrigiert, kein falscher Turbo-Erfolg behauptet.

**Grenzen / nächste Arbeit:** Noch keine menschliche Drift-/Animationsabnahme, keine schwache-PC-Abnahme. Nächster Schritt Schäferhund, Umgebungsdetails, realitätsnaher Figurenpass, Sprache/F-Hupe. Maus bereits e5152ab lokal gesichert.

### 2026-10-03 – Drei verbindliche Team-Arbeitsdateien

**Auftrag / Umsetzung:** Marcel will eine aktuelle Liste, große Langzeitliste und kurzen elementaren Änderungsverlauf statt technischer Überdokumentation. docs23 weitergeführt, docs24 aus Roadmap/Grundpfeilern/Katalog und Nutzerwünschen erstellt, docs25 wenige Teamänderungen. Nachricht an Sarah mit beiden KI-Befehlen/Umstieg/Modellwahl direkt in docs23. Kein Versand.

**Verankert:** AGENTS/START-HERE/README/Handbuch/Framework/Roadmap/Blueprint/Teamablauf und beide Repo-Skills. project-state nennt die drei Dateien; Git-Start/Finish zeigen sie an und prüfen beim neuen Marker ihre Existenz. KI liest/aktualisiert sie inhaltlich; Batch behauptet keine autonome kreative Konfliktlösung. PROGRESS-LOG.md bleibt technische Belegquelle, TEAM-CHANGES.md kurz.

**Verifiziert / Grenzen:** Modellhinweise mit offiziellen OpenAI-Seiten abgeglichen; Sol für qualitäts-/zeitbewusste Arbeit, Astra für schwierige Aufgaben, keine Ranglistengarantie. Beide Repo-Skills mit quick_validate validiert; neue Skriptregression besteht: fehlender Teamverlauf stoppt Veröffentlichung und erhält Remote-main. Die drei Dateien anschließend ohne Nummer in den Hauptordner verschoben, alle aktiven Verweise/Marker/Tests migriert. Öffnen als App-Tabs dreimal angefordert; Tool meldete queued, Anzeige beim Zurückkehren in diese Sitzung. Sarahs tatsächlicher PC/Account noch nicht getestet.

### 2026-10-03 – Editierbarer Schäferhund als Spieler-Item

**Umgesetzt:** Eigener schwarz-brauner Schäferhund in Blender mit spitzer Ohr-/Schnauzensilhouette, Fellflächen, Augen, Halsband, vier Beinpivots und Schwanz. Editierbare .blend, reproduzierbarer Erzeuger, optimiertes GLB 208.808 Bytes. Spieler direct/homing laufen mit Hundedarstellung am Boden; identische unveränderte Itemsimulation, Bots bisherige postalische Formen. Eigener .68-s-Doppelbelllaut, HUD/Hinweise, begrenzte Comic-Trefferwolke. Zwei feste Hundepools, keine Meshallocation beim Fahren.

**Verifiziert:** TypeScript/Produktionsbuild bestanden. Eigener Chrome 9227, normale Welt/sechs Karts, kontrollierte Slots/Positionen: echtes E startet direct/homing, Hundeknoten laufen, bestehende Trefferlogik trifft gezielt auf Pfad positionierten Gegner, Meshzahl konstant; WAV per AudioContext dekodiert, Peak <1. Browserbeleg shepherd-browser-check.json. Keine angebliche menschliche Hör-/Modellrealismusabnahme. Früher direkter Test ohne kontrolliertes Ziel verfehlte bewegten Bot; das beweist keine garantierte Trefferquote. Screenshots stammen aus Spiel, normale Kameras zeigen Hund teils verdeckt/kurz; Nahprüfung ergänzt: shepherd-art-inspection-v1.png zeigt den tatsächlichen laufzeitgerenderten eigenen Hund, pausierte normale Sechskart-Szene mit gezielter Prüfplatzierung/Inspektionskamera. Klar stilisierte Form; kein realitätsnahes Tiermodell behauptet.

**Nutzerwunsch Sichtbarkeit:** Unsichtbaren eigenen Headless-Test-Chrome beendet, sichtbaren isolierten Chrome 9228 geöffnet. Nutzer kann nächste Tests dort verfolgen; bisheriger Nutzerspieltab unverändert.

**Dateien / nächste Arbeit:** build_shepherd.py/blend/glb, Bell-Erzeuger/WAV, item-scene/audio/main, Manifest/Quellen/Browserbelege. Nächste Pakete: historische Atmosphäre/Adler, realistischer Fahrerpass, Sprache/F-Hupe.

### 2026-10-03 – Straßenmöbel und zentrale Startdateien

**Umgesetzt:** Zusätzliche editierbare Litfaßsäulen, originale Plakattypografie/Satire, Haltestellen, Bänke, eigenständiger Adler ohne Regimezeichen; fünf zusammengefasste Materialmeshes. Unveränderte Physikgrenzen. Nutzers Ergänzungen zur Sarah-Nachricht sprachlich geordnet; technischer Detailablauf bleibt docs/21-team-workflow.md, drei zentrale Arbeitslisten liegen im Hauptordner.

**Verifiziert:** Sichtbarer Chrome 9228, normale Welt/sechs Karts; fünf neue Meshes mit Geometrie, keine Browserexceptions. Pausierte tatsächliche Spielszene mit gezielt positionierter Inspektionskamera fotografiert. Erste Bildprüfung zeigte spiegelverkehrte Plakate/verdeckt stehenden Adler; UV-Offset und Platzierung korrigiert, neue Bilder geprüft. Belege period-browser-check.json, period-boulevard-v1.png, period-eagle-v1.png. Build folgt mit Sprachpaket. Keine historische-/Geräteabnahme.

**Offen / nächster Schritt:** Verständlichere Sprachmischung, F-Sprachhupe; realitätsnahe Fahrer bleiben offen.

### 2026-10-03 – Vier-Dateien-Teamablauf und Sprachhupe

**Nutzerauftrag:** Gemeinsame Anleitung/Notizen statt separater Sarah-Nachricht, vier zentrale Tabs, kurze KI-Befehle und Navigation, technische Fortschrittsdatei ohne Nummer. TEAM-NOTES.md enthält geordnete Anleitung für Marcel/Sarah und datierte Notizvorlage. CURRENT-WORKLIST.md auf lesbare Aufgaben/Status gekürzt; technische Belege bleiben hier. PROGRESS-LOG.md aus docs verschoben; aktive Markdownlinks, Skriptgates/Testfixtures und Skills migriert. Vier-Dateien-Pflicht in project-state/AGENTS/START-HERE/Framework/Roadmap/Blueprint/Teamablauf. Legacy unverändert.

**Audio umgesetzt:** F-Eingabekante, 2,5-s-Abklingzeit plus vorhandene Sprachkanalbelegung, kein Hupen in Pause/Menü/Foto. Sechs kurze individuelle eigene synthetische Parodien. Kürzere/freundliche Sprechertexte; weniger Hall/Slap/Drive, größeres Sprachfrequenzband. Piper-WAVs auf .8 Peak normalisiert, damit Browser-Resampling/Mix Puffer behält. Windows-Dateizugriff kurz wiederholbar; erste Regeneration wurde dadurch ordentlich abgeschlossen.

**Verifiziert:** Sichtbarer Chrome 9228: 38 Stimmen geladen; F-Halten/Keyrepeat/schnelle neue Betätigung ergibt einen Clip, nach Abklingzeit zweiten, Pause keinen. Alle sechs Hupeclips dekodiert, 1,66–2,86 s, Peak nach Resampling .80–.82. voice-horn-check.json. Erste Messung hatte durch Resampling Spitzen >1; Quelldateien mit Puffer neu generiert und Test wiederholt, keine Schwelle gelockert. Menschliche Hörabnahme bleibt offen; keine historische Authentizität behauptet. Produktionsbuild bestanden. Beide aktualisierten Repo-Skills mit quick_validate validiert. Alle vier Navigationsheader, lokale Links, Marker und Fortschrittsmigration geprüft. Teamgates folgen beim Abschluss.

**Mitschnitt-Recherche:** Yle belegt das Hitler/Mannerheim-Gespräch 1942 (https://yle.fi/a/20-270673); die betrachtete Archivseite erteilt keine freie Spiellizenz. NARA weist bei Spezialmedien auf unterschiedliche Rechte und Nutzung außerhalb USA hin (https://www.archives.gov/research/motion-pictures/permissions). Keine fremden Tondateien importiert. Authentische harmlose Sprachhupen bleiben ein offener Quellen-/Rechteauftrag.

**Dateien / Grenzen:** root TEAM-NOTES/PROGRESS-LOG und drei Arbeitsdateien, aktive Fachverweise, Skript/Skill/Testverträge; input/main/audio/voice-Erzeuger/WAVs/Index/Credits/Browsertest. Keine PC-Geräteabnahme, keine realitätsnahen Fahrer gebaut. Nächster Schritt Figuren-/Grafikpass nach geordnetem Abschluss.

### 2026-10-04 – Schnellhilfe und diktierte Teamnachrichten

**Marcel ergänzt:** Dateien müssen nicht manuell beschrieben werden. Oben in TEAM-NOTES.md kurze Befehle für Start/Ende, Tagesaufträge, Langfristziele, Notizen und Teamnachrichten sowie Erklärung der drei Batches ergänzt. Projekt Start und Projekt Ende/Projektende als gleichwertige KI-Auslöser in AGENTS/START-HERE und Skills verankert. Nachrichten werden hier für das andere Teammitglied gespeichert und beim nächsten Start gezeigt; gelesen/beantwortet nur nach Bestätigung. Keine automatische externe Zustellung behauptet.

**Verifiziert:** Vier-Dateien-Teamworkflow bestand zuvor alle neun isolierten Git-/Launcherregressionen, einschließlich fehlendem TEAM-NOTES und TEAM-CHANGES. Produktionsbuild und Linkmigration bestanden; Tabs wurden als queued angefordert. Geprüfter lokaler Checkpoint 9d849cb bewahrt vorherige Pakete. Neue Kurzbefehle sind KI-Instruktionen, keine Shellkommandos; tatsächlicher Sarah-PC noch nicht getestet.

### 2026-10-04 – Aktuelle Spiel-/Teamregression vor Veröffentlichung

**Verifiziert:** Neun Team-/Launcherregressionen bestehen: parallele getrennte Arbeit normal zusammenführen, echte Konflikte erhalten, unsichere/alte Arbeit nicht veröffentlichen, fehlende TEAM-NOTES/TEAM-CHANGES stoppen den Push, Remoteänderung während Build stoppen, alter/fremder Previewserver nicht wiederverwenden. Beide aktualisierten Skills validiert; Navigation/lokale Links aller fünf Rootdateien und Marker/Umbenennung geprüft.

**Laufzeit:** slice-browser.mjs auf aktuellem dev-Stand bestanden: normales Menü, nahe/ferne/Fahrerkamera, Fotomodus, echte W-Fahrt, Renncountdown, Pause und kompletter Szenenneustart. Acht neue tatsächliche Screenshots *-drive-polish.png, kein Konzeptbild. final-six-kart-browser.mjs: sechs tatsächliche bewegte Demo-Rennteilnehmer, 1600x1000, je 300 rAF-Bilder nach 1,5-s-Aufwärmen in allen drei Kameras; 967 Meshes konstant, alle Positionen/Geschwindigkeiten endlich, Spieler legt >250 m zurück. Verfolger nah: P50/P95/P99 16.7/16.8/33.4 ms; Verfolger fern: P50/P95/P99 16.7/16.8/16.8 ms; Fahrerperspektive: P50/P95/P99 16.7/16.8/16.9 ms. Raw final-six-kart-load.json. Kurzer Lastlauf, keine volle Drei-Runden-/Kaltlauf-/schwache-PC-/Mobil-Abnahme. Keine Screenshots oder Builds während der Messfenster. Chrome-Fokusemulation hält die Tests bei verdecktem Fenster aktiv; deshalb keine unbedingte menschliche FPS-Abnahme.

**Artprüfung:** Eigenen sichtbaren Chrome wiederhergestellt; erste Nahprüfung bei verdecktem Fenster zeigte nur die alte Szene, nicht den injizierten Hund. Nach bestätigter laufender Rennphase/Fokusverwaltung neu aufgenommen: shepherd-art-inspection-v1.png zeigt tatsächlich den stilisierten Schäferhund. Nicht als realitätsnahes Tiermodell bezeichnet. Straßenmöbelbilder und normaler Fahrerblick nochmals angesehen; reale historische Fahrer und G–L-Qualität bleiben unerreicht.

**Abschluss:** Funktionierender Checkpoint 9d849cb; aktuelle Schnellhilfe/Belege werden zusätzlich lokal gesichert. Team-Finish holt vor Veröffentlichung aktuellen main und führt die volle Test-/Build-Prüfung aus. Ergebnis erst nach tatsächlichem Remotevergleich als veröffentlicht melden. Nächste Aufgabe: erkennbare historische Fahrer, höherwertige Welt/Materialien; Stimme menschlich anhören, Quellen für echte Sprachhupen klären.

### 2026-10-04 – Geprüfter Teamabschluss veröffentlicht

**Tatsächlich gesichert:** scripts/team-workflow.ps1 -Action Finish -Owner Marcel beendet mit Exit 0. 41 Tests bestanden, 0 Fehler; tsc/Vite-Produktionsbuild bestanden. Aktueller Remote-main vor dem Abschluss war 3c3ec5f, keine parallele Änderung erkannt. Arbeitsbranch und main regulär (kein Force-Push) auf **2c6e92d0e9afa25b8ff979bc5c7b5ac724fb0ead** veröffentlicht; erneutes Fetch bestätigt HEAD = origin/main. Reproduzierbarer Konsolenbeleg lokal .tools/team-finish-20261004.log (nicht ins Repository hochgeladen).

**Erhalten:** Sarahs angeforderter Alt-Hauptstand e292070, lokaler Alt-main 2d95e8a und Claude-Qualitätsstand c13d47e bleiben auf ihren unveränderten GitHub-Archivbranches. Das beweist keine Sicherung von Sarahs nur lokal/unveröffentlichten Dateien. Legacy-Verzeichnisse unverändert. Arbeitsbranch bleibt erhalten; lokales main wird nur per Fast-Forward aktualisiert, sofern nicht anderswo aktiv.

**Rest / Grenze:** Benutzer-/Geräte-/Hörabnahmen bleiben offen; G–L und realitätsnahe historische Fahrer sind noch nicht erreicht. Build meldet weiterhin großen ~2,2-MB-Hauptchunk, keine stillschweigende Performance-Abnahme. Vier App-Tabs angefordert, Toolstatus queued; Öffnung beim Zurückkehren zur betreffenden Codex-Sitzung, keine sofortige Anzeige behauptet. Offizieller Limitstand zuletzt 82% Fünf-Stunden / 27% Woche verbraucht, Abschluss-Puffer genutzt; keine Resets/Zusatzkontingente.

**Nächster Schritt:** Projekt Start. Danach erste erkennbare historische Fahrerproduktion und nächster Grafikpass; Sprecherin/F-Parodie im Fahrtest anhören, konkrete Aussprachefehler notieren. Abschließende Arbeitslisten-/Veröffentlichungsnotiz als dokumentationsreiner Folgcommit, Spiel-/Asset-/Skriptstand bleibt der oben geprüfte.

### 2026-10-04 – Dauerhafte Budgetregel und Sarahs Erstumstieg

**Befund:** 15-/5-Prozent-Regel war lediglich in älterem START-HERE-Sitzungsabschnitt enthalten, nicht eindeutig allgemeiner Startvertrag. Auf Marcels Auftrag nun für beide in AGENTS/START-HERE/Handbuch/Skills und kurz oben in TEAM-NOTES verankert: aktuelle eigene offizielle Kontowerte, kleinerer Rest, Checkpoints und Abschlussreserve, fehlende Werte einmal erfragen, keine Resets/Zusatzkosten.

**Erstumstieg:** Marcels ausdrücklich beauftragte Nachricht und kurzer selbsttragender Prompt mit Repositoryadresse in TEAM-NOTES. Lokales Bewahren plus einmalig ausdrücklich autorisierter neuer GitHub-Archivbranch; Archivverifikation, Herkunftsdokumentation der Ideen, keine Altengine-Integration; vier Tabs/Zweckerklärung/Nachricht anzeigen. Skills/Teamablauf zwischen gewöhnlichem lokalem Projektstart und diesem expliziten Archiv-Push unterschieden. Sarahs PC/Dateien nicht zugänglich; nicht als migriert oder gesichert behauptet.

**Prüfung / Veröffentlichung:** Reine Markdown-/Skill-Instruktionsänderung, Spiel/Skripte/Tests unverändert zum geprüften 41-Test-Stand. Alle vier Navigationsheader/lokalen Links und der Marker geprüft; beide angepassten Skills mit quick_validate bestanden. GitHub-Publikation dieser Anleitung erfolgt als regulärer Dokumentationscommit mit Remotevergleich; aktuelles main bleibt einzige aktive Spielbasis.

### 2026-10-04 – Sarahs Panzerfähigkeit „Größenbefehl“ wiederhergestellt (Claude)

**Auftrag:** Marcel: Sarahs belegte Hitler-Panzerverwandlung professionell im Babylon-Spiel wiederherstellen (Q, vorläufig 8 s Dauer, 18 s Abklingzeit), editierbares Modell, Ketten, Verwandlung, Ton, Staub, HUD, kontrolliertes Wegstoßen mit Schutzregeln; Rückverwandlung, Neustart, sechs Karts, alle Kameras im Browser prüfen.

**Umgesetzt:** `src/abilities.ts` (gemeinsame, testbare Regeln; Name, 8 s/18 s und 2,4 s Verlangsamung aus Archiv e292070; Abstände/Impulse neu für die Babylon-Welt), neue Zustandsfelder `tankRemaining`/`slowRemaining`, Item-Treffer auf den Panzer nur mit leichter Bremsung, Q im Training und Rennen (nicht im Countdown/Menü/Foto). Editierbares Modell `art-source/build_tank.py` → `parade-tank.blend/.glb` (Rumpf, Schürzen, 7 Laufräder je Seite, UV-Kettenbänder, Turm mit Luke, Rohr, Messingtrichter, fiktives Lorbeer-§-Emblem, keine Regimezeichen). Laufzeit: Rauchstoß, federndes Aufpoppen, Fahrer steigt in die Luke, laufende Ketten/Räder, Kettenstaub, Überroll-Staub, weitere Kamera, Lukenblick in der Fahrerperspektive; HUD-Karte mit Zustand/Leiste; Original-WAVs für Verwandlung, Überrollen, Motor.

**Verifiziert:** 43 Modelltests (2 neue Fähigkeitstests). Echter Browser mit sechs Karts (`tests/slice-tank.mjs`, headless und sichtbares Chrome): Q verwandelt, ein Gegner überrollt, Rückverwandlung nach 8 s mit wieder sichtbarem Kart, zweites Q während Abklingzeit blockiert, Neustart setzt „Panzer bereit“; Bilder nah/fern/Fahrer/zurückverwandelt `docs/evidence/slice-tank-*-q3.png`.

**Nicht verifiziert:** menschliches Fahrgefühl des Panzers, Hörprobe der neuen Klänge, Bots mit Fähigkeiten (noch keine), Balance. Spielerfigur ist weiterhin der neutrale „General“-Platzhalter; erkennbarer historischer Fahrer bleibt offen.

### 2026-10-04 – Regen und einheitlicher Arbeitsordner (Claude)

**Umgesetzt:** Wetteroption Sonne/Regen (persistiert, `?weather=rain`): gedämpfte Sonne, graublaue Himmelsaufhellung, dichter Dunst, nasse Pflaster/Promenaden (dunkler, Rauigkeit 0,32/0,4), zehn Pfützen auf der Fahrlinie mit Spritzern sowie Wasserbremse und Grip-Verlust, Regenschlieren um die Kamera, Blitze alle 9–23 s mit verzögertem Donner, Regenschleife (originale WAVs aus `build_audio.mjs`). Arbeitsordnerregel in `docs/21-team-workflow.md`.

**Verifiziert:** 43 Modelltests, Typecheck. Batch-Server (Hauptordner, Port 4173) mit `?demo=1&weather=rain`: Option „Wetter Regen“, Rennen läuft, 2 365 aktive Regenpartikel, Spielbild betrachtet. Ursache früherer Standabweichung gefunden: `vite.config.ts` ignoriert `.claude/`; Worktree-Server lieferte alte Dateien.

**Nicht verifiziert:** Hörprobe Regen/Donner, menschliches Fahrgefühl in Pfützen, Leistung auf schwachen Geräten mit 3 600 Regenpartikeln/s. Wolkenschatten noch nicht gebaut.

### [JJJJ-MM-TT] – [Sitzungstitel]

**Ziel:**

**Modell / Arbeitsmodus:**

**Erledigt:**

**Verifiziert:**

**Nicht verifiziert:**

**Geänderte Dateien:**

**Neue Entscheidungen:**

**Offene Probleme:**

**Nächster Schritt:**

**Empfohlenes Modell:**

### 2026-10-04 – Fahrer-/Fahrzeug-Masterauftrag: erster Laufzeit-Formpass

**Auftrag / Richtung:** Marcels neues Masterdokument zur Überarbeitung von Fahrer- und Fahrzeugmodellen hat in der Arbeitsliste Priorität. Seine anschließende Präzisierung ist verbindlich: gemeinsame Kart-Grundarchitektur mit vielen je Person gestalteten, selbst als Schwarzsilhouette lesbaren Karosserieabweichungen; keine Treckerform, Stalins Traktor bleibt das Wurfobjekt. Stalin ist der erste Qualitätsanker. Diese Auftragsänderung steht in CURRENT-WORKLIST.md, LONG-TERM-GOALS.md, TEAM-CHANGES.md, TEAM-NOTES.md und docs/22-character-vehicle-quality-master.md. Frühere neutrale-/Großkopf- und Mussolini-als-erster-Pilot-Vorschläge sind in den Fachdateien als historische Zwischenstände markiert.

**Umgesetzt:** Die beiden aktuellen Nutzerbilder dienten als Befund. In `art-source/build_kart.py` Kopfvolumen/-profil und sechs getrennte Kopf-/Kieferformen ergänzt/angepasst, Hals und weichen ovalen Uniformkragen neu geformt, Mundöffnung/Lippen sichtbar modelliert, Lenkradarme den äußeren Griffseiten zugeordnet, historische Kopfbedeckungen als schaltbare Variante vorgesehen und grobe Gold-Schulterblöcke durch eng anliegende Stoffepauletten mit feiner Paspel ersetzt. Den flatternden goldenen Nackenstab nach Ursachenprüfung beseitigt: es war ein steifer Verschluss am animierten Cape-Knoten `scarfFlap`, kein notwendiger Rigstab; der falsche Verschluss wurde entfernt. Die sechs bestehenden Kartkarosserien teilen das Rad-/Fahrwerk, behalten aber individuelle Körper-/Front-/Heckformen; Stalin fährt eine Straßen-Staatslimousine und sein Traktor bleibt ein Item. Laufzeitquelle, optimiertes GLB und Dokumentationsbelege sind aktualisiert.

**Verifiziert:** `npm test`: 50/50 bestanden (einschließlich Charakterzuordnung, Trennung der sechs Kopfprofile und bestehender Spiel-/Rennregressionen). `npm run build`: TypeScript und Vite erfolgreich, 1.295 Module. Weiterhin bekannte Vite-Warnung zum 2.016,26-kB-Hauptchunk. Blender 4.5.3 erzeugte `art-source/hero-kart.blend`; glTF-Optimierung abgeschlossen (`hero-kart`: 5.913.324 Bytes Quelle → 4.507.372 Bytes Laufzeit). Die aktuelle In-App-Laufzeitansicht zeigt alle sechs Porträts, Stalin-Kappe/Bart, die neue Schulterform und die gewählte Staatslimousine. Rückansicht bestätigt, dass keine Stange aus Nacken/Rücken ragt. Browserkonsole für die aktuelle Szene: keine Warnungen oder Fehler. Prüf- und Arbeitsliste bleiben auf dem Hauptcheckout; Remoteabstammung zu Beginn war Commit `00e8173` auf Branch `codex/team-marcel-20261004-132611-615`.

**Nicht abgenommen / offen:** Die Figuren sind weiterhin deutlich stilisierte Karikaturen statt realitätsnaher Abbilder; Augen-/Mundlesbarkeit, individuelle Anatomie und Gesichtsausdruck benötigen sichtbar mehr Tiefe. Front-, Seiten-, Nah- und laufende Bewegungsaufnahme des Stalin-Ankers sind nicht vollständig geprüft; die Browserbedienung ersetzt keine menschliche Fahrprobe. Silhouettenabgleich aller sechs Fahrzeuge, animierte Hände aus mehreren Blickwinkeln, Hutzuordnung im historischen Kontext und gemeinsame Qualitätsabnahme bleiben offen. Die sechs getrennten Köpfe erhöhen das Laufzeitmodell gegenüber dem vorherigen Eintrag; Leistung auf schwächerem PC/Mobile ist nicht geprüft. Die vorläufige Kopfzuordnung ist gestaltete Zwischenumsetzung und keine Quellen- oder Rechteabnahme.

**Geänderte Dateien:** `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `PROGRESS-LOG.md`, `docs/02-art-direction.md`, `docs/09-roadmap.md`, `docs/10-open-questions.md`, `docs/14-character-and-item-catalog.md`, `docs/16-production-blueprint.md`, neues `docs/22-character-vehicle-quality-master.md`, `art-source/README.md`, `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `src/cast.ts`, `src/slice-scene.ts`, `tests/cast.test.mjs` sowie bereits vorher veränderte Strecken-/Gameplay-Dateien.

**Nächster Schritt:** Kopf-/Hals-/Gesichtsmodell und sichtbare Handgelenke des Stalin-Karts weiter ausarbeiten; nah/vorn/seitlich/rückwärts und in Bewegung beurteilen. Dann klaren Stilanker abnehmen und mit den bestätigten Kriterien auf die anderen fünf Fahrer-/Kartpaare übertragen. Nutzerabnahme separat offen halten.

**Budgetstand:** offizieller Codex-Stand nach diesem Paket: 7 % des Fünf-Stunden-Limits verbraucht, 32 % des Wochenlimits verbraucht. Keine Kontingente/Resets gekauft oder aktiviert.

### 2026-10-04 – Korrektur nach Marcels Sichtprüfung: Hitler-Mund und Schnurrbart

**Korrektur:** Marcel zeigte im aktuellen Auswahlbild, dass Hitlers Schnurrbart und die Münder im ersten Formpass in der tatsächlichen Kartendarstellung nicht klar sichtbar waren. Die frühere Geometrie existierte im GLB, ihre Größe/Kontrast waren in einem 320×360-Porträt aber unzureichend. Das ist eine echte Qualitätslücke und kein bloßes Missverständnis in der Dokumentation.

**Umgesetzt und visuell belegt:** Mundöffnung erweitert und dunkler gesetzt, Lippen stärker geformt; Hitlers Schnurrbart merklich verbreitert, erhöht und mit weicherer Kontur gebaut. Blender 4.5.3 sowie GLB-Optimierung erfolgreich erneut ausgeführt. Das aktualisierte Fahrerwahlbild zeigt bei Hitler einen deutlich erkennbaren Mund und den kompakten dunklen Schnurrbart direkt darunter. Die übrigen Fahrer behalten ihre eigenen Gesichtsmerkmale.

**Verifiziert:** Der Laufzeitbrowser hat die neue Datei geladen; die sechs Auswahlbilder wurden angezeigt. Adolf-Porträt zeigt Mundöffnung und kompakten Schnurrbart klar. Browserkonsole: keine Warnungen oder Fehler. Blender/Optimierung: `hero-kart` 5.965.128 Bytes Quelldatei → 4.531.896 Bytes Laufzeitdatei. Danach vollständige Suite 50/50 erfolgreich, TypeScript-/Vite-Produktionsbuild erfolgreich (1.295 Module; bekannte 2.016,26-kB-Hauptchunk-Warnung).

**Grenze:** Es bleibt eine stilisierte Karikatur, keine realitätsnahe oder gemeinsam abgenommene Figur. Diese Iteration korrigiert gezielt die Lesbarkeit der zuvor fehlenden Gesichtszüge; Masterauftrag, Stalin-Anker und Gesamtkader bleiben offen.

### 2026-10-04 – Stalin-Anker: zweiter Gesichts- und Limousinenpass

**Ziel:** Marcels offenen Fahrer-/Fahrzeug-Masterauftrag in kleinen sichtbaren Paketen weiter umsetzen. Der Stalin-Anker bleibt Priorität 1; die erste Gesichtsstufe war auf der Fahrerkarte noch zu rund und zu wenig gegliedert.

**Umgesetzt:** In `art-source/build_kart.py` Stalins eigenes Profil am gemeinsam animierten Schädel verbreitert und den unteren Kiefer kräftiger/squarer geformt. Zusätzliche Brauen-, Wangen-, Nasenflügel-, Nasolabial- und Unteraugenebenen werden nur mit `cast-face-stalin` aktiviert. Die Staatslimousine erhielt einen hohen gerahmten Kühler, eigene vertikale Grillstäbe, eine mittige Haubenlinie und eine gestufte Heckkante; gemeinsamer Kart-Radstand und Fahrwerk bleiben bestehen. Kein neues Regimezeichen, keine Treckerform.

**Verifiziert:** Blender 4.5.3 schrieb `art-source/hero-kart.blend` und exportierte das Laufzeit-GLB; `node art-source/optimize_assets.mjs hero-kart` reduzierte 6.099.920 auf 4.669.348 Bytes. Fahrerwahlporträt und laufendes Babylon-Rennen mit Stalin wurden im Browser geladen; Kamerawechsel zeigte das Heck und danach das Cockpit. `npm test`: 50/50 bestanden. `npm run build`: TypeScript/Vite erfolgreich, 1.295 Module; bekannte 2.016,26-kB-Hauptchunk-Warnung. Der erste Test-/Buildversuch innerhalb der Sandbox konnte Windows-Unterprozesse nicht starten (`EPERM`); Wiederholung außerhalb mit erlaubtem Prozesszugriff war erfolgreich. `git diff --check` sauber (nur erwartete LF/CRLF-Hinweise).

**Nicht abgenommen / offen:** Der neue Kopf ist weiterhin eine erkennbare Spielkarikatur, kein professionell fertiggestelltes historisches Porträt. Front-, Seiten- und Nahansicht sowie Bewegung des Gesichts/der Hände wurden nicht vollständig geprüft; kein menschlicher Qualitätsentscheid. Die Limousinen-Silhouette braucht einen gesamten Seiten-/Frontvergleich zu den anderen fünf Karts. Es gibt keinen geprüften schwachen-Geräte-Leistungslauf.

**Geänderte Dateien:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `art-source/README.md`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `PROGRESS-LOG.md`.

**Nächster Schritt:** Anatomie und Hand-/Armgriff des Stalin-Ankers von vorn/seitlich/nah vertiefen und Fahrzeugprofil aller sechs Karts als Silhouetten vergleichen; Stilanker erst nach vollständigem Laufzeit- und Nutzercheck freigeben.

### 2026-10-04 – Regen-Wolkenschatten: Abschaltung in der Wetterreihenfolge korrigiert

**Befund:** Fünf Wolkenschatten-Meshes und Regenpfützen existierten in `src/track-world.ts`, waren auf dem echten Regenbild aber unsichtbar. `setWeather('rain')` rief zuerst `setRain(true)` und danach `setSnow(false)` auf. Der `setSnow(false)`-Rückfall rief seinerseits `setWet(false)` auf und schaltete Pfützen/Schatten im selben Übergang sofort wieder ab. Regentropfen blieben aktiv, was die falsche Wetterdarstellung zunächst kaschierte.

**Umgesetzt:** `setWeather` setzt die Schneeoberfläche nun zuerst zurück und aktiviert Regen zuletzt. Die gemeinsame Schattenmaterial-Alpha-Nutzung ist explizit auf Alpha-Blending gestellt; die zentrale weiche Wolkenform ist auf dem strukturierten Pflaster kontrastreicher, ohne den kleinen festen Bestand zu vergrößern (5 Meshes, 1×512² Textur).

**Verifiziert:** Echter Browser unter `?weather=rain` zeigt die diffuse dunkle Schattenform und die reflektierenden Pfützen im Laufzeitrennen; `?weather=sun` zeigt beides nicht. `npm test`: 50/50 bestanden. `npm run build`: erfolgreich, 1.295 Module; bekannte 2.016,30-kB-Hauptchunk-Warnung. `git diff --check` sauber, mit erwarteten Windows-LF/CRLF-Hinweisen.

**Geänderte Dateien:** `src/slice-scene.ts`, `src/track-world.ts`, `docs/07-gameplay-systems.md`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `PROGRESS-LOG.md`.

**Nächster Schritt:** Wetterübergänge Regen → Sonne → Schnee und zurück im nächsten visuellen Weltpass erneut mitprüfen; diese Korrektur bezieht sich auf die Browserzustände Sonne/Regen.

### 2026-10-04 – Lenkradgriff: schwebende Hände an den Kranz gesetzt

**Befund:** Marcels Laufzeitmeldung wurde am Stalin-Kart in Fahrer- und Verfolgerkamera nachgestellt. In `art-source/build_kart.py` lagen Handflächen/Finger bei x≈±0,68, während das Lenkrad bei x≈±0,21 sitzt. `src/slice-scene.ts` reparentet die Handschuh-Meshes bewusst an den Lenkradknoten, damit sie dessen Bewegung mitmachen; das Parenting hielt daher die falschen Ursprungskoordinaten unverändert und ließ die Hände frei neben dem Kranz schweben.

**Umgesetzt:** Unterarme zeigen jetzt vom Schulterpivot nach innen. Manschetten, Handflächen und Finger liegen beidseitig direkt an den linken/rechten Kranzpunkten; der bestehende gemeinsame Lenkradanker kann sie weiterhin mit dem Einschlag mitdrehen. Zusätzlich wurde der Hals als verjüngte, weiche Nacken-/Kehlform modelliert und die Ohrmuschel durch Concha, Helix und Ohrläppchen ergänzt.

**Verifiziert:** Blender 4.5.3 erzeugte die editierbare `hero-kart.blend` und GLB neu; `node art-source/optimize_assets.mjs hero-kart` erfolgreich (6.207.268 → 4.753.588 Bytes). Der erste Optimierungsversuch wurde vom offenen Windows-Browsertab blockiert; nach Schließen des eigens angelegten Prüftabs lief der Export durch. Frischer In-App-Browser lud das neue GLB; Stalin-Rennen bis in die Fahrerperspektive geprüft: beide Handschuhe berühren den unteren linken/rechten Lenkradkranz. `npm run build` erfolgreich (1.295 Module); bekannte 2.016,30-kB-Hauptchunk-Warnung. Kein separater Regressionstest nach der reinen Assetänderung ausgeführt.

**Offen:** Den Kontakt noch bei vollem Lenkeinschlag und in Außen-/Seitenansicht beurteilen. Der Character-/Vehicle-Masterauftrag bleibt als Ganzes offen; diese Griffkorrektur ist kein Qualitätsanker-Abschluss.

**Geänderte Dateien:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `art-source/README.md`, `CURRENT-WORKLIST.md`, `TEAM-CHANGES.md`, `PROGRESS-LOG.md`.

### 2026-10-04 – Stalin-Anker: Mund unter dem Walrossbart sichtbar gemacht

**Befund:** In der tatsächlichen 320-Pixel-Fahrerkarte verdeckte Stalins tiefer Walrossbart die gemeinsame Mundöffnung. Der Kopf las sich dadurch trotz Nase/Bart als Mundlose Maske; die große Gesichtsanforderung war an dieser Stelle nicht erfüllt.

**Umgesetzt:** `art-source/build_kart.py` modelliert einen separat schaltbaren Stalin-Mund mit dunkler Öffnung und getrennten Ober-/Unterlippen direkt unterhalb des Bartes. `src/cast.ts` aktiviert `stalinmouth` nur beim Stalin-Modell; die übrigen fünf Fahrer bleiben unverändert. Blender-Quelle/GLB neu erstellt und optimiert.

**Verifiziert:** Im frischen In-App-Browser wurde die echte Fahrerauswahl geladen und Stalin ausgewählt; das kleine Runtime-Porträt zeigt den Mund unter dem Walrossbart. `npm test`: 50/50 bestanden (einschließlich neuer `stalinmouth`-Roster-Prüfung). `npm run build`: TypeScript/Vite erfolgreich, 1.295 Module; bekannte Hauptchunk-Warnung bei 2.016,33 kB. GLB: 6.277.884 Bytes Quelle → 4.794.824 Bytes Runtime.

**Offen:** Stalin bleibt eine stilisierte Karikatur. Die Gesichts-/Körpermodellierung ist nicht als Qualitätsanker abgenommen; vollständige Nah-/Front-/Seiten-/Bewegungsansichten und menschliche Prüfung stehen aus.

**Geänderte Dateien:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `src/cast.ts`, `tests/cast.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `art-source/README.md`, `PROGRESS-LOG.md`.

**Budgetstand nach dem Paket:** Offiziell 17 % des Fünf-Stunden-Limits und 33 % des Wochenlimits verbraucht; keine Zusatzkontingente aktiviert.

### 2026-10-04 – Lenkradgriff erneut korrigiert: Handschuh bleibt am Arm

**Befund:** Marcel meldete, dass die Hände im aktuellen Laufzeitspiel wieder frei neben dem Lenkrad schweben. Der bisherige Laufzeitaufbau hing nur die Meshes mit „White glove“ direkt an den Lenkradknoten. Manschette und Unterarm blieben an `armPose-*`; eine sichtbare Verbindung der Hand zum Ärmel war so nicht garantiert.

**Umgesetzt:** In `src/slice-scene.ts` werden die Handschuh-Meshes nicht mehr aus ihrer Arm-Hierarchie ausgeklinkt. Der gespeicherte Griffanker bleibt relativ zum Lenkrad; die IK richtet den kompletten Arm inklusive Hand, Daumen, Fingern und Manschette von der Schulter auf diesen bewegten Anker aus. Das beseitigt die Parent-Trennung, die einen sichtbaren Spalt zwischen Ärmel und Handschuh verursachte. Derselbe Laufzeitpfad gilt für alle sechs instanziierten Fahrer.

**Verifiziert:** Frische Laufzeit mit aktualisiertem Babylon-Code geladen. Fahrerwahl-/Außenansicht zeigt beide Arme mit Händen am jeweiligen Lenkrad; Fahrerperspektive zeigt die Handschuhe am unteren linken/rechten Kranz. `npm test`: 50/50 bestanden. `npm run build`: TypeScript und Vite erfolgreich (1.295 Module); die bekannte Warnung zum 2.016,30-kB-Hauptchunk bleibt. `git diff --check`: bestanden; Git meldet ausschließlich erwartete LF/CRLF-Hinweise für Windows-Dateien.

**Noch offen:** Sichtprüfung bei vollem Links-/Rechtslenkeinschlag und exakter Außen-/Seitenansicht; ein Mensch soll das Griffgefühl während echter Fahrt beurteilen. Die Korrektur belegt Grundpose und Hand-Arm-Verbindung, nicht den gesamten Fahrer-/Fahrzeug-Masterauftrag.

**Geänderte Dateien in diesem Paket:** `src/slice-scene.ts`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `PROGRESS-LOG.md`.

### 2026-10-04 – Lenkradgriff folgt dem ganzen Lenkeinschlag

**Befund:** Bei großem Lenkeinschlag wandert der vom Lenkrad abhängige Griffpunkt. Die starre Schulter-/Handreichweite konnte diesen Punkt nicht sicher erreichen. Bei der ersten Solverfassung war außerdem die Ruhe-Strecke vor der Berechnung versehentlich auf Einheitslänge normiert; damit entsprach der Streckfaktor nicht exakt der modellierten Armlänge.

**Umgesetzt:** `armGripReach` nutzt jetzt den echten Schulter-zu-Hand-Abstand der Ruhepose. Im Laufzeitrig dreht und skaliert die IK den kompletten Arm bis zum jeweiligen Lenkradgriff; die Handschuh-Untergruppe wird gegenläufig skaliert, damit die Hand selbst ihre modellierte Größe behält. Die Handschuhe bleiben mit Manschette/Arm verbunden. Der gemeinsame Laufzeitpfad gilt für die sechs Fahrer.

**Verifiziert:** Neues Regressionstestszenario prüft beide Lenkradseiten bei fünf Griffwinkeln (-1,15 bis +1,15 rad) und bestätigt eine Griffabweichung unter 1e-6 Einheiten; nach Babylon-Matrix-API-Korrektur besteht die Gesamtsuite mit 51/51 Tests. `npm run build` besteht (TypeScript/Vite, 1.295 Module). Frische lokale Laufzeit zeigt beide Hände in Fahrerwahl-Außenbild und Fahrerperspektive am Kranz. Die bekannte große Hauptchunk-Warnung (ca. 2.017 kB) bleibt.

**Noch offen:** Der In-App-Browser kann die Lenktaste nicht gehalten fahren; dadurch ist der menschlich gesteuerte Volleinschlag aus seitlicher Außenansicht weiterhin nicht abgenommen. Der Test belegt die mathematische Griffpunktführung, nicht die animierte Gesamtpose bei echter Fahrt. Das ist in CURRENT-WORKLIST.md als nächste Sichtprüfung markiert.

**Geänderte Dateien in diesem Paket:** `src/kart-visuals.ts`, `src/slice-scene.ts`, `tests/kart-visuals.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `art-source/README.md`, `PROGRESS-LOG.md`.

**Budgetstand nach dem Paket:** Offiziell 20 % des Fünf-Stunden-Limits und 34 % des Wochenlimits verbraucht; keine Zusatzkontingente aktiviert.

### 2026-10-04 – Stalin-Anker: eigene hochgeschlossene Tunika

**Befund:** Der auswählbare Stalin trug noch dieselbe helle Paradeuniformform wie mehrere andere Figuren, mit generischem Band, Orden und Schulterstücken. Das widersprach dem Ziel eines individuell lesbaren Qualitätsankers. Als reine visuelle Formreferenz diente das Frontporträt der [Library of Congress](https://loc.gov/pictures/resource/cph.3b41212/); es wurde kein Foto, keine Fremdtextur und keine Fremdgeometrie übernommen.

**Umgesetzt:** `art-source/build_kart.py` ergänzt eine separate Stalin-Variante: dunkles Olivgrau, hochgeschlossener Stoffkragen, mittige Knopfleiste mit Knöpfen, zwei Brusttaschen und dezente Nahtdetails. Für Stalin sind generisches Paradeband, Medaillen, Schulterstücke, Goldknöpfe und der allgemeine Ovalkragen deaktiviert; für die übrigen fünf Fahrer bleibt deren zuvor zugewiesene Kleidung bestehen. `src/cast.ts` schaltet diese Teile pro Fahrer und setzt Stalins Stofffarbe. `tests/cast.test.mjs` prüft die Varianten-/Ausschlussliste.

**Verifiziert:** Blender 4.5.3 hat `hero-kart.blend` und das GLB neu erzeugt; die Laufzeitdatei enthält die Tunika- und Detailgruppen. glTF Transform exportiert 6.406.456 Bytes Quelldatei als 4.891.316 Bytes Laufzeitdatei. Gegenüber der vorherigen Laufzeitversion beträgt der Anstieg +96.492 Bytes (ca. 2,0 %). Die frische Fahrerwahl zeigt das neue olivgraue Outfit im echten Renderer. `npm test`: 51/51; `npm run build`: TypeScript/Vite erfolgreich, 1.295 Module. Der bestehende Hinweis auf den ca. 2.017-kB-Hauptchunk bleibt. Der Optimierer überspringt weiterhin die Quantisierung einzelner UV-Sätze außerhalb 0–1; die GLB-Ausgabe und Laufzeitporträts funktionieren dennoch.

**Noch offen:** Das vollständige Gesicht bleibt sichtbar stilisiert; Front-/Seiten-/Nah-/Bewegungsprüfung im Spiel und menschliche Qualitätsabnahme des Stalin-Ankers fehlen. Die restlichen fünf Fahrer und alle Fahrzeugvarianten brauchen weiterhin den vollen Masterpass.

**Geänderte Dateien in diesem Paket:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `src/cast.ts`, `tests/cast.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `art-source/README.md`, `PROGRESS-LOG.md`.

**Budgetstand nach dem Paket:** Offiziell 21 % des Fünf-Stunden-Limits und 34 % des Wochenlimits verbraucht; keine Zusatzkontingente aktiviert.

### 2026-10-04 – Laufzeit-Bildreferenz: Fassaden, Wasseroberfläche und Regenkontakt

**Befund/Ziel:** Marcel verlangt, die Bildreferenz auf die echte Spielgrafik auszuweiten – hochwertige Fahrer/Fahrzeuge sowie sichtbar ausgearbeitete Umgebung, Gebäude, Boden, Wasser und Fahrpartikel. Der erste begrenzte Weltpass verbessert Fassadenlesbarkeit und Oberflächenbewegung, ohne die illustrative Laufzeitoptik als fotorealistisch oder fertig abzunehmen.

**Umgesetzt:** `art-source/build_world.py` ersetzt den überbreiten, Ladenfenster verdeckenden Sockel durch zwei schmale Granitprofile, ergänzt einen hervorgehobenen Doppeltüreingang mit Portal, Paneelen, Oberlichtern, Griffen und Stufen und gliedert die oberen Fenster in Seitenrahmen/Sprossen. Der frisch neu gebaute `stadium-world.glb` wurde optimiert: 22.076.572 → 15.632.728 Bytes (−29,2 %); gegenüber dem alten Runtime-GLB (12.486.680 Bytes) wächst die Weltdatei um 3.146.048 Bytes (+25,2 %). `src/track-world.ts` erzeugt eine gemeinsame schwache Wellen-Normaltextur und versetzt sie im Spiel kontinuierlich; Kanal und übrige nicht-Lava-/Nicht-Fels-Wasserflächen verwenden sie. `src/slice-scene.ts` hält pro Kart einen eigenen Regen-Reifenspray-Pool (44 Partikel); bei sechs Karts bleibt diese Schicht bei höchstens 264 Partikeln. Sie wird nur bei Regen, über 6 m/s und innerhalb einer vorhandenen Pfütze angeregt, in reduzierten Effekten langsamer. Bei Ende des Regens stoppen alle Sprüh-Emitter.

**Verifiziert:** Frischer Blender-Neubau von `stadium-world.blend` lief rund 18 Minuten und endete mit `WORLD_COMPLETE`; die neu erzeugte Weltdatei hat 24.107.367 Bytes Blender-Quelle und 15.632.728 Bytes Runtime-GLB. glTF-Transform konnte sie nach expliziter Registrierung von `KHR_mesh_quantization` wieder einlesen (26 exportierte Meshes). Der erneute `npm run build` nach diesem Assetbau bestand mit 1.295 Modulen; `dist/assets/models/stadium-world.glb` hat exakt 15.632.728 Bytes. `npm test` erfolgreich: 52/52. Nach vollständigem Reload importierte die echte Regenwelt im In-App-Browser; Regen, nasse Pflasterung, sechs Karts, Item-HUD und Spiel-HUD erschienen. Die bestehende Referenzkachel/Spielgrafik wurde nicht ersetzt. Die Volltests im Sandbox-Kontext erhielten zuerst `spawn EPERM`; die erlaubte Wiederholung außerhalb der Sandbox bestand. Die neue Weltdatei ist um 3.146.048 Bytes (+25,2 %) schwerer als der vorige Runtime-Export – dieser Preis ist sichtbar dokumentiert, ein Framezeitvergleich für die Weltänderung fehlt.

**Nicht abgenommen / Grenzen:** Der Browserbeleg zeigt die Regen-Laufzeit, aber nicht den Nahblick der erneuerten Ladenfassade, die Normalbewegung des Wassers oder einen tatsächlichen Reifen-Sprühnebel beim Pfützenübertritt. Diese drei Sichtprüfungen bleiben offen. Der Kanal erhält noch keinen dynamischen Spritzbogen beim Durchfahren/Sprung. Fahrer- und Kartmodell bleiben der größere Bildreferenz-Meilenstein. Der große Produktionshauptchunk (~2.019 kB) gibt weiterhin eine bestehende Vite-Warnung aus. Browser-Capture-Skript `tests/slice-browser.mjs` konnte keine unabhängige Chrome-CDP-Sitzung auf Port 9223 finden; die echte Regenansicht wurde stattdessen direkt im Codex In-App-Browser angesehen. `git diff --check` bestanden; Git meldet nur die auf Windows erwartete CRLF-Konvertierung.

**Geänderte Dateien dieses Weltpakets:** `art-source/build_world.py`, `public/assets/models/stadium-world.glb`, `docs/evidence/slice-asset-optimization.json`, `src/track-world.ts`, `src/slice-scene.ts`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `PROGRESS-LOG.md`.

**Budgetstand nach dem Paket:** Offizielle Kontowerte nach dem Paket: aktuelles Fünf-Stunden-Fenster 0 % verbraucht (Reset während der Arbeit), Wochenfenster 35 % verbraucht; damit 65 % Wochenrest als bindender Rest. Keine Zusatzkontingente ausgelöst.

### 2026-10-04 – Kanal-Wasserfahne bei flachem Oberflächenkontakt

**Umgesetzt:** Der fehlende Oberflächenkontakt-Effekt beim Kanalsprung ergänzt. `src/environment-effects.ts` aktiviert die Effektlage nur innerhalb der Kanalprogresszone, bei mehr als 6 m/s und bis maximal 0,35 m Höhe. Sechs separate ParticleSystems begrenzen sie auf 28 aktive Partikel pro Kart / 168 insgesamt. Der Effekt hängt nicht vom Regen ab; ein hoher, sauberer Sprung bleibt frei. `src/slice-scene.ts` setzt den Heckemitter niedrig über die Wasserfläche und richtet den Sprühvektor nach dem Fahrzeug aus. Regressionstest deckt Regen-unabhängige Aktivierung, zu geringe Geschwindigkeit, zu große Höhe, Rückwärtsfahrt und reduzierte Effektstufe ab.

**Verifiziert:** `npm test`: 53/53; `npm run build`: TypeScript und Vite erfolgreich mit 1.296 Modulen. Direkter Testlauf zunächst mit `spawn EPERM` durch Sandbox; die autorisierte Vollsuite außerhalb bestand. `git diff --check` bestanden. Nach Browserreload startet die Regenwelt inklusive Item-HUD und sechs Karts ohne Ladefehler.

**Noch nicht visuell abgenommen:** Der In-App-Browser erlaubt hier nur kurze Tastendrucke statt gehaltener Fahrt. Ein tatsächlicher flacher Kanaldurchgang unter 0,35 m und ein Pfützenkontakt mit auslösender Reifenfahne wurden deshalb nicht live gefahren. Die Rendertrigger und Obergrenzen sind automatisiert geprüft; eine menschliche Sichtprüfung bleibt offen. Keine Aussage, der Effekt sei schon als Partikel auf der Oberfläche gesehen.

**Geänderte Dateien:** `src/environment-effects.ts`, `src/slice-scene.ts`, `tests/environment-effects.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `PROGRESS-LOG.md`.

**Budgetstand nach dem Paket:** Offiziell 3 % des aktuellen Fünf-Stunden-Fensters und 35 % des Wochenlimits verbraucht; 65 % Wochenrest ist bindend. Keine Zusatzkontingente aktiviert.

### 2026-10-04 – Wasseroberfläche: Sichtbarkeit des Flusses leicht erhöht

**Umgesetzt:** Die im ersten Weltpaket ergänzte gemeinsame Wasser-Normaltextur war auf `.16` gesetzt und änderte ihren UV-Offset mit `.012/.003` pro Sekunde. In `src/track-world.ts` ist die Stärke jetzt `.27`, der Flussversatz `.035/.009`. Wassergeometrie, Kanalufer, Materialtransparenz und Kontaktregeln bleiben unangetastet.

**Verifiziert:** `npm run build` erfolgreich (1.296 Module); `git diff --check` erfolgreich, nur normale Windows-CRLF-Hinweise. Voller Spielstart mit der Sonnenstrecke nach dem Code-Reload funktioniert; das gerade sichtbare Kamerabild zeigt die Startgerade, nicht das Wasser.

**Nicht abgenommen:** Kein Nahbild des Kanalwassers und keine kontrollierte Fahrt über der Oberfläche; stärkere Normalmap-/Flusswahrnehmung bleibt eine gezielte Sichtprüfung. Kein Framezeitvergleich für diesen Materialpass.

**Geänderte Dateien:** `src/track-world.ts`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `PROGRESS-LOG.md`.

### 2026-10-04 – Kart-Rad-Detailpass

**Umgesetzt:** In `art-source/build_kart.py` erhielten alle vier Radmodelle je Felgenseite zwei feine umlaufende Seitenwandrippen sowie acht kleine metallische Felgenmuttern. Die neuen Teile werden mit dem Reifen-/Metallmaterial in die bestehenden jeweiligen `wheelSpin-*`-Materialgruppen verbunden. Radgeometrie-/Spin-Hierarchie und Laufzeitverträge bleiben bestehen.

**Verifiziert:** Blender 5.2.1 schrieb `art-source/hero-kart.blend` und den Roh-Export fehlerfrei; Blender meldete optionale Ressourcenwarnungen für globale Grease-Pencil-Brushpfade/Thumbnail-Schreibzugriff, aber `KART_COMPLETE` und einen abgeschlossenen glTF-Export. GlTF Transform erzeugte ein 4.843.924-Byte-Runtime-GLB aus 6.542.240 Bytes Rohquelle; gegenüber dem vorherigen Runtime-Export ist es 8.184 Bytes kleiner. Eine GLB-Strukturprüfung findet für alle vier Räder den jeweiligen `wheelSpin-*`-Knoten, Reifenmesh und Metallmesh; insgesamt 141 GLB-Meshes. `npm test`: 53/53; `npm run build`: erfolgreich, 1.296 Module. Build hat die bestehende Warnung zum 2.019,84-kB-Hauptchunk.

**Nicht abgenommen:** Keine visuelle Nahaufnahme/Bewegung der neuen Rippen und Muttern im echten Browserrennen sowie kein Framezeitvergleich. Der erste eingeschränkte Test-/Buildlauf scheiterte an `spawn EPERM`; die freigegebene Wiederholung bestand. `git diff --check` wird beim Paketabschluss erneut geprüft.

**Geänderte Dateien:** `art-source/build_kart.py`, `art-source/hero-kart.blend`, `public/assets/models/hero-kart.glb`, `docs/evidence/slice-asset-optimization.json`, `art-source/README.md`, `docs/22-character-vehicle-quality-master.md`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `PROGRESS-LOG.md`.

### 2026-10-04 – Fahrer-Hautmaterial in Nahansichten

**Umgesetzt:** `src/surface-textures.ts` ergänzt einen deterministischen Hauttexturtyp: eine 512×512-Farb-/Normaltextur mit sehr schwachen Poren, warm/kühlen Mikrovariationen und `.05` Normalstärke. `src/slice-scene.ts` erzeugt sie einmal pro Szene und weist sie beim Initialisieren des gemeinsam genutzten `Warm skin`-Materials zu. Gesichtsgeometrie, Gesichtsprofile, Farbe des GLB-Grundmaterials und Stoffmaterialien bleiben unverändert. Die Generierung ist beschränkt auf genau ein Texturpaar statt einer Textur je Fahrer. Der erste Headless-Blick zeigte ein zu punktiges Resultat; Dichte, Kontrast und Relief wurden anschließend reduziert.

**Verifiziert:** `npm run build` erfolgreich, 1.296 Module. `npm test`: 53/53. Der erste sandboxierte Versuch brach an `spawn EPERM` ab; die autorisierte Wiederholung bestand. `git diff --check` bestand vor diesem Pass, Warnungen waren nur LF→CRLF-Hinweise; nach dem Paket erneut prüfen.

**Nicht abgenommen:** Kein menschlicher Vergleich des neuen Hautmaterials in Front-/Nahansicht, unterschiedlichen Licht-/Wetterlagen; keine Aussage, die gewählte Porenstärke sei gestalterisch fertig. Die Textur bleibt bewusst subtil und kann anhand der nächsten echten In-Game-Nahansicht angepasst werden. Abschließendes `git diff --check` erfolgreich; Git meldete nur übliche LF→CRLF-Hinweise für Windows.

**Geänderte Dateien:** `src/surface-textures.ts`, `src/slice-scene.ts`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `art-source/README.md`, `docs/22-character-vehicle-quality-master.md`, `PROGRESS-LOG.md`.

### 2026-10-05 – Stalin-Limousine: Touring-Scheibe, Straßenwagen-Proportionen und Feldmützen-Haarlinie

**Befund:** Die jüngste echte Limousinenrevision hatte noch kein Windschutzteil, das die offene Staatslimousinenform klar vom generischen Kart absetzt. Eine maßstabsgetreue Blender-Studioansicht zeigte außerdem, dass 0,43-m-/0,44-m-Hinterreifen hinter den 0,36-m-Vorderrädern zusammen mit den hohen Radbögen noch einen Trecker-Eindruck erzeugten. Die erste Vorschau ließ auch Stalins swept Deckhaar über die Feldmütze ragen.

**Umgesetzt:** `art-source/build_kart.py` ergänzt nur unter `body-limousine` eine leicht nach hinten geneigte Touring-Scheibe (eigene Glasfläche, Metallseitenpfosten, Ober-/Unterrahmen, Mittelsteg, Scharniere und flach anliegender Wischer mit Gummilippe). `Limousine touring glass` bleibt in Babylon als GLB-Material transparent (`alphaMode: BLEND`, doppelseitig, Alpha .24) und als eigener, vom Body-Variantenknoten abstammender Mesh-Materialknoten erhalten. Die sichtbare Hinterradgröße wurde für die gemeinsame Grundbereifung auf Radius .36 m und Breite .39 m reduziert; vorn bleibt .36/.34. Hinterkotflügel folgt demselben Radius. Radpositionen, Radstand, Physik und Radbewegungs-Knoten wurden nicht verändert.

Stalins zwei Schläfensträhnen liegen zusätzlich unter `cast-stalin-hairline`, damit sein Feldmützen-Cast das separate swept Deckhaar nicht mehr aktiviert. Mund, Walrossbart, individuelle Nasenbrücke und übrige sechs Kopf-/Kartvarianten bleiben im Cast. Blender regenerierte `art-source/hero-kart.blend` (16.205.420 Byte) und Roh-GLB (7.365.372 Byte); glTF Transform schrieb 5.283.004 Byte Runtime, +52.692 Byte/+1,0 % zum vorherigen 5.230.312-Byte-Stand. Exakte Größen im [Optimierungsbericht](docs/evidence/slice-asset-optimization.json).

**Quellbildkontrolle:** [Stalin-Limousinen-Assetvorschau](docs/evidence/stalin-limousine-windscreen-asset-preview.png) rendert die Blender-Quelle mit ausgewählter Limousine/Cast, ist aber ausdrücklich keine Babylon-Spielaufnahme. Sie belegt weder den In-Game-Sitz der Scheibe/des Wischers noch Profil, Fahrt, Lenkeinschlag oder Stilakzeptanz.

**Verifiziert:** `tests/cast.test.mjs`: 2/2, einschließlich GLB-BLEND-Alpha, eigenständigem Glas-Materialknoten unter `body-limousine` und Cap-Haarlinienkonfiguration. Vollsuite `npm test`: 57/57 in 407,3 s. `npm run build`: TypeScript/Vite erfolgreich, 1.296 Module; bestehende große Hauptchunkwarnung (~2.022,68 kB) bleibt. `dist/assets/models/hero-kart.glb` stimmt bytegenau mit der öffentlichen Runtime-Datei überein (5.283.004 Byte). `git diff --check` sauber, nur normale Windows-LF/CRLF-Hinweise.

**Offen:** Eine separate headless Chrome-Sitzung auf Port 9230 startete nicht (Chrome beendet sich vor Listenerstart mit `mojo ... Zugriff verweigert`). Chrome-/Profil-Port 9223 des Nutzers wurde nicht berührt. Die vorhandene Codex-In-App-Spielseite wurde daher nicht interaktiv mit dem neuen Asset neu geladen/ausgewählt; echte Babylon-Nah-/Seiten-/Fahrbilder, Fahrerwahl, Sichtfeld, Windschutzscheiben-Culling/Reflexionen und menschliche Trecker-/Stilabnahme stehen weiter aus. Das vollständige Qualitätsanker- und Masterziel bleibt offen.

**Dokumentiert:** `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `art-source/README.md`, `docs/evidence/README.md`.

**Limitstand:** Offizielle Werte nach dem Paket: 6 % des Fünf-Stunden-Fensters verbraucht, 39 % des Wochenlimits verbraucht. Keine Zusatzkontingente oder Resets ausgelöst.

### 2026-10-05 – Kanalspray: Lesbarkeit bei flacher Wasserquerung

**Auswahl/Auftrag:** Marcels fortgesetzter autonomer Auftrag umfasst weitere bestätigte Ziele bis nahe an die offizielle Budgetgrenze. Nach dem Stalin-/Limousinenpass wurde aus dem bestätigten M3-Weltziel das Laufzeitpaket „flacher Kanalspray klarer lesbar“ vor Beginn in `CURRENT-WORKLIST.md` und `LONG-TERM-GOALS.md` aufgenommen.

**Befund und Änderung:** `canalSurfaceSprayRate` gab bei normaler Grafik nur 18, im Sparmodus nur 7 Sprites/s aus. Bei höchstens .42 s Lebenszeit bedeutete das in einer Überfahrt maximal wenige Partikel. Rate auf 30 (normal) und 14 (reduziert) angehoben; Sprites von .09–.24 auf .12–.29 m vergrößert, Lebenszeit auf .24–.48 s gestreckt. Jeder Kartpool bleibt bei 28 Teilchen, also maximal 168 für sechs Karts. Trigger bleibt Kanalabschnitt + mehr als 6 m/s + Höhe höchstens .35 m; Wasserphysik, Bergung, hoher Sprung und item-/absturzbedingter Splash blieben getrennt/unverändert.

**Verifiziert:** `tests/environment-effects.test.mjs`: 2/2. Abdeckung prüft Wasser-/Tempo-/Höhenfilter, Vorwärts- und Rückwärtsfahrt, normalen/geringeren Effektmodus, Partikelpool-Rechnung und die bestehenden engen Schaumkanten. `npm run build` nach dem ersten sandboxierten `spawn EPERM` erfolgreich wiederholt: TypeScript und Vite, 1.296 Module; bestehende Hauptchunkwarnung 2.022,68 kB bleibt. `git diff --check` folgt beim Checkpoint.

**Laufzeitbeleg / offen:** Im bestehenden Codex-In-App-Spiel wurden Fahrerwahl und stehende Stalin-Startaufstellung mit geladenen Fahrer-/Kartmodellen angesehen. Der Spieler blieb stehen; es wurde kein Wasser-/Kontaktpartikel ausgelöst. Keine echte Kanaldurchfahrt, Nahsicht auf das Wasser oder menschliche Lesbarkeitsabnahme behauptet. Die Browsersteuerung konnte hier keine gehaltene Fahrt ausführen. Chrome-Profil/Port 9223 blieb unangetastet.

**Geänderte Dateien:** `src/environment-effects.ts`, `src/slice-scene.ts`, `tests/environment-effects.test.mjs`, `CURRENT-WORKLIST.md`, `LONG-TERM-GOALS.md`, `TEAM-CHANGES.md`, `TEAM-NOTES.md`, `docs/22-character-vehicle-quality-master.md`, `PROGRESS-LOG.md`.

**Limitstand:** Nach dem Paket offiziell geprüft: 8 % Fünf-Stunden-Fenster und 40 % Wochenfenster verbraucht (92 % bzw. 60 % Rest; Wochenfenster ist aktuell bindend). Keine Zusatzkontingente/Resets aktiviert.
