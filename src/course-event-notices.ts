/** Track-specific lap-one warnings for the shared lap-two course events. */
export const COURSE_EVENT_WARNINGS = {
  havana: 'Vorankündigung: Nächste Runde rollt die Malecón-Welle über die Uferstraße',
  rome: 'Vorankündigung: Nächste Runde spricht der Balkon',
  moscow: 'Vorankündigung: Nächste Runde Ehrenparade mit Rückenwind',
  beijing: 'Vorwarnung: Pflichtjubel in der Regelheft-Serpentine · außen bleibt freie Fahrt',
  pyongyang: 'Vorankündigung: Nächste Runde rollt die Paradekolonne über die rechte Spur der Tor-Allee',
  berlin: 'Vorankündigung: Nächste Runde überfliegt der Propaganda-Zeppelin das Stadion',
} as const;

export function courseEventWarning(theme: string): string | undefined {
  return COURSE_EVENT_WARNINGS[theme as keyof typeof COURSE_EVENT_WARNINGS];
}
