import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { processingDate } from '../data/processingDate';
import { tracked } from '@glimmer/tracking';

export default class PlanOnDayComponent extends Component {
  @inject plansStore$;

  @tracked isModalOpen = false;

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

  changeIsFinished = (plan, event) => {
    event.stopPropagation();
    const newPlan = { ...plan };
    newPlan.isFinished = !newPlan.isFinished;
    this.plansStore$.updatePlan(newPlan);
  };

  closeModal = () => {
    this.isModalOpen = false;
  };

  openModal = (plan) => {
    this.isModalOpen = plan;
  };
}
