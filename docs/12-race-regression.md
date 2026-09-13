# Rennabschluss und Regression

Der Ergebnisbericht verwendet den tatsächlichen Platz, die Rennzeit und die beste Runde. Im Zeitfahren ersetzt der gespeicherte Rekord die Platzanzeige. Eine satirische Schlagzeile richtet sich nach dem Ergebnis; die Kennzahlen werden nicht verfälscht.

Beendete Rennen werden nach ihrer Zielzeit geordnet. Zuvor bekamen alle fertigen Fahrer denselben Fortschrittswert, wodurch Platz eins fälschlich angezeigt werden konnte. Ein Neustart löscht die beste Runde des vorherigen Rennens. Die langfristige Zeitfahrbestzeit bleibt separat gespeichert.

Temporäre Itemstatuen verwenden Rennzeit statt eines unabhängigen Browser-Timers und werden beim Neustart entfernt. Itemeffekte laufen bei Pause nicht mehr ab. Pause und Einstellungen setzen jetzt die PlayCanvas-Spieluhr auf null; damit werden auch Physik und Renntimer angehalten. Der Sprecher pausiert ebenfalls. Eingaben werden an diesen Übergängen verworfen, und Tastaturbedienung von Formularfeldern erzeugt keine Fahrbefehle. Die gemeinsame Laufzeitprüfung bleibt offen.

## Nachweis

Die Torbreite wird am interpolierten Schnittpunkt der Fahrt mit der Checkpoint-Ebene geprüft. Zusätzliche Tests decken gültige Durchfahrt mit Endposition außerhalb sowie ungültige Durchfahrt mit Endposition innerhalb ab. Der LOS-Hinweis verschwindet nach 1,2 Rennsekunden; auch das ist im Regressionstest geprüft.

`node tools/race-regression.mjs` prüft drei vollständige logische Runden, die Reihenfolge zweier Zieleinläufe, den Neustart sowie fehlende und falsch angefahrene Checkpoints. Der Test ist erfolgreich. TypeScript, ESLint und Produktions-Build sind ebenfalls erfolgreich.

Der Test simuliert Positionswechsel, keine physische Fahrt. Visuelle Browserabnahme, drei gefahrene Rennen und die animierte Siegerehrung stehen noch aus. Musik- und Effektregler aus dem vorherigen Stand sind bislang nur Einstellungen; ohne entsprechende Audiokanäle sind sie noch keine vollständig wirksamen Lautstärkeregler.
