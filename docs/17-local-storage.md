# Lokale Speicherung

Bestzeiten und Einstellungen fangen verweigerten beziehungsweise vollen Browserspeicher ab. Während der Sitzung bleiben geschriebene Werte im Arbeitsspeicher verfügbar. Bei einer fehlgeschlagenen Rekordspeicherung weist der Ergebnisbericht auf die fehlende Dauerhaftigkeit hin. Das Einstellungsfenster kennzeichnet Änderungen für die laufende Sitzung ebenfalls.

Gespeicherte Lautstärken werden auf endliche Werte zwischen null und eins beschränkt; beschädigte Konfigurationen verwenden Standardwerte. Bestzeiten müssen endlich und positiv sein.

`node tools/storage-regression.mjs` prüft verweigerten Speicher, Sitzungserhalt und ungültige Bestzeiten erfolgreich. Typprüfung und Lint erfolgreich. Die Persistenz über einen echten Browserneustart bleibt separat abzunehmen.
