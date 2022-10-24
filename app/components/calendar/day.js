import Component from '@glimmer/component';
import { processingDate } from '../../data/processingDate';
import { dayInWeek, importance, MonthArr } from '../../data/constants';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CalendarDayComponent extends Component {
  @inject plansStore$;

  day = +processingDate.getDay(this.args.day.date);
  month = MonthArr[+processingDate.getMonth(this.args.day.date) - 1];
  dayOfWeek = dayInWeek(this.args.day.date);
  isDayOf = this.dayOfWeek[0] === 'S';
  valueNotImportant = importance[0].value;
  valueImportant = importance[1].value;
  valueVeryImportant = importance[2].value;
}
