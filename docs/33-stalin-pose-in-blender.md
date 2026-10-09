# Stalins Sitzpose in Blender ändern – Anleitung für Einsteiger

Stand 09.10.2026 (Claude). Diese Anleitung setzt keine Blender-Kenntnisse voraus. Du brauchst nur die Maus mit Mausrad und die Tastatur.

**Die Dateien:**

| Datei | Wofür |
|---|---|
| `art-source/stalin-im-kart.blend` | Die Blender-Datei: Stalin mit Skelett im roten Limousinen-Kart „Fünfjahresplan 3000“ |
| `art-source/Stalin-Pose-ins-Spiel-exportieren.cmd` | Doppelklick schreibt deine gespeicherte Pose ins Spiel |
| `public/assets/models/stalin-driver.glb` | Die Datei, die das Spiel lädt (wird vom Export überschrieben) |
| `docs/evidence/stalin-kart-pose-20261009/` | Vergleichsbilder der aktuellen Pose (Seite, vorne, oben, Pedale, Hände, Spiel) |

## 1. Datei öffnen

1. Blender starten.
2. Oben links **File → Open…** (deutsch: **Datei → Öffnen…**) oder **Strg+O**.
3. Zu `D:\Diktator-Kart\art-source\` gehen, `stalin-im-kart.blend` anklicken, **Open** drücken.

Du siehst das Kart und Stalin. Über Stalin liegen farbige „Knochen“ (das Skelett, englisch *Rig* oder *Armature*). Die Datei startet schon im **Pose Mode** (Posenmodus): Das steht oben links im Auswahlfeld neben dem Blender-Logo.

Falls dort **Object Mode** steht: einmal auf einen Knochen von Stalin klicken und dann **Strg+Tab** drücken. Das Kart lässt sich absichtlich nicht anklicken, damit du nichts am Auto verschiebst.

## 2. Umsehen

- **Mittlere Maustaste gedrückt halten und ziehen:** Ansicht drehen.
- **Mausrad:** näher heran / weiter weg.
- **Shift + mittlere Maustaste ziehen:** Ansicht verschieben.
- Feste Ansichten: oben rechts im 3D-Fenster sind farbige Achsen-Kreise. Klick auf **X** = Seitenansicht, **Y** = Vorderansicht, **Z** = von oben. Mit Ziffernblock: **1** vorne, **3** Seite, **7** oben.
- Mehr Licht/Farben: oben rechts im 3D-Fenster die Kugel-Symbole; die dritte Kugel (**Material Preview**) zeigt die Texturen.

## 3. Welche Knochen wofür?

| Knochen (Name) | Farbe | Was er macht |
|---|---|---|
| `Hand-Ziel_l`, `Hand-Ziel_r` | rot | Wohin die Hand greift. Der Arm folgt automatisch. |
| `Fuss-Ziel_l`, `Fuss-Ziel_r` | rot | Wo der Fuß steht und wie er geneigt ist. Das Bein folgt automatisch. |
| `Ellbogen-Richtung_l/_r` | andere Farbe | Wohin der Ellbogen zeigt (nach außen/unten). |
| `Knie-Richtung_l/_r` | andere Farbe | Wohin das Knie zeigt (nach oben). |
| `spine_01`, `spine_02`, `spine_03` | normal | Rücken (vorbeugen/zurücklehnen, drehen). |
| `neck_01`, `Head` | normal | Hals und Kopf. |
| `root` | normal | Der ganze Fahrer auf einmal (z. B. im Sitz vor/zurück). |

`_l` ist Stalins **linke** Seite, `_r` seine **rechte** (aus seiner Sicht, also in Fahrtrichtung gesehen).
Den Namen des gewählten Knochens siehst du oben links im 3D-Fenster (z. B. „Stalin Rig : Hand-Ziel_l“) und rechts im Eigenschaften-Bereich unter **Bone** (Knochen-Symbol).

## 4. Knochen bewegen

1. Einen Knochen mit der **linken Maustaste** anklicken (er wird hell umrandet).
2. **G** drücken (*grab* = verschieben) und die Maus bewegen. **Linksklick** bestätigt, **Rechtsklick** oder **Esc** bricht ab.
   - Nach **G** zusätzlich **X**, **Y** oder **Z** drücken: Bewegung nur entlang dieser Achse (X = seitlich, Y = vor/zurück, Z = hoch/runter).
3. **R** drücken (*rotate* = drehen), Maus bewegen, Linksklick bestätigt. Auch hier geht **R** dann **X/Y/Z**. Eine Zahl eintippen (z. B. **R X 10 Enter**) dreht genau 10 Grad.
4. Rückgängig: **Strg+Z** (mehrmals möglich). Wiederholen: **Strg+Shift+Z**.
5. Einen Knochen in die Ausgangslage setzen: **Alt+G** (Position) bzw. **Alt+R** (Drehung). Achtung: Bei den roten Zielen springt die Hand/der Fuß dann zurück neben den stehenden Körper.

**Typische Korrekturen:**

- *Hand sitzt nicht genau am Lenkrad:* `Hand-Ziel_…` anklicken, **G**, ein kleines Stück bewegen. Für feine Schritte beim Bewegen **Shift** gedrückt halten.
- *Fuß zu hoch / steckt im Boden:* `Fuss-Ziel_…` anklicken, **G Z**, Maus hoch/runter. Neigung: **R X**.
- *Mehr vorgebeugt:* `spine_02` anklicken, **R X**, Maus bewegen.
- *Ellbogen zu weit draußen:* `Ellbogen-Richtung_…` mit **G** näher zum Körper ziehen.

Tipp: Oben rechts im Pose-Modus gibt es ein Symbol mit Schmetterling/„X“ (**X-Axis Mirror**). Ist es an, werden Änderungen links automatisch rechts gespiegelt (gilt für Drehungen am Körper).

## 5. Speichern

**Strg+S** (oder **File → Save**). Blender legt dabei automatisch eine Sicherung `stalin-im-kart.blend1` an; die ist lokal und wird nicht hochgeladen.

## 6. Pose ins Spiel bringen

1. In Blender gespeichert? (**Strg+S**)
2. Im Windows-Explorer `D:\Diktator-Kart\art-source\` öffnen und **`Stalin-Pose-ins-Spiel-exportieren.cmd` doppelklicken**.
3. Ein schwarzes Fenster erscheint. Bei Erfolg steht am Ende „Fertig: public\assets\models\stalin-driver.glb wurde geschrieben“. Taste drücken, Fenster schließt.
4. Im Spiel (Browser) **F5** drücken. Stalin erscheint mit der neuen Pose. Im Rennen bewegt das Spiel die Arme beim Lenken selbst; deine Pose ist die Geradeaus-Haltung.

Der Export ändert die `.blend`-Datei nicht. Nur sichtbare Teile werden exportiert (Körper, Kopf, Mütze).

## 7. Mantel (optional)

Der lange Mantel liegt in der Sammlung **„Mantel (ausgeblendet, nicht im Spiel)“**. Oben rechts im **Outliner** (Liste aller Objekte) beim Eintrag **Stalin Mantel** auf das **Auge** klicken, um ihn anzuzeigen. Er bewegt sich mit dem Skelett, ist für das Sitzen aber nicht angepasst und überschneidet Sitz und Beine. Solange das Auge zu ist, kommt er nicht ins Spiel.

## 8. Wenn etwas kaputt ist

- **Strg+Z**, bis es wieder stimmt, oder **File → Revert** (lädt den zuletzt gespeicherten Stand).
- Ganz neu erzeugen (überschreibt deine Änderungen in der `.blend`!): Claude oder Codex bitten, `art-source/build_stalin_kart_pose.py` neu auszuführen.

## Technischer Hintergrund (für Claude/Codex)

- Quelle: Marcels bezahltes Tripo-Modell (`.tools/raw-models/military-officer-3d-model/soviet-officer-parts-separated.glb`, lokal) und das Laufzeit-Kart `public/assets/models/hero-kart.glb` (Karosserie `body-limousine`). Aufbau reproduzierbar mit `art-source/build_stalin_kart_pose.py`, Export mit `art-source/export_stalin_kart_pose.py`.
- Kart-Rahmen wie bei den CC0-Fahrern: Blender +Y = vorne, +Z = oben, Ursprung am Boden. Sitzpolster oben z 0,85 m, Lehne vorne y −0,81 m. Das Lenkrad steht wie im Spiel (`slice-scene.ts` zieht es 0,22 m zum Fahrer und 0,03 m hoch, Lenksäule ×1,41).
- Skelett: Deform-Knochen tragen die Laufzeitnamen (`upperarm_l`, `lowerarm_l`, `hand_l` …), damit die Lenkrad-Arm-IK im Spiel weiter greift. Gewichte: Bone-Heat auf einer geschlossenen Metaball-Puppe um die Knochen, dann positionsbasiert (Gauß über die nächsten Puppenpunkte) auf die vielen offenen Tripo-Inseln übertragen, damit Nahtstellen nicht aufreißen.
- Pedale: Im Spiel liegen die Pedale der Limousine unsichtbar im geschlossenen Bodenblech (y 0,8, z 0,5) und sind für Stalins Beine nicht erreichbar. In der Blender-Datei sitzen sie deshalb unter den Fußballen (Bodenpedal, Neigung 25°). Das Spiel-Kart selbst ist unverändert; dort verschwinden die Fußspitzen unter dem Armaturenbrett.
- Export: Pose wird wie bei `build_cc0_driver.py` als Ruhepose gebacken; nur Deform-Knochen; Kopf wird als `Pilot head` und Mütze als `Pilot cap` abgetrennt (Fahrerwahl-Porträt und Kopf-Ausblenden in der Cockpitkamera).
