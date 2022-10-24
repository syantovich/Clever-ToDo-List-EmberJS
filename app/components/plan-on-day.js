import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { processingDate } from '../data/processingDate';

export default class PlanOnDayComponent extends Component {
  @inject plansStore$;

  get infoPlan() {
    const month =
      this.plansStore$.plans[
        processingDate.toYearMont(this.plansStore$.selected)
      ];
    if (month) {
      return month[processingDate.getDay(this.plansStore$.selected)];
    } else {
      return [];
    }
  }

  changeIsFinished = (plan) => {
    const newPlan = { ...plan };
    newPlan.isFinished = !newPlan.isFinished;
    this.plansStore$.updatePlan(newPlan);
  };
}
