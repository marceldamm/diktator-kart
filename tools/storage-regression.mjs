import assert from 'node:assert/strict';
const { readBestTime, writeSave } = await import('../client/src/game/local-save.ts');
globalThis.localStorage = {
    getItem() { throw new Error('Storage denied'); },
    setItem() { throw new Error('Storage full'); }
};
assert.equal(readBestTime('missing'), null);
assert.equal(writeSave('best', '120.5'), false);
assert.equal(readBestTime('best'), 120.5);
writeSave('invalid', 'Infinity');
assert.equal(readBestTime('invalid'), null);
writeSave('negative', '-5');
assert.equal(readBestTime('negative'), null);
console.log('PASS: denied storage is nonfatal, session record survives, invalid times rejected');
