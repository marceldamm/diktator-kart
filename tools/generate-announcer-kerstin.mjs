import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repository = dirname(dirname(fileURLToPath(import.meta.url)));
const options = {
  piper: process.env.PIPER_EXE,
  model: process.env.PIPER_VOICE_MODEL,
  espeakData: process.env.PIPER_ESPEAK_DATA,
};
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

const output = join(repository, "client/public/audio/announcer-female");
mkdirSync(output, { recursive: true });
for (const [, cue, rawText] of lines) {
  const text = rawText.replaceAll("\\'", "'").replaceAll("\\n", "\n");
  const destination = resolve(output, `${cue}.wav`);
  const result = spawnSync(
    options.piper,
    [
      "--model",
      options.model,
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
  process.stdout.write(`Rendered female voice: ${cue}\n`);
}
process.stdout.write(
  `Generated ${lines.length} female German announcer cues in ${output}\n`,
);
