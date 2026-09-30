# Sprecherinnen-Stimme

Für alle 24 deutschen Ansagetexte liegen zusätzliche, lokal abspielbare WAV-Clips vor. Die Stimmen wechseln sich im Spiel ab; wenn ein Frauenclip fehlt, wird auf die vorhandene neuronale Männerstimme zurückgegriffen. So bleibt die Rennansage ohne Online-Dienst und ohne Browser-TTS lauffähig.

Die Frauenclips wurden mit Piper 1.2 und dem deutschen Modell `de_DE-kerstin-low` erzeugt. Piper selbst und das ONNX-Modell sind nicht Bestandteil des Browserpakets. Die [Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/de/de_DE/kerstin/low/MODEL_CARD) nennt den Kerstin-Datensatz CC0. Der Generator liegt in `tools/generate-announcer-kerstin.mjs` und verwendet dieselben Textzeilen wie `client/src/game/announcer.ts`.

Die Clips sind 16-kHz-Mono-WAVs. Eine subjektive Hörabnahme auf den Ziel-Lautsprechern steht noch aus; für diese Runde ist die technische Asset-Vollständigkeit, nicht die klangliche Endabnahme, geprüft.
