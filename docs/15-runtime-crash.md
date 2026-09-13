# Laufzeitbefund vom 13. September 2026

Die Browserprüfung des aktuellen Spielstands ist fehlgeschlagen. Nach Auswahl des Zeitfahrmodus und Versuch des Rennstarts blieb die Szene ohne funktionierenden Rennablauf stehen. Der Screenshot zeigte eine entfernte Startaufstellung, kein Spielerfahrzeug im Nahbereich und weiterhin das Item-HUD.

Die Browserkonsole meldet wiederholt `RuntimeError: memory access out of bounds` in `ammo.wasm.wasm`, anschließend `getGravity`, `AmmoPhysicsWorld.setGravity` und `RigidBodyComponentSystem.onUpdate`. Damit ist der aktuelle kombinierte Stand trotz erfolgreicher Builds nicht als spielbar verifiziert.

Eine vermutete Zerstörung des Physikkörpers durch den Massensetter wurde im installierten PlayCanvas-Code nicht bestätigt: Der Setter aktualisiert die Masse des bestehenden Körpers. `rigidbody.body` und `dynamicsWorld` liefern die nativen Ammo-Objekte. Diese Stellen wurden daher nicht auf Verdacht geändert.

Das Neuladen des Tabs lief in ein Zeitlimit; der Tab blieb in der Browserinventur vorhanden. Ein Timeout allein belegt keinen beendeten Browserprozess.

Nächste Untersuchung: erster Fehler nach frischem Start, Vergleich normaler Modus und isolierter kartTest-Modus, anschließend Lebensdauer von Ammo-Objekten und Aktivierung/Deaktivierung der Gegner beim Moduswechsel. Frühere grüne Prüfungen ersetzen diesen Laufzeitnachweis nicht.
