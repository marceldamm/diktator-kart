/** Keep a course warning/event notice visible above ordinary item-card messages. */
export function selectRaceInfoNotice(now: number, courseNotice: string, courseNoticeUntil: number, regularNotice: string): string {
  return courseNotice && now < courseNoticeUntil ? courseNotice : regularNotice;
}
