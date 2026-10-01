# Laufzeitbefund vom 13. September 2026

## Korrektur und erster Nachtest

Der RaycastController speicherte Rückgabereferenzen von `addWheel`, während weitere Räder hinzugefügt wurden. Die interne Bullet-Radliste kann beim Wachsen zuvor gelieferte Referenzen ungültig machen. Der Controller holt jetzt alle vier dauerhaften Referenzen über `getWheelInfo` erst nach der letzten Einfügung. Die einmalige Konfiguration direkt nach jeder Einfügung bleibt gültig.

Nach dieser Änderung startete das normale Rennen im Browser: Spieler-Kart und fahrende Bots sichtbar, Rennzeit über 13 Sekunden, leeres Fehlerprotokoll. Typprüfung, Lint und Build erfolgreich. Das ist ein positiver erster Laufzeitnachweis, noch keine vollständige Stabilitätsabnahme. Ein anschließender Pausentest wurde durch einen unerwartet geänderten UI-Zustand unterbrochen und gilt nicht als bestanden.

## Ursprünglicher Fehler

Zusätzlicher Regressionstest: `node tools/wheel-lifetime-regression.mjs` modelliert eine bei jeder Radeinfügung umziehende Bullet-Radliste. Er instanziiert den echten Controller und prüft dessen anschließende Grip-Aktualisierung. Alle vier Schreibzugriffe verwenden nach der Korrektur gültige Referenzen. Der Test deckt die Referenzlebensdauer ab, nicht die gesamte native Ammo-Simulation.

Die Browserprüfung des aktuellen Spielstands ist fehlgeschlagen. Nach Auswahl des Zeitfahrmodus und Versuch des Rennstarts blieb die Szene ohne funktionierenden Rennablauf stehen. Der Screenshot zeigte eine entfernte Startaufstellung, kein Spielerfahrzeug im Nahbereich und weiterhin das Item-HUD.

Die Browserkonsole meldet wiederholt `RuntimeError: memory access out of bounds` in `ammo.wasm.wasm`, anschließend `getGravity`, `AmmoPhysicsWorld.setGravity` und `RigidBodyComponentSystem.onUpdate`. Damit ist der aktuelle kombinierte Stand trotz erfolgreicher Builds nicht als spielbar verifiziert.

Eine vermutete Zerstörung des Physikkörpers durch den Massensetter wurde im installierten PlayCanvas-Code nicht bestätigt: Der Setter aktualisiert die Masse des bestehenden Körpers. `rigidbody.body` und `dynamicsWorld` liefern die nativen Ammo-Objekte. Diese Stellen wurden daher nicht auf Verdacht geändert.

Das Neuladen des Tabs lief in ein Zeitlimit; der Tab blieb in der Browserinventur vorhanden. Ein Timeout allein belegt keinen beendeten Browserprozess.

Nächste Untersuchung: erster Fehler nach frischem Start, Vergleich normaler Modus und isolierter kartTest-Modus, anschließend Lebensdauer von Ammo-Objekten und Aktivierung/Deaktivierung der Gegner beim Moduswechsel. Frühere grüne Prüfungen ersetzen diesen Laufzeitnachweis nicht.
