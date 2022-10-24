export const DayOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const MonthArr = [
  'Jun',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
export const importance = [
  { value: 'not_matter', label: "doesn't matter" },
  { value: 'important', label: 'important' },
  { value: 'very_important', label: 'very important' },
];
export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
export function currDayInMonth() {
  return new Date().getDate();
}
export function dayInWeek(date) {
  return DayOfWeek[date.getDay()];
}
export const paddingCalendar = 60;
export const widthCalendarDay = 90;
