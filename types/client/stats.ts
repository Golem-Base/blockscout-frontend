export type StatsInterval = { id: StatsIntervalIds; title: string };
export type StatsIntervalIds = keyof typeof StatsIntervalId;
export enum StatsIntervalId {
  all,
  oneDay,
  oneMonth,
  threeMonths,
  sixMonths,
  oneYear,
}
