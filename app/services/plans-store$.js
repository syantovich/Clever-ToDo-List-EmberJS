import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import { processingDate } from '../data/processingDate';
import { daysInMonth, importance } from '../data/constants';

export default class PlansStoreService extends Service {
  @inject db;
  @inject loadingStore$;

  @tracked selected = new Date();
  @tracked plans = {};
  @tracked days = [];
  @tracked selectedArr = [];
  @tracked nextMonth = new Date().getMonth();

  addMonth = async () => {
    const copyPlans = this.getPlans;
    const year = new Date().getFullYear();
    const yearMonth = processingDate.toYearMont(
      new Date(year, this.nextMonth + 1)
    );
    const endIndex = daysInMonth(this.nextMonth + 1, year);
    const plansInMonth = await this.db.getPlansInMonth(yearMonth);
    copyPlans[yearMonth] = {};
    for (let i = 1; i <= endIndex; i++) {
      const day = i < 10 ? `0${i}` : `${i}`;
      if (day in plansInMonth) {
        copyPlans[yearMonth][day] = plansInMonth[day];
      } else {
        copyPlans[yearMonth][day] = [];
      }
    }
    this.plans = copyPlans;
  };

  @action
  async addDays() {
    this.loadingStore$.setLoading(true);
    await this.addMonth();
    const addingDays = [];
    const year = new Date().getFullYear();
    const endIndex = daysInMonth(this.nextMonth + 1, year);
    for (let i = 1; i <= endIndex; i++) {
      const day = i < 10 ? `0${i}` : `${i}`;
      const date = new Date(year, this.nextMonth, i + 1);
      const month = processingDate.toYearMont(date);
      const elementToAdd = {
        date,
        isSelected:
          processingDate.getDateWithoutHour(date) ===
          processingDate.getDateWithoutHour(this.selected),
        importance: {
          isNotImportant: Object.values(this.plans[month][day]).some(
            (e) => e.importance.value === importance[0].value
          ),
          isImportant: Object.values(this.plans[month][day]).some(
            (e) => e.importance.value === importance[1].value
          ),
          isVeryImportant: Object.values(this.plans[month][day]).some(
            (e) => e.importance.value === importance[2].value
          ),
        },
      };
      if (day == 21) {
        console.log(elementToAdd.importance);
      }
      addingDays.push(elementToAdd);
    }
    console.log(addingDays);

    this.incNextMonth();
    this.setDays(this.getDays.concat(addingDays));
    this.loadingStore$.setLoading(false);
  }

  @action
  setSelected(day) {
    this.days = this.days.map((e) => {
      if (
        processingDate.getDateWithoutHour(e.date) ===
        processingDate.getDateWithoutHour(day)
      ) {
        return { ...e, isSelected: true };
      } else {
        return { ...e, isSelected: false };
      }
    });
    console.log(day);
    this.selected = day;
  }

  get getPlans() {
    return { ...this.plans };
  }

  get getDays() {
    return [...this.days];
  }

  @action
  setPlans(newPlans) {
    this.plans = newPlans;
  }
  @action
  async updatePlan(plan) {
    await this.db.updateRecord(plan);
    const day = processingDate.getDay(new Date(plan.date));
    const month = processingDate.toYearMont(new Date(plan.date));
    const newPlans = { ...this.plans };
    newPlans[month] = { ...newPlans[month] };
    newPlans[month][day] = this.plans[month][day].map((e) => {
      if (e.uid === plan.uid) {
        return plan;
      } else {
        return e;
      }
    });
    this.plans = newPlans;
  }

  @action
  setDays(newDays) {
    this.days = newDays;
  }
  @action incNextMonth() {
    this.nextMonth = this.nextMonth + 1;
  }
}
