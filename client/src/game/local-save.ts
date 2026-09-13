/** Storage can be denied by browser policy; racing must remain usable. */
const sessionSave = new Map<string, string>();

export function readSave(key: string): string | null {
    if (sessionSave.has(key)) return sessionSave.get(key)!;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writeSave(key: string, value: string): boolean {
    sessionSave.set(key, value);
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

export function readBestTime(key: string): number | null {
    const time = Number(readSave(key));
    return Number.isFinite(time) && time > 0 ? time : null;
}
