// Stadium announcer and six fictional driver voices, synthesised offline with Piper TTS.
// Voices: Thorsten / Thorsten emotional and Kerstin (rhasspy/piper-voices, CC0 datasets, MIT models).
// Run: node art-source/build_voices.mjs   (needs .tools/piper; see art-source/README.md)
// Lines are satire of bureaucratic self-importance; no historical person, quote or slogan.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tools = existsSync(join(root, '.tools', 'piper')) ? join(root, '.tools', 'piper') : join(root, '..', '..', '..', '.tools', 'piper');
const piper = join(tools, 'piper', 'piper.exe');
const out = join(root, 'public', 'assets', 'audio', 'voice');
mkdirSync(out, { recursive: true });
const EMOTION = { amused: 0, angry: 1, disgusted: 2, drunk: 3, neutral: 4, sleepy: 5, surprised: 6, whisper: 7 };
const VOICE = {
  announcer: { model: 'de_DE-kerstin-low', length: 1.02 },
  male: { model: 'de_DE-thorsten_emotional-medium' },
  narrator: { model: 'de_DE-thorsten-high', length: .98 },
  female: { model: 'de_DE-kerstin-low', length: .95 },
};

/** id -> [voice, text, emotion?] */
const LINES = {
  'announcer-welcome': ['announcer', 'Willkommen im Stadion der Eitelkeit! Sechs Fahrer, drei Runden, null Widerspruch.'],
  'announcer-grid': ['announcer', 'Bitte nehmen Sie Ihre genehmigten Startplätze ein.'],
  'announcer-3': ['announcer', 'Drei!'],
  'announcer-2': ['announcer', 'Zwei!'],
  'announcer-1': ['announcer', 'Eins!'],
  'announcer-go': ['announcer', 'Los! Der Antrag ist genehmigt!'],
  'announcer-lap2': ['announcer', 'Zweite Runde. Jubel ist weiterhin Pflicht.'],
  'announcer-final': ['announcer', 'Letzte Runde! Bitte applaudieren Sie vorschriftsmäßig.'],
  'announcer-lead': ['announcer', 'Neue Führung! Die Geschichtsbücher werden bereits umgeschrieben.'],
  'announcer-delivery': ['announcer', 'Zustellung erfolgreich!'],
  'announcer-stamp': ['announcer', 'Stempelfalle! Antrag abgelehnt.'],
  'announcer-win': ['announcer', 'Sieg! Das Ergebnis stand selbstverständlich schon vorher fest.'],
  'announcer-finish': ['announcer', 'Ziel erreicht. Ihre Platzierung wird nun geprüft.'],
  'general-hit': ['male', 'Das ist Hochverrat!', 'angry'],
  'general-pass': ['male', 'Platz da! Ich habe Vorfahrt per Dekret!', 'angry'],
  'general-boost': ['male', 'Vorwärts, im Namen der Ordnung!', 'neutral'],
  'general-win': ['male', 'Ich danke mir persönlich für diesen Sieg!', 'amused'],
  'marschall-hit': ['male', 'Unerhört! Das gibt ein Nachspiel!', 'disgusted'],
  'marschall-pass': ['male', 'Zur Seite! Hier kommt die Planerfüllung!', 'angry'],
  'marschall-win': ['male', 'Planziel übererfüllt.', 'neutral'],
  'imperator-hit': ['male', 'Mein Lorbeer! Wer war das?', 'surprised'],
  'imperator-pass': ['male', 'Ha! Ihr Bauern seid zu langsam!', 'amused'],
  'imperator-win': ['male', 'Selbstverständlich. Wie immer.', 'amused'],
  'kommandant-hit': ['male', 'Formular nicht ausgefüllt!', 'angry'],
  'kommandant-pass': ['male', 'Überholvorgang ordnungsgemäß abgeschlossen.', 'neutral'],
  'kommandant-win': ['male', 'Der Sieg wurde ordnungsgemäß abgestempelt.', 'neutral'],
  'diva-hit': ['female', 'Mein Lack! Das bezahlen Sie!'],
  'diva-pass': ['female', 'Aus dem Weg, Darling!'],
  'diva-win': ['female', 'Applaus, bitte. Mehr Applaus!'],
  'admiralin-hit': ['female', 'Schaden an Backbord!'],
  'admiralin-pass': ['female', 'Volle Kraft voraus!'],
  'admiralin-win': ['female', 'Kurs gehalten. Wie befohlen.'],
};

for (const [id, [voice, text, emotion]] of Object.entries(LINES)) {
  const v = VOICE[voice];
  const args = ['--model', join(tools, `${v.model}.onnx`), '--output_file', join(out, `${id}.wav`), '--length_scale', String(v.length ?? 1)];
  if (emotion) args.push('--speaker', String(EMOTION[emotion]));
  execFileSync(piper, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'] });
}
writeFileSync(join(out, 'lines.json'), JSON.stringify(Object.fromEntries(Object.entries(LINES).map(([id, [voice, text, emotion]]) => [id, { voice, text, emotion: emotion ?? null }])), null, 2) + '\n');
console.log(`${Object.keys(LINES).length} voice lines written to public/assets/audio/voice`);
