export const evalStrategy = (times: number) => ({
  'Very Hard': 60,
  Hard: 5 * 60,
  Nomal: 60 * 30 * (times + 1) < 259200 ? 60 * 30 * (times + 1) : 259200,
  Easy:
    60 * 60 * 24 * 3 * (times + 1) < 7776000
      ? 60 * 60 * 24 * 3 * (times + 1)
      : 7776000,
});
