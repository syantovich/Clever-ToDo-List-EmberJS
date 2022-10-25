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
        importance: this.getIsImportance(month, day),
      };
      addingDays.push(elementToAdd);
    }

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
  async deletePlan(date, uid) {
    await this.db.deletePlan(date, uid);
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));
    const newPlans = { ...this.plans };
    newPlans[month] = { ...newPlans[month] };
    newPlans[month][day] = this.plans[month][day].filter((e) => e.uid !== uid);
    this.plans = newPlans;
    this.updateImportance(date);
  }

  @action
  async addPlan(plan) {
    await this.db.addPlan(plan);
    const day = processingDate.getDay(new Date(plan.date));
    const month = processingDate.toYearMont(new Date(plan.date));
    const newPlans = { ...this.plans };
    if (month in newPlans) {
      newPlans[month] = { ...newPlans[month] };
    } else {
      newPlans[month] = {};
    }
    if (newPlans[month][day]) {
      newPlans[month][day].push(plan);
    } else {
      newPlans[month][day] = [plan];
    }
    this.updateImportance(plan.date);

    this.plans = newPlans;
  }
  @action
  async updatePlan(plan, oldDate) {
    if (oldDate !== plan.date && oldDate) {
      await this.deletePlan(oldDate, plan.uid);
      this.addPlan(plan);
    } else {
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
      this.updateImportance(plan.date);
      this.plans = newPlans;
    }
  }

  @action
  setDays(newDays) {
    this.days = newDays;
  }
  @action incNextMonth() {
    this.nextMonth = this.nextMonth + 1;
  }

  @action
  getIsImportance(month, day) {
    const result = {
      isNotImportant: Object.values(this.plans[month][day]).some(
        (e) => e.importance.value === importance[0].value
      ),
      isImportant: Object.values(this.plans[month][day]).some(
        (e) => e.importance.value === importance[1].value
      ),
      isVeryImportant: Object.values(this.plans[month][day]).some(
        (e) => e.importance.value === importance[2].value
      ),
    };
    return result;
  }

  @action
  updateImportance(date) {
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));
    try {
      this.days = this.days.map((e) => {
        if (processingDate.getDateWithoutHour(e.date) === date) {
          const importance = this.getIsImportance(month, day);
          return { ...e, importance };
        } else {
          return e;
        }
      });
    } catch (e) {
      console.log(e, 'тут ошибка');
    }
  }

  @action
  async submit(data) {
    try {
      if (data.attrs?.isUpdate) {
        await this.updatePlan(data, data.default.date);
      } else {
        await this.addPlan(data);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
