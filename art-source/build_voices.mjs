// Stadium announcer and six caricature driver voices (placeholder TTS; final voices must be human recordings), synthesised offline with Piper TTS.
// Voices: Thorsten / Thorsten emotional and Kerstin (rhasspy/piper-voices, CC0 datasets, MIT models).
// Run: node art-source/build_voices.mjs   (needs .tools/piper; see art-source/README.md)
// Lines are invented satire of self-importance; no real quote or slogan.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tools = existsSync(join(root, '.tools', 'piper')) ? join(root, '.tools', 'piper') : join(root, '..', '..', '..', '.tools', 'piper');
const piper = join(tools, 'piper', 'piper.exe');
const out = join(root, 'public', 'assets', 'audio', 'voice');
mkdirSync(out, { recursive: true });
const EMOTION = { amused: 0, angry: 1, disgusted: 2, drunk: 3, neutral: 4, sleepy: 5, surprised: 6, whisper: 7 };
const VOICE = {
  announcer: { model: 'de_DE-kerstin-low', length: 1.06 },
  male: { model: 'de_DE-thorsten_emotional-medium' },
  narrator: { model: 'de_DE-thorsten-high', length: .98 },
  female: { model: 'de_DE-kerstin-low', length: .95 },
};

/** id -> [voice, text, emotion?] */
const LINES = {
  'announcer-welcome': ['announcer', 'Hallo zusammen! Willkommen im Stadion der Eitelkeit. Sechs Fahrer, drei Runden. Viel Spaß!'],
  'announcer-grid': ['announcer', 'Alle bereit? Dann ab an den Start!'],
  'announcer-3': ['announcer', 'Drei!'],
  'announcer-2': ['announcer', 'Zwei!'],
  'announcer-1': ['announcer', 'Eins!'],
  'announcer-go': ['announcer', 'Los geht es! Gebt Gas!'],
  'announcer-lap2': ['announcer', 'Schon die zweite Runde! Weiter so!'],
  'announcer-final': ['announcer', 'Letzte Runde! Jetzt noch einmal alles geben!'],
  'announcer-lead': ['announcer', 'Da ist die neue Führung! Die Statistik wird schon korrigiert.'],
  'announcer-delivery': ['announcer', 'Volltreffer! Die Post ist da.'],
  'announcer-stamp': ['announcer', 'Oh! Ein Stempel auf der Strecke.'],
  'announcer-win': ['announcer', 'Geschafft! Herzlichen Glückwunsch. Ein Sieg ohne Sondererlaubnis!'],
  'announcer-finish': ['announcer', 'Und im Ziel! Schön, dass ihr dabei wart.'],
  'general-horn': ['male', 'Platz da! Mein Antrag ist dringend!', 'amused'],
  'marschall-horn': ['male', 'Zur Seite! Der Plan wartet nicht!', 'neutral'],
  'imperator-horn': ['male', 'Achtung! Mein Lorbeer hat Vorfahrt!', 'amused'],
  'kommandant-horn': ['male', 'Bitte den Weg frei stempeln!', 'neutral'],
  'kim-horn': ['male', 'Platz da! Ich habe dieses Rennen schon gestern gewonnen!', 'amused'],
  'castro-horn': ['male', 'Aus dem Weg! Meine Rede dauert noch vier Stunden!', 'neutral'],
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
  'kim-hit': ['male', 'Das wird nicht gesendet!', 'angry'],
  'kim-pass': ['male', 'Laut Staatsfernsehen fahre ich sowieso vorne!', 'amused'],
  'kim-win': ['male', 'Wie angekündigt: hundert Prozent Sieg.', 'amused'],
  'castro-hit': ['male', 'Eine Blockade! Schon wieder!', 'angry'],
  'castro-pass': ['male', 'Die Revolution überholt links!', 'neutral'],
  'castro-win': ['male', 'Ein Sieg! Dazu spreche ich jetzt. Ausführlich.', 'amused'],
};

const selected=process.argv.slice(2);
for (const [id, [voice, text, emotion]] of Object.entries(LINES)) {
  if(selected.length&&!selected.some(prefix=>id.startsWith(prefix)))continue;
  const v = VOICE[voice];
  const args = ['--model', join(tools, `${v.model}.onnx`), '--output_file', join(out, `${id}.wav`), '--length_scale', String(v.length ?? 1)];
  if (emotion) args.push('--speaker', String(EMOTION[emotion]));
  execFileSync(piper, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'] });
  // Piper peaks near full scale. Leave headroom for browser sample-rate conversion and the mix.
  const path=join(out, `${id}.wav`),wav=readFileSync(path);
  for(let offset=12;offset+8<=wav.length;){const size=wav.readUInt32LE(offset+4);if(wav.toString('ascii',offset,offset+4)==='data'){let peak=1;for(let i=offset+8;i<offset+8+size;i+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(i)));const gain=.8*32767/peak;for(let i=offset+8;i<offset+8+size;i+=2)wav.writeInt16LE(Math.round(wav.readInt16LE(i)*gain),i);break;}offset+=8+size+(size%2);}
  for(let retry=0;;retry++){try{writeFileSync(path,wav);break;}catch(error){if(retry>=10)throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100);}}
}
writeFileSync(join(out, 'lines.json'), JSON.stringify(Object.fromEntries(Object.entries(LINES).map(([id, [voice, text, emotion]]) => [id, { voice, text, emotion: emotion ?? null }])), null, 2) + '\n');
console.log(`${Object.keys(LINES).length} voice lines written to public/assets/audio/voice`);
