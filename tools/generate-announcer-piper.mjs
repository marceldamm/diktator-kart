import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = dirname(dirname(fileURLToPath(import.meta.url)));
const defaults = {
  piper: process.env.PIPER_EXE,
  model: process.env.PIPER_VOICE_MODEL,
  espeakData: process.env.PIPER_ESPEAK_DATA,
};
const options = { ...defaults };
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index].replace(/^--/, "");
  if (!(key in options))
    throw new Error(`Unknown option: ${process.argv[index]}`);
  options[key] = process.argv[index + 1];
}
for (const [name, value] of Object.entries(options)) {
  if (!value)
    throw new Error(
      `Provide --${name} or set its PIPER_* environment variable.`,
    );
}

const source = readFileSync(
  join(repository, "client/src/game/announcer.ts"),
  "utf8",
);
const block = source.match(
  /const TEXT: Record<AnnouncerCue, string> = \{([\s\S]*?)\n\};/,
);
if (!block) throw new Error("Could not find announcer text dictionary.");
const lines = [
  ...block[1].matchAll(/^\s+([A-Za-z][A-Za-z0-9]*): '((?:\\.|[^'])*)',?\s*$/gm),
];
if (lines.length !== 24)
  throw new Error(`Expected 24 announcer lines, found ${lines.length}.`);

const emotion = {
  start: 4,
  lap2: 4,
  finalLap: 6,
  finish: 0,
  lead: 0,
  losePlace: 3,
  lastPlace: 5,
  comeback: 6,
  pickup: 0,
  rocket: 1,
  immunity: 0,
  shielded: 6,
  hit: 1,
  plan: 0,
  planPenalty: 5,
  shortcut: 1,
  propaganda: 0,
  censor: 2,
  statue: 2,
  police: 7,
  closeFinish: 6,
  collision: 1,
  drift: 0,
  reverse: 7,
};
const output = join(repository, "client/public/audio/announcer-neural");
mkdirSync(output, { recursive: true });

for (const [, cue, rawText] of lines) {
  const text = rawText.replaceAll("\\'", "'").replaceAll("\\n", "\n");
  const destination = resolve(output, `${cue}.wav`);
  const result = spawnSync(
    options.piper,
    [
      "--model",
      options.model,
      "--speaker",
      String(emotion[cue] ?? 4),
      "--output_file",
      destination,
      "--espeak_data",
      options.espeakData,
      "--quiet",
    ],
    {
      input: `${text}\n`,
      encoding: "utf8",
      stdio: ["pipe", "ignore", "inherit"],
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `Piper failed for cue ${cue} with status ${result.status}.`,
    );
  process.stdout.write(`Rendered ${cue}\n`);
}

process.stdout.write(
  `Generated ${lines.length} emotional German cues in ${output}\n`,
);
