export const processingDate = {
  toYearMont(date) {
    return date.toISOString().slice(0, 7);
  },
  getDay(date) {
    return date.toISOString().slice(8, 10);
  },
  getMonth(date) {
    return date.toISOString().slice(5, 7);
  },
  getDateWithoutHour(date) {
    return date.toISOString().slice(0, 10);
  },
};
