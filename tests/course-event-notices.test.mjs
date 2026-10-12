import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_EVENT_WARNINGS, courseEventWarning } from '../src/course-event-notices.ts';

test('each course has a distinct lap-two warning with its own event and route cue', () => {
  assert.deepEqual(Object.keys(COURSE_EVENT_WARNINGS).sort(), ['beijing', 'berlin', 'havana', 'moscow', 'pyongyang', 'rome']);
  const warnings = Object.values(COURSE_EVENT_WARNINGS);
  assert.equal(new Set(warnings).size, warnings.length, 'course warnings must stay distinct');
  for (const warning of warnings) assert.match(warning, /Nächste Runde|Vorwarnung/);
  assert.match(COURSE_EVENT_WARNINGS.berlin, /Zeppelin.*Stadion/);
  assert.match(COURSE_EVENT_WARNINGS.havana, /Malecón-Welle.*Uferstraße/);
  assert.match(COURSE_EVENT_WARNINGS.rome, /Balkon/);
  assert.match(COURSE_EVENT_WARNINGS.moscow, /Ehrenparade.*Rückenwind/);
  assert.match(COURSE_EVENT_WARNINGS.beijing, /Pflichtjubel.*Serpentine.*außen bleibt freie Fahrt/);
  assert.match(COURSE_EVENT_WARNINGS.pyongyang, /Paradekolonne.*rechte Spur.*Tor-Allee/);
  assert.equal(courseEventWarning('unknown'), undefined, 'unknown themes must not inherit another course warning');
});
