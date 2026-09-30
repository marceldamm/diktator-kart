# Fahrgeräusche – erster integrierter Stand

Ein lokaler Web-Audio-Kanal erzeugt einen einfachen Motorgrundton aus Geschwindigkeit und Gasstellung. Das Erreichen der beiden Driftstufen sowie der Beginn eines Boosts lösen unterschiedliche aufsteigende Signale aus. Der Effektregler und die Gesamtlautstärke wirken auf diesen Kanal. Die Sprecherlautstärke bleibt getrennt.

Der Rennstart-Button aktiviert die Audiowiedergabe. Pause und Einstellungen suspendieren den Audiokontext. Kurze Stimmen trennen ihre Audioknoten nach dem Abspielen, der Motor verwendet einen einzigen dauerhaften Oszillator. Kein externer Dienst ist erforderlich.

Typprüfung, Lint und Produktions-Build erfolgreich. Der erste Soundpass ist ausgebaut; die Hörprüfung mit Sarah sowie Reifen-, Untergrund-, Sprung-, Kollisions- und weitere Ereignisgeräusche bleiben offen.

## Fahr-Audio-Pass

Der Motor mischt nun einen Grundton und eine Oberwelle; Drehzahl folgt Geschwindigkeit, Gas und Boost. Ein gepooltes Rauschsignal bildet Reifen-/Driftgeräusch abhängig von Seitengeschwindigkeit und Driftzustand. Ein zweites gefiltertes Rauschsignal erzeugt zunehmenden Fahrtwind. Beide Kanäle laufen lokal über Web Audio und werden mit Pause, Neustart sowie dem vorhandenen Effektregler gesteuert. Das Minikarten-Canvas zeichnet höchstens zehnmal pro Sekunde.

Aufnahme, Treffer, Schild und Itemeinsatz erzeugen außerdem kurze synthetische Rückmeldungen, zusätzlich zu den Sprecher-WAVs. Die Signale verwenden Hüllkurven und trennen sich nach dem Ende wieder vom Audiobus.

## Prozeduraler Rennscore

Der Rennscore wird offline per WebAudio erzeugt und nutzt einen eigenen Musik-Bus, getrennt von Motor und Effekten. Der Musikregler wirkt direkt; in MenÃ¼ und Pause stoppt die Wiedergabe. In der Schlussrunde wechseln Tempo und Moll-Tonfolge. Die finale Lautheits- und HÃ¶rabnahme muss weiterhin mit Sarah auf echten Lautsprechern und KopfhÃ¶rern erfolgen.

## Sprecher-Pass

Die 24 Ansagen liegen zusätzlich als vorproduzierte Piper-Neuralstimmen unter `client/public/audio/announcer-neural/`. Das Spiel lädt diese Clips zuerst und fällt bei fehlender Datei auf die bisherigen WAVs zurück. Ein Mapping nutzt die im Modell verfügbaren Emotionen pro Cue, etwa Überraschung beim Führungswechsel, Ärger bei Treffern, Flüstern bei Geheimpolizei und Müdigkeit bei Rückschlägen. Der Browser benötigt weder den Synthesizer noch das Sprachmodell; alle Clips sind lokal.

Die Audiodateien wurden mit Piper 1.2 und dem deutschen Modell `thorsten_emotional` erzeugt. Dessen Modellkarte beschreibt acht Emotionssprecher und nennt den Thorsten-Voice-Datensatz CC0. Der Generator `tools/generate-announcer-piper.mjs` liest die Texte direkt aus `announcer.ts`; Piper, ONNX-Modell und eSpeak-Daten werden nur zur Erzeugung lokal benötigt und sind nicht Teil des Browserpakets.

Quellen: [Piper](https://github.com/rhasspy/piper), [Modellkarte und Datensatzlizenz](https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/de/de_DE/thorsten_emotional/medium/MODEL_CARD), [Emotionszuordnung des Modells](https://huggingface.co/rhasspy/piper-voices/raw/v1.0.0/de/de_DE/thorsten_emotional/medium/de_DE-thorsten_emotional-medium.onnx.json).

Die neue Synthese, die Sprecherclips und der Rennscore brauchen noch eine Hörabnahme auf Lautsprechern und Kopfhörern. Individuelle Streckenatmosphäre, Räumlichkeit und weitere Sprecheraufnahmen bleiben offen.
