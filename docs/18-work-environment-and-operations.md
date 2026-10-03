# Arbeitsumgebung, Berechtigungen und Betriebsregeln

## Ziel

Codex/ChatGPT soll das Projekt auf dem Windows-PC praktisch voranbringen können: Dateien lesen und ändern, Browser und lokale Entwicklungswerkzeuge benutzen, Tests ausführen, Bilder und Audio prüfen, Assets erzeugen und bei Bedarf geeignete Programme installieren. Diese Erlaubnis gilt für das Projekt und seine Produktionsumgebung, nicht als Aufforderung zu unkontrollierten oder unnötigen Eingriffen.

## Erlaubte Arbeitsmittel

Innerhalb der Projektarbeit darf Codex nach begründeter Auswahl verwenden:

- Windows-Dateisystem, Projektordner und lokale Referenzmaterialien
- Google Chrome für Start, Spieltests, Screenshots und Performancebeobachtung
- Babylon.js-, TypeScript-, Vite- und Node-Werkzeuge
- Blender oder ein vergleichbares 3D-Programm für editierbare Modelle
- Bild-, Audio- und Video-/Renderwerkzeuge
- lokale Testautomatisierung, Browser-Entwicklerwerkzeuge und Messprogramme
- geeignete zusätzliche Programme oder Bibliotheken, wenn sie den aktuellen Meilenstein direkt unterstützen

Installationen werden kurz begründet, auf das notwendige Ziel begrenzt und im Fortschrittslog dokumentiert. Betriebssystem-Sicherheitsdialoge, Kontobeschränkungen, Netzwerkregeln und Produktregeln bleiben gültig; „voller Zugriff“ bedeutet nicht, Sicherheitskontrollen zu umgehen.

## Startbarkeit als Pflicht

Jeder spielbare Zwischenstand braucht einen einfachen Startweg ohne Entwicklerkonsole:

- sichtbarer Startbutton oder eine eindeutige Desktop-/Projektverknüpfung
- lokaler Start des benötigten Servers und Öffnen in Google Chrome
- verständlicher Status bei Start, Laden, Fehler und Beenden
- Möglichkeit, das Spiel mit einem klaren X bzw. Browserfenster zu schließen
- kurze Startanleitung für Nutzer und eine technische Startanleitung für Codex

Für die Entwicklung ist eine Ein-Klick-Verknüpfung oder ein Launcher vorgesehen. Der genaue Mechanismus wird im ersten Babylon.js-Prototyp festgelegt. Eine Kommandozeile darf intern existieren, aber nicht der einzige Weg für den Nutzer sein.

**M1-Umsetzung:** `Diktator-Kart-starten.cmd` im Projektroot doppelklicken. Der Starter prüft Chrome und Port 4173, installiert bei fehlenden lokalen Abhängigkeiten mit `npm ci`, startet Vite auf `127.0.0.1:4173` und öffnet Chrome automatisch. Das Konsolenfenster bleibt für den Serverstatus offen. Der finale Startweg wurde am 03.10.2026 lokal ausgeführt; Vite antwortete mit HTTP 200 und ein Chrome-Fenster mit dem Titel der M1-Testszene war sichtbar. Beim Schließen des Browsers endet der Server nicht automatisch; Strg+C im Starterfenster und die Windows-Rückfrage mit J beenden ihn.

## Lokale Arbeitsregel

Aktiver Projektpfad: `D:\Diktator-Kart`. Das neue Projekt liegt direkt im Hauptverzeichnis. Das alte Spiel einschließlich seiner bisherigen lokalen Änderungen ist unter `Diktator-Kart-Legacy/` archiviert. Die schon vorhandene Legacy-Kopie bleibt dort zusätzlich in `Sicherung-vor-Umzug-2026-10-03/`. Die aktive `.git`-Verwaltung bleibt im Hauptverzeichnis. Der Umzug allein erzeugt keinen neuen Commit und keine GitHub-Veröffentlichung.

Es wird nichts aus dem Altspiel gelöscht. Der alte Starter liegt im Archiv; seine Funktion nach dem Umzug ist noch nicht geprüft. Neue Spielstarts erhalten in M1 einen eigenen eindeutigen Einstieg. Referenzzugriffe auf Altdateien müssen den neuen Archivpfad verwenden. Arbeitskopien im ChatGPT-Spiegel gelten nicht als aktive Projektbasis.

Ein erster Verschiebeversuch wurde durch versteckte Git-Dateien unterbrochen. Die Teilkopien wurden auf identische Inhalte geprüft und die Sicherung wieder zusammengesetzt. Der dabei entstandene Zwischenstand bleibt zusätzlich unter `Diktator-Kart-Legacy/Umzugs-Zwischenstand-2026-10-03/` erhalten; er ist keine aktive Projektbasis.

Windows verweigerte auch den direkten Umzug der bisherigen Sicherung `D:\Diktator-Kart\Legacy`. Deshalb wird sie vollständig ins neue Archiv kopiert; der ursprüngliche Ordner `Legacy/` bleibt zusätzlich erhalten, bis seine Verschiebesperre geklärt ist. Es wurden keine Zugriffsrechte geändert. Die aktive Altspielbasis wird unabhängig davon ins neue Archiv verschoben.

Vorerst nur vorhandene oder kostenlose Werkzeuge/Assets einsetzen. Zusätzliche kostenpflichtige Musik-, Stimmen- oder Hostingdienste sind nicht freigegeben.

Vor jedem längeren Lauf werden Ziel, erwartete Dauer, erzeugte Dateien, Abbruchmöglichkeit und Ergebnisprüfung festgelegt. Nach dem Lauf dokumentiert Codex, was tatsächlich passiert ist. Keine behauptete Installation, kein behaupteter Test und kein behaupteter Screenshot ohne Beleg.

## Persönlicher Mess-PC

Am 03.10.2026 wurden lesend folgende Daten ermittelt:

- Windows 11 Pro 64-Bit, Build 26200
- Intel Core i7-11800H, 16 logische Prozessoren
- 32 GB installierter Arbeitsspeicher laut Windows-Systeminformation
- NVIDIA GeForce RTX 3070 Laptop GPU

Dieser Rechner ist die persönliche Entwicklungs- und Komfortreferenz, aber ausdrücklich nicht das Mindestziel. Die Mindestzielmessung braucht zusätzlich einen deutlich schwächeren PC mit integrierter Grafik oder vergleichbarer Leistung.

## Sarahs Arbeitsumgebung

Falls Sarah ebenfalls mit einem PC arbeitet, werden Betriebssystem, Browser, Hardware, verfügbare Programme und Installationsrechte separat aufgenommen. Die gemeinsame Projektbasis darf nicht stillschweigend voraussetzen, dass beide Arbeitsplätze identisch sind.

## Zusätzliche Testgeräte

Der Nutzer hat ein iPhone 15 Pro benannt. Android und iPhone im Querformat sind verbindliche Anschlussplattformen. Sarahs Handy, ein Android-Testgerät und ein schwacher PC mit integrierter Grafik sind noch nicht festgelegt; keine Leistungstests auf diesen Geräten behaupten.
